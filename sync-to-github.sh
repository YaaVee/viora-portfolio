#!/bin/bash

# Sync projects to GitHub
echo " Syncing projects to GitHub..."

# Your GitHub username
GITHUB_USER="YaaVee"

# Create all project repos
projects=(
    "pfsense-enterprise-config"
    "opnsense-ids-setup"
    "fortigate-vpn-cluster"
    "cisco-asa-anyconnect"
    "mikrotik-router-config"
    "wireguard-multisite"
    "openvpn-aws-cluster"
    "strongswan-ikev2"
    "haproxy-letsencrypt-docker"
    "nginx-microservices-lb"
    "traefik-swarm-config"
    "snort-ids-lab"
    "suricata-elk-docker"
    "zeek-threat-hunting"
    "wazuh-siem-docker"
    "ansible-network-automation"
    "netmiko-multivendor"
    "docker-overlay-multihost"
    "k8s-calico-policies"
    "cilium-ebpf-mesh"
)

for project in "${projects[@]}"; do
    echo "📦 Processing $project..."
    
    # Create repo directory
    mkdir -p ~/github/$project
    cd ~/github/$project
    
    # Create README
    cat > README.md << README_EOF
# $project

## 📋 Overview
Network configuration project for $project.

## 🚀 Quick Start
\`\`\`bash
git clone https://github.com/$GITHUB_USER/$project.git
cd $project
# Follow setup instructions
\`\`\`

## 🐳 Docker Support
\`\`\`bash
docker run -d --name $project [options]
\`\`\`

## 📚 Documentation
See [docs](./docs) for detailed configuration guides.

## 🛠️ Technologies
- Network: $(echo $project | tr '-' ' ')
- Automation: Ansible/Python
- Container: Docker

## 📝 License
MIT
README_EOF

    # Create basic config files
    mkdir -p config docs
    
    # Initialize git
    git init
    git add .
    git commit -m "Initial commit for $project"
    
    # Add to GitHub (requires GitHub CLI or token)
    echo "✅ Ready for GitHub: $project"
    echo "   Run: gh repo create $GITHUB_USER/$project --public --source=."
done

echo "✅ All projects prepared for GitHub!"
echo "Next steps:"
echo "1. Install GitHub CLI: sudo apt install gh"
echo "2. Login: gh auth login"
echo "3. Run this script again to push"
