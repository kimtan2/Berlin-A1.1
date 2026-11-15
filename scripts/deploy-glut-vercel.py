#!/usr/bin/env python3
"""Deploy the Glutbibliothek web app (folder docs/) to Vercel as a static production site.

Auth: in Claude Code cloud sessions the network proxy adds the saved Vercel token to every
request to api.vercel.com. Elsewhere, set VERCEL_TOKEN.
Usage: python3 scripts/deploy-glut-vercel.py

Personal copy: with GLUT_PRIVATE_DIR (a folder with token.txt, library.json and the book files, never
committed) the app is also published under p/<token>/ together with those books. Without it, the
personal copy of the live production deployment is carried over unchanged (its files stay on Vercel).
"""
import hashlib, json, os, sys, time, urllib.error, urllib.request

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs"))
API = "https://api.vercel.com"
TEAM = os.environ.get("VERCEL_TEAM_ID", "team_tzN6wIEnRA9gNU5mcdi5LliZ")
PROJECT = os.environ.get("VERCEL_PROJECT", "glutbibliothek")
TOKEN = os.environ.get("VERCEL_TOKEN", "proxy-injected")  # the proxy replaces this placeholder
SKIP = {"README.md", ".nojekyll", ".DS_Store"}


def call(method, path, body=None, raw=None, headers=None):
    sep = "&" if "?" in path else "?"
    url = f"{API}{path}{sep}teamId={TEAM}"
    h = {"Authorization": f"Bearer {TOKEN}"}
    data = raw
    if body is not None:
        data = json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    h.update(headers or {})
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                t = r.read()
                return r.status, (json.loads(t) if t else {})
        except urllib.error.HTTPError as e:
            t = e.read()
            try:
                return e.code, json.loads(t)
            except Exception:
                return e.code, {"raw": t[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt == 3:
                raise
            time.sleep(2 ** (attempt + 1))


def files(root=ROOT, skip=SKIP):
    out = []
    for d, _, names in os.walk(root):
        for n in sorted(names):
            if n in skip:
                continue
            p = os.path.join(d, n)
            b = open(p, "rb").read()
            out.append((os.path.relpath(p, root).replace(os.sep, "/"), b, hashlib.sha1(b).hexdigest()))
    return out


def walk_tree(nodes, prefix=""):
    for n in nodes or []:
        path = f"{prefix}{n.get('name')}"
        if n.get("type") == "directory":
            yield from walk_tree(n.get("children"), path + "/")
        else:
            yield path, n


def private_files(public):
    """Files of the personal copy: (path, bytes or None, sha, size)."""
    pdir = os.environ.get("GLUT_PRIVATE_DIR")
    if pdir:
        token = open(os.path.join(pdir, "token.txt")).read().strip()
        extra = files(pdir, SKIP | {"token.txt"})
        return [(f"p/{token}/{n}", b, sha, len(b)) for n, b, sha in public + extra]
    st, prj = call("GET", f"/v9/projects/{PROJECT}")
    dep = ((prj.get("targets") or {}).get("production") or {}).get("id") if st == 200 else None
    if not dep:
        return []
    st, tree = call("GET", f"/v6/deployments/{dep}/files")
    if st != 200:
        print("Hinweis: persönliche Kopie konnte nicht übernommen werden:", st)
        return []
    keep = []
    names = {n for n, _, _ in public}
    for path, node in walk_tree(tree):
        i = path.find("p/")
        if i < 0:
            continue
        rel = path[i:]
        parts = rel.split("/")
        if len(parts) >= 3 and "/".join(parts[2:]) not in names:
            keep.append((rel, None, node.get("uid"), node.get("size")))
    tokens = {k[0].split("/")[1] for k in keep}
    out = list(keep)
    for t in tokens:
        out += [(f"p/{t}/{n}", b, sha, len(b)) for n, b, sha in public]
    return out


def main():
    st, me = call("GET", "/v2/user")
    if st != 200:
        sys.exit(f"Vercel-Login fehlt oder ist ungültig ({st}): {me}")
    print("Angemeldet bei Vercel als:", me.get("user", {}).get("username"))

    st, prj = call("POST", "/v11/projects", {"name": PROJECT, "framework": None})
    if st not in (200, 201) and not (st == 409 or "already exist" in json.dumps(prj)):
        sys.exit(f"Projekt anlegen fehlgeschlagen ({st}): {prj}")
    # the app holds no private data: make every URL of this project public (no Vercel login wall)
    st, _ = call("PATCH", f"/v9/projects/{PROJECT}", {"ssoProtection": None})
    print("Projekt bereit:", PROJECT, "(öffentlich)" if st == 200 else f"(Schutz-Einstellung: {st})")

    pub = files()
    fl = [(n, b, sha, len(b)) for n, b, sha in pub] + private_files(pub)
    uploaded = set()
    for name, b, sha, size in fl:
        if b is None or sha in uploaded:
            continue
        st, res = call("POST", "/v2/files", raw=b, headers={"Content-Type": "application/octet-stream", "x-vercel-digest": sha, "Content-Length": str(len(b))})
        if st not in (200, 201):
            sys.exit(f"Upload fehlgeschlagen für {name} ({st}): {res}")
        uploaded.add(sha)
    priv = [n for n, *_ in fl if n.startswith("p/")]
    print(f"{len(uploaded)} Dateien hochgeladen, {len(fl)} im Deployment" + (f" (davon {len(priv)} in der persönlichen Kopie)" if priv else ""))

    body = {
        "name": PROJECT, "project": PROJECT, "target": "production",
        "files": [{k: v for k, v in (("file", n), ("sha", s), ("size", z)) if v is not None} for n, _, s, z in fl],
        "projectSettings": {"framework": None, "buildCommand": None, "installCommand": None, "outputDirectory": None, "devCommand": None},
    }
    st, dep = call("POST", "/v13/deployments?skipAutoDetectionConfirmation=1", body)
    if st not in (200, 201):
        sys.exit(f"Deployment fehlgeschlagen ({st}): {dep}")
    did = dep["id"]
    print("Deployment gestartet:", did)
    for _ in range(90):
        st, d = call("GET", f"/v13/deployments/{did}")
        state = d.get("readyState") or d.get("status")
        if state in ("READY", "ERROR", "CANCELED"):
            break
        time.sleep(3)
    print("Status:", state)
    if state != "READY":
        sys.exit(f"Deployment nicht bereit: {json.dumps(d)[:600]}")
    st, p = call("GET", f"/v9/projects/{PROJECT}")
    aliases = sorted(set((p.get("targets", {}).get("production", {}) or {}).get("alias", []) or []) | set(d.get("alias", []) or []), key=len)
    print("ADRESSE:", "https://" + (aliases[0] if aliases else d["url"]))
    for a in aliases[1:]:
        print("weitere Adresse: https://" + a)


if __name__ == "__main__":
    main()
