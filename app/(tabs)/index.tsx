import { Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

import { View, Text, ScrollView } from '@/components/Themed';
import AnnouncementCardView from '@/components/AnnouncementCardView';
import handleText from '@/utils/handleText';

import announcements from '@/assets/fakes/announcements.json';

export default function TabOneScreen() {
  const router = useRouter();

  const PinnedPost = () => {
    let post = announcements.find((ann) => ann.pinned);
    if (!post) return;
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/(announcement)/${post.postId}`);
        }}
      >
        <View className="m-7 p-4 bg-[#222] rounded-2xl">
          <Text className="pl-2 pb-2 text-xl font-black">置顶资讯</Text>
          <View className="flex-row items-center bg-[#222]">
            <View className="px-3 bg-[#222]">
              <FontAwesome6 name="newspaper" light size={40} color="gray" />
            </View>
            <View className="pl-3 flex-1 bg-[#222]">
              <Text>{handleText(post.content)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <SafeAreaView>
        {/* 置顶资讯 */}
        <PinnedPost />

        <Text className="mx-7 font-black text-2xl">最新公告</Text>
        {/* Newest Posts */}
        {announcements.map((announcement, i) => (
          <View key={i} className="mx-7 my-2">
            <TouchableOpacity
              onPress={() => {
                router.push(`/(announcement)/${announcement.postId}`);
              }}
            >
              <AnnouncementCardView
                title={announcement.title}
                content={announcement.content}
                authorName={announcement.author}
                time={announcement.timestamp}
              />
            </TouchableOpacity>
          </View>
        ))}

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </SafeAreaView>
    </ScrollView>
  );
}
