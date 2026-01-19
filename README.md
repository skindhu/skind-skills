# skind-skills

[English](./README.md) | [中文](./README.zh.md)

Claude Code skills shared by skindhu for improving daily work and learning efficiency.

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
