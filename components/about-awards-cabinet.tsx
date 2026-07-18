"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

type AwardKind = "medal" | "trophy" | "plaque";

type CertificationAward = {
  title: string;
  issuer: "Cisco Networking Academy" | "AWS Academy" | "Red Hat Academy";
  issued: string;
  badgeSrc: string;
  certificateHref: string;
  kind: AwardKind;
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

const RIBBON_STYLES: Array<{ left: string; right: string; metal: string }> = [
  { left: "#244d78", right: "#9e3942", metal: "gold" },
  { left: "#3f6d51", right: "#274e72", metal: "silver" },
  { left: "#70425f", right: "#493966", metal: "bronze" },
  { left: "#202326", right: "#aa3c37", metal: "gold" },
];

type CabinetColumns = 1 | 2 | 3;
type TrophyVariant = "cup" | "shield" | "laurel";

export function AwardsCabinet() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<CabinetColumns>(3);
  const [showPlant, setShowPlant] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const updateLayout = () => {
      const width = scene.clientWidth;
      setColumns(width >= 1030 ? 3 : width >= 610 ? 2 : 1);
      setShowPlant(width >= 1280);
    };
    const observer = new ResizeObserver(updateLayout);

    updateLayout();
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sceneRef}
      className="relative h-full min-h-0 overflow-x-hidden overflow-y-auto bg-[#d4cdbf] text-[#f7ead0]"
      aria-labelledby="awards-cabinet-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,255,255,0.06)_45%,rgba(85,67,45,0.08)),linear-gradient(180deg,#ded9cf_0%,#cbc2b3_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] border-t border-[#958875] bg-[linear-gradient(180deg,#c1b39f_0%,#aa977d_100%)] shadow-[inset_0_9px_18px_rgba(70,48,31,0.13)]"
      >
        <div className="absolute inset-x-0 top-[7px] h-px bg-white/40" />
        <div className="absolute inset-x-0 top-[42%] h-px bg-[#8b775f]/30" />
        <div className="absolute inset-x-0 top-[76%] h-px bg-[#8b775f]/24" />
      </div>

      <div className="relative z-[1] mx-auto flex min-h-full w-full max-w-[1500px] items-end gap-5 px-2 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-6 lg:px-7">
        <div className="relative min-w-0 flex-1 pb-7">
          <div className="absolute inset-x-[3%] bottom-2 top-5 translate-x-3 translate-y-3 rounded-[10px] bg-[#2b160c] shadow-[0_18px_28px_rgba(48,31,18,0.3)]" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[7px] border-[10px] border-[#4d2b18] bg-[#1c0e08] shadow-[inset_4px_0_0_#8b542c,inset_-4px_0_0_#2b150a,inset_0_4px_0_#a26936,inset_0_-5px_0_#271208,0_18px_32px_rgba(39,24,14,0.32)] sm:border-[14px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 bg-[linear-gradient(90deg,#29140a,#7a4724,#32180d)] shadow-[5px_0_10px_rgba(0,0,0,0.46)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-3 bg-[linear-gradient(90deg,#32180d,#7a4724,#29140a)] shadow-[-5px_0_10px_rgba(0,0,0,0.46)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(112deg,rgba(255,255,255,0.08),transparent_18%,transparent_68%,rgba(255,255,255,0.025)_78%,transparent)]" aria-hidden="true" />

            <CabinetHeader />
            <CabinetShelves columns={columns} />
          </div>

          <div aria-hidden="true" className="absolute inset-x-[5%] bottom-3 h-4 rounded-b-[8px] bg-[linear-gradient(180deg,#70401f,#32190d)] shadow-[0_8px_12px_rgba(0,0,0,0.32)]" />
          <div aria-hidden="true" className="absolute bottom-0 left-[8%] h-4 w-10 rounded-b bg-[#32190d]" />
          <div aria-hidden="true" className="absolute bottom-0 right-[8%] h-4 w-10 rounded-b bg-[#32190d]" />
        </div>

        {showPlant ? <CabinetPlant /> : null}
      </div>
    </section>
  );
}

function CabinetHeader() {
  return (
    <header className="relative border-b-[10px] border-[#4a2815] bg-[radial-gradient(circle_at_50%_0%,#5a371f_0%,#28150c_72%)] px-4 pb-5 pt-6 text-center shadow-[inset_0_-2px_#9e6733,0_7px_13px_rgba(0,0,0,0.46)] sm:pt-7">
      <div className="mx-auto max-w-[520px] border border-[#c9a65f]/55 bg-[linear-gradient(180deg,#67401e,#2c180d)] px-5 py-2.5 shadow-[inset_0_1px_rgba(255,255,255,0.09),0_4px_8px_rgba(0,0,0,0.42)]">
        <h2
          id="awards-cabinet-title"
          className="text-balance text-[clamp(1.55rem,3.3vw,2.75rem)] font-semibold leading-none tracking-[-0.025em] text-[#fff1d1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 2px 6px rgba(0,0,0,0.62)" }}
        >
          Awards Cabinet
        </h2>
      </div>
    </header>
  );
}

