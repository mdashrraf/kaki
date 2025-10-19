import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConvAiDOMComponent from './ConvAI';
import VoiceAgentService from '../services/VoiceAgentService';

const VoiceAgentExpoGuide = ({ 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage,
  userName = 'User',
  context = 'voice_command'
}) => {
  return (
    <View style={styles.container}>
      <ConvAiDOMComponent
        agentId={VoiceAgentService.AGENT_ID}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
        onMessage={onMessage}
      />
      <Text style={styles.statusText}>
        Status: Ready | Agent: Kaki-task-agent
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginTop: 8,
  },
});

export default VoiceAgentExpoGuide;
