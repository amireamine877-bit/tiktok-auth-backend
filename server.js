import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

dotenv.config();
const app = express();

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

app.get("/api/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.json({ error: "No code" });

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
  res.json(tokenData);
});

app.listen(3000, () => console.log("🚀 Server running"));
