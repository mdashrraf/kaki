
'use client';

import { useConversation } from '@elevenlabs/react';
import { Mic } from 'lucide-react-native';
import { useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';


import { Platform, Alert } from 'react-native';
// Only import expo-audio on native
import * as Permissions from 'expo-permissions';

async function requestMicrophonePermission() {
  if (Platform.OS === 'web') {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error('Microphone permission denied', error);
      Alert.alert('Permission Required', 'Microphone permission is required.');
      return false;
    }
  } else {
    try {
      // Use expo-permissions to request microphone permission
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Microphone permission denied', error);
      Alert.alert('Permission Required', 'Microphone permission is required.');
      return false;
    }
  }
}

export default function ConvAiDOMComponent({ agentId, onConnect, onDisconnect, onError, onMessage }) {
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      onConnect && onConnect();
    },
    onDisconnect: () => {
      console.log('Disconnected');
      onDisconnect && onDisconnect();
    },
    onMessage: (message) => {
      console.log(message);
      onMessage && onMessage(message);
    },
    onError: (error) => {
      console.error('Error:', error);
      onError && onError(error);
    },
  });

  const startConversation = useCallback(async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      // Alert already shown in permission function
      return;
    }

    try {
      await conversation.startSession({
        agentId: agentId,
        connectionType: 'websocket',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      Alert.alert('Voice Agent Error', error.message || String(error));
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <Pressable
      style={[
        styles.callButton,
        conversation.status === 'connected' && styles.callButtonActive,
      ]}
      onPress={
        conversation.status === 'disconnected'
          ? startConversation
          : stopConversation
      }
    >
      <View
        style={[
          styles.buttonInner,
          conversation.status === 'connected' && styles.buttonInnerActive,
        ]}
      >
        <Mic size={32} color="#E2E8F0" strokeWidth={1.5} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
