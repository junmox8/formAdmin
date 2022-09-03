import { request } from 'umi';
export const login = (username, password) => {
  return request(
    '/volunteer/back/admin/pass/login?username=' + username + '&password=' + password,
    {
      method: 'POST',
    },
  );
};
