const INITIAL_STATE = {
  modal: false,
  currentChannel: null,
  isPrivateChannel: false
};

const sidePanelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_MODAL':
      return {
        ...state,
        modal: true
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: false
      };
    case 'SET_CURRENT_CHANNEL':
      return {
        ...state,
        currentChannel: action.payload
      };
    case 'SET_PRIVATE_CHANNEL':
      return {
        ...state,
        isPrivateChannel: action.payload
      };
    default:
      return state;
  }
};

export default sidePanelReducer;
