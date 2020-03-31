export const setModal = () => ({
  type: 'SET_MODAL'
});
export const closeModal = () => ({
  type: 'CLOSE_MODAL'
});
export const setCurrentChannel = channel => ({
  type: 'SET_CURRENT_CHANNEL',
  payload: channel
});
export const setPrivateChannel = isPrivateChannel => ({
  type: 'SET_PRIVATE_CHANNEL',
  payload: isPrivateChannel
});
