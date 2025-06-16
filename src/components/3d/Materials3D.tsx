import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface Materials3DProps {
  colorParameter: number;
  perfectionScore: number;
  children: React.ReactNode;
}

export const Materials3D: React.FC<Materials3DProps> = ({ 
  colorParameter, 
  perfectionScore, 
  children 
}) => {
  // 创建动态材质，确保颜色变化明显
  const material = useMemo(() => {
    // 将颜色参数映射到完整的HSL色谱
    const hue = (colorParameter / 100) * 360;
    const saturation = 0.8; // 固定高饱和度
    const lightness = 0.5; // 固定中等亮度
    
    const color = new THREE.Color().setHSL(
      hue / 360, 
      saturation, 
      lightness
    );
    
    console.log(`Material Debug - Color Param: ${colorParameter}, Hue: ${hue}, Final Color: #${color.getHexString()}`);
    
    return new THREE.MeshPhongMaterial({
      color: color,
      shininess: 30,
      specular: new THREE.Color(0x111111),
      // 确保材质不透明且可见
      transparent: false,
      opacity: 1.0,
      side: THREE.FrontSide,
    });
  }, [colorParameter, perfectionScore]);

  // 应用材质到几何体
  useEffect(() => {
    const applyMaterialToGeometry = (object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        // 直接设置材质
        object.material = material.clone();
        console.log('Applied material to mesh:', object.material);
      }
      
      // 递归处理子对象
      object.children.forEach(child => {
        applyMaterialToGeometry(child);
      });
    };

    // 查找并应用材质到所有几何体
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'primitive') {
        const geometry = child.props.object;
        if (geometry instanceof THREE.Group) {
          applyMaterialToGeometry(geometry);
        }
      }
    });
  }, [material, children]);

  return <>{children}</>;
};