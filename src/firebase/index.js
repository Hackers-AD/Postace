// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDR56fXU5CDRoXFN0kY59nyBLtUA4YsKvI",
  authDomain: "postace1.firebaseapp.com",
  projectId: "postace1",
  storageBucket: "postace1.appspot.com",
  messagingSenderId: "423281130339",
  appId: "1:423281130339:web:c585bcb716beb3cf48f156",
  measurementId: "G-9HPY9LTM2Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);