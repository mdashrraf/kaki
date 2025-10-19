// HTTP-based Voice Service as alternative to WebRTC
// This service uses HTTP requests instead of WebRTC for more reliable connections

import VoiceAgentService from './VoiceAgentService';

export class HttpVoiceService {
  static BASE_URL = VoiceAgentService.ELEVENLABS_BASE_URL;
  static API_KEY = VoiceAgentService.API_KEY;
  static AGENT_ID = VoiceAgentService.AGENT_ID;

  /**
   * Send voice message via HTTP and get text response
   * @param {string} audioUri - URI of the recorded audio file
   * @returns {Promise<Object>} Response from the voice agent
   */
  static async sendVoiceMessage(audioUri) {
    try {
      console.log('🔄 Sending voice message via HTTP...');
      
      // For now, we'll simulate the HTTP request
      // In a real implementation, you would:
      // 1. Convert audio file to the format expected by ElevenLabs
      // 2. Send HTTP POST request to ElevenLabs API
      // 3. Receive text response
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate response based on audio content
      const mockResponses = [
        "Hello! I'm your Kaki voice assistant. How can I help you today?",
        "I understand you need assistance. What would you like me to help you with?",
        "Great! I'm here to help you with your daily tasks. What do you need?",
        "I'm ready to assist you. Please tell me what you'd like to do.",
        "Hello! I can help you book rides, order food, or manage your tasks. What would you like?"
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const response = {
        message: randomResponse,
        timestamp: new Date().toISOString(),
        agentId: this.AGENT_ID,
        success: true
      };
      
      console.log('✅ Voice message processed:', response);
      return response;
      
    } catch (error) {
      console.error('❌ HTTP voice message failed:', error);
      throw error;
    }
  }

  /**
   * Convert text response to speech using ElevenLabs TTS
   * @param {string} text - Text to convert to speech
   * @returns {Promise<string>} Audio URL or base64 audio data
   */
  static async textToSpeech(text) {
    try {
      console.log('🔊 Converting text to speech:', text);
      
      // In a real implementation, you would:
      // 1. Send text to ElevenLabs TTS API
      // 2. Receive audio file
      // 3. Return audio URL or data
      
      // For now, return a mock audio URL
      const audioUrl = `https://api.elevenlabs.io/v1/text-to-speech/voice_id/audio?text=${encodeURIComponent(text)}`;
      
      console.log('✅ Text-to-speech completed');
      return audioUrl;
      
    } catch (error) {
      console.error('❌ Text-to-speech failed:', error);
      throw error;
    }
  }

  /**
   * Process voice command and return structured response
   * @param {string} audioUri - URI of the recorded audio
   * @returns {Promise<Object>} Structured response with action and message
   */
  static async processVoiceCommand(audioUri) {
    try {
      console.log('🎯 Processing voice command...');
      
      // Get text response from voice message
      const voiceResponse = await this.sendVoiceMessage(audioUri);
      
      // Parse the response to determine action
      const command = VoiceAgentService.parseVoiceCommand(voiceResponse.message);
      
      // Get audio response
      const audioUrl = await this.textToSpeech(voiceResponse.message);
      
      const response = {
        ...voiceResponse,
        audioUrl,
        command,
        action: command.action,
        type: command.type
      };
      
      console.log('✅ Voice command processed:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Voice command processing failed:', error);
      throw error;
    }
  }

  /**
   * Test HTTP voice service connection
   * @returns {Promise<Object>} Connection test results
   */
  static async testConnection() {
    try {
      console.log('🧪 Testing HTTP voice service connection...');
      
      // Test API key validity
      if (!VoiceAgentService.validateApiKey()) {
        return {
          success: false,
          error: 'Invalid API key'
        };
      }
      
      // Test basic API connectivity
      const response = await fetch(`${this.BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.API_KEY,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ HTTP voice service connection successful');
        
        return {
          success: true,
          userData,
          message: 'HTTP voice service is working'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: `API error: ${response.status} - ${errorText}`
        };
      }
      
    } catch (error) {
      console.error('❌ HTTP voice service test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get available voices for TTS
   * @returns {Promise<Array>} List of available voices
   */
  static async getAvailableVoices() {
    try {
      console.log('🔍 Getting available voices...');
      
      const response = await fetch(`${this.BASE_URL}/voices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.API_KEY,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Available voices retrieved');
        return data.voices || [];
      } else {
        throw new Error(`Failed to get voices: ${response.status}`);
      }
      
    } catch (error) {
      console.error('❌ Failed to get available voices:', error);
      return [];
    }
  }

  /**
   * Create a conversation session
   * @returns {Promise<string>} Session ID
   */
  static async createSession() {
    try {
      console.log('🔄 Creating HTTP voice session...');
      
      // In a real implementation, you would create a session with your backend
      const sessionId = `http-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('✅ HTTP voice session created:', sessionId);
      return sessionId;
      
    } catch (error) {
      console.error('❌ Failed to create HTTP voice session:', error);
      throw error;
    }
  }

  /**
   * End a conversation session
   * @param {string} sessionId - Session ID to end
   */
  static async endSession(sessionId) {
    try {
      console.log('🛑 Ending HTTP voice session:', sessionId);
      
      // In a real implementation, you would end the session with your backend
      console.log('✅ HTTP voice session ended');
      
    } catch (error) {
      console.error('❌ Failed to end HTTP voice session:', error);
      throw error;
    }
  }
}

export default HttpVoiceService;
