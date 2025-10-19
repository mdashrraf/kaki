import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ConversationScreen = ({ userData, onBack }) => {

  useEffect(() => {
    console.log('🔧 VoiceCompanionScreen mounted');
    console.log('👤 User data:', userData);
  }, []);





  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Your Kaki Companion</Text>
        <Text style={styles.subtitle}>Voice-enabled AI assistant</Text>

        <Text style={styles.placeholder}>
          Voice features are temporarily disabled
        </Text>
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
  placeholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});