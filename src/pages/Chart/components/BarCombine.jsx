import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getBarCombineOption = () => {
    return {
      grid: {
        left: '20px',
        top: '30px',
        bottom: '10px',
        right: '10px',
        containLabel: true,
      },
      legend: {
        type: 'plain',
        icon: 'circle',
        itemWidth: 12,
        itemHeight: 12,
        right: 5,
        top: 5,
        textStyle: {
          color: '#333333',
          fontSize: '12px',
        },
        itemStyle: {
          opacity: 1,
        },
        data: ['已结案', '未结案'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            type: 'solid',
            color: 'rgba(6, 255, 255, .29)',
          },
        },
        borderColor: 'rgba(75, 252, 255, .59)',
        backgroundColor: 'transparent',
        extraCssText: 'box-shadow: inset 0px 0px 10px 0px rgba(75, 252, 255, .59);', //边框阴影
        formatter: function (params) {
          var htmlStr = '';
          for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var seriesName = param.seriesName; //图例名称
            var value = param.value; //y轴值
            var color = param.color; //图例颜色
            var marker = param.marker; //圆点
            htmlStr += `<div>`;
            htmlStr += marker;
            //圆点后面显示的文本
            htmlStr += `<span style="display:inline-block;font-size:13px;color:#000000;margin:0 9px;">${seriesName}</span><span style="color:${color.colorStops[0].color};font-size:17px;font-weight: bold;">${value}</span>`;
            htmlStr += '</div>';
          }
          return htmlStr;
        },
      },
      xAxis: {
        type: 'category',
        name: '(年)',
        nameLocation: 'end',
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 0, 0, 0],
        },
        axisLine: {
          lineStyle: {
            width: 1,
            color: 'rgba(0, 0, 0, .2)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
          fontSize: 12,
        },
        data: [2020, 2021, 2022],
      },
      yAxis: {
        type: 'value',
        name: '(数量)',
        nameLocation: 'end',
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 40, -5, 0],
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '已结案',
          type: 'bar',
          barWidth: 20,
          data: [100, 80, 60],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(131, 142, 255, 1)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(130, 141, 253, 0.2)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            borderRadius: [10, 10, 0, 0],
          },
        },
        {
          name: '未结案',
          type: 'bar',
          barWidth: 20,
          data: [30, 20, 40],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(72, 238, 253, 1)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(72, 238, 253, 0.4)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            borderRadius: [10, 10, 0, 0],
          },
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getBarCombineOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
