# Headless Theme

Dieses Verzeichnis enthält das Headless WordPress Theme.

## Hinweis

Kopiere dein bestehendes Headless Theme hierher:

```bash
cp -r /pfad/zu/deinem/headless/* ./headless/
```

Das Theme sollte mindestens folgende Dateien enthalten:
- `style.css` (mit Theme-Header)
- `index.php`
- `functions.php`
- `templates/nextpress.php`

Das Template ist wichtig, da nur Seiten mit diesem Template von der Next.js App ausgelesen werden

## Minimales Beispiel-Theme

Falls du noch kein Theme hast, kannst du das Beispiel-Theme aus 
`examples/headless-theme-example/` kopieren.
