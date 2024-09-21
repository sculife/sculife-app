import { useEffect, useState } from 'react';
import { Image } from 'expo-image';

import { Text, View } from '@/components/Themed';
import { useStorageState } from '@/store/useStorageState';
import { UserLoginApiObject } from '@/typings/api';
import handleText from '@/utils/handleText';

export default function UserInfoScreen() {
  const [[, session]] = useStorageState('session');
  const [user, setUser] = useState<UserLoginApiObject | null>(null);

  useEffect(() => {
    try {
      let usr = JSON.parse(session!);
      setUser(usr);
    } catch (e) {
      console.log('userInfo session parsed error');
    }
  }, [session]);

  return (
    <View className="absolute top-14">
      <View className="flex-row justify-between items-center w-full">
        <View className="m-7 flex-row items-center">
          <Image
            source={require('@/assets/images/avatar.jpg')}
            className="rounded-lg"
            style={{ width: 80, height: 80 }}
          />
          <View className="ml-5">
            <Text className="font-bold text-xl">
              {user ? handleText(user.name, 15) : 'loading....'}
            </Text>
            <Text className="font-semibold text-xs">
              {user ? handleText(user.cname, 15) : 'loading....'}
            </Text>
            <Text className="font-semibold text-xs">
              {user ? user.class : 'loading....'}
            </Text>
            <Text className="font-semibold text-xs">
              {user ? user.id : 'loading....'}
            </Text>
          </View>
        </View>
        {/* TODO: maybe allow user edit? */}
        {/* <View className="mr-10">
          <FontAwesome name="edit" size={20} color="white" />
        </View> */}
      </View>

      <View className="m-7">
        <Text>考虑增加的功能</Text>
        <Text>{`=>   `}没有其他的了？来点建议！</Text>
      </View>
      <View className="m-7">
        <Text>正在处理的功能</Text>
        <Text>{`=>   `}创建文章</Text>
        <Text>{`=>   `}文章排版</Text>
        <Text>{`=>   `}三语 (需要翻译支持)</Text>
      </View>
      <View className="m-7">
        <Text>思考去留的功能</Text>
        <Text>{`=>   `}管理个人可管理信息</Text>
        <Text>{`=>   `}InformationScreen</Text>
        <Text>{`=>   `}MsgScreen</Text>
        <Text>{`=>   `}头像</Text>
      </View>
      <View className="m-7">
        <Text>已拥有功能</Text>
        <Text>{`=>   `}公告</Text>
        <Text>{`   =>   `}查看公告</Text>
        <Text>{`   =>   `}搜索公告</Text>
        <Text>{`=>   `}查看个人信息</Text>
        <Text>{`=>   `}查看个人成绩</Text>
      </View>
    </View>
  );
}
