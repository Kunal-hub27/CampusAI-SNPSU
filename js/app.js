/**
 * Sapthagiri NPS University Campus Companion — Main Application Entry Point
 * Implements high-quality, efficient, accessible, and secure campus dashboard UI.
 */
import {
  campusPhotoSlides,
  campusEvents,
  weeklyClasses,
  campusAddress
} from "./js/data.js";
import {
  $,
  $$,
  debounce,
  escapeHTML,
  sanitizeHTML,
  formatClassTime,
  formatCampusEventDate,
  getDateKey
} from "./js/utils.js";
import {
  AUTH_KEY,
  formatStudentName,
  validateEmail,
  validatePassword,
  getStoredSession,
  setStoredSession,
  clearStoredSession
} from "./js/auth.js";
import {
  loadAttendanceRecords,
  saveAttendanceRecords,
  calculateAttendanceStats,
  getClassLocation,
  getTimetableDate
} from "./js/planner.js";
import {
  getCampusEventStatus,
  filterAndSortCampusEvents
} from "./js/events.js";
import { getAssistantAnswer } from "./js/assistant.js";
import { fetchCampusWeather } from "./js/weather.js";
import { buildGoogleMapsSearchUrl, buildGoogleMapsRouteUrl } from "./js/map.js";

// Global Application State
const appState = {
  campusPhotoIndex: 0,
  selectedEventStatus: "all",
  selectedEventCategory: "all",
  eventSearchQuery: "",
  savedCampusEvents: new Set(),
  selectedTimetableDay: (new Date().getDay() + 6) % 7,
  attendanceRecords: loadAttendanceRecords()
};

// ---------------------------------------------------------------------------
// 1. Campus Photo Carousel with Page Visibility API Optimization
// ---------------------------------------------------------------------------
function showCampusPhoto(index) {
  const slide = campusPhotoSlides[index];
  if (!slide) return;
  document.documentElement.style.setProperty("--campus-photo-position", slide.position);
  document.documentElement.style.setProperty("--campus-photo-size", slide.size);

  const captionEl = $("#campus-photo-caption");
  if (captionEl) captionEl.textContent = slide.caption;

  const photoEl = $(".login-photo");
  if (photoEl) photoEl.setAttribute("aria-label", `Sapthagiri NPS University ${slide.caption.toLocaleLowerCase()}`);
}

showCampusPhoto(appState.campusPhotoIndex);

let photoTimer = null;
function startPhotoTimer() {
  if (photoTimer) clearInterval(photoTimer);
  photoTimer = window.setInterval(() => {
    if (!document.hidden) {
      appState.campusPhotoIndex = (appState.campusPhotoIndex + 1) % campusPhotoSlides.length;
      showCampusPhoto(appState.campusPhotoIndex);
    }
  }, 120_000);
}
startPhotoTimer();

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    showCampusPhoto(appState.campusPhotoIndex);
  }
});

// ---------------------------------------------------------------------------
// 2. Campus Events UI with Event Delegation
// ---------------------------------------------------------------------------
const eventList = $("#events-list");
const eventCount = $("#event-count");
const eventStatusSummary = $("#event-status-summary");

