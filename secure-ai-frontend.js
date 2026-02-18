// Add to your index.html inside <script> tag

// ====================================
// SECURE AI CLIENT FOR PORTFOLIO
// ====================================

class SecureAIClient {
    constructor(apiUrl = 'https://your-api.com/api') {
        this.apiUrl = apiUrl;
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
        this.apiKey = localStorage.getItem('apiKey');
        this.user = null;
        this.refreshInterval = null;
    }

    // Show login UI
    renderLoginForm() {
        return `
            <div class="secure-ai-login" style="
                background: rgba(0,255,157,0.05);
                border: 1px solid #00ff9d;
                border-radius: 15px;
                padding: 30px;
                max-width: 400px;
                margin: 50px auto;
                text-align: center;
            ">
                <h3 style="color: #00ff9d; margin-bottom: 20px;">
                    <i class="fas fa-lock"></i> Secure AI Assistant
                </h3>
                <p style="color: #b0b0b0; margin-bottom: 20px;">
                    Authentication required to use AI features
                </p>
                
                <div style="margin-bottom: 15px;">
                    <input type="text" id="login-username" placeholder="Username" 
                           style="width: 100%; padding: 12px; background: #1a1a1a; 
                                  border: 1px solid #333; border-radius: 8px; 
                                  color: white; margin-bottom: 10px;">
                    <input type="password" id="login-password" placeholder="Password" 
                           style="width: 100%; padding: 12px; background: #1a1a1a; 
                                  border: 1px solid #333; border-radius: 8px; 
                                  color: white;">
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="secureAI.login()" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button onclick="secureAI.showApiKeyLogin()" class="btn btn-secondary" style="flex: 1;">
                        <i class="fas fa-key"></i> Use API Key
                    </button>
                </div>
                
                <div style="margin-top: 20px; font-size: 12px; color: #666;">
                    <i class="fas fa-shield-alt"></i> Enterprise-grade security • Rate limited • Quota based
                </div>
            </div>
        `;
    }

    // Show API key login
    showApiKeyLogin() {
        const content = document.getElementById('ai-content');
        if (content) {
            content.innerHTML = `
                <div class="secure-ai-login" style="
                    background: rgba(0,255,157,0.05);
                    border: 1px solid #00ff9d;
                    border-radius: 15px;
                    padding: 30px;
                    max-width: 400px;
                    margin: 50px auto;
                ">
                    <h3 style="color: #00ff9d; margin-bottom: 20px;">
                        <i class="fas fa-key"></i> Enter API Key
                    </h3>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="text" id="api-key-input" placeholder="API Key" 
                               style="width: 100%; padding: 12px; background: #1a1a1a; 
                                      border: 1px solid #333; border-radius: 8px; 
                                      color: white; font-family: monospace;">
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="secureAI.loginWithApiKey()" class="btn btn-primary" style="flex: 1;">
                            <i class="fas fa-check"></i> Authenticate
                        </button>
                        <button onclick="secureAI.renderLoginForm()" class="btn btn-secondary" style="flex: 1;">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 15px;">
                        API keys are more secure for programmatic access
                    </p>
                </div>
            `;
        }
    }

