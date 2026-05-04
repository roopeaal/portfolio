"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type RedirectPanel = "about" | "projects" | "contact";

export function PanelRouteRedirect({ panel, label }: { panel: RedirectPanel; label: string }) {
  const router = useRouter();
  const href = `/?panel=${panel}`;

  useEffect(() => {
    router.replace(href, { scroll: false });
  }, [href, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef2f5] px-6 text-center text-[#173b72]">
      <div className="max-w-sm rounded-[18px] border border-[#d2dbe8] bg-white px-6 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7d94]">Opening portfolio panel</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{label}</h1>
        <p className="mt-3 text-sm leading-6 text-[#526173]">
          Redirecting to the interactive homepage view.
        </p>
        <Link
          href={href}
          scroll={false}
          className="mt-5 inline-flex rounded-full border border-[#b7c8dc] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#173b72] transition hover:border-[#6f9cc8] hover:bg-white"
        >
          Open {label}
        </Link>
      </div>
    </main>
  );
}
