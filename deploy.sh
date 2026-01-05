#!/bin/bash
set -e

# ============================================
# Simple Deploy Script
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================"
echo "WordPress + Next.js Headless Stack"
echo "Simple Deploy"
echo "============================================"

# Create .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    
    # Generate random passwords
    sed -i "s/your_root_password_here/$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')/" .env
    sed -i "s/your_db_password_here/$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')/" .env
    sed -i "s/your_admin_password_here/$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')/" .env
    sed -i "s/your_app_user_password_here/$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')/" .env
    
    echo "Generated random passwords in .env"
fi

# Create shared directory
mkdir -p shared

# Step 1: Start database
echo ""
echo "Step 1: Starting MariaDB..."
docker compose up -d mariadb
echo "Waiting for MariaDB to be healthy..."
sleep 10

# Wait for healthy
until docker compose exec mariadb healthcheck.sh --connect 2>/dev/null; do
    echo "  Waiting for MariaDB..."
    sleep 3
done
echo "MariaDB is ready!"

# Step 2: Start WordPress
echo ""
echo "Step 2: Starting WordPress..."
docker compose up -d wordpress
echo "Waiting for WordPress to be healthy..."
sleep 15

# Wait for healthy
attempt=0
max_attempts=60
while ! docker compose exec wordpress curl -sf http://localhost/wp-admin/install.php >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "WordPress did not become healthy in time"
        docker compose logs wordpress
        exit 1
    fi
    echo "  Waiting for WordPress... ($attempt/$max_attempts)"
    sleep 3
done
echo "WordPress is ready!"

# Step 3: Run setup
echo ""
echo "Step 3: Running WordPress setup..."
docker compose up wordpress-init

# Check if env file was created
if [ ! -f shared/.env.nextjs ]; then
    echo "Error: .env.nextjs was not created"
    exit 1
fi

echo ""
echo "Generated credentials:"
cat shared/.env.nextjs

# Step 4: Build and start Next.js (optional)
echo ""
echo "Step 4: Building and starting Next.js..."
read -p "Do you want to build and start Next.js now? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Source the generated env
    source shared/.env.nextjs
    
    # Build and start
    docker compose --profile with-nextjs up -d --build nextjs
    
    echo ""
    echo "Next.js is starting..."
    sleep 5
fi

# Print final info
echo ""
echo "============================================"
echo "Deployment Complete!"
echo "============================================"
echo ""
echo "Services:"
docker compose ps
echo ""
echo "Access URLs:"
source .env 2>/dev/null || true
echo "  WordPress Admin: http://localhost:${WP_PORT:-8888}/wp-admin"
echo "  GraphQL: http://localhost:${WP_PORT:-8888}/graphql"
echo "  Next.js: http://localhost:${NEXTJS_PORT:-3000}"
echo ""
echo "Credentials saved in: shared/.env.nextjs"
echo "============================================"

