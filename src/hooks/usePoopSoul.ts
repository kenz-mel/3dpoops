import { useState, useCallback, useEffect, useRef } from 'react';
import { CharacterParameters, EmotionState, PoopSoul } from '../types';
import { RARE_COMBINATIONS } from '../constants/rareforms';
import { AudioManager } from '../utils/audioUtils';
import { calculatePerfection } from '../utils/perfectionCalculator';

export const usePoopSoul = () => {
  const [soul, setSoul] = useState<PoopSoul>({
    parameters: {
      color: 70,
      length: 50,
      width: 70,
      layers: 70,
      face: 2
    },
    emotionState: 'idle',
    perfectionScore: 0.3,
    isBreathing: true,
    discoveredRareForm: false,
    decorations: []
  });

  const breathingInterval = useRef<NodeJS.Timeout>();
  const emotionTimeout = useRef<NodeJS.Timeout>();
  const audioManager = useRef<AudioManager>();

  useEffect(() => {
    audioManager.current = new AudioManager();
    return () => {
      if (audioManager.current) {
        audioManager.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (soul.isBreathing) {
      breathingInterval.current = setInterval(() => {
        setSoul(prev => ({
          ...prev,
          emotionState: prev.emotionState === 'idle' ? 'sleepy' : 'idle'
        }));
      }, 3000 + Math.random() * 2000);
    }

    return () => {
      if (breathingInterval.current) {
        clearInterval(breathingInterval.current);
      }
    };
  }, [soul.isBreathing]);

  const triggerRareFormDiscovery = useCallback((combo: typeof RARE_COMBINATIONS[0]) => {
    setSoul(prev => ({
      ...prev,
      emotionState: 'proud',
      discoveredRareForm: true,
      decorations: [...prev.decorations, combo.decoration]
    }));

    if (audioManager.current) {
      audioManager.current.playRareFormSound();
    }

    setTimeout(() => {
      setSoul(prev => ({ ...prev, emotionState: 'happy' }));
    }, 2000);
  }, []);

  const updateParameter = useCallback((param: keyof CharacterParameters, value: number, paramType: string) => {
    setSoul(prev => {
      const newParams = { ...prev.parameters, [param]: value };
      const newScore = calculatePerfection(newParams);
      
      const rareCombo = RARE_COMBINATIONS.find(combo => 
        combo.condition(newParams) && !prev.decorations.includes(combo.decoration)
      );

      if (rareCombo && newScore > 0.8) {
        setTimeout(() => triggerRareFormDiscovery(rareCombo), 100);
      }

      const newEmotion: EmotionState = 
        value > prev.parameters[param] + 10 ? 'excited' :
        value < prev.parameters[param] - 10 ? 'strained' :
        'happy';

      if (emotionTimeout.current) {
        clearTimeout(emotionTimeout.current);
      }

      emotionTimeout.current = setTimeout(() => {
        setSoul(current => ({ ...current, emotionState: 'idle' }));
      }, 1000);

      return {
        ...prev,
        parameters: newParams,
        perfectionScore: newScore,
        emotionState: newEmotion
      };
    });

    if (audioManager.current) {
      audioManager.current.playToneForValue(value, paramType);
    }
  }, [triggerRareFormDiscovery]);

  const setParameters = useCallback((newParams: CharacterParameters) => {
    setSoul(prev => {
      const newScore = calculatePerfection(newParams);
      
      const rareCombo = RARE_COMBINATIONS.find(combo => 
        combo.condition(newParams) && !prev.decorations.includes(combo.decoration)
      );

      if (rareCombo && newScore > 0.8) {
        setTimeout(() => triggerRareFormDiscovery(rareCombo), 100);
      }

      return {
        ...prev,
        parameters: newParams,
        perfectionScore: newScore,
        emotionState: 'excited'
      };
    });

    setTimeout(() => {
      setSoul(current => ({ ...current, emotionState: 'idle' }));
    }, 2000);
  }, [triggerRareFormDiscovery]);

  const generateReading = useCallback(() => {
    const { perfectionScore } = soul;
    
    if (perfectionScore >= 0.9) {
      return "🌟 传奇级别！你创造了神话中的'天界精华'！这个形态散发着纯净的宇宙能量，带来无上的好运！";
    } else if (perfectionScore >= 0.8) {
      return "✨ 稀有发现！你的创作达到了'黄金和谐'境界 - 一种极其美丽和强大的形态！";
    } else if (perfectionScore >= 0.6) {
      return "🎭 令人印象深刻！这个形态展现出巨大的潜力和艺术天赋。你有天生的创作才能！";
    } else if (perfectionScore >= 0.4) {
      return "😊 迷人可爱！你的创作有着独特的个性，为观者带来欢乐。";
    } else {
      return "🌱 初学者的作品！每个大师都从这里开始。这个形态有潜力 - 继续实验吧！";
    }
  }, [soul.perfectionScore]);

  return {
    soul,
    updateParameter,
    setParameters,
    generateReading
  };
};