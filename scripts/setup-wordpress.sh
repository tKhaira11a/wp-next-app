#!/bin/bash
set -e

# ============================================
# WordPress Headless Setup Script
# ============================================
# This script runs after WordPress is healthy and:
# 1. Installs WordPress (if not already installed)
# 2. Configures wp-config.php for headless
# 3. Installs and activates all plugins
# 4. Creates the App User with Application Password
# 5. Sets up permalink structure
# 6. Configures GraphQL settings
# 7. Creates 404 page
# 8. Exports credentials for Next.js

echo "=========================================="
echo "WordPress Headless Setup Script"
echo "=========================================="

# Configuration from environment
WP_PATH="/var/www/html"
SHARED_DIR="/shared"
ENV_FILE="${SHARED_DIR}/.env.nextjs"

# Ensure shared directory exists
mkdir -p "$SHARED_DIR"

# Function to run WP-CLI commands
wp_cli() {
    wp --path="$WP_PATH" --allow-root "$@"
}

# Wait for WordPress to be fully available
wait_for_wordpress() {
    echo "Waiting for WordPress to be ready..."
    local max_attempts=120
    local attempt=0
    
    while ! wp_cli core is-installed 2>/dev/null; do
        attempt=$((attempt + 1))
        if [ $attempt -ge $max_attempts ]; then
            echo "WordPress not installed after $max_attempts attempts, will install now..."
            return 1
        fi
        
        # Check if WordPress files exist at all
        if [ ! -f "$WP_PATH/wp-config.php" ]; then
            echo "Waiting for WordPress files... ($attempt/$max_attempts)"
            sleep 2
            continue
        fi
        
        # WordPress files exist but not installed
        echo "WordPress files exist but not installed... ($attempt/$max_attempts)"
        return 1
    done
    
    echo "WordPress is ready!"
    return 0
}

# Wait for database
wait_for_database() {
    echo "Waiting for database connection..."
    local max_attempts=60
    local attempt=0
    
    while ! wp_cli db check 2>/dev/null; do
        attempt=$((attempt + 1))
        if [ $attempt -ge $max_attempts ]; then
            echo "Database not available after $max_attempts attempts"
            exit 1
        fi
        echo "Waiting for database... ($attempt/$max_attempts)"
        sleep 2
    done
    
    echo "Database is available!"
}

# Install WordPress if not installed
install_wordpress() {
    echo "Installing WordPress..."
    
    wp_cli core install \
        --url="${WP_SITE_URL:-http://localhost:8888}" \
        --title="${WP_SITE_TITLE:-Headless WordPress}" \
        --admin_user="${WP_ADMIN_USER:-admin}" \
        --admin_password="${WP_ADMIN_PASSWORD:-admin123}" \
        --admin_email="${WP_ADMIN_EMAIL:-admin@localhost}" \
        --skip-email
    
    echo "WordPress installed successfully!"
}

# Add headless configuration to wp-config.php
configure_wp_config() {
    echo "Configuring wp-config.php for headless setup..."
    
    local config_file="$WP_PATH/wp-config.php"
    
    # Check if already configured
    if grep -q "HEADLESS_SECRET" "$config_file" 2>/dev/null; then
        echo "wp-config.php already configured for headless"
        return 0
    fi
    
    # Generate secrets if not provided
    local headless_secret="${HEADLESS_SECRET:-$(openssl rand -hex 16)}"
    local jwt_secret="${GRAPHQL_JWT_SECRET:-$(openssl rand -base64 32)}"
    local headless_url="${HEADLESS_URL:-http://localhost:3000}"
    
    # Use WP-CLI to set constants (much safer than sed)
    echo "  Adding HEADLESS_SECRET..."
    wp_cli config set HEADLESS_SECRET "$headless_secret" --type=constant 2>/dev/null || true
    
    echo "  Adding HEADLESS_URL..."
    wp_cli config set HEADLESS_URL "$headless_url" --type=constant 2>/dev/null || true
    
    echo "  Adding GRAPHQL_JWT_AUTH_SECRET_KEY..."
    wp_cli config set GRAPHQL_JWT_AUTH_SECRET_KEY "$jwt_secret" --type=constant 2>/dev/null || true
    
    echo "  Adding GRAPHQL_JWT_AUTH_CORS_ENABLE..."
    wp_cli config set GRAPHQL_JWT_AUTH_CORS_ENABLE true --raw --type=constant 2>/dev/null || true
    
    echo "  Adding DISALLOW_FILE_EDIT..."
    wp_cli config set DISALLOW_FILE_EDIT true --raw --type=constant 2>/dev/null || true
    
    # Save secrets for Next.js
    echo "HEADLESS_SECRET=${headless_secret}" >> "$ENV_FILE"
    echo "GRAPHQL_JWT_SECRET=${jwt_secret}" >> "$ENV_FILE"
    
    echo "wp-config.php configured successfully!"
}

