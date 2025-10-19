import { supabase } from '../config/supabase';
import VoiceAgentService from './VoiceAgentService';

class SupabaseVoiceService {
  constructor() {
    this.isConnected = false;
    this.conversationChannel = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.isPlaying = false;
    this.currentConversationId = null;
  }

  /**
   * Initialize voice service with Supabase real-time
   */
  async initialize(userId, userName = 'User') {
    try {
      console.log('🎙️ Initializing Supabase Voice Service...');
      
      // Create a new conversation
      const conversation = await this.createConversation(userId, userName);
      this.currentConversationId = conversation.id;
      
      // Setup real-time channel for this conversation
      await this.setupRealtimeChannel(conversation.id);
      
      // Initialize audio context for recording/playback
      await this.initializeAudio();
      
      this.isConnected = true;
      console.log('✅ Supabase Voice Service initialized');
      
      return {
        success: true,
        conversationId: conversation.id,
        message: 'Voice service ready'
      };
      
    } catch (error) {
      console.error('❌ Failed to initialize Supabase Voice Service:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new conversation in Supabase
   */
  async createConversation(userId, userName) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          user_name: userName,
          agent_id: VoiceAgentService.AGENT_ID,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('💬 Created conversation:', data.id);
      return data;
      
    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      throw error;
    }
  }

  /**
   * Setup real-time channel for conversation
   */
  async setupRealtimeChannel(conversationId) {
    try {
      this.conversationChannel = supabase
        .channel(`conversation-${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          this.handleNewMessage(payload.new);
        })
        .subscribe();

      console.log('📡 Real-time channel setup for conversation:', conversationId);
      
    } catch (error) {
      console.error('❌ Failed to setup real-time channel:', error);
      throw error;
    }
  }

  /**
   * Initialize audio recording and playback
   */
  async initializeAudio() {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Setup media recorder
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.processAudioRecording();
      };

      console.log('🎤 Audio system initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      throw error;
    }
  }

  /**
   * Start voice recording
   */
  async startRecording() {
    try {
      if (this.isRecording) return;

      console.log('🔴 Starting voice recording...');
      this.audioChunks = [];
      this.mediaRecorder.start();
      this.isRecording = true;
      
      return { success: true, message: 'Recording started' };
      
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop voice recording and process
   */
  async stopRecording() {
    try {
      if (!this.isRecording) return;

      console.log('⏹️ Stopping voice recording...');
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      return { success: true, message: 'Recording stopped' };
      
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process recorded audio and send to ElevenLabs
   */
  async processAudioRecording() {
    try {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      
      // Convert audio to text using ElevenLabs
      const transcription = await this.transcribeAudio(audioBlob);
      
      if (transcription.success) {
        // Send message to conversation
        await this.sendMessage(transcription.text, 'user');
        
        // Get AI response
        await this.getAIResponse(transcription.text);
      }
      
    } catch (error) {
      console.error('❌ Failed to process audio:', error);
    }
  }

  /**
   * Transcribe audio using ElevenLabs
   */
  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': VoiceAgentService.API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        text: result.text || 'Could not transcribe audio'
      };
      
    } catch (error) {
      console.error('❌ Failed to transcribe audio:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send message to conversation
   */
  async sendMessage(content, sender = 'user') {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: this.currentConversationId,
          content: content,
          sender: sender,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log('💬 Message sent:', content);
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  }

  /**
   * Get AI response from ElevenLabs
   */
  async getAIResponse(userMessage) {
    try {
      // Send to ElevenLabs conversational AI
      const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${this.currentConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': VoiceAgentService.API_KEY,
        },
        body: JSON.stringify({
          message: userMessage,
          agent_id: VoiceAgentService.AGENT_ID
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Send AI response to conversation
      await this.sendMessage(result.response, 'agent');
      
      // Convert to speech
      await this.textToSpeech(result.response);
      
    } catch (error) {
      console.error('❌ Failed to get AI response:', error);
      
      // Fallback response
      const fallbackMessage = "I'm sorry, I couldn't process that request. Please try again.";
      await this.sendMessage(fallbackMessage, 'agent');
      await this.textToSpeech(fallbackMessage);
    }
  }

  /**
   * Convert text to speech using ElevenLabs
   */
  async textToSpeech(text) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VoiceAgentService.VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': VoiceAgentService.API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      await this.playAudio(audioBlob);
      
    } catch (error) {
      console.error('❌ Failed to convert text to speech:', error);
    }
  }

  /**
   * Play audio response
   */
  async playAudio(audioBlob) {
    try {
      if (this.isPlaying) return;

      this.isPlaying = true;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('❌ Failed to play audio:', error);
      this.isPlaying = false;
    }
  }

  /**
   * Handle new messages from real-time channel
   */
  handleNewMessage(message) {
    console.log('📨 New message received:', message);
    
    // Trigger callbacks for UI updates
    if (message.sender === 'agent' && this.onMessage) {
      this.onMessage({
        source: 'agent',
        type: 'agent_response',
        message: message.content,
        timestamp: message.timestamp
      });
    }
  }

  /**
   * Disconnect and cleanup
   */
  async disconnect() {
    try {
      console.log('🔌 Disconnecting Supabase Voice Service...');
      
      if (this.conversationChannel) {
        await supabase.removeChannel(this.conversationChannel);
      }
      
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      
      this.isConnected = false;
      this.currentConversationId = null;
      
      console.log('✅ Supabase Voice Service disconnected');
      
    } catch (error) {
      console.error('❌ Error during disconnect:', error);
    }
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks) {
    this.onConnect = callbacks.onConnect;
    this.onDisconnect = callbacks.onDisconnect;
    this.onError = callbacks.onError;
    this.onMessage = callbacks.onMessage;
  }
}

export default new SupabaseVoiceService();
