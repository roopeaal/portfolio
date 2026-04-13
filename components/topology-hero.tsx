"use client";

import Image from "next/image";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PacketWindow } from "@/components/packet-window";
import { RetroComputer } from "@/components/retro-computer";
import {
  AboutPanelContent,
  ContactPanelContent,
  HomePanelContent,
  ProjectsPanelContent,
  type PanelSidebarItem,
} from "@/components/portfolio-panel-content";
import { projects } from "@/content/projects";
import { usePortfolioPanelState } from "@/hooks/use-portfolio-panel-state";

type ActiveNode = "home" | "about" | "projects" | "contact" | null;
type NodeKey = Exclude<ActiveNode, null>;
type WindowType = ActiveNode;
type NetworkMode = "stable" | "dropping" | "grabbing" | "repairing" | "recovering";
type CursorState = "pointer" | "open" | "closed";

const VIEWBOX = { width: 1280, height: 760 };
const ASSET_BASE = process.env.NODE_ENV === "production" ? "/portfolio" : "";
const PREVIEW_WIDTH = 362;
const PREVIEW_HEIGHT = 266;
const PREVIEW_GAP = 42;
const PREVIEW_MARGIN = 18;
const DEVICE_FLOAT_FILTER = "drop-shadow(0 16px 22px rgba(10,18,31,0.18)) drop-shadow(0 5px 12px rgba(24,79,113,0.10))";
const DEVICE_FLOAT_FILTER_SOFT = "drop-shadow(0 12px 18px rgba(10,18,31,0.14)) drop-shadow(0 4px 10px rgba(24,79,113,0.08))";
const UNIFIED_DEVICE_WIDTH = 226;
const UNIFIED_DEVICE_HEIGHT = 194;
const UNIFIED_NODE_HEIGHT = 262;

type NodePosition = { x: number; y: number };
type NodeMeta = {
  label: string;
  deviceName: string;
  width: number;
  height: number;
  deviceHeight: number;
  previewWidth?: number;
  labelOffsetX?: number;
};

type DragBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const NODE_META: Record<NodeKey, NodeMeta> = {
  about: {
    label: "About Me",
    deviceName: "Wireless Router1",
    width: UNIFIED_DEVICE_WIDTH,
    height: UNIFIED_NODE_HEIGHT,
    deviceHeight: UNIFIED_DEVICE_HEIGHT,
  },
  projects: {
    label: "Projects",
    deviceName: "Switch0",
    width: UNIFIED_DEVICE_WIDTH,
    height: UNIFIED_NODE_HEIGHT,
    deviceHeight: UNIFIED_DEVICE_HEIGHT,
  },
  home: {
    label: "LinkedIn",
    deviceName: "PC1",
    width: UNIFIED_DEVICE_WIDTH,
    height: UNIFIED_NODE_HEIGHT,
    deviceHeight: UNIFIED_DEVICE_HEIGHT,
    previewWidth: 378,
  },
  contact: {
    label: "Contact Me",
    deviceName: "Smartphone0",
    width: UNIFIED_DEVICE_WIDTH,
    height: UNIFIED_NODE_HEIGHT,
    deviceHeight: UNIFIED_DEVICE_HEIGHT,
  },
};

const INITIAL_NODE_POSITIONS: Record<NodeKey, NodePosition> = {
  about: { x: 128, y: 120 },
  projects: { x: 930, y: 126 },
  home: { x: 232, y: 442 },
  contact: { x: 958, y: 454 },
};

const NODE_POSITIONS_STORAGE_KEY = "portfolio-node-positions-v2";

function getInitialNodePositions(): Record<NodeKey, NodePosition> {
  if (typeof window === "undefined") return INITIAL_NODE_POSITIONS;

  try {
    const raw = window.sessionStorage.getItem(NODE_POSITIONS_STORAGE_KEY);
    if (!raw) return INITIAL_NODE_POSITIONS;

    const parsed = JSON.parse(raw);
    const keys: NodeKey[] = ["about", "projects", "home", "contact"];

    for (const key of keys) {
      if (
        !parsed?.[key] ||
        typeof parsed[key].x !== "number" ||
        typeof parsed[key].y !== "number"
      ) {
        return INITIAL_NODE_POSITIONS;
      }
    }

    return {
      about: { x: parsed.about.x, y: parsed.about.y },
      projects: { x: parsed.projects.x, y: parsed.projects.y },
      home: { x: parsed.home.x, y: parsed.home.y },
      contact: { x: parsed.contact.x, y: parsed.contact.y },
    };
  } catch {
    return INITIAL_NODE_POSITIONS;
  }
}

const SIDEBAR_TITLE: Record<Exclude<WindowType, null>, string> = {
  home: "DESKTOP",
  about: "GLOBAL",
  projects: "PORTS",
  contact: "INTERFACE",
};

const NODE_DRAG_BOUNDS: Record<NodeKey, DragBounds> = {
  about: createNodeDragBounds("about"),
  projects: createNodeDragBounds("projects"),
  home: createNodeDragBounds("home"),
  contact: createNodeDragBounds("contact"),
};

function createNodeDragBounds(node: NodeKey): DragBounds {
  const meta = NODE_META[node];
  const BOTTOM_SAFE_MARGIN = 32;

  return {
    minX: 0,
    maxX: VIEWBOX.width - meta.width,
    minY: 0,
    maxY: VIEWBOX.height - meta.height - BOTTOM_SAFE_MARGIN,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function pointOnLine(start: { x: number; y: number }, end: { x: number; y: number }, t: number) {
  return { x: lerp(start.x, end.x, t), y: lerp(start.y, end.y, t) };
}

function stepToward(from: { x: number; y: number }, to: { x: number; y: number }, maxStep: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= maxStep || distance === 0) {
    return { x: to.x, y: to.y };
  }
  const ratio = maxStep / distance;
  return { x: from.x + dx * ratio, y: from.y + dy * ratio };
}

function getNodeMagnetZone(
  node: NodeKey,
  position: NodePosition,
  halo = 0,
) {
  const meta = NODE_META[node];
  const shape = NODE_COLLISION_SHAPES[node];

  const deviceRect = {
    left: position.x + shape.device.left - halo,
    top: position.y + shape.device.top - halo,
    right: position.x + meta.width - shape.device.right + halo,
    bottom: position.y + meta.deviceHeight - shape.device.bottom + halo,
  };

  const labelTop = position.y + meta.deviceHeight + shape.label.top - halo;
  const labelBottom = position.y + meta.height - shape.label.bottom + halo;

  const labelRect = labelBottom > labelTop
    ? {
        left: position.x + shape.label.left - halo,
        top: labelTop,
        right: position.x + meta.width - shape.label.right + halo,
        bottom: labelBottom,
      }
    : deviceRect;

  const left = Math.min(deviceRect.left, labelRect.left);
  const top = Math.min(deviceRect.top, labelRect.top);
  const right = Math.max(deviceRect.right, labelRect.right);
  const bottom = Math.max(deviceRect.bottom, labelRect.bottom);

  return {
    left,
    top,
    right,
    bottom,
    cx: (left + right) / 2,
    cy: (top + bottom) / 2,
    rx: Math.max(((right - left) / 2) * MAGNET_WIDTH_SCALE, 1),
    ry: Math.max(((bottom - top) / 2) * MAGNET_HEIGHT_SCALE, 1),
  };
}

function getNodeCollisionRects(
  node: NodeKey,
  position: NodePosition,
  halo = 0,
) {
  const zone = getNodeMagnetZone(node, position, halo);
  return [
    {
      left: zone.left,
      top: zone.top,
      right: zone.right,
      bottom: zone.bottom,
    },
  ];
}

function rectsOverlap(
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
) {
  const aCx = (a.left + a.right) / 2;
  const aCy = (a.top + a.bottom) / 2;
  const bCx = (b.left + b.right) / 2;
  const bCy = (b.top + b.bottom) / 2;

  const aRx = Math.max((a.right - a.left) / 2, 1);
  const aRy = Math.max((a.bottom - a.top) / 2, 1);
  const bRx = Math.max((b.right - b.left) / 2, 1);
  const bRy = Math.max((b.bottom - b.top) / 2, 1);

  const nx = Math.abs(aCx - bCx) / (aRx + bRx);
  const ny = Math.abs(aCy - bCy) / (aRy + bRy);

  return nx * nx + ny * ny < 1;
}

function resolveNonOverlappingPosition(
  node: NodeKey,
  proposed: NodePosition,
  positions: Record<NodeKey, NodePosition>,
) {
  const bounds = NODE_DRAG_BOUNDS[node];
  const current = positions[node];

  const clampPos = (pos: NodePosition) => ({
    x: clamp(pos.x, bounds.minX, bounds.maxX),
    y: clamp(pos.y, bounds.minY, bounds.maxY),
  });

  const zonesOverlap = (
    a: ReturnType<typeof getNodeMagnetZone>,
    b: ReturnType<typeof getNodeMagnetZone>,
  ) => {
    const dx = a.cx - b.cx;
    const dy = a.cy - b.cy;
    const rx = Math.max(a.rx + b.rx, 1);
    const ry = Math.max(a.ry + b.ry, 1);
    const nx = dx / rx;
    const ny = dy / ry;
    return nx * nx + ny * ny < 1;
  };

  const overlapsAny = (pos: NodePosition) => {
    const selfZone = getNodeMagnetZone(node, pos, CURRENT_PROTECTIVE_HALO);

    for (const other of Object.keys(positions) as NodeKey[]) {
      if (other === node) continue;
      const otherZone = getNodeMagnetZone(other, positions[other], CURRENT_PROTECTIVE_HALO);
      if (zonesOverlap(selfZone, otherZone)) return true;
    }

    return false;
  };

  let candidate = clampPos(proposed);

  for (let i = 0; i < 24; i += 1) {
    const selfZone = getNodeMagnetZone(node, candidate, CURRENT_PROTECTIVE_HALO);
    let totalPushX = 0;
    let totalPushY = 0;
    let hitCount = 0;

    for (const other of Object.keys(positions) as NodeKey[]) {
      if (other === node) continue;

      const otherZone = getNodeMagnetZone(other, positions[other], CURRENT_PROTECTIVE_HALO);

      const dx = selfZone.cx - otherZone.cx;
      const dy = selfZone.cy - otherZone.cy;
      const rx = Math.max(selfZone.rx + otherZone.rx, 1);
      const ry = Math.max(selfZone.ry + otherZone.ry, 1);

      const nx = dx / rx;
      const ny = dy / ry;
      const dist = Math.hypot(nx, ny);

      if (dist >= 1) continue;

      hitCount += 1;

      let pushX = 0;
      let pushY = 0;

      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        const fallbackDx = candidate.x - positions[other].x;
        const fallbackDy = candidate.y - positions[other].y;

        if (Math.abs(fallbackDx) >= Math.abs(fallbackDy)) {
          pushX = fallbackDx >= 0 ? 12 : -12;
        } else {
          pushY = fallbackDy >= 0 ? 12 : -12;
        }
      } else {
        const factor = (1.06 / Math.max(dist, 0.0001)) - 1;
        pushX = dx * factor;
        pushY = dy * factor;
      }

      totalPushX += pushX;
      totalPushY += pushY;
    }

    if (hitCount === 0) {
      return candidate;
    }

    candidate = clampPos({
      x: candidate.x + totalPushX / hitCount,
      y: candidate.y + totalPushY / hitCount,
    });
  }

  if (!overlapsAny(candidate)) {
    return candidate;
  }

  const origin = clampPos(proposed);

  for (let radius = 6; radius <= 220; radius += 6) {
    for (let i = 0; i < 24; i += 1) {
      const angle = (Math.PI * 2 * i) / 24;
      const test = clampPos({
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
      });

      if (!overlapsAny(test)) {
        return test;
      }
    }
  }

  return current;
}

const SWITCH_PORT_CENTERS = [73, 90, 108, 125, 143, 160] as const;
const SWITCH_LEFT_CABLE_PORT_INDEX = 0;
const SWITCH_RIGHT_CABLE_PORT_INDEX = 4;
const SWITCH_STUB_Y = 109.0;

const DEBUG_NODE_HALOS = false;
const NODE_PROTECTIVE_HALO = 14;
let CURRENT_PROTECTIVE_HALO = NODE_PROTECTIVE_HALO;
const MAGNET_WIDTH_SCALE = 0.88;
const MAGNET_HEIGHT_SCALE = 1;
const NODE_KEYS: NodeKey[] = ["about", "projects", "home", "contact"];

