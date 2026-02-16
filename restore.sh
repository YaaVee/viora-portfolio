#!/bin/bash
# Restore from latest backup

LATEST=$(ls -t /home/viora/portfolio-backups/portfolio-*.tar.gz | head -1)
if [ -f "$LATEST" ]; then
    tar -xzf "$LATEST" -C /tmp/
    echo "✅ Restored from: $LATEST"
    echo "Files available in /tmp/viora-portfolio/"
else
    echo "❌ No backup found"
fi
