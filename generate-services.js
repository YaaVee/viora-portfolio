// Generate 70+ more services programmatically
const categories = [
    {
        prefix: "Network Security",
        titles: [
            "BGP Security & Route Filtering",
            "DNS Security with DNSSEC",
            "Network TAP & Packet Broker Deployment",
            "Encrypted Traffic Analysis",
            "Network Detection & Response (NDR)",
            "Operational Technology (OT) Security",
            "SCADA Network Protection",
            "VoIP & UC Security",
            "Load Balancer Security",
            "CDN Security Configuration",
            "Anycast Network Implementation",
            "IPv6 Security Transition",
            "Network Time Protocol (NTP) Security",
            "DHCP Security & Snooping",
            "MACsec Encryption Implementation",
            "VXLAN Security Design",
            "EVPN Deployment with Security",
            "Network Automation with Ansible",
            "NetDevOps Implementation",
            "Cisco DNA Security Center"
        ],
        whys: [
            "Because BGP hijacks can reroute traffic through attacker-controlled networks.",
            "Because DNS poisoning attacks redirect users to malicious sites.",
            "Because you need complete network visibility for threat detection.",
            "Because 70% of attacks now use encryption to hide.",
            "Because attacks move laterally in minutes - you need real-time detection."
        ],
        tools: [
            "BGP monitoring with ThousandEyes",
            "DNS filters with Umbrella/OpenDNS",
            "Gigamon/Napatech packet brokers",
            "ExtraHop/Corelight NDR platforms",
            "Nozomi/Claroty for OT security"
        ]
    },
    {
        prefix: "Cloud Security",
        titles: [
            "AWS Control Tower Security Controls",
            "Azure Blueprints Security Implementation",
            "GCP Organization Policy Setup",
            "Terraform Cloud Security Scanning",
            "Crossplane Security Configuration",
            "Cloud Cost & Security Optimization",
            "Spot Instance Security Configuration",
            "Cloud Marketplace Security Assessment",
            "SaaS Application Security Assessment",
            "Salesforce Security Hardening",
            "Office 365 Security Configuration",
            "Google Workspace Security Setup",
            "Cloud Identity Governance",
            "Workload Identity Federation",
            "Cloud KMS Implementation",
            "HSM Integration with Cloud",
            "Confidential Computing Deployment",
            "Enclave Security Configuration",
            "Secure Enclave for Sensitive Data",
            "Homomorphic Encryption Assessment"
        ],
        whys: [
            "Because cloud security is a shared responsibility - don't leave it to chance.",
            "Because identity is the new perimeter in the cloud.",
            "Because encryption stops breaches even if data is stolen.",
            "Because cloud APIs need protection from abuse.",
            "Because serverless functions are high-risk attack surfaces."
        ],
        tools: [
            "HashiCorp Sentinel for policy",
            "Bridgecrew/Checkov for IaC",
            "Skyhigh/CASB for SaaS",
            "Fortanix for confidential computing",
            "AWS Nitro Enclaves"
        ]
    },
    {
        prefix: "DevSecOps",
        titles: [
            "CI/CD Pipeline Security",
            "GitHub Advanced Security Implementation",
            "GitLab Security Scanning Integration",
            "Jenkins Pipeline Security Hardening",
            "Artifact Repository Security (JFrog)",
            "Container Registry Security Scanning",
            "Software Bill of Materials (SBOM) Generation",
            "Supply Chain Security with SLSA",
            "Code Signing Implementation",
            "Dependency Scanning & Management",
            "SAST Tool Implementation (SonarQube)",
            "DAST Tool Implementation (OWASP ZAP)",
            "SCA Tool Integration (Snyk)",
            "Secrets Scanning in Repositories",
            "Pre-commit Hooks for Security",
            "Security Champions Program Setup",
            "Threat Modeling in Agile",
            "Security Gates in CI/CD",
            "Infrastructure as Code Security",
            "Policy as Code with OPA"
        ],
        whys: [
            "Because shifting left reduces remediation costs by 100x.",
            "Because vulnerabilities in code become breaches in production.",
            "Because developer velocity shouldn't compromise security.",
            "Because supply chain attacks are the #1 modern threat vector.",
            "Because security gates prevent vulnerable code from reaching production."
        ],
        tools: [
            "Snyk/Dependabot for dependencies",
            "SonarQube/Checkmarx for SAST",
            "OWASP ZAP/Burp for DAST",
            "Open Policy Agent (OPA)",
            "in-toto for supply chain"
        ]
    },
    {
        prefix: "Compliance",
        titles: [
            "PCI DSS v4.0 Implementation",
            "HIPAA Security Rule Compliance",
            "GDPR Data Protection Implementation",
            "SOC 2 Type II Preparation",
            "ISO 27001 Implementation & Certification",
            "NIST Cybersecurity Framework Adoption",
            "FedRAMP Compliance Preparation",
            "CMMC Level 2/3 Implementation",
            "SOX IT General Controls",
            "FISMA Compliance for Federal Systems",
            "HITRUST CSF Certification Support",
            "NYDFS Cybersecurity Regulation",
            "CCPA/CPRA Compliance Program",
            "LGPD Compliance Implementation",
            "MAS TRM for Financial Services",
            "APRA CPS 234 Compliance",
            "Cyber Essentials Plus Certification",
            "Essential Eight Implementation (Australia)",
            "CSA STAR Attestation",
            "FTC Safeguards Rule Compliance"
        ],
        whys: [
            "Because non-compliance fines can reach 4% of global revenue.",
            "Because audit failures destroy customer trust and stock price.",
            "Because compliance frameworks provide security best practices.",
            "Because proving compliance is as important as being secure.",
            "Because regulatory requirements are now mandatory, not optional."
        ],
        tools: [
            "Vanta/Drata for automation",
            "Tugboat Logic/Compliance.ai",
            "AWS Artifact/Azure Compliance Manager",
            "Scytals/ComplianceScorecard",
            "StandardFusion/LogicManager"
        ]
    },
    {
        prefix: "Identity & Access",
        titles: [
            "Zero Standing Privileges Implementation",
            "Privileged Access Management (PAM)",
            "Identity Governance & Administration (IGA)",
            "Customer Identity & Access Management (CIAM)",
            "Identity Threat Detection & Response (ITDR)",
            "Multi-factor Authentication (MFA) Hardening",
            "Passwordless Authentication Implementation",
            "FIDO2/WebAuthn Deployment",
            "Biometric Authentication Integration",
            "Federated Identity (SAML/OIDC) Setup",
            "SCIM Provisioning Implementation",
            "Role-Based Access Control (RBAC) Design",
            "Attribute-Based Access Control (ABAC)",
            "Dynamic Authorization with Policy Engines",
            "Identity Verification & KYC Integration",
            "Privileged Session Management",
            "Just-in-Time (JIT) Access",
            "Access Certification Campaigns",
            "Identity Analytics & Reporting",
            "Entra ID (Azure AD) Security Hardening"
        ],
        whys: [
            "Because 80% of breaches involve compromised credentials.",
            "Because privileged accounts are the crown jewels for attackers.",
            "Because MFA blocks 99.9% of account takeover attacks.",
            "Because customers expect secure, seamless login experiences.",
            "Because identity is the new perimeter in modern IT."
        ],
        tools: [
            "CyberArk/BeyondTrust PAM",
            "Okta/Ping Identity SSO",
            "SailPoint/Saviynt IGA",
            "Silverfort/Illusive ITDR",
            "YubiKey/Token2 for FIDO2"
        ]
    }
];

