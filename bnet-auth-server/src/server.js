require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const app = express();
const port = process.env.PORT || 3000;

// Session configuration
app.use(cookieSession({
    name: 'bnet_session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
}));

app.use(cookieParser());

// CORS configuration
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://wow-api-authentication.vercel.app',
        'https://wow-api-authentication-server.vercel.app',
        'http://localhost:4200',
        'http://localhost:3000'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Battle.net OAuth endpoints
const BNET_AUTH_URL = 'https://oauth.battle.net/authorize';
const BNET_TOKEN_URL = 'https://oauth.battle.net/token';
const WOW_API_URL = 'https://eu.api.blizzard.com';

app.get('/auth/bnet', (req, res) => {
    console.log('Environment:', {
        CLIENT_ID: process.env.BNET_CLIENT_ID,
        REDIRECT_URI: process.env.BNET_REDIRECT_URI,
        NODE_ENV: process.env.NODE_ENV
    });
    
    const state = Math.random().toString(36).substring(7);
    req.session.state = state;

    const params = new URLSearchParams({
        client_id: process.env.BNET_CLIENT_ID,
        scope: 'wow.profile',
        state: state,
        redirect_uri: process.env.BNET_REDIRECT_URI,
        response_type: 'code'
    });

    const authUrl = `${BNET_AUTH_URL}?${params.toString()}`;
    console.log('Generated Auth URL:', authUrl);
    res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
    console.log('Callback received:', {
        timestamp: new Date().toISOString(),
        query: req.query,
        headers: req.headers,
        session: req.session
    });
    
    const { code, state, error } = req.query;

    if (error) {
        console.error('Auth error received:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/index.html?error=auth_failed&reason=${error}`);
    }

    if (state !== req.session.state) {
        console.error('State mismatch:', {
            received: state,
            expected: req.session.state
        });
        return res.redirect(`${process.env.FRONTEND_URL}/index.html?error=state_mismatch`);
    }

    try {
        const tokenResponse = await axios.post(BNET_TOKEN_URL, 
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

        req.session.token = tokenResponse.data.access_token;
        res.redirect(`${process.env.FRONTEND_URL}/redirect-test.html`);
    } catch (error) {
        console.error('Token exchange failed:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.redirect(`${process.env.FRONTEND_URL}/index.html?error=auth_failed&reason=token_exchange`);
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
        if (error.response?.status === 401) {
            req.session.token = null;
            return res.status(401).json({ 
                error: 'Authentication expired',
                message: 'Please log in again'
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch character data',
            message: error.response?.data?.message || error.message
        });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Add this to your server.js
const logError = (error, context) => {
    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        context,
        error: {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        }
    }));
};

// Global error handler
app.use((err, req, res, next) => {
    logError(err, 'global');
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 