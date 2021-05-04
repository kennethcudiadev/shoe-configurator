import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useConfigStore } from "../store/configStore";

// Define type for GLTF result (shoe model)
type GLTFResult = any;

export function Shoe(props: any) {
  const gltf = useGLTF("/models/shoe.glb") as GLTFResult; // Load the shoe model
  const { nodes, materials } = gltf; // Destructure geometry and materials from GLTF

  const colors = useConfigStore((s) => s.colors); // Get the current selected colors
  const materialsType = useConfigStore((s) => s.materialsType); // Get current material type

  // Set up target values based on selected material type (matte/glossy)
  const targets = useMemo(() => {
    if (materialsType === "glossy") {
      return {
        metalness: 0.0,
        roughness: 0.18,
      };
    }

    return {
      metalness: 0.0,
      roughness: 0.75,
    };
  }, [materialsType]);

  // Update materials' colors based on selected colors in the store
  useEffect(() => {
    materials.Upper_Mat.color.set(colors.upper);
    materials.Sole_Mat.color.set(colors.sole);
    materials.Laces_Mat.color.set(colors.laces);
  }, [colors, materials]);

  // Animate material properties (smooth transitions for glossy/matte effect)
  useFrame((_, dt) => {
    const mats = [
      materials.Upper_Mat,
      materials.Sole_Mat,
      materials.Laces_Mat,
    ];

    // Smoothly transition roughness and metalness
    for (const m of mats) {
      m.roughness = THREE.MathUtils.damp(
        m.roughness,
        targets.roughness,
        4,
        dt
      );

      m.metalness = THREE.MathUtils.damp(
        m.metalness,
        targets.metalness,
        4,
        dt
      );
    }
  });

  return (
    <group {...props} dispose={null} scale={0.1}>
      {/* Render different parts of the shoe */}
      <mesh geometry={nodes.Upper.geometry} material={materials.Upper_Mat} />
      <mesh geometry={nodes.Sole.geometry} material={materials.Sole_Mat} />
      <mesh geometry={nodes.Laces.geometry} material={materials.Laces_Mat} />
    </group>
  );
}

useGLTF.preload("/models/shoe.glb"); // Preload the shoe model
