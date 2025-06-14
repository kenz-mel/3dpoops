import React from 'react';

interface FaceSelectorProps {
  selectedFace: number;
  onFaceSelect: (faceIndex: number) => void;
}

export const FaceSelector: React.FC<FaceSelectorProps> = ({
  selectedFace,
  onFaceSelect
}) => {
  const faceIcons = [
    { src: "/face-icon-05.png", alt: "困倦表情", emotion: "困倦" },
    { src: "/face-icon-04.png", alt: "伤心表情", emotion: "伤心" },
    { src: "/face-icon-03.png", alt: "平静表情", emotion: "平静" },
    { src: "/face-icon-02.png", alt: "开心表情", emotion: "开心" },
    { src: "/face-icon-01-.png", alt: "兴奋表情", emotion: "兴奋" },
  ];

  return (
    <div className="w-[232px] h-[38px] flex space-x-2">
      {faceIcons.map((icon, index) => (
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