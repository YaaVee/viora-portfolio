#!/bin/bash

echo "🚀 Installing Real AI Chat System..."

# Install Ollama
echo "📦 Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models
echo "🤖 Pulling LLM models..."
ollama pull llama2
ollama pull codellama
ollama pull mistral

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create systemd service
echo "⚙️ Creating systemd service..."
sudo cat > /etc/systemd/system/ai-chat.service << 'SERVICE'
[Unit]
Description=AI Chat Backend
After=network.target ollama.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$PWD
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
SERVICE

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable ai-chat
sudo systemctl start ai-chat

echo "✅ AI Chat installed successfully!"
echo "🌐 Backend running on http://localhost:3001"
