'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function FloatingParticles() {
  return (
    <>
      {/* Floating spheres */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-3, 2, -2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[4, -1, -3]}>
          <octahedronGeometry args={[0.15]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} wireframe />
        </mesh>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2.5}>
        <mesh position={[-2, -2, -1]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
        </mesh>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.8}>
        <mesh position={[3, 1, -4]}>
          <torusGeometry args={[0.08, 0.03, 8, 16]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.25} wireframe />
        </mesh>
      </Float>
      
      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={2.2}>
        <mesh position={[-4, 0, -3]}>
          <icosahedronGeometry args={[0.12]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
        </mesh>
      </Float>
      
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.6}>
        <mesh position={[2, 3, -2]}>
          <tetrahedronGeometry args={[0.1]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} wireframe />
        </mesh>
      </Float>
    </>
  );
}

export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.3} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={0.2} color="#8b5cf6" />
          
          <FloatingParticles />
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
