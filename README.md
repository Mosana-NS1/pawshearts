# Paws & Hearts Animal Rescue — Website Build

**Student:** Nthakgeng Mosana  
**Student Number:** ST10495862  
**Module:** Web Development — Proof of Evidence (PoE)

---

## What This Is

Paws & Hearts Animal Rescue is a fictional Johannesburg-based non-profit, created for the purposes of this module's PoE. It started in 2021 as a handful of volunteers fostering animals from their own homes and now runs a small shelter caring for 30–40 animals at any given time. This repository holds the multi-page site built for the organisation across the three PoE milestones — a public-facing site aimed primarily at people ready to adopt, with donors and prospective volunteers as a secondary audience.

The build follows the standard three-stage PoE structure: markup first, then presentation, then behaviour.

| Stage | Focus | Status |
|---|---|---|
| Part 1 | Semantic HTML structure, accessible forms | Complete |
| Part 2 | External stylesheet, responsive layout, design tokens | Complete |
| Part 3 | Client-side interactivity, dynamic filtering, forms validation, maps | Complete |

---

## Site Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero banner, mission statement, featured animals |
| `about.html` | Our story, mission and vision, how the rescue process works, values |
| `adopt.html` | Full photo grid of every animal currently available for adoption with filtering |
| `events.html` | Calendar of upcoming adoption drives, fundraisers, and community meetups |
| `enquiry.html` | Single enquiry form covering adoption, volunteering, and donation interest with dynamic quote responses |
| `contact.html` | Shelter and drop-off addresses, opening hours, contact form, and interactive Leaflet map |

---

## Design Direction

- **Palette:** Warm charcoal, cream, and golden-tan tones, built off dog- and shelter-inspired colours rather than a clinical/corporate feel.
- **Type:** A serif display face (Fraunces) for headings paired with a plain sans-serif (DM Sans) for body text, for warmth without sacrificing legibility.
- **Layout:** Image-led and mobile-first — the animals do most of the persuading, and most visitors are expected to be on a phone.

---

## Technical Notes

### Part 1 — Structure
- Semantic landmarks throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Accessible forms on the Enquiry and Contact pages, built with `<fieldset>`, `<legend>`, and correctly associated `<label>` elements.
- A single navigation structure repeated identically across all pages, with `aria-current="page"` marking the active link.

### Part 2 — Styling and Responsiveness
- One external stylesheet (`css/style.css`) linked from every page — no inline or embedded styles.
- A full CSS reset plus a `:root` design-token system: colour variables, a type scale, a spacing scale, and shared shadow/radius values.
- Layout built with CSS Grid and Flexbox (hero section, animal card grids, footer columns, forms).
- Interactive states handled with `:hover`, `:focus`, `:active`, and `:focus-visible`, including visible keyboard focus rings for accessibility.
- Two responsive breakpoints (900px tablet, 600px mobile), each adjusting layout, navigation, and typography sizing independently.
- Responsive images implemented with `srcset` and `sizes` attributes on every animal photo and the hero image.
- `prefers-reduced-motion` respected site-wide by disabling transitions for users with that OS setting enabled.

### Part 3 — Behaviour, Validation, and Interactivity
- **Client-Side Form Validation & Error Handling:** Implemented comprehensive JavaScript validation for both `enquiry.html` and `contact.html` to prevent HTTP 405 static server submission errors. Added custom regex validation for South African phone numbers (supporting formats starting with `+27` or `0`, totaling 10 digits) and strict email verification containing `@` and valid domains. Instructive, user-friendly error messages are dynamically inserted next to invalid fields.
- **Dynamic Enquiry Processing & Mailto Integration:** Configured dynamic on-screen success responses with adoption fee breakdowns (R850 covering vaccinations, microchipping, and sterilization) and compiled `mailto:` protocol triggers for contact submissions and adoption quotes pointing directly to `info@pawsandhearts.co.za`.
- **Interactive Maps & Geolocation:** Integrated Leaflet.js with OpenStreetMap tiles on `contact.html`, featuring dual markers for the Sandton main shelter (22 Rivonia Road) and the Randburg drop-off point (5 Bram Fischer Drive). Added a live browser geolocation routing button that plots a dynamic route from the user's position to the main shelter.
- **Interactive UI Elements:** Added a responsive image gallery lightbox modal, an expandable FAQ accordion, dynamic pet filtering on the adopt page, live event sorting, and intersection observer count-up statistics animations.

---

## Changelog

**Part 1 — 1 to 14 August 2026**
- Built the static HTML skeleton for all pages.
- Structured the Enquiry and Contact forms with semantic fieldsets and labels.
- Set up the repository folder structure (`css/`, `images/`, `js/`).

