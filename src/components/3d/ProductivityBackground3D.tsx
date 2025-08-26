'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Float, Ring, Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

export default function ProductivityBackground3D() {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  // Gerar pontos para partículas de produtividade (menos denso)
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(500 * 3) // Reduzido para 500 partículas
    const colors = new Float32Array(500 * 3)
    
    for (let i = 0; i < 500; i++) {
      // Posições mais organizadas e espalhadas
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      
      // Cores baseadas em produtividade (azul para foco, verde para progresso)
      const color = new THREE.Color()
      if (Math.random() > 0.5) {
        color.setHSL(0.6, 0.7, 0.6) // Azul para foco
      } else {
        color.setHSL(0.4, 0.8, 0.5) // Verde para progresso
      }
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [])

  // Animação das partículas
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
  })

  return (
    <>
      {/* Partículas de produtividade */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Elementos 3D temáticos de produtividade */}
      <group ref={groupRef}>
        {/* Progress Ring - Representando completação de tarefas */}
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
          <Ring
            args={[2, 2.5, 32]}
            position={[-8, 3, -5]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </Ring>
        </Float>

        {/* Progress Ring - Representando tarefas em progresso */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
          <Ring
            args={[1.5, 2, 32]}
            position={[8, -2, -4]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color="#3b82f6"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </Ring>
        </Float>

        {/* Barra de progresso 3D - Representando timeline */}
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={1}>
          <Box
            args={[6, 0.3, 0.3]}
            position={[0, 5, -6]}
          >
            <meshStandardMaterial
              color="#8b5cf6"
              transparent
              opacity={0.2}
            />
          </Box>
        </Float>

        {/* Indicadores de prioridade - Representando níveis de urgência */}
        <Float speed={2.5} rotationIntensity={0.8} floatIntensity={2}>
          <Cylinder
            args={[0.2, 0.2, 1.5, 8]}
            position={[-6, -3, -3]}
            rotation={[0, 0, Math.PI / 4]}
          >
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.3}
            />
          </Cylinder>
        </Float>

        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
          <Cylinder
            args={[0.15, 0.15, 1.2, 8]}
            position={[6, 1, -4]}
            rotation={[0, 0, -Math.PI / 6]}
          >
            <meshStandardMaterial
              color="#f59e0b"
              transparent
              opacity={0.25}
            />
          </Cylinder>
        </Float>

        {/* Grid de produtividade - Representando organização */}
        <Float speed={1} rotationIntensity={0.1}>
          <group position={[0, 0, -8]}>
            {Array.from({ length: 5 }, (_, i) => (
              <group key={i} position={[(i - 2) * 2, 0, 0]}>
                {Array.from({ length: 3 }, (_, j) => (
                  <Box
                    key={j}
                    args={[0.1, 0.1, 0.1]}
                    position={[0, (j - 1) * 2, 0]}
                  >
                    <meshStandardMaterial
                      color="#06b6d4"
                      transparent
                      opacity={0.15}
                    />
                  </Box>
                ))}
              </group>
            ))}
          </group>
        </Float>
      </group>

      {/* Luzes ambientes para produtividade */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#10b981" />
      <pointLight position={[0, 15, -10]} intensity={0.2} color="#8b5cf6" />
    </>
  )
}
