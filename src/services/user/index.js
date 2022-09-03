import { request } from 'umi';
export const getAllAdmin = () => {
  return request('/volunteer/back/admin');
};
export const deleteAdmin = (id) => {
  return request('/volunteer/back/admin?id=' + id, {
    method: 'DELETE',
  });
};
export const postAdmin = (username, password) => {
  return request('/volunteer/back/admin', {
    method: 'POST',
    data: {
      username,
      password,
      identity: 2,
    },
  });
};
export const updateAdmin = (username, password, id) => {
  return request('/volunteer/back/admin', {
    method: 'PUT',
    data: {
      username: username == '' ? null : username,
      password: password == '' ? null : password,
      id,
      identity: 2,
    },
  });
};
