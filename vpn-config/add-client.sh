#!/bin/bash
# Script to add a new VPN client

CLIENT_NAME=$1
CLIENT_IP=$2

if [ -z "$CLIENT_NAME" ] || [ -z "$CLIENT_IP" ]; then
    echo "Usage: $0 <client-name> <ip-address>"
    echo "Example: $0 viora-phone 10.10.10.2"
    echo "Example: $0 viora-laptop 10.10.10.3"
    exit 1
fi

cd /home/viora/viora-portfolio/vpn-config

# Get server public key
SERVER_PUBLIC=$(cat server-public.key)

# Get your PC's IP address (for external access)
# You need to know your public IP or use dynamic DNS
SERVER_ENDPOINT="YOUR_PUBLIC_IP_OR_DDNS:51820"
echo "⚠️  IMPORTANT: Edit this script to set your public IP in SERVER_ENDPOINT"

# Generate client keys
wg genkey | tee "${CLIENT_NAME}-private.key" | wg pubkey > "${CLIENT_NAME}-public.key"

CLIENT_PRIVATE=$(cat "${CLIENT_NAME}-private.key")
CLIENT_PUBLIC=$(cat "${CLIENT_NAME}-public.key")

# Create client config file
cat > "${CLIENT_NAME}.conf" << CONF
[Interface]
# Client private key
PrivateKey = $CLIENT_PRIVATE
# Client VPN IP
Address = $CLIENT_IP/24
# DNS server (optional - use 8.8.8.8 or your router's DNS)
DNS = 8.8.8.8

[Peer]
# Server public key
PublicKey = $SERVER_PUBLIC
# Server endpoint (your PC's public IP)
Endpoint = $SERVER_ENDPOINT
# Route all traffic through VPN (0.0.0.0/0 for full tunnel)
# Or use "10.10.10.0/24, 192.168.1.0/24" for split tunnel
AllowedIPs = 0.0.0.0/0
# Keep connection alive
PersistentKeepalive = 25
CONF

# Generate QR code for mobile
qrencode -t ansiutf8 < "${CLIENT_NAME}.conf" > "${CLIENT_NAME}-qr.txt"
qrencode -t png -o "${CLIENT_NAME}.png" < "${CLIENT_NAME}.conf"

echo ""
echo "✅ Client '$CLIENT_NAME' created!"
echo "📁 Config file: ${CLIENT_NAME}.conf"
echo "📱 QR code (text): ${CLIENT_NAME}-qr.txt"
echo "📱 QR code (PNG): ${CLIENT_NAME}.png"
echo ""
echo "Add this peer to your server config (wg0.conf):"
echo ""
echo "[Peer]"
echo "# $CLIENT_NAME"
echo "PublicKey = $CLIENT_PUBLIC"
echo "AllowedIPs = $CLIENT_IP/32"
echo ""
