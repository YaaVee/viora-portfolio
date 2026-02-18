const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const { createServer } = require('https');
const { Redis } = require('ioredis');
const csrf = require('csrf');

require('dotenv').config();

// ====================================
// SECURITY CONFIGURATION
// ====================================

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
}

// ====================================
// LOGGING SETUP
// ====================================

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: 'logs/ai-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// ====================================
// REDIS SETUP (for rate limiting & sessions)
// ====================================

let redis;
try {
    redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => Math.min(times * 50, 2000)
    });
    
    redis.on('connect', () => logger.info('✅ Redis connected'));
    redis.on('error', (err) => logger.warn('⚠️ Redis error:', err.message));
} catch (error) {
    logger.warn('⚠️ Redis not available, using memory store');
    redis = null;
}

// ====================================
// EXPRESS APP SETUP
// ====================================

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", process.env.ALLOWED_ORIGIN || "https://yourdomain.com"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Restrict to your domains
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            logger.warn(`❌ Blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Prevent MongoDB injection (even though we're not using MongoDB)
app.use(mongoSanitize());

// Compression
app.use(compression());

// CSRF protection
const csrfTokens = new csrf();
app.use((req, res, next) => {
    if (req.method === 'GET' || req.path.startsWith('/api/auth/')) {
        return next();
    }
    
    const token = req.headers['x-csrf-token'];
    const secret = req.session?.csrfSecret;
    
    if (!token || !secret || !csrfTokens.verify(secret, token)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
});

// ====================================
// RATE LIMITING
// ====================================

// Global rate limiter
const globalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },
    skip: (req) => req.path === '/api/health' // Skip health checks
});
app.use('/api/', globalLimiter);

// Stricter limiter for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: parseInt(process.env.CHAT_RATE_LIMIT_PER_HOUR) || 50,
    message: { error: 'Hourly AI quota exceeded' },
    keyGenerator: (req) => req.user?.id || req.ip,
    store: redis ? {
        incr: async (key) => {
            const current = await redis.incr(key);
            if (current === 1) await redis.expire(key, 3600);
            return current;
        },
        decrement: async (key) => await redis.decr(key),
        resetKey: async (key) => await redis.del(key)
    } : undefined
});

// ====================================
// USER & TOKEN MANAGEMENT
// ====================================

// In-memory storage (replace with database in production)
const users = new Map();
const refreshTokens = new Map();
const apiKeys = new Map();
const usageQuotas = new Map();

// Helper functions
function generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
}

function generateTokenPair(user) {
    const accessToken = jwt.sign(
        { 
            id: user.id, 
            username: user.username,
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
    
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET || JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );
    
    refreshTokens.set(refreshToken, user.id);
    
    return { accessToken, refreshToken };
}

// ====================================
// AUTHENTICATION MIDDLEWARE
// ====================================

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const apiKey = req.headers['x-api-key'];
        
        let user = null;
        
        // JWT token authentication
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }
            
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                user = users.get(decoded.id);
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }
                req.tokenType = 'jwt';
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
                }
                return res.status(401).json({ error: 'Invalid token' });
            }
        }
        
        // API key authentication
        else if (apiKey && apiKeys.has(apiKey)) {
            const keyData = apiKeys.get(apiKey);
            user = users.get(keyData.userId);
            if (!user) {
                return res.status(401).json({ error: 'Invalid API key' });
            }
            req.tokenType = 'api_key';
        }
        
        // Session cookie authentication
        else if (req.session?.userId) {
            user = users.get(req.session.userId);
            req.tokenType = 'session';
        }
        
        // No authentication
        else {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        // Check if user is active
        if (!user.active) {
            return res.status(403).json({ error: 'Account disabled' });
        }
        
        // Check quota
        if (user.used >= user.quota) {
            return res.status(429).json({ error: 'Quota exceeded' });
        }
        
        // Add user to request
        req.user = user;
        
        // Track usage (async, don't await)
        user.used++;
        usageQuotas.set(user.id, {
            used: user.used,
            quota: user.quota,
            lastReset: new Date()
        });
        
        // Log access
        logger.info('API access', {
            user: user.username,
            path: req.path,
            method: req.method,
            tokenType: req.tokenType,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        next();
        
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        logger.warn('Admin access denied', { user: req.user.username });
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ====================================
// AUTHENTICATION ENDPOINTS
// ====================================

// Register new user (admin only)
app.post('/api/admin/users', authenticate, requireAdmin, [
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('quota').optional().isInt({ min: 1, max: 10000 }),
    body('role').optional().isIn(['user', 'admin'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, email, password, quota = 1000, role = 'user' } = req.body;
    
    if (users.has(username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    
    const user = {
        id: userId,
        username,
        email,
        password: hashedPassword,
        quota,
        used: 0,
        role,
        active: true,
        createdAt: new Date(),
        lastLogin: null
    };
    
    users.set(userId, user);
    
    // Generate API key
    const apiKey = generateApiKey();
    apiKeys.set(apiKey, { userId, createdAt: new Date() });
    
    logger.info('User created', { username, role, quota });
    
    res.json({
        message: 'User created successfully',
        userId,
        apiKey, // Return once - user must save it
        quota
    });
});

// Login
app.post('/api/auth/login', [
    body('username').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;
    
    // Find user by username
    const user = Array.from(users.values()).find(u => u.username === username);
    if (!user) {
        logger.warn('Login failed - user not found', { username });
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        logger.warn('Login failed - invalid password', { username });
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);
    
    // Set session if using cookies
    if (req.body.useSession) {
        req.session = { userId: user.id };
    }
    
    // Get or create API key
    let apiKey = Array.from(apiKeys.entries())
        .find(([_, data]) => data.userId === user.id)?.[0];
    
    if (!apiKey) {
        apiKey = generateApiKey();
        apiKeys.set(apiKey, { userId: user.id, createdAt: new Date() });
    }
    
    logger.info('Login successful', { username });
    
    res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        apiKey,
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
            quota: user.quota,
            used: user.used
        }
    });
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || JWT_SECRET);
        const user = users.get(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        const tokens = generateTokenPair(user);
        res.json(tokens);
        
    } catch (err) {
        refreshTokens.delete(refreshToken);
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout
app.post('/api/auth/logout', authenticate, (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // Invalidate token (add to blacklist if using Redis)
        if (redis) {
            redis.setex(`blacklist:${token}`, 86400, 'true');
        }
    }
    
    logger.info('Logout successful', { user: req.user.username });
    res.json({ message: 'Logout successful' });
});

// ====================================
// AI ENDPOINTS
// ====================================

// Chat endpoint
app.post('/api/chat', authenticate, aiLimiter, [
    body('message').isLength({ min: 1, max: 2000 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { message } = req.body;
        
        // Check if Ollama is available
        try {
            await axios.get(`${process.env.OLLAMA_HOST}/api/tags`, { timeout: 5000 });
        } catch (error) {
            logger.error('Ollama not available');
            return res.status(503).json({ error: 'AI service temporarily unavailable' });
        }
        
        // Call Ollama
        const response = await axios.post(`${process.env.OLLAMA_HOST}/api/generate`, {
            model: process.env.OLLAMA_CHAT_MODEL || 'llama2',
            prompt: `You are a DevSecOps security expert. Provide detailed, accurate answers about security topics. Question: ${message}`,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 500
            }
        }, {
            timeout: parseInt(process.env.OLLAMA_TIMEOUT) || 30000
        });
        
        // Log usage
        logger.info('Chat completed', {
            user: req.user.username,
            messageLength: message.length,
            responseLength: response.data.response.length
        });
        
        res.json({
            answer: response.data.response,
            usage: {
                used: req.user.used,
                quota: req.user.quota,
                remaining: req.user.quota - req.user.used
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logger.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
});

// Code analysis endpoint
app.post('/api/analyze-code', authenticate, aiLimiter, [
    body('code').isLength({ min: 1, max: 5000 }).trim(),
    body('language').optional().isIn(['python', 'javascript', 'java', 'go', 'ruby', 'php', 'csharp', 'cpp'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { code, language = 'python' } = req.body;
        
        // Call CodeLlama
        const response = await axios.post(`${process.env.OLLAMA_HOST}/api/generate`, {
            model: process.env.OLLAMA_CODE_MODEL || 'codellama',
            prompt: `Analyze this ${language} code for security vulnerabilities. List each issue with severity (CRITICAL/HIGH/MEDIUM/LOW) and provide specific fix recommendations:\n\n${code}`,
            stream: false,
            options: {
                temperature: 0.3,
                top_p: 0.95,
                max_tokens: 1000
            }
        }, {
            timeout: parseInt(process.env.OLLAMA_TIMEOUT) || 30000
        });
        
        // Parse and structure the response
        const analysis = parseAnalysis(response.data.response);
        
        logger.info('Code analysis completed', {
            user: req.user.username,
            language,
            issuesFound: analysis.issues.length,
            severity: analysis.severity
        });
        
        res.json({
            ...analysis,
            usage: {
                used: req.user.used,
                quota: req.user.quota,
                remaining: req.user.quota - req.user.used
            }
        });
        
    } catch (error) {
        logger.error('Code analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze code' });
    }
});

function parseAnalysis(text) {
    const issues = [];
    let summary = '';
    let highestSeverity = 'low';
    
    const lines = text.split('\n');
    let currentIssue = '';
    
    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        // Detect severity
        if (lowerLine.includes('critical')) {
            highestSeverity = 'critical';
            if (line.trim()) currentIssue = line;
        } else if (lowerLine.includes('high') && highestSeverity !== 'critical') {
            highestSeverity = 'high';
            if (line.trim()) currentIssue = line;
        } else if (lowerLine.includes('medium') && !['critical', 'high'].includes(highestSeverity)) {
            highestSeverity = 'medium';
            if (line.trim()) currentIssue = line;
        } else if (lowerLine.includes('low') && !['critical', 'high', 'medium'].includes(highestSeverity)) {
            highestSeverity = 'low';
            if (line.trim()) currentIssue = line;
        }
        
        // Collect issues
        if (line.trim() && (line.includes(':') || line.includes('-') || line.match(/^\d+\./))) {
            if (currentIssue) issues.push(currentIssue);
            currentIssue = line.trim();
        } else if (currentIssue && line.trim()) {
            currentIssue += ' ' + line.trim();
        }
    }
    
    if (currentIssue) issues.push(currentIssue);
    
    summary = `Found ${issues.length} potential security ${issues.length === 1 ? 'issue' : 'issues'}`;
    
    return {
        issues: issues.slice(0, 10), // Limit to 10 issues
        summary,
        severity: highestSeverity,
        raw: text
    };
}

// ====================================
// USER MANAGEMENT ENDPOINTS
// ====================================

// Get current user info
app.get('/api/user/me', authenticate, (req, res) => {
    res.json({
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        quota: {
            total: req.user.quota,
            used: req.user.used,
            remaining: req.user.quota - req.user.used
        },
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
    });
});

// Get usage statistics
app.get('/api/user/usage', authenticate, (req, res) => {
    const usage = usageQuotas.get(req.user.id) || {
        used: req.user.used,
        quota: req.user.quota
    };
    
    res.json({
        used: usage.used,
        quota: usage.quota,
        remaining: usage.quota - usage.used,
        percentage: (usage.used / usage.quota) * 100,
        lastReset: usage.lastReset
    });
});

// Admin endpoints
app.get('/api/admin/stats', authenticate, requireAdmin, (req, res) => {
    const stats = {
        totalUsers: users.size,
        totalQuota: Array.from(users.values()).reduce((sum, u) => sum + u.quota, 0),
        totalUsed: Array.from(users.values()).reduce((sum, u) => sum + u.used, 0),
        activeUsers: Array.from(users.values()).filter(u => u.active).length,
        users: Array.from(users.values()).map(u => ({
            username: u.username,
            email: u.email,
            role: u.role,
            quota: u.quota,
            used: u.used,
            active: u.active,
            createdAt: u.createdAt,
            lastLogin: u.lastLogin
        })),
        apiKeys: apiKeys.size,
        recentLogs: [] // In production, query from log database
    };
    
    res.json(stats);
});

// ====================================
// HEALTH CHECK & MONITORING
// ====================================

app.get('/api/health', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        services: {
            api: 'up',
            ollama: 'unknown',
            redis: redis ? 'up' : 'down'
        },
        metrics: {
            users: users.size,
            activeSessions: refreshTokens.size,
            apiKeys: apiKeys.size,
            totalQueries: Array.from(users.values()).reduce((sum, u) => sum + u.used, 0)
        }
    };
    
    // Check Ollama
    try {
        await axios.get(`${process.env.OLLAMA_HOST}/api/tags`, { timeout: 5000 });
        health.services.ollama = 'up';
    } catch (error) {
        health.services.ollama = 'down';
        health.status = 'degraded';
    }
    
    res.json(health);
});

// ====================================
// SECURE OLLAMA CONFIGURATION
// ====================================

async function configureOllamaSecurity() {
    logger.info('🔒 Configuring Ollama security...');
    
    try {
        // Create Ollama override if it doesn't exist
        const overrideDir = '/etc/systemd/system/ollama.service.d';
        const overrideFile = `${overrideDir}/override.conf`;
        
        const overrideContent = `[Service]
Environment="OLLAMA_HOST=127.0.0.1"
Environment="OLLAMA_ORIGINS=${process.env.ALLOWED_ORIGIN || 'https://yourdomain.com'}"
Environment="OLLAMA_NUM_PARALLEL=1"
Environment="OLLAMA_MAX_QUEUE=512"
Environment="OLLAMA_KEEP_ALIVE=0"
`;

        logger.info('⚠️  To secure Ollama, run these commands:');
        logger.info('sudo mkdir -p /etc/systemd/system/ollama.service.d');
        logger.info(`sudo tee ${overrideFile} << 'EOF'\n${overrideContent}EOF`);
        logger.info('sudo systemctl daemon-reload');
        logger.info('sudo systemctl restart ollama');
        logger.info('sudo ufw deny 11434/tcp');
        
    } catch (error) {
        logger.warn('Could not configure Ollama automatically:', error.message);
    }
}

// ====================================
// START SERVER
// ====================================

const PORT = process.env.PORT || 3001;

// Only listen on localhost for security
app.listen(PORT, '127.0.0.1', async () => {
    logger.info(`=================================`);
    logger.info(`🔒 SECURE AI BACKEND v2.0`);
    logger.info(`=================================`);
    logger.info(`✅ Server running on port ${PORT}`);
    logger.info(`🔐 Authentication: REQUIRED`);
    logger.info(`🚀 Environment: ${process.env.NODE_ENV}`);
    logger.info(`📊 Rate limiting: ENABLED`);
    logger.info(`🛡️  Helmet.js: ENABLED`);
    logger.info(`📝 Logging: ${process.env.LOG_LEVEL}`);
    logger.info(`=================================`);
    
    // Create default admin user if none exists
    if (users.size === 0) {
        const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        
        const adminUser = {
            id: uuidv4(),
            username: 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@localhost',
            password: hashedPassword,
            quota: 10000,
            used: 0,
            role: 'admin',
            active: true,
            createdAt: new Date()
        };
        
        users.set(adminUser.id, adminUser);
        
        const apiKey = generateApiKey();
        apiKeys.set(apiKey, { userId: adminUser.id, createdAt: new Date() });
        
        logger.info('✅ Default admin user created');
        logger.warn('⚠️  IMPORTANT: Change the default admin password immediately!');
        logger.info(`Admin API Key: ${apiKey}`);
    }
    
    await configureOllamaSecurity();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    if (redis) redis.quit();
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    if (redis) redis.quit();
    process.exit(0);
});
// ============================================
// INVITE SYSTEM ENDPOINTS (METHOD 3)
// ============================================

// Store invites (use Redis in production)
const invites = new Map();

// Generate invite (admin only)
app.post('/api/admin/invite', authenticate, requireAdmin, (req, res) => {
    const { quota = 500, expiresIn = 7, role = 'user' } = req.body;
    
    const inviteCode = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);
    
    const invite = {
        code: inviteCode,
        quota,
        role,
        expiresAt,
        used: false,
        createdBy: req.user.id,
        createdAt: new Date(),
        usedBy: null
    };
    
    invites.set(inviteCode, invite);
    
    const inviteLink = `${process.env.API_BASE_URL}/signup?invite=${inviteCode}`;
    
    res.json({
        message: 'Invite generated',
        inviteCode,
        inviteLink,
        quota,
        role,
        expiresAt,
        link: inviteLink
    });
});

// Get all invites (admin only)
app.get('/api/admin/invites', authenticate, requireAdmin, (req, res) => {
    const inviteList = Array.from(invites.values()).map(invite => ({
        ...invite,
        link: `${process.env.API_BASE_URL}/signup?invite=${invite.code}`
    }));
    
    res.json({ invites: inviteList });
});

// Delete invite (admin only)
app.delete('/api/admin/invite/:code', authenticate, requireAdmin, (req, res) => {
    const { code } = req.params;
    
    if (!invites.has(code)) {
        return res.status(404).json({ error: 'Invite not found' });
    }
    
    invites.delete(code);
    res.json({ message: 'Invite deleted' });
});

// Check invite validity (public)
app.get('/api/invite/:code', (req, res) => {
    const { code } = req.params;
    const invite = invites.get(code);
    
    if (!invite) {
        return res.status(404).json({ error: 'Invite not found' });
    }
    
    const now = new Date();
    const isValid = !invite.used && invite.expiresAt > now;
    
    res.json({
        valid: isValid,
        quota: invite.quota,
        expiresAt: invite.expiresAt,
        used: invite.used
    });
});

// Sign up with invite (public)
app.post('/api/auth/signup-with-invite', [
    body('inviteCode').notEmpty(),
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { inviteCode, username, email, password } = req.body;
    
    // Check invite
    const invite = invites.get(inviteCode);
    if (!invite) {
        return res.status(400).json({ error: 'Invalid invite code' });
    }
    
    const now = new Date();
    if (invite.used) {
        return res.status(400).json({ error: 'Invite already used' });
    }
    
    if (invite.expiresAt < now) {
        return res.status(400).json({ error: 'Invite expired' });
    }
    
    // Check if username exists
    const userExists = Array.from(users.values()).some(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Check if email exists
    const emailExists = Array.from(users.values()).some(u => u.email === email);
    if (emailExists) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    
    const user = {
        id: userId,
        username,
        email,
        password: hashedPassword,
        quota: invite.quota,
        used: 0,
        role: invite.role || 'user',
        active: true,
        createdAt: new Date(),
        lastLogin: null,
        source: 'invite',
        inviteCode
    };
    
    users.set(userId, user);
    
    // Mark invite as used
    invite.used = true;
    invite.usedBy = userId;
    invite.usedAt = new Date();
    
    // Generate API key
    const apiKey = generateApiKey();
    apiKeys.set(apiKey, { userId, createdAt: new Date() });
    
    // Generate tokens for auto-login
    const { accessToken, refreshToken } = generateTokenPair(user);
    
    logger.info('User created via invite', { username, quota: invite.quota });
    
    res.json({
        message: 'Account created successfully',
        accessToken,
        refreshToken,
        apiKey,
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
            quota: user.quota
        }
    });
});
