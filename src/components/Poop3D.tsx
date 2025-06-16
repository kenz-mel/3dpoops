import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
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

  // 调试颜色参数
  React.useEffect(() => {
    console.log('Poop3D Color Parameter:', parameters.color);
  }, [parameters.color]);

  // 面部纹理加载
  const faceTexture = React.useMemo(() => {
    if (!selectedFaceTexture) return null;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(selectedFaceTexture);
    texture.flipY = false;
    return texture;
  }, [selectedFaceTexture]);

  // 高完美度的特殊光照效果
  React.useEffect(() => {
    if (perfectionScore > 0.8) {
      const specialLight = new THREE.PointLight(0xffd700, 1.5, 10);
      specialLight.position.set(0, 2, 2);
      scene.add(specialLight);
      
      if (perfectionScore > 0.9) {
        const sparkleLight = new THREE.PointLight(0xffffff, 1.0, 6);
        sparkleLight.position.set(1.5, 1.5, 1.5);
        scene.add(sparkleLight);
        
        return () => {
          scene.remove(specialLight);
          scene.remove(sparkleLight);
        };
      }
      
      return () => {
        scene.remove(specialLight);
      };
    }
  }, [perfectionScore, scene]);

  // 面部表情动画
  useFrame((state) => {
    if (faceRef.current) {
      const time = state.clock.getElapsedTime();
      
      switch (emotionState) {
        case 'happy':
          faceRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.05);
          break;
        case 'excited':
          faceRef.current.rotation.z = Math.sin(time * 6) * 0.1;
          break;
        default:
          faceRef.current.scale.setScalar(1);
          faceRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <Animations3D emotionState={emotionState}>
      <Materials3D colorParameter={parameters.color} perfectionScore={perfectionScore}>
        <Geometry3D parameters={parameters} />
      </Materials3D>
      
      {/* 面部纹理覆盖 */}
      {faceTexture && (
        <mesh ref={faceRef} position={[0, 0.3, 0.8]}>
          <planeGeometry args={[0.8, 0.8]} />
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