"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { projects } from "@/content/projects";

export type PortfolioPanel = "home" | "about" | "projects" | "contact" | null;

const VALID_PANELS = new Set<Exclude<PortfolioPanel, null>>(["home", "about", "projects", "contact"]);
const VALID_PROJECTS = new Set(projects.map((project) => project.slug));
const ROOT_PATH = "/";
type PanelState = { panel: PortfolioPanel; project: string | null };

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

  const urlState = useMemo<PanelState>(() => {
    const nextPanel = parsePanel(searchParams.get("panel"));
    return {
      panel: nextPanel,
      project: nextPanel === "projects" ? parseProject(searchParams.get("project")) : null,
    };
  }, [searchParams]);

  const [optimisticState, setOptimisticState] = useState<PanelState>(urlState);

  useEffect(() => {
    setOptimisticState(urlState);
  }, [urlState]);

  const panel = optimisticState.panel;
  const project = panel === "projects" ? optimisticState.project : null;

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
      setOptimisticState({ panel: nextPanel, project: safeProject });

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
    setOptimisticState({ panel: null, project: null });

    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", ROOT_PATH);
    }

    router.replace(ROOT_PATH, { scroll: false });
  }, [router]);

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
