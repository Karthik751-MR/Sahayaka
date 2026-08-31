// babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // This new line is the critical addition
    plugins: ["react-native-reanimated/plugin"],
  };
};
