const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  channels: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false
      };
    case 'CLEAR_USER':
      return {
        ...state,
        isLoading: false
      };
    case 'FETCH_COLLECTIONS_START':
      return {
        ...state
      };
    case 'FETCHING_COLLECTIONS_SUCCESS':
      return {
        ...state,
        channels: action.payload
      };
    case 'FETCHING_COLLECTIONS_FAILURE':
      return {
        ...state,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
