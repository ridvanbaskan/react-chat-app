import { firestore } from '../../firebase/firebase.utils';

export const setUser = user => ({
  type: 'SET_USER',
  payload: user
});
export const clearUser = () => ({
  type: 'SET_USER'
});

export const fetchCollectionsStart = () => ({
  type: 'FETCH_COLLECTIONS_START'
});

export const fetchCollectionsSuccess = collectionsMap => ({
  type: 'FETCHING_COLLECTIONS_SUCCESS',
  payload: collectionsMap
});

export const fetchCollectionsFailure = errorMessage => ({
  type: 'FETCHING_COLLECTIONS_FAILURE',
  payload: errorMessage
});

export const fetchCollectionsStartAsync = () => {
  return dispatch => {
    const collectionRef = firestore.collection('channels');
    dispatch(fetchCollectionsStart());

    collectionRef.onSnapshot(snapShot => {
      const collectionsMap = snapShot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      dispatch(fetchCollectionsSuccess(collectionsMap));
    });
  };
};