const DEBUG_HALO_COLORS: Record<NodeKey, string> = {
  about: "rgba(59,130,246,0.14)",
  projects: "rgba(245,158,11,0.14)",
  home: "rgba(34,197,94,0.14)",
  contact: "rgba(236,72,153,0.14)",
};

const DEBUG_HALO_BORDERS: Record<NodeKey, string> = {
  about: "rgba(59,130,246,0.55)",
  projects: "rgba(245,158,11,0.55)",
  home: "rgba(34,197,94,0.55)",
  contact: "rgba(236,72,153,0.55)",
};

const NODE_COLLISION_SHAPES: Record<
  NodeKey,
  {
    device: { left: number; top: number; right: number; bottom: number };
    label: { left: number; top: number; right: number; bottom: number };
  }
> = {
  about: {
    device: { left: 18, top: 10, right: 18, bottom: 18 },
    label: { left: 44, top: 8, right: 44, bottom: 10 },
  },
  projects: {
    device: { left: 18, top: 10, right: 18, bottom: 18 },
    label: { left: 44, top: 8, right: 44, bottom: 10 },
  },
  home: {
    device: { left: 18, top: 10, right: 18, bottom: 18 },
    label: { left: 44, top: 8, right: 44, bottom: 10 },
  },
  contact: {
    device: { left: 18, top: 10, right: 18, bottom: 18 },
    label: { left: 44, top: 8, right: 44, bottom: 10 },
  },
};

function getAttachPoint(node: NodeKey, positions: Record<NodeKey, NodePosition>) {
  const { x, y } = positions[node];
  const { width, deviceHeight } = NODE_META[node];

  return {
    x: x + width / 2,
    y: y + deviceHeight / 2,
  };
}

function getVisibleBounds(node: NodeKey, positions: Record<NodeKey, NodePosition>) {
  const meta = NODE_META[node];

  return {
    x: positions[node].x,
    y: positions[node].y,
    width: meta.width,
    height: meta.height,
  };
}

function getAnimatedDevicePoint(
  node: NodeKey,
  point: { x: number; y: number },
  positions: Record<NodeKey, NodePosition>,
  activeNode: NodeKey | null,
  draggingNode: NodeKey | null,
) {
  if (activeNode !== node || draggingNode === node) {
    return point;
  }

  const { width, deviceHeight } = NODE_META[node];
  const centerX = positions[node].x + width / 2;
  const centerY = positions[node].y + deviceHeight / 2;
  const scale = 1.035;

  return {
    x: centerX + (point.x - centerX) * scale,
    y: centerY + (point.y - centerY) * scale - 4,
  };
}

function getSwitchCableStubEnd(port: "left" | "right", positions: Record<NodeKey, NodePosition>) {
  const { x, y } = positions.projects;
  const portIndex = port === "left" ? SWITCH_LEFT_CABLE_PORT_INDEX : SWITCH_RIGHT_CABLE_PORT_INDEX;
  const portOffset = SWITCH_PORT_CENTERS[portIndex];

  return {
    x: x + portOffset,
    y: y + SWITCH_STUB_Y,
  };
}


function getPreviewStyle(node: NodeKey, positions: Record<NodeKey, NodePosition>): CSSProperties {
  const meta = NODE_META[node];
  const previewWidth = meta.previewWidth ?? PREVIEW_WIDTH;
  const bounds = getVisibleBounds(node, positions);
  const centerX = bounds.x + bounds.width / 2;
  const preferRight = centerX < VIEWBOX.width / 2;

  let left = preferRight
    ? bounds.x + bounds.width + PREVIEW_GAP
    : bounds.x - previewWidth - PREVIEW_GAP;

  left = clamp(left, PREVIEW_MARGIN, VIEWBOX.width - previewWidth - PREVIEW_MARGIN);

  const anchorTop = bounds.y + (bounds.y < VIEWBOX.height / 2 ? 8 : bounds.height - PREVIEW_HEIGHT - 8);
  const top = clamp(anchorTop, PREVIEW_MARGIN, VIEWBOX.height - PREVIEW_HEIGHT - PREVIEW_MARGIN);

  return {
    left: `${(left / VIEWBOX.width) * 100}%`,
    top: `${(top / VIEWBOX.height) * 100}%`,
    width: `${(previewWidth / VIEWBOX.width) * 100}%`,
  };
}

function getLooseEnd(
  tick: number,
  mode: NetworkMode,
  phaseTick: number,
  detachedOrigin: { x: number; y: number } | null,
  to: { x: number; y: number },
) {
  const anchor = detachedOrigin ?? to;
  const base = {
    x: anchor.x - 140 + Math.sin(tick / 2.2) * 38 + Math.cos(tick / 3.1) * 12,
    y: anchor.y + 44 + Math.cos(tick / 1.8) * 22 + Math.sin(tick / 1.35) * 10,
  };

  if (mode === "repairing") {
    const progress = Math.min(1, phaseTick / 100);
    return {
      x: lerp(base.x, to.x, progress),
      y: lerp(base.y, to.y, progress),
    };
  }

  if (mode === "recovering") {
    return to;
  }

  if (mode === "stable") {
    return to;
  }

  return base;
}

function getServiceCursor(
  mode: NetworkMode,
  phaseTick: number,
  looseEnd: { x: number; y: number },
  target: { x: number; y: number },
) {
  const start = { x: 790, y: -34 };
  const exit = { x: VIEWBOX.width + 70, y: VIEWBOX.height + 56 };

  if (mode === "grabbing") {
    const progress = Math.min(1, phaseTick / 48);
    const x = lerp(start.x, looseEnd.x, progress);
    const y = lerp(start.y, looseEnd.y, progress);
    const nearCableEnd = Math.hypot(looseEnd.x - x, looseEnd.y - y) < 28;

    return {
      x,
      y,
      state: nearCableEnd ? ("open" as const) : ("pointer" as const),
    };
  }

  if (mode === "repairing") {
    return {
      x: looseEnd.x,
      y: looseEnd.y,
      state: "closed" as const,
    };
  }

  if (mode === "recovering") {
    const releaseTicks = 12;
    if (phaseTick < releaseTicks) {
      return {
        x: lerp(target.x, target.x + 14, phaseTick / releaseTicks),
        y: lerp(target.y, target.y + 10, phaseTick / releaseTicks),
        state: "open" as const,
      };
    }

    const progress = Math.min(1, (phaseTick - releaseTicks) / 26);
    return {
      x: lerp(target.x + 14, exit.x, progress),
      y: lerp(target.y + 10, exit.y, progress),
      state: progress > 0.18 ? ("pointer" as const) : ("open" as const),
    };
  }

  return null;
}

