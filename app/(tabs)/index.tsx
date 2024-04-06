import {
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

import { View, Text, ScrollView } from '@/components/Themed';
import AnnouncementCardView from '@/components/AnnouncementCardView';
import handleText from '@/utils/handleText';

import announcement from '@/assets/fakes/announcement.json';

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <ScrollView
    // onScroll={(event) => {
    //   const yOffset = event.nativeEvent.contentOffset.y;
    //   if (yOffset > 10) {
    //     navigation.setOptions({ headerShown: false });
    //   } else {
    //     navigation.setOptions({ headerShown: true });
    //   }
    // }}
    >
      <SafeAreaView>
        {/* header */}
        {/* <View className="flex-row items-center justify-between min-w-max p-2 px-4"> */}
        {/* <Text className="text-xl">探索</Text> */}
        {/* <Text className="text-xl">探索</Text>
          <FontAwesome name="search" size={25} color="white" />
        </View> */}
        {/* <View
          className="my-[30px] h-[1px] w-[80%]"
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        /> */}

        {/* 置顶资讯 */}
        <TouchableOpacity
          onPress={() => {
            router.push(`/(announcement)/1`);
          }}
        >
          <View className="m-7 p-4 bg-[#222] rounded-2xl">
            <Text className="pl-2 pb-2 text-xl font-black">置顶资讯</Text>
            <View className="flex-row items-center bg-[#222]">
              <View className="px-3 bg-[#222]">
                <FontAwesome6 name="newspaper" light size={40} color="gray" />
              </View>
              <View className="pl-3 flex-1 bg-[#222]">
                <Text>{handleText(announcement.pinned.content)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <Text className="mx-7 font-black text-2xl">最新公告</Text>
        {/* Newest Posts */}
        {Array.from({ length: 5 }, (_, i) => (
          <View key={i} className="mx-7 my-2">
            <TouchableOpacity
              onPress={() => {
                router.push(`/(announcement)/${i}`);
              }}
            >
              <AnnouncementCardView
                title={announcement.title}
                content={announcement.content}
                authorName={announcement.author}
                time={2}
              />
            </TouchableOpacity>
          </View>
        ))}

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </SafeAreaView>
    </ScrollView>
  );
}
