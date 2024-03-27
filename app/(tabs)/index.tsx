import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Tab One</Text>
      <View
        className="my-[30px] h-[1px] w-[80%]"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>测试123</Text>
    </View>
  );
}
