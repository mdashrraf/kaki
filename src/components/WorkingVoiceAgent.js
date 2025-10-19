import React, { useState, useCallback, useEffect } from 'react';
import { View, Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversation } from '@elevenlabs/react-native';
import VoiceAgentService from '../services/VoiceAgentService';

const WorkingVoiceAgent = ({ 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage,
  userName = 'User',
  context = 'voice_command'
}) => {
  const [isInitializing, setIsInitializing] = useState(false);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to ElevenLabs conversation:', conversationId);
      console.log('🔍 Conversation status after connect:', conversation.status);
      console.log('🔍 Conversation mode after connect:', conversation.mode);
      setIsInitializing(false);
      onConnect && onConnect({ conversationId });
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from ElevenLabs:', details);
      setIsInitializing(false);
      onDisconnect && onDisconnect(details);
    },
    onMessage: ({ message, source }) => {
      console.log(`💬 Message from ${source}:`, message);
      onMessage && onMessage({ message, source });
    },
    onError: (error) => {
      console.error('❌ ElevenLabs conversation error:', error);
      setIsInitializing(false);
      onError && onError(error);
    },
    onModeChange: ({ mode }) => {
      console.log('🔊 Mode changed to:', mode);
    },
    onStatusChange: ({ status }) => {
      console.log('📡 Status changed to:', status);
    },
  });

  // Monitor conversation status changes
  useEffect(() => {
    console.log('🔄 Conversation status changed:', {
      status: conversation.status,
      mode: conversation.mode,
      timestamp: new Date().toISOString()
    });
  }, [conversation.status, conversation.mode]);

  const startConversation = useCallback(async () => {
    console.log('🚀 Starting conversation with agent:', VoiceAgentService.AGENT_ID);
    
    setIsInitializing(true);
    
    try {
      console.log('🎯 Starting session with agent:', VoiceAgentService.AGENT_ID);
      await conversation.startSession({
        agentId: VoiceAgentService.AGENT_ID,
      });
      console.log('✅ Session started successfully');
      
      // Wait a bit for the connection to fully establish
      setTimeout(() => {
        console.log('🔍 Checking conversation status after delay:', conversation.status);
        if (conversation.status === 'connected') {
          setIsInitializing(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      setIsInitializing(false);
      onError && onError(error);
    }
  }, [conversation, onError]);

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
    if (conversation.status === 'disconnected' || conversation.status === 'idle') {
      startConversation();
    } else if (conversation.status === 'connected') {
      stopConversation();
    }
  }, [conversation.status, startConversation, stopConversation]);

  const getButtonIcon = () => {
    const currentMode = conversation.mode || 'none';
    const currentStatus = conversation.status || 'unknown';
    
    console.log('🔍 Button icon state:', { 
      status: currentStatus, 
      mode: currentMode, 
      isInitializing,
      rawMode: conversation.mode,
      rawStatus: conversation.status
    });
    
    if (currentStatus === 'connecting' || isInitializing) {
      return <ActivityIndicator size="small" color="#FFFFFF" />;
    }
    
    if (currentMode === 'listening') {
      return <Ionicons name="mic" size={32} color="#E2E8F0" />;
    }
    
    if (currentMode === 'speaking') {
      return <Ionicons name="volume-high" size={32} color="#E2E8F0" />;
    }
    
    // Default state - show mic icon
    return <Ionicons name="mic" size={32} color="#E2E8F0" />;
  };

  const getButtonText = () => {
    const currentMode = conversation.mode || 'none';
    const currentStatus = conversation.status || 'unknown';
    
    if (currentStatus === 'connecting' || isInitializing) {
      return 'Connecting...';
    }
    
    if (currentMode === 'listening') {
      return 'Listening...';
    }
    
    if (currentMode === 'speaking') {
      return 'Speaking...';
    }
    
    if (currentStatus === 'connected') {
      return 'Stop';
    }
    
    return 'Speak';
  };

  const getStatusText = () => {
    const currentMode = conversation.mode || 'none';
    const currentStatus = conversation.status || 'unknown';
    
    if (currentStatus === 'connecting' || isInitializing) {
      return 'Starting voice agent...';
    }
    
    if (currentMode === 'listening') {
      return 'Speak your request now';
    }
    
    if (currentMode === 'speaking') {
      return 'Kaki is responding...';
    }
    
    if (currentStatus === 'connected') {
      return 'Tap to end conversation';
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
        ]}
        onPress={handlePress}
        disabled={conversation.status === 'connecting' || isInitializing}
      >
        <View
          style={[
            styles.buttonInner,
            conversation.status === 'connected' && styles.buttonInnerActive,
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
        Status: {conversation.status || 'unknown'} | Mode: {conversation.mode || 'none'} | Initializing: {isInitializing ? 'Yes' : 'No'}
      </Text>
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
  },
});

export default WorkingVoiceAgent;
