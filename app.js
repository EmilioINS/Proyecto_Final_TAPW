var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Import routes
var authRoutes = require('./src/infrastructure/routes/authRoutes');
var templateRoutes = require('./src/infrastructure/routes/templateRoutes');
var documentRoutes = require('./src/infrastructure/routes/documentRoutes');
var departmentRoutes = require('./src/infrastructure/routes/departmentRoutes');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/departments', departmentRoutes);

// Explicit root redirect to login
app.get('/', (req, res) => {
    res.redirect('/views/auth/login.html');
});

// Catch-all for API 404
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API Route not found' });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/views/auth/login.html'));
});

// General error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
