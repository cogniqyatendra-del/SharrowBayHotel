/* =========================================================================
   Sharrow Bay Hotel - script.js
   Full Expanded Version (all features preserved + fixes)
   - Modular init blocks
   - Defensive checks (no null.addEventListener errors)
   - Cloudflare Worker integration (no secret in frontend)
   - Short replies + user-based dynamic buttons
   ========================================================================= */

/* =========================
   UTILS & COMMON INITIALIZER
   ========================= */
(function globalInit() {
  // YEAR AUTO UPDATE
  document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // INTERSECTION OBSERVER FOR FADE-UP ANIMATION
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-up");
    fadeElements.forEach((el) => observer.observe(el));
  });

  // Global helper: safe query selector
  window.$ = (sel) => document.querySelector(sel);
  window.$$ = (sel) => Array.from(document.querySelectorAll(sel));
})();

/* =========================
   MOBILE NAV TOGGLE (GLOBAL)
   ========================= */
function toggleMobileNav() {
  const nav = document.querySelector("nav");
  const btn = document.querySelector(".mobile-toggle");
  if (!nav || !btn) return;

  const isFlex = window.getComputedStyle(nav).display === "flex";

  if (isFlex && nav.classList.contains("mobile-active")) {
    nav.classList.remove("mobile-active");
    nav.style.display = ""; // Reset to CSS default
    btn.setAttribute("aria-expanded", "false");
  } else {
    nav.classList.add("mobile-active");
    nav.style.display = "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "100%";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "white";
    nav.style.padding = "20px";
    nav.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    nav.style.zIndex = "99";
    btn.setAttribute("aria-expanded", "true");
  }
}

/* =========================
   GALLERY MODAL
   ========================= */
function openModal(src) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  if (modal && modalImg) {
    modalImg.src = src;
    modal.classList.add("open");
  }
}
function closeModal(e) {
  if (e && e.target && e.target.id === "modal") {
    const modalEl = document.getElementById("modal");
    if (modalEl) modalEl.classList.remove("open");
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("open");
  }
});

/* =========================
   BOOKING FORM
   ========================= */
function submitBooking(e) {
  if (e) e.preventDefault();
  const ciEl = document.getElementById("checkin");
  const coEl = document.getElementById("checkout");
  const guestsEl = document.getElementById("guests");
  if (!ciEl || !coEl) {
    alert("Please choose valid dates.");
    return;
  }

  const ci = ciEl.value;
  const co = coEl.value;
  const guests = guestsEl ? guestsEl.value : "";

  if (!ci || !co) {
    alert("Please choose valid dates.");
    return;
  }
  if (ci > co) {
    alert("Check-out date must be after check-in date.");
    return;
  }

  window.location.href = `booking.html?checkin=${ci}&checkout=${co}&guests=${encodeURIComponent(
    guests
  )}`;
}

/* =========================
   TABLE RESERVATION
   ========================= */
function reserveTable(e) {
  if (e) e.preventDefault();
  const date = document.getElementById("res-date")?.value || "";
  const time = document.getElementById("res-time")?.value || "";
  const name = document.getElementById("res-name")?.value || "";

  if (date && time && name) {
    alert(
      `Table request received for ${name} on ${date} at ${time}. We will confirm shortly.`
    );
  } else {
    alert("Please fill in all fields.");
  }
}

/* =========================
   CONTACT FORM
   ========================= */
function submitContact(e) {
  if (e) e.preventDefault();
  alert("Thank you for your message. We will get back to you shortly.");
  const cname = document.getElementById("cname");
  const cemail = document.getElementById("cemail");
  const cmessage = document.getElementById("cmessage");
  if (cname) cname.value = "";
  if (cemail) cemail.value = "";
  if (cmessage) cmessage.value = "";
}

/* =========================
   RESERVATION MODAL LOGIC
   ========================= */
function openReservationModal() {
  const modal = document.getElementById("reservationModal");
  if (modal) {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}
function closeReservationModal() {
  const modal = document.getElementById("reservationModal");
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}
document.addEventListener("click", function (e) {
  const modal = document.getElementById("reservationModal");
  if (modal && e.target === modal) {
    closeReservationModal();
  }
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeReservationModal();
  }
});

/* =========================
   TESTIMONIALS ROTATION
   ========================= */
