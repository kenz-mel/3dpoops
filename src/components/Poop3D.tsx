import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EmotionState } from '../hooks/usePoopSoul';
import { Geometry3D } from './3d/Geometry3D';
import { Materials3D } from './3d/Materials3D';
import { Animations3D } from './3d/Animations3D';
import { Decorations3D } from './3d/Decorations3D';

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
  const faceRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  // Face texture loader and positioning
  const faceTexture = React.useMemo(() => {
    if (!selectedFaceTexture) return null;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(selectedFaceTexture);
    texture.flipY = false;
    return texture;
  }, [selectedFaceTexture]);

  // Add lighting effects for high perfection
  React.useEffect(() => {
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
    <Animations3D emotionState={emotionState}>
      <Materials3D colorParameter={parameters.color} perfectionScore={perfectionScore}>
        <Geometry3D parameters={parameters} />
      </Materials3D>
      
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
      
      <Decorations3D decorations={decorations} perfectionScore={perfectionScore} />
    </Animations3D>
  );
};