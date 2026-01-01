import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import crypto from "crypto";

dotenv.config();

const app = express();

// ================= PKCE =================
function base64URLEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

const codeVerifier = base64URLEncode(crypto.randomBytes(32));
const codeChallenge = base64URLEncode(sha256(codeVerifier));

// ================= STEP 1 =================
app.get("/auth/tiktok", (req, res) => {
  const authUrl =
    "https://www.tiktok.com/v2/auth/authorize" +
    `?client_key=${process.env.CLIENT_KEY}` +
    `&response_type=code` +
    `&scope=user.info.basic` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&state=meta-mvp` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  console.log("➡ Redirecting to TikTok with PKCE");
  res.redirect(authUrl);
});

// ================= STEP 2 =================
app.get("/api/auth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code received" });
  }

  console.log("✅ TikTok authorization code received:", code);
  console.log("State:", state);

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
          code_verifier: codeVerifier,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    return res.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      open_id: tokenData.open_id,
      scope: tokenData.scope,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