(function initTestimonialsRotation() {
  const list = document.getElementById("testimonialsList");
  const cards = list ? Array.from(list.querySelectorAll(".testimonial-card")) : [];
  if (!cards.length) return;

  let idx = 0;
  const showCard = (i) => {
    cards.forEach((c, j) => (c.style.display = j === i ? "block" : "none"));
  };
  showCard(0);

  const rot = setInterval(() => {
    idx = (idx + 1) % cards.length;
    showCard(idx);
  }, 6000);

  const prev = document.getElementById("prevTest");
  const next = document.getElementById("nextTest");
  if (prev) prev.addEventListener("click", () => { idx = (idx - 1 + cards.length) % cards.length; showCard(idx); });
  if (next) next.addEventListener("click", () => { idx = (idx + 1) % cards.length; showCard(idx); });

  if (list) {
    list.addEventListener("mouseenter", () => clearInterval(rot), { once: true });
  }
})();

/* =========================
   TESTIMONIALS CAROUSEL (dots & slides)
   ========================= */
(function initTestimonialsCarousel() {
  const slides = Array.from(document.querySelectorAll("#testCarousel .slide"));
  const dotsContainer = document.getElementById("carouselDots");
  if (!slides.length || !dotsContainer) return;

  let idx = 0;
  slides.forEach((s, i) => {
    const d = document.createElement("button");
    d.className = "carousel-dot";
    d.setAttribute("aria-label", "Show testimonial " + (i + 1));
    d.addEventListener("click", () => show(i));
    dotsContainer.appendChild(d);
  });

  const dots = Array.from(dotsContainer.children);
  function show(i) {
    slides.forEach((s, ii) => (s.style.display = ii === i ? "block" : "none"));
    dots.forEach((d, ii) => d.classList.toggle("active", ii === i));
    idx = i;
  }

  const next = document.getElementById("nextSlide");
  const prev = document.getElementById("prevSlide");
  if (next) next.addEventListener("click", () => show((idx + 1) % slides.length));
  if (prev) prev.addEventListener("click", () => show((idx - 1 + slides.length) % slides.length));

  let auto = setInterval(() => show((idx + 1) % slides.length), 6000);
  const carousel = document.getElementById("testCarousel");
  if (carousel) carousel.addEventListener("mouseenter", () => clearInterval(auto), { once: true });

  show(0);
})();

/* =========================
   REVIEW MODAL (full feature)
   ========================= */
(function initReviewModal() {
  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reviewModal");
    if (!modal) return;

    const openBtn = document.querySelector(".open-review-btn");
    const closeBtn = document.querySelector(".close-modal");
    const submitBtn = document.querySelector(".submit-review-btn");
    const stars = Array.from(document.querySelectorAll(".star-rating span"));

    let selectedRating = 0;

    if (stars.length) {
      stars.forEach((star, index) => {
        star.addEventListener("click", () => {
          selectedRating = index + 1;
          stars.forEach((s, i) => s.classList.toggle("active", i < selectedRating));
        });
      });
    }

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        resetReviewForm();
        modal.style.display = "flex";
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => (modal.style.display = "none"));
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    function resetReviewForm() {
      const inp1 = document.querySelector(".review-input:nth-of-type(1)");
      const inp2 = document.querySelector(".review-input:nth-of-type(2)");
      const textarea = document.querySelector(".review-textarea");
      if (inp1) inp1.value = "";
      if (inp2) inp2.value = "";
      if (textarea) textarea.value = "";
      selectedRating = 0;
      stars.forEach((s) => s.classList.remove("active"));
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const nameEl = document.querySelector(".review-input:nth-of-type(1)");
        const reviewTextEl = document.querySelector(".review-textarea");
        const name = nameEl ? nameEl.value.trim() : "";
        const reviewText = reviewTextEl ? reviewTextEl.value.trim() : "";

        if (!selectedRating || !name || !reviewText) {
          alert("Please fill all required fields.");
          return;
        }

        addReviewToCarousel(name, reviewText, selectedRating);
        modal.style.display = "none";
      });
    }

    function addReviewToCarousel(name, reviewText, rating) {
      const track = document.getElementById("testimonialsTrack");
      if (!track) return;

      const starsText = "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
      const reviewHTML = `
        <article class="testimonial-card featured new-review">
          <div class="quote">"${reviewText}"</div>
          <div class="meta">
            <div class="avatar" style="background-image:url('images/default-user.png')"></div>
            <div class="meta-text">
              <strong>${name}</strong>
              <span class="source">— Guest Review</span>
              <div class="rating">${starsText}</div>
            </div>
          </div>
        </article>
      `;
      track.insertAdjacentHTML("afterbegin", reviewHTML);
      rebuildCarousel();
    }

    function rebuildCarousel() {
      const slides = document.querySelectorAll("#testimonialsTrack .testimonial-card");
      const dotsContainer = document.getElementById("carouselDots");
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";

      slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.addEventListener("click", () => showSlide(index));
        dotsContainer.appendChild(dot);
      });
      showSlide(0);
    }

    function showSlide(i) {
      const slides = document.querySelectorAll("#testimonialsTrack .testimonial-card");
      const dots = document.querySelectorAll(".carousel-dot");
      slides.forEach((s, idx) => (s.style.display = idx === i ? "block" : "none"));
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    }

    // initial build (if track exists)
    rebuildCarousel();
  });
})();

