import PostCardView from '@/components/PostCardView';
import { ScrollView, View } from '@/components/Themed';
import Url from '@/constants/Url';
import useUserStore from '@/store/useUserStore';
import { ApiObject, Post, PostApiResponseBody } from '@/typings/api';
import handlePostObject from '@/utils/handlePostObject';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, TouchableOpacity } from 'react-native';

export default function PostsScreen() {
  const router = useRouter();
  const { uid, token } = useUserStore();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${Url.BASE_URL}/api/posts/from/${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 20,
          },
        });
        const { data } = res.data as ApiObject<PostApiResponseBody>;

        // todo: handle data
        let promises = data.map((p) => handlePostObject(p, token));
        let postsObject = await Promise.allSettled(promises);
        setPosts(
          postsObject
            .filter((p) => p.status === 'fulfilled')
            .map((p) => p.value)
        );
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [uid]);

  return (
    <ScrollView>
      <SafeAreaView>
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
      </SafeAreaView>
    </ScrollView>
  );
}
