const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// Map the GET request to the controller function
router.route('/').get(getProducts);

module.exports = router;