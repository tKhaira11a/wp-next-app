#!/bin/sh

set -e

# ============================================
# WP-CLI Setup Script
# Runs inside wordpress:cli container
# ============================================

WP_PATH="/var/www/html"
SHARED_DIR="/shared"

echo "=========================================="
echo "WordPress CLI Setup"
echo "=========================================="

# Wait for WordPress files
wait_for_wp() {
    echo "Waiting for WordPress files..."
    max_attempts=60
    attempt=0
    
    while [ ! -f "$WP_PATH/wp-includes/version.php" ]; do
        attempt=$((attempt + 1))
        if [ $attempt -ge $max_attempts ]; then
            echo "Timeout waiting for WordPress files"
            exit 1
        fi
        echo "  Waiting... ($attempt/$max_attempts)"
        sleep 2
    done
    echo "WordPress files ready!"
}

# Install WordPress
install_wp() {
    if wp core is-installed --path="$WP_PATH" 2>/dev/null; then
        echo "WordPress already installed"
        return 0
    fi
    
    echo "Installing WordPress..."
    wp core install \
        --path="$WP_PATH" \
        --url="${WP_SITE_URL:-http://localhost:8888}" \
        --title="${WP_SITE_TITLE:-Headless WordPress}" \
        --admin_user="${WP_ADMIN_USER:-admin}" \
        --admin_password="${WP_ADMIN_PASSWORD:-admin123}" \
        --admin_email="${WP_ADMIN_EMAIL:-admin@localhost}" \
        --skip-email
    
    echo "WordPress installed!"
}

# Install plugins
install_plugins() {
    echo "Installing plugins from WordPress.org..."
    
    plugins="wp-graphql wp-graphql-ide add-wpgraphql-seo redirection wordpress-seo"
    
    for plugin in $plugins; do
        echo "  Installing: $plugin"
        wp plugin install "$plugin" --activate --path="$WP_PATH" 2>/dev/null || true
    done
    
    echo "Activating custom plugins..."
    # Plugin-Ordnernamen (wie sie im wp-content/plugins/ Verzeichnis liegen)
    custom_plugins="nextpress_gb_element_plugin nextpress_contact_form_plugin wp-graphql-jwt-authentication"
    
    for plugin in $custom_plugins; do
        echo "  Activating: $plugin"
        wp plugin activate "$plugin" --path="$WP_PATH" 2>/dev/null || true
    done
}

# Activate theme
activate_theme() {
    echo "Activating headless theme..."
    wp theme activate headless --path="$WP_PATH" 2>/dev/null || true
}

# Configure WordPress
configure_wp() {
    echo "Configuring WordPress..."
    
    # Permalinks
    wp rewrite structure '/%postname%/' --hard --path="$WP_PATH"
    wp rewrite flush --hard --path="$WP_PATH"
    
    # Timezone
    wp option update timezone_string "Europe/Berlin" --path="$WP_PATH" 2>/dev/null || true
}

# Create App User
create_app_user() {
    echo "Creating App User..."
    
    local app_user="${APP_USER_NAME:-NextApp-User}"
    local app_email="${APP_USER_EMAIL:-nextapp@localhost}"
    
    # Get or create user
    user_id=$(wp user get "$app_user" --field=ID --path="$WP_PATH" 2>/dev/null || echo "")
    
    if [ -z "$user_id" ]; then
        user_id=$(wp user create "$app_user" "$app_email" \
            --role=administrator \
            --porcelain \
            --path="$WP_PATH")
        echo "  User created with ID: $user_id"
    else
        echo "  User exists with ID: $user_id"
    fi
    
    # Create application password
    app_pass=$(wp user application-password create "$user_id" "NextJS-App" \
        --porcelain \
        --path="$WP_PATH" 2>/dev/null || echo "")
    
    if [ -z "$app_pass" ]; then
        # Fallback: generate random password
        app_pass=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1)
    fi
    
    echo "  Application password created"
    
    # Export for later use
    export APP_USER_ID="$user_id"
    export APP_PASS="$app_pass"
}

