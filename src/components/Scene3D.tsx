import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Poop3D } from './Poop3D';
import { EmotionState } from '../hooks/usePoopSoul';
import { FACE_TEXTURES } from '../constants/rareforms';

interface Scene3DProps {
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
}

export const Scene3D: React.FC<Scene3DProps> = ({
  parameters,
  emotionState,
  perfectionScore,
  decorations
}) => {
  return (
    <div className="w-[185px] h-[154px] rounded-lg overflow-hidden bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          clearColor: 'transparent',
          preserveDrawingBuffer: true
        }}
      >
        <Suspense fallback={null}>
          {/* 优化的光照设置，确保颜色正确显示 */}
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight 
            position={[3, 5, 3]} 
            intensity={1.0}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-2, 2, 2]} intensity={0.6} color="#ffaa44" />
          <pointLight position={[2, -1, -2]} intensity={0.4} color="#4488ff" />
          
          {/* 补充光源确保颜色可见 */}
          <directionalLight 
            position={[-1, 0, -3]} 
            intensity={0.3} 
            color="#ffffff"
          />
          
          <Poop3D
            parameters={parameters}
            emotionState={emotionState}
            perfectionScore={perfectionScore}
            decorations={decorations}
            selectedFaceTexture={FACE_TEXTURES[parameters.face]}
          />
          
          <OrbitControls
            enableZoom={true}
            minDistance={2.5}
            maxDistance={7}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.75}
            minPolarAngle={Math.PI * 0.25}
            autoRotate={emotionState === 'proud'}
            autoRotateSpeed={0.8}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};