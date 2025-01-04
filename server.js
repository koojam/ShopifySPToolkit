require('dotenv').config();
const express = require('express');
const app = express();
const { Shopify } = require('@shopify/shopify-api');
const { generateMockPurchase } = require('./utils/mockData');
const path = require('path');
const defaultConfig = require('./utils/config');
const fs = require('fs').promises;
const cors = require('cors');

const port = process.env.PORT || 4000;

// Add this constant near the top
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

// Initialize Shopify API client
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ['read_orders', 'read_products'],
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  IS_EMBEDDED_APP: false,
  API_VERSION: '2024-01'
});

// Add CORS before other middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both popup and admin
    methods: ['GET', 'POST'],
    credentials: true
}));

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

// Add this function to ensure data directory exists
async function ensureSettingsFile() {
    try {
        // Create data directory if it doesn't exist
        await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
        try {
            await fs.access(SETTINGS_FILE);
        } catch {
            // File doesn't exist, create it with default config
            await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultConfig, null, 2));
        }
    } catch (error) {
        console.error('Error ensuring settings file:', error);
    }
}

// Call this when server starts
ensureSettingsFile();

// Add these new endpoints
app.get('/api/settings', async (req, res) => {
    try {
        console.log('Attempting to read settings from:', SETTINGS_FILE);
        const settings = await fs.readFile(SETTINGS_FILE, 'utf8');
        
        // Validate JSON before sending
        const parsedSettings = JSON.parse(settings);
        if (!parsedSettings || typeof parsedSettings !== 'object') {
            throw new Error('Invalid settings format in file');
        }

        console.log('Settings loaded successfully');
        res.json(parsedSettings);
    } catch (error) {
        console.error('Detailed read error:', {
            message: error.message,
            stack: error.stack,
            path: SETTINGS_FILE
        });
        
        // Return default config if file doesn't exist or is invalid
        console.log('Falling back to default config');
        res.json(defaultConfig);
    }
});

// Add this helper function
function isValidColorFormat(color) {
    return color && typeof color === 'object' &&
           'hue' in color && 'saturation' in color &&
           'brightness' in color && 'alpha' in color;
}

// Update the POST endpoint
app.post('/api/settings', async (req, res) => {
    try {
        const newSettings = req.body;
        console.log('Attempting to save settings:', {
            path: SETTINGS_FILE,
            settings: newSettings
        });
        
        // Validate settings before saving
        if (!newSettings || typeof newSettings !== 'object') {
            throw new Error('Invalid settings format');
        }

        // Validate color formats
        if (!isValidColorFormat(newSettings?.style?.backgroundColor)) {
            throw new Error('Invalid background color format');
        }
        if (!isValidColorFormat(newSettings?.style?.textColor)) {
            throw new Error('Invalid text color format');
        }

        // Ensure data directory exists with proper permissions
        await fs.mkdir(path.dirname(SETTINGS_FILE), { 
            recursive: true,
            mode: 0o755
        });

        await fs.writeFile(
            SETTINGS_FILE, 
            JSON.stringify(newSettings, null, 2),
            { mode: 0o644 }
        );

        console.log('Settings saved successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('Detailed save error:', {
            message: error.message,
            stack: error.stack,
            path: SETTINGS_FILE
        });
        res.status(500).json({ 
            error: 'Failed to save settings',
            details: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});