# WordPress + Next.js Headless Stack

Ein vollautomatisiertes Docker-Setup für eine Headless WordPress Instanz mit Next.js Frontend.

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Network                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   MariaDB    │  │  WordPress   │  │      Next.js         │  │
│  │   :3306      │──│    :8888     │──│       :3000          │  │
│  │              │  │   (Headless) │  │   (Frontend)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Projektstruktur

```
.
├── docker-compose.yml          # Haupt Docker Compose mit Build-Dockerfile
├── docker-compose.simple.yml   # Alternative mit Volume-Mounts (kein Build)
├── WordPress.Dockerfile        # WordPress Image mit Plugin-Builds
├── build.sh                    # Master Build & Deploy Script
├── deploy.sh                   # Vereinfachtes Deploy Script
├── Makefile                    # Make-Befehle für einfache Steuerung
├── .env.example                # Beispiel Umgebungsvariablen
├── .env                        # Deine lokale Konfiguration (gitignored)
├── scripts/
│   ├── docker-entrypoint-wp.sh # WordPress Custom Entrypoint
│   ├── setup-wordpress.sh      # WordPress Konfiguration Script
│   └── wp-cli-setup.sh         # WP-CLI Setup Script
├── shared/                     # Geteilte Dateien zwischen Containern
│   └── .env.nextjs             # Generierte Credentials für Next.js
├── headless/                   # DEIN Headless WordPress Theme (hier reinkopieren)
├── wp-next-app/                # DEINE Next.js Application (hier reinkopieren)
├── nextpress_gb_element_plugin/    # DEIN Custom Gutenberg Plugin (hier reinkopieren)
├── nextpress_contact_form_plugin/  # DEIN Custom Contact Form Plugin (hier reinkopieren)
├── wp-graphql-jwt-authentication-develop/  # JWT Auth Plugin (hier reinkopieren)
└── examples/
    └── headless-theme-example/ # Beispiel Headless Theme
```

**WICHTIG:** Die Verzeichnisse für deine Plugins, Theme und Next.js App sind leer/enthalten nur READMEs. 
Du musst deine bestehenden Dateien dort hineinkopieren!

## 🚀 Quick Start

### 1. Vorbereitung

```bash
# Repository/ZIP entpacken
cd wp-next-app

# Umgebungsvariablen erstellen
cp .env.example .env
```

### 2. Deine Dateien kopieren

**WICHTIG:** Kopiere deine bestehenden Projektdateien in die entsprechenden Verzeichnisse:

```bash
# Next.js App
cp -r /pfad/zu/wp-next-app/* ./wp-next-app/

# Plugins
cp -r /pfad/zu/nextpress_gb_element_plugin/* ./nextpress_gb_element_plugin/
cp -r /pfad/zu/nextpress_contact_form_plugin/* ./nextpress_contact_form_plugin/
cp -r /pfad/zu/wp-graphql-jwt-authentication-develop/* ./wp-graphql-jwt-authentication-develop/

# Headless Theme
cp -r /pfad/zu/headless/* ./headless/
```

### 3. Konfiguration anpassen (optional)

Bearbeite `.env` und passe die Werte an:

```env
# Wichtige Einstellungen
WP_ADMIN_USER=admin
WP_ADMIN_EMAIL=admin@yourdomain.com
WP_SITE_URL=http://localhost:8888
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Secrets werden automatisch generiert wenn leer
HEADLESS_SECRET=
GRAPHQL_JWT_SECRET=
```

### 3. Build & Deploy

```bash
# Ausführbar machen
chmod +x build.sh

# Alles bauen und starten
./build.sh build
```

Das Script führt automatisch folgende Schritte aus:

1. ✅ Generiert fehlende Secrets
2. ✅ Baut WordPress Image (inkl. Plugin-Builds)
3. ✅ Startet MariaDB und wartet auf Healthcheck
4. ✅ Startet WordPress und wartet auf Healthcheck
5. ✅ Installiert WordPress (Core, Plugins, Theme)
6. ✅ Erstellt App-User mit Application Password
7. ✅ Konfiguriert Permalinks und GraphQL
8. ✅ Erstellt 404-Seite
9. ✅ Exportiert Credentials für Next.js
10. ✅ Baut und startet Next.js mit korrekten Credentials

