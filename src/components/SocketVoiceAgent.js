import React, { useState, useCallback, useEffect } from 'react';
import { View, Pressable, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceAgentService from '../services/VoiceAgentService';
import { Audio } from 'expo-av';

const SocketVoiceAgent = ({ 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage,
  userName = 'User',
  context = 'voice_command'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize audio permissions and socket connection
  useEffect(() => {
    initializeAudio();
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeAudio = async () => {
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required for voice features');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('✅ Audio initialized successfully');
    } catch (error) {
      console.error('❌ Audio initialization failed:', error);
      onError && onError(error);
    }
  };

  const connectToVoiceService = useCallback(async () => {
    try {
      console.log('🔌 Connecting to voice service...');
      
      // For now, we'll simulate a connection
      // In a real implementation, you would connect to your Socket.io server
      setIsConnected(true);
      onConnect && onConnect({ conversationId: 'socket-connection' });
      
      console.log('✅ Connected to voice service');
    } catch (error) {
      console.error('❌ Connection failed:', error);
      onError && onError(error);
    }
  }, [onConnect, onError]);

  const disconnectFromVoiceService = useCallback(() => {
    console.log('🔌 Disconnecting from voice service...');
    setIsConnected(false);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    onDisconnect && onDisconnect({ reason: 'user_disconnect' });
  }, [socket, onDisconnect]);

  const startRecording = async () => {
    try {
      console.log('🎤 Starting recording...');
      
      // Create recording instance
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsRecording(true);
      
      console.log('✅ Recording started');
    } catch (error) {
      console.error('❌ Recording failed:', error);
      onError && onError(error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('🛑 Stopping recording...');
      
      if (!recording) return;
      
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      
      // Get the URI of the recorded audio
      const uri = recording.getURI();
      console.log('📁 Recording saved to:', uri);
      
      // Send audio to voice service
      await processAudioFile(uri);
      
      setRecording(null);
    } catch (error) {
      console.error('❌ Stop recording failed:', error);
      onError && onError(error);
    }
  };

  const processAudioFile = async (audioUri) => {
    try {
      console.log('🔄 Processing audio file...');
      
      // In a real implementation, you would:
      // 1. Convert audio to the format expected by your service
      // 2. Send via Socket.io or HTTP
      // 3. Receive response and play it
      
      // For now, simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate receiving a response
      const mockResponse = {
        message: "Hello! I received your voice message. This is a simulated response from the voice agent.",
        audioUrl: null // In real implementation, this would be the audio response URL
      };
      
      onMessage && onMessage({ 
        message: mockResponse.message, 
        source: 'agent' 
      });
      
      console.log('✅ Audio processed successfully');
    } catch (error) {
      console.error('❌ Audio processing failed:', error);
      onError && onError(error);
    }
  };

  const playResponse = async (audioUrl) => {
    try {
      console.log('🔊 Playing response...');
      
      if (sound) {
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
      
      console.log('✅ Response playing');
    } catch (error) {
      console.error('❌ Playback failed:', error);
      onError && onError(error);
    }
  };

  const handlePress = useCallback(() => {
    if (!isConnected) {
      connectToVoiceService();
    } else if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isConnected, isRecording, connectToVoiceService]);

  const getButtonIcon = () => {
    if (!isConnected) {
      return <Ionicons name="wifi" size={32} color="#E2E8F0" />;
    }
    
    if (isRecording) {
      return <ActivityIndicator size="small" color="#FFFFFF" />;
    }
    
    if (isPlaying) {
      return <Ionicons name="volume-high" size={32} color="#E2E8F0" />;
    }
    
    return <Ionicons name="mic" size={32} color="#E2E8F0" />;
  };

  const getButtonText = () => {
    if (!isConnected) {
      return 'Connect';
    }
    
    if (isRecording) {
      return 'Recording...';
    }
    
    if (isPlaying) {
      return 'Playing...';
    }
    
    return 'Speak';
  };

  const getStatusText = () => {
    if (!isConnected) {
      return 'Tap to connect to voice service';
    }
    
    if (isRecording) {
      return 'Speak now - tap to stop recording';
    }
    
    if (isPlaying) {
      return 'Playing response...';
    }
    
    return 'Connected - tap to start recording';
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.callButton,
          isConnected && styles.callButtonConnected,
          isRecording && styles.callButtonRecording,
          isPlaying && styles.callButtonPlaying,
        ]}
        onPress={handlePress}
      >
        <View
          style={[
            styles.buttonInner,
            isConnected && styles.buttonInnerConnected,
            isRecording && styles.buttonInnerRecording,
            isPlaying && styles.buttonInnerPlaying,
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
        Status: {isConnected ? 'Connected' : 'Disconnected'} | 
        Recording: {isRecording ? 'Yes' : 'No'} | 
        Playing: {isPlaying ? 'Yes' : 'No'}
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
  callButtonConnected: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  callButtonRecording: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  callButtonPlaying: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
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
  buttonInnerConnected: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  buttonInnerRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonInnerPlaying: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
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

export default SocketVoiceAgent;
