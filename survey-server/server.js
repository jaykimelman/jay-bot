import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const THEPOPEBOT_URL = process.env.THEPOPEBOT_URL || 'http://event-handler';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create a proxy to thepopebot for chat requests
const proxy = httpProxy.createProxyServer({
  target: THEPOPEBOT_URL,
  changeOrigin: true,
  ws: true,
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).json({ error: 'Proxy error' });
});

// Serve the survey page
app.get('/survey', (req, res) => {
  const surveyId = req.query.id || generateSurveyId();
  res.sendFile(join(__dirname, 'public', 'survey.html'));
});

// Proxy chat API requests to thepopebot
app.post('/api/*', (req, res) => {
  proxy.web(req, res);
});

app.get('/api/*', (req, res) => {
  proxy.web(req, res);
});

// Proxy WebSocket for streaming chat
app.ws('/stream/*', (ws, req) => {
  proxy.ws(req, ws);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

function generateSurveyId() {
  return Math.random().toString(36).substring(2, 10);
}

app.listen(PORT, () => {
  console.log(`Survey server running on port ${PORT}`);
  console.log(`Proxying to ${THEPOPEBOT_URL}`);
});
