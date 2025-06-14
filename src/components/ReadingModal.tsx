import React from 'react';

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: string;
  perfectionScore: number;
}

export const ReadingModal: React.FC<ReadingModalProps> = ({
  isOpen,
  onClose,
  reading,
  perfectionScore
}) => {
  if (!isOpen) return null;

  const getRarityColor = () => {
    if (perfectionScore >= 0.9) return 'from-yellow-400 to-orange-500';
    if (perfectionScore >= 0.8) return 'from-purple-400 to-pink-500';
    if (perfectionScore >= 0.6) return 'from-blue-400 to-cyan-500';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className={`bg-gradient-to-br ${getRarityColor()} p-1 rounded-lg max-w-sm mx-4 animate-scaleIn`}>
        <div className="bg-white rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            ✨ 你的创作命运 ✨
          </h2>
          
          <div className="mb-4">
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < Math.floor(perfectionScore * 5)
                      ? 'bg-yellow-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              完美度: {Math.round(perfectionScore * 100)}%
            </p>
          </div>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {reading}
          </p>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            继续创作
          </button>
        </div>
      </div>
    </div>
  );
};