import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default () => {
  const getCalendarOption = () => {
    let dateList = [
      ['2021-12-1', '廿七'],
      ['2021-12-2', '廿八'],
      ['2021-12-3', '廿九'],
      ['2021-12-4', '十一月'],
      ['2021-12-5', '初二'],
      ['2021-12-6', '初三'],
      ['2021-12-7', '初四'],
      ['2021-12-8', '初五'],
      ['2021-12-9', '初六'],
      ['2021-12-10', '初七'],
      ['2021-12-11', '初八'],
      ['2021-12-12', '初九'],
      ['2021-12-13', '初十'],
      ['2021-12-14', '十一'],
      ['2021-12-15', '十二'],
      ['2021-12-16', '十三'],
      ['2021-12-17', '十四'],
      ['2021-12-18', '十五'],
      ['2021-12-19', '十六'],
      ['2021-12-20', '十七'],
      ['2021-12-21', '十八'],
      ['2021-12-22', '十九'],
      ['2021-12-23', '二十'],
      ['2021-12-24', '廿一'],
      ['2021-12-25', '廿二'],
      ['2021-12-26', '廿三'],
      ['2021-12-27', '廿四'],
      ['2021-12-28', '廿五'],
      ['2021-12-29', '廿六'],
      ['2021-12-30', '廿七'],
      ['2021-12-31', '廿八'],
    ];
    let lunarData = [];
    let calData = [];
    let max = 1000;
    for (let i = 0; i < dateList.length; i++) {
      let randomNum = (Math.random() * max).toFixed();
      lunarData.push([dateList[i][0], randomNum, dateList[i][1]]);
      calData.push([dateList[i][0], randomNum]);
    }
    let month = '2021-12';

    return {
      tooltip: {
        formatter: function (params) {
          return '交通量: ' + params.value[1];
        },
      },
      visualMap: {
        type: 'piecewise',
        show: false,
        min: 0,
        max: max,
        calculable: true,
        seriesIndex: [2],
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: ['#C9AB76', '#FFCF71', '#FFAF6F', '#FF9766', '#FF8366'],
          opacity: 0.5,
        },
        controller: {
          inRange: {
            opacity: 0.7,
          },
        },
      },
      calendar: [
        {
          left: 'center',
          top: 60,
          cellSize: [50, 50],
          yearLabel: { show: false },
          orient: 'vertical',
          dayLabel: {
            firstDay: 1,
            nameMap: ['日', '一', '二', '三', '四', '五', '六', '日'],
            height: 24,
            margin: 5,
            color: '#333',
            fontSize: 15,
            backgroundColor: 'rgba(186, 200, 212, 0.16)',
            padding: [0, 18, 4, 18],
          },
          splitLine: {
            show: false,
          },
          itemStyle: {
            borderWidth: 4,
            borderJoin: 'round',
            borderCap: 'round',
            borderColor: 'rgba(255, 255, 255, 1)',
            borderRadius: 6,
          },
          monthLabel: {
            show: false,
          },
          range: month,
        },
      ],
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 0,
          label: {
            show: true,
            formatter: function (params) {
              var d = params.value[0].split('-')[2];
              return '\n\n' + d + '\n' + params.value[2] + '\n\n';
            },
            color: '#333',
          },
          data: lunarData,
        },
        {
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 0,
          label: {
            show: false,
            formatter: function (params) {
              return '\n\n\n' + (params.value[3] || '');
            },
            fontSize: 14,
            fontWeight: 700,
            color: '#a00',
          },
          data: lunarData,
        },
        {
          name: '交通量',
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: calData,
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getCalendarOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
