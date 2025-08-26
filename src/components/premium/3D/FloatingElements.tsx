'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';

const FloatingOrb = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[0.5, 32, 32]} position={position}>
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </Sphere>
    </Float>
  );
};

export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <FloatingOrb position={[-5, 2, 0]} color="#667eea" />
        <FloatingOrb position={[5, -2, -2]} color="#764ba2" />
        <FloatingOrb position={[0, 4, -1]} color="#f093fb" />
        <FloatingOrb position={[-3, -3, 1]} color="#4facfe" />
      </Canvas>
    </div>
  );
};
