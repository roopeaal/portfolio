"use client";

import { Decal } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  siAndroid,
  siDocker,
  siGit,
  siMqtt,
  siPython,
  siRaspberrypi,
  siReact,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { CanvasTexture, SRGBColorSpace, Vector3 } from "three";

type Skill = {
  name: string;
  mark: string;
  accent: string;
  icon?: SimpleIcon;
  symbol?: "azure" | "network" | "security" | "testing" | "iot" | "api";
};

const SKILLS: Skill[] = [
  { name: "TypeScript", mark: "TS", accent: `#${siTypescript.hex}`, icon: siTypescript },
  { name: "React", mark: "RE", accent: `#${siReact.hex}`, icon: siReact },
  { name: "Python", mark: "PY", accent: `#${siPython.hex}`, icon: siPython },
  { name: "Git", mark: "GIT", accent: `#${siGit.hex}`, icon: siGit },
  { name: "Docker", mark: "DK", accent: `#${siDocker.hex}`, icon: siDocker },
  { name: "Azure", mark: "AZ", accent: "#1689d4", symbol: "azure" },
  { name: "Android", mark: "AN", accent: `#${siAndroid.hex}`, icon: siAndroid },
  { name: "MQTT", mark: "MQ", accent: `#${siMqtt.hex}`, icon: siMqtt },
  { name: "Raspberry Pi", mark: "RPI", accent: `#${siRaspberrypi.hex}`, icon: siRaspberrypi },
  { name: "Networking", mark: "NET", accent: "#4fb6ae", symbol: "network" },
  { name: "Cybersecurity", mark: "SEC", accent: "#df725f", symbol: "security" },
  { name: "Testing", mark: "QA", accent: "#d1aa55", symbol: "testing" },
  { name: "IoT", mark: "IOT", accent: "#56b987", symbol: "iot" },
  { name: "REST APIs", mark: "API", accent: "#8ba4b1", symbol: "api" },
];

export function MyTechstack() {
  const prefersReducedMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative h-full min-h-[520px] overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_56%,rgba(60,104,105,0.22),transparent_37%),radial-gradient(circle_at_16%_18%,rgba(96,173,167,0.07),transparent_24%),linear-gradient(180deg,#080a0b,#020303)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none absolute inset-x-5 top-[8%] z-[1] text-center sm:inset-x-10">
        <h2 className="whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] font-light leading-none tracking-[-0.065em] text-white/92">
          My Techstack
        </h2>
        <p className="mx-auto mt-4 max-w-[680px] text-[clamp(0.72rem,1.5vw,0.95rem)] leading-6 text-white/48">
          Tools and technologies I use when building, testing, and understanding real systems.
        </p>
      </div>

      <div className="absolute inset-0 z-[2]">
        {prefersReducedMotion ? <StaticSkillCloud compact={compact} /> : <TechStack3D compact={compact} />}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[3] text-center">
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/38">
          {compact ? "Touch and drag through the stack" : "Move the pointer through the stack"}
        </p>
      </div>
    </section>
  );
}

function TechStack3D({ compact }: { compact: boolean }) {
  const [pointerActive, setPointerActive] = useState(false);
  const balls = useMemo(
    () =>
      SKILLS.map((skill, index) => ({
        skill,
        index,
        scale: (compact ? 0.62 : 0.82) + ((index * 17) % 4) * (compact ? 0.035 : 0.055),
      })),
    [compact],
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: compact ? 43 : 35, near: 1, far: 50 }}
      dpr={[1, 1.45]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      onPointerEnter={() => setPointerActive(true)}
      onPointerLeave={() => setPointerActive(false)}
      onPointerDown={() => setPointerActive(true)}
      onPointerUp={() => setPointerActive(false)}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[7, 9, 12]} intensity={3.4} color="#ffffff" />
      <pointLight position={[-7, -2, 8]} intensity={34} distance={24} color="#79c7c1" />
      <Physics gravity={[0, 0, 0]} timeStep="vary" interpolate>
        <PointerCollider compact={compact} active={pointerActive} />
        <StageBounds compact={compact} />
        {balls.map((ball) => (
          <TechBall key={ball.skill.name} {...ball} compact={compact} />
        ))}
      </Physics>
    </Canvas>
  );
}

