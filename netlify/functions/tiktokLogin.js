export async function handler(event, context) {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;

  const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic,ad.manage&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=netlify_test`;

  return {
    statusCode: 302,
    headers: {
      Location: authUrl
    }
  };
}