# Install plugins from WordPress.org
install_store_plugins() {
    echo "Installing plugins from WordPress.org..."
    
    # wp-graphql-ide wurde in wp-graphql integriert, daher nicht mehr separat nötig
    local plugins=(
        "wp-graphql"
        "add-wpgraphql-seo"
        "redirection"
        "wordpress-seo"
    )
    
    for plugin in "${plugins[@]}"; do
        echo "Installing plugin: $plugin"
        if ! wp_cli plugin is-installed "$plugin" 2>/dev/null; then
            wp_cli plugin install "$plugin" --activate || echo "Warning: Could not install $plugin"
        else
            wp_cli plugin activate "$plugin" 2>/dev/null || true
        fi
    done
    
    echo "Store plugins installed!"
}

# Activate custom plugins
activate_custom_plugins() {
    echo "Activating custom plugins..."
    
    # Plugin-Ordnernamen (wie sie im wp-content/plugins/ Verzeichnis liegen)
    local custom_plugins=(
        "nextpress_gb_element_plugin"
        "nextpress_contact_form_plugin"
        "wp-graphql-jwt-authentication"
    )
    
    for plugin in "${custom_plugins[@]}"; do
        echo "Activating plugin: $plugin"
        if wp_cli plugin is-installed "$plugin" 2>/dev/null; then
            wp_cli plugin activate "$plugin" 2>/dev/null || true
        else
            echo "Warning: Plugin $plugin not found"
        fi
    done
    
    echo "Custom plugins activated successfully!"
}