function CabinetShelves({ columns }: { columns: CabinetColumns }) {
  const rows = Array.from({ length: Math.ceil(CERTIFICATION_AWARDS.length / columns) }, (_, rowIndex) =>
    CERTIFICATION_AWARDS.slice(rowIndex * columns, rowIndex * columns + columns),
  );

  return (
    <div className="relative bg-[linear-gradient(90deg,#211109_0%,#331c10_5%,#201008_50%,#331c10_95%,#211109_100%)] px-3 sm:px-6">
      {rows.map((row, rowIndex) => (
        <div
          key={`${columns}-${rowIndex}`}
          className="relative grid items-end gap-2 pb-8 pt-4 sm:gap-4 lg:gap-5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {row.map((award) => (
            <CertificationDisplay
              key={award.title}
              award={award}
              awardIndex={CERTIFICATION_AWARDS.indexOf(award)}
            />
          ))}
          <CabinetShelf />
        </div>
      ))}
    </div>
  );
}

function CabinetShelf() {
  return (
    <div className="pointer-events-none absolute inset-x-[-18px] bottom-0 z-20 h-8 sm:inset-x-[-28px]" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-2.5 bg-[linear-gradient(180deg,#d29a56_0%,#764320_46%,#3b1f10_100%)] shadow-[0_-1px_#e5bd7a,0_7px_11px_rgba(0,0,0,0.65)]" />
      <div className="absolute inset-x-px top-2 h-5 origin-top bg-[linear-gradient(180deg,#714022_0%,#4a2715_72%,#2b160c_100%)] shadow-[inset_0_2px_rgba(255,255,255,0.07),inset_0_-3px_rgba(0,0,0,0.48)] [clip-path:polygon(0_0,100%_0,98.8%_100%,1.2%_100%)]" />
      <div className="absolute inset-x-3 bottom-0 h-1.5 rounded-b bg-[#28140b] shadow-[0_4px_7px_rgba(0,0,0,0.55)]" />
    </div>
  );
}

function CertificationDisplay({ award, awardIndex }: { award: CertificationAward; awardIndex: number }) {
  return (
    <a
      href={award.certificateHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-[316px] min-w-0 items-end justify-center px-1 pb-0 pt-2 text-center transition-[transform,filter] duration-300 ease-out hover:-translate-y-1 hover:brightness-[1.04] focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cc77] focus-visible:ring-offset-4 focus-visible:ring-offset-[#25140c] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[334px]"
      aria-label={`Open ${award.title} certificate PDF in a new tab`}
    >
      {award.kind === "medal" ? (
        <MedalFrame award={award} medalIndex={CERTIFICATION_AWARDS.filter((item) => item.kind === "medal").indexOf(award)} />
      ) : (
        <TrophyAward award={award} awardIndex={awardIndex} />
      )}
    </a>
  );
}

function MedalFrame({ award, medalIndex }: { award: CertificationAward; medalIndex: number }) {
  const ribbon = RIBBON_STYLES[Math.max(0, medalIndex) % RIBBON_STYLES.length];
  const metalClass = {
    gold: "bg-[radial-gradient(circle_at_35%_27%,#fff1b5_0%,#d5a23c_31%,#8a5a20_66%,#f0ce79_82%,#563413_100%)] border-[#ddb75b]",
    silver: "bg-[radial-gradient(circle_at_35%_27%,#ffffff_0%,#c7ccce_32%,#747c80_67%,#eef0ef_84%,#555c60_100%)] border-[#c9ced0]",
    bronze: "bg-[radial-gradient(circle_at_35%_27%,#ffe3ba_0%,#c0794a_32%,#713b27_67%,#dfa573_84%,#4e281d_100%)] border-[#c98557]",
  }[ribbon.metal];

  return (
    <div className="relative h-[292px] w-full max-w-[248px] border-[7px] border-[#65401f] bg-[linear-gradient(135deg,#c99551_0%,#472815_13%,#28150c_50%,#6d421f_88%,#c89146_100%)] p-[5px] shadow-[inset_2px_2px_0_#ddb16a,inset_-3px_-3px_0_#31180b,0_11px_17px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out group-hover:scale-[1.012] group-focus-visible:scale-[1.012] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative h-full overflow-hidden border border-[#b99759]/55 bg-[radial-gradient(circle_at_50%_35%,#3d2d24,#17100c_73%)] shadow-[inset_0_0_18px_rgba(0,0,0,0.76)]">
        <div aria-hidden="true" className="absolute left-1/2 top-3 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-[#ad8134] bg-[#17100c]" />
        <Ribbon color={ribbon.left} side="left" />
        <Ribbon color={ribbon.right} side="right" />

        <div className={`absolute left-1/2 top-[59px] h-[134px] w-[134px] -translate-x-1/2 rounded-full border-[7px] shadow-[inset_0_0_0_3px_rgba(63,37,15,0.68),inset_0_0_0_6px_rgba(255,236,170,0.45),0_10px_14px_rgba(0,0,0,0.52)] ${metalClass}`}>
          <div className="absolute inset-[21px] overflow-hidden rounded-full border-[3px] border-white/75 bg-[#f4f1e9] shadow-[inset_0_3px_5px_rgba(0,0,0,0.17),0_2px_4px_rgba(0,0,0,0.2)]">
            <Image
              src={award.badgeSrc}
              alt={`${award.title} certification badge issued by ${award.issuer}`}
              fill
              sizes="88px"
              className="object-contain p-2"
              draggable={false}
            />
          </div>
          <MetalHighlight />
        </div>

        <div className="absolute inset-x-2 bottom-2">
          <AwardPlaque award={award} compact />
        </div>
      </div>
    </div>
  );
}

function Ribbon({ color, side }: { color: string; side: "left" | "right" }) {
  const sideClass = side === "left" ? "-translate-x-[88%] -rotate-[11deg]" : "-translate-x-[12%] rotate-[11deg]";

  return (
    <div
      aria-hidden="true"
      className={`absolute left-1/2 top-[24px] h-[84px] w-[48px] shadow-[0_6px_8px_rgba(0,0,0,0.34)] [clip-path:polygon(8%_0,92%_0,82%_100%,50%_82%,18%_100%)] ${sideClass}`}
      style={{ background: `linear-gradient(90deg,${color} 0 31%,#e7d8ac 31% 67%,${color} 67%)` }}
    />
  );
}

function TrophyAward({ award, awardIndex }: { award: CertificationAward; awardIndex: number }) {
  const variant: TrophyVariant = award.kind === "trophy" ? "cup" : (["shield", "cup", "laurel", "shield"] as const)[awardIndex % 4];
  const badgePosition = {
    cup: "top-[65px] h-[82px] w-[82px]",
    shield: "top-[61px] h-[80px] w-[80px]",
    laurel: "top-[55px] h-[82px] w-[82px]",
  }[variant];

  return (
    <div className="relative h-[304px] w-full max-w-[250px] origin-bottom transition-transform duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none">
      <TrophySilhouette variant={variant} idSuffix={`${awardIndex}-${award.kind}`} />
      <div className={`absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-[#eacb73] bg-[#f3efe4] shadow-[inset_0_3px_5px_rgba(0,0,0,0.17),0_4px_7px_rgba(0,0,0,0.32)] ${badgePosition}`}>
        <Image
          src={award.badgeSrc}
          alt={`${award.title} certification badge issued by ${award.issuer}`}
          fill
          sizes="82px"
          className="object-contain p-2.5"
          draggable={false}
        />
      </div>
      <div className="absolute inset-x-3 bottom-2 z-20">
        <AwardPlaque award={award} compact />
      </div>
    </div>
  );
}

function TrophySilhouette({ variant, idSuffix }: { variant: TrophyVariant; idSuffix: string }) {
  const reactId = useId().replace(/:/g, "");
  const goldId = `award-gold-${reactId}-${idSuffix}`;
  const darkGoldId = `award-dark-gold-${reactId}-${idSuffix}`;
  const baseId = `award-base-${reactId}-${idSuffix}`;

  return (
    <svg viewBox="0 0 250 300" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#704313" />
          <stop offset="0.18" stopColor="#f1d06c" />
          <stop offset="0.42" stopColor="#a96f22" />
          <stop offset="0.59" stopColor="#ffeaa0" />
          <stop offset="0.82" stopColor="#956019" />
          <stop offset="1" stopColor="#5b3510" />
        </linearGradient>
        <linearGradient id={darkGoldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4a948" />
          <stop offset="1" stopColor="#704419" />
        </linearGradient>
        <linearGradient id={baseId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#784422" />
          <stop offset="1" stopColor="#28140a" />
        </linearGradient>
        <filter id={`shadow-${goldId}`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.48" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${goldId})`}>
        {variant === "cup" ? <ClassicCup goldId={goldId} darkGoldId={darkGoldId} /> : null}
        {variant === "shield" ? <ShieldTrophy goldId={goldId} darkGoldId={darkGoldId} /> : null}
        {variant === "laurel" ? <LaurelTrophy goldId={goldId} darkGoldId={darkGoldId} /> : null}

        <path d="M112 183 H138 L145 225 H105 Z" fill={`url(#${goldId})`} stroke="#d2a74f" strokeWidth="2" />
        <path d="M84 222 H166 Q174 222 176 230 L178 239 H72 L74 230 Q76 222 84 222Z" fill={`url(#${darkGoldId})`} stroke="#d2a74f" strokeWidth="2" />
        <path d="M50 237 H200 Q208 237 208 245 V287 H42 V245 Q42 237 50 237Z" fill={`url(#${baseId})`} stroke="#5e3418" strokeWidth="3" />
        <path d="M48 242 H202" stroke="#a56a35" strokeWidth="2" opacity="0.72" />
      </g>
    </svg>
  );
}

function ClassicCup({ goldId, darkGoldId }: { goldId: string; darkGoldId: string }) {
  return (
    <g>
      <path d="M74 49 C44 50 37 67 41 92 C45 119 62 135 86 135" fill="none" stroke={`url(#${darkGoldId})`} strokeWidth="15" strokeLinecap="round" />
      <path d="M176 49 C206 50 213 67 209 92 C205 119 188 135 164 135" fill="none" stroke={`url(#${darkGoldId})`} strokeWidth="15" strokeLinecap="round" />
      <path d="M65 35 H185 L177 102 C173 145 154 175 125 183 C96 175 77 145 73 102Z" fill={`url(#${goldId})`} stroke="#e2bd61" strokeWidth="4" />
      <ellipse cx="125" cy="36" rx="60" ry="10" fill="#e1bb5c" stroke="#f4db85" strokeWidth="3" />
      <ellipse cx="125" cy="39" rx="51" ry="6" fill="#754718" opacity="0.74" />
      <path d="M82 59 C99 50 147 50 168 60" fill="none" stroke="#fff1ac" strokeWidth="4" strokeLinecap="round" opacity="0.42" />
    </g>
  );
}

function ShieldTrophy({ goldId, darkGoldId }: { goldId: string; darkGoldId: string }) {
  return (
    <g>
      <path d="M125 24 C149 39 172 42 191 42 V102 C191 144 162 172 125 185 C88 172 59 144 59 102 V42 C78 42 101 39 125 24Z" fill={`url(#${goldId})`} stroke="#e1bd65" strokeWidth="4" />
      <path d="M125 38 C145 49 161 52 177 52 V101 C177 132 155 154 125 167 C95 154 73 132 73 101 V52 C89 52 105 49 125 38Z" fill={`url(#${darkGoldId})`} stroke="#76501e" strokeWidth="3" />
      <path d="M83 61 C103 52 127 49 153 56" fill="none" stroke="#fff0a4" strokeWidth="4" strokeLinecap="round" opacity="0.38" />
    </g>
  );
}

function LaurelTrophy({ goldId, darkGoldId }: { goldId: string; darkGoldId: string }) {
  return (
    <g>
      <circle cx="125" cy="99" r="73" fill={`url(#${darkGoldId})`} stroke="#e0bb60" strokeWidth="5" />
      <circle cx="125" cy="99" r="51" fill="#714719" stroke="#f0d275" strokeWidth="6" />
      <g fill={`url(#${goldId})`} stroke="#f0d275" strokeWidth="1.5">
        <ellipse cx="67" cy="60" rx="9" ry="18" transform="rotate(-34 67 60)" />
        <ellipse cx="55" cy="87" rx="9" ry="18" transform="rotate(-55 55 87)" />
        <ellipse cx="55" cy="117" rx="9" ry="18" transform="rotate(-74 55 117)" />
        <ellipse cx="70" cy="144" rx="9" ry="18" transform="rotate(-110 70 144)" />
        <ellipse cx="183" cy="60" rx="9" ry="18" transform="rotate(34 183 60)" />
        <ellipse cx="195" cy="87" rx="9" ry="18" transform="rotate(55 195 87)" />
        <ellipse cx="195" cy="117" rx="9" ry="18" transform="rotate(74 195 117)" />
        <ellipse cx="180" cy="144" rx="9" ry="18" transform="rotate(110 180 144)" />
      </g>
      <path d="M85 42 C106 29 143 27 165 42" fill="none" stroke="#fff0a5" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
    </g>
  );
}

function MetalHighlight() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-1 overflow-hidden rounded-full">
      <span className="absolute left-[16%] top-[9%] h-[34%] w-[14%] -rotate-[24deg] rounded-full bg-white/28 blur-[1px] transition-opacity duration-300 group-hover:opacity-80 motion-reduce:transition-none" />
    </span>
  );
}

function AwardPlaque({ award, compact = false }: { award: CertificationAward; compact?: boolean }) {
  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center border border-[#d6b76e] bg-[linear-gradient(180deg,#ead391_0%,#bb873f_54%,#865525_100%)] px-3 text-[#241309] shadow-[inset_0_1px_rgba(255,255,255,0.48),0_3px_6px_rgba(0,0,0,0.36)] ${compact ? "min-h-[60px] py-1.5" : "min-h-[68px] py-2"}`}
    >
      <span aria-hidden="true" className="absolute left-1.5 top-1.5 h-1 w-1 rounded-full bg-[#583418] shadow-[inset_0_1px_#e7cb83]" />
      <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-[#583418] shadow-[inset_0_1px_#e7cb83]" />
      <p className="max-w-full truncate text-[7px] font-bold uppercase tracking-[0.08em] text-[#3b210f]">{award.issuer}</p>
      <h3 className="mt-0.5 line-clamp-2 max-w-full text-[10px] font-semibold leading-[1.12] text-[#211208]">{award.title}</h3>
      <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-[#543019]">{award.issued}</p>
    </div>
  );
}

function CabinetPlant() {
  return (
    <div className="relative z-[2] mb-1 h-[530px] w-[142px] shrink-0" aria-hidden="true">
      <svg viewBox="0 0 150 540" className="h-full w-full overflow-visible drop-shadow-[0_9px_7px_rgba(31,49,29,0.18)]">
        <defs>
          <linearGradient id="plant-stem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#31432e" />
            <stop offset="0.5" stopColor="#82935a" />
            <stop offset="1" stopColor="#2d402e" />
          </linearGradient>
          <linearGradient id="plant-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9ebd70" />
            <stop offset="0.48" stopColor="#5f844e" />
            <stop offset="1" stopColor="#294334" />
          </linearGradient>
          <linearGradient id="plant-pot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#67331f" />
            <stop offset="0.45" stopColor="#c57449" />
            <stop offset="1" stopColor="#5b2d1d" />
          </linearGradient>
        </defs>

        <ellipse cx="75" cy="527" rx="58" ry="10" fill="#4a3524" opacity="0.3" />
        <path d="M56 487 H94 L101 525 H49Z" fill="url(#plant-pot)" stroke="#63321e" strokeWidth="2" />
        <ellipse cx="75" cy="488" rx="27" ry="7" fill="#3a2a1c" stroke="#965535" strokeWidth="4" />

        {[
          "M68 487 C66 396 62 292 39 172",
          "M75 487 C72 376 76 260 75 95",
          "M82 487 C86 394 95 304 116 190",
          "M73 487 C68 397 52 330 23 265",
          "M78 487 C84 399 106 344 133 290",
        ].map((path) => (
          <path key={path} d={path} fill="none" stroke="url(#plant-stem)" strokeLinecap="round" strokeWidth="5" />
        ))}

        {[
          "M39 172 C14 143 4 115 10 83 C33 103 48 127 39 172Z",
          "M39 172 C23 167 11 174 3 194 C22 190 36 184 39 172Z",
          "M75 95 C53 70 48 43 57 17 C75 40 84 64 75 95Z",
          "M75 95 C94 62 115 48 139 51 C120 75 100 91 75 95Z",
          "M116 190 C129 153 143 136 149 108 C124 126 112 151 116 190Z",
          "M116 190 C132 184 142 191 148 211 C130 205 119 199 116 190Z",
          "M23 265 C7 238 3 213 10 190 C29 212 35 236 23 265Z",
          "M23 265 C39 251 55 249 72 261 C50 274 34 276 23 265Z",
          "M133 290 C145 261 149 239 143 219 C126 239 122 264 133 290Z",
          "M133 290 C115 274 96 274 78 287 C100 298 118 300 133 290Z",
        ].map((path) => (
          <path key={path} d={path} fill="url(#plant-leaf)" stroke="#284132" strokeLinejoin="round" strokeWidth="1.3" />
        ))}
      </svg>
    </div>
  );
}
