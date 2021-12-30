import api from './api';

const login = (username, password) => {
  const data = { username, password };
  return api.post(`${api.url.admin}/login`, data).then(res => res)
}

const addAdmin = (data) => {
  return api.post(`${api.url.admin}/add`, data).then(res => res)
}

const adminServices = {
  login, addAdmin
}

export default adminServices;