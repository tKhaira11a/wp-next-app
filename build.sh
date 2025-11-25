#!/bin/bash
set -e

# ============================================
# Master Build & Deploy Script
# ============================================
# This script orchestrates the entire build process:
# 1. Generates secrets if not provided
# 2. Starts MariaDB and WordPress
# 3. Runs WordPress setup
# 4. Reads generated credentials
# 5. Builds and starts Next.js with correct credentials

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
SHARED_DIR="${SCRIPT_DIR}/shared"
NEXTJS_ENV="${SHARED_DIR}/.env.nextjs"

echo "============================================"
echo "WordPress + Next.js Headless Stack"
echo "Master Build Script"
echo "============================================"
echo ""

# --------------------------------------------
# Load or create environment
# --------------------------------------------
load_environment() {
    if [ ! -f "$ENV_FILE" ]; then
        echo "Creating .env file from .env.example..."
        if [ -f "${SCRIPT_DIR}/.env.example" ]; then
            cp "${SCRIPT_DIR}/.env.example" "$ENV_FILE"
        else
            echo "Error: .env.example not found!"
            exit 1
        fi
    fi
    
    # Source the environment file
    set -a
    source "$ENV_FILE"
    set +a
    
    echo "Environment loaded from $ENV_FILE"
}

# --------------------------------------------
# Generate secrets if not set
# --------------------------------------------
generate_secrets() {
    echo "Checking/generating secrets..."
    
    local updated=false
    
    # Generate DB_ROOT_PASSWORD if default or empty
    if [ -z "$DB_ROOT_PASSWORD" ] || [ "$DB_ROOT_PASSWORD" = "your_root_password_here" ]; then
        DB_ROOT_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
        sed -i "s|^DB_ROOT_PASSWORD=.*|DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD}|" "$ENV_FILE"
        updated=true
        echo "  Generated DB_ROOT_PASSWORD"
    fi
    
    # Generate DB_PASSWORD if default or empty
    if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your_db_password_here" ]; then
        DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
        sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|" "$ENV_FILE"
        updated=true
        echo "  Generated DB_PASSWORD"
    fi
    
    # Generate WP_ADMIN_PASSWORD if default or empty
    if [ -z "$WP_ADMIN_PASSWORD" ] || [ "$WP_ADMIN_PASSWORD" = "your_admin_password_here" ]; then
        WP_ADMIN_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
        sed -i "s|^WP_ADMIN_PASSWORD=.*|WP_ADMIN_PASSWORD=${WP_ADMIN_PASSWORD}|" "$ENV_FILE"
        updated=true
        echo "  Generated WP_ADMIN_PASSWORD"
    fi
    
    # Generate APP_USER_PASSWORD if default or empty
    if [ -z "$APP_USER_PASSWORD" ] || [ "$APP_USER_PASSWORD" = "your_app_user_password_here" ]; then
        APP_USER_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
        sed -i "s|^APP_USER_PASSWORD=.*|APP_USER_PASSWORD=${APP_USER_PASSWORD}|" "$ENV_FILE"
        updated=true
        echo "  Generated APP_USER_PASSWORD"
    fi
    
    # Generate HEADLESS_SECRET if empty
    if [ -z "$HEADLESS_SECRET" ]; then
        HEADLESS_SECRET=$(openssl rand -hex 20)
        sed -i "s|^HEADLESS_SECRET=.*|HEADLESS_SECRET=${HEADLESS_SECRET}|" "$ENV_FILE"
        updated=true
        echo "  Generated HEADLESS_SECRET"
    fi
    
    # Generate GRAPHQL_JWT_SECRET if empty
    if [ -z "$GRAPHQL_JWT_SECRET" ]; then
        GRAPHQL_JWT_SECRET=$(openssl rand -base64 32)
        sed -i "s|^GRAPHQL_JWT_SECRET=.*|GRAPHQL_JWT_SECRET=${GRAPHQL_JWT_SECRET}|" "$ENV_FILE"
        updated=true
        echo "  Generated GRAPHQL_JWT_SECRET"
    fi
    
    if [ "$updated" = true ]; then
        echo "Secrets generated and saved to $ENV_FILE"
        # Reload environment
        set -a
        source "$ENV_FILE"
        set +a
    else
        echo "All secrets already configured"
    fi
}

# --------------------------------------------
# Prepare shared directory
# --------------------------------------------
prepare_shared() {
    echo "Preparing shared directory..."
    mkdir -p "$SHARED_DIR"
    # Clear old env file
    > "$NEXTJS_ENV"
    echo "Shared directory ready: $SHARED_DIR"
}

