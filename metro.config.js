const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('db');

defaultConfig.resolver.sourceExts.push("mjs");

module.exports = defaultConfig;