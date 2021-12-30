import ActionTypes from "../actions";

const initialState = {
  show: false,
}

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_LOADING:
      return {
        ...state,
        show: true
      }
    case ActionTypes.HIDE_LOADING:
      return {
        ...state,
        show: false
      }
    default:
      return {
        ...state
      }
  }
}

export default loadingReducer;