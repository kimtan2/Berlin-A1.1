# Glutbibliothek

Lese-App als Web-App für den Home-Bildschirm (PWA): Regal für Bücher, Zeitschriften und Zeitungen,
Originalseiten mit Fingerzoom, Markierungen, Notizen und Lesestand. Läuft nach dem ersten Öffnen offline.

- Statische Seite, kein Build nötig. Vercel: Root Directory `glut-bibliothek`, Framework „Other“.
- Daten (Lesestände, Notizen, Markierungen, eigene Texte) liegen lokal auf dem Gerät.
- Bei neuen Versionen `VERSION` in `sw.js` hochzählen, damit Geräte die neuen Dateien laden.
- Texte: gemeinfreie Ausgaben von Project Gutenberg und Wikisource.
