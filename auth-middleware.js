const bcrypt = require('bcryptjs');

// Admin credentials (in production, these should be stored in environment variables)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Session configuration
const SESSION_CONFIG = {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    
    // For API requests, return JSON error
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ 
            success: false, 
            error: 'Authentication required' 
        });
    }
    
    // For page requests, redirect to login
    res.redirect('/login');
}

// Login handler
async function handleLogin(req, res) {
    const { username, password } = req.body;
    
    try {
        // Check credentials
        if (username === ADMIN_CREDENTIALS.username) {
            // Compare password directly (for simplicity, in production use proper hashing)
            if (password === ADMIN_CREDENTIALS.password) {
                // Set session
                req.session.isAuthenticated = true;
                req.session.username = username;
                req.session.loginTime = new Date();
                
                res.json({ 
                    success: true, 
                    message: 'Login successful' 
                });
            } else {
                res.status(401).json({ 
                    success: false, 
                    error: 'Invalid credentials' 
                });
            }
        } else {
            res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
}

// Logout handler
function handleLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Logout failed' 
            });
        }
        
        res.clearCookie('connect.sid');
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    });
}

// Check authentication status
function checkAuth(req, res) {
    if (req.session && req.session.isAuthenticated) {
        res.json({ 
            success: true, 
            authenticated: true,
            username: req.session.username,
            loginTime: req.session.loginTime
        });
    } else {
        res.json({ 
            success: true, 
            authenticated: false 
        });
    }
}

module.exports = {
    requireAuth,
    handleLogin,
    handleLogout,
    checkAuth,
    SESSION_CONFIG,
    ADMIN_CREDENTIALS
}; 