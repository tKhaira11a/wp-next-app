# WordPress + Next.js Headless Stack

A fully automated Docker setup combining a headless WordPress backend, Next.js frontend, and fully integrated Gutenberg Blocks for content management.

## 🏗️ Architecture

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

## 📁 Project Structure

```
.
├── docker-compose.yml          # Main Docker Compose with build Dockerfile
├── docker-compose.simple.yml   # Alternative with volume mounts (no build)
├── WordPress.Dockerfile        # WordPress image with plugin builds
├── build.sh                    # Master build & deploy script
├── deploy.sh                   # Simplified deploy script
├── Makefile                    # Make commands for easy control
├── LICENSE                     # GPL-3.0 license
├── .env.example                # Example environment variables
├── .env                        # Your local configuration (gitignored)
├── scripts/
│   ├── docker-entrypoint-wp.sh # WordPress custom entrypoint
│   ├── setup-wordpress.sh      # WordPress configuration script
│   └── wp-cli-setup.sh         # WP-CLI setup script
├── shared/                     # Shared files between containers
│   └── .env.nextjs             # Generated credentials for Next.js
├── headless/                   # WordPress headless theme
├── wp-next-app/                # Next.js application
├── nextpress_gb_element_plugin/    # Custom Gutenberg plugin
├── nextpress_contact_form_plugin/  # Custom contact form plugin
├── wp-graphql-jwt-authentication-develop/  # JWT auth plugin (third-party, GPL-3.0)
└── examples/
    └── headless-theme-example/ # Example headless theme
```

**IMPORTANT:** Plugin, theme, and Next.js app directories contain only READMEs.
You must copy your existing files into these directories!

## 🚀 Quick Start

### 1. Preparation

```bash
# Clone/extract repository
cd wp-next-app

# Create environment variables
cp .env.example .env
```

### 2. Copy Your Files

**IMPORTANT:** Copy your existing project files into the corresponding directories:

```bash
# Next.js app
cp -r /path/to/your-next-app/* ./wp-next-app/

# Custom plugins
cp -r /path/to/nextpress_gb_element_plugin/* ./nextpress_gb_element_plugin/
cp -r /path/to/nextpress_contact_form_plugin/* ./nextpress_contact_form_plugin/

# Third-party plugin (JWT Authentication)
cp -r /path/to/wp-graphql-jwt-authentication-develop/* ./wp-graphql-jwt-authentication-develop/

# Headless theme
cp -r /path/to/headless-theme/* ./headless/
```

### 3. Adjust Configuration (Optional)

Edit `.env` and customize values:

```env
# Important settings
WP_ADMIN_USER=admin
WP_ADMIN_EMAIL=admin@yourdomain.com
WP_SITE_URL=http://localhost:8888
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Secrets are auto-generated if empty
HEADLESS_SECRET=
GRAPHQL_JWT_SECRET=
```

### 4. Build & Deploy

```bash
# Make executable
chmod +x build.sh

# Build and start everything
./build.sh build
```

The script automatically performs the following steps:

1. ✅ Generates missing secrets
2. ✅ Builds WordPress image (including plugin builds)
3. ✅ Starts MariaDB and waits for healthcheck
4. ✅ Starts WordPress and waits for healthcheck
5. ✅ Installs WordPress (core, plugins, theme)
6. ✅ Creates app user with application password
7. ✅ Configures permalinks and GraphQL
8. ✅ Creates 404 page
9. ✅ Exports credentials for Next.js
10. ✅ Builds and starts Next.js with correct credentials

## 📋 Available Commands

```bash
./build.sh build     # Full build (default)
./build.sh start     # Start existing services
./build.sh stop      # Stop all services
./build.sh restart   # Restart all services
./build.sh cleanup   # Remove everything (containers, volumes, generated files)
./build.sh logs      # Show logs of all services
./build.sh status    # Show status of all services
./build.sh help      # Show help
```

## 🔌 Installed Plugins

### From WordPress Plugin Store
- **WP GraphQL** (`wp-graphql`) - GraphQL API for WordPress
- **WP GraphQL IDE** (`wp-graphql-ide`) - GraphQL IDE in admin
- **Add WPGraphQL SEO** (`add-wpgraphql-seo`) - SEO data via GraphQL
- **Redirection** (`redirection`) - URL redirects
- **Yoast SEO** (`wordpress-seo`) - SEO management

