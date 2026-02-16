// Sample services data for testing
const cloudSecurityServices = [
    {
        id: "cloud1",
        category: "cloud",
        name: "AWS IAM Hardening",
        price: "4,500 - 25,000",
        description: "Implementation of least-privilege access policies, IAM role analysis, permission boundary configuration.",
        technologies: "AWS IAM, CloudTrail, Lambda, AWS Config"
    }
];

const networkSecurityServices = [];
const aiServices = [];
const webDevServices = [];
const spreadsheetServices = [];
const devsecopsServices = [];

const allServices = [...cloudSecurityServices];

const caseStudies = [
    {
        id: 1,
        client: "Confidential Bank",
        industry: "Banking",
        project: "Core Banking SQL Injection Mitigation",
        problem: "Production banking application vulnerable to time-based blind SQL injection.",
        troubleshooting: "Deployed Burp Suite to identify injection points. Implemented parameterized queries.",
        results: "Blocked 1,247 SQL injection attempts in first month.",
        duration: "3 months",
        tools: "Burp Suite Pro, ModSecurity, MySQL"
    }
];

// Make available globally
if (typeof window !== 'undefined') {
    window.allServices = allServices;
    window.caseStudies = caseStudies;
}
