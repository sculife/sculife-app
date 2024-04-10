// Reference: https://github.com/JoeKooler/React-Native-Radar-Chart
import React from 'react';
import Svg, { G, Path, Text, Polyline, Circle } from 'react-native-svg';
import { useThemeColor } from './Themed';

export interface RadarChartOptions {
  colorList: string[];
  dotList: boolean[];
  graphShape: number;
  showAxis: boolean;
  showVertex: boolean[];
  showIndicator: boolean;
}

export default function RadarChart({
  graphSize,
  scaleCount,
  numberInterval = 1,
  startInterval = 0,
  data,
  options,
  nullProps = <></>,
}: {
  graphSize: number;
  scaleCount: number;
  numberInterval?: number;
  startInterval?: number;
  data: { [key: string]: number }[];
  options: RadarChartOptions;
  nullProps: React.JSX.Element;
}) {
  if (
    data.length <= 0 ||
    data.filter((v) => Object.keys(v).length >= 3).length == 0
  )
    return nullProps;

  const boxSize = graphSize * 3;
  const centerPos = boxSize / 2;

  // Top start pos -90 degree
  const posX = (angle: number, distance: number) =>
    Math.cos(angle - Math.PI / 2) * distance * graphSize;
  const posY = (angle: number, distance: number) =>
    Math.sin(angle - Math.PI / 2) * distance * graphSize;

  const initPath = (points: any) => {
    let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
    for (let i = 1; i < points.length; i++) {
      d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
    }
    return d + 'z';
  };

  const scaleShape = (columns: any, i: number) => {
    return (
      <Path
        key={`shape-${i}`}
        d={initPath(
          columns.map((column: any) => {
            return [
              posX(column.angle, i / scaleCount),
              posY(column.angle, i / scaleCount),
            ];
          })
        )}
        stroke={`#928481`}
        fill={`#FFFFFF`}
        fillOpacity=".5"
      />
    );
  };

  const shape = (columns: any) => (chartData: any, i: number) => {
    const data = chartData;
    const colorCode = options.colorList[i];
    const dot = options.dotList[i] == true ? '20,20' : '0,0';

    return (
      <Path
        key={`shape-${i}`}
        d={initPath(
          columns.map((column: any) => {
            return [
              posX(column.angle, data[column.key]),
              posY(column.angle, data[column.key]),
            ];
          })
        )}
        strokeDasharray={dot}
        stroke={colorCode}
        strokeWidth="4"
        fill={`#FFFFFF`}
        fillOpacity=".5"
      />
    );
  };

  const points = (points: any) => {
    return points
      .map((point: any) => point[0].toFixed(4) + ',' + point[1].toFixed(4))
      .join(' ');
  };

  const axis = () => (column: any, i: any) => {
    return (
      <Polyline
        key={`poly-axis-${i}`}
        points={points([
          [0, 0],
          [posX(column.angle, 1.1), posY(column.angle, 1.1)],
        ])}
        stroke="#000000"
        strokeWidth=".5"
      />
    );
  };

  const caption = () => (column: any) => {
    return (
      <Text
        key={`caption-of-${column.key}`}
        x={posX(column.angle, 1.2)}
        y={posY(column.angle, 1.2)}
        dy={10 / 2}
        fill={useThemeColor({ light: '#444', dark: '#eee' }, 'text')}
        fontWeight="bold"
        fontSize="50"
        textAnchor="middle"
      >
        {column.key}
      </Text>
    );
  };

  const vertex = (columns: any[]) => (chartData: any, i: number) => {
    return columns.map(
      (column: any, j: number) =>
        options.showVertex[i] && (
          <Circle
            key={`vertex-of-${i}-${j}`}
            r={10}
            cx={posX(column.angle, chartData[column.key])}
            cy={posY(column.angle, chartData[column.key])}
            fill="#444"
          />
        )
    );
  };

  const textIndicator = (i: any) => {
    return (
      <Text
        x={-20}
        y={-((i / scaleCount) * graphSize)}
        fill="#444"
        fontWeight="bold"
        fontSize="30"
        textAnchor="middle"
      >
        {i}
      </Text>
    );
  };

  const groups = [];
  const labels = Object.keys(data[0]);

  const columns = labels.map((key, i, arr) => {
    return {
      key,
      angle: (Math.PI * 2 * i) / arr.length,
    };
  });

  for (let i = scaleCount; i >= 0; i--) {
    groups.push(<G key={`scale-shape-${i}`}>{scaleShape(columns, i)}</G>);
  }

  groups.push(<G key={`groups`}>{data.map(shape(columns))}</G>);
  groups.push(<G key={`group-captions`}>{columns.map(caption())}</G>);

  if (options.showVertex)
    groups.push(<G key={`group-dot`}>{data.map(vertex(columns))}</G>);

  if (options.showAxis)
    groups.push(<G key={`group-axis`}>{columns.map(axis())}</G>);

  if (options.showIndicator) {
    for (let i = 0; i <= scaleCount; i++) {
      if ((startInterval + i) % numberInterval == 0)
        groups.push(<G key={`group-eiei-${i}`}>{textIndicator(i)}</G>);
    }
  }

  return (
    <Svg
      width={graphSize}
      height={graphSize}
      viewBox={`0 0 ${boxSize} ${boxSize}`}
    >
      <G transform={`translate(${centerPos},${centerPos})`}>{groups}</G>
    </Svg>
  );
}
