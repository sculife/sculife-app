import { useThemeColor } from '@/components/Themed';
import { StyleSheet } from 'react-native';

// https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js
const markdownStyles = StyleSheet.create({
  body: {
    color: useThemeColor({}, 'text'),
    lineHeight: 24,
  },
  text: {
    fontWeight: 500,
    fontSize: 16,
  },
  paragraph: {
    fontWeight: 500,
    fontSize: 16,
  },
  strong: {
    fontWeight: 800,
  },
});

export default markdownStyles;
