// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD7uDyo38CG5X3sEY56JP_ybbxZyq9byXk",
  authDomain: "ecobay-a413e.firebaseapp.com",
  projectId: "ecobay-a413e",
  storageBucket: "ecobay-a413e.firebasestorage.app",
  messagingSenderId: "526726819881",
  appId: "1:526726819881:web:005e61606001184764ec38",
  measurementId: "G-47N9G9RYFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
initializeApp(firebaseConfig);
export const auth = getAuth(app);