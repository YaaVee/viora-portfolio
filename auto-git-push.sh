#!/bin/bash

# ============================================
# AUTO GIT PUSH SCRIPT
# ============================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 AUTO GITHUB PUSH SYSTEM${NC}"
echo -e "${BLUE}========================================${NC}"

# Configuration
REPO_PATH="$HOME/viora-portfolio"
GIT_USER="YaaVee"
GIT_EMAIL="vvioraviorav@gmail.com"
REPO_NAME="viora-portfolio"
BRANCH="main"

# Check if we're in the right directory
cd "$REPO_PATH" || {
    echo -e "${RED}❌ Cannot find repository at $REPO_PATH${NC}"
    exit 1
}

# Function to check if git is initialized
check_git() {
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}📦 Git not initialized. Setting up...${NC}"
        git init
        git remote add origin "https://github.com/$GIT_USER/$REPO_NAME.git"
        git branch -M $BRANCH
        echo -e "${GREEN}✅ Git initialized${NC}"
    fi
}

# Function to configure git
configure_git() {
    git config user.name "$GIT_USER"
    git config user.email "$GIT_EMAIL"
    echo -e "${GREEN}✅ Git configured${NC}"
}

# Function to check for changes
check_changes() {
    if git diff --quiet && git diff --staged --quiet; then
        echo -e "${YELLOW}📝 No changes to commit${NC}"
        return 1
    else
        echo -e "${GREEN}📝 Changes detected${NC}"
        return 0
    fi
}

# Function to commit changes
commit_changes() {
    local commit_message="$1"
    git add .
    git commit -m "$commit_message"
    echo -e "${GREEN}✅ Changes committed${NC}"
}

# Function to push to GitHub
push_to_github() {
    echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
    
    # Try different push methods
    if git push origin $BRANCH 2>/dev/null; then
        echo -e "${GREEN}✅ Push successful${NC}"
        return 0
    fi
    
    # If push fails, try with force (but careful!)
    echo -e "${YELLOW}⚠️ Regular push failed, trying pull first...${NC}"
    git pull origin $BRANCH --rebase
    
    if git push origin $BRANCH; then
        echo -e "${GREEN}✅ Push successful after pull${NC}"
        return 0
    fi
    
    echo -e "${RED}❌ Push failed. Check your connection and permissions.${NC}"
    return 1
}

# Function to create timestamp commit
create_timestamp_commit() {
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    commit_changes "Auto-update: $timestamp"
}

# Function to show status
show_status() {
    echo -e "\n${BLUE}📊 Current Status:${NC}"
    git status -s
    echo ""
    git log --oneline -5
}

# Function to backup to multiple remotes (optional)
backup_to_multiple() {
    # Backup to GitHub (main)
    git push origin $BRANCH
    
    # Backup to GitLab (if configured)
    if git remote | grep -q "gitlab"; then
        git push gitlab $BRANCH
        echo -e "${GREEN}✅ Pushed to GitLab${NC}"
    fi
    
    # Backup to backup branch
    git push origin $BRANCH:backup-$(date +%Y%m%d)
}

# Main menu
while true; do
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}📦 AUTO GITHUB PUSH MENU${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo "1) Push now (with timestamp)"
    echo "2) Push with custom message"
    echo "3) Watch for changes and auto-push"
    echo "4) Setup auto-push cron job"
    echo "5) Show status"
    echo "6) Configure git"
    echo "7) Test connection to GitHub"
    echo "8) Setup webhook (auto-deploy)"
    echo "9) Backup to multiple remotes"
    echo "10) Exit"
    echo -n "Choose option [1-10]: "
    
    read choice
    
    case $choice in
        1)
            check_git
            configure_git
            if check_changes; then
                create_timestamp_commit
                push_to_github
            fi
            ;;
        2)
            echo -n "Enter commit message: "
            read msg
            check_git
            configure_git
            if check_changes; then
                commit_changes "$msg"
                push_to_github
            fi
            ;;
        3)
            echo -e "${YELLOW}👀 Watching for changes... (Ctrl+C to stop)${NC}"
            echo -e "${YELLOW}Will push every 5 minutes if changes detected${NC}"
            while true; do
                cd "$REPO_PATH"
                if check_changes; then
                    create_timestamp_commit
                    push_to_github
                fi
                sleep 300  # 5 minutes
            done
            ;;
        4)
            echo -e "${YELLOW}⏰ Setting up cron job for auto-push${NC}"
            
            # Create cron script
            cat > ~/cron-push.sh << 'CRON'
#!/bin/bash
cd /home/$USER/viora-portfolio
git add .
git diff --quiet && git diff --staged --quiet || git commit -m "Auto-cron: $(date)"
git push origin main
CRON
            chmod +x ~/cron-push.sh
            
            # Add to crontab (every hour)
            (crontab -l 2>/dev/null; echo "0 * * * * /home/$USER/cron-push.sh") | crontab -
            echo -e "${GREEN}✅ Cron job added (runs every hour)${NC}"
            ;;
        5)
            show_status
            ;;
        6)
            echo -n "Enter git username [$GIT_USER]: "
            read new_user
            echo -n "Enter git email [$GIT_EMAIL]: "
            read new_email
            
            GIT_USER=${new_user:-$GIT_USER}
            GIT_EMAIL=${new_email:-$GIT_EMAIL}
            
            # Update the script itself
            sed -i "s/GIT_USER=\".*\"/GIT_USER=\"$GIT_USER\"/" "$0"
            sed -i "s/GIT_EMAIL=\".*\"/GIT_EMAIL=\"$GIT_EMAIL\"/" "$0"
            
            configure_git
            ;;
        7)
            echo -e "${YELLOW}🔍 Testing connection to GitHub...${NC}"
            ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && \
                echo -e "${GREEN}✅ GitHub authentication successful${NC}" || \
                echo -e "${RED}❌ GitHub authentication failed${NC}"
            ;;
        8)
            echo -e "${YELLOW}🔗 Setting up webhook for auto-deploy...${NC}"
            
            # Create webhook receiver
            mkdir -p ~/webhook
            cat > ~/webhook/server.js << 'WEBHOOK'
const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const SECRET = process.env.WEBHOOK_SECRET || 'your-secret-here';
const PORT = 9000;

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(payload);
    const digest = 'sha256=' + hmac.digest('hex');
    
    if (signature !== digest) {
        return res.status(401).send('Invalid signature');
    }
    
    // Pull latest changes
    exec('cd ~/viora-portfolio && git pull && ./deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send('Deploy failed');
        }
        console.log(`Deploy output: ${stdout}`);
        res.send('Deployed successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Webhook listening on port ${PORT}`);
});
WEBHOOK

            # Create systemd service for webhook
            sudo tee /etc/systemd/system/git-webhook.service << 'SERVICE'
[Unit]
Description=Git Webhook Receiver
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/webhook
ExecStart=/usr/bin/node server.js
Restart=always
Environment=WEBHOOK_SECRET=your-secret-here

[Install]
WantedBy=multi-user.target
SERVICE

            sudo systemctl daemon-reload
            sudo systemctl enable git-webhook
            sudo systemctl start git-webhook
            
            echo -e "${GREEN}✅ Webhook running on port 9000${NC}"
            echo "📝 Add this URL to GitHub: http://your-server-ip:9000/webhook"
            echo "🔑 Secret: your-secret-here"
            ;;
        9)
            echo -e "${YELLOW}💾 Backing up to multiple remotes...${NC}"
            backup_to_multiple
            ;;
        10)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
done
