import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBQuUaG_jhfDZpKTdEX2bDQi184lRiBFzg",
    authDomain: "easyetch-2764f.firebaseapp.com",
    projectId: "easyetch-2764f",
    storageBucket: "easyetch-2764f.appspot.com",
    messagingSenderId: "429626063303",
    appId: "1:429626063303:web:e163bac12113c7b43c01e2"
  };

// initialize Firebase App
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH};