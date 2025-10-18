import React, { useState, useEffect, useRef } from 'react';
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
import { Audio } from 'expo-av';

const ConversationScreen = ({ userData, onBack }) => {
  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to conversation', conversationId);
      isConnectingRef.current = false;
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from conversation', JSON.stringify(details, null, 2));
      console.log('Disconnect reason:', details?.reason);
      console.log('Disconnect context:', details?.context);
      console.log('Full disconnect details:', details);
      isConnectingRef.current = false;
    },
    onError: (message, context) => {
      console.error('❌ Conversation error:', message, context);
      console.error('Error message details:', message);
      console.error('Error context:', JSON.stringify(context, null, 2));
      console.error('Error type:', typeof message, typeof context);
      isConnectingRef.current = false;
    },
    onMessage: ({ message, source }) => {
      console.log(`💬 Message from ${source}:`, JSON.stringify(message, null, 2));
    },
    onModeChange: ({ mode }) => {
      console.log(`🔊 Mode changed to: ${mode}`);
    },
    onStatusChange: ({ status }) => {
      console.log(`📡 Status changed: ${status}`);
      if (status === 'connected') {
        console.log('✅✅✅ CONNECTED TO VOICE AGENT ✅✅✅');
        isConnectingRef.current = false;
      } else if (status === 'disconnected') {
        console.log('⚠️ Status changed to disconnected');
        isConnectingRef.current = false;
      }
    },
    onCanSendFeedbackChange: ({ canSendFeedback }) => {
      console.log(`🔊 Can send feedback: ${canSendFeedback}`);
    },
    onDebug: (props) => {
      console.log('🐛 Debug:', JSON.stringify(props, null, 2));
    },
  });

  const [isStarting, setIsStarting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const didInitRef = useRef(false);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    
    // Configure iOS audio session ONCE on mount
    if (Platform.OS === 'ios' && Audio && typeof Audio.setAudioModeAsync === 'function') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: 1,
      }).catch(err => console.warn('Failed to set iOS audio mode', err));
    }
    
    initializeVoiceAgent();
  }, []);

  const initializeVoiceAgent = async () => {
    try {
      await VoiceAgentService.initialize();
      
      // Test ElevenLabs connection
      const connectionResults = await VoiceAgentService.testConnection();
      if (connectionResults.mainAgent && connectionResults.companionAgent) {
        console.log('ElevenLabs agents connected successfully');
        console.log('Setting isInitialized to true');
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
      setIsInitialized(true); // Allow fallback mode
    }
  };

  const startConversation = async () => {
    if (isStarting || isConnectingRef.current) {
      console.log('Already starting/connecting, ignoring duplicate call');
      return;
    }

    console.log('Starting conversation with agent:', VoiceAgentService.COMPANION_AGENT_ID);
    console.log('Current conversation status:', conversation.status);
    console.log('isInitialized:', isInitialized);
    
    setIsStarting(true);
    isConnectingRef.current = true;
    
    try {
      // TEMPORARY: Test with main agent to rule out companion agent config issue
      const sessionConfig = {
        agentId: VoiceAgentService.AGENT_ID, // Using MAIN agent instead of COMPANION
        dynamicVariables: {
          platform: Platform.OS,
          userName: userData?.name || 'User',
          testMode: 'true',
        },
      };
      
      console.log('Starting session with config:', sessionConfig);
      await conversation.startSession(sessionConfig);
      console.log('Conversation session started successfully');
      
      // Reset connecting flag after connection completes
      setTimeout(() => {
        if (conversation.status === 'connected') {
          isConnectingRef.current = false;
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      console.error('Error details:', error.message, error.stack);
      
      if (error.message && error.message.includes('permission')) {
        Alert.alert(
          'Microphone Permission Required',
          'Please grant microphone permission in your device settings to use voice conversation.'
        );
      } else {
        Alert.alert('Error', `Failed to start voice conversation: ${error.message}`);
      }
    } finally {
      setIsStarting(false);
      // Safety timeout to reset connecting flag
      setTimeout(() => { isConnectingRef.current = false; }, 2000);
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

  // Removed auto-timeout to avoid premature disconnects while LiveKit negotiates

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
          <Text style={styles.debugText}>
            Initialized: {isInitialized ? 'Yes' : 'No'} | Starting: {isStarting ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.debugText}>
            Agent: {VoiceAgentService.COMPANION_AGENT_ID}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.micButton,
            conversation.mode === 'listening' && styles.micButtonListening,
            conversation.mode === 'speaking' && styles.micButtonSpeaking,
            conversation.status === 'connecting' && styles.micButtonDisabled,
            (!isInitialized || isStarting) && styles.micButtonDisabled,
          ]}
          onPress={() => {
            console.log('Button pressed!');
            console.log('conversation.status:', conversation.status);
            console.log('isStarting:', isStarting);
            console.log('isInitialized:', isInitialized);
            console.log('Button disabled:', isStarting || !isInitialized);
            
            if (conversation.status === 'disconnected') {
              console.log('Starting conversation...');
              startConversation();
            } else if (conversation.status === 'connected') {
              console.log('Stopping conversation...');
              stopConversation();
            } else {
              console.log('Conversation in progress, status:', conversation.status);
            }
          }}
          disabled={isStarting || !isInitialized || conversation.status === 'connecting'}
        >
          {isStarting || conversation.status === 'connecting' ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : conversation.mode === 'listening' ? (
            <Ionicons name="mic" size={48} color="#FFFFFF" />
          ) : conversation.mode === 'speaking' ? (
            <Ionicons name="volume-high" size={48} color="#FFFFFF" />
          ) : conversation.status === 'connected' ? (
            <Ionicons name="stop" size={48} color="#FFFFFF" />
          ) : (
            <Ionicons name="play" size={48} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <Text style={styles.instructions}>
          {!isInitialized
            ? 'Initializing voice service...'
            : isStarting || conversation.status === 'connecting'
            ? 'Starting conversation...'
            : conversation.mode === 'listening'
            ? 'Listening... Speak now'
            : conversation.mode === 'speaking'
            ? 'Kaki is speaking...'
            : conversation.status === 'connected'
            ? 'Connected! Tap to stop conversation'
            : conversation.status === 'disconnected'
            ? 'Tap to start voice conversation'
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
  // Debug the API key being passed
  console.log('ElevenLabsProvider API Key:', VoiceAgentService.API_KEY ? `${VoiceAgentService.API_KEY.substring(0, 10)}...` : 'NOT SET');
  
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
  debugText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  micButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
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