import handleText from '@/utils/handleText';
import { Text, View } from './Themed';

export default function AnnouncementCardView({
  authorName,
  content,
  title,
  time,
}: {
  authorName: string;
  content: string;
  title: string;
  time: number;
}) {
  const handleTime = (time: number) => {
    return '7小时前';
  };
  return (
    <View className="bg-[#222] rounded-2xl px-5 py-3">
      {/* title */}
      <Text className="font-semibold text-xl">{handleText(title, 25)}</Text>
      {/* content */}
      <Text className="pb-4 pt-0" style={{ fontSize: 12 }}>
        {handleText(content, 100)}
      </Text>
      {/* tags */}
      <View className="bg-[#222]">
        {/* TODO: should i need this? */}
        <Text className="font-medium">Important Announcements</Text>
      </View>
      {/* post info */}
      <View className="bg-[#222] flex-row justify-between">
        {/* author */}
        <View className="bg-[#222]">
          <Text className="font-bold text-gray-300">
            {handleText(authorName, 25)}
          </Text>
        </View>
        {/* time */}
        <Text className="font-bold">{handleTime(time)}</Text>
      </View>
    </View>
  );
}
