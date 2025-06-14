import React, { useState } from 'react';

interface DescribeInputProps {
  onGenerate: (prompt: string) => void;
  onPromptChange: (prompt: string) => void;
  isGenerating: boolean;
}

export const DescribeInput: React.FC<DescribeInputProps> = ({
  onGenerate,
  onPromptChange,
  isGenerating
}) => {
  const [prompt, setPrompt] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);
    onPromptChange(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        onGenerate(prompt.trim());
      }
    }
  };

  return (
    <div className="relative w-[318px] h-[46px]">
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        alt="顶部按钮容器"
        src="/top-buttons-container.png"
      />
      
      {/* Input overlay */}
      <input
        type="text"
        value={prompt}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="描述你的完美创作..."
        className="absolute inset-0 w-full h-full px-4 py-2 bg-transparent text-white placeholder-white/70 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg"
        disabled={isGenerating}
        maxLength={100}
      />
      
      {/* Loading indicator */}
      {isGenerating && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};