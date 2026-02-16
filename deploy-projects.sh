#!/bin/bash

# Network Projects Deployment Script
echo "🚀 Network Projects Deployment Tool"
echo "===================================="

show_menu() {
    echo ""
    echo "Select project to deploy:"
    echo "1) pfSense Firewall Lab"
    echo "2) OPNsense with Suricata"
    echo "3) WireGuard VPN Server"
    echo "4) OpenVPN Access Server"
    echo "5) HAProxy Load Balancer"
    echo "6) Traefik with Docker"
    echo "7) Suricata IDS"
    echo "8) Snort IDS"
    echo "9) Open vSwitch SDN"
    echo "10) Deploy ALL (Docker Compose)"
    echo "11) Deploy to GitHub"
    echo "0) Exit"
    echo ""
    read -p "Choice: " choice
}

deploy_docker() {
    local service=$1
    echo "🐳 Deploying $service..."
    docker-compose -f docker-compose.projects.yml up -d $service
    echo "✅ $service deployed!"
}

deploy_github() {
    echo "📦 Preparing GitHub deployment..."
    mkdir -p ~/github-projects
    cd ~/github-projects
    
    # Clone all project repos
    echo "Cloning project repositories..."
    projects=(
        "pfsense-enterprise-config"
        "wireguard-multisite"
        "haproxy-letsencrypt-docker"
        "suricata-elk-docker"
        "k8s-calico-policies"
    )
    
    for project in "${projects[@]}"; do
        if [ ! -d "$project" ]; then
            git clone "https://github.com/YaaVee/$project.git"
            echo "✅ Cloned $project"
        fi
    done
    
    echo "✅ Projects ready for GitHub"
}

while true; do
    show_menu
    case $choice in
        1) deploy_docker "pfsense-lab" ;;
        2) deploy_docker "opnsense-lab" ;;
        3) deploy_docker "wireguard-lab" ;;
        4) deploy_docker "openvpn-lab" ;;
        5) deploy_docker "haproxy-lab" ;;
        6) deploy_docker "traefik-lab" ;;
        7) deploy_docker "suricata-lab" ;;
        8) deploy_docker "snort-lab" ;;
        9) deploy_docker "ovs-lab" ;;
        10) docker-compose -f docker-compose.projects.yml up -d ;;
        11) deploy_github ;;
        0) exit 0 ;;
        *) echo "Invalid choice" ;;
    esac
done
