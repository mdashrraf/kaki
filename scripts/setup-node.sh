#!/bin/bash

# Setup Node.js 20 for Kaki project
echo "🚀 Setting up Node.js 20 for Kaki project..."

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "❌ nvm is not installed. Please install nvm first."
    echo "Visit: https://github.com/nvm-sh/nvm#installing-and-updating"
    exit 1
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node 20 if not already installed
if ! nvm list | grep -q "v20"; then
    echo "📦 Installing Node.js 20..."
    nvm install 20
fi

# Use Node 20
echo "🔄 Switching to Node.js 20..."
nvm use 20

# Verify Node version
echo "✅ Current Node.js version: $(node --version)"
echo "✅ Current npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete! Node.js 20 is now active for the Kaki project."
echo "💡 To switch to Node 20 in the future, run: nvm use 20"
