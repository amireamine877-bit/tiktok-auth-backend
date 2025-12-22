// backend/server.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ===== Test Route =====
app.get('/api/auth/login/tiktok', (req, res) => {
  res.send("Login route works");
});

// ===== TikTok Login Test =====
app.get('/auth/tiktok', (req, res) => {
  const authUrl =
    'https://www.tiktok.com/v2/auth/authorize' +
    `?client_key=${process.env.CLIENT_KEY}` +
    '&response_type=code' +
    '&scope=user.info.basic' +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    '&state=meta-mvp';

  console.log('➡ Redirecting to TikTok:', authUrl);
  res.redirect(authUrl);
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