function TechBall({
  skill,
  index,
  scale,
  compact,
}: {
  skill: Skill;
  index: number;
  scale: number;
  compact: boolean;
}) {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const centreVector = useMemo(() => new Vector3(), []);
  const labelTexture = useSkillLabelTexture(skill);
  const angle = index * 2.399;
  const startRadiusX = compact ? 1.95 + (index % 3) * 0.14 : 3.25 + (index % 4) * 0.16;
  const startRadiusY = compact ? 3.05 + (index % 2) * 0.16 : 2.3 + (index % 3) * 0.14;
  const position: [number, number, number] = [
    Math.cos(angle) * startRadiusX,
    Math.sin(angle) * startRadiusY,
    ((index % 5) - 2) * 0.24,
  ];

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.setLinvel(
      {
        x: Math.cos(angle + 0.7) * 0.62,
        y: Math.sin(angle + 0.7) * 0.62,
        z: 0,
      },
      true,
    );
    body.setAngvel({ x: 0.1, y: index % 2 === 0 ? 0.18 : -0.18, z: 0.1 }, true);
  }, [angle, index]);

  useFrame((_state, delta) => {
    const body = bodyRef.current;
    if (!body) return;
    const translation = body.translation();
    const impulse = centreVector
      .set(translation.x, translation.y, translation.z)
      .multiplyScalar(-Math.min(delta, 0.05) * scale * (compact ? 0.18 : 0.22));
    body.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      linearDamping={1.05}
      angularDamping={0.62}
      friction={0.08}
      restitution={0.72}
      canSleep={false}
    >
      <BallCollider args={[scale]} mass={scale * 1.6} />
      <mesh castShadow receiveShadow scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#cdd4d3"
          roughness={0.28}
          metalness={0.24}
          clearcoat={0.82}
          clearcoatRoughness={0.2}
        />
        <Decal position={[0, 0, 0.985]} rotation={[0, 0, 0]} scale={1.52} map={labelTexture} />
        <Decal position={[0, 0, -0.985]} rotation={[0, Math.PI, 0]} scale={1.52} map={labelTexture} />
      </mesh>
    </RigidBody>
  );
}

function useSkillLabelTexture(skill: Skill) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return new CanvasTexture(canvas);

    context.clearRect(0, 0, 512, 512);
    context.beginPath();
    context.arc(256, 256, 228, 0, Math.PI * 2);
    context.fillStyle = "rgba(244,247,245,0.96)";
    context.fill();
    context.lineWidth = 18;
    context.strokeStyle = skill.accent;
    context.stroke();

    drawSkillLogo(context, skill);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#11181a";
    context.font = `700 ${skill.name.length > 12 ? 28 : 34}px Arial`;
    context.letterSpacing = "0.6px";
    context.fillText(skill.name.toUpperCase(), 256, 376);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
  }, [skill]);
}

function drawSkillLogo(context: CanvasRenderingContext2D, skill: Skill) {
  context.save();
  context.fillStyle = skill.accent;
  context.strokeStyle = skill.accent;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (skill.icon) {
    const path = new Path2D(skill.icon.path);
    context.translate(136, 74);
    context.scale(10, 10);
    context.fill(path);
    context.restore();
    return;
  }

  switch (skill.symbol) {
    case "azure":
      context.beginPath();
      context.moveTo(150, 324);
      context.lineTo(228, 116);
      context.lineTo(284, 116);
      context.lineTo(230, 270);
      context.lineTo(350, 270);
      context.lineTo(382, 324);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(268, 214);
      context.lineTo(315, 114);
      context.lineTo(374, 324);
      context.lineTo(324, 324);
      context.closePath();
      context.fill();
      break;
    case "network":
      drawNetworkLogo(context);
      break;
    case "security":
      drawSecurityLogo(context);
      break;
    case "testing":
      drawTestingLogo(context);
      break;
    case "iot":
      drawIotLogo(context);
      break;
    case "api":
      drawApiLogo(context);
      break;
    default:
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "900 128px Arial";
      context.fillText(skill.mark, 256, 235);
  }
  context.restore();
}

function drawNetworkLogo(context: CanvasRenderingContext2D) {
  const nodes = [[256, 126], [150, 236], [362, 236], [256, 316]] as const;
  context.lineWidth = 18;
  context.beginPath();
  context.moveTo(...nodes[0]);
  context.lineTo(...nodes[1]);
  context.lineTo(...nodes[3]);
  context.lineTo(...nodes[2]);
  context.closePath();
  context.moveTo(...nodes[1]);
  context.lineTo(...nodes[2]);
  context.stroke();
  nodes.forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 28, 0, Math.PI * 2);
    context.fill();
  });
}

function drawSecurityLogo(context: CanvasRenderingContext2D) {
  context.beginPath();
  context.moveTo(256, 104);
  context.lineTo(370, 150);
  context.lineTo(354, 268);
  context.quadraticCurveTo(338, 326, 256, 354);
  context.quadraticCurveTo(174, 326, 158, 268);
  context.lineTo(142, 150);
  context.closePath();
  context.fill();
  context.strokeStyle = "#f4f7f5";
  context.lineWidth = 20;
  context.beginPath();
  context.moveTo(203, 230);
  context.lineTo(239, 267);
  context.lineTo(315, 186);
  context.stroke();
}

