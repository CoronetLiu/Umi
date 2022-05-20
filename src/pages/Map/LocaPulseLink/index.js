import React, { useState, useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import geoJson from '@/assets/map/430700.json';
import styles from './index.less';
import locaIcon from '@/assets/map/loca_icon.svg';

let map = null;
let aMap = null;
let loca;
let locaLayer;
let colors = [
  '#ff6c48',
  '#e2865a',
  '#c28c62',
  '#f1ce8a',
  '#fff380',
  '#d9ff80',
  '#92d475',
  '#71efb4',
  '#6ca3ce',
];

const Map = () => {
  const [initZoom, setInitZoom] = useState(9.8);
  const [initCenter, setInitCenter] = useState([111.603411, 29.092615]);

  const handleClick = (e) => {
    console.log('点击地图==>', e, map.getCenter(), map.getZoom());
  };

  useEffect(() => {
    AMapLoader.load({
      key: '64eedb9513761429b179c990faa0dbe2',
      version: '2.0',
      Loca: {
        version: '2.0.0',
      },
      plugins: [
        'AMap.DistrictSearch',
        'AMap.Polygon',
        'AMap.OverlayGroup',
        'AMap.Marker',
        'AMap.Icon',
        'AMap.Size',
        'AMap.LngLat',
      ], //插件列表
    })
      .then((AMap) => {
        aMap = AMap;
        map = new AMap.Map('container', {
          zoom: initZoom,
          center: initCenter,
          showLabel: false, //不显示地图文字标记
          pitch: 58,
          rotation: 0,
          viewMode: '3D', //开启3D视图,默认为关闭
          rotateEnable: true,
          pitchEnable: true,
          features: ['bg', 'road'],
          mapStyle: 'amap://styles/darkblue',
        });
        console.log('map=>', map);

        // 绑定事件
        map.on('click', handleClick);

        // 创建 Loca 实例
        loca = new Loca.Container({
          map: map,
        });

        // 绘制3D地图
        // draw3DMap(map, AMap);

        // 绘制流向图
        drawOD(map, AMap);

        // 绘制边界地图
        drawQHS(map, AMap);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      clearMap();
    };
  }, []);

  // 清除地图
  const clearMap = () => {
    // 清除绘制的点位
    map && map.destroy();
    map = null;
    aMap = null;
  };

  const draw3DMap = (map, AMap) => {
    locaLayer = new Loca.PolygonLayer({
      map: map,
      opacity: 0.3,
      zIndex: 2,
      hasSide: true,
    });
    let source = new Loca.GeoJSONSource({
      data: geoJson,
    });
    locaLayer.setSource(source);
    locaLayer.setStyle({
      height: 4000,
      topColor: (index, feature) => {
        return colors[index];
      },
      sideTopColor: 'rgba(8,228,248, 1)',
      sideBottomColor: 'rgba(8,228,248,1)',
    });
    loca.add(locaLayer);
    map.on('mousemove', (e) => {
      let feat = locaLayer.queryFeature(e.pixel.toArray());
      if (feat) {
        locaLayer.setStyle({
          height: (index, feature) => {
            if (feature == feat) {
              return 7000;
            }
            return 4000;
          },
          topColor: (index, feature) => {
            return colors[index];
          },
          sideTopColor: 'rgba(8,228,248, 1)',
          sideBottomColor: 'rgba(8,228,248,1)',
        });
      }
    });
  };

  const drawOD = (map, AMap) => {
    let pointGeo = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: geoJson.features.map((item) => {
          return {
            type: 'Feature',
            properties: {
              name: item.properties.name,
              centroid: item.properties.centroid,
            },
            geometry: {
              type: 'Point',
              coordinates: item.properties.centroid,
            },
          };
        }),
      },
    });

    // 文字主体图层
    let zMarker = new Loca.ZMarkerLayer({
      loca: loca,
      zIndex: 20,
      zooms: [2, 20],
    });
    zMarker.setSource(pointGeo);
    zMarker.setStyle({
      content: (i, feat) => {
        let props = feat.properties;
        let leftColor = 'rgba(33,33,33,0.8)';
        let rightColor = 'rgba(172, 137, 51, 0.5)';
        let borderColor = 'rgba(172, 137, 51, 1)';
        return (
          '<div style="width: 400px; height: 200px;padding: 0;">' +
          '<p style="line-height:120px;font-size:50px;' +
          'background-image: linear-gradient(to right, ' +
          leftColor +
          ',' +
          rightColor +
          ',' +
          leftColor +
          ');' +
          'border:4px solid ' +
          borderColor +
          '; color:#fff; border-radius: 10px; text-align:center;">' +
          props['name'] +
          '</p></div>'
        );
      },
      unit: 'meter',
      rotation: 0,
      alwaysFront: true,
      size: [12000, 6000],
      altitude: 2000,
    });

    // 浮动三角
    let triangleZMarker = new Loca.ZMarkerLayer({
      loca: loca,
      zIndex: 20,
      zooms: [2, 20],
    });
    triangleZMarker.setSource(pointGeo);
    triangleZMarker.setStyle({
      content: (i, feat) => {
        return (
          '<div style="width: 500px;height: 500px;padding:0;' +
          'background: url(' +
          locaIcon +
          ');background-size:contain;"></div>'
        );
      },
      unit: 'meter',
      rotation: 0,
      alwaysFront: true,
      size: [2000, 2000],
      altitude: 500,
    });
    triangleZMarker.addAnimate({
      key: 'altitude',
      value: [0, 1],
      random: true,
      transform: 1000,
      delay: 1000,
      yoyo: true,
      repeat: 999999,
    });

    // 呼吸点
    let scatter = new Loca.ScatterLayer({
      loca,
      zIndex: 18,
      opacity: 1,
      visible: true,
      zooms: [2, 20],
      depth: false,
    });
    scatter.setSource(pointGeo);
    scatter.setStyle({
      unit: 'meter',
      size: [3000, 3000],
      texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
      altitude: 0,
      duration: 2000,
      animate: true,
    });

    // 弧线
    let pulseLink = new Loca.PulseLinkLayer({
      zIndex: 30,
      opacity: 1,
      visible: true,
      zooms: [2, 20],
      depth: true,
    });
    let geo = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: geoJson.features.map((item) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [initCenter, item.properties.centroid],
            },
          };
        }),
      },
    });
    pulseLink.setSource(geo);
    pulseLink.setStyle({
      unit: 'meter',
      dash: [4000, 0, 4000, 0],
      lineWidth: function () {
        return [800, 300];
      },
      height: function (index, feat) {
        return feat.distance / 3 + 10;
      },
      altitude: 0,
      smoothSteps: 30,
      speed: function (index, prop) {
        return 1000 + Math.random() * 20000;
      },
      flowLength: 10000,
      lineColors: function (index, feat) {
        return ['rgb(226,202,93)', 'rgb(255,164,105)', 'rgb(205,76,44)'];
      },
      maxHeightScale: 0.3, // 弧顶位置比例
      headColor: 'rgba(255, 255, 0, 1)',
      trailColor: 'rgba(255, 255,0,0)',
    });
    loca.add(pulseLink);
    loca.animate.start();
  };

  // 画行政区
  const drawQHS = (map, AMap) => {
    let district = new AMap.DistrictSearch({
      subdistrict: 0, //获取边界不需要返回下级行政区
      extensions: 'all', //返回行政区边界坐标组等具体信息
      level: 'district', //查询行政级别为 市
    });
    district.search('430700', function (status, result) {
      // console.log('省份图层=>', status, result)
      let polygons = [];
      let bounds = result.districtList && result.districtList[0].boundaries;
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          let polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: bounds[i],
            fillOpacity: 0.1,
            fillColor: '#138893',
            strokeColor: '#138893',
            strokeOpacity: 1,
            bubble: true,
            zIndex: 1,
          });
          polygons.push(polygon);
        }
      }
      map.add(polygons);
    });

    // 隐藏外部区域
    // district.search('430700', function (status, result) {
    //   // console.log('省份图层=>', status, result)
    //   let outer = [
    //     new AMap.LngLat(-360, 90, true),
    //     new AMap.LngLat(-360, -90, true),
    //     new AMap.LngLat(360, -90, true),
    //     new AMap.LngLat(360, 90, true),
    //   ];
    //   let bounds = result.districtList && result.districtList[0].boundaries;
    //   let pathArray = [
    //     outer
    //   ];
    //   pathArray.push.apply(pathArray, bounds)
    //   let polygon = new AMap.Polygon({
    //     strokeWeight: 1,
    //     path: pathArray,
    //     fillOpacity: 0.8,
    //     fillColor: '#000000',
    //     strokeColor: '#138893',
    //     strokeOpacity: 0,
    //     zIndex: 10,
    //   });
    //   map.add(polygon)
    // });
  };

  return (
    <div className={styles.mapControl}>
      <div id={'container'} className={styles.mapContainer}></div>
    </div>
  );
};

export default Map;
