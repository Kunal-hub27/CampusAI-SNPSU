/**
 * Data definitions for Sapthagiri NPS University Campus Companion
 */

export const campusAnswers = [
  {
    keywords: ["address", "location", "where", "directions", "map", "visit", "route"],
    answer: "<strong>Sapthagiri NPS University</strong> is at #14/5, Hesaraghatta Main Road, Chikkasandra, Jalahalli West, Bengaluru, Karnataka 560057. <a href=\"https://www.google.com/maps/dir/?api=1&amp;destination=Sapthagiri+NPS+University%2C+%2314%2F5%2C+Hesaraghatta+Main+Road%2C+Chikkasandra%2C+Jalahalli+West%2C+Bengaluru+560057\" target=\"_blank\" rel=\"noopener noreferrer\">Open directions in Google Maps ↗</a>"
  },
  {
    keywords: ["facility", "facilities", "lab", "laboratory", "classroom", "library", "sport", "gym", "yoga", "hostel", "infrastructure"],
    answer: "<strong>Facilities highlighted by the university</strong> include modern classrooms, advanced laboratories, the Center for Innovation Leadership, the Center for Performing Arts, and indoor/outdoor sports, yoga and gym facilities. <a href=\"https://snpsu.edu.in/\" target=\"_blank\" rel=\"noopener noreferrer\">Check the official website for current details ↗</a>"
  },
  {
    keywords: ["admission", "admissions", "apply", "application", "contact", "phone", "email", "enquiry", "enroll", "enrol"],
    answer: "<strong>For admissions or enquiries</strong>, use the university's official <a href=\"https://snpsu.edu.in/\" target=\"_blank\" rel=\"noopener noreferrer\">website</a> to confirm current contacts and application information. Contact details can change; please verify them there."
  },
  {
    keywords: ["course", "program", "programme", "degree", "engineering", "medicine", "management", "computer", "study"],
    answer: "<strong>The official university site</strong> describes undergraduate and postgraduate study areas including Medicine, Engineering, Applied Sciences, Business and Management Studies, and Computer Applications. Visit the <a href=\"https://snpsu.edu.in/\" target=\"_blank\" rel=\"noopener noreferrer\">university website</a> for current programs and eligibility."
  },
  {
    keywords: ["official", "website", "web", "link", "university"],
    answer: "<strong>Official website:</strong> <a href=\"https://snpsu.edu.in/\" target=\"_blank\" rel=\"noopener noreferrer\">snpsu.edu.in ↗</a>. Use it to confirm current campus, program, admissions and contact details."
  },
  {
    keywords: ["event", "happening", "today", "weekend", "club"],
    answer: "<strong>The Campus Events section</strong> organizes listings from the supplied event schedule by date and cultural/technical type. Technical listings include PromptWars, SAP Hackfest, the Git and GitHub Workshop, and Chapters University Summit. Dates and details are not independently verified; check the university's official channels before making plans."
  }
];

export const campusPhotoSlides = [
  { caption: "UNIVERSITY EXTERIOR", position: "100% 8%", size: "190% auto" },
  { caption: "SMART CLASSROOM", position: "0% 75%", size: "300% auto" },
  { caption: "LEARNING SPACE", position: "50% 75%", size: "300% auto" },
  { caption: "UNIVERSITY LIBRARY", position: "100% 75%", size: "300% auto" }
];

export const campusEvents = [
  {
    id: "aurafesta-2",
    title: "Aurafesta 2.0 University Fest",
    category: "cultural",
    date: null,
    location: "University campus grounds",
    details: "Festival day with a Raghu Dixit concert and DJ night."
  },
  {
    id: "onavia-2026",
    title: "Onavia 2026",
    category: "cultural",
    date: "2026-09-26",
    location: "SNPSU campus grounds",
    details: "The schedule describes a Ganesh Chaturthi celebration."
  },
  {
    id: "ganeshotsava-2026",
    title: "Ganeshotsava 2026",
    category: "cultural",
    date: "2026-09-12",
    location: "A Block, ground floor",
    details: "The schedule describes an Onam celebration and other festivities."
  },
  {
    id: "flashmob-2026",
    title: "Flashmob 2026",
    category: "cultural",
    date: "2026-09-30",
    location: "A Block entrance",
    details: "Flashmob for Avalokana 2026."
  },
  {
    id: "avalokana-2026",
    title: "Avalokana 2026",
    category: "cultural",
    date: "2026-10-01",
    location: "University campus",
    details: "Engineering freshers' day; Sapthami Gowda is listed as the chief guest."
  },
  {
    id: "navaratri-2026",
    title: "Navaratri 2026",
    category: "cultural",
    date: null,
    location: "University campus",
    details: "Navaratri week celebrations and an ethnic day. Date to be announced."
  },
  {
    id: "new-year-2027",
    title: "New Year 2027",
    category: "cultural",
    date: "2027-01-01",
    location: "University campus",
    details: "Ethnic day."
  },
  {
    id: "aurafesta-3",
    title: "Aurafesta 3.0 University Fest",
    category: "cultural",
    date: null,
    location: "University campus",
    details: "Festival day with a concert and DJ night. Date to be announced."
  },
  {
    id: "git-github-workshop-2026",
    title: "Git and GitHub Workshop",
    category: "technical",
    date: "2026-09-30",
    location: "C Block seminar hall",
    details: "Workshop conducted by SLUG."
  },
  {
    id: "chapters-university-summit-2026",
    title: "Chapters University Summit",
    category: "technical",
    date: "2026-10-31",
    location: "B Block",
    details: "Entrepreneurial summit."
  },
  {
    id: "promptwars-2026",
    title: "PromptWars",
    category: "technical",
    date: "2026-10-09",
    location: "B Block seminar hall",
    details: "PromptWars hackathon."
  },
  {
    id: "sap-hackfest-2026",
    title: "SAP Hackfest",
    category: "technical",
    date: "2026-10-15",
    location: "University campus",
    details: "Hackathon conducted by HRD."
  }
];

