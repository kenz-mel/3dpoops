import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { CharacterParameters } from '../../types';

interface Geometry3DProps {
  parameters: CharacterParameters;
}

export const Geometry3D: React.FC<Geometry3DProps> = ({ parameters }) => {
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

  return <primitive object={geometry} />;
};