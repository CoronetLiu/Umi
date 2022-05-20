import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getPieOption = () => {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          center: ['50%', '60%'],
          radius: '90%',
          itemStyle: {
            color: '#FA9900',
          },
          progress: {
            show: true,
            roundCap: true,
            width: 15,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 15,
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
          title: {
            offsetCenter: [0, '50%'],
          },
          detail: {
            offsetCenter: [0, '-10%'],
            valueAnimation: true,
            formatter: function (value) {
              return '{value|' + value + '%}';
            },
            rich: {
              value: {
                fontSize: 28,
                fontWeight: 'bolder',
                color: '#FA9900',
              },
              unit: {
                fontSize: 20,
                color: '#999',
                padding: [0, 0, -20, 10],
              },
            },
          },
          data: [
            {
              value: 50,
              name: '在线率',
            },
          ],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getPieOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
