import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBdCSzzo9QaCxBmrjtsw69Sxo2UJINGuCk",
  authDomain: "sureshop-7a946.firebaseapp.com",
  databaseURL: "https://sureshop-7a946-default-rtdb.firebaseio.com",
  projectId: "sureshop-7a946",
  storageBucket: "sureshop-7a946.firebasestorage.app",
  messagingSenderId: "170105734610",
  appId: "1:170105734610:web:d387ab31441053bfe2740b",
  measurementId: "G-QXHWJ2K4VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
