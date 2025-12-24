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
 * افتحه في المتصفح
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
 * ⚠️ يجب أن يطابق TikTok Dashboard حرفيًا
 * مثال:
 * https://tiktok-auth-backend-1.onrender.com/api/auth/callback
 */
app.get('/api/auth/callback', (req, res) => {
  const { code, state, error, error_description } = req.query;

  console.log('🔁 TikTok callback hit');

  // في حالة وجود خطأ من TikTok
  if (error) {
    console.error('❌ TikTok error:', error, error_description);
    return res.status(400).json({
      success: false,
      error,
      description: error_description,
    });
  }

  // في حالة عدم وصول code
  if (!code) {
    console.error('❌ No authorization code received');
    return res.status(400).send('No authorization code received from TikTok');
  }

  // نجاح
  console.log('✅ TikTok authorization code received:', code);
  console.log('State:', state);

  // حاليًا نرجع code فقط للتأكد أن كل شيء يعمل
  // الخطوة القادمة: استبداله بـ access_token
  res.json({
    success: true,
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
