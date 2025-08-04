const express = require('express');
const session = require('express-session');
const path = require('path');

console.log('Starting test server...');

const app = express();

// Session configuration
const SESSION_CONFIG = {
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
};

app.use(session(SESSION_CONFIG));
app.use(express.json());
app.use(express.static('public'));

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Login page
app.get('/login', (req, res) => {
    console.log('Login page requested');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login API
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username);
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        req.session.isAuthenticated = true;
        req.session.username = username;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Logout API
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// Auth check
app.get('/api/auth/check', (req, res) => {
    res.json({
        success: true,
        authenticated: req.session && req.session.isAuthenticated,
        username: req.session ? req.session.username : null
    });
});

// Protected admin page
app.get('/admin', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    } else {
        res.redirect('/login');
    }
});

// Root redirect
app.get('/', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'Test server running',
        timestamp: new Date().toISOString(),
        authenticated: req.session && req.session.isAuthenticated
    });
});

const port = 3001;
app.listen(port, () => {
    console.log(`🚀 Test server running on http://localhost:${port}`);
    console.log(`🔐 Login at http://localhost:${port}/login`);
    console.log(`📊 Admin at http://localhost:${port}/admin`);
    console.log(`🧪 Health at http://localhost:${port}/health`);
}); 