# --------------------------------------------
# Build and start database + WordPress
# --------------------------------------------
start_wordpress_stack() {
    echo ""
    echo "============================================"
    echo "Starting Database and WordPress..."
    echo "============================================"
    
    # Build WordPress image (includes plugin building)
    echo "Building WordPress image (this may take a while for plugin builds)..."
    docker compose build wordpress
    
    # Start MariaDB
    echo "Starting MariaDB..."
    docker compose up -d mariadb
    
    # Wait for MariaDB to be healthy
    echo "Waiting for MariaDB to be healthy..."
    local max_attempts=60
    local attempt=0
    while ! docker compose exec mariadb healthcheck.sh --connect --innodb_initialized 2>/dev/null; do
        attempt=$((attempt + 1))
        if [ $attempt -ge $max_attempts ]; then
            echo "Error: MariaDB did not become healthy"
            docker compose logs mariadb
            exit 1
        fi
        echo "  Waiting for MariaDB... ($attempt/$max_attempts)"
        sleep 2
    done
    echo "MariaDB is healthy!"
    
    # Start WordPress
    echo "Starting WordPress..."
    docker compose up -d wordpress
    
    # Wait for WordPress to be healthy
    echo "Waiting for WordPress to be healthy..."
    max_attempts=120
    attempt=0
    while ! docker compose ps wordpress | grep -q "healthy"; do
        attempt=$((attempt + 1))
        if [ $attempt -ge $max_attempts ]; then
            echo "Error: WordPress did not become healthy"
            docker compose logs wordpress
            exit 1
        fi
        echo "  Waiting for WordPress... ($attempt/$max_attempts)"
        sleep 3
    done
    echo "WordPress is healthy!"
}

# --------------------------------------------
# Run WordPress setup
# --------------------------------------------
run_wordpress_setup() {
    echo ""
    echo "============================================"
    echo "Running WordPress Headless Setup..."
    echo "============================================"
    
    # Run the setup container
    docker compose up wordpress-setup
    
    # Check if setup was successful
    if [ ! -f "$NEXTJS_ENV" ] || [ ! -s "$NEXTJS_ENV" ]; then
        echo "Error: WordPress setup did not generate credentials"
        exit 1
    fi
    
    echo "WordPress setup completed successfully!"
    echo ""
    echo "Generated credentials:"
    cat "$NEXTJS_ENV"
}

# --------------------------------------------
# Read generated credentials
# --------------------------------------------
read_credentials() {
    echo ""
    echo "============================================"
    echo "Reading generated credentials..."
    echo "============================================"
    
    if [ ! -f "$NEXTJS_ENV" ]; then
        echo "Error: Credentials file not found: $NEXTJS_ENV"
        exit 1
    fi
    
    # Source the generated credentials
    set -a
    source "$NEXTJS_ENV"
    set +a
    
    echo "Credentials loaded:"
    echo "  WP_USER: $WP_USER"
    echo "  WP_APP_PASS: ${WP_APP_PASS:0:8}..."
    echo "  NOT_FOUND_ID: $NOT_FOUND_ID"
    echo "  HEADLESS_SECRET: ${HEADLESS_SECRET:0:8}..."
}

# --------------------------------------------
# Build and start Next.js
# --------------------------------------------
build_and_start_nextjs() {
    echo ""
    echo "============================================"
    echo "Building and Starting Next.js..."
    echo "============================================"
    
    # Read the credentials
    source "$NEXTJS_ENV"
    
    # Export all necessary variables for docker compose
    export NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL:-http://localhost:3000}"
    export NEXT_PUBLIC_WORDPRESS_API_URL="${NEXT_PUBLIC_WORDPRESS_API_URL:-http://localhost:8888}"
    export NEXT_PUBLIC_WORDPRESS_API_HOSTNAME="${NEXT_PUBLIC_WORDPRESS_API_HOSTNAME:-localhost}"
    export WP_APP_PASS
    export NOT_FOUND_ID
    
    # Für den Build muss die URL auf den WordPress Container zeigen!
    # Während des Builds ist localhost nicht erreichbar.
    local BUILD_WP_URL="http://wp-next-wordpress:80"
    
    echo "Building Next.js with credentials..."
    echo "  Note: Using $BUILD_WP_URL for GraphQL codegen during build"
    
    # Build mit Netzwerk-Zugriff auf WordPress
    # Wir verwenden docker build direkt mit --network flag
    DOCKER_BUILDKIT=0 docker build \
        --network wp-next-app_wp-next-network \
        --build-arg NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}" \
        --build-arg NEXT_PUBLIC_WORDPRESS_API_URL="${BUILD_WP_URL}" \
        --build-arg NEXT_PUBLIC_WORDPRESS_API_HOSTNAME="wp-next-wordpress" \
        --build-arg HEADLESS_SECRET="${HEADLESS_SECRET}" \
        --build-arg WP_USER="${WP_USER}" \
        --build-arg WP_APP_PASS="${WP_APP_PASS}" \
        --build-arg NOT_FOUND_ID="${NOT_FOUND_ID}" \
        --build-arg RESEND_API_KEY="${RESEND_API_KEY}" \
        -t wp-next-app-nextjs \
        -f ./wp-next-app/Dockerfile \
        ./wp-next-app
    
    echo "Starting Next.js..."
    # Starte den Container manuell mit den richtigen Runtime-Env-Vars
    docker run -d \
        --name wp-next-nextjs \
        --network wp-next-app_wp-next-network \
        -p "${NEXTJS_PORT:-3000}:3000" \
        -e NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}" \
        -e NEXT_PUBLIC_WORDPRESS_API_URL="${NEXT_PUBLIC_WORDPRESS_API_URL}" \
        -e NEXT_PUBLIC_WORDPRESS_API_HOSTNAME="${NEXT_PUBLIC_WORDPRESS_API_HOSTNAME}" \
        -e HEADLESS_SECRET="${HEADLESS_SECRET}" \
        -e WP_USER="${WP_USER}" \
        -e WP_APP_PASS="${WP_APP_PASS}" \
        -e NOT_FOUND_ID="${NOT_FOUND_ID}" \
        -e RESEND_API_KEY="${RESEND_API_KEY}" \
        --restart unless-stopped \
        wp-next-app-nextjs
    
    echo "Next.js started!"
}

