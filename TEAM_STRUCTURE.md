# 团队协作文件结构

## 📁 项目文件分工明细

### 👤 开发者A - 核心状态管理与逻辑
**负责文件:**
```
src/
├── hooks/
│   └── usePoopSoul.ts           # 核心状态管理Hook
├── utils/
│   ├── audioUtils.ts            # 音频管理工具
│   └── perfectionCalculator.ts  # 完美度计算算法
├── types/
│   └── index.ts                 # 全局类型定义
└── index.tsx                    # 应用入口
```

**主要职责:**
- 角色参数状态管理
- 情感状态控制逻辑
- 完美度计算算法
- 稀有形态检测逻辑
- 音频反馈系统
- 呼吸动画控制

---

### 👤 开发者B - 3D渲染与动画
**负责文件:**
```
src/
├── components/
│   ├── Poop3D.tsx              # 主3D组件
│   ├── Scene3D.tsx             # 3D场景管理
│   └── 3d/
│       ├── Geometry3D.tsx      # 几何体生成
│       ├── Materials3D.tsx     # 材质系统
│       ├── Animations3D.tsx    # 动画控制
│       └── Decorations3D.tsx   # 装饰物渲染
```

**主要职责:**
- Three.js 3D模型创建
- 程序化几何体生成
- 材质和光照系统
- 3D动画效果
- 相机控制
- 装饰物渲染

---

### 👤 开发者C - AI生成与智能交互
**负责文件:**
```
src/
├── hooks/
│   └── useAIGeneration.ts      # AI生成逻辑Hook
├── utils/
│   └── aiPromptParser.ts       # AI提示词解析
└── components/
    └── DescribeInput.tsx       # 描述输入组件
```

**主要职责:**
- AI提示词解析算法
- 参数智能生成逻辑
- 关键词识别系统
- 随机生成算法
- 输入验证和处理
- 生成状态管理

---

### 👤 开发者D - 用户界面与交互控件
**负责文件:**
```
src/
├── components/
│   ├── FaceSelector.tsx        # 表情选择器
│   ├── InteractiveSlider.tsx   # 交互滑块(兼容层)
│   └── ui/
│       ├── InteractiveSlider.tsx # 实际滑块组件
│       ├── slider.tsx          # 基础滑块
│       └── card.tsx            # 卡片组件
```

**主要职责:**
- 自定义滑块组件开发
- 表情选择界面设计
- 交互动画效果实现
- 参数可视化组件
- 用户体验优化
- 响应式设计

---

### 👤 开发者E - 主界面与模态框
**负责文件:**
```
src/
├── screens/
│   └── Box/
│       ├── Box.tsx             # 主界面组件
│       └── index.ts            # 导出文件
├── components/
│   ├── ReadingModal.tsx        # 命运解读弹窗
│   └── CharacterDisplay.tsx    # 角色展示组件
└── constants/
    └── rareforms.ts            # 稀有形态常量
```

**主要职责:**
- 主界面布局设计
- 组件集成协调
- 模态框系统
- 命运解读功能
- 整体用户体验
- 状态协调管理

## 🔗 共享依赖关系

### 类型系统 (开发者A维护)
- `src/types/index.ts` - 所有开发者都需要导入的核心类型

### 常量配置 (开发者E维护)
- `src/constants/rareforms.ts` - 稀有形态配置，3D和UI都会使用

### 工具函数
- `src/lib/utils.ts` - 通用工具函数
- `src/utils/` - 各模块专用工具函数

## 📋 开发协作规范

### 1. 导入规范
```typescript
// 类型导入
import { CharacterParameters, EmotionState } from '../types';

// 常量导入
import { RARE_COMBINATIONS, FACE_TEXTURES } from '../constants/rareforms';

// Hook导入
import { usePoopSoul } from '../hooks/usePoopSoul';
import { useAIGeneration } from '../hooks/useAIGeneration';
```

### 2. 接口约定
- 所有组件Props必须定义TypeScript接口
- Hook返回值必须有明确的类型定义
- 工具函数必须有完整的类型注解

### 3. 文件命名规范
- 组件文件：PascalCase (如 `Poop3D.tsx`)
- Hook文件：camelCase with use前缀 (如 `usePoopSoul.ts`)
- 工具文件：camelCase (如 `audioUtils.ts`)
- 常量文件：camelCase (如 `rareforms.ts`)

### 4. 代码审查要点
- 接口兼容性检查
- 性能影响评估
- 类型安全验证
- 组件复用性

### 5. 测试策略
每个开发者负责：
- 单元测试自己的组件/函数
- 集成测试相关功能
- 性能测试关键部分

## 🚀 开发流程

1. **初始化**: 每个开发者克隆项目后运行 `npm install`
2. **分支管理**: 按功能模块创建分支
3. **开发**: 在各自负责的文件中开发
4. **集成**: 定期合并到主分支进行集成测试
5. **部署**: 统一构建和部署

## ⚠️ 注意事项

1. **不要修改其他开发者负责的文件**，除非经过协商
2. **类型定义变更**需要通知所有相关开发者
3. **公共常量修改**需要团队确认
4. **保持接口稳定性**，避免破坏性变更
5. **及时同步进度**，避免冲突

这个文件结构确保了：
- ✅ 清晰的职责分工
- ✅ 最小化文件冲突
- ✅ 良好的代码组织
- ✅ 便于并行开发
- ✅ 易于维护和扩展