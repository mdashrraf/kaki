import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UserService from '../services/UserService';
import UserSessionService from '../services/UserSessionService';
import { testSupabaseConnection } from '../utils/supabaseTest';

const OnboardingScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const phoneInputRef = useRef(null);

  const handleContinue = async () => {
    // Trim inputs
    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();
    
    // Check for empty inputs
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!trimmedPhone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    // Validation using UserService
    if (!UserService.validateName(trimmedName)) {
      Alert.alert('Error', 'Please enter a valid name (at least 2 characters, letters only)');
      return;
    }

    if (!UserService.validatePhoneNumber(trimmedPhone)) {
      Alert.alert('Error', 'Please enter a valid phone number (exactly 8 digits)');
      return;
    }

    setIsLoading(true);
    
    try {
      // First test the connection
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error(`Database connection failed: ${connectionTest.error}`);
      }
      
      // Save to Supabase
      const userData = await UserService.createUser({
        name: trimmedName,
        phoneNumber: trimmedPhone,
        countryCode: '+65'
      });
      
      console.log('User created successfully:', userData);
      
      // Save user session for persistence
      await UserSessionService.createUserSession(userData);
      
      // Navigate directly to home screen without popup
      onComplete(userData);
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to save your information. Please try again.';
      
      if (error.message.includes('connection failed')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={require('../../assets/kaki-icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
          <Text style={styles.welcomeTitle}>Welcome to Kaki</Text>
          <Text style={styles.subtitle}>Let's get to know you better</Text>
        </View>

        {/* Input Fields Section */}
        <View style={styles.inputSection}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#999999"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => {
                phoneInputRef.current?.focus();
              }}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.countryCode}>+65</Text>
              </View>
              <TextInput
                ref={phoneInputRef}
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={(text) => {
                  // Limit to 8 digits only
                  const cleanText = text.replace(/\D/g, '');
                  if (cleanText.length <= 8) {
                    setPhoneNumber(cleanText);
                  }
                }}
                placeholder="Enter phone number"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                maxLength={8}
              />
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>

        {/* Privacy Statement */}
        <Text style={styles.privacyText}>
          We'll never share your information with anyone else.
        </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  appIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
});

export default OnboardingScreen;
