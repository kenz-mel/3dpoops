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
      {/* Enhanced decorations with better scaling */}
      {decorations.includes('crown') && (
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.4, 0.5, 8]} />
          <meshPhongMaterial 
            color="#ffd700" 
            shininess={100}
            emissive="#ffaa00"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      
      {decorations.includes('halo') && (
        <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.06, 8, 16]} />
          <meshPhongMaterial 
            color="#ffffff" 
            emissive="#ffd700" 
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
      
      {/* Enhanced sparkles for high perfection */}
      {perfectionScore > 0.8 && (
        <>
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * Math.PI / 4) * 2.0,
                Math.cos(i * Math.PI / 4) * 0.5 + 0.5,
                Math.cos(i * Math.PI / 4) * 2.0
              ]}
            >
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial 
                color="#ffff00" 
                emissive="#ffff00"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Legendary aura effect */}
      {perfectionScore > 0.9 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshBasicMaterial 
            color="#ffd700"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </>
  );
};