function renderCampusEvents() {
  if (!eventList || !eventCount || !eventStatusSummary) return;

  const todayKey = getDateKey();
  const statuses = campusEvents.map((event) => getCampusEventStatus(event, todayKey));
  const statusCounts = statuses.reduce(
    (counts, status) => {
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    },
    { past: 0, today: 0, upcoming: 0, tba: 0 }
  );

  const futureCount = statusCounts.upcoming + statusCounts.tba;
  const techCount = campusEvents.filter((event) => event.category === "technical").length;
  eventStatusSummary.textContent = `${statusCounts.past} past · ${statusCounts.today} happening today · ${futureCount} upcoming or date TBA · ${techCount} technical events listed`;

  const visibleEvents = filterAndSortCampusEvents(
    campusEvents,
    appState.selectedEventStatus,
    appState.selectedEventCategory,
    appState.eventSearchQuery,
    todayKey
  );

  eventCount.textContent = `${visibleEvents.length} of ${campusEvents.length} events`;
  eventList.replaceChildren();

  if (!visibleEvents.length) {
    const empty = document.createElement("p");
    empty.className = "event-empty";
    empty.textContent =
      appState.selectedEventCategory === "technical"
        ? "No technical events are included in the supplied schedule."
        : "No events match the selected filters.";
    eventList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  visibleEvents.forEach((event) => {
    const card = document.createElement("article");
    card.className = `event-card event-${event.category} event-state-${event.status}`;
    card.dataset.searchable = `${event.title} ${event.category} ${event.location} ${event.details}`.toLocaleLowerCase();

    const art = document.createElement("div");
    art.className = `event-art event-art-${event.category}`;
    art.setAttribute("aria-hidden", "true");

    const artLabel = document.createElement("span");
    artLabel.className = "event-art-label";
    artLabel.textContent = event.category === "technical" ? "TECH" : "CAMPUS";

    const artTitle = document.createElement("span");
    artTitle.className = "event-art-title";
    artTitle.textContent = event.title;
    art.append(artLabel, artTitle);

    const info = document.createElement("div");
    info.className = "event-info";

    const meta = document.createElement("div");
    meta.className = "event-meta";

    const category = document.createElement("span");
    category.className = `event-category-tag ${event.category}`;
    category.textContent = event.category === "technical" ? "TECHNICAL" : "CULTURAL";

    const date = document.createElement("span");
    date.textContent = formatCampusEventDate(event.date).toLocaleUpperCase();
    meta.append(category, date);

    const title = document.createElement("h3");
    title.textContent = event.title;

    const details = document.createElement("p");
    details.textContent = event.details;

    const footer = document.createElement("div");
    footer.className = "event-footer";

    const location = document.createElement("span");
    location.className = "event-location";
    location.textContent = `⌖ ${event.location}`;

    const save = document.createElement("button");
    const isSaved = appState.savedCampusEvents.has(event.id);
    save.className = "save-button";
    save.type = "button";
    save.dataset.eventId = event.id;
    save.setAttribute("aria-label", `${isSaved ? "Unsave" : "Save"} ${event.title}`);
    save.setAttribute("aria-pressed", String(isSaved));
    save.textContent = isSaved ? "♥" : "♡";

    footer.append(location, save);

    const status = document.createElement("span");
    status.className = `event-status-pill event-status-${event.status}`;
    status.textContent =
      event.id === "promptwars-2026"
        ? "Today · listed event"
        : {
            past: "Past event",
            today: "Happening today",
            upcoming: "Upcoming",
            tba: "Date TBA"
          }[event.status];

    info.append(meta, title, details, footer, status);
    card.append(art, info);
    fragment.append(card);
  });

  eventList.append(fragment);
}

// Event Delegation for Save Buttons
if (eventList) {
  eventList.addEventListener("click", (evt) => {
    const saveBtn = evt.target.closest(".save-button");
    if (!saveBtn) return;
    const eventId = saveBtn.dataset.eventId;
    if (!eventId) return;

    if (appState.savedCampusEvents.has(eventId)) {
      appState.savedCampusEvents.delete(eventId);
    } else {
      appState.savedCampusEvents.add(eventId);
    }
    renderCampusEvents();
  });
}

// Event Filter Buttons Setup
$$("[data-event-status]").forEach((button) => {
  button.addEventListener("click", () => {
    appState.selectedEventStatus = button.dataset.eventStatus;
    $$("[data-event-status]").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    renderCampusEvents();
  });
});

$$("[data-event-category]").forEach((button) => {
  button.addEventListener("click", () => {
    appState.selectedEventCategory = button.dataset.eventCategory;
    $$("[data-event-category]").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    renderCampusEvents();
  });
});

renderCampusEvents();

// ---------------------------------------------------------------------------
// 3. Timetable & Personal Planner Module with Keyboard Tab Controls
// ---------------------------------------------------------------------------
const dayTabs = $("#planner-day-tabs");
const scheduleList = $("#schedule-list");
const attendanceSummary = $("#attendance-summary");
const attendanceProgress = $("#attendance-progress");
const plannerDateLabel = $("#planner-date-label");
const attendanceStatus = $("#attendance-status");

function renderTimetable() {
  if (!dayTabs || !scheduleList || !attendanceSummary || !attendanceProgress || !plannerDateLabel) {
    return;
  }

  const selectedDay = weeklyClasses[appState.selectedTimetableDay];
  const selectedDate = getTimetableDate(appState.selectedTimetableDay);
  const selectedDateKey = getDateKey(selectedDate);
  const isToday = selectedDateKey === getDateKey();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Render Day Tabs
  dayTabs.replaceChildren();
  const tabsFragment = document.createDocumentFragment();

  weeklyClasses.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "planner-day-tab";
    button.id = `planner-day-${day.day}`;
    button.setAttribute("role", "tab");
    button.setAttribute("tabindex", day.day === appState.selectedTimetableDay ? "0" : "-1");
    button.setAttribute("aria-selected", String(day.day === appState.selectedTimetableDay));
    button.setAttribute("aria-controls", "schedule-list");
    button.textContent = day.name.slice(0, 3);

    button.addEventListener("click", () => {
      appState.selectedTimetableDay = day.day;
      renderTimetable();
    });

    tabsFragment.append(button);
  });

  dayTabs.append(tabsFragment);

  // WAI-ARIA Keyboard Navigation (ArrowLeft / ArrowRight) for Tabs
  dayTabs.onkeydown = (evt) => {
    let targetIndex = appState.selectedTimetableDay;
    if (evt.key === "ArrowRight") {
      evt.preventDefault();
      targetIndex = (targetIndex + 1) % weeklyClasses.length;
    } else if (evt.key === "ArrowLeft") {
      evt.preventDefault();
      targetIndex = (targetIndex - 1 + weeklyClasses.length) % weeklyClasses.length;
    } else if (evt.key === "Home") {
      evt.preventDefault();
      targetIndex = 0;
    } else if (evt.key === "End") {
      evt.preventDefault();
      targetIndex = weeklyClasses.length - 1;
    } else {
      return;
    }

    appState.selectedTimetableDay = targetIndex;
    renderTimetable();
    const newActiveTab = $(`#planner-day-${targetIndex}`, dayTabs);
    if (newActiveTab) newActiveTab.focus();
  };

  scheduleList.setAttribute("role", "tabpanel");
  scheduleList.setAttribute("aria-labelledby", `planner-day-${appState.selectedTimetableDay}`);

  plannerDateLabel.textContent = `${selectedDay.name.toLocaleUpperCase()} · ${new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short"
  }).format(selectedDate).toLocaleUpperCase()}${isToday ? " · TODAY" : ""}`;

  const stats = calculateAttendanceStats(selectedDay.classes, selectedDateKey, appState.attendanceRecords);
  attendanceSummary.childNodes[0].textContent = `${stats.attendedCount} / ${stats.totalCount} attended `;
  attendanceProgress.style.width = `${stats.percentage}%`;

  scheduleList.replaceChildren();

  if (!selectedDay.classes.length) {
    const empty = document.createElement("p");
    empty.className = "schedule-empty";
    empty.textContent = "No classes scheduled for this day.";
    scheduleList.append(empty);
    return;
  }

  const scheduleFragment = document.createDocumentFragment();

  selectedDay.classes.forEach((course) => {
    const recordKey = `${selectedDateKey}:${course.code}:${course.start}`;
    const attended = appState.attendanceRecords[recordKey] === true;
    const startMinutes = Number(course.start.slice(0, 2)) * 60 + Number(course.start.slice(3));
    const endMinutes = Number(course.end.slice(0, 2)) * 60 + Number(course.end.slice(3));
    const isCurrent = isToday && nowMinutes >= startMinutes && nowMinutes < endMinutes;
    const isUpcoming =
      isToday &&
      !isCurrent &&
      nowMinutes < startMinutes &&
      !selectedDay.classes.some((other) => {
        const otherStart = Number(other.start.slice(0, 2)) * 60 + Number(other.start.slice(3));
        return otherStart > nowMinutes && otherStart < startMinutes;
      });

    const item = document.createElement("div");
    item.className = `schedule-item${isCurrent ? " current" : ""}${attended ? " attended" : ""}`;

    const time = document.createElement("div");
    time.className = "schedule-time";

    const strongTime = document.createElement("strong");
    strongTime.textContent = formatClassTime(course.start);
    const spanTime = document.createElement("span");
    spanTime.textContent = `to ${formatClassTime(course.end)}`;
    time.append(strongTime, spanTime);

    const line = document.createElement("span");
    line.className = "schedule-line";

    const details = document.createElement("div");
    details.className = "schedule-details";

    const title = document.createElement("strong");
    title.textContent = course.title;

    const meta = document.createElement("span");
    meta.textContent = `${course.code} · ${getClassLocation(course)}`;
    details.append(title, meta);

    const attendanceButton = document.createElement("button");
    attendanceButton.className = "attendance-button";
    attendanceButton.type = "button";
    attendanceButton.setAttribute("aria-pressed", String(attended));
    attendanceButton.setAttribute("aria-label", `${attended ? "Unmark" : "Mark"} ${course.title} attended`);
    attendanceButton.textContent = attended ? "Attended ✓" : "Mark attended";

    attendanceButton.addEventListener("click", () => {
      if (appState.attendanceRecords[recordKey]) {
        delete appState.attendanceRecords[recordKey];
      } else {
        appState.attendanceRecords[recordKey] = true;
      }

      const savedOk = saveAttendanceRecords(appState.attendanceRecords);
      if (attendanceStatus) {
        attendanceStatus.textContent = savedOk
          ? "Attendance checkmarks are saved only in this browser."
          : "Browser storage is unavailable; attendance could not be saved.";
      }
      renderTimetable();
    });

    const badge = document.createElement("span");
    badge.className = attended ? "class-tag attendance-done" : "class-tag";
    badge.textContent = attended ? "DONE" : isCurrent ? "NOW" : isUpcoming ? "NEXT" : course.code;

    item.append(time, line, details, badge, attendanceButton);
    scheduleFragment.append(item);
  });

  scheduleList.append(scheduleFragment);
}

