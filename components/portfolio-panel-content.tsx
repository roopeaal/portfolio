"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent as ReactMouseEvent } from "react";
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

type CertificationAward = {
  title: string;
  issuer: "Cisco Networking Academy" | "AWS Academy" | "Red Hat Academy";
  issued: string;
  badgeSrc: string;
  certificateHref: string;
  kind: "medal" | "trophy" | "plaque";
};

const CERTIFICATION_AWARDS: CertificationAward[] = [
  {
    title: "CCNA: Switching, Routing & Wireless Essentials",
    issuer: "Cisco Networking Academy",
    issued: "November 2024",
    badgeSrc: "/certifications/badges/cisco-ccna-srwe.png",
    certificateHref: "/certifications/certificates/cisco-ccna-srwe.pdf",
    kind: "medal",
  },
  {
    title: "AWS Cloud Architecting",
    issuer: "AWS Academy",
    issued: "October 2025",
    badgeSrc: "/certifications/badges/aws-cloud-architecting.png",
    certificateHref: "/certifications/certificates/aws-cloud-architecting.pdf",
    kind: "trophy",
  },
  {
    title: "CCNA: Enterprise Networking, Security & Automation",
    issuer: "Cisco Networking Academy",
    issued: "May 2025",
    badgeSrc: "/certifications/badges/cisco-ccna-ensa.png",
    certificateHref: "/certifications/certificates/cisco-ccna-ensa.pdf",
    kind: "medal",
  },
  {
    title: "CyberOps Associate",
    issuer: "Cisco Networking Academy",
    issued: "May 2025",
    badgeSrc: "/certifications/badges/cisco-cyberops-associate.png",
    certificateHref: "/certifications/certificates/cisco-cyberops-associate.pdf",
    kind: "medal",
  },
  {
    title: "Red Hat System Administration I",
    issuer: "Red Hat Academy",
    issued: "August 2025",
    badgeSrc: "/certifications/badges/red-hat-system-administration-i.png",
    certificateHref: "/certifications/certificates/red-hat-system-administration-i.pdf",
    kind: "plaque",
  },
  {
    title: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    issued: "January 2026",
    badgeSrc: "/certifications/badges/cisco-ethical-hacker.png",
    certificateHref: "/certifications/certificates/cisco-ethical-hacker.pdf",
    kind: "medal",
  },
  {
    title: "Red Hat OpenShift Development I",
    issuer: "Red Hat Academy",
    issued: "August 2025",
    badgeSrc: "/certifications/badges/red-hat-openshift-development-i.png",
    certificateHref: "/certifications/certificates/red-hat-openshift-development-i.pdf",
    kind: "plaque",
  },
  {
    title: "Red Hat OpenShift Administration I",
    issuer: "Red Hat Academy",
    issued: "September 2025",
    badgeSrc: "/certifications/badges/red-hat-openshift-administration-i.png",
    certificateHref: "/certifications/certificates/red-hat-openshift-administration-i.pdf",
    kind: "plaque",
  },
  {
    title: "Red Hat System Administration II",
    issuer: "Red Hat Academy",
    issued: "December 2025",
    badgeSrc: "/certifications/badges/red-hat-system-administration-ii.png",
    certificateHref: "/certifications/certificates/red-hat-system-administration-ii.pdf",
    kind: "plaque",
  },
];

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

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
  section?: "profile" | "direction" | "studies" | "reliability" | "awards";
  preview?: boolean;
}) {
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

  if (section === "awards") {
    return <AwardsCabinet />;
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

function AwardsCabinet() {
  return (
    <div
      className="relative h-full overflow-x-hidden overflow-y-auto bg-[#d8d2c5] text-[#f7ead0]"
      style={{
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.08))",
          "repeating-linear-gradient(90deg,rgba(92,82,67,0.035) 0 1px,transparent 1px 8px)",
          "linear-gradient(135deg,#ded9cf,#c8c0b3)",
        ].join(","),
      }}
    >
      <div className="relative z-[1] mx-auto flex min-h-full max-w-[1480px] items-end gap-3 overflow-hidden px-2 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-6 lg:px-7">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[210px] border-t-2 border-[#a79b89] bg-[#b9aa94]"
          style={{
            backgroundImage: [
              "linear-gradient(180deg,rgba(255,255,255,0.38),rgba(83,57,34,0.08))",
              "repeating-linear-gradient(90deg,rgba(92,62,38,0.12) 0 1px,transparent 1px 112px)",
              "repeating-linear-gradient(0deg,rgba(255,255,255,0.09) 0 2px,transparent 2px 9px)",
            ].join(","),
            boxShadow: "inset 0 8px 16px rgba(74,55,38,0.12)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-[2] min-w-0 flex-1 pb-[28px]">
          <div className="absolute inset-x-[3%] bottom-[4px] top-[18px] rounded-[12px] bg-[#261209] shadow-[18px_20px_30px_rgba(45,28,17,0.32)]" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[8px] border-[10px] border-[#4a2917] bg-[#180d08] shadow-[inset_5px_0_0_#8b552b,inset_-5px_0_0_#291309,inset_0_5px_0_#a56a36,inset_0_-6px_0_#241108,inset_0_0_0_7px_#25140b,0_22px_55px_rgba(0,0,0,0.45)] sm:border-[15px]">
            <div className="pointer-events-none absolute inset-0 z-[20] bg-[linear-gradient(111deg,rgba(255,255,255,0.09)_0%,transparent_16%,transparent_47%,rgba(255,255,255,0.035)_58%,transparent_78%)]" />
            <div className="pointer-events-none absolute inset-x-[13px] top-[12px] z-[19] h-[18px] bg-[linear-gradient(180deg,rgba(255,224,168,0.18),rgba(30,12,5,0.72))] [clip-path:polygon(0_0,100%_0,98.5%_100%,1.5%_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[18] w-[12px] bg-[linear-gradient(90deg,#2a150b,#784522,#30180d)] shadow-[5px_0_12px_rgba(0,0,0,0.55)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[18] w-[12px] bg-[linear-gradient(90deg,#30180d,#784522,#2a150b)] shadow-[-5px_0_12px_rgba(0,0,0,0.55)]" />

            <header className="relative border-b-[12px] border-[#4b2916] bg-[radial-gradient(circle_at_50%_0%,#55331d_0%,#25130b_72%)] px-4 pb-5 pt-7 text-center shadow-[inset_0_-2px_#b27b3e,0_8px_16px_rgba(0,0,0,0.55)]">
              <div className="mx-auto w-fit rounded-[4px] border border-[#d1aa62]/60 bg-[linear-gradient(180deg,#6c431e,#2a170d)] px-7 py-2 shadow-[inset_0_1px_rgba(255,255,255,0.1),0_5px_12px_rgba(0,0,0,0.5)]">
                <h2
                  className="text-[clamp(1.65rem,4vw,3.2rem)] font-semibold leading-none tracking-[-0.03em] text-[#fff1d1]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 2px 8px rgba(0,0,0,0.65)" }}
                >
                  Awards Cabinet
                </h2>
              </div>
            </header>

            <div className="relative bg-[linear-gradient(90deg,#211109_0%,#321b0f_5%,#211109_50%,#321b0f_95%,#211109_100%)] px-3 sm:px-6">
              <CabinetShelves columns={3} className="hidden xl:block" />
              <CabinetShelves columns={2} className="hidden sm:block xl:hidden" />
              <CabinetShelves columns={1} className="sm:hidden" />
            </div>
          </div>
          <div className="absolute inset-x-[5%] bottom-[13px] h-[18px] rounded-b-[10px] border border-[#3b2012] bg-[linear-gradient(180deg,#70401f,#32190d)] shadow-[0_9px_14px_rgba(0,0,0,0.35)]" />
          <div className="absolute bottom-0 left-[8%] h-[18px] w-[42px] rounded-b bg-[#32190d]" />
          <div className="absolute bottom-0 right-[8%] h-[18px] w-[42px] rounded-b bg-[#32190d]" />
        </div>
        <CabinetPlant />
      </div>
    </div>
  );
}

function CabinetShelves({ columns, className }: { columns: 1 | 2 | 3; className: string }) {
  const rows = Array.from({ length: Math.ceil(CERTIFICATION_AWARDS.length / columns) }, (_, index) =>
    CERTIFICATION_AWARDS.slice(index * columns, index * columns + columns),
  );

  return (
    <div className={className}>
      {rows.map((row, rowIndex) => (
        <div
          key={`${columns}-column-row-${rowIndex}`}
          className="relative grid gap-2 pb-[35px] pt-4 sm:gap-4 lg:gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {row.map((award) => {
            const awardIndex = CERTIFICATION_AWARDS.indexOf(award);
            return <CertificationDisplay key={award.title} award={award} awardIndex={awardIndex} />;
          })}
          <CabinetShelf />
        </div>
      ))}
    </div>
  );
}

