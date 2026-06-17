module.exports = function (api) {
  api.cache(true)
  return {
    // babel-preset-expo (SDK 54) automatically wires up the worklets /
    // reanimated babel plugin when react-native-reanimated is installed.
    presets: ['babel-preset-expo'],
  }
}
