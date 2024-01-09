
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCSkwAAITHxkQIxz-t3wWCEOzEHu5R4jkQ",
  authDomain: "listener-1d38a.firebaseapp.com",
  projectId: "listener-1d38a",
  storageBucket: "listener-1d38a.appspot.com",
  messagingSenderId: "1044396730352",
  appId: "1:1044396730352:web:a45906d82bc483c362df35",
  measurementId: "G-V6XFH7DZ2T"
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
 const database = getDatabase(app);
  const storage = getStorage(app);

export { database, storage };

