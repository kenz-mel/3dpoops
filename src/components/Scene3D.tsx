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
        camera={{ position: [0, 0, 3.5], fov: 55 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          clearColor: 'transparent',
          preserveDrawingBuffer: true
        }}
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting setup for better color visibility */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[4, 6, 4]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color="#ffa500" />
          <pointLight position={[3, -2, -2]} intensity={0.4} color="#87ceeb" />
          
          {/* Additional lighting for better color definition */}
          <directionalLight 
            position={[-2, 0, -4]} 
            intensity={0.4} 
            color="#ffffff"
          />
          
          <Poop3D
            parameters={parameters}
            emotionState={emotionState}
            perfectionScore={perfectionScore}
            decorations={decorations}
            selectedFaceTexture={FACE_TEXTURES[parameters.face]}
          />
          
          {/* Optimized 3D controls */}
          <OrbitControls
            enableZoom={true}
            minDistance={2.5}
            maxDistance={6}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
            autoRotate={emotionState === 'proud'}
            autoRotateSpeed={1.0}
            enableDamping
            dampingFactor={0.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};