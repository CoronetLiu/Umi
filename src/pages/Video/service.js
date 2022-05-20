import request from '@/utils/request';

// 实时视频
export async function getRealUrl(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}
// 历史视频
export async function getHistoryUrl(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}

// 检测数据
export async function getData(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}

//获取数据详情
export async function getAuditDetail(params) {
  return request('/api/mapData', {
    method: 'GET',
    params,
  });
}
