// YEAR AUTO UPDATE
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // INTERSECTION OBSERVER FOR FADE-UP ANIMATION
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

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

// MOBILE NAV TOGGLE
function toggleMobileNav() {
  const nav = document.querySelector("nav");
  const btn = document.querySelector(".mobile-toggle");

  // Toggle display based on current computed style or inline style
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

// GALLERY MODAL
function openModal(src) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  if (modal && modalImg) {
    modalImg.src = src;
    modal.classList.add("open");
  }
}

function closeModal(e) {
  if (e.target.id === "modal") {
    document.getElementById("modal").classList.remove("open");
  }
}

// CLOSE MODAL WITH ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("open");
  }
});

// BOOKING FORM
function submitBooking(e) {
  e.preventDefault();
  const ci = document.getElementById("checkin").value;
  const co = document.getElementById("checkout").value;
  const guests = document.getElementById("guests").value;

  if (!ci || !co) {
    alert("Please choose valid dates.");
    return;
  }
  if (ci > co) {
    alert("Check-out date must be after check-in date.");
    return;
  }

  // Redirect to booking page with params
  window.location.href = `booking.html?checkin=${ci}&checkout=${co}&guests=${encodeURIComponent(
    guests
  )}`;
}

// TABLE RESERVATION
function reserveTable(e) {
  e.preventDefault();
  const date = document.getElementById("res-date").value;
  const time = document.getElementById("res-time").value;
  const name = document.getElementById("res-name").value;

  if (date && time && name) {
    alert(
      `Table request received for ${name} on ${date} at ${time}. We will confirm shortly.`
    );
  } else {
    alert("Please fill in all fields.");
  }
}

// CONTACT FORM
function submitContact(e) {
  e.preventDefault();
  alert("Thank you for your message. We will get back to you shortly.");
  document.getElementById("cname").value = "";
  document.getElementById("cemail").value = "";
  document.getElementById("cmessage").value = "";
}

// RESERVATION MODAL LOGIC
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

// Close on outside click
document.addEventListener("click", function (e) {
  const modal = document.getElementById("reservationModal");
  if (modal && e.target === modal) {
    closeReservationModal();
  }
});

// Close on Esc key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeReservationModal();
  }
});

