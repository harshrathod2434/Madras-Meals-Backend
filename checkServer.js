require('dotenv').config();
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 2000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const data = JSON.stringify({
  email: 'admin@madrasmeals.com',
  password: 'adminPassword123'
});

console.log('Checking server connection and auth endpoint...');
console.log(`Attempting to connect to http://localhost:${process.env.PORT || 2000}/api/auth/login`);

const req = http.request(options, (res) => {
  console.log(`Server responded with status code: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(responseData);
      console.log('Response data:', parsedData);
      
      if (res.statusCode === 200 && parsedData.token) {
        console.log('✅ Login endpoint is working correctly!');
      } else {
        console.log('❌ Login endpoint returned an error or unexpected response.');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Server connection error:', error.message);
  console.log('❌ Server may not be running or is not accessible.');
});

// Write request body
req.write(data);
req.end(); 