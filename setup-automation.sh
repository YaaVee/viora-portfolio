#!/bin/bash

echo "========================================="
echo "🚀 GITHUB AUTOMATION SETUP"
echo "========================================="

# Step 1: Configure git
echo "📦 Configuring git..."
git config --global user.name "YaaVee"
git config --global user.email "vvioraviorav@gmail.com"

# Step 2: Initialize repo if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing repository..."
    git init
    git remote add origin https://github.com/YaaVee/viora-portfolio.git
    git branch -M main
fi

# Step 3: Create SSH key for GitHub (if needed)
if [ ! -f ~/.ssh/id_rsa ]; then
    echo "🔑 Generating SSH key..."
    ssh-keygen -t rsa -b 4096 -C "vvioraviorav@gmail.com" -f ~/.ssh/id_rsa -N ""
    echo "✅ SSH key created"
    echo "📋 Add this public key to GitHub:"
    cat ~/.ssh/id_rsa.pub
    read -p "Press Enter after adding to GitHub..."
fi

# Step 4: Test connection
echo "🔍 Testing GitHub connection..."
ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && \
    echo "✅ GitHub connected" || \
    echo "❌ GitHub connection failed"

# Step 5: Setup cron
echo "⏰ Setting up cron jobs..."
./setup-cron.sh

# Step 6: Make all scripts executable
chmod +x *.sh

# Step 7: First push
echo "📤 Performing initial push..."
./auto-git-push.sh

# Step 8: Setup webhook
echo "🔗 Setting up webhook..."
sudo ufw allow 9000/tcp
cd ~/webhook 2>/dev/null || mkdir ~/webhook
npm install express

echo "========================================="
echo "✅ AUTOMATION SETUP COMPLETE"
echo "========================================="
echo ""
echo "📊 What's configured:"
echo "  • Auto-push every hour"
echo "  • Auto-deploy on push"
echo "  • Daily backups"
echo "  • Telegram notifications"
echo "  • Webhook for instant deploy"
echo ""
echo "📝 Next steps:"
echo "1. Add your files: git add ."
echo "2. Commit: git commit -m 'Initial commit'"
echo "3. Push: git push -u origin main"
echo ""
echo "🚀 Your code will now auto-push to GitHub!"
