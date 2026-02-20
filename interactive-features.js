// Interactive Features
function initInteractiveFeatures() {
    // 1. Reading Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // 2. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 3. Live Counter Animation
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Animate stats when they come into view
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target') || stat.textContent);
                    animateCounter(stat, 0, target, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // 4. Search Functionality
    function initSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search 500+ security services...">
                <button class="search-btn">Search</button>
            </div>
        `;
        
        // Insert after section title
        const sections = document.querySelectorAll('.services-section, .cloud-section');
        sections.forEach(section => {
            const title = section.querySelector('.section-title');
            if (title) {
                title.insertAdjacentElement('afterend', searchContainer.cloneNode(true));
            }
        });
        
        // Add search functionality
        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const parentSection = this.closest('section');
                const cards = parentSection.querySelectorAll('.service-card, .cloud-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    const desc = card.querySelector('.service-desc, .cloud-desc')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 5. Filter Functionality
    function initFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="aws">AWS</button>
            <button class="filter-btn" data-filter="azure">Azure</button>
            <button class="filter-btn" data-filter="gcp">GCP</button>
            <button class="filter-btn" data-filter="network">Network</button>
            <button class="filter-btn" data-filter="compliance">Compliance</button>
        `;
        
        const cloudSection = document.getElementById('cloud-security');
        if (cloudSection) {
            const title = cloudSection.querySelector('.section-title');
            if (title) {
                title.insertAdjacentElement('afterend', filterContainer.cloneNode(true));
            }
        }
        
        // Add filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                const parentSection = this.closest('section');
                const cards = parentSection.querySelectorAll('.cloud-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    if (filter === 'all' || title.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Initialize all features
    initSearch();
    initFilters();
}

document.addEventListener('DOMContentLoaded', initInteractiveFeatures);
