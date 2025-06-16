import React, { useMemo } from 'react';
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
    const saturation = 0.7 + (perfectionScore * 0.3); // 高饱和度确保颜色鲜艳
    const lightness = 0.4 + (perfectionScore * 0.2); // 适中的亮度
    
    const color = new THREE.Color().setHSL(
      hue / 360, 
      saturation, 
      lightness
    );
    
    console.log(`Color Debug - Hue: ${hue}, Sat: ${saturation}, Light: ${lightness}, RGB: ${color.getHexString()}`);
    
    return new THREE.MeshPhongMaterial({
      color: color,
      shininess: 20 + (perfectionScore * 50),
      specular: new THREE.Color(0x222222),
      bumpScale: 0.1,
      // 确保材质不透明
      transparent: false,
      opacity: 1.0,
    });
  }, [colorParameter, perfectionScore]);

  // 传奇材质
  const legendaryMaterial = useMemo(() => {
    if (perfectionScore < 0.9) return null;
    
    const hue = (colorParameter / 100) * 360;
    const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.5);
    
    return new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100,
      specular: new THREE.Color(0x444444),
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.95,
    });
  }, [colorParameter, perfectionScore]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'primitive') {
          const geometry = child.props.object;
          if (geometry instanceof THREE.Group) {
            // 直接应用材质到所有网格
            geometry.children.forEach((mesh, index) => {
              if (mesh instanceof THREE.Mesh) {
                // 选择合适的材质
                const targetMaterial = perfectionScore > 0.9 && legendaryMaterial ? legendaryMaterial : material;
                
                // 为每个网格克隆材质以避免共享问题
                mesh.material = targetMaterial.clone();
                
                // 添加细微的层次变化
                if (mesh.material instanceof THREE.MeshPhongMaterial) {
                  const layerVariation = Math.sin(index * 0.5) * 0.1;
                  const baseColor = mesh.material.color.clone();
                  mesh.material.color.lerp(
                    new THREE.Color().setHSL(
                      (baseColor.getHSL({h:0,s:0,l:0}).h + layerVariation) % 1,
                      baseColor.getHSL({h:0,s:0,l:0}).s,
                      baseColor.getHSL({h:0,s:0,l:0}).l
                    ),
                    0.3
                  );
                }
              }
            });
          }
        }
        return child;
      })}
    </>
  );
};