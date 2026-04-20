"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";

export interface PanelSidebarItem {
  id: string;
  label: string;
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


function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#d8d8d8] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f87a6]">{label}</div>
      <div className="mt-1 text-[11px] font-medium text-[#1f2a37]">{value}</div>
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

  const focusItems = [
    "Networking",
    "Linux",
    "Cloud",
    "IoT",
    "Practical troubleshooting",
  ];

  if (preview) {
    return (
      <div className="h-full overflow-hidden rounded-[12px] border border-[#c4d4e8] bg-[linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)] p-3 text-[#17355d]">
        <div className="rounded-[10px] border border-[#cfdded] bg-white px-3 py-2 shadow-[0_10px_22px_rgba(23,53,91,0.08)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5f7ea4]">About Me</p>
          <h3 className="mt-1.5 text-[18px] font-semibold leading-tight text-[#123e70]">Practical ICT profile</h3>
          <p className="mt-2 text-[11px] leading-5 text-[#4d678a]">{profile.aboutIntro}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {focusItems.slice(0, 4).map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden rounded-[14px] border border-[#c4d4e8] bg-[linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)] p-3 text-[#1d2f46]">
      <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-3">
        <section className="rounded-[12px] border border-[#bfd2e8] bg-[linear-gradient(120deg,#fafdff_0%,#eef4fd_52%,#e4eefb_100%)] p-4 shadow-[0_14px_26px_rgba(23,53,91,0.08)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f7ea4]">About Me</p>
          <h2 className="mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[0.95] tracking-[-0.02em] text-[#123e70]">
            Hands-on
            <span className="block text-[#3d6da5]">ICT builder.</span>
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#4f6a8d]">{profile.aboutIntro}</p>
        </section>

        <div className="flex flex-wrap gap-1.5">
          {focusItems.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>

        <div className="grid min-h-0 gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[12px] border border-[#cfddeb] bg-white p-3 shadow-[0_10px_20px_rgba(23,53,91,0.06)]">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5f7ea4]">Tausta lyhyesti</h3>
            <p className="mt-2 text-[13px] leading-6 text-[#355171]">{profile.aboutBody[0]}</p>
            <p className="mt-2 text-[13px] leading-6 text-[#355171]">{profile.aboutBody[1]}</p>
          </section>

          <section className="rounded-[12px] border border-[#cfddeb] bg-white p-3 shadow-[0_10px_20px_rgba(23,53,91,0.06)]">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5f7ea4]">Työtapa</h3>
            <div className="mt-2 space-y-2">
              {[
                "Opin nopeasti ja vien asiat käytännön tasolle.",
                "Rakennan, testaan ja korjaan järjestelmällisesti.",
                "Dokumentoin niin, että työn tulos on toistettavissa.",
                "Otan vastuuta toteutuksen laadusta alusta loppuun.",
              ].map((item) => (
                <div key={item} className="rounded-[9px] border border-[#d8e4f1] bg-[#f7fafe] px-3 py-2 text-[12px] leading-5 text-[#31506f]">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-[9px] border border-[#d8e4f1] bg-[#f4f8fd] px-3 py-2 text-[12px] leading-5 text-[#365577]">
              {profile.aboutBody[2]}
            </p>
          </section>
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

  if (preview) {
    return (
      <div className="space-y-3 text-[11px] leading-5 text-[#202020]">
        <FieldCard label="Section" value="Projects" />
        <section className="rounded border border-[#dfdfdf] bg-white p-3">
          <p>Projects are presented as engineering case studies with objective, scope, implementation, validation and result.</p>
        </section>
        <div className="space-y-3">
          {projects.slice(0, 2).map((project) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => onSelectProject?.(project.slug)}
              className="block w-full rounded border border-[#dfdfdf] bg-white p-3 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-black">{project.title}</p>
                <span className="rounded border border-[#d8d8d8] bg-[#f7f7f7] px-2 py-1 text-[11px] text-[#8f8f8f]">{project.category}</span>
              </div>
              <p className="mt-2 text-black">{project.summary}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-4 text-[13px] leading-6 text-[#1f2937]">
        <FieldCard label="Section" value="Projects" />

        <section className="rounded border border-[#dcdcdc] bg-white p-4">
          <h2 className="text-base font-semibold text-[#111827]">Project overview</h2>
          <p className="mt-3">
            These entries are structured as engineering case studies instead of blog cards. The focus is on objective, scope, implementation,
            validation and what the work actually demonstrates for infrastructure, networking, Linux, cloud and security-oriented roles.
          </p>
          <p className="mt-3 rounded border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#4b5563]">
            Compact credibility statement: these are student and lab-oriented implementation cases, not inflated production claims.
          </p>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          {projects.map((project) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => onSelectProject?.(project.slug)}
              className="group rounded border border-[#dcdcdc] bg-white p-4 text-left shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:border-[#b9c4d0] hover:bg-[#fcfcfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b96a8]">Engineering case study</p>
                  <h3 className="mt-2 text-[17px] font-semibold text-[#111827]">{project.title}</h3>
                </div>
                <Tag>{project.category}</Tag>
              </div>
              <p className="mt-3 text-[14px] leading-6 text-[#334155]">{project.summary}</p>
              <div className="mt-4 rounded border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-[13px] text-[#475569]">
                <span className="font-medium text-[#111827]">Objective:</span> {project.objective}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.slice(0, 4).map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const index = projects.findIndex((project) => project.slug === selectedProject.slug);
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <div className="space-y-4 text-[13px] leading-6 text-[#1f2937]">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onShowOverview}
          className="rounded border border-[#d7d7d7] bg-[#f7f7f7] px-3 py-1.5 text-[12px] text-[#4b5563] transition hover:bg-[#efefef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
        >
          ← Back to all projects
        </button>
        <Tag>{selectedProject.category}</Tag>
      </div>

      <section className="rounded border border-[#dcdcdc] bg-white p-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b96a8]">Project detail view</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">{selectedProject.title}</h2>
        <p className="mt-3 text-[15px] leading-7 text-[#334155]">{selectedProject.summary}</p>
      </section>

      <FieldCard label="Objective" value={selectedProject.objective} />
      <FieldCard label="Technical scope" value={selectedProject.technicalScope} />
      <FieldCard label="Environment / tools / stack" value={selectedProject.environment} />
      <FieldCard label="Implementation" value={selectedProject.implementation} />
      <FieldCard label="Validation / testing / evidence" value={selectedProject.validation} />
      <FieldCard label="Result / outcome" value={selectedProject.result} />
      <FieldCard label="What I learned" value={selectedProject.learned} />

      <section className="rounded border border-[#dcdcdc] bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#516074]">Evidence points</h3>
        <ul className="mt-3 space-y-2">
          {selectedProject.evidence.map((item) => (
            <li key={item} className="rounded border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-[13px] text-[#334155]">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        {selectedProject.stack.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {previous ? (
          <button
            type="button"
            onClick={() => onSelectProject?.(previous.slug)}
            className="rounded border border-[#d7d7d7] bg-[#f7f7f7] px-3 py-1.5 text-[12px] text-[#4b5563] transition hover:bg-[#efefef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
          >
            ← {previous.title}
          </button>
        ) : null}
        {next ? (
          <button
            type="button"
            onClick={() => onSelectProject?.(next.slug)}
            className="rounded border border-[#d7d7d7] bg-[#f7f7f7] px-3 py-1.5 text-[12px] text-[#4b5563] transition hover:bg-[#efefef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
          >
            {next.title} →
          </button>
        ) : null}
      </div>
    </div>
  );
}



export function ContactPanelContent({
  section = "channels",
  preview = false,
}: {
  section?: "channels" | "roles" | "cv" | "status";
  preview?: boolean;
}) {
  void section;

  if (preview) {
    return (
      <div className="h-full overflow-hidden rounded-[12px] border border-[#bfd0e5] bg-[linear-gradient(180deg,#f5f8fd_0%,#e8f0fb_100%)] p-3 text-[#122845]">
        <div className="flex h-full flex-col justify-between rounded-[10px] border border-[#d0deee] bg-white/92 p-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5f7ea4]">Contact</p>
            <h3 className="mt-2 text-[18px] font-semibold leading-tight text-[#143862]">Let&apos;s build something great together.</h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <SocialLogoLink href="https://www.linkedin.com/in/roope-aaltonen/" label="LinkedIn">
                <LinkedInGlyph />
              </SocialLogoLink>
              <SocialLogoLink href="https://facebook.com/roope_aaltonen" label="Instagram">
                <InstagramGlyph />
              </SocialLogoLink>
              <SocialLogoLink href="https://facebook.com/roope.aaltonen.5" label="Facebook">
                <FacebookGlyph />
              </SocialLogoLink>
              <SocialLogoLink href="https://github.com/roopeaal" label="GitHub">
                <GitHubGlyph />
              </SocialLogoLink>
            </div>
            <a
              href="mailto:roope.aa@hotmail.com?subject=Quick%20hello%20from%20your%20portfolio"
              className="inline-flex rounded-[10px] border border-[#7f9fc5] bg-[#1a4f86] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#2364a6]"
            >
              Open message draft
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden rounded-[14px] border border-[#c4d4e8] bg-[linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)] p-3 text-[#132742]">
      <div className="mx-auto grid h-full max-w-[1140px] grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] gap-3">
        <div className="flex h-full min-h-0 flex-col rounded-[14px] border border-[#ccdbec] bg-white p-4 shadow-[0_18px_34px_rgba(23,53,91,0.08)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f7ea4]">Contact Me</p>
          <h2 className="mt-2 text-[clamp(2rem,4.1vw,3.9rem)] leading-[0.92] tracking-[-0.03em]">
            <span className="block font-light text-[#3769a0]">Let&apos;s build</span>
            <span className="block font-light text-[#3769a0]">something</span>
            <span className="block font-semibold text-[#123e70]">great together.</span>
          </h2>

          <p className="mt-2 max-w-[52ch] text-[13px] leading-5 text-[#597497]">
            Lähetä viesti suoraan lomakkeella. Vastaan sekä työmahdollisuuksiin että projektikysymyksiin.
          </p>

          <form
            action="mailto:roope.aa@hotmail.com"
            method="post"
            encType="text/plain"
            className="mt-3 flex min-h-0 flex-1 flex-col gap-2"
          >
            <input
              name="Name"
              type="text"
              placeholder="Name"
              className="w-full rounded-[11px] border border-[#c0d2e7] bg-[#f4f8fe] px-3 py-2.5 text-[14px] text-[#173861] placeholder:text-[#7f97b8] outline-none transition focus:border-[#6d96c6] focus:bg-white"
            />
            <input
              name="Email"
              type="email"
              placeholder="Email"
              className="w-full rounded-[11px] border border-[#c0d2e7] bg-[#f4f8fe] px-3 py-2.5 text-[14px] text-[#173861] placeholder:text-[#7f97b8] outline-none transition focus:border-[#6d96c6] focus:bg-white"
            />
            <textarea
              name="Message"
              placeholder="Write your message..."
              className="min-h-0 flex-1 rounded-[12px] border border-[#c0d2e7] bg-[#f4f8fe] px-3 py-2.5 text-[14px] leading-6 text-[#173861] placeholder:text-[#7f97b8] outline-none transition focus:border-[#6d96c6] focus:bg-white"
            />

            <div className="pt-0.5">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[10px] border border-[#8eaed1] bg-white px-4 py-1.5 text-[12px] font-medium text-[#214a7c] transition hover:bg-[#f0f6ff]"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        <aside className="flex h-full min-h-0 flex-col rounded-[14px] border border-[#ccdbec] bg-white p-4 shadow-[0_18px_34px_rgba(23,53,91,0.08)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f7ea4]">Connect</p>
          <h3 className="mt-2 text-[35px] leading-[1.04] tracking-[-0.02em] text-[#123e70]">Find me online</h3>

          <div className="mt-3 flex flex-wrap gap-2.5">
            <SocialLogoLink href="https://www.linkedin.com/in/roope-aaltonen/" label="LinkedIn">
              <LinkedInGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://facebook.com/roope_aaltonen" label="Instagram">
              <InstagramGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://facebook.com/roope.aaltonen.5" label="Facebook">
              <FacebookGlyph />
            </SocialLogoLink>
            <SocialLogoLink href="https://github.com/roopeaal" label="GitHub">
              <GitHubGlyph />
            </SocialLogoLink>
          </div>

          <div className="mt-4 space-y-2">
            <ContactInfoRow label="Phone" value="040 528 3008" href="tel:+358405283008" />
            <ContactInfoRow label="Email" value="roope.aa@hotmail.com" href="mailto:roope.aa@hotmail.com" />
            <ContactInfoRow label="Location" value="Vantaa, Hämeenkylä" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ContactInfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-[10px] uppercase tracking-[0.17em] text-[#6485ac]">{label}</p>
      <p className="mt-1 text-[14px] font-medium text-[#153a66]">{value}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-[11px] border border-[#c1d3e8] bg-[#f4f8fe] px-3 py-2.5 transition hover:border-[#8eaecf] hover:bg-[#eaf2fd]"
      >
        {content}
      </a>
    );
  }

  return <div className="rounded-[11px] border border-[#c1d3e8] bg-[#f4f8fe] px-3 py-2.5">{content}</div>;
}

function SocialLogoLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#9eb7d6] bg-[#edf3fc] text-[#1d4f88] transition hover:-translate-y-[1px] hover:border-[#6f95c2] hover:bg-[#e1ebf9]"
    >
      <span className="h-5 w-5">{children}</span>
    </a>
  );
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.2" cy="8.1" r="1.2" fill="currentColor" />
      <path d="M7.2 10.3V16.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11.2 16.8V12.7C11.2 11.9 11.8 11.3 12.6 11.3C13.4 11.3 14 11.9 14 12.7V16.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <path
        d="M14.2 7.1H16.3V4.2H14.1C11.7 4.2 10.4 5.6 10.4 8.1V10H8.7V12.8H10.4V19.4H13.4V12.8H15.8L16.2 10H13.4V8.4C13.4 7.6 13.7 7.1 14.2 7.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full" aria-hidden="true">
      <path d="M12 3.2C7 3.2 3 7.3 3 12.3C3 16.3 5.6 19.6 9.1 20.8C9.5 20.9 9.6 20.7 9.6 20.4V18.9C7.6 19.3 7.1 18 7.1 18C6.8 17.1 6.2 16.8 6.2 16.8C5.4 16.3 6.3 16.3 6.3 16.3C7.2 16.4 7.7 17.2 7.7 17.2C8.5 18.6 9.8 18.1 10.4 17.8C10.5 17.2 10.8 16.9 11 16.7C9.2 16.5 7.3 15.8 7.3 12.8C7.3 12 7.6 11.2 8.1 10.7C8 10.5 7.7 9.7 8.2 8.6C8.2 8.6 9 8.3 10.4 9.3C11.1 9.1 11.8 9 12.5 9C13.2 9 13.9 9.1 14.6 9.3C16 8.3 16.8 8.6 16.8 8.6C17.3 9.7 17 10.5 16.9 10.7C17.4 11.2 17.7 12 17.7 12.8C17.7 15.8 15.8 16.5 14 16.7C14.3 17 14.6 17.5 14.6 18.3V20.4C14.6 20.7 14.7 20.9 15.1 20.8C18.6 19.6 21.2 16.3 21.2 12.3C21.2 7.3 17.2 3.2 12 3.2Z" />
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
