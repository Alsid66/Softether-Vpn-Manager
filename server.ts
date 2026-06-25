import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to send requests to SoftEther JSON-RPC API
function softEtherRequest(
  host: string,
  port: number,
  password: string,
  method: string,
  params: any,
  rejectUnauthorized: boolean
): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      id: 'req-' + Date.now(),
      method: method,
      params: params || {}
    });

    const options: https.RequestOptions = {
      hostname: host,
      port: port,
      path: '/api/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-VPNADMIN-PASSWORD': password
      },
      rejectUnauthorized: rejectUnauthorized,
      timeout: 12000 // 12 seconds timeout
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            reject(new Error(`Server returned HTTP ${res.statusCode}: ${data || res.statusMessage}`));
            return;
          }
          if (!data) {
            reject(new Error('Empty response received from VPN server'));
            return;
          }
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
          } else {
            resolve(parsed.result);
          }
        } catch (e: any) {
          reject(new Error(`Failed to parse JSON response: ${e.message}. Raw response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Connection timed out. Please check host, port, or firewall.'));
    });

    req.write(payload);
    req.end();
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Test connection endpoint
  app.post('/api/softether/test', async (req, res) => {
    const { host, port, password, rejectUnauthorized } = req.body;
    if (!host || !port) {
      return res.status(400).json({ error: 'Server host and port are required' });
    }

    try {
      // Run GetServerInfo as a test
      const result = await softEtherRequest(
        host,
        parseInt(port),
        password || '',
        'GetServerInfo',
        {},
        rejectUnauthorized !== false
      );
      return res.json({ success: true, info: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Unknown network error' });
    }
  });

  // SoftEther General RPC Dispatcher endpoint
  app.post('/api/softether/rpc', async (req, res) => {
    const { host, port, password, rejectUnauthorized, method, params } = req.body;
    if (!host || !port || !method) {
      return res.status(400).json({ error: 'Host, port, and RPC method are required' });
    }

    try {
      const result = await softEtherRequest(
        host,
        parseInt(port),
        password || '',
        method,
        params,
        rejectUnauthorized !== false
      );
      return res.json({ success: true, result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Serve static UI assets
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.promises.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started successfully on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error starting full-stack server:', err);
});
