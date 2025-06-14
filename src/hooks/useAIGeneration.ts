import { useState, useCallback } from 'react';
import { CharacterParameters } from '../types';
import { parsePromptToParameters, getRandomPrompts } from '../utils/aiPromptParser';

export const useAIGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFromPrompt = useCallback(async (prompt: string): Promise<CharacterParameters> => {
    setIsGenerating(true);
    
    try {
      // 模拟AI处理时间
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // 基于提示词关键词的AI参数生成
      return parsePromptToParameters(prompt);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateRandom = useCallback(async (): Promise<CharacterParameters> => {
    setIsGenerating(true);
    
    try {
      const randomPrompts = getRandomPrompts();
      const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
      
      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
      
      return parsePromptToParameters(randomPrompt);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateFromPrompt,
    generateRandom,
    isGenerating
  };
};