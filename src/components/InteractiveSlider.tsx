import React, { useState, useEffect } from 'react';
import { Slider } from './ui/slider';

interface InteractiveSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  handleColor: string;
  paramType: string;
  isActive?: boolean;
}

export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  label,
  value,
  onChange,
  handleColor,
  paramType,
  isActive = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, value]);

  return (
    <div className={`flex items-center transition-all duration-300 ${
      isAnimating ? 'scale-105 brightness-110' : ''
    }`}>
      <img
        className="h-2.5 ml-3.5 mr-4"
        alt={`Label ${paramType}`}
        src={`/label-${paramType}.png`}
      />
      <div className="relative w-[183px] h-5">
        <div className="absolute w-[183px] h-[15px] top-[3px] left-0 bg-[#d9d9d9] border-[3px] border-solid border-[#39358e] overflow-hidden">
          {/* Animated progress fill */}
          <div 
            className="absolute h-full bg-gradient-to-r from-purple-300 to-purple-400 transition-all duration-200 ease-out"
            style={{ width: `${value}%` }}
          />
          {/* Sparkle effect for high values */}
          {value > 80 && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-50 animate-pulse" />
          )}
        </div>
        
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          step={1}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        <div
          className={`w-3 h-5 absolute border-[3px] border-solid border-[#3a368e] shadow-lg transition-all duration-200 ${
            isAnimating ? 'shadow-xl scale-110' : 'shadow-[0px_4px_4px_#00000040]'
          }`}
          style={{
            left: `${Math.max(0, Math.min(85, value * 0.85))}%`,
            top: "0",
            backgroundColor: handleColor,
            transform: isAnimating ? 'translateY(-2px)' : 'translateY(0)',
          }}
        />
      </div>
    </div>
  );
};