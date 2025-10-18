// ElevenLabs Voice Agent Service
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export class VoiceAgentService {
  static AGENT_ID = process.env.ELEVENLABS_AGENT_ID || 'agent_9601k7v1dtekej68p3x13zv4erse';
  static COMPANION_AGENT_ID = 'agent_8601k7tybe14e16tf75gmjdede86'; // Original companion agent
  static ELEVENLABS_BASE_URL = process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io/v1';
  
  // ElevenLabs API key from environment variables
  static API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0';

  /**
   * Parse voice command to determine action
   * @param {string} userMessage - User's voice message
   * @returns {Object} Parsed command with action and details
   */
  static parseVoiceCommand(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Ride booking commands
    if (message.includes('book') && (message.includes('ride') || message.includes('taxi') || message.includes('uber') || message.includes('grab'))) {
      return {
        action: 'ride',
        type: 'booking',
        details: {
          service: 'ride_booking',
          message: userMessage,
        },
      };
    }
    
    // Food ordering commands
    if (message.includes('order') && (message.includes('food') || message.includes('meal') || message.includes('restaurant') || message.includes('delivery'))) {
      return {
        action: 'food',
        type: 'ordering',
        details: {
          service: 'food_ordering',
          message: userMessage,
        },
      };
    }
    
    // Grocery ordering commands
    if (message.includes('order') && (message.includes('grocery') || message.includes('groceries') || message.includes('supermarket') || message.includes('food shopping'))) {
      return {
        action: 'grocery',
        type: 'ordering',
        details: {
          service: 'grocery_ordering',
          message: userMessage,
        },
      };
    }
    
    // Bill payment commands
    if (message.includes('pay') && (message.includes('bill') || message.includes('bills') || message.includes('payment') || message.includes('utilities'))) {
      return {
        action: 'bills',
        type: 'payment',
        details: {
          service: 'bill_payment',
          message: userMessage,
        },
      };
    }
    
    // Companion-specific commands
    if (message.includes('companion') || message.includes('chat') || message.includes('talk') || message.includes('conversation')) {
      return {
        action: 'companion',
        type: 'conversation',
        details: {
          service: 'companion_conversation',
          message: userMessage,
          useCompanionAgent: true,
        },
      };
    }
    
    // Default companion conversation
    return {
      action: 'companion',
      type: 'conversation',
      details: {
        service: 'general_conversation',
        message: userMessage,
      },
    };
  }
  /**
   * Start voice conversation with ElevenLabs agent
   * @param {string} userMessage - User's voice message
   * @param {Object} command - Parsed command object
   * @returns {Promise<string>} Agent's response
   */
  static async startVoiceConversation(userMessage, command = null) {
    try {
      console.log('Starting voice conversation with ElevenLabs agent...');
      
      // Determine which agent to use
      const agentId = command?.details?.useCompanionAgent 
        ? this.COMPANION_AGENT_ID 
        : this.AGENT_ID;
      
      console.log(`Using agent: ${agentId}`);
      
      // Use text-to-speech with proper voice ID
      const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default voice ID
      
      const response = await fetch(`${this.ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `I received your message: "${userMessage}". How can I help you today?`,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      // For text-to-speech, we'll use the fallback response and speak it
      const agentResponse = `I received your message: "${userMessage}". How can I help you today?`;
      
      // Speak the response
      await this.speakResponse(agentResponse);
      
      return agentResponse;
    } catch (error) {
      console.error('Error in voice conversation:', error);
      
      // Fallback to simulation if API fails
      const fallbackResponse = await this.simulateAgentResponse(userMessage);
      await this.speakResponse(fallbackResponse);
      
      return fallbackResponse;
    }
  }

  /**
   * Simulate agent response (replace with actual ElevenLabs API call)
   * @param {string} userMessage - User's message
   * @returns {Promise<string>} Simulated response
   */
  static async simulateAgentResponse(userMessage) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response simulation
    const responses = [
      "Hello! I'm your Kaki companion. How can I help you today?",
      "I'm here to assist you with your daily tasks. What would you like to do?",
      "Great to hear from you! I can help you order groceries, book rides, or set reminders.",
      "I'm your voice-enabled companion. Just tell me what you need help with!",
      "Hello! I'm ready to help you with any tasks you have in mind."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Convert text to speech using device TTS
   * @param {string} text - Text to speak
   */
  static async speakResponse(text) {
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Error speaking response:', error);
    }
  }

  /**
   * Start listening for user voice input
   * @returns {Promise<string>} User's spoken message
   */
  static async startListening() {
    try {
      console.log('Starting voice input...');
      
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }

      // For now, simulate voice input
      // In a real implementation, you would use speech recognition
      const simulatedInput = "Hello Kaki, I need help with my daily tasks";
      
      return simulatedInput;
    } catch (error) {
      console.error('Error starting voice input:', error);
      throw error;
    }
  }

  /**
   * Stop listening for voice input
   */
  static async stopListening() {
    try {
      console.log('Stopping voice input...');
      // Stop any ongoing speech recognition
    } catch (error) {
      console.error('Error stopping voice input:', error);
    }
  }

  /**
   * Initialize voice agent
   */
  static async initialize() {
    try {
      console.log('Initializing ElevenLabs voice agent...');
      
      // Request audio permissions first
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }
      
      // Set up audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      });

      console.log('Voice agent initialized successfully');
    } catch (error) {
      console.error('Error initializing voice agent:', error);
      throw error;
    }
  }

  /**
   * Get agent configuration
   * @returns {Object} Agent configuration
   */
  static getAgentConfig() {
    return {
      agentId: this.AGENT_ID,
      baseUrl: this.ELEVENLABS_BASE_URL,
      apiKey: this.API_KEY,
    };
  }

  /**
   * Test ElevenLabs API connection for both agents
   * @returns {Promise<Object>} Connection status for both agents
   */
  static async testConnection() {
    try {
      const results = {
        mainAgent: false,
        companionAgent: false,
      };

      // Test main agent
      try {
        const mainResponse = await fetch(`${this.ELEVENLABS_BASE_URL}/agents/${this.AGENT_ID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
          },
        });
        results.mainAgent = mainResponse.ok;
      } catch (error) {
        console.error('Main agent connection test failed:', error);
      }

      // Test companion agent
      try {
        const companionResponse = await fetch(`${this.ELEVENLABS_BASE_URL}/agents/${this.COMPANION_AGENT_ID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
          },
        });
        results.companionAgent = companionResponse.ok;
      } catch (error) {
        console.error('Companion agent connection test failed:', error);
      }

      return results;
    } catch (error) {
      console.error('ElevenLabs connection test failed:', error);
      return { mainAgent: false, companionAgent: false };
    }
  }

  /**
   * Check if voice agent is available
   * @returns {boolean} True if agent is available
   */
  static isAgentAvailable() {
    return this.API_KEY && this.API_KEY.length > 0;
  }
}

export default VoiceAgentService;
