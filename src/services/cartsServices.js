import api from './api';

const list = () => {
  return api.get(api.url.carts);
}

const getSingle = (id) => {
  return api.get(`${api.url.carts}/${id}`);
}

const getLimit = (amount) => {
  return api.get(`${api.url.carts}?limit=${amount}`);
}

const sortResults = (type) => {
  return api.get(`${api.url.carts}?sort=${type}`);
}

const getCartInDate = (start, end) => {
  return api.get(`${api.url.carts}/startdate=${start}&enddate=${end}`);
}

const getUserCarts = (id) => {
  return api.get(`${api.url.carts}/user/${id}`);
}

const add = (data) => api.post(api.url.carts, data);
const update = (id, data) => api.put(`${api.url.carts}/${id}`, data);
const remove = (id) => api.delete(`${api.url.carts}/${id}`);

const cartsServices = {
  list,
  getSingle,
  getLimit,
  sortResults,
  getCartInDate,
  getUserCarts,
  add,
  update,
  remove,
}

export default cartsServices;