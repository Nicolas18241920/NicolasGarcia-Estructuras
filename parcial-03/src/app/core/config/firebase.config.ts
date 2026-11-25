import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyDAb7u5oF4QFQch9_dw4RfpEdm-Ka1SONg',
  authDomain: 'parcial-03-f6f39.firebaseapp.com',
  projectId: 'parcial-03-f6f39',
  storageBucket: 'parcial-03-f6f39.firebasestorage.app',
  messagingSenderId: '430757517312',
  appId: '1:430757517312:web:b3a2fc99523c096d4fe0e5',
  measurementId: 'G-JQNSXEJK7X',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
