import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getScatterOption = () => {
    let years = ['2020', '2021', '2022'];
    let data = [
      [0, 0, 40],
      [1, 0, 20],
      [2, 0, 80],
    ];

    const max = data.sort((a, b) => b[2] - a[2])[0][2]; //拿到所有数据的最大值
    const maxSize = 80; //圆点最大尺寸
    return {
      legend: {
        show: false,
        data: ['出行'],
      },
      grid: {
        left: '20px',
        top: '30px',
        bottom: '10px',
        right: '10px',
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          lineStyle: {
            type: 'solid',
            color: 'rgba(6, 255, 255, 0.29)',
          },
        },
        borderColor: 'rgba(75, 252, 255, .59)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        extraCssText: 'box-shadow: inset 0px 0px 10px 0px rgba(75, 252, 255, .59);', //边框阴影
        formatter: function (params) {
          var htmlStr = '';
          var seriesName = params.name; //图例名称
          var value = params.data[2]; //y轴值
          var color = params.color; //图例颜色
          var marker = params.marker; //圆点
          htmlStr += `<div>`;
          htmlStr += marker;
          //圆点后面显示的文本
          htmlStr += `<span style="display:inline-block;font-size:14px;color:#000000;margin:0 9px;">${seriesName}</span><span style="font-size:17px;font-weight: bold;">${value}</span>`;
          htmlStr += '</div>';
          return htmlStr;
        },
      },
      xAxis: {
        type: 'category',
        data: years,
        boundaryGap: true,
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 40, 0, 0],
        },
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
        type: 'category',
        data: ['出行量'],
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 40, 0, 0],
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
        axisLabel: {
          fontSize: 12,
          color: '#999999',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '出行',
          type: 'scatter',
          data: data,
          symbolSize: function (val) {
            let size = max ? Math.round((val[2] * maxSize) / max) : 10;
            if (size < 8) size = 8;
            return size;
          },
          itemStyle: {
            color: function (val) {
              let op = max ? (val.data[2] / max).toFixed(2) : '1';
              if (op < 0.3) op = 0.3;
              return 'rgba(24, 179, 164, ' + op + ')';
            },
          },
          animationDelay: function (idx) {
            return idx * 5;
          },
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getScatterOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
