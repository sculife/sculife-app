import { useEffect } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { ScrollView, Text, View } from '@/components/Themed';

import announcement from '@/assets/fakes/announcement.json';

export default function AnnouncementView() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: announcement.title,
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
        {/* department */}
        <View className="ml-5 mt-3">
          <Text className="font-bold text-base">
            FROM: <Text className=' text-gray-300'>{announcement.department}</Text>
          </Text>
        </View>


        {/* title */}
        <View className="m-5 mt-3">
          <Text className="font-bold text-2xl">
            {announcement.title}
          </Text>
        </View>

        {/* content */}
        <View className="m-5 mt-0">
          <Text className="font-semibold text-base">
            {announcement.content}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
