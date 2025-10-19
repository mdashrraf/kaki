#!/usr/bin/env node

/**
 * Test ConvAI Endpoints - Find Working Agent
 */

const https = require('https');

const ELEVENLABS_API_KEY = 'sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0';
const AGENT_ID = 'agent_9601k7v1dtekej68p3x13zv4erse';
const BASE_URL = 'https://api.elevenlabs.io/v1';

console.log('🔍 Testing ConvAI Endpoints');
console.log('============================');

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

async function testConvAIEndpoints() {
  console.log('Testing ConvAI-specific endpoints...\n');
  
  // Test 1: ConvAI Agents endpoint (this worked in the previous test)
  console.log('1. Testing ConvAI Agents endpoint:');
  try {
    const response = await makeRequest(`${BASE_URL}/convai/agents/${AGENT_ID}`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('   ✅ ConvAI agent endpoint working!');
      console.log('   Agent Data:', JSON.stringify(response.data, null, 2));
    } else {
      console.log(`   ❌ Failed: ${response.rawData}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
  
  // Test 2: Try to create a conversation with the agent
  console.log('2. Testing conversation creation:');
  try {
    const response = await makeRequest(`${BASE_URL}/convai/conversations`, {
      method: 'POST',
      body: {
        agent_id: AGENT_ID
      }
    });
    
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200 || response.status === 201) {
      console.log('   ✅ Conversation creation working!');
      console.log('   Conversation Data:', JSON.stringify(response.data, null, 2));
    } else {
      console.log(`   ❌ Failed: ${response.rawData}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
  
  // Test 3: Try different conversation endpoints
  console.log('3. Testing alternative conversation endpoints:');
  const conversationEndpoints = [
    `${BASE_URL}/convai/conversations`,
    `${BASE_URL}/convai/sessions`,
    `${BASE_URL}/conversations`,
  ];
  
  for (const endpoint of conversationEndpoints) {
    try {
      console.log(`   Testing: ${endpoint}`);
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: {
          agent_id: AGENT_ID
        }
      });
      console.log(`   Status: ${response.status}`);
      
      if (response.status === 200 || response.status === 201) {
        console.log('   ✅ Working endpoint found!');
        console.log('   Data:', JSON.stringify(response.data, null, 2));
        break;
      } else {
        console.log(`   ❌ Failed: ${response.rawData}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  console.log('');
  
  // Test 4: Check if we can list ConvAI agents
  console.log('4. Testing ConvAI agents list:');
  try {
    const response = await makeRequest(`${BASE_URL}/convai/agents`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('   ✅ ConvAI agents list working!');
      console.log(`   Found ${response.data.length} agents:`);
      response.data.forEach((agent, index) => {
        console.log(`   ${index + 1}. ${agent.name || 'Unnamed'} (${agent.agent_id})`);
      });
    } else {
      console.log(`   ❌ Failed: ${response.rawData}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

testConvAIEndpoints().catch(console.error);
