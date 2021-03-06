import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import 'echarts-wordcloud';

export default () => {
  const getCloudOption = () => {
    let maskImage = new Image();
    maskImage.src =
      'data:image/png;base64,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';
    return {
      backgroundColor: '#fff',
      tooltip: {
        show: false,
      },
      series: [
        {
          type: 'wordCloud',
          gridSize: 5, //?????????
          sizeRange: [12, 50], //????????????
          rotationRange: [-45, 90], //?????????????????????
          rotationStep: 45, //????????????
          // shape: 'pentagon',//???????????????circle
          width: '100%',
          height: '100%',
          drawOutOfBound: false, //????????????????????????????????????
          textStyle: {
            color: function () {
              return (
                'rgb(' +
                Math.round(Math.random() * 255) +
                ', ' +
                Math.round(Math.random() * 255) +
                ', ' +
                Math.round(Math.random() * 255) +
                ')'
              );
            },
          },
          maskImage: maskImage,
          data: [
            {
              name: '????????????',
              value: 1446,
            },
            {
              name: '??????',
              value: 928,
            },
            {
              name: '??????',
              value: 906,
            },
            {
              name: '??????',
              value: 825,
            },
            {
              name: 'Lover Boy 88',
              value: 514,
            },
            {
              name: '??????',
              value: 486,
            },
            {
              name: '??????',
              value: 53,
            },
            {
              name: '??????',
              value: 163,
            },
            {
              name: '????????????',
              value: 86,
            },
            {
              name: '????????????',
              value: 17,
            },
            {
              name: '????????????',
              value: 6,
            },
            {
              name: '??????????????????',
              value: 1,
            },
            {
              name: '??????',
              value: 1437,
            },
            {
              name: '????????????',
              value: 422,
            },
            {
              name: '????????????',
              value: 353,
            },
            {
              name: '??????',
              value: 331,
            },
            {
              name: '????????????',
              value: 313,
            },
            {
              name: '????????????',
              value: 307,
            },
            {
              name: '??????',
              value: 43,
            },
            {
              name: '????????????',
              value: 15,
            },
            {
              name: '????????????',
              value: 438,
            },
            {
              name: '????????????',
              value: 957,
            },
            {
              name: '?????????',
              value: 927,
            },
            {
              name: '??????????????????',
              value: 908,
            },
            {
              name: '??????',
              value: 693,
            },
            {
              name: '????????????',
              value: 611,
            },
            {
              name: '??????????????????',
              value: 512,
            },
            {
              name: '?????????',
              value: 382,
            },
            {
              name: '????????????',
              value: 312,
            },
            {
              name: '????????????',
              value: 187,
            },
            {
              name: '????????????',
              value: 163,
            },
            {
              name: '?????????',
              value: 104,
            },
            {
              name: '???????????????',
              value: 3,
            },
            {
              name: '?????????',
              value: 1331,
            },
            {
              name: '???????????????',
              value: 941,
            },
            {
              name: '??????????????????',
              value: 585,
            },
            {
              name: '????????????',
              value: 473,
            },
            {
              name: '????????????',
              value: 358,
            },
            {
              name: '??????',
              value: 246,
            },
            {
              name: 'K12????????????',
              value: 207,
            },
            {
              name: '????????????',
              value: 194,
            },
            {
              name: '????????????',
              value: 104,
            },
            {
              name: 'IT??????',
              value: 87,
            },
            {
              name: '??????????????????',
              value: 63,
            },
            {
              name: '??????',
              value: 48,
            },
            {
              name: '????????????',
              value: 23,
            },
            {
              name: '????????????',
              value: 5,
            },
            {
              name: '????????????',
              value: 1328,
            },
            {
              name: '??????',
              value: 765,
            },
            {
              name: '??????',
              value: 452,
            },
            {
              name: '??????',
              value: 415,
            },
            {
              name: '??????',
              value: 253,
            },
            {
              name: '??????',
              value: 211,
            },
            {
              name: '?????????',
              value: 180,
            },
            {
              name: '??????',
              value: 138,
            },
            {
              name: 'P2P',
              value: 116,
            },
            {
              name: '?????????',
              value: 98,
            },
            {
              name: '??????',
              value: 93,
            },
            {
              name: '????????????',
              value: 92,
            },
            {
              name: '??????',
              value: 90,
            },
            {
              name: '??????',
              value: 76,
            },
            {
              name: '??????',
              value: 76,
            },
            {
              name: '?????????',
              value: 40,
            },
            {
              name: '????????????',
              value: 36,
            },
            {
              name: '????????????',
              value: 30,
            },
            {
              name: '??????',
              value: 7,
            },
            {
              name: '????????????',
              value: 1,
            },
            {
              name: '??????',
              value: 1309,
            },
            {
              name: '????????????',
              value: 965,
            },
            {
              name: '????????????',
              value: 900,
            },
            {
              name: '????????????',
              value: 727,
            },
            {
              name: '????????????',
              value: 461,
            },
            {
              name: '?????????',
              value: 309,
            },
            {
              name: '????????????',
              value: 260,
            },
            {
              name: '???????????????',
              value: 173,
            },
            {
              name: '????????????',
              value: 155,
            },
            {
              name: '????????????',
              value: 136,
            },
            {
              name: '??????',
              value: 121,
            },
            {
              name: '????????????',
              value: 76,
            },
            {
              name: '????????????',
              value: 62,
            },
            {
              name: '????????????',
              value: 37,
            },
            {
              name: '????????????',
              value: 32,
            },
            {
              name: '????????????',
              value: 28,
            },
            {
              name: '????????????',
              value: 4,
            },
            {
              name: '????????????',
              value: 1275,
            },
            {
              name: '????????????',
              value: 1088,
            },
            {
              name: '??????????????????',
              value: 907,
            },
            {
              name: '??????',
              value: 837,
            },
            {
              name: '??????',
              value: 201,
            },
            {
              name: '??????',
              value: 195,
            },
            {
              name: '??????APP??????',
              value: 179,
            },
            {
              name: '????????????',
              value: 119,
            },
            {
              name: '??????',
              value: 43,
            },
            {
              name: '????????????',
              value: 1234,
            },
            {
              name: '??????????????????',
              value: 802,
            },
            {
              name: '????????????',
              value: 405,
            },
            {
              name: '???????????????',
              value: 337,
            },
            {
              name: '????????????',
              value: 199,
            },
            {
              name: '???????????????',
              value: 78,
            },
            {
              name: '????????????',
              value: 77,
            },
            {
              name: '????????????',
              value: 36,
            },
            {
              name: '????????????',
              value: 29,
            },
            {
              name: '???????????????',
              value: 3,
            },
            {
              name: '????????????',
              value: 1201,
            },
            {
              name: '????????????',
              value: 508,
            },
            {
              name: '????????????',
              value: 147,
            },
            {
              name: '????????????',
              value: 125,
            },
            {
              name: '????????????',
              value: 115,
            },
            {
              name: '????????????',
              value: 101,
            },
            {
              name: '????????????',
              value: 66,
            },
            {
              name: '????????????',
              value: 32,
            },
            {
              name: '??????',
              value: 22,
            },
            {
              name: '????????????',
              value: 9,
            },
            {
              name: '????????????',
              value: 8,
            },
            {
              name: '????????????',
              value: 2,
            },
            {
              name: '????????????',
              value: 2,
            },
            {
              name: '????????????',
              value: 1,
            },
            {
              name: '????????????',
              value: 1169,
            },
            {
              name: '??????',
              value: 412,
            },
            {
              name: '??????',
              value: 393,
            },
            {
              name: '??????',
              value: 230,
            },
            {
              name: '????????????',
              value: 211,
            },
            {
              name: '??????',
              value: 207,
            },
            {
              name: '??????',
              value: 139,
            },
            {
              name: 'DIY??????',
              value: 75,
            },
            {
              name: '??????',
              value: 23,
            },
            {
              name: '??????',
              value: 21,
            },
            {
              name: '????????????',
              value: 17,
            },
            {
              name: 'KTV',
              value: 6,
            },
            {
              name: '??????',
              value: 5,
            },
            {
              name: '??????',
              value: 4,
            },
            {
              name: '??????',
              value: 1,
            },
            {
              name: '??????CS',
              value: 1,
            },
            {
              name: '??????',
              value: 1,
            },
            {
              name: '????????????',
              value: 1111,
            },
            {
              name: '??????',
              value: 885,
            },
            {
              name: '??????',
              value: 543,
            },
            {
              name: '?????????',
              value: 321,
            },
            {
              name: '??????????????????',
              value: 253,
            },
            {
              name: '????????????',
              value: 162,
            },
            {
              name: '????????????',
              value: 149,
            },
            {
              name: '????????????',
              value: 133,
            },
            {
              name: '??????????????????',
              value: 113,
            },
            {
              name: '????????????',
              value: 67,
            },
            {
              name: '????????????',
              value: 54,
            },
            {
              name: '????????????',
              value: 45,
            },
            {
              name: '??????????????????',
              value: 22,
            },
            {
              name: '????????????',
              value: 1047,
            },
            {
              name: '??????',
              value: 566,
            },
            {
              name: '??????',
              value: 289,
            },
            {
              name: '???',
              value: 184,
            },
            {
              name: '??????',
              value: 168,
            },
            {
              name: '?????????',
              value: 137,
            },
            {
              name: '????????????',
              value: 1041,
            },
            {
              name: '????????????',
              value: 505,
            },
            {
              name: '????????????',
              value: 299,
            },
            {
              name: '??????',
              value: 103,
            },
            {
              name: '????????????',
              value: 66,
            },
            {
              name: '????????????',
              value: 41,
            },
            {
              name: '????????????',
              value: 271,
            },
            {
              name: '????????????',
              value: 30,
            },
            {
              name: '??????????????????',
              value: 25,
            },
            {
              name: '???????????????',
              value: 16,
            },
            {
              name: '????????????',
              value: 15,
            },
            {
              name: '????????????',
              value: 12,
            },
            {
              name: '????????????',
              value: 9,
            },
            {
              name: '??????',
              value: 8,
            },
            {
              name: '????????????',
              value: 1,
            },
            {
              name: '??????????????????',
              value: 1,
            },
            {
              name: '????????????',
              value: 1018,
            },
            {
              name: '????????????',
              value: 896,
            },
            {
              name: '????????????',
              value: 440,
            },
            {
              name: '????????????',
              value: 365,
            },
            {
              name: '????????????',
              value: 256,
            },
            {
              name: '????????????',
              value: 214,
            },
            {
              name: '????????????',
              value: 39,
            },
            {
              name: '????????????',
              value: 28,
            },
            {
              name: '????????????',
              value: 23,
            },
            {
              name: '????????????',
              value: 14,
            },
            {
              name: '??????',
              value: 946,
            },
            {
              name: '????????????',
              value: 565,
            },
            {
              name: 'PC??????',
              value: 353,
            },
            {
              name: '????????????',
              value: 254,
            },
            {
              name: '?????????',
              value: 188,
            },
            {
              name: '????????????',
              value: 166,
            },
            {
              name: '????????????',
              value: 942,
            },
            {
              name: '?????????',
              value: 177,
            },
            {
              name: '??????',
              value: 133,
            },
            {
              name: '??????',
              value: 80,
            },
            {
              name: '??????',
              value: 50,
            },
            {
              name: '????????????',
              value: 46,
            },
            {
              name: '??????',
              value: 26,
            },
            {
              name: 'SPA??????',
              value: 21,
            },
            {
              name: '????????????',
              value: 914,
            },
            {
              name: '????????????',
              value: 311,
            },
            {
              name: '???',
              value: 257,
            },
            {
              name: '????????????',
              value: 131,
            },
            {
              name: '??????',
              value: 125,
            },
            {
              name: '???',
              value: 122,
            },
            {
              name: '??????',
              value: 81,
            },
            {
              name: '???',
              value: 67,
            },
            {
              name: '????????????',
              value: 41,
            },
            {
              name: '????????????',
              value: 26,
            },
            {
              name: '????????????',
              value: 913,
            },
            {
              name: '????????????',
              value: 483,
            },
            {
              name: '????????????',
              value: 128,
            },
            {
              name: '??????',
              value: 105,
            },
            {
              name: '????????????',
              value: 77,
            },
            {
              name: '????????????',
              value: 22,
            },
            {
              name: '????????????',
              value: 907,
            },
            {
              name: '????????????',
              value: 644,
            },
            {
              name: '??????',
              value: 273,
            },
            {
              name: '????????????',
              value: 187,
            },
            {
              name: '????????????????????????',
              value: 140,
            },
            {
              name: '??????',
              value: 107,
            },
            {
              name: '??????',
              value: 47,
            },
            {
              name: '??????',
              value: 43,
            },
            {
              name: '????????????',
              value: 29,
            },
            {
              name: '??????????????????',
              value: 10,
            },
            {
              name: '????????????',
              value: 883,
            },
            {
              name: '????????????',
              value: 536,
            },
            {
              name: '????????????',
              value: 108,
            },
            {
              name: '????????????',
              value: 49,
            },
            {
              name: '????????????',
              value: 38,
            },
            {
              name: '????????????',
              value: 37,
            },
            {
              name: '????????????',
              value: 24,
            },
            {
              name: '????????????',
              value: 24,
            },
            {
              name: '????????????',
              value: 3,
            },
            {
              name: '????????????',
              value: 3,
            },
            {
              name: '????????????',
              value: 1,
            },
            {
              name: '????????????',
              value: 874,
            },
            {
              name: '??????',
              value: 363,
            },
            {
              name: '????????????',
              value: 162,
            },
            {
              name: '????????????',
              value: 50,
            },
            {
              name: '??????',
              value: 21,
            },
            {
              name: '????????????',
              value: 20,
            },
            {
              name: '??????',
              value: 16,
            },
            {
              name: '????????????',
              value: 10,
            },
            {
              name: '????????????',
              value: 789,
            },
            {
              name: '??????',
              value: 316,
            },
            {
              name: '??????',
              value: 303,
            },
            {
              name: '??????',
              value: 196,
            },
            {
              name: '??????',
              value: 93,
            },
            {
              name: '????????????',
              value: 47,
            },
            {
              name: '??????',
              value: 32,
            },
            {
              name: '??????',
              value: 90,
            },
          ],
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getCloudOption()}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
