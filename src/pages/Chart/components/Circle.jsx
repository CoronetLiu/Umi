import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getCircleOption = () => {
    return {
      tooltip: {
        show: true,
        trigger: 'item',
        borderColor: 'rgba(75, 252, 255, .59)',
        backgroundColor: 'transparent',
        extraCssText: 'box-shadow: inset 0px 0px 10px 0px rgba(75, 252, 255, .59);', //边框阴影
        formatter: function (params) {
          return `<span style="font-size:13px;color:#000000;">${params.marker} ${params.data.name} : ${params.data.value}辆</span>`;
        },
      },
      legend: {
        show: false,
        orient: 'vertical',
        icon: 'circle',
      },
      series: [
        {
          name: '数量分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 2,
            borderWidth: 1,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              name: '上午',
              value: 20,
              itemStyle: {
                color: '#3AA1FF',
              },
            },
            {
              name: '中午',
              value: 40,
              itemStyle: {
                color: '#35CBCA',
              },
            },
            {
              name: '下午',
              value: 50,
              itemStyle: {
                color: '#4ECB72',
              },
            },
            {
              name: '晚上',
              value: 80,
              itemStyle: {
                color: '#e9ff2e',
              },
            },
          ],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getCircleOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
