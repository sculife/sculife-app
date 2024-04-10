const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  ios: {
    linkBlue: '#007AFF',
  },
  zinc: {
    '800+100': 'rgb(139 139 142)',
    '800+150': 'rgb(189 189 192)',
  },
  // gold: "#DDA73C", // backup color
  // g: "#4B5563" // backup color
} as const;