// Submit reservation form
function submitReservation(e) {
  e.preventDefault();

  const date = document.getElementById("reservationDate").value;
  const time = document.getElementById("reservationTime").value;
  const guests = document.getElementById("reservationGuests").value;
  const name = document.getElementById("reservationName").value;
  const email = document.getElementById("reservationEmail").value;
  const phone = document.getElementById("reservationPhone").value;
  const occasion = document.getElementById("reservationOccasion").value;
  const notes = document.getElementById("reservationNotes").value;

  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Populate success modal
  document.getElementById("confirmName").textContent = name;
  document.getElementById("confirmDate").textContent = formattedDate;
  document.getElementById("confirmTime").textContent = time;
  document.getElementById("confirmGuests").textContent = guests;
  document.getElementById("confirmEmail").textContent = email;
  document.getElementById("confirmPhone").textContent = phone;

  // Show occasion if provided
  if (occasion) {
    document.getElementById("confirmOccasion").textContent =
      occasion.charAt(0).toUpperCase() + occasion.slice(1);
    document.getElementById("confirmOccasionRow").style.display = "flex";
  } else {
    document.getElementById("confirmOccasionRow").style.display = "none";
  }

  // Close reservation modal and show success modal
  closeReservationModal();

  // Small delay for smooth transition
  setTimeout(() => {
    const successModal = document.getElementById("reservationSuccessModal");
    if (successModal) {
      successModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }, 300);

  // Reset form
  document.querySelector(".reservation-form").reset();
}

// Close success modal
function closeReservationSuccessModal() {
  const modal = document.getElementById("reservationSuccessModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

// Simple rotation for testimonials (keeps things lively)
(function () {
  const list = document.getElementById("testimonialsList");
  const cards = list
    ? Array.from(list.querySelectorAll(".testimonial-card"))
    : [];
  let idx = 0;
  const showCard = (i) => {
    cards.forEach((c, j) => (c.style.display = j === i ? "block" : "none"));
  };
  if (cards.length) {
    showCard(0);
    // auto rotate every 6s
    const rot = setInterval(() => {
      idx = (idx + 1) % cards.length;
      showCard(idx);
    }, 6000);

    // prev / next buttons
    const prev = document.getElementById("prevTest");
    const next = document.getElementById("nextTest");
    if (prev)
      prev.addEventListener("click", () => {
        idx = (idx - 1 + cards.length) % cards.length;
        showCard(idx);
      });
    if (next)
      next.addEventListener("click", () => {
        idx = (idx + 1) % cards.length;
        showCard(idx);
      });

    // stop rotation on hover for better reading
    list.addEventListener("mouseenter", () => clearInterval(rot), {
      once: true,
    });
  }
})();
// Testimonials carousel
(function () {
  const slides = Array.from(document.querySelectorAll("#testCarousel .slide"));
  const dotsContainer = document.getElementById("carouselDots");
  let idx = 0;
  if (!slides.length) return;

  // create dots
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

  // next/prev
  const next = document.getElementById("nextSlide");
  const prev = document.getElementById("prevSlide");
  if (next)
    next.addEventListener("click", () => show((idx + 1) % slides.length));
  if (prev)
    prev.addEventListener("click", () =>
      show((idx - 1 + slides.length) % slides.length)
    );

  // auto rotate
  let auto = setInterval(() => show((idx + 1) % slides.length), 6000);
  // pause on hover
  const carousel = document.getElementById("testCarousel");
  carousel.addEventListener("mouseenter", () => clearInterval(auto), {
    once: true,
  });

  // init
  show(0);
})();

// ============================
// ADD REVIEW → TESTIMONIALS CAROUSEL (LEFT SIDE)
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reviewModal");
  const openBtn = document.querySelector(".open-review-btn");
  const closeBtn = document.querySelector(".close-modal");
  const submitBtn = document.querySelector(".submit-review-btn");
  const stars = document.querySelectorAll(".star-rating span");

  let selectedRating = 0;

  // ⭐ STAR SELECTION
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      stars.forEach((s, i) => s.classList.toggle("active", i < selectedRating));
    });
  });

  // ⭐ OPEN MODAL
  openBtn.addEventListener("click", () => {
    resetReviewForm();
    modal.style.display = "flex";
  });

  // ⭐ CLOSE MODAL
  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // ⭐ RESET FORM EVERY TIME
  function resetReviewForm() {
    document.querySelector(".review-input:nth-of-type(1)").value = "";
    document.querySelector(".review-input:nth-of-type(2)").value = "";
    document.querySelector(".review-textarea").value = "";
    selectedRating = 0;
    stars.forEach((s) => s.classList.remove("active"));
  }

  // ⭐ SUBMIT REVIEW → ADD TO LEFT SIDE
  submitBtn.addEventListener("click", () => {
    const name = document.querySelector(".review-input:nth-of-type(1)").value;
    const reviewText = document.querySelector(".review-textarea").value;

    if (!selectedRating || !name || !reviewText) {
      alert("Please fill all required fields.");
      return;
    }

    addReviewToCarousel(name, reviewText, selectedRating);
    modal.style.display = "none";
  });

  // ============================
  // FUNCTION: Insert New Review
  // ============================
  function addReviewToCarousel(name, reviewText, rating) {
    const track = document.getElementById("testimonialsTrack");

    // Convert rating number → stars (★)
    const stars = "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);

    // New Review HTML
    const reviewHTML = `
      <article class="testimonial-card featured new-review">
        <div class="quote">"${reviewText}"</div>
        <div class="meta">
          <div class="avatar" style="background-image:url('images/default-user.png')"></div>
          <div class="meta-text">
            <strong>${name}</strong>
            <span class="source">— Guest Review</span>
            <div class="rating">${stars}</div>
          </div>
        </div>
      </article>
    `;

    // Insert at TOP
    track.insertAdjacentHTML("afterbegin", reviewHTML);

    // Rebuild carousel dots & slides
    rebuildCarousel();
  }

  // ============================
  // REBUILD CAROUSEL (Dots + Slides)
  // ============================
  function rebuildCarousel() {
    const slides = document.querySelectorAll(
      "#testimonialsTrack .testimonial-card"
    );
    const dotsContainer = document.getElementById("carouselDots");

    dotsContainer.innerHTML = ""; // Reset dots

    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer.appendChild(dot);
    });

    showSlide(0); // Always show newest slide
  }

  // ============================
  // SHOW SLIDE
  // ============================
  function showSlide(i) {
    const slides = document.querySelectorAll(
      "#testimonialsTrack .testimonial-card"
    );
    const dots = document.querySelectorAll(".carousel-dot");

    slides.forEach(
      (s, idx) => (s.style.display = idx === i ? "block" : "none")
    );
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }

  rebuildCarousel(); // Initial load
});

