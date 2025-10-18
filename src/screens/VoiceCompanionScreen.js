import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceAgentService from '../services/VoiceAgentService';

const VoiceCompanionScreen = ({ userData, onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeVoiceAgent();
  }, []);

  const initializeVoiceAgent = async () => {
    try {
      await VoiceAgentService.initialize();
      
      // Test ElevenLabs connection for both agents
      const connectionResults = await VoiceAgentService.testConnection();
      if (connectionResults.companionAgent) {
        console.log('Companion agent connected successfully');
        setIsInitialized(true);
      } else if (connectionResults.mainAgent) {
        console.log('Main agent available, companion agent failed');
        Alert.alert('Warning', 'Companion agent unavailable. Using main agent.');
        setIsInitialized(true);
      } else {
        Alert.alert('Warning', 'Voice agents unavailable. Using fallback mode.');
        setIsInitialized(true); // Still allow usage with fallback
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize voice agent');
      console.error('Voice agent initialization error:', error);
    }
  };

  const handleStartListening = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'Voice agent not initialized');
      return;
    }

    try {
      setIsListening(true);
      const userMessage = await VoiceAgentService.startListening();
      setLastMessage(userMessage);
      
      // Process the message with the companion agent
      const companionCommand = {
        action: 'companion',
        type: 'conversation',
        details: {
          service: 'companion_conversation',
          message: userMessage,
          useCompanionAgent: true,
        },
      };
      
      const agentResponse = await VoiceAgentService.startVoiceConversation(userMessage, companionCommand);
      setIsSpeaking(true);
      
      // Wait for speech to complete
      setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process voice input');
      console.error('Voice input error:', error);
    } finally {
      setIsListening(false);
    }
  };

  const handleStopListening = async () => {
    try {
      await VoiceAgentService.stopListening();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice input:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Companion</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          {isListening && (
            <View style={styles.statusIndicator}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.statusText}>Listening...</Text>
            </View>
          )}
          
          {isSpeaking && (
            <View style={styles.statusIndicator}>
              <Ionicons name="volume-high" size={32} color="#FF6B35" />
              <Text style={styles.statusText}>Speaking...</Text>
            </View>
          )}
          
          {!isListening && !isSpeaking && (
            <View style={styles.statusIndicator}>
              <Ionicons name="mic" size={32} color="#8E8E93" />
              <Text style={styles.statusText}>Ready to help</Text>
            </View>
          )}
        </View>

        {/* Last Message Display */}
        {lastMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Last message:</Text>
            <Text style={styles.messageText}>"{lastMessage}"</Text>
          </View>
        )}

        {/* Voice Control Button */}
        <View style={styles.voiceControlContainer}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive,
              !isInitialized && styles.voiceButtonDisabled,
            ]}
            onPress={isListening ? handleStopListening : handleStartListening}
            disabled={!isInitialized || isSpeaking}
          >
            <Ionicons
              name={isListening ? "stop" : "mic"}
              size={32}
              color={isListening ? "#FFFFFF" : "#FF6B35"}
            />
            <Text style={[
              styles.voiceButtonText,
              isListening && styles.voiceButtonTextActive,
            ]}>
              {isListening ? 'Stop Listening' : 'Start Speaking'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to use:</Text>
          <Text style={styles.instructionsText}>
            • Tap the microphone to start speaking
          </Text>
          <Text style={styles.instructionsText}>
            • Speak clearly and wait for the response
          </Text>
          <Text style={styles.instructionsText}>
            • Ask for help with daily tasks, reminders, or questions
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusIndicator: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
    fontStyle: 'italic',
  },
  voiceControlContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  voiceButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 50,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceButtonActive: {
    backgroundColor: '#FF6B35',
  },
  voiceButtonDisabled: {
    opacity: 0.5,
  },
  voiceButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    textAlign: 'center',
  },
  voiceButtonTextActive: {
    color: '#FFFFFF',
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default VoiceCompanionScreen;
