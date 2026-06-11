/* ===== LOADER ===== */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});

/* ===== CUSTOM CURSOR ===== */
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = 0,
    mouseY = 0,
    ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a, button, input, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.style.width = "56px";
      cursorRing.style.height = "56px";
      cursorRing.style.opacity = "0.3";
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.style.width = "36px";
      cursorRing.style.height = "36px";
      cursorRing.style.opacity = "0.5";
    });
  });
}

/* ===== PARTICLES BACKGROUND ===== */
(function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#6366f1";

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.06 * (1 - dist / 120);
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    resize();
    createParticles();
    draw();
  });
})();

/* ===== TYPED TEXT ===== */
(function initTyped() {
  const el = document.getElementById("typedText");
  if (!el) return;

  const phrases = [
    "Développeur Web",
    "Étudiant en Informatique",
    "Créateur d'interfaces",
    "Passionné de code",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
})();

/* ===== HEADER SCROLL ===== */
const header = document.getElementById("header");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll(".nav-link");

const observerNav = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinkEls.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id,
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((section) => observerNav.observe(section));

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add("visible"), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
const statNumbers = document.querySelectorAll(".stat-number");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = +entry.target.dataset.target;
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            entry.target.textContent = target;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(current);
          }
        }, 25);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

statNumbers.forEach((el) => counterObserver.observe(el));

/* ===== SKILL BARS ===== */
const skillFills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + "%";
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

skillFills.forEach((el) => skillObserver.observe(el));

/* ===== PROJECT FILTER ===== */
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden-card", !show);

      if (show) {
        card.style.animation = "none";
        card.offsetHeight;
        card.style.animation = "fadeIn 0.5s ease forwards";
      }
    });
  });
});

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  icon.className =
    savedTheme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute(
    "data-theme",
    next === "dark" ? "" : "light",
  );
  if (next === "dark") document.documentElement.removeAttribute("data-theme");
  icon.className = next === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  localStorage.setItem("portfolio-theme", next);
});

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  contactForm.querySelectorAll(".form-group").forEach((group) => {
    const input = group.querySelector("input, textarea");
    const error = group.querySelector(".form-error");
    const value = input.value.trim();

    input.classList.remove("error");
    error.textContent = "";

    if (!value) {
      input.classList.add("error");
      error.textContent = "Ce champ est requis.";
      valid = false;
    } else if (
      input.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      input.classList.add("error");
      error.textContent = "Email invalide.";
      valid = false;
    }
  });

  if (valid) {
    formSuccess.classList.add("show");
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove("show"), 5000);
  }
});

/* ===== SMOOTH SCROLL FOR ANCHORS ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ===== FADE IN KEYFRAME (injected) ===== */
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
