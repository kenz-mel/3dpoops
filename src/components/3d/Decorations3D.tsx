import React from 'react';
import * as THREE from 'three';

interface Decorations3DProps {
  decorations: string[];
  perfectionScore: number;
}

export const Decorations3D: React.FC<Decorations3DProps> = ({ 
  decorations, 
  perfectionScore 
}) => {
  return (
    <>
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
    </>
  );
};