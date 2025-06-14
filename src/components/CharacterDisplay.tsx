import React, { useEffect, useState } from 'react';
import { EmotionState } from '../hooks/usePoopSoul';

interface CharacterDisplayProps {
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

export const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  parameters,
  emotionState,
  perfectionScore,
  decorations
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (emotionState === 'idle' && Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, [emotionState]);

  // Sparkle effect for high perfection
  useEffect(() => {
    if (perfectionScore > 0.8) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [perfectionScore]);

  const getCharacterStyle = () => {
    const baseStyle = {
      filter: `hue-rotate(${parameters.color * 3.6}deg) brightness(${0.8 + parameters.color * 0.004})`,
      transform: `
        scaleY(${0.7 + parameters.length * 0.006})
        scaleX(${0.7 + parameters.width * 0.006})
        ${emotionState === 'excited' ? 'scale(1.1)' : ''}
        ${emotionState === 'strained' ? 'scaleY(0.9) scaleX(1.1)' : ''}
        ${emotionState === 'proud' ? 'scale(1.15) rotateZ(5deg)' : ''}
        ${emotionState === 'sleepy' ? 'scaleY(0.95)' : ''}
      `,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return baseStyle;
  };

  const getEmotionClass = () => {
    switch (emotionState) {
      case 'happy': return 'animate-bounce';
      case 'excited': return 'animate-pulse';
      case 'proud': return 'animate-bounce';
      case 'strained': return 'animate-pulse';
      default: return '';
    }
  };

  return (
    <div className="relative w-[185px] h-[154px]">
      {/* Sparkle effects */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}

      {/* Aura for high perfection */}
      {perfectionScore > 0.8 && (
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200 via-transparent to-transparent opacity-30 animate-pulse rounded-full" />
      )}

      {/* Main character */}
      <div className={`relative w-full h-full ${getEmotionClass()}`}>
        <img
          className="w-full h-full object-cover"
          alt="Character"
          src="/character.png"
          style={getCharacterStyle()}
        />

        {/* Decorations */}
        {decorations.includes('crown') && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full animate-pulse" />
          </div>
        )}

        {decorations.includes('halo') && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-3 border-2 border-yellow-300 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        )}

        {/* Breathing indicator */}
        {emotionState === 'idle' && (
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}

        {/* Blinking overlay */}
        {isBlinking && (
          <div className="absolute inset-0 bg-black opacity-20 rounded-full transition-opacity duration-150" />
        )}
      </div>

      {/* Perfection score indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < Math.floor(perfectionScore * 5)
                  ? 'bg-yellow-400 shadow-lg'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};