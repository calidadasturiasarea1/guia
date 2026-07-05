/* ==========================================================
   Guía de Acogida · Área Sanitaria I — script.js (multi-página)
   ========================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---- Navegación móvil ---- */
  function initNav() {
    const sidebar = $("#sidebar");
    const backdrop = $("#sidebar-backdrop");
    const openBtn = $("#mobile-nav-toggle");
    const closeBtn = $("#mobile-nav-close");
    function open() { sidebar.classList.remove("-translate-x-full"); backdrop.classList.remove("hidden"); openBtn?.setAttribute("aria-expanded", "true"); }
    function close() { sidebar.classList.add("-translate-x-full"); backdrop.classList.add("hidden"); openBtn?.setAttribute("aria-expanded", "false"); }
    openBtn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);
    $$(".nav-link").forEach((l) => l.addEventListener("click", () => { if (window.innerWidth < 1024) close(); }));

    const backToTop = $("#back-to-top");
    window.addEventListener("scroll", () => backToTop.classList.toggle("hidden", window.scrollY < 500));
    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---- Modo oscuro ---- */
  function initDarkMode() {
    const root = document.documentElement;
    const stored = localStorage.getItem("guia-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) root.classList.add("dark");
    function sync() {
      const isDark = root.classList.contains("dark");
      $$("#icon-moon-d, #icon-moon-m").forEach((i) => i.classList.toggle("hidden", isDark));
      $$("#icon-sun-d, #icon-sun-m").forEach((i) => i.classList.toggle("hidden", !isDark));
      const label = $("#dark-label-d");
      if (label) label.textContent = isDark ? "Modo claro" : "Modo oscuro";
    }
    function toggle() {
      root.classList.toggle("dark");
      localStorage.setItem("guia-theme", root.classList.contains("dark") ? "dark" : "light");
      sync();
    }
    $("#dark-toggle-desktop")?.addEventListener("click", toggle);
    $("#dark-toggle-mobile")?.addEventListener("click", toggle);
    sync();
  }

  /* ---- Buscador dentro de la página actual ---- */
  function initSearch() {
    const input = $("#site-search");
    const countLabel = $("#search-count");
    if (!input) return;
    const blocks = $$("main [data-searchable]");
    const cache = blocks.map((b) => ({ el: b, html: b.innerHTML }));
    let t;
    input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => run(input.value.trim()), 150); });

    function run(query) {
      if (!query) {
        cache.forEach((c) => { c.el.innerHTML = c.html; c.el.classList.remove("search-hidden"); });
        countLabel.classList.add("hidden");
        return;
      }
      const q = query.toLowerCase();
      let matches = 0;
      cache.forEach((c) => {
        if (c.html.toLowerCase().includes(q)) {
          c.el.innerHTML = highlight(c.html, query);
          c.el.classList.remove("search-hidden");
          matches++;
        } else {
          c.el.innerHTML = c.html;
          c.el.classList.add("search-hidden");
        }
      });
      countLabel.textContent = matches ? `${matches} bloque(s) con coincidencias en esta página` : "Sin resultados en esta página";
      countLabel.classList.remove("hidden");
    }
    function highlight(html, query) {
      const escQ = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(${escQ})`, "gi");
      return html.replace(/(>)([^<]+)(<)/g, (m, open, text, close) => {
        if (!re.test(text)) return m;
        re.lastIndex = 0;
        return open + text.replace(re, '<mark class="search-hit">$1</mark>') + close;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initDarkMode();
    initSearch();
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
