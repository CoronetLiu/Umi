import request from '@/utils/request';

/*
 公共接口
 */

export async function getCurrentUser(params) {
  return request('/api/currentUser', {
    method: 'GET',
    params,
  });
}

export async function getPermissionList(params) {
  return request('/api/permission', {
    method: 'POST',
    params,
  });
}
