# Node.js Setup Guide

This project requires Node.js version 20 for optimal compatibility with React Native and Expo dependencies.

## Quick Setup

### Using the Setup Script
```bash
./scripts/setup-node.sh
```

### Manual Setup
```bash
# Install Node.js 20 using nvm
nvm install 20

# Switch to Node.js 20
nvm use 20

# Install dependencies
npm install
```

## Version Requirements

- **Node.js**: 20.19.4 or higher
- **npm**: 10.8.2 or higher
- **React**: 19.1.0 (compatible with React Native 0.81.4)
- **React Native**: 0.81.4

## .nvmrc File

The project includes a `.nvmrc` file that specifies Node.js version 20.19.4. This ensures consistent Node version across different environments.

### Using .nvmrc
```bash
# Automatically use the version specified in .nvmrc
nvm use

# Or specify the file explicitly
nvm use .nvmrc
```

## Verification

Check your current Node version:
```bash
node --version
npm --version
```

Expected output:
```
v20.19.4
10.8.2
```

## Troubleshooting

### Engine Version Warnings
If you see warnings about unsupported Node versions, ensure you're using Node 20:
```bash
nvm use 20
```

### Dependency Issues
If you encounter dependency conflicts:
```bash
rm -rf node_modules package-lock.json
nvm use 20
npm install
```

### Expo Compatibility
For Expo projects, use the Expo CLI to manage dependencies:
```bash
npx expo install --fix
```

## Benefits of Node 20

- ✅ Resolves React Native engine compatibility warnings
- ✅ Better performance and security updates
- ✅ Full compatibility with Metro bundler
- ✅ Improved TypeScript support
- ✅ Better memory management for large React Native apps
