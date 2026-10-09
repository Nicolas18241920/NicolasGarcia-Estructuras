import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrVw-DXBp5QoLCXBEWbUipmKazzfF9_f4",
  authDomain: "challenge-09-48c16.firebaseapp.com",
  projectId: "challenge-09-48c16",
  storageBucket: "challenge-09-48c16.firebasestorage.app",
  messagingSenderId: "499718201553",
  appId: "1:499718201553:web:f7143d0bdbd850c55aa5f0",
  measurementId: "G-4PT3C2V1YC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);