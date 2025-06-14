import { useState, useCallback, useEffect, useRef } from 'react';

export interface CharacterParameters {
  color: number;
  length: number;
  width: number;
  layers: number;
  face: number;
}

export type EmotionState = 'idle' | 'happy' | 'strained' | 'proud' | 'excited' | 'sleepy';

export interface PoopSoul {
  parameters: CharacterParameters;
  emotionState: EmotionState;
  perfectionScore: number;
  isBreathing: boolean;
  discoveredRareForm: boolean;
  decorations: string[];
}

const RARE_COMBINATIONS = [
  {
    condition: (p: CharacterParameters) => 
      p.color > 80 && p.layers > 70 && Math.abs(p.width - 61.8) < 10,
    name: "黄金比例完美体",
    decoration: "crown",
    score: 0.9
  },
  {
    condition: (p: CharacterParameters) => 
      p.color > 90 && p.length > 85 && p.width > 85 && p.layers > 85,
    name: "至尊卓越形态",
    decoration: "halo",
    score: 0.95
  },
  {
    condition: (p: CharacterParameters) => 
      p.face === 4 && p.color < 20 && p.length > 80,
    name: "神秘暗影形态",
    decoration: "sparkles",
    score: 0.85
  }
];

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
  const audioContext = useRef<AudioContext>();

  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
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

  const playToneForValue = useCallback((value: number, paramType: string) => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    let baseFreq = 200;
    switch (paramType) {
      case 'color': baseFreq = 300; break;
      case 'length': baseFreq = 250; break;
      case 'width': baseFreq = 200; break;
      case 'layers': baseFreq = 350; break;
    }

    oscillator.frequency.setValueAtTime(baseFreq + (value * 3), audioContext.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.3);
  }, []);

  const calculatePerfection = useCallback((params: CharacterParameters) => {
    let score = 0.2;

    const variance = Math.abs(params.color - params.width) + 
                    Math.abs(params.length - params.layers);
    if (variance < 20) score += 0.2;

    if (params.face === 4 && params.color > 80) score += 0.15;
    if (params.face === 0 && params.length < 30) score += 0.15;

    for (const combo of RARE_COMBINATIONS) {
      if (combo.condition(params)) {
        score = Math.max(score, combo.score);
        break;
      }
    }

    return Math.min(score, 1);
  }, []);

  const triggerRareFormDiscovery = useCallback((combo: typeof RARE_COMBINATIONS[0]) => {
    setSoul(prev => ({
      ...prev,
      emotionState: 'proud',
      discoveredRareForm: true,
      decorations: [...prev.decorations, combo.decoration]
    }));

    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContext.current.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.current.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(784, audioContext.current.currentTime + 0.4);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.8);
      
      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + 0.8);
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

    playToneForValue(value, paramType);
  }, [calculatePerfection, playToneForValue, triggerRareFormDiscovery]);

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
  }, [calculatePerfection, triggerRareFormDiscovery]);

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