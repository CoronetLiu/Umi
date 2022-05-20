import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getGaugeOption = () => {
    return {
      series: [
        {
          type: 'gauge',
          radius: '100%',
          center: ['50%', '75%'],
          min: 0,
          max: 10,
          startAngle: 180,
          endAngle: 0,
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 15,
              color: [
                [0.2, '#34B000'],
                [0.4, '#96C83C'],
                [0.6, '#FECB00'],
                [0.8, '#FF4E00'],
                [1, '#D0021B'],
              ],
            },
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: 5,
            },
          ],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getGaugeOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
