import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ElevenLabsProvider, useConversation } from '@elevenlabs/react-native';
import VoiceAgentService from '../services/VoiceAgentService';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const cardSize = isSmallScreen ? (width - 60) / 2 * 0.7 : (width - 60) / 2 * 0.8;

const KakiHomeScreenContent = ({ userData, onSettingsPress, onActionPress, onVoicePress, onCompanionPress }) => {
  const userName = userData?.name || 'User';
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to conversation', conversationId);
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from conversation', details);
      setIsVoiceActive(false);
    },
    onError: (message, context) => {
      console.error('❌ Conversation error:', message, context);
      setIsVoiceActive(false);
      Alert.alert('Voice Error', 'Failed to connect to voice agent. Please try again.');
    },
    onMessage: ({ message, source }) => {
      console.log(`💬 Message from ${source}:`, message);
      
      // Parse agent responses for navigation commands
      if (source === 'agent' && message.type === 'agent_response') {
        const responseText = message.message?.toLowerCase() || '';
        const command = VoiceAgentService.parseVoiceCommand(responseText);
        
        // Navigate based on agent's understanding
        if (command.action !== 'companion') {
          setTimeout(() => {
            switch (command.action) {
              case 'ride':
                onVoicePress && onVoicePress('ride-booking');
                break;
              case 'food':
                onVoicePress && onVoicePress('food-ordering');
                break;
              case 'grocery':
                onVoicePress && onVoicePress('grocery-ordering');
                break;
              case 'bills':
                onVoicePress && onVoicePress('bill-payment');
                break;
            }
          }, 1000);
        }
      }
    },
    onModeChange: ({ mode }) => {
      console.log(`🔊 Mode: ${mode}`);
      setIsVoiceActive(mode === 'listening' || mode === 'speaking');
    },
    onStatusChange: ({ status }) => {
      console.log(`📡 Status: ${status}`);
      if (status === 'idle') {
        setIsVoiceActive(false);
      }
    },
  });

  const actionCards = [
    {
      id: 'ride',
      title: 'Book a ride',
      icon: 'car',
      color: '#007AFF',
    },
    {
      id: 'meal',
      title: 'Order a meal',
      icon: 'restaurant',
      color: '#34C759',
    },
    {
      id: 'groceries',
      title: 'Order groceries',
      icon: 'cart',
      color: '#AF52DE',
    },
    {
      id: 'alerts',
      title: 'Set Alerts',
      icon: 'notifications',
      color: '#FF9500',
    },
    {
      id: 'emergency',
      title: 'Emergency',
      icon: 'call',
      color: '#FF3B30',
    },
    {
      id: 'bills',
      title: 'Bill Payments',
      icon: 'card',
      color: '#8E8E93',
    },
    {
      id: 'companion',
      title: 'Companion',
      icon: 'heart',
      color: '#FF2D92',
    },
  ];

  const handleActionPress = (actionId) => {
    console.log(`Action pressed: ${actionId}`);
    
    if (actionId === 'companion') {
      if (onCompanionPress) {
        onCompanionPress();
      }
    } else if (onActionPress) {
      onActionPress(actionId);
    }
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
    if (onSettingsPress) {
      onSettingsPress();
    }
  };

  const handleVoicePress = async () => {
    console.log('Voice command pressed');
    
    try {
      if (conversation.status === 'idle') {
        // Start new conversation with the main service agent
        setIsVoiceActive(true);
        await conversation.startSession({
          agentId: VoiceAgentService.AGENT_ID,
          dynamicVariables: {
            platform: Platform.OS,
            userName: userName,
            context: 'home_screen_voice_command'
          },
        });
      } else if (conversation.status === 'connected') {
        // End current conversation
        await conversation.endSession();
        setIsVoiceActive(false);
      }
    } catch (error) {
      console.error('Voice command error:', error);
      setIsVoiceActive(false);
      Alert.alert('Voice Error', 'Failed to start voice conversation. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello {userName}!</Text>
          <Text style={styles.subtitle}>What would you like to do today?</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Ionicons name="settings" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Action Cards Grid */}
      <ScrollView 
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {actionCards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.actionCard,
                { width: cardSize },
                index === actionCards.length - 1 && styles.lastCard
              ]}
              onPress={() => handleActionPress(card.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                <Ionicons name={card.icon} size={isSmallScreen ? 18 : 20} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Voice Command Section */}
      <View style={styles.voiceSection}>
        <TouchableOpacity 
          style={[
            styles.voiceButton, 
            (isVoiceActive || conversation.status === 'connected') && styles.voiceButtonActive
          ]} 
          onPress={handleVoicePress}
          disabled={conversation.status === 'connecting'}
        >
          {conversation.status === 'connecting' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : conversation.mode === 'listening' ? (
            <Ionicons name="mic" size={24} color="#FFFFFF" style={styles.micIcon} />
          ) : conversation.mode === 'speaking' ? (
            <Ionicons name="volume-high" size={24} color="#FFFFFF" style={styles.micIcon} />
          ) : conversation.status === 'connected' ? (
            <Ionicons name="stop" size={24} color="#FFFFFF" style={styles.micIcon} />
          ) : (
            <Ionicons name="mic" size={24} color="#FFFFFF" style={styles.micIcon} />
          )}
          <Text style={styles.voiceButtonText}>
            {conversation.status === 'connecting' ? 'Connecting...' :
             conversation.mode === 'listening' ? 'Listening...' :
             conversation.mode === 'speaking' ? 'Speaking...' :
             conversation.status === 'connected' ? 'Stop' : 'Speak'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.voiceInstruction}>
          {conversation.status === 'connecting' ? 'Starting voice agent...' :
           conversation.mode === 'listening' ? 'Speak your request now' :
           conversation.mode === 'speaking' ? 'Kaki is responding...' :
           conversation.status === 'connected' ? 'Tap to end conversation' :
           'Tap to start voice conversation'}
        </Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: isSmallScreen ? 24 : 28, // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16, // Responsive font size
    color: '#8E8E93',
    fontWeight: '400',
  },
  settingsButton: {
    padding: 8,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardsContent: {
    paddingBottom: isSmallScreen ? 10 : 20, // Responsive padding
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Reduced from 16
    padding: isSmallScreen ? 12 : 16, // Responsive padding
    alignItems: 'center',
    marginBottom: isSmallScreen ? 8 : 12, // Responsive margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1, // Reduced shadow
    },
    shadowOpacity: 0.05, // Reduced shadow opacity
    shadowRadius: 2, // Reduced shadow radius
    elevation: 2, // Reduced elevation
  },
  lastCard: {
    // Center the last card (Companion) if it's alone
    alignSelf: 'center',
  },
  iconContainer: {
    width: isSmallScreen ? 32 : 38, // Responsive icon container
    height: isSmallScreen ? 32 : 38,
    borderRadius: isSmallScreen ? 8 : 10, // Responsive border radius
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 6 : 10, // Responsive margin
  },
  cardTitle: {
    fontSize: isSmallScreen ? 10 : 12, // Responsive font size
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 12 : 14, // Better line height
  },
  voiceSection: {
    paddingHorizontal: 20,
    paddingTop: isSmallScreen ? 10 : 20, // Responsive padding
    paddingBottom: isSmallScreen ? 20 : 30, // Responsive padding
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5', // Subtle border
  },
  voiceButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 12 : 16, // Responsive padding
    paddingHorizontal: isSmallScreen ? 24 : 32, // Responsive padding
    borderRadius: 12, // Reduced from 16
    width: '100%',
    marginBottom: isSmallScreen ? 8 : 12, // Responsive margin
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 2, // Reduced shadow
    },
    shadowOpacity: 0.2, // Reduced shadow opacity
    shadowRadius: 4, // Reduced shadow radius
    elevation: 3, // Reduced elevation
  },
  voiceButtonActive: {
    backgroundColor: '#E05A2B', // Darker orange when active
    transform: [{ scale: 1.02 }], // Slight scale effect
  },
  micIcon: {
    marginRight: 8,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 16 : 18, // Responsive font size
    fontWeight: '600',
  },
  voiceInstruction: {
    fontSize: isSmallScreen ? 12 : 14, // Responsive font size
    color: '#8E8E93',
    textAlign: 'center',
  },
});

// Main component with ElevenLabs provider
const KakiHomeScreen = (props) => {
  return (
    <ElevenLabsProvider apiKey={VoiceAgentService.API_KEY}>
      <KakiHomeScreenContent {...props} />
    </ElevenLabsProvider>
  );
};

export default KakiHomeScreen;
