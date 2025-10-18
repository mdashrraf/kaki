// Figma Import Utilities
// This file contains helper functions for converting Figma designs to React Native components

/**
 * Convert Figma color values to React Native format
 * @param {string} figmaColor - Color from Figma (e.g., "#FF0000" or "rgba(255,0,0,1)")
 * @returns {string} React Native compatible color
 */
export const convertFigmaColor = (figmaColor) => {
  if (!figmaColor) return '#000000';
  
  // Handle hex colors
  if (figmaColor.startsWith('#')) {
    return figmaColor;
  }
  
  // Handle rgba colors
  if (figmaColor.startsWith('rgba')) {
    return figmaColor;
  }
  
  // Handle rgb colors
  if (figmaColor.startsWith('rgb')) {
    return figmaColor.replace('rgb', 'rgba').replace(')', ',1)');
  }
  
  return figmaColor;
};

/**
 * Convert Figma spacing values to React Native
 * @param {number} figmaSpacing - Spacing value from Figma
 * @returns {number} React Native spacing value
 */
export const convertFigmaSpacing = (figmaSpacing) => {
  return figmaSpacing || 0;
};

/**
 * Convert Figma font sizes to React Native
 * @param {number} figmaFontSize - Font size from Figma
 * @returns {number} React Native font size
 */
export const convertFigmaFontSize = (figmaFontSize) => {
  return figmaFontSize || 16;
};

/**
 * Convert Figma border radius to React Native
 * @param {number} figmaRadius - Border radius from Figma
 * @returns {number} React Native border radius
 */
export const convertFigmaBorderRadius = (figmaRadius) => {
  return figmaRadius || 0;
};

/**
 * Generate component props from Figma design tokens
 * @param {Object} figmaTokens - Design tokens from Figma
 * @returns {Object} React Native style props
 */
export const generateStyleProps = (figmaTokens) => {
  return {
    backgroundColor: convertFigmaColor(figmaTokens.backgroundColor),
    borderRadius: convertFigmaBorderRadius(figmaTokens.borderRadius),
    padding: convertFigmaSpacing(figmaTokens.padding),
    margin: convertFigmaSpacing(figmaTokens.margin),
    fontSize: convertFigmaFontSize(figmaTokens.fontSize),
    color: convertFigmaColor(figmaTokens.color),
  };
};
