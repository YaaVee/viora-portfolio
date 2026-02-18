#!/bin/bash

echo "🚀 Installing Jitsi Meet Video Conferencing..."

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Generate passwords
echo "🔑 Generating secure passwords..."
cat > config/jitsi-passwords.txt << PASS
JICOFO_COMPONENT_SECRET=$(openssl rand -hex 16)
JICOFO_AUTH_PASSWORD=$(openssl rand -hex 16)
JVB_AUTH_PASSWORD=$(openssl rand -hex 16)
JIGASI_XMPP_PASSWORD=$(openssl rand -hex 16)
JIBRI_RECORDER_PASSWORD=$(openssl rand -hex 16)
JIBRI_XMPP_PASSWORD=$(openssl rand -hex 16)
PASS

# Load passwords into environment
source config/jitsi-passwords.txt

# Start Jitsi
echo "🚀 Starting Jitsi Meet..."
docker-compose up -d

echo "✅ Jitsi Meet installed successfully!"
echo "🌐 Access at: http://localhost"
echo "📝 Default room: http://localhost/test-room"
echo ""
echo "Features enabled:"
echo "  - HD Video/Audio conferencing"
echo "  - Screen sharing"
echo "  - Chat with encryption"
echo "  - Recording (Jibri)"
echo "  - Live streaming (Jigasi)"
echo "  - Collaborative editing (Etherpad)"
echo "  - End-to-end encryption option"
