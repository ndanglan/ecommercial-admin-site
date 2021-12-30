import { createStore, combineReducers } from "redux";

import authReducer from "./reducers/auth";
import loadingReducer from './reducers/loading';

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
});

const store = createStore(rootReducer);

const getCurrentAdmin = (state) => state.auth.currentAdmin;
const getIsLoggedIn = (state) => state.auth.isLoggedIn;
const getShow = (state) => state.loading.show;

export { getCurrentAdmin, getIsLoggedIn, getShow }
export default store;