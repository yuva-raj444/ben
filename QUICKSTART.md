# Quick Reference Guide

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Install Playwright browsers
npx playwright install chromium

# 3. Configure your details in server.js
# Edit CONFIG object with your mobile number and UPI ID

# 4. Start the server
npm start
```

## Running a Recharge

### Option 1: Using the helper script (Recommended)
```bash
npm run recharge
```

### Option 2: Using curl
```bash
curl -X POST http://localhost:3000/recharge
```

### Option 3: Using Node.js
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/recharge',
  method: 'POST'
};

http.request(options, (res) => {
  res.on('data', (d) => {
    console.log(d.toString());
  });
}).end();
```

## Testing

```bash
# Test if server starts correctly
npm test

# Check health endpoint
curl http://localhost:3000/
```

## Configuration Quick Reference

Edit `server.js` CONFIG section:

```javascript
const CONFIG = {
  MOBILE_NUMBER: '9876543210',     // Your Jio mobile number
  UPI_ID: 'yourname@upi',          // Your UPI ID
  PORT: 3000,                      // Server port
  BROWSER_PATH: '/usr/bin/chromium' // Browser path (optional)
};
```

## Automation Flow

1. ✓ Navigate to Jio prepaid plans page
2. ✓ Find and click ₹299 plan "Buy" button
3. ✓ Enter mobile number
4. ✓ Submit and continue to payment page
5. ✓ Select UPI payment method
6. ✓ Click "See All" under UPI options
7. ✓ Select "Pay via UPI ID"
8. ✓ Enter UPI ID
9. ✓ Click "Verify & Pay"
10. → User approves payment in UPI app

## API Endpoints

### POST /recharge
Initiates the automated recharge process.

**Response (Success):**
```json
{
  "status": "success",
  "message": "Recharge initiated. Approve in UPI app."
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Error description",
  "details": "Stack trace"
}
```

### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "running",
  "message": "Jio Recharge Automation API",
  "endpoints": {
    "recharge": "POST /recharge"
  },
  "config": {
    "mobileNumber": "9876543210",
    "upiId": "yourname@upi"
  }
}
```

## Troubleshooting

### Browser not found
- Install Playwright browsers: `npx playwright install chromium`
- Or use system browser by setting `BROWSER_PATH` in config

### Server won't start
- Check if port 3000 is available
- Change PORT in CONFIG if needed

### Automation fails
- Check internet connection
- Verify Jio website is accessible
- Ensure ₹299 plan is available
- Check console logs for specific errors

### Cannot find ₹299 plan
- The script looks for text containing "299"
- Website structure may have changed
- Try manually navigating to ensure the plan exists

## Notes

- Browser runs in **non-headless mode** by default (you can see the automation)
- Browser stays open after automation for UPI approval
- Make sure your mobile number and UPI ID are correct
- The automation stops at the payment verification step
- You must manually approve the payment in your UPI app
