// Add this to your showPage function for 'projects'

case 'projects':
    contentArea.innerHTML = getCompleteProjectsPage();
    break;

// Add this new function:
function getCompleteProjectsPage() {
    const categories = [
        { id: 'all', name: 'All Projects' },
        { id: 'network', name: 'Firewalls' },
        { id: 'vpn', name: 'VPNs' },
        { id: 'loadbalancer', name: 'Load Balancers' },
        { id: 'ids', name: 'IDS/IPS' },
        { id: 'routing', name: 'Routing' },
        { id: 'automation', name: 'Automation' },
        { id: 'containers', name: 'Container Networking' },
        { id: 'sdn', name: 'SDN/NFV' }
    ];

    return `
        <div class="page-header">
            <h1>50+ Network Configuration Projects</h1>
            <p>Real-world network setups you can deploy on Docker, GitHub, and cloud platforms</p>
        </div>

        <div class="project-filters">
            ${categories.map(cat => `
                <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" 
                        onclick="filterProjects('${cat.id}')">
                    ${cat.name}
                </button>
            `).join('')}
        </div>

        <div class="projects-grid" id="projects-grid">
            ${networkProjects.map(project => `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">
                        <i class="fas ${getProjectIcon(project.category)}"></i>
                        ${project.docker ? '<span class="docker-badge"><i class="fab fa-docker"></i></span>' : ''}
                        ${project.github ? '<span class="github-badge"><i class="fab fa-github"></i></span>' : ''}
                    </div>
                    <div class="project-content">
                        <div class="project-title">${project.title}</div>
                        <div class="project-meta">
                            <span class="difficulty ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                            <span class="duration"><i class="far fa-clock"></i> ${project.duration}</span>
                        </div>
                        <div class="project-tech">
                            ${project.technologies.map(tech => 
                                `<span class="tech-tag">${tech}</span>`
                            ).join('')}
                        </div>
                        <div class="project-desc">${project.description}</div>
                        <div class="project-links">
                            ${project.github ? `
                                <a href="${project.github}" target="_blank" class="project-link">
                                    <i class="fab fa-github"></i> GitHub
                                </a>
                            ` : ''}
                            ${project.docker ? `
                                <a href="https://hub.docker.com/r/${project.docker}" target="_blank" class="project-link">
                                    <i class="fab fa-docker"></i> Docker
                                </a>
                            ` : ''}
                            <a href="#" onclick="deployProject(${project.id}); return false;" class="project-link">
                                <i class="fas fa-rocket"></i> Deploy
                            </a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="deployment-stats">
            <h3>📊 Deployment Ready</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fab fa-github"></i>
                    <span class="stat-number">${networkProjects.filter(p => p.github).length}</span>
                    <span>GitHub Repos</span>
                </div>
                <div class="stat-card">
                    <i class="fab fa-docker"></i>
                    <span class="stat-number">${networkProjects.filter(p => p.docker).length}</span>
                    <span>Docker Images</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-cloud"></i>
                    <span class="stat-number">50</span>
                    <span>Cloud-Ready</span>
                </div>
            </div>
        </div>
    `;
}

function getProjectIcon(category) {
    const icons = {
        'network': 'fa-shield-alt',
        'vpn': 'fa-network-wired',
        'loadbalancer': 'fa-balance-scale',
        'ids': 'fa-search',
        'routing': 'fa-route',
        'automation': 'fa-robot',
        'containers': 'fa-cubes',
        'sdn': 'fa-project-diagram'
    };
    return icons[category] || 'fa-shield-alt';
}

// Add deployment function
function deployProject(projectId) {
    const project = networkProjects.find(p => p.id === projectId);
    if (!project) return;
    
    showNotification(`
        🚀 Deploying ${project.title}...
        <br>
        <small>GitHub: ${project.github || 'Coming soon'}</small>
        <br>
        <small>Docker: ${project.docker || 'Custom setup'}</small>
    `, 'info');
    
    // Auto-deployment simulation
    setTimeout(() => {
        showNotification('✅ Deployment successful! Check your Docker environment.', 'success');
    }, 3000);
}

// Add CSS for new elements
const style = document.createElement('style');
style.textContent = `
    .docker-badge, .github-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 12px;
        color: white;
        z-index: 2;
    }
    
    .github-badge {
        right: 60px;
        background: #333;
    }
    
    .project-meta {
        display: flex;
        gap: 15px;
        margin: 10px 0;
        font-size: 12px;
    }
    
    .difficulty {
        padding: 3px 10px;
        border-radius: 15px;
        font-weight: 600;
    }
    
    .difficulty.beginner { background: #00ff9d20; color: #00ff9d; }
    .difficulty.intermediate { background: #ffaa0020; color: #ffaa00; }
    .difficulty.advanced { background: #ff444420; color: #ff4444; }
    .difficulty.expert { background: #ff000020; color: #ff0000; }
    
    .duration i {
        margin-right: 5px;
        color: #00ff9d;
    }
    
    .deployment-stats {
        margin: 50px 0;
        padding: 30px;
        background: rgba(255,255,255,0.03);
        border-radius: 20px;
        text-align: center;
    }
    
    .deployment-stats .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin-top: 30px;
    }
    
    .deployment-stats .stat-card {
        padding: 20px;
        background: rgba(0,255,157,0.05);
        border-radius: 15px;
    }
    
    .deployment-stats .stat-card i {
        font-size: 40px;
        color: #00ff9d;
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);
