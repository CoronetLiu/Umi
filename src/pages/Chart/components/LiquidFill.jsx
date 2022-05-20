import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import 'echarts-liquidfill';

export default () => {
  const getLiquidFillOption = () => {
    return {
      series: [
        {
          type: 'liquidFill',
          radius: '150px',
          data: [0.8],
          label: {
            fontSize: 20,
            color: '#FFFFFF',
            fontWeight: 'bold',
            insideColor: '#FFFFFF',
            formatter: function (val) {
              return val.data * 100 + '%';
            },
          },
          color: [
            {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#5EE3D6', // 100% 处的颜色
                },
                {
                  offset: 1,
                  color: '#0A69BF', // 0% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          ],
          outline: {
            show: true,
            borderDistance: 0,
            itemStyle: {
              borderColor: '#3387D8',
              borderWidth: 1,
            },
          },
          backgroundStyle: {
            color: 'transparent',
          },
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getLiquidFillOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
