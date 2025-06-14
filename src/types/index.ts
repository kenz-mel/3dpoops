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

export interface RareCombination {
  condition: (p: CharacterParameters) => boolean;
  name: string;
  decoration: string;
  score: number;
}

export interface AIGenerationHook {
  generateFromPrompt: (prompt: string) => Promise<CharacterParameters>;
  generateRandom: () => Promise<CharacterParameters>;
  isGenerating: boolean;
}

export interface PoopSoulHook {
  soul: PoopSoul;
  updateParameter: (param: keyof CharacterParameters, value: number, paramType: string) => void;
  setParameters: (newParams: CharacterParameters) => void;
  generateReading: () => string;
}