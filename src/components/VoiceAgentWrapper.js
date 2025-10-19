import React from 'react';
import { View, StyleSheet } from 'react-native';
import VoiceAgentDOMComponent from './VoiceAgentDOM';
import VoiceAgentService from '../services/VoiceAgentService';

const VoiceAgentWrapper = ({ 
  onConnect, 
  onDisconnect, 
  onError, 
  onMessage,
  userName = 'User',
  context = 'voice_command'
}) => {
  return (
    <View style={styles.container}>
      <VoiceAgentDOMComponent
        agentId={VoiceAgentService.AGENT_ID}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
        onMessage={onMessage}
        userName={userName}
        context={context}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceAgentWrapper;
