import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StartScreen = ({ onGetStarted }) => {
  const handleGetStarted = () => {
    console.log('Get started pressed');
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Section - Icon and Branding */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/kaki-icon.png')}
          style={styles.appIcon}
          resizeMode="contain"
        />
        <Text style={styles.appTitle}>Kaki</Text>
        <Text style={styles.subtitle}>
          Your voice-enabled companion for daily tasks
        </Text>
      </View>

      {/* Middle Section - Main Image */}
      <View style={styles.imageSection}>
        <Image
          source={require('../../assets/startscreen_image.webp')}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Section - Buttons and Text */}
      <View style={styles.bottomSection}>
        {/* Get Started Button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        {/* Privacy Text */}
        <Text style={styles.privacyText}>
          No sign-up required. Your privacy is our priority.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 80, // Increased from 60 for proper spacing from status bar
    paddingHorizontal: 20,
  },
  appIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  mainImage: {
    width: width * 0.9,
    height: height * 0.35,
    borderRadius: 16,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  getStartedText: {
    color: '#FF6B35',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default StartScreen;