export function TopologyHero() {
  const [active, setActive] = useState<ActiveNode>(null);
  const {
    panel: openWindow,
    project: selectedProjectSlug,
    openPanel,
    openProject,
    showProjectOverview,
    closePanel,
  } = usePortfolioPanelState();
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [baseStart, setBaseStart] = useState<number | null>(null);
  const [manualOffset, setManualOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 29, y: 142 });
  const [typingStep, setTypingStep] = useState(0);
  const [typingActive, setTypingActive] = useState(false);
  const [phoneRinging, setPhoneRinging] = useState(false);
  const [routerGlitchActive, setRouterGlitchActive] = useState(false);
  const [networkMode, setNetworkMode] = useState<NetworkMode>("stable");
  const [motionTick, setMotionTick] = useState(0);
  const [networkModeStartTick, setNetworkModeStartTick] = useState(0);
  const [nodePositions, setNodePositions] = useState<Record<NodeKey, NodePosition>>(() => getInitialNodePositions());
  const [draggingNode, setDraggingNode] = useState<NodeKey | null>(null);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(NODE_POSITIONS_STORAGE_KEY, JSON.stringify(nodePositions));
    } catch {}
  }, [nodePositions]);

  const phoneTapAudioRef = useRef<HTMLAudioElement | null>(null);
  const phoneTapSoundSrc = `${ASSET_BASE}/phone-click.m4a?v=20260409-7`;
  const [detachedOrigin, setDetachedOrigin] = useState<{ x: number; y: number } | null>(null);
  const [repairLooseEnd, setRepairLooseEnd] = useState<{ x: number; y: number } | null>(null);
  const [routerPowerOn, setRouterPowerOn] = useState(true);
  const [routerSignalLevel, setRouterSignalLevel] = useState<0 | 1 | 2>(2);
  const [routerWifiReady, setRouterWifiReady] = useState(true);
  const [aboutSection, setAboutSection] = useState<"profile" | "direction" | "studies" | "reliability">("profile");
  const [contactSection, setContactSection] = useState<"channels" | "roles" | "cv" | "status">("channels");

  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const syncResponsiveHalo = () => {
      const rect = scene.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      CURRENT_PROTECTIVE_HALO =
        NODE_PROTECTIVE_HALO *
        Math.max(VIEWBOX.width / rect.width, VIEWBOX.height / rect.height);

      setNodePositions((current) => {
        let next = current;

        for (const key of NODE_KEYS) {
          const resolved = resolveNonOverlappingPosition(key, next[key], next);

          if (resolved.x !== next[key].x || resolved.y !== next[key].y) {
            next = { ...next, [key]: resolved };
          }
        }

        nodePositionsRef.current = next;
        nodeTargetPositionsRef.current = next;
        return next;
      });
    };

    syncResponsiveHalo();

    const ro = new ResizeObserver(syncResponsiveHalo);
    ro.observe(scene);
    window.addEventListener("resize", syncResponsiveHalo);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncResponsiveHalo);
    };
  }, []);

  const nodePositionsRef = useRef<Record<NodeKey, NodePosition>>(INITIAL_NODE_POSITIONS);
  const nodeTargetPositionsRef = useRef<Record<NodeKey, NodePosition>>(INITIAL_NODE_POSITIONS);
  const nodeVelocityRef = useRef<Record<NodeKey, NodePosition>>({
    about: { x: 0, y: 0 },
    projects: { x: 0, y: 0 },
    home: { x: 0, y: 0 },
    contact: { x: 0, y: 0 },
  });
  const looseEndRef = useRef<{ x: number; y: number } | null>(null);
  const timeouts = useRef<number[]>([]);
  const tickRef = useRef(0);
  const dragRef = useRef<{
    node: NodeKey;
    pointerId: number;
    offsetX: number;
    offsetY: number;
    dragStarted: boolean;
  } | null>(null);

  const animationLocks = useRef<Record<NodeKey, boolean>>({
    about: false,
    projects: false,
    home: false,
    contact: false,
  });

  const selectedProject = useMemo(() => projects.find((project) => project.slug === selectedProjectSlug) ?? null, [selectedProjectSlug]);

  const aboutSidebarItems = useMemo<PanelSidebarItem[]>(
    () => [
      { id: "profile", label: "Profile", active: aboutSection === "profile", onSelect: () => setAboutSection("profile") },
      { id: "direction", label: "Direction", active: aboutSection === "direction", onSelect: () => setAboutSection("direction") },
      { id: "studies", label: "Studies", active: aboutSection === "studies", onSelect: () => setAboutSection("studies") },
      { id: "reliability", label: "Reliability", active: aboutSection === "reliability", onSelect: () => setAboutSection("reliability") },
    ],
    [aboutSection],
  );

  const projectsSidebarItems = useMemo<PanelSidebarItem[]>(
    () => [
      { id: "overview", label: "Overview", active: !selectedProjectSlug, onSelect: showProjectOverview },
      ...projects.map((project) => ({
        id: project.slug,
        label: project.title,
        active: selectedProjectSlug === project.slug,
        onSelect: () => openProject(project.slug),
      })),
    ],
    [openProject, selectedProjectSlug, showProjectOverview],
  );

  const contactSidebarItems = useMemo<PanelSidebarItem[]>(
    () => [
      { id: "channels", label: "Channels", active: contactSection === "channels", onSelect: () => setContactSection("channels") },
      { id: "roles", label: "Role fit", active: contactSection === "roles", onSelect: () => setContactSection("roles") },
      { id: "cv", label: "CV", active: contactSection === "cv", onSelect: () => setContactSection("cv") },
      { id: "status", label: "Status", active: contactSection === "status", onSelect: () => setContactSection("status") },
    ],
    [contactSection],
  );

  const aboutAttach = getAnimatedDevicePoint("about", getAttachPoint("about", nodePositions), nodePositions, active, draggingNode);
  const projectsAttach = getAnimatedDevicePoint("projects", getAttachPoint("projects", nodePositions), nodePositions, active, draggingNode);
  const homeAttach = getAnimatedDevicePoint("home", getAttachPoint("home", nodePositions), nodePositions, active, draggingNode);
  const contactAttach = getAnimatedDevicePoint("contact", getAttachPoint("contact", nodePositions), nodePositions, active, draggingNode);
  const switchLeftCableEnd = getAnimatedDevicePoint("projects", getSwitchCableStubEnd("left", nodePositions), nodePositions, active, draggingNode);
  const switchRightCableEnd = getAnimatedDevicePoint("projects", getSwitchCableStubEnd("right", nodePositions), nodePositions, active, draggingNode);

  useEffect(() => {
    const start = Date.now();
    const timeoutIds = timeouts.current;

    const init = window.requestAnimationFrame(() => {
      setBaseStart(start);
      setCurrentTime(start);
    });

    const clockTimer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    const motionTimer = window.setInterval(() => {
      tickRef.current += 1;
      setMotionTick(tickRef.current);
    }, 40);

    const typingTimer = window.setInterval(() => {
      setTypingStep((value) => value + 1);
    }, 135);

    return () => {
      window.cancelAnimationFrame(init);
      window.clearInterval(clockTimer);
      window.clearInterval(motionTimer);
      window.clearInterval(typingTimer);
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);


  useEffect(() => {
    nodePositionsRef.current = nodePositions;
  }, [nodePositions]);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;

      setNodePositions((current) => {
        let changed = false;
        const next = { ...current };

        (["about", "projects", "home", "contact"] as const).forEach((node) => {
          const target = nodeTargetPositionsRef.current[node];
          const position = current[node];
          const velocity = nodeVelocityRef.current[node];
          const isDragging = dragRef.current?.node === node;
          const stiffness = isDragging ? 520 : 340;
          const damping = isDragging ? 13.5 : 16.5;
          const bounds = NODE_DRAG_BOUNDS[node];

          velocity.x += (target.x - position.x) * stiffness * dt;
          velocity.y += (target.y - position.y) * stiffness * dt;

          const dampingFactor = Math.exp(-damping * dt);
          velocity.x *= dampingFactor;
          velocity.y *= dampingFactor;

          const nextX = clamp(position.x + velocity.x * dt, bounds.minX, bounds.maxX);
          const nextY = clamp(position.y + velocity.y * dt, bounds.minY, bounds.maxY);

          if (Math.abs(nextX - position.x) > 0.01 || Math.abs(nextY - position.y) > 0.01) {
            next[node] = { x: nextX, y: nextY };
            changed = true;
          } else if (Math.abs(target.x - position.x) < 0.02 && Math.abs(target.y - position.y) < 0.02 && (Math.abs(velocity.x) > 0.02 || Math.abs(velocity.y) > 0.02)) {
            nodeVelocityRef.current[node] = { x: 0, y: 0 };
          }
        });

        return changed ? next : current;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const openWindowState = useCallback((panel: WindowType, projectSlug?: string | null) => {
    if (!panel) {
      closePanel();
      return;
    }

    if (panel === "about") setAboutSection("profile");
    if (panel === "contact") setContactSection("channels");

    if (panel === "projects" && projectSlug) {
      openProject(projectSlug);
      return;
    }

    openPanel(panel);
  }, [closePanel, openPanel, openProject]);

  const closeWindowState = useCallback(() => {
    closePanel();
  }, [closePanel]);

  const selectProject = useCallback((slug?: string) => {
    if (!slug) {
      showProjectOverview();
      return;
    }
    openProject(slug);
  }, [openProject, showProjectOverview]);

  const setMode = useCallback((mode: NetworkMode) => {
    setNetworkMode(mode);
    setNetworkModeStartTick(tickRef.current);
  }, []);

  useEffect(() => {
    if (networkMode !== "repairing") return;

    setRepairLooseEnd((current) => current ?? looseEndRef.current ?? detachedOrigin ?? getSwitchCableStubEnd("left", nodePositionsRef.current));
  }, [networkMode, detachedOrigin]);

  useEffect(() => {
    if (networkMode === "repairing") {
      const target = getSwitchCableStubEnd("left", nodePositionsRef.current);
      setRepairLooseEnd((current) => {
        const next = stepToward(current ?? looseEndRef.current ?? detachedOrigin ?? target, target, 4.4);
        if (Math.hypot(next.x - target.x, next.y - target.y) < 0.5) {
          setMode("recovering");
          return target;
        }
        return next;
      });
    } else if (networkMode !== "recovering") {
      setRepairLooseEnd(null);
    }
  }, [motionTick, networkMode, detachedOrigin, nodePositions.projects.x, nodePositions.projects.y, setMode]);

  useEffect(() => {
    if (networkMode !== "recovering") return;
    if (motionTick - networkModeStartTick < 38) return;

    const recoveryFrame = window.requestAnimationFrame(() => {
      setDetachedOrigin(null);
      setRepairLooseEnd(null);
      setMode("stable");
    });

    return () => window.cancelAnimationFrame(recoveryFrame);
  }, [motionTick, networkMode, networkModeStartTick, setMode]);

  useEffect(() => {
    if (networkMode === "stable") {
      animationLocks.current.projects = false;
    }
  }, [networkMode]);


  const triggerNodeAnimation = (node: NodeKey) => {
    if (animationLocks.current[node]) return;

    const timeoutIds = timeouts.current;
    const unlock = () => {
      animationLocks.current[node] = false;
    };

    animationLocks.current[node] = true;

    if (node === "home") {
      setTypingActive(true);
      const done = window.setTimeout(() => {
        setTypingActive(false);
        unlock();
      }, 2400);
      timeoutIds.push(done);
      return;
    }

    if (node === "contact") {
      setPhoneRinging(true);
      const done = window.setTimeout(() => {
        setPhoneRinging(false);
        unlock();
      }, 2800);
      timeoutIds.push(done);
      return;
    }

    if (node === "about") {
      setRouterGlitchActive(true);
      setRouterPowerOn(false);
      setRouterSignalLevel(0);
      setRouterWifiReady(false);
      const powerBack = window.setTimeout(() => setRouterPowerOn(true), 860);
      const signalOne = window.setTimeout(() => setRouterSignalLevel(1), 1460);
      const signalTwo = window.setTimeout(() => setRouterSignalLevel(2), 1940);
      const wifiBack = window.setTimeout(() => setRouterWifiReady(true), 2280);
      const done = window.setTimeout(() => {
        setRouterGlitchActive(false);
        unlock();
      }, 2480);
      timeoutIds.push(powerBack, signalOne, signalTwo, wifiBack, done);
      return;
    }

    setDetachedOrigin({ x: switchLeftCableEnd.x, y: switchLeftCableEnd.y });
    setRepairLooseEnd(null);
    setMode("dropping");
    const grab = window.setTimeout(() => setMode("grabbing"), 1600);
    const repair = window.setTimeout(() => setMode("repairing"), 3600);
    timeoutIds.push(grab, repair);
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const state = dragRef.current;
      const scene = sceneRef.current;

      if (!state || !scene) return;

      const rect = scene.getBoundingClientRect();
      const scaleX = VIEWBOX.width / rect.width;
      const scaleY = VIEWBOX.height / rect.height;
      const pointerX = (event.clientX - rect.left) * scaleX;
      const pointerY = (event.clientY - rect.top) * scaleY;
      const currentNode = nodePositionsRef.current[state.node];
      const bounds = NODE_DRAG_BOUNDS[state.node];
      const nextX = clamp(pointerX - state.offsetX, bounds.minX, bounds.maxX);
      const nextY = clamp(pointerY - state.offsetY, bounds.minY, bounds.maxY);
      const moved = Math.abs(nextX - currentNode.x) > 0.5 || Math.abs(nextY - currentNode.y) > 0.5;

      if (moved && !state.dragStarted) {
        state.dragStarted = true;
        setDraggingNode(state.node);
        setActive(null);
      }

      if (!state.dragStarted) return;

      nodeTargetPositionsRef.current = {
        ...nodeTargetPositionsRef.current,
        [state.node]: resolveNonOverlappingPosition(
          state.node,
          { x: nextX, y: nextY },
          nodePositionsRef.current,
        ),
      };
    };

    const finishPointer = (event: PointerEvent) => {
      const state = dragRef.current;
      if (!state || event.pointerId !== state.pointerId) return;

      const dragged = state.dragStarted;
      const node = state.node;

      if (dragged) {
        nodeTargetPositionsRef.current = {
          ...nodeTargetPositionsRef.current,
          [node]: resolveNonOverlappingPosition(
            node,
            nodeTargetPositionsRef.current[node] ?? nodePositionsRef.current[node],
            nodePositionsRef.current,
          ),
        };
      }

      dragRef.current = null;
      setDraggingNode(null);

      if (!dragged) {
        if (state.node === "contact") {
          playPhoneTapSound();
        }
        openWindowState(node);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishPointer);
    window.addEventListener("pointercancel", finishPointer);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishPointer);
      window.removeEventListener("pointercancel", finishPointer);
    };
  }, [openWindowState]);

  const elapsedSeconds = baseStart && currentTime
    ? Math.max(0, Math.floor((currentTime - baseStart) / 1000) + manualOffset)
    : 0;

  const phaseTick = motionTick - networkModeStartTick;
  const looseEnd = networkMode === "repairing" && repairLooseEnd
    ? repairLooseEnd
    : getLooseEnd(motionTick, networkMode, phaseTick, detachedOrigin, switchLeftCableEnd);
  const serviceCursor = getServiceCursor(networkMode, phaseTick, looseEnd, switchLeftCableEnd);

  useEffect(() => {
    looseEndRef.current = looseEnd;
  }, [looseEnd]);

  const topLineStatus: "green" | "orange" | "none" = networkMode === "stable"
    ? "green"
    : networkMode === "recovering"
      ? "orange"
      : "none";
  const topIndicators = [0.32, 0.7].map((value) => pointOnLine(aboutAttach, projectsAttach, value));
  const diagIndicators = [0.4, 0.78].map((value) => pointOnLine(homeAttach, projectsAttach, value));
  const activePreview = active && !draggingNode ? getPreviewByNode(active) : null;
  const previewStyle = active && !draggingNode ? getPreviewStyle(active, nodePositions) : undefined;
  const nodeStyle = useMemo(() => {
    if (!active || draggingNode) {
      return { about: 1, projects: 1, home: 1, contact: 1 };
    }

    return {
      about: active === "about" ? 1 : 0.98,
      projects: active === "projects" ? 1 : 0.98,
      home: active === "home" ? 1 : 0.98,
      contact: active === "contact" ? 1 : 0.98,
    };
  }, [active, draggingNode]);

  

  const playPhoneTapSound = useCallback(() => {
    const audio = phoneTapAudioRef.current;
    if (!audio) return;
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.7;
      const promise = audio.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }
    } catch {}
  }, []);

  const handlePointerDown = (node: NodeKey, event: ReactPointerEvent<HTMLButtonElement>) => {
    const scene = sceneRef.current;
    const current = nodePositionsRef.current[node];

    setActive(null);

    let offsetX = NODE_META[node].width / 2;
    let offsetY = NODE_META[node].height / 2;

    if (scene) {
      const rect = scene.getBoundingClientRect();
      const scaleX = VIEWBOX.width / rect.width;
      const scaleY = VIEWBOX.height / rect.height;
      const meta = NODE_META[node];
      offsetX = clamp((event.clientX - rect.left) * scaleX - current.x, 0, meta.width);
      offsetY = clamp((event.clientY - rect.top) * scaleY - current.y, 0, meta.height);
    }

    nodeTargetPositionsRef.current = {
      ...nodeTargetPositionsRef.current,
      [node]: { x: current.x, y: current.y },
    };
    nodeVelocityRef.current[node] = { x: 0, y: 0 };

    dragRef.current = {
      node,
      pointerId: event.pointerId,
      offsetX,
      offsetY,
      dragStarted: false,
    };

    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
  };


  

  useEffect(() => {
    const audio = phoneTapAudioRef.current;
    if (!audio) return;
    try {
      audio.preload = "auto";
      audio.load();
    } catch {}
  }, []);

  return (
    <>
      <audio ref={phoneTapAudioRef} src="/phone-click.m4a?v=20260409-9" preload="auto" />
      <section
        className="pt-ui relative h-[100dvh] overflow-hidden bg-[#fbfbfb]"
        onMouseMove={(event) => setMousePosition({ x: Math.round(event.clientX), y: Math.round(event.clientY) })}
      >
        <TopTitleBar />
        <TopBlueBar currentTime={currentTime} mousePosition={mousePosition} />
        <BottomBlueBar
          elapsedSeconds={elapsedSeconds}
          onReset={() => {
            const now = Date.now();
            setBaseStart(now);
            setCurrentTime(now);
            setManualOffset(0);
          }}
          onForward={() => setManualOffset((value) => value + 30)}
        />

        <div className="absolute inset-x-0 bottom-[54px] top-[58px] px-1 pb-2 pt-2 sm:px-2 md:px-2 xl:px-1 2xl:px-0">
          <div className="relative h-full w-full">
            <div className="relative h-full w-full">
              <div ref={sceneRef} className="relative h-full w-full overflow-hidden">
                <motion.svg
                  viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
                  className="pointer-events-none absolute inset-0 z-[20] h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.24 }}
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <WirelessCable from={aboutAttach} to={contactAttach} tick={motionTick} online={routerWifiReady} />

                  {topLineStatus === "green"
                    ? topIndicators.map((point, index) => <StatusTriangle key={`top-${index}`} {...point} />)
                    : topLineStatus === "orange"
                      ? topIndicators.map((point, index) => <StatusOrb key={`top-${index}`} {...point} tick={motionTick + index * 2} />)
                      : null}

                  {diagIndicators.map((point, index) => (
                    <StatusTriangle key={`diag-${index}`} {...point} />
                  ))}

                  {typingActive ? <TrafficPulse from={homeAttach} to={projectsAttach} tick={motionTick} duration={64} delay={14} /> : null}
                  {!routerGlitchActive && active === "about" ? (
                    <TrafficPulse from={aboutAttach} to={contactAttach} tick={motionTick} duration={86} delay={20} dotted color="#a8e6ff" />
                  ) : null}
                </motion.svg>

                <NodeButton
                  node="about"
                  position={nodePositions.about}
                  active={active === "about"}
                  opacity={nodeStyle.about}
                  delay={0.06}
                  layer={40}
                  dragging={draggingNode === "about"}
                  onHover={() => { setActive("about"); triggerNodeAnimation("about"); }}
                  onLeave={() => setActive((current) => (current === "about" ? null : current))}
                  onPointerDown={handlePointerDown}
                  label={NODE_META.about.label}
                  deviceName={NODE_META.about.deviceName}
                >
                  <RouterIllustration networkMode={networkMode} glitchActive={routerGlitchActive} powerOn={routerPowerOn} signalLevel={routerSignalLevel} tick={motionTick} />
                </NodeButton>

                <NodeButton
                  node="projects"
                  position={nodePositions.projects}
                  active={active === "projects"}
                  opacity={nodeStyle.projects}
                  delay={0.1}
                  layer={10}
                  dragging={draggingNode === "projects"}
                  onHover={() => { setActive("projects"); triggerNodeAnimation("projects"); }}
                  onLeave={() => setActive((current) => (current === "projects" ? null : current))}
                  onPointerDown={handlePointerDown}
                  label={NODE_META.projects.label}
                  deviceName={NODE_META.projects.deviceName}
                >
                  <SwitchIllustration
                    networkMode={networkMode}
                    tick={motionTick}
                    active={active === "projects"}
                    uplinkConnected={networkMode === "stable" || networkMode === "recovering"}
                    pcConnected
                  />
                </NodeButton>

                <NodeButton
                  node="home"
                  position={nodePositions.home}
                  active={active === "home"}
                  opacity={nodeStyle.home}
                  delay={0.12}
                  layer={40}
                  dragging={draggingNode === "home"}
                  onHover={() => { setActive("home"); triggerNodeAnimation("home"); }}
                  onLeave={() => setActive((current) => (current === "home" ? null : current))}
                  onPointerDown={handlePointerDown}
                  label={NODE_META.home.label}
                  deviceName={NODE_META.home.deviceName}
                >
                  <PCIllustration typingStep={typingStep} typingActive={typingActive} />
                </NodeButton>

                <NodeButton
                  node="contact"
                  position={nodePositions.contact}
                  active={active === "contact"}
                  opacity={nodeStyle.contact}
                  delay={0.16}
                  layer={40}
                  dragging={draggingNode === "contact"}
                  onHover={() => { setActive("contact"); triggerNodeAnimation("contact"); }}
                  onLeave={() => setActive((current) => (current === "contact" ? null : current))}
                  onPointerDown={handlePointerDown}
                  label={NODE_META.contact.label}
                  deviceName={NODE_META.contact.deviceName}
                >
                  <SmartphoneIllustration ringing={phoneRinging} tick={motionTick} noWifi={!routerWifiReady} currentTime={currentTime} />
                </NodeButton>

                <motion.svg
                  viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
                  className="pointer-events-none absolute inset-0 z-[20] h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.24 }}
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <CableSegment from={aboutAttach} to={switchLeftCableEnd} disconnected={networkMode !== "stable" && networkMode !== "recovering"} looseEnd={looseEnd} />
                  <CableSegment from={homeAttach} to={switchRightCableEnd} />
                </motion.svg>

                {networkMode === "stable" || networkMode === "recovering" ? <DetachedEthernetStub bottom={switchLeftCableEnd} /> : null}
                {networkMode !== "stable" && networkMode !== "recovering" ? <DetachedEthernetStub bottom={looseEnd} /> : null}
                <DetachedEthernetStub bottom={switchRightCableEnd} />
                {serviceCursor ? <ServiceMouse cursor={serviceCursor} /> : null}

                <AnimatePresence>
                  {active && activePreview && previewStyle ? (
                    <>
                      <motion.div
                        key={`preview-${active}`}
                        initial={{ opacity: 0, scale: 0.86, y: 12, filter: "blur(6px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.86, y: 12, filter: "blur(6px)" }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-none absolute z-[20]"
                        style={previewStyle}
                      >
                        {activePreview}
                      </motion.div>
                      <motion.div
                        key={`tip-${active}`}
                        initial={{ opacity: 0, scale: 0.85, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 6 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        style={{ left: `${Math.min(mousePosition.x + 18, 1160)}px`, top: `${Math.max(mousePosition.y - 18, 82)}px` }}
                        className="pointer-events-none fixed z-[120] whitespace-nowrap rounded-full border border-[#d7dee8] bg-white/96 px-3 py-1 text-[11px] font-medium text-[#7a7a7a] shadow-[0_8px_18px_rgba(15,23,42,0.14)]"
                      >
                        Click to open
                      </motion.div>
                    </>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <audio ref={phoneTapAudioRef} src={phoneTapSoundSrc} preload="auto" playsInline />

      <PacketWindow
        open={openWindow === "home"}
        onClose={closeWindowState}
        type="home"
        title="LinkedIn · PC1"
        browserUrl="https://www.linkedin.com/in/roope-aaltonen/"
        browserLink="https://www.linkedin.com/in/roope-aaltonen/"
      >
        <LinkedInPopupScreenshotView />
      </PacketWindow>

      <PacketWindow
        open={openWindow === "about"}
        onClose={closeWindowState}
        type="about"
        title="About Me · Wireless Router1"
        sidebarTitle={SIDEBAR_TITLE.about}
        sidebarItems={aboutSidebarItems}
        shellTitle="Global Settings"
      >
        <AboutPanelContent section={aboutSection} />
      </PacketWindow>

      <PacketWindow
        open={openWindow === "projects"}
        onClose={closeWindowState}
        type="projects"
        title="Projects · Switch0"
        sidebarTitle={SIDEBAR_TITLE.projects}
        sidebarItems={projectsSidebarItems}
        shellTitle={selectedProject ? "Project Case Study" : "Project Overview"}
      >
        <ProjectsPanelContent
          selectedProjectSlug={selectedProjectSlug}
          onSelectProject={selectProject}
          onShowOverview={showProjectOverview}
        />
      </PacketWindow>

      <PacketWindow
        open={openWindow === "contact"}
        onClose={closeWindowState}
        type="contact"
        title="Contact Me · Smartphone0"
        sidebarTitle={SIDEBAR_TITLE.contact}
        sidebarItems={contactSidebarItems}
        shellTitle="Interface Configuration"
      >
        <ContactPanelContent section={contactSection} />
      </PacketWindow>
    </>
  );
}

function TopTitleBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-40 flex h-[30px] items-center justify-center border-b border-[#cfcfcf] bg-[linear-gradient(180deg,#f5f5f5_0%,#e9e9e9_100%)] px-4 text-[13px] font-medium text-[#565656] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      Roope Aaltonen - Interactive network-topology inspired portfolio homepage
    </div>
  );
}

function TopBlueBar({ currentTime, mousePosition }: { currentTime: number | null; mousePosition: { x: number; y: number } }) {
  return (
    <div className="absolute inset-x-0 top-[30px] z-40 flex h-[28px] items-center justify-between bg-[#062f5d] px-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-1.5 text-[12px]">
        <span className="inline-flex h-[24px] items-center rounded-[14px] border border-[#8899b1] bg-[rgba(255,255,255,0.04)] px-3 font-medium text-white/56">Logical</span>
        <span className="inline-flex h-[24px] items-center rounded-[14px] border border-[#8899b1] bg-[rgba(255,255,255,0.03)] px-3 font-medium text-white/52">Physical</span>
        <span className="pl-1 text-[11px] text-white/62">x: {mousePosition.x}, y: {mousePosition.y}</span>
      </div>

      <div className="flex items-center gap-1.5 text-[12px]">
        <span className="mr-1 text-[11px] text-white/58">Root</span>
        {["?", "✷", "✣", "△", "◎"].map((icon, index) => (
          <span key={`${icon}-${index}`} className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#8899b1] bg-[rgba(255,255,255,0.03)] text-[12px] text-white/48">
            {icon}
          </span>
        ))}
        <span className="rounded-full border border-[#8899b1] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-[12px] font-medium text-white/64">
          {currentTime ? formatClock(new Date(currentTime)) : "00.00.00"}
        </span>
      </div>
    </div>
  );
}

function BottomBlueBar({ elapsedSeconds, onReset, onForward }: { elapsedSeconds: number; onReset: () => void; onForward: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex h-[54px] items-center justify-between bg-[#062f5d] px-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="min-w-[112px]">Time: {formatElapsed(elapsedSeconds)}</span>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border border-[#8394ab] bg-[rgba(255,255,255,0.04)] text-white/72 transition hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="Reset timer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="block">
            <path
              d="M8.2 7.2H4.4V3.4M5 6.2C6.7 4.2 9.2 3 12 3C17 3 21 7 21 12C21 17 17 21 12 21C7.7 21 4.2 18 3.3 14.1"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={onForward}
          className="inline-flex h-[30px] w-[44px] items-center justify-center rounded-[4px] border border-[#8394ab] bg-[rgba(255,255,255,0.04)] text-white/72 transition hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="Add 30 seconds"
        >
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true" className="block">
            <path d="M2 2.2L8.2 8L2 13.8V2.2Z" fill="currentColor" />
            <path d="M9.2 2.2L15.4 8L9.2 13.8V2.2Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[13px] font-medium">
        <span className="inline-flex h-[30px] items-center rounded-[4px] border border-[#8394ab] bg-[rgba(255,255,255,0.03)] px-4 text-white/56">Realtime</span>
        <span className="inline-flex h-[30px] items-center rounded-[4px] border border-[#8394ab] bg-[rgba(255,255,255,0.03)] px-4 text-white/52">Simulation</span>
      </div>
    </div>
  );
}

function NodeButton({
  node,
  position,
  active,
  opacity,
  delay,
  layer = 30,
  dragging,
  onHover,
  onLeave,
  onPointerDown,
  label,
  deviceName,
  children,
}: {
  node: NodeKey;
  position: NodePosition;
  active: boolean;
  opacity: number;
  delay: number;
  layer?: number;
  dragging: boolean;
  onHover: () => void;
  onLeave: () => void;
  onPointerDown: (node: NodeKey, event: ReactPointerEvent<HTMLButtonElement>) => void;
  label: string;
  deviceName: string;
  children: ReactNode;
}) {
  const meta = NODE_META[node];
  const haloSize = NODE_PROTECTIVE_HALO;
  const debugRects = DEBUG_NODE_HALOS ? getNodeCollisionRects(node, { x: 0, y: 0 }, haloSize) : [];

  return (
    <div
      className="absolute overflow-visible"
      style={{ zIndex: layer, 
        left: `${(position.x / VIEWBOX.width) * 100}%`,
        top: `${(position.y / VIEWBOX.height) * 100}%`,
        width: `${(meta.width / VIEWBOX.width) * 100}%`,
        height: `${(meta.height / VIEWBOX.height) * 100}%`,
        opacity,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocusCapture={onHover}
      onBlurCapture={onLeave}
    >
      <button
        type="button"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => onPointerDown(node, event)}
        onContextMenu={(event) => event.preventDefault()}
        className="group relative flex h-full w-full flex-col overflow-visible select-none text-left focus:outline-none"
        style={{ touchAction: "none", cursor: dragging ? "grabbing" : "grab", userSelect: "none", zIndex: active ? 18 : 12 }}
      >
        <motion.div
          animate={{
            scale: active ? 1.035 : 1,
            y: active && !dragging ? -4 : 0,
            filter: active
              ? "drop-shadow(0 20px 24px rgba(15,23,42,0.11)) drop-shadow(0 5px 14px rgba(18,127,166,0.10))"
              : "drop-shadow(0 12px 16px rgba(15,23,42,0.06)) drop-shadow(0 3px 8px rgba(18,127,166,0.05))",
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none relative z-10 flex justify-center"
        >
          
        {DEBUG_NODE_HALOS
          ? debugRects.map((rect, index) => (
              <div
                key={`${node}-halo-${index}`}
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  left: `${rect.left}px`,
                  top: `${rect.top}px`,
                  width: `${rect.right - rect.left}px`,
                  height: `${rect.bottom - rect.top}px`,
                  background: DEBUG_HALO_COLORS[node],
                  border: `1px dashed ${DEBUG_HALO_BORDERS[node]}`,
                  boxShadow: `inset 0 0 0 1px ${DEBUG_HALO_BORDERS[node]}`,
                  borderRadius: "999px",
                }}
              />
            ))
          : null}
        {children}
        </motion.div>

        <div
          className="mt-[12px] flex flex-col items-center justify-center text-center leading-tight"
          style={{ transform: NODE_META[node].labelOffsetX ? `translateX(${NODE_META[node].labelOffsetX}px)` : undefined }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#7f8b9d] drop-shadow-none [text-shadow:none]">{deviceName}</p>
          <p className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-[#050505] drop-shadow-none [text-shadow:none]">{label}</p>
        </div>
      </button>
    </div>
  );
}

function PreviewWindow({
  title,
  tab,
  sidebarTitle,
  sidebarItems,
  children,
  hideSidebar = false,
}: {
  title: string;
  tab: string;
  sidebarTitle: string;
  sidebarItems: string[];
  children: ReactNode;
  hideSidebar?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#c8c8c8] bg-[#ededed] shadow-[0_24px_54px_rgba(15,23,42,0.22)]">
      <div className="relative flex h-[30px] items-center justify-center border-b border-[#d0d0d0] bg-[linear-gradient(180deg,#f7f7f7_0%,#ececec_100%)] px-3 text-[11px] font-medium text-[#6e6e6e]">
        {title}
        <span className="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-[3px] border border-[#d0d0d0] bg-[#f2f2f2] text-[13px] leading-none text-[#8d8d8d]">
          ×
        </span>
      </div>
      <div className="flex h-[28px] items-end justify-center gap-1.5 border-b border-[#d8d8d8] bg-[#f4f4f4] px-3 pt-1.5 text-[10px]">
        {[
          { label: "About Me", active: title.startsWith("About") },
          { label: "Projects", active: title.startsWith("Projects") },
          { label: "LinkedIn", active: title.startsWith("LinkedIn") },
          { label: "Contact Me", active: title.startsWith("Contact") },
        ].map((item) => (
          <span key={item.label} className={`rounded-t-[2px] border border-b-0 px-2 py-[3px] ${item.active ? "border-[#c4c4c4] bg-[#f9f9f9] text-[#656565]" : "border-transparent text-[#a9a9a9]"}`}>
            {item.label}
          </span>
        ))}
      </div>
      <div className={`grid h-[236px] ${hideSidebar ? "grid-cols-1" : "grid-cols-[92px_1fr]"} gap-2 p-2`}>
        {!hideSidebar ? (
          <div className="overflow-hidden rounded-[2px] border border-[#c9c9c9] bg-white">
            <div className="border-b border-[#d7d7d7] bg-[#f5f5f5] px-2 py-1 text-center text-[10px] font-semibold text-[#8b8b8b]">{sidebarTitle}</div>
            <div className="space-y-0 text-[10px]">
              {sidebarItems.map((item, index) => (
                <div key={item} className={`border-b border-[#efefef] px-2 py-1.5 ${index === 0 ? "bg-[#f8f8f8] text-[#9b9b9b]" : "text-[#b7b7b7]"}`}>{item}</div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="overflow-hidden rounded-[2px] border border-[#cfcfcf] bg-white">
          <div className="border-b border-[#d9d9d9] bg-[#fbfbfb] px-3 py-1.5 text-center text-[11px] font-medium text-[#747474]">Global Settings</div>
          <div className="h-[calc(100%-31px)] overflow-hidden p-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function BrowserPreviewWindow() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#c8c8c8] bg-[#ededed] shadow-[0_24px_54px_rgba(15,23,42,0.22)]">
      <div className="relative flex h-[30px] items-center justify-center border-b border-[#d0d0d0] bg-[linear-gradient(180deg,#f7f7f7_0%,#ececec_100%)] px-3 text-[11px] font-medium text-[#6e6e6e]">
        LinkedIn · PC1
        <span className="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-[3px] border border-[#d0d0d0] bg-[#f2f2f2] text-[13px] leading-none text-[#8d8d8d]">
          ×
        </span>
      </div>
      <div className="flex h-[28px] items-end justify-center gap-1.5 border-b border-[#d8d8d8] bg-[#f4f4f4] px-3 pt-1.5 text-[10px]">
        {[
          { label: "About Me", active: false },
          { label: "Projects", active: false },
          { label: "LinkedIn", active: true },
          { label: "Contact Me", active: false },
        ].map((item) => (
          <span key={item.label} className={`rounded-t-[2px] border border-b-0 px-2 py-[3px] ${item.active ? "border-[#c4c4c4] bg-[#f9f9f9] text-[#656565]" : "border-transparent text-[#a9a9a9]"}`}>{item.label}</span>
        ))}
      </div>
      <div className="h-[236px] bg-[#ededed] p-2">
        <div className="overflow-hidden border border-[#c7c7c7] bg-[#f4f4f4]">
          <div className="flex h-[24px] items-center bg-[#0d16ff] px-2 text-[10px] text-white">Web Browser</div>
          <div className="flex items-center gap-1 border-b border-[#d0d0d0] bg-[#efefef] px-2 py-1 text-[9px] text-[#666666]">
            <span className="inline-flex h-4 w-4 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8]">&lt;</span>
            <span className="inline-flex h-4 w-4 items-center justify-center border border-[#c8c8c8] bg-[#f8f8f8]">&gt;</span>
            <span>URL</span>
            <span className="flex-1 truncate border border-[#cdcdcd] bg-white px-1 py-[2px]">https://www.linkedin.com/in/roope-aaltonen/</span>
            <span className="inline-flex h-4 items-center border border-[#c8c8c8] bg-[#f8f8f8] px-2">Go</span>
          </div>
          <div className="h-[182px] bg-white">
            <LinkedInMonitorView />
          </div>
        </div>
      </div>
    </div>
  );
}

function getPreviewByNode(node: NodeKey) {
  switch (node) {
    case "about":
      return (
        <PreviewWindow title="About Me · Wireless Router1" tab="Config" sidebarTitle={SIDEBAR_TITLE.about} sidebarItems={["Profile", "Direction", "Studies", "Reliability"]} hideSidebar>
          <AboutPanelContent preview />
        </PreviewWindow>
      );
    case "projects":
      return (
        <PreviewWindow title="Projects · Switch0" tab="Config" sidebarTitle={SIDEBAR_TITLE.projects} sidebarItems={["Overview", ...projects.slice(0, 3).map((project) => project.title)]} hideSidebar>
          <ProjectsPanelContent preview />
        </PreviewWindow>
      );
    case "contact":
      return (
        <PreviewWindow title="Contact Me · Smartphone0" tab="Config" sidebarTitle={SIDEBAR_TITLE.contact} sidebarItems={["Channels", "Role fit", "CV", "Status"]} hideSidebar>
          <ContactPanelContent preview />
        </PreviewWindow>
      );
    default:
      return <BrowserPreviewWindow />;
  }
}


function EthernetHeadGraphic({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="10" height="8.4" rx="1.8" fill="#eef6f8" stroke="#4b5d67" strokeWidth="0.8" />
      <rect x="2" y="2" width="8" height="1.8" rx="0.9" fill="#d8e5eb" />
      {Array.from({ length: 6 }).map((_, index) => (
        <rect key={index} x={2.3 + index * 1.22} y={4.25} width="0.72" height="1.9" rx="0.18" fill="#d7b24f" />
      ))}
      <path d="M2.2 9.1H9.8V10.7L8.6 12H3.4L2.2 10.7V9.1Z" fill="#d8e7ec" stroke="#4b5d67" strokeWidth="0.72" strokeLinejoin="round" />
    </svg>
  );
}


function DetachedEthernetStub({ bottom }: { bottom: { x: number; y: number } }) {
  const color = "#111111";
  const headWidth = 18.5;
  const headHeight = 18.0;

  const x = bottom.x - headWidth / 2;
  const y = bottom.y - headHeight;

  return (
    <svg
      viewBox="32 14 170 170"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute z-[90] overflow-visible"
      style={{
        left: `${(x / VIEWBOX.width) * 100}%`,
        top: `${(y / VIEWBOX.height) * 100}%`,
        width: `${(headWidth / VIEWBOX.width) * 100}%`,
        height: `${(headHeight / VIEWBOX.height) * 100}%`,
      }}
      aria-hidden="true"
    >
      <path
        fill={color}
        stroke="#0a0a0c"
        strokeWidth="6"
        strokeLinejoin="round"
        d="M 83 16 L 75 20 L 72 29 L 68 34 L 49 34 L 42 38 L 38 45 L 38 153 L 32 156 L 27 163 L 27 242 L 36 291 L 42 314 L 42 320 L 46 331 L 53 339 L 64 345 L 64 355 L 57 360 L 56 368 L 60 373 L 66 377 L 59 383 L 58 393 L 68 402 L 62 406 L 59 414 L 62 421 L 66 423 L 82 423 L 84 425 L 142 425 L 144 423 L 161 423 L 167 418 L 168 412 L 165 406 L 161 404 L 159 401 L 166 397 L 169 393 L 169 385 L 161 377 L 167 373 L 171 368 L 171 362 L 163 354 L 163 345 L 175 338 L 183 327 L 200 242 L 200 163 L 195 156 L 189 153 L 189 45 L 187 41 L 178 34 L 159 34 L 156 31 L 152 20 L 144 16 Z"
      />
      <path
        fill="#d9d9d9"
        d="M 51 50 L 54 47 L 58 49 L 59 83 L 69 83 L 70 48 L 72 49 L 73 83 L 83 83 L 83 49 L 85 47 L 87 49 L 87 82 L 97 83 L 97 49 L 99 47 L 101 49 L 101 82 L 111 83 L 112 48 L 114 47 L 115 80 L 116 83 L 125 83 L 126 49 L 128 47 L 130 49 L 130 83 L 139 83 L 140 49 L 142 47 L 144 49 L 144 83 L 153 83 L 155 80 L 155 49 L 157 48 L 158 82 L 167 83 L 169 81 L 169 49 L 173 47 L 176 50 L 176 152 L 174 154 L 53 154 L 51 152 Z"
      />
    </svg>
  );
}

function CableSegment({ from, to, disconnected = false, looseEnd }: { from: { x: number; y: number }; to: { x: number; y: number }; disconnected?: boolean; looseEnd?: { x: number; y: number } }) {
  const end = disconnected && looseEnd ? looseEnd : to;
  const direction = Math.sign(end.x - from.x) || 1;
  const elbowBaseY = end.y + 9;
  const cornerRadius = Math.min(9, Math.max(6, Math.abs(end.x - from.x) * 0.03));
  const bendStartX = end.x - direction * (cornerRadius + 2);
  const bendEndY = elbowBaseY - cornerRadius;

  return (
    <path
      d={`M ${from.x} ${from.y} L ${bendStartX} ${elbowBaseY} Q ${end.x} ${elbowBaseY} ${end.x} ${bendEndY} L ${end.x} ${end.y}`}
      fill="none"
      stroke={disconnected ? "#101010" : "#111111"}
      strokeWidth={5.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function WirelessCable({ from, to, tick, online }: { from: { x: number; y: number }; to: { x: number; y: number }; tick: number; online: boolean }) {
  if (!online) return null;
  void tick;

  const wirelessPath = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <>
      <path
        d={wirelessPath}
        fill="none"
        stroke="#111111"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2.4 7.4"
        opacity={0.98}
      />
    </>
  );
}

function TrafficPulse({ from, to, tick, duration, delay, dotted = false, color = "#e7f9ff" }: { from: { x: number; y: number }; to: { x: number; y: number }; tick: number; duration: number; delay: number; dotted?: boolean; color?: string }) {
  const progress = ((tick + delay) % duration) / duration;
  const x = lerp(from.x, to.x, progress);
  const y = lerp(from.y, to.y, progress);
  return <circle cx={x} cy={y} r={dotted ? 3.6 : 4.8} fill={color} opacity={0.9} />;
}

function StatusTriangle({ x, y }: { x: number; y: number }) {
  return <polygon points={`${x},${y - 16} ${x - 14},${y + 12} ${x + 14},${y + 12}`} fill="#43c729" opacity={1} />;
}

function StatusOrb({ x, y, tick }: { x: number; y: number; tick: number }) {
  const scale = 1 + Math.sin(tick / 2) * 0.06;
  return <circle cx={x} cy={y} r={11.5 * scale} fill="#e38b1a" opacity={0.98} />;
}

function ServiceMouse({ cursor }: { cursor: { x: number; y: number; state: CursorState } }) {
  const gripOffset = cursor.state === "pointer"
    ? { x: 8, y: 6 }
    : cursor.state === "open"
      ? { x: 16, y: 15 }
      : { x: 16, y: 15 };

  return (
    <div
      className="pointer-events-none absolute z-[85]"
      style={{
        left: `${((cursor.x - gripOffset.x) / VIEWBOX.width) * 100}%`,
        top: `${((cursor.y - gripOffset.y) / VIEWBOX.height) * 100}%`,
        willChange: "left, top",
        filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.55)) drop-shadow(0 2px 3px rgba(0,0,0,0.18))",
      }}
    >
      {cursor.state === "pointer" ? (
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
          <path d="M3 2.2 L24.4 18.2 L15.9 18.5 L18.4 31.4 L13.9 33 L11.1 20.1 L5 25.4 Z" fill="#ffffff" stroke="#151515" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ) : cursor.state === "closed" ? (
        <svg width="38" height="42" viewBox="0 0 38 42" fill="none" aria-hidden="true">
          <path d="M14.2 4.6V15.1M19.2 4.4V13.7M24.1 6.7V14.2M29 9.2V18.4M7.6 18.2L12.2 22.1V8.3C12.2 5.7 13.3 4 15 4C16.8 4 17.8 5.3 17.8 7.7V16.4V6.6C17.8 4.6 18.8 3.4 20.3 3.4C21.9 3.4 22.9 4.8 22.9 6.7V15.4V8.8C22.9 7 23.9 5.8 25.4 5.8C26.9 5.8 27.9 7 27.9 8.8V17.1V11.1C27.9 9.4 29 8.2 30.5 8.2C32.1 8.2 33.2 9.6 33.2 11.4V22.3C33.2 30.1 27.6 35 20.2 35H17.4C12.4 35 8.5 32.3 7 27.6L4.4 19.7C3.8 17.7 4.6 16.1 6.1 15.5C7.7 14.9 9 15.8 10 17.5L12.2 21.2" fill="#fff4df" stroke="#2a2016" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="40" height="44" viewBox="0 0 40 44" fill="none" aria-hidden="true">
          <path d="M14.9 4.8V16.2M20 4.5V14.8M25 6.8V15.3M29.9 9.3V18.8M8.1 18.5L12.8 22.6V8.4C12.8 5.8 13.9 4.1 15.7 4.1C17.4 4.1 18.4 5.4 18.4 7.8V16.8V6.7C18.4 4.8 19.5 3.6 21 3.6C22.6 3.6 23.6 4.9 23.6 6.9V15.8V8.9C23.6 7.2 24.6 6 26.1 6C27.6 6 28.6 7.2 28.6 8.9V17.6V11.4C28.6 9.8 29.8 8.6 31.3 8.6C32.9 8.6 34 9.9 34 11.7V22.8C34 30.8 28.2 35.9 20.7 35.9H17.8C12.7 35.9 8.7 33.1 7.2 28.3L4.5 20.1C3.8 18.1 4.7 16.5 6.2 15.9C7.8 15.2 9.2 16.2 10.2 17.9L12.8 22.2" fill="#fff8ea" stroke="#2a2016" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function RouterIllustration({
  compact = false,
  networkMode = "stable",
  glitchActive = false,
  powerOn = true,
  signalLevel = 2,
  tick = 0,
}: {
  compact?: boolean;
  networkMode?: NetworkMode;
  glitchActive?: boolean;
  powerOn?: boolean;
  signalLevel?: 0 | 1 | 2;
  tick?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    antenna: `${uid}-router-antenna`,
    top: `${uid}-router-top`,
    topHighlight: `${uid}-router-top-highlight`,
    shell: `${uid}-router-shell`,
    frontTop: `${uid}-router-front-top`,
    frontBand: `${uid}-router-front-band`,
    frontBottom: `${uid}-router-front-bottom`,
    powerOuter: `${uid}-router-power-outer`,
    powerInner: `${uid}-router-power-inner`,
    led: `${uid}-router-led`,
    ledGlow: `${uid}-router-led-glow`,
    bodyShadow: `${uid}-router-body-shadow`,
    softBlur: `${uid}-router-soft-blur`,
  };

  const ledStates = [
    powerOn,
    powerOn && signalLevel >= 1,
    powerOn && signalLevel >= 1 && networkMode !== "dropping",
    powerOn && signalLevel >= 2,
    powerOn && networkMode !== "repairing",
    powerOn && networkMode === "stable" && !glitchActive,
  ];

  const ledXs = [250, 286, 322, 358, 394, 430];
  const ledPulse = 0.85 + Math.sin(tick / 4) * 0.12;
  const frontLineOpacity = glitchActive ? 0.58 : 0.86;

  return (
    <motion.div
      className={`relative ${compact ? "scale-[0.72]" : "scale-100"}`}
      animate={glitchActive ? { rotate: [0, -0.6, 0.8, 0], y: [0, 0.4, -0.4, 0] } : { rotate: 0, y: 0 }}
      transition={glitchActive ? { duration: 0.9, repeat: 2, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <div className="relative h-[194px] w-[226px]">
        <div className="absolute left-1/2 top-[29px] h-[136px] w-[200px] -translate-x-1/2">
          <div className="pointer-events-none absolute left-[28px] top-[98px] h-[22px] w-[146px] rounded-full bg-[#0b1a30]/16 blur-[9px]" />
          <svg
            viewBox="0 0 520 340"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="White wireless router with two antennas"
            className="absolute inset-0 h-full w-full"
            style={{ display: "block", shapeRendering: "geometricPrecision", filter: DEVICE_FLOAT_FILTER }}
            preserveAspectRatio="xMidYMid meet"
          >
          <defs>
            <linearGradient id={ids.antenna} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="58%" stopColor="#f2f3f5" />
              <stop offset="100%" stopColor="#ced1d5" />
            </linearGradient>

            <linearGradient id={ids.top} x1="120" y1="92" x2="408" y2="172" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f6f6f7" />
              <stop offset="46%" stopColor="#ececee" />
              <stop offset="100%" stopColor="#dedfe2" />
            </linearGradient>

            <linearGradient id={ids.topHighlight} x1="260" y1="120" x2="260" y2="168" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id={ids.shell} x1="78" y1="150" x2="442" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f7f7f8" />
              <stop offset="100%" stopColor="#d7d9dc" />
            </linearGradient>

            <linearGradient id={ids.frontTop} x1="260" y1="150" x2="260" y2="186" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fefefe" />
              <stop offset="100%" stopColor="#eceef0" />
            </linearGradient>

            <linearGradient id={ids.frontBand} x1="260" y1="186" x2="260" y2="236" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d8c5b5" />
              <stop offset="100%" stopColor="#d1bead" />
            </linearGradient>

            <linearGradient id={ids.frontBottom} x1="260" y1="236" x2="260" y2="271" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f0f1f3" />
              <stop offset="100%" stopColor="#d9dbde" />
            </linearGradient>

            <radialGradient id={ids.powerOuter} cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#ff9ba8" />
              <stop offset="65%" stopColor="#d8687f" />
              <stop offset="100%" stopColor="#c64f6b" />
            </radialGradient>

            <radialGradient id={ids.powerInner} cx="34%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#fff4f6" />
              <stop offset="100%" stopColor="#f0d4da" />
            </radialGradient>

            <radialGradient id={ids.led} cx="38%" cy="34%" r="70%">
              <stop offset="0%" stopColor="#b2f89e" />
              <stop offset="68%" stopColor="#58d66a" />
              <stop offset="100%" stopColor="#2ca24f" />
            </radialGradient>

            <radialGradient id={ids.ledGlow} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(146,255,128,0.7)" />
              <stop offset="100%" stopColor="rgba(146,255,128,0)" />
            </radialGradient>

            <filter id={ids.bodyShadow} x="-24%" y="-30%" width="148%" height="190%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.22" />
            </filter>

            <filter id={ids.softBlur} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.1" />
            </filter>
          </defs>

          <ellipse cx="262" cy="286" rx="188" ry="20" fill="rgba(0,0,0,0.14)" filter={`url(#${ids.softBlur})`} />

          <g filter={`url(#${ids.bodyShadow})`}>
            <rect
              x="165"
              y="-12"
              width="24"
              height="152"
              rx="12"
              fill={`url(#${ids.antenna})`}
              stroke="#d0d3d8"
              strokeWidth="2"
              transform="rotate(-11 177 140)"
            />
            <rect
              x="330"
              y="-12"
              width="24"
              height="152"
              rx="12"
              fill={`url(#${ids.antenna})`}
              stroke="#d0d3d8"
              strokeWidth="2"
              transform="rotate(11 342 140)"
            />

            <path
              d="M140 98H380L442 150H78L140 98Z"
              fill={`url(#${ids.top})`}
              stroke="#bfc2c7"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            <path
              d="M160 110H360L405 145H115L160 110Z"
              fill={`url(#${ids.topHighlight})`}
              opacity="0.8"
            />

            <rect
              x="78"
              y="150"
              width="364"
              height="121"
              rx="13"
              fill={`url(#${ids.shell})`}
              stroke="#b7bbc1"
              strokeWidth="2.2"
            />

            <rect x="80" y="152" width="360" height="34" rx="10" fill={`url(#${ids.frontTop})`} />
            <rect x="80" y="186" width="360" height="50" fill={`url(#${ids.frontBand})`} />
            <rect x="80" y="236" width="360" height="33" rx="0" fill={`url(#${ids.frontBottom})`} />

            <path d="M80 186H440" stroke="#c8b3a1" strokeWidth="1.8" opacity={frontLineOpacity} />
            <path d="M80 236H440" stroke="#c3c7cd" strokeWidth="1.8" opacity={frontLineOpacity} />

            <ellipse cx="122" cy="210" rx="27" ry="27" fill={`url(#${ids.powerOuter})`} stroke="#b44c61" strokeWidth="2.2" />
            <ellipse cx="122" cy="210" rx="18" ry="18" fill={`url(#${ids.powerInner})`} />
            <path d="M122 200V214" stroke="#cb5a73" strokeWidth="4.1" strokeLinecap="round" />
            <path d="M112 208C112 201.9 116.9 197 123 197C129.1 197 134 201.9 134 208" fill="none" stroke="#cb5a73" strokeWidth="4.1" strokeLinecap="round" />

            {ledXs.map((x, index) => {
              const isOn = ledStates[index];
              const ledOpacity = isOn ? Math.max(0.64, ledPulse) : 0.24;
              return (
                <g key={x}>
                  <circle
                    cx={x}
                    cy="210"
                    r="12"
                    fill={`url(#${ids.ledGlow})`}
                    opacity={isOn ? 0.56 : 0}
                  />
                  <circle
                    cx={x}
                    cy="210"
                    r="7.6"
                    fill={isOn ? `url(#${ids.led})` : "#8f9297"}
                    stroke={isOn ? "#3ca753" : "#777b81"}
                    strokeWidth="1.25"
                    opacity={ledOpacity}
                  />
                </g>
              );
            })}
          </g>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function SwitchIllustration({
  compact = false,
  networkMode = "stable",
  tick = 0,
  active = false,
}: {
  compact?: boolean;
  networkMode?: NetworkMode;
  tick?: number;
  active?: boolean;
  uplinkConnected?: boolean;
  pcConnected?: boolean;
}) {
  void networkMode;
  void tick;

  const uid = useId().replace(/:/g, "");

  const ids = {
    left: `${uid}-left`,
    top: `${uid}-top`,
    front: `${uid}-front`,
    bezel: `${uid}-bezel`,
    led: `${uid}-led`,
    portShell: `${uid}-port-shell`,
    portInner: `${uid}-port-inner`,
    portLip: `${uid}-port-lip`,
    topClip: `${uid}-top-clip`,
    leftClip: `${uid}-left-clip`,
    frontClip: `${uid}-front-clip`,
  };

  const portXs = [214, 308, 402, 496, 590, 684, 778];

  return (
    <motion.div
      className={`${compact ? "scale-[0.78]" : "scale-100"}`}
      animate={active ? { y: [0, -1, 0] } : { y: 0 }}
      transition={active ? { duration: 0.55, repeat: 1, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <div className="relative h-[194px] w-[226px]">
        <div className="absolute left-1/2 top-[23px] h-[86px] w-[176px] origin-top -translate-x-1/2 scale-[1.08]">
          <div className="pointer-events-none absolute left-[32px] top-[93px] h-[18px] w-[154px] rounded-full bg-[#0b1a30]/16 blur-[10px]" />

          <svg
            viewBox="0 0 1018 482"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Blue network switch"
            className="absolute inset-0 h-full w-full"
            style={{ display: "block", shapeRendering: "geometricPrecision", filter: DEVICE_FLOAT_FILTER }}
            preserveAspectRatio="none"
          >
          <defs>
            <linearGradient id={ids.left} x1="50" y1="22" x2="553" y2="289" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5c739b" />
              <stop offset="100%" stopColor="#4b648f" />
            </linearGradient>

            <linearGradient id={ids.top} x1="306" y1="22" x2="967" y2="289" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#314a73" />
              <stop offset="100%" stopColor="#223961" />
            </linearGradient>

            <linearGradient id={ids.front} x1="50" y1="289" x2="967" y2="454" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#45618f" />
              <stop offset="100%" stopColor="#2f4975" />
            </linearGradient>

            <linearGradient id={ids.bezel} x1="191" y1="318" x2="892" y2="425" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f5f3ef" />
              <stop offset="70%" stopColor="#d8d7d3" />
              <stop offset="100%" stopColor="#c8c7c3" />
            </linearGradient>

            <linearGradient id={ids.led} x1="73" y1="322" x2="107" y2="356" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#faf8f2" />
              <stop offset="100%" stopColor="#dddbd4" />
            </linearGradient>

            <linearGradient id={ids.portShell} x1="0" y1="334" x2="0" y2="402" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2d4670" />
              <stop offset="40%" stopColor="#243d66" />
              <stop offset="100%" stopColor="#142949" />
            </linearGradient>

            <linearGradient id={ids.portInner} x1="0" y1="344" x2="0" y2="401" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2f4874" />
              <stop offset="100%" stopColor="#1f365d" />
            </linearGradient>

            <linearGradient id={ids.portLip} x1="0" y1="334" x2="0" y2="347" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#50688f" />
              <stop offset="100%" stopColor="#304a74" />
            </linearGradient>

            <clipPath id={ids.topClip}>
              <path d="M306 22H812L967 289H553L306 22Z" />
            </clipPath>

            <clipPath id={ids.leftClip}>
              <path d="M50 289L228 22H306L553 289H50Z" />
            </clipPath>

            <clipPath id={ids.frontClip}>
              <rect x="50" y="289" width="917" height="165" rx="11" />
            </clipPath>
          </defs>

          <g>
            <path
              d="M50 289L228 22H306L553 289H50Z"
              fill={`url(#${ids.left})`}
              stroke="#324b75"
              strokeWidth="3"
            />

            <path
              d="M306 22H812L967 289H553L306 22Z"
              fill={`url(#${ids.top})`}
              stroke="#22355a"
              strokeWidth="3"
            />

            <polygon points="247,22 288,22 585,289 544,289" fill="#eef6f6" />

            <polygon
              points="620,22 812,22 889,154 767,154"
              fill="#b9d2e6"
              opacity="0.97"
            />

            <g clipPath={`url(#${ids.topClip})`}>
              <path
                d="M338 48C398 34 488 36 569 55C629 70 671 93 686 116C697 133 690 147 664 154C621 166 550 162 475 145C401 128 345 102 325 77C314 63 318 53 338 48Z"
                fill="#2a426b"
                opacity="0.34"
              />
              <path
                d="M449 78C500 70 566 74 615 92C648 104 668 121 670 135C671 147 660 156 634 160C585 167 520 162 471 145C437 133 416 116 412 102C409 90 421 82 449 78Z"
                fill="#1d3458"
                opacity="0.22"
              />
              <path
                d="M602 149C660 143 737 151 798 170C850 186 890 211 906 235C917 251 911 263 886 269C833 281 752 275 678 255C609 236 560 210 547 187C538 171 553 155 602 149Z"
                fill="#183052"
                opacity="0.28"
              />
              <path
                d="M539 244C558 240 587 241 605 248C617 253 619 262 609 267C593 274 565 275 547 270C534 266 529 257 539 244Z"
                fill="#7f9fc4"
                opacity="0.24"
              />
              <path
                d="M705 40C752 37 805 45 839 63C860 74 871 89 869 101C867 113 851 120 822 121C775 124 721 116 687 99C666 88 655 74 658 62C661 50 676 42 705 40Z"
                fill="#aac8df"
                opacity="0.18"
              />
            </g>

            <g clipPath={`url(#${ids.leftClip})`}>
              <path
                d="M86 245C138 238 213 239 273 248C316 255 344 267 347 277C349 287 325 293 279 294C220 295 152 286 103 274C72 266 58 257 60 250C63 248 72 247 86 245Z"
                fill="#6f89b1"
                opacity="0.16"
              />
              <path
                d="M74 282C126 276 211 278 294 289H50L74 282Z"
                fill="#3f5884"
                opacity="0.12"
              />
            </g>

            <rect
              x="50"
              y="289"
              width="917"
              height="165"
              rx="11"
              fill={`url(#${ids.front})`}
              stroke="#2b416c"
              strokeWidth="3"
            />

            <rect x="50" y="289" width="917" height="14" fill="#38527d" opacity="0.9" />

            <g clipPath={`url(#${ids.frontClip})`}>
              <path
                d="M523 293C560 286 608 289 628 300C642 308 637 319 613 323C577 330 527 327 508 317C496 310 501 297 523 293Z"
                fill="#6b86af"
                opacity="0.20"
              />
              <path
                d="M511 331C553 322 609 325 633 341C648 352 641 367 605 370C562 373 512 364 493 349C481 340 487 336 511 331Z"
                fill="#5673a0"
                opacity="0.24"
              />
              <path
                d="M731 338C814 328 913 338 951 360C971 372 966 390 927 397C856 409 764 405 719 389C690 378 691 343 731 338Z"
                fill="#1c3257"
                opacity="0.22"
              />
              <path
                d="M58 421C132 414 224 417 250 429C261 434 259 444 234 447C164 456 83 454 58 442C47 437 45 424 58 421Z"
                fill="#5875a1"
                opacity="0.22"
              />
              <path
                d="M445 437C548 423 673 424 711 439C726 446 719 454 681 459C583 468 474 467 437 454C424 449 425 440 445 437Z"
                fill="#20375c"
                opacity="0.20"
              />
            </g>

            <rect
              x="73"
              y="322"
              width="34"
              height="34"
              rx="2"
              fill={`url(#${ids.led})`}
              stroke="#d6d4cd"
              strokeWidth="2"
            />

            <rect
              x="191"
              y="318"
              width="701"
              height="107"
              rx="1.5"
              fill={`url(#${ids.bezel})`}
              stroke="#acaca8"
              strokeWidth="3"
            />

            {portXs.map((x) => (
              <g key={x}>
                <path
                  d={`
                    M ${x} 401
                    L ${x} 352
                    Q ${x} 345 ${x + 6} 345
                    L ${x + 23} 345
                    L ${x + 31} 334
                    L ${x + 53} 334
                    L ${x + 61} 345
                    L ${x + 78} 345
                    Q ${x + 84} 345 ${x + 84} 352
                    L ${x + 84} 401
                    Z
                  `}
                  fill={`url(#${ids.portShell})`}
                />

                <path
                  d={`
                    M ${x + 7} 399
                    L ${x + 7} 355
                    Q ${x + 7} 350 ${x + 11} 350
                    L ${x + 26} 350
                    L ${x + 33} 341
                    L ${x + 51} 341
                    L ${x + 58} 350
                    L ${x + 73} 350
                    Q ${x + 77} 350 ${x + 77} 355
                    L ${x + 77} 399
                    Z
                  `}
                  fill={`url(#${ids.portInner})`}
                />

                <path
                  d={`
                    M ${x + 2} 347
                    Q ${x + 3} 341 ${x + 9} 341
                    L ${x + 24} 341
                    L ${x + 32} 331
                    L ${x + 52} 331
                    L ${x + 60} 341
                    L ${x + 75} 341
                    Q ${x + 81} 341 ${x + 82} 347
                    L ${x + 77} 347
                    Q ${x + 76} 345 ${x + 73} 345
                    L ${x + 58} 345
                    L ${x + 51} 336
                    L ${x + 33} 336
                    L ${x + 26} 345
                    L ${x + 11} 345
                    Q ${x + 8} 345 ${x + 7} 347
                    Z
                  `}
                  fill={`url(#${ids.portLip})`}
                  opacity="0.95"
                />

                <line
                  x1={x + 8}
                  y1={398}
                  x2={x + 76}
                  y2={398}
                  stroke="#29456f"
                  strokeWidth="1"
                  opacity="0.35"
                />
              </g>
            ))}

            <line x1="191" y1="318" x2="892" y2="318" stroke="#faf8f3" strokeWidth="1.2" opacity="0.65" />
            <line x1="191" y1="425" x2="892" y2="425" stroke="#888987" strokeWidth="1.1" opacity="0.55" />
          </g>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}


function PCIllustration({ compact = false, typingStep = 0, typingActive = false }: { compact?: boolean; typingStep?: number; typingActive?: boolean }) {
  return (
    <div className={`relative origin-top ${compact ? "scale-[0.8]" : "scale-100"}`}>
      <div className="relative h-[194px] w-[226px]">
        <div className="pointer-events-none absolute left-[27px] top-[170px] h-[18px] w-[172px] rounded-full bg-[#0b1a30]/16 blur-[9px]" />
        <div className="relative h-full w-full" style={{ filter: DEVICE_FLOAT_FILTER_SOFT }}>
          <RetroComputer
            className="h-full w-full"
            screenImageSrc={`${ASSET_BASE}/linkedin-profile.png?v=20260409-1`}
            typingStep={typingStep}
            typingActive={typingActive}
          />
        </div>
      </div>
    </div>
  );
}


function PhoneStatusBar({ className = "", showWifi = false }: { className?: string; showWifi?: boolean }) {
  return (
    <div className={`absolute left-[8px] right-[8px] top-[7px] z-10 flex items-center justify-between text-[5px] font-medium text-white/84 ${className}`}>
      <span>Service</span>
      <div className="flex items-center gap-[3px]">
        {showWifi ? (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true" className="opacity-90">
            <path d="M1.1 4.7C2.1 3.8 3.4 3.8 4.4 4.7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M0.2 3.1C1.8 1.7 3.9 1.7 5.5 3.1" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
            <circle cx="2.8" cy="5" r="0.55" fill="currentColor" />
          </svg>
        ) : null}
        <span className="flex h-[5px] items-end gap-[1px]">
          <span className="w-[1px] rounded-full bg-white/90" style={{ height: "2px" }} />
          <span className="w-[1px] rounded-full bg-white/90" style={{ height: "3px" }} />
          <span className="w-[1px] rounded-full bg-white/90" style={{ height: "4px" }} />
          <span className="w-[1px] rounded-full bg-white/90" style={{ height: "5px" }} />
        </span>
        <span className="relative inline-flex h-[5px] w-[8px] rounded-[2px] border border-white/82">
          <span className="absolute right-[-1.7px] top-[1.2px] h-[2.2px] w-[1px] rounded-full bg-white/82" />
          <span className="absolute left-[0px] top-[-0.08px] h-[4.22px] w-[4.55px] rounded-[1px] bg-white/82" />
        </span>
      </div>
    </div>
  );
}

function SmartphoneIllustration({
  compact = false,
  ringing = false,
  tick = 0,
  noWifi = false,
  currentTime = null,
}: {
  compact?: boolean;
  ringing?: boolean;
  tick?: number;
  noWifi?: boolean;
  currentTime?: number | null;
}) {
  const idleGlow = Math.sin(tick / 6) * 0.5 + 0.5;
  const lockscreenTime = currentTime ? formatPhoneClock(new Date(currentTime)) : "";
  const lockscreenDate = currentTime ? formatPhoneDate(new Date(currentTime)) : "";

  return (
    <motion.div
      className={`relative ${compact ? "scale-[0.8]" : "scale-100"}`}
      animate={ringing ? { x: [0, -3, 3, -3, 3, 0], rotate: [2.3, 0.5, 4.2, 0.5, 4.2, 2.3] } : { x: 0, rotate: 2.3 }}
      transition={ringing ? { duration: 0.44, repeat: Infinity, ease: "linear" } : { duration: 0.24 }}
    >
      <div className="relative h-[194px] w-[226px]">
        <div className="absolute left-1/2 top-0 h-[194px] w-[160px] -translate-x-1/2">
          <div className="pointer-events-none absolute left-[44px] top-[160px] h-[18px] w-[78px] rounded-full bg-[#0b1a30]/16 blur-[10px]" />
          <div className="pointer-events-none absolute left-[38px] top-[12px] z-[11] h-[24px] w-[88px] rotate-[1.7deg] rounded-full bg-white/10 blur-[7px]" />
          <div
            className="absolute left-[39px] top-[10px] z-10 h-[166px] w-[82px] rotate-[1.7deg] rounded-[24px] border border-[#1f3346]/78 bg-[linear-gradient(180deg,#435a70_0%,#1b2d40_34%,#101925_100%)] p-[4px] shadow-[0_0_0_1px_rgba(127,212,241,0.05)]"
            style={{ filter: DEVICE_FLOAT_FILTER_SOFT }}
          >
          <div className="absolute inset-[1px] rounded-[22px] border border-white/10" />
          <div className="absolute inset-[4px] rounded-[19px] border border-[#466078]/60 shadow-[inset_0_0_0_0.6px_rgba(255,255,255,0.03)]" />
          <div className="absolute inset-[5px] rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_22%,rgba(255,255,255,0)_80%,rgba(255,255,255,0.03)_100%)]" />
          <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-white/8 bg-[#0a0f17] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <div className="pointer-events-none absolute left-[-18%] top-[-6%] h-[46%] w-[92%] rotate-[16deg] rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.042)_24%,rgba(255,255,255,0.010)_45%,transparent_72%)] blur-[1.5px]" />
            {ringing ? (
              <>
                <Image src="/portfolio/iphone-call-screen.png" alt="iPhone call screen" fill draggable={false} className="pointer-events-none select-none object-cover object-center" sizes="176px" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(92,97,94,0.095)_0%,rgba(90,95,92,0.045)_11%,rgba(72,77,74,0.014)_20%,transparent_27%,transparent_74%,rgba(42,48,46,0.028)_86%,rgba(41,47,45,0.075)_100%)]" />
                <div className="absolute inset-0 z-[4] shadow-[inset_0_1px_0_rgba(92,97,94,0.42),inset_0_-1px_0_rgba(41,47,45,0.48),inset_1px_0_0_rgba(64,70,67,0.18),inset_-1px_0_0_rgba(57,63,60,0.16)]" />
                <div className="absolute inset-x-0 top-[-1px] z-[5] h-[8px] bg-[linear-gradient(180deg,rgba(92,97,94,0.98)_0%,rgba(91,96,93,0.95)_24%,rgba(90,95,92,0.78)_46%,rgba(89,94,91,0.34)_66%,rgba(88,93,90,0.06)_100%)]" />
                <div className="absolute left-0 top-[-1px] z-[5] h-[13px] w-[40px] bg-[radial-gradient(circle_at_top_left,rgba(94,99,96,0.998)_0%,rgba(92,97,94,0.985)_22%,rgba(91,96,93,0.92)_44%,rgba(90,95,92,0.64)_64%,rgba(89,94,91,0.24)_84%,transparent_100%)] blur-[1.9px]" />
                <div className="absolute right-0 top-[-1px] z-[5] h-[13px] w-[40px] bg-[radial-gradient(circle_at_top_right,rgba(94,99,96,0.998)_0%,rgba(92,97,94,0.985)_22%,rgba(91,96,93,0.92)_44%,rgba(90,95,92,0.64)_64%,rgba(89,94,91,0.24)_84%,transparent_100%)] blur-[1.9px]" />
                <div className="absolute left-[-1px] top-[-1px] z-[6] h-[20px] w-[14px] bg-[linear-gradient(180deg,rgba(93,98,95,0.88)_0%,rgba(92,97,94,0.74)_30%,rgba(90,95,92,0.34)_60%,rgba(89,94,91,0.06)_100%)] blur-[1px]" />
                <div className="absolute right-[-1px] top-[-1px] z-[6] h-[20px] w-[14px] bg-[linear-gradient(180deg,rgba(93,98,95,0.88)_0%,rgba(92,97,94,0.74)_30%,rgba(90,95,92,0.34)_60%,rgba(89,94,91,0.06)_100%)] blur-[1px]" />
                <div className="absolute left-[-3px] top-[-2px] z-[7] h-[17px] w-[34px] bg-[radial-gradient(circle_at_top_left,rgba(94,99,96,0.995)_0%,rgba(92,97,94,0.97)_22%,rgba(91,96,93,0.88)_42%,rgba(90,95,92,0.58)_62%,rgba(89,94,91,0.20)_82%,transparent_100%)] blur-[2.6px]" />
                <div className="absolute right-[-3px] top-[-2px] z-[7] h-[17px] w-[34px] bg-[radial-gradient(circle_at_top_right,rgba(94,99,96,0.995)_0%,rgba(92,97,94,0.97)_22%,rgba(91,96,93,0.88)_42%,rgba(90,95,92,0.58)_62%,rgba(89,94,91,0.20)_82%,transparent_100%)] blur-[2.6px]" />
                <div className="absolute left-[-2px] top-[-1px] z-[7] h-[13px] w-[18px] bg-[linear-gradient(90deg,rgba(93,98,95,0.56)_0%,rgba(92,97,94,0.22)_62%,transparent_100%)] blur-[1.6px]" />
                <div className="absolute right-[-2px] top-[-1px] z-[7] h-[13px] w-[18px] bg-[linear-gradient(270deg,rgba(93,98,95,0.56)_0%,rgba(92,97,94,0.22)_62%,transparent_100%)] blur-[1.6px]" />
                <div className="absolute inset-x-0 top-[-1px] z-[5] h-[2px] bg-[rgba(92,97,94,0.98)]" />
                <PhoneStatusBar showWifi={false} />
                <div className="absolute inset-x-0 bottom-0 z-[5] h-[7px] bg-[linear-gradient(180deg,rgba(43,49,47,0)_0%,rgba(43,49,47,0.72)_34%,rgba(42,48,46,0.95)_68%,rgba(41,47,45,1)_100%)]" />
                <div className="absolute left-0 bottom-0 z-[5] h-[7px] w-[28px] bg-[radial-gradient(circle_at_bottom_left,rgba(41,47,45,0.96)_0%,rgba(41,47,45,0.82)_46%,rgba(41,47,45,0.18)_76%,transparent_100%)]" />
                <div className="absolute right-0 bottom-0 z-[5] h-[7px] w-[28px] bg-[radial-gradient(circle_at_bottom_right,rgba(41,47,45,0.96)_0%,rgba(41,47,45,0.82)_46%,rgba(41,47,45,0.18)_76%,transparent_100%)]" />
                <div className="absolute inset-x-0 bottom-0 z-[5] h-[2px] bg-[rgba(41,47,45,1)]" />
              </>
            ) : null}
            {!ringing && noWifi ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0d12]">
                <div className="flex flex-col items-center gap-2 text-white">
                  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
                    <path d="M3 8 C8 3, 20 3, 25 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 12 C11 8.5, 17 8.5, 21 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                    <path d="M12 16 C13.5 15, 14.5 15, 16 16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    <path d="M5 19 L23 3" stroke="#ff6b6b" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-[9px] font-medium tracking-[0.12em] text-white/88">NO WIFI</span>
                </div>
              </div>
            ) : null}
            {!ringing && !noWifi ? (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#185de0_0%,#2f7bf0_48%,#5da8ff_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_95%,rgba(255,255,255,0.14),transparent_27%),radial-gradient(circle_at_74%_94%,transparent_0%,transparent_44%,rgba(255,255,255,0.12)_44%,rgba(255,255,255,0.12)_52%,transparent_52%),radial-gradient(circle_at_74%_94%,transparent_0%,transparent_58%,rgba(255,255,255,0.10)_58%,rgba(255,255,255,0.10)_66%,transparent_66%),radial-gradient(circle_at_74%_94%,transparent_0%,transparent_72%,rgba(255,255,255,0.08)_72%,rgba(255,255,255,0.08)_82%,transparent_82%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.13)_0%,transparent_18%,transparent_84%,rgba(0,0,0,0.05)_100%)]" />
                <PhoneStatusBar showWifi={false} />
                <div className="absolute inset-x-0 top-[14px] flex flex-col items-center text-white">
                  <div className="mb-[3px] flex items-center justify-center text-white/92">
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
                      <path d="M2.35 4.35V3.1C2.35 1.94 3.05 1 4 1C4.95 1 5.65 1.94 5.65 3.1V4.35" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
                      <rect x="1.35" y="4.35" width="5.3" height="4.2" rx="1.1" stroke="currentColor" strokeWidth="0.9" />
                    </svg>
                  </div>
                  <div className="text-[27px] font-medium tracking-[-0.06em] text-white">{lockscreenTime}</div>
                  <div className="mt-[1px] text-[6px] font-medium tracking-[0.03em] text-white/88">{lockscreenDate}</div>
                </div>
                <div className="absolute inset-x-0 bottom-[11px] flex justify-center">
                  <div className="h-[2.5px] w-[26px] rounded-full bg-white/72" style={{ opacity: 0.5 + idleGlow * 0.35 }} />
                </div>
              </>
            ) : null}
          </div>
        </div>
          <div className="absolute left-[119px] top-[35px] z-0 h-[34px] w-[5px] rotate-[1.7deg] rounded-r-full bg-[linear-gradient(180deg,#728398_0%,#334456_100%)] shadow-[-1px_0_0_rgba(17,27,40,0.22)]" />
          <div className="absolute left-[118px] top-[74px] z-0 h-[15px] w-[5px] rotate-[1.7deg] rounded-r-full bg-[linear-gradient(180deg,#728398_0%,#334456_100%)] shadow-[-1px_0_0_rgba(17,27,40,0.22)]" />
          {ringing && !noWifi ? (
            <>
              <div className="absolute bottom-[9px] right-[44px] h-[25px] w-[25px] rounded-full border border-[#0d96b2]/24" />
              <div className="absolute bottom-[3px] right-[36px] h-[39px] w-[39px] rounded-full border border-[#0d96b2]/18" />
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function LinkedInMonitorView() {
  return (
    <div className="relative h-full w-full bg-white">
      <a
  href="https://www.linkedin.com/in/roope-aaltonen/"
  target="_blank"
  rel="noreferrer"
  className="block h-full w-full overflow-hidden cursor-pointer"
>
  <img
    src="/portfolio/linkedin-profile.png?v=20260409-1"
    alt="LinkedIn profile preview"
    className="block h-full w-full object-cover object-top"
  />
</a>
    </div>
  );
}


function LinkedInPopupScreenshotView() {
  return (
    <div className="h-full w-full bg-white">
      <a
        href="https://www.linkedin.com/in/roope-aaltonen/"
        target="_blank"
        rel="noreferrer"
        className="block h-full w-full overflow-hidden cursor-pointer"
        aria-label="Open Roope Aaltonen LinkedIn profile"
      >
        <img
          src="/portfolio/linkedin-popup.png?v=20260409-6"
          alt="LinkedIn popup screenshot"
          className="block h-full w-full object-cover object-top"
          draggable={false}
        />
      </a>
    </div>
  );
}


function formatClock(value: Date) {
  return value
    .toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    .replace(/:/g, ".");
}

function formatPhoneClock(value: Date) {
  return value
    .toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(/:/g, ".");
}

function formatPhoneDate(value: Date) {
  return value.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
}

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
