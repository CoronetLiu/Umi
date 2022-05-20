// 部署端口
let pmsPort = '8888'; //权限系统
let subPort = '9999'; //子系统

// 开发时各个项目启动端口
if (process.env.NODE_ENV === 'development') {
  pmsPort = '8888'; //权限系统
  subPort = '9999'; //子系统
}

//默认配置
const Settings = {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  pwa: false,
  headerHeight: 60,
  splitMenus: false,

  title: 'Umi管理平台',
  pmsPort,
  subPort,
};
export default Settings;
