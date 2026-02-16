// Add this to your showPage function for 'projects'
// This replaces the placeholder with real GitHub links

function updateProjectsPageWithRealLinks() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const projectId = index + 1;
        const projectName = getProjectNameFromId(projectId);
        
        // Update GitHub link to real repository
        const githubLink = card.querySelector('.project-link[href*="github"]');
        if (githubLink) {
            githubLink.href = `https://github.com/YaaVee/${projectName}`;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
        }
        
        // Update deploy button to show real deployment
        const deployBtn = card.querySelector('.project-link:last-child');
        if (deployBtn) {
            deployBtn.onclick = (e) => {
                e.preventDefault();
                window.open(`https://github.com/YaaVee/${projectName}#quick-start`, '_blank');
            };
        }
    });
}

function getProjectNameFromId(id) {
    const projects = [
        "pfsense-enterprise-config",
        "opnsense-ids-setup",
        "fortigate-vpn-cluster",
        "cisco-asa-anyconnect",
        "mikrotik-router-config",
        "sophos-xg-lab",
        "unifi-network-config",
        "ipfire-hardening",
        "untangle-business-config",
        "smoothwall-education",
        "wireguard-multisite",
        "openvpn-aws-cluster",
        "strongswan-ikev2",
        "softether-multiprotocol",
        "zerotier-iot-mesh",
        "tailscale-team-access",
        "nebula-mesh-lighthouse",
        "tinc-docker-mesh",
        "algo-cloud-vpn",
        "pritunl-enterprise-cluster",
        "haproxy-letsencrypt-docker",
        "nginx-microservices-lb",
        "traefik-swarm-config",
        "envoy-service-mesh",
        "keepalived-haproxy-ha",
        "snort-ids-lab",
        "suricata-elk-docker",
        "zeek-threat-hunting",
        "wazuh-siem-docker",
        "security-onion-lab",
        "frr-bgp-lab",
        "ospf-multiarea-gns3",
        "vxlan-evpn-fabric",
        "linux-pbr-config",
        "pim-multicast-lab",
        "ansible-network-automation",
        "netmiko-multivendor",
        "napalm-network-automation",
        "saltstack-network-states",
        "gitops-network-ci",
        "docker-overlay-multihost",
        "k8s-calico-policies",
        "cilium-ebpf-mesh",
        "istio-multicluster",
        "weave-net-docker",
        "ovs-openflow-lab",
        "onos-sdn-lab",
        "opendaylight-custom-app",
        "p4-switch-programming",
        "openstack-nfv-tacker"
    ];
    return projects[id - 1] || `project-${id}`;
}

// Add this to your existing showPage function
// After loading projects page content, call:
// setTimeout(updateProjectsPageWithRealLinks, 100);
