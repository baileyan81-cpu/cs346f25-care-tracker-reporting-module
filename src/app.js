/**
 * Express Application Configuration
 *
 * This file configures:
 * - Express middleware (Helmet, sessions, CSRF protection)
 * - View engine (EJS)
 * - Static file serving
 * - Routes
 * - Error handling
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const csrf = require('csurf');

// Initialize Express app
const app = express();

// Security middleware - Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// View engine setup - EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// CSRF protection
// Note: Apply this after session middleware
const csrfProtection = csrf({ cookie: false });

// Apply CSRF protection to all routes (except any APIs you intentionally exclude)
app.use(csrfProtection);

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.csrfToken = req.csrfToken(); // now available in every EJS
  next();
});

// Routes
// Import and use your route files here
// Example:
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const aboutRouter = require('./routes/about');
app.use('/about', aboutRouter);

const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);

const classesRouter = require('./routes/classes');
app.use('/classes', classesRouter);

const careTrackerConfigRouter = require('./routes/careTrackerConfig');
app.use('/careTrackerConfig', careTrackerConfigRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const clinicalHoursRouter = require('./routes/clinicalHours');
app.use('/clinicalHours', clinicalHoursRouter);

// AccreditationReport Route
app.get('/accreditationReport', csrfProtection, (req, res) => {
  res.render('accreditationReport', {
    title: 'About',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 },
  });
});

// Error handler

app.use((err, req, res, _next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Set locals, only providing error details in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // Render error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message,
    error: res.locals.error,
  });
});

module.exports = app;
