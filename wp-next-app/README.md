# Next.js Application

Dieses Verzeichnis enthält die Next.js Frontend-Anwendung.

## Hinweis

Kopiere deine bestehende Next.js App hierher:

```bash
cp -r /pfad/zu/wp-next-app/* ./wp-next-app/
```

## Voraussetzungen

Die App sollte folgende Dateien enthalten:
- `package.json`
- `Dockerfile` (für den Docker-Build)
- `codegen.ts` (für GraphQL Code-Generierung)

## Environment Variables

Die folgenden Umgebungsvariablen werden automatisch beim Build gesetzt:

| Variable | Beschreibung |
|----------|--------------|
| `NEXT_PUBLIC_BASE_URL` | URL der Next.js App |
| `NEXT_PUBLIC_WORDPRESS_API_URL` | URL der WordPress API |
| `NEXT_PUBLIC_WORDPRESS_API_HOSTNAME` | Hostname von WordPress |
| `HEADLESS_SECRET` | Secret für Preview-Funktion |
| `WP_USER` | App-User Username |
| `WP_APP_PASS` | Application Password |
| `NOT_FOUND_ID` | ID der 404-Seite |
| `RESEND_API_KEY` | API Key für Resend E-Mail-Service |

Diese werden aus `shared/.env.nextjs` und `.env` geladen.
