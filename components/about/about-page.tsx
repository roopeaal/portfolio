import Link from "next/link";
import { AboutHero } from "@/components/about/about-hero";
import { AboutIntro } from "@/components/about/about-intro";
import { TechStack3D } from "@/components/about/tech-stack-3d";
import { profile } from "@/content/profile";

const navigation = [
  { label: "Topology", href: "/" },
  { label: "About", href: "/about", current: true },
  { label: "Projects", href: "/?panel=projects" },
  { label: "Contact", href: "/?panel=contact" },
];

export function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071014] text-[#eef6f5]">
      <div
        className="pointer-events-none fixed inset-0 opacity-55"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 15%, rgba(58,155,151,0.16), transparent 31%), radial-gradient(circle at 86% 9%, rgba(213,151,69,0.11), transparent 28%), linear-gradient(rgba(134,189,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(134,189,184,0.035) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 52px 52px, 52px 52px",
        }}
      />

      <header className="relative z-20 border-b border-white/10 bg-[#071014]/88 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-[1240px] items-center justify-between gap-2 px-4 py-3 sm:gap-5 sm:px-8">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82d6cd]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#75c8c0]/45 bg-[#102429] font-mono text-[11px] font-bold tracking-[-0.08em] text-[#9ee6de] transition group-hover:border-[#9ee6de]">
              RA
            </span>
            <span className="min-w-0 max-[480px]:hidden">
              <span className="block truncate text-sm font-semibold tracking-[-0.02em] text-white">{profile.name}</span>
              <span className="block truncate text-[10px] uppercase tracking-[0.2em] text-[#78949a]">ICT Engineering</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={`shrink-0 rounded-full px-2.5 py-2 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82d6cd] sm:px-4 sm:text-xs ${
                  item.current
                    ? "bg-[#d7eee9] text-[#092126]"
                    : "text-[#9eb2b5] hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10">
        <AboutHero />
        <AboutIntro />
        <TechStack3D />

        <section className="px-5 pb-20 pt-4 sm:px-8 sm:pb-24">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 rounded-[28px] border border-[#79cfc5]/20 bg-[linear-gradient(135deg,rgba(25,58,61,0.7),rgba(9,24,29,0.88))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#81cbc3]">Current direction</p>
              <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                Looking for a role where practical work and careful technical thinking matter.
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/?panel=projects"
                className="rounded-full bg-[#d7eee9] px-5 py-3 text-sm font-bold text-[#092126] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82d6cd]"
              >
                View projects
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82d6cd]"
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