function renderWeeklyTimetable() {
  const tableBody = $("#weekly-timetable-body");
  if (!tableBody) return;
  tableBody.replaceChildren();

  const fragment = document.createDocumentFragment();
  weeklyClasses.forEach((day) => {
    day.classes.forEach((course) => {
      const row = document.createElement("tr");
      [
        day.name,
        `${formatClassTime(course.start)}–${formatClassTime(course.end)}`,
        `${course.code} · ${course.title}`,
        getClassLocation(course)
      ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
      fragment.append(row);
    });
  });
  tableBody.append(fragment);
}

renderTimetable();
renderWeeklyTimetable();

// ---------------------------------------------------------------------------
// 4. Authentication Module & Form Handling
// ---------------------------------------------------------------------------
const loginScreen = $("#login-screen");
const campusApp = $("#campus-app");
const loginForm = $("#login-form");
const loginEmail = $("#login-email");
const loginPassword = $("#login-password");
const loginError = $("#login-error");

function showCampus(displayName) {
  const initial = displayName.charAt(0).toLocaleUpperCase();
  const profileName = $("#profile-name");
  const profileAvatar = $("#profile-avatar");
  const topbarAvatar = $("#topbar-avatar");

  if (profileName) profileName.textContent = displayName;
  if (profileAvatar) profileAvatar.textContent = initial;
  if (topbarAvatar) topbarAvatar.textContent = initial;

  if (loginScreen) loginScreen.hidden = true;
  if (campusApp) campusApp.hidden = false;
  document.body.classList.add("authenticated");
}

const existingSession = getStoredSession();
if (existingSession) {
  showCampus(existingSession);
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = loginEmail ? loginEmail.value.trim() : "";
    const password = loginPassword ? loginPassword.value.trim() : "";

    if (!validateEmail(email) || !validatePassword(password)) {
      if (loginError) loginError.hidden = false;
      return;
    }

    const displayName = formatStudentName(email);
    setStoredSession(displayName);
    if (loginError) loginError.hidden = true;
    showCampus(displayName);
  });
}

