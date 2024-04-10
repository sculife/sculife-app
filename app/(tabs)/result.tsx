import { Dimensions } from 'react-native';

import RadarChart from '@/components/RadarChart';
import { ScrollView, Text, View } from '@/components/Themed';
import useResultStore, { subjects } from '@/store/useResultStore';

export default function ResultScreen() {
  const result = useResultStore((state) => state.data);

  const calcTotal = () => {
    if (result) {
      return Object.values(result).reduce((a, b) => a + b, 0);
    }
    return 0;
  };

  return (
    <ScrollView className="flex-1 min-h-full">
      <View className="flex-1 justify-center">
        <View className="justify-center">
          <View className="p-5 pb-1">
            <View>
              <Text className="text-sm">全科总分</Text>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-4xl font-bold">{calcTotal()}</Text>
              <Text className="font-bold">分</Text>
              <Text className="pl-3 text-sm font-bold">
                满分 {Object.keys(result).length * 100}
              </Text>
            </View>
            {/* TODO: 感觉很丑，找时间改改 */}
            {Object.keys(result).length <= 0 ? (
              <Text className="font-semibold mt-2">
                没有数据，请点击编辑试试看添加数据吧！
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>

        <View className="flex-1 flex-row flex-wrap content-start gap-1 p-5 py-3">
          {Object.keys(result).map((k) => (
            <View key={k} className="flex flex-row flex-wrap content-start">
              <Text className="uppercase font-bold w-[80%]">{subjects[k]}</Text>
              <Text className="font-bold w-[20%] text-right">
                {result[k]}/100
              </Text>
            </View>
          ))}
        </View>

        <View className="items-center mx-5">
          <View
            className="my-5 h-[1px] w-full"
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.3)"
          />
        </View>

        <View className="pt-3">
          <Text className="font-bold p-5 py-0">本次发挥水平</Text>
          <View className="items-center">
            <RadarChart
              graphSize={Dimensions.get('screen').width - 10}
              scaleCount={6}
              // numberInterval={2}
              // startInterval={1}
              data={[
                Object.fromEntries(
                  Object.entries(result)
                    .map(([key, value]) => [key, value / 100])
                    .sort((a, b) =>
                      (a[0] as string).localeCompare(b[0] as string)
                    )
                ),
              ]}
              options={{
                graphShape: 1,
                showAxis: true,
                showIndicator: false,
                colorList: ['black'],
                dotList: [false],
                showVertex: [true],
              }}
              nullProps={
                <View>
                  <Text>数据不足，无法做出表格</Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
