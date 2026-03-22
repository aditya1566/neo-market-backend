const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Routes
app.use('/api/products', productRoutes);

// 3. Root Route for Health Check
app.get('/', (req, res) => {
  res.send('Neo-Market API is encrypted and running...');
});

// 4. Database & Server Start
const mongoose = require('mongoose');

// Use the Environment Variable for the connection string
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected to Cloud Atlas');
    // Render/Heroku will provide a PORT, otherwise use 5000
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database Connection Error:', err.message);
    process.exit(1); // Stop the server if DB fails
  });