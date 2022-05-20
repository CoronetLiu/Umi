import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getBarSplitOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(156, 225, 255, .16)',
          },
        },
        borderColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // extraCssText: 'box-shadow: inset 0px 0px 10px 0px rgba(0, 12, 45, .59);', //边框阴影
        formatter: function (param) {
          var htmlStr = '';
          if (param.length > 0) {
            htmlStr += `<div style="color:#DEF3FD;">${param[0].name}<div>`;
            for (let k = 0; k < param.length; k++) {
              if (param[k].seriesName == '长途客车') {
                param[k].color = '#21B6FF';
              }
              htmlStr += `<div style="color:#DEF3FD;">
                ${param[k].marker}
                <span style="margin:0 4px 0 4px;">${param[k].seriesName}</span>：<span>${param[k].value}</span>
                </div>`;
            }
          } else {
            htmlStr =
              '<span style="display:inline-block;font-size:14px;color:#000000;padding:0 10px;">暂无数据</span>';
          }
          return htmlStr;
        },
      },
      legend: {
        icon: 'circle',
        selectedMode: false,
        itemWidth: 10, // 设置宽度
        itemHeight: 10, // 设置高度
        right: 5,
        top: 5,
        textStyle: {
          color: '#333333',
          fontSize: '12px',
        },
        itemStyle: {
          opacity: 1,
        },
        data: ['旅游包车', '长途客车', '危化品车'],
      },
      grid: {
        left: '20px',
        top: '30px',
        bottom: '10px',
        right: '10px',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['超速行驶', '疲劳驾驶', '非运营时段行驶'],
          axisPointer: {
            type: 'shadow',
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 2,
              color: 'rgba(0, 0, 0, 0.2)',
            },
          },
          axisLabel: {
            color: '#999999',
            fontSize: 12,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          splitNumber: 3,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: 'rgba(0, 0, 0, 0.2)',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.2)',
            },
          },
          axisLabel: {
            color: '#999999',
            fontSize: 12,
          },
          nameTextStyle: {
            color: '#999999',
            fontSize: 12,
            padding: [0, 0, 4, -28],
          },
        },
      ],
      series: [
        {
          name: '长途客车',
          type: 'bar',
          stack: 'veh',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: 'rgba(33, 182, 255,.3)' },
              { offset: 0, color: 'rgba(33, 182, 255, 1)' },
            ]),
            shadowColor: 'rgba(33, 182, 255,.2)',
            shadowOffsetX: '4',
          },
          barWidth: 20,
          barGap: '50%', //不同系列的柱间距离表示柱子宽度的 50%
          data: [100, 80, 30],
        },
        {
          name: '旅游包车',
          type: 'bar',
          stack: 'veh',
          itemStyle: {
            color: '#00F0A1',
            shadowColor: 'rgba(33, 182, 255,.2)',
            shadowOffsetX: '4',
          },
          barWidth: 20,
          barGap: '50%', //不同系列的柱间距离表示柱子宽度的 50%
          data: [80, 30, 50],
        },
        {
          name: '危化品车',
          type: 'bar',
          stack: 'veh',
          itemStyle: {
            color: '#FBD84F',
            borderRadius: [15, 15, 0, 0],
            shadowColor: 'rgba(33, 182, 255,.2)',
            shadowOffsetX: '4',
          },
          barWidth: 20,
          barGap: '50%', //不同系列的柱间距离表示柱子宽度的 50%
          data: [20, 30, 10],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getBarSplitOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
