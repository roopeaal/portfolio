"use client";

import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import type { TechSkill } from "@/components/about/tech-stack-3d";

const DESKTOP_BOUNDS = { width: 6.15, height: 3.45 };
const MOBILE_BOUNDS = { width: 2.58, height: 3.1 };

export function TechStackCanvas({ skills }: { skills: TechSkill[] }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const visibleSkills = compact ? skills.slice(0, 10) : skills;
  const bounds = compact ? MOBILE_BOUNDS : DESKTOP_BOUNDS;

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 12], zoom: compact ? 62 : 72 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      aria-label="Interactive physics field showing Roope Aaltonen's technical skills"
      role="img"
    >
      <ambientLight intensity={1.45} />
      <directionalLight position={[-5, 7, 8]} intensity={2.2} color="#e5fffb" />
      <pointLight position={[5, -2, 5]} intensity={18} distance={15} color="#7acac2" />
      <Physics gravity={[0, 0, 0]} timeStep="vary" interpolate>
        <FieldBounds bounds={bounds} />
        <PointerCollider />
        {visibleSkills.map((skill, index) => (
          <TechBall key={skill.name} skill={skill} index={index} compact={compact} />
        ))}
      </Physics>
    </Canvas>
  );
}

function TechBall({ skill, index, compact }: { skill: TechSkill; index: number; compact: boolean }) {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const scale = compact ? 0.66 : 1;
  const radius = skill.radius * scale;
  const initialPosition = useMemo<[number, number, number]>(() => {
    if (!compact) return skill.position;
    return [skill.position[0] * 0.4, skill.position[1] * 0.7, skill.position[2]];
  }, [compact, skill.position]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const angle = index * 1.73 + 0.6;
    body.setLinvel({ x: Math.cos(angle) * 0.42, y: Math.sin(angle) * 0.42, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: index % 2 === 0 ? 0.24 : -0.24 }, true);
  }, [index]);

  useFrame((state, delta) => {
    const body = bodyRef.current;
    const mesh = meshRef.current;
    if (!body || !mesh) return;

    const position = body.translation();
    const velocity = body.linvel();
    const elapsed = state.clock.elapsedTime;
    const centreForce = Math.min(delta, 0.033) * 0.04;
    const driftForce = Math.min(delta, 0.033) * 0.035;
    body.applyImpulse(
      {
        x: -position.x * centreForce - velocity.x * 0.0015 + Math.cos(elapsed * 0.38 + index * 1.7) * driftForce,
        y: -position.y * centreForce - velocity.y * 0.0015 + Math.sin(elapsed * 0.32 + index * 1.3) * driftForce,
        z: -position.z * centreForce,
      },
      true,
    );

    const pulse = 1 + Math.sin(elapsed * 0.8 + index) * 0.012;
    mesh.scale.setScalar(pulse);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={initialPosition}
      enabledRotations={[false, false, true]}
      linearDamping={1.35}
      angularDamping={1.8}
      restitution={0.72}
      friction={0.08}
      canSleep={false}
    >
      <BallCollider args={[radius]} mass={radius * 1.8} />
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={skill.color} roughness={0.32} metalness={0.18} envMapIntensity={0.65} />
        <Html transform center distanceFactor={9.5} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="about-tech-ball-label" style={{ width: `${Math.max(58, radius * 86)}px` }}>
            <strong>{skill.shortLabel}</strong>
            <span>{skill.name}</span>
          </div>
        </Html>
      </mesh>
    </RigidBody>
  );
}

function PointerCollider() {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    const body = bodyRef.current;
    if (!body) return;
    body.setNextKinematicTranslation({
      x: state.pointer.x * (viewport.width / 2),
      y: state.pointer.y * (viewport.height / 2),
      z: 0.25,
    });
  });

  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.72]} />
    </RigidBody>
  );
}

function FieldBounds({ bounds }: { bounds: { width: number; height: number } }) {
  const depth = 1.5;
  const thickness = 0.25;

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[bounds.width, thickness, depth]} position={[0, bounds.height + thickness, 0]} />
      <CuboidCollider args={[bounds.width, thickness, depth]} position={[0, -bounds.height - thickness, 0]} />
      <CuboidCollider args={[thickness, bounds.height, depth]} position={[bounds.width + thickness, 0, 0]} />
      <CuboidCollider args={[thickness, bounds.height, depth]} position={[-bounds.width - thickness, 0, 0]} />
      <CuboidCollider args={[bounds.width, bounds.height, thickness]} position={[0, 0, -1.5]} />
      <CuboidCollider args={[bounds.width, bounds.height, thickness]} position={[0, 0, 1.5]} />
    </RigidBody>
  );
}
