#!/usr/bin/env node

// Example script to call the recharge API
const http = require('http');

console.log('Initiating Jio recharge...\n');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/recharge',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    const response = JSON.parse(data);
    
    if (response.status === 'success') {
      console.log('\n✓', response.message);
    } else {
      console.error('\n✗ Error:', response.message);
    }
  });
});

req.on('error', (error) => {
  console.error('✗ Failed to connect to server:', error.message);
  console.log('\nMake sure the server is running: npm start');
});

req.end();
