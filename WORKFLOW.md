# Workflow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / CLIENT                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST /recharge
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS SERVER                           │
│                      (server.js:3000)                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GET /          → Health Check                         │    │
│  │  POST /recharge → Start Automation                     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Launch Browser
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PLAYWRIGHT AUTOMATION                       │
│                      (Chromium Browser)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Navigate & Interact
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         JIO WEBSITE                              │
│                    (www.jio.com/selfcare)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Automation Flow

```
START
  │
  ├─► 1. Launch Browser (Chromium)
  │
  ├─► 2. Navigate to Jio Plans Page
  │      URL: jio.com/selfcare/plans/mobility/prepaid-plans-list
  │
  ├─► 3. Find ₹299 Plan Card
  │      • Search for text containing "299"
  │      • Locate associated "Buy" button
  │
  ├─► 4. Click "Buy" Button
  │
  ├─► 5. Wait for Mobile Number Form
  │
  ├─► 6. Enter Mobile Number
  │      • Input: CONFIG.MOBILE_NUMBER
  │      • Selector: input[type="tel"]
  │
  ├─► 7. Click Continue/Submit
  │
  ├─► 8. Navigate to Payment Page
  │
  ├─► 9. Select UPI Payment Method
  │
  ├─► 10. Click "See All" under UPI
  │
  ├─► 11. Select "Pay via UPI ID"
  │
  ├─► 12. Enter UPI ID
  │       • Input: CONFIG.UPI_ID
  │
  ├─► 13. Click "Verify & Pay"
  │
  ├─► 14. Return Success Response
  │       {
  │         "status": "success",
  │         "message": "Recharge initiated. Approve in UPI app."
  │       }
  │
  └─► 15. Keep Browser Open
         • User approves payment in UPI app
         • Manual verification step
  
END (Success)


ERROR HANDLING:
  │
  ├─► If any step fails:
  │      • Close browser
  │      • Return error response:
  │        {
  │          "status": "error",
  │          "message": "Error description",
  │          "details": "Stack trace"
  │        }
  │
  └─► Log error to console
```

## Request/Response Flow

```
Client Request:
┌──────────────────────────────────┐
│ POST /recharge                   │
│ Host: localhost:3000             │
│ Content-Type: application/json   │
└──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│ Express Server                   │
│ • Validate request               │
│ • Launch Playwright              │
│ • Execute automation             │
└──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│ Browser Automation               │
│ • Navigate pages                 │
│ • Fill forms                     │
│ • Click buttons                  │
│ • Handle payment flow            │
└──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│ Success Response                 │
│ HTTP 200 OK                      │
│ {                                │
│   "status": "success",           │
│   "message": "Recharge..."       │
│ }                                │
└──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│ Client Receives Response         │
│ • Browser stays open             │
│ • User approves in UPI app       │
└──────────────────────────────────┘
```

## Component Interaction

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   Express   │─────▶│  Playwright │
│  (HTTP)     │      │   Server    │      │  (Browser)  │
└─────────────┘      └─────────────┘      └─────────────┘
      ▲                     │                     │
      │                     │                     │
      │                     │                     ▼
      │                     │              ┌─────────────┐
      │                     │              │     Jio     │
      │                     │              │   Website   │
      │                     │              └─────────────┘
      │                     │                     │
      │                     ▼                     │
      │              ┌─────────────┐             │
      │              │   Config    │             │
      │              │  (Mobile#   │             │
      │              │   UPI ID)   │             │
      │              └─────────────┘             │
      │                                          │
      └──────────────────────────────────────────┘
                  (Success/Error Response)
```

## File Dependencies

```
server.js
    │
    ├─► require('express')
    │      └─► Express.js framework
    │
    ├─► require('playwright')
    │      └─► Browser automation
    │
    └─► require('fs')
           └─► File system operations

test-server.js
    │
    ├─► require('http')
    │      └─► HTTP client
    │
    └─► spawn('node', ['server.js'])
           └─► Child process

trigger-recharge.js
    │
    └─► require('http')
           └─► HTTP client for API calls
```

## npm Scripts Flow

```
npm start
    │
    └─► node server.js
           └─► Starts Express server on port 3000

npm test
    │
    └─► node test-server.js
           ├─► Spawns server.js
           ├─► Waits for startup
           ├─► Tests GET /
           └─► Reports results

npm run recharge
    │
    └─► node trigger-recharge.js
           ├─► Sends POST /recharge
           └─► Displays response
```

## Data Flow

```
Configuration (server.js)
    │
    ├─► MOBILE_NUMBER ─────────┐
    ├─► UPI_ID ────────────────┤
    ├─► PORT ──────────────────┤
    └─► BROWSER_PATH ──────────┤
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Automation Engine  │
                    └─────────────────────┘
                               │
                               ├─► Form 1: Mobile Number
                               │
                               ├─► Form 2: UPI ID
                               │
                               └─► Browser Launch Path
```

## State Transitions

```
[IDLE]
   │
   │ POST /recharge received
   ▼
[LAUNCHING BROWSER]
   │
   ▼
[NAVIGATING]
   │
   ▼
[FINDING PLAN]
   │
   ▼
[ENTERING MOBILE]
   │
   ▼
[SUBMITTING FORM]
   │
   ▼
[PAYMENT PAGE]
   │
   ▼
[UPI SELECTION]
   │
   ▼
[ENTERING UPI ID]
   │
   ▼
[VERIFY & PAY]
   │
   ▼
[AWAITING APPROVAL] ← Browser stays open
   │
   └─► [SUCCESS] → Return to client
```

## Error Handling Flow

```
Any Step
   │
   │ Error occurs
   ▼
┌──────────────────────┐
│ Catch Error          │
└──────────────────────┘
   │
   ├─► Log to console
   │
   ├─► Close browser (if open)
   │
   └─► Return error response
        {
          "status": "error",
          "message": "...",
          "details": "..."
        }
```

## Usage Examples

### Example 1: Using curl
```bash
$ npm start
# In another terminal:
$ curl -X POST http://localhost:3000/recharge
{"status":"success","message":"Recharge initiated. Approve in UPI app."}
```

### Example 2: Using Node.js
```bash
$ npm start
# In another terminal:
$ npm run recharge
Initiating Jio recharge...
Response: {"status":"success","message":"Recharge initiated. Approve in UPI app."}
✓ Recharge initiated. Approve in UPI app.
```

### Example 3: Testing
```bash
$ npm test
Testing server startup...
Server running on http://localhost:3000
✓ Server is running correctly
✓ Health check endpoint working
```
