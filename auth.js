// auth.js
import { auth } from "./firebase-init.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

function qs(sel) {
  return document.querySelector(sel);
}

export function initAuthUI() {
  const loginBtn = qs("#loginBtn");
  const logoutBtn = qs("#logoutBtn");
  const userChip = qs("#userChip");

  // If a page doesn't include the header for any reason, fail silently.
  if (!loginBtn || !logoutBtn || !userChip) return;

  loginBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Login failed");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userChip.textContent = user.displayName || user.email || "Signed in";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-flex";
      userChip.style.display = "inline-flex";
      localStorage.setItem("uid", user.uid);
    } else {
      userChip.textContent = "";
      loginBtn.style.display = "inline-flex";
      logoutBtn.style.display = "none";
      userChip.style.display = "none";
      localStorage.removeItem("uid");
    }
  });
}
