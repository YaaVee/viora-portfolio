#!/bin/bash
# Check Vercel deployment status

if [ -z "$1" ]; then
    echo "Usage: $0 <deployment-url>"
    echo "Example: $0 viora-portfolio.vercel.app"
    exit 1
fi

URL=$1
echo "🔍 Checking deployment status for $URL..."

# Check if site is responding
if curl -s -o /dev/null -w "%{http_code}" "https://$URL" | grep -q "200"; then
    echo "✅ Site is live and responding!"
    
    # Get response time
    TIME=$(curl -o /dev/null -s -w "Time: %{time_total}s\n" "https://$URL")
    echo "⏱️  Response $TIME"
    
    # Check SSL certificate
    echo "🔒 Checking SSL..."
    echo | openssl s_client -connect "$URL:443" -servername "$URL" 2>/dev/null | openssl x509 -noout -dates | grep -E 'notBefore|notAfter'
else
    echo "❌ Site is not responding"
fi
