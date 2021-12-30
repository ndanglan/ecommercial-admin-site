import ActionTypes from "../actions";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem('adminIsLoggedIn')) || false,
  token: localStorage.getItem('adminToken'),
  adminInfo: JSON.parse(localStorage.getItem('adminInfo')) || {},
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_USER:
      localStorage.setItem('adminIsLoggedIn', 'true')
      localStorage.setItem('adminToken', action.token)
      localStorage.setItem('adminInfo', JSON.stringify(action.adminInfo))
      return {
        ...state,
        isLoggedIn: true,
        token: action.token,
        adminInfo: action.adminInfo
      }
    case ActionTypes.LOGOUT_USER:
      localStorage.removeItem('adminIsLoggedIn')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminInfo')
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        adminInfo: {}
      }
    default:
      return {
        ...state
      }
  }
}

export default authReducer;