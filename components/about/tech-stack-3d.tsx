"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

const TechStackCanvas = dynamic(
  () => import("@/components/about/tech-stack-canvas").then((module) => module.TechStackCanvas),
  {
    ssr: false,
    loading: () => <TechStackLoading />,
  },
);

export type TechSkill = {
  name: string;
  shortLabel: string;
  category: "Software" | "Systems" | "Cloud" | "Connected";
  color: string;
  radius: number;
  position: [number, number, number];
};

export const TECH_SKILLS: TechSkill[] = [
  { name: "TypeScript", shortLabel: "TS", category: "Software", color: "#4b9bd7", radius: 0.84, position: [-4.4, 1.8, 0.2] },
  { name: "React", shortLabel: "React", category: "Software", color: "#68c9d8", radius: 0.74, position: [-2.4, -1.9, 0.1] },
  { name: "Python", shortLabel: "Py", category: "Software", color: "#d5b34d", radius: 0.82, position: [0.2, 2.2, -0.2] },
  { name: "Git", shortLabel: "Git", category: "Software", color: "#c96e56", radius: 0.63, position: [4.1, 1.4, 0.2] },
  { name: "REST APIs", shortLabel: "API", category: "Software", color: "#91a8b5", radius: 0.68, position: [2.8, -2.1, -0.1] },
  { name: "Docker", shortLabel: "Docker", category: "Cloud", color: "#397ebc", radius: 0.78, position: [-0.8, -2.4, 0.15] },
  { name: "Azure", shortLabel: "Azure", category: "Cloud", color: "#4b91c4", radius: 0.72, position: [4.5, -0.8, -0.15] },
  { name: "Android", shortLabel: "Android", category: "Systems", color: "#75a86a", radius: 0.8, position: [-4.5, -0.7, -0.1] },
  { name: "Networking", shortLabel: "NET", category: "Systems", color: "#5aa69f", radius: 0.9, position: [2.4, 1.8, 0.1] },
  { name: "Cybersecurity", shortLabel: "SEC", category: "Systems", color: "#a76d62", radius: 0.84, position: [-1.8, 1.2, -0.1] },
  { name: "Testing", shortLabel: "TEST", category: "Systems", color: "#9c8a60", radius: 0.68, position: [1.2, -0.4, 0.1] },
  { name: "MQTT", shortLabel: "MQTT", category: "Connected", color: "#7d709f", radius: 0.68, position: [-3.3, 0.2, 0.15] },
  { name: "Raspberry Pi", shortLabel: "RPI", category: "Connected", color: "#a85f77", radius: 0.78, position: [3.1, 0.3, 0.1] },
  { name: "IoT", shortLabel: "IoT", category: "Connected", color: "#4e9d91", radius: 0.76, position: [0, 0.5, 0.2] },
];

const categoryLabels = [
  { label: "Software", color: "#68c9d8" },
  { label: "Systems", color: "#75a86a" },
  { label: "Cloud", color: "#4b91c4" },
  { label: "Connected", color: "#a85f77" },
];

function subscribeToClientReady() {
  return () => {};
}

export function TechStack3D() {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeToClientReady, () => true, () => false);

  return (
    <section id="tech-stack" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#76cfc6]">Interactive systems map</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">Tech Stack</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#8fa6a9] sm:text-right">
            A working toolkit rather than a keyword wall. Move the pointer through the field to disturb the system.
          </p>
        </div>

        <div className="relative mt-9 overflow-hidden rounded-[28px] border border-[#78c9c0]/20 bg-[#050c10] shadow-[0_34px_100px_rgba(0,0,0,0.42)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 48%, rgba(72,157,151,0.17), transparent 34%), radial-gradient(circle at 16% 18%, rgba(83,142,171,0.11), transparent 28%), linear-gradient(rgba(120,183,177,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(120,183,177,0.055) 1px, transparent 1px)",
              backgroundSize: "auto, auto, 38px 38px, 38px 38px",
            }}
          />
          <div className="relative h-[430px] sm:h-[510px] lg:h-[580px]">
            {!mounted ? <TechStackLoading /> : shouldReduceMotion ? <StaticTechStack /> : <TechStackCanvas skills={TECH_SKILLS} />}
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/[0.08] bg-[#071115]/90 px-5 py-4">
            {categoryLabels.map((category) => (
              <span key={category.label} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#899ea1]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color, boxShadow: `0 0 10px ${category.color}` }} />
                {category.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticTechStack() {
  return (
    <div className="grid h-full grid-cols-2 content-center gap-3 overflow-y-auto p-5 sm:grid-cols-3 sm:p-8 lg:grid-cols-4">
      {TECH_SKILLS.map((skill) => (
        <div
          key={skill.name}
          className="flex min-h-20 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3"
        >
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[10px] font-black text-[#071014]"
            style={{ backgroundColor: skill.color }}
          >
            {skill.shortLabel}
          </span>
          <span>
            <strong className="block text-xs text-white">{skill.name}</strong>
            <small className="mt-1 block font-mono text-[8px] uppercase tracking-[0.14em] text-[#6f898d]">{skill.category}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function TechStackLoading() {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#769397]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#7ed2ca]" />
        Initialising system
      </div>
    </div>
  );
}
