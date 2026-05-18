import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const THEPOPEBOT_DOMAIN = process.env.THEPOPEBOT_DOMAIN || 'localhost';

app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Survey landing page with redirect
app.get('/survey', (req, res) => {
  const surveyId = req.query.id || generateSurveyId();
  const chatUrl = `https://${THEPOPEBOT_DOMAIN}/chat/${surveyId}`;

  // Serve the landing page with auto-redirect
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accounting Firm Survey</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 12px;
      padding: 48px;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      animation: fadeIn 0.6s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 16px;
      font-weight: 600;
    }

    p {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .button {
      display: inline-block;
      padding: 12px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 16px;
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    .auto-redirect {
      font-size: 13px;
      color: #999;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome 👋</h1>
    <p>Thank you for taking a few minutes to help us understand your firm's tech stack and goals. This conversation takes about 10 minutes.</p>
    <button class="button" onclick="startSurvey()">Start Survey</button>
    <div class="auto-redirect">Redirecting in 5 seconds...</div>
  </div>

  <script>
    const chatUrl = '${chatUrl}';

    function startSurvey() {
      window.location.href = chatUrl;
    }

    // Auto-redirect after 5 seconds
    setTimeout(() => {
      window.location.href = chatUrl;
    }, 5000);
  </script>
</body>
</html>`);
});

function generateSurveyId() {
  return Math.random().toString(36).substring(2, 10);
}

app.listen(PORT, () => {
  console.log(`Survey server running on port ${PORT}`);
  console.log(`Redirects to: https://${THEPOPEBOT_DOMAIN}/chat/{surveyId}`);
});
