import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getTriangleOption = () => {
    return {
      grid: {
        left: '20px',
        top: '30px',
        bottom: '10px',
        right: '10px',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        borderColor: 'rgba(75, 252, 255, .59)',
        backgroundColor: 'transparent',
        extraCssText: 'box-shadow: inset 0px 0px 10px 0px rgba(75, 252, 255, .59);', //边框阴影
        formatter: function (params) {
          var htmlStr = '';
          var param = params[0];
          var seriesName = param.seriesName; //图例名称
          var value = param.value; //y轴值
          var color = param.color; //图例颜色
          var marker = param.marker; //圆点
          htmlStr += `<div>`;
          htmlStr += marker;
          //圆点后面显示的文本
          htmlStr += `<span style="display:inline-block;font-size:13px;color:#000000;margin:0 9px;">${seriesName}</span><span style="color:${color};font-size:17px;font-weight: bold;">${value}</span>`;
          htmlStr += '</div>';
          return htmlStr;
        },
      },
      legend: {
        show: false,
        data: ['设备'],
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: ['固定治超站', '非现场检测站', '源头企业站'],
        axisLabel: {
          color: '#999999',
          fontSize: 12,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '(台)',
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 30, -5, 0],
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
        axisLabel: {
          color: '#999999',
          fontSize: 12,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '设备',
          data: [
            {
              value: 50,
              itemStyle: {
                color: '#5AFB9B',
              },
            },
            {
              value: 80,
              itemStyle: {
                color: '#44CFA8',
              },
            },
            {
              value: 60,
              itemStyle: {
                color: '#2B9FA8',
              },
            },
          ],
          type: 'pictorialBar',
          symbol: 'path://M250,150 L150,350 L350,350 Z',
          symbolSize: ['50%', '100%'],
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
          },
        },
        {
          //顶部圆点最为新的类型添加相同数据
          type: 'pictorialBar',
          symbolPosition: 'end',
          symbolSize: 10,
          data: [
            {
              value: 50,
              itemStyle: {
                color: '#5AFB9B',
                shadowColor: '#5AFB9B',
                shadowBlur: 8,
              },
            },
            {
              value: 80,
              itemStyle: {
                color: '#44CFA8',
                shadowColor: '#44CFA8',
                shadowBlur: 8,
              },
            },
            {
              value: 60,
              itemStyle: {
                color: '#2B9FA8',
                shadowColor: '#2B9FA8',
                shadowBlur: 8,
              },
            },
          ],
          symbolOffset: [0, -5],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getTriangleOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
