# Kaki - Voice-Enabled Companion App

A React Native Expo app with ElevenLabs AI voice integration for daily task assistance.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

3. **Run the app:**
   ```bash
   npx expo start --tunnel
   ```

4. **Run on device:**
   ```bash
   npx expo run:ios --device
   # or
   npx expo run:android --device
   ```

## 🎤 Voice Features

- **Real-time voice conversations** with ElevenLabs AI agents
- **Voice command navigation** to different app sections
- **Intelligent task routing** based on voice input
- **Companion mode** for general conversations

## 📱 App Features

- **Onboarding**: Name and phone number collection
- **Home Screen**: Action cards and voice command button
- **Service Screens**: Ride booking, food ordering, grocery shopping, bill payments
- **Voice Companion**: Dedicated AI conversation screen

## 🛠️ Tech Stack

- **React Native Expo** with new architecture
- **ElevenLabs React Native SDK** for voice AI
- **Supabase** for backend services
- **LiveKit** for WebRTC voice communication
- **React Native Safe Area Context** for device compatibility

## 📁 Project Structure

```
src/
├── screens/              # App screens
│   ├── StartScreen.js
│   ├── OnboardingScreen.js
│   ├── KakiHomeScreen.js
│   ├── VoiceCompanionScreen.js
│   └── service-screens/
├── services/             # Business logic
│   ├── VoiceAgentService.js
│   ├── UserService.js
│   └── UserSessionService.js
├── components/           # Reusable components
├── config/              # Configuration files
└── utils/               # Helper functions
```

## 🔧 Configuration

### Environment Variables

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
ELEVENLABS_BASE_URL=https://api.elevenlabs.io/v1
```

### ElevenLabs Agents

- **Main Agent**: `agent_9601k7v1dtekej68p3x13zv4erse` (service requests)
- **Companion Agent**: `agent_8601k7tybe14e16tf75gmjdede86` (general chat)

## 📝 Development

### Prerequisites

- Node.js v18 or higher
- Expo CLI
- iOS Simulator or Android Emulator
- Physical device for voice testing

### Voice Development

The app uses the official ElevenLabs React Native SDK with WebRTC support:

```javascript
import { ElevenLabsProvider, useConversation } from '@elevenlabs/react-native';

const conversation = useConversation({
  onConnect: ({ conversationId }) => console.log('Connected'),
  onMessage: ({ message, source }) => console.log('Message:', message),
  // ... other handlers
});
```

## 🚀 Deployment

1. **Prebuild for native dependencies:**
   ```bash
   npx expo prebuild --clean
   ```

2. **Build for production:**
   ```bash
   npx expo build:ios
   npx expo build:android
   ```

## 📚 Documentation

- [ElevenLabs React Native SDK](https://elevenlabs.io/docs/cookbooks/agents-platform/expo-react-native)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

Happy coding! 🎉
