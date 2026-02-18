#!/bin/bash

# Telegram bot configuration
BOT_TOKEN="YOUR_BOT_TOKEN"
CHAT_ID="YOUR_CHAT_ID"

send_notification() {
    local message="$1"
    curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
        -d chat_id="$CHAT_ID" \
        -d text="$message" \
        -d parse_mode="HTML"
}

case "$1" in
    "deploy")
        send_notification "🚀 <b>Deployment Started</b>\nRepo: viora-portfolio\nTime: $(date)"
        ;;
    "success")
        COMMIT=$(git log -1 --pretty=%B)
        send_notification "✅ <b>Deployment Successful</b>\nCommit: $COMMIT\nTime: $(date)"
        ;;
    "fail")
        send_notification "❌ <b>Deployment Failed</b>\nCheck logs for details\nTime: $(date)"
        ;;
    "backup")
        send_notification "💾 <b>Backup Complete</b>\nBackup: backup-$(date +%Y%m%d)\nSize: $(du -sh . | cut -f1)"
        ;;
esac
