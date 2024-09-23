import Markdown from 'react-native-markdown-display';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { Text, View } from './Themed';
import markdownStyles from '@/styles/markdown';
import handleTime from '@/utils/handleTime';
import { Post } from '@/typings/api';

export default function PostView({ post }: { post: Post | undefined }) {
  return (
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
            <Markdown style={markdownStyles}>
              {NodeHtmlMarkdown.translate(post.content)}
            </Markdown>
          </View>

          {/* time */}
          <View className="flex-row justify-end items-center">
            <View className="mr-5 mt-3 mb-5">
              <Text className="font-bold text-base text-right text-gray-300">
                Created. {handleTime(post.createdAt)}
              </Text>
              <Text className="font-bold text-base text-right text-gray-300">
                Updated. {handleTime(post.updatedAt)}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
