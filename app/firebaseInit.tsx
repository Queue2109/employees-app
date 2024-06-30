// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABHoDJIAIE8CtAmlPqrpAIsyyYOa7Jtxg",
  authDomain: "employeeapp-2bc94.firebaseapp.com",
  databaseURL: "https://employeeapp-2bc94-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "employeeapp-2bc94",
  storageBucket: "employeeapp-2bc94.appspot.com",
  messagingSenderId: "62688016576",
  appId: "1:62688016576:web:2ab9b349470b7b52139525",
  measurementId: "G-9C9VEEQR4Q"
};


export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);