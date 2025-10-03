# Jio Recharge Automation - Project Structure

## Project Overview

This project provides an automated Jio recharge solution using Node.js, Express.js, and Playwright. It exposes a REST API that automates the browser-based recharge process.

## File Structure

```
ben/
├── server.js              # Main server file with Express API and Playwright automation
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── .gitignore            # Git ignore rules (node_modules, logs, etc.)
├── README.md             # Complete project documentation
├── QUICKSTART.md         # Quick reference guide
├── PROJECT.md            # This file - project structure overview
├── config.example.js     # Production configuration example
├── test-server.js        # Server startup test script
├── trigger-recharge.js   # Helper script to trigger recharge
└── ben10_api.json        # Unrelated file (pre-existing in repo)
```

## Core Components

### server.js
The main application file containing:
- **Configuration**: Mobile number, UPI ID, port, and browser path
- **Express API**: REST endpoints for recharge and health check
- **Playwright Automation**: Browser automation for Jio recharge flow
- **Error Handling**: Comprehensive error catching and reporting

### Key Features:
1. **POST /recharge** - Initiates automated recharge
2. **GET /** - Health check endpoint
3. Configurable via CONFIG object
4. Uses system browser if available
5. Non-headless mode for visibility
6. Browser stays open for UPI approval

## Dependencies

### Production Dependencies:
- **express** (^4.18.2) - Web framework for REST API
- **playwright** (^1.40.0) - Browser automation library

### System Dependencies:
- Node.js v14 or higher
- Chromium browser (bundled with Playwright or system-installed)

## Configuration

All configuration is in the `CONFIG` object at the top of `server.js`:

```javascript
const CONFIG = {
  MOBILE_NUMBER: '9876543210',        // Your Jio mobile number
  UPI_ID: 'yourname@upi',             // Your UPI ID
  PORT: 3000,                         // Server port
  BROWSER_PATH: '/usr/bin/chromium'   // Browser path (optional)
};
```

## Automation Flow

The automation follows this sequence:

1. **Navigate** → Jio prepaid plans page (₹299 plan section)
2. **Find & Click** → "Buy" button for ₹299 plan
3. **Input** → Mobile number
4. **Submit** → Continue to payment page
5. **Select** → UPI payment method
6. **Expand** → "See All" UPI options
7. **Choose** → "Pay via UPI ID"
8. **Input** → UPI ID
9. **Click** → "Verify & Pay"
10. **Wait** → User approves in UPI app

## API Specification

### Endpoints

#### POST /recharge
Initiates the automated recharge process.

**Request:**
- Method: POST
- URL: http://localhost:3000/recharge
- Headers: None required
- Body: None required

**Success Response:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "message": "Recharge initiated. Approve in UPI app."
}
```

**Error Response:**
```json
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "status": "error",
  "message": "Error description",
  "details": "Stack trace details"
}
```

#### GET /
Health check and configuration display.

**Success Response:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

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

## Scripts

Available npm scripts:

```bash
npm start        # Start the server
npm test         # Test server startup and health check
npm run recharge # Trigger a recharge (server must be running)
```

## Error Handling

The application handles errors at multiple levels:

1. **Browser Launch Errors** - Falls back to system browser if Playwright browser fails
2. **Navigation Errors** - Reports timeout or connection issues
3. **Element Not Found** - Provides specific error about missing elements
4. **Payment Errors** - Catches and reports payment page issues

All errors are logged to console and returned in API response.

## Security Considerations

⚠️ **Important Security Notes:**

1. **Sensitive Data**: Mobile number and UPI ID are stored in plain text in server.js
2. **Recommendation**: Use environment variables for production
3. **No Authentication**: API endpoints are unprotected
4. **Browser Stays Open**: Browser window remains open with payment details
5. **Local Use Only**: Not designed for public deployment

## Future Enhancements

Possible improvements:
- Add environment variable support (.env file)
- Add API authentication (API keys, JWT)
- Support multiple plans (not just ₹299)
- Add scheduled automatic recharges
- Email/SMS notification on completion
- Docker containerization
- Support for other operators
- Headless mode option
- Screenshot capture on errors

## Development

### Setting Up Development Environment

```bash
# Clone repository
git clone <repo-url>
cd ben

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Configure your details
# Edit CONFIG in server.js

# Run tests
npm test

# Start development server
npm start
```

### Testing

The project includes test utilities:

1. **test-server.js** - Verifies server starts and health endpoint works
2. **trigger-recharge.js** - Tests the recharge endpoint
3. Manual testing required for full automation flow

## License

ISC

## Contributing

This is a personal automation project. Contributions welcome but ensure:
1. No breaking changes to existing API
2. Maintain backward compatibility
3. Add appropriate error handling
4. Update documentation
