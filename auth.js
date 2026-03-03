import { auth } from "./firebase-init.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const provider = new GoogleAuthProvider();

function qs(sel) {
  return document.querySelector(sel);
}

export function initAuthUI() {
  const loginBtn = qs("#loginBtn");
  const logoutBtn = qs("#logoutBtn");
  const userChip = qs("#userChip");

  if (!loginBtn || !logoutBtn || !userChip) return;

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") return;
      console.error(err);
      alert(err?.message || "Login failed");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userChip.textContent = user.displayName || user.email || "Signed in";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      userChip.style.display = "inline-block";
    } else {
      userChip.style.display = "none";
      logoutBtn.style.display = "none";
      loginBtn.style.display = "inline-block";
    }
  });
}