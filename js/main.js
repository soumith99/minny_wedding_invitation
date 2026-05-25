/**
 * Wedding invitation — scroll-driven themes, dot nav, audio, RSVP
 */

(function () {
  "use strict";

  const body = document.body;
  const themeMorph = document.getElementById("themeMorph");
  const audioToggle = document.getElementById("audioToggle");
  const ambientAudio = document.getElementById("ambientAudio");
  const eventDots = document.getElementById("eventDots");
  const rsvpBtn = document.getElementById("rsvpBtn");
  const rsvpModal = document.getElementById("rsvpModal");
  const rsvpClose = document.getElementById("rsvpClose");
  const rsvpForm = document.getElementById("rsvpForm");

  const ALL_EVENT_IDS = [
    "event-pk",
    "event-haldi",
    "event-wedding",
    "event-vratham",
    "event-sangeet",
    "event-reception",
  ];

  const MINIMAL_EVENT_IDS = ["event-wedding", "event-reception"];

  function getInviteTier() {
    return document.documentElement.dataset.inviteTier === "full" ? "full" : "minimal";
  }

  function getEventIds() {
    return getInviteTier() === "full" ? ALL_EVENT_IDS : MINIMAL_EVENT_IDS;
  }

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // --- Event cards in-view (parallax bg) ---
  document.querySelectorAll(".event-card").forEach((card) => {
    const obs = new IntersectionObserver(
      ([e]) => card.classList.toggle("in-view", e.isIntersecting),
      { threshold: 0.35 }
    );
    obs.observe(card);
  });

  // --- Global theme morph on scroll ---
  function getThemeSections() {
    const sections = [
      { el: document.getElementById("invocation"), theme: "ivory" },
      { el: document.getElementById("intro-groom"), theme: "twilight" },
      { el: document.getElementById("intro-bride"), theme: "marigold" },
      { el: document.getElementById("events"), theme: "events" },
      { el: document.getElementById("footer"), theme: "marigold" },
    ];
    return sections.filter((s) => s.el && s.el.offsetParent !== null);
  }

  let themeSections = getThemeSections();

  function updateGlobalTheme() {
    const vh = window.innerHeight * 0.45;
    let active = "ivory";
    for (const { el, theme } of themeSections) {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        active = theme;
      }
    }
    body.dataset.globalTheme = active;
  }

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          updateGlobalTheme();
          scrollTicking = false;
        });
      }
    },
    { passive: true }
  );
  updateGlobalTheme();

  // --- Intro cross-fade: slide modern out, traditional in ---
  const introGroom = document.getElementById("intro-groom");
  const introBride = document.getElementById("intro-bride");

  if (introGroom && introBride) {
    const introObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          if (entry.target === introGroom) {
            entry.target.style.opacity = String(Math.max(0.3, ratio));
            entry.target.style.transform = `translateX(${Math.round((1 - ratio) * -12)}px)`;
          }
          if (entry.target === introBride) {
            entry.target.style.transform = `translateX(${Math.round((1 - ratio) * 12)}px)`;
          }
        });
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );
    introObserver.observe(introGroom);
    introObserver.observe(introBride);
  }

  // --- Event dot navigation ---
  const dotButtons = eventDots?.querySelectorAll("button") ?? [];

  function scrollToEvent(targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 16;
    window.scrollTo({ top, behavior: "smooth" });
  }

  dotButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) scrollToEvent(target);
    });
  });

  const activeDotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dotButtons.forEach((btn) => {
            btn.classList.toggle(
              "is-active",
              btn.getAttribute("data-target") === id
            );
          });
        }
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  getEventIds().forEach((id) => {
    const card = document.getElementById(id);
    if (card) activeDotObserver.observe(card);
  });

  // Show dots only after events section
  const eventsSection = document.getElementById("events");
  if (eventsSection && eventDots) {
    const dotsVisibility = new IntersectionObserver(
      ([e]) => {
        eventDots.style.opacity = e.isIntersecting || e.boundingClientRect.top < 0 ? "1" : "0";
        eventDots.style.pointerEvents =
          e.isIntersecting || e.boundingClientRect.top < 0 ? "auto" : "none";
      },
      { threshold: 0 }
    );
    dotsVisibility.observe(eventsSection);
    eventDots.style.opacity = "0";
    eventDots.style.transition = "opacity 0.4s ease";
  }

  // --- Ambient audio ---
  const AUDIO_START_SEC = 16;

  function seekToAudioStart() {
    if (!ambientAudio || ambientAudio.duration <= AUDIO_START_SEC) return;
    if (ambientAudio.currentTime < AUDIO_START_SEC) {
      ambientAudio.currentTime = AUDIO_START_SEC;
    }
  }

  ambientAudio?.addEventListener("loadedmetadata", seekToAudioStart);
  ambientAudio?.addEventListener("timeupdate", () => {
    if (!ambientAudio.paused && ambientAudio.currentTime < AUDIO_START_SEC) {
      seekToAudioStart();
    }
  });

  audioToggle?.addEventListener("click", async () => {
    if (!ambientAudio) return;
    try {
      if (ambientAudio.paused) {
        seekToAudioStart();
        await ambientAudio.play();
        audioToggle.classList.add("is-playing");
        audioToggle.setAttribute("aria-pressed", "true");
      } else {
        ambientAudio.pause();
        audioToggle.classList.remove("is-playing");
        audioToggle.setAttribute("aria-pressed", "false");
      }
    } catch {
      audioToggle.title = "Could not play audio — tap to try again";
    }
  });

  // --- RSVP modal ---
  rsvpBtn?.addEventListener("click", () => {
    rsvpModal?.showModal();
  });

  rsvpClose?.addEventListener("click", () => rsvpModal?.close());

  rsvpModal?.addEventListener("click", (e) => {
    if (e.target === rsvpModal) rsvpModal.close();
  });

  // Configure your RSVP endpoint (Google Form, etc.)
  const RSVP_SUBMIT_URL = ""; // e.g. 'https://docs.google.com/forms/.../formResponse'

  rsvpForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(rsvpForm);
    const name = data.get("name");
    const guests = data.get("guests");
    const message = data.get("message");

    if (RSVP_SUBMIT_URL) {
      // POST to external form — customize field names to match your form
      fetch(RSVP_SUBMIT_URL, { method: "POST", mode: "no-cors", body: data }).finally(
        () => showRsvpThanks()
      );
    } else {
      const mailto = `mailto:rsvp@example.com?subject=${encodeURIComponent(
        "Wedding RSVP from " + name
      )}&body=${encodeURIComponent(
        `Name: ${name}\nGuests: ${guests}\n\n${message || ""}`
      )}`;
      window.location.href = mailto;
      showRsvpThanks();
    }
  });

  function showRsvpThanks() {
    const inner = rsvpModal?.querySelector(".rsvp-modal-inner");
    if (inner) {
      inner.innerHTML =
        '<h2>Thank you!</h2><p>Your warm wishes mean the world to us. We look forward to celebrating together.</p>';
    }
    setTimeout(() => rsvpModal?.close(), 2800);
  }
})();
