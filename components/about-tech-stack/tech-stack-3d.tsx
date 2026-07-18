"use client";

import { Decal } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Vector3 } from "three";

import { createSkillLabelTexture, TECH_STACK_SKILLS, type Skill } from "./skill-textures";

type BallDefinition = {
  skill: Skill;
  index: number;
  scale: number;
  position: [number, number, number];
};

const DESKTOP_POSITIONS: Array<[number, number]> = [
  [-5.25, 2.45], [-1.78, 2.58], [1.78, 2.48], [5.2, 2.55],
  [-4.35, 0.78], [-1.3, 0.75], [1.85, 0.82], [4.65, 0.72],
  [-5.15, -1.08], [-1.82, -1.02], [1.55, -1.12], [4.92, -1.02],
  [-2.75, -2.62], [2.72, -2.58],
];

const COMPACT_POSITIONS: Array<[number, number]> = [
  [-2.45, 3.45], [0, 3.55], [2.45, 3.42],
  [-1.82, 1.72], [0.72, 1.8], [2.55, 1.55],
  [-2.45, 0.02], [0, 0.08], [2.45, -0.02],
  [-1.75, -1.72], [0.78, -1.8], [2.5, -1.62],
  [-1.25, -3.42], [1.4, -3.38],
];

export function TechStack3D({ compact }: { compact: boolean }) {
  const [pointerActive, setPointerActive] = useState(false);
  const bodies = useRef<Array<RapierRigidBody | null>>([]);
  const registerBody = useCallback((index: number, body: RapierRigidBody | null) => {
    bodies.current[index] = body;
  }, []);
  const balls = useMemo<BallDefinition[]>(() => {
    const positions = compact ? COMPACT_POSITIONS : DESKTOP_POSITIONS;

    return TECH_STACK_SKILLS.map((skill, index) => ({
      skill,
      index,
      scale: (compact ? 0.67 : 0.86) + ((index * 13) % 3) * (compact ? 0.035 : 0.05),
      position: [positions[index][0], positions[index][1], ((index % 5) - 2) * 0.12],
    }));
  }, [compact]);

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: compact ? 37 : 35, near: 1, far: 42 }}
      dpr={compact ? 1 : [1, 1.4]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      performance={{ min: 0.65 }}
      style={{ touchAction: "pan-y pinch-zoom" }}
      onPointerEnter={(event) => setPointerActive(event.pointerType === "mouse")}
      onPointerLeave={() => setPointerActive(false)}
      onPointerDown={() => setPointerActive(true)}
      onPointerUp={() => setPointerActive(false)}
      onPointerCancel={() => setPointerActive(false)}
    >
      <fog attach="fog" args={["#050809", 15, 25]} />
      <ambientLight intensity={compact ? 1.55 : 1.75} />
      <directionalLight position={[7, 9, 12]} intensity={compact ? 2.6 : 3.2} color="#f5fbfa" />
      <pointLight position={[-6, -2, 7]} intensity={compact ? 18 : 30} distance={22} color="#6fc0b8" />
      <pointLight position={[6, 3, 5]} intensity={compact ? 9 : 15} distance={18} color="#9bb5bd" />
      <TechnicalBackdrop compact={compact} />

      <Physics gravity={[0, 0, 0]} timeStep={1 / 60} interpolate>
        <PointerCollider compact={compact} active={pointerActive} />
        <StageBounds compact={compact} />
        <CenterAttractor bodies={bodies} compact={compact} />
        {balls.map((ball) => (
          <TechBall key={ball.skill.name} {...ball} compact={compact} registerBody={registerBody} />
        ))}
      </Physics>
    </Canvas>
  );
}

function TechBall({
  skill,
  index,
  scale,
  position,
  compact,
  registerBody,
}: BallDefinition & {
  compact: boolean;
  registerBody: (index: number, body: RapierRigidBody | null) => void;
}) {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const labelTexture = useMemo(() => createSkillLabelTexture(skill), [skill]);

  useEffect(() => {
    const body = bodyRef.current;
    registerBody(index, body);
    if (!body) return;

    const direction = index * 1.73 + 0.6;
    body.setLinvel(
      {
        x: Math.cos(direction) * (compact ? 0.28 : 0.46),
        y: Math.sin(direction) * (compact ? 0.28 : 0.46),
        z: 0,
      },
      true,
    );
    body.setAngvel(
      {
        x: compact ? 0.06 : 0.09,
        y: (index % 2 === 0 ? 1 : -1) * (compact ? 0.13 : 0.2),
        z: compact ? 0.04 : 0.08,
      },
      true,
    );

    return () => {
      registerBody(index, null);
    };
  }, [compact, index, registerBody]);

  useEffect(() => () => labelTexture.dispose(), [labelTexture]);

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      rotation={[0.08 * (index % 3), index * 0.21, 0.04 * (index % 4)]}
      linearDamping={compact ? 1.45 : 1.16}
      angularDamping={compact ? 1.1 : 0.76}
      friction={0.12}
      restitution={compact ? 0.46 : 0.56}
      canSleep={compact}
    >
      <BallCollider args={[scale]} mass={scale * 1.75} />
      <mesh scale={scale}>
        <sphereGeometry args={[1, compact ? 22 : 30, compact ? 16 : 22]} />
        {compact ? (
          <meshStandardMaterial
            color="#87908f"
            emissive={skill.accent}
            emissiveIntensity={0.018}
            roughness={0.3}
            metalness={0.3}
          />
        ) : (
          <meshPhysicalMaterial
            color="#929a99"
            emissive={skill.accent}
            emissiveIntensity={0.02}
            roughness={0.27}
            metalness={0.34}
            clearcoat={0.72}
            clearcoatRoughness={0.23}
          />
        )}
        <LogoDecal texture={labelTexture} position={[0, 0, 0.985]} rotation={[0, 0, 0]} />
        <LogoDecal texture={labelTexture} position={[0, 0, -0.985]} rotation={[0, Math.PI, 0]} />
      </mesh>
    </RigidBody>
  );
}

