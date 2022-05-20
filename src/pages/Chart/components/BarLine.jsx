import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getBarLineOption = () => {
    return {
      title: {
        show: false,
        text: '客流量',
        top: 20,
        left: 30,
        textStyle: {
          fontSize: 16,
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        padding: 13,
        textStyle: {
          color: '#60646F',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.11);',
      },
      legend: [
        {
          right: 210,
          top: 0,
          itemWidth: 13,
          itemHeight: 13,
          data: [
            {
              name: '人数',
              icon: 'rect',
            },
          ],
        },
        {
          right: 120,
          top: 0,
          itemWidth: 30,
          itemHeight: 15,
          data: [
            {
              name: '上午',
            },
          ],
        },
        {
          right: 40,
          top: 0,
          itemWidth: 30,
          itemHeight: 15,
          data: [
            {
              name: '下午',
            },
          ],
        },
      ],
      grid: {
        left: '20px',
        top: '30px',
        bottom: '10px',
        right: '10px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.2)',
          },
        },
        data: ['光明小学', '黑暗小学', '巴拉巴拉黑魔法学校'],
      },
      yAxis: [
        {
          type: 'value',
          name: '数量',
          nameTextStyle: {
            color: '#999999',
            fontSize: 12,
            padding: [0, 50, -5, 0],
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.2)',
            },
          },
          axisLabel: {
            margin: 18,
            color: '#999999',
            fontSize: 12,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.2)',
            },
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: [
                'rgba(7, 148, 2, 0.2)',
                'rgba(78, 203, 114, 0.2)',
                'rgba(254, 203, 0, 0.2)',
                'rgba(255, 78, 0, 0.2)',
                'rgba(208, 2, 27, 0.2)',
              ],
            },
          },
        },
        {
          type: 'value',
          name: '时间',
          nameTextStyle: {
            color: '#999999',
            fontSize: 12,
            padding: [0, 0, -5, 50],
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            margin: 18,
            color: '#999999',
            fontSize: 12,
            formatter: '{value}',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          type: 'bar',
          name: '人数',
          barWidth: 25,
          itemStyle: {
            color: '#cb8335',
            borderRadius: [14, 14, 0, 0], //柱形圆角
          },
          backgroundStyle: {
            borderRadius: 4,
          },
          data: [10, 20, 30],
        },
        {
          type: 'line',
          name: '上午',
          yAxisIndex: 1,
          itemStyle: {
            color: '#3AA1FF',
            width: 4,
          },
          lineStyle: {
            width: 4,
          },
          smooth: 0.1,
          markPoint: {
            data: [{ type: 'max', name: '最大值' }],
          },
          data: [30, 40, 30],
        },
        {
          type: 'line',
          name: '下午',
          yAxisIndex: 1,
          itemStyle: {
            color: '#3affe8',
            width: 4,
          },
          lineStyle: {
            width: 4,
          },
          smooth: 0.1,
          markPoint: {
            data: [{ type: 'max', name: '最大值' }],
          },
          data: [35, 30, 45],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getBarLineOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
