import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "multi-platform-iot-security-lab",
    title: "Multi-Platform IoT Security Lab Comparison",
    shortTitle: "IoT Security Lab Comparison",
    category: "IoT / Network Security",
    summary:
      "I contributed to a hands-on IoT security lab project where the same network testing scenario was built, tested and documented across CML Free, ContainerLab, GNS3 and EVE-NG.",
    overview: [
      "This project compared four virtual network lab platforms by implementing the same IoT security testing workflow on each one. The goal was to understand which platform worked best for practical lab use, not just compare features from documentation.",
      "The test scenario included basic connectivity, HTTP service exposure, firewall-based segmentation, and detection or logging using Suricata or iptables where the platform supported it. Every result was backed by screenshots, console output and an evidence package.",
      "For employers, this project shows practical experience with network lab environments, Linux-based testing, security segmentation, IDS/logging workflows and clear technical documentation.",
    ],
    whatIDid: [
      "Built and tested IoT security lab scenarios as part of a three-person project team.",
      "Configured IP addressing and verified ICMP reachability between attacker and IoT-side nodes.",
      "Tested HTTP service exposure from the IoT device side and validated access from the attacker side.",
      "Applied firewall segmentation to allow selected traffic while blocking SSH access.",
      "Verified detection and logging using Suricata fast.log, iptables logging and traffic capture where supported.",
      "Documented platform results with screenshots, console outputs, topology notes and final comparison analysis.",
    ],
    technicalHighlights: [
      "Compared Cisco Modeling Labs Free, ContainerLab, GNS3 and EVE-NG Community using the same practical test chain.",
      "Implemented segmentation tests where ICMP remained allowed while SSH was blocked.",
      "Used Suricata alert logging in CML Free and ContainerLab to confirm IDS visibility.",
      "Used EVE-NG Linux nodes for HTTP testing, tcpdump traffic visibility and iptables SSH attempt logging.",
      "Documented GNS3 reachability, device discovery and segmentation using lightweight VPCS endpoints.",
    ],
    objective:
      "Compare four virtual lab platforms through one repeatable IoT security workflow and identify where each platform is strongest in practical lab use.",
    technicalScope:
      "Network simulation, IoT security lab design, service exposure testing, firewall segmentation, IDS alert validation, traffic capture and platform comparison.",
    environment:
      "Cisco Modeling Labs Free, ContainerLab, GNS3, EVE-NG Community, Linux nodes, VPCS endpoints, Suricata, iptables, tcpdump and HTTP service testing.",
    implementation:
      "The same test chain was built across the platforms: connectivity, HTTP exposure, segmentation, blocked SSH testing and logging or detection where supported.",
    validation:
      "Validated results with ping tests, HTTP access checks, blocked SSH attempts, Suricata alerts, iptables logs, tcpdump output, screenshots and final comparison notes.",
    result:
      "CML Free and ContainerLab supported the most complete workflow, including service exposure, segmentation and IDS alerting. ContainerLab was the strongest option for reproducibility because the lab could be rebuilt from a YAML-defined topology, while EVE-NG gave the most realistic Linux host environment with strong traffic visibility. GNS3 worked well for basic topology, reachability and isolation testing, but the VPCS endpoints limited service-level and IDS testing. The final output was a complete documentation package with platform comparisons, evidence references, topology descriptions, screenshots, console output and recommendations for choosing the right lab platform depending on the learning goal.",
    learned:
      "Stronger practical understanding of network lab trade-offs, segmentation validation, IDS visibility, Linux traffic testing and evidence-based technical documentation.",
    skillsDemonstrated: [
      "Network simulation",
      "IoT security lab design",
      "Linux host testing",
      "Firewall segmentation",
      "IDS alert validation",
      "Traffic capture and logging",
      "Technical comparison",
      "Evidence-based documentation",
    ],
    stack: [
      "Cisco Modeling Labs Free",
      "ContainerLab",
      "GNS3",
      "EVE-NG Community",
      "Linux nodes",
      "VPCS endpoints",
      "Suricata",
      "iptables",
      "tcpdump",
      "HTTP service testing",
      "YAML topology definition",
    ],
    recruiterKeywords: ["Network simulation", "IoT security", "Linux", "Firewall segmentation", "Suricata", "ContainerLab", "EVE-NG", "GNS3"],
    employerPoints: [
      "Built and compared the same IoT security workflow across four different lab platforms.",
      "Validated segmentation and detection with practical evidence such as ping tests, blocked SSH, Suricata alerts, iptables logs and traffic capture.",
      "Produced a clear recommendation-driven report showing which tools fit different network and security lab use cases.",
    ],
    evidence: [],
    cardAccent: "switch",
  },
  {
    slug: "portfolio-site",
    title: "Interactive Network Topology Portfolio Website",
    shortTitle: "Network Topology Portfolio",
    category: "Frontend / Portfolio",
    summary:
      "I built a Next.js portfolio website where my profile, projects and contact details are presented through a Packet Tracer-inspired interactive network topology.",
    overview: [
      "This project is my personal technical portfolio, designed specifically for trainee and junior ICT job applications. Instead of a standard portfolio layout, the homepage works like a small network topology where devices open the main content areas: About, Projects, LinkedIn and Contact.",
      "The site was built as a static Next.js application and deployed to GitHub Pages. I implemented URL-synced popup states, deep links, redirect routes and reusable project content structures so the portfolio works both as a visual showcase and as a practical technical website.",
      "For employers, the project demonstrates frontend implementation, UI architecture, deployment configuration and the ability to turn a technical concept into a finished, usable product.",
    ],
    whatIDid: [
      "Implemented a Packet Tracer-inspired homepage with interactive network devices and topology-style visual structure.",
      "Built reusable popup windows for About, Projects, LinkedIn and Contact content.",
      "Configured URL-synced panel state so deep links can open specific portfolio sections directly.",
      "Implemented redirects from /about, /projects and /contact into the matching homepage popup states.",
      "Structured profile and project data into separate TypeScript content files for easier maintenance.",
      "Configured static export, base path handling and GitHub Pages deployment through GitHub Actions.",
    ],
    technicalHighlights: [
      "Next.js App Router static export configured for GitHub Pages and the roopeaaltonen.fi custom domain.",
      "URL state management for popup panels and individual project views using search parameters.",
      "Packet Tracer-style window shell with focus handling, keyboard support and animated transitions.",
      "Framer Motion used for UI movement, popup animation and topology interaction.",
      "Separate content files for profile data and project case studies, keeping UI and content logic cleaner.",
    ],
    objective:
      "Build a distinctive personal portfolio that works as both a visual frontend showcase and a maintainable technical website for job applications.",
    technicalScope:
      "Interactive topology UI, reusable popup windows, URL-synced state, static export, GitHub Pages deployment and structured TypeScript content data.",
    environment: "Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, GitHub Pages and GitHub Actions.",
    implementation:
      "The homepage was implemented as a network topology where each device opens a focused content window. Project and profile data were separated from UI components to keep the site easier to maintain.",
    validation:
      "Validated through local builds, static export checks, URL deep-link tests, redirect route tests and repeated visual iteration across desktop and mobile layouts.",
    result:
      "The result is a deployed portfolio site that acts as both a personal website and a frontend project. The homepage is not just a landing page: it is an interactive topology where each device has a clear content role and opens a focused popup window. The repository includes production-oriented project structure, build scripts, type checking, linting commands, static export settings and a GitHub Actions workflow that builds the site and deploys the exported output to GitHub Pages.",
    learned:
      "Sharper frontend implementation skills, better routing judgement, stronger deployment understanding and a clearer sense for turning a technical visual concept into a usable product.",
    skillsDemonstrated: [
      "Frontend development",
      "React component structure",
      "Next.js App Router",
      "TypeScript",
      "UI state management",
      "Static site deployment",
      "GitHub Actions workflow setup",
      "Technical design and visual iteration",
    ],
    stack: ["Next.js 16 App Router", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "GitHub Pages", "GitHub Actions", "Node.js 20.9+", "ESLint"],
    recruiterKeywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub Pages", "UI state management", "GitHub Actions"],
    employerPoints: [
      "Built a distinctive portfolio concept as a real working Next.js application, not just a visual mockup.",
      "Implemented practical routing behavior with URL-synced popups, deep links and redirect routes.",
      "Configured the project for static export and automated GitHub Pages deployment with a clear frontend project structure.",
    ],
    evidence: ["Source: https://raw.githubusercontent.com/roopeaal/portfolio/main/README.md"],
    cardAccent: "switch",
  },
  {
    slug: "aircraft-game-python-react",
    title: "Christopher Columbus Country Guessing Game",
    shortTitle: "Country Guessing Web Game",
    category: "Full-stack Web App / Game",
    summary:
      "I built a browser-based country guessing game that combines Flask, MySQL, geospatial calculations and an interactive Leaflet map into a playable full-stack web application.",
    overview: [
      "This project evolved from an earlier airport guessing game into a web-based country guessing game called Kristoffer Kolumbuksen jäljillä. The player tries to find the correct country using distance and compass-direction hints after each wrong guess.",
      "The game uses country and airport data stored in MySQL, including country center coordinates and large-airport information. The latest version adds a themed browser UI, clickable world map, scoring logic, hint system and leaderboard.",
      "For an employer, this project shows practical full-stack development, database work, geospatial logic, UI iteration and the ability to turn a course idea into a deployed web application.",
    ],
    whatIDid: [
      "Implemented the game as a Flask web application with multiple routes and HTML templates.",
      "Connected the application to a MySQL database for country, airport, player score and leaderboard data.",
      "Implemented distance and compass-direction hints using country coordinates, geopy and math.",
      "Added game state handling with cookies, including current round data, guessed countries and hint usage.",
      "Built an interactive Leaflet map where countries can be selected visually instead of only typed.",
      "Prepared the app for deployment with Gunicorn, Render configuration and environment-based database settings.",
    ],
    technicalHighlights: [
      "MySQL schema with country, airport and game tables for coordinates, large-airport data, player points and highscores.",
      "SQL query logic for selecting countries that have large airports and retrieving the largest airport as a hint.",
      "Flask backend with Jinja2 templates for the game page, start page and leaderboard.",
      "Leaflet + GeoJSON world map with clickable countries, guessed-country tracking and map state caching.",
      "Render deployment setup with Python 3.11, Gunicorn and Aiven MySQL SSL configuration.",
    ],
    objective:
      "Turn a database-driven course idea into a playable browser game with scoring, hints, map interaction and deployment-ready backend structure.",
    technicalScope:
      "Flask routing, MySQL data handling, geospatial distance and direction calculations, Leaflet map interaction, cookies, scoring and leaderboard logic.",
    environment: "Python 3.11, Flask, MySQL, Aiven MySQL, Render, Gunicorn, Jinja2, JavaScript, Leaflet, GeoJSON, geopy, HTML and CSS.",
    implementation:
      "The application uses Flask routes, Jinja templates, SQL queries, cookie-based state and Leaflet map selection to combine backend game logic with an interactive browser UI.",
    validation:
      "Validated through manual playtesting, database checks, map-click tests, scoring checks, hint behavior tests and deployment configuration review.",
    result:
      "The final version works as a playable browser game where the player can guess countries by typing or clicking the map. Wrong guesses return distance and direction feedback, while the hint system can reveal the target country’s largest airport. The game also tracks points, stores highscores and shows a top 10 leaderboard. The earlier documentation and database screenshots show how the project developed from a database-driven airport/country guessing idea into a more complete Flask-based web application with map interaction and deployment support.",
    learned:
      "Better understanding of full-stack application structure, geospatial logic, SQL-backed gameplay, UI iteration and deployment preparation.",
    skillsDemonstrated: [
      "Full-stack web development",
      "Flask backend development",
      "MySQL database design",
      "SQL queries and data handling",
      "Geospatial calculations",
      "JavaScript map interaction",
      "Deployment configuration",
      "UI iteration and documentation",
    ],
    stack: ["Python 3.11", "Flask", "Gunicorn", "MySQL", "Aiven MySQL", "Render", "Jinja2", "JavaScript", "Leaflet", "GeoJSON", "geopy", "HTML / CSS"],
    recruiterKeywords: ["Flask", "Python", "MySQL", "SQL", "Leaflet", "Geospatial logic", "Full-stack web app", "Render deployment"],
    employerPoints: [
      "Built a working full-stack web game with backend logic, database integration, scoring and leaderboard functionality.",
      "Used real geospatial calculations to provide distance and compass-direction feedback after each guess.",
      "Iterated the project from a simpler airport guessing game into a deployed browser-based application with an interactive map and polished theme.",
    ],
    evidence: [
      "Live demo: https://maanarvauspeli-loader.onrender.com/",
      "Render free tier note: the first load may take around 30-90 seconds because of cold start.",
    ],
    cardAccent: "switch",
  },
  {
    slug: "heart-rate-monitor",
    title: "PulseMaster – Embedded Heart Rate and HRV Monitor",
    shortTitle: "Embedded HRV Monitor",
    category: "Embedded Systems / Health Data",
    summary:
      "I led the programming of an embedded Raspberry Pi Pico W device that reads pulse sensor data, calculates heart rate and HRV metrics, and presents the results through a small hardware user interface.",
    overview: [
      "PulseMaster was a first-year hardware project where our team built a heart rate monitoring prototype using a Raspberry Pi Pico W and a CrowTail Pulse Sensor v2.0. The goal was to detect pulse signals using optical photoplethysmography and calculate heart rate variability values directly on the device.",
      "The system included an OLED display for output and a rotary encoder for menu navigation. I led most of the programming work, focusing on backend signal processing and interface functionality.",
      "For an employer, this project shows hands-on embedded development, sensor integration, algorithmic thinking and the ability to turn hardware components into a working interactive prototype.",
    ],
    whatIDid: [
      "Implemented core MicroPython functionality for the PulseMaster prototype.",
      "Programmed backend processing and user interface logic, contributing 352 of the project’s 405 total lines of code.",
      "Built rotary encoder based interaction for menu navigation and device control.",
      "Developed functions for ADC signal sampling, heart rate measurement and HRV calculation.",
      "Tested the prototype against more reliable readings and reference averages to evaluate measurement quality.",
      "Conducted the final project demo and contributed to the final documentation.",
    ],
    technicalHighlights: [
      "Raspberry Pi Pico W based embedded system with MicroPython.",
      "CrowTail Pulse Sensor v2.0 used to capture analog PPG pulse signals.",
      "On-device calculation of mean PPI, mean heart rate, SDNN and RMSSD.",
      "OLED display output with rotary encoder based menu interaction.",
      "WLAN and MQTT connection functions included in the codebase.",
    ],
    objective:
      "Build an embedded heart-rate monitoring prototype that reads real sensor data, calculates HRV metrics and presents results through a small device interface.",
    technicalScope:
      "MicroPython firmware, ADC signal sampling, PPG pulse sensing, HRV calculation, OLED output, rotary encoder interaction and basic WLAN/MQTT support.",
    environment: "Raspberry Pi Pico W, CrowTail Pulse Sensor v2.0, OLED display, rotary encoder, MicroPython and Thonny IDE.",
    implementation:
      "I implemented most of the device logic, including ADC reading, measurement modes, HR/HRV calculations, menu navigation and OLED result rendering.",
    validation:
      "Tested readings against more reliable reference values and documented measurement limitations related to signal quality and body location.",
    result:
      "The prototype successfully measured heart rate and displayed live heart rate values on the OLED display, updating the reading every five seconds. It also supported a 30-second HRV analysis mode, calculating and displaying mean PPI, mean heart rate, SDNN and RMSSD. The project demonstrated a working embedded measurement system, but the final report also identified realistic limitations: the basic signal processing produced only average accuracy, and measurements were less reliable from body areas with weaker pulse signal quality. The documentation included testing, function descriptions, implementation details and clear improvement targets for future signal filtering and peak detection.",
    learned:
      "Improved embedded programming, sensor integration, signal-processing fundamentals, device UI design, verification and honest technical documentation.",
    skillsDemonstrated: [
      "Embedded systems programming",
      "MicroPython development",
      "Sensor integration",
      "ADC signal sampling",
      "Basic signal processing",
      "Hardware user interface design",
      "Testing and verification",
      "Technical documentation",
    ],
    stack: ["Raspberry Pi Pico W", "CrowTail Pulse Sensor v2.0", "OLED display", "Rotary encoder", "MicroPython", "Thonny IDE", "ADC signal reading", "WLAN / MQTT functions"],
    recruiterKeywords: ["Embedded systems", "Raspberry Pi Pico W", "MicroPython", "Sensor integration", "IoT prototype", "Signal processing", "Hardware interface", "Technical documentation"],
    employerPoints: [
      "Led most of the programming work, including backend processing and hardware interface functionality.",
      "Built a working embedded prototype that connected real sensor input, on-device calculations and OLED output.",
      "Documented both the successful implementation and the technical limitations honestly, including accuracy and signal quality constraints.",
    ],
    evidence: [],
    cardAccent: "switch",
  },
  {
    slug: "pill-dispenser-pico",
    title: "Raspberry Pi Pico Pill Dispenser Controller",
    shortTitle: "Pico Pill Dispenser",
    category: "Embedded Systems / IoT Device Control",
    summary:
      "I built a Raspberry Pi Pico based pill dispenser controller that combines stepper motor control, opto fork calibration, piezo drop detection, EEPROM recovery state and LoRaWAN status messaging.",
    overview: [
      "This was a second-year Embedded Systems Programming course project where the goal was to build a working controller for an eight-position pill dispenser wheel. The system starts with calibration, waits for a schedule start, and then advances one compartment every 30 seconds.",
      "The hardware setup used a Raspberry Pi Pico, a stepper motor, an opto fork reference sensor, a piezo sensor for pill-drop detection, AT24C256 EEPROM for persistent state and a LoRa-E5 module for status messages.",
      "For an employer, this project shows practical C-based embedded development, hardware integration, sensor-driven calibration, recovery logic and structured technical documentation.",
    ],
    whatIDid: [
      "Implemented the dispenser firmware in C with the Raspberry Pi Pico SDK.",
      "Built half-step motor control for the four-wire stepper driving the dispenser wheel.",
      "Implemented opto fork based calibration by detecting the reference opening and measuring one full wheel revolution.",
      "Used a GPIO interrupt for piezo drop detection while keeping the interrupt handler minimal.",
      "Stored operating mode, remaining pills, measured steps per revolution and turn-in-progress state in EEPROM with checksum validation.",
      "Added LoRa-E5 AT command setup and short status messages for boot, calibration, dispensing, missing pill and empty states.",
    ],
    technicalHighlights: [
      "Three saved operating modes: waiting for calibration, ready to start and running.",
      "Calibration measures the opto opening width and centers the wheel instead of stopping on the first sensor edge.",
      "EEPROM recovery detects if power was lost during motor movement and restores the wheel from the opto reference position.",
      "The dispenser records turn_in_progress before the motor starts and clears it only after movement is complete.",
      "LoRaWAN messaging is non-blocking for core dispenser behavior: motor control continues even if network joining fails.",
    ],
    objective:
      "Build a dependable embedded controller for an eight-position dispenser wheel that can calibrate itself, dispense on schedule and recover correctly after a reset during motor movement.",
    technicalScope:
      "C firmware, Raspberry Pi Pico SDK, stepper motor half-step control, opto fork reference detection, GPIO interrupt handling, piezo drop sensing, I2C EEPROM state persistence and LoRa-E5 UART communication.",
    environment:
      "Raspberry Pi Pico, second-year embedded systems board, Pico C/C++ SDK, CMake, CLion, OpenOCD debug probe, AT24C256 EEPROM, LoRa-E5 module, stepper motor, opto fork sensor and piezo sensor.",
    implementation:
      "The firmware uses a saved state machine and hardware-specific helper functions for EEPROM, GPIO, stepper movement, calibration and LoRa messaging. Before each dispense movement, the program saves that a motor turn is in progress so the next boot can recover safely if power is lost.",
    validation:
      "Validated through build and flash checks, serial monitor output, calibration tests, 30-second dispensing cadence checks, piezo detected and no-pill paths, EEPROM restore checks and reset-during-turn recovery testing.",
    result:
      "The final project produced a working dispenser controller and a 13-page project report. The system can calibrate the wheel, start a timed dispense schedule, detect missing pill drops, send status events and recover from an interrupted motor turn by returning to the opto reference before completing the dispense.",
    learned:
      "Improved C-based embedded programming, hardware-software integration, interrupt design, persistent state handling, motor calibration, LoRa module communication and practical debugging with real mechanical tolerances.",
    skillsDemonstrated: [
      "Embedded C development",
      "Raspberry Pi Pico SDK",
      "Stepper motor control",
      "Sensor-based calibration",
      "GPIO interrupt handling",
      "I2C EEPROM persistence",
      "UART AT command communication",
      "Recovery-state design",
      "Technical documentation",
    ],
    stack: ["Raspberry Pi Pico", "C", "Pico SDK", "CMake", "CLion", "OpenOCD", "AT24C256 EEPROM", "LoRa-E5", "Stepper motor", "Opto fork sensor", "Piezo sensor"],
    recruiterKeywords: ["Embedded systems", "Raspberry Pi Pico", "C", "Pico SDK", "Stepper motor", "EEPROM", "LoRaWAN", "GPIO interrupts", "IoT device control"],
    employerPoints: [
      "Built firmware that coordinates real hardware components instead of only simulating logic.",
      "Implemented persistent recovery behavior for the most failure-prone moment: reset or power loss during motor movement.",
      "Documented the design, testing process and practical limitations clearly in a full course project report.",
    ],
    evidence: [
      "Project report completed: Pill Dispenser Project, Metropolia Embedded Systems Programming (May 2026).",
      "Recovery behavior tested by restarting during motor movement and restoring from EEPROM state.",
    ],
    cardAccent: "switch",
  },
  {
    slug: "metropolia-login-ui",
    title: "Safe Phishing Simulation for Metropolia CAS / OMA Login",
    shortTitle: "Safe CAS Login Phishing Simulation",
    category: "Security Testing / Awareness",
    summary:
      "I built and tested a controlled phishing simulation that demonstrated how users can trust a realistic login page based on appearance and a familiar chat context, while keeping the exercise safe by masking usernames and never storing passwords.",
    overview: [
      "This project was a practical social engineering and web security exercise focused on Metropolia’s CAS / OMA login flow. I created a realistic CAS-style login clone on an external Render domain to test how convincing a fake login page can be when shared through a normal student communication channel.",
      "The goal was not to steal credentials, but to demonstrate the real-world risk of phishing in a controlled and documented way. The page included safe demo logic: passwords were never read or stored, usernames were masked in the browser, and users were shown a clear warning overlay explaining that the page was a Practical Hacking course test page.",
      "For an employer, the project shows practical security thinking, careful risk control, web implementation skills, evidence-based testing and the ability to document findings in a structured security report.",
    ],
    whatIDid: [
      "Implemented a CAS-style login clone with Metropolia-style visual elements, username/password fields and a realistic login layout.",
      "Deployed the training page to Render over HTTPS.",
      "Added client-side JavaScript to mask usernames before display and count total login button clicks.",
      "Shared the link in a closed student WhatsApp group with a realistic context to test user interaction.",
      "Validated the results using screenshots of the fake login page, warning overlay, click counter and masked usernames.",
      "Documented the finding with impact analysis, exploitability, recommendations and retest criteria.",
    ],
    technicalHighlights: [
      "Web-based phishing simulation hosted on Render using HTTPS.",
      "Client-side safety controls: no password collection, username masking and warning overlay.",
      "Evidence collection through screenshots, click count and masked username output.",
      "Security reporting structure including CVSS v4.0 scoring, impact, exploitability and remediation.",
      "Practical focus on identity security, user behaviour, domain verification and phishing-resistant authentication.",
    ],
    objective:
      "Demonstrate realistic phishing risk in a controlled course setting while preventing credential exposure and documenting the security finding responsibly.",
    technicalScope:
      "CAS-style login simulation, Render deployment, HTTPS, client-side username masking, click counting, warning overlay, evidence collection and security reporting.",
    environment: "Render, HTTPS / TCP 443, Chrome, WhatsApp Web, client-side JavaScript, HTML login form and Metropolia CAS / OMA login flow as the target model.",
    implementation:
      "The page imitated the familiar login flow visually but used safe client-side logic: passwords were never read or stored, usernames were masked before display, and interaction led to a clear warning overlay.",
    validation:
      "Validated with screenshots of the fake login page, warning overlay, click counter and masked username output to prove user interaction without exposing real credentials.",
    result:
      "The simulation showed that several students clicked the shared link and interacted with the fake login form. The result overlay displayed the total number of login button clicks and masked usernames, proving interaction without exposing real credentials. The report also showed why the same technique would be high risk in a real attack: a malicious clone could capture CAS / OMA credentials and lead to account takeover across services such as email, Moodle, OMA and Pakki. The final documentation included concrete mitigation recommendations, including awareness training, password manager use, domain checking and longer-term phishing-resistant authentication such as FIDO2/WebAuthn.",
    learned:
      "Stronger practical understanding of social engineering risk, safe security testing boundaries, identity-security reporting and how familiar UI can affect user trust.",
    skillsDemonstrated: [
      "Practical web security testing",
      "Social engineering risk analysis",
      "Secure demo design",
      "JavaScript-based client-side logic",
      "Evidence-based documentation",
      "Security reporting",
      "User awareness testing",
      "Identity and authentication risk understanding",
    ],
    stack: ["Render", "HTTPS / TCP 443", "Chrome", "WhatsApp Web", "Client-side JavaScript", "HTML / web login form", "CVSS v4.0", "Metropolia CAS / OMA login flow as the phishing target model"],
    recruiterKeywords: ["Security testing", "Phishing simulation", "Web security", "JavaScript", "Identity security", "CAS login", "Documentation", "Risk analysis"],
    employerPoints: [
      "Built a realistic security test that demonstrated actual user behaviour without collecting or storing real credentials.",
      "Combined practical web implementation, security thinking and controlled evidence collection.",
      "Produced a structured finding report with impact, exploitability, mitigation recommendations and retest criteria.",
    ],
    evidence: [],
    cardAccent: "switch",
  },
];
