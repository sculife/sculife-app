import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { ScrollView, Text, View } from '@/components/Themed';

import {
  ApiObject,
  Post,
  PostApiObject,
} from '@/typings/api';
import axios from 'axios';
import Url from '@/constants/Url';
import handlePostObject from '@/utils/handlePostObject';
import handleTime from '@/utils/handleTime';
import useUserStore from '@/store/useUserStore';

export default function PostsView() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const token = useUserStore((state) => state.token);
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

  useEffect(() => {
    async function fetchData() {
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
    fetchData();
  }, [id]);

  return (
    <ScrollView>
      <Image
        source={require('@/assets/images/bg-images/pexels-lil-artsy-1213447.jpg')}
        // className="aspect-square"
        contentFit="cover"
        style={{ height: Dimensions.get('window').height * 0.2 }}
      />
      <View className="mt-[-10px] rounded-xl border-t-[10px]">
        {!post ? (
          <>
            <View className="mt-10 items-center justify-center">
              <Text className="text-center font-bold text-3xl">
                Post Not Found
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* author */}
            <View className="ml-5 mt-3">
              <Text className="font-bold text-base">
                By.{' '}
                <Text className="text-gray-300">
                  {post.author ? post.author.name : 'Author Not Found'}
                </Text>
              </Text>
              {post.department ? (
                <Text className="font-bold text-base">
                  By.{' '}
                  <Text className="text-gray-300">{post.department.name}</Text>
                </Text>
              ) : (
                <View></View>
              )}
            </View>

            {/* title */}
            <View className="m-5 mt-3">
              <Text className="font-bold text-2xl">{post.title}</Text>
            </View>

            {/* content */}
            <View className="m-5 mt-0">
              <Text className="font-semibold text-base">{post.content}</Text>
            </View>

            {/* department */}
            <View className="flex-row justify-end items-center">
              <View className="mr-5 mt-3 mb-5">
                <Text className="font-bold text-base">
                  <Text className="text-gray-300">
                    {handleTime(post.updatedAt)}
                  </Text>
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
