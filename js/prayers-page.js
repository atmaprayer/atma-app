// js/prayers-page.js
// Renders prayers from /data/prayers.json
// - Exactly 8 are free; the rest are premium-locked
// - Uses <html data-premium="true|false"> set by premium-access.js
// - Listens to "atma:access" to re-render lock states

const DATA_URL = "./data/prayers.json";

const DEITY_META = {
  all:       { label: "All Deities", icon: "ॐ" },
  ganesha:   { label: "Ganesha", icon: "🐘" },
  shiva:     { label: "Shiva", icon: "🔱" },
  vishnu:    { label: "Vishnu", icon: "🪷" },
  hanuman:   { label: "Hanuman", icon: "🙏" },
  devi:      { label: "Devi / Durga", icon: "⚡" },
  lakshmi:   { label: "Lakshmi", icon: "🌸" },
  surya:     { label: "Surya", icon: "☀️" },
  saraswati: { label: "Saraswati", icon: "🎵" }
};

function isPremiumUser() {
  return document.documentElement.dataset.premium === "true";
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nl2br(str = "") {
  return escapeHtml(str).replaceAll("\n", "<br>");
}

function normalize(s = "") {
  return String(s).toLowerCase().trim();
}

function prayerMatches(prayer, { filter, deity, query }) {
  // Deity filter
  if (deity !== "all") {
    if (prayer.deity !== deity) return false;
  }

  // Tab filter
  if (filter !== "all") {
    const types = [prayer.type, ...(prayer.time || [])].map(normalize);
    if (!types.some(t => t.includes(filter))) return false;
  }

  // Search query
  if (query) {
    const haystack = [
      prayer.title,
      prayer.categoryLine,
      prayer.description,
      prayer.previewSanskrit,
      prayer.deity,
      prayer.type,
      ...(prayer.time || []),
      prayer.text?.sanskrit,
      prayer.text?.transliteration,
      prayer.text?.translation
    ].filter(Boolean).join(" ").toLowerCase();

    if (!haystack.includes(query)) return false;
  }

  return true;
}

function buildDeityList(prayers) {
  const deityListEl = document.getElementById("deityList");
  if (!deityListEl) return;

  const counts = {};
  for (const p of prayers) {
    counts[p.deity] = (counts[p.deity] || 0) + 1;
  }

  const total = prayers.length;

  const deityOrder = ["all", "ganesha", "shiva", "vishnu", "hanuman", "devi", "lakshmi", "surya", "saraswati"];
  deityListEl.innerHTML = deityOrder.map((key) => {
    const meta = DEITY_META[key] || { label: key, icon: "ॐ" };
    const count = key === "all" ? total : (counts[key] || 0);
    const active = key === "all" ? "active" : "";
    return `
      <li class="deity-item ${active}" data-deity="${escapeHtml(key)}">
        <span class="deity-icon">${escapeHtml(meta.icon)}</span> ${escapeHtml(meta.label)}
        <span class="deity-count">${count}</span>
      </li>
    `;
  }).join("");
}

function updateFreePremiumCounts(prayers) {
  const freeCountEl = document.getElementById("freeCount");
  const premiumCountEl = document.getElementById("premiumCount");
  const free = prayers.filter(p => !p.isPremium).length;
  const prem = prayers.filter(p => !!p.isPremium).length;

  if (freeCountEl) freeCountEl.textContent = String(free);
  if (premiumCountEl) premiumCountEl.textContent = String(prem);
}

function renderPrayers(prayers, state) {
  const grid = document.getElementById("prayerGrid");
  if (!grid) return;

  const premiumUser = isPremiumUser();

  const filtered = prayers.filter(p => prayerMatches(p, state));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="padding: 24px; border: 1px solid rgba(244,196,48,0.08); background: rgba(255,248,238,0.02);">
        <div style="font-family:'Cinzel',serif; letter-spacing:.18em; font-size: 11px; color: rgba(244,196,48,0.75); text-transform: uppercase; margin-bottom: 10px;">
          No results
        </div>
        <div style="color: rgba(255,248,238,0.65); line-height: 1.7;">
          Try a different search or clear filters.
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((p) => {
    const tags = [
      ...(p.time || []),
      p.type,
      p.duration,
      p.isPremium ? "Premium" : "Free"
    ].filter(Boolean);

    // If premium prayer & user not premium -> show only preview + locked teaser
    const showPremiumContent = p.isPremium ? premiumUser : true;

    return `
      <div class="prayer-card" data-id="${escapeHtml(p.id)}"
           data-filter="${escapeHtml([p.type, ...(p.time || [])].join(" "))}"
           data-deity="${escapeHtml(p.deity)}">

        ${p.isPremium && !premiumUser ? `<div class="lock-badge">🔒 Premium</div>` : ""}

        <div class="prayer-header" data-action="toggle">
          <div class="prayer-icon">${escapeHtml(p.icon || "ॐ")}</div>
          <div class="prayer-meta">
            <div class="prayer-category">${escapeHtml(p.categoryLine || "")}</div>
            <div class="prayer-name">${escapeHtml(p.title || "")}</div>
            <div class="prayer-sanskrit">${escapeHtml(p.previewSanskrit || "")}</div>
            <div class="prayer-desc">${escapeHtml(p.description || "")}</div>
            <div class="prayer-tags">
              ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
            </div>
          </div>
          <div class="prayer-expand">▾</div>
        </div>

        <div class="prayer-content">
          <div class="prayer-content-inner">

            <div class="verse-block">
              <div class="verse-number">${escapeHtml(p.text?.label || "Prayer")}</div>
              <div class="verse-sanskrit">${nl2br(showPremiumContent ? (p.text?.sanskrit || "") : (p.text?.sanskrit || ""))}</div>
              <div class="verse-transliteration">${nl2br(p.text?.transliteration || "")}</div>
              <div class="verse-translation">${nl2br(p.text?.translation || "")}</div>
            </div>

            ${showPremiumContent && p.meaning ? `
              <div class="meaning-box">
                <div class="meaning-title">Meaning & Practice</div>
                <div class="meaning-text">${nl2br(p.meaning)}</div>
              </div>
            ` : ""}

            ${p.isPremium && !premiumUser ? `
              <div class="locked-teaser">
                <p><strong>Unlock Premium</strong> for deeper meaning + guided chanting + audio placeholders (ready when you upload files).</p>
                <a href="premium.html" class="nav-cta">Go Premium</a>
              </div>
            ` : ""}

            ${p.isPremium && premiumUser && p.premium?.chantGuide ? `
              <div class="meaning-box" style="margin-top: 18px;">
                <div class="meaning-title">Premium Guidance</div>
                <div class="meaning-text">${nl2br(p.premium.chantGuide)}</div>
              </div>
            ` : ""}

          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach toggle behavior
  grid.querySelectorAll('[data-action="toggle"]').forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.closest(".prayer-card");
      const wasOpen = card.classList.contains("open");
      grid.querySelectorAll(".prayer-card.open").forEach(c => c.classList.remove("open"));
      if (!wasOpen) card.classList.add("open");
    });
  });
}

export async function initPrayersPage() {
  const state = { filter: "all", deity: "all", query: "" };
  let prayers = [];

  // Load data
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
    prayers = await res.json();
  } catch (e) {
    console.error(e);
    const grid = document.getElementById("prayerGrid");
    if (grid) {
      grid.innerHTML = `
        <div style="padding: 24px; border: 1px solid rgba(255,107,26,0.2); background: rgba(255,107,26,0.06);">
          <div style="font-family:'Cinzel',serif; letter-spacing:.18em; font-size: 11px; color: rgba(255,107,26,0.9); text-transform: uppercase; margin-bottom: 10px;">
            Couldn’t load prayers
          </div>
          <div style="color: rgba(255,248,238,0.75); line-height: 1.7;">
            Check that <code style="color: rgba(244,196,48,0.85);">data/prayers.json</code> exists and is served by your host.
          </div>
        </div>
      `;
    }
    return;
  }

  // Build sidebar counts
  buildDeityList(prayers);
  updateFreePremiumCounts(prayers);

  // Tab filters
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.filter = tab.dataset.filter || "all";
      renderPrayers(prayers, state);
    });
  });

  // Deity filters (sidebar injected)
  const deityListEl = document.getElementById("deityList");
  if (deityListEl) {
    deityListEl.addEventListener("click", (e) => {
      const item = e.target.closest(".deity-item");
      if (!item) return;

      deityListEl.querySelectorAll(".deity-item").forEach(d => d.classList.remove("active"));
      item.classList.add("active");

      state.deity = item.dataset.deity || "all";
      renderPrayers(prayers, state);
    });
  }

  // Search
  const search = document.getElementById("searchInput");
  if (search) {
    search.addEventListener("input", () => {
      state.query = normalize(search.value);
      renderPrayers(prayers, state);
    });
  }

  // Initial render
  renderPrayers(prayers, state);

  // Re-render when premium status resolves/changes
  window.addEventListener("atma:access", () => {
    renderPrayers(prayers, state);
  });
}
