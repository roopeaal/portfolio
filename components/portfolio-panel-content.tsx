"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
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

const INSTAGRAM_URL = "https://www.instagram.com/roope_aaltonen";

export function HomePanelContent() {
  return (
    <div className="h-full overflow-auto bg-[#f5f7fb] p-3 sm:p-4 md:p-5 xl:p-6">
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-[24px] border border-[#d6deea] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[#e5ebf3] bg-[linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)] px-6 py-4 text-[12px] text-[#667085]">
          {profile.linkedinLabel}
        </div>

        <div className="grid gap-5 p-4 md:grid-cols-[170px_minmax(0,1fr)] md:items-start lg:grid-cols-[190px_minmax(0,1fr)] lg:p-6 xl:grid-cols-[220px_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[180px] md:mx-0 xl:max-w-[220px]">
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
  const portraitSrc = "/about-vintage-roope.png";
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
            backgroundImage: "url('/about-vintage-wallpaper-v17.png')",
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
          backgroundImage: "url('/about-vintage-wallpaper-v17.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      <div className="relative z-[1] h-full overflow-x-hidden overflow-y-auto lg:overflow-hidden">
        <div className="flex min-h-full flex-col px-4 py-4 md:px-6 md:py-5 lg:h-full lg:min-h-0">
          <header className="text-center">
            <p className="mx-auto max-w-[calc(100vw-3rem)] break-words text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c6d1df] sm:max-w-full sm:text-[10px] sm:tracking-[0.28em] md:text-[11px] md:tracking-[0.34em]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              <span className="block">{heroLineTop}</span>
              <span className="mt-1 block">{heroLineBottom}</span>
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#72829b]/40" />
              <span className="text-[16px] text-[#b7c4d7]">❦</span>
              <div className="h-px flex-1 bg-[#72829b]/40" />
            </div>
          </header>

          <div className="mt-4 grid flex-1 items-start gap-5 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(260px,400px)_minmax(0,1fr)] lg:items-center">
            <section
              className="mx-auto w-full max-w-[calc(100vw-3rem)] break-words px-2 text-left text-[13px] leading-7 text-[#d7e0eb] sm:max-w-[680px] lg:max-w-[360px] lg:px-4 lg:text-center lg:leading-8"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 1px 0 rgba(0,0,0,0.28)" }}
            >
              {leftCopy}
            </section>

            <figure className="flex min-h-[300px] flex-col items-center justify-center lg:h-full lg:min-h-0">
              <div className="relative h-[320px] w-full max-w-[360px] overflow-hidden lg:h-auto lg:min-h-0 lg:max-w-[400px] lg:flex-1">
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
              className="mx-auto w-full max-w-[calc(100vw-3rem)] break-words px-2 text-left text-[13px] leading-7 text-[#d7e0eb] sm:max-w-[680px] lg:max-w-[360px] lg:px-4 lg:text-center lg:leading-8"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 1px 0 rgba(0,0,0,0.28)" }}
            >
              {rightCopy}
            </section>
          </div>
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
    src: "/portfolio/project-iot-security-lab.png",
    alt: "Cisco Modeling Labs PwnHub lab demonstration screenshot",
    mode: "cover",
    backdrop: "#050505",
  },
  "portfolio-site": {
    src: "/portfolio/project-portfolio-site.png",
    alt: "Interactive network topology portfolio homepage screenshot",
    mode: "cover",
    backdrop: "#f8fafc",
  },
  "aircraft-game-python-react": {
    src: "/portfolio/project-maanarvauspeli.png",
    alt: "Kristoffer Kolumbuksen jaljilla - maanarvauspeli screenshot",
    mode: "cover",
    backdrop: "#f2ebdb",
  },
  "heart-rate-monitor": {
    src: "/portfolio/project-pulsemaster-hw.jpeg",
    alt: "PulseMaster hardware setup with Raspberry Pi Pico and pulse sensor",
    mode: "cover",
    backdrop: "#1f2429",
  },
  "metropolia-login-ui": {
    src: "/portfolio/project-metropolia-login-demo.png",
    alt: "Phishing awareness login demo screenshot",
    mode: "cover",
    backdrop: "#eceff4",
  },
};

export const PROJECTS_OVERVIEW_HREF = "/?panel=projects";

export function getProjectHref(slug: string) {
  return `${PROJECTS_OVERVIEW_HREF}&project=${encodeURIComponent(slug)}`;
}

function extractUrls(text: string): string[] {
  return Array.from(text.matchAll(/https?:\/\/\S+/gi)).map((match) => match[0].replace(/[),.;]+$/, ""));
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((item) => item.trim())
    .filter(Boolean);
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
  const [failedMediaSrc, setFailedMediaSrc] = useState<string | null>(null);
  const mediaFailed = Boolean(media?.src && failedMediaSrc === media.src);
  const mediaShapeClass = size === "compact" ? "aspect-[16/10]" : "aspect-[16/10]";

  return (
    <Link
      href={getProjectHref(project.slug)}
      scroll={false}
      onClick={(event) => {
        if (!onSelectProject) return;
        event.preventDefault();
        onSelectProject(project.slug);
      }}
      className="group block w-full rounded-[10px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d7f35] focus-visible:ring-offset-2"
      aria-label={`Open project: ${project.title}`}
    >
      <article className="overflow-hidden rounded-[12px] border border-[#79c271] bg-[#edf8df] transition duration-200 group-hover:border-[#4f9b47]">
        <div className={`relative overflow-hidden ${mediaShapeClass}`}>
          {media && !mediaFailed ? (
            <>
              <div className="absolute inset-0 z-0" style={{ background: media.backdrop ?? "#edf6df" }} />
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes={size === "compact" ? "220px" : "(max-width: 1024px) 78vw, 420px"}
                className={`relative z-[1] opacity-100 transition duration-300 group-hover:scale-[1.02] ${media.mode === "cover" ? "object-cover object-center" : "object-contain object-center p-1"}`}
                draggable={false}
                loading="lazy"
                onError={() => {
                  if (media?.src) setFailedMediaSrc(media.src);
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[#e8f5d9] px-6 text-center">
              <span
                className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-semibold leading-[1.2] tracking-[0.01em] text-[#2a5b2b]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {project.shortTitle ?? project.title}
              </span>
            </div>
          )}
          {size === "overview" ? (
            <div className="pointer-events-none absolute bottom-2 left-2 z-[2] flex max-w-[calc(100%-1rem)] translate-y-1 items-center gap-2 rounded-[11px] border border-[#79c271] bg-[#edf8df]/96 px-3 py-2 opacity-0 shadow-[0_8px_18px_rgba(58,125,46,0.18)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <span className="h-7 w-1 shrink-0 rounded-full bg-[#58b94f]" />
              <span className="min-w-0 text-[#163f81]">
                <span className="block text-[8px] font-semibold uppercase tracking-[0.2em] text-[#29528f]/75">Project</span>
                <span className="block truncate text-[12px] font-semibold leading-tight">{project.shortTitle ?? project.title}</span>
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
  direction: "up" | "down" | "left" | "right";
  onSelectProject?: (slug: string) => void;
}) {
  const laneRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const isHorizontal = direction === "left" || direction === "right";

  useEffect(() => {
    const lane = laneRef.current;
    const segment = segmentRef.current;
    if (!lane || !segment || items.length === 0) return;

    let segmentSize = 0;
    let rafId = 0;
    let previousTime = 0;
    const speedPxPerSecond = isHorizontal ? 16 : 20;

    const normalizeScrollPosition = () => {
      if (segmentSize <= 0) return;
      const min = segmentSize * 0.5;
      const max = segmentSize * 1.5;
      const wrapPosition = (value: number) => {
        if (value >= min && value <= max) return value;
        return min + ((((value - min) % segmentSize) + segmentSize) % segmentSize);
      };

      if (isHorizontal) {
        lane.scrollLeft = wrapPosition(lane.scrollLeft);
        return;
      }

      lane.scrollTop = wrapPosition(lane.scrollTop);
    };

    const setBaseline = () => {
      segmentSize = isHorizontal ? segment.scrollWidth : segment.scrollHeight;
      if (segmentSize > 0) {
        if (isHorizontal) {
          lane.scrollLeft = segmentSize;
        } else {
          lane.scrollTop = segmentSize;
        }
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

      if (segmentSize > 0 && !isPausedRef.current && document.visibilityState === "visible") {
        const delta =
          (direction === "up" || direction === "left" ? -1 : 1) *
          speedPxPerSecond *
          deltaTime;
        if (isHorizontal) {
          lane.scrollLeft += delta;
        } else {
          lane.scrollTop += delta;
        }
        normalizeScrollPosition();
      }

      rafId = window.requestAnimationFrame(loop);
    };

    if (!prefersReducedMotion) {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      lane.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [direction, isHorizontal, items, prefersReducedMotion]);

  const segmentClassName = isHorizontal ? "flex h-full w-max items-center gap-4 pr-4" : "space-y-5 pb-5";
  const cardWrapClassName = isHorizontal ? "w-[min(78vw,360px)] shrink-0" : "";
  const renderSegment = (segmentName: string, hidden = false) => (
    <div ref={hidden ? undefined : segmentRef} aria-hidden={hidden || undefined} className={segmentClassName}>
      {items.map((project) => (
        <div key={`${project.slug}-${segmentName}`} className={cardWrapClassName}>
          <ProjectMarqueeCard project={project} onSelectProject={onSelectProject} />
        </div>
      ))}
    </div>
  );

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
        className={`h-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isHorizontal ? "overflow-x-auto overflow-y-hidden" : "overflow-y-auto overflow-x-hidden"
        }`}
      >
        {isHorizontal ? (
          <div className="flex h-full w-max items-center">
            {renderSegment("segment-a")}
            {renderSegment("segment-b", true)}
            {renderSegment("segment-c", true)}
          </div>
        ) : (
          <>
            {renderSegment("segment-a")}
            {renderSegment("segment-b", true)}
            {renderSegment("segment-c", true)}
          </>
        )}
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
  const mobileSecondLaneProjects = useMemo(
    () => [...rightLaneProjects, ...leftLaneProjects],
    [leftLaneProjects, rightLaneProjects],
  );
  const [failedHeroImageSrc, setFailedHeroImageSrc] = useState<string | null>(null);

  if (preview) {
    return (
      <div className="h-full overflow-hidden rounded-[12px] border border-[#bcd7a8] bg-[linear-gradient(180deg,#dff2ce_0%,#d4ecbf_100%)] p-3 text-[#16345e]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#35587d]">Discover</p>
        <h3 className="mt-1 text-[18px] font-semibold leading-[1.04] text-[#16345e]">Projects I have built</h3>
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
      <div className="h-full w-full overflow-y-auto bg-[linear-gradient(180deg,#d6edc3_0%,#cbe7b1_100%)] p-0 text-[#1d3658] lg:overflow-hidden">
        <div className="grid min-h-full gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(230px,0.58fr)_minmax(0,1.42fr)] xl:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
          <section className="flex items-center px-5 py-7 md:px-7 lg:min-h-0 lg:py-8 xl:px-8">
            <div className="relative max-w-[390px] border-l-[5px] border-[#63bd58] pl-4 md:pl-5 lg:max-w-[340px] xl:max-w-[390px]">
              <div aria-hidden="true" className="absolute -top-3 left-4 h-1.5 w-10 rounded-full bg-[#83cf73]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-[#2e6d55]">Selected work</p>
              <h2 className="mt-5 text-[clamp(3rem,7.4vw,5.5rem)] font-black leading-[0.82] tracking-[-0.055em] text-[#123f82]">
                Projects
              </h2>
              <p className="mt-5 max-w-[26ch] border-y border-[#9fd28e]/70 py-3 text-[clamp(1.05rem,2.25vw,1.45rem)] font-bold leading-[1.17] tracking-[-0.02em] text-[#123f82]">
                Network labs, web interfaces and IoT systems.
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.34em] text-[#4f7fa7]">Built, tested, documented</p>
            </div>
          </section>

          <section className="grid min-h-[520px] gap-4 overflow-hidden px-4 pb-5 md:px-5 lg:h-full lg:min-h-0 lg:grid-cols-2 lg:gap-5 lg:py-0">
            <div className="h-[240px] lg:hidden">
              <ProjectMarqueeLane items={overviewProjectOrder} direction="left" onSelectProject={onSelectProject} />
            </div>
            <div className="h-[240px] lg:hidden">
              <ProjectMarqueeLane items={mobileSecondLaneProjects} direction="right" onSelectProject={onSelectProject} />
            </div>
            <div className="hidden h-full min-h-0 lg:block">
              <ProjectMarqueeLane items={leftLaneProjects} direction="up" onSelectProject={onSelectProject} />
            </div>
            <div className="hidden h-full min-h-0 lg:block">
              <ProjectMarqueeLane items={rightLaneProjects} direction="down" onSelectProject={onSelectProject} />
            </div>
          </section>
        </div>
      </div>
    );
  }

  const selectedProjectMedia = PROJECT_CARD_MEDIA[selectedProject.slug];
  const heroImageFailed = Boolean(selectedProjectMedia?.src && failedHeroImageSrc === selectedProjectMedia.src);
  const overviewParagraphs = selectedProject.overview?.length ? selectedProject.overview : [selectedProject.objective];
  const resultParagraphs = splitParagraphs(selectedProject.result);
  const whatIDidItems = selectedProject.whatIDid?.length ? selectedProject.whatIDid : [selectedProject.implementation];
  const technicalHighlightItems = selectedProject.technicalHighlights?.length
    ? selectedProject.technicalHighlights
    : [selectedProject.technicalScope, selectedProject.environment, selectedProject.validation];
  const skillsItems = selectedProject.skillsDemonstrated?.length ? selectedProject.skillsDemonstrated : [selectedProject.learned];
  const employerPointItems = selectedProject.employerPoints ?? [];
  const projectNotes = selectedProject.evidence.filter((item) => extractUrls(item).length === 0);
  const projectLinks = Array.from(new Set(selectedProject.evidence.flatMap(extractUrls)));
  const projectSectionClass = "border-t border-[#c7dda7] pt-5";
  const projectHeadingClass = "text-[13px] font-semibold uppercase tracking-[0.18em] text-[#244a73]";
  const projectParagraphClass = "mt-3 max-w-[calc(100vw-3.5rem)] break-words text-[15px] leading-7 text-[#1f334a] md:max-w-[76ch]";
  const projectListClass = "mt-3 max-w-[calc(100vw-3.5rem)] space-y-2.5 break-words text-[15px] leading-7 text-[#1f334a] md:max-w-none";
  const projectChipClass = "rounded-full border border-[#b7d79b] bg-[#f8fff0] px-3 py-1.5 text-[12px] font-medium text-[#244a73]";

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#f5faed] text-[#1f334a]">
      <article className="mx-auto w-full max-w-[min(920px,calc(100vw-1rem))] overflow-hidden px-5 py-6 md:px-8 md:py-8">
        <header>
          <h2 className="max-w-[calc(100vw-3.5rem)] break-words text-[clamp(1.45rem,7.8vw,3.45rem)] font-semibold leading-[0.98] tracking-[-0.028em] text-[#173b72] [overflow-wrap:anywhere] md:max-w-[820px] md:text-[clamp(2rem,4.2vw,3.45rem)]">
            {selectedProject.title}
          </h2>
          <p className="mt-4 max-w-[calc(100vw-3.5rem)] break-words text-[16px] leading-7 text-[#24405f] md:max-w-[76ch] md:text-[17px] md:leading-8">{selectedProject.summary}</p>
        </header>

        <figure className="mt-6 max-w-[calc(100vw-3.5rem)] overflow-hidden rounded-[14px] border border-[#a5ca86] bg-[#edf8df] md:max-w-none">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {selectedProjectMedia && !heroImageFailed ? (
              <>
                <div className="absolute inset-0 z-0" style={{ background: selectedProjectMedia.backdrop ?? "#edf2f7" }} />
                <Image
                  src={selectedProjectMedia.src}
                  alt={selectedProjectMedia.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 920px"
                  className={`relative z-[1] ${selectedProjectMedia.mode === "cover" ? "object-cover object-center" : "object-contain object-center p-4"}`}
                  draggable={false}
                  priority
                  onError={() => {
                    if (selectedProjectMedia?.src) setFailedHeroImageSrc(selectedProjectMedia.src);
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 z-[1] flex items-center justify-center px-6 text-center">
                <span className="text-[clamp(1.2rem,2.8vw,2rem)] font-semibold tracking-tight text-[#163f81]">{selectedProject.title}</span>
              </div>
            )}
          </div>
        </figure>

        <section className={`${projectSectionClass} mt-7`}>
          <h3 className={projectHeadingClass}>Overview</h3>
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph} className={projectParagraphClass}>{paragraph}</p>
          ))}
        </section>

        <section className="mt-7 grid gap-7 border-t border-[#c7dda7] pt-5 lg:grid-cols-2">
          <div>
            <h3 className={projectHeadingClass}>What I did</h3>
            <ul className={projectListClass}>
              {whatIDidItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5faa51]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={projectHeadingClass}>Technical highlights</h3>
            <ul className={projectListClass}>
              {technicalHighlightItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5faa51]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`${projectSectionClass} mt-7`}>
          <h3 className={projectHeadingClass}>Result</h3>
          {resultParagraphs.map((paragraph) => (
            <p key={paragraph} className={projectParagraphClass}>{paragraph}</p>
          ))}
        </section>

        <section className="mt-7 grid gap-7 border-t border-[#c7dda7] pt-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <h3 className={projectHeadingClass}>Skills demonstrated</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skillsItems.map((item) => (
                <span key={item} className={projectChipClass}>{item}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className={projectHeadingClass}>Tech stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProject.stack.map((item) => (
                <span key={item} className={projectChipClass}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {employerPointItems.length > 0 ? (
          <section className={`${projectSectionClass} mt-7`}>
            <h3 className={projectHeadingClass}>Employer-facing points</h3>
            <ol className={projectListClass}>
              {employerPointItems.map((item, itemIndex) => (
                <li key={item} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-semibold text-[#5faa51]">{itemIndex + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {projectNotes.length > 0 ? (
          <section className={`${projectSectionClass} mt-7`}>
            <h3 className={projectHeadingClass}>Notes</h3>
            <ul className={projectListClass}>
              {projectNotes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5faa51]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {projectLinks.length > 0 ? (
          <section className={`${projectSectionClass} mt-7`}>
            <h3 className={projectHeadingClass}>Relevant links</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {projectLinks.map((url, linkIndex) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#9cc47a] bg-[#f8fff0] px-3 py-1.5 text-[12px] font-semibold text-[#173b72] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d7f35]"
                >
                  {url.includes("onrender.com") ? "Open live demo" : linkIndex === 0 ? "Open source" : `Reference ${linkIndex + 1}`}
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
                <span>great</span>
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
                  src="/contact-splash-cup.png"
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
              <SocialLogoLink href={INSTAGRAM_URL} label="Instagram" className="!h-10 !w-10 !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
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
    <div className="h-full w-full overflow-y-auto rounded-none bg-[linear-gradient(180deg,#ef6620_0%,#e85517_100%)] text-[#1f120b] lg:overflow-hidden">
      <div className="relative grid min-h-full gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
        <section className="relative flex min-h-0 flex-col px-5 pb-0 pt-6 text-white sm:px-7 lg:min-h-0 lg:px-9 lg:pt-7">
          <h2 className="relative z-[2] w-full max-w-none text-[clamp(2.45rem,14vw,4rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-white [text-shadow:0_2px_0_rgba(118,48,20,0.22)] lg:max-w-[700px] lg:text-[clamp(2rem,4.7vw,4.35rem)]">
            <span className="block">Let&apos;s build</span>
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-0">
              <span>something</span>
              <span>great</span>
            </span>
            <span className="block text-[1em]">together.</span>
          </h2>

          <div className="relative z-[2] mt-4 space-y-1 text-[clamp(18px,1.9vw,26px)] font-medium leading-[1.12] text-white/98">
            <a href="tel:+358405283008" className="block w-fit transition hover:text-[#ffe9db]">040 528 3008</a>
            <a href="mailto:roope.aa@hotmail.com" className="block w-fit transition hover:text-[#ffe9db]">roope.aa@hotmail.com</a>
            <p>Vantaa, Hämeenkylä</p>
          </div>

          <div className="relative z-[2] mt-5 flex min-h-0 flex-none items-end lg:mt-4 lg:min-h-0 lg:flex-1">
            <div className="relative h-[320px] w-full overflow-hidden border border-b-0 border-[#ecb8ce]/85 bg-[#f3e6eb] sm:h-[380px] lg:h-full lg:min-h-[320px] lg:w-[88%] lg:border-b lg:bg-[#f2e3ea]">
              <Image
                src="/contact-splash-cup.png"
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

        <aside className="relative -mt-px flex min-h-0 flex-col px-5 pb-6 pt-0 sm:px-7 lg:mt-0 lg:min-h-0 lg:pl-0 lg:pr-7">
          <div className="relative z-[2] flex min-h-0 w-full flex-col border border-t-0 border-[#ecb8ce]/85 bg-[#f3e6eb] px-5 pb-7 pt-7 shadow-[0_14px_28px_rgba(76,28,15,0.1)] sm:px-8 lg:min-h-0 lg:flex-[0_0_80%] lg:border-0">
            <h3 className="max-w-full text-[clamp(2.05rem,9.5vw,3.25rem)] font-semibold leading-[1.03] text-[#8b3f1c]">Fill in your details</h3>

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
                className={`min-w-0 w-full rounded-full border bg-[#eb5f1f] px-5 py-3.5 text-[16px] text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] sm:text-[17px] ${
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
                className={`min-w-0 w-full rounded-full border bg-[#eb5f1f] px-5 py-3.5 text-[16px] text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] sm:text-[17px] ${
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
                className={`min-h-[168px] w-full min-w-0 flex-1 resize-y rounded-[28px] border bg-[#eb5f1f] px-5 py-4 text-[16px] leading-7 text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] sm:min-h-[180px] sm:rounded-[34px] sm:text-[17px] lg:resize-none ${
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

          <div className="relative z-[2] grid w-full grid-cols-4 items-center justify-items-center gap-2 px-3 pb-5 pt-3 sm:px-8 lg:pt-2">
            <SocialLogoLink href="https://www.linkedin.com/in/roope-aaltonen/" label="LinkedIn" className="!h-[clamp(54px,7.6vw,126px)] !w-[clamp(54px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <LinkedInGlyph />
            </SocialLogoLink>
            <SocialLogoLink href={INSTAGRAM_URL} label="Instagram" className="!h-[clamp(54px,7.6vw,126px)] !w-[clamp(54px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <InstagramGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://facebook.com/roope.aaltonen.5" label="Facebook" className="!h-[clamp(54px,7.6vw,126px)] !w-[clamp(54px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <FacebookGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://github.com/roopeaal" label="GitHub" className="!h-[clamp(54px,7.6vw,126px)] !w-[clamp(54px,7.6vw,126px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
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
