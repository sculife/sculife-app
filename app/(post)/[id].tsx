import { useEffect, useState } from 'react';
import { Dimensions, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';

import { ScrollView, useThemeColor } from '@/components/Themed';
import PostView from '@/components/PostView';

import Url from '@/constants/Url';
import useUserStore from '@/store/useUserStore';
import handlePostObject from '@/utils/handlePostObject';
import { wait } from '@/utils/wait';
import { ApiObject, Post, PostApiObject } from '@/typings/api';

export default function PostsView() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const token = useUserStore((state) => state.token);
  const iconColor = useThemeColor({}, 'tint');
  const [post, setPost] = useState<Post | undefined>({
    postId: '',
    authorUid: '',
    title: 'Loading',
    content: 'Loading....',
    pinned: false,
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
    departmentId: null,
    author: null,
    department: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  async function fetchPostData() {
    try {
      const res = await axios.get(`${Url.BASE_URL}/api/posts/${id}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const { data } = res.data as ApiObject<PostApiObject>;
      // console.log('(post)/[id]: ', data);
      navigation.setOptions({
        title: data.title,
      });

      try {
        let postObject = await handlePostObject(data, token);
        setPost(postObject);
      } catch (e) {
        // post object handle error
      }
    } catch (e) {
      // err: axios error
      console.log('(post)/[id].tsx', e);
      // let found = announcements.find(
      //   (post) => announcement.postId === id
      // );
      // if (!found)
      setPost(undefined);
      return navigation.setOptions({
        title: '404 Not Found',
      });
      // navigation.setOptions({
      //   title: '',
      // });
    }
  }

  const onRefresh = async () => {
    console.log('refreshing (tabs)/index');
    setRefreshing(true);
    fetchPostData();
    await wait(1000);
    setRefreshing(false);
    console.log('stop refreshing');
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  return (
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
      <Image
        source={require('@/assets/images/bg-images/pexels-lil-artsy-1213447.jpg')}
        // className="aspect-square"
        contentFit="cover"
        style={{ height: Dimensions.get('window').height * 0.2 }}
      />
      <PostView post={post} />
    </ScrollView>
  );
}
