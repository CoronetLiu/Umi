import request from '@/utils/request';

export async function searchRoute(params) {
  return request('/aMap/v3/direction/driving', {
    method: 'GET',
    params,
  });
}
