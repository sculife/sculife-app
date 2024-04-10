import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { ScrollView, Text, TextInput, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import useResultStore, { subjects } from '@/store/useResultStore';
import { useRouter } from 'expo-router';

export default function ResultEditorScreen() {
  const router = useRouter();
  const resultStore = useResultStore((state) => state);
  const [result, setResult] = useState<{ [key: string]: number | string }>(
    resultStore.data
  );

  const changeResult = (code: keyof typeof subjects, mark: string) => {
    // result.setData((res) => {
    //   // console.log({ ...res, [code]: Number(mark) })
    //   return { ...res, [code]: Number(mark) };
    // });
    setResult((res) => ({ ...res, [code]: Number(mark) }));
  };

  const resultComplete = () => {
    let obj: (keyof typeof subjects)[] = [];

    for (let k in result) {
      if (Number(result[k]) >= 0 && Number(result[k]) <= 100) {
        obj.push(k);
      } else {
        obj.filter((v) => v !== k);
      }
    }

    // console.log(...obj.map((v) => ({ [v]: result[v] })));
    // let o = obj.reduce(
    //   (accumulator, cv) => ({
    //     ...accumulator,
    //     [cv]: result[cv],
    //   }),
    //   { A: 1 }
    // );
    // console.log(o);

    resultStore.setData((res) =>
      obj.reduce(
        (accumulator, cv) => ({
          ...accumulator,
          [cv]: Number(result[cv]),
        }),
        {}
      )
    );

    router.back();
  };

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 justify-center">
        <View className="flex-1 justify-center items-center gap-1 p-5 py-3">
          {Object.keys(subjects).map((k: string) => (
            <View
              key={k}
              className="flex flex-row flex-wrap justify-between items-center h-8"
            >
              <Text className="uppercase font-bold w-[80%]">{subjects[k]}</Text>
              <TextInput
                className="bg-zinc-800 text-white w-[20%] rounded-md text-center py-[1%]"
                placeholder="80%"
                placeholderTextColor={Colors.zinc['800+100']}
                keyboardType="number-pad"
                inputMode="numeric"
                defaultValue={
                  resultStore.data[k] ? resultStore.data[k].toString() : '-1'
                }
                onChangeText={(text) => changeResult(k, text)}
              />
              {/* <Text className="font-bold w-[20%] text-right">100</Text> */}
            </View>
          ))}
        </View>
        <View className="text-center items-center m-5">
          <TouchableOpacity className="px-4 py-2" onPress={resultComplete}>
            <Text
              className="font-bold text-xl"
              style={{ color: Colors.ios.linkBlue }}
            >
              完成
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
