import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabOneScreen from '.';
import ResultScreen from './result';
import PostsScreen from './posts';
import UserInfoScreen from './userInfo';
import { useSession } from '@/hooks/ctx';
import { JWTdecodePermissions } from '@/utils/JWTdecodePermissions';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
}) {
  return <FontAwesome6 size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Tabs = createBottomTabNavigator();

export default function TabLayout() {
  const { session } = useSession();
  const colorScheme = useColorScheme();
  const [canManagePosts, setCanManagePosts] = useState(false);

  useEffect(() => {
    const permissions = session ? JWTdecodePermissions(session) : [];
    setCanManagePosts(
      permissions.includes('system:admin') ||
        permissions.includes('posts:create') ||
        permissions.includes('posts:delete')
    );
  }, [session]);

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        component={TabOneScreen}
        options={{
          // headerShown: false,
          title: '探索',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="earth-americas" color={color} />
          ),
          headerRight: () => (
            <Link href="/search" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="search"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        component={ResultScreen}
        options={{
          title: '成绩',
          headerTitleAlign: 'center',
          headerRight: () => (
            <Link href="/(hidden)/result-editor" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Octicons
                    style={{
                      marginRight: 20,
                      padding: 5,
                      opacity: pressed ? 0.5 : 1,
                      color: Colors.ios.linkBlue,
                    }}
                    name="pencil"
                    size={20}
                    color={Colors.ios.linkBlue}
                  />
                )}
              </Pressable>
            </Link>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="bar-chart"
              size={28}
              style={{ marginBottom: -3 }}
              color={color}
            />
          ),
        }}
      />
      {canManagePosts ? (
        <Tabs.Screen
          name="posts"
          component={PostsScreen}
          options={{
            // headerShown: false,
            title: '管理帖子',
            headerTitleAlign: 'center',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="folder" color={color} />
            ),
          }}
        />
      ) : (
        <></>
      )}
      <Tabs.Screen
        name="userInfo"
        component={UserInfoScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
}
