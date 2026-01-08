import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

dotenv.config();
const app = express();

/**
 * ✅ TikTok URL PREFIX VERIFICATION (ROUTE DIRECT – لا يفشل)
 * هذا ضروري حتى لو كنت تستعمل express.static
 */
app.get("/tiktokVGFShtzVAew5HC35lRgIi2hgG0MHEvK5.txt", (req, res) => {
  res.status(200);
  res.set("Content-Type", "text/plain");
  res.send("tiktokVGFShtzVAew5HC35lRgIi2hgG0MHEvK5");
});

/**
 * ✅ خدمة الملفات الثابتة (اختياري – لا نعتمد عليها للتحقق)
 */
app.use(express.static("public"));

/**
 * 1️⃣ بدء تسجيل الدخول إلى TikTok
 */
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

/**
 * 2️⃣ Callback – استبدال authorization code بـ access_token
 */
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
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

/**
 * ✅ تشغيل السيرفر
 */
export default app;
