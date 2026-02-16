const express = require('express');
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const PORT = 3443;

// Check if SSL files exist
const sslPath = '../ssl';
if (!fs.existsSync(`${sslPath}/private.key`)) {
    console.log('⚠️ SSL files not found, generating self-signed certificates...');
    
    // Create ssl directory if it doesn't exist
    fs.mkdirSync(sslPath, { recursive: true });
    
    // Generate self-signed certificate using openssl
    const { execSync } = require('child_process');
    execSync(`openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ${sslPath}/private.key \
        -out ${sslPath}/certificate.crt \
        -subj "/C=GH/ST=Greater Accra/L=Accra/O=Viora/CN=localhost"`);
    console.log('✅ Self-signed certificates generated');
}

try {
    const server = https.createServer({
        key: fs.readFileSync(`${sslPath}/private.key`),
        cert: fs.readFileSync(`${sslPath}/certificate.crt`)
    }, app);
    
    const io = socketIO(server);
    
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', service: 'video-server' });
    });
    
    io.on('connection', (socket) => {
        console.log('✅ Video client connected');
        
        socket.on('createRoom', ({ roomId }) => {
            console.log(`Room created: ${roomId}`);
            socket.emit('roomCreated', { 
                roomId,
                iceServers: ['stun:stun.l.google.com:19302']
            });
        });
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
    
    server.listen(PORT, () => {
        console.log(`✅ Video Server running on port ${PORT}`);
        console.log(`🔒 WebRTC with DTLS-SRTP encryption ready`);
    });
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use`);
            process.exit(1);
        }
    });
    
} catch (err) {
    console.error('❌ Failed to start video server:', err.message);
    process.exit(1);
}