function drawTestingLogo(context: CanvasRenderingContext2D) {
  context.lineWidth = 22;
  context.strokeRect(148, 120, 216, 216);
  context.beginPath();
  context.moveTo(190, 228);
  context.lineTo(232, 270);
  context.lineTo(322, 176);
  context.stroke();
  context.beginPath();
  context.moveTo(194, 120);
  context.lineTo(194, 92);
  context.moveTo(318, 120);
  context.lineTo(318, 92);
  context.stroke();
}

function drawIotLogo(context: CanvasRenderingContext2D) {
  context.lineWidth = 18;
  context.beginPath();
  context.arc(256, 252, 29, 0, Math.PI * 2);
  context.fill();
  [58, 102, 148].forEach((radius) => {
    context.beginPath();
    context.arc(256, 252, radius, Math.PI * 1.18, Math.PI * 1.82);
    context.stroke();
  });
  context.beginPath();
  context.moveTo(256, 280);
  context.lineTo(256, 334);
  context.stroke();
}

function drawApiLogo(context: CanvasRenderingContext2D) {
  context.lineWidth = 24;
  context.beginPath();
  context.moveTo(214, 126);
  context.lineTo(164, 126);
  context.lineTo(164, 206);
  context.lineTo(126, 246);
  context.lineTo(164, 286);
  context.lineTo(164, 346);
  context.lineTo(214, 346);
  context.moveTo(298, 126);
  context.lineTo(348, 126);
  context.lineTo(348, 206);
  context.lineTo(386, 246);
  context.lineTo(348, 286);
  context.lineTo(348, 346);
  context.lineTo(298, 346);
  context.stroke();
  context.beginPath();
  context.arc(256, 236, 34, 0, Math.PI * 2);
  context.fill();
}

function PointerCollider({ compact, active }: { compact: boolean; active: boolean }) {
  const ref = useRef<RapierRigidBody | null>(null);
  const viewport = useThree((state) => state.viewport);
  const smoothed = useMemo(() => new Vector3(100, 100, 0), []);

  useFrame(({ pointer }) => {
    const body = ref.current;
    if (!body) return;
    if (!active) {
      body.setNextKinematicTranslation({ x: 100, y: 100, z: 100 });
      return;
    }
    const target = new Vector3(
      pointer.x * viewport.width * 0.5,
      pointer.y * viewport.height * 0.5,
      0.5,
    );
    smoothed.lerp(target, compact ? 0.12 : 0.2);
    body.setNextKinematicTranslation(smoothed);
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[100, 100, 0]}>
      <BallCollider args={[compact ? 0.78 : 1.15]} />
    </RigidBody>
  );
}

function StageBounds({ compact }: { compact: boolean }) {
  const width = compact ? 3.25 : 6.9;
  const height = compact ? 4.7 : 3.75;

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[width, 0.2, 2]} position={[0, height, 0]} />
      <CuboidCollider args={[width, 0.2, 2]} position={[0, -height, 0]} />
      <CuboidCollider args={[0.2, height, 2]} position={[width, 0, 0]} />
      <CuboidCollider args={[0.2, height, 2]} position={[-width, 0, 0]} />
      <CuboidCollider args={[width, height, 0.2]} position={[0, 0, -1.7]} />
      <CuboidCollider args={[width, height, 0.2]} position={[0, 0, 1.7]} />
    </RigidBody>
  );
}

function StaticSkillCloud({ compact }: { compact: boolean }) {
  const visibleSkills = compact ? SKILLS.slice(0, 10) : SKILLS;

  return (
    <div className="flex h-full flex-wrap content-center justify-center gap-3 px-5 pb-12 pt-28 sm:gap-5 sm:px-12 sm:pt-36">
      {visibleSkills.map((skill, index) => (
        <div
          key={skill.name}
          className="grid aspect-square w-[clamp(72px,10vw,128px)] place-items-center rounded-full border border-white/35 bg-[radial-gradient(circle_at_32%_24%,#fff,#e4e8e5_46%,#949d9a)] text-center text-[#071012] shadow-[inset_10px_12px_18px_rgba(255,255,255,0.52),inset_-12px_-14px_22px_rgba(0,0,0,0.24),0_16px_28px_rgba(0,0,0,0.5)]"
          style={{ transform: `translateY(${(index % 3) * 7 - 7}px) rotate(${(index % 5) * 3 - 6}deg)` }}
        >
          <span>
            <strong className="block text-lg font-black">{skill.mark}</strong>
            <small className="mt-1 block text-[7px] font-bold uppercase tracking-wide">{skill.name}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
