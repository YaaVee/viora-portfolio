const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function setup() {
    console.log('\n=================================');
    console.log('🔧 SECURE AI BACKEND SETUP');
    console.log('=================================\n');

    // Check for existing .env
    try {
        await fs.access('.env');
        const overwrite = await prompt('⚠️  .env file exists. Overwrite? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Keeping existing .env');
        } else {
            await setupEnv();
        }
    } catch {
        await setupEnv();
    }

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    exec('npm install', (error, stdout, stderr) => {
        if (error) {
            console.error('Error installing dependencies:', error);
            return;
        }
        console.log(stdout);
        
        console.log('\n✅ Setup complete!');
        console.log('\nNext steps:');
        console.log('1. Review .env file and update settings');
        console.log('2. Run: npm start');
        console.log('3. Secure Ollama (instructions in logs)');
        console.log('4. Test API: curl http://localhost:3001/api/health\n');
        
        rl.close();
    });
}

async function setupEnv() {
    const domain = await prompt('Enter your domain (e.g., https://yourdomain.com): ') || 'https://localhost';
    const adminPassword = crypto.randomBytes(16).toString('hex');
    
    const envContent = `# ====================================
# SECURE AI BACKEND CONFIGURATION
# ====================================

# Server Configuration
NODE_ENV=production
PORT=3001
API_BASE_URL=${domain}

# Security - CHANGE THESE!
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}
JWT_EXPIRY=24h
REFRESH_TOKEN_SECRET=${crypto.randomBytes(32).toString('hex')}
REFRESH_TOKEN_EXPIRY=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CHAT_RATE_LIMIT_PER_HOUR=50
CODE_RATE_LIMIT_PER_HOUR=30

# CORS - Add your domains
ALLOWED_ORIGINS=${domain}
ALLOWED_ORIGIN=${domain}

# Ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_CHAT_MODEL=llama2
OLLAMA_CODE_MODEL=codellama
OLLAMA_TIMEOUT=30000

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Admin credentials - CHANGE AFTER FIRST LOGIN!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${adminPassword}
ADMIN_EMAIL=admin@${domain.replace(/^https?:\/\//, '')}

# Email (for notifications)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
`;

    await fs.writeFile('.env', envContent);
    console.log('\n✅ Created .env file');
    console.log('⚠️  SAVE THESE CREDENTIALS:');
    console.log(`Admin Password: ${adminPassword}`);
}

setup();
