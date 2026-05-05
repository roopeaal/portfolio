"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { projects } from "@/content/projects";

export type PortfolioPanel = "home" | "about" | "projects" | "contact" | null;

const VALID_PANELS = new Set<Exclude<PortfolioPanel, null>>(["home", "about", "projects", "contact"]);
const VALID_PROJECTS = new Set(projects.map((project) => project.slug));
const ROOT_PATH = "/";

function parsePanel(panel: string | null): PortfolioPanel {
  if (panel === "linkedin") {
    return "home";
  }

  if (panel && VALID_PANELS.has(panel as Exclude<PortfolioPanel, null>)) {
    return panel as Exclude<PortfolioPanel, null>;
  }
  return null;
}

function parseProject(project: string | null) {
  if (project && VALID_PROJECTS.has(project)) {
    return project;
  }
  return null;
}

export function usePortfolioPanelState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const panel = parsePanel(searchParams.get("panel"));
  const project = panel === "projects" ? parseProject(searchParams.get("project")) : null;

  const updateUrlState = useCallback(
    (nextPanel: PortfolioPanel, nextProject?: string | null) => {
      const currentSearch = typeof window !== "undefined" ? window.location.search : searchParams.toString();
      const params = new URLSearchParams(currentSearch);

      if (nextPanel) {
        params.set("panel", nextPanel);
      } else {
        params.delete("panel");
      }

      const safeProject = nextPanel === "projects" ? parseProject(nextProject ?? null) : null;
      if (safeProject) {
        params.set("project", safeProject);
      } else {
        params.delete("project");
      }

      const query = params.toString();
      const href = query ? `${ROOT_PATH}?${query}` : ROOT_PATH;
      router.push(href, { scroll: false });
    },
    [router, searchParams],
  );

  const openPanel = useCallback(
    (nextPanel: Exclude<PortfolioPanel, null>) => {
      updateUrlState(nextPanel, null);
    },
    [updateUrlState],
  );

  const openProject = useCallback(
    (slug: string) => {
      updateUrlState("projects", slug);
    },
    [updateUrlState],
  );

  const showProjectOverview = useCallback(() => {
    updateUrlState("projects", null);
  }, [updateUrlState]);

  const closePanel = useCallback(() => {
    const currentSearch = typeof window !== "undefined" ? window.location.search : searchParams.toString();
    const params = new URLSearchParams(currentSearch);
    params.delete("panel");
    params.delete("project");

    const next = params.toString();
    router.replace(next ? `${ROOT_PATH}?${next}` : ROOT_PATH, { scroll: false });
  }, [router, searchParams]);

  return useMemo(
    () => ({
      panel,
      project,
      openPanel,
      openProject,
      showProjectOverview,
      closePanel,
    }),
    [closePanel, openPanel, openProject, panel, project, showProjectOverview],
  );
}
