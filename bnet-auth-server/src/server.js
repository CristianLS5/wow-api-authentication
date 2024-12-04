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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    }
}));

app.use(cookieParser());

// CORS configuration
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://wow-api-authentication.vercel.app',
        'https://wow-api-authentication-server.vercel.app'
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
    debugger;
    console.log('Callback received with full details:', {
        code: req.query.code,
        state: req.query.state,
        error: req.query.error,
        session_state: req.session?.state,
        session_exists: !!req.session,
        headers: req.headers,
        cookies: req.cookies
    });
    
    const { code, state, error } = req.query;

    if (error) {
        debugger;
        console.error('Auth error received:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/index.html?error=auth_failed&reason=${error}`);
    }

    if (state !== req.session.state) {
        debugger;
        console.error('State mismatch:', {
            received: state,
            expected: req.session.state
        });
        return res.redirect(`${process.env.FRONTEND_URL}/index.html?error=state_mismatch`);
    }

    try {
        debugger;
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

        debugger;
        req.session.token = tokenResponse.data.access_token;
        res.redirect(`${process.env.FRONTEND_URL}/redirect-test.html`);
    } catch (error) {
        debugger;
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
    debugger;
    if (!req.session.token) {
        debugger;
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        debugger;
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
        debugger;
        res.json(response.data);
    } catch (error) {
        debugger;
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 