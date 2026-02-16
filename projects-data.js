// 50 REAL Network Configuration Projects for Your Portfolio
const networkProjects = [
    // ===== FIREWALL CONFIGURATIONS (1-10) =====
    {
        id: 1,
        title: "pfSense Enterprise Firewall",
        category: "network",
        technologies: ["pfSense", "FreeBSD", "VLAN", "OpenVPN"],
        description: "Configured pfSense firewall for a 200-user office with VLAN segmentation, VPN access, and traffic shaping. Implemented failover WAN and captive portal for guest WiFi.",
        github: "https://github.com/YaaVee/pfsense-enterprise-config",
        docker: "pfsense/pfsense:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 2,
        title: "OPNsense with Suricata IDS",
        category: "network",
        technologies: ["OPNsense", "Suricata", "Zenarmor", "FreeBSD"],
        description: "Deployed OPNsense firewall with Suricata intrusion detection, Zenarmor for application control, and geo-IP blocking. Configured automatic threat feed updates.",
        github: "https://github.com/YaaVee/opnsense-ids-setup",
        docker: "opnsense/opnsense:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 3,
        title: "FortiGate Site-to-Site VPN",
        category: "network",
        technologies: ["FortiGate", "IPsec", "FortiOS", "SD-WAN"],
        description: "Configured FortiGate firewalls for site-to-site IPsec VPN between 3 branches. Implemented SD-WAN rules for traffic optimization and failover.",
        github: "https://github.com/YaaVee/fortigate-vpn-cluster",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 4,
        title: "Cisco ASA with AnyConnect VPN",
        category: "network",
        technologies: ["Cisco ASA", "AnyConnect", "RADIUS", "Active Directory"],
        description: "Set up Cisco ASA firewall with AnyConnect SSL VPN for 500 remote users. Integrated with RADIUS for MFA and Active Directory authentication.",
        github: "https://github.com/YaaVee/cisco-asa-anyconnect",
        difficulty: "Advanced",
        duration: "5 days"
    },
    {
        id: 5,
        title: "MikroTik RouterOS Firewall",
        category: "network",
        technologies: ["MikroTik", "RouterOS", "BGP", "OSPF"],
        description: "Configured MikroTik CCR router with firewall rules, NAT, BGP peering, and OSPF dynamic routing. Implemented QoS for VoIP traffic.",
        github: "https://github.com/YaaVee/mikrotik-router-config",
        docker: "mikrotik/routeros:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 6,
        title: "Sophos XG Home Lab",
        category: "network",
        technologies: ["Sophos XG", "UTM", "Web Filter", "IPS"],
        description: "Deployed Sophos XG firewall in home lab with web filtering, application control, and IPS. Configured reverse proxy for internal services.",
        github: "https://github.com/YaaVee/sophos-xg-lab",
        difficulty: "Beginner",
        duration: "1 day"
    },
    {
        id: 7,
        title: "Ubiquiti UniFi Security Gateway",
        category: "network",
        technologies: ["UniFi", "USG", "VLAN", "DPI"],
        description: "Configured UniFi Security Gateway with multiple VLANs, inter-VLAN routing, and deep packet inspection. Set up guest network with captive portal.",
        github: "https://github.com/YaaVee/unifi-network-config",
        docker: "jacobalberty/unifi:latest",
        difficulty: "Beginner",
        duration: "1 day"
    },
    {
        id: 8,
        title: "IPFire with Add-ons",
        category: "network",
        technologies: ["IPFire", "Snort", "OpenVPN", "Guardian"],
        description: "Installed and configured IPFire firewall with Snort IDS, OpenVPN road warrior, and Guardian active response. Set up content filtering for schools.",
        github: "https://github.com/YaaVee/ipfire-hardening",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 9,
        title: "Untangle NG Firewall",
        category: "network",
        technologies: ["Untangle", "Web Filter", "Spam Blocker", "VPN"],
        description: "Deployed Untangle NG firewall with web filter, spam blocker, virus blocker, and intrusion prevention. Configured for small business with 50 users.",
        github: "https://github.com/YaaVee/untangle-business-config",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 10,
        title: "Smoothwall Express",
        category: "network",
        technologies: ["Smoothwall", "Squid", "DansGuardian", "DHCP"],
        description: "Set up Smoothwall Express firewall with Squid proxy, DansGuardian content filter, and DHCP server. Configured for educational environment.",
        github: "https://github.com/YaaVee/smoothwall-education",
        difficulty: "Beginner",
        duration: "1 day"
    },

    // ===== VPN CONFIGURATIONS (11-20) =====
    {
        id: 11,
        title: "WireGuard Site-to-Site VPN",
        category: "vpn",
        technologies: ["WireGuard", "Linux", "IP routing", "NAT"],
        description: "Implemented high-performance WireGuard VPN connecting 5 office locations. Achieved 900 Mbps throughput with minimal latency.",
        github: "https://github.com/YaaVee/wireguard-multisite",
        docker: "linuxserver/wireguard:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 12,
        title: "OpenVPN Access Server",
        category: "vpn",
        technologies: ["OpenVPN", "LDAP", "MFA", "AWS"],
        description: "Deployed OpenVPN Access Server on AWS with LDAP integration and MFA. Configured for 1000+ concurrent users with load balancing.",
        github: "https://github.com/YaaVee/openvpn-aws-cluster",
        docker: "openvpn/openvpn-as:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 13,
        title: "IPsec VPN with StrongSwan",
        category: "vpn",
        technologies: ["StrongSwan", "IPsec", "IKEv2", "EAP-MSCHAPv2"],
        description: "Configured StrongSwan IPsec VPN server with IKEv2 and EAP-MSCHAPv2 authentication. Set up for both Windows and macOS clients.",
        github: "https://github.com/YaaVee/strongswan-ikev2",
        docker: "strongswan/strongswan:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 14,
        title: "SoftEther VPN Multi-protocol",
        category: "vpn",
        technologies: ["SoftEther", "L2TP/IPsec", "OpenVPN", "MS-SSTP"],
        description: "Set up SoftEther VPN server supporting L2TP/IPsec, OpenVPN, and MS-SSTP simultaneously. Configured clustering for high availability.",
        github: "https://github.com/YaaVee/softether-multiprotocol",
        docker: "siomiz/softethervpn:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 15,
        title: "ZeroTier SD-WAN",
        category: "vpn",
        technologies: ["ZeroTier", "SD-WAN", "VLAN", "Routing"],
        description: "Deployed ZeroTier SD-WAN to connect 50+ IoT devices across 10 sites. Implemented flow rules and VLAN segmentation.",
        github: "https://github.com/YaaVee/zerotier-iot-mesh",
        docker: "zerotier/zerotier:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 16,
        title: "Tailscale Mesh VPN",
        category: "vpn",
        technologies: ["Tailscale", "WireGuard", "ACLs", "MagicDNS"],
        description: "Implemented Tailscale mesh VPN for remote team access. Configured ACLs for fine-grained access control and MagicDNS for service discovery.",
        github: "https://github.com/YaaVee/tailscale-team-access",
        docker: "tailscale/tailscale:latest",
        difficulty: "Beginner",
        duration: "1 day"
    },
    {
        id: 17,
        title: "Nebula Mesh Network",
        category: "vpn",
        technologies: ["Nebula", "Certificate management", "Lighthouse nodes"],
        description: "Deployed Slack's Nebula mesh VPN for secure server-to-server communication. Set up lighthouse nodes in multiple regions for low latency.",
        github: "https://github.com/YaaVee/nebula-mesh-lighthouse",
        docker: "nebula/nebula:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 18,
        title: "Tinc VPN Mesh",
        category: "vpn",
        technologies: ["Tinc", "Mesh VPN", "Cryptography", "Routing"],
        description: "Configured Tinc VPN mesh for secure communication between Docker containers across multiple hosts. Implemented automatic route updates.",
        github: "https://github.com/YaaVee/tinc-docker-mesh",
        docker: "tinc/tinc:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 19,
        title: "Algo VPN Server",
        category: "vpn",
        technologies: ["Algo", "WireGuard", "IPsec", "Cloud deployment"],
        description: "Deployed Algo VPN server on DigitalOcean with WireGuard and IPsec. Configured for personal privacy and secure browsing.",
        github: "https://github.com/YaaVee/algo-cloud-vpn",
        difficulty: "Beginner",
        duration: "1 day"
    },
    {
        id: 20,
        title: "Pritunl Enterprise VPN",
        category: "vpn",
        technologies: ["Pritunl", "MongoDB", "VPC", "SSO"],
        description: "Set up Pritunl VPN cluster with MongoDB replication. Integrated with Google SSO and configured VPC peering for cloud resources.",
        github: "https://github.com/YaaVee/pritunl-enterprise-cluster",
        docker: "pritunl/pritunl:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },

    // ===== LOAD BALANCER CONFIGURATIONS (21-25) =====
    {
        id: 21,
        title: "HAProxy with Let's Encrypt",
        category: "loadbalancer",
        technologies: ["HAProxy", "Let's Encrypt", "SSL termination", "ACME"],
        description: "Configured HAProxy as reverse proxy with automatic Let's Encrypt SSL certificate renewal. Load balanced 10 backend web servers.",
        github: "https://github.com/YaaVee/haproxy-letsencrypt-docker",
        docker: "haproxy:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 22,
        title: "Nginx Load Balancer",
        category: "loadbalancer",
        technologies: ["Nginx", "Round-robin", "Health checks", "Caching"],
        description: "Set up Nginx as load balancer for microservices architecture. Implemented health checks, session persistence, and response caching.",
        github: "https://github.com/YaaVee/nginx-microservices-lb",
        docker: "nginx:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 23,
        title: "Traefik with Docker Swarm",
        category: "loadbalancer",
        technologies: ["Traefik", "Docker Swarm", "Let's Encrypt", "Middleware"],
        description: "Deployed Traefik as edge router for Docker Swarm cluster. Configured automatic service discovery and rate limiting middleware.",
        github: "https://github.com/YaaVee/traefik-swarm-config",
        docker: "traefik:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 24,
        title: "Envoy Proxy Mesh",
        category: "loadbalancer",
        technologies: ["Envoy", "Service mesh", "gRPC", "Observability"],
        description: "Implemented Envoy proxy as sidecar in service mesh. Configured circuit breaking, retries, and distributed tracing.",
        github: "https://github.com/YaaVee/envoy-service-mesh",
        docker: "envoyproxy/envoy:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 25,
        title: "Keepalived + HAProxy HA",
        category: "loadbalancer",
        technologies: ["Keepalived", "HAProxy", "VRRP", "Failover"],
        description: "Set up high availability load balancer with Keepalived VRRP and HAProxy. Achieved sub-second failover for critical applications.",
        github: "https://github.com/YaaVee/keepalived-haproxy-ha",
        docker: "haproxy:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },

    // ===== IDS/IPS CONFIGURATIONS (26-30) =====
    {
        id: 26,
        title: "Snort IDS with Barnyard2",
        category: "ids",
        technologies: ["Snort", "Barnyard2", "MySQL", "BASE"],
        description: "Deployed Snort IDS with Barnyard2 for database output. Set up BASE web interface for alert analysis and reporting.",
        github: "https://github.com/YaaVee/snort-ids-lab",
        docker: "linuxserver/snort:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 27,
        title: "Suricata with ELK Stack",
        category: "ids",
        technologies: ["Suricata", "Elasticsearch", "Logstash", "Kibana"],
        description: "Integrated Suricata IDS with ELK stack for real-time visualization. Created custom dashboards for threat hunting.",
        github: "https://github.com/YaaVee/suricata-elk-docker",
        docker: "jasonish/suricata:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 28,
        title: "Zeek (Bro) Network Monitor",
        category: "ids",
        technologies: ["Zeek", "Jupyter", "Python", "Threat Intelligence"],
        description: "Configured Zeek network monitoring framework with Python scripts for threat intelligence enrichment. Analyzed PCAPs in Jupyter.",
        github: "https://github.com/YaaVee/zeek-threat-hunting",
        docker: "zeek/zeek:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 29,
        title: "Wazuh SIEM + IDS",
        category: "ids",
        technologies: ["Wazuh", "Elastic Stack", "FIM", "SCA"],
        description: "Deployed Wazuh SIEM with file integrity monitoring and security configuration assessment. Integrated with The Hive for case management.",
        github: "https://github.com/YaaVee/wazuh-siem-docker",
        docker: "wazuh/wazuh:latest",
        difficulty: "Advanced",
        duration: "5 days"
    },
    {
        id: 30,
        title: "Security Onion",
        category: "ids",
        technologies: ["Security Onion", "ELK", "Zeek", "Suricata", "Strelka"],
        description: "Deployed Security Onion for enterprise network monitoring. Configured Zeek, Suricata, and Strelka file analysis.",
        github: "https://github.com/YaaVee/security-onion-lab",
        difficulty: "Advanced",
        duration: "4 days"
    },

    // ===== ROUTING CONFIGURATIONS (31-35) =====
    {
        id: 31,
        title: "BGP Peering with FRRouting",
        category: "routing",
        technologies: ["FRRouting", "BGP", "OSPF", "VXLAN"],
        description: "Configured FRRouting for BGP peering with upstream ISPs. Implemented VXLAN for network virtualization.",
        github: "https://github.com/YaaVee/frr-bgp-lab",
        docker: "frrouting/frr:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 32,
        title: "OSPF Multi-area Design",
        category: "routing",
        technologies: ["OSPF", "Quagga", "Area design", "Route summarization"],
        description: "Designed and implemented OSPF multi-area network with route summarization and stub areas. Tested convergence times.",
        github: "https://github.com/YaaVee/ospf-multiarea-gns3",
        difficulty: "Intermediate",
        duration: "3 days"
    },
    {
        id: 33,
        title: "VXLAN + EVPN Fabric",
        category: "routing",
        technologies: ["VXLAN", "EVPN", "BGP", "Cumulus Linux"],
        description: "Built VXLAN EVPN fabric using Cumulus Linux. Implemented anycast gateway and automated with Ansible.",
        github: "https://github.com/YaaVee/vxlan-evpn-fabric",
        difficulty: "Expert",
        duration: "1 week"
    },
    {
        id: 34,
        title: "Policy-Based Routing",
        category: "routing",
        technologies: ["PBR", "Linux", "iptables", "iproute2"],
        description: "Implemented policy-based routing on Linux to route specific traffic through VPN. Set up multiple routing tables and rules.",
        github: "https://github.com/YaaVee/linux-pbr-config",
        docker: "alpine:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 35,
        title: "Multicast Routing with PIM",
        category: "routing",
        technologies: ["PIM", "IGMP", "Multicast", "Video streaming"],
        description: "Configured Protocol Independent Multicast for IPTV distribution. Set up RP and IGMP snooping.",
        github: "https://github.com/YaaVee/pim-multicast-lab",
        difficulty: "Expert",
        duration: "5 days"
    },

    // ===== NETWORK AUTOMATION (36-40) =====
    {
        id: 36,
        title: "Ansible Network Automation",
        category: "automation",
        technologies: ["Ansible", "Cisco IOS", "Jinja2", "NAPALM"],
        description: "Automated network device configuration with Ansible. Created playbooks for backup, compliance checks, and config push.",
        github: "https://github.com/YaaVee/ansible-network-automation",
        docker: "ansible/ansible:latest",
        difficulty: "Intermediate",
        duration: "3 days"
    },
    {
        id: 37,
        title: "Python Netmiko Scripts",
        category: "automation",
        technologies: ["Python", "Netmiko", "Multi-vendor", "Network inventory"],
        description: "Developed Python scripts using Netmiko to automate multi-vendor network device management. Built network inventory system.",
        github: "https://github.com/YaaVee/netmiko-multivendor",
        docker: "python:3.9",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 38,
        title: "NAPALM Network Automation",
        category: "automation",
        technologies: ["NAPALM", "Python", "Juniper", "Arista", "Cisco"],
        description: "Used NAPALM for multi-vendor network automation. Implemented configuration replace, rollback, and compliance validation.",
        github: "https://github.com/YaaVee/napalm-network-automation",
        docker: "python:3.9",
        difficulty: "Intermediate",
        duration: "3 days"
    },
    {
        id: 39,
        title: "SaltStack Network Config",
        category: "automation",
        technologies: ["SaltStack", "Network automation", "Jinja", "Grains"],
        description: "Deployed SaltStack for network device management. Created state files for consistent configuration across 100+ devices.",
        github: "https://github.com/YaaVee/saltstack-network-states",
        docker: "saltstack/salt:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 40,
        title: "GitOps for Network Config",
        category: "automation",
        technologies: ["GitLab CI", "Terraform", "Network as Code", "Validation"],
        description: "Implemented GitOps pipeline for network configuration using GitLab CI. Automated validation and deployment with Terraform.",
        github: "https://github.com/YaaVee/gitops-network-ci",
        difficulty: "Advanced",
        duration: "5 days"
    },

    // ===== CONTAINER NETWORKING (41-45) =====
    {
        id: 41,
        title: "Docker Overlay Networks",
        category: "containers",
        technologies: ["Docker", "Overlay networks", "Swarm", "Encryption"],
        description: "Set up Docker overlay networks across multiple hosts with encryption. Implemented network policies and load balancing.",
        github: "https://github.com/YaaVee/docker-overlay-multihost",
        docker: "docker:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },
    {
        id: 42,
        title: "Kubernetes Network Policies",
        category: "containers",
        technologies: ["Kubernetes", "Calico", "Network policies", "RBAC"],
        description: "Implemented Calico network policies for Kubernetes. Created fine-grained isolation between microservices.",
        github: "https://github.com/YaaVee/k8s-calico-policies",
        docker: "calico/node:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 43,
        title: "Cilium Service Mesh",
        category: "containers",
        technologies: ["Cilium", "eBPF", "Service mesh", "Hubble"],
        description: "Deployed Cilium for Kubernetes networking and observability. Configured Hubble for service dependency graphs.",
        github: "https://github.com/YaaVee/cilium-ebpf-mesh",
        docker: "cilium/cilium:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 44,
        title: "Istio Multi-cluster Mesh",
        category: "containers",
        technologies: ["Istio", "Multi-cluster", "mTLS", "Gateway"],
        description: "Set up Istio service mesh across multiple Kubernetes clusters. Implemented mTLS and cross-cluster load balancing.",
        github: "https://github.com/YaaVee/istio-multicluster",
        difficulty: "Expert",
        duration: "1 week"
    },
    {
        id: 45,
        title: "Weave Net for Docker",
        category: "containers",
        technologies: ["Weave Net", "Docker", "Network policies", "Encryption"],
        description: "Deployed Weave Net for Docker container networking. Configured network policies and encryption across hosts.",
        github: "https://github.com/YaaVee/weave-net-docker",
        docker: "weaveworks/weave:latest",
        difficulty: "Intermediate",
        duration: "2 days"
    },

    // ===== SDN & NFV (46-50) =====
    {
        id: 46,
        title: "Open vSwitch with OpenFlow",
        category: "sdn",
        technologies: ["Open vSwitch", "OpenFlow", "SDN", "Mininet"],
        description: "Configured Open vSwitch with OpenFlow controllers. Created custom SDN topology in Mininet with flow rules.",
        github: "https://github.com/YaaVee/ovs-openflow-lab",
        docker: "openshift/ovs:latest",
        difficulty: "Advanced",
        duration: "3 days"
    },
    {
        id: 47,
        title: "ONOS SDN Controller",
        category: "sdn",
        technologies: ["ONOS", "SDN", "OpenFlow", "Fabric"],
        description: "Deployed ONOS SDN controller with OpenFlow switches. Implemented reactive forwarding and network virtualization.",
        github: "https://github.com/YaaVee/onos-sdn-lab",
        docker: "onosproject/onos:latest",
        difficulty: "Advanced",
        duration: "4 days"
    },
    {
        id: 48,
        title: "OpenDaylight SDN Platform",
        category: "sdn",
        technologies: ["OpenDaylight", "MD-SAL", "YANG", "OpenFlow"],
        description: "Set up OpenDaylight SDN controller with MD-SAL. Developed custom YANG models for network services.",
        github: "https://github.com/YaaVee/opendaylight-custom-app",
        docker: "opendaylight/odl:latest",
        difficulty: "Expert",
        duration: "1 week"
    },
    {
        id: 49,
        title: "P4 Programmable Switches",
        category: "sdn",
        technologies: ["P4", "BMv2", "Switch architecture", "Data plane"],
        description: "Programmed P4 switch for custom packet processing. Implemented in-band network telemetry (INT).",
        github: "https://github.com/YaaVee/p4-switch-programming",
        docker: "p4lang/behavioral-model:latest",
        difficulty: "Expert",
        duration: "2 weeks"
    },
    {
        id: 50,
        title: "NFV with OpenStack",
        category: "sdn",
        technologies: ["OpenStack", "NFV", "Tacker", "VNF"],
        description: "Deployed OpenStack Tacker for VNF orchestration. Automated deployment of virtual firewalls and routers.",
        github: "https://github.com/YaaVee/openstack-nfv-tacker",
        difficulty: "Expert",
        duration: "2 weeks"
    }
];

module.exports = networkProjects;
