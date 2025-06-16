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
  // Enhanced dynamic material with more visible color changes
  const material = useMemo(() => {
    // Map color parameter to full HSL spectrum with better visibility
    const hue = (colorParameter / 100) * 360;
    const saturation = Math.max(0.5, 0.4 + (perfectionScore * 0.5)); // Minimum saturation for visibility
    const lightness = Math.max(0.25, 0.2 + (perfectionScore * 0.4)); // Ensure not too dark
    
    const color = new THREE.Color().setHSL(
      hue / 360, 
      saturation, 
      lightness
    );
    
    // Enhanced material properties with better color response
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 15 + (perfectionScore * 45),
      specular: new THREE.Color(0x333333),
      bumpScale: 0.08,
    });

    // Add special effects for high perfection
    if (perfectionScore > 0.8) {
      material.emissive = new THREE.Color(color).multiplyScalar(0.15);
      material.emissiveIntensity = perfectionScore * 0.25;
    }

    return material;
  }, [colorParameter, perfectionScore]);

  // Special legendary material for very high perfection
  const specialMaterial = useMemo(() => {
    if (perfectionScore < 0.9) return null;
    
    const hue = (colorParameter / 100) * 360;
    const color = new THREE.Color().setHSL(hue / 360, 0.9, 0.5);
    
    return new THREE.MeshPhongMaterial({
      color: color,
      shininess: 80,
      specular: new THREE.Color(0x666666),
      emissive: new THREE.Color(color).multiplyScalar(0.25),
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.98,
    });
  }, [colorParameter, perfectionScore]);

  // Apply materials to geometry
  React.useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'primitive') {
        const geometry = child.props.object;
        if (geometry instanceof THREE.Group) {
          geometry.children.forEach((mesh, index) => {
            if (mesh instanceof THREE.Mesh) {
              // Use special material for legendary creations
              const targetMaterial = perfectionScore > 0.9 && specialMaterial ? specialMaterial : material;
              
              // Clone material for each mesh to allow individual variations
              mesh.material = targetMaterial.clone();
              
              // Add subtle material variation per layer for more organic look
              if (mesh.material instanceof THREE.MeshPhongMaterial) {
                const variation = Math.sin(index * 0.3) * 0.08;
                const originalColor = mesh.material.color.clone();
                mesh.material.color.multiplyScalar(1 + variation);
              }
            }
          });
        }
      }
    });
  }, [material, specialMaterial, perfectionScore, children]);

  return <>{children}</>;
};