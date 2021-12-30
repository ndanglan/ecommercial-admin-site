import api from './api';

const list = () => {
  return api.get(api.url.users).then(res => res);
}

const getSingle = (id) => {
  return api.get(`${api.url.users}/${id}`).then(res => res);
}

const addUser = (data) => {
  return api.post(`${api.url.users}`, data).then(res => res);
}

const deleteUser = (id) => {
  return api.delete(`${api.url.users}/${id}`).then(res => res);
}

const updateUser = (id, data) => {
  return api.put(`${api.url.users}/${id}`, data).then(res => res);
}

const userServices = {
  list, getSingle, deleteUser, updateUser, addUser
}

export default userServices;