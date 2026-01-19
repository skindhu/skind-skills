# skind-skills

[English](#english) | [中文](#中文)

---

<a name="english"></a>

Claude Code skills shared by skindhu for improving investment research efficiency.

## Prerequisites

- Python 3.11+ environment
- Claude Code installed

## Installation

### Quick Install (Recommended)

```bash
npx add-skill skindhu/skind-skills
```

### Register Marketplace

In Claude Code, run:

```bash
/plugin marketplace add skindhu/skind-skills
```

### Install Skills

**Option 1: Browse and Install**

1. Select **Browse and install plugins**
2. Select **skind-skills**
3. Choose the plugins you want to install
4. Select **Install now**

**Option 2: Direct Install**

```bash
# Install investment skills plugin
/plugin install investment-skills@skind-skills
```

**Option 3: Tell the Agent**

Simply tell Claude Code:

> Please help me install skills from github.com/skindhu/skind-skills

### Available Plugins

| Plugin | Description | Included Skills |
|--------|-------------|-----------------|
| **investment-skills** | Investment research and analysis | [us-stock-researcher](#us-stock-researcher) |

## Update Skills

To update skills to the latest version:

1. In Claude Code, run `/plugin`
2. Switch to **Marketplaces** tab (use arrow keys or Tab)
3. Select **skind-skills**
4. Select **Update marketplace**

You can also select **Enable auto-update** for automatic updates on startup.

## Available Skills

### us-stock-researcher

Institutional-grade deep analysis of US stock SEC filings, outputting professional investment research reports.

**Features:**
- 📊 Automatic SEC filing download (10-K, 10-Q, 20-F, 6-K)
- 🧠 Dynamic industry-specific analysis framework generation
- 🔍 Two research modes: Gemini Deep Research or Claude Native 7-Phase
- 📈 Graph of Thoughts (GoT) multi-branch exploration
- 📝 Professional markdown report output

**Research Modes:**

| Mode | When to Use | Requirements |
|------|-------------|--------------|
| **Gemini Mode** | Default when API key configured | `GEMINI_API_KEY` environment variable |
| **Claude Native Mode** | When no Gemini API or user requests | WebSearch tool access |

**Usage Examples:**

```bash
# Analyze latest annual report
Analyze AAPL's latest 10-K annual report

# Deep research a specific company
Deep research MSFT's 10-K filing

# Financial sector analysis (auto-selects Financial module)
Analyze JPM's latest annual report

# Pharma sector analysis (auto-selects Pharma module)
Research PFE's financial report
```

**Output:**

```
<project_root>/investment-research/{TICKER}/
├── tmp/
│   ├── sec_filings/cleaned.txt          # Cleaned SEC filing
│   ├── analysis-framework-YYYY-MM-DD.md # Dynamic analysis framework
│   ├── phase1-YYYY-MM-DD.md             # Phase 1 filing analysis
│   └── phase2-YYYY-MM-DD.md             # Phase 2 web research
└── {TICKER}-Investment-Report-YYYY-MM-DD.md  # Final report
```

## Environment Configuration

```bash
# Required for SEC EDGAR API
export SEC_EDGAR_COMPANY_NAME="YourCompany"
export SEC_EDGAR_EMAIL="your@email.com"

# Optional - only for Gemini Mode
export GEMINI_API_KEY="your_gemini_api_key"
```

## License

MIT

---

<a name="中文"></a>

# skind-skills

skindhu 分享的 Claude Code 技能集，提升投资研究效率。

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
| **investment-skills** | 投资研究与分析 | [us-stock-researcher](#us-stock-researcher-1) |

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
