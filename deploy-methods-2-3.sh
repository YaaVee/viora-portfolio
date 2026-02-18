#!/bin/bash

echo "========================================="
echo "🚀 DEPLOYING METHODS 2 & 3"
echo "========================================="

# Install dependencies
cd ~/viora-portfolio/secure-ai-backend
npm install

# Create admin password for nginx
echo "🔐 Set admin panel password:"
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Copy nginx config
sudo cp /tmp/nginx-config /etc/nginx/sites-available/yourdomain.com
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

# Test nginx
sudo nginx -t && sudo systemctl reload nginx

# Restart AI backend
sudo systemctl restart secure-ai

echo "========================================="
echo "✅ DEPLOYMENT COMPLETE"
echo "========================================="
echo ""
echo "📊 Admin Panel: https://yourdomain.com/admin-panel.html"
echo "   (Protected with HTTP Basic Auth)"
echo ""
echo "🎟️ Invite Signup: https://yourdomain.com/signup.html?invite=CODE"
echo ""
echo "How to use:"
echo "1. Login to admin panel with your credentials"
echo "2. Generate invite links from the Invites tab"
echo "3. Share invite links with people"
echo "4. They sign up themselves"
echo "5. You manage all users from admin panel"
echo ""
echo "Perfect balance of control and automation! 🚀"
