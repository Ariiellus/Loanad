import fetch from 'node-fetch';

const BACKEND_URL = 'https://loanadback-a5w05fhc5-ariiellus-projects.vercel.app';

async function testDeployedBackend() {
  console.log('🧪 Testing deployed backend CORS...\n');
  
  try {
    // Test 1: Test CORS endpoint
    console.log('1️⃣ Testing /api/test-cors...');
    const corsResponse = await fetch(`${BACKEND_URL}/api/test-cors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://loanad.vercel.app'
      }
    });
    
    console.log(`Status: ${corsResponse.status}`);
    console.log(`CORS Headers:`, {
      'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': corsResponse.headers.get('Access-Control-Allow-Credentials')
    });
    
    if (corsResponse.ok) {
      const data = await corsResponse.json();
      console.log('✅ Response:', data);
    } else {
      console.log('❌ Error response');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Test check-verification endpoint
    console.log('2️⃣ Testing /api/check-verification...');
    const verificationResponse = await fetch(`${BACKEND_URL}/api/check-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://loanad.vercel.app'
      },
      body: JSON.stringify({
        userAddress: '0xB91C043aF89D9d9699DBA10E47b1a48279baDf7F'
      })
    });
    
    console.log(`Status: ${verificationResponse.status}`);
    console.log(`CORS Headers:`, {
      'Access-Control-Allow-Origin': verificationResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': verificationResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': verificationResponse.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': verificationResponse.headers.get('Access-Control-Allow-Credentials')
    });
    
    if (verificationResponse.ok) {
      const data = await verificationResponse.json();
      console.log('✅ Response:', data);
    } else {
      console.log('❌ Error response');
      const errorData = await verificationResponse.text();
      console.log('Error details:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDeployedBackend();
