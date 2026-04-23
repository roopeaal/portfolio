import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "multi-platform-iot-security-lab",
    title: "Multi-Platform IoT Security Lab",
    category: "IoT / Network Security",
    summary: "One security scenario demonstrated across multiple lab platforms to compare realism, repeatability and troubleshooting flow. Screenshots and demo coming later.",
    objective: "Build a consistent IoT security story and show how the same environment can be validated across different network simulation platforms.",
    technicalScope: "Segmentation, attack-path validation, traffic observation, IDS-style alerting, Linux-based services and controlled test traffic.",
    environment: "Cisco Modeling Labs, Containerlab, EVE-NG, GNS3, Linux-based nodes and simulated IoT endpoints.",
    implementation: "Designed equivalent topologies, repeated baseline and blocked-state tests, documented observations and compared strengths of each platform.",
    validation: "Connectivity checks, attack / block retests, packet-level inspection and reproducible screenshots from each environment.",
    result: "A documented multi-platform lab that works both as a technical demo and as a security-focused course project.",
    learned: "Stronger understanding of lab design, platform trade-offs, structured troubleshooting and security-oriented documentation.",
    stack: ["CML", "Containerlab", "EVE-NG", "GNS3", "Linux", "Networking", "IoT security"],
    evidence: ["Screenshots and demo coming later."],
    cardAccent: "switch",
  },
  {
    slug: "portfolio-site",
    title: "Interactive Network Portfolio Website",
    category: "Frontend / Portfolio",
    summary: "A Packet Tracer-inspired portfolio website where projects, profile and contact details are presented as interactive network devices. Screenshots and demo coming later.",
    objective: "Create a portfolio that stands out visually while still showing frontend implementation quality and attention to technical detail.",
    technicalScope: "Interactive device layout, animated topology, custom SVG device art, draggable elements and GitHub Pages deployment.",
    environment: "React / Next.js static site.",
    implementation: "Built a topology-style UI, custom device windows, project overview flows, LinkedIn browser preview and deployment fixes for GitHub Pages.",
    validation: "Local builds, static export checks, basePath fixes and iterative UI refinement.",
    result: "A distinctive portfolio homepage that works as both a personal site and a technical design showcase.",
    learned: "Sharper frontend polishing skills, safer refactoring and better judgement for turning a concept into a deployable product.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub Pages"],
    evidence: ["Screenshots and demo coming later."],
    cardAccent: "switch",
  },
  {
    slug: "aircraft-game-python-react",
    title: "Aircraft Game: Python to React",
    category: "Course Project / Game Logic",
    summary: "A course project first implemented in Python and later rebuilt as a React-based browser version. Screenshots and demo coming later.",
    objective: "Move a working game idea from a programming-course implementation into a frontend-driven web version.",
    technicalScope: "Game flow, replay logic, user interaction, state handling and porting logic from one implementation style to another.",
    environment: "Originally a Python course project, later rebuilt as a browser-based React project.",
    implementation: "Implemented the first version in Python and later recreated the game flow in React, including replay behaviour and UI interaction.",
    validation: "Manual playtesting and replay-flow checks.",
    result: "A small but credible progression project that shows development from core logic into a usable web interface.",
    learned: "Better understanding of how to translate logic between technologies and how UI changes the way users experience the same system.",
    stack: ["Python", "React", "JavaScript", "HTML", "CSS"],
    evidence: ["Screenshots and demo coming later."],
    cardAccent: "switch",
  },
  {
    slug: "heart-rate-monitor",
    title: "Heart Rate / BPM Monitor UI",
    category: "Embedded Systems / Health Data",
    summary:
      "PulseMaster is a first-year hardware project where we built an embedded heart-rate and HRV prototype using optical PPG sensing on Raspberry Pi Pico W.",
    objective:
      "Design a practical embedded system that can measure heart rate and compute HRV metrics in a usable interface, not just in theory.",
    technicalScope:
      "PPG signal capture, peak-to-peak interval processing, HRV metric calculation (mean PPI, mean HR, SDNN, RMSSD), menu control via rotary encoder, and OLED-based result rendering.",
    environment:
      "Raspberry Pi Pico W + CrowTail Pulse Sensor v2.0 + OLED + rotary encoder. Software developed in MicroPython with Thonny IDE, including WLAN/MQTT integration support.",
    implementation:
      "Implemented two measurement flows: a basic HR mode with live updates and an HRV mode that collects data for 30 seconds before computing advanced metrics on-device.",
    validation:
      "Validated readings by comparing output against trusted reference values/devices and iterating on the peak-detection logic and signal handling during testing.",
    result:
      "Delivered a working prototype and full project report for Metropolia Hardware 2, with reliable baseline BPM output and functional HRV analysis pipeline.",
    learned:
      "Deepened skills in embedded programming, signal-processing fundamentals, hardware-software integration, and structured team delivery under project constraints.",
    stack: ["MicroPython", "Raspberry Pi Pico W", "CrowTail Pulse Sensor v2.0", "OLED", "Rotary Encoder", "MQTT", "Thonny IDE"],
    evidence: [
      "Hardware build photo included in project overview.",
      "Project report completed: PulseMaster, Metropolia Hardware 2 (May 2024).",
      "Full report is available on request (contains full team member details and internal course documentation).",
    ],
    cardAccent: "switch",
  },
  {
    slug: "metropolia-login-ui",
    title: "Phishing Awareness Login Demo",
    category: "Security Awareness / Frontend + Backend",
    summary:
      "An authorized phishing-awareness simulation that recreates a familiar Metropolia CAS / OMA login experience to show how easily visual trust can be abused, while keeping the exercise technically safe.",
    objective:
      "Demonstrate real phishing risk in a controlled course context and prove that convincing UI imitation alone can trigger unsafe user behavior.",
    technicalScope:
      "CAS-style UI recreation, client-side username masking, strict no-password-storage policy, login-click telemetry, and an immediate warning/disclosure step after interaction.",
    environment:
      "Built as an authorized Practical Hacking exercise: frontend simulation + lightweight backend on an external Render domain (free tier).",
    implementation:
      "Implemented a CAS-style clone with matching visual structure, then added safety controls so the password value is never read or stored and usernames are masked before any logging.",
    validation:
      "Verified end-to-end interaction flow, confirmed masked username output, confirmed password non-storage, and validated immediate post-interaction disclosure messaging.",
    result:
      "A practical awareness demo that combines realistic interface replication with safe telemetry and clear ethical boundaries.",
    learned:
      "Stronger hands-on understanding of security-awareness engineering: scope control, safe data handling, and how interface familiarity influences user decisions.",
    stack: ["React", "TypeScript", "HTML", "CSS", "Node.js", "Express", "Security awareness"],
    evidence: [
      "Live demo: https://idp-metropolia-profile-cas-login.onrender.com",
      "Deployment note: hosted on Render free tier. First load may take around 30–90 seconds because of cold start.",
      "Authorized scope: Practical Hacking course simulation (not an official Metropolia login page).",
      "Safety controls: passwords are never read or stored, and usernames are masked before logging.",
      "Full finding reports are kept private by default because they contain social-engineering methodology and target-context details.",
    ],
    cardAccent: "switch",
  },
];
