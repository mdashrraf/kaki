import React, { useState, useCallback, useEffect } from 'react';
import { View, Pressable, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversation } from '@elevenlabs/react-native';
import VoiceAgentService from '../services/VoiceAgentService';
import { Linking } from 'react-native';

const EnhancedVoiceAgent = ({ 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage,
  userName = 'User',
  context = 'voice_command'
}) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [useFallback, setUseFallback] = useState(false);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to ElevenLabs conversation:', conversationId);
      console.log('🔍 Conversation status after connect:', conversation.status);
      console.log('🔍 Conversation mode after connect:', conversation.mode);
      setIsInitializing(false);
      setConnectionAttempts(0);
      onConnect && onConnect({ conversationId });
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from ElevenLabs:', details);
      setIsInitializing(false);
      
      // If we've tried multiple times and keep disconnecting, offer fallback
      if (connectionAttempts >= maxAttempts - 1) {
        console.log('🔄 Max connection attempts reached, offering fallback');
        Alert.alert(
          'Voice Connection Issue',
          'Unable to establish voice connection. Would you like to use the browser version instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Use Browser', onPress: () => setUseFallback(true) }
          ]
        );
      }
      
      onDisconnect && onDisconnect(details);
    },
    onMessage: ({ message, source }) => {
      console.log(`💬 Message from ${source}:`, message);
      onMessage && onMessage({ message, source });
    },
    onError: (error) => {
      console.error('❌ ElevenLabs conversation error:', error);
      setIsInitializing(false);
      setConnectionAttempts(prev => prev + 1);
      
      // Offer fallback on error
      Alert.alert(
        'Voice Error',
        'Voice connection failed. Would you like to try the browser version?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Use Browser', onPress: () => setUseFallback(true) }
        ]
      );
      
      onError && onError(error);
    },
    onModeChange: ({ mode }) => {
      console.log('🔊 Mode changed to:', mode);
    },
    onStatusChange: ({ status }) => {
      console.log('📡 Status changed to:', status);
      
      // If status goes to disconnected after connecting, increment attempts
      if (status === 'disconnected' && connectionAttempts > 0) {
        setConnectionAttempts(prev => prev + 1);
      }
    },
  });

  // Monitor conversation status changes
  useEffect(() => {
    console.log('🔄 Conversation status changed:', {
      status: conversation.status,
      mode: conversation.mode,
      connectionAttempts,
      timestamp: new Date().toISOString()
    });
  }, [conversation.status, conversation.mode, connectionAttempts]);

  const startConversation = useCallback(async () => {
    console.log('🚀 Starting conversation with agent:', VoiceAgentService.AGENT_ID);
    console.log(`🔄 Attempt ${connectionAttempts + 1} of ${maxAttempts}`);
    
    setIsInitializing(true);
    
    try {
      console.log('🎯 Starting session with agent:', VoiceAgentService.AGENT_ID);
      await conversation.startSession({
        agentId: VoiceAgentService.AGENT_ID,
      });
      console.log('✅ Session started successfully');
      
      // Wait for connection to establish
      setTimeout(() => {
        console.log('🔍 Checking conversation status after delay:', conversation.status);
        if (conversation.status === 'disconnected') {
          console.log('⚠️ Connection failed after session start');
          setConnectionAttempts(prev => prev + 1);
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      setIsInitializing(false);
      setConnectionAttempts(prev => prev + 1);
      onError && onError(error);
    }
  }, [conversation, onError, connectionAttempts, maxAttempts]);

  const stopConversation = useCallback(async () => {
    console.log('🛑 Ending conversation...');
    try {
      await conversation.endSession();
      console.log('✅ Conversation ended successfully');
    } catch (error) {
      console.error('❌ Error ending conversation:', error);
      onError && onError(error);
    }
  }, [conversation, onError]);

  const handlePress = useCallback(() => {
    if (useFallback) {
      // Open browser fallback
      VoiceAgentService.openBrowserAgent(context);
      return;
    }
    
    if (conversation.status === 'disconnected' || conversation.status === 'idle') {
      startConversation();
    } else if (conversation.status === 'connected') {
      stopConversation();
    }
  }, [conversation.status, startConversation, stopConversation, useFallback, context]);

  const openBrowserFallback = useCallback(() => {
    VoiceAgentService.openBrowserAgent(context);
  }, [context]);

  const getButtonIcon = () => {
    console.log('🔍 Button icon state:', { 
      status: conversation.status, 
      mode: conversation.mode, 
      isInitializing,
      connectionAttempts,
      useFallback
    });
    
    if (useFallback) {
      return <Ionicons name="globe" size={32} color="#E2E8F0" />;
    }
    
    if (conversation.status === 'connecting' || isInitializing) {
      return <ActivityIndicator size="small" color="#FFFFFF" />;
    }
    
    if (conversation.mode === 'listening') {
      return <Ionicons name="mic" size={32} color="#E2E8F0" />;
    }
    
    if (conversation.mode === 'speaking') {
      return <Ionicons name="volume-high" size={32} color="#E2E8F0" />;
    }
    
    return <Ionicons name="mic" size={32} color="#E2E8F0" />;
  };

  const getButtonText = () => {
    if (useFallback) {
      return 'Open Browser';
    }
    
    if (conversation.status === 'connecting' || isInitializing) {
      return `Connecting... (${connectionAttempts + 1}/${maxAttempts})`;
    }
    
    if (conversation.mode === 'listening') {
      return 'Listening...';
    }
    
    if (conversation.mode === 'speaking') {
      return 'Speaking...';
    }
    
    if (conversation.status === 'connected') {
      return 'Stop';
    }
    
    return 'Speak';
  };

  const getStatusText = () => {
    if (useFallback) {
      return 'Using browser fallback - tap to open';
    }
    
    if (conversation.status === 'connecting' || isInitializing) {
      return `Starting voice agent... (Attempt ${connectionAttempts + 1}/${maxAttempts})`;
    }
    
    if (conversation.mode === 'listening') {
      return 'Speak your request now';
    }
    
    if (conversation.mode === 'speaking') {
      return 'Kaki is responding...';
    }
    
    if (conversation.status === 'connected') {
      return 'Tap to end conversation';
    }
    
    if (connectionAttempts > 0) {
      return `Connection failed (${connectionAttempts}/${maxAttempts}) - tap to retry`;
    }
    
    return 'Tap to start voice conversation';
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.callButton,
          conversation.status === 'connected' && styles.callButtonActive,
          (conversation.status === 'connecting' || isInitializing) && styles.callButtonDisabled,
          useFallback && styles.callButtonFallback,
        ]}
        onPress={handlePress}
        disabled={conversation.status === 'connecting' || isInitializing}
      >
        <View
          style={[
            styles.buttonInner,
            conversation.status === 'connected' && styles.buttonInnerActive,
            useFallback && styles.buttonInnerFallback,
          ]}
        >
          {getButtonIcon()}
        </View>
      </Pressable>
      
      <Text style={styles.buttonText}>
        {getButtonText()}
      </Text>
      
      <Text style={styles.instructionText}>
        {getStatusText()}
      </Text>
      
      <Text style={styles.statusText}>
        Status: {conversation.status} | Mode: {conversation.mode || 'none'} | Attempts: {connectionAttempts}
      </Text>
      
      {connectionAttempts > 0 && !useFallback && (
        <Pressable style={styles.fallbackButton} onPress={openBrowserFallback}>
          <Text style={styles.fallbackButtonText}>Use Browser Version</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  callButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  callButtonDisabled: {
    backgroundColor: 'rgba(204, 204, 204, 0.3)',
    opacity: 0.6,
  },
  callButtonFallback: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  buttonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonInnerFallback: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  fallbackButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  fallbackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EnhancedVoiceAgent;