/* =========================
   VIRTUAL TOUR MODAL
   ========================= */
(function initVirtualTourModal() {
  const tourBtn = document.querySelector(".vt-start-btn");
  const tourModal = document.getElementById("tourModal");
  const tourClose = document.querySelector(".tour-close");

  if (tourBtn && tourModal) {
    tourBtn.addEventListener("click", () => {
      tourModal.style.display = "flex";
    });
  }
  if (tourClose && tourModal) {
    tourClose.addEventListener("click", () => {
      tourModal.style.display = "none";
    });
  }
  if (tourModal) {
    tourModal.addEventListener("click", (e) => {
      if (e.target === tourModal) tourModal.style.display = "none";
    });
  }
})();

/* =========================
   AI CHATBOT — Cloudflare Worker (CORS-enabled)
   ========================= */
(function initChatbotBlock() {
  document.addEventListener("DOMContentLoaded", () => {
    const chatbotBtn = document.getElementById("aiChatbotBtn");
    const chatPopup = document.getElementById("aiChatPopup");
    const closeChat = document.getElementById("closeAiChat");
    const sendBtn = document.getElementById("sendAiMsg");
    const input = document.getElementById("aiChatInput");
    const bodyChat = document.getElementById("aiChatBody");

    // defensive checks — if chatbot not present, skip init
    if (!chatbotBtn || !chatPopup || !closeChat || !sendBtn || !input || !bodyChat) {
      console.warn("Chatbot elements not found — skipping chatbot init on this page.");
      return;
    }

    // toggle popup
    chatbotBtn.addEventListener("click", () => {
      chatPopup.style.display = chatPopup.style.display === "flex" ? "none" : "flex";
    });
    closeChat.addEventListener("click", () => {
      chatPopup.style.display = "none";
    });

    // helper: scroll
    function scrollChat() {
      bodyChat.scrollTop = bodyChat.scrollHeight;
    }

    // add map bubble
    function addMapMessage() {
      const mapBox = document.createElement("div");
      mapBox.className = "ai-map-box";
      mapBox.innerHTML = `
        <div class="map-title">📍 Sharrow Bay Location</div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2311.7982480160163!2d-2.846408923300556!3d54.589928972675935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487ce5710030c0c1%3A0x65eed713a0bf4b8f!2sSharrow%20Bay!5e0!3m2!1sen!2sin!4v1764324283869!5m2!1sen!2sin" width="100%" height="180" style="border:0; border-radius:12px;" allowfullscreen="" loading="lazy"></iframe>
      `;
      bodyChat.appendChild(mapBox);
      scrollChat();
    }

    // add user message
    function addUserMessage(text) {
      bodyChat.innerHTML += `<div class="ai-msg user">${escapeHtml(text)}</div>`;
      scrollChat();
    }

    // add bot message + dynamic buttons (based on user message only)
    function addBotMessage(text, userMessage = "") {
      const msgDiv = document.createElement("div");
      msgDiv.className = "ai-msg bot";
      msgDiv.textContent = text;
      bodyChat.appendChild(msgDiv);

      // Decide buttons based strictly on user input (so AI phrasing won't cause extra buttons)
      const lowerUser = (userMessage || "").toLowerCase();
      const buttons = [];

      if (lowerUser.includes("room") || lowerUser.includes("rooms") || lowerUser.includes("rate") || lowerUser.includes("booking")) {
        buttons.push({ text: "🏨 View Rooms", link: "#rooms" });
      }

      if (lowerUser.includes("dining") || lowerUser.includes("restaurant") || lowerUser.includes("menu") || lowerUser.includes("food")) {
        buttons.push({ text: "🍽️ View Dining", link: "#dining" });
      }

      if (lowerUser.includes("event") || lowerUser.includes("events") || lowerUser.includes("celebration") || lowerUser.includes("wedding")) {
        buttons.push({ text: "🎉 View Events", link: "#events" });
      }

      if (lowerUser.includes("contact") || lowerUser.includes("phone") || lowerUser.includes("call") || lowerUser.includes("reserve")) {
        buttons.push({ text: "📞 Contact Us", link: "#book" });
      }

      // render buttons (only if any). Avoid duplicates by clearing previous action buttons below the last bot message.
      if (buttons.length > 0) {
        const btnContainer = document.createElement("div");
        btnContainer.className = "ai-action-buttons";

        buttons.forEach((btn) => {
          const button = document.createElement("a");
          button.href = btn.link;
          button.className = "ai-action-btn";
          button.textContent = btn.text;
          button.addEventListener("click", () => (chatPopup.style.display = "none"));
          btnContainer.appendChild(button);
        });

        bodyChat.appendChild(btnContainer);
      }

      scrollChat();
    }

    // Escape HTML (defensive)
    function escapeHtml(unsafe) {
      return unsafe
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    // CLOUDflare Worker function — secure. Uses strict system prompt and message array.
    async function sendToGroq(msg) {
      // Your CORS-enabled worker URL (update if different)
      const workerURL = "https://silent-hat-00fc.cogniq-yatendra.workers.dev";

      // Strict system prompt to force short replies
      const systemPrompt = `You are Sharrow Bay Hotel's official AI assistant.
RULES:
- Reply in 2–3 short, friendly sentences ONLY.
- Be brief, professional and helpful.
- Do NOT provide long definitions or encyclopedic content.
- If user asks for details (rates, menus), give a short summary and offer to show the page or contact.
- If the user asks something outside the hotel's services, reply politely that you can only help with Sharrow Bay related info.
- Do NOT include dynamic buttons or UI instructions in the reply.`;

      // Build messages array: system + user
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: msg }
      ];

      try {
        // Send to your Cloudflare Worker which will proxy request to Groq
        const response = await fetch(workerURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages,
            temperature: 0.6,
            max_tokens: 120
          })
        });

        // Parse JSON safely
        const data = await response.json().catch(() => null);

        if (!response.ok || !data) {
          console.error("Worker Error or invalid JSON:", data);
          addBotMessage("⚠️ I'm having trouble connecting right now. Please try again later.", msg);
          return;
        }

        // Extract reply (model-specific structure)
        const reply = (data?.choices?.[0]?.message?.content) || (data?.choices?.[0]?.text) || "I'm sorry, I couldn't understand that.";
        addBotMessage(reply.trim(), msg);
      } catch (err) {
        console.error("Network Error:", err);
        addBotMessage("⚠️ Network error. Please try again.", msg);
      }
    }

    // suggestion chips
    document.querySelectorAll(".suggestion-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const text = chip.textContent;
        addUserMessage(text);
        sendToGroq(text);
      });
    });

    // Clear chat
    const clearBtn = document.getElementById("clearChatBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const firstMsg = bodyChat.querySelector(".ai-msg.bot");
        bodyChat.innerHTML = "";
        if (firstMsg) bodyChat.appendChild(firstMsg);
      });
    }

    // Send button logic
    sendBtn.addEventListener("click", () => {
      const msg = input.value.trim();
      if (!msg) return;
      addUserMessage(msg);
      input.value = "";
      sendToGroq(msg);
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });

    // Auto-initialize greeting (if bodyChat empty)
    (function maybeAddGreeting() {
      const hasBotGreeting = !!bodyChat.querySelector(".ai-msg.bot");
      if (!hasBotGreeting) {
        addBotMessage("Hello! I'm Sharrow Bay's assistant — ask me about rooms, dining, or events.", "");
      }
    })();
  });
})();

/* =========================
   EVENT JOIN POPUP
   ========================= */
(function initEventJoinPopup() {
  document.addEventListener("DOMContentLoaded", () => {
    const eventJoinModal = document.getElementById("eventJoinModal");
    const eventSuccessModal = document.getElementById("eventSuccessModal");
    const eventForm = document.getElementById("eventJoinForm");
    const joinClose = document.querySelector(".event-join-close");
    const successCloseBtn = document.getElementById("successCloseBtn");
    const triggerButtons = Array.from(document.querySelectorAll(".reserve-seat-btn, .join-experience-btn, .book-now-btn"));

    if (!eventJoinModal) {
      console.warn('eventJoinModal element not found. Make sure HTML contains id="eventJoinModal".');
    }
    if (!eventForm) console.warn("eventJoinForm not found. Form will not submit.");
    if (!triggerButtons.length) console.warn("No trigger buttons found with the expected classes.");
    if (!eventSuccessModal) console.warn("eventSuccessModal not found. Success popup won't show.");

    function openJoinModal(e) {
      if (!eventJoinModal) return;
      eventJoinModal.style.display = "flex";
      document.body.style.overflow = "hidden";

      const savedName = localStorage.getItem("visitorName");
      const nameInput = document.getElementById("eventName");
      if (savedName && nameInput) nameInput.value = savedName;

      const dateInput = document.getElementById("eventDate");
      if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.min = today;
      }

      const trigger = e && e.currentTarget;
      if (trigger && trigger.dataset && trigger.dataset.event) {
        const sel = document.getElementById("eventType");
        if (sel) sel.value = trigger.dataset.event;
      }
    }

    triggerButtons.forEach((btn) => btn.addEventListener("click", openJoinModal));
    if (joinClose) joinClose.addEventListener("click", () => { if (eventJoinModal) { eventJoinModal.style.display = "none"; document.body.style.overflow = ""; } });

    if (eventJoinModal) {
      eventJoinModal.addEventListener("click", (ev) => {
        if (ev.target === eventJoinModal) {
          eventJoinModal.style.display = "none";
          document.body.style.overflow = "";
        }
      });
    }

    if (eventForm) {
      eventForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const nameEl = document.getElementById("eventName");
        const emailEl = document.getElementById("eventEmail");
        const phoneEl = document.getElementById("eventPhone");
        const dateEl = document.getElementById("eventDate");

        if (!nameEl || !nameEl.value.trim()) { alert("Please enter your name."); nameEl && nameEl.focus(); return; }
        if (!emailEl || !emailEl.value.trim()) { alert("Please enter your email."); emailEl && emailEl.focus(); return; }
        if (!dateEl || !dateEl.value) { alert("Please choose an event date."); dateEl && dateEl.focus(); return; }

        localStorage.setItem("visitorName", nameEl.value.trim());

        if (eventJoinModal) { eventJoinModal.style.display = "none"; document.body.style.overflow = ""; }

        if (eventSuccessModal) {
          eventSuccessModal.style.display = "flex";
          document.body.style.overflow = "hidden";
        } else {
          alert("Reservation confirmed — thank you!");
        }
      });
    }

    if (successCloseBtn) {
      successCloseBtn.addEventListener("click", () => {
        if (eventSuccessModal) { eventSuccessModal.style.display = "none"; document.body.style.overflow = ""; }
      });
    }

    if (eventSuccessModal) {
      eventSuccessModal.addEventListener("click", (ev) => {
        if (ev.target === eventSuccessModal) { eventSuccessModal.style.display = "none"; document.body.style.overflow = ""; }
      });
    }

    // developer helper
    window.__openEventJoinModal = openJoinModal;
  });
})();

