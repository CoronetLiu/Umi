import React from 'react';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SmileOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { history, Link } from 'umi';
import cookie from 'react-cookies';
import { parse } from 'qs';
import AMapLoader from '@amap/amap-jsapi-loader';
import access from '@/access';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import routes from '../config/routes';
import logo from '@/assets/logo.svg';
import { getPermissionList } from '@/services/api';

export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  return {
    permission: false,
    mapLoaded: false,
    collapsed: false,
    settings: defaultSettings,
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

/**
 * 自定义菜单
 * */
const iconMap = {
  SmileOutlined: <SmileOutlined />,
  HeartOutlined: <HeartOutlined />,
};

const menuDataRender = (menus) =>
  menus.map(({ icon, routes, ...item }) => {
    if (item.name && access()[item.access]) {
      // 判断权限
      return {
        ...item,
        // 方案一： 此用法会把所有的图标库引入，造成增加工程3M大小，请谨用
        // icon: icon && React.createElement(Icon[icon]),
        // 方案二： 建议用此方案，只引入用到的图标，避免图标库全部引入
        // icon: icon && iconMap [icon],
        // 方案三： 自定义图标
        icon:
          item.path.split('/').length == 2 ? (
            <span className="anticon">
              <img
                src={require('@/assets/menu/' + item.name + '.svg')}
                style={{
                  height: '14px',
                  width: '14px',
                  float: 'left',
                }}
              />
            </span>
          ) : (
            ''
          ),
        routes: routes && menuDataRender(routes),
      };
    }
  });

// 获取地图
const getAMap = async (cb) => {
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
  }).then((AMap) => {
    cb();
  });
};

// 获取权限
const getPermission = async (cb) => {
  const auth = await getPermissionList({
    id: '',
    permissionValue: '',
    limit: 'all',
  });
  if (auth?.code == 1) {
    let permissionArray = [];
    let paramTemp = auth.data;
    for (let i = 0; i < paramTemp.length; i++) {
      permissionArray.push(paramTemp[i].permissionValue);
    }
    localStorage.setItem('antd-pro-authority', JSON.stringify(permissionArray));
    cb(); // 更新权限状态
  }
};

export const layout = ({ initialState, setInitialState }) => {
  if (!initialState.permission) {
    console.log('获取权限...');
    getPermission(() => {
      setInitialState((preInitialState) => ({
        ...preInitialState,
        permission: true,
      }));
    });
  } else {
    console.log('权限获取完成...');
  }
  // if (!initialState.mapLoaded) {
  //   console.log('地图加载中...')
  //   getAMap(() => {
  //     setInitialState((preInitialState) => ({
  //       ...preInitialState,
  //       mapLoaded: true,
  //     }))
  //   })
  // } else {
  //   console.log('地图加载完成...')
  // }
  return {
    // rightContentRender: () => <RightContent/>,
    rightContentRender: () => (
      <>
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: 0,
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setInitialState((preInitialState) => ({
              ...preInitialState,
              collapsed: !initialState.collapsed,
            }));
          }}
        >
          {initialState.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <RightContent />
      </>
    ), // collapsed 自定义触发器  配合global.less隐藏自带触发器
    collapsed: initialState.collapsed, // 若要使用自带触发器，删除collapsed，使用原生rightContentRender，并取消less中的隐藏样式
    contentStyle: { padding: 0, margin: 0 },
    disableContentMargin: false,
    waterMarkProps: {
      content: 'Umi',
      fontSize: 20,
      rotate: -20,
      gapX: 150,
      gapY: 120,
    },
    breadcrumbRender: false, // 取消面包屑
    pageTitleRender: false, // 取消渲染标题区域
    menuHeaderRender: undefined,
    menuDataRender: () => menuDataRender(routes),
    footerRender: false,
    logo: logo,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!cookie.load('code')) {
        // 传参
        let params = window.location.href.split('?');
        let pathname = window.location.pathname;
        history.push({
          pathname: '/login/manage',
          query: params[1]
            ? parse(params[1])
            : pathname != '/' && pathname != '/login' && pathname != '/login/manage'
            ? { redirect: window.location.href }
            : undefined,
        });
      }
    },
    links: [], // 菜单最下方链接
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      // 获取权限
      if (!initialState.permission) return <PageLoading />;
      // 当访问的菜单路径包含地图 并且 地图未加载时 显示loading界面 [根据实际路径做判断]
      // if (!initialState.mapLoaded && (window.location.pathname.indexOf('map') != -1)) return <PageLoading/>;
      return (
        <>
          {children}
          {process.env.NODE_ENV === 'development' && !props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
