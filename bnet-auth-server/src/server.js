require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Session configuration
app.use(session({
    name: 'bnet_session',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 // 1 hour by default
    }
}));

app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// Battle.net OAuth endpoints
const BNET_AUTH_URL = 'https://oauth.battle.net/authorize';
const BNET_TOKEN_URL = 'https://oauth.battle.net/token';
const WOW_API_URL = 'https://eu.api.blizzard.com';

app.get('/auth/bnet', (req, res) => {
    const state = Math.random().toString(36).substring(7);
    req.session.state = state;

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.BNET_CLIENT_ID,
        scope: 'wow.profile',
        state: state,
        redirect_uri: process.env.BNET_REDIRECT_URI,
        region: process.env.BNET_REGION
    });

    const authUrl = `${BNET_AUTH_URL}?${params.toString()}`;
    res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error || state !== req.session.state) {
        return res.redirect(`${process.env.FRONTEND_URL}/index.html?error=auth_failed`);
    }

    try {
        const response = await axios.post(BNET_TOKEN_URL, 
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.BNET_REDIRECT_URI
            }), {
                auth: {
                    username: process.env.BNET_CLIENT_ID,
                    password: process.env.BNET_CLIENT_SECRET
                }
            }
        );

        req.session.token = response.data.access_token;
        res.redirect(`${process.env.FRONTEND_URL}/redirect-test.html`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/index.html?error=auth_failed`);
    }
});

app.get('/auth/check', (req, res) => {
    res.json({ isAuthenticated: !!req.session.token });
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect(`${process.env.FRONTEND_URL}/index.html`);
    });
});

// WoW Character Profile endpoint
app.get('/wow/character', async (req, res) => {
    if (!req.session.token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const response = await axios.get(
            `${WOW_API_URL}/profile/wow/character/sanguino/thenift`, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            },
            params: {
                namespace: 'profile-eu',
                locale: 'en_US'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch character data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 