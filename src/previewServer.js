import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { build } from './generator.js';
import path from 'path';

export async function preview(port = 3333) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const projectPath = process.cwd();

  // Build initial dist
  try {
    await build(projectPath);
  } catch (error) {
    console.error('❌ Build error:', error.message);
  }

  // Serve dist
  app.use(express.static(path.join(projectPath, 'dist')));
  
  // Serve index.html for root
  app.get('/', (req, res) => {
    res.sendFile(path.join(projectPath, 'dist', 'index.html'));
  });

  server.listen(port, () => {
    console.log(`🚀 Preview server running at http://localhost:${port}`);
    console.log(`📁 Serving from: ${path.join(projectPath, 'dist')}`);
  });

  // Watch project files
  const watcher = chokidar.watch(
    ['**/*.html', 'components/**', 'project.json', 'theme.json'],
    { 
      ignored: ['node_modules/**', 'dist/**', '.git/**'],
      cwd: projectPath
    }
  );

  watcher.on('change', async (filePath) => {
    console.log(`📝 File changed: ${filePath} — rebuilding...`);
    try {
      await build(projectPath);
      // Notify clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send('reload');
        }
      });
      console.log('✅ Rebuild complete');
    } catch (error) {
      console.error('❌ Rebuild error:', error.message);
    }
  });

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');
    ws.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
    });
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down preview server...');
    watcher.close();
    wss.close();
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

