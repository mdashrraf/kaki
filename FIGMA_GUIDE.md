# 🎨 Figma to React Native Import Guide

## 🚀 Quick Start

Your app is now ready to import Figma designs! Here's how to get started:

### Step 1: Get Your Figma Access Token

1. **Go to Figma Settings:**
   - Open Figma in your browser
   - Click on your profile picture (top right)
   - Select "Settings"

2. **Generate Access Token:**
   - Go to "Account" tab
   - Scroll down to "Personal Access Tokens"
   - Click "Create new token"
   - Give it a name (e.g., "React Native App")
   - Copy the generated token

### Step 2: Connect Your Figma File

1. **Open your Figma design file**
2. **Copy the URL** from your browser (should look like: `https://www.figma.com/file/ABC123/My-Design`)
3. **Run the app:**
   ```bash
   npm start
   ```
4. **Enter your credentials** in the app:
   - Paste your access token
   - Paste your Figma file URL
   - Click "Connect to Figma"

### Step 3: Import Components

1. **Browse available components** in the file tree
2. **Click on any component** to import it
3. **Check the console** for the generated React Native code
4. **Copy the code** and create your component file

## 📱 Using the Generated Components

### Example Generated Component:

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyButton = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Button Text</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyButton;
```

### Save Your Component:

1. **Create a new file** in `src/components/MyButton.js`
2. **Paste the generated code**
3. **Import and use** in your app:

```jsx
import MyButton from './src/components/MyButton';

// Use in your app
<MyButton />
```

## 🛠️ Advanced Features

### Customizing Imported Components

The generated components are basic templates. You can enhance them by:

1. **Adding Props:**
   ```jsx
   const MyButton = ({ title, onPress, disabled }) => {
     return (
       <TouchableOpacity 
         style={[styles.container, disabled && styles.disabled]}
         onPress={onPress}
         disabled={disabled}
       >
         <Text style={styles.text}>{title}</Text>
       </TouchableOpacity>
     );
   };
   ```

2. **Adding Animations:**
   ```jsx
   import { Animated } from 'react-native';
   
   const MyButton = () => {
     const scaleValue = new Animated.Value(1);
     
     const handlePress = () => {
       Animated.spring(scaleValue, {
         toValue: 0.95,
         duration: 100,
         useNativeDriver: true,
       }).start();
     };
     
     return (
       <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
         {/* Your component */}
       </Animated.View>
     );
   };
   ```

3. **Adding State Management:**
   ```jsx
   import { useState } from 'react';
   
   const MyButton = () => {
     const [isPressed, setIsPressed] = useState(false);
     
     return (
       <TouchableOpacity
         style={[styles.container, isPressed && styles.pressed]}
         onPressIn={() => setIsPressed(true)}
         onPressOut={() => setIsPressed(false)}
       >
         <Text style={styles.text}>Button</Text>
       </TouchableOpacity>
     );
   };
   ```

## 🎯 Best Practices

### 1. Organize Your Components
```
src/components/
├── buttons/
│   ├── PrimaryButton.js
│   └── SecondaryButton.js
├── cards/
│   └── ProductCard.js
└── inputs/
    └── TextInput.js
```

### 2. Use Design Tokens
Create a `src/design-tokens/colors.js`:
```jsx
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};
```

### 3. Create Reusable Styles
Create a `src/styles/common.js`:
```jsx
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid Access Token"**
   - Make sure you copied the token correctly
   - Check if the token has expired
   - Regenerate a new token if needed

2. **"Invalid Figma URL"**
   - Make sure the URL is from a Figma file (not a prototype)
   - The URL should contain `/file/` in it

3. **"Failed to fetch file"**
   - Check your internet connection
   - Make sure the file is public or you have access to it
   - Verify the file key in the URL

4. **Generated code not working**
   - Check the console for any syntax errors
   - Make sure all imports are correct
   - Verify the component structure

### Getting Help:

- Check the React Native documentation
- Look at the Figma API documentation
- Test with simple components first
- Use the browser's developer tools to debug

## 🎉 Next Steps

1. **Import your first component** from Figma
2. **Customize it** with props and state
3. **Create a component library** for your app
4. **Set up navigation** between screens
5. **Add animations** and interactions
6. **Test on real devices**

Happy designing! 🚀
