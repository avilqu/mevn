#!/bin/bash

# Application name - change this to customize the app name
APP_NAME="mevn"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

echo -e "-- ${GREEN}Starting installation...${NC}"

# Get the HTTP port from .env file
HTTP_PORT=$(get_http_port)
echo -e "-- ${GREEN}Using HTTP_PORT: ${HTTP_PORT}${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "-- ${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "-- ${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "-- ${YELLOW}Warning: MongoDB is not installed. Please install MongoDB for local development.${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "-- ${GREEN}Copying .env.example to .env...${NC}"
        cp .env.example .env
        echo -e "-- ${GREEN}.env file created from .env.example. Please update the values with your configuration.${NC}"
    else
        echo -e "-- ${YELLOW}No .env.example found. Please create a .env file manually.${NC}"
    fi
else
    echo -e "-- ${GREEN}.env file already exists.${NC}"
fi

# Install root dependencies
echo -e "-- ${GREEN}Installing root dependencies...${NC}"
npm install

# Install client dependencies
echo -e "-- ${GREEN}Installing client dependencies...${NC}"
cd client && npm install && cd ..

# Install server dependencies
echo -e "-- ${GREEN}Installing server dependencies...${NC}"
cd server && npm install && cd ..

# Create backup directory
echo -e "-- ${GREEN}Setting up backup directory...${NC}"
mkdir -p ~/backup

# Set up backup cron job
echo -e "-- ${GREEN}Setting up backup cron job...${NC}"
chmod +x server/lib/backup.js

# Get the absolute path to the backup script
BACKUP_SCRIPT="$(pwd)/server/lib/backup.js"
CRON_JOB="0 2 * * * $BACKUP_SCRIPT"

if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo -e "-- ${YELLOW}Cron job already exists${NC}"
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo -e "-- ${GREEN}Cron job has been added successfully${NC}"
    echo -e "-- ${GREEN}The backup will run every day at 2 AM${NC}"
fi

echo -e "-- ${GREEN}Current crontab entries:${NC}"
crontab -l

# Auto-start configuration
echo -e "-- ${YELLOW}Would you like to set up auto-start on boot? (y/n) [y]:${NC}"
read -r setup_autostart

if [ "$setup_autostart" = "y" ] || [ "$setup_autostart" = "Y" ] || [ "$setup_autostart" = "" ]; then
    echo -e "-- ${GREEN}Setting up systemd service for auto-start...${NC}"
    
    # Get current user and working directory
    CURRENT_USER=$(whoami)
    WORKING_DIR=$(pwd)
    NODE_PATH=$(which node)
    
    # Create systemd service file
    sudo tee /etc/systemd/system/${APP_NAME}.service > /dev/null << EOL
[Unit]
Description=${APP_NAME}
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
User=${CURRENT_USER}
WorkingDirectory=${WORKING_DIR}
Environment=NODE_ENV=production
Environment=GIT_BRANCH=main
ExecStart=${NODE_PATH} server/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${APP_NAME}

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=${WORKING_DIR}

[Install]
WantedBy=multi-user.target
EOL
    
    # Reload systemd and enable the service
    sudo systemctl daemon-reload
    sudo systemctl enable ${APP_NAME}.service
    
    echo -e "-- ${GREEN}Systemd service created and enabled.${NC}"
    echo -e "-- ${GREEN}The application will start automatically on boot.${NC}"
    echo -e "-- ${YELLOW}Service management commands:${NC}"
    echo -e "---- Start: sudo systemctl start ${APP_NAME}"
    echo -e "---- Stop: sudo systemctl stop ${APP_NAME}"
    echo -e "---- Restart: sudo systemctl restart ${APP_NAME}"
    echo -e "---- Status: sudo systemctl status ${APP_NAME}"
    echo -e "---- Logs: sudo journalctl -u ${APP_NAME} -f"
    echo -e "---- Disable auto-start: sudo systemctl disable ${APP_NAME}"
    
    # Ask if user wants to start the service now
    echo -e "-- ${YELLOW}Would you like to start the service now? (y/n) [y]:${NC}"
    read -r start_now
    
    if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ] || [ "$start_now" = "" ]; then
        sudo systemctl start ${APP_NAME}.service
        echo -e "-- ${GREEN}Service started successfully!${NC}"
        echo -e "-- ${GREEN}Check status with: sudo systemctl status ${APP_NAME}${NC}"
    else
        echo -e "-- ${YELLOW}Service will start on next boot.${NC}"
    fi
else
    echo -e "-- ${YELLOW}Skipping auto-start configuration.${NC}"
    echo -e "-- ${YELLOW}To start manually: npm run server${NC}"
fi

# Create necessary directories
echo -e "-- ${GREEN}Creating necessary directories...${NC}"
mkdir -p client/dist

# Optional web server configuration
echo -e "-- ${YELLOW}Would you like to set up web server configuration? (nginx/apache2/none) [none]:${NC}"
read -r web_server

if [ "$web_server" = "nginx" ]; then
    echo -e "-- ${GREEN}Setting up nginx configuration...${NC}"
    
    # Check if nginx is installed (multiple possible locations)
    NGINX_FOUND=false
    if command -v nginx &> /dev/null; then
        NGINX_FOUND=true
    elif command -v /usr/sbin/nginx &> /dev/null; then
        NGINX_FOUND=true
    elif command -v /usr/local/sbin/nginx &> /dev/null; then
        NGINX_FOUND=true
    elif [ -f /etc/nginx/nginx.conf ]; then
        NGINX_FOUND=true
    elif [ -f /usr/local/etc/nginx/nginx.conf ]; then
        NGINX_FOUND=true
    fi
    
    if [ "$NGINX_FOUND" = false ]; then
        echo -e "-- ${RED}nginx is not installed or not found in PATH.${NC}"
        echo -e "-- ${YELLOW}Please install nginx first:${NC}"
        echo -e "---- On Ubuntu/Debian: sudo apt install nginx$"
        echo -e "---- On CentOS/RHEL: sudo yum install nginx$"
        echo -e "---- On Arch: sudo pacman -S nginx$"
        echo -e "---- On macOS: brew install nginx$"
        echo -e "-- ${YELLOW}Or if nginx is installed but not in PATH, add it to your PATH.${NC}"
    else
        # Prompt for domain
        echo -e "-- ${YELLOW}Enter your domain name (e.g., example.com):${NC}"
        read -r domain_name
        
        # Ask about SSL certificate
        echo -e "-- ${YELLOW}Would you like to set up SSL certificate with Let's Encrypt? (y/n) [y]:${NC}"
        read -r setup_ssl
        
        if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ] || [ "$setup_ssl" = "" ]; then
            # Check if certbot is installed
            if ! command -v certbot &> /dev/null; then
                echo -e "-- ${YELLOW}Certbot is not installed. Installing certbot...${NC}"
                if command -v apt &> /dev/null; then
                    sudo apt update && sudo apt install -y certbot python3-certbot-nginx
                elif command -v yum &> /dev/null; then
                    sudo yum install -y certbot python3-certbot-nginx
                elif command -v pacman &> /dev/null; then
                    sudo pacman -S certbot certbot-nginx
                else
                    echo -e "-- ${RED}Could not install certbot automatically. Please install it manually.${NC}"
                    echo -e "---- Visit: https://certbot.eff.org/ for installation instructions"
                fi
            fi
            
            # Create initial nginx configuration (HTTP only, for certbot)
            sudo tee /etc/nginx/sites-available/${APP_NAME} > /dev/null << EOL
