import request from '@/utils/request';

export async function queryFakeList(params) {
  return request('/api/subSystemList', {
    method: 'GET',
    params,
  });
}
