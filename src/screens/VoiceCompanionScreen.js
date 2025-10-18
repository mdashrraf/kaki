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
import VoiceAgentService from '../services/VoiceAgentService';
import { Audio } from 'expo-audio';

const VoiceCompanionScreen = ({ userData, onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    initializeVoiceAgent();
  }, []);

  const initializeVoiceAgent = async () => {
    try {
      // Note: expo-audio doesn't support setAudioModeAsync
      // Audio session will be configured automatically by the system
      
      // Test ElevenLabs connection
      const connectionResults = await VoiceAgentService.testConnection();
      if (connectionResults.mainAgent && connectionResults.companionAgent) {
        console.log('✅ ElevenLabs agents connected successfully');
      } else {
        console.log('⚠️ ElevenLabs connection failed:', connectionResults.error);
        setError(`API Error: ${connectionResults.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Voice agent initialization error:', error);
      setError(`Initialization Error: ${error.message}`);
    }
  };

  const startConversation = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('🎤 Starting voice conversation...');
      
      // Use VoiceAgentService to start conversation
      const result = await VoiceAgentService.startVoiceConversation(
        VoiceAgentService.COMPANION_AGENT_ID,
        {
          onStart: () => {
            console.log('✅ Conversation started');
            setIsConnected(true);
            setIsConnecting(false);
          },
          onListening: () => {
            console.log('🎤 Listening...');
            setIsListening(true);
            setIsSpeaking(false);
          },
          onSpeaking: () => {
            console.log('🔊 Speaking...');
            setIsSpeaking(true);
            setIsListening(false);
          },
          onMessage: (message) => {
            console.log('💬 Message:', message);
            setLastMessage(message);
          },
          onError: (error) => {
            console.error('❌ Conversation error:', error);
            setError(error.message || 'Unknown error');
            setIsConnecting(false);
          },
          onEnd: () => {
            console.log('🛑 Conversation ended');
            setIsConnected(false);
            setIsListening(false);
            setIsSpeaking(false);
            setIsConnecting(false);
          }
        }
      );
      
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      setError(`Failed to start: ${error.message}`);
      setIsConnecting(false);
    }
  };

  const stopConversation = async () => {
    try {
      await VoiceAgentService.stopListening();
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      setIsConnecting(false);
    } catch (error) {
      console.error('Failed to stop conversation:', error);
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
            Status: {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </Text>
          {(isListening || isSpeaking) && (
            <Text style={styles.modeText}>
              Mode: {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}
            </Text>
          )}
          {error && (
            <Text style={styles.errorText}>
              Error: {error}
            </Text>
          )}
          {lastMessage && (
            <Text style={styles.messageText}>
              Last: {lastMessage}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonListening,
            isSpeaking && styles.micButtonSpeaking,
            isConnecting && styles.micButtonDisabled,
          ]}
          onPress={() => {
            if (isConnected) {
              stopConversation();
            } else {
              startConversation();
            }
          }}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : isListening ? (
            <Ionicons name="mic" size={48} color="#FFFFFF" />
          ) : isSpeaking ? (
            <Ionicons name="volume-high" size={48} color="#FFFFFF" />
          ) : isConnected ? (
            <Ionicons name="stop" size={48} color="#FFFFFF" />
          ) : (
            <Ionicons name="play" size={48} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <Text style={styles.instructions}>
          {isConnecting
            ? 'Starting conversation...'
            : isListening
            ? 'Listening... Speak now'
            : isSpeaking
            ? 'Kaki is speaking...'
            : isConnected
            ? 'Connected! Tap to stop conversation'
            : 'Tap to start voice conversation'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default VoiceCompanionScreen;

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
   errorText: {
     fontSize: 14,
     color: '#FF3B30',
     marginTop: 5,
     textAlign: 'center',
   },
   messageText: {
     fontSize: 14,
     color: '#34C759',
     marginTop: 5,
     textAlign: 'center',
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
});