import React, { useState, useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import geoJson from '@/assets/map/430700.json';
import styles from './index.less';
import mcar from '@/assets/map/mcar.png';
import gcar from '@/assets/map/gcar.png';
import startIcon from '@/assets/map/start.png';
import endIcon from '@/assets/map/end.png';
import stopIcon from '@/assets/map/stop.png';
import backIcon from '@/assets/map/back_icon.png';

let map = null;
let aMap = null;
let carGroup; //图层
let globalCars = []; //全部点
let globalTrailObj = {
  //行车轨迹：车，起点，终点，停留点，检测站，路线
  car: null,
  start: null,
  end: null,
  stop: [],
  trails: [],
};
let driving; //路线导航类

const Map = () => {
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  pageRef.current = page;
  const [cSite, setCSite] = useState({});
  const [trailInfo, setTrailInfo] = useState({});
  const [initZoom, setInitZoom] = useState(9.8);
  const [initCenter, setInitCenter] = useState([111.603411, 29.092615]);
  const carInfoRef = useRef();
  const trailInfoRef = useRef();
  const updateRef = useRef();

  const handleClick = (e) => {
    console.log('点击地图==>', e, map.getCenter(), map.getZoom());
  };

  useEffect(() => {
    AMapLoader.load({
      key: '64eedb9513761429b179c990faa0dbe2',
      version: '2.0',
      plugins: [
        'AMap.Driving',
        'AMap.MoveAnimation',
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
          rotateEnable: false,
          pitchEnable: true,
          mapStyle: 'amap://styles/darkblue',
        });
        console.log('map=>', map);

        // 绑定事件
        map.on('click', handleClick);

        // 构造路线导航类
        driving = new AMap.Driving({
          policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
          ferry: 0, // 是否可以使用轮渡
        });

        carGroup = new AMap.OverlayGroup();
        map.add(carGroup);

        map.on('zoomstart', () => {
          carInfoRef.current.style.display = 'none';
        });
        map.on('mapmove', () => {
          carInfoRef.current.style.display = 'none';
        });

        // 绘制地图
        drawAreas(map, AMap);
        drawCars(map, AMap);

        //定时请求数据
        let updateTimer = setInterval(() => {
          drawCars(map, aMap);
        }, 1000 * 60 * 5);
        updateRef.current = updateTimer;
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      //清除定时器
      if (updateRef.current) {
        clearInterval(updateRef.current);
      }
      clearMap();
    };
  }, []);

  // 清除地图
  const clearMap = () => {
    // 清除绘制的点位
    carGroup && map.remove(carGroup);
    clearTrailPage();
    map && map.destroy();
    map = null;
    aMap = null;
  };

  // 清除初始模式
  const clearPage0 = () => {
    carGroup.hide();
    carInfoRef.current.style.display = 'none';
    clearInterval(updateRef.current);
  };

  // 清除轨迹部分
  const clearTrailPage = () => {
    globalTrailObj.car && globalTrailObj.car.stopMove();
    globalTrailObj.car && map.remove(globalTrailObj.car);
    globalTrailObj.start && map.remove(globalTrailObj.start);
    globalTrailObj.end && map.remove(globalTrailObj.end);
    for (let i = 0; i < globalTrailObj.stop.length; i++) {
      globalTrailObj.stop[i] && map.remove(globalTrailObj.stop[i]);
    }
    for (let i = 0; i < globalTrailObj.trails.length; i++) {
      globalTrailObj.trails[i] && map.remove(globalTrailObj.trails[i]);
    }
    globalTrailObj = {
      car: null,
      start: null,
      end: null,
      stop: [],
      trails: [],
    };
  };

  // 画区县
  const drawAreas = async (map, AMap) => {
    geoJson.features.map((item, index) => {
      let pol = new AMap.Polygon({
        map,
        path: item.geometry.coordinates,
        strokeColor: '#138893',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.1,
        fillColor: '#138893',
        zIndex: 2,
      });
    });
  };

  // 画报警车
  const drawCars = async (map, AMap) => {
    carInfoRef.current.style.display = 'none';
    carGroup && carGroup.clearOverlays();
    let list = [
      {
        vehPlate: '京A12345',
        lon: '111.623942',
        lat: '29.086006',
      },
    ];
    list.map((item, index) => {
      let content = `<div class="${styles.ds} ${styles.M1}">
        <div><img src=${mcar} alt=""/></div>
        </div>`;
      let marker = new AMap.Marker({
        map,
        content,
        position: [Number(item.lon), Number(item.lat)],
        offset: [-30, -72],
        zIndex: 10,
        extData: item,
      });
      carGroup.addOverlays([marker]);
      globalCars.push(marker);
      //波纹
      content = `<div class="${styles.circleDs}">
          <div></div><div></div>
          </div>`;
      let circle = new AMap.Marker({
        map,
        content,
        position: [Number(item.lon), Number(item.lat)],
        offset: [-60, -60],
        zIndex: 5,
      });
      carGroup.addOverlays([circle]);
    });
    carGroup.on('click', showThisCar);
  };

  // 点击车辆
  const showThisCar = (e, type) => {
    if (type == 'inTrail') {
      map.setCenter(e.target._position, true);
      setTimeout(() => {
        // 转换经纬度为容器像素
        let lngLat = new aMap.LngLat(e.target._position[0], e.target._position[1]);
        let pixel = map.lngLatToContainer(lngLat);
        carInfoRef.current.style.top = pixel.round().y - 165 + 'px';
        carInfoRef.current.style.left = pixel.round().x + 42 + 'px';
        carInfoRef.current.style.display = 'block';
      }, 100);
      return;
    }
    setCSite(e.target._opts.extData);
    map.setCenter(e.target._opts.position, true);
    setTimeout(() => {
      // 转换经纬度为容器像素
      let lngLat = new aMap.LngLat(e.target._opts.position[0], e.target._opts.position[1]);
      let pixel = map.lngLatToContainer(lngLat);
      carInfoRef.current.style.top = pixel.round().y - 165 + 'px';
      carInfoRef.current.style.left = pixel.round().x + 42 + 'px';
      carInfoRef.current.style.display = 'block';
    }, 100);

    // 所有点重置为10
    for (let i = 0; i < globalCars.length; i++) {
      globalCars[i].setOptions({ zIndex: 10 });
    }
    e.target.setOptions({ zIndex: 15 });
  };

  // 进入行车轨迹
  const enterTrail = () => {
    //清除初始模式
    clearPage0();
    //进入行车轨迹
    setPage(1);
    let path = [
      {
        lon: '111.624074',
        lat: '29.090111',
      },
      {
        lon: '111.628678',
        lat: '29.10918',
      },
      {
        lon: '111.627976',
        lat: '29.118512',
        break: true, //轨迹中断，掉线
        startTime: '2022-03-25 12:00:00',
        endTime: '2022-03-25 14:00:00',
        lastTime: '2小时',
      },
      {
        lon: '111.616332',
        lat: '29.125835',
      },
      {
        lon: '111.602206',
        lat: '29.122215',
        stop: true, //停车
        startTime: '2022-03-25 15:00:00',
        endTime: '2022-03-25 16:00:00',
        lastTime: '1小时',
      },
      {
        lon: '111.584351',
        lat: '29.117982',
      },
    ];

    loopTrail(0, path, map, aMap, []);
  };

  const loopTrail = (index, path, map, AMap, routes) => {
    if (!map || !AMap) return;
    if (path[index + 1]) {
      if (path[index].break) {
        //轨迹中断
        loopTrail(index + 1, path, map, AMap, routes);
      } else {
        let breakTrail = (routes.length && [routes[routes.length - 1]]) || []; //中断路线
        // 根据起终点经纬度规划驾车导航路线
        driving.search(
          new AMap.LngLat(path[index]['lon'], path[index]['lat']),
          new AMap.LngLat(path[index + 1]['lon'], path[index + 1]['lat']),
          function (status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
              result.routes[0]?.steps.forEach((item, index) => {
                item.path.forEach((it, ind) => {
                  if (index == 0 && ind == 0) breakTrail.push([it.lng, it.lat]); //中断的终点
                  routes.push([it.lng, it.lat]);
                });
              });
              loopTrail(index + 1, path, map, AMap, routes);

              //在轨迹模式下
              if (pageRef.current) {
                //绘制中断路线
                if (breakTrail.length && path[index - 1] && path[index - 1].break) {
                  let polylineBlack = new AMap.Polyline({
                    //虚线的背景线，用来遮挡红线
                    map: map,
                    path: breakTrail,
                    showDir: false,
                    zIndex: 7,
                    strokeColor: '#000000', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 10, //线宽
                    strokeStyle: 'solid', //线样式
                    lineJoin: 'round', // 折线拐点连接处样式
                  });
                  let polyline = new AMap.Polyline({
                    map: map,
                    path: breakTrail,
                    showDir: false,
                    zIndex: 8,
                    strokeColor: '#FFA200', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 10, //线宽
                    strokeStyle: 'dashed', //线样式
                    lineJoin: 'round', // 折线拐点连接处样式
                    extData: path[index - 1],
                  });
                  globalTrailObj.trails.push(polylineBlack);
                  globalTrailObj.trails.push(polyline);

                  polyline.on('mousemove', (e) => {
                    setTrailInfo({
                      title: '中断轨迹',
                      lastTitle: '中断时长',
                      startTime: e.target._opts.extData.startTime,
                      endTime: e.target._opts.extData.endTime,
                      lastTime: e.target._opts.extData.lastTime,
                    });
                    // 转换经纬度为容器像素
                    let lngLat = new aMap.LngLat(e.lnglat.lng, e.lnglat.lat);
                    let pixel = map.lngLatToContainer(lngLat);
                    trailInfoRef.current.style.top = pixel.round().y - 128 + 'px';
                    trailInfoRef.current.style.left = pixel.round().x + 25 + 'px';
                    trailInfoRef.current.style.display = 'block';
                  });
                  polyline.on('mouseout', (e) => {
                    setTimeout(() => {
                      trailInfoRef.current.style.display = 'none';
                    }, 100);
                  });
                }

                //绘制停留点
                if (path[index].stop) {
                  let marker = new AMap.Marker({
                    map,
                    icon: new AMap.Icon({
                      size: new AMap.Size(60, 90), // 图标尺寸
                      image: stopIcon,
                      imageSize: new AMap.Size(60, 90), // 根据所设置的大小拉伸或压缩图片
                      imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
                    }),
                    position: [Number(path[index].lon), Number(path[index].lat)],
                    offset: [-30, -90],
                    zIndex: 8,
                    extData: path[index],
                  });
                  //波纹
                  let content = `<div class="${styles.circleStop}">
                    <div></div><div></div>
                    </div>`;
                  let circle = new AMap.Marker({
                    map,
                    content,
                    position: [Number(path[index].lon), Number(path[index].lat)],
                    offset: [-60, -60],
                    zIndex: 7,
                  });
                  globalTrailObj.stop.push(marker);
                  globalTrailObj.stop.push(circle);
                  marker.on('mousemove', (e) => {
                    setTrailInfo({
                      title: '停车点',
                      lastTitle: '停留时长',
                      startTime: e.target._opts.extData.startTime,
                      endTime: e.target._opts.extData.endTime,
                      lastTime: e.target._opts.extData.lastTime,
                    });
                    // 转换经纬度为容器像素
                    let lngLat = new aMap.LngLat(e.lnglat.lng, e.lnglat.lat);
                    let pixel = map.lngLatToContainer(lngLat);
                    trailInfoRef.current.style.top = pixel.round().y - 128 + 'px';
                    trailInfoRef.current.style.left = pixel.round().x + 25 + 'px';
                    trailInfoRef.current.style.display = 'block';
                  });
                  marker.on('mouseout', (e) => {
                    setTimeout(() => {
                      trailInfoRef.current.style.display = 'none';
                    }, 100);
                  });
                }
              }
            } else {
              console.error('获取驾车数据失败：' + result);
            }
          },
        );
      }
    } else {
      //在轨迹模式下
      if (routes.length && pageRef.current) {
        globalTrailObj.car = new AMap.Marker({
          map,
          icon: new AMap.Icon({
            size: new AMap.Size(40, 80), // 图标尺寸
            image: gcar,
            imageSize: new AMap.Size(40, 80), // 根据所设置的大小拉伸或压缩图片
            imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
          }),
          position: [Number(cSite.lon), Number(cSite.lat)],
          offset: [-20, -40],
          zIndex: 9,
        });
        globalTrailObj.car.on('click', (e) => showThisCar(e, 'inTrail'));
        // 绘制轨迹
        let polyline = new AMap.Polyline({
          map: map,
          path: routes,
          showDir: false,
          zIndex: 5,
          strokeColor: '#ED0000', //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 10, //线宽
          strokeStyle: 'solid', //线样式
          lineJoin: 'round', // 折线拐点连接处样式
        });
        globalTrailObj.trails.push(polyline);

        //绘制起始点
        globalTrailObj.start = new AMap.Marker({
          map,
          icon: new AMap.Icon({
            size: new AMap.Size(60, 90), // 图标尺寸
            image: startIcon,
            imageSize: new AMap.Size(60, 90), // 根据所设置的大小拉伸或压缩图片
            imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
          }),
          position: routes[0],
          offset: [-30, -90],
          zIndex: 8,
        });
        globalTrailObj.end = new AMap.Marker({
          map,
          icon: new AMap.Icon({
            size: new AMap.Size(60, 90), // 图标尺寸
            image: endIcon,
            imageSize: new AMap.Size(60, 90), // 根据所设置的大小拉伸或压缩图片
            imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
          }),
          position: routes[routes.length - 1],
          offset: [-30, -90],
          zIndex: 8,
        });

        // 动画
        let passedPolyline = new AMap.Polyline({
          map: map,
          showDir: true,
          zIndex: 5,
          strokeColor: '#ED0000',
          strokeOpacity: 0,
          strokeWeight: 10,
        });
        globalTrailObj.trails.push(passedPolyline);

        //自适应轨迹
        map.setFitView(globalTrailObj.trails, true);

        globalTrailObj.car.on('moving', function (e) {
          passedPolyline.setPath(e.passedPath);
          map.setCenter(e.target.getPosition(), false, 100);
        });
        globalTrailObj.car.moveAlong(routes, {
          // 每一段的时长
          duration: 50,
          // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
          autoRotation: true,
        });
      }
    }
  };

  // 返回初始页
  const backPage = () => {
    //清除轨迹部分
    clearTrailPage();
    // 恢复初始
    carGroup.show();
    setPage(0);
    //定时请求数据
    let updateTimer = setInterval(() => {
      drawCars(map, aMap);
    }, 1000 * 60 * 5);
    updateRef.current = updateTimer;
    map.setZoomAndCenter(initZoom, initCenter, false, 50);
  };

  return (
    <div className={styles.mapControl}>
      <div id={'container'} className={styles.mapContainer}></div>
      <div className={styles.carInfo} ref={carInfoRef}>
        <p>{cSite.vehPlate}</p>
        <div>
          <div>
            <div>
              <p>
                <span>车牌类型：</span>
                <span>货车</span>
              </p>
              <p>
                <span>道路运输证号：</span>
                <span>632801015452</span>
              </p>
              <p>
                <span>运营状态：</span>
                <span>营运</span>
              </p>
              <p>
                <span>业户名称：</span>
                <span title={'新型建材科技有限公司'}>新型建材科技有限公司</span>
              </p>
            </div>
            <div>
              {page ? (
                <span className={styles.cantClick}>行车轨迹</span>
              ) : (
                <span onClick={enterTrail}>行车轨迹</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.trailInfo} ref={trailInfoRef}>
        <p>{trailInfo.title}</p>
        <div>
          <p>
            <span>开始时间：</span>
            <span>{trailInfo.startTime}</span>
          </p>
          <p>
            <span>结束时间：</span>
            <span>{trailInfo.endTime}</span>
          </p>
          <p>
            <span>{trailInfo.lastTitle + '：'}</span>
            <span>{trailInfo.lastTime}</span>
          </p>
        </div>
      </div>
      <div
        className={styles.backPage}
        onClick={backPage}
        style={{ display: page ? 'flex' : 'none' }}
      >
        <img src={backIcon} alt="" />
        <span>退出轨迹</span>
      </div>
    </div>
  );
};

export default Map;