function LogoDecal({
  texture,
  position,
  rotation,
}: {
  texture: ReturnType<typeof createSkillLabelTexture>;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <Decal position={position} rotation={rotation} scale={1.44}>
      <meshBasicMaterial
        map={texture}
        alphaTest={0.12}
        alphaToCoverage
        depthTest
        depthWrite
        polygonOffset
        polygonOffsetFactor={-0.75}
        toneMapped={false}
      />
    </Decal>
  );
}

function CenterAttractor({
  bodies,
  compact,
}: {
  bodies: MutableRefObject<Array<RapierRigidBody | null>>;
  compact: boolean;
}) {
  const force = useMemo(() => new Vector3(), []);

  useFrame((_state, delta) => {
    const step = Math.min(delta, 1 / 30);

    bodies.current.forEach((body) => {
      if (!body) return;
      const position = body.translation();
      const distance = Math.hypot(position.x, position.y, position.z);
      if (distance < (compact ? 0.9 : 0.75)) return;

      force.set(-position.x, -position.y, -position.z * 1.8);
      const maxForce = compact ? 0.009 : 0.013;
      const multiplier = Math.min(maxForce, step * (compact ? 0.16 : 0.2));
      force.multiplyScalar(multiplier);
      body.applyImpulse(force, !compact);
    });
  });

  return null;
}

function PointerCollider({ compact, active }: { compact: boolean; active: boolean }) {
  const ref = useRef<RapierRigidBody | null>(null);
  const viewport = useThree((state) => state.viewport);
  const smoothed = useMemo(() => new Vector3(100, 100, 0), []);
  const target = useMemo(() => new Vector3(), []);

  useFrame(({ pointer }) => {
    const body = ref.current;
    if (!body) return;

    if (!active) {
      body.setNextKinematicTranslation({ x: 100, y: 100, z: 100 });
      smoothed.set(100, 100, 100);
      return;
    }

    target.set(pointer.x * viewport.width * 0.5, pointer.y * viewport.height * 0.5, 0.6);
    smoothed.lerp(target, compact ? 0.16 : 0.22);
    body.setNextKinematicTranslation(smoothed);
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[100, 100, 100]}>
      <BallCollider args={[compact ? 0.7 : 1.02]} />
    </RigidBody>
  );
}

function StageBounds({ compact }: { compact: boolean }) {
  const viewport = useThree((state) => state.viewport);
  const width = Math.min(compact ? 3.45 : 6.7, viewport.width * 0.45);
  const height = Math.min(compact ? 4.35 : 3.55, viewport.height * 0.44);

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[width, 0.16, 1.7]} position={[0, height, 0]} />
      <CuboidCollider args={[width, 0.16, 1.7]} position={[0, -height, 0]} />
      <CuboidCollider args={[0.16, height, 1.7]} position={[width, 0, 0]} />
      <CuboidCollider args={[0.16, height, 1.7]} position={[-width, 0, 0]} />
      <CuboidCollider args={[width, height, 0.16]} position={[0, 0, -1.45]} />
      <CuboidCollider args={[width, height, 0.16]} position={[0, 0, 1.45]} />
    </RigidBody>
  );
}

function TechnicalBackdrop({ compact }: { compact: boolean }) {
  return (
    <group position={[0, -0.12, -1.6]} rotation={[0.12, 0.05, -0.11]}>
      <mesh>
        <torusGeometry args={[compact ? 2.4 : 4.3, 0.012, 8, compact ? 64 : 112]} />
        <meshBasicMaterial color="#79bfb8" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh rotation={[0.24, 0.58, 0.7]}>
        <torusGeometry args={[compact ? 1.72 : 3.25, 0.008, 8, compact ? 56 : 96]} />
        <meshBasicMaterial color="#bed8d4" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh rotation={[0.16, 0.32, 0]}>
        <sphereGeometry args={[compact ? 2.75 : 4.75, compact ? 16 : 24, compact ? 10 : 16]} />
        <meshBasicMaterial color="#83bcb6" wireframe transparent opacity={0.022} depthWrite={false} />
      </mesh>
    </group>
  );
}