    // Login with username/password
    async login() {
        const username = document.getElementById('login-username')?.value;
        const password = document.getElementById('login-password')?.value;
        
        if (!username || !password) {
            this.showError('Please enter username and password');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.accessToken;
                this.refreshToken = data.refreshToken;
                this.apiKey = data.apiKey;
                this.user = data.user;
                
                // Store securely
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('apiKey', data.apiKey);
                
                // Start refresh timer
                this.startRefreshTimer();
                
                // Show AI interface
                this.renderAIInterface();
                
            } else {
                const error = await response.json();
                this.showError(error.error || 'Login failed');
            }
        } catch (error) {
            this.showError('Connection error');
        }
    }

    // Login with API key
    async loginWithApiKey() {
        const apiKey = document.getElementById('api-key-input')?.value;
        
        if (!apiKey) {
            this.showError('Please enter API key');
            return;
        }
        
        try {
            // Validate API key by making a test request
            const response = await fetch(`${this.apiUrl}/user/me`, {
                headers: { 'X-API-Key': apiKey }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.apiKey = apiKey;
                this.user = data;
                
                localStorage.setItem('apiKey', apiKey);
                this.renderAIInterface();
                
            } else {
                this.showError('Invalid API key');
            }
        } catch (error) {
            this.showError('Connection error');
        }
    }

    // Render main AI interface
    renderAIInterface() {
        const quotaPercent = (this.user.quota.used / this.user.quota.total) * 100;
        
        const content = document.getElementById('ai-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="ai-interface">
                <div class="user-info" style="
                    background: rgba(0,255,157,0.05);
                    border: 1px solid #00ff9d;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <span style="color: #00ff9d;">
                            <i class="fas fa-user-shield"></i> ${this.user.username}
                        </span>
                        <span style="color: #666; margin-left: 10px;">
                            (${this.user.role})
                        </span>
                    </div>
                    <div>
                        <div style="color: #00ff9d;">
                            Quota: ${this.user.quota.used}/${this.user.quota.total}
                        </div>
                        <div style="
                            width: 100px;
                            height: 4px;
                            background: #333;
                            border-radius: 2px;
                            margin-top: 5px;
                        ">
                            <div style="
                                width: ${quotaPercent}%;
                                height: 100%;
                                background: ${quotaPercent > 80 ? '#ff4444' : '#00ff9d'};
                                border-radius: 2px;
                            "></div>
                        </div>
                    </div>
                </div>

                <div class="ai-container">
                    <div class="ai-chat">
                        <h3 style="margin-bottom: 15px; color: #00ff9d;">
                            <i class="fas fa-comment-dots"></i> Secure AI Chat
                        </h3>
                        <div class="chat-messages" id="chat-messages" style="
                            height: 300px;
                            overflow-y: auto;
                            padding: 15px;
                            background: rgba(255,255,255,0.03);
                            border-radius: 10px;
                            margin-bottom: 15px;
                        ">
                            <div class="message bot">
                                <div class="message-avatar"><i class="fas fa-robot"></i></div>
                                <div class="message-content">
                                    Hello! I'm your secure AI assistant. 
                                    All conversations are authenticated and encrypted.
                                </div>
                            </div>
                        </div>
                        <div class="chat-input" style="display: flex; gap: 10px;">
                            <input type="text" id="chat-input" 
                                   placeholder="Ask a security question..." 
                                   style="flex: 1; padding: 12px; background: rgba(255,255,255,0.05); 
                                          border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; 
                                          color: white;"
                                   onkeypress="if(event.key==='Enter') secureAI.sendMessage()">
                            <button onclick="secureAI.sendMessage()" 
                                    style="width: 45px; height: 45px; border-radius: 50%; 
                                           background: linear-gradient(135deg, #00ff9d, #00b8ff); 
                                           border: none; color: #0a0a0a; cursor: pointer;">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>

                    <div class="code-analyzer" style="margin-top: 20px;">
                        <h3 style="margin-bottom: 15px; color: #00ff9d;">
                            <i class="fas fa-code"></i> Secure Code Analysis
                        </h3>
                        <textarea id="code-input" rows="6" 
                                  style="width: 100%; padding: 12px; background: #1a1a1a; 
                                         border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; 
                                         color: #00ff9d; font-family: monospace; margin-bottom: 10px;"
                                  placeholder="Paste your code here..."></textarea>
                        <select id="code-language" style="
                            padding: 8px; background: #1a1a1a; color: #00ff9d; 
                            border: 1px solid #00ff9d; border-radius: 5px; margin-right: 10px;
                        ">
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="java">Java</option>
                            <option value="go">Go</option>
                            <option value="ruby">Ruby</option>
                            <option value="php">PHP</option>
                        </select>
                        <button onclick="secureAI.analyzeCode()" class="btn btn-primary">
                            <i class="fas fa-shield"></i> Analyze Code
                        </button>
                        <div id="analysis-result" style="margin-top: 15px; padding: 15px; 
                              background: rgba(0,255,157,0.05); border-radius: 10px;"></div>
                    </div>
                </div>

                <div style="margin-top: 20px; text-align: right;">
                    <button onclick="secureAI.logout()" class="btn btn-secondary" style="font-size: 12px;">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
    }

    // Send message to AI
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        const chat = document.getElementById('chat-messages');
        
        // Add user message
        chat.innerHTML += `
            <div class="message user" style="display: flex; gap: 10px; margin-bottom: 15px; justify-content: flex-end;">
                <div class="message-content" style="background: rgba(0,255,157,0.2); padding: 10px 15px; border-radius: 15px;">
                    ${this.escapeHtml(message)}
                </div>
                <div class="message-avatar"><i class="fas fa-user"></i></div>
            </div>
        `;
        
        input.value = '';
        chat.scrollTop = chat.scrollHeight;

        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                    'X-API-Key': this.apiKey
                },
                body: JSON.stringify({ message })
            });

            if (response.status === 401) {
                // Token expired, try refresh
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    return this.sendMessage();
                } else {
                    this.renderLoginForm();
                    return;
                }
            }

            if (response.status === 429) {
                chat.innerHTML += `
                    <div class="message bot" style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <div class="message-avatar"><i class="fas fa-robot"></i></div>
                        <div class="message-content" style="background: rgba(255,0,0,0.1); padding: 10px 15px; border-radius: 15px; color: #ff4444;">
                            ⚠️ Quota exceeded. Please upgrade your plan or wait for reset.
                        </div>
                    </div>
                `;
                chat.scrollTop = chat.scrollHeight;
                return;
            }

            const data = await response.json();
            
            chat.innerHTML += `
                <div class="message bot" style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div class="message-avatar"><i class="fas fa-robot"></i></div>
                    <div class="message-content" style="background: rgba(0,255,157,0.1); padding: 10px 15px; border-radius: 15px;">
                        ${this.escapeHtml(data.answer)}
                        <div style="font-size: 10px; color: #666; margin-top: 10px;">
                            Used: ${data.usage.used}/${data.usage.quota}
                        </div>
                    </div>
                </div>
            `;
            
            chat.scrollTop = chat.scrollHeight;

        } catch (error) {
            this.showError('Failed to send message');
        }
    }

    // Analyze code
    async analyzeCode() {
        const code = document.getElementById('code-input').value;
        const language = document.getElementById('code-language').value;
        const result = document.getElementById('analysis-result');
        
        result.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Analyzing...';

        try {
            const response = await fetch(`${this.apiUrl}/analyze-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                    'X-API-Key': this.apiKey
                },
                body: JSON.stringify({ code, language })
            });

            const data = await response.json();
            
            let severityColor = '#00ff9d';
            if (data.severity === 'critical' || data.severity === 'high') {
                severityColor = '#ff4444';
            } else if (data.severity === 'medium') {
                severityColor = '#ffaa00';
            }

            let html = `<div style="color: ${severityColor}; font-weight: bold;">${data.summary}</div>`;
            html += '<ul style="margin-top: 10px; max-height: 200px; overflow-y: auto;">';
            data.issues.forEach(issue => {
                html += `<li style="margin-bottom: 10px; font-size: 12px;">${this.escapeHtml(issue)}</li>`;
            });
            html += '</ul>';
            
            if (data.usage) {
                html += `<div style="font-size: 10px; color: #666; margin-top: 10px;">
                    Used: ${data.usage.used}/${data.usage.quota}
                </div>`;
            }
            
            result.innerHTML = html;

        } catch (error) {
            result.innerHTML = '⚠️ Analysis failed';
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) return false;

        try {
            const response = await fetch(`${this.apiUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.accessToken;
                this.refreshToken = data.refreshToken;
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed');
        }
        return false;
    }

    // Start automatic token refresh
    startRefreshTimer() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        // Refresh every 30 minutes
        this.refreshInterval = setInterval(() => {
            this.refreshAccessToken();
        }, 30 * 60 * 1000);
    }

    // Logout
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('apiKey');
        this.accessToken = null;
        this.refreshToken = null;
        this.apiKey = null;
        this.user = null;
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.renderLoginForm();
    }

    // Show error message
    showError(message) {
        const content = document.getElementById('ai-content');
        if (content) {
            content.innerHTML = `
                <div style="color: #ff4444; padding: 20px; text-align: center;">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                </div>
            `;
        }
    }

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize secure AI client
const secureAI = new SecureAIClient('https://your-api.com/api');

// Update getRealtimeAIPage to use secure client
function getRealtimeAIPage() {
    return `
        <div class="page-header">
            <h1>🔒 Secure AI Assistant</h1>
            <p>Enterprise-grade AI with authentication, rate limiting, and quotas</p>
        </div>
        <div id="ai-content">
            ${secureAI.renderLoginForm()}
        </div>
    `;
}

// Make functions globally accessible
window.secureAI = secureAI;
window.getRealtimeAIPage = getRealtimeAIPage;
