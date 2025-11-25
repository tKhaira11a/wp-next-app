# ============================================
# WordPress Headless Dockerfile
# ============================================
FROM wordpress:latest

# Build Arguments
ARG HOST_UID=1000
ARG HOST_GID=1000

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    less \
    mariadb-client \
    unzip \
    git \
    nodejs \
    npm \
    jq \
    moreutils \
    && rm -rf /var/lib/apt/lists/*

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Create wp-cli config to allow root
RUN mkdir -p /root/.wp-cli && \
    echo "path: /var/www/html" > /root/.wp-cli/config.yml

# Create directories for plugins to be built
WORKDIR /build

# Copy plugin sources
COPY nextpress_gb_element_plugin /build/nextpress_gb_element_plugin
COPY nextpress_contact_form_plugin /build/nextpress_contact_form_plugin

# Copy third-party plugins
COPY wp-graphql-jwt-authentication-develop /build/wp-graphql-jwt-authentication

# Copy headless theme
COPY headless /build/headless-theme

# Build NextPress GB Components Plugin
WORKDIR /build/nextpress_gb_element_plugin
RUN npm ci && npm run build

# Build NextPress Contact Form Plugin
WORKDIR /build/nextpress_contact_form_plugin
RUN npm ci && npm run build

# Create plugin zip files (or prepare directories)
WORKDIR /build

# Prepare plugins directory structure
RUN mkdir -p /docker-entrypoint-initwp.d/plugins \
    && mkdir -p /docker-entrypoint-initwp.d/themes

# Copy built plugins to init directory
# WICHTIG: Plugin-Ordnernamen müssen mit dem Slug aus der Haupt-PHP-Datei übereinstimmen
# nextpress_gb_element_plugin -> NextPress-GB-Components.php -> Plugin Name in WP
# nextpress_contact_form_plugin -> NextPress-contact_form.php -> Plugin Name in WP
RUN cp -r /build/nextpress_gb_element_plugin /docker-entrypoint-initwp.d/plugins/nextpress_gb_element_plugin \
    && cp -r /build/nextpress_contact_form_plugin /docker-entrypoint-initwp.d/plugins/nextpress_contact_form_plugin \
    && cp -r /build/wp-graphql-jwt-authentication /docker-entrypoint-initwp.d/plugins/wp-graphql-jwt-authentication \
    && cp -r /build/headless-theme /docker-entrypoint-initwp.d/themes/headless

# Copy scripts
COPY scripts/docker-entrypoint-wp.sh /usr/local/bin/docker-entrypoint-wp.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-wp.sh

# Clean up build directory
RUN rm -rf /build

WORKDIR /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html 2>/dev/null || true

EXPOSE 80

# Use custom entrypoint that wraps the original
ENTRYPOINT ["docker-entrypoint-wp.sh"]
CMD ["apache2-foreground"]
