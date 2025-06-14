# 3D便便创作应用 - 功能拆分方案

## 项目概述
这是一个有趣的3D便便角色创作应用，用户可以通过AI描述或手动调节参数来创建独特的3D角色，并获得"命运解读"。

## 团队分工方案

### 👤 开发者A - 核心状态管理与逻辑
**负责文件:**
- `src/hooks/usePoopSoul.ts` - 角色状态管理
- `src/lib/utils.ts` - 工具函数
- `src/index.tsx` - 应用入口

**主要职责:**
- 角色参数状态管理
- 情感状态控制
- 完美度计算算法
- 稀有形态检测逻辑
- 音频反馈系统
- 呼吸动画控制

**技术要点:**
- React Hooks状态管理
- 复杂算法实现
- Web Audio API
- 定时器管理

---

### 👤 开发者B - 3D渲染与动画
**负责文件:**
- `src/components/Poop3D.tsx` - 3D模型组件
- `src/components/Scene3D.tsx` - 3D场景管理

**主要职责:**
- Three.js 3D模型创建
- 程序化几何体生成
- 材质和光照系统
- 3D动画效果
- 相机控制
- 装饰物渲染

**技术要点:**
- Three.js / React Three Fiber
- 3D几何体操作
- 噪声算法应用
- 动画系统
- 光照渲染

---

### 👤 开发者C - AI生成与智能交互
**负责文件:**
- `src/hooks/useAIGeneration.ts` - AI生成逻辑
- `src/components/DescribeInput.tsx` - 描述输入组件

**主要职责:**
- AI提示词解析
- 参数智能生成
- 关键词识别算法
- 随机生成系统
- 输入验证和处理
- 生成状态管理

**技术要点:**
- 自然语言处理
- 算法设计
- 异步处理
- 状态管理

---

### 👤 开发者D - 用户界面与交互控件
**负责文件:**
- `src/components/InteractiveSlider.tsx` - 交互滑块
- `src/components/FaceSelector.tsx` - 表情选择器
- `src/components/ui/slider.tsx` - 基础滑块组件
- `src/components/ui/card.tsx` - 卡片组件

**主要职责:**
- 自定义滑块组件
- 表情选择界面
- 交互动画效果
- 参数可视化
- 用户体验优化
- 响应式设计

**技术要点:**
- React组件设计
- CSS动画
- 用户交互处理
- 组件复用

---

### 👤 开发者E - 主界面与模态框
**负责文件:**
- `src/screens/Box/Box.tsx` - 主界面组件
- `src/screens/Box/index.ts` - 导出文件
- `src/components/ReadingModal.tsx` - 命运解读弹窗
- `src/components/CharacterDisplay.tsx` - 角色展示组件

**主要职责:**
- 主界面布局
- 组件集成
- 模态框设计
- 命运解读系统
- 整体用户体验
- 状态协调

**技术要点:**
- 复杂布局管理
- 组件集成
- 模态框实现
- 状态传递

## 共享资源

### 配置文件 (所有人共同维护)
- `package.json` - 依赖管理
- `vite.config.ts` - 构建配置
- `tailwind.config.js` - 样式配置
- `tsconfig.*.json` - TypeScript配置

### 静态资源 (设计师提供)
- `public/` 目录下的所有图片资源
- `tailwind.css` - 全局样式

## 开发协作流程

### 1. 初始设置
每个开发者克隆项目后：
```bash
npm install
npm run dev
```

### 2. 分支管理
- `main` - 主分支
- `feature/core-logic` - 开发者A
- `feature/3d-rendering` - 开发者B  
- `feature/ai-generation` - 开发者C
- `feature/ui-controls` - 开发者D
- `feature/main-interface` - 开发者E

### 3. 接口约定

#### 类型定义 (开发者A负责维护)
```typescript
export interface CharacterParameters {
  color: number;
  length: number;
  width: number;
  layers: number;
  face: number;
}

export type EmotionState = 'idle' | 'happy' | 'strained' | 'proud' | 'excited' | 'sleepy';
```

#### 主要接口
- `usePoopSoul()` - 核心状态Hook (A提供)
- `useAIGeneration()` - AI生成Hook (C提供)
- 3D组件Props接口 (B定义)
- UI组件Props接口 (D定义)

### 4. 测试策略
每个开发者负责：
- 单元测试自己的组件
- 集成测试相关功能
- 性能测试关键部分

### 5. 代码审查
- 每个PR需要至少2人审查
- 重点关注接口兼容性
- 性能和用户体验

## 技术栈
- **前端框架**: React 18 + TypeScript
- **3D渲染**: Three.js + React Three Fiber
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **状态管理**: React Hooks
- **音频**: Web Audio API

## 预估工期
- **第1周**: 各模块独立开发
- **第2周**: 接口联调和集成
- **第3周**: 测试优化和部署

## 注意事项
1. 保持接口稳定，变更需要通知相关开发者
2. 遵循代码规范和命名约定
3. 及时同步进度和问题
4. 注意性能优化，特别是3D渲染部分
5. 保持用户体验的一致性