server {
    listen 80;
    server_name ${domain_name};
    
    # Serve static files
    location / {
        root $(pwd)/client/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to Node.js server
    location /api {
        proxy_pass http://localhost:${HTTP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
            
            # Enable the site
            sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
            sudo nginx -t && sudo systemctl reload nginx
            
            echo -e "-- ${GREEN}Initial nginx configuration created.${NC}"
            echo -e "-- ${YELLOW}Attempting to obtain SSL certificate...${NC}"
            
            # Obtain SSL certificate
            if sudo certbot --nginx -d ${domain_name} --non-interactive --agree-tos --email admin@${domain_name} --redirect; then
                echo -e "-- ${GREEN}SSL certificate obtained and nginx configuration updated successfully!${NC}"
                echo -e "-- ${GREEN}Your site is now available at https://${domain_name}${NC}"
            else
                echo -e "-- ${RED}Failed to obtain SSL certificate.${NC}"
                echo -e "-- ${YELLOW}Please check:${NC}"
                echo -e "---- 1. Domain DNS is pointing to this server"
                echo -e "---- 2. Port 80 is accessible from the internet"
                echo -e "---- 3. Run manually: sudo certbot --nginx -d ${domain_name}"
            fi
        else
            # Create HTTP-only nginx configuration
            sudo tee /etc/nginx/sites-available/${APP_NAME} > /dev/null << EOL
server {
    listen 80;
    server_name ${domain_name};
    
    # Serve static files
    location / {
        root $(pwd)/client/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to Node.js server
    location /api {
        proxy_pass http://localhost:${HTTP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
            
            # Enable the site
            sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
            sudo nginx -t && sudo systemctl reload nginx
            
            echo -e "-- ${GREEN}nginx configuration created and enabled for ${domain_name} (HTTP only).${NC}"
            echo -e "-- ${YELLOW}To add SSL later, run: sudo certbot --nginx -d ${domain_name}${NC}"
        fi
    fi
    
elif [ "$web_server" = "apache2" ]; then
    echo -e "-- ${GREEN}Setting up Apache configuration...${NC}"
    
    # Check if apache2 is installed (multiple possible locations)
    APACHE_FOUND=false
    if command -v apache2 &> /dev/null; then
        APACHE_FOUND=true
    elif command -v httpd &> /dev/null; then
        APACHE_FOUND=true
    elif command -v /usr/sbin/apache2 &> /dev/null; then
        APACHE_FOUND=true
    elif command -v /usr/sbin/httpd &> /dev/null; then
        APACHE_FOUND=true
    elif [ -f /etc/apache2/apache2.conf ]; then
        APACHE_FOUND=true
    elif [ -f /etc/httpd/conf/httpd.conf ]; then
        APACHE_FOUND=true
    fi
    
    if [ "$APACHE_FOUND" = false ]; then
        echo -e "-- ${RED}Apache2 is not installed or not found in PATH.${NC}"
        echo -e "-- ${YELLOW}Please install Apache2 first:${NC}"
        echo -e "---- On Ubuntu/Debian: sudo apt install apache2$"
        echo -e "---- On CentOS/RHEL: sudo yum install httpd$"
        echo -e "---- On Arch: sudo pacman -S apache$"
        echo -e "---- On macOS: brew install httpd$"
        echo -e "-- ${YELLOW}Or if Apache is installed but not in PATH, add it to your PATH.${NC}"
    else
        # Prompt for domain
        echo -e "-- ${YELLOW}Enter your domain name (e.g., example.com):${NC}"
        read -r domain_name
        
        # Ask about SSL certificate
        echo -e "-- ${YELLOW}Would you like to set up SSL certificate with Let's Encrypt? (y/n) [y]:${NC}"
        read -r setup_ssl
        
        if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ] || [ "$setup_ssl" = "" ]; then
            # Check if certbot is installed
            if ! command -v certbot &> /dev/null; then
                echo -e "-- ${YELLOW}Certbot is not installed. Installing certbot...${NC}"
                if command -v apt &> /dev/null; then
                    sudo apt update && sudo apt install -y certbot python3-certbot-apache
                elif command -v yum &> /dev/null; then
                    sudo yum install -y certbot python3-certbot-apache
                elif command -v pacman &> /dev/null; then
                    sudo pacman -S certbot certbot-apache
                else
                    echo -e "-- ${RED}Could not install certbot automatically. Please install it manually.${NC}"
                    echo -e "---- Visit: https://certbot.eff.org/ for installation instructions"
                fi
            fi
            
            # Create initial Apache configuration (HTTP only, for certbot)
            sudo tee /etc/apache2/sites-available/${APP_NAME}.conf > /dev/null << EOL
<VirtualHost *:80>
    ServerName ${domain_name}
    DocumentRoot $(pwd)/client/dist
    
    # Serve static files
    <Directory $(pwd)/client/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle client-side routing
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy API requests to Node.js server
    ProxyPreserveHost On
    ProxyPass /api http://localhost:${HTTP_PORT}/api
    ProxyPassReverse /api http://localhost:${HTTP_PORT}/api
    
    # Enable required modules
    LoadModule proxy_module modules/mod_proxy.so
    LoadModule proxy_http_module modules/mod_proxy_http.so
    LoadModule rewrite_module modules/mod_rewrite.so
</VirtualHost>
EOL
            
            # Enable the site and required modules
            sudo a2ensite ${APP_NAME}
            sudo a2enmod proxy proxy_http rewrite
            sudo systemctl reload apache2
            
            echo -e "-- ${GREEN}Initial Apache configuration created.${NC}"
            echo -e "-- ${YELLOW}Attempting to obtain SSL certificate...${NC}"
            
            # Obtain SSL certificate
            if sudo certbot --apache -d ${domain_name} --non-interactive --agree-tos --email admin@${domain_name} --redirect; then
                echo -e "-- ${GREEN}SSL certificate obtained and Apache configuration updated successfully!${NC}"
                echo -e "-- ${GREEN}Your site is now available at https://${domain_name}${NC}"
            else
                echo -e "-- ${RED}Failed to obtain SSL certificate.${NC}"
                echo -e "-- ${YELLOW}Please check:${NC}"
                echo -e "---- 1. Domain DNS is pointing to this server"
                echo -e "---- 2. Port 80 is accessible from the internet"
                echo -e "---- 3. Run manually: sudo certbot --apache -d ${domain_name}"
            fi
        else
            # Create HTTP-only Apache configuration
            sudo tee /etc/apache2/sites-available/${APP_NAME}.conf > /dev/null << EOL
<VirtualHost *:80>
    ServerName ${domain_name}
    DocumentRoot $(pwd)/client/dist
    
    # Serve static files
    <Directory $(pwd)/client/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle client-side routing
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy API requests to Node.js server
    ProxyPreserveHost On
    ProxyPass /api http://localhost:${HTTP_PORT}/api
    ProxyPassReverse /api http://localhost:${HTTP_PORT}/api
    
    # Enable required modules
    LoadModule proxy_module modules/mod_proxy.so
    LoadModule proxy_http_module modules/mod_proxy_http.so
    LoadModule rewrite_module modules/mod_rewrite.so
</VirtualHost>
EOL
            
            # Enable the site and required modules
            sudo a2ensite ${APP_NAME}
            sudo a2enmod proxy proxy_http rewrite
            sudo systemctl reload apache2
            
            echo -e "-- ${GREEN}Apache configuration created and enabled for ${domain_name} (HTTP only).${NC}"
            echo -e "-- ${YELLOW}To add SSL later, run: sudo certbot --apache -d ${domain_name}${NC}"
        fi
    fi
    
else
    echo -e "-- ${YELLOW}Skipping web server configuration.${NC}"
    echo -e "---- You'll need to configure your web server manually to:"
    echo -e "---- 1. Serve static files from $(pwd)/client/dist$"
    echo -e "---- 2. Proxy /api requests to localhost:${HTTP_PORT}$"
fi

# Final checks
echo -e "-- ${GREEN}Running final checks...${NC}"

# Check if all dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
    echo -e "-- ${RED}Error: Some dependencies failed to install. Please check the error messages above.${NC}"
    exit 1
fi

echo -e "-- ${GREEN}Installation completed successfully!${NC}"
echo -e "---- Next steps:"
echo "---- 1. Update the .env file with your configuration"
echo "---- 2. Start the development server with: npm run dev"
echo "---- 3. For production, build and start with: npm run prod" 