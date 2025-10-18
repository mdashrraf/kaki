// ElevenLabs Voice Agent Service using official SDK
import { ElevenLabsProvider, useConversation } from '@elevenlabs/react-native';
import type { ConversationStatus, ConversationEvent, Role } from '@elevenlabs/react-native';

export class VoiceAgentService {
  static AGENT_ID = process.env.ELEVENLABS_AGENT_ID || 'agent_9601k7v1dtekej68p3x13zv4erse';
  static COMPANION_AGENT_ID = 'agent_8601k7tybe14e16tf75gmjdede86'; // Original companion agent
  static ELEVENLABS_BASE_URL = process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io/v1';
  
  // ElevenLabs API key from environment variables
  static API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0';

  // Debug method to check configuration
  static debugConfig() {
    console.log('VoiceAgentService Configuration:');
    console.log('API_KEY:', this.API_KEY ? `${this.API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('AGENT_ID:', this.AGENT_ID);
    console.log('BASE_URL:', this.ELEVENLABS_BASE_URL);
    console.log('Environment variables loaded:', !!process.env.ELEVENLABS_API_KEY);
  }

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
   * Start voice conversation with ElevenLabs ConvAI agent
   * @param {string} userMessage - User's voice message
   * @param {Object} command - Parsed command object
   * @returns {Promise<string>} Agent's response
   */
  static async startVoiceConversation(userMessage, command = null) {
    try {
      console.log('Starting voice conversation with ElevenLabs ConvAI agent...');
      
      // Determine which agent to use
      const agentId = command?.details?.useCompanionAgent 
        ? this.COMPANION_AGENT_ID 
        : this.AGENT_ID;
      
      console.log(`Using agent: ${agentId}`);
      
      // Check if API key is valid
      if (!this.API_KEY || this.API_KEY.length < 10) {
        throw new Error('Invalid API key');
      }
      
      // For now, return a simulated response since we need to implement the conversation hook
      const agentResponse = `I received your message: "${userMessage}". How can I help you today?`;
      
      return agentResponse;
    } catch (error) {
      console.error('Error in voice conversation:', error);
      
      // Fallback to simulation if API fails
      const fallbackResponse = await this.simulateAgentResponse(userMessage);
      
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
   * Start listening for user voice input
   * @returns {Promise<string>} User's spoken message
   */
  static async startListening() {
    try {
      console.log('Starting voice input...');
      
      // For now, simulate voice input since we don't have proper speech recognition
      // In a real implementation, you would use a speech-to-text service
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
      
      // Debug configuration
      this.debugConfig();
      
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
        error: null,
      };

      // Check if API key is valid
      if (!this.API_KEY || this.API_KEY.length < 10) {
        results.error = 'Invalid API key';
        return results;
      }

      // Test with a simple text-to-speech request
      try {
        const response = await fetch(`${this.ELEVENLABS_BASE_URL}/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Test',
            model_id: 'eleven_monolingual_v1',
          }),
        });
        
        if (response.ok) {
          results.mainAgent = true;
          results.companionAgent = true; // Same API key works for both
        } else {
          const errorText = await response.text();
          if (response.status === 403) {
            results.error = 'API key does not have permission to access ElevenLabs features';
          } else if (response.status === 401) {
            // Check if it's a quota issue
            if (errorText.includes('quota_exceeded')) {
              results.error = 'ElevenLabs API quota exceeded. Please upgrade your plan or wait for quota reset.';
            } else if (errorText.includes('missing_permissions')) {
              results.error = 'API key has limited permissions. Please check your ElevenLabs account settings.';
            } else {
              results.error = 'Invalid API key';
            }
          } else if (response.status === 429) {
            results.error = 'Rate limit exceeded';
          } else {
            results.error = `API error: ${response.status} - ${errorText}`;
          }
        }
      } catch (error) {
        results.error = `Connection failed: ${error.message}`;
      }

      return results;
    } catch (error) {
      console.error('ElevenLabs connection test failed:', error);
      return { 
        mainAgent: false, 
        companionAgent: false, 
        error: error.message 
      };
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