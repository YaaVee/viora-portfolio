#!/bin/bash

echo "========================================="
echo "🚀 INSTALLING REAL AI & VIDEO SYSTEMS"
echo "========================================="
echo ""

# Install AI Backend
echo "📦 Step 1: Installing AI Chat System (Ollama)"
echo "----------------------------------------"
cd ~/viora-portfolio/ai-backend
./install.sh
echo "✅ AI Backend installed"
echo ""

# Install Jitsi Video
echo "📦 Step 2: Installing Video Conferencing (Jitsi)"
echo "----------------------------------------"
cd ~/viora-portfolio/video-server
./install-jitsi.sh
echo "✅ Jitsi Video installed"
echo ""

# Update index.html
echo "📦 Step 3: Updating Portfolio"
echo "----------------------------------------"
cd ~/viora-portfolio

# Backup original
cp index.html index.html.backup

# Add Jitsi API
sed -i '/<\/head>/i <script src="https://meet.jit.si/external_api.js"></script>' index.html

echo "✅ Portfolio updated"
echo ""

echo "========================================="
echo "✅ INSTALLATION COMPLETE!"
echo "========================================="
echo ""
echo "🌐 AI Chat: http://localhost:3001"
echo "🎥 Video: http://localhost (Jitsi)"
echo "📝 Portfolio: http://localhost:3000"
echo ""
echo "Test the features:"
echo "  • AI Chat: Ask security questions"
echo "  • Code Analysis: Paste code for real vulnerability scanning"
echo "  • Video: Join meetings with E2EE"
echo "  • Screen sharing: Works with WebRTC"
echo "  • Recording: Saves to ./recordings"
echo ""
echo "To check status:"
echo "  • AI: curl http://localhost:11434/api/tags"
echo "  • Video: docker-compose ps"
echo "  • Logs: docker-compose logs -f"
echo ""
echo "Enjoy your REAL secure communication system! 🚀"
