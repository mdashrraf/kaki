'use dom';

import { useConversation } from '@elevenlabs/react';
import { Mic } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { View, Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';

async function requestMicrophonePermission() {
  try {
    console.log('🎤 Requesting microphone permission via web API...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('✅ Microphone permission granted');
    // Stop the stream immediately as we just needed permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('❌ Microphone permission denied:', error);
    return false;
  }
}

export default function VoiceAgentDOMComponent({ 
  agentId, 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage,
  userName = 'User',
  context = 'voice_command'
}) {
  const [isInitializing, setIsInitializing] = useState(false);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to ElevenLabs conversation:', conversationId);
      setIsInitializing(false);
      onConnect && onConnect({ conversationId });
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from ElevenLabs:', details);
      setIsInitializing(false);
      onDisconnect && onDisconnect(details);
    },
    onMessage: (message) => {
      console.log('💬 Message received:', message);
      onMessage && onMessage(message);
    },
    onError: (error) => {
      console.error('❌ ElevenLabs conversation error:', error);
      setIsInitializing(false);
      onError && onError(error);
    },
  });

  const startConversation = useCallback(async () => {
    console.log('🚀 Starting conversation with agent:', agentId);
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.error('❌ Microphone permission denied');
      onError && onError(new Error('Microphone permission is required.'));
      return;
    }

    setIsInitializing(true);
    
    try {
      console.log('🎯 Starting session with agent:', agentId);
      await conversation.startSession({
        agentId: agentId,
      });
      console.log('✅ Session started successfully');
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      setIsInitializing(false);
      onError && onError(error);
    }
  }, [conversation, agentId, onError]);

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
    if (conversation.status === 'connecting' || isInitializing) {
      return <ActivityIndicator size="small" color="#FFFFFF" />;
    }
    
    if (conversation.mode === 'listening') {
      return <Mic size={32} color="#E2E8F0" strokeWidth={1.5} />;
    }
    
    if (conversation.mode === 'speaking') {
      return <Mic size={32} color="#E2E8F0" strokeWidth={1.5} />;
    }
    
    return <Mic size={32} color="#E2E8F0" strokeWidth={1.5} />;
  };

  const getButtonText = () => {
    if (conversation.status === 'connecting' || isInitializing) {
      return 'Connecting...';
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
    if (conversation.status === 'connecting' || isInitializing) {
      return 'Starting voice agent...';
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
        Status: {conversation.status} | Mode: {conversation.mode || 'none'}
      </Text>
    </View>
  );
}

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
