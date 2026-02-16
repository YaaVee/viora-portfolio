const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Mock AI server for now (you'll add OpenAI key later)
wss.on('connection', (ws) => {
    console.log('AI client connected');
    
    ws.on('message', (message) => {
        const userMessage = message.toString();
        
        // Simple responses for now
        let response = "I understand you're asking about security. ";
        
        if (userMessage.toLowerCase().includes('aws')) {
            response = "For AWS security, I recommend enabling GuardDuty, using IAM roles with least privilege, and enabling CloudTrail.";
        } else if (userMessage.toLowerCase().includes('firewall')) {
            response = "For firewall configuration, best practices include: default deny rules, regular rule reviews, and enabling logging.";
        } else if (userMessage.toLowerCase().includes('kubernetes') || userMessage.toLowerCase().includes('k8s')) {
            response = "For Kubernetes security, focus on: RBAC, pod security standards, network policies, and container image scanning.";
        } else {
            response = "I'll need more details about your security question. Can you provide more context?";
        }
        
        // Send response in chunks to simulate streaming
        const words = response.split(' ');
        let i = 0;
        const interval = setInterval(() => {
            if (i < words.length) {
                ws.send(JSON.stringify({ 
                    type: 'chunk', 
                    content: words[i] + ' ' 
                }));
                i++;
            } else {
                clearInterval(interval);
                ws.send(JSON.stringify({ type: 'done' }));
            }
        }, 100);
    });
});

server.listen(3444, () => {
    console.log('✅ AI Server running on port 3444');
});
