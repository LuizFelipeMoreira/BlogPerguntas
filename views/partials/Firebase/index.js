import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCqfdIeXyHbvnBVL83vXWbuw_kgaaRu6_w',
  authDomain: 'test-firebase-40fab.firebaseapp.com',
  projectId: 'test-firebase-40fab',
  storageBucket: 'test-firebase-40fab.appspot.com',
  messagingSenderId: '181980870483',
  appId: '1:181980870483:web:eecbe33ddec2ef83fed3a6',
  measurementId: 'G-910QV570FW',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDocs(collection(db, 'games')).then((querySnapshot) =>
  querySnapshot.docs.forEach((doc) => {
    console.log(doc.data());
  })
);

const newDoc = {
  title: 'Gta V',
  developerBy: 'Rockstar Games',
};

console.log(collection(db, 'games'));
