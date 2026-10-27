/* ==========================================================================
   Paws & Hearts Animal Rescue - Master Script (Part 3)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initActiveNavLink();
  initAutoFillEnquiry();
  initEnquiryForm();
  initContactForm();
  initPetFilters();
  initEventSorting();
  initCountUpStats();
  initPawPrintTrail();
  initLightbox();
  initAccordion();
});

/* --------------------------------------------------------------------------
   1. Active Navigation Highlight
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".site-navigation a");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* --------------------------------------------------------------------------
   2. URL Parameter Auto-Fill for Enquiry Form
   -------------------------------------------------------------------------- */
function initAutoFillEnquiry() {
  const urlParams = new URLSearchParams(window.location.search);
  const animal = urlParams.get("animal");
  const type = urlParams.get("type");

  if (type) {
    const typeSelect = document.getElementById("enquiry-type");
    if (typeSelect) typeSelect.value = type;
  }

  if (animal) {
    const nameInput = document.getElementById("animal-name");
    if (nameInput) nameInput.value = animal;
  }
}

/* --------------------------------------------------------------------------
   3. Validation Utilities (Instructive Messages & SA Phone Regex)
   -------------------------------------------------------------------------- */
function validateSouthAfricanPhone(phone) {
  const cleanPhone = phone.replace(/\s+/g, "");
  // Accepts +27 followed by 9 digits OR 0 followed by 9 digits (10 digits total)
  const saRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;
  return saRegex.test(cleanPhone);
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.style.borderColor = "#d9534f";
  field.style.backgroundColor = "#fff8f8";

  let errSpan = field.parentNode.querySelector(`.field-error-${fieldId}`);
  if (!errSpan) {
    errSpan = document.createElement("span");
    errSpan.className = `field-error-${fieldId} field-error-msg`;
    errSpan.style.color = "#d9534f";
    errSpan.style.fontSize = "0.85rem";
    errSpan.style.display = "block";
    errSpan.style.marginTop = "0.35rem";
    errSpan.style.fontWeight = "600";
    field.parentNode.insertBefore(errSpan, field.nextSibling);
  }
  errSpan.innerText = message;
}

function clearErrors(form) {
  const errors = form.querySelectorAll(".field-error-msg");
  errors.forEach((err) => err.remove());
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.style.borderColor = "";
    input.style.backgroundColor = "";
  });
}

/* --------------------------------------------------------------------------
   4. Enquiry Form Functionality & Response Processor 
   -------------------------------------------------------------------------- */
