import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDK56y4uQM0TehWceWjTdzVmaN5AXy8B58',
  authDomain: 'react-chat-app-9db28.firebaseapp.com',
  databaseURL: 'https://react-chat-app-9db28.firebaseio.com',
  projectId: 'react-chat-app-9db28',
  storageBucket: 'react-chat-app-9db28.appspot.com',
  messagingSenderId: '579322742080',
  appId: '1:579322742080:web:eddea339a9e051c45f26a5',
  measurementId: 'G-TZ00JFC9S6'
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const { name, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        name,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }
  return userRef;
};

// export const addCollectionAndDocuments = async (
//   collectionKey,
//   objectsToAdd
// ) => {
//   const collectionRef = firestore.collection(collectionKey);

//   const batch = firestore.batch();
//   objectsToAdd.forEach(obj => {
//     const newDocRef = collectionRef.doc();
//     batch.set(newDocRef, obj);
//   });

//   return await batch.commit();
// };

// export const convertCollectionsSnapshotToMap = collections => {
//   const transformedCollection = collections.docs.map(doc => {
//     const { title, items } = doc.data();

//     return {
//       routeName: encodeURI(title.toLowerCase()),
//       id: doc.id,
//       title,
//       items
//     };
//   });
//   return transformedCollection.reduce((accumulator, collection) => {
//     accumulator[collection.title.toLowerCase()] = collection;
//     return accumulator;
//   }, {});
// };

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
