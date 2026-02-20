// Simple Analytics
function initAnalytics() {
    // Track page views
    const pageView = {
        path: window.location.pathname,
        hash: window.location.hash,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || 'direct'
    };
    
    console.log('📊 Page View:', pageView);
    
    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`👁️ Viewed section: ${entry.target.id}`);
                // Could send to analytics endpoint
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // Track clicks on services
    document.querySelectorAll('.service-card, .cloud-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent;
            console.log(`🖱️ Clicked service: ${title}`);
        });
    });
    
    // Performance metrics
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⏱️ Page load time: ${pageLoadTime}ms`);
    });
}
