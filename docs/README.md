# Glutbibliothek

Lese-App als Web-App für den Home-Bildschirm (PWA): Regal für Bücher, Zeitschriften und Zeitungen,
Originalseiten mit Fingerzoom, Markierungen, Notizen und Lesestand. Läuft nach dem ersten Öffnen offline.

- Live: https://glutbibliothek.vercel.app (Vercel-Projekt `glutbibliothek`, Team lees-projects). Statische Seite, kein Build nötig.
- Neu veröffentlichen: `python3 scripts/deploy-glut-vercel.py` (Token kommt aus der Umgebung oder `VERCEL_TOKEN`).
- Daten (Lesestände, Notizen, Markierungen, eigene Texte) liegen lokal auf dem Gerät.
- Bei neuen Versionen `VERSION` in `sw.js` hochzählen, damit Geräte die neuen Dateien laden.
- Bücher kommen vom Gerät: PDF (gespeichert in IndexedDB, gezeichnet mit pdf.js 3.11.174 in `vendor/pdfjs`, Apache-2.0) oder Text.
- „Backup exportieren“ schreibt alles (inklusive PDFs) in eine JSON-Datei; „Backup laden“ stellt sie wieder her.
