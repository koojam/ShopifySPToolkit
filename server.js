require('dotenv').config();
const express = require('express');
const app = express();
const { Shopify } = require('@shopify/shopify-api');
const { generateMockPurchase } = require('./utils/mockData');
const path = require('path');
const defaultConfig = require('./utils/config');

const port = process.env.PORT || 3000;

// Initialize Shopify API client
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ['read_orders', 'read_products'],
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  IS_EMBEDDED_APP: false,
  API_VERSION: '2024-01'
});

app.use(express.json());
app.use(express.static('public'));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Enhanced mock purchase endpoint
app.get('/api/mock-purchase', (req, res) => {
  const mockData = generateMockPurchase();
  res.json(mockData);
});

// Get multiple mock purchases
app.get('/api/mock-purchases/:count', (req, res) => {
  const count = parseInt(req.params.count) || 5;
  const purchases = Array.from({ length: count }, () => generateMockPurchase());
  res.json(purchases);
});

// Add a new endpoint to get configuration
app.get('/api/config', (req, res) => {
    // In the future, this would fetch merchant-specific settings
    res.json(defaultConfig);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});