# Sapthagiri NPS University — Campus Companion (v2.0 Production Ready)

A modern, accessible, high-performance static student-life dashboard for Sapthagiri NPS University. Built with vanilla JavaScript (ES Modules), accessible semantic HTML5, responsive CSS, security sanitization, and automated Node 24 unit/integration tests.

---

## 🚀 Quick Start & Local Preview

No heavy bundlers or build tools are required. Run the application locally or run the automated test suite:

### 1. Run automated tests & syntax validation
```bash
npm run validate
```
*(Runs syntax linting across all ES modules and executes all 29 automated test cases)*

### 2. Launch local preview server
```bash
npm start
```
Or simply open [`index.html`](index.html) directly in any modern web browser.

---

## 📁 Repository Structure

```text
prompt-war/
├── index.html           # Main semantic HTML dashboard & login shell with CSP & A11y skip links
├── app.js               # Entry point module integrating all UI controllers & page lifecycle
├── styles.css           # Modern CSS styling with WCAG AA contrast & focus state indicators
├── package.json         # NPM scripts for building, validating, testing & static preview
├── vercel.json          # Deployment header & routing configuration for Vercel
├── netlify.toml         # Deployment build & security header configuration for Netlify
├── .gitignore           # Git ignore rules for node_modules and build artifacts
├── js/                  # Modular JavaScript ES modules
│   ├── assistant.js     # Campus FAQ query processing & safe response matching
│   ├── auth.js          # Authentication session state & input formatting
│   ├── data.js          # Static university database, events schedule & class timetables
│   ├── events.js        # Event categorization, filtering, search & sorting logic
│   ├── map.js           # Google Maps direction/search URL builders & route generation
│   ├── planner.js       # Personal timetable renderer & attendance tracking
│   ├── utils.js         # XSS sanitization, string escaping, date/time formatters, debounce
│   └── weather.js       # Open-Meteo live weather fetcher & fallback logic
└── tests/               # Automated unit, security, accessibility & integration test suites
    ├── accessibility.test.js
    ├── assistant.test.js
    ├── auth.test.js
    ├── events.test.js
    ├── map.test.js
    ├── planner.test.js
    ├── security.test.js
    ├── utils.test.js
    └── weather.test.js
```


## ✨ Enterprise Quality Parameters

| Parameter | Implementation Details |
| :--- | :--- |
| **Code Quality** | Modular ES6+ structure, zero global variable leakage, strict JSDoc typing annotations, verified syntax cleanliness (`node --check`). |
| **Efficiency** | Debounced search listeners (150ms window), event delegation on lists, `DocumentFragment` batch DOM insertion, Page Visibility API carousel lifecycle. |
| **Accessibility (WCAG AA)** | Keyboard skip links, WCAG AA color contrast ($\ge 4.5:1$), full Arrow key WAI-ARIA tab navigation, focus rings (`:focus-visible`), aria-live announcements. |
| **Security** | Content Security Policy (CSP) headers, XSS sanitization (`sanitizeHTML`, `escapeHTML`), safe external link attributes (`rel="noopener noreferrer"`). |
| **Testing** | 29 automated test cases passing across 9 test suites covering Unit, Integration, Security, and Accessibility specs. |

---