function initEnquiryForm() {
  const form = document.getElementById("enquiryForm");
  const responseBox = document.getElementById("enquiryResponse");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents HTTP 405 Error on static hosting

    const enquiryType = document.getElementById("enquiry-type")?.value || "";
    const animalName = document.getElementById("animal-name")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";
    const fullName = document.getElementById("full-name")?.value.trim() || "";
    const contactNumber = document.getElementById("contact-number")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";

    clearErrors(form);
    let isValid = true;

    if (!enquiryType) {
      showError("enquiry-type", "Please select an enquiry option (Adopt, Volunteer, or Donate).");
      isValid = false;
    }

    if (!message || message.length < 10) {
      showError("message", "Please enter a detailed message (at least 10 characters long).");
      isValid = false;
    }

    if (!fullName || fullName.length < 2) {
      showError("full-name", "Please enter your full name (at least 2 characters).");
      isValid = false;
    }

    if (!contactNumber) {
      showError("contact-number", "Contact number is required.");
      isValid = false;
    } else if (!validateSouthAfricanPhone(contactNumber)) {
      showError("contact-number", "Please enter a valid SA phone number starting with +27 or 0 (e.g. +27821234567 or 0821234567).");
      isValid = false;
    }

    if (!email) {
      showError("email", "Email address is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError("email", "Please include an '@' and a valid domain in your email (e.g. name@example.com).");
      isValid = false;
    }

    if (!isValid) return;

    let responseHeading = "";
    let detailText = "";

    if (enquiryType === "adopt") {
      const targetAnimal = animalName ? `for <strong>${animalName}</strong>` : "for one of our shelter animals";
      responseHeading = "Adoption Enquiry Processed";
      detailText = `Thank you, <strong>${fullName}</strong>! Your adoption enquiry ${targetAnimal} has been received. Standard adoption fee is <strong>R850</strong> (covers full vaccination, microchipping & sterilization). Our team will contact you at <strong>${email}</strong> within 48 hours to schedule a shelter visit.`;
    } else if (enquiryType === "volunteer") {
      responseHeading = "Volunteer Application Received";
      detailText = `Thank you for offering your time, <strong>${fullName}</strong>! We have sent our volunteer orientation schedule and availability roster to <strong>${email}</strong>.`;
    } else if (enquiryType === "donate") {
      responseHeading = "Sponsorship & Donation Information";
      detailText = `Thank you for supporting Paws & Hearts, <strong>${fullName}</strong>! Our banking details and supply drop-off instructions for our Johannesburg facilities have been dispatched to <strong>${email}</strong>.`;
    }

    if (responseBox) {
      responseBox.style.display = "block";
      responseBox.innerHTML = `
        <h3 style="margin-top:0; color: #2a6f97;">🐾 ${responseHeading}</h3>
        <p style="margin-bottom:0; line-height: 1.6; color: #333;">${detailText}</p>
      `;
      responseBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   5. Contact Form Mailto Compiler & Validation 
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents HTTP 405 Error on static hosting

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value || "";
    const message = document.getElementById("contact-message")?.value.trim() || "";

    clearErrors(form);
    let isValid = true;

    if (!name || name.length < 2) {
      showError("name", "Please enter your full name.");
      isValid = false;
    }

    if (!email) {
      showError("email", "Email address is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError("email", "Please provide a valid email format containing '@' and a domain (e.g. user@domain.co.za).");
      isValid = false;
    }

    if (phone && !validateSouthAfricanPhone(phone)) {
      showError("phone", "If providing a phone number, use a valid SA format (+27821234567 or 0821234567).");
      isValid = false;
    }

    if (!subject) {
      showError("subject", "Please select a message topic from the dropdown menu.");
      isValid = false;
    }

    if (!message || message.length < 10) {
      showError("contact-message", "Please enter your message (at least 10 characters long).");
      isValid = false;
    }

    if (!isValid) return;

    // Compiles data into mailto link directed to info@pawsandhearts.co.za
    const recipient = "info@pawsandhearts.co.za";
    const mailtoSubject = encodeURIComponent(`[${subject}] Message from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Paws & Hearts Contact Form Submission\n` +
      `---------------------------------------\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || "Not provided"}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}`
    );

    window.location.href = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   6. Pet Filtering & Search (Adopt Page)
   -------------------------------------------------------------------------- */
function initPetFilters() {
  const filterSelect = document.querySelector("#petTypeFilter");
  const cards = document.querySelectorAll(".animal-card");
  if (!filterSelect || cards.length === 0) return;

  filterSelect.addEventListener("change", (e) => {
    const selected = e.target.value.toLowerCase();
    cards.forEach((card) => {
      const category = (card.getAttribute("data-category") || "").toLowerCase();
      if (selected === "all" || category === selected) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Event Sorting 
   -------------------------------------------------------------------------- */
function initEventSorting() {
  const sortSelect = document.getElementById("eventSort");
  const grid = document.querySelector(".event-grid");
  if (!sortSelect || !grid) return;

  sortSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    const cards = Array.from(grid.querySelectorAll(".event-card"));

    cards.sort((a, b) => {
      if (val === "date") {
        return a.getAttribute("data-date").localeCompare(b.getAttribute("data-date"));
      } else {
        return a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"));
      }
    });

    cards.forEach((card) => grid.appendChild(card));
  });
}

/* --------------------------------------------------------------------------
   8. Count-Up Statistics Animation
   -------------------------------------------------------------------------- */
function initCountUpStats() {
  const stats = document.querySelectorAll(".stat-number");
  if (stats.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetValue = parseInt(el.getAttribute("data-target") || "0", 10);
          animateValue(el, 0, targetValue, 2000);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((s) => observer.observe(s));
}

function animateValue(el, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    el.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.innerText = end;
    }
  };
  window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   9. Decorative Paw Print Trail
   -------------------------------------------------------------------------- */
function initPawPrintTrail() {
  const container = document.querySelector(".hero-paw-container");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const paw = document.createElement("span");
    paw.innerHTML = "🐾 ";
    paw.style.opacity = (0.4 + i * 0.3).toString();
    paw.style.fontSize = "1.2rem";
    container.appendChild(paw);
  }
}

/* --------------------------------------------------------------------------
   10. Gallery Lightbox Modal 
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImage");
  const captionText = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("closeLightbox");
  const images = document.querySelectorAll(".clickable-lightbox");

  if (!modal || !modalImg) return;

  images.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
      captionText.innerText = img.getAttribute("data-caption") || img.alt;
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

/* --------------------------------------------------------------------------
   11. Interactive FAQ Accordion 
   -------------------------------------------------------------------------- */
function initAccordion() {
  const headers = document.querySelectorAll(".accordion-header");
  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector(".accordion-icon");
      const isOpen = content.style.display === "block";

      document.querySelectorAll(".accordion-content").forEach((c) => (c.style.display = "none"));
      document.querySelectorAll(".accordion-icon").forEach((i) => (i.innerText = "+"));

      if (!isOpen) {
        content.style.display = "block";
        if (icon) icon.innerText = "−";
      }
    });
  });
}