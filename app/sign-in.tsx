import { useEffect, useState } from 'react';
import { Alert, Dimensions, useColorScheme } from 'react-native';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '@/components/Themed';
import Url from '@/constants/Url';
import { useSession } from '@/hooks/ctx';
import { ApiObject } from '@/typings/api';
import { UserLoginDTO } from '@/typings/dtos';

export default function LoginScreen() {
  const { signIn, session } = useSession();
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const login = async () => {
    try {
      let res = await axios.post(`${Url.BASE_URL}/api/users/login`, {
        id: loginId,
        password: loginPassword,
      });
      let { data: token } = res.data as ApiObject<UserLoginDTO>;
      // setSession(
      //   JSON.stringify({
      //     uid: data.uid,
      //     id: data.id,
      //     name: data.name,
      //     bio: data.bio,
      //     sex: data.sex,
      //     class: data.class,
      //     cname: data.cname,
      //     deptId: data.deptId,
      //     email: data.email,
      //     permissions: data.permissions,
      //     token,
      //   })
      // );
      // setUid(data.uid);
      // setPermissions(data.permissions);
      signIn(token);
      router.push('/');
    } catch (e) {
      console.log('login error:', e);
      Alert.alert('Login Error', 'Failed to login!');
    }
  };

  return (
    <ScrollView className="flex-1">
      <StatusBar style="dark" />
      <View className="flex-1 gap-12 pt-[10vh]">
        <View className="items-center">
          <Image
            contentFit="contain"
            style={{ height: windowHeight * 0.25, width: windowWidth }}
            source={require('../assets/images/bg-images/login-bg.png')}
          />
        </View>

        <View>
          <Text className="font-extrabold tracking-widest text-center text-3xl">
            Welcome Back!
          </Text>
          {/* <Text className="font-bold tracking-wider text-center">
            Hi! Please login first. :)
          </Text> */}
          <View
            style={{ height: windowHeight * 0.07 }}
            className="flex-row mx-6 mt-10 mb-4 px-4 rounded-2xl items-center"
            darkColor="#404040"
            lightColor="#f5f5f5"
          >
            <View className="pl-2" darkColor="#404040" lightColor="#f5f5f5">
              <Octicons
                name="id-badge"
                size={20}
                color={theme === 'dark' ? 'white' : 'gray'}
              />
            </View>
            <TextInput
              placeholder="Student ID"
              className="flex-1 mx-4 font-semibold"
              onChangeText={(t) => setLoginId(t)}
              value={loginId}
            />
          </View>
          <View
            style={{ height: windowHeight * 0.07 }}
            className="flex-row mx-6 mt-3 px-4 rounded-2xl items-center"
            darkColor="#404040"
            lightColor="#f5f5f5"
          >
            <View className="pl-2" darkColor="#404040" lightColor="#f5f5f5">
              <Octicons
                name="lock"
                size={20}
                color={theme === 'dark' ? 'white' : 'gray'}
              />
            </View>
            <TextInput
              secureTextEntry
              placeholder="Password"
              className="flex-1 mx-4 font-semibold"
              value={loginPassword}
              onChangeText={(t) => setLoginPassword(t)}
            />
          </View>
          <View className="flex-row justify-end mr-6 mb-2">
            <TouchableOpacity className="py-1">
              <Text className="text-center font-semibold text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <View className='justify-center items-center'>
            <TouchableOpacity
              className="items-center px-4 py-3 w-1/2 rounded-xl mx-6 mt-4"
              darkColor="#404040"
              lightColor="#f5f5f5"
              onPress={login}
            >
              <Text className="text-lg font-bold text-center tracking-wider">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
