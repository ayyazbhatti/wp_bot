const express = require('express');
const session = require('express-session');
const path = require('path');

console.log('Starting test admin panel...');

const app = express();

// Session configuration
const SESSION_CONFIG = {
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

app.use(session(SESSION_CONFIG));
app.use(express.json());
app.use(express.static('public'));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

// Login route
app.get('/login', (req, res) => {
    console.log('Login route accessed');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(3001, () => {
    console.log('🚀 Test Admin Panel running on http://localhost:3001');
    console.log('🔐 Login at http://localhost:3001/login');
    console.log('🧪 Test at http://localhost:3001/test');
}); 