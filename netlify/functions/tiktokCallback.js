import fetch from "node-fetch";

export async function handler(event, context) {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

  const query = event.queryStringParameters;
  const code = query.code;

  if (!code) {
    return {
      statusCode: 400,
      body: "لم يتم إرسال code من TikTok"
    };
  }

  try {
    // استبدال الكود بالـ Access Token
    const response = await fetch(`https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code"
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "تم تسجيل الدخول بنجاح!",
        tokenResponse: data
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
