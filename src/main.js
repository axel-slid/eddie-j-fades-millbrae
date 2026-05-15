const body = document.body;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const hero = document.querySelector("[data-motion-hero]");
const revealItems = document.querySelectorAll(".reveal");
const bookingForm = document.querySelector("[data-booking-form]");

body.classList.add("motion-ready");

const closeMenu = () => {
  body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

hero?.addEventListener(
  "pointermove",
  (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    hero.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
    hero.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
  },
  { passive: true },
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const getBookingMessage = () => {
  if (!(bookingForm instanceof HTMLFormElement)) return "";

  const formData = new FormData(bookingForm);
  const name = String(formData.get("name") || "").trim();
  const service = String(formData.get("service") || "").trim();
  const day = String(formData.get("day") || "").trim();
  const time = String(formData.get("time") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  return [
    "Hi Eddie J. Fades, I would like to confirm appointment availability.",
    `Name: ${name || "Not provided"}`,
    `Service: ${service || "Not selected"}`,
    `Preferred day: ${day || "Not provided"}`,
    `Preferred time: ${time || "Not provided"}`,
    `Notes: ${notes || "None"}`,
  ].join("\n");
};

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(bookingForm instanceof HTMLFormElement) || !bookingForm.reportValidity()) {
    return;
  }

  window.location.href = `sms:+14155770511?body=${encodeURIComponent(getBookingMessage())}`;
});
