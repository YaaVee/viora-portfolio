// Performance Optimizations
function initPerformanceOptimizations() {
    // 1. Lazy Loading Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 2. Skeleton Loaders for Content
    function showSkeletonLoaders() {
        const cards = document.querySelectorAll('.service-card, .cloud-card');
        cards.forEach(card => {
            if (!card.querySelector('h3')) {
                card.classList.add('skeleton-loader');
            }
        });
    }
    
    // 3. Infinite Scroll for Large Lists
    function initInfiniteScroll() {
        const sections = document.querySelectorAll('.services-grid, .cloud-grid');
        sections.forEach(section => {
            const cards = Array.from(section.children);
            const itemsPerPage = 20;
            let currentPage = 1;
            
            // Hide cards beyond first page
            cards.forEach((card, index) => {
                if (index >= itemsPerPage) {
                    card.style.display = 'none';
                }
            });
            
            // Add load more button
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.textContent = 'Load More Services';
            loadMoreBtn.style.cssText = `
                display: block;
                margin: 40px auto;
                padding: 12px 30px;
                background: transparent;
                border: 1px solid var(--neon-green);
                color: var(--neon-green);
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s;
            `;
            
            section.parentElement.appendChild(loadMoreBtn);
            
            loadMoreBtn.addEventListener('click', function() {
                const start = currentPage * itemsPerPage;
                const end = start + itemsPerPage;
                
                cards.slice(start, end).forEach(card => {
                    card.style.display = 'block';
                });
                
                currentPage++;
                
                if (currentPage * itemsPerPage >= cards.length) {
                    this.style.display = 'none';
                }
            });
        });
    }
    
    // 4. Prefetch Next Section
    function prefetchSections() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nextSection = entry.target.nextElementSibling;
                    if (nextSection && nextSection.id) {
                        // Prefetch images in next section
                        const images = nextSection.querySelectorAll('img');
                        images.forEach(img => {
                            const src = img.dataset.src || img.src;
                            if (src) {
                                const preloadLink = document.createElement('link');
                                preloadLink.rel = 'preload';
                                preloadLink.as = 'image';
                                preloadLink.href = src;
                                document.head.appendChild(preloadLink);
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // Initialize performance features
    if (cards.length > 50) {
        initInfiniteScroll();
    }
    prefetchSections();
}

document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
