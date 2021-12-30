import api from "./api";

const list = async () => {
  return await api.get(api.url.products);
};

const getSingle = async (id) => {
  return await api.get(`${api.url.products}/${id}`).then((res) => res);
};

const getSpecificCategory = async (specific) => {
  return await api
    .get(`${api.url.products}/category/${specific}`)
    .then((res) => res);
};

const add = async (data) => {

  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  return await api
    .post(`${api.url.products}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res);
};

const update = async (id, data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  return await api
    .post(`${api.url.products}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res);
  ;
};

const deleteProduct = async (id) => {
  return await api.delete(`${api.url.products}/${id}`).then((res) => res);
};

const productsServices = {
  list,
  getSingle,
  getSpecificCategory,
  add,
  update,
  deleteProduct,
};

export default productsServices;