## 📋 Verfügbare Befehle

```bash
./build.sh build     # Vollständiger Build (Standard)
./build.sh start     # Bestehende Services starten
./build.sh stop      # Alle Services stoppen
./build.sh restart   # Alle Services neustarten
./build.sh cleanup   # Alles entfernen (Container, Volumes, generierte Dateien)
./build.sh logs      # Logs aller Services anzeigen
./build.sh status    # Status aller Services anzeigen
./build.sh help      # Hilfe anzeigen
```

## 🔌 Installierte Plugins

### Aus WordPress Plugin Store
- **WP GraphQL** (`wp-graphql`) - GraphQL API für WordPress
- **WP GraphQL IDE** (`wp-graphql-ide`) - GraphQL IDE im Admin
- **Add WPGraphQL SEO** (`add-wpgraphql-seo`) - SEO-Daten via GraphQL
- **Redirection** (`redirection`) - URL-Weiterleitungen
- **Yoast SEO** (`wordpress-seo`) - SEO Management

### Custom Plugins (werden während des Builds kompiliert)
- **NextPress GB Components** (`nextpress_gb_element_plugin`) - Custom Gutenberg Blocks
- **NextPress Contact Form** (`nextpress_contact_form_plugin`) - Kontaktformular Elemente
- **WP GraphQL JWT Authentication** (`wp-graphql-jwt-authentication`) - JWT Auth für GraphQL

## ⚙️ WordPress Konfiguration

Das Setup konfiguriert automatisch:

### wp-config.php Ergänzungen
```php
define('HEADLESS_SECRET', '...');
define('HEADLESS_URL', 'http://localhost:3000');
define('GRAPHQL_JWT_AUTH_SECRET_KEY', '...');
define('GRAPHQL_JWT_AUTH_CORS_ENABLE', true);
define('WP_HOME', 'http://localhost:3000');  // Nach Next.js Start
```

### Permalink-Struktur
```
/%postname%/
```

### GraphQL Einstellungen
- ✅ Public Introspection aktiviert
- ✅ GraphQL Tracing aktiviert
- ✅ Batch Queries aktiviert

## 🔐 Generierte Credentials

Nach dem Build findest du alle Credentials in:

- **Haupt-Konfiguration**: `.env`
- **Next.js Umgebung**: `shared/.env.nextjs`

Beispiel `shared/.env.nextjs`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=localhost
HEADLESS_SECRET=abc123...
WP_USER=NextApp-User
WP_APP_PASS=xxxx xxxx xxxx xxxx xxxx xxxx
NOT_FOUND_ID=42
```

## 🌐 Zugriff

Nach erfolgreichem Build:

| Service | URL |
|---------|-----|
| Next.js Frontend | http://localhost:3000 |
| WordPress Admin | http://localhost:8888/wp-admin |
| GraphQL Endpoint | http://localhost:8888/graphql |
| GraphQL IDE | http://localhost:8888/wp-admin/admin.php?page=graphql-ide |

## 🔧 Troubleshooting

### WordPress startet nicht
```bash
# Logs prüfen
docker compose logs wordpress

# Container neustarten
docker compose restart wordpress
```

### Next.js Build schlägt fehl
```bash
# Prüfen ob Credentials generiert wurden
cat shared/.env.nextjs

# WordPress erreichbar?
curl http://localhost:8888/graphql
```

### Plugins werden nicht aktiviert
```bash
# In WordPress Container verbinden
docker compose exec wordpress bash

# WP-CLI verwenden
wp plugin list --allow-root
wp plugin activate <plugin-name> --allow-root
```

### Datenbank-Verbindung fehlgeschlagen
```bash
# MariaDB Status prüfen
docker compose logs mariadb

# Manuell verbinden
docker compose exec mariadb mysql -uroot -p
```

## 🏭 Produktion

Für Produktions-Deployments:

1. Ändere Passwörter in `.env`
2. Setze echte Domain-URLs
3. Aktiviere SSL/HTTPS
4. Verwende externe Datenbank
5. Konfiguriere Reverse Proxy (nginx/traefik)

Beispiel `.env` für Produktion:
```env
WP_SITE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
HEADLESS_URL=https://yourdomain.com
```

## 📝 Lizenz

MIT License

## 👤 Autor

Tarik Khairalla