# ============================================
# NEU: Flush und Validierung des GraphQL-Schemas
# ============================================
flush_and_validate_graphql_schema() {
    echo "Flushing and validating GraphQL schema..."
    
    # 1. WordPress Objekt-Cache leeren
    echo "  Clearing object cache..."
    wp_cli cache flush 2>/dev/null || true
    
    # 2. Transients löschen (WPGraphQL cached Schema-Teile hier)
    echo "  Clearing transients..."
    wp_cli transient delete --all 2>/dev/null || true
    
    # 3. WPGraphQL Schema-Registry neu laden
    echo "  Refreshing WPGraphQL schema registry..."
    wp_cli eval "
        // Force WPGraphQL to rebuild schema
        if (function_exists('graphql_clear_schema_cache')) {
            graphql_clear_schema_cache();
            echo 'Schema cache cleared via graphql_clear_schema_cache()';
        }
        
        // Alternative: Delete the schema transient directly
        delete_transient('graphql_schema');
        delete_transient('graphql_schema_types');
        
        // Force autoload of all registered types
        if (class_exists('\WPGraphQL\Registry\TypeRegistry')) {
            do_action('graphql_register_types');
            echo ' | Types re-registered';
        }
    " 2>/dev/null || true
    
    # 4. Kurze Pause um sicherzustellen dass alles initialisiert ist
    echo "  Waiting for schema to stabilize..."
    sleep 3
    
    # 5. Validierung: Prüfe ob SEO-Feld im Schema vorhanden ist
    echo "  Validating SEO field in GraphQL schema..."
    
    local seo_check=$(wp_cli eval "
        // Führe eine introspection query aus
        if (!function_exists('graphql')) {
            echo 'ERROR: WPGraphQL not available';
            return;
        }
        
        \$query = '
            query IntrospectionQuery {
                __type(name: \"ContentNode\") {
                    fields {
                        name
                    }
                }
            }
        ';
        
        \$result = graphql(['query' => \$query]);
        
        if (isset(\$result['errors'])) {
            echo 'ERROR: ' . json_encode(\$result['errors']);
            return;
        }
        
        \$fields = \$result['data']['__type']['fields'] ?? [];
        \$field_names = array_column(\$fields, 'name');
        
        if (in_array('seo', \$field_names)) {
            echo 'SUCCESS: seo field found in ContentNode';
        } else {
            echo 'WARNING: seo field NOT found. Available fields: ' . implode(', ', \$field_names);
        }
    " 2>&1)
    
    echo "  Schema validation result: $seo_check"
    
    # Wenn SEO nicht gefunden, versuche Plugin-Aktivierung nochmal
    if [[ "$seo_check" == *"NOT found"* ]] || [[ "$seo_check" == *"ERROR"* ]]; then
        echo "  Attempting to fix SEO field issue..."
        
        # Deaktiviere und reaktiviere add-wpgraphql-seo
        wp_cli plugin deactivate add-wpgraphql-seo 2>/dev/null || true
        sleep 1
        wp_cli plugin activate add-wpgraphql-seo 2>/dev/null || true
        
        # Nochmal Cache leeren
        wp_cli cache flush 2>/dev/null || true
        wp_cli transient delete --all 2>/dev/null || true
        
        sleep 2
        
        # Nochmal prüfen
        local retry_check=$(wp_cli eval "
            if (!function_exists('graphql')) {
                echo 'ERROR: WPGraphQL not available';
                return;
            }
            
            \$query = '{ __type(name: \"ContentNode\") { fields { name } } }';
            \$result = graphql(['query' => \$query]);
            \$fields = \$result['data']['__type']['fields'] ?? [];
            \$field_names = array_column(\$fields, 'name');
            
            if (in_array('seo', \$field_names)) {
                echo 'SUCCESS';
            } else {
                echo 'FAILED';
            }
        " 2>&1)
        
        if [[ "$retry_check" == "SUCCESS" ]]; then
            echo "  SEO field now available after retry!"
        else
            echo "  WARNING: SEO field still not available. Build may fail."
            echo "  Check that 'Yoast SEO' and 'Add WPGraphQL SEO' are both active."
        fi
    fi
    
    echo "GraphQL schema validation complete!"
}

# Configure Redirection plugin (first-time setup)
configure_redirection() {
    echo "Configuring Redirection plugin..."
    
    # Redirection speichert seine Einstellungen in der Options-Tabelle
    # Bei der ersten Aktivierung muss die Datenbank-Tabelle erstellt werden
    wp_cli eval "
        // Prüfe ob Redirection aktiviert ist
        if (!function_exists('red_get_options')) {
            echo 'Redirection plugin not active';
            return;
        }
        
        // Hole aktuelle Optionen oder erstelle Defaults
        \$options = red_get_options();
        
        // Setze Standard-Optionen für Headless Setup
        \$options['support'] = false;
        \$options['token'] = md5(uniqid());
        \$options['auto_target'] = '';
        \$options['expire_redirect'] = 0;
        \$options['expire_404'] = 7;
        
        // Speichere Optionen
        update_option('redirection_options', \$options);
        
        // Erstelle Datenbank-Tabellen falls nicht vorhanden
        if (class_exists('Red_Database')) {
            \$database = new Red_Database();
            \$status = \$database->get_status();
            if (\$status !== 'good') {
                \$database->install();
            }
        }
        
        echo 'Redirection configured';
    " 2>/dev/null || echo "  Note: Redirection setup may need manual completion"
    
    echo "Redirection plugin configured!"
}

# Configure Yoast SEO plugin
configure_yoast_seo() {
    echo "Configuring Yoast SEO plugin..."
    
    # Disable XML Sitemaps (für Headless nicht nötig, Next.js generiert eigene)
    echo "  Disabling XML Sitemaps..."
    wp_cli option update wpseo '{
        "enable_xml_sitemap": false
    }' --format=json 2>/dev/null || true
    
    # Alternative Methode über einzelne Option
    wp_cli eval "
        \$options = get_option('wpseo', array());
        \$options['enable_xml_sitemap'] = false;
        update_option('wpseo', \$options);
    " 2>/dev/null || true
    
    # Disable WordPress Core Sitemaps auch
    wp_cli eval "
        // Deaktiviere WordPress Core Sitemaps
        add_filter('wp_sitemaps_enabled', '__return_false');
        
        // Speichere als persistente Option
        update_option('blog_public', 1); // Suchmaschinen erlauben
    " 2>/dev/null || true
    
    # Optimize SEO data (nach Permalink-Änderung empfohlen)
    echo "  Running SEO data optimization..."
    wp_cli eval "
        if (class_exists('WPSEO_Upgrade')) {
            // Trigger Reindex wenn verfügbar
            do_action('wpseo_reindex');
        }
    " 2>/dev/null || true
    
    # Create/Update robots.txt
    echo "  Configuring robots.txt..."
    wp_cli eval "
        // robots.txt Inhalt für Headless Setup
        \$robots_content = \"User-agent: *
Allow: /

# Sitemap (generiert von Next.js)
Sitemap: \" . rtrim(defined('HEADLESS_URL') ? HEADLESS_URL : home_url(), '/') . \"/sitemap.xml

# WordPress Admin blockieren
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

# API-Endpunkte erlauben
Allow: /graphql
Allow: /wp-json/
\";
        
        // Speichere in Yoast Option
        \$wpseo_options = get_option('wpseo', array());
        \$wpseo_options['baiduverify'] = ''; // Clear verification
        update_option('wpseo', \$wpseo_options);
        
        // Erstelle physische robots.txt falls möglich
        \$robots_file = ABSPATH . 'robots.txt';
        if (is_writable(ABSPATH)) {
            file_put_contents(\$robots_file, \$robots_content);
            echo 'robots.txt created';
        } else {
            echo 'robots.txt - ABSPATH not writable, using virtual';
        }
    " 2>/dev/null || true
    
    echo "Yoast SEO configured!"
}

# Activate headless theme
activate_headless_theme() {
    echo "Activating headless theme..."
    
    if wp_cli theme is-installed headless 2>/dev/null; then
        wp_cli theme activate headless
        echo "Headless theme activated!"
    else
        echo "Warning: Headless theme not found, using default theme"
    fi
}

# Create App User and Application Password
create_app_user() {
    echo "Creating App User for Next.js..."
    
    local app_user="${APP_USER_NAME:-NextApp-User}"
    local app_email="${APP_USER_EMAIL:-nextapp@localhost}"
    local app_password="${APP_USER_PASSWORD:-$(openssl rand -base64 12)}"
    
    # Check if user exists
    if wp_cli user get "$app_user" --field=ID 2>/dev/null; then
        echo "App user already exists"
        local user_id=$(wp_cli user get "$app_user" --field=ID)
    else
        # Create user
        echo "Creating user: $app_user"
        local user_id=$(wp_cli user create "$app_user" "$app_email" \
            --role=administrator \
            --user_pass="$app_password" \
            --porcelain)
        echo "User created with ID: $user_id"
    fi
    
    # Generate Application Password
    echo "Generating Application Password..."
    
    # Use WP-CLI to create application password
    local app_pass_result=$(wp_cli user application-password create "$user_id" "NextJS-App" --porcelain 2>/dev/null || echo "")
    
    if [ -z "$app_pass_result" ]; then
        # Alternative: Generate via PHP
        echo "Using alternative method to create application password..."
        app_pass_result=$(wp_cli eval "
            \$user_id = $user_id;
            \$app_name = 'NextJS-App';
            
            // Check if Application Passwords is available
            if (!class_exists('WP_Application_Passwords')) {
                require_once ABSPATH . 'wp-includes/class-wp-application-passwords.php';
            }
            
            // Delete existing app passwords with same name
            \$existing = WP_Application_Passwords::get_user_application_passwords(\$user_id);
            foreach (\$existing as \$item) {
                if (\$item['name'] === \$app_name) {
                    WP_Application_Passwords::delete_application_password(\$user_id, \$item['uuid']);
                }
            }
            
            // Create new application password
            \$result = WP_Application_Passwords::create_new_application_password(\$user_id, array('name' => \$app_name));
            
            if (is_wp_error(\$result)) {
                echo 'ERROR: ' . \$result->get_error_message();
            } else {
                echo \$result[0];
            }
        " 2>/dev/null)
    fi
    
    if [[ "$app_pass_result" == ERROR* ]]; then
        echo "Error creating application password: $app_pass_result"
        # Fallback: use user password
        app_pass_result="$app_password"
    fi
    
    # Format application password (add spaces every 4 characters for readability)
    local formatted_app_pass=$(echo "$app_pass_result" | sed 's/.\{4\}/& /g' | xargs)
    
    echo "Application Password created successfully!"
    
    # Save to environment file for Next.js
    # WICHTIG: Anführungszeichen für Werte mit Leerzeichen!
    echo "WP_USER=\"${app_user}\"" >> "$ENV_FILE"
    echo "WP_APP_PASS=\"${formatted_app_pass}\"" >> "$ENV_FILE"
    
    echo "App user credentials saved to $ENV_FILE"
}

# Configure permalink structure
configure_permalinks() {
    echo "Configuring permalink structure..."
    
    wp_cli rewrite structure '/%postname%/' --hard
    wp_cli rewrite flush --hard
    
    echo "Permalinks configured successfully!"
}

# Configure GraphQL settings
configure_graphql() {
    echo "Configuring GraphQL settings..."
    
    # Enable public introspection and other settings via options
    wp_cli option update graphql_general_settings '{
        "public_introspection_enabled": "on",
        "tracing_enabled": "on",
        "tracing_user_role": "administrator",
        "query_logs_enabled": "off",
        "batch_queries_enabled": "on",
        "batch_limit": "10"
    }' --format=json 2>/dev/null || true
    
    # Alternative: Set individual options
    wp_cli eval "
        // Enable Public Introspection
        update_option('graphql_general_settings', array_merge(
            get_option('graphql_general_settings', array()),
            array(
                'public_introspection_enabled' => 'on',
                'tracing_enabled' => 'on',
                'batch_queries_enabled' => 'on'
            )
        ));
    " 2>/dev/null || true
    
    echo "GraphQL configured successfully!"
}

# Create 404 page
create_404_page() {
    echo "Creating 404 Not Found page..."
    
    # Check if 404 page already exists
    local existing_page=$(wp_cli post list --post_type=page --name="404-not-found" --field=ID 2>/dev/null || echo "")
    
    if [ -n "$existing_page" ]; then
        echo "404 page already exists with ID: $existing_page"
        local page_id="$existing_page"
    else
        # Create the 404 page
        local page_id=$(wp_cli post create \
            --post_type=page \
            --post_title="404 - Page Not Found" \
            --post_name="404-not-found" \
            --post_content="<h1>Page Not Found</h1><p>The page you are looking for does not exist.</p>" \
            --post_status=publish \
            --porcelain)
        
        echo "404 page created with ID: $page_id"
    fi
    
    # Save to environment file for Next.js
    echo "NOT_FOUND_ID=${page_id}" >> "$ENV_FILE"
    
    echo "404 page configured successfully!"
}

# Update WP_HOME after Next.js is ready
update_wp_home() {
    echo "WP_HOME will be updated when Next.js is running..."
    
    local nextjs_url="${HEADLESS_URL:-http://localhost:3000}"
    
    # This will be done via a separate script or manually
    echo "# To update WP_HOME, add this to wp-config.php:" >> "$ENV_FILE"
    echo "# define('WP_HOME', '${nextjs_url}');" >> "$ENV_FILE"
}

# Generate final .env file for Next.js
generate_nextjs_env() {
    echo "Generating .env file for Next.js..."
    
    local wp_url="${WP_SITE_URL:-http://localhost:8888}"
    local wp_hostname=$(echo "$wp_url" | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|:.*$||')
    local nextjs_url="${NEXT_PUBLIC_BASE_URL:-http://localhost:3000}"
    
    # Create/update the env file
    cat > "${ENV_FILE}.tmp" << EOF
# Next.js Environment Configuration
# Generated by WordPress Setup Script
# $(date)

NEXT_PUBLIC_BASE_URL=${nextjs_url}
NEXT_PUBLIC_WORDPRESS_API_URL=${wp_url}
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=${wp_hostname}
EOF
    
    # Append existing content (credentials)
    if [ -f "$ENV_FILE" ]; then
        cat "$ENV_FILE" >> "${ENV_FILE}.tmp"
    fi
    
    mv "${ENV_FILE}.tmp" "$ENV_FILE"
    
    echo "Next.js environment file generated: $ENV_FILE"
    echo "Contents:"
    cat "$ENV_FILE"
}

# Main execution
main() {
    echo ""
    echo "Starting WordPress Headless Setup..."
    echo "=========================================="
    
    # Initialize environment file
    > "$ENV_FILE"
    
    # Wait for database
    wait_for_database
    
    # Check/Install WordPress
    if ! wait_for_wordpress; then
        install_wordpress
    fi
    
    # Configure wp-config.php
    configure_wp_config
    
    # Install and activate plugins
    install_store_plugins
    activate_custom_plugins
    
    # Configure plugin settings
    configure_redirection
    configure_yoast_seo
    
    # Activate theme
    activate_headless_theme
    
    # Create App User
    create_app_user
    
    # Configure settings
    configure_permalinks
    configure_graphql
    
    # ============================================
    # KRITISCH: Schema-Flush NACH allen Plugin-Konfigurationen
    # aber VOR dem Next.js Build
    # ============================================
    flush_and_validate_graphql_schema
    
    # Create 404 page
    create_404_page
    
    # Generate Next.js env file
    generate_nextjs_env
    
    echo ""
    echo "=========================================="
    echo "WordPress Headless Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Next.js can now be built with the following environment:"
    cat "$ENV_FILE"
    echo ""
    echo "=========================================="
}

# Run main function
main "$@"
