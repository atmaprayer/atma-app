import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVVRzI90Ry14Aj5G-6fv82EDXNoeo09ec",
  authDomain: "atma-app-30e21.firebaseapp.com",
  projectId: "atma-app-30e21",
  storageBucket: "atma-app-30e21.firebasestorage.app",
  messagingSenderId: "401057661341",
  appId: "1:401057661341:web:58ed3573bfa9200fa5af74",
  measurementId: "G-JB2Q1DKEER"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);