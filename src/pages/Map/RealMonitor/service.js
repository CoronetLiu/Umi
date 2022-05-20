import request from '@/utils/request';

export async function getTreeData(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}

//获取站点检测量统计
export async function getTodayData(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}

// 获取地图站点信息
export async function getSiteList(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}
