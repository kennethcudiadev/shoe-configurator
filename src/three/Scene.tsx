import * as THREE from "three";
import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import { Shoe } from "./Shoe";
import { FallbackShoe } from "./FallbackShoe";
import { ModelErrorBoundary } from "./ModelErrorBoundary";
import { useConfigStore } from "../store/configStore";

/* ---------- Idle Rotation ---------- */

// This component rotates the shoe when the user hasn't interacted for a while
function ShoeRig() {
  const group = useRef<THREE.Group>(null); // Reference to the 3D group containing the shoe
  const lastInteraction = useConfigStore((s) => s.lastInteraction); // Last user interaction time

  // Frame updates for rotating the shoe
  useFrame((_, dt) => {
    if (!group.current) return;

    const idleFor = Date.now() - lastInteraction;

    // If user has been idle for more than 1.5 seconds, rotate the shoe
    if (idleFor > 1500) {
      group.current.rotation.y += dt * 0.25; // Rotate along Y-axis
    }
  });

  return (
    <group ref={group}>
      <ModelErrorBoundary>
        <Suspense fallback={<FallbackShoe />}>
          <Shoe /> {/* Render the shoe */}
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}

/* ---------- Scene ---------- */

// The scene where all the 3D objects are rendered
export default function Scene() {
  const bumpInteraction = useConfigStore((s) => s.bumpInteraction); // Function to update interaction time

  return (
    <Canvas
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={[1, 1.5]} // Device pixel ratio for better rendering quality
      shadows
      camera={{ position: [0, 1.1, 4.4], fov: 38 }} // Set camera position and field of view
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onPointerDown={bumpInteraction} // Update interaction time on pointer down
      onWheel={bumpInteraction} // Update interaction time on mouse wheel
    >
      <color attach="background" args={["#f8f9fb"]} /> {/* Set the background color */}

      {/* Bright clean studio lighting */}
      <hemisphereLight args={["#ffffff", "#eaeaea", 0.8]} /> {/* Ambient light */}
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow /> {/* Directional light */}
      <directionalLight position={[-4, 3, -3]} intensity={0.8} /> {/* Additional directional lights */}
      <directionalLight position={[0, 3, 5]} intensity={0.8} />

      <ShoeRig /> {/* Render the rotating shoe */}

      {/* Contact shadows for better realism */}
      <ContactShadows
        position={[0, -0.65, 0]}
        opacity={0.25}
        blur={2}
        far={3}
      />

      {/* Orbit controls for camera movement */}
      <OrbitControls
        target={[0, 0.2, 0]} // Set target for the camera to look at
        enablePan={false} // Disable panning
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        minDistance={3}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2}
        onStart={bumpInteraction} // Update interaction time on start
        onChange={bumpInteraction} // Update interaction time on camera change
      />
    </Canvas>
  );
}
