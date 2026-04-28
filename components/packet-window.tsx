"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, useCallback } from "react";
import type { PanelSidebarItem } from "@/components/portfolio-panel-content";

interface PacketWindowProps {
  open: boolean;
  onClose: () => void;
  title: string;
  type: "home" | "about" | "projects" | "contact";
  children: ReactNode;
  sidebarTitle?: string;
  sidebarItems?: PanelSidebarItem[];
  browserUrl?: string;
  browserLink?: string;
  shellTitle?: string;
}

const PANEL_NAV_ITEMS: Array<{ panel: PacketWindowProps["type"]; label: string; href: string }> = [
  { panel: "about", label: "About Me", href: "/?panel=about" },
  { panel: "projects", label: "Projects", href: "/?panel=projects" },
  { panel: "home", label: "LinkedIn", href: "/?panel=home" },
  { panel: "contact", label: "Contact Me", href: "/?panel=contact" },
];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function PacketWindow({
  open,
  onClose,
  title,
  type,
  children,
  sidebarTitle = "GLOBAL",
  sidebarItems = [],
  browserUrl,
  browserLink,
  shellTitle,
}: PacketWindowProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const frame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const firstTarget = focusable[0] ?? dialog;
      firstTarget.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    lastFocusedElementRef.current?.focus?.();
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleHardClose();
      return;
    }

    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
    );

    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  };

  const overlayTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.18 };
  const windowTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };
  const isExpandedPanel = type === "about" || type === "contact" || type === "projects";

  const handleHardClose = useCallback(() => {
    try {
      onClose?.();
    } catch {}

    if (typeof window !== "undefined") {
      const target = window.location.pathname || "/";
      window.location.assign(target);
    }
  }, [onClose]);


  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="fixed inset-0 z-[500] bg-black/18 backdrop-blur-[1px]"
            onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleHardClose(); }}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 18 }}
            transition={windowTransition}
            className="fixed inset-x-[1.6vw] top-[1.5vh] z-[510] mx-auto h-[calc(100dvh-3vh)] w-[min(1520px,96.8vw)] overflow-hidden rounded-[10px] bg-[#efefef] shadow-[0_26px_90px_rgba(15,23,42,0.26)] focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className="relative flex h-[30px] items-center justify-center border-b border-[#d0d0d0] bg-[linear-gradient(180deg,#f7f7f7_0%,#ececec_100%)] px-4 text-[13px] font-medium text-[#686868]">
              <h2 id={titleId}>{title}</h2>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleHardClose(); }}
                className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[3px] border border-[#cfcfcf] bg-[#f3f3f3] text-[16px] leading-none text-[#808080] transition hover:bg-[#ebebeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
                aria-label="Close window"
              >
                ×
              </button>
            </div>

            <div className="flex h-[30px] items-end justify-center gap-1 border-b border-[#d6d6d6] bg-[#f4f4f4] px-3 pt-1 text-[12px]">
              {PANEL_NAV_ITEMS.map((item) => {
                const isActive = item.panel === type;

                if (isActive) {
                  return (
                    <span
                      key={item.panel}
                      aria-current="page"
                      className="rounded-t-[2px] border border-b-0 border-[#c8c8c8] bg-[#f9f9f9] px-3 py-[5px] font-medium text-[#4a4a4a]"
                    >
                      {item.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.panel}
                    href={item.href}
                    scroll={false}
                    className="rounded-t-[2px] border border-b-0 border-transparent px-3 py-[5px] text-[#7f8794] transition hover:border-[#d4d7dc] hover:bg-[#f8f8f8] hover:text-[#4a4a4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {type === "home" ? (
              <div className="flex h-[calc(100%-60px)] flex-col bg-[#ededed] p-3">
                <div className="flex-1 overflow-hidden border border-[#c6c6c6] bg-[#f4f4f4]">
                  <div className="flex h-[36px] items-center bg-[#0d16ff] px-3 text-[16px] text-white">
                    <span>Web Browser</span>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleHardClose(); }}
                      className="ml-auto inline-flex h-7 w-7 items-center justify-center border border-[#cfcfcf] bg-[#efefef] text-[16px] leading-none text-[#595959] transition hover:bg-[#e5e5e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label="Close browser"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center gap-2 border-b border-[#cfcfcf] bg-[#efefef] px-3 py-1.5 text-[12px] text-[#6e6e6e]">
                    <span className="inline-flex h-7 w-7 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] text-[#646464]">&lt;</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] text-[#646464]">&gt;</span>
                    <span>URL</span>
                    <div className="min-w-0 flex-1 border border-[#cfcfcf] bg-white px-2 py-[5px] text-[#565656]">{browserUrl ?? "identity.local/roope-aaltonen"}</div>
                    <a
                      href={browserLink ?? browserUrl ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-7 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] px-4 text-[#575757] transition hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
                    >
                      Go
                    </a>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleHardClose(); }}
                      className="inline-flex h-7 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] px-4 text-[#575757] transition hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
                    >
                      Stop
                    </button>
                  </div>

                  <div className="block h-[calc(100%-72px)] overflow-hidden bg-white">{children}</div>
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100%-60px)] bg-[#ededed] p-3 md:p-4">
                <div
                  className="mr-3 hidden w-[174px] shrink-0 overflow-hidden border border-[#a8a8a8] bg-[#efefef] md:block"
                >
                  <div className="border-b border-[#b4b4b4] bg-[#f2f2f2] px-3 py-2 text-center text-[12px] font-semibold tracking-wide text-[#666666]">
                    {sidebarTitle}
                  </div>
                  <div className="space-y-0 py-0.5 text-[12px]">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onSelect}
                        className={`flex w-full items-center border-b border-[#dfdfdf] px-3 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4b74ff] ${
                          item.active
                            ? "bg-[#f7f7f7] text-[#4b5563]"
                            : "text-[#7c8798] hover:bg-[#f8f8f8] hover:text-[#4b5563]"
                        }`}
                        aria-current={item.active ? "true" : undefined}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`min-w-0 flex-1 border border-[#c5c5c5] bg-[#f4f4f4] ${
                    isExpandedPanel ? "p-0" : "p-3 md:p-4"
                  }`}
                >
                  {isExpandedPanel ? (
                    <div className="h-full w-full overflow-hidden">{children}</div>
                  ) : (
                    <div className={`mx-auto h-full overflow-auto pr-1 ${shellTitle ? "flex flex-col" : ""}`}>
                      {shellTitle ? (
                        <>
                          <div className="border border-[#c9c9c9] bg-[#efefef] px-4 py-1.5 text-center text-[14px] font-medium text-[#727272]">{shellTitle}</div>
                          <div className="flex-1 border border-t-0 border-[#c9c9c9] bg-[#f8f8f8] px-4 py-4 md:px-5 md:py-4">{children}</div>
                        </>
                      ) : (
                        <div className="h-full border border-[#c9c9c9] bg-[#f8f8f8] px-4 py-4 md:px-5 md:py-4">{children}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
