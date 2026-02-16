const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/scan') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { code, language } = JSON.parse(body);
                
                // Simple security analysis
                const findings = [];
                
                if (code.includes('password') && code.includes('=')) {
                    findings.push({
                        severity: 'CRITICAL',
                        message: 'Hardcoded password detected',
                        line: 1
                    });
                }
                
                if (code.includes('eval(')) {
                    findings.push({
                        severity: 'HIGH',
                        message: 'Use of eval() is dangerous',
                        line: 1
                    });
                }
                
                if (code.includes('localhost') && code.includes('http')) {
                    findings.push({
                        severity: 'MEDIUM',
                        message: 'Hardcoded localhost URL',
                        line: 1
                    });
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    findings: findings,
                    summary: {
                        critical: findings.filter(f => f.severity === 'CRITICAL').length,
                        high: findings.filter(f => f.severity === 'HIGH').length,
                        medium: findings.filter(f => f.severity === 'MEDIUM').length,
                        low: findings.filter(f => f.severity === 'LOW').length
                    }
                }));
            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    } else if (req.url === '/health') {
        res.writeHead(200);
        res.end('ok');
    }
});

const PORT = 3445;
server.listen(PORT, () => {
    console.log(`✅ Code Scanner running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
    }
});
