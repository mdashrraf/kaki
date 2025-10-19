import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SupabaseVoiceAgent from '../components/SupabaseVoiceAgent';
import VoiceAgentService from '../services/VoiceAgentService';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

// Calculate responsive card size based on screen width and padding
const horizontalPadding = 40; // 20px padding on each side
const cardSpacing = 20; // Space between cards
const cardSize = (width - horizontalPadding - cardSpacing) / 2;

const KakiHomeScreenContent = ({ userData, onSettingsPress, onActionPress, onVoicePress, onCompanionPress }) => {
  const userName = userData?.name || 'User';
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  
  useEffect(() => {
    console.log('🏠 KakiHomeScreen mounted');
    console.log('👤 User data:', userData);
    VoiceAgentService.debugConfig();
    
    // Validate API key on mount
    if (!VoiceAgentService.validateApiKey()) {
      Alert.alert(
        'Configuration Error',
        'Invalid ElevenLabs API key. Please check your configuration.',
        [{ text: 'OK' }]
      );
    } else {
      // Test connection if API key is valid
      testElevenLabsConnection();
    }
  }, []);

  const requestPermissions = async () => {
    try {
      console.log('🔐 Requesting permissions...');
      console.log('📱 Platform:', Platform.OS);
      
      if (Platform.OS === 'android') {
        console.log('🤖 Requesting Android permissions...');
        
        // Check current permission status first
        const currentPermissions = await PermissionsAndroid.checkMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        
        console.log('📊 Current Android permissions:', currentPermissions);
        
        // Request permissions
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        console.log('📊 Permission request results:', granted);

        const micGranted = granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;
        const fineLocationGranted = granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        const coarseLocationGranted = granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        const locationGranted = fineLocationGranted || coarseLocationGranted;

        console.log('📱 Android permission results:', { 
          micGranted, 
          fineLocationGranted, 
          coarseLocationGranted, 
          locationGranted 
        });
        
        if (!micGranted) {
          console.log('❌ Microphone permission denied');
          Alert.alert(
            'Microphone Permission Required',
            'Kaki needs microphone permission to provide voice assistance. This permission is essential for voice commands and conversations.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          setPermissionsGranted(false);
        } else {
          console.log('✅ Microphone permission granted');
          setPermissionsGranted(true);
        }
        
        if (!locationGranted) {
          console.log('⚠️ Location permission not granted');
          Alert.alert(
            'Location Permission Recommended',
            'Location access helps Kaki provide better service recommendations like nearby restaurants, ride pickup locations, and local delivery options.',
            [
              { text: 'Skip', style: 'cancel' },
              { text: 'Grant Permission', onPress: () => Linking.openSettings() }
            ]
          );
        } else {
          console.log('✅ Location permission granted');
        }
        
      } else {
        console.log('🍎 iOS: Checking permissions...');
        
        try {
          // For iOS, we need to check if permissions are already granted
          // and handle the case where they need to be requested
          console.log('📱 iOS: Microphone permission will be requested when voice is used');
          
          // Check if we can access microphone (this will trigger permission request if needed)
          // We'll set permissions granted to true and let the voice agent handle the actual request
          setPermissionsGranted(true);
          console.log('✅ iOS permissions setup completed');
          
        } catch (audioError) {
          console.error('❌ iOS permission setup error:', audioError);
          setPermissionsGranted(false);
        }
      }
      
      console.log('🔐 Permission request completed. Granted:', permissionsGranted);
      
    } catch (error) {
      console.error('❌ Permission request error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setPermissionsGranted(false);
    }
  };

  // Test ElevenLabs connection and configuration
  const testElevenLabsConnection = async () => {
    try {
      console.log('🧪 Testing ElevenLabs connection from home screen...');
      const results = await VoiceAgentService.testConnection();
      
      console.log('🧪 Test results:', results);
      
      if (results.error) {
        Alert.alert(
          'ElevenLabs Configuration Error',
          `Connection test failed: ${results.error}`,
          [
            { text: 'OK' },
            { 
              text: 'Use Browser Fallback', 
              onPress: () => VoiceAgentService.openBrowserAgent('home_screen')
            }
          ]
        );
      } else if (results.connectionWorking) {
        console.log('✅ ElevenLabs connection test passed!');
        setPermissionsGranted(true);
      } else {
        Alert.alert(
          'ElevenLabs Configuration Warning',
          'Connection test failed. Voice features may not work properly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
    }
  };

  // Check if we have necessary permissions before starting voice
  const checkPermissionsBeforeVoice = async () => {
    try {
      if (Platform.OS === 'android') {
        const micPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        
        if (!micPermission) {
          console.log('❌ Microphone permission not granted, requesting...');
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );
          
          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Microphone Permission Required',
              'Please grant microphone permission to use voice features.',
              [{ text: 'OK' }]
            );
            return false;
          }
        }
        
        console.log('✅ Microphone permission verified');
        return true;
      } else {
        // For iOS, we assume permission will be requested by the SDK
        console.log('🍎 iOS: Assuming microphone permission will be handled by SDK');
        return true;
      }
    } catch (error) {
      console.error('❌ Permission check error:', error);
      return false;
    }
  };
  
  // Voice agent event handlers
  const handleVoiceConnect = ({ conversationId }) => {
    console.log('✅ Connected to conversation', conversationId);
    setIsVoiceActive(true);
  };

  const handleVoiceDisconnect = (details) => {
    console.log('❌ Disconnected from conversation', details);
    setIsVoiceActive(false);
  };

  const handleVoiceError = (error) => {
    console.error('❌ Conversation error:', error);
    console.error('❌ Error in home screen conversation:', {
      message: error?.message,
      details: error
    });
    setIsVoiceActive(false);
    // Show fallback option when native voice fails
    VoiceAgentService.handleNativeVoiceFailure('home_screen', error);
  };

  const handleVoiceMessage = (message) => {
    console.log('💬 Message received:', message);
    
    // Parse agent responses for navigation commands
    if (message.source === 'agent' && message.type === 'agent_response') {
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
  };

  // Debug voice agent state on mount
  useEffect(() => {
    console.log('🔄 Voice agent wrapper initialized');
    console.log('👤 User data:', userData);
    console.log('🔑 Agent ID:', VoiceAgentService.AGENT_ID);
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
        <SupabaseVoiceAgent
          onConnect={handleVoiceConnect}
          onDisconnect={handleVoiceDisconnect}
          onError={handleVoiceError}
          onMessage={handleVoiceMessage}
          userName={userName}
          context="home_screen_voice_command"
        />
        
        {/* Permission Status Indicator */}
        {!permissionsGranted && (
          <View style={styles.permissionWarning}>
            <Ionicons name="warning" size={16} color="#FF9500" />
            <Text style={styles.permissionWarningText}>
              Microphone permission required for voice features
            </Text>
          </View>
        )}

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
