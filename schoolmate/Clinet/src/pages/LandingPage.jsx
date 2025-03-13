import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect } from "react";

function RobotModel() {
  const { scene, animations } = useGLTF("/robot_playground.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions) {
      actions[Object.keys(actions)[0]]?.play(); // Plays the first available animation
    }
  }, [actions]);

  return <primitive object={scene} scale={2} position={[0, -1.5, 0]} />;
}

export default function LandingPage() {
  return (
    <div className="relative w-full h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* 3D Scene */}
      <div className="w-full h-3/4">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 5, 2]} intensity={1.5} />

          {/* Animated Floating Robot */}
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <RobotModel />
            </Float>
          </Suspense>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Text Below the Model */}
      <div className="w-full text-center text-white mt-4">
        <h1 className="text-4xl font-bold">Welcome to School Mate</h1>
        <p className="text-lg mt-2 italic">
          “Education is the most powerful weapon which you can use to change the world.”
        </p>
      </div>
    </div>
  );
}
