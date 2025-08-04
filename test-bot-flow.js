const ApiService = require('./api');

async function testBotFlow() {
  console.log('Testing bot flow simulation...');
  
  const apiService = new ApiService();
  
  // Simulate the exact flow from the screenshot
  const testName = 'ayyaz';
  const testEmail = 'ayyaz@gmail.com';
  
  console.log(`\n=== Testing with exact data from screenshot ===`);
  console.log(`Name: ${testName}`);
  console.log(`Email: ${testEmail}`);
  
  try {
    const result = await apiService.registerUser(testName, testEmail);
    
    console.log('\n=== API Response ===');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCCESS!');
      console.log('Email:', result.data.email);
      console.log('Password:', result.data.password);
      console.log('Auto Login URL:', result.data.auto_login_url);
      
      // Simulate what the bot should send
      console.log('\n=== Bot Messages ===');
      console.log('1. Success message:', result.message);
      console.log('2. Login button with URL:', result.data.auto_login_url);
    } else {
      console.log('\n❌ FAILED:', result.message);
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

// Run the test
testBotFlow(); 