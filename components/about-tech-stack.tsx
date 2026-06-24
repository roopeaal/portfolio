"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, Color, MeshPhysicalMaterial, SRGBColorSpace, Vector3 } from "three";

type Skill = {
  name: string;
  mark: string;
  accent: string;
};

const SKILLS: Skill[] = [
  { name: "TypeScript", mark: "TS", accent: "#3178c6" },
  { name: "React", mark: "RE", accent: "#61dafb" },
  { name: "Python", mark: "PY", accent: "#f3c94b" },
  { name: "Git", mark: "GIT", accent: "#f06b4f" },
  { name: "Docker", mark: "DK", accent: "#2496ed" },
  { name: "Azure", mark: "AZ", accent: "#4ca5e5" },
  { name: "Android", mark: "AN", accent: "#7fbd65" },
  { name: "MQTT", mark: "MQ", accent: "#a487c6" },
  { name: "Raspberry Pi", mark: "RPI", accent: "#cf6687" },
  { name: "Networking", mark: "NET", accent: "#4fb6ae" },
  { name: "Cybersecurity", mark: "SEC", accent: "#df725f" },
  { name: "Testing", mark: "QA", accent: "#d1aa55" },
  { name: "IoT", mark: "IOT", accent: "#56b987" },
  { name: "REST APIs", mark: "API", accent: "#8ba4b1" },
  { name: "Linux", mark: "LNX", accent: "#ead45e" },
  { name: "AWS", mark: "AWS", accent: "#ef9f38" },
];

const DESKTOP_COUNT = 24;
const MOBILE_COUNT = 14;

export function AboutTechStack() {
  const prefersReducedMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const count = compact ? MOBILE_COUNT : DESKTOP_COUNT;

  return (
    <section className="relative h-full min-h-[520px] overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,rgba(65,80,82,0.18),transparent_38%),radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.035),transparent_28%),linear-gradient(180deg,#070707,#020202)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[11%] z-[1] text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-white/42 sm:text-[10px]">Practical systems toolkit</p>
        <h2 className="mt-3 whitespace-nowrap text-[clamp(2.8rem,8vw,7.5rem)] font-light uppercase leading-none tracking-[-0.065em] text-white/90">
          My Techstack
        </h2>
      </div>

      <div className="absolute inset-0 z-[2]">
        {prefersReducedMotion ? <StaticSkillCloud compact={compact} /> : <PhysicsSkillCloud compact={compact} count={count} />}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[3] text-center">
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/38">
          {compact ? "Touch and drag through the stack" : "Move the pointer through the stack"}
        </p>
      </div>
    </section>
  );
}

function PhysicsSkillCloud({ compact, count }: { compact: boolean; count: number }) {
  const balls = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        skill: SKILLS[index % SKILLS.length],
        index,
        scale: (compact ? 0.49 : 0.63) + ((index * 17) % 5) * (compact ? 0.035 : 0.055),
      })),
    [compact, count],
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: compact ? 43 : 35, near: 1, far: 50 }}
      dpr={[1, 1.45]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[7, 9, 12]} intensity={3.4} color="#ffffff" />
      <pointLight position={[-7, -2, 8]} intensity={34} distance={24} color="#79c7c1" />
      <Physics gravity={[0, 0, 0]} timeStep="vary" interpolate>
        <PointerCollider compact={compact} />
        <StageBounds compact={compact} />
        {balls.map((ball) => (
          <SkillBall key={`${ball.skill.name}-${ball.index}`} {...ball} compact={compact} />
        ))}
      </Physics>
    </Canvas>
  );
}

function SkillBall({
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
  const material = useSkillMaterial(skill);
  const angle = index * 2.399;
  const startRadius = compact ? 3.2 + (index % 3) * 0.38 : 5.4 + (index % 4) * 0.62;
  const position: [number, number, number] = [
    Math.cos(angle) * startRadius,
    Math.sin(angle) * startRadius * (compact ? 1.12 : 0.72),
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
    body.setAngvel({ x: 0.18, y: index % 2 === 0 ? 0.28 : -0.28, z: 0.16 }, true);
  }, [angle, index]);

  useFrame((_state, delta) => {
    const body = bodyRef.current;
    if (!body) return;
    const translation = body.translation();
    const impulse = centreVector
      .set(translation.x, translation.y, translation.z)
      .normalize()
      .multiplyScalar(-Math.min(delta, 0.05) * scale * (compact ? 0.42 : 0.56));
    body.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      linearDamping={0.78}
      angularDamping={0.34}
      friction={0.08}
      restitution={0.72}
      canSleep={false}
    >
      <BallCollider args={[scale]} mass={scale * 1.6} />
      <mesh castShadow receiveShadow scale={scale} material={material}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </RigidBody>
  );
}

function useSkillMaterial(skill: Skill) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return new MeshPhysicalMaterial({ color: "#f3f3f0" });

    const gradient = context.createRadialGradient(170, 120, 10, 250, 260, 360);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.48, "#f3f4f1");
    gradient.addColorStop(1, "#aeb5b3");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);

    context.fillStyle = skill.accent;
    context.fillRect(0, 0, 512, 24);
    context.fillRect(0, 488, 512, 24);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#091012";
    context.font = `900 ${skill.mark.length > 2 ? 112 : 150}px Arial`;
    context.fillText(skill.mark, 256, 222);
    context.font = "700 37px Arial";
    context.letterSpacing = "2px";
    context.fillText(skill.name.toUpperCase(), 256, 330);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    return new MeshPhysicalMaterial({
      map: texture,
      color: new Color("#ffffff"),
      roughness: 0.38,
      metalness: 0.18,
      clearcoat: 0.72,
      clearcoatRoughness: 0.25,
      emissive: new Color(skill.accent),
      emissiveIntensity: 0.035,
    });
  }, [skill]);
}

function PointerCollider({ compact }: { compact: boolean }) {
  const ref = useRef<RapierRigidBody | null>(null);
  const viewport = useThree((state) => state.viewport);
  const smoothed = useMemo(() => new Vector3(100, 100, 0), []);

  useFrame(({ pointer }) => {
    const body = ref.current;
    if (!body) return;
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
  const width = compact ? 3.65 : 7.4;
  const height = compact ? 5.25 : 4.2;

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