function CabinetShelf() {
  return (
    <div className="pointer-events-none absolute inset-x-[-18px] bottom-0 z-[10] h-[35px] sm:inset-x-[-30px]">
      <div className="absolute inset-x-0 top-0 h-[10px] bg-[linear-gradient(180deg,#d39a55_0%,#75411f_44%,#3c2011_100%)] shadow-[0_-1px_#e3b778,0_8px_14px_rgba(0,0,0,0.72)]" />
      <div className="absolute inset-x-[1px] top-[8px] h-[23px] origin-top bg-[repeating-linear-gradient(91deg,#60361d_0_8px,#704022_8px_15px,#4b2917_15px_23px)] shadow-[inset_0_2px_rgba(255,255,255,0.08),inset_0_-4px_rgba(0,0,0,0.55),0_8px_12px_rgba(0,0,0,0.5)] [clip-path:polygon(0_0,100%_0,98.8%_100%,1.2%_100%)]" />
      <div className="absolute inset-x-3 bottom-0 h-[6px] rounded-b bg-[#2b170d] shadow-[0_5px_8px_rgba(0,0,0,0.65)]" />
    </div>
  );
}

function CertificationDisplay({ award, awardIndex }: { award: CertificationAward; awardIndex: number }) {
  const isMedal = award.kind === "medal";

  return (
    <a
      href={award.certificateHref}
      target="_blank"
      rel="noreferrer"
      className="group relative flex min-h-[390px] flex-col items-center justify-end px-1 pb-0 pt-2 text-center transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cc77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#26170f] sm:min-h-[420px]"
      aria-label={`Open certificate: ${award.title}`}
    >
      {isMedal ? <MedalFrame award={award} /> : <TrophyAward award={award} awardIndex={awardIndex} />}
    </a>
  );
}

