# 🧪 ElevenLabs Integration End-to-End Test Instructions

## 🚀 How to Test the Voice Integration

### Step 1: Start the App
```bash
cd /Users/ash/Kaki
npx expo start --tunnel
```

### Step 2: Navigate to Home Screen
1. Open the app on your device/simulator
2. Complete onboarding if needed
3. Navigate to the KakiHomeScreen (main home screen)

### Step 3: Check Initial State
Look for these console logs:
```
🏠 KakiHomeScreen mounted
👤 User data: {...}
VoiceAgentService Configuration:
API_KEY: sk_d36b144...
AGENT_ID: agent_9601k7v1dtekej68p3x13zv4erse
🧪 Testing ElevenLabs connection from home screen...
✅ API connection successful: {...}
✅ ElevenLabs connection test passed!
🔄 Conversation hook initialized
📊 Initial conversation status: disconnected
```

### Step 4: Test Voice Button
1. **Look at the voice button** - should show "Speak" text
2. **Check the status display** - should show "Status: disconnected | Mode: none"
3. **Tap the voice button**

### Step 5: Expected Behavior
When you tap the voice button, you should see:

**Console Logs:**
```
🎤 Voice command pressed
📊 Current conversation status: disconnected
🔑 Agent ID: agent_9601k7v1dtekej68p3x13zv4erse
🚀 Starting voice conversation...
✅ Voice conversation started successfully
📡 Status: connecting
📡 Status: connected
```

**UI Changes:**
- Button text changes to "Connecting..." then "Stop"
- Status display shows "Status: connected | Mode: listening"
- Button shows loading indicator during connection

### Step 6: Test Voice Interaction
1. **Speak into the microphone** when status shows "Mode: listening"
2. **Wait for response** - status should change to "Mode: speaking"
3. **Listen to agent response**

### Step 7: Test Error Handling
If the voice fails to start:
1. **Check console logs** for error details
2. **Look for error dialog** with browser fallback option
3. **Try browser fallback** if available

## 🎯 Success Criteria

### ✅ Integration Working If:
- Voice button responds to taps
- Conversation status changes from "disconnected" → "connecting" → "connected"
- Agent responds to voice input
- No crashes or infinite loading states
- Clear status indicators throughout

### ❌ Integration Failing If:
- Voice button doesn't respond
- Status stays at "connecting" indefinitely
- Error dialogs appear with 404 or permission issues
- App crashes when tapping voice button
- No console logs appear

## 🔧 Troubleshooting

### If Voice Button Doesn't Work:
1. Check console for API connection errors
2. Verify agent ID is correct
3. Check network connectivity
4. Try browser fallback

### If Conversation Fails to Start:
1. Check microphone permissions
2. Verify ElevenLabs SDK initialization
3. Review error messages in console
4. Test with browser fallback

### If Agent Doesn't Respond:
1. Check if agent ID is valid
2. Verify API key permissions
3. Test with different voice input
4. Check network connectivity

## 📊 Test Results Template

```
Test Date: ___________
Device: ______________
Platform: ____________

✅ App Launch: PASS/FAIL
✅ Voice Button: PASS/FAIL  
✅ Conversation Start: PASS/FAIL
✅ Voice Input: PASS/FAIL
✅ Agent Response: PASS/FAIL
✅ Error Handling: PASS/FAIL

Notes: ________________
```

## 🎉 Expected Final Result

The voice integration should work seamlessly with:
- One-tap voice activation
- Real-time conversation with the ElevenLabs agent
- Clear status indicators
- Proper error handling with fallbacks
- Persistent conversation across screens
