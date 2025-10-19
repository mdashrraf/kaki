import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SupabaseVoiceAgent from '../components/SupabaseVoiceAgent';
import VoiceAgentService from '../services/VoiceAgentService';

const ConversationScreen = ({ userData, onBack }) => {
  const [isInitializing, setIsInitializing] = useState(false);

  // Debug configuration on mount
  useEffect(() => {
    console.log('🔧 VoiceCompanionScreen mounted, debugging config...');
    VoiceAgentService.debugConfig();
    
    // Validate API key on mount
    if (!VoiceAgentService.validateApiKey()) {
      Alert.alert(
        'Configuration Error',
        'Invalid ElevenLabs API key. Please check your configuration.',
        [{ text: 'OK' }]
      );
    } else {
      // Test connection if API key is valid
      testElevenLabsConnection();
    }
  }, []);

  // Voice agent event handlers
  const handleVoiceConnect = ({ conversationId }) => {
    console.log('✅ Connected to ElevenLabs conversation:', conversationId);
    setIsInitializing(false);
  };

  const handleVoiceDisconnect = (details) => {
    console.log('❌ Disconnected from ElevenLabs:', details);
    setIsInitializing(false);
  };

  const handleVoiceError = (error) => {
    console.error('❌ ElevenLabs conversation error:', error);
    console.error('❌ Error in conversation hook:', {
      message: error?.message,
      details: error
    });
    setIsInitializing(false);
    // Show fallback option when native voice fails
    VoiceAgentService.handleNativeVoiceFailure('companion', error);
  };

  const handleVoiceMessage = (message) => {
    console.log('💬 Message received:', message);
  };

  // Auto-start conversation when screen mounts
  useEffect(() => {
    console.log('🔄 VoiceCompanionScreen mounted, ready for voice interaction');
    console.log('👤 User data:', userData);
    console.log('🔑 Agent ID:', VoiceAgentService.AGENT_ID);
  }, []);

  // Test ElevenLabs connection and configuration
  const testElevenLabsConnection = async () => {
    try {
      console.log('🧪 Testing ElevenLabs connection from companion screen...');
      const results = await VoiceAgentService.testConnection();
      
      console.log('🧪 Test results:', results);
      
      if (results.error) {
        Alert.alert(
          'ElevenLabs Configuration Error',
          `Connection test failed: ${results.error}`,
          [
            { text: 'OK' },
            { 
              text: 'Use Browser Fallback', 
              onPress: () => VoiceAgentService.openBrowserAgent('companion')
            }
          ]
        );
      } else if (results.connectionWorking) {
        console.log('✅ ElevenLabs connection test passed!');
      } else {
        Alert.alert(
          'ElevenLabs Configuration Warning',
          'Connection test failed. Voice features may not work properly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
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

        <SupabaseVoiceAgent
          onConnect={handleVoiceConnect}
          onDisconnect={handleVoiceDisconnect}
          onError={handleVoiceError}
          onMessage={handleVoiceMessage}
          userName={userData?.name || 'User'}
          context="companion_mode"
        />
      </View>
    </SafeAreaView>
  );
};

const VoiceCompanionScreen = ({ userData, onBack }) => {
  return <ConversationScreen userData={userData} onBack={onBack} />;
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