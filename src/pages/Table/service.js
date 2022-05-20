import request from '@/utils/request';

export async function getTableData(params) {
  return request('/api/table', {
    method: 'GET',
    params,
  });
}

export async function getSiteNameByType(params) {
  return request('/api/table', {
    method: 'GET',
    params,
  });
}

export async function getDetail(params) {
  return request('/api/table', {
    method: 'GET',
    params,
  });
}