const togglePasswordBtn = $("#toggle-password");
if (togglePasswordBtn && loginPassword) {
  togglePasswordBtn.addEventListener("click", () => {
    const reveal = loginPassword.type === "password";
    loginPassword.type = reveal ? "text" : "password";
    togglePasswordBtn.textContent = reveal ? "Hide" : "Show";
    togglePasswordBtn.setAttribute("aria-label", `${reveal ? "Hide" : "Show"} password`);
    togglePasswordBtn.setAttribute("aria-pressed", String(reveal));
  });
}

const logoutBtn = $("#logout-button");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearStoredSession();
    const searchInput = $("#site-search");
    if (searchInput) searchInput.value = "";
    filterCampusInfo();

    const questionInput = $("#assistant-question");
    if (questionInput) questionInput.value = "";
    const reply = $("#assistant-reply");
    if (reply) reply.hidden = true;

    if (campusApp) campusApp.hidden = true;
    if (loginScreen) loginScreen.hidden = false;
    document.body.classList.remove("authenticated");

    if (loginForm) loginForm.reset();
    if (loginEmail) loginEmail.focus();
  });
}

const welcomeDate = $("#welcome-date");
if (welcomeDate) {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date()).toLocaleUpperCase();

  welcomeDate.replaceChildren();
  const liveDot = document.createElement("span");
  liveDot.className = "live-dot";
  welcomeDate.append(liveDot, ` ${formatted} · BENGALURU`);
}

