import React, { useMemo } from 'react';
import * as THREE from 'three';

interface Materials3DProps {
  colorParameter: number;
  perfectionScore: number;
  children: React.ReactNode;
}

export const Materials3D: React.FC<Materials3DProps> = ({ 
  colorParameter, 
  perfectionScore, 
  children 
}) => {
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
    
    const colorIndex = Math.floor((colorParameter / 100) * (brownHues.length - 1));
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
  }, [colorParameter, perfectionScore]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'primitive') {
          const geometry = child.props.object;
          if (geometry instanceof THREE.Group) {
            geometry.children.forEach((mesh) => {
              if (mesh instanceof THREE.Mesh) {
                mesh.material = material;
              }
            });
          }
        }
        return child;
      })}
    </>
  );
};