#!/bin/bash
# Automatic backup system - runs every hour

BACKUP_DIR="/home/viora/portfolio-backups"
mkdir -p $BACKUP_DIR

# Backup with timestamp
tar -czf "$BACKUP_DIR/portfolio-$(date +%Y%m%d-%H%M%S).tar.gz" \
    --exclude="node_modules" \
    --exclude=".git" \
    /home/viora/viora-portfolio

# Keep only last 24 backups (24 hours)
ls -t $BACKUP_DIR/portfolio-*.tar.gz | tail -n +25 | xargs -r rm

echo "✅ Backup completed at $(date)" >> $BACKUP_DIR/backup.log
