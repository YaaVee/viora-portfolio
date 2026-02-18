#!/bin/bash

echo "========================================="
echo "🚀 DEPLOYING SECURE AI BACKEND"
echo "========================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please don't run as root"
   exit 1
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
cd ~/viora-portfolio/secure-ai-backend
npm install

# Create systemd service
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/secure-ai.service > /dev/null << 'SERVICE'
[Unit]
Description=Secure AI Backend
After=network.target ollama.service redis.service
Wants=ollama.service redis.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/viora-portfolio/secure-ai-backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

# Security hardening
NoNewPrivileges=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=$HOME/viora-portfolio/secure-ai-backend/logs
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes

[Install]
WantedBy=multi-user.target
SERVICE

# Create log directory
mkdir -p logs

# Secure Ollama
echo "🔒 Securing Ollama..."
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo tee /etc/systemd/system/ollama.service.d/override.conf > /dev/null << 'OLLAMA'
[Service]
Environment="OLLAMA_HOST=127.0.0.1"
Environment="OLLAMA_ORIGINS=https://yourdomain.com"
Environment="OLLAMA_NUM_PARALLEL=1"
Environment="OLLAMA_MAX_QUEUE=512"
Environment="OLLAMA_KEEP_ALIVE=0"
OLLAMA

# Reload systemd
sudo systemctl daemon-reload

# Enable and start services
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl enable secure-ai
sudo systemctl start secure-ai

# Configure firewall
echo "🛡️ Configuring firewall..."
sudo ufw allow 443/tcp 2>/dev/null || echo "Firewall not available"
sudo ufw deny 11434/tcp 2>/dev/null || echo "Firewall rule skipped"

echo "========================================="
echo "✅ DEPLOYMENT COMPLETE"
echo "========================================="
echo ""
echo "Check status:"
echo "  sudo systemctl status secure-ai"
echo "  sudo systemctl status ollama"
echo ""
echo "View logs:"
echo "  sudo journalctl -u secure-ai -f"
echo "  tail -f logs/ai-*.log"
echo ""
echo "Test API:"
echo "  curl http://localhost:3001/api/health"
echo ""
echo "IMPORTANT:"
echo "  1. Update .env file with your domain"
echo "  2. Change admin password immediately"
echo "  3. Configure SSL/HTTPS for production"
echo "========================================="
