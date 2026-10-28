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
  const animal = urlParams.get("animal")?.trim();
  const type = urlParams.get("type")?.trim();
  const typeSelect = document.getElementById("enquiry-type");
  const nameInput = document.getElementById("animal-name");

  if (typeSelect) {
    if (type) {
      typeSelect.value = type;
    } else if (animal) {
      typeSelect.value = "adopt";
    }

    if (animal) {
      typeSelect.disabled = true;
      typeSelect.setAttribute("aria-readonly", "true");
    }
  }

  if (animal && nameInput) {
    nameInput.value = animal;
    nameInput.readOnly = true;
    nameInput.setAttribute("aria-readonly", "true");
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailLinks(recipient, subject, body) {
  const mailtoSubject = encodeURIComponent(subject);
  const mailtoBody = encodeURIComponent(body);
  const gmailParams = new URLSearchParams({ view: "cm", fs: "1", to: recipient, su: subject, body });
  const outlookParams = new URLSearchParams({ to: recipient, subject, body });

  return {
    mailto: `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`,
    gmail: `https://mail.google.com/mail/?${gmailParams.toString()}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?${outlookParams.toString()}`
  };
}

function composeEmailButtons(recipient, subject, body) {
  const links = buildEmailLinks(recipient, subject, body);
  return `
    <p style="margin-top: 1rem; margin-bottom: 0.65rem;"><strong>Choose an email service to open your prepared message:</strong></p>
    <div class="email-compose-links">
      <a class="button button-primary" href="${links.gmail}" target="_blank" rel="noopener noreferrer">Open Gmail</a>
      <a class="button button-primary" href="${links.outlook}" target="_blank" rel="noopener noreferrer">Open Outlook.com</a>
      <a class="button button-primary" href="${links.mailto}">Open desktop mail app</a>
    </div>
  `;
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
    let emailButtons = "";

    if (enquiryType === "adopt") {
      const safeName = escapeHtml(fullName);
      const safeEmail = escapeHtml(email);
      const targetAnimal = animalName
        ? `for <strong>${escapeHtml(animalName)}</strong>`
        : "for one of our shelter animals";
      responseHeading = "Adoption Enquiry Prepared";
      detailText = `Thank you, <strong>${safeName}</strong>! Your adoption enquiry ${targetAnimal} is ready to send. Standard adoption fee is <strong>R850</strong> (covers full vaccination, microchipping & sterilization). Our team will contact you at <strong>${safeEmail}</strong> within 48 hours after receiving your email.`;

      const recipient = "info@pawsandhearts.co.za";
      const subject = `Adoption Enquiry: ${animalName || "General"} - ${fullName}`;
      const body =
        `Paws & Hearts Adoption Enquiry Quote\n` +
        `-----------------------------------------\n` +
        `Applicant: ${fullName}\n` +
        `Email: ${email}\n` +
        `Phone: ${contactNumber}\n` +
        `Animal: ${animalName || "Not specified"}\n\n` +
        `Details & Requirements:\n` +
        `- Adoption Fee: R850 (Vaccination, Microchipping & Sterilization)\n` +
        `- Location: Main Shelter, 22 Rivonia Road, Sandton\n` +
        `- Pickup Time: Mon-Fri 08:00-17:00 / Sat 09:00-13:00\n` +
        `- Next Steps: Our team will reach out within 48 hours to confirm your visit date.\n\n` +
        `User Message:\n${message}`;
      emailButtons = composeEmailButtons(recipient, subject, body);
    } else if (enquiryType === "volunteer") {
      responseHeading = "Volunteer Application Prepared";
      detailText = `Thank you for offering your time, <strong>${escapeHtml(fullName)}</strong>! Choose an email service below to send your application to our team.`;
      const subject = `Volunteer Application - ${fullName}`;
      const body = `Volunteer Application\nName: ${fullName}\nEmail: ${email}\nPhone: ${contactNumber}\n\nMessage:\n${message}`;
      emailButtons = composeEmailButtons("info@pawsandhearts.co.za", subject, body);
    } else if (enquiryType === "donate") {
      responseHeading = "Donation or Sponsorship Enquiry Prepared";
      detailText = `Thank you for supporting Paws & Hearts, <strong>${escapeHtml(fullName)}</strong>! Choose an email service below to send your enquiry to our team.`;
      const subject = `Donation/Sponsorship Enquiry - ${fullName}`;
      const body = `Donation/Sponsorship Enquiry\nName: ${fullName}\nEmail: ${email}\nPhone: ${contactNumber}\n\nMessage:\n${message}`;
      emailButtons = composeEmailButtons("info@pawsandhearts.co.za", subject, body);
    }

    if (responseBox) {
      responseBox.style.display = "block";
      responseBox.innerHTML = `
        <h3 style="margin-top:0; color: #2a6f97;">🐾 ${responseHeading}</h3>
        <p style="margin-bottom:0; line-height: 1.6; color: #333;">${detailText}</p>
        ${emailButtons}
      `;
      responseBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.reset();

    const prefilledAnimal = new URLSearchParams(window.location.search).get("animal")?.trim();
    if (prefilledAnimal) {
      const typeSelect = document.getElementById("enquiry-type");
      const nameInput = document.getElementById("animal-name");
      if (typeSelect) {
        typeSelect.value = "adopt";
        typeSelect.disabled = true;
      }
      if (nameInput) {
        nameInput.value = prefilledAnimal;
        nameInput.readOnly = true;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   5. Contact Form Mailto Compiler & Validation 
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const responseBox = document.getElementById("contactResponse");
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

    const recipient = "info@pawsandhearts.co.za";
    const emailSubject = `[${subject}] Message from ${name}`;
    const emailBody =
      `Paws & Hearts Contact Form Submission\n` +
      `---------------------------------------\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || "Not provided"}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}`;

    if (responseBox) {
      responseBox.style.display = "block";
      responseBox.innerHTML = `
        <h3 style="margin-top:0; color: #2a6f97;">Message prepared</h3>
        <p>Your message has not been sent yet. Choose an email service below to review and send it.</p>
        ${composeEmailButtons(recipient, emailSubject, emailBody)}
      `;
      responseBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

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