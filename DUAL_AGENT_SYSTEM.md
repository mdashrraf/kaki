# 🎤 Dual ElevenLabs Agent System

## 🤖 Agent Configuration

Your Kaki app now uses **two specialized ElevenLabs agents** for different purposes:

### 1. **Main Service Agent** 
- **Agent ID**: `agent_9601k7v1dtekej68p3x13zv4erse`
- **Purpose**: Handles service requests (ride booking, food ordering, bill payment, grocery ordering)
- **Usage**: Activated when users request specific services through voice commands

### 2. **Companion Agent**
- **Agent ID**: `agent_8601k7tybe14e16tf75gmjdede86` 
- **Purpose**: Provides general conversation and companionship
- **Usage**: Activated when users specifically request companion interaction

## 🎯 Voice Command Flow

### Service Requests (Main Agent):
When users say commands like:
- **"Book a ride"** → Uses Main Agent → Opens RideBookingScreen
- **"Order food"** → Uses Main Agent → Opens FoodOrderingScreen  
- **"Pay bills"** → Uses Main Agent → Opens BillPaymentScreen
- **"Order groceries"** → Uses Main Agent → Opens GroceryOrderingScreen

### Companion Requests (Companion Agent):
When users say commands like:
- **"I want to chat with my companion"**
- **"Talk to me"**
- **"Start a conversation"**
- **"Companion mode"**

→ Uses Companion Agent → Opens VoiceCompanionScreen

## 🔄 Agent Selection Logic

### Automatic Agent Selection:
```javascript
// In VoiceAgentService.parseVoiceCommand()
if (message.includes('companion') || message.includes('chat') || message.includes('talk')) {
  return {
    action: 'companion',
    details: { useCompanionAgent: true } // Uses Companion Agent
  };
}
```

### Service Detection:
```javascript
if (message.includes('book') && message.includes('ride')) {
  return { action: 'ride' }; // Uses Main Agent
}
```

## 📱 User Experience

### Speak Button Flow:
1. **User clicks "Speak"** on home screen
2. **Voice input** is captured
3. **Command parsing** determines intent:
   - Service request → Main Agent → Service Screen
   - Companion request → Companion Agent → Voice Companion Screen
4. **Appropriate agent** handles the conversation

### Companion Button Flow:
1. **User clicks "Companion"** card
2. **Direct navigation** to VoiceCompanionScreen
3. **Companion Agent** handles all interactions
4. **Natural conversation** with specialized companion AI

## 🛠️ Technical Implementation

### Agent Configuration:
```javascript
export class VoiceAgentService {
  static AGENT_ID = 'agent_9601k7v1dtekej68p3x13zv4erse'; // Main Agent
  static COMPANION_AGENT_ID = 'agent_8601k7tybe14e16tf75gmjdede86'; // Companion Agent
}
```

### Dynamic Agent Selection:
```javascript
static async startVoiceConversation(userMessage, command = null) {
  const agentId = command?.details?.useCompanionAgent 
    ? this.COMPANION_AGENT_ID 
    : this.AGENT_ID;
  
  // Call appropriate agent API
}
```

### Connection Testing:
```javascript
static async testConnection() {
  return {
    mainAgent: await testAgent(this.AGENT_ID),
    companionAgent: await testAgent(this.COMPANION_AGENT_ID)
  };
}
```

## 🎉 Benefits

### Specialized Intelligence:
- **Main Agent**: Optimized for service requests and task completion
- **Companion Agent**: Optimized for conversation and emotional support

### Better User Experience:
- **Contextual Responses**: Each agent responds appropriately to its domain
- **Natural Flow**: Seamless switching between service and companion modes
- **Fallback Support**: Graceful handling if one agent is unavailable

### Scalable Architecture:
- **Easy Agent Updates**: Can swap agents independently
- **Multiple Specializations**: Can add more specialized agents in the future
- **A/B Testing**: Can test different agent configurations

## 🚀 Usage Examples

### Service Requests:
- **"Book a ride to the mall"** → Main Agent → RideBookingScreen
- **"Order pizza from Pizza Hut"** → Main Agent → FoodOrderingScreen
- **"Pay my electricity bill"** → Main Agent → BillPaymentScreen

### Companion Requests:
- **"I want to chat with my companion"** → Companion Agent → VoiceCompanionScreen
- **"Talk to me about my day"** → Companion Agent → VoiceCompanionScreen
- **"I need someone to talk to"** → Companion Agent → VoiceCompanionScreen

Your Kaki app now provides the best of both worlds: **intelligent service assistance** and **empathetic companionship** through specialized AI agents! 🎤✨
