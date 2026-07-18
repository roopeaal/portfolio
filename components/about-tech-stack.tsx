"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { TECH_STACK_SKILLS } from "@/components/about-tech-stack/skill-textures";
import { TechStack3D } from "@/components/about-tech-stack/tech-stack-3d";

const TECHSTACK_SUBTITLE =
  "Tools and technologies I use when building, testing, and understanding real systems.";

export function MyTechstack() {
  const prefersReducedMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const sync = () => setCompact(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <section
      className="relative isolate h-full min-h-[540px] overflow-hidden bg-[#050809] text-white sm:min-h-[560px]"
      aria-labelledby="techstack-title"
      aria-describedby="techstack-description"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_66%,rgba(79,154,145,0.22),transparent_34%),radial-gradient(circle_at_14%_10%,rgba(121,192,184,0.09),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(117,144,153,0.08),transparent_25%),linear-gradient(180deg,#0b0f10_0%,#050809_48%,#020405_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[4%] top-[46%] h-px bg-gradient-to-r from-transparent via-[#8bc5be]/15 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[14px] border border-white/[0.075] sm:inset-5"
      />

      <header className="pointer-events-none absolute inset-x-6 top-7 z-[3] sm:inset-x-11 sm:top-9">
        <div className="mx-auto flex max-w-[1060px] items-start justify-between gap-8">
          <div className="max-w-[760px]">
            <p className="mb-3 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#98d0ca]/75 sm:text-[10px]">
              <span className="h-px w-8 bg-[#78bdb5]/70" />
              Interactive systems toolkit
            </p>
            <h2
              id="techstack-title"
              className="text-[clamp(2.4rem,6vw,5.25rem)] font-light leading-[0.92] tracking-[-0.035em] text-white/95"
            >
              My Techstack
            </h2>
            <p
              id="techstack-description"
              className="mt-4 max-w-[670px] text-[clamp(0.78rem,1.3vw,0.95rem)] leading-5 text-white/62 sm:leading-6"
            >
              {TECHSTACK_SUBTITLE}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 pt-4 text-right md:flex" aria-hidden="true">
            <span className="relative grid h-3 w-3 place-items-center">
              <span className="absolute h-3 w-3 rounded-full border border-[#84c7bf]/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#78bdb5] shadow-[0_0_10px_rgba(120,189,181,0.75)]" />
            </span>
            <span>
              <strong className="block text-sm font-medium tabular-nums text-white/85">
                {TECH_STACK_SKILLS.length}
              </strong>
              <small className="block text-[8px] uppercase tracking-[0.22em] text-white/42">
                Core technologies
              </small>
            </span>
          </div>
        </div>
      </header>

      <div
        className="absolute inset-x-0 bottom-10 top-[158px] z-[2] sm:bottom-11 sm:top-[172px] lg:top-[178px]"
        role="img"
        aria-label={`Interactive three-dimensional collection of ${TECH_STACK_SKILLS.length} technologies`}
      >
        {prefersReducedMotion ? <StaticSkillCloud /> : <TechStack3D compact={compact} />}
      </div>

      <ul className="sr-only">
        {TECH_STACK_SKILLS.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>

      <footer className="pointer-events-none absolute inset-x-6 bottom-5 z-[3] flex items-center justify-between text-[8px] font-medium uppercase tracking-[0.2em] text-white/42 sm:inset-x-11">
        <span className="hidden sm:inline">Frontend · Infrastructure · Security · Embedded</span>
        <span className="mx-auto flex items-center gap-2 sm:mx-0">
          <span className="h-1 w-1 rounded-full bg-[#78bdb5]" />
          {prefersReducedMotion ? "Motion reduced" : compact ? "Touch to interact" : "Move pointer to interact"}
        </span>
      </footer>
    </section>
  );
}

function StaticSkillCloud() {
  return (
    <div className="grid h-full place-items-center px-5 py-3 sm:px-10">
      <ul className="grid w-full max-w-[860px] grid-cols-4 place-items-center gap-x-2 gap-y-3 sm:grid-cols-7 sm:gap-x-4 sm:gap-y-5">
        {TECH_STACK_SKILLS.map((skill) => (
          <li
            key={skill.name}
            className="grid aspect-square w-[clamp(62px,9vw,104px)] place-items-center rounded-full bg-[radial-gradient(circle_at_31%_24%,#d8dfdd_0%,#9da7a5_31%,#505a59_61%,#171d1e_100%)] p-[5px] text-center shadow-[inset_7px_8px_10px_rgba(255,255,255,0.18),inset_-7px_-8px_10px_rgba(0,0,0,0.32)]"
          >
            <span
              className="grid h-[74%] w-[74%] place-items-center rounded-full bg-[#f5f7f6] px-1.5 text-[#11191a]"
              style={{ boxShadow: `inset 0 0 0 2px ${skill.accent}` }}
            >
              <span>
                <strong className="block text-[clamp(0.78rem,1.7vw,1.05rem)] font-black leading-none text-[#11191a]">
                  {skill.shortName}
                </strong>
                <small className="mt-1 block max-w-[76px] text-[6px] font-bold uppercase leading-[1.05] text-[#263032] sm:text-[7px]">
                  {skill.name}
                </small>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
