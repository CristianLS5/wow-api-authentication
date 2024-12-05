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

// Initialize Battle.net OAuth
app.get('/auth/bnet', (req, res) => {
    try {
        // Generate and store state for CSRF protection
        const state = Math.random().toString(36).substring(7);
        req.session.state = state;
        
        // Log the session state
        console.log('Initializing auth with state:', {
            state,
            session_id: req.session.id,
            timestamp: new Date().toISOString()
        });

        // Construct auth URL
        const params = new URLSearchParams({
            client_id: process.env.BNET_CLIENT_ID,
            scope: 'wow.profile',
            state: state,
            redirect_uri: process.env.BNET_REDIRECT_URI,
            response_type: 'code'
        });

        const authUrl = `${BNET_AUTH_URL}?${params.toString()}`;
        
        // Log the complete request
        console.log('Auth request details:', {
            auth_url: authUrl,
            client_id: process.env.BNET_CLIENT_ID,
            redirect_uri: process.env.BNET_REDIRECT_URI,
            headers: req.headers
        });

        res.redirect(authUrl);
    } catch (error) {
        console.error('Auth initialization failed:', error);
        res.redirect(`${process.env.FRONTEND_URL}?error=auth_init_failed`);
    }
});

// Handle Battle.net OAuth callback
app.get('/auth/callback', async (req, res) => {
    console.log('Callback received:', {
        query: req.query,
        session_state: req.session?.state,
        timestamp: new Date().toISOString()
    });

    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error received:', error);
        return res.redirect(`${process.env.FRONTEND_URL}?error=oauth_error&details=${error}`);
    }

    // Validate state to prevent CSRF
    if (!req.session?.state || state !== req.session.state) {
        console.error('State validation failed:', {
            expected: req.session?.state,
            received: state
        });
        return res.redirect(`${process.env.FRONTEND_URL}?error=invalid_state`);
    }

    try {
        // Exchange code for token
        console.log('Exchanging code for token...');
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

        // Store token in session
        req.session.token = tokenResponse.data.access_token;
        req.session.token_expiry = Date.now() + (tokenResponse.data.expires_in * 1000);

        console.log('Token exchange successful:', {
            expires_in: tokenResponse.data.expires_in,
            token_type: tokenResponse.data.token_type
        });

        res.redirect(`${process.env.FRONTEND_URL}/redirect-test.html`);
    } catch (error) {
        console.error('Token exchange failed:', {
            error: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.redirect(`${process.env.FRONTEND_URL}?error=token_exchange_failed`);
    }
});

// Check authentication status
app.get('/auth/check', (req, res) => {
    const isAuthenticated = !!req.session?.token;
    const tokenExpiry = req.session?.token_expiry;
    const isExpired = tokenExpiry ? Date.now() > tokenExpiry : true;

    res.json({ 
        isAuthenticated,
        isExpired,
        expiresIn: tokenExpiry ? Math.floor((tokenExpiry - Date.now()) / 1000) : 0
    });
});

// Logout endpoint
app.get('/auth/logout', (req, res) => {
    req.session = null;
    res.redirect(`${process.env.FRONTEND_URL}`);
});

// WoW Character Profile endpoint
app.get('/wow/character', async (req, res) => {
    if (!req.session?.token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check token expiration
    if (req.session.token_expiry && Date.now() > req.session.token_expiry) {
        req.session.token = null;
        return res.status(401).json({ 
            error: 'Token expired',
            message: 'Please log in again'
        });
    }

    try {
        const response = await axios.get(
            `${WOW_API_URL}/profile/wow/character/sanguino/thenift`,
            {
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                params: {
                    namespace: 'profile-eu',
                    locale: 'en_US'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Character fetch failed:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

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