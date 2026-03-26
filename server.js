const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. GLOBAL MIDDLEWARE
// Place CORS and JSON first so they process every request
app.use(cors());
app.use(express.json());

// Diagnostic Logger (Keep this to see Render traffic in the logs)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 2. ROUTE IMPORTS
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');

// 3. ROUTES
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Health Check for Render's "Liveness" probe
app.get('/', (req, res) => {
  res.send('Neo-Market API is encrypted and running...');
});

// 4. DATABASE & SERVER START
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('--- SYSTEM ONLINE ---');
    console.log('MongoDB Connected to Cloud Atlas');
    
    // IMPORTANT: Render will provide a PORT via environment variables
    // We use 0.0.0.0 to allow external access
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server effectively running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('CRITICAL ERROR: Database Connection Failed');
    console.error(err.message);
    process.exit(1); 
  });