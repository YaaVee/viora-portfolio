// Content Protection System - Design Unchanged, Functionality Added
(function() {
    'use strict';

    // ===== ANTI-SELECTION =====
    const antiSelect = document.createElement('style');
    antiSelect.textContent = `
        /* These styles DON'T change design, just prevent copying */
        body {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        
        /* Allow selection only on form inputs (for contact form) */
        input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    document.head.appendChild(antiSelect);

    // ===== DISABLE COPY SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // Ctrl+C, Ctrl+X, Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+Shift+I, F12
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'c':
                case 'x':
                case 's':
                case 'p':
                case 'u':
                case 'i':
                case 'j':
                    e.preventDefault();
                    e.stopPropagation();
                    showProtectionWarning('Copying is disabled');
                    return false;
            }
        }
        
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
            e.preventDefault();
            e.stopPropagation();
            showProtectionWarning('Developer tools are disabled');
            return false;
        }
    });

    // ===== DISABLE RIGHT CLICK =====
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showProtectionWarning('Content is protected');
        return false;
    });

    // ===== DISABLE DRAG AND DROP =====
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // ===== DISABLE SELECTION VIA MOUSE =====
    document.addEventListener('mousedown', function(e) {
        if (e.detail > 1) { // Prevent double-click selection
            e.preventDefault();
        }
    });

    // ===== PROTECTED WATERMARK FOR SCREENSHOTS =====
    function addInvisibleWatermark() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            opacity: 0.005;
            pointer-events: none;
            z-index: 999999;
            font-size: 8px;
            color: #00ff9d;
            transform: rotate(-45deg);
            white-space: nowrap;
        `;
        watermark.textContent = '© Viora Yaba Mensah - Confidential Portfolio';
        document.body.appendChild(watermark);
    }

    // ===== DETECT DEVTOOLS =====
    let devToolsOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devToolsOpen = true;
            showProtectionWarning('Developer tools detected - access restricted');
            return '';
        }
    });
    
    setInterval(function() {
        devToolsOpen = false;
        console.log(element); // This triggers the getter if devtools is open
        if (devToolsOpen) {
            // Optional: Redirect or show warning
        }
    }, 1000);

    // ===== PROTECTION WARNING (STYLIZED) =====
    function showProtectionWarning(message) {
        // Create warning if it doesn't exist
        let warning = document.getElementById('protection-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'protection-warning';
            warning.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid #00ff9d;
                color: #00ff9d;
                padding: 12px 24px;
                border-radius: 50px;
                font-size: 14px;
                z-index: 10000;
                animation: slideIn 0.3s ease, fadeOut 2s ease 1.5s forwards;
                box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
                pointer-events: none;
            `;
            document.body.appendChild(warning);
        }
        
        warning.textContent = `🔒 ${message}`;
        
        // Auto remove after animation
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 3000);
    }

    // ===== DISABLE PRINTING =====
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        showProtectionWarning('Printing is disabled');
        return false;
    });

    // ===== PROTECT IMAGES =====
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // ===== PROTECT CODE BLOCKS SPECIFICALLY =====
    const style = document.createElement('style');
    style.textContent = `
        pre, code, .project-desc, .service-desc, .case-desc {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
    `;
    document.head.appendChild(style);

    // ===== FUZZY TEXT FOR SCRAPERS =====
    function addFuzzyText() {
        const fuzzyDiv = document.createElement('div');
        fuzzyDiv.style.cssText = `
            position: absolute;
            opacity: 0;
            pointer-events: none;
            height: 0;
            overflow: hidden;
        `;
        // Add decoy text that will confuse scrapers
        fuzzyDiv.innerHTML = `
            <p>protected content - do not scrape</p>
            <p>copyright viora yaba mensah</p>
            <p>confidential portfolio material</p>
        `.repeat(50);
        document.body.appendChild(fuzzyDiv);
    }

    // Initialize protections
    addInvisibleWatermark();
    addFuzzyText();
    
    console.log('%c🔒 Content Protection Active', 'color: #00ff9d; font-size: 16px; font-weight: bold;');
})();
