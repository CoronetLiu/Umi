import React, { useState, useEffect, useRef } from 'react';
import { Input, Tree, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getTreeData, getSiteList, getTodayData } from './service';
import styles from './index.less';
import AMapLoader from '@amap/amap-jsapi-loader';
import icon0 from '@/assets/map/0_icon.png';
import icon3 from '@/assets/map/3_icon.png';
import icon4 from '@/assets/map/4_icon.png';
import icon00 from '@/assets/map/0_level_0.png';
import icon01 from '@/assets/map/0_level_1.png';
import icon30 from '@/assets/map/3_level_0.png';
import icon31 from '@/assets/map/3_level_1.png';
import icon40 from '@/assets/map/4_level_0.png';
import icon41 from '@/assets/map/4_level_1.png';
import RealVideo from '@/pages/Video/RealVideo';
import HistoryVideo from '@/pages/Video/HistoryVideo';

const { Search } = Input;
const { TreeNode } = Tree;

let map = null;
let aMap = null;
let stationGroup;

const replaceStationType = (siteType) => {
  if (siteType == 0) return '固定治超站';
  if (siteType == 1) return '计重收费站';
  if (siteType == 2) return '高速劝返站';
  if (siteType == 3) return '非现场检测站';
  if (siteType == 4) return '源头企业站';
  if (siteType == 5) return '流动治超站';
};

const replaceParam = (data) => {
  let dataList = [];
  data.map((item) => {
    if (item.children && item.children.length > 0) {
      item.children = replaceParam(item.children);
    }
    let param = {
      siteName: item.title || item.name,
      title: item.title || item.name || replaceStationType(item.siteType),
      key: item.distCode || item.siteCode,
      children: item.children || [],
      distCode: item.distCode,
      siteCode: item.siteCode,
      position: [
        item.longitude ? Number(item.longitude) : 0,
        item.latitude ? Number(item.latitude) : 0,
      ],
    };
    dataList.push(param);
  });
  return dataList;
};

