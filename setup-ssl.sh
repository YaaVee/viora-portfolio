#!/bin/bash

# SSL/HTTPS setup with Let's Encrypt
echo "🔒 Setting up SSL with Let's Encrypt..."

# Install certbot
sudo apt update
sudo apt install -y certbot nginx

# Get SSL certificate
read -p "Enter your domain: " DOMAIN
sudo certbot certonly --nginx -d $DOMAIN

# Create nginx config
sudo tee /etc/nginx/sites-available/secure-ai > /dev/null << NGINX
server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        root /home/$USER/viora-portfolio;
        try_files \$uri \$uri/ /index.html;
    }
}

server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}
NGINX

# Enable site
sudo ln -s /etc/nginx/sites-available/secure-ai /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ SSL configured for $DOMAIN"
