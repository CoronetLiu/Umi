import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Input, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import startIcon from '@/assets/map/start.png';
import endIcon from '@/assets/map/end.png';
import carIcon from '@/assets/map/car.png';
import busIcon from '@/assets/map/bus.png';
import walkIcon from '@/assets/map/walk.png';
import fromToIcon from '@/assets/map/fromto.png';

let map, aMap, markerGroup;
let global = {};
let autoComplete;

const RoutePlan = () => {
  const [fromOptions, setFromOptions] = useState([]);
  const [fromValue, setFromValue] = useState('');
  const [showFromBox, setShowFromBox] = useState(false);
  const [toOptions, setToOptions] = useState([]);
  const [toValue, setToValue] = useState('');
  const [showToBox, setShowToBox] = useState(false);
  const [findWay, setFindWay] = useState('car');
  const [initZoom, setInitZoom] = useState(15);
  const [initCenter, setInitCenter] = useState([116.396275, 39.909468]);

  const handleClick = (e) => {
    console.log('点击地图==>', e);
  };

  useEffect(() => {
    AMapLoader.load({
      key: '64eedb9513761429b179c990faa0dbe2',
      version: '2.0',
      plugins: [
        'AMap.AutoComplete',
        'AMap.TileLayer',
        'AMap.Driving',
        'AMap.Transfer',
        'AMap.Walking',
        'AMap.MoveAnimation',
        'AMap.DistrictSearch',
        'AMap.Polygon',
        'AMap.OverlayGroup',
        'AMap.Marker',
        'AMap.Icon',
        'AMap.Size',
        'AMap.LngLat',
        'AMap.ControlBar',
      ], //插件列表
    })
      .then((AMap) => {
        aMap = AMap;
        map = new AMap.Map('keyContainer', {
          zoom: initZoom,
          center: initCenter,
          resizeEnable: true,
          rotateEnable: true,
          pitchEnable: true,
          pitch: 0,
          rotation: 0,
          viewMode: '3D', //开启3D视图,默认为关闭
          buildingAnimation: true, //楼块出现是否带动画
          expandZoomRange: true,
        });
        console.log('map=>', map);
        // 绑定事件
        map.on('click', handleClick);

        map.addControl(
          new AMap.ControlBar({
            showZoomBar: false,
            showControlButton: true,
            position: {
              right: '20px',
              top: '20px',
            },
          }),
        );

        // 实时路况
        let trafficLayer = new AMap.TileLayer.Traffic({
          zIndex: 10,
          strokeWeight: 10,
          autoRefresh: true,
          interval: 60,
        });
        map.add(trafficLayer);

        // 构造自动补全函数
        autoComplete = new AMap.AutoComplete({ city: '全国' });

        markerGroup = new AMap.OverlayGroup();
        map.add(markerGroup);

        drawRegion(map, AMap);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    return () => {
      // 清除图层 START
      markerGroup && map.remove(markerGroup);
      for (let i in global) {
        if (global[i].polyline) {
          map.remove(global[i].polyline);
          map.remove(global[i].marker);
        }
        global[i] = {};
      }
      // 清除图层 END
      map.destroy();
      map = null;
    };
  }, []);

  // 画行政区
  const drawRegion = (map, AMap) => {
    let district = new AMap.DistrictSearch({
      subdistrict: 0, //获取边界不需要返回下级行政区
      extensions: 'all', //返回行政区边界坐标组等具体信息
      level: 'district', //查询行政级别为 市
    });
    district.search('北京市', function (status, result) {
      // console.log('省份图层=>', status, result)
      let polygons = [];
      let bounds = result.districtList && result.districtList[0].boundaries;
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          let polygon = new AMap.Polygon({
            strokeWeight: 2,
            path: bounds[i],
            fillOpacity: 0,
            fillColor: '#80d8ff',
            strokeColor: '#0091ea',
            bubble: true,
            zIndex: 10,
          });
          polygons.push(polygon);
        }
      }
      map.add(polygons);
    });
  };

  // 画起始点
  const drawPoints = (start, end, AMap) => {
    let markers = [];
    let startMarker = new AMap.Marker({
      map,
      icon: new AMap.Icon({
        size: new AMap.Size(40, 60), // 图标尺寸
        image: startIcon, // Icon的图像
        imageSize: new AMap.Size(40, 60), // 根据所设置的大小拉伸或压缩图片
      }),
      position: start,
      offset: new AMap.Pixel(-20, -30),
      zIndex: 10,
    });
    markers.push(startMarker);
    let endMarker = new AMap.Marker({
      map,
      icon: new AMap.Icon({
        size: new AMap.Size(40, 60), // 图标尺寸
        image: endIcon, // Icon的图像
        imageSize: new AMap.Size(40, 60), // 根据所设置的大小拉伸或压缩图片
      }),
      position: end,
      offset: new AMap.Pixel(-20, -30),
      zIndex: 10,
    });
    markers.push(endMarker);
    markerGroup.addOverlays(markers);
  };

  // 画路线
  const drawRoads = async (AMap) => {
    // 构造路线导航类
    let routeLine = new AMap.Driving({
      policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
      ferry: 0, // 是否可以使用轮渡
    });
    if (findWay == 'car') {
      routeLine = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        ferry: 0, // 是否可以使用轮渡
      });
    } else if (findWay == 'bus') {
      routeLine = new AMap.Transfer({
        map: map,
        panel: 'panel',
        policy: AMap.TransferPolicy.LEAST_TIME, //乘车策略
      });
    } else if (findWay == 'walk') {
      routeLine = new AMap.Walking({
        map: map,
        panel: 'panel',
      });
    }

    // 根据起终点经纬度规划
    routeLine.search(
      [
        { keyword: fromValue, city: '北京市' },
        { keyword: toValue, city: '北京市' },
      ],
      function (status, result) {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          console.log(result);

          // 画起始点
          drawPoints(
            [result.start.location.lng, result.start.location.lat],
            [result.end.location.lng, result.end.location.lat],
            AMap,
          );

          let rs = [];
          if (findWay == 'car' || findWay == 'walk') {
            rs = result.routes || [];
            rs.length &&
              rs.forEach((item, index) => {
                let routes = [];
                item.steps.forEach((it, ind) => {
                  it.path.forEach((i) => {
                    routes.push([i.lng, i.lat]);
                  });
                });
                if (routes.length) {
                  global[index] = {};
                  // 绘制轨迹
                  global[index].polyline = new AMap.Polyline({
                    map: map,
                    path: routes,
                    showDir: true,
                    strokeColor: '#28F', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 10, //线宽
                    strokeStyle: 'solid', //线样式
                    lineJoin: 'round', // 折线拐点连接处样式
                    cursor: 'pointer',
                  });

                  global[index].marker = new AMap.Marker({
                    map: map,
                    position: routes[0],
                    icon: new AMap.Icon({
                      size: new AMap.Size(32, 32), // 图标尺寸
                      image: findWay == 'car' ? carIcon : findWay == 'walk' ? walkIcon : carIcon,
                      imageSize: new AMap.Size(32, 32), // 根据所设置的大小拉伸或压缩图片
                    }),
                    zIndex: 10,
                    offset: new AMap.Pixel(-16, -16),
                  });

                  // 动画
                  global[index].marker.moveAlong(routes, {
                    // 每一段的时长
                    duration: 50,
                    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                    autoRotation: false,
                  });
                  // 居中
                  map.setFitView(global[index].polyline);
                }
              });
          } else if (findWay == 'bus') {
            rs = result.plans || [];
            let colorOpt = ['#713000', '#e39117', '#815bf3', '#3eafa3', '#3f04f5'];
            rs.length &&
              rs.forEach((item, index) => {
                let routes = [];
                item.path.forEach((i) => {
                  routes.push([i.lng, i.lat]);
                });
                if (routes.length) {
                  global[index] = {};
                  // 绘制轨迹
                  global[index].polyline = new AMap.Polyline({
                    map: map,
                    path: routes,
                    zIndex: 20,
                    showDir: true,
                    strokeColor: colorOpt[index] || '#3f04f5', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 10, //线宽
                    strokeStyle: 'solid', //线样式
                    lineJoin: 'round', // 折线拐点连接处样式
                    cursor: 'pointer',
                  });
                  global[index].marker = new AMap.Marker({
                    map: map,
                    position: routes[0],
                    icon: new AMap.Icon({
                      size: new AMap.Size(32, 32), // 图标尺寸
                      image: busIcon,
                      imageSize: new AMap.Size(32, 32), // 根据所设置的大小拉伸或压缩图片
                    }),
                    zIndex: 20,
                    offset: new AMap.Pixel(-16, -16),
                  });

                  global[index].polyline.on('mousemove', (e) => {
                    for (let i in global) {
                      global[i].polyline.setOptions({ zIndex: 10 });
                    }
                    e.target.setOptions({ zIndex: 20 });
                  });

                  // 动画
                  global[index].marker.moveAlong(routes, {
                    // 每一段的时长
                    duration: 50,
                    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                    autoRotation: false,
                  });
                  // 居中
                  map.setFitView(global[index].polyline);
                }
              });
          }
        } else {
          console.error('获取驾车数据失败：' + result);
        }
      },
    );
  };

  // 查询
  const getRoute = async () => {
    if (!fromValue.trim() || !toValue.trim()) {
      message.info('请输入起始点');
      return;
    }

    // 清除图层 START
    markerGroup && map.remove(markerGroup);
    for (let i in global) {
      if (global[i].marker) {
        map.remove(global[i].polyline);
        map.remove(global[i].marker);
      }
      global[i] = {};
    }
    // 清除图层 END
    drawRoads(aMap);
  };

  const ChangeWay = (val) => {
    setFindWay(val);
  };

  // 搜索位置
  const searchFromValue = (e) => {
    setShowFromBox(true);
    if (!e.target.value || e.target.value.trim() == '') {
      setFromValue('');
      setFromOptions([]);
      return;
    }
    setFromValue(e.target.value);
    // 根据关键字进行搜索
    autoComplete.search(e.target.value, function (status, result) {
      // 搜索成功时，result即是对应的匹配数据
      console.log(status, result);
      if (status == 'complete') {
        setFromOptions(result.tips || []);
      }
    });
  };

  const changeFromValue = (item) => {
    setFromValue(item.name);
    setShowFromBox(false);
  };

  // 搜索
  const searchToValue = (e) => {
    setShowToBox(true);
    if (!e.target.value || e.target.value.trim() == '') {
      setToValue('');
      setToOptions([]);
      return;
    }
    setToValue(e.target.value);
    // 根据关键字进行搜索
    autoComplete.search(e.target.value, function (status, result) {
      // 搜索成功时，result即是对应的匹配数据
      console.log(status, result);
      if (status == 'complete') {
        setToOptions(result.tips || []);
      }
    });
  };

  const changeToValue = (item) => {
    setToValue(item.name);
    setShowToBox(false);
  };

  return (
    <div className={styles.container}>
      <div id={'keyContainer'} style={{ height: '100%', width: '100%' }}></div>
      <div className={styles.search_info}>
        <Input
          onChange={searchFromValue}
          onFocus={searchFromValue}
          onBlur={() => {
            setTimeout(() => {
              setShowFromBox(false);
            }, 300);
          }}
          value={fromValue}
          placeholder={'请输入起点'}
        />
        {showFromBox && (
          <div className={styles.from_box}>
            {fromOptions.map((item) => {
              if (item.location) {
                return (
                  <span
                    key={item.location}
                    title={item.name}
                    onClick={() => {
                      changeFromValue(item);
                    }}
                  >
                    {item.name}
                  </span>
                );
              }
            })}
          </div>
        )}
        <div className={styles.fromto}>
          <img src={fromToIcon} alt="" />
        </div>
        <Input
          onChange={searchToValue}
          onFocus={searchToValue}
          onBlur={() => {
            setTimeout(() => {
              setShowToBox(false);
            }, 300);
          }}
          value={toValue}
          placeholder={'请输入终点'}
        />
        {showToBox && (
          <div className={styles.to_box}>
            {toOptions.map((item) => {
              if (item.location) {
                return (
                  <span
                    key={item.location}
                    title={item.name}
                    onClick={() => {
                      changeToValue(item);
                    }}
                  >
                    {item.name}
                  </span>
                );
              }
            })}
          </div>
        )}
        <Select style={{ width: 80, margin: '0 5px' }} value={findWay} onChange={ChangeWay}>
          <Select.Option value="car">驾车</Select.Option>
          <Select.Option value="bus">公交</Select.Option>
          <Select.Option value="walk">步行</Select.Option>
        </Select>
        <div className={styles.searchIcon} onClick={getRoute}>
          <SearchOutlined />
        </div>
      </div>
    </div>
  );
};

export default RoutePlan;
