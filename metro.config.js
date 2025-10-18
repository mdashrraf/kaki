const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add SVG support
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Simple alias configuration for polyfills
config.resolver.alias = {
  ...config.resolver.alias,
  'es-abstract/2024/ToIntegerOrInfinity': require.resolve('es-abstract/2024/ToIntegerOrInfinity'),
  'es-abstract/2024/Get': require.resolve('es-abstract/2024/Get'),
  'es-abstract/2024/LengthOfArrayLike': require.resolve('es-abstract/2024/LengthOfArrayLike'),
  'es-abstract/2024/ToString': require.resolve('es-abstract/2024/ToString'),
  'es-object-atoms/ToObject': require.resolve('es-object-atoms/ToObject'),
};

module.exports = config;