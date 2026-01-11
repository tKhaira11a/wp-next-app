#!/bin/bash
#
# Copyright (C) 2025 Tarik Khairalla (khairalla-code)
# https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#

#
# Copyright (C) 2025 Tarik Khairalla (khairalla-code)
# https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#

#
# Copyright (C) 2025 Tarik Khairalla (khairalla-code)
# https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#

#
# Copyright (C) 2025 Tarik Khairalla (khairalla-code)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#

set -e

# ============================================
# WordPress Custom Entrypoint
# ============================================
# This script wraps the original WordPress entrypoint
# and adds custom plugin/theme installation

echo "=========================================="
echo "WordPress Headless Setup - Entrypoint"
echo "=========================================="

# Wait for WordPress files to be available
wait_for_wp() {
    echo "Waiting for WordPress files..."
    local max_attempts=60
    local attempt=0
    
    while [ ! -f /var/www/html/wp-includes/version.php ]; do
        attempt=$((attempt + 1))
        if [ $attempt -ge $max_attempts ]; then
            echo "Timeout waiting for WordPress files"
            return 1
        fi
        echo "Waiting for WordPress files... ($attempt/$max_attempts)"
        sleep 2
    done
    
    echo "WordPress files are available"
    return 0
}

# Copy custom plugins and themes after WordPress is set up
copy_custom_content() {
    echo "Copying custom plugins and themes..."
    
    # Copy plugins
    if [ -d /docker-entrypoint-initwp.d/plugins ]; then
        for plugin in /docker-entrypoint-initwp.d/plugins/*; do
            if [ -d "$plugin" ]; then
                plugin_name=$(basename "$plugin")
                echo "Copying plugin: $plugin_name"
                cp -r "$plugin" "/var/www/html/wp-content/plugins/$plugin_name"
                chown -R www-data:www-data "/var/www/html/wp-content/plugins/$plugin_name"
            fi
        done
    fi
    
    # Copy themes
    if [ -d /docker-entrypoint-initwp.d/themes ]; then
        for theme in /docker-entrypoint-initwp.d/themes/*; do
            if [ -d "$theme" ]; then
                theme_name=$(basename "$theme")
                echo "Copying theme: $theme_name"
                cp -r "$theme" "/var/www/html/wp-content/themes/$theme_name"
                chown -R www-data:www-data "/var/www/html/wp-content/themes/$theme_name"
            fi
        done
    fi
    
    echo "Custom content copied successfully"
}

# Run the original WordPress entrypoint in background to set up files
# Then copy our custom content
(
    # Wait a bit for the original entrypoint to start
    sleep 5
    
    # Wait for WordPress files
    if wait_for_wp; then
        copy_custom_content
    fi
) &

# Execute the original WordPress entrypoint
exec docker-entrypoint.sh "$@"
