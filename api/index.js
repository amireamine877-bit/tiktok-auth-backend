import dotenv from "dotenv";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

dotenv.config();

/**
 * ✅ TikTok URL Verification
 */
export default async function handler(req, res) {
  if (req.url === "/tiktokVGFShtzVAew5HC35lRgIi2hgG0MHEvK5.txt") {
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send("tiktokVGFShtzVAew5HC35lRgIi2hgG0MHEvK5");
  }

  if (req.url.startsWith("/auth/tiktok")) {
    const url =
      "https://www.tiktok.com/v2/auth/authorize" +
      `?client_key=${process.env.CLIENT_KEY}` +
      "&response_type=code" +
      "&scope=user.info.basic" +
      `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
      "&state=meta-mvp";

    return res.redirect(url);
  }

  if (req.url.startsWith("/api/auth/callback")) {
    const code = new URL(req.url, "http://localhost").searchParams.get("code");
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
    return res.status(200).json(tokenData);
  }

  return res.status(404).send("NOT FOUND");
}
