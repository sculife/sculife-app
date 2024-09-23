import { NodeHtmlMarkdown } from 'node-html-markdown';
import { Text, View } from './Themed';
import handleText from '@/utils/handleText';
import handleTime from '@/utils/handleTime';
import { User } from '@/typings/api';

export default function PostCardView({
  author,
  content,
  title,
  time,
}: {
  author: User | null;
  content: string;
  title: string;
  time: string;
}) {
  return (
    <View className="bg-[#222] rounded-2xl px-5 py-3">
      {/* title */}
      <Text className="font-semibold text-xl">{handleText(title, 25)}</Text>
      {/* content */}
      <Text className="pb-4 pt-0" style={{ fontSize: 12 }}>
        {handleText(NodeHtmlMarkdown.translate(content), 100)}
      </Text>
      {/* tags */}
      {/* TODO: should i need this? */}
      {/* <View className="bg-[#222]">
        <Text className="font-medium">Important Post</Text>
      </View> */}
      {/* post info */}
      <View className="bg-[#222] flex-row justify-between">
        {/* author */}
        <View className="bg-[#222]">
          <Text className="font-bold text-gray-300">
            <Text>By. </Text>
            {handleText(author?.name ?? 'Author Not Found', 25)}
          </Text>
        </View>
        {/* time */}
        <Text className="font-bold">{handleTime(time)}</Text>
      </View>
    </View>
  );
}