# --------------------------------------------
# Update WordPress WP_HOME
# --------------------------------------------
update_wp_home() {
    echo ""
    echo "============================================"
    echo "Updating WordPress WP_HOME..."
    echo "============================================"
    
    local nextjs_url="${NEXT_PUBLIC_BASE_URL:-http://localhost:3000}"
    
    # Add WP_HOME to wp-config.php
    docker compose exec wordpress wp --allow-root eval "
        \$config_file = '/var/www/html/wp-config.php';
        \$content = file_get_contents(\$config_file);
        
        if (strpos(\$content, 'WP_HOME') === false) {
            \$home_line = \"define('WP_HOME', '${nextjs_url}');\\n\";
            \$content = str_replace(
                \"/* That's all, stop editing!\",
                \$home_line . \"/* That's all, stop editing!\",
                \$content
            );
            file_put_contents(\$config_file, \$content);
            echo 'WP_HOME added successfully';
        } else {
            echo 'WP_HOME already configured';
        }
    "
    
    echo "WordPress WP_HOME updated!"
}

# --------------------------------------------
# Print final status
# --------------------------------------------
print_status() {
    echo ""
    echo "============================================"
    echo "Deployment Complete!"
    echo "============================================"
    echo ""
    echo "Services running:"
    docker compose ps
    echo ""
    echo "Access URLs:"
    echo "  WordPress Admin: http://localhost:${WP_PORT:-8888}/wp-admin"
    echo "  WordPress GraphQL: http://localhost:${WP_PORT:-8888}/graphql"
    echo "  Next.js Frontend: http://localhost:${NEXTJS_PORT:-3000}"
    echo ""
    echo "WordPress Admin Credentials:"
    echo "  Username: ${WP_ADMIN_USER:-admin}"
    echo "  Password: ${WP_ADMIN_PASSWORD}"
    echo ""
    echo "App User Credentials (for API access):"
    echo "  Username: ${APP_USER_NAME:-NextApp-User}"
    echo "  App Password: ${WP_APP_PASS}"
    echo ""
    echo "Important IDs:"
    echo "  404 Page ID: ${NOT_FOUND_ID}"
    echo ""
    echo "All credentials are saved in:"
    echo "  Main config: ${ENV_FILE}"
    echo "  Next.js env: ${NEXTJS_ENV}"
    echo ""
    echo "============================================"
}

# --------------------------------------------
# Cleanup function
# --------------------------------------------
cleanup() {
    echo ""
    echo "Cleaning up..."
    docker compose down -v
    rm -rf "$SHARED_DIR"
    echo "Cleanup complete"
}

# --------------------------------------------
# Help function
# --------------------------------------------
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build     Build and start all services (default)"
    echo "  start     Start existing services"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  cleanup   Stop and remove all containers, volumes, and generated files"
    echo "  logs      Show logs from all services"
    echo "  status    Show status of all services"
    echo "  help      Show this help message"
    echo ""
}

# --------------------------------------------
# Main execution
# --------------------------------------------
main() {
    cd "$SCRIPT_DIR"
    
    case "${1:-build}" in
        build)
            load_environment
            generate_secrets
            prepare_shared
            start_wordpress_stack
            run_wordpress_setup
            read_credentials
            build_and_start_nextjs
            update_wp_home
            print_status
            ;;
        start)
            docker compose up -d
            ;;
        stop)
            docker compose down
            ;;
        restart)
            docker compose restart
            ;;
        cleanup)
            cleanup
            ;;
        logs)
            docker compose logs -f
            ;;
        status)
            docker compose ps
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
