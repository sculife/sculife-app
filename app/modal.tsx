import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Modal</Text>
      <View
        className="my-[30px] h-[1px] w-[80%]"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>测试123</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