**Part 2 — 14 August to 18 September 2026**
- Addressed Part 1 feedback: tightened up heading hierarchy and improved alt-text descriptiveness across all animal images.
- Created the external stylesheet and linked it across every page.
- Established the design-token system (colour, type, spacing) in `:root`.
- Built out Grid/Flexbox layouts for the hero, animal cards, forms, and footer.
- Added hover, focus, and active states to all interactive elements.
- Implemented responsive breakpoints and verified colour contrast against WCAG 2.2 AA.

**Part 3 — 27 to 28 October 2026**
- Developed and finalized `js/main.js` incorporating modular interactive components (lightbox modal, accordion FAQs, event sorting, pet catalog filtering, and count-up statistics).
- Implemented client-side form validation with South African phone number regex (`+27`/`0` formatting) and strict email verification, providing clear, instructive error feedback.
- Integrated Leaflet.js map with dual facility markers (Sandton and Randburg) and live browser geolocation routing.
- Built URL parameter handlers and `mailto:` protocol integration for contact and enquiry form data processing without server-side errors.
- Updated all references, documentation, and metadata to prepare for final deployment.

---

## Site Map

![Paws & Hearts site map](./images/pawsheartSiteMap.png)

---

## References

### Part 1 References
Dog Breed Info, n.d. Siberian Husky standing. [electronic print] Available at: <http://www.dogbreedinfo.com/images16/SiberianHuskySidStand.jpg> [Accessed 18 September 2026].  
Flickr, 2010. Rescued dog portrait. [electronic print] Available at: <https://live.staticflickr.com/4089/4972293474_033a8cb7bf_b.jpg> [Accessed 18 September 2026].  
Flickr, 2008. Rescued dog close-up. [electronic print] Available at: <https://live.staticflickr.com/3139/2930489477_5a38ccf76c.jpg> [Accessed 18 September 2026].  
Flickr, 2009. Rescued cat. [electronic print] Available at: <http://farm4.static.flickr.com/3322/3270108149_67c377d0b5.jpg?v=0> [Accessed 18 September 2026].  
Particlenews, n.d. Max the dog. [electronic print] Available at: <https://img.particlenews.com/image.php?type=thumbnail_580x000&url=4OaixM_0ttptZZ000> [Accessed 18 September 2026].  
Flickr, 2009. Old cat. [electronic print] Available at: <https://live.staticflickr.com/2674/4187420193_e15e2baa9d.jpg> [Accessed 18 September 2026].  
Flickr, 2012. Red nose pitbull. [electronic print] Available at: <https://live.staticflickr.com/7005/6695554957_99e54ee64f_b.jpg> [Accessed 18 September 2026].  
Flickr, 2017. Bobcat in nature. [electronic print] Available at: <https://live.staticflickr.com/4546/26610284759_c7f116d316_b.jpg> [Accessed 18 September 2026].  
Afrihost, 2026. Web hosting plans. [online] Available at: <https://www.afrihost.com> [Accessed 10 August 2026].  
Google Fonts, 2026. Google Fonts. [online] Available at: <https://fonts.google.com> [Accessed 10 August 2026].  
Nielsen Norman Group, 2020. Low-fidelity vs. high-fidelity prototyping. [online] Available at: <https://www.nngroup.com> [Accessed 10 August 2026].  
TEARS Animal Rescue, 2026. Adopt a pet. [online] Available at: <https://tears.org.za> [Accessed 10 August 2026].  
W3C, 2023. Web Content Accessibility Guidelines (WCAG) 2.2. [online] Available at: <https://www.w3.org/TR/WCAG22/> [Accessed 10 August 2026].  
W3Schools, 2026. HTML semantic elements. [online] Available at: <https://www.w3schools.com/html/html5_semantic_elements.asp> [Accessed 10 August 2026].

### Part 2 References
Mozilla Corporation, n.d. CSS flexible box layout. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout> [Accessed 15 September 2026].  
Mozilla Corporation, n.d. CSS Grid Layout. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout> [Accessed 15 September 2026].  
Mozilla Corporation, n.d. Using CSS custom properties (variables). [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties> [Accessed 15 September 2026].

### Part 3 References
Mozilla Developer Network (MDN), 2025. RegExp: Regular Expressions in JavaScript [Source code]. Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp> [Accessed 28 October 2026].  
Mozilla Developer Network (MDN), 2025. URLSearchParams Examples [Source code]. Available at: <https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams> [Accessed 28 October 2026].  
Mozilla Developer Network (MDN), 2025. Intersection Observer API Examples [Source code]. Available at: <https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API> [Accessed 28 October 2026].  
W3Schools, 2025. JavaScript Form Validation Examples [Source code]. Available at: <https://www.w3schools.com/js/js_validation.asp> [Accessed 28 October 2026].  
W3Schools, 2025. JavaScript Regular Expressions [Source code]. Available at: <https://www.w3schools.com/js/js_regexp.asp> [Accessed 28 October 2026].  
W3Docs, 2025. How to Create Mailto Links [Source code]. Available at: <https://www.w3docs.com/snippets/html/how-to-create-mailto-links.html> [Accessed 28 October 2026].
