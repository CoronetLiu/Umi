import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getRectOption = () => {
    let data = [80, 50, 70];
    let max = data.sort((a, b) => b - a) || [];
    max = max[0] || 0;
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
          for (var i = 0; i < 1; i++) {
            // params.length=>1,不提示总分
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
        show: false,
        data: ['数据质量', '背景'],
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
        name: '(分)',
        nameTextStyle: {
          color: '#999999',
          fontSize: 12,
          padding: [0, 40, -5, 0],
        },
        splitNumber: 3,
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, .2)',
          },
        },
        axisLabel: {
          color: '#999999',
          fontSize: 12,
          interval: 2,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '数据质量',
          data: data,
          type: 'pictorialBar',
          symbol: 'rect', //图形类型，带圆角的矩形roundRect
          barWidth: '11%', //柱图宽度
          barMaxWidth: '20%', //最大宽度
          symbolMargin: '3', //图形垂直间隔
          itemStyle: {
            color: '#48EEFD',
          },
          z: 2, //z-index
          symbolRepeat: true, //图形是否重复
          symbolSize: [30, 4], //图形元素的尺寸
          animationEasing: 'elasticOut', //动画效果
        },
        {
          name: '背景',
          data: [max, max, max],
          type: 'pictorialBar',
          symbol: 'rect', //图形类型，带圆角的矩形roundRect
          barWidth: '11%', //柱图宽度
          barMaxWidth: '20%', //最大宽度
          symbolMargin: '3', //图形垂直间隔
          itemStyle: {
            color: 'rgba(72, 238, 253, 0.3)',
          },
          z: 1, //z-index
          symbolRepeat: true, //图形是否重复
          symbolSize: [30, 4], //图形元素的尺寸
          animationEasing: 'elasticOut', //动画效果
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getRectOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
