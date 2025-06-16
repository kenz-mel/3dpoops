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
  const geometryRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  // 调试颜色参数
  React.useEffect(() => {
    console.log('Poop3D Color Parameter Changed:', parameters.color);
  }, [parameters.color]);

  // 面部纹理加载
  const faceTexture = React.useMemo(() => {
    if (!selectedFaceTexture) return null;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(selectedFaceTexture);
    texture.flipY = false;
    return texture;
  }, [selectedFaceTexture]);

  // 直接创建带材质的几何体
  const poopGeometry = React.useMemo(() => {
    const layerCount = Math.max(2, Math.floor(parameters.layers / 20) + 2);
    const group = new THREE.Group();
    
    // 创建材质
    const hue = (parameters.color / 100) * 360;
    const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.5);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 30,
      specular: new THREE.Color(0x111111),
    });
    
    console.log('Creating geometry with color:', color.getHexString());
    
    for (let layer = 0; layer < layerCount; layer++) {
      const baseRadius = 0.5;
      const radiusTop = baseRadius + (parameters.width / 100) * 0.4 - (layer * 0.06);
      const radiusBottom = baseRadius + 0.15 + (parameters.width / 100) * 0.5 - (layer * 0.06);
      const height = (0.4 + (parameters.length / 100) * 0.6) / layerCount;
      
      const segments = 20;
      const layerGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
      
      // 创建网格并直接应用材质
      const layerMesh = new THREE.Mesh(layerGeo, material.clone());
      layerMesh.position.y = layer * height - (layerCount * height) / 2;
      layerMesh.rotation.y = layer * 0.3;
      
      group.add(layerMesh);
    }
    
    group.scale.setScalar(1.2);
    return group;
  }, [parameters.color, parameters.length, parameters.width, parameters.layers]);

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
      <primitive object={poopGeometry} ref={geometryRef} />
      
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