import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

/**
 * 🔹 Health check (مهم لـ Render)
 */
app.get("/healthz", (req, res) => {
  res.send("OK");
});

/**
 * 1️⃣ Start TikTok Login
 */
app.get("/auth/tiktok", (req, res) => {
  const authUrl =
    "https://www.tiktok.com/v2/auth/authorize" +
    `?client_key=${process.env.CLIENT_KEY}` +
    "&response_type=code" +
    "&scope=user.info.basic" +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    "&state=meta-mvp";

  console.log("➡ Redirecting to TikTok:", authUrl);
  res.redirect(authUrl);
});

/**
 * 2️⃣ Callback – exchange code for access_token
 */
app.get("/api/auth/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error("❌ TikTok error:", error);
    return res.status(400).json({ error });
  }

  if (!code) {
    return res.status(400).json({ error: "No code received" });
  }

  console.log("✅ Code received:", code);

  try {
    const tokenRes = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_key: process.env.CLIENT_KEY,
          client_secret: process.env.CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    console.log("🎯 Token response:", tokenData);

    res.json({
      success: true,
      tokenData,
    });
  } catch (err) {
    console.error("❌ Token exchange failed:", err);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
