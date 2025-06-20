#!/bin/bash

# Application name - change this to match your app name
APP_NAME="mevn"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "-- ${RED}Starting uninstallation of ${APP_NAME}...${NC}"

# Function to read HTTP_PORT from .env file
get_http_port() {
    if [ -f .env ]; then
        local port=$(grep "^HTTP_PORT=" .env | cut -d'=' -f2)
        if [ -n "$port" ]; then
            echo "$port"
        else
            echo "3000"
        fi
    else
        echo "3000"
    fi
}

HTTP_PORT=$(get_http_port)

# Stop and disable systemd service
echo -e "-- ${YELLOW}Stopping and removing systemd service...${NC}"
if systemctl is-active --quiet ${APP_NAME}.service 2>/dev/null; then
    sudo systemctl stop ${APP_NAME}.service
    echo -e "-- ${GREEN}Service stopped.${NC}"
fi

if systemctl is-enabled --quiet ${APP_NAME}.service 2>/dev/null; then
    sudo systemctl disable ${APP_NAME}.service
    echo -e "-- ${GREEN}Service disabled.${NC}"
fi

if [ -f "/etc/systemd/system/${APP_NAME}.service" ]; then
    sudo rm -f /etc/systemd/system/${APP_NAME}.service
    sudo systemctl daemon-reload
    echo -e "-- ${GREEN}Systemd service file removed.${NC}"
fi

# Remove cron job
echo -e "-- ${YELLOW}Removing backup cron job...${NC}"
BACKUP_SCRIPT="$(pwd)/server/lib/backup.js"
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT" | crontab -
    echo -e "-- ${GREEN}Backup cron job removed.${NC}"
else
    echo -e "-- ${YELLOW}No backup cron job found.${NC}"
fi

# Remove nginx configuration
echo -e "-- ${YELLOW}Checking for nginx configuration...${NC}"
if [ -f "/etc/nginx/sites-enabled/${APP_NAME}" ]; then
    sudo rm -f /etc/nginx/sites-enabled/${APP_NAME}
    echo -e "-- ${GREEN}Nginx site disabled.${NC}"
fi

if [ -f "/etc/nginx/sites-available/${APP_NAME}" ]; then
    sudo rm -f /etc/nginx/sites-available/${APP_NAME}
    echo -e "-- ${GREEN}Nginx configuration file removed.${NC}"
    
    # Reload nginx if it's running
    if systemctl is-active --quiet nginx 2>/dev/null; then
        sudo nginx -t && sudo systemctl reload nginx
        echo -e "-- ${GREEN}Nginx reloaded.${NC}"
    fi
fi

# Remove Apache configuration
echo -e "-- ${YELLOW}Checking for Apache configuration...${NC}"
if [ -f "/etc/apache2/sites-enabled/${APP_NAME}.conf" ]; then
    sudo a2dissite ${APP_NAME}
    sudo rm -f /etc/apache2/sites-enabled/${APP_NAME}.conf
    echo -e "-- ${GREEN}Apache site disabled.${NC}"
fi

if [ -f "/etc/apache2/sites-available/${APP_NAME}.conf" ]; then
    sudo rm -f /etc/apache2/sites-available/${APP_NAME}.conf
    echo -e "-- ${GREEN}Apache configuration file removed.${NC}"
    
    # Reload Apache if it's running
    if systemctl is-active --quiet apache2 2>/dev/null; then
        sudo systemctl reload apache2
        echo -e "-- ${GREEN}Apache reloaded.${NC}"
    fi
fi

# Remove SSL certificates (if they exist)
echo -e "-- ${YELLOW}Checking for SSL certificates...${NC}"
if command -v certbot &> /dev/null; then
    # Try to find the domain from nginx config
    DOMAIN=""
    if [ -f "/etc/nginx/sites-available/${APP_NAME}" ]; then
        DOMAIN=$(grep "server_name" /etc/nginx/sites-available/${APP_NAME} | head -1 | awk '{print $2}' | sed 's/;$//')
    fi
    
    if [ -n "$DOMAIN" ]; then
        echo -e "-- ${YELLOW}Found domain: ${DOMAIN}${NC}"
        echo -e "-- ${YELLOW}Would you like to remove SSL certificate for ${DOMAIN}? (y/n) [n]:${NC}"
        read -r remove_ssl
        
        if [ "$remove_ssl" = "y" ] || [ "$remove_ssl" = "Y" ]; then
            if sudo certbot delete --cert-name ${DOMAIN} --non-interactive; then
                echo -e "-- ${GREEN}SSL certificate for ${DOMAIN} removed.${NC}"
            else
                echo -e "-- ${YELLOW}No SSL certificate found for ${DOMAIN} or removal failed.${NC}"
            fi
        else
            echo -e "-- ${YELLOW}SSL certificate removal skipped.${NC}"
        fi
    fi
fi

# Remove backup directory
echo -e "-- ${YELLOW}Checking for backup directory...${NC}"
if [ -d ~/backup ]; then
    echo -e "-- ${YELLOW}Would you like to remove the backup directory (~/backup)? (y/n) [n]:${NC}"
    read -r remove_backup
    
    if [ "$remove_backup" = "y" ] || [ "$remove_backup" = "Y" ]; then
        rm -rf ~/backup
        echo -e "-- ${GREEN}Backup directory removed.${NC}"
    else
        echo -e "-- ${YELLOW}Backup directory preserved.${NC}"
    fi
fi

# Remove built files
echo -e "-- ${YELLOW}Removing built files...${NC}"
if [ -d "client/dist" ]; then
    rm -rf client/dist
    echo -e "-- ${GREEN}Built files removed.${NC}"
fi

# Remove node_modules (optional)
echo -e "-- ${YELLOW}Would you like to remove node_modules directories? (y/n) [n]:${NC}"
read -r remove_node_modules

if [ "$remove_node_modules" = "y" ] || [ "$remove_node_modules" = "Y" ]; then
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        echo -e "-- ${GREEN}Root node_modules removed.${NC}"
    fi
    
    if [ -d "client/node_modules" ]; then
        rm -rf client/node_modules
        echo -e "-- ${GREEN}Client node_modules removed.${NC}"
    fi
    
    if [ -d "server/node_modules" ]; then
        rm -rf server/node_modules
        echo -e "-- ${GREEN}Server node_modules removed.${NC}"
    fi
else
    echo -e "-- ${YELLOW}node_modules directories preserved.${NC}"
fi

# Final cleanup
echo -e "-- ${GREEN}Uninstallation completed!${NC}"
echo -e "-- ${YELLOW}Note: The following items were NOT removed:${NC}"
echo -e "---- 1. Your .env file (contains your configuration)"
echo -e "---- 2. Your source code"
echo -e "---- 3. Your database (if using local MongoDB)"
echo -e "---- 4. Package.json files (for easy reinstallation)"
echo -e ""
echo -e "-- ${YELLOW}To completely remove the application:${NC}"
echo -e "---- 1. Delete this directory: rm -rf $(pwd)"
echo -e "---- 2. Remove your database if desired"
echo -e "---- 3. Remove your .env file if desired" 