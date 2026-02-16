#!/bin/bash
# Complete VPN and Firewall Setup Script

echo "🔧 Setting up VPN and Firewall..."
echo "================================"

# Step 1: Create necessary directories
echo "📁 Creating directories..."
sudo mkdir -p /etc/iptables
sudo mkdir -p /usr/local/bin

# Step 2: Create restore script
echo "📝 Creating restore script..."
sudo tee /usr/local/bin/restore-iptables.sh << 'RESTORE'
#!/bin/bash
if [ -f /etc/iptables/iptables.rules ]; then
    iptables-restore < /etc/iptables/iptables.rules
    echo "✅ Firewall rules restored"
fi
RESTORE

sudo chmod +x /usr/local/bin/restore-iptables.sh

# Step 3: Add VPN firewall rules
echo "🔐 Adding VPN firewall rules..."
sudo iptables -A INPUT -p udp --dport 51820 -j ACCEPT
sudo iptables -A FORWARD -i wg0 -j ACCEPT
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Step 4: Save rules
echo "💾 Saving firewall rules..."
sudo iptables-save | sudo tee /etc/iptables/iptables.rules

# Step 5: Create systemd service
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/restore-iptables.service << 'SERVICE'
[Unit]
Description=Restore iptables firewall rules
Before=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/restore-iptables.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
SERVICE

# Step 6: Enable and start service
echo "🚀 Enabling service..."
sudo systemctl daemon-reload
sudo systemctl enable restore-iptables.service
sudo systemctl start restore-iptables.service

# Step 7: Verify
echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Service Status:"
sudo systemctl status restore-iptables.service --no-pager
echo ""
echo "🔥 Firewall Rules:"
sudo iptables -L -n -v | grep -E "51820|wg0" || echo "No VPN rules yet"
