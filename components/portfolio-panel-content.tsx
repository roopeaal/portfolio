"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
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
        className="h-full overflow-hidden rounded-[12px] border border-[#2f394a] p-3 text-[#d5deea]"
        style={{
          backgroundColor: "#1c2432",
          backgroundImage:
            "radial-gradient(ellipse 34px 20px at 50% 28%, rgba(184,201,224,0.11) 0 58%, rgba(184,201,224,0) 61%), radial-gradient(circle at 50% 12%, rgba(184,201,224,0.1) 0 4px, rgba(184,201,224,0) 5px), radial-gradient(circle at 25% 52%, rgba(167,188,216,0.08) 0 3px, rgba(167,188,216,0) 4px), radial-gradient(circle at 75% 52%, rgba(167,188,216,0.08) 0 3px, rgba(167,188,216,0) 4px), radial-gradient(ellipse 24px 15px at 50% 76%, rgba(176,196,221,0.08) 0 60%, rgba(176,196,221,0) 63%), radial-gradient(circle at 22% 18%, rgba(255,255,255,0.08) 0, rgba(255,255,255,0) 42%), radial-gradient(circle at 78% 22%, rgba(135,154,186,0.22) 0, rgba(135,154,186,0) 44%)",
          backgroundSize: "128px 128px, 128px 128px, 128px 128px, 128px 128px, 128px 128px, 100% 100%, 100% 100%",
        }}
      >
        <div className="grid h-full min-h-0 grid-cols-[1fr_126px_1fr] items-center gap-2">
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
                className="object-contain object-center [filter:contrast(1.06)_brightness(0.99)_drop-shadow(0_10px_16px_rgba(0,0,0,0.5))]"
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
  const [contactDraft, setContactDraft] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const safeName = contactDraft.name.trim() || "Website visitor";
    const safeEmail = contactDraft.email.trim() || "Not provided";
    const safeMessage = contactDraft.message.trim() || "(No message written)";

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
      <div className="relative h-full overflow-hidden rounded-[12px] border border-[#c7d6e8] p-3 text-[#112844]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 16% 18%, rgba(75,134,210,0.22), rgba(75,134,210,0) 46%), radial-gradient(circle at 84% 22%, rgba(32,194,175,0.16), rgba(32,194,175,0) 44%), linear-gradient(180deg, #f9fcff 0%, #edf4fc 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "linear-gradient(rgba(72,101,143,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(72,101,143,0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex h-full flex-col justify-between rounded-[10px] border border-[#c3d4e9] bg-white/86 p-3 shadow-[0_10px_22px_rgba(22,63,112,0.12)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#6080aa]">Network Contact</p>
            <h3 className="mt-2 text-[19px] leading-[1.05] text-[#10355d]">Let&apos;s build reliable systems together.</h3>
            <p className="mt-1 text-[11px] text-[#4e6686]">Fast channels + concise message form.</p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {["Networking", "Linux", "Cloud", "IoT"].map((item) => (
                <span key={item} className="rounded-full border border-[#c5d7ee] bg-[#f4f9ff] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#4a6f9d]">
                  {item}
                </span>
              ))}
            </div>
            <a
              href="mailto:roope.aa@hotmail.com?subject=Portfolio%20contact%20request"
              className="inline-flex rounded-[9px] border border-[#89a8cd] bg-[#1b5ea4] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#246ebc]"
            >
              Open email
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden text-[#112742]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 14%, rgba(66,120,198,0.2), rgba(66,120,198,0) 42%), radial-gradient(circle at 88% 22%, rgba(49,180,170,0.16), rgba(49,180,170,0) 44%), linear-gradient(180deg, #f8fbff 0%, #eaf2fb 52%, #e6effa 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,106,148,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(74,106,148,0.12) 1px, transparent 1px), radial-gradient(circle at 20% 36%, rgba(68,118,190,0.2) 0 4px, transparent 5px), radial-gradient(circle at 78% 64%, rgba(68,118,190,0.16) 0 4px, transparent 5px), linear-gradient(118deg, transparent 27%, rgba(81,126,190,0.2) 28%, rgba(81,126,190,0.2) 29%, transparent 30%), linear-gradient(63deg, transparent 66%, rgba(61,111,177,0.18) 67%, rgba(61,111,177,0.18) 68%, transparent 69%)",
          backgroundSize: "26px 26px, 26px 26px, auto, auto, auto, auto",
        }}
      />

      <div className="relative z-[1] grid h-full min-h-0 gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:px-5 lg:py-5">
        <section className="flex min-h-0 flex-col rounded-[14px] border border-[#c2d4e8] bg-white/90 p-4 shadow-[0_20px_38px_rgba(24,58,101,0.14)]">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[#5879a4]">Network Contact Gateway</p>
          <h2 className="mt-2 text-[clamp(2rem,4.8vw,4.2rem)] leading-[0.9] tracking-[-0.02em] text-[#10355d]">
            Let&apos;s build
            <span className="block text-[#1a4f85]">something</span>
            <span className="font-semibold text-[#0f3765]">reliable together.</span>
          </h2>
          <p className="mt-3 max-w-[620px] text-[14px] leading-7 text-[#3f5f87]">
            A clean channel for recruiters and collaborators: quick direct actions, clear availability, and a focused form that goes straight to my inbox.
          </p>

          <div className="mt-3 flex flex-wrap gap-2.5">
            <a
              href="mailto:roope.aa@hotmail.com?subject=Portfolio%20contact%20request"
              className="inline-flex items-center rounded-[10px] border border-[#8eadd2] bg-[#1d62ab] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#2774c6]"
            >
              Email
            </a>
            <a
              href="tel:+358405283008"
              className="inline-flex items-center rounded-[10px] border border-[#b9d2b2] bg-[#49a55c] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#56b86a]"
            >
              Call
            </a>
            <a
              href="https://www.linkedin.com/in/roope-aaltonen/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-[10px] border border-[#8eadd2] bg-[#f3f8ff] px-3.5 py-2 text-[12px] font-semibold text-[#1a4f86] transition hover:bg-[#e5f0ff]"
            >
              LinkedIn
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {["Networking", "Linux", "Cloud", "IoT", "Security Mindset"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#c5d7eb] bg-[#f4f9ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#4b6f9b]"
              >
                {item}
              </span>
            ))}
          </div>

          <form onSubmit={handleContactSubmit} className="mt-4 flex min-h-0 flex-1 flex-col gap-2.5" autoComplete="off">
            <input
              name="Name"
              type="text"
              placeholder="Name"
              autoComplete="name"
              value={contactDraft.name}
              onChange={(event) => setContactDraft((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-[11px] border border-[#bdd0e6] bg-[#f8fbff] px-3 py-2.5 text-[14px] text-[#163a62] placeholder:text-[#7d97b8] outline-none transition focus:border-[#6992c1] focus:bg-white"
            />
            <input
              name="Email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={contactDraft.email}
              onChange={(event) => setContactDraft((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-[11px] border border-[#bdd0e6] bg-[#f8fbff] px-3 py-2.5 text-[14px] text-[#163a62] placeholder:text-[#7d97b8] outline-none transition focus:border-[#6992c1] focus:bg-white"
            />
            <textarea
              name="Message"
              placeholder="Write your message..."
              autoComplete="off"
              value={contactDraft.message}
              onChange={(event) => setContactDraft((prev) => ({ ...prev, message: event.target.value }))}
              className="min-h-[142px] flex-1 rounded-[12px] border border-[#bdd0e6] bg-[#f8fbff] px-3 py-2.5 text-[14px] leading-6 text-[#163a62] placeholder:text-[#7d97b8] outline-none transition focus:border-[#6992c1] focus:bg-white"
            />

            <div className="pt-0.5">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center rounded-[10px] border border-[#88abd3] bg-[#1d63ad] px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#2775c8]"
              >
                {isSending ? "Sending..." : "Send message"}
              </button>
              {sendFeedback ? (
                <p className={`mt-2 text-[11px] ${sendFeedback.kind === "ok" ? "text-[#2e7f3f]" : "text-[#bf3e3e]"}`}>
                  {sendFeedback.text}
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <aside className="flex min-h-0 flex-col rounded-[14px] border border-[#c2d4e8] bg-[#f7fbff]/92 p-4 shadow-[0_20px_38px_rgba(24,58,101,0.14)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#5d7ea8]">Direct Channels</p>
          <h3 className="mt-2 text-[clamp(2rem,3.5vw,3rem)] leading-[1.02] text-[#153f6f]">Find me online</h3>

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

          <div className="mt-4 space-y-2.5">
            <ContactInfoRow label="Phone" value="040 528 3008" href="tel:+358405283008" />
            <ContactInfoRow label="Email" value="roope.aa@hotmail.com" href="mailto:roope.aa@hotmail.com" />
            <ContactInfoRow label="Location" value="Vantaa, Hämeenkylä" />
          </div>

          <div className="mt-3 rounded-[11px] border border-[#c4d6ea] bg-[#eef6ff] px-3 py-2.5 text-[12px] leading-5 text-[#355980]">
            <p className="font-semibold uppercase tracking-[0.12em] text-[#5477a4]">Availability</p>
            <p className="mt-1">Open to internships and junior technical roles. Typical response time: within 24h.</p>
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
      <p className="text-[10px] uppercase tracking-[0.17em] text-[#6384ad]">{label}</p>
      <p className="mt-1 text-[14px] font-medium text-[#123c69]">{value}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-[11px] border border-[#bfd2e8] bg-[#fafdff] px-3 py-2.5 transition hover:border-[#8baed4] hover:bg-[#f1f8ff]"
      >
        {content}
      </a>
    );
  }

  return <div className="rounded-[11px] border border-[#bfd2e8] bg-[#fafdff] px-3 py-2.5">{content}</div>;
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
      className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b8cde6] bg-white transition hover:-translate-y-[1px] hover:border-[#7ea3cc] hover:shadow-[0_8px_16px_rgba(28,76,130,0.16)]"
    >
      <span className="h-5 w-5">{children}</span>
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
