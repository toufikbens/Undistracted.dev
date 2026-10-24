const burger = document.querySelector(".burger");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const header = document.querySelector(".site-header");
const year = document.querySelector("#current-year");
const clock = document.querySelector("#local-time");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (clock) {
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  tick();
  setInterval(tick, 30000);
}

/* ── Theme toggle ────────────────────────────────── */

const themeToggle = document.querySelector("#theme-toggle");

function syncThemeButton() {
  if (!themeToggle) return;
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme"
  );
}

if (themeToggle) {
  syncThemeButton();
  themeToggle.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) {
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {}
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {}
    }
    syncThemeButton();
  });
}

function closeMenu() {
  navbar.classList.remove("active");
  burger.classList.remove("toggle");
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

burger.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("active");
  burger.classList.toggle("toggle", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealElements.forEach((element) => {
  const siblings = element.parentElement?.querySelectorAll(".reveal");
  if (siblings && siblings.length > 1) {
    const index = Array.from(siblings).indexOf(element);
    if (index > 0 && index < 4) {
      element.classList.add(`delay-${index}`);
    }
  }
  revealObserver.observe(element);
});

/* ── Embers ──────────────────────────────────────── */

const emberLayer = document.querySelector(".embers");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (emberLayer && !reduceMotion.matches) {
  const count = window.innerWidth < 768 ? 9 : 18;
  const random = (min, max) => min + Math.random() * (max - min);

  for (let i = 0; i < count; i++) {
    const ember = document.createElement("span");
    ember.className = "ember";
    ember.style.setProperty("--x", `${Math.random() * 100}%`);
    ember.style.setProperty("--size", `${random(2, 4.5).toFixed(1)}px`);
    ember.style.setProperty("--drift", `${random(-60, 60).toFixed(0)}px`);
    ember.style.setProperty("--rise", `${random(38, 54).toFixed(0)}vh`);
    ember.style.setProperty("--dur", `${random(7, 16).toFixed(1)}s`);
    ember.style.setProperty("--delay", `${(-Math.random() * 16).toFixed(1)}s`);
    ember.style.setProperty("--peak", random(0.35, 0.8).toFixed(2));
    emberLayer.appendChild(ember);
  }
}

const sections = Array.from(document.querySelectorAll(".nav-links a"))
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateNavigation() {
  header.classList.toggle("scrolled", window.scrollY > 40);

  let activeSection = sections[0] ? sections[0].id : "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) {
      activeSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${activeSection}`
    );
  });
}

let navTick = false;
window.addEventListener(
  "scroll",
  () => {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(() => {
      updateNavigation();
      navTick = false;
    });
  },
  { passive: true }
);
window.addEventListener("load", updateNavigation);
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});
