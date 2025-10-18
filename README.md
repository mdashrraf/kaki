# Figma to React Native Expo Import Guide

This project is set up to easily import and convert Figma designs into React Native components.

## 🚀 Quick Start

1. **Run the app:**
   ```bash
   npm start
   ```

2. **Open on device:**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal

## 📱 Importing Figma Designs

### Method 1: Manual Export (Recommended for one-time imports)

1. **Export assets from Figma:**
   - Select your component/design in Figma
   - Right-click → "Export" or use Export panel
   - Choose format: SVG for icons, PNG/JPG for images
   - Export at 2x or 3x resolution for better quality

2. **Save assets:**
   - Icons: Save to `src/assets/icons/`
   - Images: Save to `src/assets/images/`

3. **Create React Native component:**
   ```jsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { SvgXml } from 'react-native-svg';
   
   // Import your SVG
   import iconSvg from '../assets/icons/my-icon.svg';
   
   const MyComponent = () => {
     return (
       <View style={styles.container}>
         <SvgXml xml={iconSvg} width="24" height="24" />
         <Text style={styles.text}>My Component</Text>
       </View>
     );
   };
   ```

### Method 2: Using Figma Tokens (For design systems)

1. **Install Figma Tokens plugin:**
   - Install "Figma Tokens" plugin in Figma
   - Define your design tokens (colors, spacing, typography)

2. **Export tokens:**
   - Export as JSON format
   - Save to `src/design-tokens/`

3. **Use tokens in components:**
   ```jsx
   import { generateStyleProps } from '../utils/figmaUtils';
   
   const styles = StyleSheet.create({
     container: generateStyleProps({
       backgroundColor: '#ffffff',
       borderRadius: 8,
       padding: 16,
     }),
   });
   ```

## 📁 Project Structure

```
src/
├── components/          # React Native components
│   └── SampleComponent.js
├── assets/
│   ├── icons/          # SVG icons from Figma
│   └── images/         # PNG/JPG images from Figma
├── screens/            # App screens
├── utils/
│   └── figmaUtils.js   # Helper functions for Figma conversion
└── design-tokens/      # Design system tokens (optional)
```

## 🛠️ Available Tools

- **SVG Support**: Configured with `react-native-svg-transformer`
- **Vector Icons**: `@expo/vector-icons` for additional icons
- **Safe Areas**: `react-native-safe-area-context` for device compatibility
- **Screens**: `react-native-screens` for navigation

## 📝 Best Practices

1. **Naming Convention:**
   - Use PascalCase for components: `MyButton.js`
   - Use camelCase for files: `myIcon.svg`

2. **Component Structure:**
   - Keep components small and focused
   - Use props for customization
   - Follow React Native styling patterns

3. **Asset Optimization:**
   - Use SVG for icons (scalable)
   - Use PNG for complex images
   - Export at appropriate resolutions (2x, 3x)

4. **Performance:**
   - Lazy load heavy components
   - Optimize images before importing
   - Use StyleSheet.create() for styles

## 🔧 Troubleshooting

- **SVG not loading**: Check metro.config.js configuration
- **Styling issues**: Verify StyleSheet syntax
- **Build errors**: Clear Metro cache with `npx expo start --clear`

## 📚 Next Steps

1. Import your Figma designs using the methods above
2. Create reusable components
3. Set up navigation if needed
4. Add state management (Redux, Context, etc.)
5. Implement your app logic

Happy coding! 🎉
