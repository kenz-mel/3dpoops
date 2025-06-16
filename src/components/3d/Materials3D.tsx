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
  // Dynamic material with full color spectrum - no restrictions
  const material = useMemo(() => {
    // Map color parameter to full HSL spectrum
    const hue = (colorParameter / 100) * 360; // Full 360 degree hue range
    const saturation = 0.6 + (perfectionScore * 0.4); // Higher perfection = more saturated
    const lightness = 0.3 + (perfectionScore * 0.3); // Higher perfection = brighter
    
    const color = new THREE.Color().setHSL(
      hue / 360, 
      saturation, 
      lightness
    );
    
    // Enhanced material properties
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 20 + (perfectionScore * 60), // More shine for perfect creations
      specular: new THREE.Color(0x444444),
      bumpScale: 0.1, // Add surface detail
    });

    // Add special effects for high perfection
    if (perfectionScore > 0.8) {
      material.emissive = new THREE.Color(color).multiplyScalar(0.1);
      material.emissiveIntensity = perfectionScore * 0.3;
    }

    return material;
  }, [colorParameter, perfectionScore]);

  // Enhanced material for very high perfection scores
  const specialMaterial = useMemo(() => {
    if (perfectionScore < 0.9) return null;
    
    const hue = (colorParameter / 100) * 360;
    const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
    
    return new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100,
      specular: new THREE.Color(0x888888),
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.95,
    });
  }, [colorParameter, perfectionScore]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'primitive') {
          const geometry = child.props.object;
          if (geometry instanceof THREE.Group) {
            geometry.children.forEach((mesh, index) => {
              if (mesh instanceof THREE.Mesh) {
                // Use special material for legendary creations
                mesh.material = perfectionScore > 0.9 && specialMaterial ? specialMaterial : material;
                
                // Add subtle material variation per layer
                if (mesh.material instanceof THREE.MeshPhongMaterial) {
                  const variation = Math.sin(index * 0.5) * 0.1;
                  const originalColor = mesh.material.color.clone();
                  mesh.material.color.multiplyScalar(1 + variation);
                }
              }
            });
          }
        }
        return child;
      })}
    </>
  );
};