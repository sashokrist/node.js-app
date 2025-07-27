require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes


// app.use('/auth', require('./routes/authRoutes'));
app.use('/news', require('./routes/publicNewsRoutes'));
app.use('/admin/news', require('./routes/adminNewsRoutes'));
app.use('/admin/properties', require('./routes/propertyRoutes'));
app.use('/property', require('./routes/propertyRoutes'));
app.use('/admin/renovations', require('./routes/renovationRoutes'));
// app.use('/', require('./routes/homeRoutes')); // loads the new home page with news, properties, renovations
// Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