### Custom Plugins (compiled during build)
- **NextPress GB Components** (`nextpress_gb_element_plugin`) - Custom Gutenberg blocks
- **NextPress Contact Form** (`nextpress_contact_form_plugin`) - Contact form elements

### Third-Party Plugins (included in repository)
- **WP GraphQL JWT Authentication** (`wp-graphql-jwt-authentication-develop`) - JWT auth for GraphQL
  - Source: https://github.com/wp-graphql/wp-graphql-jwt-authentication
  - License: GPL-3.0
  - No build step required

## ⚙️ WordPress Configuration

The setup automatically configures:

### wp-config.php Additions
```php
define('HEADLESS_SECRET', '...');
define('HEADLESS_URL', 'http://localhost:3000');
define('GRAPHQL_JWT_AUTH_SECRET_KEY', '...');
define('GRAPHQL_JWT_AUTH_CORS_ENABLE', true);
define('WP_HOME', 'http://localhost:3000');  // After Next.js start
```

### Permalink Structure
```
/%postname%/
```

### GraphQL Settings
- ✅ Public introspection enabled
- ✅ GraphQL tracing enabled
- ✅ Batch queries enabled

## 🔐 Generated Credentials

After build, find all credentials in:

- **Main configuration**: `.env`
- **Next.js environment**: `shared/.env.nextjs`

Example `shared/.env.nextjs`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=localhost
HEADLESS_SECRET=abc123...
WP_USER=NextApp-User
WP_APP_PASS=xxxx xxxx xxxx xxxx xxxx xxxx
NOT_FOUND_ID=42
```

## 🌐 Access

After successful build:

| Service | URL |
|---------|-----|
| Next.js Frontend | http://localhost:3000 |
| WordPress Admin | http://localhost:8888/wp-admin |
| GraphQL Endpoint | http://localhost:8888/graphql |
| GraphQL IDE | http://localhost:8888/wp-admin/admin.php?page=graphql-ide |

## 🔧 Troubleshooting

### WordPress Won't Start
```bash
# Check logs
docker compose logs wordpress

# Restart container
docker compose restart wordpress
```

### Next.js Build Fails
```bash
# Check if credentials were generated
cat shared/.env.nextjs

# Is WordPress reachable?
curl http://localhost:8888/graphql
```

### Plugins Not Activated
```bash
# Connect to WordPress container
docker compose exec wordpress bash

# Use WP-CLI
wp plugin list --allow-root
wp plugin activate <plugin-name> --allow-root
```

### Database Connection Failed
```bash
# Check MariaDB status
docker compose logs mariadb

# Connect manually
docker compose exec mariadb mysql -uroot -p
```

## 🏭 Production

For production deployments:

1. Change passwords in `.env`
2. Set real domain URLs
3. Enable SSL/HTTPS
4. Use external database
5. Configure reverse proxy (nginx/traefik)

Example `.env` for production:
```env
WP_SITE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
HEADLESS_URL=https://yourdomain.com
```

## 📦 Third-Party Dependencies

This project uses open-source components with various licenses:

### WordPress & Plugins (GPL-2.0+)
- WordPress Core
- WP GraphQL and related plugins
- Yoast SEO
- Redirection

### JavaScript/Node.js (see package.json)
- React, Next.js (MIT)
- WordPress Gutenberg Packages (@wordpress/*) (GPL-2.0+)
- Radix UI Components (MIT)
- Additional npm packages under MIT and other open-source licenses

A complete list of all dependencies can be found in:
- `wp-next-app/package.json` (Next.js frontend)
- `nextpress_gb_element_plugin/package.json` (Gutenberg plugin)
- `nextpress_contact_form_plugin/package.json` (Contact form plugin)

## 📝 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### License Summary

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

### Third-Party Components

This software includes third-party open-source components. Each component's license is preserved in its respective directory or package.json file. The GPL-3.0 license of this project applies to the original code written by the author.

## 👤 Author

**Tarik Khairalla (khairalla-code)**
- Website: https://khairalla-code.com
- GitHub: https://github.com/tKhaira11a/wp-next-app-complete-.git

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk.
