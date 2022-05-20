import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getRadarOption = () => {
    let data = [
      { name: '治理指数', data: 9 },
      { name: '运行指数', data: 8 },
      { name: '质量指数', data: 7 },
      { name: '健康指数', data: 6 },
      { name: '交通指数', data: 5 },
    ];
    return {
      radar: [
        {
          axisName: {
            rich: {
              b: {
                color: '#999999',
                fontSize: 16,
              },
              a: {
                color: '#000000',
                fontSize: 18,
              },
            },
            // 第一个参数是指示器名称，第二个参数是指示器配置项
            formatter: (a, b) => {
              return `{a|${data.find((x) => x.name == a).data}}\n{b|${a}}`;
            },
          },
          indicator: [
            { name: '治理指数', max: 10 },
            { name: '运行指数', max: 10 },
            { name: '质量指数', max: 10 },
            { name: '健康指数', max: 10 },
            { name: '交通指数', max: 10 },
          ],
          radius: 80,
          center: ['50%', '55%'],
          axisLine: {
            lineStyle: {
              color: 'rgba(97, 228, 255, .5)',
            },
          },
          splitLine: {
            lineStyle: {
              color: [
                'rgba(4, 128, 178, 0.3)',
                'rgba(4, 128, 178, 0.4)',
                'rgba(4, 128, 178, 0.6)',
                'rgba(4, 128, 178, 0.9)',
                'rgba(4, 128, 178, 0.9)',
                'rgba(4, 128, 178, 1)',
              ].reverse(),
            },
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(4, 128, 178, 0.1)',
                'rgba(4, 128, 178, 0.2)',
                'rgba(4, 128, 178, 0.4)',
                'rgba(4, 128, 178, 0.6)',
                'rgba(4, 128, 178, 0.8)',
                'rgba(4, 128, 178, 1)',
              ].reverse(),
            },
          },
          triggerEvent: true,
        },
      ],
      series: [
        {
          type: 'radar',
          lineStyle: {
            color: 'rgba(97, 228, 255, 1)',
          },
          areaStyle: {
            color: 'rgba(4, 128, 178, 0.6)',
          },
          emphasis: {
            focus: 'self',
            itemStyle: {
              color: 'rgba(97, 228, 255, 1)',
            },
            areaStyle: {
              color: 'rgba(4, 128, 178, 0.6)',
            },
          },
          selectedMode: 'single',
          // select: {
          //   itemStyle: {
          //     color: 'red'
          //   },
          //   label: {
          //     show: true,
          //     color: 'red'
          //   }
          // },
          data: [
            {
              value: [9, 8, 7, 6, 5],
              itemStyle: {
                color: '#FFFFFF',
              },
            },
          ],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getRadarOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
