import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const KakiHomeScreen = ({ userData, onSettingsPress, onActionPress, onVoicePress, onCompanionPress }) => {
  const userName = userData?.name || 'User';

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

  const handleVoicePress = () => {
    console.log('Voice command pressed');
    if (onVoicePress) {
      onVoicePress();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              style={styles.actionCard}
              onPress={() => handleActionPress(card.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                <Ionicons name={card.icon} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Voice Command Section */}
      <View style={styles.voiceSection}>
        <TouchableOpacity style={styles.voiceButton} onPress={handleVoicePress}>
          <Ionicons name="mic" size={24} color="#FFFFFF" style={styles.micIcon} />
          <Text style={styles.voiceButtonText}>Speak</Text>
        </TouchableOpacity>
        <Text style={styles.voiceInstruction}>Or tap to speak your request</Text>
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
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
    paddingBottom: 20, // Add bottom padding to prevent overlap
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2 * 0.8, // Reduce by 20% (0.8)
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16, // Reduced from 20
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 38, // Reduced by 20% (48 * 0.8)
    height: 38, // Reduced by 20% (48 * 0.8)
    borderRadius: 10, // Reduced proportionally
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Reduced from 12
  },
  cardTitle: {
    fontSize: 12, // Reduced from 14
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  voiceSection: {
    paddingHorizontal: 20,
    paddingTop: 20, // Add top padding
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Match container background
  },
  voiceButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    marginBottom: 12,
  },
  micIcon: {
    marginRight: 8,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  voiceInstruction: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default KakiHomeScreen;
