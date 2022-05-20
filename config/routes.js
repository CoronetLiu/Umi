export default [
  {
    path: '/login',
    layout: false, //关闭菜单、头部等信息，只显示内容
    routes: [
      {
        path: '/login',
        redirect: '/login/manage',
      },
      {
        name: '登录',
        path: '/login/manage',
        component: './LoginManage',
      },
      {
        name: '子系统',
        path: '/login/subSystem',
        component: './SubSystem',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/index',
    name: '欢迎',
    access: 'pms:admin',
    icon: 'SmileOutlined',
    component: './Welcome',
    hideInMenu: false, //true 隐藏菜单
  },
  {
    path: '/chart',
    name: '图表',
    access: 'pms:chart',
    icon: 'PieChartOutlined',
    component: './Chart',
  },
  {
    path: '/map',
    name: '地图',
    access: 'canMap',
    icon: 'HeatMapOutlined',
    routes: [
      {
        path: '/map',
        redirect: '/map/search',
      },
      {
        path: '/map/search',
        name: '路径查询',
        access: 'pms:routeSearch',
        component: './Map/RouteSearch',
      },
      {
        path: '/map/plan',
        name: '路径规划',
        access: 'pms:routePlan',
        component: './Map/RoutePlan',
      },
      {
        path: '/map/loca3D',
        name: '可视化3D',
        access: 'pms:loca',
        component: './Map/Loca3DLine',
      },
      {
        path: '/map/locaOD',
        name: '可视化OD',
        access: 'pms:loca',
        component: './Map/LocaPulseLink',
      },
      {
        path: '/map/echartsOD',
        name: 'EchartsOD',
        component: './Map/EchartsOD',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/video',
    name: '视频',
    icon: 'VideoCameraOutlined',
    access: 'pms:video',
    component: './Video',
  },
  {
    path: '/table',
    name: '表格',
    icon: 'TableOutlined',
    access: 'pms:table',
    component: './Table',
  },
  {
    path: '/editor',
    name: '编辑器',
    icon: 'FileTextOutlined',
    access: 'pms:editor',
    component: './Editor',
  },
  {
    path: '/busi',
    name: '业务功能',
    icon: 'DeploymentUnitOutlined',
    access: 'canBusi',
    routes: [
      {
        path: '/busi',
        redirect: '/busi/monitor',
      },
      {
        path: '/busi/monitor',
        name: '实时监测',
        access: 'pms:busi:realMonitor',
        component: './Map/RealMonitor',
      },
      {
        path: '/busi/real',
        name: '实时位置',
        access: 'pms:busi:realLocation',
        component: './Map/RealLocation',
      },
      {
        path: '/busi/history',
        name: '轨迹回放',
        access: 'pms:busi:historyRoute',
        component: './Map/HistoryRoute',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/index',
  },
  {
    component: './404',
  },
];
