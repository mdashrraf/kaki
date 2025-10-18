import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import StartScreen from './src/screens/StartScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import KakiHomeScreen from './src/screens/KakiHomeScreen';
import UserSessionService from './src/services/UserSessionService';

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

  const handleVoicePress = () => {
    console.log('Voice command pressed');
    // TODO: Implement voice functionality
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
        return (
          <KakiHomeScreen
            userData={userData}
            onSettingsPress={handleSettingsPress}
            onActionPress={handleActionPress}
            onVoicePress={handleVoicePress}
          />
        );
      default:
        return <StartScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      {renderScreen()}
    </>
  );
}