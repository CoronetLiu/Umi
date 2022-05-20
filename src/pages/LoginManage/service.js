import request from '@/utils/request';

export async function login(params) {
  return request('/api/login', {
    method: 'POST',
    params,
  });
}
