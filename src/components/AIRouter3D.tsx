import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useRef } from "react";

function RouterCore() {
  const ref: any = useRef();

  useFrame(() => {
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#22c55e" wireframe />
    </mesh>
  );
}

function Node({ position, color }: any) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Connection({ start, end }: any) {
  return (
    <Line
      points={[start, end]}
      color="white"
      lineWidth={2}
    />
  );
}

export default function AIRouter3D() {
  const center = [0, 0, 0];

  const nodes = [
    { pos: [3, 0, 0], color: "#6366f1" }, // LLM
    { pos: [-3, 0, 0], color: "#f59e0b" }, // Local
    { pos: [0, 3, 0], color: "#ef4444" }, // RAG
  ];

  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={1} />

      {/* Core */}
      <RouterCore />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <Node key={i} position={n.pos} color={n.color} />
      ))}

      {/* Connections */}
      {nodes.map((n, i) => (
        <Connection key={i} start={center} end={n.pos} />
      ))}

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}