export const weeklyClasses = [
  {
    day: 0, name: "Monday", classes: [
      { start: "09:00", end: "11:00", code: "OOP", title: "Object Oriented Programming" },
      { start: "11:15", end: "12:15", code: "CN", title: "Computer Networks" },
      { start: "12:15", end: "13:15", code: "DBMS", title: "Database Management System" },
      { start: "14:15", end: "15:10", code: "OOP", title: "Object Oriented Programming" },
      { start: "15:10", end: "16:05", code: "PSM", title: "Probability Theory and Statistical Methods" },
      { start: "16:05", end: "17:00", code: "CAM", title: "Class Advisor Meeting" }
    ]
  },
  {
    day: 1, name: "Tuesday", classes: [
      { start: "09:00", end: "10:00", code: "COA", title: "Computer Organisation and Architecture" },
      { start: "10:00", end: "11:00", code: "DS", title: "Data Structures" },
      { start: "11:15", end: "13:15", code: "DSL", title: "Data Structures Lab" },
      { start: "14:15", end: "15:10", code: "DBMS", title: "Database Management System" },
      { start: "15:10", end: "16:05", code: "PAI", title: "Principles of Artificial Intelligence" },
      { start: "16:05", end: "17:00", code: "LIB", title: "Library" }
    ]
  },
  {
    day: 2, name: "Wednesday", classes: [
      { start: "09:00", end: "10:00", code: "CN", title: "Computer Networks" },
      { start: "10:00", end: "11:00", code: "COA", title: "Computer Organisation and Architecture" },
      { start: "11:15", end: "12:15", code: "DBMS", title: "Database Management System" },
      { start: "12:15", end: "13:15", code: "PSM", title: "Probability Theory and Statistical Methods" },
      { start: "14:15", end: "15:10", code: "OOP", title: "Object Oriented Programming" },
      { start: "15:10", end: "16:05", code: "DS", title: "Data Structures" },
      { start: "16:05", end: "17:00", code: "CRA", title: "Outreach Activity - 1" }
    ]
  },
  {
    day: 3, name: "Thursday", classes: [
      { start: "09:00", end: "10:00", code: "PAI", title: "Principles of Artificial Intelligence" },
      { start: "10:00", end: "11:00", code: "PSM", title: "Probability Theory and Statistical Methods" },
      { start: "11:15", end: "12:15", code: "DS", title: "Data Structures" },
      { start: "12:15", end: "13:15", code: "COA", title: "Computer Organisation and Architecture" },
      { start: "14:15", end: "16:05", code: "DBMSL", title: "Database Management System Lab" },
      { start: "16:05", end: "17:00", code: "SPORTS", title: "Sports / Physical Education" }
    ]
  },
  {
    day: 4, name: "Friday", classes: [
      { start: "09:00", end: "10:00", code: "PAI", title: "Principles of Artificial Intelligence" },
      { start: "10:00", end: "11:00", code: "CN", title: "Computer Networks" },
      { start: "11:15", end: "13:15", code: "LSE", title: "Life Skill for Engineers" }
    ]
  },
  {
    day: 5, name: "Saturday", classes: [
      { start: "14:15", end: "16:05", code: "DMT", title: "Additional Mathematics I" }
    ]
  },
  { day: 6, name: "Sunday", classes: [] }
];

export const weatherDescriptions = {
  0: "Clear skies", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Misty", 48: "Misty", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
  75: "Heavy snow", 80: "Passing showers", 81: "Showers", 82: "Heavy showers",
  95: "Thunderstorms", 96: "Thunderstorms", 99: "Thunderstorms"
};

export const campusAddress = "#14/5, Hesaraghatta Main Road, Chikkasandra, Jalahalli West, Bengaluru 560057, India";
