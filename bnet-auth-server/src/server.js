require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Battle.net OAuth endpoints
const BNET_AUTH_URL = 'https://oauth.battle.net/authorize';
const BNET_TOKEN_URL = 'https://oauth.battle.net/token';

app.get('/auth/bnet', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.BNET_CLIENT_ID,
    redirect_uri: process.env.BNET_REDIRECT_URI,
    response_type: 'code',
    scope: 'wow.profile'
  });

  res.redirect(`${BNET_AUTH_URL}?${params.toString()}`);
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.BNET_REDIRECT_URI
    });

    const auth = Buffer.from(`${process.env.BNET_CLIENT_ID}:${process.env.BNET_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(BNET_TOKEN_URL, params, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Redirect back to frontend with the token
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${response.data.access_token}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?error=Authentication failed`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 