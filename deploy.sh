#!/bin/bash
# Quick deployment script

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying to GitHub and Vercel...${NC}"

# Git commands
git add .
git commit -m "Update: $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

echo -e "${GREEN}✅ Pushed to GitHub${NC}"
echo -e "${BLUE}⏱️  Vercel will auto-deploy in a few seconds${NC}"
echo -e "${GREEN}🌐 Live at: https://viora-portfolio.vercel.app${NC}"
