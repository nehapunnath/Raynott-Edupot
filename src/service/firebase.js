// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZxBv4umzMyuyvv6eYsnddVkUuWMsz0UA",
  authDomain: "raynott-edupot.firebaseapp.com",
  projectId: "raynott-edupot",
  storageBucket: "raynott-edupot.firebasestorage.app",
  messagingSenderId: "435000439829",
  appId: "1:435000439829:web:56e14dc2062f9bccabca1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

export default app;
