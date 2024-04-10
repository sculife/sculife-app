import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { Text, View } from '@/components/Themed';
import user from '@/assets/fakes/user.json';

export default function UserInfoScreen() {
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
            <Text className="font-bold text-3xl">{user.name}</Text>
            <Text className="font-semibold">{user.cname}</Text>
            <Text className="font-semibold">{user.class}</Text>
            <Text className="font-semibold">{user.id}</Text>
          </View>
        </View>
        <View className="mr-10">
          <FontAwesome name="edit" size={20} color="white" />
        </View>
      </View>

      <View className="m-7">
        <Text>考虑增加的功能</Text>
        <Text>{`=>   `}没有其他的了？来点建议！</Text>
      </View>
      <View className="m-7">
        <Text>正在处理的功能</Text>
        <Text>{`=>   `}管理个人可管理信息</Text>
        <Text>{`=>   `}创建文章</Text>
        <Text>{`=>   `}文章排版</Text>
        <Text>{`=>   `}三语 (需要翻译支持)</Text>
      </View>
      <View className="m-7">
        <Text>思考去留的功能</Text>
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
