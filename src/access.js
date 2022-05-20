/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access() {
  let auth = localStorage.getItem('antd-pro-authority');
  auth = JSON.parse(auth);

  const getAccess = (acs) => {
    let res = acs.filter((x) => auth && auth.indexOf(x) != -1);
    return !!res.length;
  };

  return {
    'pms:admin': getAccess(['pms:admin']),
    'pms:chart': getAccess(['pms:chart']),

    canMap: getAccess(['pms:routeSearch', 'pms:routePlan', 'pms:loca']),
    'pms:routeSearch': getAccess(['pms:routeSearch']),
    'pms:routePlan': getAccess(['pms:routePlan']),
    'pms:loca': getAccess(['pms:loca']),

    'pms:video': getAccess(['pms:video']),
    'pms:video:realVideo': getAccess(['pms:video:realVideo']),
    'pms:video:historyVideo': getAccess(['pms:video:historyVideo']),
    'pms:video:mockVideo': getAccess(['pms:video:mockVideo']),

    'pms:table': getAccess(['pms:table']),
    'pms:editor': getAccess(['pms:editor']),

    canBusi: getAccess(['pms:busi:realMonitor', 'pms:busi:realLocation', 'pms:busi:historyRoute']),
    'pms:busi:realMonitor': getAccess(['pms:busi:realMonitor']),
    'pms:busi:realLocation': getAccess(['pms:busi:realLocation']),
    'pms:busi:historyRoute': getAccess(['pms:busi:historyRoute']),
  };
}
