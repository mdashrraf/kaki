import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import StartScreen from './src/screens/StartScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import KakiHomeScreen from './src/screens/KakiHomeScreen';
import VoiceCompanionScreen from './src/screens/VoiceCompanionScreen';
import RideBookingScreen from './src/screens/RideBookingScreen';
import FoodOrderingScreen from './src/screens/FoodOrderingScreen';
import BillPaymentScreen from './src/screens/BillPaymentScreen';
import GroceryOrderingScreen from './src/screens/GroceryOrderingScreen';
import UserSessionService from './src/services/UserSessionService';
import VoiceAgentService from './src/services/VoiceAgentService';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app startup
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const existingUser = await UserSessionService.restoreUserFromSession();
        if (existingUser) {
          setUserData(existingUser);
          setCurrentScreen('home');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const handleGetStarted = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (user) => {
    setUserData(user);
    setCurrentScreen('home');
    console.log('User onboarded:', user);
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
    // TODO: Navigate to settings screen
  };

  const handleActionPress = (actionId) => {
    console.log(`Action pressed: ${actionId}`);
    // TODO: Handle specific actions
  };

  const handleCompanionPress = () => {
    console.log('Companion pressed - opening voice agent');
    setCurrentScreen('voice-companion');
  };

  const handleVoicePress = async () => {
    console.log('Voice command pressed');
    try {
      // Start voice input
      const userMessage = await VoiceAgentService.startListening();
      console.log('User said:', userMessage);
      
      // Parse the voice command
      const command = VoiceAgentService.parseVoiceCommand(userMessage);
      console.log('Parsed command:', command);
      
      // Navigate based on command
      switch (command.action) {
        case 'ride':
          setCurrentScreen('ride-booking');
          break;
        case 'food':
          setCurrentScreen('food-ordering');
          break;
        case 'grocery':
          setCurrentScreen('grocery-ordering');
          break;
        case 'bills':
          setCurrentScreen('bill-payment');
          break;
        case 'companion':
        default:
          // For companion requests, navigate to voice companion screen
          // The screen will handle using the companion agent
          setCurrentScreen('voice-companion');
          break;
      }
    } catch (error) {
      console.error('Voice command error:', error);
      // Fallback to companion screen
      setCurrentScreen('voice-companion');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    if (isLoading) {
      return null; // Or a loading screen component
    }

    switch (currentScreen) {
      case 'start':
        return <StartScreen onGetStarted={handleGetStarted} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'home':
        if (!userData) {
          // If no user data, redirect to onboarding
          setCurrentScreen('onboarding');
          return <OnboardingScreen onComplete={handleOnboardingComplete} />;
        }
        return (
          <KakiHomeScreen
            userData={userData}
            onSettingsPress={handleSettingsPress}
            onActionPress={handleActionPress}
            onVoicePress={handleVoicePress}
            onCompanionPress={handleCompanionPress}
          />
        );
      case 'voice-companion':
        if (!userData) {
          // If no user data, redirect to home
          setCurrentScreen('home');
          return null;
        }
        return (
          <VoiceCompanionScreen
            userData={userData}
            onBack={handleBackToHome}
          />
        );
      case 'ride-booking':
        return (
          <RideBookingScreen
            onBack={handleBackToHome}
          />
        );
      case 'food-ordering':
        return (
          <FoodOrderingScreen
            onBack={handleBackToHome}
          />
        );
      case 'bill-payment':
        return (
          <BillPaymentScreen
            onBack={handleBackToHome}
          />
        );
      case 'grocery-ordering':
        return (
          <GroceryOrderingScreen
            onBack={handleBackToHome}
          />
        );
      default:
        return <StartScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <ErrorBoundary>
      <StatusBar style="auto" />
      {renderScreen()}
    </ErrorBoundary>
  );
}