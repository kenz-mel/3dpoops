import { CharacterParameters } from '../types';
import { RARE_COMBINATIONS } from '../constants/rareforms';

export const calculatePerfection = (params: CharacterParameters): number => {
  let score = 0.2;

  // 基础和谐度计算
  const variance = Math.abs(params.color - params.width) + 
                  Math.abs(params.length - params.layers);
  if (variance < 20) score += 0.2;

  // 表情与颜色匹配度
  if (params.face === 4 && params.color > 80) score += 0.15;
  if (params.face === 0 && params.length < 30) score += 0.15;

  // 检查稀有组合
  for (const combo of RARE_COMBINATIONS) {
    if (combo.condition(params)) {
      score = Math.max(score, combo.score);
      break;
    }
  }

  return Math.min(score, 1);
};

export const generateReading = (perfectionScore: number): string => {
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
};