/* =========================
   CHATBOT MOBILE VISIBILITY FIXER (END)
   ========================= */
document.addEventListener("DOMContentLoaded", function () {
  const chatbotBtn = document.getElementById("aiChatbotBtn");
  const chatPopup = document.getElementById("aiChatPopup");

  if (chatbotBtn) {
    chatbotBtn.style.display = "flex";
    chatbotBtn.style.visibility = "visible";
    chatbotBtn.style.opacity = "1";
    chatbotBtn.style.position = "fixed";
    chatbotBtn.style.bottom = "20px";
    chatbotBtn.style.right = "20px";
    chatbotBtn.style.zIndex = "99999";
  } else {
    const newBtn = document.createElement("div");
    newBtn.id = "aiChatbotBtn";
    newBtn.innerHTML = "💬";
    newBtn.style.cssText = `display:flex;position:fixed;bottom:20px;right:20px;width:56px;height:56px;background:#c5a059;border-radius:50%;color:white;font-size:26px;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:99999;`;
    newBtn.addEventListener("click", function () {
      if (chatPopup) chatPopup.style.display = chatPopup.style.display === "flex" ? "none" : "flex";
    });
    document.body.appendChild(newBtn);
  }

  window.addEventListener("resize", function () {
    const btn = document.getElementById("aiChatbotBtn");
    if (btn && window.innerWidth <= 768) {
      btn.style.display = "flex";
      btn.style.visibility = "visible";
    }
  });

  setTimeout(function () {
    const btn = document.getElementById("aiChatbotBtn");
    if (btn) {
      console.log("🔍 Final check - Chatbot computed styles:", window.getComputedStyle(btn).display, window.getComputedStyle(btn).visibility, window.getComputedStyle(btn).zIndex);
    }
  }, 1000);
});

/* =========================
   EXTRA SAFEGUARDS & EXPORTS
   ========================= */

// Attach global functions to window for debugging/testing
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleMobileNav = toggleMobileNav;
window.submitBooking = submitBooking;
window.reserveTable = reserveTable;
window.submitContact = submitContact;
window.openReservationModal = openReservationModal;
window.closeReservationModal = closeReservationModal;

// End of script.js
