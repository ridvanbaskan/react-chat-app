import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducers';
import sidePanelReducer from './SidePanel/SidePanel.reducers';
import messageReducer from './message/message.reducers';

// const persistConfig = {
//   key: 'root',
//   storage
//   // whitelist: ['settings']
// };

const rootReducer = combineReducers({
  user: userReducer,
  sidePanel: sidePanelReducer,
  message: messageReducer
});

// export default persistReducer(persistConfig, rootReducer);
export default rootReducer;
