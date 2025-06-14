import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EmotionState } from '../../types';

interface Animations3DProps {
  emotionState: EmotionState;
  children: React.ReactNode;
}

export const Animations3D: React.FC<Animations3DProps> = ({ 
  emotionState, 
  children 
}) => {
  const groupRef = useRef<THREE.Group>(null);

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

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};