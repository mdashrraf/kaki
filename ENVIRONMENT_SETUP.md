# 🔐 Environment Configuration Guide

## 📁 Files Created

### 1. `.env` - Environment Variables (Local)
Contains your actual API keys and configuration:
- **Supabase**: Database URL and anonymous key
- **ElevenLabs**: API key and agent ID
- **App**: Name, version, and environment settings

### 2. `.env.example` - Template File
Template for other developers to create their own `.env` file

### 3. `eas.json` - Expo Application Services Configuration
- **Development builds**: For testing
- **Preview builds**: For internal distribution
- **Production builds**: For app store submission

### 4. `babel.config.js` - Babel Configuration
Updated to support environment variable loading with `react-native-dotenv`

## 🔧 Setup Instructions

### For Development:
1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your API keys** in `.env`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_actual_key_here
   ELEVENLABS_API_KEY=your_actual_key_here
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development**:
   ```bash
   npm start
   ```

### For Production Builds:
1. **Set environment variables** in EAS:
   ```bash
   eas build --platform ios --profile production
   ```

2. **Environment variables** are automatically injected during build

## 🔒 Security Best Practices

### ✅ What's Secure:
- **`.env` file**: Added to `.gitignore` (not committed)
- **API keys**: Stored in environment variables
- **Fallback values**: Hardcoded for development only

### ⚠️ Important Notes:
- **Never commit** `.env` file to version control
- **Use different keys** for development/production
- **Rotate API keys** regularly
- **Use EAS secrets** for production builds

## 🚀 Environment Variables Used

### Supabase Configuration:
```javascript
SUPABASE_URL=https://dnwzlsgpiztwyrajnnms.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ElevenLabs Configuration:
```javascript
ELEVENLABS_API_KEY=sk_d36b1447eff28551002fb3d641123db1ebcc0f2f6ccba9a0
ELEVENLABS_AGENT_ID=agent_8601k7tybe14e16tf75gmjdede86
ELEVENLABS_BASE_URL=https://api.elevenlabs.io/v1
```

### App Configuration:
```javascript
APP_NAME=Kaki
APP_VERSION=1.0.0
APP_ENVIRONMENT=development
```

## 📱 Build Profiles

### Development:
- **Development client**: For testing
- **Internal distribution**: Team testing
- **Environment**: `development`

### Preview:
- **Internal distribution**: Stakeholder testing
- **Environment**: `preview`

### Production:
- **App store builds**: Public release
- **Environment**: `production`

## 🔄 Usage in Code

### Import Environment Variables:
```javascript
import { SUPABASE_URL, ELEVENLABS_API_KEY } from '@env';
```

### Use in Services:
```javascript
// Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'fallback_url';

// ElevenLabs
const apiKey = process.env.ELEVENLABS_API_KEY || 'fallback_key';
```

## 🎯 Next Steps

1. **Test environment loading**: Verify variables are loaded correctly
2. **Set up EAS secrets**: For production builds
3. **Configure CI/CD**: For automated deployments
4. **Monitor API usage**: Track key usage and limits

Your Kaki app is now properly configured with secure environment variable management! 🔐✨
