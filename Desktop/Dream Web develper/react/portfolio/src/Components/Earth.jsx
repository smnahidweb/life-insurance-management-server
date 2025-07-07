// Earth.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'

export default function EarthScene() {
  const earthTexture = useLoader(TextureLoader, '/earth.jpg') // Add earth texture to public folder

  return (
    <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <mesh rotation={[0.4, 0.2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
