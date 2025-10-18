import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ElevenLabsProvider, useConversation } from '@elevenlabs/react-native';
import VoiceAgentService from '../services/VoiceAgentService';

const ConversationScreen = ({ userData, onBack }) => {
  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to conversation', conversationId);
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from conversation', details);
    },
    onError: (message, context) => {
      console.error('❌ Conversation error:', message, context);
    },
    onMessage: ({ message, source }) => {
      console.log(`💬 Message from ${source}:`, message);
    },
    onModeChange: ({ mode }) => {
      console.log(`🔊 Mode: ${mode}`);
    },
    onStatusChange: ({ status }) => {
      console.log(`📡 Status: ${status}`);
    },
    onCanSendFeedbackChange: ({ canSendFeedback }) => {
      console.log(`🔊 Can send feedback: ${canSendFeedback}`);
    },
  });

  const [isStarting, setIsStarting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeVoiceAgent();
  }, []);

  const initializeVoiceAgent = async () => {
    try {
      await VoiceAgentService.initialize();
      
      // Test ElevenLabs connection
      const connectionResults = await VoiceAgentService.testConnection();
      if (connectionResults.mainAgent && connectionResults.companionAgent) {
        console.log('ElevenLabs agents connected successfully');
        setIsInitialized(true);
      } else {
        console.log('ElevenLabs connection failed:', connectionResults.error);
        Alert.alert(
          'Voice Service Unavailable', 
          `ElevenLabs API Error: ${connectionResults.error || 'Unknown error'}. Using fallback mode.`
        );
        setIsInitialized(true); // Still allow usage with fallback
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize voice agent');
      console.error('Voice agent initialization error:', error);
    }
  };

  const startConversation = async () => {
    if (isStarting) return;

    setIsStarting(true);
    try {
      await conversation.startSession({
        agentId: VoiceAgentService.COMPANION_AGENT_ID,
        dynamicVariables: {
          platform: Platform.OS,
          userName: userData?.name || 'User',
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      Alert.alert('Error', 'Failed to start voice conversation. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const stopConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  };

  const sendFeedback = (feedback) => {
    try {
      conversation.sendFeedback(feedback);
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Your Kaki Companion</Text>
        <Text style={styles.subtitle}>Voice-enabled AI assistant</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Status: {conversation.status}
          </Text>
          {conversation.mode && (
            <Text style={styles.modeText}>
              Mode: {conversation.mode}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.micButton,
            conversation.status === 'listening' && styles.micButtonListening,
            conversation.status === 'speaking' && styles.micButtonSpeaking,
          ]}
          onPress={conversation.status === 'idle' ? startConversation : stopConversation}
          disabled={isStarting || !isInitialized}
        >
          {isStarting ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : conversation.status === 'listening' ? (
            <Ionicons name="mic" size={48} color="#FFFFFF" />
          ) : conversation.status === 'speaking' ? (
            <Ionicons name="volume-high" size={48} color="#FFFFFF" />
          ) : (
            <Ionicons name="play" size={48} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <Text style={styles.instructions}>
          {isStarting
            ? 'Starting conversation...'
            : conversation.status === 'listening'
            ? 'Listening... Speak now'
            : conversation.status === 'speaking'
            ? 'Kaki is speaking...'
            : 'Tap to start voice conversation'}
        </Text>

        {conversation.canSendFeedback && (
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => sendFeedback('positive')}
            >
              <Ionicons name="thumbs-up" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dislikeButton}
              onPress={() => sendFeedback('negative')}
            >
              <Ionicons name="thumbs-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const VoiceCompanionScreen = ({ userData, onBack }) => {
  return (
    <ElevenLabsProvider apiKey={VoiceAgentService.API_KEY}>
      <ConversationScreen userData={userData} onBack={onBack} />
    </ElevenLabsProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 80, // Increased from 50 for proper spacing from status bar
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  statusContainer: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  statusText: {
    fontSize: 20,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 5,
  },
  modeText: {
    fontSize: 16,
    color: '#666',
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  micButtonListening: {
    backgroundColor: '#E05A2B',
    transform: [{ scale: 1.1 }],
  },
  micButtonSpeaking: {
    backgroundColor: '#34C759',
    transform: [{ scale: 1.05 }],
  },
  instructions: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  likeButton: {
    backgroundColor: '#10B981',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dislikeButton: {
    backgroundColor: '#EF4444',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoiceCompanionScreen;