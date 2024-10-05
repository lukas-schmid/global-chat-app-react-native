// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd_w02vyiyCNE522DcNd7gzCn5V4NAAgY",
  authDomain: "chatapp-29145.firebaseapp.com",
  projectId: "chatapp-29145",
  storageBucket: "chatapp-29145.appspot.com",
  messagingSenderId: "994388147663",
  appId: "1:994388147663:web:1388763935798f84b626ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
