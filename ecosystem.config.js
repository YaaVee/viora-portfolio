module.exports = {
  apps: [
    {
      name: 'video-service',
      script: './video-server/server.js',
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/video-error.log',
      out_file: './logs/video-out.log',
      time: true,
      autorestart: true,
      restart_delay: 5000
    },
    {
      name: 'ai-service',
      script: './ai-service/ai-server.js',
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/ai-error.log',
      out_file: './logs/ai-out.log',
      time: true,
      autorestart: true,
      restart_delay: 5000
    },
    {
      name: 'code-scanner',
      script: './code-scanner/scanner.js',
      watch: false,
      max_memory_restart: '300M',
      error_file: './logs/scanner-error.log',
      out_file: './logs/scanner-out.log',
      time: true,
      autorestart: true,
      restart_delay: 5000
    }
  ]
};
