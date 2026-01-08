import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

dotenv.config();
const app = express();

/**
 * ✅ TikTok URL Prefix Verification (Vercel-safe)
 * المسار = اسم الملف .txt
 * المحتوى = نفس الاسم بدون .txt
 */
app.get("/tiktokVGFShtzVAew5HC35lRgIi2hgG0MHEvK5.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("tiktokVGFShtzVAew5HC35lRgIi2hgG0MHEvK5");
});

/**
 * 1️⃣ TikTok Login
 */
app.get("/auth/tiktok", (req, res) => {
  const url =
    "https://www.tiktok.com/v2/auth/authorize" +
    `?client_key=${process.env.CLIENT_KEY}` +
    "&response_type=code" +
    "&scope=user.info.basic" +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    "&state=meta-mvp";

  res.redirect(url);
});

/**
 * 2️⃣ Callback
 */
app.get("/api/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "No code" });

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
  res.json(tokenData);
});

export default app;
