import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { CharacterParameters } from '../../types';

interface Geometry3DProps {
  parameters: CharacterParameters;
}

export const Geometry3D: React.FC<Geometry3DProps> = ({ parameters }) => {
  const noise3D = useMemo(() => createNoise3D(), []);
  
  // Create more realistic poop-shaped geometry with better proportions
  const geometry = useMemo(() => {
    const layerCount = Math.max(2, Math.floor(parameters.layers / 20) + 2);
    const group = new THREE.Group();
    
    for (let layer = 0; layer < layerCount; layer++) {
      // Better size scaling - larger base size
      const baseRadius = 0.8; // Increased from 0.3-0.4
      const radiusTop = baseRadius + (parameters.width / 100) * 0.6 - (layer * 0.08);
      const radiusBottom = baseRadius + 0.2 + (parameters.width / 100) * 0.7 - (layer * 0.08);
      const height = (0.5 + (parameters.length / 100) * 0.8) / layerCount; // Increased height
      
      const segments = 20; // More segments for smoother appearance
      const layerGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
      
      // Apply organic deformation with better swirl effect
      const positions = layerGeo.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        
        // Enhanced swirl effect
        const angle = Math.atan2(vertex.z, vertex.x);
        const radius = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const swirlAmount = (parameters.layers / 100) * 0.8 + 0.2; // More pronounced swirl
        const heightFactor = (vertex.y + height/2) / height; // Normalize height
        const newAngle = angle + heightFactor * swirlAmount * Math.PI;
        
        vertex.x = Math.cos(newAngle) * radius;
        vertex.z = Math.sin(newAngle) * radius;
        
        // Enhanced organic bumps with multiple noise layers
        const noiseValue1 = noise3D(vertex.x * 2, vertex.y * 2 + layer, vertex.z * 2) * 0.15;
        const noiseValue2 = noise3D(vertex.x * 5, vertex.y * 5 + layer * 2, vertex.z * 5) * 0.08;
        const combinedNoise = noiseValue1 + noiseValue2;
        
        const distanceFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const bumpFactor = 1 + combinedNoise * (parameters.layers / 100 + 0.3);
        
        vertex.x *= bumpFactor;
        vertex.z *= bumpFactor;
        
        // Add slight vertical variation for more organic look
        vertex.y += combinedNoise * 0.1;
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      layerGeo.attributes.position.needsUpdate = true;
      layerGeo.computeVertexNormals();
      
      const layerMesh = new THREE.Mesh(layerGeo);
      layerMesh.position.y = layer * height - (layerCount * height) / 2;
      
      // More varied rotation for organic appearance
      layerMesh.rotation.y = layer * 0.4 + Math.sin(layer) * 0.2;
      
      // Slight scale variation per layer
      const scaleVariation = 1 + Math.sin(layer * 0.5) * 0.05;
      layerMesh.scale.setScalar(scaleVariation);
      
      group.add(layerMesh);
    }
    
    // Scale the entire group to be larger
    group.scale.setScalar(1.5); // Increased overall size
    
    return group;
  }, [parameters.length, parameters.width, parameters.layers, noise3D]);

  return <primitive object={geometry} />;
};