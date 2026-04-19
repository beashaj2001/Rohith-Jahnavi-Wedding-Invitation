const loader = document.getElementById("loader");
const invitationSplash = document.getElementById("invitation-splash");
const openInvitationBtn = document.getElementById("open-invitation");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const progressBar = document.querySelector(".progress-pill span");
const countdown = document.getElementById("countdown");
const galleryTabs = document.querySelectorAll(".gallery__tab");
const galleryPanels = document.querySelectorAll(".gallery__panel");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxClose = document.getElementById("lightbox-close");
const music = document.getElementById("bg-music");
const wishesForm = document.getElementById("wishes-form");
const wishesNote = document.getElementById("wishes-note");
const parallaxShells = document.querySelectorAll(".parallax-shell");
const isCoarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const videoShell = document.getElementById("video-shell");
const trailerOverlay = document.getElementById("trailer-overlay");
const trailerFrame = document.getElementById("trailer-frame");

// Music plays automatically without controls

async function startMusicPlayback() {
  if (!music) {
    return false;
  }

  music.volume = 0.35;

  try {
    await music.play();
    return true;
  } catch (error) {
    return false;
  }
}

function primeMusic() {
  if (!music) {
    return;
  }

  music.preload = "auto";
  music.load();
  
  // Set up splash screen interaction to trigger music
  if (openInvitationBtn && invitationSplash) {
    openInvitationBtn.addEventListener("click", () => {
      // Hide splash screen
      invitationSplash.classList.add("is-hidden");
      
      // Start music on button click
      startMusicPlayback().catch(() => {
        // If it still fails, retry immediately
        startMusicPlayback();
      });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", primeMusic, { once: true });
} else {
  primeMusic();
}

window.addEventListener("load", () => {
  loader.classList.add("is-hidden");
  bootPetals();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: isCoarsePointer ? 0.1 : 0.18,
  rootMargin: isCoarsePointer ? "0px 0px -8% 0px" : "0px"
});

revealItems.forEach((item) => revealObserver.observe(item));

if (!isCoarsePointer) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  parallaxShells.forEach((shell) => {
    shell.addEventListener("pointermove", (event) => {
      const rect = shell.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      shell.querySelectorAll(".hero__visual-layer, .divine-portrait, .blessing__frame").forEach((layer, index) => {
        const depth = 12 + (index * 8);
        const moveX = offsetX * depth;
        const moveY = offsetY * depth;
        layer.style.setProperty("--move-x", `${moveX}px`);
        layer.style.setProperty("--move-y", `${moveY}px`);
      });
    });

    shell.addEventListener("pointerleave", () => {
      shell.querySelectorAll(".hero__visual-layer, .divine-portrait, .blessing__frame").forEach((layer) => {
        layer.style.removeProperty("--move-x");
        layer.style.removeProperty("--move-y");
      });
    });
  });
}

function updateCountdown() {
  const target = new Date("2026-04-29T07:29:00+05:30").getTime();
  const now = Date.now();
  const distance = target - now;

  if (distance <= 0) {
    countdown.innerHTML = `
      <div><strong>00</strong><span>Days</span></div>
      <div><strong>00</strong><span>Hours</span></div>
      <div><strong>00</strong><span>Minutes</span></div>
      <div><strong>00</strong><span>Seconds</span></div>
    `;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdown.innerHTML = `
    <div><strong>${String(days).padStart(2, "0")}</strong><span>Days</span></div>
    <div><strong>${String(hours).padStart(2, "0")}</strong><span>Hours</span></div>
    <div><strong>${String(minutes).padStart(2, "0")}</strong><span>Minutes</span></div>
    <div><strong>${String(seconds).padStart(2, "0")}</strong><span>Seconds</span></div>
  `;
}

updateCountdown();
setInterval(updateCountdown, 1000);

window.addEventListener("scroll", () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  const hero = document.querySelector(".hero");
  const backdrop = document.querySelector(".hero__backdrop");
  if (hero && backdrop) {
    const offset = window.scrollY * 0.12;
    backdrop.style.transform = `translate3d(0, ${offset}px, 0)`;
  }
});

galleryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    galleryTabs.forEach((btn) => {
      btn.classList.toggle("is-active", btn === tab);
      btn.setAttribute("aria-selected", String(btn === tab));
    });

    galleryPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

document.querySelectorAll(".gallery-card").forEach((card) => {
  const imageFile = card.dataset.lightboxImage;
  card.style.backgroundImage = `url('${imageFile}')`;
  card.style.backgroundSize = "contain";
  card.style.backgroundPosition = "center";
  card.style.backgroundRepeat = "no-repeat";
  card.style.backgroundColor = "#f7f1e8";
  
  card.addEventListener("click", () => {
    const title = card.dataset.lightboxTitle;
    const theme = card.dataset.theme;
    lightboxTitle.textContent = title;
    lightboxImage.className = "lightbox__image";
    lightboxImage.dataset.theme = theme;
    lightboxImage.style.backgroundImage = `url('${imageFile}')`;
    lightboxImage.style.backgroundSize = "contain";
    lightboxImage.style.backgroundPosition = "center";
    lightboxImage.style.backgroundRepeat = "no-repeat";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

if (trailerOverlay && videoShell && trailerFrame) {
  trailerOverlay.addEventListener("click", () => {
    videoShell.classList.add("is-playing");
    trailerFrame.src = trailerFrame.dataset.autoplaySrc;
  });
}

if (wishesForm && wishesNote) {
  wishesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(wishesForm);
    const name = data.get("name");
    wishesNote.textContent = `Blessings received with love, ${name}.`;
    wishesForm.reset();
  });
}

function bootPetals() {
  const canvas = document.getElementById("petal-canvas");
  const context = canvas.getContext("2d");
  const petals = [];
  const petalCount = window.innerWidth < 720 ? 18 : 32;

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function createPetal() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: 8 + Math.random() * 12,
      speedY: 0.4 + Math.random() * 1.4,
      speedX: -0.5 + Math.random(),
      rotation: Math.random() * Math.PI,
      rotationSpeed: (-0.03 + Math.random() * 0.06),
      color: ["#f0d0cb", "#f5e2bf", "#e6c987", "#f4d5b8"][Math.floor(Math.random() * 4)]
    };
  }

  function drawPetal(petal) {
    context.save();
    context.translate(petal.x, petal.y);
    context.rotate(petal.rotation);
    context.fillStyle = petal.color;
    context.beginPath();
    context.moveTo(0, 0);
    context.quadraticCurveTo(petal.size * 0.9, petal.size * 0.3, 0, petal.size);
    context.quadraticCurveTo(-petal.size * 0.9, petal.size * 0.3, 0, 0);
    context.fill();
    context.restore();
  }

  function animate() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    petals.forEach((petal) => {
      petal.y += petal.speedY;
      petal.x += petal.speedX + Math.sin(petal.y * 0.01) * 0.25;
      petal.rotation += petal.rotationSpeed;

      if (petal.y > window.innerHeight + 30) {
        Object.assign(petal, createPetal(), { y: -20 });
      }

      drawPetal(petal);
    });

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  petals.length = 0;
  for (let index = 0; index < petalCount; index += 1) {
    petals.push(createPetal());
  }

  window.addEventListener("resize", resizeCanvas);
  animate();
}
