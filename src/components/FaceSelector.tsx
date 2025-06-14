import React from 'react';
import { FACE_ICONS } from '../constants/rareforms';

interface FaceSelectorProps {
  selectedFace: number;
  onFaceSelect: (faceIndex: number) => void;
}

export const FaceSelector: React.FC<FaceSelectorProps> = ({
  selectedFace,
  onFaceSelect
}) => {
  return (
    <div className="w-[232px] h-[38px] flex space-x-2">
      {FACE_ICONS.map((icon, index) => (
        <button
          key={index}
          onClick={() => onFaceSelect(index)}
          className={`w-10 h-[38px] transition-all duration-200 hover:scale-110 ${
            selectedFace === index 
              ? 'ring-2 ring-yellow-400 ring-offset-2 shadow-lg scale-105' 
              : 'hover:shadow-md'
          }`}
        >
          <img
            className="w-full h-full object-cover rounded"
            alt={icon.alt}
            src={icon.src}
          />
        </button>
      ))}
    </div>
  );
};