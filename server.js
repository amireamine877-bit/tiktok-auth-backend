// backend/server.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

/**
 * ===== Test Route =====
 * فقط للتأكد أن السيرفر يعمل
 */
app.get('/api/auth/login/tiktok', (req, res) => {
  res.send("Login route works");
});

/**
 * ===== TikTok Login =====
 * هذا المسار هو الذي تبدأ منه تسجيل الدخول
 */
app.get('/auth/tiktok', (req, res) => {
  const authUrl =
    'https://www.tiktok.com/v2/auth/authorize' +
    `?client_key=${process.env.CLIENT_KEY}` +
    '&response_type=code' +
    '&scope=user.info.basic' +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    '&state=meta-mvp';

  console.log('➡ Redirecting user to TikTok:', authUrl);
  res.redirect(authUrl);
});

/**
 * ===== TikTok Callback =====
 * ⚠️ هذا هو المسار الذي يجب أن يطابق TikTok Dashboard حرفيًا
 * https://tiktok-auth-backend-1.onrender.com/api/auth/callback
 */
app.get('/api/auth/callback', (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    console.error('❌ TikTok error:', error);
    return res.status(400).send(`TikTok error: ${error}`);
  }

  if (!code) {
    return res.status(400).send('No authorization code received from TikTok');
  }

  console.log('✅ TikTok authorization code received:', code);

  // حاليا نرجع code فقط للتأكد أن كل شيء يعمل
  // لاحقًا سنبدله بـ access_token
  res.json({
    message: 'TikTok login successful',
    code,
    state,
  });
});

/**
 * ===== Start Server =====
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
