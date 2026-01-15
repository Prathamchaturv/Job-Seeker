// Test authentication endpoints
async function testAuthEndpoints() {
  console.log('\n🧪 Testing Authentication Endpoints\n');

  // Test 1: Job Seeker Signup
  console.log('1️⃣  Testing Job Seeker Signup...');
  try {
    const signupResponse = await fetch('http://localhost:3001/api/auth/job-seeker/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'Password123!'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('   ✅ Status:', signupResponse.status);
    console.log('   Response:', JSON.stringify(signupData, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n2️⃣  Testing Job Seeker Login...');
  try {
    const loginResponse = await fetch('http://localhost:3001/api/auth/job-seeker/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: 'test@example.com',
        password: 'Password123!'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('   ✅ Status:', loginResponse.status);
    console.log('   Response:', JSON.stringify(loginData, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n3️⃣  Testing Company Signup...');
  try {
    const companySignupResponse = await fetch('http://localhost:3001/api/auth/company/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Test Company Inc',
        workEmail: 'admin@testcompany.com',
        password: 'CompanyPass123!'
      })
    });
    
    const companySignupData = await companySignupResponse.json();
    console.log('   ✅ Status:', companySignupResponse.status);
    console.log('   Response:', JSON.stringify(companySignupData, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n4️⃣  Testing Company Login...');
  try {
    const companyLoginResponse = await fetch('http://localhost:3001/api/auth/company/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workEmail: 'admin@testcompany.com',
        password: 'CompanyPass123!'
      })
    });
    
    const companyLoginData = await companyLoginResponse.json();
    console.log('   ✅ Status:', companyLoginResponse.status);
    console.log('   Response:', JSON.stringify(companyLoginData, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n✨ Testing complete!\n');
}

// Wait a bit for server to be ready, then run tests
setTimeout(testAuthEndpoints, 2000);
