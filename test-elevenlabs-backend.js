#!/usr/bin/env node

/**
 * ElevenLabs Backend Integration Test
 * Tests network connectivity, agent configuration, and server responses
 */

const https = require('https');
const http = require('http');

// Configuration
const ELEVENLABS_API_KEY = 'sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0';
const AGENT_ID = 'agent_9601k7v1dtekej68p3x13zv4erse';
const BASE_URL = 'https://api.elevenlabs.io/v1';

console.log('🧪 ElevenLabs Backend Integration Test');
console.log('=====================================');
console.log(`Agent ID: ${AGENT_ID}`);
console.log(`API Key: ${ELEVENLABS_API_KEY.substring(0, 10)}...`);
console.log(`Base URL: ${BASE_URL}`);
console.log('');

// Test results
const results = {
  networkConnectivity: false,
  apiAuthentication: false,
  userInfo: null,
  agentValidation: false,
  conversationCreation: false,
  errors: []
};

// Helper function to make HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test 1: Network Connectivity
async function testNetworkConnectivity() {
  console.log('🌐 Test 1: Network Connectivity');
  try {
    const response = await makeRequest(`${BASE_URL}/user`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200 || response.status === 401) {
      results.networkConnectivity = true;
      console.log('   ✅ Network connectivity: PASS');
    } else {
      console.log('   ❌ Network connectivity: FAIL');
      results.errors.push(`Network test failed with status: ${response.status}`);
    }
  } catch (error) {
    console.log('   ❌ Network connectivity: FAIL');
    console.log(`   Error: ${error.message}`);
    results.errors.push(`Network error: ${error.message}`);
  }
  console.log('');
}

// Test 2: API Authentication
async function testApiAuthentication() {
  console.log('🔑 Test 2: API Authentication');
  try {
    const response = await makeRequest(`${BASE_URL}/user`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      results.apiAuthentication = true;
      results.userInfo = response.data;
      console.log('   ✅ API authentication: PASS');
      console.log(`   User: ${response.data.first_name} (${response.data.user_id})`);
      console.log(`   Subscription: ${response.data.subscription.tier} (${response.data.subscription.status})`);
    } else if (response.status === 401) {
      console.log('   ❌ API authentication: FAIL - Invalid API key');
      results.errors.push('Invalid API key - authentication failed');
    } else {
      console.log('   ❌ API authentication: FAIL');
      results.errors.push(`Authentication failed with status: ${response.status}`);
    }
  } catch (error) {
    console.log('   ❌ API authentication: FAIL');
    console.log(`   Error: ${error.message}`);
    results.errors.push(`Authentication error: ${error.message}`);
  }
  console.log('');
}

// Test 3: Agent Validation
async function testAgentValidation() {
  console.log('🤖 Test 3: Agent Validation');
  try {
    const response = await makeRequest(`${BASE_URL}/agents/${AGENT_ID}`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      results.agentValidation = true;
      console.log('   ✅ Agent validation: PASS');
      console.log(`   Agent: ${response.data.name || 'Unnamed'} (${response.data.agent_id})`);
    } else if (response.status === 404) {
      console.log('   ❌ Agent validation: FAIL - Agent not found');
      results.errors.push(`Agent ${AGENT_ID} not found (404)`);
    } else {
      console.log('   ❌ Agent validation: FAIL');
      results.errors.push(`Agent validation failed with status: ${response.status}`);
    }
  } catch (error) {
    console.log('   ❌ Agent validation: FAIL');
    console.log(`   Error: ${error.message}`);
    results.errors.push(`Agent validation error: ${error.message}`);
  }
  console.log('');
}

// Test 4: Conversation Creation
async function testConversationCreation() {
  console.log('💬 Test 4: Conversation Creation');
  try {
    const response = await makeRequest(`${BASE_URL}/convai/conversations`, {
      method: 'POST',
      body: {
        agent_id: AGENT_ID
      }
    });
    
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200 || response.status === 201) {
      results.conversationCreation = true;
      console.log('   ✅ Conversation creation: PASS');
      console.log(`   Conversation ID: ${response.data.conversation_id || 'Generated'}`);
    } else {
      console.log('   ❌ Conversation creation: FAIL');
      console.log(`   Response: ${response.rawData}`);
      results.errors.push(`Conversation creation failed with status: ${response.status}`);
    }
  } catch (error) {
    console.log('   ❌ Conversation creation: FAIL');
    console.log(`   Error: ${error.message}`);
    results.errors.push(`Conversation creation error: ${error.message}`);
  }
  console.log('');
}

// Test 5: Alternative Agent Endpoints
async function testAlternativeEndpoints() {
  console.log('🔍 Test 5: Alternative Agent Endpoints');
  
  const endpoints = [
    `${BASE_URL}/agents/${AGENT_ID}`,
    `${BASE_URL}/convai/agents/${AGENT_ID}`,
    `${BASE_URL}/agents/${AGENT_ID}/details`,
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`   Testing: ${endpoint}`);
      const response = await makeRequest(endpoint);
      console.log(`   Status: ${response.status}`);
      
      if (response.status === 200) {
        console.log('   ✅ Endpoint working');
        return true;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('   ❌ No alternative endpoints working');
  return false;
}

// Test 6: Rate Limiting Check
async function testRateLimiting() {
  console.log('⏱️ Test 6: Rate Limiting Check');
  try {
    const response = await makeRequest(`${BASE_URL}/user`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 429) {
      console.log('   ⚠️ Rate limited - wait before retrying');
      results.errors.push('Rate limited - too many requests');
    } else if (response.status === 200) {
      console.log('   ✅ No rate limiting issues');
    }
  } catch (error) {
    console.log('   ❌ Rate limiting test failed');
    results.errors.push(`Rate limiting test error: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('Starting comprehensive backend tests...\n');
  
  await testNetworkConnectivity();
  await testApiAuthentication();
  await testAgentValidation();
  await testConversationCreation();
  await testAlternativeEndpoints();
  await testRateLimiting();
  
  // Summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`Network Connectivity: ${results.networkConnectivity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Authentication: ${results.apiAuthentication ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Agent Validation: ${results.agentValidation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Conversation Creation: ${results.conversationCreation ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors Found:');
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  console.log('\n🎯 Recommendation:');
  if (results.networkConnectivity && results.apiAuthentication) {
    if (results.agentValidation) {
      console.log('✅ Backend integration is working correctly');
      console.log('   The issue is likely in the React Native SDK or mobile app');
    } else {
      console.log('⚠️ Agent validation failed - check agent ID');
      console.log('   Try creating a new agent or using a different agent ID');
    }
  } else {
    console.log('❌ Backend connectivity issues detected');
    console.log('   Check network connection and API key');
  }
}

// Run the tests
runAllTests().catch(console.error);
