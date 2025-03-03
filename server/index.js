const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const checkEnvironmentVariables = require('./config/checkEnv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Check and set required environment variables
checkEnvironmentVariables();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/ingredients'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/recipe-sources', require('./routes/recipeSources'));
app.use('/api/import', require('./routes/import'));
app.use('/api/menus', require('./routes/menus'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ msg: 'API is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server function with port conflict handling
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = parseInt(port) + 1;
      console.log(`Port ${port} is already in use, trying port ${nextPort}`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT); 