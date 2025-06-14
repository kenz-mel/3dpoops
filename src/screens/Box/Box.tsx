import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { usePoopSoul } from "../../hooks/usePoopSoul";
import { useAIGeneration } from "../../hooks/useAIGeneration";
import { InteractiveSlider } from "../../components/InteractiveSlider";
import { Scene3D } from "../../components/Scene3D";
import { FaceSelector } from "../../components/FaceSelector";
import { ReadingModal } from "../../components/ReadingModal";
import { DescribeInput } from "../../components/DescribeInput";

export const Box = (): JSX.Element => {
  const { soul, updateParameter, generateReading, setParameters } = usePoopSoul();
  const { generateFromPrompt, generateRandom, isGenerating } = useAIGeneration();
  const [showReading, setShowReading] = useState(false);
  const [activeSlider, setActiveSlider] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const sliderControls = [
    {
      label: "color",
      value: soul.parameters.color,
      handleColor: "#d9d9d9",
      paramKey: "color" as const,
    },
    {
      label: "length",
      value: soul.parameters.length,
      handleColor: "#f8cb56",
      paramKey: "length" as const,
    },
    {
      label: "width",
      value: soul.parameters.width,
      handleColor: "#d07b55",
      paramKey: "width" as const,
    },
    {
      label: "layers",
      value: soul.parameters.layers,
      handleColor: "#5d56f8",
      paramKey: "layers" as const,
    },
  ];

  const handleSliderChange = (paramKey: string, value: number, paramType: string) => {
    setActiveSlider(paramKey);
    updateParameter(paramKey as keyof typeof soul.parameters, value, paramType);
    
    setTimeout(() => setActiveSlider(null), 300);
  };

  const handleAIGenerate = async (prompt: string) => {
    try {
      setCurrentPrompt(prompt);
      const newParameters = await generateFromPrompt(prompt);
      setParameters(newParameters);
    } catch (error) {
      console.error('AI生成失败:', error);
    }
  };

  const handleCreateClick = () => {
    if (currentPrompt.trim()) {
      handleAIGenerate(currentPrompt);
    }
  };

  const handleRandomClick = async () => {
    try {
      const newParameters = await generateRandom();
      setParameters(newParameters);
    } catch (error) {
      console.error('随机生成失败:', error);
    }
  };

  const handleReadShape = () => {
    setShowReading(true);
  };

  return (
    <div className="w-[390px] h-[844px] mx-auto overflow-hidden">
      <div className="relative w-[390px] h-[844px] bg-[url(/background-.png)] bg-cover bg-center">
        {/* 顶部描述输入框 */}
        <div className="absolute top-[117px] left-[37px]">
          <DescribeInput
            onGenerate={handleAIGenerate}
            onPromptChange={setCurrentPrompt}
            isGenerating={isGenerating}
          />
        </div>

        {/* 创建和随机按钮 */}
        <div className="absolute top-[183px] left-[37px] flex gap-6">
          <button 
            onClick={handleCreateClick}
            disabled={isGenerating || !currentPrompt.trim()}
            className="hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              className="w-[150px] h-[55px] object-cover"
              alt="创建按钮"
              src="/button-create.png"
            />
          </button>
          <button 
            onClick={handleRandomClick}
            disabled={isGenerating}
            className="hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              className="w-[144px] h-[48px] object-cover"
              alt="随机按钮"
              src="/button-random.png"
            />
          </button>
        </div>

        {/* 3D角色显示 */}
        <div className="absolute top-[259px] left-[102px]">
          <Scene3D
            parameters={soul.parameters}
            emotionState={soul.emotionState}
            perfectionScore={soul.perfectionScore}
            decorations={soul.decorations}
          />
        </div>

        {/* 控制面板 */}
        <Card className="absolute w-[281px] h-[219px] top-[518px] left-[55px] bg-[url(/control-panel.png)] bg-cover bg-center border-none shadow-none">
          <CardContent className="p-0 relative">
            {/* 表情选择器 */}
            <div className="absolute top-[27px] left-6">
              <FaceSelector
                selectedFace={soul.parameters.face}
                onFaceSelect={(faceIndex) => 
                  updateParameter('face', faceIndex, 'face')
                }
              />
            </div>

            {/* 滑块控制 */}
            {sliderControls.map((control, index) => (
              <div
                key={control.paramKey}
                className="absolute"
                style={{ top: `${76 + index * 34}px` }}
              >
                <InteractiveSlider
                  label={control.label}
                  value={control.value}
                  onChange={(value) => 
                    handleSliderChange(control.paramKey, value, control.label)
                  }
                  handleColor={control.handleColor}
                  paramType={control.label}
                  isActive={activeSlider === control.paramKey}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 底部读取形状按钮 */}
        <div className="absolute w-[326px] h-[60px] top-[761px] left-[32px]">
          <button 
            onClick={handleReadShape}
            className="w-full h-full hover:scale-105 transition-transform duration-200 hover:brightness-110"
          >
            <img
              className="w-full h-full object-cover"
              alt="读取形状按钮"
              src="/button-readshape.png"
            />
          </button>
        </div>

        {/* 完美度指示器 */}
        {soul.perfectionScore > 0.7 && (
          <div className="absolute top-[200px] right-[20px] text-yellow-400 text-sm font-bold animate-pulse">
            ✨ {Math.round(soul.perfectionScore * 100)}%
          </div>
        )}

        {/* 生成状态覆盖层 */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-800 font-medium">生成中...</span>
            </div>
          </div>
        )}
      </div>

      <ReadingModal
        isOpen={showReading}
        onClose={() => setShowReading(false)}
        reading={generateReading()}
        perfectionScore={soul.perfectionScore}
      />
    </div>
  );
};