import { useEffect, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

import { View, Text, ScrollView, useThemeColor } from '@/components/Themed';
import PostCardView from '@/components/PostCardView';
import handleText from '@/utils/handleText';

import { ApiObject, Post, PostApiResponseBody } from '@/typings/api';
import url from '@/constants/Url';
import handlePostObject from '@/utils/handlePostObject';
import useUserStore from '@/store/useUserStore';
import { wait } from '@/utils/wait';

export default function TabOneScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'tint');
  const token = useUserStore((state) => state.token);

  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    try {
      const res = await axios.get(url.BASE_URL + '/api/posts/', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          limit: 20,
        },
      });
      const { data: posts } = res.data as ApiObject<PostApiResponseBody>;
      // console.log('(tabs)/index: ', posts);

      // todo: handle data
      let promises = posts.map((p) => handlePostObject(p, token));
      let postsObject = await Promise.allSettled(promises);
      setPosts(
        postsObject.filter((p) => p.status === 'fulfilled').map((p) => p.value)
      );
    } catch (e) {
      console.log('(tabs)/index [axios error]:', e);
    }
  }

  const onRefresh = async () => {
    console.log('refreshing (tabs)/index');
    setRefreshing(true);
    fetchData();
    await wait(1000);
    setRefreshing(false);
    console.log('stop refreshing');
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const PinnedPost = () => {
    let post = posts.find((p) => p.pinned);
    if (!post) return;
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/(post)/${post.postId}`);
        }}
      >
        <View className="m-7 p-4 bg-[#222] rounded-2xl">
          <Text className="pl-2 pb-2 text-xl font-black">置顶资讯</Text>
          <View className="flex-row items-center bg-[#222]">
            <View className="px-3 bg-[#222]">
              <FontAwesome6 name="newspaper" light size={40} color="gray" />
            </View>
            <View className="pl-3 flex-1 bg-[#222]">
              <Text>{handleText(post.title, 30)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={iconColor}
            colors={[iconColor]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* 置顶资讯 */}
        <PinnedPost />

        <Text className="mx-7 font-black text-2xl">最新公告</Text>
        {/* Newest Posts */}
        {posts.map((post, i) => (
          <View key={i} className="mx-7 my-2">
            <TouchableOpacity
              onPress={() => {
                router.push(`/(post)/${post.postId}`);
              }}
            >
              <PostCardView
                title={post.title}
                content={post.content}
                author={post.author}
                time={post.updatedAt}
              />
            </TouchableOpacity>
          </View>
        ))}

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </ScrollView>
    </SafeAreaView>
  );
}
