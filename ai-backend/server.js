const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { HNSWLib } = require('langchain/vectorstores');
const { OpenAIEmbeddings } = require('langchain/embeddings');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Security knowledge base for RAG
let vectorStore;
let securityDocs = [];

async function initializeKnowledgeBase() {
  try {
    // Load security documentation
    const docsPath = path.join(__dirname, 'security-docs');
    const files = await fs.readdir(docsPath);
    
    for (const file of files) {
      if (file.endsWith('.txt') || file.endsWith('.md')) {
        const content = await fs.readFile(path.join(docsPath, file), 'utf8');
        securityDocs.push(content);
      }
    }
    
    // Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
    
    const splitDocs = await textSplitter.createDocuments(securityDocs);
    
    // Create vector store
    vectorStore = await HNSWLib.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY || 'dummy' })
    );
    
    console.log('✅ Knowledge base initialized with', splitDocs.length, 'chunks');
  } catch (error) {
    console.log('⚠️ Knowledge base not initialized, using Ollama only');
  }
}

// Initialize knowledge base
initializeKnowledgeBase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint with Ollama
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Get relevant context from knowledge base if available
    let relevantDocs = [];
    if (vectorStore) {
      relevantDocs = await vectorStore.similaritySearch(message, 3);
    }
    
    const contextText = relevantDocs.map(doc => doc.pageContent).join('\n');
    
    // Call Ollama
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2',
      prompt: `You are a DevSecOps security expert. Answer the following question using the context if relevant.\n\nContext:\n${contextText}\n\nQuestion: ${message}\n\nAnswer:`,
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 500
      }
    });
    
    res.json({
      answer: response.data.response,
      sources: relevantDocs.map(doc => doc.metadata.source),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ollama error:', error.message);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

// Code analysis endpoint
app.post('/api/analyze-code', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    // Use Ollama for code analysis
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'codellama',
      prompt: `Analyze this ${language} code for security vulnerabilities. List each issue with severity and fix recommendation:\n\n${code}`,
      stream: false,
      options: {
        temperature: 0.3,
        max_tokens: 1000
      }
    });
    
    // Parse response for structured output
    const analysis = parseAnalysis(response.data.response);
    
    res.json({
      issues: analysis.issues,
      summary: analysis.summary,
      severity: analysis.severity
    });
    
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

function parseAnalysis(text) {
  const issues = [];
  let summary = '';
  let severity = 'low';
  
  // Simple parsing logic (enhance as needed)
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('high')) {
      severity = 'high';
      issues.push(line);
    } else if (line.toLowerCase().includes('medium')) {
      if (severity !== 'high') severity = 'medium';
      issues.push(line);
    } else if (line.toLowerCase().includes('low')) {
      issues.push(line);
    }
  }
  
  summary = issues.length + ' issues found';
  
  return { issues, summary, severity };
}

// Real-time chat with Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('message', async (data) => {
    try {
      // Process with Ollama
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama2',
        prompt: `You are a helpful DevSecOps assistant. Answer: ${data.message}`,
        stream: true
      });
      
      // Stream response back
      socket.emit('response-start', { id: Date.now() });
      
      // Handle streaming response
      // (Implementation depends on Ollama streaming format)
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to process message' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ AI Backend running on port ${PORT}`);
  console.log(`📚 Knowledge base ready`);
});
