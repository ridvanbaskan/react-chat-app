export const setFileModal = () => ({
  type: 'SET_FILE_MODAL'
});
export const closeFileModal = () => ({
  type: 'CLOSE_FILE_MODAL'
});
export const uploadState = () => ({
  type: 'UPLOAD_STATE'
});
export const closeUploadState = () => ({
  type: 'CLOSE_UPLOAD_STATE'
});
export const percentUploaded = percent => ({
  type: 'PERCENT_UPLOADED',
  payload: percent
});
