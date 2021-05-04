import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useConfigStore } from "../store/configStore";

/**
 * Placeholder shoe shown when shoe.glb is missing or fails to load.
 * Uses simple geometries (upper = box, sole = flat box, laces = thin box).
 */
export function FallbackShoe() {
  const colors = useConfigStore((s) => s.colors);
  const materialsType = useConfigStore((s) => s.materialsType);

  const mats = useMemo(() => ({
    upper: new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 }),
    sole: new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 }),
    laces: new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 }),
  }), []);

  useEffect(() => {
    const r = materialsType === "glossy" ? 0.18 : 0.75;
    mats.upper.color.set(colors.upper);
    mats.upper.roughness = r;
    mats.sole.color.set(colors.sole);
    mats.sole.roughness = r;
    mats.laces.color.set(colors.laces);
    mats.laces.roughness = r;
  }, [colors, materialsType, mats]);

  return (
    <group scale={0.1} position={[0, 0, 0]}>
      {/* Upper - main body */}
      <mesh position={[0, 1, 0]} material={mats.upper}>
        <boxGeometry args={[3, 2, 5]} />
      </mesh>
      {/* Sole */}
      <mesh position={[0, -0.3, 0.2]} material={mats.sole}>
        <boxGeometry args={[3.2, 0.4, 5.5]} />
      </mesh>
      {/* Laces area */}
      <mesh position={[0, 1.2, -0.5]} material={mats.laces}>
        <boxGeometry args={[0.3, 0.8, 2]} />
      </mesh>
    </group>
  );
}
