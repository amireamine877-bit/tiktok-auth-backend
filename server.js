import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

/**
 * 1️⃣ Start TikTok login
 */
app.get("/auth/tiktok", (req, res) => {
  const url =
    "https://www.tiktok.com/v2/auth/authorize" +
    `?client_key=${process.env.CLIENT_KEY}` +
    "&response_type=code" +
    "&scope=user.info.basic" +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    "&state=meta-mvp";

  console.log("➡ Redirecting to TikTok");
  res.redirect(url);
});

/**
 * 2️⃣ Callback – exchange code for access_token
 */
app.get("/api/auth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code received" });
  }

  console.log("✅ TikTok authorization code received:", code);

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

    console.log("🎯 ACCESS TOKEN RESPONSE:", tokenData);

    // 🔥 هذا هو المهم
    res.json(tokenData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
