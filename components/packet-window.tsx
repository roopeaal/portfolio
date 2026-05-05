"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, useCallback } from "react";
import type { PanelSidebarItem } from "@/components/portfolio-panel-content";

type PacketPanelType = "home" | "about" | "projects" | "contact";

interface PacketWindowProps {
  open: boolean;
  onClose: () => void;
  title: string;
  type: PacketPanelType;
  children: ReactNode;
  sidebarTitle?: string;
  sidebarItems?: PanelSidebarItem[];
  browserUrl?: string;
  browserLink?: string;
  shellTitle?: string;
  onSelectPanel?: (panel: PacketPanelType) => void;
}

const PANEL_NAV_ITEMS: Array<{ panel: PacketPanelType; label: string; href: string }> = [
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
  onSelectPanel,
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
    onClose?.();
  }, [onClose]);

  const renderSidebarItem = (item: PanelSidebarItem, variant: "mobile" | "desktop") => {
    const itemClassName =
      variant === "mobile"
        ? `inline-flex shrink-0 items-center whitespace-nowrap rounded-[4px] border px-3 py-1.5 text-[12px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff] ${
            item.active
              ? "border-[#c8c8c8] bg-white text-[#374151]"
              : "border-[#d9d9d9] bg-[#f7f7f7] text-[#5b6778] hover:bg-white hover:text-[#374151]"
          }`
        : `flex w-full items-center border-b border-[#dfdfdf] px-3 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4b74ff] ${
            item.active
              ? "bg-[#f7f7f7] text-[#374151]"
              : "text-[#5b6778] hover:bg-[#f8f8f8] hover:text-[#374151]"
          }`;

    if (item.onSelect) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={item.onSelect}
          className={itemClassName}
          aria-current={item.active ? "true" : undefined}
        >
          {item.label}
        </button>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href ?? "#"}
        scroll={false}
        className={itemClassName}
        aria-current={item.active ? "true" : undefined}
      >
        {item.label}
      </Link>
    );
  };

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
            className="fixed inset-x-2 top-2 z-[510] mx-auto h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] overflow-hidden rounded-[10px] bg-[#efefef] shadow-[0_26px_90px_rgba(15,23,42,0.26)] focus:outline-none sm:inset-x-[1.2vw] sm:top-[1.2vh] sm:h-[calc(100dvh-2.4vh)] sm:w-[min(1520px,97.6vw)]"
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

            <div className="flex h-[30px] items-end justify-start gap-1 overflow-x-auto border-b border-[#d6d6d6] bg-[#f4f4f4] px-3 pt-1 text-[12px] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
              {PANEL_NAV_ITEMS.map((item) => {
                const isActive = item.panel === type;

                if (isActive) {
                  return (
                    <span
                      key={item.panel}
                      aria-current="page"
                      className="shrink-0 whitespace-nowrap rounded-t-[2px] border border-b-0 border-[#c8c8c8] bg-[#f9f9f9] px-3 py-[5px] font-medium text-[#4a4a4a]"
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
                    onClick={(event) => {
                      if (!onSelectPanel) return;
                      event.preventDefault();
                      onSelectPanel(item.panel);
                    }}
                    className="shrink-0 whitespace-nowrap rounded-t-[2px] border border-b-0 border-transparent px-3 py-[5px] text-[#7f8794] transition hover:border-[#d4d7dc] hover:bg-[#f8f8f8] hover:text-[#4a4a4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff]"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {type === "home" ? (
              <div className="flex h-[calc(100%-60px)] flex-col bg-[#ededed] p-2 sm:p-3">
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

                  <div className="flex min-w-0 items-center gap-1.5 overflow-hidden border-b border-[#cfcfcf] bg-[#efefef] px-2 py-1.5 text-[12px] text-[#6e6e6e] sm:gap-2 sm:px-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] text-[#646464]">&lt;</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] text-[#646464]">&gt;</span>
                    <span className="hidden sm:inline">URL</span>
                    <div className="min-w-0 flex-1 border border-[#cfcfcf] bg-white px-2 py-[5px] text-[#565656]">{browserUrl ?? "identity.local/roope-aaltonen"}</div>
                    <a
                      href={browserLink ?? browserUrl ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-7 shrink-0 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] px-3 text-[#575757] transition hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff] sm:px-4"
                    >
                      Go
                    </a>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleHardClose(); }}
                      className="hidden h-7 shrink-0 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8] px-4 text-[#575757] transition hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b74ff] sm:inline-flex"
                    >
                      Stop
                    </button>
                  </div>

                  <div className="block h-[calc(100%-72px)] overflow-hidden bg-white">{children}</div>
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100%-60px)] min-w-0 flex-col overflow-hidden bg-[#ededed] p-2 md:p-3 lg:flex-row xl:p-4">
                {sidebarItems.length > 0 ? (
                  <div className="mb-2 flex max-w-full shrink-0 gap-1 overflow-x-auto border border-[#cacaca] bg-[#efefef] p-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
                    {sidebarItems.map((item) => renderSidebarItem(item, "mobile"))}
                  </div>
                ) : null}

                <div
                  className="mr-3 hidden w-[clamp(150px,13vw,174px)] shrink-0 overflow-hidden border border-[#a8a8a8] bg-[#efefef] lg:block"
                >
                  <div className="border-b border-[#b4b4b4] bg-[#f2f2f2] px-3 py-2 text-center text-[12px] font-semibold tracking-wide text-[#666666]">
                    {sidebarTitle}
                  </div>
                  <div className="space-y-0 py-0.5 text-[12px]">
                    {sidebarItems.map((item) => renderSidebarItem(item, "desktop"))}
                  </div>
                </div>

                <div
                  className={`min-h-0 min-w-0 flex-1 overflow-hidden border border-[#c5c5c5] bg-[#f4f4f4] ${
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