// ---------------------------------------------------------------------------
// 5. Assistant / FAQ Module (Safe HTML rendering)
// ---------------------------------------------------------------------------
const assistantForm = $("#assistant-form");
const questionInput = $("#assistant-question");
const reply = $("#assistant-reply");

function askCampus(question) {
  if (!reply || !questionInput) return;
  const result = getAssistantAnswer(question);

  reply.innerHTML = result.answer; // Safe sanitized HTML from getAssistantAnswer
  reply.hidden = false;
  questionInput.value = "";
}

if (assistantForm) {
  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = questionInput ? questionInput.value.trim() : "";
    if (question) askCampus(question);
  });
}

$$("[data-question]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const question = button.dataset.question;
    askCampus(question);
    const assistantCard = $("#assistant");
    if (assistantCard) {
      assistantCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

// ---------------------------------------------------------------------------
// 6. Global Search & Keyboard Shortcut (Debounced)
// ---------------------------------------------------------------------------
const searchInput = $("#site-search");
const searchableItems = $$(".announcement, .service-link, .highlight-card, .campus-contact");
const emptyNotice = $("#search-empty");

function filterCampusInfo() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  searchableItems.forEach((item) => {
    const text = (item.textContent + " " + (item.dataset.searchable || "")).toLocaleLowerCase();
    const matches = !query || text.includes(query);
    item.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  appState.eventSearchQuery = query;
  renderCampusEvents();

  if (query && eventList && eventList.querySelector(".event-card")) {
    visibleCount += 1;
  }
  if (emptyNotice) {
    emptyNotice.hidden = !query || visibleCount > 0;
  }
}

if (searchInput) {
  searchInput.addEventListener("input", debounce(filterCampusInfo, 150));
}

document.addEventListener("keydown", (event) => {
  if (campusApp && !campusApp.hidden && (event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
    event.preventDefault();
    if (searchInput) searchInput.focus();
  }
  if (event.key === "Escape" && searchInput && document.activeElement === searchInput) {
    searchInput.value = "";
    filterCampusInfo();
    searchInput.blur();
  }
});

// ---------------------------------------------------------------------------
// 7. Route & Location Tools
// ---------------------------------------------------------------------------
const campusRouteForm = $("#campus-route-form");
if (campusRouteForm) {
  campusRouteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const destinationInput = $("#route-destination");
    const travelModeInput = $("#route-mode");
    const destination = destinationInput ? destinationInput.value.trim() : "";
    const travelMode = travelModeInput ? travelModeInput.value : "driving";

    if (!destination) return;
    const url = buildGoogleMapsRouteUrl(destination, travelMode);
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

const locateRouteBtn = $("#locate-campus-route");
if (locateRouteBtn) {
  locateRouteBtn.addEventListener("click", () => {
    const status = $("#map-status");
    const routeLink = $("#my-location-route");
    if (routeLink) routeLink.hidden = true;

    if (!navigator.geolocation) {
      if (status) status.textContent = "Location is not available in this browser. You can still search an address or open the campus map.";
      return;
    }
    if (status) status.textContent = "Requesting your location…";

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const origin = `${coords.latitude},${coords.longitude}`;
        const travelMode = $("#route-mode") ? $("#route-mode").value : "driving";
        const url = buildGoogleMapsRouteUrl(`Sapthagiri NPS University, ${campusAddress}`, travelMode, origin);

        if (routeLink) {
          routeLink.href = url;
          routeLink.hidden = false;
        }
        if (status) status.textContent = "Your location was used to prepare the route. Choose the link to open it in Google Maps.";
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. Allow location access or enter a starting place in Google Maps.",
          2: "Your location could not be determined. Try again or enter a starting place in Google Maps.",
          3: "Location lookup timed out. Try again or enter a starting place in Google Maps."
        };
        if (status) status.textContent = messages[error.code] || "Could not get your location. You can still search an address or open the campus map.";
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
}

$$("[data-campus-search]").forEach((button) => {
  button.addEventListener("click", () => {
    const query = `${button.dataset.campusSearch} near Sapthagiri NPS University, ${campusAddress}`;
    window.open(buildGoogleMapsSearchUrl(query), "_blank", "noopener,noreferrer");
  });
});

// ---------------------------------------------------------------------------
// 8. Live Weather Module
// ---------------------------------------------------------------------------
async function refreshWeather() {
  const status = $("#weather-status");
  const refreshButton = $("#weather-refresh");
  const tempEl = $("#weather-temp");
  const descEl = $("#weather-description");
  const detailEl = $("#weather-detail");

  if (status) status.textContent = "Checking live weather…";
  if (refreshButton) refreshButton.disabled = true;

  try {
    const data = await fetchCampusWeather();
    if (tempEl) tempEl.textContent = `${data.temperature}°`;
    if (descEl) descEl.textContent = data.description;
    if (detailEl) detailEl.textContent = data.recommendation;
    if (status) status.textContent = "Live weather via Open-Meteo · Free, no key";
  } catch (error) {
    if (status) status.textContent = "Live weather unavailable · Showing sample conditions";
    console.warn("Could not load live campus weather:", error);
  } finally {
    if (refreshButton) refreshButton.disabled = false;
  }
}

const weatherRefreshBtn = $("#weather-refresh");
if (weatherRefreshBtn) {
  weatherRefreshBtn.addEventListener("click", refreshWeather);
}
refreshWeather();

// Navigation Link Activation
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    $$(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
