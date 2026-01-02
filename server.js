import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

dotenv.config();
const app = express();

// ✅ خدمة الملفات الثابتة (public folder)
app.use(express.static("public"));

// 1️⃣ بدء تسجيل الدخول إلى TikTok
app.get("/auth/tiktok", (req, res) => {
  const url =
    "https://www.tiktok.com/v2/auth/authorize" +
    `?client_key=${process.env.CLIENT_KEY}` +
    "&response_type=code" +
    "&scope=user.info.basic" +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    "&state=meta-mvp";

  console.log("➡ Redirecting user to TikTok");
  res.redirect(url);
});

// 2️⃣ Callback – استبدال رمز الوصول بـ access token
app.get("/api/auth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code received" });
  }

  console.log("🔁 TikTok callback hit");
  console.log("✅ Authorization code:", code);
  console.log("State:", state);

  try {
    const params = new URLSearchParams();
    params.append("client_key", process.env.CLIENT_KEY);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", process.env.REDIRECT_URI);

    const tokenRes = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const tokenData = await tokenRes.json();
    return res.json(tokenData);
  } catch (err) {
    console.error("❌ Token error:", err);
    return res.status(500).json({ error: "Token exchange failed" });
  }
});

// ✅ بدء السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
