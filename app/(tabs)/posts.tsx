import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import axios from 'axios';

import PostCardView from '@/components/PostCardView';
import { ScrollView, useThemeColor, View } from '@/components/Themed';
import { EditCode } from '@/constants/Code';
import Colors from '@/constants/Colors';
import Url from '@/constants/Url';
import useUserStore from '@/store/useUserStore';
import handlePostObject from '@/utils/handlePostObject';
import { wait } from '@/utils/wait';
import { ApiObject, Post, PostApiResponseBody } from '@/typings/api';
import { useSession } from '@/hooks/ctx';

export default function PostsScreen() {
  const router = useRouter();
  const { session: token } = useSession();
  const navigation = useNavigation();
  const { uid } = useUserStore();
  const iconColor = useThemeColor({}, 'tint');
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
    router.push({
      pathname: `/(post)/(editor)/[id]`,
      params: {
        id: 'NO',
        editCode: EditCode.CREATE_POST,
      },
    });
  };

  const onRefresh = async () => {
    console.log('refreshing (tabs)/post');
    setRefreshing(true);
    fetchData();
    await wait(1000);
    setRefreshing(false);
    console.log('stop refreshing (tabs)/post');
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
        {posts.map((post, i) => (
          <View key={i} className="mx-7 my-2">
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/(post)/[id]',
                  params: {
                    id: post.postId,
                    canEdit: 1,
                  },
                });
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
