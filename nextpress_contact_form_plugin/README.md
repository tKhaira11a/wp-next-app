# NextPress Contact Form Plugin

Dieses Verzeichnis enthält das NextPress Contact Form Plugin.

## Hinweis

Kopiere dein Plugin hierher:

```bash
cp -r /pfad/zu/nextpress_contact_form_plugin/* ./nextpress_contact_form_plugin/
```

## Build

Das Plugin wird automatisch während des Docker-Builds gebaut:

```bash
npm ci
npm run build
```

## Wichtig

Die `package.json` sollte folgende Scripts enthalten:
- `build` - Kompiliert das Plugin
