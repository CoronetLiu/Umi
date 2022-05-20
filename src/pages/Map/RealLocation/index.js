import React, { useState, useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import geoJson from '@/assets/map/430700.json';
import styles from './index.less';
import videoIcon from '@/assets/map/video.png';
import callIcon from '@/assets/map/call.png';
import cameraIcon from '@/assets/map/camera.png';
import mcar from '@/assets/map/mcar.png';
import gcar from '@/assets/map/gcar.png';
import people from '@/assets/map/people.png';
import backIcon from '@/assets/map/back_icon.png';

let map = null;
let aMap = null;
let carGroup, peopleGroup; //车图层   人图层
let globalCars = [],
  globalPeople = []; //全部车   全部人
let globalCar,
  globalCircle,
  globalPolyline = []; //调度车，波纹，轨迹线

let driving; //路线导航类

let time = 0; // TODO 演示
let _pathList = [
  [111.603411, 29.092615],
  [111.598792, 29.089359],
  [111.597231, 29.089454],
  [111.595081, 29.087138],
  [111.591789, 29.08447],
  [111.589716, 29.082213],
];

const Map = () => {
  const [page, setPage] = useState(0);
  const [cSite, setCSite] = useState({});
  const [cPeople, setCPeople] = useState({});
  const [startLocation, setStartLocation] = useState([]);
  const startLocationRef = useRef([]);
  startLocationRef.current = startLocation;
  const [initZoom, setInitZoom] = useState(9.8);
  const [initCenter, setInitCenter] = useState([111.603411, 29.092615]);
  const carInfoRef = useRef();
  const peopleInfoRef = useRef();
  const updateRef = useRef();
  const locationInterval = useRef();

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
        peopleGroup = new AMap.OverlayGroup();
        map.add(carGroup);
        map.add(peopleGroup);

        map.on('zoomstart', () => {
          carInfoRef.current.style.display = 'none';
          peopleInfoRef.current.style.display = 'none';
        });
        map.on('mapmove', () => {
          carInfoRef.current.style.display = 'none';
          peopleInfoRef.current.style.display = 'none';
        });

        // 绘制地图
        drawAreas(map, AMap);
        drawCars(map, AMap);
        drawPeople(map, AMap);

        //定时请求数据
        let updateTimer = setInterval(() => {
          drawCars(map, aMap);
          drawPeople(map, aMap);
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
      if (locationInterval.current) {
        clearInterval(locationInterval.current);
      }
      clearMap();
      //重置数据
      time = 0; // TODO 演示
    };
  }, []);

  // 清除地图
  const clearMap = () => {
    // 清除绘制的点位
    carGroup && map.remove(carGroup);
    peopleGroup && map.remove(peopleGroup);
    globalCar && map.remove(globalCar);
    globalCircle && map.remove(globalCircle);
    for (let i = 0; i < globalPolyline.length; i++) {
      globalPolyline[i] && map.remove(globalPolyline[i]);
    }
    globalCars = [];
    globalPeople = [];
    map && map.destroy();
    map = null;
    aMap = null;
  };

  // 清除初始模式
  const clearPage0 = () => {
    carGroup.hide();
    peopleGroup.hide();
    clearInterval(updateRef.current);
    carInfoRef.current.style.display = 'none';
    peopleInfoRef.current.style.display = 'none';
  };

  // 清除调度部分
  const clearDispatchPage = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
    }
    globalCar && globalCar.stopMove();
    globalCircle && globalCircle.stopMove();
    globalCar && map.remove(globalCar);
    globalCircle && map.remove(globalCircle);
    for (let i = 0; i < globalPolyline.length; i++) {
      globalPolyline[i] && map.remove(globalPolyline[i]);
    }
    time = 0; // TODO 演示
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

  // 画人员
  const drawPeople = async (map, AMap) => {
    peopleInfoRef.current.style.display = 'none';
    peopleGroup && peopleGroup.clearOverlays();
    let list = [
      {
        name: '张三',
        lon: '111.598756',
        lat: '29.089427',
      },
    ];
    list.map((item, index) => {
      let marker = new AMap.Marker({
        map,
        icon: new AMap.Icon({
          size: new AMap.Size(30, 40), // 图标尺寸
          image: people,
          imageSize: new AMap.Size(30, 40), // 根据所设置的大小拉伸或压缩图片
          imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
        }),
        position: [Number(item.lon), Number(item.lat)],
        offset: [-15, -20],
        zIndex: 10,
        extData: item,
      });
      peopleGroup.addOverlays([marker]);
      globalPeople.push(marker);
    });
    peopleGroup.on('click', showThisPeople);
  };

  // 点击车辆
  const showThisCar = (e, type) => {
    peopleInfoRef.current.style.display = 'none';
    if (type == 'inDispatch') {
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

    // 所有车和人都重置为10
    for (let i = 0; i < globalCars.length; i++) {
      globalCars[i].setOptions({ zIndex: 10 });
    }
    for (let i = 0; i < globalPeople.length; i++) {
      globalPeople[i].setOptions({ zIndex: 10 });
    }
    e.target.setOptions({ zIndex: 15 });
  };

  // 点击人员
  const showThisPeople = (e, type) => {
    setCPeople(e.target._opts.extData);
    carInfoRef.current.style.display = 'none';
    setTimeout(() => {
      // 转换经纬度为容器像素
      let lngLat = new aMap.LngLat(e.target._opts.position[0], e.target._opts.position[1]);
      let pixel = map.lngLatToContainer(lngLat);
      peopleInfoRef.current.style.top = pixel.round().y - 130 + 'px';
      peopleInfoRef.current.style.left = pixel.round().x + 28 + 'px';
      peopleInfoRef.current.style.display = 'block';
    }, 10);

    // 所有车和人都重置为10
    for (let i = 0; i < globalCars.length; i++) {
      globalCars[i].setOptions({ zIndex: 10 });
    }
    for (let i = 0; i < globalPeople.length; i++) {
      globalPeople[i].setOptions({ zIndex: 10 });
    }
    e.target.setOptions({ zIndex: 15 });
  };

  // 进入指挥调度
  const enterDispatch = () => {
    //清除初始模式
    clearPage0();
    // 进入指挥调度
    peopleGroup.show();
    setPage(1);
    map.setZoomAndCenter(16, [cSite.lon, cSite.lat], false, 100);
    let AMap = aMap;
    globalCar = new AMap.Marker({
      map,
      icon: new AMap.Icon({
        size: new AMap.Size(40, 80), // 图标尺寸
        image: gcar,
        imageSize: new AMap.Size(40, 80), // 根据所设置的大小拉伸或压缩图片
        imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
      }),
      position: [Number(cSite.lon), Number(cSite.lat)],
      offset: [-20, -40],
      zIndex: 8,
    });
    globalCar.on('click', (e) => showThisCar(e, 'inDispatch'));
    //波纹
    let content = `<div class="${styles.circleWarn}">
          <div></div><div></div><div></div>
          </div>`;
    globalCircle = new AMap.Marker({
      map,
      content,
      position: [Number(cSite.lon), Number(cSite.lat)],
      offset: [-120, -120],
      zIndex: 5,
    });

    //定时查询车辆实时定位
    getCarLocationFn([Number(cSite.lon), Number(cSite.lat)]);
    let timer = setInterval(() => {
      if (time > 5) {
        // TODO 演示
        clearInterval(locationInterval.current);
        return;
      }
      // 重新设置polyline的颜色
      for (let i = 0; i < globalPolyline.length; i++) {
        globalPolyline[i].setOptions({ strokeOpacity: 1, showDir: true });
      }
      //设置完成

      //请求当前位置
      getCarLocationFn();
    }, 10000);
    locationInterval.current = timer;
  };

  const getCarLocationFn = async (o) => {
    let start = o ? o : startLocationRef.current;
    loopDispatch(start, _pathList[time], map, aMap);
    time++; // TODO 演示
  };

  // 循环画轨迹
  const loopDispatch = (start, end, map, AMap) => {
    if (!map || !AMap) return;
    // 根据起终点经纬度规划驾车导航路线
    driving.search(
      new AMap.LngLat(start[0], start[1]),
      new AMap.LngLat(end[0], end[1]),
      function (status, result) {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          let routes = [];
          result.routes[0]?.steps.forEach((item, index) => {
            item.path.forEach((it, ind) => {
              routes.push([it.lng, it.lat]);
            });
          });
          if (routes.length) {
            setStartLocation(routes[routes.length - 1]);

            // 绘制轨迹
            let polyline = new AMap.Polyline({
              map: map,
              path: routes,
              showDir: false,
              strokeColor: '#0696c0', //线颜色
              strokeOpacity: 0, //线透明度
              strokeWeight: 10, //线宽
              strokeStyle: 'solid', //线样式
              lineJoin: 'round', // 折线拐点连接处样式
            });
            globalPolyline.push(polyline);

            // 动画
            let passedPolyline = new AMap.Polyline({
              map: map,
              strokeColor: '#0696c0',
              strokeOpacity: 1,
              strokeWeight: 10,
              showDir: true,
            });
            globalPolyline.push(passedPolyline);
            globalCar.on('moving', function (e) {
              passedPolyline.setPath(e.passedPath);
              map.setCenter(e.target.getPosition(), false, 100);
            });
            globalCar.moveAlong(routes, {
              // 每一段的时长
              duration: 50,
              // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
              autoRotation: true,
            });
            globalCircle.moveAlong(routes, {
              // 每一段的时长
              duration: 50,
              // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
              autoRotation: true,
            });
          }
        } else {
          console.error('获取驾车数据失败：' + result);
        }
      },
    );
  };

  // 返回初始页
  const backPage = () => {
    //清除调度部分
    clearDispatchPage();
    // 恢复初始
    carGroup.show();
    peopleGroup.show();
    setPage(0);
    //定时请求数据
    let updateTimer = setInterval(() => {
      drawCars(map, aMap);
      drawPeople(map, aMap);
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
              {/*在调度模式下不可重复点击*/}
              {page ? (
                <span className={styles.cantClick}>实时调度</span>
              ) : (
                <span onClick={enterDispatch}>实时调度</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.peopleInfo} ref={peopleInfoRef}>
        <p>
          {cPeople.name}
          <span>
            <img src={cameraIcon} alt="" />
            <span>执法记录仪</span>
          </span>
        </p>
        <div>
          <div>
            <p>
              <span>当前状态：</span>
              <span>巡查</span>
            </p>
            <p>
              <span>所属单位：</span>
              <span>常德市公路路政支队</span>
            </p>
            <p>
              <span>人员岗位：</span>
              <span>流动稽查人员</span>
            </p>
            <p>
              <span>负责片区：</span>
              <span>武陵区光明路东路</span>
            </p>
            <p>
              <span>更新时间：</span>
              <span>2022/02/14 12:20:30</span>
            </p>
          </div>
          <div>
            <span>
              <img src={callIcon} alt="" />
              <span>语音呼叫</span>
            </span>
            <span>
              <img src={videoIcon} alt="" />
              <span>视频呼叫</span>
            </span>
          </div>
        </div>
      </div>
      <div
        className={styles.backPage}
        onClick={backPage}
        style={{ display: page ? 'flex' : 'none' }}
      >
        <img src={backIcon} alt="" />
        <span>退出调度</span>
      </div>
    </div>
  );
};

export default Map;
