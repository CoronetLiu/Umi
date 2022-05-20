import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getFunnelOption = () => {
    return {
      color: [
        'rgba(250, 208, 115, 1)',
        'rgba(163, 211, 139, 1)',
        'rgba(112, 135, 207, 1)',
        'rgba(240, 127, 127, 1)',
        'rgba(138, 201, 227, 1)',
      ],
      series: [
        {
          name: 'Expected',
          type: 'funnel',
          top: '6%',
          left: '10%',
          bottom: '5%',
          width: '50%',
          gap: 3,
          label: {
            formatter: function (param) {
              return `${param.data.name}：${param.data.data}辆`;
            },
            fontSize: 14,
            position: 'right',
            opacity: 1,
            textBorderColor: '#fff',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            opacity: 0.5,
          },
          data: [
            { name: '超限车辆', data: 100, value: 50 },
            { name: '嫌疑车辆', data: 50, value: 25 },
            { name: '黑名单车辆', data: 30, value: 15 },
            { name: '两客一危车辆', data: 20, value: 10 },
          ],
        },
        {
          name: 'Actual',
          type: 'funnel',
          top: '6%',
          bottom: '5%',
          left: '10%',
          width: '50%',
          maxSize: '80%',
          gap: 3,
          label: {
            position: 'inside',
            formatter: '{c}%',
            color: '#fff',
            opacity: 1,
            borderWidth: 0,
            textBorderColor: '#fff',
          },
          itemStyle: {
            opacity: 0.8,
          },
          data: [
            { name: '超限车辆', data: 100, value: 50 },
            { name: '嫌疑车辆', data: 50, value: 25 },
            { name: '黑名单车辆', data: 30, value: 15 },
            { name: '两客一危车辆', data: 20, value: 10 },
          ],
          z: 100,
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getFunnelOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
