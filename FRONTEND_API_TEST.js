// Frontend API Test Script
// Copy and paste this into your browser console (F12) to test

console.log('=== EDUX FRONTEND API TEST SCRIPT ===');

// Get the auth token
const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
console.log('Token found:', !!token);
if (token) {
  console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
}

// Test 1: Check if backend is running
async function testBackendConnection() {
  console.log('\n--- Test 1: Backend Connection ---');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/members/students/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    const data = await response.json();
    console.log('Response:', data);
    console.log('✅ Backend is running');
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
}

// Test 2: Try creating a student with minimal data
async function testCreateStudentMinimal() {
  console.log('\n--- Test 2: Create Student (Minimal) ---');
  
  const timestamp = Date.now();
  const payload = {
    name: `Test Student ${timestamp}`,
    username: `test_${timestamp}`,
    password: 'testpass123'
  };
  
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/members/students/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Student created successfully');
      return true;
    } else {
      console.log('❌ Failed to create student');
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
    return false;
  }
}

// Test 3: Try creating a student with full data
async function testCreateStudentFull() {
  console.log('\n--- Test 3: Create Student (Full) ---');
  
  const timestamp = Date.now();
  const payload = {
    name: `Ahmed Benali ${timestamp}`,
    username: `ahmed_${timestamp}`,
    password: 'SecurePassword123',
    email: `ahmed${timestamp}@example.com`,
    phone_number: '+213555123456',
    fee_payment: 5000.00
  };
  
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/members/students/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Student created successfully');
      return true;
    } else {
      console.log('❌ Failed to create student');
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
    return false;
  }
}

// Test 4: Get all students (verify list endpoint works)
async function testGetStudents() {
  console.log('\n--- Test 4: Get All Students ---');
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/members/students/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Number of students:', Array.isArray(data) ? data.length : 'N/A');
    console.log('Sample student:', Array.isArray(data) && data.length > 0 ? data[0] : 'No students');
    
    if (response.ok) {
      console.log('✅ Get students successful');
      return true;
    } else {
      console.log('❌ Failed to get students');
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting all tests...\n');
  
  const test1 = await testBackendConnection();
  if (!test1) {
    console.log('\n⛔ Backend not running. Cannot continue tests.');
    return;
  }
  
  await testGetStudents();
  await testCreateStudentMinimal();
  await testCreateStudentFull();
  
  console.log('\n=== TESTS COMPLETE ===');
}

// Run the tests
runAllTests();

// Instructions to use this script:
/*
1. Open your application in browser
2. Make sure you're logged in
3. Press F12 to open DevTools
4. Go to Console tab
5. Paste this entire script
6. Press Enter
7. Watch the console output for results

The script will:
- Check if you have a valid auth token
- Test connection to backend
- Try creating students with different data
- Show any errors from the backend
*/
