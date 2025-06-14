import { RareCombination, CharacterParameters } from '../types';

export const RARE_COMBINATIONS: RareCombination[] = [
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

export const FACE_TEXTURES = [
  "/face-icon-05.png", // 困倦
  "/face-icon-04.png", // 伤心
  "/face-icon-03.png", // 平静
  "/face-icon-02.png", // 开心
  "/face-icon-01-.png", // 兴奋
];

export const FACE_ICONS = [
  { src: "/face-icon-05.png", alt: "困倦表情", emotion: "困倦" },
  { src: "/face-icon-04.png", alt: "伤心表情", emotion: "伤心" },
  { src: "/face-icon-03.png", alt: "平静表情", emotion: "平静" },
  { src: "/face-icon-02.png", alt: "开心表情", emotion: "开心" },
  { src: "/face-icon-01-.png", alt: "兴奋表情", emotion: "兴奋" },
];