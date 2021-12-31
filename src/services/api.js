import axios from "axios";
import ActionTypes from "../stores/actions";
import store from './../stores';

const url = {
  baseUrl: 'http://localhost:3000',
  users: '/users',
  products: '/products',
  carts: '/carts',
  auth: '/auth',
  admin: '/admin'
}

const instance = axios.create({
  baseURL: url.baseUrl,
  headers: {
    "Content-Type": 'application/json',
    "Accept": "application/json"
  }
})

instance.interceptors.request.use(request => {
  const state = store.getState();
  store.dispatch({
    type: ActionTypes.SHOW_LOADING
  })

  if (state.auth.token) {
    request.headers.Authorization = `Bearer ${state.auth.token}`;
  }
  return request
})

instance.interceptors.response.use(response => {
  store.dispatch({
    type: ActionTypes.HIDE_LOADING
  })
  return response.data
}, error => {
  store.dispatch({
    type: ActionTypes.HIDE_LOADING
  })
  if (!error.response) {
    // window.location.href = "/no-internet";
  } else {
    switch (error.response.status) {
      // case 401:
      //   window.location.href = '/login';
      //   break;
      // case 403:
      //   window.location.href = "/no-permission";
      //   break;
      default:
        break;
    }
    return Promise.reject(error)
  }
})

const api = {
  url,
  instance,
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  promise: axios.all,
  spread: axios.spread,
}

export default api;