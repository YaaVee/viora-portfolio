#!/bin/bash
# Backup firewall rules

BACKUP_DIR="/home/viora/portfolio-backups/firewall"
mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d-%H%M%S)
sudo iptables-save > "$BACKUP_DIR/iptables-$DATE.rules"

# Keep only last 10 backups
cd "$BACKUP_DIR"
ls -t iptables-*.rules | tail -n +11 | xargs -r rm

echo "✅ Firewall rules backed up to $BACKUP_DIR/iptables-$DATE.rules"
