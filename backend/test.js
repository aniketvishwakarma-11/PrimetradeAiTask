const http = require('http');

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: responseBody }));
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== Testing Notes API ===\n');

  try {
    // Test 1: Health Check
    console.log('Test 1: Health Check');
    let res = await makeRequest('GET', '/health');
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${res.data}\n`);

    // Test 2: Register User
    console.log('Test 2: Register User');
    res = await makeRequest('POST', '/api/v1/auth/register', {
      name: 'John Doe',
      email: 'john@test.com',
      password: 'password123'
    });
    console.log(`Status: ${res.status}`);
    const registerData = JSON.parse(res.data);
    console.log(`Response: ${JSON.stringify(registerData, null, 2)}`);
    const token = registerData.token;
    console.log(`Token: ${token}\n`);

    // Test 3: Login
    console.log('Test 3: Login User');
    res = await makeRequest('POST', '/api/v1/auth/login', {
      email: 'john@test.com',
      password: 'password123'
    });
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${res.data}\n`);

    // Test 4: Create Note
    console.log('Test 4: Create Note (with valid token)');
    res = await makeRequest('POST', '/api/v1/notes', {
      title: 'My First Note',
      content: 'This is a test note'
    });
    console.log(`Status: ${res.status}`);
    const noteData = JSON.parse(res.data);
    console.log(`Response: ${JSON.stringify(noteData, null, 2)}`);
    const noteId = noteData.data ? noteData.data._id : null;
    console.log(`Note ID: ${noteId}\n`);

    // Test 5: Get Notes without Token (should fail)
    console.log('Test 5: Get Notes WITHOUT Token (should return 401)');
    res = await makeRequest('GET', '/api/v1/notes');
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${res.data}\n`);

    console.log('=== All Tests Complete ===');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runTests();
