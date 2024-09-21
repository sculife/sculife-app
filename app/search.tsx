import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import { Platform, Pressable, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ScrollView, Text, TextInput, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PostCardView from '@/components/PostCardView';
import Url from '@/constants/Url';
import { PostApiResponseBody } from '@/typings/api';
import handlePostObject from '@/utils/handlePostObject';
import useUserStore from '@/store/useUserStore';

export default function SearchModalScreen() {
  const router = useRouter();
  const token = useUserStore((state) => state.token);

  const [pressed, setPressed] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('赶快来搜索东西吧！');
  const [searchResult, setSearchResult] = useState<any[]>([]);

  const search = async () => {
    try {
      // let arr = posts.filter((post) =>
      //   post.content.match(new RegExp(searchText, 'i'))
      // );
      const res = await axios.get(`${Url.BASE_URL}/api/posts/search`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          q: searchText,
        },
      });

      const { data: posts } = res.data as { data: PostApiResponseBody };
      // console.log('(tabs)/index: ', posts);

      let promises = posts.map((p) => handlePostObject(p, token));
      let postsObject = await Promise.allSettled(promises);
      setSearchError('');
      setSearchResult(
        postsObject.filter((p) => p.status === 'fulfilled').map((p) => p.value)
      );
    } catch (e) {
      console.log(e);
      // todo: translate
      setSearchError('搜索失败，无此内容，请再尝试吧！');
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold mt-5">Search</Text>
        <View className="w-[100%] flex-row items-center justify-center">
          <TextInput
            className="bg-zinc-800 text-white w-[80%] m-5 mx-0 ml-2 py-3 px-5 rounded-md"
            placeholder="Search"
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
          className="my-5 mt-3 h-[1px] w-[90%]"
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.3)"
        />

        {searchResult.length === 0 && (
          <View>
            <Text>没有找到您要的东西</Text>
          </View>
        )}

        {searchError ? (
          <View>
            <Text>{searchError}</Text>
          </View>
        ) : (
          searchResult.map((post, i) => (
            // TODO: maybe shouldn't set w-[90%]
            <View key={i} className="mx-7 my-2 w-[90%]">
              <TouchableOpacity
                onPress={() => {
                  router.push(`/(post)/${post.postId}`);
                }}
                className="w-[100%]"
              >
                {/* TODO: backend */}
                <PostCardView
                  title={post.title}
                  content={post.content}
                  author={post.author}
                  time={post.updatedAt}
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
