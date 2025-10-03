# Jio Recharge Automation

Automated Jio recharge using Node.js and Playwright. This script automates the process of initiating a Jio prepaid recharge via a REST API.

## Features

- Express.js REST API with a single `/recharge` endpoint
- Automated browser navigation using Playwright
- Finds and selects the ₹299 Jio prepaid plan
- Fills in mobile number and UPI ID automatically
- Stops at UPI payment approval step

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ben
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Configuration

Edit the `CONFIG` object at the top of `server.js` to set your details:

```javascript
const CONFIG = {
  MOBILE_NUMBER: '9876543210',  // Replace with your mobile number
  UPI_ID: 'yourname@upi',        // Replace with your UPI ID
  PORT: 3000
};
```

## Usage

1. Start the server:
```bash
npm start
```

2. Send a POST request to initiate recharge:
```bash
curl -X POST http://localhost:3000/recharge
```

Or use any API client like Postman.

3. The browser will open and automate the recharge process.

4. Approve the payment in your UPI app when prompted.

## API Endpoints

### POST /recharge

Initiates the Jio recharge automation process.

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

Health check endpoint that shows the current configuration.

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

## Automation Flow

1. Opens Jio prepaid plans page
2. Finds the ₹299 plan card
3. Clicks the "Buy" button
4. Enters configured mobile number
5. Submits and continues to payment page
6. Selects UPI payment method
7. Clicks "See All" under UPI options
8. Selects "Pay via UPI ID"
9. Enters configured UPI ID
10. Clicks "Verify & Pay"
11. Stops automation (user approves in UPI app)

## Notes

- The browser runs in non-headless mode by default so you can see the automation in action
- The browser window stays open after automation completes, allowing you to manually approve the UPI payment
- Make sure your mobile number and UPI ID are correctly configured before running
- The automation may need adjustments if Jio's website structure changes

## Troubleshooting

If the automation fails:
1. Check that the Jio website is accessible
2. Verify the ₹299 plan is available in the Popular Plans section
3. Ensure your mobile number and UPI ID are correctly formatted
4. Check the console logs for specific error messages

## License

ISC
