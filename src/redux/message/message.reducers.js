const INITIAL_STATE = {
  fileModal: false,
  uploadState: false,
  percentUploaded: 0
};

const messageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_FILE_MODAL':
      return {
        ...state,
        fileModal: true
      };
    case 'CLOSE_FILE_MODAL':
      return {
        ...state,
        fileModal: false
      };
    case 'UPLOAD_STATE':
      return {
        ...state,
        uploadState: true
      };
    case 'CLOSE_UPLOAD_STATE':
      return {
        ...state,
        uploadState: false
      };
    case 'PERCENT_UPLOADED':
      return {
        ...state,
        percentUploaded: action.payload
      };
    default:
      return state;
  }
};

export default messageReducer;
