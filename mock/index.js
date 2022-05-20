export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req, res) => {
    res.send({
      code: 1,
      data: {
        name: 'admin',
        realname: '管理员',
        userId: '1',
      },
    });
  },
  'POST /api/permission': (req, res) => {
    res.send({
      code: 1,
      data: [
        { permissionValue: 'pms:admin' },
        { permissionValue: 'pms:chart' },
        { permissionValue: 'pms:routeSearch' },
        { permissionValue: 'pms:routePlan' },
        { permissionValue: 'pms:loca' },
        { permissionValue: 'pms:video' },
        { permissionValue: 'pms:video:realVideo' },
        { permissionValue: 'pms:video:historyVideo' },
        { permissionValue: 'pms:video:mockVideo' },
        { permissionValue: 'pms:table' },
        { permissionValue: 'pms:editor' },
        { permissionValue: 'pms:busi:realMonitor' },
        { permissionValue: 'pms:busi:realLocation' },
        { permissionValue: 'pms:busi:historyRoute' },
      ],
    });
  },
  'POST /api/login': (req, res) => {
    res.send({
      code: 1,
      data: {
        message: '登录成功',
        code: 'admin',
      },
    });
  },
  'GET /api/logout': (req, res) => {
    res.send({
      code: 1,
      data: {
        message: '登出成功',
      },
    });
  },
  'GET /api/subSystemList': (req, res) => {
    res.send({
      code: 1,
      data: [
        {
          title: '权限管理系统',
          auth: 'pms',
        },
        {
          title: '业务管理系统',
          auth: 'bms',
        },
        {
          title: '执法管理系统',
          auth: 'ems',
        },
        {
          title: '大屏系统',
          auth: 'vms',
        },
      ],
    });
  },
  'POST /api/updatePassWord': (req, res) => {
    res.send({
      code: 1,
      data: {
        message: '修改成功',
      },
    });
  },
  'GET /api/mapData': (req, res) => {
    res.send({
      code: 1,
      data: {
        message: '请求成功',
      },
    });
  },
  'GET /api/table': (req, res) => {
    res.send({
      code: 1,
      data: {
        message: '请求成功',
      },
    });
  },
};
