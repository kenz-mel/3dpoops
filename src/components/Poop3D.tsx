import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { EmotionState } from '../hooks/usePoopSoul';

interface Poop3DProps {
  parameters: {
    color: number;
    length: number;
    width: number;
    layers: number;
    face: number;
  };
  emotionState: EmotionState;
  perfectionScore: number;
  decorations: string[];
  selectedFaceTexture?: string;
}

export const Poop3D: React.FC<Poop3DProps> = ({
  parameters,
  emotionState,
  perfectionScore,
  decorations,
  selectedFaceTexture
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const faceRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();
  
  const noise3D = useMemo(() => createNoise3D(), []);
  
  // Create poop-shaped geometry with swirls and layers
  const geometry = useMemo(() => {
    const layerCount = Math.max(1, Math.floor(parameters.layers / 25) + 1);
    const group = new THREE.Group();
    
    for (let layer = 0; layer < layerCount; layer++) {
      // Create each layer as a twisted torus/cylinder
      const radiusTop = 0.3 + (parameters.width / 100) * 0.4 - (layer * 0.05);
      const radiusBottom = 0.4 + (parameters.width / 100) * 0.5 - (layer * 0.05);
      const height = (0.3 + (parameters.length / 100) * 0.4) / layerCount;
      
      const segments = 16;
      const layerGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
      
      // Apply organic deformation
      const positions = layerGeo.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        
        // Add swirl effect
        const angle = Math.atan2(vertex.z, vertex.x);
        const radius = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const swirlAmount = (parameters.layers / 100) * 0.5;
        const newAngle = angle + vertex.y * swirlAmount;
        
        vertex.x = Math.cos(newAngle) * radius;
        vertex.z = Math.sin(newAngle) * radius;
        
        // Add organic bumps
        const noiseValue = noise3D(vertex.x * 3, vertex.y * 3 + layer, vertex.z * 3) * 0.1;
        const distanceFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const bumpFactor = 1 + noiseValue * (parameters.layers / 100);
        
        vertex.x *= bumpFactor;
        vertex.z *= bumpFactor;
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      layerGeo.attributes.position.needsUpdate = true;
      layerGeo.computeVertexNormals();
      
      const layerMesh = new THREE.Mesh(layerGeo);
      layerMesh.position.y = layer * height - (layerCount * height) / 2;
      
      // Add slight rotation for more organic look
      layerMesh.rotation.y = layer * 0.3;
      
      group.add(layerMesh);
    }
    
    return group;
  }, [parameters.length, parameters.width, parameters.layers, noise3D]);

  // Dynamic material based on color parameter - brown poop colors
  const material = useMemo(() => {
    // Map color parameter to brown spectrum
    const brownHues = [
      { h: 30, s: 0.8, l: 0.2 },   // Dark brown
      { h: 35, s: 0.7, l: 0.3 },   // Medium brown  
      { h: 40, s: 0.6, l: 0.4 },   // Light brown
      { h: 45, s: 0.5, l: 0.5 },   // Tan
      { h: 50, s: 0.8, l: 0.6 },   // Golden brown
    ];
    
    const colorIndex = Math.floor((parameters.color / 100) * (brownHues.length - 1));
    const selectedColor = brownHues[colorIndex];
    
    const color = new THREE.Color().setHSL(
      selectedColor.h / 360, 
      selectedColor.s, 
      selectedColor.l
    );
    
    return new THREE.MeshPhongMaterial({
      color: color,
      shininess: 10 + (perfectionScore * 40),
      specular: new THREE.Color(0x222222)
    });
  }, [parameters.color, perfectionScore]);

  // Face texture loader and positioning
  const faceTexture = useMemo(() => {
    if (!selectedFaceTexture) return null;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(selectedFaceTexture);
    texture.flipY = false;
    return texture;
  }, [selectedFaceTexture]);

  // Animation based on emotion state
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Reset transformations
    groupRef.current.rotation.set(0, 0, 0);
    groupRef.current.position.set(0, 0, 0);
    groupRef.current.scale.set(1, 1, 1);
    
    switch (emotionState) {
      case 'happy':
        groupRef.current.rotation.z = Math.sin(time * 4) * 0.1;
        groupRef.current.position.y = Math.sin(time * 6) * 0.1;
        break;
      case 'excited':
        groupRef.current.scale.setScalar(1 + Math.sin(time * 8) * 0.05);
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.2;
        break;
      case 'strained':
        groupRef.current.scale.y = 0.9 + Math.sin(time * 10) * 0.05;
        groupRef.current.scale.x = 1.1 + Math.sin(time * 10) * 0.05;
        break;
      case 'proud':
        groupRef.current.rotation.y = time * 0.5;
        groupRef.current.position.y = Math.sin(time * 2) * 0.2;
        groupRef.current.scale.setScalar(1.1);
        break;
      case 'sleepy':
        groupRef.current.position.y = Math.sin(time * 1) * 0.05;
        groupRef.current.scale.setScalar(0.95);
        break;
      default:
        // Idle breathing
        groupRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
        break;
    }
  });

  // Add lighting effects for high perfection
  useEffect(() => {
    if (perfectionScore > 0.8) {
      const light = new THREE.PointLight(0xffd700, 1.5, 8);
      light.position.set(0, 2, 2);
      scene.add(light);
      
      return () => {
        scene.remove(light);
      };
    }
  }, [perfectionScore, scene]);

  return (
    <group ref={groupRef}>
      {/* Main poop geometry with material applied to each layer */}
      <primitive object={geometry}>
        {geometry.children.map((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
          }
          return null;
        })}
      </primitive>
      
      {/* Face overlay positioned on the front */}
      {faceTexture && (
        <mesh ref={faceRef} position={[0, 0.1, 0.6]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial 
            map={faceTexture} 
            transparent 
            alphaTest={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Decorations */}
      {decorations.includes('crown') && (
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.25, 0.3, 8]} />
          <meshPhongMaterial color="#ffd700" />
        </mesh>
      )}
      
      {decorations.includes('halo') && (
        <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.04, 8, 16]} />
          <meshPhongMaterial 
            color="#ffffff" 
            emissive="#ffd700" 
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Sparkles for high perfection */}
      {perfectionScore > 0.8 && (
        <>
          {[...Array(6)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * Math.PI / 3) * 1.2,
                Math.cos(i * Math.PI / 3) * 0.3 + 0.2,
                Math.cos(i * Math.PI / 3) * 1.2
              ]}
            >
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial 
                color="#ffff00" 
                emissive="#ffff00"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};