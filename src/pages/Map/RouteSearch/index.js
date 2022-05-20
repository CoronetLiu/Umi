import React, { useState, useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Input, message } from 'antd';
import styles from './index.less';
import { searchRoute } from './service';
import fromToIcon from '@/assets/map/fromto.png';
import { SearchOutlined } from '@ant-design/icons';
import startIcon from '@/assets/map/start.png';
import endIcon from '@/assets/map/end.png';

let map, aMap, markerGroup;
let global = {};
let autoComplete;

const RouteSearch = () => {
  const [fromOptions, setFromOptions] = useState([]);
  const [fromValue, setFromValue] = useState('');
  const [fromLocation, setFromLocation] = useState([]);
  const [showFromBox, setShowFromBox] = useState(false);
  const [toOptions, setToOptions] = useState([]);
  const [toValue, setToValue] = useState('');
  const [toLocation, setToLocation] = useState([]);
  const [showToBox, setShowToBox] = useState(false);
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
        'AMap.Driving',
        'AMap.MoveAnimation',
        'AMap.DistrictSearch',
        'AMap.Polygon',
        'AMap.OverlayGroup',
        'AMap.Marker',
        'AMap.Icon',
        'AMap.Size',
      ], //插件列表
    })
      .then((AMap) => {
        aMap = AMap;
        map = new AMap.Map('keyContainer', {
          zoom: initZoom,
          center: initCenter,
        });
        console.log('map=>', map);
        // 绑定事件
        map.on('click', handleClick);

        // 构造自动补全函数
        autoComplete = new AMap.AutoComplete({ city: '全国' });

        markerGroup = new AMap.OverlayGroup();
        map.add(markerGroup);

        drawRegion(map, AMap);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      // 清除图层 START
      markerGroup && map.remove(markerGroup);
      for (let i in global) {
        if (global[i].polyline) {
          map.remove(global[i].polyline);
        }
      }
      global = {};
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
      let bounds = result.districtList[0].boundaries;
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

  // 画路线
  const drawRoads = (list, index, AMap) => {
    let route = [];
    list.forEach((item) => {
      let list = item.polyline.split(';').map((it) => {
        return [it.split(',')[0], it.split(',')[1]];
      });
      route = route.concat(list);
    });
    if (route.length) {
      let colors = ['#713000', '#e39117', '#815bf3', '#3eafa3', '#3f04f5'];
      global[index] = {};
      // 绘制轨迹
      global[index].polyline = new AMap.Polyline({
        map: map,
        path: route,
        showDir: true,
        strokeColor: colors[index], //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 10, //线宽
        strokeStyle: 'solid', //线样式
        lineJoin: 'round', // 折线拐点连接处样式
        cursor: 'pointer',
      });
      global[index].polyline.on('mousemove', (e) => {
        e.target.setOptions({
          zIndex: 15,
        });
      });
      global[index].polyline.on('mouseout', (e) => {
        e.target.setOptions({
          zIndex: 10,
        });
      });

      // 居中
      map.setFitView(global[index].polyline);
    }
  };

  // 查询
  const getRoute = async () => {
    if (!fromLocation.length || !toLocation.length) {
      message.info('请选择起始点');
      return;
    }

    // 清除图层 START
    markerGroup && map.remove(markerGroup);
    for (let i in global) {
      if (global[i].polyline) {
        map.remove(global[i].polyline);
      }
    }
    global = {};
    // 清除图层 END
    let res = await searchRoute({
      key: '15befa3936f457390b417b627278ca2c',
      origin: fromLocation.join(','),
      destination: toLocation.join(','),
      extensions: 'all',
      strategy: '11',
    });
    if (res?.info == 'OK') {
      if (res.route?.paths?.length) {
        console.log(fromLocation, toLocation);
        drawPoints(fromLocation, toLocation, aMap);
        res.route.paths.forEach((item, index) => {
          drawRoads(item.steps, index, aMap);
        });
      }
    } else {
      message.info('未查询到对应路径！');
    }
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

  // 搜索位置
  const searchFromValue = (e) => {
    setShowFromBox(true);
    if (!e.target.value || e.target.value.trim() == '') {
      setFromValue('');
      setFromOptions([]);
      setFromLocation([]);
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
    setFromLocation([item.location.lng, item.location.lat]);
    setShowFromBox(false);
  };

  // 搜索
  const searchToValue = (e) => {
    setShowToBox(true);
    if (!e.target.value || e.target.value.trim() == '') {
      setToValue('');
      setToOptions([]);
      setToLocation([]);
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
    setToLocation([item.location.lng, item.location.lat]);
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
        <div className={styles.searchIcon} onClick={getRoute}>
          <SearchOutlined />
        </div>
      </div>
    </div>
  );
};

export default RouteSearch;
