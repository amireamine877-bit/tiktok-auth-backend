import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

let codeVerifier = null;

// PKCE helpers
function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

// Login route
router.get('/login', (req, res) => {
  codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(codeVerifier));

  const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${process.env.TIKTOK_CLIENT_KEY}` +
                  `&response_type=code&scope=user.info.basic` +
                  `&redirect_uri=${encodeURIComponent(process.env.TIKTOK_REDIRECT_URI)}` +
                  `&state=meta-mvp` +
                  `&code_challenge=${codeChallenge}` +
                  `&code_challenge_method=S256`;

  res.redirect(authUrl);
});

// Callback route
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("Authorization code not received");

  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI,
      code_verifier: codeVerifier
    }, { headers: { 'Content-Type': 'application/json' }});

    const { access_token, open_id } = response.data.data;
    res.send(`<h3>Access Token:</h3><p>${access_token}</p><h3>Open ID:</h3><p>${open_id}</p>`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error fetching TikTok token");
  }
});

export default router;
