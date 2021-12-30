import { Admin, Carts, Home, Products, Users } from "./pages";

const routes = [
  {
    path: '/',
    component: <Home />
  },
  {
    path: '/home',
    component: <Home />
  },
  {
    path: '/admin',
    component: <Admin />
  },
  {
    path: '/users',
    component: <Users />
  },
  {
    path: '/products',
    component: <Products />
  },
  {
    path: '/carts',
    component: <Carts />
  }
];

export default routes;