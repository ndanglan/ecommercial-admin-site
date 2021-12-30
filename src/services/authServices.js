import api from './api';

const login = (username, password) => {
  const data = { username, password };
  return api.post(`${api.url.auth}/login`, data).then(res => res)
}
const authServices = {
  login
}

export default authServices;