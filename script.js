const burger = document.querySelector(".burger");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const header = document.querySelector(".site-header");
const year = document.querySelector("#current-year");

if (year) {
  year.textContent = new Date().getFullYear();
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
    threshold: 0.14,
    rootMargin: "0px 0px -70px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll("section[id]");

function updateNavigation() {
  header.classList.toggle("scrolled", window.scrollY > 40);

  let activeSection = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;

    if (window.scrollY >= sectionTop) {
      activeSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeSection}`);
  });
}

window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("load", updateNavigation);
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});
