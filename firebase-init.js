// firebase-init.js
// Firebase (CDN / ES Modules) for GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// 1) Replace the object below with your Firebase Web App config (Firebase Console → Project settings → Your apps)
// 2) Make sure your GitHub Pages domain (YOURNAME.github.io) is added in Auth → Settings → Authorized domains
export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN",
  projectId: "PASTE_YOUR_PROJECT_ID",
  appId: "PASTE_YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
