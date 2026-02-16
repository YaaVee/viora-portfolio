#!/bin/bash
# Firewall management for VPN

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

case $1 in
    save)
        echo -e "${BLUE} Saving firewall rules...${NC}"
        sudo iptables-save | sudo tee /etc/iptables/iptables.rules
        echo -e "${GREEN} Rules saved${NC}"
        ;;
    restore)
        echo -e "${BLUE} Restoring firewall rules...${NC}"
        sudo iptables-restore < /etc/iptables/iptables.rules
        echo -e "${GREEN} Rules restored${NC}"
        ;;
    status)
        echo -e "${BLUE}📊 Firewall Status:${NC}"
        sudo iptables -L -n -v | head -20
        ;;
    vpn-rules)
        echo -e "${BLUE} VPN Specific Rules:${NC}"
        sudo iptables -L -n -v | grep -E "51820|wg0" || echo "No VPN rules found"
        ;;
    add-vpn)
        echo -e "${BLUE} Adding VPN rules...${NC}"
        sudo iptables -A INPUT -p udp --dport 51820 -j ACCEPT
        sudo iptables -A FORWARD -i wg0 -j ACCEPT
        sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
        echo -e "${GREEN} VPN rules added${NC}"
        ./firewall-manager.sh save
        ;;
    clear)
        echo -e "${RED}  Clearing all rules...${NC}"
        sudo iptables -F
        sudo iptables -t nat -F
        sudo iptables -X
        sudo iptables -P INPUT ACCEPT
        sudo iptables -P FORWARD ACCEPT
        sudo iptables -P OUTPUT ACCEPT
        echo -e "${GREEN} Rules cleared${NC}"
        ;;
    *)
        echo "Usage: $0 {save|restore|status|vpn-rules|add-vpn|clear}"
        echo ""
        echo "  save        - Save current rules to file"
        echo "  restore     - Restore rules from file"
        echo "  status      - Show current rules"
        echo "  vpn-rules   - Show VPN-specific rules"
        echo "  add-vpn     - Add VPN rules and save"
        echo "  clear       - Clear all rules (caution!)"
        ;;
esac
