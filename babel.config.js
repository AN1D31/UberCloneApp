module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Este plugin tiene que ser siempre el último de la lista
  ],
};
