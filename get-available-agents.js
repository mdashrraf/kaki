#!/usr/bin/env node

/**
 * Get Available Agents from ElevenLabs Account
 */

const https = require('https');

const ELEVENLABS_API_KEY = 'sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0';
const BASE_URL = 'https://api.elevenlabs.io/v1';

console.log('🔍 Getting Available Agents from ElevenLabs Account');
console.log('====================================================');

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

async function getAvailableAgents() {
  try {
    console.log('Fetching agents from ElevenLabs...');
    
    const response = await makeRequest(`${BASE_URL}/agents`);
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      const agents = response.data;
      console.log(`\n✅ Found ${agents.length} agent(s):`);
      console.log('=====================================');
      
      if (agents.length === 0) {
        console.log('❌ No agents found in your account');
        console.log('You need to create an agent first at: https://elevenlabs.io/conversational-ai');
        return;
      }
      
      agents.forEach((agent, index) => {
        console.log(`\n${index + 1}. Agent: ${agent.name || 'Unnamed'}`);
        console.log(`   ID: ${agent.agent_id}`);
        console.log(`   Status: ${agent.status || 'Unknown'}`);
        console.log(`   Created: ${agent.created_at ? new Date(agent.created_at * 1000).toISOString() : 'Unknown'}`);
        console.log(`   Voice: ${agent.voice_id || 'Default'}`);
        console.log(`   Language: ${agent.language || 'en'}`);
      });
      
      console.log('\n🎯 To fix the app:');
      console.log('1. Copy one of the agent IDs above');
      console.log('2. Update the AGENT_ID in VoiceAgentService.js');
      console.log('3. Replace: static AGENT_ID = \'agent_9601k7v1dtekej68p3x13zv4erse\';');
      console.log('4. With: static AGENT_ID = \'<your_actual_agent_id>\';');
      
    } else {
      console.log(`❌ Failed to fetch agents: ${response.status}`);
      console.log(`Response: ${response.rawData}`);
    }
    
  } catch (error) {
    console.log(`❌ Error fetching agents: ${error.message}`);
  }
}

getAvailableAgents();