function MedalFrame({ award }: { award: CertificationAward }) {
  const medalIndex = CERTIFICATION_AWARDS.filter((item) => item.kind === "medal").indexOf(award);
  const ribbons = [
    {
      left: "linear-gradient(90deg,#153a69 0 34%,#f5f0df 34% 66%,#a72d38 66%)",
      right: "linear-gradient(90deg,#a72d38 0 34%,#f5f0df 34% 66%,#153a69 66%)",
      metal: "radial-gradient(circle at 35% 28%,#fff0ad 0%,#d19832 29%,#80531d 66%,#edcb73 82%,#573513 100%)",
      border: "#deb95c",
    },
    {
      left: "linear-gradient(90deg,#2c673c 0 34%,#f1df93 34% 66%,#183f67 66%)",
      right: "linear-gradient(90deg,#183f67 0 34%,#f1df93 34% 66%,#2c673c 66%)",
      metal: "radial-gradient(circle at 35% 28%,#f9f9f4 0%,#bfc5c7 32%,#747b80 66%,#e9ecec 84%,#565c61 100%)",
      border: "#c8ccce",
    },
    {
      left: "linear-gradient(90deg,#6e254d 0 34%,#e9c36a 34% 66%,#382159 66%)",
      right: "linear-gradient(90deg,#382159 0 34%,#e9c36a 34% 66%,#6e254d 66%)",
      metal: "radial-gradient(circle at 35% 28%,#ffe0b4 0%,#bd7040 31%,#6d3623 67%,#dfa06c 84%,#4d281e 100%)",
      border: "#c78355",
    },
    {
      left: "linear-gradient(90deg,#151515 0 34%,#efb735 34% 66%,#b52e2e 66%)",
      right: "linear-gradient(90deg,#b52e2e 0 34%,#efb735 34% 66%,#151515 66%)",
      metal: "radial-gradient(circle at 35% 28%,#fff1b0 0%,#d3a12f 30%,#78501d 66%,#f0cb65 83%,#563513 100%)",
      border: "#d8ac43",
    },
  ];
  const ribbon = ribbons[Math.max(0, medalIndex) % ribbons.length];

  return (
    <div className="flex h-full w-full flex-col items-center justify-end">
      <div className="relative h-[350px] w-[min(100%,300px)] rounded-[8px] border-[9px] border-[#6d421f] bg-[linear-gradient(135deg,#d5a15a_0%,#4b2a15_12%,#2a160d_50%,#6f421f_88%,#d0984b_100%)] p-[5px] shadow-[inset_3px_3px_0_#e0b66f,inset_-4px_-4px_0_#32180b,0_15px_22px_rgba(0,0,0,0.56)] transition duration-300 group-hover:scale-[1.015]">
        <div className="relative h-full overflow-hidden rounded-[3px] border border-[#bd9a5b]/60 bg-[radial-gradient(circle_at_50%_34%,#3b2b22,#17100c_72%)] shadow-[inset_0_0_22px_rgba(0,0,0,0.8)]">
          <div className="absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-[#b88935] bg-[#1a100b]" />
          <div className="absolute left-1/2 top-[27px] h-[100px] w-[56px] -translate-x-[88%] -rotate-[12deg] shadow-[0_7px_10px_rgba(0,0,0,0.38)] [clip-path:polygon(8%_0,92%_0,82%_100%,50%_82%,18%_100%)]" style={{ background: ribbon.left }} />
          <div className="absolute left-1/2 top-[27px] h-[100px] w-[56px] -translate-x-[12%] rotate-[12deg] shadow-[0_7px_10px_rgba(0,0,0,0.38)] [clip-path:polygon(8%_0,92%_0,82%_100%,50%_82%,18%_100%)]" style={{ background: ribbon.right }} />
          <div
            className="absolute left-1/2 top-[87px] h-[166px] w-[166px] -translate-x-1/2 rounded-full border-[8px] shadow-[inset_0_0_0_3px_rgba(68,39,15,0.72),inset_0_0_0_7px_rgba(255,231,157,0.55),0_13px_19px_rgba(0,0,0,0.58)]"
            style={{ borderColor: ribbon.border, background: ribbon.metal }}
          >
            <AwardReflection shape="medal" />
            <div className="absolute inset-[28px] overflow-hidden rounded-full border-[3px] border-white/70 bg-[radial-gradient(circle,#fffdf7,#ddd4c5)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.18),0_3px_5px_rgba(0,0,0,0.22)]">
              <Image src={award.badgeSrc} alt={`${award.title} badge`} fill sizes="104px" className="object-contain p-2.5" draggable={false} />
            </div>
          </div>
          <div className="absolute inset-x-3 bottom-3">
            <AwardPlaque award={award} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrophyAward({ award, awardIndex }: { award: CertificationAward; awardIndex: number }) {
  const redHatVariants: Record<number, "star" | "cup" | "laurel"> = {
    4: "star",
    6: "cup",
    7: "laurel",
    8: "star",
  };
  const variant = award.kind === "trophy" ? "cup" : redHatVariants[awardIndex] ?? "star";
  const scaleClass = ["scale-[0.92]", "scale-100", "scale-[0.95]", "scale-[0.91]"][awardIndex % 4];
  const isCup = variant === "cup";
  const badgeFrameClass = isCup
    ? "top-[67px] h-[104px] w-[104px] rounded-full"
    : variant === "laurel"
      ? "top-[77px] h-[102px] w-[102px] rounded-full"
      : "top-[62px] h-[96px] w-[96px] rounded-full";

  return (
    <div className="flex h-full w-full flex-col items-center justify-end">
      <div className={`relative h-[365px] w-full origin-bottom transition duration-300 group-hover:scale-[1.02] ${scaleClass}`}>
        {isCup ? (
          <>
            <div className="absolute left-1/2 top-[62px] h-[102px] w-[74px] -translate-x-[138px] rounded-l-full border-[14px] border-r-0 border-[#b77d27] shadow-[-6px_7px_9px_rgba(0,0,0,0.28)]" />
            <div className="absolute right-1/2 top-[62px] h-[102px] w-[74px] translate-x-[138px] rounded-r-full border-[14px] border-l-0 border-[#b77d27] shadow-[6px_7px_9px_rgba(0,0,0,0.28)]" />
            <div className="absolute left-1/2 top-[24px] h-[190px] w-[190px] -translate-x-1/2 rounded-b-[86px] rounded-t-[30px] border-[7px] border-[#e4bd58] bg-[linear-gradient(108deg,#704313_0%,#f5d978_18%,#b77b25_42%,#fff0a5_59%,#9b631c_80%,#5f3912_100%)] shadow-[inset_8px_5px_9px_rgba(255,255,255,0.28),inset_-9px_-5px_10px_rgba(66,35,8,0.32),0_17px_24px_rgba(0,0,0,0.5)]" />
            <div className="absolute left-1/2 top-[21px] h-[22px] w-[176px] -translate-x-1/2 rounded-[50%] border border-[#f7dd83] bg-[linear-gradient(180deg,#ffe9a0,#9a621d)] shadow-[inset_0_4px_rgba(255,255,255,0.28)]" />
            <AwardReflection shape="cup" />
          </>
        ) : variant === "star" ? (
          <>
            <div className="absolute left-1/2 top-[8px] h-[204px] w-[204px] -translate-x-1/2 bg-[linear-gradient(120deg,#76501b,#f8dc7f_24%,#a66c20_52%,#ffe99a_75%,#654015)] shadow-[0_16px_22px_rgba(0,0,0,0.48)] [clip-path:polygon(50%_0,61%_34%,98%_35%,68%_56%,79%_94%,50%_72%,21%_94%,32%_56%,2%_35%,39%_34%)]" />
            <div className="absolute left-1/2 top-[27px] h-[166px] w-[166px] -translate-x-1/2 bg-[#5f3a13] [clip-path:polygon(50%_0,61%_34%,98%_35%,68%_56%,79%_94%,50%_72%,21%_94%,32%_56%,2%_35%,39%_34%)]" />
            <div className="absolute left-1/2 top-[151px] z-[1] h-[79px] w-[36px] -translate-x-1/2 bg-[linear-gradient(90deg,#6b4114_0%,#d7a83d_23%,#ffe68b_49%,#b97c24_72%,#5c3711_100%)] shadow-[inset_4px_0_5px_rgba(255,244,186,0.18),inset_-4px_0_5px_rgba(67,36,9,0.24),0_8px_10px_rgba(0,0,0,0.36)] [clip-path:polygon(30%_0,70%_0,88%_100%,12%_100%)]" />
            <AwardReflection shape="star" />
          </>
        ) : (
          <LaurelTrophyBody />
        )}

        <div className={`absolute left-1/2 z-[3] -translate-x-1/2 overflow-hidden border-[3px] border-[#f2d676] bg-[radial-gradient(circle,#fffdf7,#d9caa9)] shadow-[inset_0_4px_7px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.34)] ${badgeFrameClass}`}>
          <Image src={award.badgeSrc} alt={`${award.title} badge`} fill sizes="92px" className="object-contain p-3" draggable={false} />
        </div>

        <div className="absolute bottom-[66px] left-1/2 h-[92px] w-[28px] -translate-x-1/2 bg-[linear-gradient(90deg,#754718,#f4d87e_45%,#754718)] shadow-[0_7px_9px_rgba(0,0,0,0.4)]" />
        <div className="absolute bottom-[150px] left-1/2 h-[18px] w-[54px] -translate-x-1/2 rounded-[50%] border border-[#d5aa48] bg-[linear-gradient(180deg,#f3d774,#8b591b)] shadow-[inset_0_3px_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.28)]" />
        <div className="absolute bottom-[48px] left-1/2 h-[24px] w-[136px] -translate-x-1/2 rounded-t-[8px] border border-[#dbb85b] bg-[linear-gradient(180deg,#d9ad4f,#76501e)] shadow-[0_7px_10px_rgba(0,0,0,0.5)]" />
        <div className="absolute bottom-0 left-1/2 h-[52px] w-[210px] -translate-x-1/2 rounded-t-[7px] border border-[#5c3518] bg-[linear-gradient(180deg,#75411f,#2a160c)] shadow-[inset_0_2px_rgba(255,255,255,0.08),0_8px_12px_rgba(0,0,0,0.58)]" />
        <div className="absolute bottom-[6px] left-1/2 z-[3] flex min-h-[40px] w-[190px] -translate-x-1/2 flex-col items-center justify-center rounded-[3px] border border-[#e0c276]/75 bg-[linear-gradient(180deg,#e7cb86,#a97937)] px-2 py-1 text-[#241309] shadow-[inset_0_1px_rgba(255,255,255,0.5)]">
          <p className="text-[7px] font-bold uppercase tracking-[0.11em]">{award.issuer}</p>
          <p className="mt-0.5 line-clamp-2 text-[9px] font-semibold leading-[1.08]">{award.title}</p>
          <p className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.1em] text-[#553118]">{award.issued}</p>
        </div>
      </div>
    </div>
  );
}

function LaurelTrophyBody() {
  const leaves = Array.from({ length: 16 }, (_, index) => {
    const angle = 54 + (index * 252) / 15;
    const radians = (angle * Math.PI) / 180;

    return {
      left: 50 + Math.cos(radians) * 43,
      top: 50 + Math.sin(radians) * 43,
      rotate: angle + 90,
    };
  });

  return (
    <div className="absolute left-1/2 top-[16px] h-[210px] w-[210px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_42%_35%,#d6ac4a_0%,#94601e_55%,#5b3511_100%)] shadow-[inset_8px_6px_12px_rgba(255,239,174,0.18),0_17px_24px_rgba(0,0,0,0.48)]">
      <div className="absolute inset-[23px] rounded-full border-[8px] border-[#e0b850] bg-[radial-gradient(circle,#bd8730,#6c4117)] shadow-[inset_0_0_0_5px_#76501d]" />
      <AwardReflection shape="laurel" />
      {leaves.map((leaf, index) => (
        <span
          key={index}
          className="absolute z-[2] h-[30px] w-[14px] origin-center border border-[#f0d276]/65 bg-[linear-gradient(110deg,#745018,#f0d16d_48%,#91601c)] shadow-[2px_3px_4px_rgba(0,0,0,0.24)] [clip-path:polygon(50%_0,100%_34%,78%_100%,22%_100%,0_34%)]"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            transform: `translate(-50%, -50%) rotate(${leaf.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function AwardReflection({ shape }: { shape: "medal" | "cup" | "star" | "laurel" }) {
  const shapeClass = {
    medal: "inset-[3px] rounded-full",
    cup: "left-1/2 top-[28px] h-[180px] w-[180px] -translate-x-1/2 rounded-b-[80px] rounded-t-[26px]",
    star: "left-1/2 top-[8px] h-[204px] w-[204px] -translate-x-1/2 [clip-path:polygon(50%_0,61%_34%,98%_35%,68%_56%,79%_94%,50%_72%,21%_94%,32%_56%,2%_35%,39%_34%)]",
    laurel: "inset-[5px] rounded-full",
  }[shape];

  return (
    <span className={`pointer-events-none absolute z-[2] overflow-hidden ${shapeClass}`} aria-hidden="true">
      <span className="absolute -left-[6%] -top-[12%] h-[86%] w-[58%] -rotate-[10deg] rounded-[50%] bg-[linear-gradient(112deg,transparent_8%,rgba(255,248,210,0.02)_29%,rgba(255,255,238,0.28)_39%,rgba(255,246,197,0.08)_49%,transparent_64%)] opacity-80 transition duration-700 ease-out group-hover:translate-x-[7%] group-hover:opacity-100" />
      <span className="absolute left-[20%] top-[13%] h-[7%] w-[24%] -rotate-[13deg] rounded-full bg-[#fff8d7]/30 blur-[1px]" />
      <span className="absolute bottom-[15%] right-[10%] h-[22%] w-[12%] rotate-[18deg] rounded-full bg-[#fff1a8]/10 blur-[3px]" />
    </span>
  );
}

function AwardPlaque({ award }: { award: CertificationAward }) {
  return (
    <div className="relative w-full rounded-[4px] border border-[#d8b76a] bg-[linear-gradient(180deg,#e8ce8a_0%,#b47f38_52%,#815022_100%)] px-4 py-2 text-[#241309] shadow-[inset_0_1px_rgba(255,255,255,0.5),0_5px_10px_rgba(0,0,0,0.42)] before:absolute before:left-2 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#5d3818] before:shadow-[inset_0_1px_#e5c477] after:absolute after:right-2 after:top-2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-[#5d3818] after:shadow-[inset_0_1px_#e5c477]">
      <p className="text-[8px] font-bold uppercase tracking-[0.12em]">{award.issuer}</p>
      <h3 className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-[1.15]">{award.title}</h3>
      <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.1em] text-[#543019]">{award.issued}</p>
    </div>
  );
}

function CabinetPlant() {
  return (
    <div className="relative z-[3] hidden h-[570px] w-[150px] shrink-0 min-[1380px]:block" aria-hidden="true">
      <svg
        viewBox="0 0 150 450"
        className="absolute bottom-[106px] left-0 h-[450px] w-[150px] overflow-visible drop-shadow-[0_10px_8px_rgba(20,45,24,0.16)]"
      >
        <defs>
          <linearGradient id="kentia-stem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#263b27" />
            <stop offset="0.48" stopColor="#819263" />
            <stop offset="1" stopColor="#30472d" />
          </linearGradient>
          <linearGradient id="kentia-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9ab66f" />
            <stop offset="0.42" stopColor="#537b49" />
            <stop offset="1" stopColor="#28442f" />
          </linearGradient>
        </defs>

        <g fill="none" stroke="url(#kentia-stem)" strokeLinecap="round">
          <path d="M69 450 Q64 386 67 318" strokeWidth="8" />
          <path d="M75 450 Q76 372 74 302" strokeWidth="9" />
          <path d="M81 450 Q89 386 80 326" strokeWidth="7" />
        </g>

        <g fill="none" stroke="url(#kentia-stem)" strokeLinecap="round" strokeWidth="4">
          <path d="M67 320 Q39 264 8 224" />
          <path d="M70 312 Q48 193 17 103" />
          <path d="M74 304 Q72 166 75 45" />
          <path d="M78 313 Q100 194 132 101" />
          <path d="M80 326 Q111 277 145 222" />
        </g>

        <g fill="none" stroke="url(#kentia-leaf)" strokeLinecap="round">
          <path d="M17 235 Q7 236 0 249 M17 235 Q28 243 32 258" strokeWidth="7" />
          <path d="M28 252 Q13 255 3 270 M28 252 Q42 260 47 278" strokeWidth="8" />
          <path d="M40 270 Q23 275 12 292 M40 270 Q54 280 58 298" strokeWidth="9" />
          <path d="M53 290 Q38 297 29 313 M53 290 Q65 300 68 316" strokeWidth="8" />

          <path d="M23 121 Q8 111 0 117 M23 121 Q43 124 51 143" strokeWidth="7" />
          <path d="M30 147 Q10 139 0 150 M30 147 Q50 153 58 173" strokeWidth="8" />
          <path d="M39 177 Q17 172 4 187 M39 177 Q59 185 66 205" strokeWidth="9" />
          <path d="M49 211 Q27 211 12 229 M49 211 Q65 222 70 241" strokeWidth="9" />
          <path d="M59 250 Q40 255 28 273 M59 250 Q70 263 72 281" strokeWidth="8" />

          <path d="M75 53 Q56 40 41 46 M75 53 Q94 40 109 47" strokeWidth="7" />
          <path d="M74 80 Q51 67 33 76 M74 80 Q98 67 116 77" strokeWidth="8" />
          <path d="M74 111 Q47 99 27 112 M74 111 Q101 98 122 112" strokeWidth="9" />
          <path d="M73 147 Q44 137 23 153 M73 147 Q102 136 126 153" strokeWidth="9" />
          <path d="M73 187 Q45 180 24 198 M73 187 Q101 179 124 198" strokeWidth="9" />
          <path d="M73 231 Q49 228 31 246 M73 231 Q97 227 117 246" strokeWidth="8" />
          <path d="M73 270 Q55 270 42 284 M73 270 Q91 270 106 284" strokeWidth="7" />

          <path d="M127 120 Q142 110 150 117 M127 120 Q107 124 99 143" strokeWidth="7" />
          <path d="M120 147 Q140 139 150 150 M120 147 Q100 153 92 173" strokeWidth="8" />
          <path d="M111 177 Q133 172 146 187 M111 177 Q91 185 84 205" strokeWidth="9" />
          <path d="M101 211 Q123 211 138 229 M101 211 Q85 222 80 241" strokeWidth="9" />
          <path d="M91 250 Q110 255 122 273 M91 250 Q80 263 78 281" strokeWidth="8" />

          <path d="M133 235 Q143 236 150 249 M133 235 Q122 243 118 258" strokeWidth="7" />
          <path d="M122 252 Q137 255 147 270 M122 252 Q108 260 103 278" strokeWidth="8" />
          <path d="M110 270 Q127 275 138 292 M110 270 Q96 280 92 298" strokeWidth="9" />
          <path d="M97 290 Q112 297 121 313 M97 290 Q85 300 82 316" strokeWidth="8" />
        </g>

        <g fill="none" stroke="#d8e4a6" strokeLinecap="round" strokeWidth="1.2" opacity="0.3">
          <path d="M17 103 Q48 193 70 312" />
          <path d="M75 34 Q72 166 74 304" />
          <path d="M132 101 Q100 194 78 313" />
        </g>
      </svg>

      <div className="absolute bottom-[9px] left-1/2 h-[104px] w-[108px] -translate-x-1/2 [clip-path:polygon(7%_0,93%_0,81%_100%,19%_100%)] bg-[linear-gradient(90deg,#74391f_0%,#c87543_24%,#e39159_48%,#a55231_72%,#67331e_100%)] shadow-[inset_0_8px_rgba(255,255,255,0.1),0_16px_20px_rgba(0,0,0,0.28)]" />
      <div className="absolute bottom-[101px] left-1/2 h-[20px] w-[118px] -translate-x-1/2 rounded-[50%] border border-[#71381f] bg-[linear-gradient(180deg,#e59a64,#8a4426)] shadow-[inset_0_4px_rgba(255,255,255,0.14)]" />
      <div className="absolute bottom-[105px] left-1/2 h-[9px] w-[98px] -translate-x-1/2 rounded-[50%] bg-[#3b2c1e]" />
      <div className="absolute bottom-0 left-1/2 h-[16px] w-[112px] -translate-x-1/2 rounded-[50%] bg-[#49331f]/35 blur-[3px]" />
    </div>
  );
}

const PROJECT_CARD_MEDIA: Record<
  string,
  {
    src: string;
    cardSrc?: string;
    alt: string;
    mode?: "contain" | "cover";
    backdrop?: string;
  }
> = {
  "multi-platform-iot-security-lab": {
    src: "/portfolio/project-iot-security-lab.png",
    cardSrc: "/portfolio/thumbs/project-iot-security-lab.webp",
    alt: "Cisco Modeling Labs PwnHub lab demonstration screenshot",
    mode: "cover",
    backdrop: "#050505",
  },
  "portfolio-site": {
    src: "/portfolio/project-portfolio-site.png",
    cardSrc: "/portfolio/thumbs/project-portfolio-site.webp",
    alt: "Interactive network topology portfolio homepage screenshot",
    mode: "cover",
    backdrop: "#f8fafc",
  },
  "aircraft-game-python-react": {
    src: "/portfolio/project-maanarvauspeli.png",
    cardSrc: "/portfolio/thumbs/project-maanarvauspeli.webp",
    alt: "Kristoffer Kolumbuksen jaljilla - maanarvauspeli screenshot",
    mode: "cover",
    backdrop: "#f2ebdb",
  },
  "heart-rate-monitor": {
    src: "/portfolio/project-pulsemaster-hw.jpeg",
    cardSrc: "/portfolio/thumbs/project-pulsemaster-hw.webp",
    alt: "PulseMaster hardware setup with Raspberry Pi Pico and pulse sensor",
    mode: "cover",
    backdrop: "#1f2429",
  },
  "pill-dispenser-pico": {
    src: "/portfolio/project-pill-dispenser-hardware.jpg",
    cardSrc: "/portfolio/thumbs/project-pill-dispenser-hardware.webp",
    alt: "Raspberry Pi Pico pill dispenser hardware setup with dispenser wheel, sensors and wiring",
    mode: "cover",
    backdrop: "#3a2416",
  },
  "metropolia-login-ui": {
    src: "/portfolio/project-metropolia-login-demo.png",
    cardSrc: "/portfolio/thumbs/project-metropolia-login-demo.webp",
    alt: "Phishing awareness login demo screenshot",
    mode: "cover",
    backdrop: "#eceff4",
  },
};

export const PROJECTS_OVERVIEW_HREF = "/?panel=projects";

const PROJECT_HERO_ACTIONS: Record<string, { href: string; label: string }> = {
  "multi-platform-iot-security-lab": {
    href: "/portfolio/iot-security-lab-demonstration.mp4",
    label: "Demonstration video",
  },
  "heart-rate-monitor": {
    href: "/portfolio/pulsemaster-demonstration.mp4",
    label: "Demonstration video",
  },
  "aircraft-game-python-react": {
    href: "https://maanarvauspeli-loader.onrender.com/",
    label: "Open live demo",
  },
};

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
  tabIndex,
}: {
  project: (typeof projects)[number];
  onSelectProject?: (slug: string) => void;
  size?: "overview" | "compact";
  tabIndex?: number;
}) {
  const media = PROJECT_CARD_MEDIA[project.slug];
  const cardMediaSrc = media?.cardSrc ?? media?.src;
  const [failedMediaSrc, setFailedMediaSrc] = useState<string | null>(null);
  const mediaFailed = Boolean(cardMediaSrc && failedMediaSrc === cardMediaSrc);
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
      tabIndex={tabIndex}
    >
      <article className="overflow-hidden rounded-[12px] border border-[#79c271] bg-[#edf8df] transition duration-200 group-hover:border-[#4f9b47]">
        <div className={`relative overflow-hidden ${mediaShapeClass}`}>
          {media && cardMediaSrc && !mediaFailed ? (
            <>
              <div className="absolute inset-0 z-0" style={{ background: media.backdrop ?? "#edf6df" }} />
              <Image
                src={cardMediaSrc}
                alt={media.alt}
                fill
                sizes={size === "compact" ? "220px" : "(max-width: 1024px) 78vw, 420px"}
                className={`relative z-[1] opacity-100 transition duration-300 group-hover:scale-[1.02] ${media.mode === "cover" ? "object-cover object-center" : "object-contain object-center p-1"}`}
                draggable={false}
                loading="lazy"
                onError={() => {
                  setFailedMediaSrc(cardMediaSrc);
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
            <div className="pointer-events-none absolute bottom-2 left-2 z-[2] flex max-w-[calc(100%-1rem)] translate-y-0 items-center gap-2 rounded-[11px] border border-[#79c271] bg-[#edf8df]/96 px-3 py-2 opacity-100 shadow-[0_8px_18px_rgba(58,125,46,0.18)] transition duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
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

type ProjectMarqueeLaneDirection = "up" | "down" | "left" | "right";

type ProjectMarqueeLaneProps = {
  items: (typeof projects)[number][];
  direction: ProjectMarqueeLaneDirection;
  onSelectProject?: (slug: string) => void;
};

const HORIZONTAL_MARQUEE_SEGMENT_COUNT = 6;
const HORIZONTAL_MARQUEE_CENTER_SEGMENT = 2;
const HORIZONTAL_MARQUEE_BASE_DURATION_SECONDS = 22;
const HORIZONTAL_MARQUEE_SEGMENT_SHIFT_PERCENT = -(100 / HORIZONTAL_MARQUEE_SEGMENT_COUNT);

function ProjectMarqueeLane(props: ProjectMarqueeLaneProps) {
  if (props.direction === "left" || props.direction === "right") {
    return <ProjectHorizontalMarqueeLane {...props} />;
  }

  return <ProjectVerticalMarqueeLane {...props} />;
}

function ProjectHorizontalMarqueeLane({
  items,
  direction,
  onSelectProject,
}: ProjectMarqueeLaneProps) {
  const laneRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const wrapFrameRef = useRef<number | null>(null);
  const segmentWidthRef = useRef(0);
  const initializedRef = useRef(false);
  const programmaticScrollUntilRef = useRef(0);
  const pointerActiveRef = useRef(false);
  const touchActiveRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const clearResumeTimer = useCallback(() => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    clearResumeTimer();
    setPaused(true);
  }, [clearResumeTimer]);

  const resumeSoon = useCallback((delay = 420) => {
    clearResumeTimer();

    const resumeWhenReleased = () => {
      if (pointerActiveRef.current || touchActiveRef.current) {
        resumeTimeoutRef.current = window.setTimeout(resumeWhenReleased, 120);
        return;
      }

      setPaused(false);
      resumeTimeoutRef.current = null;
    };

    resumeTimeoutRef.current = window.setTimeout(resumeWhenReleased, delay);
  }, [clearResumeTimer]);

  const normalizeScrollPosition = useCallback(() => {
    const lane = laneRef.current;
    const segmentWidth = segmentWidthRef.current;
    if (!lane || segmentWidth <= 0) return;

    const center = segmentWidth * HORIZONTAL_MARQUEE_CENTER_SEGMENT;
    const min = segmentWidth * 1.5;
    const max = segmentWidth * (HORIZONTAL_MARQUEE_SEGMENT_COUNT - 2.5);
    const current = lane.scrollLeft;
    if (current >= min && current <= max) return;

    const offset = ((((current - center) % segmentWidth) + segmentWidth) % segmentWidth);
    programmaticScrollUntilRef.current = performance.now() + 120;
    lane.scrollLeft = center + offset;
  }, []);

  const scheduleNormalizeScrollPosition = useCallback(() => {
    if (wrapFrameRef.current) return;
    wrapFrameRef.current = window.requestAnimationFrame(() => {
      wrapFrameRef.current = null;
      normalizeScrollPosition();
    });
  }, [normalizeScrollPosition]);

  useEffect(() => {
    const lane = laneRef.current;
    const segment = segmentRef.current;
    if (!lane || !segment || items.length === 0) return;

    const syncSegmentWidth = () => {
      const nextWidth = segment.scrollWidth;
      if (nextWidth <= 0) return;

      const previousWidth = segmentWidthRef.current;
      segmentWidthRef.current = nextWidth;

      if (!initializedRef.current || previousWidth <= 0) {
        initializedRef.current = true;
        programmaticScrollUntilRef.current = performance.now() + 180;
        lane.scrollLeft = nextWidth * HORIZONTAL_MARQUEE_CENTER_SEGMENT;
        return;
      }

      if (Math.abs(nextWidth - previousWidth) > 0.5) {
        const ratio = lane.scrollLeft / previousWidth;
        programmaticScrollUntilRef.current = performance.now() + 180;
        lane.scrollLeft = ratio * nextWidth;
        scheduleNormalizeScrollPosition();
      }
    };

    syncSegmentWidth();

    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        syncSegmentWidth();
      });
    });
    observer.observe(segment);

    return () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      observer.disconnect();
    };
  }, [items.length, scheduleNormalizeScrollPosition]);

  useEffect(() => {
    return () => {
      clearResumeTimer();
      if (wrapFrameRef.current) {
        window.cancelAnimationFrame(wrapFrameRef.current);
        wrapFrameRef.current = null;
      }
    };
  }, [clearResumeTimer]);

  const pauseForPointer = useCallback(() => {
    pointerActiveRef.current = true;
    pause();
  }, [pause]);

  const resumeAfterPointer = useCallback(() => {
    pointerActiveRef.current = false;
    resumeSoon(280);
  }, [resumeSoon]);

  const pauseForTouch = useCallback(() => {
    touchActiveRef.current = true;
    pause();
  }, [pause]);

  const resumeAfterTouch = useCallback(() => {
    touchActiveRef.current = false;
    resumeSoon(280);
  }, [resumeSoon]);

  const segmentIndexes = useMemo(() => Array.from({ length: HORIZONTAL_MARQUEE_SEGMENT_COUNT }, (_, index) => index), []);
  const shouldPauseMotion = paused || prefersReducedMotion;
  const marqueeTrackStyle = useMemo(
    () => ({
      "--project-marquee-duration": `${HORIZONTAL_MARQUEE_BASE_DURATION_SECONDS}s`,
      "--project-marquee-shift": `${HORIZONTAL_MARQUEE_SEGMENT_SHIFT_PERCENT}%`,
    }) as CSSProperties,
    [],
  );
  const handleScroll = useCallback(() => {
    scheduleNormalizeScrollPosition();

    if (performance.now() < programmaticScrollUntilRef.current) return;

    pause();
    if (!pointerActiveRef.current && !touchActiveRef.current) {
      resumeSoon(360);
    }
  }, [pause, resumeSoon, scheduleNormalizeScrollPosition]);

  return (
    <div
      ref={laneRef}
      className="project-marquee-lane h-full w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden"
      data-paused={shouldPauseMotion ? "true" : "false"}
      onPointerDown={pauseForPointer}
      onPointerUp={resumeAfterPointer}
      onPointerCancel={resumeAfterPointer}
      onTouchStart={pauseForTouch}
      onTouchEnd={resumeAfterTouch}
      onTouchCancel={resumeAfterTouch}
      onScroll={handleScroll}
      onWheelCapture={() => {
        pause();
        resumeSoon(360);
        scheduleNormalizeScrollPosition();
      }}
    >
      <div className="project-marquee-track flex h-full w-max items-center" data-direction={direction} style={marqueeTrackStyle}>
        {segmentIndexes.map((segmentIndex) => (
          <div
            key={`segment-${segmentIndex}`}
            ref={segmentIndex === HORIZONTAL_MARQUEE_CENTER_SEGMENT ? segmentRef : undefined}
            className="flex h-full w-max items-center gap-4 pr-4"
          >
            {items.map((project) => (
              <div key={`${project.slug}-${segmentIndex}`} className="w-[min(68vw,310px)] shrink-0">
                <ProjectMarqueeCard
                  project={project}
                  onSelectProject={onSelectProject}
                  tabIndex={segmentIndex === HORIZONTAL_MARQUEE_CENTER_SEGMENT ? undefined : -1}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectVerticalMarqueeLane({
  items,
  direction,
  onSelectProject,
}: ProjectMarqueeLaneProps) {
  const laneRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const lastAutoScrollAtRef = useRef(0);
  const lastUserScrollAtRef = useRef(0);
  const programmaticScrollUntilRef = useRef(0);
  const userInteractingRef = useRef(false);
  const touchActiveRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const isHorizontal = direction === "left" || direction === "right";
  const resumeDelayMs = isHorizontal ? 520 : 700;
  const userScrollIdleMs = isHorizontal ? 420 : 560;

  const clearResumeTimer = useCallback(() => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const scheduleResumeWhenIdle = useCallback(function scheduleResumeWhenIdle(delay = resumeDelayMs) {
    clearResumeTimer();
    resumeTimeoutRef.current = window.setTimeout(() => {
      const now = performance.now();
      const idleFor = now - lastUserScrollAtRef.current;

      if (userInteractingRef.current || idleFor < userScrollIdleMs) {
        scheduleResumeWhenIdle(Math.max(80, userScrollIdleMs - idleFor));
        return;
      }

      isPausedRef.current = false;
      resumeTimeoutRef.current = null;
    }, delay);
  }, [clearResumeTimer, resumeDelayMs, userScrollIdleMs]);

  useEffect(() => {
    const lane = laneRef.current;
    const segment = segmentRef.current;
    if (!lane || !segment || items.length === 0) return;

    let segmentSize = 0;
    let initialized = false;
    let rafId = 0;
    let previousTime = 0;
    const speedPxPerSecond = isHorizontal ? 34 : 20;

    const markProgrammaticScroll = (durationMs = 160) => {
      programmaticScrollUntilRef.current = performance.now() + durationMs;
    };

    const normalizeScrollPosition = () => {
      if (segmentSize <= 0) return;
      const min = segmentSize * 0.5;
      const max = segmentSize * 1.5;
      const wrapPosition = (value: number) => {
        if (value >= min && value <= max) return value;
        return min + ((((value - min) % segmentSize) + segmentSize) % segmentSize);
      };

      if (isHorizontal) {
        const next = wrapPosition(lane.scrollLeft);
        if (Math.abs(next - lane.scrollLeft) > 0.5) {
          markProgrammaticScroll();
          lane.scrollLeft = next;
        }
        return;
      }

      const next = wrapPosition(lane.scrollTop);
      if (Math.abs(next - lane.scrollTop) > 0.5) {
        markProgrammaticScroll();
        lane.scrollTop = next;
      }
    };

    const setScrollPosition = (value: number, durationMs = 260) => {
      markProgrammaticScroll(durationMs);
      if (isHorizontal) {
        lane.scrollLeft = value;
      } else {
        lane.scrollTop = value;
      }
    };

    const readScrollPosition = () => (isHorizontal ? lane.scrollLeft : lane.scrollTop);

    const syncSegmentSize = () => {
      const nextSegmentSize = isHorizontal ? segment.scrollWidth : segment.scrollHeight;
      if (nextSegmentSize <= 0) return;

      const previousSegmentSize = segmentSize;
      const currentPosition = readScrollPosition();
      const now = performance.now();
      segmentSize = nextSegmentSize;

      if (!initialized || previousSegmentSize <= 0) {
        initialized = true;
        lastAutoScrollAtRef.current = now;
        previousTime = 0;
        if (!userInteractingRef.current && now - lastUserScrollAtRef.current > userScrollIdleMs) {
          isPausedRef.current = false;
        }
        setScrollPosition(segmentSize, 700);
        return;
      }

      const sizeDelta = nextSegmentSize - previousSegmentSize;
      if (Math.abs(sizeDelta) > 0.5) {
        // Images/fonts can finish after the panel opens. Keep the visible card
        // position instead of snapping the lane back to the beginning.
        setScrollPosition(currentPosition + sizeDelta, 260);
        normalizeScrollPosition();
      }
    };

    syncSegmentSize();
    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        syncSegmentSize();
      });
    });
    observer.observe(segment);

    const handleScroll = () => {
      const now = performance.now();
      if (now < programmaticScrollUntilRef.current || now - lastAutoScrollAtRef.current < 90) {
        normalizeScrollPosition();
        return;
      }

      lastUserScrollAtRef.current = now;
      isPausedRef.current = true;
      if (!userInteractingRef.current) {
        scheduleResumeWhenIdle(resumeDelayMs);
      }
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
          markProgrammaticScroll();
          lastAutoScrollAtRef.current = performance.now();
          lane.scrollLeft += delta;
        } else {
          markProgrammaticScroll();
          lastAutoScrollAtRef.current = performance.now();
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
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      if (rafId) window.cancelAnimationFrame(rafId);
      lane.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [direction, isHorizontal, items, prefersReducedMotion, resumeDelayMs, scheduleResumeWhenIdle, userScrollIdleMs]);

  useEffect(() => {
    return () => {
      clearResumeTimer();
    };
  }, [clearResumeTimer]);

  const pauseForPointer = useCallback(() => {
    userInteractingRef.current = true;
    lastUserScrollAtRef.current = performance.now();
    clearResumeTimer();
    isPausedRef.current = true;
  }, [clearResumeTimer]);

  const resumeAfterPointer = useCallback(() => {
    if (touchActiveRef.current) return;
    userInteractingRef.current = false;
    lastUserScrollAtRef.current = performance.now();
    scheduleResumeWhenIdle(resumeDelayMs);
  }, [resumeDelayMs, scheduleResumeWhenIdle]);

  const pauseForTouch = useCallback(() => {
    touchActiveRef.current = true;
    pauseForPointer();
  }, [pauseForPointer]);

  const resumeAfterTouch = useCallback(() => {
    touchActiveRef.current = false;
    resumeAfterPointer();
  }, [resumeAfterPointer]);

  const pauseForWheel = useCallback(() => {
    userInteractingRef.current = false;
    lastUserScrollAtRef.current = performance.now();
    clearResumeTimer();
    isPausedRef.current = true;
    scheduleResumeWhenIdle(resumeDelayMs);
  }, [clearResumeTimer, resumeDelayMs, scheduleResumeWhenIdle]);

  useEffect(() => {
    const forceResume = () => {
      touchActiveRef.current = false;
      userInteractingRef.current = false;
      scheduleResumeWhenIdle(140);
    };

    window.addEventListener("pointerup", resumeAfterPointer, { passive: true });
    window.addEventListener("pointercancel", resumeAfterPointer, { passive: true });
    window.addEventListener("touchend", resumeAfterTouch, { passive: true });
    window.addEventListener("touchcancel", forceResume, { passive: true });
    window.addEventListener("blur", forceResume);

    return () => {
      window.removeEventListener("pointerup", resumeAfterPointer);
      window.removeEventListener("pointercancel", resumeAfterPointer);
      window.removeEventListener("touchend", resumeAfterTouch);
      window.removeEventListener("touchcancel", forceResume);
      window.removeEventListener("blur", forceResume);
    };
  }, [resumeAfterPointer, resumeAfterTouch, scheduleResumeWhenIdle]);

  const segmentClassName = isHorizontal ? "flex h-full w-max items-center gap-4 pr-4" : "space-y-5 pb-5";
  const cardWrapClassName = isHorizontal ? "w-[min(68vw,310px)] shrink-0" : "";
  const renderSegment = (segmentName: string, hidden = false) => (
    <div
      ref={hidden ? undefined : segmentRef}
      aria-hidden={hidden || undefined}
      className={`${segmentClassName} ${hidden ? "pointer-events-none" : ""}`}
    >
      {items.map((project) => (
        <div key={`${project.slug}-${segmentName}`} className={cardWrapClassName}>
          <ProjectMarqueeCard project={project} onSelectProject={onSelectProject} tabIndex={hidden ? -1 : undefined} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="relative h-full min-h-0 w-full max-w-full overflow-hidden"
      onPointerDown={pauseForPointer}
      onPointerUp={resumeAfterPointer}
      onPointerCancel={resumeAfterPointer}
      onTouchStart={pauseForTouch}
      onTouchEnd={resumeAfterTouch}
      onTouchCancel={resumeAfterTouch}
      onWheelCapture={pauseForWheel}
      onFocusCapture={() => {
        if (!isHorizontal) {
          isPausedRef.current = true;
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          resumeAfterPointer();
        }
      }}
    >
      <div
        ref={laneRef}
        className={`h-full w-full min-w-0 max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isHorizontal ? "overflow-x-auto overflow-y-hidden overscroll-x-contain [touch-action:pan-x]" : "overflow-y-auto overflow-x-hidden"
        }`}
      >
        {isHorizontal ? (
          <div className="flex h-full w-max items-center">
            {renderSegment("segment-a", true)}
            {renderSegment("segment-b", false)}
            {renderSegment("segment-c", true)}
          </div>
        ) : (
          <>
            {renderSegment("segment-a", true)}
            {renderSegment("segment-b", false)}
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
  const isLargeProjectLayout = useMediaQuery("(min-width: 1024px)");
  const [failedHeroImageSrc, setFailedHeroImageSrc] = useState<string | null>(null);
  const [heroActionCue, setHeroActionCue] = useState<{ x: number; y: number; slug: string } | null>(null);

  const updateHeroActionCue = useCallback((event: ReactMouseEvent<HTMLElement>, slug: string) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const labelWidth = 184;
    const labelHeight = 34;
    const x = clampNumber(event.clientX - bounds.left + 16, 10, Math.max(10, bounds.width - labelWidth));
    const y = clampNumber(event.clientY - bounds.top + 16, 10, Math.max(10, bounds.height - labelHeight));
    setHeroActionCue({ x, y, slug });
  }, []);

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
          <section className="flex items-center px-5 py-5 md:px-7 lg:min-h-0 lg:py-8 xl:px-8">
            <div className="max-w-[320px] lg:max-w-[340px] xl:max-w-[390px]">
              <h2 className="text-[clamp(2.35rem,11vw,3.4rem)] font-bold leading-[0.92] tracking-[-0.065em] text-[#123f82] md:text-[clamp(4.1rem,7.5vw,6.25rem)] lg:text-[clamp(3.6rem,5.8vw,5.75rem)]">
                <span className="block">Discover</span>
                <span className="block">projects I</span>
                <span className="block">have built</span>
              </h2>
            </div>
          </section>

          <section className="grid min-h-[390px] gap-3 overflow-hidden px-4 pb-5 md:px-5 lg:h-full lg:min-h-0 lg:grid-cols-2 lg:gap-5 lg:py-0">
            {isLargeProjectLayout ? (
              <>
                <div className="h-full min-h-0">
                  <ProjectMarqueeLane items={leftLaneProjects} direction="up" onSelectProject={onSelectProject} />
                </div>
                <div className="h-full min-h-0">
                  <ProjectMarqueeLane items={rightLaneProjects} direction="down" onSelectProject={onSelectProject} />
                </div>
              </>
            ) : (
              <>
                <div className="h-[178px] min-w-0 overflow-hidden">
                  <ProjectMarqueeLane items={overviewProjectOrder} direction="left" onSelectProject={onSelectProject} />
                </div>
                <div className="h-[178px] min-w-0 overflow-hidden">
                  <ProjectMarqueeLane items={mobileSecondLaneProjects} direction="right" onSelectProject={onSelectProject} />
                </div>
              </>
            )}
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
  const heroAction = PROJECT_HERO_ACTIONS[selectedProject.slug] ?? null;
  const activeHeroActionCue = heroActionCue?.slug === selectedProject.slug ? heroActionCue : null;
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
                {heroAction ? (
                  <a
                    href={heroAction.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={heroAction.label}
                    className="absolute inset-0 z-[1] block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3d7f35]"
                    onMouseEnter={(event) => updateHeroActionCue(event, selectedProject.slug)}
                    onMouseMove={(event) => updateHeroActionCue(event, selectedProject.slug)}
                    onMouseLeave={() => setHeroActionCue(null)}
                  >
                    <Image
                      src={selectedProjectMedia.src}
                      alt={selectedProjectMedia.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 920px"
                      className={selectedProjectMedia.mode === "cover" ? "object-cover object-center" : "object-contain object-center p-4"}
                      draggable={false}
                      priority
                      onError={() => {
                        if (selectedProjectMedia?.src) setFailedHeroImageSrc(selectedProjectMedia.src);
                      }}
                    />
                    <span
                      className="pointer-events-none absolute z-[3] hidden rounded-full border border-[#89bd68] bg-[#f8fff0]/96 px-3 py-1.5 text-[12px] font-semibold text-[#173b72] opacity-0 shadow-[0_10px_22px_rgba(36,74,38,0.18)] transition-opacity duration-150 md:inline-flex"
                      style={{
                        left: activeHeroActionCue ? `${activeHeroActionCue.x}px` : "16px",
                        top: activeHeroActionCue ? `${activeHeroActionCue.y}px` : "16px",
                        opacity: activeHeroActionCue ? 1 : 0,
                      }}
                    >
                      {heroAction.label}
                    </span>
                  </a>
                ) : (
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
                )}
              </>
            ) : (
              <div className="absolute inset-0 z-[1] flex items-center justify-center px-6 text-center">
                <span className="text-[clamp(1.2rem,2.8vw,2rem)] font-semibold tracking-tight text-[#163f81]">{selectedProject.title}</span>
              </div>
            )}
          </div>
          {heroAction ? (
            <figcaption className="border-t border-[#b7d79b] bg-[#f8fff0] px-3 py-2 text-[12px] font-semibold text-[#173b72] md:hidden">
              Tap image: {heroAction.label}
            </figcaption>
          ) : null}
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
    <div className="contact-page h-full w-full overflow-y-auto rounded-none bg-[linear-gradient(180deg,#ef6620_0%,#e85517_100%)] text-[#1f120b] lg:overflow-hidden">
      <div className="contact-page-layout relative grid min-h-full gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
        <section className="contact-page-intro relative flex min-h-0 flex-col px-5 pb-0 pt-6 text-white sm:px-7 lg:min-h-0 lg:px-9 lg:pt-7">
          <h2 className="contact-page-heading relative z-[2] w-full max-w-none text-[clamp(2.45rem,14vw,4rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-white [text-shadow:0_2px_0_rgba(118,48,20,0.22)] lg:max-w-[700px] lg:text-[clamp(2rem,4.7vw,4.35rem)]">
            <span className="block">Let&apos;s build</span>
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-0">
              <span>something</span>
              <span>great</span>
            </span>
            <span className="block text-[1em]">together.</span>
          </h2>

          <div className="contact-page-details relative z-[2] mt-4 space-y-1 text-[clamp(18px,1.9vw,26px)] font-medium leading-[1.12] text-white/98">
            <a href="tel:+358405283008" className="block w-fit transition hover:text-[#ffe9db]">040 528 3008</a>
            <a href="mailto:roope.aa@hotmail.com" className="block w-fit transition hover:text-[#ffe9db]">roope.aa@hotmail.com</a>
            <p>Vantaa, Hämeenkylä</p>
          </div>

          <div className="contact-page-art relative z-[2] mt-5 flex min-h-0 flex-none items-end lg:mt-4 lg:min-h-0 lg:flex-1">
            <div className="contact-page-art-frame relative h-[320px] w-full overflow-hidden border border-b-0 border-[#ecb8ce]/85 bg-[#f3e6eb] sm:h-[380px] lg:h-full lg:min-h-[320px] lg:w-[88%] lg:border-b lg:bg-[#f2e3ea]">
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

        <aside className="contact-page-form-column relative -mt-px flex min-h-0 flex-col px-5 pb-6 pt-0 sm:px-7 lg:mt-0 lg:min-h-0 lg:pl-0 lg:pr-7">
          <div className="contact-page-form-card relative z-[2] flex min-h-0 w-full flex-col border border-t-0 border-[#ecb8ce]/85 bg-[#f3e6eb] px-5 pb-7 pt-7 shadow-[0_14px_28px_rgba(76,28,15,0.1)] sm:px-8 lg:min-h-0 lg:flex-[0_0_80%] lg:border-0">
            <h3 className="contact-page-form-title max-w-full text-[clamp(2.05rem,9.5vw,3.25rem)] font-semibold leading-[1.03] text-[#8b3f1c]">Fill in your details</h3>

            <form onSubmit={handleContactSubmit} className="contact-page-form mt-5 flex min-h-0 flex-1 flex-col gap-3.5" autoComplete="off">
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
                className={`contact-page-input min-w-0 w-full rounded-full border bg-[#eb5f1f] px-5 py-3.5 text-[16px] text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] sm:text-[17px] ${
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
                className={`contact-page-input min-w-0 w-full rounded-full border bg-[#eb5f1f] px-5 py-3.5 text-[16px] text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] sm:text-[17px] ${
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
                className={`contact-page-message min-h-[168px] w-full min-w-0 flex-1 resize-y rounded-[28px] border bg-[#eb5f1f] px-5 py-4 text-[16px] leading-7 text-white placeholder:text-[#ffd5be] outline-none transition focus:border-[#b84910] sm:min-h-[180px] sm:rounded-[34px] sm:text-[17px] lg:resize-none ${
                  submitAttempted && missingFields.message ? "border-[#bb2d2d]" : "border-[#d1652c]"
                }`}
              />

              <div className="contact-page-submit pt-1">
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

          <div className="contact-page-socials relative z-[2] grid w-full grid-cols-4 items-center justify-items-center gap-2 px-3 pb-5 pt-3 sm:px-8 lg:pt-2">
            <SocialLogoLink href="https://www.linkedin.com/in/roope-aaltonen/" label="LinkedIn" className="contact-page-social-link !h-[clamp(76px,8vw,132px)] !w-[clamp(76px,8vw,132px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <LinkedInGlyph />
            </SocialLogoLink>
            <SocialLogoLink href={INSTAGRAM_URL} label="Instagram" className="contact-page-social-link !h-[clamp(76px,8vw,132px)] !w-[clamp(76px,8vw,132px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <InstagramGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://facebook.com/roope.aaltonen.5" label="Facebook" className="contact-page-social-link !h-[clamp(76px,8vw,132px)] !w-[clamp(76px,8vw,132px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
              <FacebookGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://github.com/roopeaal" label="GitHub" className="contact-page-social-link !h-[clamp(76px,8vw,132px)] !w-[clamp(76px,8vw,132px)] !border-0 !bg-transparent !shadow-none hover:!translate-y-0">
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
