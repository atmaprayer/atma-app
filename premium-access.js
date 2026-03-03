// premium-access.js
// Lightweight, free-plan approach:
// - Reads /users/{uid}.isPremium from Firestore
// - If missing, creates the doc with isPremium=false
// - Sets data attributes on <html> so pages can show/hide premium areas
// - Broadcasts an event so pages can react (unlock cards, etc.)

import { app, auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const db = getFirestore(app);

function setPageState({ loggedIn, isPremium }) {
  const root = document.documentElement;
  root.dataset.loggedIn = loggedIn ? "true" : "false";
  root.dataset.premium = isPremium ? "true" : "false";

  // Toggle elements:
  // - data-premium="only" => show only if premium
  // - data-premium="lock" => show only if NOT premium
  // - data-auth="only" => show only if logged in
  // - data-auth="guest" => show only if logged OUT
  document.querySelectorAll("[data-premium]").forEach((el) => {
    const mode = el.getAttribute("data-premium");
    if (mode === "only") el.style.display = isPremium ? "" : "none";
    if (mode === "lock") el.style.display = isPremium ? "none" : "";
  });

  document.querySelectorAll("[data-auth]").forEach((el) => {
    const mode = el.getAttribute("data-auth");
    if (mode === "only") el.style.display = loggedIn ? "" : "none";
    if (mode === "guest") el.style.display = loggedIn ? "none" : "";
  });

  // Let pages react (e.g., re-render session cards once premium is known)
  window.dispatchEvent(
    new CustomEvent("atma:access", { detail: { loggedIn, isPremium } })
  );
}

export function initPremiumAccess() {
  // Default state while loading
  setPageState({ loggedIn: false, isPremium: false });

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setPageState({ loggedIn: false, isPremium: false });
      return;
    }

    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Create user doc on first login
        await setDoc(ref, {
          email: user.email || null,
          displayName: user.displayName || null,
          isPremium: false,
          createdAt: Date.now()
        });
        setPageState({ loggedIn: true, isPremium: false });
        return;
      }

      const data = snap.data() || {};
      setPageState({ loggedIn: true, isPremium: !!data.isPremium });
    } catch (e) {
      console.error("Premium check failed:", e);
      setPageState({ loggedIn: true, isPremium: false });
    }
  });
}
