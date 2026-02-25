# skind-skills

[English](./README.md) | [中文](./README.zh.md)

Claude Code skills shared by skindhu for improving daily work and learning efficiency.

## Follow the Author

For more AI exploration content, follow the author's WeChat Official Account:

<img src="https://wechat-account-1251781786.cos.ap-guangzhou.myqcloud.com/wechat_account.jpeg" width="30%">

## Prerequisites

- Python 3.11+ environment

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
| **educational-video-creator** | Educational video production | [educational-video-creator](#educational-video-creator) |
| **research-skills** | Deep article research and analysis | [deep-article-research](#deep-article-research) |

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

### educational-video-creator

Create professional educational videos with Kurzgesagt/回形针 visual style using Remotion.

**Features:**
- 🎬 Complete video production workflow (script → storyboard → animation → audio)
- 🎨 Kurzgesagt/回形针 flat design style with SVG animations
- 📝 Narrative script writing with story arc and pacing
- 🎵 Auto TTS narration generation and timeline sync
- ✅ Automated quality assurance with style checking

**Prerequisites:**
- Node.js environment
- `remotion-best-practices` skill (install via `npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices`)

**Workflow:**

| Phase | Description |
|-------|-------------|
| 1. Requirements | Confirm topic, audience, language, duration |
| 1.5. Script | Write complete narrative with story arc |
| 2. Storyboard | Break script into visual scenes with animation specs |
| 3. Visual Design | Apply Kurzgesagt/回形针 style guide |
| 4. Animation | Implement scenes using Remotion |
| 4.5. Audio | Generate TTS narration and background music |
| 5. QA | Auto style check, screenshot review, auto-fix |

**Usage Examples:**

```bash
# Create an educational video
帮我做一个关于量子计算的教学视频

# Create an explainer video
Create an explainer video about how blockchain works

# Create a science video
制作一个讲解光合作用的科普动画
```

**Output:**

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

### deep-article-research

Deep research and verification of article arguments using Gemini Deep Research, outputting professional Chinese analysis reports.

**Features:**
- 🔗 Fetch article content via agent-browser or WebFetch
- 🧠 Extract core arguments, evidence chains, and implicit assumptions
- 🔍 Gemini Deep Research for web-based argument verification
- 📝 Professional Chinese analysis report output

**Prerequisites:**
- `GEMINI_API_KEY` environment variable
- `agent-browser` skill (optional, fallback to WebFetch)

**Usage Examples:**

```bash
# Analyze and verify an article
帮我深度分析这篇文章 https://example.com/article

# Fact-check a blog post
Verify the arguments in this article: https://example.com/post
```

**Output:**

```
tmp/article-deep-research/
└── {slug}/
    ├── article-raw.txt                        # Raw article content
    ├── argument-extraction-YYYY-MM-DD.md      # Argument extraction
    └── {slug}-Analysis-Report-YYYY-MM-DD.md   # Final analysis report
```

## Environment Configuration

```bash
# Required for SEC EDGAR API
export SEC_EDGAR_COMPANY_NAME="YourCompany"
export SEC_EDGAR_EMAIL="your@email.com"

# Required for Gemini Mode (us-stock-researcher, deep-article-research)
export GEMINI_API_KEY="your_gemini_api_key"
```

## License

MIT
