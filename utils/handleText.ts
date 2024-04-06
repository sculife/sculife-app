export default function handleText(text: string, maxL = 0) {
  // text = text.slice(0, Dimensions.get('window').width / 25);
  if ((text && text.length === 1) || !text) return 'Text Not Found';
  let over = text.length > maxL;
  text = text.slice(0, maxL != 0 ? maxL : 25) + (over ? '....' : '');
  return text;
}
