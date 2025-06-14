import { CharacterParameters } from '../types';

export const parsePromptToParameters = (prompt: string): CharacterParameters => {
  const parameters: CharacterParameters = {
    color: 50,
    length: 50,
    width: 50,
    layers: 50,
    face: 2
  };

  const lowerPrompt = prompt.toLowerCase();
  
  // 颜色分析 - 支持中文关键词
  if (lowerPrompt.includes('金') || lowerPrompt.includes('黄') || lowerPrompt.includes('金色') || 
      lowerPrompt.includes('gold') || lowerPrompt.includes('yellow')) {
    parameters.color = 85 + Math.random() * 15;
  } else if (lowerPrompt.includes('棕') || lowerPrompt.includes('褐') || lowerPrompt.includes('巧克力') ||
             lowerPrompt.includes('brown') || lowerPrompt.includes('chocolate')) {
    parameters.color = 20 + Math.random() * 30;
  } else if (lowerPrompt.includes('彩虹') || lowerPrompt.includes('彩色') || lowerPrompt.includes('多彩') ||
             lowerPrompt.includes('rainbow') || lowerPrompt.includes('colorful')) {
    parameters.color = 60 + Math.random() * 40;
  } else if (lowerPrompt.includes('深') || lowerPrompt.includes('黑') || lowerPrompt.includes('暗') ||
             lowerPrompt.includes('dark') || lowerPrompt.includes('black')) {
    parameters.color = Math.random() * 20;
  }

  // 形状分析 - 长度
  if (lowerPrompt.includes('长') || lowerPrompt.includes('高') || lowerPrompt.includes('拉伸') ||
      lowerPrompt.includes('long') || lowerPrompt.includes('tall') || lowerPrompt.includes('stretched')) {
    parameters.length = 70 + Math.random() * 30;
  } else if (lowerPrompt.includes('短') || lowerPrompt.includes('小') || lowerPrompt.includes('紧凑') ||
             lowerPrompt.includes('short') || lowerPrompt.includes('compact') || lowerPrompt.includes('small')) {
    parameters.length = Math.random() * 40;
  }

  // 形状分析 - 宽度
  if (lowerPrompt.includes('宽') || lowerPrompt.includes('胖') || lowerPrompt.includes('厚') ||
      lowerPrompt.includes('wide') || lowerPrompt.includes('fat') || lowerPrompt.includes('thick')) {
    parameters.width = 70 + Math.random() * 30;
  } else if (lowerPrompt.includes('瘦') || lowerPrompt.includes('细') || lowerPrompt.includes('窄') ||
             lowerPrompt.includes('thin') || lowerPrompt.includes('skinny') || lowerPrompt.includes('narrow')) {
    parameters.width = Math.random() * 40;
  }

  // 纹理分析
  if (lowerPrompt.includes('层') || lowerPrompt.includes('旋') || lowerPrompt.includes('纹理') || 
      lowerPrompt.includes('凹凸') || lowerPrompt.includes('layer') || lowerPrompt.includes('swirl') || 
      lowerPrompt.includes('texture') || lowerPrompt.includes('bumpy')) {
    parameters.layers = 60 + Math.random() * 40;
  } else if (lowerPrompt.includes('光滑') || lowerPrompt.includes('简单') || lowerPrompt.includes('干净') ||
             lowerPrompt.includes('smooth') || lowerPrompt.includes('simple') || lowerPrompt.includes('clean')) {
    parameters.layers = Math.random() * 30;
  }

  // 表情分析
  if (lowerPrompt.includes('开心') || lowerPrompt.includes('快乐') || lowerPrompt.includes('微笑') ||
      lowerPrompt.includes('happy') || lowerPrompt.includes('joy') || lowerPrompt.includes('smile')) {
    parameters.face = 3;
  } else if (lowerPrompt.includes('兴奋') || lowerPrompt.includes('激动') || lowerPrompt.includes('惊人') ||
             lowerPrompt.includes('excited') || lowerPrompt.includes('amazing')) {
    parameters.face = 4;
  } else if (lowerPrompt.includes('伤心') || lowerPrompt.includes('失望') || lowerPrompt.includes('难过') ||
             lowerPrompt.includes('sad') || lowerPrompt.includes('disappointed')) {
    parameters.face = 1;
  } else if (lowerPrompt.includes('困倦') || lowerPrompt.includes('累') || lowerPrompt.includes('懒') ||
             lowerPrompt.includes('sleepy') || lowerPrompt.includes('tired') || lowerPrompt.includes('lazy')) {
    parameters.face = 0;
  }

  // 品质修饰符
  if (lowerPrompt.includes('完美') || lowerPrompt.includes('杰作') || lowerPrompt.includes('传奇') ||
      lowerPrompt.includes('perfect') || lowerPrompt.includes('masterpiece') || lowerPrompt.includes('legendary')) {
    // 提升所有参数趋向完美
    parameters.color = Math.max(parameters.color, 80);
    parameters.length = Math.max(parameters.length, 70);
    parameters.width = Math.max(parameters.width, 70);
    parameters.layers = Math.max(parameters.layers, 75);
  }

  // 特殊组合词汇
  if (lowerPrompt.includes('黄金比例') || lowerPrompt.includes('golden ratio')) {
    parameters.width = 62; // 黄金比例
    parameters.color = 90;
    parameters.layers = 80;
  }

  if (lowerPrompt.includes('至尊') || lowerPrompt.includes('supreme')) {
    parameters.color = 95;
    parameters.length = 90;
    parameters.width = 90;
    parameters.layers = 90;
    parameters.face = 4;
  }

  if (lowerPrompt.includes('神秘') || lowerPrompt.includes('暗影') || lowerPrompt.includes('mysterious') || lowerPrompt.includes('shadow')) {
    parameters.color = 10;
    parameters.length = 85;
    parameters.face = 4;
  }

  return parameters;
};

export const getRandomPrompts = (): string[] => [
  "金色旋转杰作，完美层次",
  "彩虹色开心创作，光滑纹理",
  "巧克力棕色兴奋形态，凹凸表面",
  "困倦深色神秘形状，简单设计",
  "宽胖快乐黄色创作，多层次",
  "高瘦优雅形态，金色亮点",
  "紧凑完美球体，彩虹旋转",
  "传奇宇宙创作，天界色彩",
  "黄金比例完美体，至尊品质",
  "神秘暗影形态，深邃力量",
  "光滑简洁设计，纯净美感",
  "层次丰富纹理，艺术杰作"
];