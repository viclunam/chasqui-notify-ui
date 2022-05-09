import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHHjZb039dM2sIu-5tyyOQkV3ClgDEVN0",
  authDomain: "chasqui-8cf97.firebaseapp.com",
  projectId: "chasqui-8cf97",
  storageBucket: "chasqui-8cf97.appspot.com",
  messagingSenderId: "173766677978",
  appId: "1:173766677978:web:424f74fde9a8b0c55ddce3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app
export const db = getFirestore(app);
export const storage = getStorage(app);