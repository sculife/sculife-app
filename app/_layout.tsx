import { useEffect, useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

import { SessionProvider, useSession } from '@/hooks/ctx';
import { useColorScheme } from '@/components/useColorScheme';
import useUserStore from '@/store/useUserStore';
import Url from '@/constants/Url';
import { ApiObject } from '@/typings/api';
import { UserDTO } from '@/typings/dtos';
import { StatusBar } from 'expo-status-bar';

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
  const { isLoading } = useSession();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const { session, isLoading, signOut } = useSession();
  const { setUid } = useUserStore((state) => state);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(Url.BASE_URL + '/api/users/@me', {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        const { data } = res.data as ApiObject<UserDTO>;
        setUid(data.uid);
        console.log(data);
      } catch (err) {
        console.error('❌ Failed to fetch user from /@me', err);
        signOut();
      } finally {
        setIsVerifying(false);
      }
    };

    fetchUser();
  }, [session]);

  // todo: loading screen
  if (isVerifying) {
    return null;
  }

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (!session) {
  //     router.replace('/signIn');
  //   } else {
  //     console.log('session:', session);
  //     try {
  //       let user = JSON.parse(session);
  //       if (!user.token) router.replace('/signIn');
  //       setToken(user.token);
  //       if (!user.permissions) router.replace('/signIn');
  //       setPermissions(user.permissions);
  //       if (!user.uid) router.replace('/signIn');
  //       setUid(user.uid);
  //     } catch (e) {
  //       console.log('session: JSON parse error');
  //     }
  //   }
  // }, [isLoading, session]);

  // // todo: loading screen
  // if (isLoading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!!session}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: '主页' }} // title for navigation
          />
          <Stack.Screen
            name="(post)/[id]"
            options={{ animation: 'ios_from_right' }}
          />
          {/* <Stack.Screen name="(post)/(editor)/[id]" /> */}
          <Stack.Screen
            name="(hidden)/search"
            options={{
              animation: 'ios_from_right',
              title: 'Sculife Posts Search',
            }}
          />
          <Stack.Screen
            name="(hidden)/result-editor"
            options={{ animation: 'ios_from_right', title: 'Result Editor' }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