// VIRTUAL TOUR MODAL
const tourBtn = document.querySelector(".vt-start-btn");
const tourModal = document.getElementById("tourModal");
const tourClose = document.querySelector(".tour-close");

tourBtn.addEventListener("click", () => {
  tourModal.style.display = "flex";
});

tourClose.addEventListener("click", () => {
  tourModal.style.display = "none";
});

// close when clicking outside
tourModal.addEventListener("click", (e) => {
  if (e.target === tourModal) {
    tourModal.style.display = "none";
  }
});
/* =========================================
      AI CHATBOT — GOOGLE GEMINI API
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const chatbotBtn = document.getElementById("aiChatbotBtn");
  const chatPopup = document.getElementById("aiChatPopup");
  const closeChat = document.getElementById("closeAiChat");
  const sendBtn = document.getElementById("sendAiMsg");
  const input = document.getElementById("aiChatInput");
  const bodyChat = document.getElementById("aiChatBody");

  if (
    !chatbotBtn ||
    !chatPopup ||
    !closeChat ||
    !sendBtn ||
    !input ||
    !bodyChat
  ) {
    console.error("Chatbot elements not found!");
    return;
  }

  // TOGGLE POPUP (open/close)
  chatbotBtn.onclick = () => {
    if (chatPopup.style.display === "flex") {
      chatPopup.style.display = "none";
    } else {
      chatPopup.style.display = "flex";
    }
  };
  closeChat.onclick = () => {
    chatPopup.style.display = "none";
  };

  // SCROLL HELPER
  function scrollChat() {
    bodyChat.scrollTop = bodyChat.scrollHeight;
  }
  // SEND GOOGLE MAP INSIDE CHAT
  function addMapMessage() {
    const mapBox = document.createElement("div");
    mapBox.className = "ai-map-box";

    mapBox.innerHTML = `
    <div class="map-title">📍 Sharrow Bay Location</div>
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2311.7982480160163!2d-2.846408923300556!3d54.589928972675935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487ce5710030c0c1%3A0x65eed713a0bf4b8f!2sSharrow%20Bay!5e0!3m2!1sen!2sin!4v1764324283869!5m2!1sen!2sin"
      width="100%" height="180"
      style="border:0; border-radius:12px;"
      allowfullscreen="" loading="lazy">
    </iframe>
  `;

    bodyChat.appendChild(mapBox);
    scrollChat();
  }

  // ADD USER MESSAGE
  function addUserMessage(text) {
    bodyChat.innerHTML += `<div class="ai-msg user">${text}</div>`;
    scrollChat();
  }

  // ADD BOT MESSAGE WITH DYNAMIC BUTTONS
  function addBotMessage(text, userQuestion = "") {
    const msgDiv = document.createElement("div");
    msgDiv.className = "ai-msg bot";
    msgDiv.textContent = text;
    bodyChat.appendChild(msgDiv);

    // Detect keywords and add action buttons
    const lowerText = text.toLowerCase();
    const buttons = [];

    if (lowerText.includes("room") || lowerText.includes("accommodation")) {
      buttons.push({ text: "🏨 View Rooms", link: "#rooms" });
    }
    if (
      lowerText.includes("dining") ||
      lowerText.includes("restaurant") ||
      lowerText.includes("menu")
    ) {
      buttons.push({ text: "🍽️ View Dining", link: "#dining" });
    }
    if (
      lowerText.includes("event") ||
      lowerText.includes("occasion") ||
      lowerText.includes("celebration")
    ) {
      buttons.push({ text: "🎉 View Events", link: "#events" });
    }
    // if (lowerText.includes("afternoon tea") || lowerText.includes("tea")) {
    //   buttons.push({ text: "☕ Book Afternoon Tea", link: "#afternoon-tea" });
    // }
    if (
      lowerText.includes("contact") ||
      lowerText.includes("reservation") ||
      lowerText.includes("booking")
    ) {
      buttons.push({ text: "📞 Contact Us", link: "#book" });
    }

    // AUTO-SEND MAP - Check USER'S QUESTION, not bot's response
    const lowerUserQuestion = userQuestion.toLowerCase();
    if (
      lowerUserQuestion.includes("location") ||
      lowerUserQuestion.includes("address") ||
      lowerUserQuestion.includes("where are you") ||
      lowerUserQuestion.includes("where is") ||
      lowerUserQuestion.includes("how to get") ||
      lowerUserQuestion.includes("how to reach") ||
      lowerUserQuestion.includes("find you") ||
      lowerUserQuestion.includes("directions") ||
      lowerUserQuestion.includes("map")
    ) {
      setTimeout(() => addMapMessage(), 300); // slight delay (more natural)
    }

    // Add buttons if any were detected
    if (buttons.length > 0) {
      const btnContainer = document.createElement("div");
      btnContainer.className = "ai-action-buttons";

      buttons.forEach((btn) => {
        const button = document.createElement("a");
        button.href = btn.link;
        button.className = "ai-action-btn";
        button.textContent = btn.text;
        button.onclick = () => {
          chatPopup.style.display = "none"; // Close chatbot
        };
        btnContainer.appendChild(button);
      });

      bodyChat.appendChild(btnContainer);
    }

    scrollChat();
  }

// SEND MESSAGE → Cloudflare Worker (Safe, No API Key in Frontend)
async function sendToGroq(msg) {
  const workerURL = "https://YOUR-WORKER-URL.workers.dev";

  const systemPrompt = `You are Sharrow Bay Hotel's AI assistant. You are helpful, friendly, and knowledgeable about the hotel.
Respond in 2–3 short, friendly sentences. Be warm and professional.`;

  try {
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: msg,
        system: systemPrompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Worker Error:", data);
      addBotMessage("⚠️ I'm having trouble connecting. Please try again later.");
      return;
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't understand that.";

    addBotMessage(reply, msg);
  } catch (err) {
    console.error("Network Error:", err);
    addBotMessage("⚠️ Network error. Please try again.");
  }
}


  // ============================
  // SUGGESTION CHIPS
  // ============================
  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const text = chip.textContent;
      addUserMessage(text);
      sendToGroq(text);
    });
  });

  // ============================
  // CLEAR CHAT
  // ============================
  const clearBtn = document.getElementById("clearChatBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      // Keep only the first message (Bot greeting)
      const firstMsg = bodyChat.querySelector(".ai-msg.bot");
      bodyChat.innerHTML = "";
      if (firstMsg) bodyChat.appendChild(firstMsg);
    });
  }

  // SEND BUTTON CLICK
  sendBtn.onclick = () => {
    const msg = input.value.trim();
    if (!msg) return;

    addUserMessage(msg);
    input.value = "";
    sendToGroq(msg);
  };

  // ENTER KEY SUPPORT
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });
});

/* ============================
   EVENT JOIN POPUP - FIXED
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  // Elements (defensive)
  const eventJoinModal = document.getElementById("eventJoinModal");
  const eventSuccessModal = document.getElementById("eventSuccessModal");
  const eventForm = document.getElementById("eventJoinForm");
  const joinClose = document.querySelector(".event-join-close");
  const successCloseBtn = document.getElementById("successCloseBtn");

  // Buttons that should open the modal (all three classes)
  const triggerButtons = Array.from(
    document.querySelectorAll(
      ".reserve-seat-btn, .join-experience-btn, .book-now-btn"
    )
  );

  // Sanity checks (logs help debug)
  if (!eventJoinModal)
    console.error(
      'eventJoinModal element not found. Make sure HTML contains id="eventJoinModal".'
    );
  if (!eventForm)
    console.warn("eventJoinForm not found. Form will not submit.");
  if (!triggerButtons.length)
    console.warn(
      "No trigger buttons found with classes .reserve-seat-btn, .join-experience-btn, .book-now-btn"
    );
  if (!eventSuccessModal)
    console.warn("eventSuccessModal not found. Success popup won't show.");

  // Helper to open modal
  function openJoinModal(e) {
    if (!eventJoinModal) return;
    eventJoinModal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Autofill name if saved
    const savedName = localStorage.getItem("visitorName");
    const nameInput = document.getElementById("eventName");
    if (savedName && nameInput) nameInput.value = savedName;

    // Set date min to today
    const dateInput = document.getElementById("eventDate");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
    }

    // If the trigger button contains data about event type, preselect it (optional)
    const trigger = e && e.currentTarget;
    if (trigger && trigger.dataset && trigger.dataset.event) {
      const sel = document.getElementById("eventType");
      if (sel) sel.value = trigger.dataset.event;
    }
  }

  // Attach open listeners
  triggerButtons.forEach((btn) => {
    btn.addEventListener("click", openJoinModal);
  });

  // Close functions
  function closeJoin() {
    if (!eventJoinModal) return;
    eventJoinModal.style.display = "none";
    document.body.style.overflow = "";
  }

  if (joinClose) joinClose.addEventListener("click", closeJoin);

  // Close on outside click
  if (eventJoinModal) {
    eventJoinModal.addEventListener("click", (ev) => {
      if (ev.target === eventJoinModal) closeJoin();
    });
  }

  // Submit form
  if (eventForm) {
    eventForm.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const nameEl = document.getElementById("eventName");
      const emailEl = document.getElementById("eventEmail");
      const phoneEl = document.getElementById("eventPhone");
      const typeEl = document.getElementById("eventType");
      const dateEl = document.getElementById("eventDate");

      // Basic validation
      if (!nameEl || !nameEl.value.trim()) {
        alert("Please enter your name.");
        nameEl && nameEl.focus();
        return;
      }
      if (!emailEl || !emailEl.value.trim()) {
        alert("Please enter your email.");
        emailEl && emailEl.focus();
        return;
      }
      if (!dateEl || !dateEl.value) {
        alert("Please choose an event date.");
        dateEl && dateEl.focus();
        return;
      }

      // Save name for future visits
      localStorage.setItem("visitorName", nameEl.value.trim());

      // You can send the data to server here (AJAX/fetch). For now we show success modal:
      closeJoin();

      if (eventSuccessModal) {
        eventSuccessModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      } else {
        // fallback toast
        alert("Reservation confirmed — thank you!");
      }

      // (Optional) Clear form or keep values
      // eventForm.reset();
    });
  }

  // Success close
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => {
      if (eventSuccessModal) {
        eventSuccessModal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  }

  // Close success modal on outside click
  if (eventSuccessModal) {
    eventSuccessModal.addEventListener("click", (ev) => {
      if (ev.target === eventSuccessModal) {
        eventSuccessModal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  }

  // Developer helper: expose open function (for quick manual test from console)
  window.__openEventJoinModal = openJoinModal;
});

// =============================================
// CHATBOT FIX - Add this to the END of script.js
// This ensures chatbot is visible on mobile
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  // Force chatbot button to be visible
  const chatbotBtn = document.getElementById("aiChatbotBtn");
  const chatPopup = document.getElementById("aiChatPopup");

  if (chatbotBtn) {
    console.log("✅ Chatbot button found!");

    // Force visibility
    chatbotBtn.style.display = "flex";
    chatbotBtn.style.visibility = "visible";
    chatbotBtn.style.opacity = "1";
    chatbotBtn.style.position = "fixed";
    chatbotBtn.style.bottom = "20px";
    chatbotBtn.style.right = "20px";
    chatbotBtn.style.zIndex = "99999";

    console.log("✅ Chatbot styles applied!");
    console.log("Chatbot position:", chatbotBtn.getBoundingClientRect());
  } else {
    console.error("❌ Chatbot button NOT found in DOM!");
    console.log("Creating chatbot button...");

    // Create chatbot button if it doesn't exist
    const newBtn = document.createElement("div");
    newBtn.id = "aiChatbotBtn";
    newBtn.innerHTML = "💬";
    newBtn.style.cssText = `
      display: flex !important;
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 56px !important;
      height: 56px !important;
      background: #c5a059 !important;
      border-radius: 50% !important;
      color: white !important;
      font-size: 26px !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      z-index: 99999 !important;
    `;

    // Add click handler
    newBtn.addEventListener("click", function () {
      if (chatPopup) {
        if (chatPopup.style.display === "flex") {
          chatPopup.style.display = "none";
        } else {
          chatPopup.style.display = "flex";
        }
      }
    });

    document.body.appendChild(newBtn);
    console.log("✅ Chatbot button created!");
  }

  // Test on window resize
  window.addEventListener("resize", function () {
    const btn = document.getElementById("aiChatbotBtn");
    if (btn && window.innerWidth <= 768) {
      btn.style.display = "flex";
      btn.style.visibility = "visible";
    }
  });
});

// Additional check after 1 second
setTimeout(function () {
  const chatbotBtn = document.getElementById("aiChatbotBtn");
  if (chatbotBtn) {
    console.log(
      "🔍 Final check - Chatbot computed styles:",
      window.getComputedStyle(chatbotBtn).display,
      window.getComputedStyle(chatbotBtn).visibility,
      window.getComputedStyle(chatbotBtn).zIndex
    );
  }
}, 1000);
