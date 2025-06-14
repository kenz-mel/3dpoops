import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Poop3D } from './Poop3D';
import { EmotionState } from '../hooks/usePoopSoul';

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

const faceTextures = [
  "/face-icon-05.png", // 困倦
  "/face-icon-04.png", // 伤心
  "/face-icon-03.png", // 平静
  "/face-icon-02.png", // 开心
  "/face-icon-01-.png", // 兴奋
];

export const Scene3D: React.FC<Scene3DProps> = ({
  parameters,
  emotionState,
  perfectionScore,
  decorations
}) => {
  return (
    <div className="w-[185px] h-[154px] rounded-lg overflow-hidden bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          clearColor: 'transparent',
          preserveDrawingBuffer: true
        }}
      >
        <Suspense fallback={null}>
          {/* 3D模型专用光照设置 */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 3, 2]} intensity={0.3} color="#ffa500" />
          <pointLight position={[5, -3, -2]} intensity={0.2} color="#87ceeb" />
          
          <Poop3D
            parameters={parameters}
            emotionState={emotionState}
            perfectionScore={perfectionScore}
            decorations={decorations}
            selectedFaceTexture={faceTextures[parameters.face]}
          />
          
          {/* 3D交互控制 - 仅用于观察，不影响游戏逻辑 */}
          <OrbitControls
            enableZoom={true}
            minDistance={2}
            maxDistance={5}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
            autoRotate={emotionState === 'proud'}
            autoRotateSpeed={1}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};