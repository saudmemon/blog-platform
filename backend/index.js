const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const postRoutes = require('./routes/posts');
const fs = require('fs');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/posts', postRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    // Handle multer file size errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds 5MB limit' });
    }

    // Handle multer errors
    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({ message: err.message });
    }

    // Handle JSON parsing errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    // Generic error response
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === 'production' 
            ? 'Server error occurred' 
            : err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

