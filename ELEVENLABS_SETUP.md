# 🎤 ElevenLabs Voice Agent Integration Setup

## 🔧 Configuration Required

To use the ElevenLabs voice agent, you need to set up your API key:

### Step 1: Get Your ElevenLabs API Key

1. **Go to**: [ElevenLabs API Settings](https://elevenlabs.io/app/settings/api-keys)
2. **Sign up/Login** to your ElevenLabs account
3. **Create a new API key** or use an existing one
4. **Copy the API key**

### Step 2: Update VoiceAgentService

1. **Open**: `src/services/VoiceAgentService.js`
2. **Replace**: `YOUR_ELEVENLABS_API_KEY` with your actual API key
3. **Save** the file

```javascript
// In VoiceAgentService.js
static API_KEY = 'your_actual_api_key_here';
```

### Step 3: Agent Configuration

The voice agent is already configured with:
- **Agent ID**: `agent_8601k7tybe14e16tf75gmjdede86`
- **Base URL**: `https://api.elevenlabs.io/v1`
- **Integration**: Ready for voice conversations

## 🎯 How It Works

### Voice Companion Flow:
1. **User clicks "Companion"** button on home screen
2. **Voice Companion Screen** opens
3. **User taps microphone** to start speaking
4. **Voice input** is processed by ElevenLabs agent
5. **Agent responds** with helpful voice output
6. **User can continue** the conversation

### Features:
- **Real-time Voice**: Two-way voice conversation
- **AI Companion**: Intelligent responses to user queries
- **Daily Task Help**: Assists with groceries, rides, reminders, etc.
- **Natural Speech**: High-quality voice synthesis

## 🚀 Testing the Integration

1. **Set up API key** (Step 2 above)
2. **Run the app**: `npm start`
3. **Complete onboarding** flow
4. **Go to home screen**
5. **Click "Companion"** button
6. **Test voice interaction**

## 📱 Voice Companion Features

### Available Commands:
- "Help me order groceries"
- "Book a ride for me"
- "Set a reminder for medicine"
- "Call my family"
- "What can you help me with?"

### Voice Controls:
- **Tap microphone**: Start/stop listening
- **Visual feedback**: Shows listening/speaking status
- **Back button**: Return to home screen
- **Clear instructions**: User guidance

## 🔧 Technical Implementation

### VoiceAgentService Methods:
- `initialize()`: Set up audio permissions
- `startListening()`: Begin voice input
- `startVoiceConversation()`: Process with ElevenLabs
- `speakResponse()`: Convert text to speech
- `stopListening()`: End voice input

### Integration Points:
- **KakiHomeScreen**: Companion button handler
- **VoiceCompanionScreen**: Full voice interface
- **App.js**: Navigation between screens
- **ElevenLabs API**: Agent conversation processing

## 🎉 Ready to Use!

Once you add your ElevenLabs API key, the voice companion will be fully functional and ready to help users with their daily tasks through natural voice interaction!

The integration provides a seamless voice experience that makes Kaki truly voice-enabled for daily assistance. 🎤✨
