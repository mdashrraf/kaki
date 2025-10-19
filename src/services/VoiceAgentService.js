// ElevenLabs Voice Agent Service using native WebRTC approach
// Using native approach without expo-audio for now
import { Platform, Linking, Alert } from 'react-native';

export class VoiceAgentService {
  // Single agent ID for all voice interactions
  static AGENT_ID = 'agent_9601k7v1dtekej68p3x13zv4erse';
  static ELEVENLABS_BASE_URL = process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io/v1';
  
  // ElevenLabs API key from environment variables
  static API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0';
  
  // Validate API key format
  static validateApiKey() {
    if (!this.API_KEY || this.API_KEY.length < 20) {
      console.error('❌ Invalid API key format');
      return false;
    }
    if (!this.API_KEY.startsWith('sk_')) {
      console.error('❌ API key should start with "sk_"');
      return false;
    }
    return true;
  }

  // Debug method to check configuration
  static debugConfig() {
    console.log('VoiceAgentService Configuration:');
    console.log('API_KEY:', this.API_KEY ? `${this.API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('AGENT_ID:', this.AGENT_ID);
    console.log('BASE_URL:', this.ELEVENLABS_BASE_URL);
    console.log('Environment variables loaded:', !!process.env.ELEVENLABS_API_KEY);
    console.log('Full API_KEY length:', this.API_KEY?.length);
    console.log('Is agent available:', this.isAgentAvailable());
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
  // ElevenLabs handles all voice conversation logic
  // No custom audio management needed

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
   * Test ElevenLabs API connection and single agent configuration
   * @returns {Promise<Object>} Connection status and agent validation
   */
  static async testConnection() {
    try {
      const results = {
        apiKeyValid: false,
        connectionWorking: false,
        error: null,
      };

      console.log('🧪 Testing ElevenLabs connection for single agent:', this.AGENT_ID);

      // Check if API key is valid
      if (!this.validateApiKey()) {
        results.error = 'Invalid API key format';
        return results;
      }

      results.apiKeyValid = true;
      console.log('✅ API key format is valid');

      // Test API connection with user info endpoint
      try {
        const response = await fetch(`${this.ELEVENLABS_BASE_URL}/user`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'xi-api-key': this.API_KEY,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ API connection successful:', userData);
          results.connectionWorking = true;
        } else {
          const errorText = await response.text();
          console.log('❌ API Error Details:', {
            status: response.status,
            errorText: errorText
          });
          
          if (response.status === 401) {
            results.error = 'Invalid API key - authentication failed';
          } else if (response.status === 403) {
            results.error = 'API key does not have required permissions';
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
      console.error('❌ ElevenLabs connection test failed:', error);
      return { 
        apiKeyValid: false, 
        connectionWorking: false, 
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

  /**
   * Test if the agent works with conversational AI endpoints
   * This might work even if the agent endpoint returns 404
   */
  static async testConversationalAIEndpoint() {
    try {
      console.log('🧪 Testing conversational AI endpoint...');
      
      // Try to create a conversation session
      const response = await fetch(`${this.ELEVENLABS_BASE_URL}/convai/conversations`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'xi-api-key': this.API_KEY,
        },
        body: JSON.stringify({
          agent_id: this.AGENT_ID,
        }),
      });
      
      console.log('📊 ConvAI response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conversational AI endpoint works:', data);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.log('❌ ConvAI endpoint failed:', errorText);
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.log('❌ ConvAI endpoint error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Open voice agent in browser as fallback
   * @param {string} context - Context for the conversation (home, companion, etc.)
   */
  static async openBrowserAgent(context = 'companion') {
    try {
      // Use the ElevenLabs conversational AI page instead of a specific agent
      // This will work even if the agent ID is invalid
      const browserUrl = `https://elevenlabs.io/conversational-ai`;
      
      console.log('🌐 Opening voice agent in browser:', browserUrl);
      
      const supported = await Linking.canOpenURL(browserUrl);
      if (supported) {
        await Linking.openURL(browserUrl);
        console.log('✅ Browser agent opened successfully');
        Alert.alert(
          'Browser Voice Agent',
          'ElevenLabs conversational AI opened in your browser. You can create a new agent there and update the agent ID in the app.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('❌ Cannot open browser URL:', browserUrl);
        Alert.alert(
          'Browser Not Supported',
          'Unable to open the voice agent in your browser. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Error opening browser agent:', error);
      Alert.alert(
        'Error',
        'Failed to open voice agent in browser. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }



  /**
   * Handle fallback when native voice fails
   * @param {string} context - Context for the conversation
   * @param {Error} error - The error that occurred
   */
  static handleNativeVoiceFailure(context = 'companion', error = null) {
    console.error('❌ Native voice agent failed:', error);
    
    Alert.alert(
      'Voice Agent Unavailable',
      'The voice agent is currently unavailable. Would you like to use the browser version instead?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open in Browser', 
          onPress: () => this.openBrowserAgent(context)
        }
      ]
    );
  }

}

export default VoiceAgentService;