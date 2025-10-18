import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Sample component template for Figma imports
 * Replace this with your actual Figma component
 */
const SampleComponent = ({ 
  title = "Sample Component",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  borderRadius = 8,
  padding = 16,
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor,
          borderRadius,
          padding,
        }
      ]}
      {...props}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SampleComponent;
