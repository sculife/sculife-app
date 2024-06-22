import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { ScrollView, Text, View } from '@/components/Themed';

import announcements from '@/assets/fakes/announcements.json';
import { Post } from '@/typings/api';

export default function AnnouncementView() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    let found = announcements.find(
      (announcement) => announcement.postId === id
    );
    setPost(found);
    if (!found) {
      return navigation.setOptions({
        title: '404 Not Found',
      });
    }
    navigation.setOptions({
      title: found.title,
    });
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
            {/* TODO: test */}
            <View className="mt-10 items-center justify-center">
              <Text className="text-center font-bold text-3xl">
                Post Not Found
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* department */}
            <View className="ml-5 mt-3">
              <Text className="font-bold text-base">
                FROM: <Text className=" text-gray-300">{post.departmentName}</Text>
              </Text>
            </View>

            {/* title */}
            <View className="m-5 mt-3">
              <Text className="font-bold text-2xl">{post.title}</Text>
            </View>

            {/* content */}
            <View className="m-5 mt-0">
              <Text className="font-semibold text-base">{post.content}</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