// Generate 100+ services total (we have ~30 already, need 70+ more)
let allServices = [];
let id = 31;

// Generate 80 services (to exceed 100)
for (let i = 0; i < 80; i++) {
    const category = categories[i % categories.length];
    const titleIndex = i % category.titles.length;
    const whyIndex = i % category.whys.length;
    
    // Create 8 implementation bullets
    const bullets = [
        `${category.tools[i % category.tools.length]} deployment with best practices`,
        `Integration with existing ${category.prefix.toLowerCase()} infrastructure`,
        `Automated ${category.prefix.toLowerCase()} policy enforcement`,
        `${category.prefix} monitoring and alerting configuration`,
        `Security hardening based on ${category.prefix} benchmarks`,
        `Documentation and runbook creation for operations`,
        `Knowledge transfer and team training sessions`,
        `Post-implementation security testing and validation`
    ];
    
    // Randomize bullets a bit
    const shuffled = [...bullets].sort(() => 0.5 - Math.random());
    
    allServices.push({
        title: category.titles[titleIndex],
        why: `Why implement ${category.titles[titleIndex]}? ${category.whys[whyIndex]} This service provides comprehensive ${category.prefix.toLowerCase()} protection with measurable security outcomes and business alignment.`,
        what: shuffled.slice(0, 8),
        results: `Results: 95% improvement in ${category.prefix.toLowerCase()} security posture, 80% reduction in related incidents, 60% faster audit preparation, and compliance with industry standards. Business impact: risk reduction and operational efficiency.`
    });
}

console.log(JSON.stringify(allServices, null, 2));
