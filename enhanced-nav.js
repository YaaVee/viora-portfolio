// Enhanced Navigation with Mega Menu
function enhanceNavigation() {
    // Add sticky navigation on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('nav-sticky');
        } else {
            nav.classList.remove('nav-sticky');
        }
    });
    
    // Add active section highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add smooth scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add mega menu for services
function createMegaMenu() {
    const servicesDropdown = document.querySelector('.services-dropdown');
    if (!servicesDropdown) return;
    
    const megaMenu = document.createElement('div');
    megaMenu.className = 'mega-menu';
    megaMenu.innerHTML = `
        <div class="mega-menu-grid">
            <div class="mega-col">
                <h4>Network Security</h4>
                <ul>
                    <li><a href="#network-security">Firewall Architecture</a></li>
                    <li><a href="#network-security">Zero Trust</a></li>
                    <li><a href="#network-security">IDS/IPS</a></li>
                    <li><a href="#network-security">VPN Security</a></li>
                </ul>
            </div>
            <div class="mega-col">
                <h4>Cloud Security</h4>
                <ul>
                    <li><a href="#cloud-security">AWS Security</a></li>
                    <li><a href="#cloud-security">Azure Security</a></li>
                    <li><a href="#cloud-security">GCP Security</a></li>
                    <li><a href="#cloud-security">Kubernetes</a></li>
                </ul>
            </div>
            <div class="mega-col">
                <h4>DevSecOps</h4>
                <ul>
                    <li><a href="#services">CI/CD Security</a></li>
                    <li><a href="#services">Container Security</a></li>
                    <li><a href="#services">IaC Scanning</a></li>
                    <li><a href="#services">Supply Chain</a></li>
                </ul>
            </div>
            <div class="mega-col">
                <h4>Compliance</h4>
                <ul>
                    <li><a href="#services">PCI DSS</a></li>
                    <li><a href="#services">HIPAA</a></li>
                    <li><a href="#services">SOC 2</a></li>
                    <li><a href="#services">ISO 27001</a></li>
                </ul>
            </div>
        </div>
        <div class="mega-footer">
            <a href="#services" class="view-all">View All 500+ Services →</a>
        </div>
    `;
    
    servicesDropdown.appendChild(megaMenu);
}

document.addEventListener('DOMContentLoaded', function() {
    enhanceNavigation();
    createMegaMenu();
});
