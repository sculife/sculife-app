import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import {
  ScrollView,
  Text,
  TextInput,
  useThemeColor,
  View,
} from '@/components/Themed';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

import Url from '@/constants/Url';
import { ApiObject, Post, PostApiObject } from '@/typings/api';
import handlePostObject from '@/utils/handlePostObject';
import useUserStore from '@/store/useUserStore';
import { useColorScheme } from '@/components/useColorScheme';
import { EditCode } from '@/constants/Code';

const FontFamilyStylesheet = `
@font-face {
  font-family: 'Your Font Family';
  font-weight: 700;
}
`;

export default function TextEditorScreen() {
  const { id, editCode } = useLocalSearchParams<{
    id: string;
    editCode: keyof typeof EditCode;
  }>();
  const theme = useColorScheme() ?? 'light';
  const navigation = useNavigation();
  const richTextRef = useRef<RichEditor>(null);
  const backgroundColor = useThemeColor(
    {
      light: '#fff',
      dark: '#404040',
    },
    'background'
  );
  const fontColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor(
    {
      light: '#333',
      dark: '#ccc',
    },
    'tabIconDefault'
  );
  const selectedIconColor = '#2095F2';
  const token = useUserStore((state) => state.token);
  const defaultPost = {
    postId: '',
    authorUid: '',
    title: 'Editing...',
    content: 'Loading....',
    pinned: false,
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
    departmentId: null,
    author: null,
    department: null,
  };
  const [post, setPost] = useState<Post>(defaultPost);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [editorText, setEditorText] = useState('');
  const [title, setTitle] = useState('');
  const [pinned, setPinned] = useState(false);

  const updateEditorText = async () => {
    if (!editorText || !title) return;
    console.log(post.postId, editorText);
    console.log(NodeHtmlMarkdown.translate(editorText));

    try {
      const res = await axios.put(
        `${Url.BASE_URL}/api/posts/${post.postId}`,
        {
          title,
          // TODO: axios post update pinned
          // pinned,
          content: editorText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = res.data as ApiObject<PostApiObject>;

      console.log('new post data [' + post.postId + ']:');
      console.log(data);
      Alert.alert(
        'Post is updated!',
        `Title: ${data.title}\nUpdated At. ${data.updatedAt}\nGo back and refresh the page!`
      );
    } catch (e) {
      console.log(e);
    }
  };

  const createEditorPost = async () => {
    if (!editorText || !title)
      return Alert.alert(
        'Create Post Failed!',
        'You cannot create a post without title or content!'
      );
    console.log(title, editorText);

    try {
      const res = await axios.post(
        `${Url.BASE_URL}/api/posts`,
        {
          title,
          content: editorText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = res.data as ApiObject<PostApiObject>;
      Alert.alert(
        'Create Post Success!',
        `Title: ${data.title}\nCreated At. ${data.createdAt}\nGo back and refresh the page!`
      );
    } catch (e) {
      Alert.alert(
        'Create Post Failed!',
        'Server Internal Error :(\nReport it!'
      );
    }
  };

  const saveEditorText = async () => {
    if (editCode === 'CREATE_POST') await createEditorPost();
    else if (editCode === 'EDIT_POST') await updateEditorText();
  };

  useEffect(() => {
    console.log(editCode);
  }, [editCode]);

  useEffect(() => {
    if (editCode === 'EDIT_POST') {
      navigation.setOptions({
        title:
          post.title === defaultPost.title
            ? defaultPost.title
            : 'Editing ' + post.title,
      });
      setTitle(post.title);
      setPinned(post.pinned);

      // TODO: temp
      if (richTextRef.current && editorInitialized) {
        setEditorText(post.content);
        richTextRef.current.setContentHTML(post.content);
      }
    } else if (editCode === 'CREATE_POST') {
      navigation.setOptions({
        title: 'Creating Post',
      });
      setTitle('');
      setPinned(false);

      if (richTextRef.current && editorInitialized) {
        // setEditorText(post.content);
        // richTextRef.current.setContentHTML(post.content);
      }
    }
  }, [post, editorInitialized]);

  useEffect(() => {
    if (editCode === 'EDIT_POST') {
      if (typeof id !== 'string') return;
      console.log('text editor', id);

      async function fetchData() {
        try {
          const res = await axios.get(`${Url.BASE_URL}/api/posts/${id}`, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });
          const { data } = res.data as ApiObject<PostApiObject>;
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
          setPost(defaultPost);
          return navigation.setOptions({
            title: '404 Not Found',
          });
        }
      }
      fetchData();
    } else if (editCode === 'CREATE_POST') {
    }
  }, [id]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="m-5 mb-0">
            <Text className="font-semibold text-base">Title:</Text>
          </View>
          <Text className="mx-5 font-bold text-red-600">
            You cannot use the tool bar to control this section
          </Text>
          <View
            style={{ height: Dimensions.get('window').height * 0.07 }}
            className="mx-5 rounded-xl"
            darkColor="#404040"
            lightColor="#f5f5f5"
          >
            <TextInput
              placeholder="Edit title...."
              className="flex-1 mx-4 ml-5 font-semibold"
              onChangeText={(t) => setTitle(t)}
              value={title}
            />
          </View>
          <View className="m-5 mb-3">
            <Text className="font-semibold text-base">Content:</Text>
          </View>
          <View className="m-5 mt-0 rounded-xl" style={{ backgroundColor }}>
            {/* https://github.com/wxik/react-native-rich-editor/issues/179#issuecomment-854672217 */}
            <RichEditor
              ref={richTextRef}
              pasteAsPlainText={true}
              initialFocus={false}
              disabled={false}
              onChange={setEditorText}
              editorStyle={{
                backgroundColor,
                color: fontColor,
                contentCSSText: `font-size: 16px; line-height: 24px;`,
              }}
              editorInitializedCallback={() => setEditorInitialized(true)}
              scrollEnabled={true}
              className="rounded-xl"
              placeholder="Edit content...."
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <RichToolbar
        editor={richTextRef}
        actions={[
          actions.undo,
          actions.redo,
          'SAVE_CONTENT',
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.insertLink,
        ]}
        iconMap={{
          SAVE_CONTENT: ({
            iconSize,
            tintColor,
          }: {
            iconSize: number;
            tintColor: string;
          }) => (
            <FontAwesome
              name={editCode === 'CREATE_POST' ? 'paper-plane-o' : 'save'}
              size={iconSize}
              style={{ color: tintColor }}
            />
          ),
        }}
        SAVE_CONTENT={saveEditorText}
        style={{
          backgroundColor,
        }}
        iconTint={iconColor}
        selectedIconTint={selectedIconColor}
        disabledIconTint={iconColor}
      />
    </SafeAreaView>
  );
}

// const RobotoStylesheet = `
//   @font-face {
//     font-family: 'Roboto';
//     font-style: normal;
//     font-weight: 400;
//     src: url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu72xKKTU1Kvnz.woff2) format('woff2');
//   }`;

// const editorStyle = {
//   initialCSSText: `${RobotoStylesheet}`,
//   contentCSSText: "font-family: 'Roboto'; font-size: 15px;",
// }

// <RichEditor
//     ...
//   editorStyle={editorStyle}
// />