# Create 404 page
create_404_page() {
    echo "Creating 404 page..."
    
    page_id=$(wp post list --post_type=page --name="404-not-found" --field=ID --path="$WP_PATH" 2>/dev/null || echo "")
    
    if [ -z "$page_id" ]; then
        page_id=$(wp post create \
            --post_type=page \
            --post_title="404 - Page Not Found" \
            --post_name="404-not-found" \
            --post_status=publish \
            --porcelain \
            --path="$WP_PATH")
        echo "  404 page created with ID: $page_id"
    else
        echo "  404 page exists with ID: $page_id"
    fi
    
    export NOT_FOUND_PAGE_ID="$page_id"
}

# Configure wp-config.php
configure_wp_config() {
    echo "Configuring wp-config.php..."
    
    # Generate secrets if not provided
    local headless_secret="${HEADLESS_SECRET:-$(openssl rand -hex 20 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 40 | head -n 1)}"
    local jwt_secret="${GRAPHQL_JWT_SECRET:-$(openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)}"
    local headless_url="${HEADLESS_URL:-http://localhost:3000}"
    
    # Add constants to wp-config.php
    wp config set HEADLESS_SECRET "$headless_secret" --type=constant --path="$WP_PATH" 2>/dev/null || true
    wp config set HEADLESS_URL "$headless_url" --type=constant --path="$WP_PATH" 2>/dev/null || true
    wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "$jwt_secret" --type=constant --path="$WP_PATH" 2>/dev/null || true
    wp config set GRAPHQL_JWT_AUTH_CORS_ENABLE true --raw --type=constant --path="$WP_PATH" 2>/dev/null || true
    
    export FINAL_HEADLESS_SECRET="$headless_secret"
    export FINAL_JWT_SECRET="$jwt_secret"
    
    echo "  wp-config.php configured"
}

# Generate Next.js env file
generate_env_file() {
    echo "Generating .env.nextjs..."
    
    mkdir -p "$SHARED_DIR"
    
    local wp_url="${WP_SITE_URL:-http://localhost:8888}"
    local wp_hostname=$(echo "$wp_url" | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|:.*$||')
    local headless_url="${HEADLESS_URL:-http://localhost:3000}"
    
    cat > "$SHARED_DIR/.env.nextjs" << EOF
# Generated by WordPress Setup Script
# $(date)

NEXT_PUBLIC_BASE_URL=${headless_url}
NEXT_PUBLIC_WORDPRESS_API_URL=${wp_url}
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=${wp_hostname}
HEADLESS_SECRET=${FINAL_HEADLESS_SECRET}
WP_USER=${APP_USER_NAME:-NextApp-User}
WP_APP_PASS=${APP_PASS}
NOT_FOUND_ID=${NOT_FOUND_PAGE_ID}
EOF
    
    echo "  Saved to $SHARED_DIR/.env.nextjs"
}

# Print summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "Setup Complete!"
    echo "=========================================="
    echo ""
    echo "WordPress Admin:"
    echo "  URL: ${WP_SITE_URL:-http://localhost:8888}/wp-admin"
    echo "  User: ${WP_ADMIN_USER:-admin}"
    echo "  Pass: ${WP_ADMIN_PASSWORD:-admin123}"
    echo ""
    echo "App User:"
    echo "  User: ${APP_USER_NAME:-NextApp-User}"
    echo "  App Pass: ${APP_PASS}"
    echo ""
    echo "404 Page ID: ${NOT_FOUND_PAGE_ID}"
    echo ""
    echo "Next.js Environment:"
    cat "$SHARED_DIR/.env.nextjs"
    echo ""
    echo "=========================================="
}

# Main
main() {
    wait_for_wp
    install_wp
    install_plugins
    activate_theme
    configure_wp
    create_app_user
    create_404_page
    configure_wp_config
    generate_env_file
    print_summary
}

main
