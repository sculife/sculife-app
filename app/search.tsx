import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, TouchableOpacity } from 'react-native';

import { ScrollView, Text, TextInput, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import AnnouncementCardView from '@/components/AnnouncementCardView';

import announcement from '@/assets/fakes/announcement.json';
import { useRouter } from 'expo-router';

export default function SearchModalScreen() {
  const router = useRouter();

  const [pressed, setPressed] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('赶快来搜索东西吧！');
  const [searchResult, setSearchResult] = useState<any[]>([]);

  const search = () => {
    try {
      // TODO: backend
      let arr = announcement.content.match(new RegExp(searchText, 'i'));
      if (!arr) throw new Error();
      setSearchError('');
      setSearchResult(new Array(10).fill(0));
    } catch (e) {
      setSearchError('搜索失败，无此内容，请再尝试吧！');
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold mt-5">Search For Fun</Text>
        <View className="w-[100%] flex-row items-center justify-center">
          <TextInput
            className="bg-zinc-800 text-white w-[80%] m-5 mx-0 ml-2 py-3 px-5 rounded-md"
            placeholder="Search (REGEXP)"
            placeholderTextColor={Colors.zinc['800+150']}
            onSubmitEditing={search}
            onChangeText={(text) => setSearchText(text)}
          />
          <Pressable
            className="ml-3"
            onPress={search}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
          >
            <FontAwesome
              name="search"
              size={25}
              color={Colors.zinc['800+100']}
              style={{ opacity: pressed ? 0.5 : 1 }}
            />
          </Pressable>
        </View>
        <View
          className="my-5 h-[1px] w-[80%]"
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {searchError ? (
          <View>
            <Text>{searchError}</Text>
          </View>
        ) : (
          searchResult.map((_, i) => (
            <View key={i} className="mx-7 my-2">
              <TouchableOpacity
                onPress={() => {
                  router.push(`/(announcement)/${i}`);
                }}
              >
                {/* TODO: backend */}
                <AnnouncementCardView
                  title={announcement.title}
                  content={announcement.content}
                  authorName={announcement.author}
                  time={i}
                />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </ScrollView>
  );
}
