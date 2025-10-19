import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

// Calculate responsive card size based on screen width and padding
const horizontalPadding = 40; // 20px padding on each side
const cardSpacing = 20; // Space between cards
const cardSize = (width - horizontalPadding - cardSpacing) / 2;

const KakiHomeScreenContent = ({ userData, onSettingsPress, onActionPress, onVoicePress, onCompanionPress }) => {
  const userName = userData?.name || 'User';
  
  useEffect(() => {
    console.log('🏠 KakiHomeScreen mounted');
    console.log('👤 User data:', userData);
  }, []);



  

  
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
                { width: cardSize }
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
        <Text style={styles.voiceInstruction}>
          Voice features are temporarily disabled
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
        paddingTop: isSmallScreen ? 70 : 80, // Responsive top padding for proper spacing
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 20, // Consistent spacing between cards
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
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  permissionWarningText: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#856404',
    marginLeft: 6,
    textAlign: 'center',
    flex: 1,
  },
  testInfo: {
    fontSize: isSmallScreen ? 10 : 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});

// Main component - provider is now handled at app root
const KakiHomeScreen = (props) => {
  return <KakiHomeScreenContent {...props} />;
};

export default KakiHomeScreen;
