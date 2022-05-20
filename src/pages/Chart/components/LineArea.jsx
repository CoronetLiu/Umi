import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getLineAreaOption = () => {
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
          lineStyle: {
            type: 'solid',
            color: 'rgba(6, 255, 255, 0.29)',
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
            htmlStr += `<span style="display:inline-block;font-size:13px;color:#000000;margin:0 9px;">${seriesName}</span><span style="color:${color};font-size:17px;font-weight: bold;">${value}</span>`;
            htmlStr += '</div>';
          }
          return htmlStr;
        },
      },
      legend: {
        show: true,
        right: 5,
        top: 0,
        textStyle: {
          fontSize: 14,
          color: '#333',
        },
        data: ['本地货车', '外地货车'],
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: [2020, 2021, 2022],
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
        axisLabel: {
          fontSize: 14,
          color: '#999999',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '',
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 40, 0, 0],
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.2)',
          },
        },
        axisLabel: {
          fontSize: 14,
          color: '#999999',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
      },
      series: [
        {
          name: '本地货车',
          data: [100, 80, 120],
          type: 'line',
          symbol: 'none',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(251, 216, 79, 0.5)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(251, 216, 79, 0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(251, 216, 79, 1)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(251, 216, 79, 0.5)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          itemStyle: {
            color: 'rgba(251, 216, 79, 1)',
          },
        },
        {
          name: '外地货车',
          data: [50, 70, 80],
          type: 'line',
          symbol: 'none',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(216, 69, 87, 0.5)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(216, 69, 87, 0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(216, 69, 87, 1)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(216, 69, 87, 0.5)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          itemStyle: {
            color: 'rgba(216, 69, 87, 1)',
          },
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getLineAreaOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
