const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
    try {
        // Connecting to MongoDB
        await mongoose.connect(process.env.MONGODB);
        
        console.log(`\x1b[32m[SUCCESS]\x1b[0m - Connected to the database`);
    } catch (error) {
        console.error(`\x1b[31m[ERROR]\x1b[0m - Failed to connect to the database: ${error.message}`);
        process.exit(1);
    }
};