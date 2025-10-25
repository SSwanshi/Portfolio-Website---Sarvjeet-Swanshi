'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Code Block Component
function CodeBlock({ position, index }: { position: [number, number, number]; index: number; codeText: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z += 0.003
      
      // Pulsing scale based on time and hover state
      const scale = hovered ? 1.3 : 1 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.15
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.4, 0.2, 0.1]} />
      <meshStandardMaterial
        color={hovered ? "#00ff00" : "#ffffff"}
        emissive={hovered ? "#00ff00" : "#ffffff"}
        emissiveIntensity={hovered ? 0.6 : 0.2}
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.8}
        wireframe={false}
      />
    </mesh>
  )
}

// Connection Line Component
function ConnectionLine({ 
  start, 
  end, 
  opacity = 0.3 
}: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  opacity?: number 
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00ffff"
        transparent
        opacity={opacity}
        linewidth={1}
      />
    </line>
  )
}

// Particle Field Component
function ParticleField({ mousePosition }: { mousePosition: [number, number] }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 1000

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Create a spherical distribution
      const radius = Math.random() * 15 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Gradient colors from white to cyan
      const intensity = Math.random()
      colors[i * 3] = intensity
      colors[i * 3 + 1] = intensity + (1 - intensity) * 0.5
      colors[i * 3 + 2] = intensity + (1 - intensity) * 0.8
      
      sizes[i] = Math.random() * 0.02 + 0.005
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame(() => {
    if (pointsRef.current) {
      // Gentle rotation
      pointsRef.current.rotation.y += 0.0005
      pointsRef.current.rotation.x += 0.0002
      
      // Mouse interaction
      pointsRef.current.position.x = mousePosition[0] * 2
      pointsRef.current.position.y = mousePosition[1] * 1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Code Grid Component
function CodeGrid({ mousePosition }: { mousePosition: [number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      groupRef.current.position.x = mousePosition[0] * 0.5
      groupRef.current.position.z = mousePosition[1] * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      {/* Grid Lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <CodeGridLine key={`line-${i}`} index={i} />
      ))}
      
      {/* Grid Nodes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <CodeGridNode key={`node-${i}`} index={i} />
      ))}
    </group>
  )
}

// Individual Grid Line
function CodeGridLine({ index }: { index: number }) {
  const isVertical = index % 2 === 0
  const position = isVertical 
    ? [index * 0.5 - 5, 0, 0] as [number, number, number]
    : [0, 0, index * 0.5 - 5] as [number, number, number]
  
  const points = isVertical
    ? [new THREE.Vector3(0, 0, -5), new THREE.Vector3(0, 0, 5)]
    : [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)]

  return (
    <group position={position}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.4}
          linewidth={2}
        />
      </line>
    </group>
  )
}

// Individual Grid Node
function CodeGridNode({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const x = (Math.random() - 0.5) * 10
  const z = (Math.random() - 0.5) * 10

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = Math.sin(time * 0.5 + index) * 0.1
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={[x, 0, z]}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// Floating Code Symbols
function FloatingCodeSymbols() {
  const groupRef = useRef<THREE.Group>(null)
  const symbols = ['</>', '{}', '=>', '()', '<div>', 'npm', 'git', 'js', 'ts', 'css']

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {symbols.map((symbol, i) => (
        <FloatingSymbol key={i} symbol={symbol} index={i} />
      ))}
    </group>
  )
}

// Binary Code Lines
function BinaryCodeLines() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <BinaryCodeLine key={i} index={i} />
      ))}
    </group>
  )
}

// Individual Binary Code Line
function BinaryCodeLine({ }: { index: number }) {
  const binaryCode = '01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100'
  const chars = binaryCode.split('')
  
  const points = chars.map((char, i) => {
    const x = (i - chars.length / 2) * 0.1
    const y = Math.sin(i * 0.3) * 0.2
    const z = 0
    return new THREE.Vector3(x, y, z)
  })

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00ff00"
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </line>
  )
}

// Individual Floating Symbol
function FloatingSymbol({ index }: { symbol: string; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const radius = 6 + Math.sin(time * 0.3 + index) * 1
      const angle = (index / 10) * Math.PI * 2 + time * 0.1
      const height = Math.sin(time * 0.4 + index) * 0.5
      
      meshRef.current.position.x = Math.cos(angle) * radius
      meshRef.current.position.y = height
      meshRef.current.position.z = Math.sin(angle) * radius
      
      meshRef.current.rotation.y = time * 0.2 + index
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.3, 0.1, 0.1]} />
      <meshStandardMaterial
        color="#ff6600"
        emissive="#ff6600"
        emissiveIntensity={0.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

// Main Network Scene Component
function NetworkScene({ mousePosition }: { mousePosition: [number, number] }) {
  const { camera } = useThree()
  
  // Generate code blocks
  const codeBlocks = useMemo(() => {
    const codePositions: Array<{ position: [number, number, number]; text: string }> = []
    const codeTexts = [
      'const app = () => {}',
      'import React from "react"',
      'function init() {}',
      'class Component {}',
      'export default App',
      'useEffect(() => {}, [])',
      'const [state, setState] = useState()',
      'return <div>Hello</div>',
      'npm install package',
      'git commit -m "feat"',
      'console.log("debug")',
      'if (condition) {}',
      'for (let i = 0; i < n; i++) {}',
      'try { } catch (e) {}',
      'async function fetchData() {}'
    ]
    
    for (let i = 0; i < 15; i++) {
      const radius = Math.random() * 6 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      codePositions.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        text: codeTexts[i % codeTexts.length]
      })
    }
    
    return codePositions
  }, [])

  // Generate connections between nearby code blocks
  const connections = useMemo(() => {
    const connections: Array<{ start: [number, number, number]; end: [number, number, number] }> = []
    
    for (let i = 0; i < codeBlocks.length; i++) {
      for (let j = i + 1; j < codeBlocks.length; j++) {
        const distance = Math.sqrt(
          Math.pow(codeBlocks[i].position[0] - codeBlocks[j].position[0], 2) +
          Math.pow(codeBlocks[i].position[1] - codeBlocks[j].position[1], 2) +
          Math.pow(codeBlocks[i].position[2] - codeBlocks[j].position[2], 2)
        )
        
        // Connect code blocks that are close enough
        if (distance < 5) {
          connections.push({
            start: codeBlocks[i].position,
            end: codeBlocks[j].position
          })
        }
      }
    }
    
    return connections
  }, [codeBlocks])

  useFrame(() => {
    // Smooth camera movement based on mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition[0] * 1.5, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition[1] * 0.8, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.15} />
      <pointLight position={[8, 8, 8]} intensity={0.6} color="#00ffff" />
      <pointLight position={[-8, -8, -8]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#00ff00" />
      <pointLight position={[0, -8, 0]} intensity={0.2} color="#ff6600" />
      
      {/* Code Blocks */}
      {codeBlocks.map((block, index) => (
        <CodeBlock key={index} position={block.position} index={index} codeText={block.text} />
      ))}
      
      {/* Connection Lines */}
      {connections.map((connection, index) => (
        <ConnectionLine
          key={index}
          start={connection.start}
          end={connection.end}
          opacity={0.15}
        />
      ))}
      
      {/* Particle Field */}
      <ParticleField mousePosition={mousePosition} />
      
      {/* Code Grid */}
      <CodeGrid mousePosition={mousePosition} />
      
      {/* Floating Code Symbols */}
      <FloatingCodeSymbols />
      
      {/* Binary Code Lines */}
      <BinaryCodeLines />
    </>
  )
}

// Mouse Position Hook
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition([x, y])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mousePosition
}

// Main Network Three Scene Component
export function NetworkThreeScene() {
  const mousePosition = useMousePosition()

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <NetworkScene mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}
