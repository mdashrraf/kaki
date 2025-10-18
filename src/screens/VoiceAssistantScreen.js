import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import VoiceAgentService from '../services/VoiceAgentService';

const VoiceAssistantScreen = ({ userData, onBack, onNavigate }) => {
  const userName = userData?.name || 'User';
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Kaki Voice Assistant</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #F8F8F8;
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 20px;
      overflow: hidden;
    }
    .back-button {
      position: absolute;
      top: 60px;
      left: 20px;
      width: 44px;
      height: 44px;
      border-radius: 22px;
      background: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-size: 24px;
      z-index: 10;
    }
    .container {
      text-align: center;
      width: 100%;
      max-width: 400px;
      margin: auto;
    }
    h1 { font-size: 32px; font-weight: bold; color: #333; margin-bottom: 10px; }
    .subtitle { font-size: 18px; color: #666; margin-bottom: 40px; }
    .status { min-height: 60px; margin-bottom: 40px; }
    .status-text { font-size: 18px; color: #FF6B35; font-weight: 600; }
    .mic-button {
      width: 100px; height: 100px; border-radius: 50px; background: #FF6B35;
      border: none; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 30px; cursor: pointer;
      box-shadow: 0 5px 20px rgba(255, 107, 53, 0.4);
      transition: all 0.3s;
    }
    .mic-button:active { transform: scale(0.95); }
    .mic-button.listening { background: #E05A2B; transform: scale(1.1); }
    .mic-button.speaking { background: #34C759; transform: scale(1.05); }
    .mic-button.disabled { background: #CCCCCC; opacity: 0.6; cursor: not-allowed; }
    .mic-icon { font-size: 40px; color: white; }
    .instructions { font-size: 16px; color: #888; }
    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      width: 40px; height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <button class="back-button" onclick="window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({action:'back'}))">←</button>
  
  <div class="container">
    <h1>Voice Assistant</h1>
    <p class="subtitle">Speak your command</p>
    <div class="status">
      <p class="status-text" id="status">Status: initializing</p>
    </div>
    <button id="micButton" class="mic-button">
      <span class="mic-icon" id="buttonIcon">🎤</span>
    </button>
    <p class="instructions" id="instructions">Loading...</p>
  </div>

  <script type="module">
    const agentId = '${VoiceAgentService.AGENT_ID}';
    const apiKey = '${VoiceAgentService.API_KEY}';
    
    const statusEl = document.getElementById('status');
    const buttonEl = document.getElementById('micButton');
    const iconEl = document.getElementById('buttonIcon');
    const instructionsEl = document.getElementById('instructions');

    let conversation = null;
    let isConnected = false;

    async function loadSDK() {
      try {
        const { Conversation } = await import('https://cdn.jsdelivr.net/npm/@11labs/client/+esm');
        window.ElevenLabsConversation = Conversation;
        statusEl.textContent = 'Status: ready';
        instructionsEl.textContent = 'Tap to speak';
        return true;
      } catch (error) {
        statusEl.textContent = 'Status: error';
        instructionsEl.textContent = 'SDK failed: ' + error.message;
        return false;
      }
    }

    function updateUI(status, mode) {
      statusEl.textContent = 'Status: ' + status;
      buttonEl.className = 'mic-button';
      
      if (status === 'connecting') {
        buttonEl.classList.add('disabled');
        iconEl.innerHTML = '<div class="spinner"></div>';
        instructionsEl.textContent = 'Connecting...';
      } else if (status === 'connected') {
        if (mode === 'listening') {
          buttonEl.classList.add('listening');
          iconEl.textContent = '🎤';
          instructionsEl.textContent = 'Listening...';
        } else if (mode === 'speaking') {
          buttonEl.classList.add('speaking');
          iconEl.textContent = '🔊';
          instructionsEl.textContent = 'Kaki is speaking...';
        } else {
          iconEl.textContent = '⏹';
          instructionsEl.textContent = 'Tap to stop';
        }
      } else if (status === 'ready') {
        iconEl.textContent = '🎤';
        instructionsEl.textContent = 'Tap to speak';
      }
    }

    async function startConversation() {
      if (!window.ElevenLabsConversation) {
        alert('SDK not loaded');
        return;
      }
      
      try {
        updateUI('connecting', null);
        
        conversation = await window.ElevenLabsConversation.startSession({
          agentId: agentId,
          onConnect: () => {
            isConnected = true;
            updateUI('connected', null);
          },
          onDisconnect: () => {
            isConnected = false;
            updateUI('ready', null);
          },
          onError: (error) => {
            updateUI('ready', null);
            alert('Error: ' + error);
          },
          onModeChange: ({ mode }) => {
            updateUI('connected', mode);
          },
          onMessage: ({ message, source }) => {
            if (source === 'ai' && message.message) {
              const text = message.message.toLowerCase();
              let action = null;
              
              if (text.includes('ride') || text.includes('taxi')) action = 'ride-booking';
              else if (text.includes('food') || text.includes('meal')) action = 'food-ordering';
              else if (text.includes('grocery')) action = 'grocery-ordering';
              else if (text.includes('bill')) action = 'bill-payment';
              
              if (action && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'navigate', screen: action }));
              }
            }
          },
        });
        
      } catch (error) {
        updateUI('ready', null);
        alert('Error: ' + error.message);
      }
    }

    async function stopConversation() {
      if (conversation) {
        await conversation.endSession();
        conversation = null;
        isConnected = false;
        updateUI('ready', null);
      }
    }

    buttonEl.addEventListener('click', async () => {
      if (isConnected) {
        await stopConversation();
      } else if (!buttonEl.classList.contains('disabled')) {
        await startConversation();
      }
    });

    loadSDK();
  </script>
</body>
</html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.action === 'back') {
        onBack();
      } else if (data.action === 'navigate' && data.screen) {
        onNavigate(data.screen);
      }
    } catch (error) {
      console.error('WebView message error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onMessage={handleMessage}
        onError={(syntheticEvent) => {
          console.error('WebView error:', syntheticEvent.nativeEvent);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  webview: {
    flex: 1,
  },
});

export default VoiceAssistantScreen;
