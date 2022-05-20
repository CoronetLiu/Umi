import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import geoJson from '@/assets/chart/430700.json';

export default () => {
  const getMapOption = () => {
    echarts.registerMap('CD', geoJson);
    return {
      tooltip: {
        trigger: 'item',
        borderColor: 'rgba(75, 252, 255, .59)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // extraCssText: 'box-shadow: inset 0px 0px 10px 0px rgba(0, 12, 45, .59);', //边框阴影
        formatter: function (param) {
          var htmlStr = '';
          if (param.value !== 0) {
            var seriesName = param.seriesName; //图例名称
            var value = param.value; //y轴值
            var color = param.color; //图例颜色
            var marker = param.marker; //圆点
            htmlStr += `<div>`;
            htmlStr += marker;
            //圆点后面显示的文本
            htmlStr += `<span style="display:inline-block;width:45px;font-size:14px;color:#FFFFFF;margin:0 9px;">${seriesName}</span><span style="color:${color};font-size:18px;font-weight: bold;">${value}</span>`;
            htmlStr += '</div>';
            return htmlStr;
          } else {
            htmlStr =
              '<span style="display:inline-block;font-size:14px;color:#FFFFFF;padding:0 10px;">暂无数据</span>';
            return htmlStr;
          }
        },
      },
      grid: {
        top: 0,
      },
      visualMap: {
        type: 'piecewise',
        top: '10%',
        left: 20,
        itemSymbol: 'circle',
        textStyle: {
          color: '#999999',
          fontSize: 14,
        },
        pieces: [
          { min: 2000, color: '#F65249' }, // 不指定 max，表示 max 为无限大（Infinity）。
          { min: 1000, max: 2000, color: '#F56B3F' },
          { min: 500, max: 1000, color: '#F68632' },
          { min: 100, max: 500, color: '#F6A61D' },
          { min: 1, max: 100, color: '#F6C506' },
        ],
        inRange: {
          color: [
            'rgba(246, 197, 6, .6)',
            'rgba(246, 166, 29, .6)',
            'rgba(246, 134, 50, .6)',
            'rgba(245, 107, 63, .6)',
            'rgba(246, 82, 73, .6)',
          ],
        },
      },
      series: [
        {
          name: '超限量',
          type: 'map',
          map: 'CD',
          zoom: 1,
          left: '35%',
          itemStyle: {
            borderColor: 'rgba(6, 255, 255, 0.8)',
            borderWidth: 2,
            shadowColor: 'rgba(246, 197, 6, 0.4)',
            shadowOffsetY: 10,
            shadowOffsetX: -10,
          },
          label: {
            show: true,
            color: '#333333',
            fontSize: 14,
          },
          data: [
            { name: '武陵区', value: 200 },
            { name: '鼎城区', value: 500 },
            { name: '安乡县', value: 2000 },
            { name: '汉寿县', value: 600 },
            { name: '澧县', value: 100 },
            { name: '临澧县', value: 800 },
            { name: '桃源县', value: 1500 },
            { name: '石门县', value: 100 },
            { name: '津市市', value: 400 },
          ],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getMapOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
