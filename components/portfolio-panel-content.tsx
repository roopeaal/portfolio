"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";

export interface PanelSidebarItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  onSelect?: () => void;
}

export function HomePanelContent() {
  return (
    <div className="h-full overflow-auto bg-[#f5f7fb] p-4 md:p-6">
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-[24px] border border-[#d6deea] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[#e5ebf3] bg-[linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)] px-6 py-4 text-[12px] text-[#667085]">
          {profile.linkedinLabel}
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[220px_1fr] lg:p-6">
          <div className="mx-auto w-full max-w-[220px]">
            <div className="relative aspect-square overflow-hidden rounded-full border border-[#dbe3eb] bg-[#f8fafc] shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
              <Image
                src={profile.portraitSrc}
                alt={profile.name}
                fill
                sizes="220px"
                className="object-cover"
                priority
                draggable={false}
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a94a5]">Identity Browser</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[#121a2b] md:text-4xl">{profile.name}</h2>
            <p className="mt-2 text-lg font-medium text-[#334155]">{profile.headline}</p>
            <p className="text-[15px] text-[#516074]">{profile.subheadline}</p>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#4b5565]">{profile.positioning}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>{profile.completedEcts}</Tag>
              {profile.quickFacts.slice(0, 3).map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Location", profile.location],
                ["Phone", profile.phone],
                ["Email", profile.email],
                ["LinkedIn", profile.linkedinLabel],
              ].map(([itemLabel, value]) => (
                <div key={itemLabel} className="rounded-[16px] border border-[#dde3ea] bg-[#fbfcfe] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#8b96a8]">{itemLabel}</p>
                  <p className="mt-2 text-[14px] font-medium text-[#111827]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
              <section className="rounded-[18px] border border-[#dde3ea] bg-[#fbfcfe] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#516074]">Why this homepage exists</h3>
                <p className="mt-3 text-[14px] leading-7 text-[#4b5565]">
                  The portfolio uses a network-topology inspired interface because it matches the kind of work I am targeting: connected systems,
                  practical configuration, implementation visibility and technical structure. The style is intentionally interactive, but the content stays grounded.
                </p>
              </section>

              <section className="rounded-[18px] border border-[#dde3ea] bg-[#fbfcfe] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#516074]">Quick actions</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionLink href={profile.linkedin} external>
                    Open LinkedIn
                  </ActionLink>
                  <ActionLink href={profile.cvHref}>Open CV</ActionLink>
                  <ActionLink href={`mailto:${profile.email}`}>Email</ActionLink>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutPanelContent({
  section,
  preview = false,
}: {
  section?: "profile" | "direction" | "studies" | "reliability";
  preview?: boolean;
}) {
  void section;

  const heroLineTop = "ROOPE AALTONEN IS AN ICT ENGINEERING STUDENT";
  const heroLineBottom = "LIVING AND WORKING IN THE HELSINKI METROPOLITAN AREA";
  const portraitSrc = "/portfolio/about-vintage-roope.png";
  const leftCopy =
    "Greetings, Dear Reader. I'm Roope Aaltonen, an ICT engineering student with a particular fondness for networking, Linux, cloud, IoT and the practical art of solving technical problems. I have long been drawn to the inner logic of systems, how they connect, how they fail, how they recover, and how they may be shaped into something dependable, orderly and fit for real use.";
  const rightCopy =
    "My interests lie chiefly in networks, infrastructure and the practical side of computing. Before entering the world of formal study, I worked in warehouse operations, where ERP systems, stock control and daily process accuracy first led me further into technology. Since then, that interest has only deepened, and I now spend a good share of my time building projects that turn curiosity into something concrete, functional and plainly visible.";

  if (preview) {
    return (
      <div
        className="relative h-full overflow-hidden rounded-[12px] border border-[#2f394a] p-3 text-[#d5deea]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/portfolio/about-vintage-wallpaper-v17.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="relative z-[1] grid h-full min-h-0 grid-cols-[1fr_126px_1fr] items-center gap-2">
          <p className="text-[9px] leading-4 text-[#c8d2df]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{leftCopy}</p>
          <div className="relative mx-auto h-[156px] w-[126px] overflow-hidden">
            <Image src={portraitSrc} alt={profile.name} fill sizes="126px" className="object-contain object-center scale-[1.1] [filter:contrast(1.04)_brightness(0.98)]" />
          </div>
          <p className="text-[9px] leading-4 text-[#c8d2df]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{rightCopy}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden text-[#d5deea]"
      style={{
        backgroundColor: "#1a2230",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 1,
          backgroundImage: "url('/portfolio/about-vintage-wallpaper-v17.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      <div className="relative z-[1] flex h-full min-h-0 flex-col px-4 py-4 md:px-6 md:py-5">
        <header className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c6d1df]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span className="block">{heroLineTop}</span>
            <span className="mt-1 block">{heroLineBottom}</span>
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#72829b]/40" />
            <span className="text-[16px] text-[#b7c4d7]">❦</span>
            <div className="h-px flex-1 bg-[#72829b]/40" />
          </div>
        </header>

        <div className="mt-3 grid min-h-0 flex-1 items-center gap-4 lg:grid-cols-[1fr_400px_1fr]">
          <section
            className="mx-auto max-w-[360px] px-4 text-center text-[13px] leading-8 text-[#d7e0eb]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 1px 0 rgba(0,0,0,0.28)" }}
          >
            {leftCopy}
          </section>

          <figure className="flex h-full min-h-0 flex-col items-center justify-center">
            <div className="relative min-h-0 w-full max-w-[400px] flex-1 overflow-hidden">
              <Image
                src={portraitSrc}
                alt={`${profile.name} vintage portrait`}
                fill
                sizes="400px"
                className="object-contain object-center [filter:contrast(1.06)_brightness(0.99)]"
                priority={false}
              />
            </div>
            <figcaption
              className="mt-2 text-center text-[#c7d3e4]"
              style={{ textShadow: "0 1px 0 rgba(0,0,0,0.35)" }}
            >
              <span
                className="block text-[20px] leading-[1.02] text-[#d9e2ef]"
                style={{ fontFamily: "'Apple Chancery', 'Snell Roundhand', 'URW Chancery L', 'Brush Script MT', cursive" }}
              >
                Roope Aaltonen
              </span>
              <span
                className="mt-0.5 block text-[16px] leading-[1.02] text-[#aebdd2]"
                style={{ fontFamily: "'Apple Chancery', 'Snell Roundhand', 'URW Chancery L', 'Brush Script MT', cursive" }}
              >
                Student of Technology
              </span>
            </figcaption>
          </figure>

          <section
            className="mx-auto max-w-[360px] px-4 text-center text-[13px] leading-8 text-[#d7e0eb]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 1px 0 rgba(0,0,0,0.28)" }}
          >
            {rightCopy}
          </section>
        </div>
      </div>
    </div>
  );
}

const PROJECT_CARD_MEDIA: Record<
  string,
  {
    src: string;
    alt: string;
    mode?: "contain" | "cover";
    backdrop?: string;
  }
> = {
  "multi-platform-iot-security-lab": {
    src: "/portfolio/portfolio/project-iot-security-lab.png",
    alt: "Cisco Modeling Labs PwnHub lab demonstration screenshot",
    mode: "cover",
    backdrop: "#050505",
  },
  "portfolio-site": {
    src: "/portfolio/portfolio/project-portfolio-site.png",
    alt: "Interactive network topology portfolio homepage screenshot",
    mode: "cover",
    backdrop: "#f8fafc",
  },
  "aircraft-game-python-react": {
    src: "/portfolio/portfolio/project-maanarvauspeli.png",
    alt: "Kristoffer Kolumbuksen jaljilla - maanarvauspeli screenshot",
    mode: "cover",
    backdrop: "#f2ebdb",
  },
  "heart-rate-monitor": {
    src: "/portfolio/portfolio/project-pulsemaster-hw.jpeg",
    alt: "PulseMaster hardware setup with Raspberry Pi Pico and pulse sensor",
    mode: "cover",
    backdrop: "#1f2429",
  },
  "metropolia-login-ui": {
    src: "/portfolio/portfolio/project-metropolia-login-demo.png",
    alt: "Phishing awareness login demo screenshot",
    mode: "cover",
    backdrop: "#eceff4",
  },
};

const CONTACT_GREAT_WORD_BACKGROUND =
  "url('/portfolio/portfolio/contact-great-word-fire-v5.png?v=20260428-fire5'), url('/portfolio/contact-great-word-fire-v5.png?v=20260428-fire5')";

export const PROJECTS_OVERVIEW_HREF = "/?panel=projects";

export function getProjectHref(slug: string) {
  return `${PROJECTS_OVERVIEW_HREF}&project=${encodeURIComponent(slug)}`;
}

function extractUrls(text: string): string[] {
  return Array.from(text.matchAll(/https?:\/\/\S+/gi)).map((match) => match[0].replace(/[),.;]+$/, ""));
}

function stripUrls(text: string): string {
  return text.replace(/https?:\/\/\S+/gi, "").replace(/\s{2,}/g, " ").trim();
}

function ProjectMarqueeCard({
  project,
  onSelectProject,
  size = "overview",
}: {
  project: (typeof projects)[number];
  onSelectProject?: (slug: string) => void;
  size?: "overview" | "compact";
}) {
  const media = PROJECT_CARD_MEDIA[project.slug];
  const [mediaFailed, setMediaFailed] = useState(false);
  const mediaShapeClass = size === "compact" ? "aspect-[16/10]" : "aspect-[16/10]";

  useEffect(() => {
    setMediaFailed(false);
  }, [project.slug, media?.src]);

  return (
    <Link
      href={getProjectHref(project.slug)}
      scroll={false}
      onClick={() => onSelectProject?.(project.slug)}
      className="group block w-full rounded-[10px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d7f35] focus-visible:ring-offset-2"
      aria-label={`Open project: ${project.title}`}
    >
      <article className="overflow-hidden rounded-[12px] border border-[#79c271] bg-[#edf8df] transition duration-200 group-hover:border-[#4f9b47]">
        <div className={`relative overflow-hidden ${mediaShapeClass}`}>
          {media && !mediaFailed ? (
            <>
              <div className="absolute inset-0 z-0" style={{ background: media.backdrop ?? "#edf6df" }} />
              <img
                src={media.src}
                alt={media.alt}
                className={`relative z-[1] block h-full w-full opacity-100 transition duration-300 group-hover:scale-[1.02] ${media.mode === "cover" ? "object-cover object-center" : "object-contain object-center p-1"}`}
                draggable={false}
                loading="lazy"
                decoding="async"
                onError={() => setMediaFailed(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[#e8f5d9] px-6 text-center">
              <span
                className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-semibold leading-[1.2] tracking-[0.01em] text-[#2a5b2b]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {project.title}
              </span>
            </div>
          )}
          {size === "overview" ? (
            <div className="pointer-events-none absolute bottom-2 left-2 z-[2] flex max-w-[calc(100%-1rem)] translate-y-1 items-center gap-2 rounded-[11px] border border-[#79c271] bg-[#edf8df]/96 px-3 py-2 opacity-0 shadow-[0_8px_18px_rgba(58,125,46,0.18)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <span className="h-7 w-1 shrink-0 rounded-full bg-[#58b94f]" />
              <span className="min-w-0 text-[#163f81]">
                <span className="block text-[8px] font-semibold uppercase tracking-[0.2em] text-[#29528f]/75">Project</span>
                <span className="block truncate text-[12px] font-semibold leading-tight">{project.title}</span>
              </span>
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

function ProjectMarqueeLane({
  items,
  direction,
  onSelectProject,
}: {
  items: (typeof projects)[number][];
  direction: "up" | "down";
  onSelectProject?: (slug: string) => void;
}) {
  const laneRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const lane = laneRef.current;
    const segment = segmentRef.current;
    if (!lane || !segment || items.length === 0) return;

    let segmentHeight = 0;
    let rafId = 0;
    let previousTime = 0;
    const speedPxPerSecond = 20;

    const normalizeScrollPosition = () => {
      if (segmentHeight <= 0) return;
      const min = segmentHeight * 0.5;
      const max = segmentHeight * 1.5;

      while (lane.scrollTop < min) lane.scrollTop += segmentHeight;
      while (lane.scrollTop > max) lane.scrollTop -= segmentHeight;
    };

    const setBaseline = () => {
      segmentHeight = segment.scrollHeight;
      if (segmentHeight > 0) {
        lane.scrollTop = segmentHeight;
      }
    };

    setBaseline();
    const observer = new ResizeObserver(() => setBaseline());
    observer.observe(segment);

    const handleScroll = () => {
      normalizeScrollPosition();
    };
    lane.addEventListener("scroll", handleScroll, { passive: true });

    const loop = (time: number) => {
      if (!previousTime) previousTime = time;
      const deltaTime = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (segmentHeight > 0 && !isPausedRef.current) {
        const delta = (direction === "up" ? -1 : 1) * speedPxPerSecond * deltaTime;
        lane.scrollTop += delta;
        normalizeScrollPosition();
      }

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(rafId);
      lane.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [direction, items]);

  return (
    <div
      className="relative h-full min-h-0 overflow-hidden"
      onPointerEnter={() => {
        isPausedRef.current = true;
      }}
      onPointerLeave={() => {
        isPausedRef.current = false;
      }}
      onFocusCapture={() => {
        isPausedRef.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          isPausedRef.current = false;
        }
      }}
    >
      <div
        ref={laneRef}
        className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={segmentRef} className="space-y-5 pb-5">
          {items.map((project) => (
            <ProjectMarqueeCard key={`${project.slug}-segment-a`} project={project} onSelectProject={onSelectProject} />
          ))}
        </div>
        <div aria-hidden className="space-y-5 pb-5">
          {items.map((project) => (
            <ProjectMarqueeCard key={`${project.slug}-segment-b`} project={project} onSelectProject={onSelectProject} />
          ))}
        </div>
        <div aria-hidden className="space-y-5 pb-5">
          {items.map((project) => (
            <ProjectMarqueeCard key={`${project.slug}-segment-c`} project={project} onSelectProject={onSelectProject} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsPanelContent({
  selectedProjectSlug,
  preview = false,
  onSelectProject,
  onShowOverview,
}: {
  selectedProjectSlug?: string | null;
  preview?: boolean;
  onSelectProject?: (slug: string) => void;
  onShowOverview?: () => void;
}) {
  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedProjectSlug) ?? null,
    [selectedProjectSlug],
  );

  const overviewProjectOrder = useMemo(() => {
    const withMedia = projects.filter((project) => Boolean(PROJECT_CARD_MEDIA[project.slug]));
    const withoutMedia = projects.filter((project) => !PROJECT_CARD_MEDIA[project.slug]);
    return [...withMedia, ...withoutMedia];
  }, []);

  const leftLaneProjects = useMemo(() => {
    const items = overviewProjectOrder.filter((_, index) => index % 2 === 0);
    return items.length > 0 ? items : overviewProjectOrder;
  }, [overviewProjectOrder]);

  const rightLaneProjects = useMemo(() => {
    const items = overviewProjectOrder.filter((_, index) => index % 2 === 1);
    return items.length > 0 ? items : overviewProjectOrder;
  }, [overviewProjectOrder]);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  useEffect(() => {
    setHeroImageFailed(false);
  }, [selectedProject?.slug]);

  if (preview) {
    return (
      <div className="h-full overflow-hidden rounded-[12px] border border-[#bcd7a8] bg-[linear-gradient(180deg,#dff2ce_0%,#d4ecbf_100%)] p-3 text-[#16345e]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#35587d]">Projects</p>
        <h3 className="mt-1 text-[18px] font-semibold leading-[1.04] text-[#16345e]">Discover projects I have built</h3>
        <div className="mt-3 grid h-[calc(100%-68px)] min-h-0 grid-cols-2 gap-2">
          {[...leftLaneProjects.slice(0, 2), ...rightLaneProjects.slice(0, 2)].slice(0, 4).map((project) => (
            <div key={project.slug} className="min-h-0">
              <ProjectMarqueeCard project={project} onSelectProject={onSelectProject} size="compact" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="h-full w-full overflow-hidden bg-[linear-gradient(180deg,#d6edc3_0%,#cbe7b1_100%)] p-0 text-[#1d3658]">
        <div className="grid h-full min-h-0 gap-0 lg:grid-cols-[minmax(240px,0.62fr)_minmax(0,1.38fr)]">
          <section className="flex min-h-0 items-center px-5 py-8 md:px-6">
            <div className="w-full max-w-[390px] -rotate-[1deg]">
              <svg
                viewBox="0 0 390 330"
                role="img"
                aria-label="Discover projects I have built"
                className="block w-full overflow-visible"
              >
                <defs>
                  <filter id="projectsPolishedShadow" x="-20%" y="-20%" width="140%" height="150%">
                    <feDropShadow dx="0" dy="7" stdDeviation="0" floodColor="#0f2f62" floodOpacity="0.18" />
                    <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#3d7f35" floodOpacity="0.12" />
                  </filter>
                  <linearGradient id="projectsBadgeFill" x1="28" y1="20" x2="360" y2="310" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f8fff0" />
                    <stop offset="1" stopColor="#eaf8db" />
                  </linearGradient>
                </defs>
                <path
                  d="M33 34 C79 12 318 13 354 43 C384 68 374 274 334 299 C288 328 77 322 38 298 C3 276 0 58 33 34 Z"
                  fill="url(#projectsBadgeFill)"
                  stroke="#8bcf74"
                  strokeWidth="3"
                  filter="url(#projectsPolishedShadow)"
                />
                <path
                  d="M51 53 C96 33 294 31 338 55 C369 72 360 258 326 281 C283 309 93 305 54 281 C22 261 21 72 51 53 Z"
                  fill="none"
                  stroke="#c6eba6"
                  strokeWidth="2"
                  strokeDasharray="7 10"
                  opacity="0.75"
                />
                <path
                  d="M43 149 C97 106 292 95 344 132 C391 166 315 213 178 216 C77 218 15 188 43 149 Z"
                  fill="#d7f56a"
                  opacity="0.9"
                />
                <path
                  d="M35 148 C89 101 299 92 349 130 C394 165 316 218 176 219 C73 219 7 189 35 148 Z"
                  fill="none"
                  stroke="#102f63"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                <g
                  fill="#102f63"
                  stroke="#f8fff0"
                  strokeWidth="1.7"
                  paintOrder="stroke fill"
                  style={{ fontFamily: "'Avenir Next', 'Trebuchet MS', sans-serif", fontWeight: 900 }}
                >
                  <text x="55" y="91" fontSize="34" letterSpacing="4" transform="rotate(1 55 91)">
                    DISCOVER
                  </text>
                  <text x="40" y="183" fontSize="74" letterSpacing="-3.5" textLength="310" lengthAdjust="spacingAndGlyphs" transform="rotate(-1.4 40 183)">
                    projects
                  </text>
                  <text x="58" y="254" fontSize="46" letterSpacing="-1.5" textLength="274" lengthAdjust="spacingAndGlyphs" transform="rotate(0.7 58 254)">
                    I have built
                  </text>
                </g>
                <path d="M67 269 C126 284 242 285 325 267" fill="none" stroke="#c9f25a" strokeWidth="8" strokeLinecap="round" />
                <path d="M67 269 C126 284 242 285 325 267" fill="none" stroke="#102f63" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
              </svg>
            </div>
          </section>

          <section className="grid h-full min-h-0 gap-5 overflow-hidden px-4 py-0 md:grid-cols-2 md:px-5">
            <ProjectMarqueeLane items={leftLaneProjects} direction="up" onSelectProject={onSelectProject} />
            <ProjectMarqueeLane items={rightLaneProjects} direction="down" onSelectProject={onSelectProject} />
          </section>
        </div>
      </div>
    );
  }

  const index = projects.findIndex((project) => project.slug === selectedProject.slug);
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const selectedProjectMedia = PROJECT_CARD_MEDIA[selectedProject.slug];
  const evidenceItems = selectedProject.evidence.map(stripUrls).filter(Boolean);
  const projectLinks = Array.from(
    new Set([
      ...extractUrls(selectedProject.summary),
      ...extractUrls(selectedProject.objective),
      ...extractUrls(selectedProject.environment),
      ...selectedProject.evidence.flatMap(extractUrls),
    ]),
  );
  const projectArticleClass = "rounded-[16px] border border-[#95cf83] bg-[#edf8df]/88 p-4 shadow-[0_10px_24px_rgba(58,125,46,0.08)]";
  const projectHeadingClass = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#29528f]/82";
  const projectBodyClass = "mt-2 text-[14px] leading-7 text-[#24405f]";

  return (
    <div className="h-full w-full overflow-auto bg-[linear-gradient(180deg,#d6edc3_0%,#cbe7b1_100%)] text-[#1d3658]">
      <article className="mx-auto max-w-[1100px] px-5 py-5 md:px-7 md:py-6">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#89c97a]/70 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={PROJECTS_OVERVIEW_HREF}
              scroll={false}
              onClick={() => onShowOverview?.()}
              className="rounded-[10px] border border-[#79c271] bg-[#edf8df] px-3 py-1.5 text-[12px] font-semibold text-[#163f81] transition hover:bg-[#f8fff0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d7f35]"
            >
              ← Back to all projects
            </Link>
            <span className="rounded-[10px] border border-[#79c271] bg-[#edf8df]/88 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#29528f]/82">
              {selectedProject.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {previous ? (
              <Link
                href={getProjectHref(previous.slug)}
                scroll={false}
                onClick={() => onSelectProject?.(previous.slug)}
                className="rounded-[10px] border border-[#79c271] bg-[#edf8df] px-3 py-1.5 text-[12px] font-semibold text-[#163f81] transition hover:bg-[#f8fff0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d7f35]"
              >
                ← Previous
              </Link>
            ) : null}
            {next ? (
              <Link
                href={getProjectHref(next.slug)}
                scroll={false}
                onClick={() => onSelectProject?.(next.slug)}
                className="rounded-[10px] border border-[#79c271] bg-[#edf8df] px-3 py-1.5 text-[12px] font-semibold text-[#163f81] transition hover:bg-[#f8fff0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d7f35]"
              >
                Next →
              </Link>
            ) : null}
          </div>
        </header>

        <section className="pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#29528f]/80">Project detail</p>
          <h2 className="mt-2 max-w-[920px] text-[clamp(2rem,4vw,3.55rem)] font-semibold leading-[0.95] tracking-[-0.024em] text-[#163f81]">{selectedProject.title}</h2>
          <p className="mt-3 max-w-[920px] text-[15px] leading-7 text-[#24405f]">{selectedProject.summary}</p>
        </section>

        <figure className="mt-5 overflow-hidden rounded-[16px] border border-[#79c271] bg-[#edf8df] shadow-[0_14px_32px_rgba(58,125,46,0.12)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {selectedProjectMedia && !heroImageFailed ? (
              <>
                <div className="absolute inset-0 z-0" style={{ background: selectedProjectMedia.backdrop ?? "#edf2f7" }} />
                <img
                  src={selectedProjectMedia.src}
                  alt={selectedProjectMedia.alt}
                  className={`relative z-[1] block h-full w-full ${selectedProjectMedia.mode === "cover" ? "object-cover object-center" : "object-contain object-center p-4"}`}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  onError={() => setHeroImageFailed(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 z-[1] flex items-center justify-center px-6 text-center">
                <span className="text-[clamp(1.2rem,2.8vw,2rem)] font-semibold tracking-tight text-[#163f81]">{selectedProject.title}</span>
              </div>
            )}
          </div>
        </figure>

        <section className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)]">
          <div className="space-y-5">
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>Objective</h3>
              <p className={projectBodyClass}>{selectedProject.objective}</p>
            </article>
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>Implementation</h3>
              <p className={projectBodyClass}>{selectedProject.implementation}</p>
            </article>
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>Result</h3>
              <p className={projectBodyClass}>{selectedProject.result}</p>
            </article>
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>What I learned</h3>
              <p className={projectBodyClass}>{selectedProject.learned}</p>
            </article>
          </div>

          <aside className="space-y-5">
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>Technical scope</h3>
              <p className={projectBodyClass}>{selectedProject.technicalScope}</p>
            </article>
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>Environment / tools</h3>
              <p className={projectBodyClass}>{selectedProject.environment}</p>
            </article>
            <article className={projectArticleClass}>
              <h3 className={projectHeadingClass}>Validation / testing</h3>
              <p className={projectBodyClass}>{selectedProject.validation}</p>
            </article>
            {evidenceItems.length > 0 ? (
              <article className={projectArticleClass}>
                <h3 className={projectHeadingClass}>Evidence</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[14px] leading-7 text-[#24405f]">
                  {evidenceItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
          </aside>
        </section>

        <section className="mt-6 rounded-[16px] border border-[#95cf83] bg-[#edf8df]/88 p-4 shadow-[0_10px_24px_rgba(58,125,46,0.08)]">
          <h3 className={projectHeadingClass}>Tech stack</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedProject.stack.map((item) => (
              <span key={item} className="rounded-full border border-[#79c271] bg-[#f8fff0] px-3 py-1 text-[11px] font-semibold text-[#163f81]">
                {item}
              </span>
            ))}
          </div>
        </section>

        {projectLinks.length > 0 ? (
          <section className="mt-5 rounded-[16px] border border-[#95cf83] bg-[#edf8df]/88 p-4 shadow-[0_10px_24px_rgba(58,125,46,0.08)]">
            <h3 className={projectHeadingClass}>Project links</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {projectLinks.map((url, linkIndex) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#79c271] bg-[#f8fff0] px-3 py-1.5 text-[12px] font-semibold text-[#163f81] transition hover:bg-white"
                >
                  {linkIndex === 0 ? "Open live link" : `Reference ${linkIndex + 1}`}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}



export function ContactPanelContent({
  section = "overview",
  preview = false,
}: {
  section?: "overview";
  preview?: boolean;
}) {
  void section;
  const [contactDraft, setContactDraft] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const missingFields = useMemo(
    () => ({
      name: contactDraft.name.trim().length === 0,
      email: contactDraft.email.trim().length === 0,
      message: contactDraft.message.trim().length === 0,
    }),
    [contactDraft],
  );
  const hasMissingFields = missingFields.name || missingFields.email || missingFields.message;

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;
    setSubmitAttempted(true);

    if (hasMissingFields) {
      setSendFeedback({
        kind: "error",
        text: "Please fill in all fields before sending.",
      });
      return;
    }

    const safeName = contactDraft.name.trim();
    const safeEmail = contactDraft.email.trim();
    const safeMessage = contactDraft.message.trim();

    setSendFeedback(null);
    setIsSending(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/roope.aa@hotmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: safeName,
          email: safeEmail,
          message: safeMessage,
          _subject: `Portfolio contact from ${safeName}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Form submit failed");
      }

      setSendFeedback({ kind: "ok", text: "Message sent successfully." });
      setContactDraft({ name: "", email: "", message: "" });
      setSubmitAttempted(false);
    } catch {
      setSendFeedback({
        kind: "error",
        text: "Sending failed. Please try again or email me directly at roope.aa@hotmail.com.",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (preview) {
    return (
      <div className="h-full overflow-hidden rounded-[12px] border border-[#cf8b66] bg-[linear-gradient(180deg,#ef651f_0%,#e65415_100%)] p-1 text-white">
        <div className="relative grid h-full min-h-0 grid-cols-[1.02fr_0.98fr] overflow-hidden rounded-[10px] border border-white/20">
          <section className="relative flex min-h-0 flex-col bg-[linear-gradient(180deg,#ef6a24_0%,#e8591a_100%)] p-3 pb-0">
            <h3 className="relative z-[1] text-[18px] font-extrabold leading-[0.94] tracking-[-0.018em]">
              <span className="block">Let&apos;s build</span>
              <span className="flex items-baseline gap-1.5">
                <span>something</span>
                <span
                  role="img"
                  aria-label="great"
                  className="relative inline-flex h-[0.78em] w-[2.08em] translate-y-[0.08em] align-baseline"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: CONTACT_GREAT_WORD_BACKGROUND }}
                  />
                </span>
              </span>
              <span className="block text-[1em]">together.</span>
            </h3>
            <div className="relative z-[1] mt-1.5 space-y-0.5 text-[9.5px] text-white/96">
              <p>040 528 3008</p>
              <p>roope.aa@hotmail.com</p>
              <p>Vantaa, Hämeenkylä</p>
            </div>
            <div className="relative z-[1] mt-2 min-h-0 flex-1">
              <div className="relative h-full w-[88%] min-h-[120px] border border-[#e3bcc1]/90 bg-[#f2e5ea] p-1">
                <Image
                  src="/portfolio/contact-splash-cup.png"
                  alt="3D splash cup illustration"
                  fill
                  sizes="220px"
                  className="object-contain object-center p-0.5"
                />
              </div>
            </div>
          </section>

          <section className="relative flex min-h-0 flex-col bg-[#e95a1b] p-0">
            <div className="min-h-0 flex-[0_0_82%] bg-[#f3e6eb] p-3">
              <h4 className="text-[20px] font-extrabold leading-[0.98] text-[#8b3f1c]">Fill in your details</h4>
              <div className="mt-2.5 flex flex-col gap-2">
                <div className="rounded-full bg-[#eb5f1f] px-3 py-2 text-[10px] text-[#ffd7c4]">Name</div>
                <div className="rounded-full bg-[#eb5f1f] px-3 py-2 text-[10px] text-[#ffd7c4]">Email</div>
                <div className="min-h-[56px] rounded-[20px] bg-[#eb5f1f] px-3 py-2 text-[10px] text-[#ffd7c4]">Message</div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center justify-items-center gap-1.5 px-2 pb-1.5 pt-1.5">
              <SocialLogoLink href="https://www.linkedin.com/in/roope-aaltonen/" label="LinkedIn" className="!h-10 !w-10 !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
                <LinkedInGlyph />
              </SocialLogoLink>
              <SocialLogoLink href="https://facebook.com/roope_aaltonen" label="Instagram" className="!h-10 !w-10 !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
                <InstagramGlyph />
              </SocialLogoLink>
              <SocialLogoLink href="https://facebook.com/roope.aaltonen.5" label="Facebook" className="!h-10 !w-10 !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
                <FacebookGlyph />
              </SocialLogoLink>
              <SocialLogoLink href="https://github.com/roopeaal" label="GitHub" className="!h-10 !w-10 !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
                <GitHubGlyph />
              </SocialLogoLink>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-none bg-[linear-gradient(180deg,#ef6620_0%,#e85517_100%)] text-[#1f120b]">
      <div className="relative grid h-full min-h-0 gap-0 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
        <section className="relative flex min-h-0 flex-col px-9 pb-0 pt-7 text-white">
            <h2 className="relative z-[2] max-w-[700px] text-[clamp(2rem,4.7vw,4.35rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-white [text-shadow:0_2px_0_rgba(118,48,20,0.22)]">
              <span className="block">Let&apos;s build</span>
              <span className="flex items-baseline gap-4">
                <span>something</span>
                <span
                  role="img"
                  aria-label="great"
                  className="relative inline-flex h-[0.82em] w-[2.18em] translate-y-[0.08em] align-baseline"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: CONTACT_GREAT_WORD_BACKGROUND }}
                  />
                </span>
              </span>
              <span className="block text-[1em]">together.</span>
            </h2>

          <div className="relative z-[2] mt-4 space-y-1 text-[clamp(18px,1.9vw,26px)] font-medium leading-[1.12] text-white/98">
            <a href="tel:+358405283008" className="block w-fit transition hover:text-[#ffe9db]">040 528 3008</a>
            <a href="mailto:roope.aa@hotmail.com" className="block w-fit transition hover:text-[#ffe9db]">roope.aa@hotmail.com</a>
            <p>Vantaa, Hämeenkylä</p>
          </div>

          <div className="relative z-[2] mt-4 flex min-h-0 flex-1 items-end">
            <div className="relative h-full min-h-[320px] w-[88%] overflow-hidden border border-[#ecb8ce]/85 bg-[#f2e3ea]">
              <Image
                src="/portfolio/contact-splash-cup.png"
                alt="3D splash cup"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-contain object-center p-3"
                priority={false}
                draggable={false}
              />
            </div>
          </div>
        </section>

        <aside className="relative flex min-h-0 flex-col pl-0 pr-7 pt-0">
          <div className="relative z-[2] flex min-h-0 flex-[0_0_80%] flex-col bg-[#f3e6eb] px-8 pb-7 pt-7 shadow-[0_14px_28px_rgba(76,28,15,0.1)]">
            <h3 className="text-[clamp(2.05rem,3.7vw,3.25rem)] font-semibold leading-[1.03] text-[#8b3f1c]">Fill in your details</h3>

            <form onSubmit={handleContactSubmit} className="mt-5 flex min-h-0 flex-1 flex-col gap-3.5" autoComplete="off">
              <input
                name="Name"
                type="text"
                placeholder="Name"
                autoComplete="name"
                value={contactDraft.name}
                onChange={(event) => {
                  setContactDraft((prev) => ({ ...prev, name: event.target.value }));
                  setSendFeedback(null);
                }}
                aria-invalid={submitAttempted && missingFields.name}
                className={`w-full rounded-full border bg-[#eb5f1f] px-5 py-3.5 text-[17px] text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] ${
                  submitAttempted && missingFields.name ? "border-[#bb2d2d]" : "border-[#d1652c]"
                }`}
              />
              <input
                name="Email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={contactDraft.email}
                onChange={(event) => {
                  setContactDraft((prev) => ({ ...prev, email: event.target.value }));
                  setSendFeedback(null);
                }}
                aria-invalid={submitAttempted && missingFields.email}
                className={`w-full rounded-full border bg-[#eb5f1f] px-5 py-3.5 text-[17px] text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] ${
                  submitAttempted && missingFields.email ? "border-[#bb2d2d]" : "border-[#d1652c]"
                }`}
              />
              <textarea
                name="Message"
                placeholder="Write your message..."
                autoComplete="off"
                value={contactDraft.message}
                onChange={(event) => {
                  setContactDraft((prev) => ({ ...prev, message: event.target.value }));
                  setSendFeedback(null);
                }}
                aria-invalid={submitAttempted && missingFields.message}
                className={`min-h-[180px] flex-1 rounded-[34px] border bg-[#eb5f1f] px-5 py-4 text-[17px] leading-7 text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] ${
                  submitAttempted && missingFields.message ? "border-[#bb2d2d]" : "border-[#d1652c]"
                }`}
              />

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center justify-center rounded-full border border-[#1a6e62] bg-[#1e6d63] px-8 py-2.5 text-[17px] font-semibold text-white transition hover:bg-[#248073]"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
                {sendFeedback ? (
                  <p className={`mt-2 text-[12px] ${sendFeedback.kind === "ok" ? "text-[#2e7f3f]" : "text-[#bf3e3e]"}`}>
                    {sendFeedback.text}
                  </p>
                ) : null}
              </div>
            </form>
          </div>

          <div className="relative z-[2] grid w-full grid-cols-4 items-center justify-items-center gap-2 px-8 pb-5 pt-2">
            <SocialLogoLink href="https://www.linkedin.com/in/roope-aaltonen/" label="LinkedIn" className="!h-[clamp(72px,7.6vw,126px)] !w-[clamp(72px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <LinkedInGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://facebook.com/roope_aaltonen" label="Instagram" className="!h-[clamp(72px,7.6vw,126px)] !w-[clamp(72px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <InstagramGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://facebook.com/roope.aaltonen.5" label="Facebook" className="!h-[clamp(72px,7.6vw,126px)] !w-[clamp(72px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <FacebookGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://github.com/roopeaal" label="GitHub" className="!h-[clamp(72px,7.6vw,126px)] !w-[clamp(72px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <GitHubGlyph />
            </SocialLogoLink>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SocialLogoLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={`group inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b8cde6] bg-white transition hover:-translate-y-[1px] hover:border-[#7ea3cc] hover:shadow-[0_8px_16px_rgba(28,76,130,0.16)] ${className ?? ""}`}
    >
      <span className="h-[62%] w-[62%]">{children}</span>
    </a>
  );
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.1" fill="#0A66C2" />
      <rect x="7.1" y="10.1" width="2.3" height="6.8" rx="1.15" fill="#FFFFFF" />
      <circle cx="8.25" cy="7.9" r="1.35" fill="#FFFFFF" />
      <path
        d="M11.1 10.1H13.3V11.1C13.77 10.48 14.51 10.04 15.53 10.04C17.37 10.04 18.35 11.15 18.35 13.36V16.9H16.02V13.83C16.02 12.83 15.66 12.22 14.83 12.22C13.92 12.22 13.43 12.83 13.43 13.83V16.9H11.1V10.1Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="igGradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9CE34" />
          <stop offset="38%" stopColor="#EE2A7B" />
          <stop offset="68%" stopColor="#6228D7" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" fill="url(#igGradient)" />
      <rect x="7" y="7" width="10" height="10" rx="3.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.55" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="16.65" cy="7.6" r="1.05" fill="#FFFFFF" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="#1877F2" />
      <path
        d="M13.39 19.9V12.7H15.72L16.07 10H13.39V8.3C13.39 7.52 13.6 6.99 14.78 6.99H16.16V4.55C15.49 4.49 14.81 4.44 14.13 4.45C11.69 4.45 10.33 5.94 10.33 8.64V10H7.88V12.7H10.33V19.9H13.39Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="#111827" />
      <path
        d="M12 6.45C8.83 6.45 6.25 9.07 6.25 12.3C6.25 14.88 7.88 17.06 10.16 17.83C10.46 17.89 10.56 17.7 10.56 17.54V16.58C8.92 16.94 8.58 15.86 8.58 15.86C8.31 15.16 7.93 14.98 7.93 14.98C7.39 14.61 7.97 14.62 7.97 14.62C8.57 14.66 8.89 15.25 8.89 15.25C9.43 16.2 10.31 15.92 10.59 15.75C10.64 15.35 10.8 15.09 10.98 14.93C9.67 14.78 8.29 14.26 8.29 12.01C8.29 11.37 8.52 10.84 8.9 10.41C8.84 10.25 8.65 9.61 8.96 8.75C8.96 8.75 9.47 8.58 10.56 9.31C11.05 9.17 11.56 9.1 12.07 9.09C12.58 9.1 13.09 9.17 13.58 9.31C14.67 8.58 15.18 8.75 15.18 8.75C15.49 9.61 15.3 10.25 15.24 10.41C15.62 10.84 15.85 11.37 15.85 12.01C15.85 14.27 14.46 14.78 13.14 14.93C13.37 15.13 13.57 15.52 13.57 16.11V17.54C13.57 17.7 13.67 17.9 13.97 17.83C16.24 17.05 17.86 14.88 17.86 12.3C17.86 9.07 15.29 6.45 12 6.45Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}


function SimpleTile({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="rounded border border-[#dcdcdc] bg-white px-3 py-2 text-[#111827]">
      {title ? <p className="text-[12px] uppercase tracking-[0.12em] text-[#8b96a8]">{title}</p> : null}
      <div className={title ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-[#d9e1eb] bg-[#f7fafc] px-3 py-1 text-[11px] text-[#677489]">{children}</span>;
}

function ActionLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center rounded border border-[#d9e1eb] bg-white px-3 py-2 text-[13px] font-medium text-[#334155] transition hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded border border-[#d9e1eb] bg-white px-3 py-2 text-[13px] font-medium text-[#334155] transition hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
    >
      {children}
    </Link>
  );
}
