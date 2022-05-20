import request from '@/utils/request';

// 修改密码
export async function updatePassword(params) {
  return request('/api/updatePassWord', {
    method: 'POST',
    params,
  });
}

// 退出登录
export async function logout(params) {
  return request('/api/logout', {
    method: 'GET',
    params,
  });
}
