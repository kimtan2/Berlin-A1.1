#!/usr/bin/env python3
"""Deploy the Glutbibliothek web app (folder docs/) to Vercel as a static production site.

Auth: in Claude Code cloud sessions the network proxy adds the saved Vercel token to every
request to api.vercel.com. Elsewhere, set VERCEL_TOKEN.
Usage: python3 scripts/deploy-glut-vercel.py
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


def files():
    out = []
    for d, _, names in os.walk(ROOT):
        for n in sorted(names):
            if n in SKIP:
                continue
            p = os.path.join(d, n)
            b = open(p, "rb").read()
            out.append((os.path.relpath(p, ROOT).replace(os.sep, "/"), b, hashlib.sha1(b).hexdigest()))
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

    fl = files()
    for name, b, sha in fl:
        st, res = call("POST", "/v2/files", raw=b, headers={"Content-Type": "application/octet-stream", "x-vercel-digest": sha, "Content-Length": str(len(b))})
        if st not in (200, 201):
            sys.exit(f"Upload fehlgeschlagen für {name} ({st}): {res}")
    print(f"{len(fl)} Dateien hochgeladen")

    body = {
        "name": PROJECT, "project": PROJECT, "target": "production",
        "files": [{"file": n, "sha": s, "size": len(b)} for n, b, s in fl],
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
