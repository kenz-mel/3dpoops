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
        camera={{ position: [0, 0, 4], fov: 50 }} // Adjusted camera for larger model
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          clearColor: 'transparent',
          preserveDrawingBuffer: true
        }}
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting setup for better 3D appearance */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.0}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, 3, 2]} intensity={0.4} color="#ffa500" />
          <pointLight position={[5, -3, -2]} intensity={0.3} color="#87ceeb" />
          
          {/* Rim lighting for better definition */}
          <directionalLight 
            position={[-3, 0, -5]} 
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
          
          {/* Enhanced 3D controls */}
          <OrbitControls
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
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