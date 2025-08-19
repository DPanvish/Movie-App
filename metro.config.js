// Generate this file using below command
// npx expo customize metro.config.js

// The below code is copied from nativewind docs

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Change the input path
module.exports = withNativeWind(config, { input: './app/globals.css' });