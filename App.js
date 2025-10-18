import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import your Figma components here
// import Button from './src/components/Button';
// import Card from './src/components/Card';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>Figma Import Ready!</Text>
        <Text style={styles.subtitle}>
          Your React Native Expo app is set up for Figma imports.
        </Text>
        
        {/* Add your imported Figma components here */}
        <View style={styles.componentArea}>
          <Text style={styles.placeholder}>
            Import your Figma components here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  componentArea: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});