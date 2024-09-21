import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { useStorageState } from '@/store/useStorageState';
import useUserStore from '@/store/useUserStore';

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
    if (!session) {
      // router.replace('/signIn');
    } else {
      console.log('session:', session);
      try {
        let user = JSON.parse(session);
        // if (!user.token) router.replace('/signIn');
        setToken(user.token);
        // if (!user.permissions) router.replace('/signIn');
        setPermissions(user.permissions);
        // if (!user.uid) router.replace('/signIn');
        setUid(user.uid);
      } catch (e) {
        console.log('session: JSON parse error');
      }
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
        <Stack.Screen
          name="(post)/[id]"
          options={{ animation: 'ios' }}
        />
        <Stack.Screen
          name="search"
          options={{ animation: 'ios', title: '搜索' }}
        />
        <Stack.Screen
          name="resultEditor"
          options={{ animation: 'ios', title: '编辑成绩' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
