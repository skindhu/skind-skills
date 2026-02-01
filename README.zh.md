# skind-skills

[English](./README.md) | [中文](./README.zh.md)

skindhu 分享的 Claude Code 技能集，提升日常工作和学习效率。

## 前置要求

- Python 3.11+ 环境
- 已安装 Claude Code

## 安装

### 快速安装（推荐）

```bash
npx add-skill skindhu/skind-skills
```

### 注册插件市场

在 Claude Code 中运行：

```bash
/plugin marketplace add skindhu/skind-skills
```

### 安装技能

**方式一：通过浏览界面**

1. 选择 **Browse and install plugins**
2. 选择 **skind-skills**
3. 选择要安装的插件
4. 选择 **Install now**

**方式二：直接安装**

```bash
# 安装投资技能插件
/plugin install investment-skills@skind-skills
```

**方式三：告诉 Agent**

直接告诉 Claude Code：

> 请帮我安装 github.com/skindhu/skind-skills 中的 Skills

### 可用插件

| 插件 | 说明 | 包含技能 |
|------|------|----------|
| **investment-skills** | 投资研究与分析 | [us-stock-researcher](#us-stock-researcher) |
| **educational-video-creator** | 教育视频制作 | [educational-video-creator](#educational-video-creator) |

## 更新技能

更新技能到最新版本：

1. 在 Claude Code 中运行 `/plugin`
2. 切换到 **Marketplaces** 标签页（使用方向键或 Tab）
3. 选择 **skind-skills**
4. 选择 **Update marketplace**

也可以选择 **Enable auto-update** 启用自动更新，每次启动时自动获取最新版本。

## 可用技能

### us-stock-researcher

机构级美股 SEC 财报深度分析，输出专业投资研究报告。

**功能特点：**
- 📊 自动下载 SEC 财报（10-K、10-Q、20-F、6-K）
- 🧠 动态生成行业专属分析框架
- 🔍 双研究模式：Gemini 深度研究 或 Claude 原生 7 阶段研究
- 📈 Graph of Thoughts (GoT) 多分支探索
- 📝 专业 Markdown 报告输出

**研究模式：**

| 模式 | 使用场景 | 要求 |
|------|----------|------|
| **Gemini 模式** | 配置了 API Key 时默认使用 | `GEMINI_API_KEY` 环境变量 |
| **Claude 原生模式** | 无 Gemini API 或用户指定时 | WebSearch 工具访问权限 |

**使用示例：**

```bash
# 分析最新年报
分析苹果公司最新的 10-K 年报

# 深度研究某公司
深度研究微软的 10-K 财报

# 金融行业分析（自动选择金融模块）
分析摩根大通的最新年报

# 医药行业分析（自动选择医药模块）
研究辉瑞的财务报告
```

**输出目录：**

```
<project_root>/investment-research/{TICKER}/
├── tmp/
│   ├── sec_filings/cleaned.txt          # 清洗后的 SEC 财报
│   ├── analysis-framework-YYYY-MM-DD.md # 动态分析框架
│   ├── phase1-YYYY-MM-DD.md             # 第一阶段财报分析
│   └── phase2-YYYY-MM-DD.md             # 第二阶段网络研究
└── {TICKER}-Investment-Report-YYYY-MM-DD.md  # 最终报告
```

**7 阶段深度研究流程（Claude 原生模式）：**

| 阶段 | 名称 | 说明 |
|------|------|------|
| 1 | 问题界定 | 定义分析目标，下载财报 |
| 2 | 检索规划 | 识别行业，创建研究计划 |
| 3 | 迭代查询 | GoT 分支：财务、竞争、行业、管理、风险 |
| 4 | 来源三角验证 | 交叉验证研究发现 |
| 5 | 知识综合 | 按框架结构化报告 |
| 6 | 质量保证 | 验证链检查 |
| 7 | 输出打包 | 格式化并保存 |

### educational-video-creator

使用 Remotion 创建 Kurzgesagt/回形针风格的专业教育视频。

**功能特点：**
- 🎬 完整视频制作流程（脚本 → 分镜 → 动画 → 音频）
- 🎨 Kurzgesagt/回形针扁平设计风格，SVG 动画
- 📝 叙事脚本撰写，包含故事弧线和节奏控制
- 🎵 自动 TTS 旁白生成与时间线同步
- ✅ 自动化质量检查与样式扫描

**前置要求：**
- Node.js 环境
- `remotion-best-practices` 技能（通过 `npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices` 安装）

**制作流程：**

| 阶段 | 说明 |
|------|------|
| 1. 需求收集 | 确认主题、受众、语言、时长 |
| 1.5. 脚本撰写 | 编写完整叙事脚本与故事弧线 |
| 2. 分镜设计 | 将脚本拆分为视觉场景与动画规格 |
| 3. 视觉设计 | 应用 Kurzgesagt/回形针风格指南 |
| 4. 动画制作 | 使用 Remotion 实现场景 |
| 4.5. 音频生成 | 生成 TTS 旁白和背景音乐 |
| 5. 质量保证 | 自动样式检查、截图审查、自动修复 |

**使用示例：**

```bash
# 制作教学视频
帮我做一个关于量子计算的教学视频

# 制作科普动画
制作一个讲解光合作用的科普动画

# Create an explainer video
Create an explainer video about how blockchain works
```

**输出目录：**

```
your-workspace/
└── remotion_video/
    ├── src/
    │   ├── Root.tsx
    │   └── YourVideo/
    │       ├── index.tsx
    │       ├── scenes/
    │       └── components/
    ├── public/
    └── package.json
```

## 环境配置

```bash
# SEC EDGAR API 必需
export SEC_EDGAR_COMPANY_NAME="你的公司名"
export SEC_EDGAR_EMAIL="your@email.com"

# 可选 - 仅 Gemini 模式需要
export GEMINI_API_KEY="your_gemini_api_key"
```

## 依赖安装

```bash
pip3.11 install --user -r skills/us-stock-researcher/scripts/requirements.txt
```

## 许可证

MIT
