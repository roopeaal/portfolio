"use client";

import Image from "next/image";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PacketWindow } from "@/components/packet-window";
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
const PREVIEW_WIDTH = 362;
const PREVIEW_HEIGHT = 266;
const PREVIEW_GAP = 42;
const PREVIEW_MARGIN = 18;

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

type KeyboardKey = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: "enter" | "space";
};

const NODE_META: Record<NodeKey, NodeMeta> = {
  about: { label: "About Me", deviceName: "Wireless Router1", width: 220, height: 204, deviceHeight: 136 },
  projects: { label: "Projects", deviceName: "Switch0", width: 224, height: 194, deviceHeight: 122 },
  home: { label: "LinkedIn", deviceName: "PC1", width: 226, height: 262, deviceHeight: 194, previewWidth: 378 },
  contact: { label: "Contact Me", deviceName: "Smartphone0", width: 156, height: 226, deviceHeight: 168 },
};

const INITIAL_NODE_POSITIONS: Record<NodeKey, NodePosition> = {
  about: { x: 128, y: 120 },
  projects: { x: 930, y: 126 },
  home: { x: 232, y: 442 },
  contact: { x: 958, y: 454 },
};

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
  return {
    minX: -16,
    maxX: VIEWBOX.width - meta.width + 16,
    minY: -10,
    maxY: VIEWBOX.height - meta.height - 12,
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

function randomFromSeed(seed: number) {
  const value = Math.sin(seed * 999.31) * 43758.5453123;
  return value - Math.floor(value);
}

function buildTypingPattern(step: number) {
  const key = Math.floor(randomFromSeed(step * 6.71 + 1.9) * 26);
  return new Set<number>([key]);
}

const SWITCH_PORT_CENTERS = [82, 94, 109, 124, 139, 154] as const;
const SWITCH_LEFT_CABLE_PORT_INDEX = 0;
const SWITCH_RIGHT_CABLE_PORT_INDEX = 4;
const SWITCH_STUB_Y = 90;

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
  const [nodePositions, setNodePositions] = useState<Record<NodeKey, NodePosition>>(INITIAL_NODE_POSITIONS);
  const [draggingNode, setDraggingNode] = useState<NodeKey | null>(null);
  const [detachedOrigin, setDetachedOrigin] = useState<{ x: number; y: number } | null>(null);
  const [repairLooseEnd, setRepairLooseEnd] = useState<{ x: number; y: number } | null>(null);
  const [routerPowerOn, setRouterPowerOn] = useState(true);
  const [routerSignalLevel, setRouterSignalLevel] = useState<0 | 1 | 2>(2);
  const [routerWifiReady, setRouterWifiReady] = useState(true);
  const [aboutSection, setAboutSection] = useState<"profile" | "direction" | "studies" | "reliability">("profile");
  const [contactSection, setContactSection] = useState<"channels" | "roles" | "cv" | "status">("channels");

  const sceneRef = useRef<HTMLDivElement | null>(null);
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
        [state.node]: { x: nextX, y: nextY },
      };
    };

    const finishPointer = (event: PointerEvent) => {
      const state = dragRef.current;
      if (!state || event.pointerId !== state.pointerId) return;

      const dragged = state.dragStarted;
      const node = state.node;
      dragRef.current = null;
      setDraggingNode(null);

      if (!dragged) {
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

  return (
    <>
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

        <div className="absolute inset-x-0 bottom-[54px] top-[58px] px-2 pb-2 pt-2 sm:px-3 md:px-5">
          <div className="relative h-full w-full">
            <div className="relative h-full w-full">
              <div ref={sceneRef} className="relative h-full w-full overflow-hidden">
                <motion.svg
                  viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
                  className="pointer-events-none absolute inset-0 h-full w-full"
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
                  {topLineStatus !== "none" ? (
                    <TrafficPulse
                      from={aboutAttach}
                      to={projectsAttach}
                      tick={motionTick}
                      duration={54}
                      delay={0}
                      color={topLineStatus === "green" ? "#ebfbff" : "#ffbb4b"}
                    />
                  ) : null}
                </motion.svg>

                <NodeButton
                  node="about"
                  position={nodePositions.about}
                  active={active === "about"}
                  opacity={nodeStyle.about}
                  delay={0.06}
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
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
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
                        className="pointer-events-none absolute z-[80]"
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

      <PacketWindow
        open={openWindow === "home"}
        onClose={closeWindowState}
        type="home"
        title="LinkedIn · PC1"
        browserUrl="https://www.linkedin.com/in/roope-aaltonen/"
        browserLink="https://www.linkedin.com/in/roope-aaltonen/"
      >
        <HomePanelContent />
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
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border border-[#8394ab] bg-[rgba(255,255,255,0.04)] text-[15px] text-white/64 transition hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="Reset timer"
        >
          ↺
        </button>
        <button
          type="button"
          onClick={onForward}
          className="inline-flex h-[30px] items-center justify-center rounded-[4px] border border-[#8394ab] bg-[rgba(255,255,255,0.04)] px-2 text-[12px] text-white/64 transition hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="Add 30 seconds"
        >
          +30s
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
  dragging: boolean;
  onHover: () => void;
  onLeave: () => void;
  onPointerDown: (node: NodeKey, event: ReactPointerEvent<HTMLButtonElement>) => void;
  label: string;
  deviceName: string;
  children: ReactNode;
}) {
  const meta = NODE_META[node];

  return (
    <div
      className="absolute overflow-visible"
      style={{
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
        style={{ touchAction: "none", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
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
          {children}
        </motion.div>

        <div
          className="mt-[8px] flex flex-col items-center justify-center text-center leading-tight"
          style={{ transform: NODE_META[node].labelOffsetX ? `translateX(${NODE_META[node].labelOffsetX}px)` : undefined }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#7f8b9d]">{deviceName}</p>
          <p className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-[#050505]">{label}</p>
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
            <HomePanelContent />
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
  return (
    <div
      className="pointer-events-none absolute z-[24]"
      style={{
        left: `${((bottom.x - 6) / VIEWBOX.width) * 100}%`,
        top: `${(((bottom.y - 14) / VIEWBOX.height)) * 100}%`,
      }}
      aria-hidden="true"
    >
      <span className="absolute left-0 top-0">
        <EthernetHeadGraphic />
      </span>
    </div>
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

  const midX = (from.x + to.x) / 2;
  const lift = 84 + Math.abs(to.x - from.x) * 0.04;
  const midY = Math.min(from.y, to.y) - lift;
  const dashOffset = -((tick * 6) % 240);
  const outerPath = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  const innerPath = `M ${from.x + 8} ${from.y - 10} Q ${midX + 18} ${midY - 16} ${to.x - 10} ${to.y - 6}`;

  return (
    <>
      <path
        d={outerPath}
        fill="none"
        stroke="#8fe5ff"
        strokeWidth={3.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="26 220"
        strokeDashoffset={dashOffset}
        opacity={0.82}
      />
      <path
        d={innerPath}
        fill="none"
        stroke="#d7f8ff"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="18 210"
        strokeDashoffset={dashOffset - 92}
        opacity={0.68}
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
  const wifiSearchFrame = Math.floor((tick % 18) / 6);
  const showWifiPulse = glitchActive || networkMode !== "stable";

  return (
    <motion.div
      className={`relative ${compact ? "scale-[0.72]" : "scale-100"}`}
      animate={glitchActive ? { rotate: [0, -0.6, 0.8, 0], y: [0, 0.4, -0.4, 0] } : { rotate: 0, y: 0 }}
      transition={glitchActive ? { duration: 0.9, repeat: 2, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <div className="relative h-[140px] w-[200px]">
        <div className="absolute left-[34px] top-[112px] h-[18px] w-[132px] rounded-full bg-[#0d6d8a]/16 blur-[11px]" />
        <div className="absolute left-[50px] top-[8px] h-[56px] w-[6px] rounded-full border border-[#a8dce7]/55 bg-[linear-gradient(180deg,#f6fcff_0%,#d9eff5_24%,#8bd2e0_70%,#3ba6bc_100%)]" />
        <div className="absolute right-[50px] top-[8px] h-[56px] w-[6px] rounded-full border border-[#a8dce7]/55 bg-[linear-gradient(180deg,#f6fcff_0%,#d9eff5_24%,#8bd2e0_70%,#3ba6bc_100%)]" />

        <div className="absolute left-[17px] top-[44px] h-[60px] w-[166px] rounded-[28px] border border-[#7fc2d6] bg-[linear-gradient(180deg,#f7fdff_0%,#dff1f6_18%,#78cadb_54%,#1690aa_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-10px_14px_rgba(5,55,69,0.18),0_14px_24px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-[27px] top-[51px] h-[44px] w-[146px] rounded-[22px] bg-[linear-gradient(90deg,#0e9db8_0%,#dff6fa_16%,#fcfeff_40%,#c2ebf3_68%,#1398b3_100%)] opacity-95" />
        <div className="absolute left-[32px] top-[58px] h-[30px] w-[22px] rounded-full bg-white/26 blur-[1px]" />
        <div className="absolute left-[66px] top-[58px] h-[7px] w-[44px] rounded-full bg-white/28" />
        <div className="absolute left-[62px] top-[82px] h-[2px] w-[76px] rounded-full bg-[#69bfd4]/42" />
        <div className="absolute left-[27px] top-[93px] h-[7px] w-[146px] rounded-full bg-[linear-gradient(180deg,rgba(8,71,87,0.14)_0%,rgba(255,255,255,0.02)_100%)]" />

        <div className="absolute left-[31px] top-[84px] flex items-center gap-[8px] opacity-95">
          <span className="relative inline-flex h-[22px] w-[22px] items-center justify-center">
            <span className={`absolute inset-0 rounded-full border-[2.4px] ${powerOn ? "border-[#53d76a]" : "border-[#e55b5b]"}`} />
            <span className={`absolute left-1/2 top-[-1px] h-[8px] w-[2.4px] -translate-x-1/2 rounded-full ${powerOn ? "bg-[#53d76a]" : "bg-[#e55b5b]"}`} />
          </span>
          {[0, 1, 2].map((index) => (
            <span key={index} className={`relative h-[5px] w-[18px] rounded-full border border-white/16 ${signalLevel > index ? "bg-[#dcfcff] shadow-[0_0_8px_rgba(213,248,255,0.5)]" : "bg-white/14"}`}>
              <span className="absolute inset-x-[2px] top-0 h-[1px] rounded-full bg-white/42" />
            </span>
          ))}
        </div>

        <div className="absolute left-[52px] top-[98px] flex gap-[5px] opacity-55">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="h-[2px] w-[9px] rounded-full bg-[#56bdd2]" />
          ))}
        </div>

        <div className="absolute left-1/2 top-[-36px] flex h-[66px] w-[110px] -translate-x-1/2 items-end justify-center">
          {showWifiPulse ? (
            <svg width="110" height="66" viewBox="0 0 110 66" fill="none" aria-hidden="true">
              <circle cx="55" cy="53" r="4.2" fill="#18c9ff" opacity={wifiSearchFrame === 0 ? 1 : 0.18} />
              <path d="M47.5 45.2C51.5 41.1 58.5 41.1 62.5 45.2" stroke="#17c9ff" strokeWidth="4" strokeLinecap="round" opacity={wifiSearchFrame >= 0 ? (wifiSearchFrame === 0 ? 1 : 0.18) : 0.12} />
              <path d="M37 34.2C46 26.7 64 26.7 73 34.2" stroke="#6de8ff" strokeWidth="4.4" strokeLinecap="round" opacity={wifiSearchFrame >= 1 ? (wifiSearchFrame === 1 ? 1 : 0.2) : 0.12} />
              <path d="M25 21.8C37.4 11.6 72.6 11.6 85 21.8" stroke="#8eff89" strokeWidth="4.8" strokeLinecap="round" opacity={wifiSearchFrame === 2 ? 1 : 0.18} />
            </svg>
          ) : null}
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
  const ledIndex = Math.floor(tick / 3) % SWITCH_PORT_CENTERS.length;
  const isAlert = networkMode !== "stable";
  const portCenters = SWITCH_PORT_CENTERS;

  return (
    <motion.div
      className={`${compact ? "scale-[0.78]" : "scale-100"}`}
      animate={active ? { y: [0, -1, 0] } : { y: 0 }}
      transition={active ? { duration: 0.55, repeat: 1, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <div className="relative h-[124px] w-[222px]">
        <div className="absolute left-[45px] top-[98px] h-[13px] w-[132px] rounded-full bg-[#10233a]/12 blur-[9px]" />

        <svg viewBox="0 0 222 124" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="switchTopMainV23" x1="0.04" y1="0" x2="0.96" y2="1">
              <stop offset="0%" stopColor="#6e93c8" />
              <stop offset="54%" stopColor="#35527d" />
              <stop offset="100%" stopColor="#243c63" />
            </linearGradient>
            <linearGradient id="switchFrontMainV23" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4d71a3" />
              <stop offset="100%" stopColor="#2b466c" />
            </linearGradient>
            <linearGradient id="switchBottomLipV23" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#284668" />
              <stop offset="100%" stopColor="#1c3455" />
            </linearGradient>
            <linearGradient id="switchFacetV23" x1="0" y1="0" x2="0.12" y2="1">
              <stop offset="0%" stopColor="#c0e0ef" />
              <stop offset="100%" stopColor="#9ac4dc" />
            </linearGradient>
            <linearGradient id="switchPlateV23" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdfdff" />
              <stop offset="100%" stopColor="#e8edf5" />
            </linearGradient>
          </defs>

          <path d="M 52 22.5 H 166.2 L 182.4 52 H 36.2 Z" fill="url(#switchTopMainV23)" stroke="#38557d" strokeWidth="1.32" strokeLinejoin="round" />
          <path d="M 36.2 52 H 182.4 V 84.8 C 182.4 91 177.5 96 171.2 96 H 47.2 C 41 96 36.2 91 36.2 84.8 Z" fill="url(#switchFrontMainV23)" stroke="#29456a" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M 36.2 84 H 182.4 V 84.8 C 182.4 91 177.5 96 171.2 96 H 47.2 C 41 96 36.2 91 36.2 84.8 Z" fill="url(#switchBottomLipV23)" opacity="0.95" />

          <path d="M 58.5 24.4 L 89.8 52" stroke="#f2f7fb" strokeWidth="4.2" strokeLinecap="round" opacity="0.98" />
          <path d="M 137.8 22.5 H 166.2 L 174.8 34.1 H 146 Z" fill="url(#switchFacetV23)" opacity="0.99" />

          <path d="M 82.6 29.8 C 96 25.6, 113 24.8, 131.2 27 C 145 28.8, 157 32.8, 166.4 38.5 C 154.8 37.9, 140.6 37.1, 125.4 36 C 107.8 34.9, 93.8 32.9, 82.6 29.8 Z" fill="rgba(122,151,205,0.23)" />
          <path d="M 87.8 32.2 C 101.5 28.6, 122.4 28.5, 143.8 32 C 154 33.7, 162.9 36.8, 169.8 40.7 C 159.4 39.9, 146.1 39, 132.2 38 C 114.5 36.8, 98.3 35.8, 87.8 32.2 Z" fill="rgba(29,45,78,0.3)" />
          <path d="M 109.8 46.8 C 122.1 43.3, 137.7 43.2, 152.5 46.5 C 159.2 48, 165.8 50.2, 170.8 53 C 159.2 53, 145.8 52.3, 132.8 51.5 C 122.7 50.9, 114.3 49.2, 109.8 46.8 Z" fill="rgba(27,41,71,0.22)" />
          <path d="M 89.6 37.8 C 99.1 34.9, 111 34.8, 121.2 37.3 C 114.8 38.1, 105.9 38.4, 97.8 38.4 C 94.7 38.4, 92.1 38.2, 89.6 37.8 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M 120.2 52.8 C 124.9 51, 131.2 51, 138 52.8 C 133.5 53.4, 127.7 53.6, 122 53.6 C 121.1 53.6, 120.5 53.3, 120.2 52.8 Z" fill="rgba(255,255,255,0.07)" />

          <path d="M 52 22.5 H 166.2" stroke="rgba(255,255,255,0.12)" strokeWidth="0.92" />
          <path d="M 36.2 52 H 182.4" stroke="rgba(255,255,255,0.14)" strokeWidth="0.9" />
          <path d="M 36.2 52.8 H 182.4" stroke="rgba(12,20,36,0.2)" strokeWidth="0.9" />

          <rect x="42.8" y="71.4" width="8" height="8" rx="1.05" fill={isAlert ? "#ede0c2" : "#f0f1f2"} stroke="#cfd5de" strokeWidth="0.88" />
          <rect x="44.1" y="72.7" width="5.4" height="1.18" rx="0.5" fill="rgba(255,255,255,0.82)" />

          <rect x="61" y="65.9" width="111" height="14.5" rx="1.7" fill="url(#switchPlateV23)" stroke="#d8dde6" strokeWidth="0.9" />
          <path d="M 61 65.9 H 172" stroke="rgba(255,255,255,0.36)" strokeWidth="0.7" />
          {portCenters.map((centerX, index) => (
            <g key={centerX} opacity={index === ledIndex ? 0.96 : 1}>
              <path
                d={`M ${centerX - 7.3} 70.7 V 75.2 L ${centerX - 4.8} 78.8 H ${centerX + 4.8} L ${centerX + 7.3} 75.2 V 70.7 L ${centerX + 5.2} 69 H ${centerX + 1.9} L ${centerX} 70.4 L ${centerX - 1.9} 69 H ${centerX - 5.2} Z`}
                fill="#31394a"
                stroke="#151d2b"
                strokeWidth="0.88"
                strokeLinejoin="round"
              />
              <path
                d={`M ${centerX - 5.25} 72.1 V 74.6 L ${centerX - 3.5} 76.8 H ${centerX + 3.5} L ${centerX + 5.25} 74.6 V 72.1 L ${centerX + 3.9} 70.95 H ${centerX + 1.35} L ${centerX} 72.1 L ${centerX - 1.35} 70.95 H ${centerX - 3.9} Z`}
                fill="#1b2230"
                opacity="0.98"
              />
              <path d={`M ${centerX - 5.1} 71.5 H ${centerX + 5.1}`} stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" strokeLinecap="round" />
              <path d={`M ${centerX - 3.9} 78 H ${centerX + 3.9}`} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" strokeLinecap="round" />
            </g>
          ))}

          <path d="M 61 80.4 H 172" stroke="rgba(0,0,0,0.07)" strokeWidth="0.76" />
          <path d="M 36.2 88.1 H 182.4" stroke="rgba(0,0,0,0.13)" strokeWidth="0.96" />
        </svg>
      </div>
    </motion.div>
  );
}

function PCIllustration({ compact = false, typingStep = 0, typingActive = false }: { compact?: boolean; typingStep?: number; typingActive?: boolean }) {
  const activeKeys = typingActive ? buildTypingPattern(typingStep) : new Set<number>();
  const mouseDrift = Math.sin(typingStep / 2.6) * 2.2;
  const keyboardKeys: KeyboardKey[] = [
    { id: 0, x: 0, y: 0, w: 11, h: 5 },
    { id: 1, x: 14, y: 0, w: 11, h: 5 },
    { id: 2, x: 28, y: 0, w: 11, h: 5 },
    { id: 3, x: 42, y: 0, w: 11, h: 5 },
    { id: 4, x: 56, y: 0, w: 11, h: 5 },
    { id: 5, x: 70, y: 0, w: 11, h: 5 },
    { id: 6, x: 84, y: 0, w: 11, h: 5 },
    { id: 7, x: 0, y: 7, w: 11, h: 5 },
    { id: 8, x: 14, y: 7, w: 11, h: 5 },
    { id: 9, x: 28, y: 7, w: 11, h: 5 },
    { id: 10, x: 42, y: 7, w: 11, h: 5 },
    { id: 11, x: 56, y: 7, w: 11, h: 5 },
    { id: 12, x: 70, y: 7, w: 11, h: 5 },
    { id: 13, x: 84, y: 7, w: 11, h: 12, kind: "enter" },
    { id: 14, x: 0, y: 14, w: 11, h: 5 },
    { id: 15, x: 14, y: 14, w: 11, h: 5 },
    { id: 16, x: 28, y: 14, w: 11, h: 5 },
    { id: 17, x: 42, y: 14, w: 11, h: 5 },
    { id: 18, x: 56, y: 14, w: 11, h: 5 },
    { id: 19, x: 70, y: 14, w: 11, h: 5 },
    { id: 20, x: 0, y: 21, w: 11, h: 5 },
    { id: 21, x: 14, y: 21, w: 11, h: 5 },
    { id: 22, x: 28, y: 21, w: 39, h: 5, kind: "space" },
    { id: 23, x: 70, y: 21, w: 11, h: 5 },
    { id: 24, x: 84, y: 21, w: 11, h: 5 },
  ];

  return (
    <div className={`relative ${compact ? "scale-[0.8]" : "scale-100"}`}>
      <div className="relative h-[198px] w-[218px]">
        <div className="absolute left-[26px] top-[176px] h-[15px] w-[132px] rounded-full bg-[#0b7894]/13 blur-[10px]" />
        <div className="absolute left-[16px] top-[6px] h-[120px] w-[146px] rounded-[20px] border border-[#89bfd0]/75 bg-[linear-gradient(180deg,#f7fdff_0%,#dff1f6_34%,#8ccddd_100%)] shadow-[inset_0_12px_16px_rgba(255,255,255,0.56),0_12px_18px_rgba(15,23,42,0.06)]" />
        <div className="absolute left-[10px] top-[18px] h-[106px] w-[142px] rounded-[16px] border border-[#188eaa]/80 bg-[linear-gradient(180deg,#65c1d7_0%,#2f9fb9_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.24)]" />
        <div className="absolute left-[16px] top-[24px] h-[94px] w-[130px] rounded-[11px] border border-[#93aeb8] bg-[#edf4f6] p-[4px] shadow-[inset_0_1px_4px_rgba(255,255,255,0.72)]">
          <div className="relative h-full w-full overflow-hidden rounded-[8px] border border-[#93acb6] bg-[#eef3f6]">
            <LinkedInMonitorView />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_18%,transparent_80%,rgba(0,0,0,0.04)_100%)]" />
          </div>
        </div>
        <div className="absolute left-[66px] top-[125px] h-[22px] w-[46px] rounded-b-[8px] bg-[linear-gradient(180deg,#4eb6cf_0%,#128ca5_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" />
        <div className="absolute left-[40px] top-[144px] h-[11px] w-[98px] rounded-[999px] border border-white/22 bg-[linear-gradient(180deg,#e2f4f8_0%,#86cad9_100%)] shadow-[0_4px_8px_rgba(15,23,42,0.04)]" />
        <div className="absolute left-[10px] top-[152px] h-[35px] w-[130px] skew-x-[-16deg] rounded-[10px] border border-[#7eb9ca] bg-[linear-gradient(180deg,#f7fdff_0%,#d3eaf1_36%,#97d0de_100%)] px-[7px] py-[5px] shadow-[0_4px_10px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.76)]">
          <div className="relative h-full w-full">
            {keyboardKeys.map((key) => {
              const active = activeKeys.has(key.id);
              const isEnterKey = key.kind === "enter";
              const isSpaceKey = key.kind === "space";
              return (
                <span
                  key={key.id}
                  className={`absolute border border-[#8ea7b1] transition-transform duration-75 ${active ? "translate-y-[1px] bg-[#7c939c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" : "bg-[#e7f0f3] shadow-[0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.06)]"} ${isEnterKey ? "rounded-[3px]" : "rounded-[2px]"}`}
                  style={isEnterKey
                    ? {
                        left: key.x,
                        top: key.y,
                        width: key.w + 4,
                        height: key.h,
                        clipPath: "polygon(0 0, 78% 0, 100% 20%, 100% 100%, 0 100%, 0 68%, 8% 68%, 8% 31%, 0 31%)",
                      }
                    : isSpaceKey
                      ? {
                          left: key.x,
                          top: key.y,
                          width: key.w,
                          height: key.h,
                          borderRadius: 5,
                        }
                      : { left: key.x, top: key.y, width: key.w, height: key.h }}
                />
              );
            })}
          </div>
        </div>
        <motion.div
          className="absolute left-[148px] top-[155px] h-[24px] w-[14px] rounded-[9px] border border-[#8bc0d1] bg-[linear-gradient(180deg,#f8feff_0%,#dceff4_100%)] shadow-[0_4px_8px_rgba(15,23,42,0.05)]"
          animate={{ x: mouseDrift, y: Math.abs(mouseDrift) * 0.14, rotate: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <div className="absolute inset-x-[3px] top-[2px] h-[7px] rounded-full bg-[#d5edf4]" />
        </motion.div>
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
      <div className="relative h-[194px] w-[160px]">
        <div className="absolute left-[46px] top-[160px] h-[18px] w-[74px] rounded-full bg-[#0d6f8f]/12 blur-[10px]" />
        <div className="absolute left-[39px] top-[10px] z-10 h-[166px] w-[82px] rotate-[1.7deg] rounded-[24px] border border-[#1f3346]/78 bg-[linear-gradient(180deg,#435a70_0%,#1b2d40_34%,#101925_100%)] p-[4px] shadow-[0_15px_28px_rgba(0,0,0,0.20),0_0_0_1px_rgba(127,212,241,0.05)]">
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
                  <div className="text-[27px] font-medium tracking-[-0.06em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.24)]">{lockscreenTime}</div>
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
    </motion.div>
  );
}

function LinkedInMonitorView() {
  return (
    <div className="relative h-full w-full bg-white">
      <Image src="/portfolio/linkedin-profile.png" alt="LinkedIn profile preview" fill draggable={false} className="pointer-events-none select-none object-cover object-top-left" sizes="120px" loading="eager" />
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
