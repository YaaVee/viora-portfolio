#!/bin/bash

# Backup first
cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)

# Fix line 1202 - incomplete navigation link
sed -i '1202s/.*/<a href="#" onclick="console.log('\''🏠 Loading home page...'\''); showPage('\''home'\''); document.getElementById('\''js-status'\'').innerText = '\''Home page loaded'\''; return false;" id="nav-home">Home<\/a>/' index.html

# Remove duplicate window.onerror (lines 1251-1254)
sed -i '1251,1254d' index.html

echo "✅ Fixes applied! Original backed up in index.html.backup.*"