const RealMonitor = () => {
  const [originMarkList, setOriginMarkList] = useState([]);
  const [cSite, setCSite] = useState({});
  const cSiteRef = useRef({});
  cSiteRef.current = cSite;
  const [historyVisible, setHistoryVisible] = useState(false);
  const [realVisible, setRealVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [todayData, setTodayData] = useState({});
  const [searchVal, setSearchVal] = useState('');
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [initZoom, setInitZoom] = useState(9);
  const [initCenter, setInitCenter] = useState([111.398982, 29.269256]);
  const tip = useRef({});
  const todayInterval = useRef({});

  const handleClick = (e) => {
    console.log('点击地图==>', e);
  };

  const markerClick = async (e) => {
    setCSite(e.target._opts.extData);
    setRealVisible(true);
  };

  useEffect(() => {
    AMapLoader.load({
      key: '64eedb9513761429b179c990faa0dbe2',
      version: '2.0',
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
          mapStyle: 'amap://styles/darkblue',
        });
        console.log('map=>', map);

        // 绑定事件
        map.on('click', handleClick);

        stationGroup = new AMap.OverlayGroup();
        map.add(stationGroup);

        // 绘制地图
        drawQHS(map, AMap);

        getStationsFn();
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      if (todayInterval.current) {
        clearInterval(todayInterval.current);
      }
      clearMap();
      map.destroy();
      map = null;
    };
  }, []);

  useEffect(() => {
    if (todayInterval.current) {
      clearInterval(todayInterval.current);
    }
    if (map) {
      drawStations(map, aMap);
      // 根据所选站点查询对应数据
      let siteCodes = checkedKeys;
      siteCodes = siteCodes.filter((x) => x.length == 8) || [];
      getTodayDataFn(siteCodes);

      let timer = setInterval(() => {
        // 根据所选站点查询对应数据
        let siteCodes = checkedKeys.filter((x) => x.length == 8) || [];
        getTodayDataFn(siteCodes);
      }, 1000 * 60 * 5);
      todayInterval.current = timer;
    }
  }, [checkedKeys]);

  // 获取站点信息
  const getStationsFn = async () => {
    let res = await getSiteList();
    if (res?.code == 1) {
      let markList = [
        {
          siteName: '固定1',
          siteCode: '01010101',
          siteType: '0',
          longitude: '111.526722',
          latitude: '29.647193',
          over: 0,
        },
        {
          siteName: '固定2',
          siteCode: '01010102',
          siteType: '0',
          longitude: '111.823913',
          latitude: '29.656255',
          over: 100,
        },
        {
          siteName: '源头',
          siteCode: '01010103',
          siteType: '4',
          longitude: '111.398982',
          latitude: '29.269256',
          over: 0,
        },
        {
          siteName: '非现',
          siteCode: '01010104',
          siteType: '3',
          longitude: '111.498046',
          latitude: '29.202147',
          over: 0,
        },
      ];
      setOriginMarkList(markList);
    } else {
      setOriginMarkList([]);
    }
    // 获取树
    getTreeDataFn();
  };

  const getTreeDataFn = async () => {
    let res = await getTreeData();
    if (res?.code == 1) {
      // 模拟
      let data = [
        {
          title: '武陵区',
          value: '0',
          distCode: '000001',
          key: '0',
          children: [
            {
              title: '固定治超站',
              value: '0-1',
              key: '0-1',
              distCode: '0-1',
              children: [
                {
                  siteName: '固定1',
                  title: '固定1',
                  value: '01010101',
                  key: '01010101',
                  siteCode: '01010101',
                  longitude: '111.526722',
                  latitude: '29.647193',
                },
                {
                  siteName: '固定2',
                  title: '固定2',
                  value: '01010102',
                  key: '01010102',
                  siteCode: '01010102',
                  longitude: '111.823913',
                  latitude: '29.656255',
                },
              ],
            },
            {
              title: '源头企业站',
              value: '0-2',
              distCode: '0-2',
              key: '0-2',
              children: [
                {
                  siteName: '源头',
                  title: '源头',
                  value: '01010103',
                  key: '01010103',
                  siteCode: '01010103',
                  longitude: '111.398982',
                  latitude: '29.269256',
                },
              ],
            },
            {
              title: '非现场检测站',
              value: '0-3',
              distCode: '0-3',
              key: '0-3',
              children: [
                {
                  siteName: '非现',
                  title: '非现',
                  value: '01010104',
                  key: '01010104',
                  siteCode: '01010104',
                  longitude: '111.498046',
                  latitude: '29.202147',
                },
              ],
            },
          ],
        },
      ];
      setTreeData(data);
      let c = [];
      let e = [];
      const cek = (d) => {
        d.map((item) => {
          c.push(item.key || item.distCode);
          if (item.distCode && item.distCode.length == 6) {
            e.push(item.key);
          }
          if (item.children) {
            cek(item.children);
          }
        });
      };
      cek(data);
      setCheckedKeys(c);
      setExpandedKeys(e);
    } else {
      setTreeData([]);
      setCheckedKeys([]);
      setExpandedKeys([]);
    }
  };

  const getTodayDataFn = async (siteCodes) => {
    let res = await getTodayData({ siteCodes });
    if (res?.code == 1) {
      setTodayData(res.data);
    }
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
            fillOpacity: 0.2,
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

  // 清除站点
  const clearMap = () => {
    stationGroup && stationGroup.clearOverlays();
  };

  // 画站点
  const drawStations = (map, AMap) => {
    // 寻找勾选的站点
    let markList = originMarkList.filter((x) => checkedKeys.indexOf(x.siteCode) != -1);

    if (!markList.length) {
      clearMap();
    }

    markList.map((item) => {
      let icon = new AMap.Icon({
        size: new AMap.Size(40, 40), // 图标尺寸
        image: `${require('@/assets/map/' +
          item.siteType +
          '_level_' +
          (item.over ? '1' : '0') +
          '.png')}`, // Icon的图像
        imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
      });
      // 判断group中有没有当前节点
      let has = stationGroup._overlays.find((x) => x._opts.extData.siteCode == item.siteCode);
      if (!has) {
        let marker = new AMap.Marker({
          icon: icon,
          position: [Number(item.longitude), Number(item.latitude)],
          offset: new AMap.Pixel(-20, -20),
          zIndex: 15,
          extData: item,
        });
        stationGroup.addOverlay(marker);
      }
      for (let i = 0; i < stationGroup._overlays.length; i++) {
        let has = markList.find(
          (x) => x.siteCode == stationGroup._overlays[i]._opts.extData.siteCode,
        );
        if (!has) {
          stationGroup.removeOverlay(stationGroup._overlays[i]);
          i--;
        }
      }
    });

    // 绑定事件
    stationGroup.on('click', markerClick);

    stationGroup.on('mousemove', (e) => {
      if (cSiteRef.siteCode || e.target._opts.extData.siteCode != cSiteRef.current.siteCode) {
        setCSite(e.target._opts.extData);
      }
      // 转换经纬度为容器像素
      let lngLat = new aMap.LngLat(e.target._opts.position[0], e.target._opts.position[1]);
      let pixel = map.lngLatToContainer(lngLat);
      tip.current.style.top = pixel.round().y - 60 + 'px';
      tip.current.style.left = pixel.round().x + 'px';
      setTimeout(() => {
        tip.current.style.opacity = 1;
      }, 100);
    });
    stationGroup.on('mouseout', (e) => {
      setTimeout(() => {
        tip.current && (tip.current.style.opacity = 0);
      }, 100);
    });
  };

  // 点击树上站点
  const onSelect = (selectedKeys, selectedNodes) => {
    if (selectedNodes.node.siteCode) {
      let site = originMarkList.find((x) => x.siteCode == selectedNodes.node.siteCode);
      if (site) {
        setCSite(site);
        setHistoryVisible(true);
      }
    }
  };

  const recordVideo = (site) => {
    setCSite(site);
    setHistoryVisible(true);
  };

  // 寻找搜索时需要展开的key
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.title.indexOf(key) != -1)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const loopTree = (data) => {
    return data.map((value, k) => {
      const index = value.title.indexOf(searchVal);
      const beforeStr = value.title.substr(0, index);
      const afterStr = value.title.substr(index + searchVal.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="selectText">{searchVal}</span>
            {afterStr}
          </span>
        ) : (
          <span>{value.title}</span>
        );

      if (value.distCode) {
        return (
          <TreeNode {...value} title={<span>{value.title}</span>} key={value.key}>
            {value.children && loopTree(value.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          {...value}
          title={
            <span className={styles.siteTitle}>
              <span
                onClick={() => {
                  if (value.siteCode) {
                    let site = originMarkList.find((x) => x.siteCode == value.siteCode);
                    if (site) {
                      setCSite(site);
                      setRealVisible(true);
                      setSearchVal(site.siteName);
                      map.setZoomAndCenter(
                        14,
                        [Number(site.longitude), Number(site.latitude)],
                        false,
                        200,
                      );
                    }
                  }
                }}
              >
                {title}
              </span>
              <span
                onClick={(e) => {
                  recordVideo(value);
                }}
              >
                <PlayCircleOutlined />
              </span>
            </span>
          }
          key={value.key}
        ></TreeNode>
      );
    });
  };

  const searchTreeData = (e) => {
    if (e.target.value) {
      let titles = originMarkList
        .filter((item) => item.siteName.indexOf(e.target.value) != -1)
        ?.map((x) => x.siteName);
      let keys = titles.map((item) => {
        return getParentKey(item, treeData);
      });
      setExpandedKeys(keys);
      setAutoExpandParent(true);
    } else {
      let e = [];
      const cek = (d) => {
        d.map((item) => {
          if (item.distCode && item.distCode.length == 6) {
            e.push(item.key);
          }
          if (item.children) {
            cek(item.children);
          }
        });
      };
      cek(treeData);
      setExpandedKeys(e);
    }
    setSearchVal(e.target.value);
  };

  const onSearch = (value) => {
    let site = originMarkList.find((x) => x.siteName.indexOf(value) != -1);
    if (site) {
      setCSite(site);
      setRealVisible(true);
      setSearchVal(site.siteName);
      map.setZoomAndCenter(14, [Number(site.longitude), Number(site.latitude)], false, 200);
    }
  };

  const onCheck = (keys, node) => {
    setCheckedKeys(keys);
  };

  const onExpand = (v, a) => {
    setExpandedKeys(v);
    setAutoExpandParent(false);
  };

  return (
    <div className={styles.realMonitor}>
      <div id={'container'} style={{ height: '100%' }}></div>
      <div className={styles.map_tip} ref={tip}>
        <p>{cSite.siteName}</p>
      </div>
      <div className={styles.legend}>
        <div className={styles.legend_content}>
          <div>
            <img src={icon0} alt="" />
            <span>固定治超站</span>
          </div>
          <div>
            <img src={icon3} alt="" />
            <span>源头企业站</span>
          </div>
          <div>
            <img src={icon4} alt="" />
            <span>非现场检测站</span>
          </div>
        </div>
      </div>
      <div className={styles.search}>
        <Search
          placeholder="请输入站点名称"
          value={searchVal}
          onChange={searchTreeData}
          onSearch={onSearch}
          enterButton
        />
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={onExpand}
          // onSelect={onSelect}
        >
          {loopTree(treeData)}
        </Tree>
      </div>
      <RealVideo visible={realVisible} setVisible={setRealVisible} cSite={cSite} />
      <HistoryVideo visible={historyVisible} setVisible={setHistoryVisible} cSite={cSite} />
    </div>
  );
};

export default RealMonitor;
