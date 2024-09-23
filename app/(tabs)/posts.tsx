import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import PostCardView from '@/components/PostCardView';
import { ScrollView, View } from '@/components/Themed';
import { EditCode } from '@/constants/Code';
import Colors from '@/constants/Colors';
import Url from '@/constants/Url';
import useUserStore from '@/store/useUserStore';
import handlePostObject from '@/utils/handlePostObject';
import { Octicons } from '@expo/vector-icons';
import { ApiObject, Post, PostApiResponseBody } from '@/typings/api';

export default function PostsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { uid, token } = useUserStore();
  const [posts, setPosts] = useState<Post[]>([]);

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
        postsObject.filter((p) => p.status === 'fulfilled').map((p) => p.value)
      );
    } catch (e) {
      console.log(e);
    }
  }

  const createPost = () => {
    router.push(`/(post)/(edit)/(editor)/NO?editCode=${EditCode.CREATE_POST}`);
  };

  useEffect(() => {
    fetchData();
  }, [uid]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={createPost}>
          {({ pressed }) => (
            <Octicons
              style={{
                marginLeft: 20,
                padding: 5,
                opacity: pressed ? 0.5 : 1,
                color: Colors.ios.linkBlue,
              }}
              name="diff-added"
              size={20}
              color={Colors.ios.linkBlue}
            />
          )}
        </Pressable>
      ),
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {posts.map((post, i) => (
          <View key={i} className="mx-7 my-2">
            <TouchableOpacity
              onPress={() => {
                router.push(`/(post)/(edit)/${post.postId}`);
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
