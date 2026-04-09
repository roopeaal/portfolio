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
  if (preview) {
    return (
      <div className="space-y-3 text-[11px] leading-5 text-[#202020]">
        <FieldCard label="Section" value="About" />
        <section className="rounded border border-[#dfdfdf] bg-white p-3">
          <p>{profile.aboutIntro}</p>
        </section>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.strengths.slice(0, 4).map((item) => (
            <SimpleTile key={item}>{item}</SimpleTile>
          ))}
        </div>
      </div>
    );
  }

  const activeSection = section ?? "profile";

  return (
    <div className="space-y-4 text-[13px] leading-6 text-[#1f2937]">
      {activeSection === "profile" ? (
        <>
          <FieldCard label="Section" value="About" />
          <FieldCard label="Role direction" value={profile.contactNotes.roleFocus} />
          <section className="rounded border border-[#dcdcdc] bg-white p-4">
            <h2 className="text-base font-semibold text-[#111827]">Grounded junior profile with a clear technical direction</h2>
            <p className="mt-3">{profile.aboutIntro}</p>
            <div className="mt-4 space-y-3">
              {profile.aboutBody.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "direction" ? (
        <>
          <FieldCard label="Working style" value="Practical, implementation-oriented and documentation-driven" />
          <FieldCard label="What I want to build on" value="Infrastructure, networking, Linux, cloud foundations and cybersecurity" />
          <section className="rounded border border-[#dcdcdc] bg-white p-4">
            <h2 className="text-base font-semibold text-[#111827]">What I bring into a junior role</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {profile.strengths.map((item) => (
                <SimpleTile key={item}>{item}</SimpleTile>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "studies" ? (
        <>
          <FieldCard label="Degree" value={`${profile.headline} · ${profile.completedEcts}`} />
          <FieldCard label="Major" value="Smart IoT Systems: IoT and Networks" />
          <section className="rounded border border-[#dcdcdc] bg-white p-4">
            <h2 className="text-base font-semibold text-[#111827]">Study signals relevant to infrastructure and systems work</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {profile.studyHighlights.map((item) => (
                <SimpleTile key={item}>{item}</SimpleTile>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.trustSignals.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "reliability" ? (
        <>
          <FieldCard label="Work background signal" value="Operational reliability and follow-through" />
          <FieldCard label="Transfer value" value="Process discipline, ERP usage, accuracy, responsibility and teamwork" />
          <section className="rounded border border-[#dcdcdc] bg-white p-4">
            <h2 className="text-base font-semibold text-[#111827]">Why the non-IT work still matters</h2>
            <p className="mt-3">{profile.workCredibility.body}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Finishes operational work carefully instead of casually",
                "Used to repeatable process steps and accuracy requirements",
                "Comfortable taking responsibility for practical day-to-day execution",
                "Useful foundation for trainee and junior environments where reliability matters",
              ].map((item) => (
                <SimpleTile key={item}>{item}</SimpleTile>
              ))}
            </div>
          </section>
        </>
      ) : null}
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
      <div className="h-full overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_42%,#ecfeff_100%)] p-4 text-[#0f172a]">
        <div className="flex h-full flex-col justify-between rounded-[12px] border border-white/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600">Contact</p>
            <h3 className="mt-2 text-[20px] font-semibold leading-tight">Message Roope directly</h3>
            <p className="mt-2 text-[12px] leading-5 text-slate-600">
              Even a short hello, question or opportunity is welcome.
            </p>
          </div>

          <div className="space-y-2">
            <a
              href="mailto:roope.aa@hotmail.com?subject=Quick%20hello%20from%20your%20portfolio&body=Hi%20Roope%2C%0A%0A"
              className="flex items-center justify-center rounded-[12px] bg-[#0f172a] px-4 py-3 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:-translate-y-[1px] hover:bg-[#111827]"
            >
              Open message draft
            </a>

            <div className="flex gap-2 text-[11px]">
              <a
                href="mailto:roope.aa@hotmail.com?subject=Internship%20opportunity"
                className="flex-1 rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-center text-slate-700 hover:border-sky-300 hover:text-sky-700"
              >
                Internship
              </a>
              <a
                href="mailto:roope.aa@hotmail.com?subject=Project%20discussion"
                className="flex-1 rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-center text-slate-700 hover:border-sky-300 hover:text-sky-700"
              >
                Project
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-[16px] bg-[radial-gradient(circle_at_top_left,#eff6ff_0%,#ffffff_34%,#ecfeff_100%)] p-4 text-[#0f172a]">
      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[18px] border border-white/80 bg-white/86 p-5 shadow-[0_24px_48px_rgba(15,23,42,0.10)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">Contact Me</p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.05] text-slate-900">
            Start a conversation with almost zero friction.
          </h2>
          <p className="mt-3 max-w-[42ch] text-[14px] leading-6 text-slate-600">
            If something here caught your attention, a short message is enough. Internship opportunity, project idea, quick question or just a hello — all welcome.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <a
              href="mailto:roope.aa@hotmail.com?subject=Hello%20Roope"
              className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Quick hello</div>
              <div className="mt-1 text-[14px] font-semibold text-slate-900">Say hi</div>
            </a>

            <a
              href="mailto:roope.aa@hotmail.com?subject=Internship%20opportunity"
              className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Career</div>
              <div className="mt-1 text-[14px] font-semibold text-slate-900">Internship / role</div>
            </a>

            <a
              href="mailto:roope.aa@hotmail.com?subject=Project%20discussion"
              className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Collaboration</div>
              <div className="mt-1 text-[14px] font-semibold text-slate-900">Project discussion</div>
            </a>
          </div>

          <div className="mt-5 rounded-[16px] border border-sky-100 bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_55%,#ecfeff_100%)] p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sky-700">Low-pressure outreach</div>
            <ul className="mt-3 space-y-2 text-[13px] leading-5 text-slate-700">
              <li>• A one-line message is enough.</li>
              <li>• You do not need a polished brief to reach out.</li>
              <li>• The button below opens a ready-to-send email draft addressed to Roope.</li>
            </ul>
          </div>
        </div>

        <form
          action="mailto:roope.aa@hotmail.com"
          method="post"
          encType="text/plain"
          className="rounded-[18px] border border-slate-200 bg-[#0f172a] p-5 text-white shadow-[0_24px_48px_rgba(15,23,42,0.16)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300">Message form</p>
              <h3 className="mt-2 text-[26px] font-semibold leading-tight">Send a message</h3>
            </div>
            <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] text-white/70">
              roope.aa@hotmail.com
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <input
              name="Name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-[14px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] text-white placeholder:text-white/45 outline-none transition focus:border-sky-300 focus:bg-white/10"
            />
            <input
              name="Email"
              type="email"
              placeholder="Your email"
              className="w-full rounded-[14px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] text-white placeholder:text-white/45 outline-none transition focus:border-sky-300 focus:bg-white/10"
            />
            <input
              name="Subject"
              type="text"
              defaultValue="Hello Roope"
              className="w-full rounded-[14px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] text-white placeholder:text-white/45 outline-none transition focus:border-sky-300 focus:bg-white/10"
            />
            <textarea
              name="Message"
              placeholder="Write even a short message here — for example: Hi Roope, your portfolio caught my attention..."
              className="min-h-[188px] w-full rounded-[16px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] leading-6 text-white placeholder:text-white/45 outline-none transition focus:border-sky-300 focus:bg-white/10"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-[14px] bg-sky-400 px-5 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_14px_28px_rgba(56,189,248,0.35)] transition hover:-translate-y-[1px] hover:bg-sky-300"
            >
              Open ready-to-send email
            </button>

            <a
              href="mailto:roope.aa@hotmail.com"
              className="inline-flex items-center justify-center rounded-[14px] border border-white/12 bg-white/8 px-5 py-3 text-[14px] font-medium text-white/86 transition hover:bg-white/12"
            >
              Or email directly
            </a>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-white/55">
            This static portfolio opens your mail app with the message addressed to Roope.
          </p>
        </form>
      </div>
    </div>
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
