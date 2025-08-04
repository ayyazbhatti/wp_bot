const ApiService = require('./api');

async function testApi() {
  console.log('Testing API integration...');
  
  const apiService = new ApiService();
  
  // Test with sample data
  const testName = 'Test User';
  const testEmail = 'test@example.com';
  
  console.log(`Testing registration with: ${testName}, ${testEmail}`);
  
  try {
    const result = await apiService.registerUser(testName, testEmail);
    
    console.log('API Response:', result);
    
    if (result.success) {
      console.log('✅ API test successful!');
      console.log('Email:', result.data.email);
      console.log('Password:', result.data.password);
      console.log('Auto Login URL:', result.data.auto_login_url);
    } else {
      console.log('❌ API test failed:', result.message);
    }
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
}

// Run the test
testApi(); 