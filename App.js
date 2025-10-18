import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import StartScreen from './src/screens/StartScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import KakiHomeScreen from './src/screens/KakiHomeScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [userData, setUserData] = useState(null);

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