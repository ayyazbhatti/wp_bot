const ApiService = require('./api');

// Simulate the exact conversation flow from the screenshot
async function testExactFlow() {
  console.log('🧪 Testing exact conversation flow from screenshot...\n');
  
  const apiService = new ApiService();
  
  // Simulate the conversation steps
  const steps = [
    { step: 1, action: 'User sends: "hello"', state: 'WELCOME' },
    { step: 2, action: 'Bot sends welcome message', state: 'WAITING_FOR_YES' },
    { step: 3, action: 'User sends: "si"', state: 'WAITING_FOR_NAME' },
    { step: 4, action: 'Bot requests name', state: 'WAITING_FOR_NAME' },
    { step: 5, action: 'User sends: "ayyaz"', state: 'WAITING_FOR_EMAIL' },
    { step: 6, action: 'Bot requests email', state: 'WAITING_FOR_EMAIL' },
    { step: 7, action: 'User sends: "ayyaz@gmail.com"', state: 'COMPLETED' }
  ];
  
  console.log('📋 Conversation Flow:');
  steps.forEach(step => {
    console.log(`${step.step}. ${step.action} (State: ${step.state})`);
  });
  
  console.log('\n🔍 Testing API call with exact data...');
  
  // Test the API call with the exact data from screenshot
  const testName = 'ayyaz';
  const testEmail = 'ayyaz@gmail.com';
  
  try {
    console.log(`📤 Calling API with:`);
    console.log(`   Name: "${testName}"`);
    console.log(`   Email: "${testEmail}"`);
    
    const result = await apiService.registerUser(testName, testEmail);
    
    console.log('\n📡 API Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCCESS! Bot should send:');
      console.log(`1. "${result.message}"`);
      console.log(`2. Login button with URL: ${result.data.auto_login_url}`);
      
      console.log('\n🎯 Expected WhatsApp messages:');
      console.log('📱 Message 1: "Fatto ✅ Il tuo account è stato creato. Bonus 20€ attivo e bot operativo."');
      console.log('🔗 Message 2: Login button with URL');
      console.log('🔗 Message 3: "🔗 Link di accesso: [URL]"');
    } else {
      console.log('\n❌ FAILED:', result.message);
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

// Run the test
testExactFlow(); 