// Production Configuration Example
// Copy this to the CONFIG section in server.js for production use

const CONFIG = {
  // Your Jio mobile number (10 digits)
  MOBILE_NUMBER: '9876543210',
  
  // Your UPI ID (e.g., yourname@paytm, yourname@gpay, yourname@phonepe)
  UPI_ID: 'yourname@upi',
  
  // Server port
  PORT: process.env.PORT || 3000,
  
  // Path to system browser (leave empty to use Playwright's bundled browser)
  BROWSER_PATH: process.env.BROWSER_PATH || '/usr/bin/chromium',
  
  // Run in headless mode (set to true for production, false for debugging)
  HEADLESS: process.env.HEADLESS === 'true' || false
};

// For production deployment:
// 1. Set environment variables:
//    export MOBILE_NUMBER=9876543210
//    export UPI_ID=yourname@upi
//    export HEADLESS=true
//
// 2. Or use a .env file with dotenv package:
//    npm install dotenv
//    require('dotenv').config();
//    
//    Then in .env file:
//    MOBILE_NUMBER=9876543210
//    UPI_ID=yourname@upi
//    HEADLESS=true
