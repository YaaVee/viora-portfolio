// Enhanced Theme System
function initThemeEnhancer() {
    // Add more theme options
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        const newThemes = [
            { name: 'Cyberpunk', primary: '#ff00ff', secondary: '#00ffff' },
            { name: 'Matrix', primary: '#00ff00', secondary: '#000000' },
            { name: 'Sunset', primary: '#ff6b6b', secondary: '#4ecdc4' }
        ];
        
        newThemes.forEach(theme => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.setAttribute('data-theme', theme.name.toLowerCase());
            btn.title = theme.name;
            btn.style.background = theme.primary;
            themeSwitcher.appendChild(btn);
        });
    }
    
    // Theme transition effect
    function applyThemeWithTransition(theme) {
        document.body.style.transition = 'background-color 0.5s, color 0.5s';
        // Apply theme colors
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }
    
    // Save theme preference
    function saveThemePreference(theme) {
        localStorage.setItem('preferred-theme', theme);
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
        document.querySelector(`[data-theme="${savedTheme}"]`)?.click();
    }
}
