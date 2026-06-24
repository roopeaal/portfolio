import Link from "next/link";
import { profile } from "@/content/profile";

const focusAreas = ["IoT", "Networks", "Testing", "Cloud", "Android", "Security"];

export function AboutHero() {
  return (
    <section className="px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-end">
        <div>
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-12 bg-[#76cfc6]" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-[#82d6cd]">Profile / Systems / 01</p>
          </div>

          <h1 className="max-w-4xl text-[clamp(4rem,12vw,9.5rem)] font-black leading-[0.78] tracking-[-0.09em] text-white">
            About
            <span className="block bg-[linear-gradient(90deg,#d8efea,#7fcac2_62%,#d6a55f)] bg-clip-text text-transparent">Me.</span>
          </h1>

          <p className="mt-9 max-w-3xl text-lg leading-8 text-[#b1c1c3] sm:text-xl sm:leading-9">
            I&apos;m an ICT engineering student who enjoys building, testing and understanding real technical systems, especially where software,
            devices and networks meet.
          </p>

          <div className="mt-7 flex flex-wrap gap-2" aria-label="Focus areas">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-[#6fbdb5]/25 bg-[#102328]/80 px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b8d7d4]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#4eb9ad]/10 blur-3xl" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#718f93]">Status</p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.025em] text-white">{profile.headline}</p>
          <p className="mt-2 text-sm leading-6 text-[#91a8ab]">{profile.subheadline}</p>

          <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-white/10 pt-6">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#718f93]">Progress</dt>
              <dd className="mt-1 text-base font-semibold text-[#d7e9e6]">{profile.completedEcts}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#718f93]">Location</dt>
              <dd className="mt-1 text-base font-semibold text-[#d7e9e6]">{profile.location}</dd>
            </div>
          </dl>

          <Link
            href="/?panel=about"
            className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8ed8d0] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82d6cd]"
          >
            Open interactive profile
            <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}
