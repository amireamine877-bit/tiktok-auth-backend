import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

dotenv.config();

const app = express();

const CLIENT_KEY = process.env.CLIENT_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

console.log("CLIENT_KEY =", CLIENT_KEY);
console.log("CLIENT_SECRET =", CLIENT_SECRET ? "********" : undefined);
console.log("REDIRECT_URI =", REDIRECT_URI);

app.get('/api/auth/login/tiktok', (req, res) => {
    const state = 'meta-mvp';
    const scope = 'user.info.basic';
    const url = `https://www.tiktok.com/v2/auth/authorize?client_key=${CLIENT_KEY}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    res.redirect(url);
});

app.get('/api/auth/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.send("Authorization code not received.");

    try {
        const response = await axios.post(
            'https://open.tiktokapis.com/v2/oauth/token',
            qs.stringify({
                client_key: CLIENT_KEY,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const access_token = response.data.data.access_token;
        const open_id = response.data.data.open_id;

        res.send(`<h3>Sandbox Access Token:</h3><p>${access_token}</p><h3>Open ID:</h3><p>${open_id}</p>`);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.send("Error fetching access token. Check server logs.");
    }
});

const PORT = 3000; // ثابت للاختبار المحلي

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
