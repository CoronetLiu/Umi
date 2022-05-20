// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

/** Create user This can only be done by the logged in user. POST /user */

export async function createUser(body, options) {
  return request('/user', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** Updated user This can only be done by the logged in user. PUT /user/${param0} */

export async function updateUser(params, body, options) {
  const { username: param0 } = params;
  return request(`/user/${param0}`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

/** Delete user This can only be done by the logged in user. DELETE /user/${param0} */

export async function deleteUser(params, options) {
  const { username: param0 } = params;
  return request(`/user/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
