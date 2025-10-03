#!/usr/bin/env node

// Simple test to verify the server can start and basic endpoints work
const http = require('http');

console.log('Testing server startup...\n');

// Start the server
const serverProcess = require('child_process').spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'pipe']
});

let serverOutput = '';

serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log(data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

// Wait for server to start
setTimeout(() => {
  console.log('\nTesting health check endpoint...');
  
  // Test the health check endpoint
  http.get('http://localhost:3000/', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Health check response:', data);
      const response = JSON.parse(data);
      
      if (response.status === 'running') {
        console.log('\n✓ Server is running correctly');
        console.log('✓ Health check endpoint working');
        console.log('\nServer is ready to handle recharge requests.');
        console.log('To test recharge: curl -X POST http://localhost:3000/recharge\n');
      } else {
        console.error('✗ Unexpected response from server');
      }
      
      // Keep the server running for manual testing
      console.log('Server is still running. Press Ctrl+C to stop.');
    });
  }).on('error', (err) => {
    console.error('✗ Failed to connect to server:', err.message);
    serverProcess.kill();
    process.exit(1);
  });
}, 3000);

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  serverProcess.kill();
  process.exit(0);
});
