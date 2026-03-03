// firebase-init.js
// Firebase (CDN / ES Modules) for GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// 1) Replace the object below with your Firebase Web App config (Firebase Console → Project settings → Your apps)
// 2) Make sure your GitHub Pages domain (YOURNAME.github.io) is added in Auth → Settings → Authorized domains
export const firebaseConfig = {
  apiKey: "AIzaSyAVVRzI90Ry14Aj5G-6fv82EDXNoeo09ec",
  authDomain: "atma-app-30e21.firebaseapp.com",
  projectId: "atma-app-30e21",
  storageBucket: "atma-app-30e21.firebasestorage.app",
  messagingSenderId: "401057661341",
  appId: "1:401057661341:web:58ed3573bfa9200fa5af74",
  measurementId: "G-JB2Q1DKEER"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
