import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { CharacterParameters } from '../../types';

interface Geometry3DProps {
  parameters: CharacterParameters;
}

export const Geometry3D: React.FC<Geometry3DProps> = ({ parameters }) => {
  const noise3D = useMemo(() => createNoise3D(), []);
  
  // Create more realistic poop-shaped geometry with proper base size
  const geometry = useMemo(() => {
    const layerCount = Math.max(2, Math.floor(parameters.layers / 20) + 2);
    const group = new THREE.Group();
    
    for (let layer = 0; layer < layerCount; layer++) {
      // Fixed base size to 0.5 radius as requested
      const baseRadius = 0.5;
      const radiusTop = baseRadius + (parameters.width / 100) * 0.4 - (layer * 0.06);
      const radiusBottom = baseRadius + 0.15 + (parameters.width / 100) * 0.5 - (layer * 0.06);
      const height = (0.4 + (parameters.length / 100) * 0.6) / layerCount;
      
      const segments = 20;
      const layerGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
      
      // Apply organic deformation with better swirl effect
      const positions = layerGeo.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        
        // Enhanced swirl effect
        const angle = Math.atan2(vertex.z, vertex.x);
        const radius = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const swirlAmount = (parameters.layers / 100) * 0.6 + 0.15;
        const heightFactor = (vertex.y + height/2) / height;
        const newAngle = angle + heightFactor * swirlAmount * Math.PI;
        
        vertex.x = Math.cos(newAngle) * radius;
        vertex.z = Math.sin(newAngle) * radius;
        
        // Enhanced organic bumps
        const noiseValue1 = noise3D(vertex.x * 2, vertex.y * 2 + layer, vertex.z * 2) * 0.12;
        const noiseValue2 = noise3D(vertex.x * 5, vertex.y * 5 + layer * 2, vertex.z * 5) * 0.06;
        const combinedNoise = noiseValue1 + noiseValue2;
        
        const bumpFactor = 1 + combinedNoise * (parameters.layers / 100 + 0.25);
        
        vertex.x *= bumpFactor;
        vertex.z *= bumpFactor;
        vertex.y += combinedNoise * 0.08;
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      layerGeo.attributes.position.needsUpdate = true;
      layerGeo.computeVertexNormals();
      
      const layerMesh = new THREE.Mesh(layerGeo);
      layerMesh.position.y = layer * height - (layerCount * height) / 2;
      layerMesh.rotation.y = layer * 0.3 + Math.sin(layer) * 0.15;
      
      const scaleVariation = 1 + Math.sin(layer * 0.4) * 0.04;
      layerMesh.scale.setScalar(scaleVariation);
      
      group.add(layerMesh);
    }
    
    // Keep overall scale reasonable
    group.scale.setScalar(1.2);
    
    return group;
  }, [parameters.length, parameters.width, parameters.layers, noise3D]);

  return <primitive object={geometry} />;
};