import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';

import { useColorScheme } from '@/components/useColorScheme';
import { useStorageState } from '@/store/useStorageState';
import useUserStore from '@/store/useUserStore';
import Url from '@/constants/Url';
import { ApiObject, UserLoginApiObject } from '@/typings/api';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [[isLoading, session]] = useStorageState('session');
  const { setToken, setPermissions, setUid } = useUserStore((state) => state);

  useEffect(() => {
    if (isLoading) return;

    try {
      if (!session) throw new Error('#>Invalid Session');
      console.log('session:', session);
      let user = JSON.parse(session);
      if (!user.token) throw new Error('#>Invalid Token');
      setToken(user.token);
      verifyUser();
      if (!user.permissions) throw new Error('#>Invalid Permissions');
      setPermissions(user.permissions);
      if (!user.uid) throw new Error('#>Invalid Uid');
      setUid(user.uid);

      async function verifyUser() {
        const res = await axios.post(
          `${Url.BASE_URL}/api/users/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        let { data } = res.data as ApiObject<UserLoginApiObject>;
      }
    } catch (e) {
      console.log(e);
      console.log('session: JSON parse error');
      router.replace('/login');
    }
  }, [isLoading, session]);

  // todo: loading screen
  if (isLoading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: '主页' }} // title for navigation
        />
        <Stack.Screen name="(post)/[id]" options={{ animation: 'ios' }} />
        <Stack.Screen
          name="(post)/(edit)/[id]"
          options={{ animation: 'ios' }}
        />
        <Stack.Screen
          name="(post)/(edit)/(editor)/[id]"
          options={{ animation: 'ios', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="search"
          options={{ animation: 'ios', title: '搜索' }}
        />
        <Stack.Screen
          name="resultEditor"
          options={{ animation: 'ios', title: '编辑成绩' }}
        />
        <Stack.Screen
          name="login"
          options={{ animation: 'ios', headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
