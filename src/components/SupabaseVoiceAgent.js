import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SupabaseVoiceService from '../services/SupabaseVoiceService';

const SupabaseVoiceAgent = ({ 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage, 
  userName = 'User',
  context = 'default'
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastError, setLastError] = useState(null);

  // Initialize the voice service
  useEffect(() => {
    const initializeService = async () => {
      try {
        console.log('🚀 Initializing Supabase Voice Agent...');
        setIsInitializing(true);
        setConnectionStatus('connecting');

        // Set up callbacks
        SupabaseVoiceService.setCallbacks({
          onConnect: ({ conversationId }) => {
            console.log('✅ Connected to Supabase voice service:', conversationId);
            setIsConnected(true);
            setIsInitializing(false);
            setConnectionStatus('connected');
            onConnect && onConnect({ conversationId });
          },
          onDisconnect: (details) => {
            console.log('❌ Disconnected from Supabase voice service:', details);
            setIsConnected(false);
            setConnectionStatus('disconnected');
            onDisconnect && onDisconnect(details);
          },
          onError: (error) => {
            console.error('❌ Supabase voice service error:', error);
            setIsInitializing(false);
            setLastError(error.message);
            onError && onError(error);
          },
          onMessage: (message) => {
            console.log('💬 Message received:', message);
            onMessage && onMessage(message);
          }
        });

        // Initialize the service
        const result = await SupabaseVoiceService.initialize('user-123', userName);
        
        if (result.success) {
          console.log('✅ Supabase Voice Agent initialized successfully');
        } else {
          throw new Error(result.error || 'Failed to initialize voice service');
        }

      } catch (error) {
        console.error('❌ Failed to initialize Supabase Voice Agent:', error);
        setIsInitializing(false);
        setConnectionStatus('error');
        setLastError(error.message);
        onError && onError(error);
      }
    };

    initializeService();

    // Cleanup on unmount
    return () => {
      SupabaseVoiceService.disconnect();
    };
  }, [userName, onConnect, onDisconnect, onError, onMessage]);

  const handleStartRecording = useCallback(async () => {
    try {
      console.log('🎤 Starting recording...');
      setIsRecording(true);
      setIsProcessing(false);
      
      const result = await SupabaseVoiceService.startRecording();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to start recording');
      }
      
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      setIsRecording(false);
      Alert.alert('Recording Error', error.message);
      onError && onError(error);
    }
  }, [onError]);

  const handleStopRecording = useCallback(async () => {
    try {
      console.log('⏹️ Stopping recording...');
      setIsRecording(false);
      setIsProcessing(true);
      
      const result = await SupabaseVoiceService.stopRecording();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to stop recording');
      }
      
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      setIsRecording(false);
      setIsProcessing(false);
      Alert.alert('Recording Error', error.message);
      onError && onError(error);
    }
  }, [onError]);

  const handleVoicePress = useCallback(() => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Voice service is not connected. Please wait for initialization.');
      return;
    }

    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isConnected, isRecording, handleStartRecording, handleStopRecording]);

  const getButtonIcon = () => {
    if (isInitializing || isProcessing) {
      return 'hourglass-outline';
    }
    if (isRecording) {
      return 'stop-circle';
    }
    if (isConnected) {
      return 'mic';
    }
    return 'mic-off';
  };

  const getButtonText = () => {
    if (isInitializing) {
      return 'Initializing...';
    }
    if (isProcessing) {
      return 'Processing...';
    }
    if (isRecording) {
      return 'Stop Recording';
    }
    if (isConnected) {
      return 'Start Voice Chat';
    }
    return 'Connecting...';
  };

  const getStatusText = () => {
    if (lastError) {
      return `Error: ${lastError}`;
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting to voice service...';
      case 'connected':
        return isRecording ? 'Recording...' : 'Ready to chat';
      case 'error':
        return 'Connection failed';
      default:
        return 'Disconnected';
    }
  };

  const getButtonStyle = () => {
    if (isInitializing || isProcessing) {
      return [styles.voiceButton, styles.voiceButtonLoading];
    }
    if (isRecording) {
      return [styles.voiceButton, styles.voiceButtonRecording];
    }
    if (isConnected) {
      return [styles.voiceButton, styles.voiceButtonReady];
    }
    return [styles.voiceButton, styles.voiceButtonDisabled];
  };

  return (
    <View style={styles.container}>
      {/* Voice Button */}
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={handleVoicePress}
        disabled={isInitializing || isProcessing}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {(isInitializing || isProcessing) && (
            <ActivityIndicator 
              size="small" 
              color="#FFFFFF" 
              style={styles.loadingIndicator}
            />
          )}
          <Ionicons 
            name={getButtonIcon()} 
            size={24} 
            color="#FFFFFF" 
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{getButtonText()}</Text>
        </View>
      </TouchableOpacity>

      {/* Status Text */}
      <Text style={styles.statusText}>{getStatusText()}</Text>

      {/* Context Info */}
      <Text style={styles.contextText}>Context: {context}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceButtonReady: {
    backgroundColor: '#007AFF',
  },
  voiceButtonRecording: {
    backgroundColor: '#FF3B30',
  },
  voiceButtonLoading: {
    backgroundColor: '#8E8E93',
  },
  voiceButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  contextText: {
    fontSize: 12,
    color: '#C7C7CC',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SupabaseVoiceAgent;
