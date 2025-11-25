# NextPress GB Components Plugin

Dieses Verzeichnis enthält das NextPress Gutenberg Components Plugin.

## Hinweis

Kopiere dein Plugin hierher:

```bash
cp -r /pfad/zu/nextpress_gb_element_plugin/* ./nextpress_gb_element_plugin/
```

## Build

Das Plugin wird automatisch während des Docker-Builds gebaut:

```bash
npm ci
npm run build
```

## Wichtig

Die `package.json` sollte folgende Scripts enthalten:
- `build` - Kompiliert die Gutenberg-Blöcke
