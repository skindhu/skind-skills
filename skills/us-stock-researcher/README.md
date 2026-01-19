# US Stock Researcher - Technical Documentation

This document contains technical implementation details, environment configuration, and installation guide for the US Stock Research Assistant.

## Research Modes

This skill supports **two research modes**:

| Mode | Description | Requirements |
|------|-------------|--------------|
| **Gemini Mode** | Uses Gemini Deep Research Agent for filing analysis and web search | GEMINI_API_KEY |
| **Claude Native Mode** | Uses Claude with 7-Phase Deep Research + Graph of Thoughts | WebSearch tool only |

### When to Use Each Mode

- **Gemini Mode**: Default when GEMINI_API_KEY is configured. Recommended for production use.
- **Claude Native Mode**: Use when no Gemini API key is available, or when you prefer Claude's native analysis with GoT multi-branch exploration.

---

## Requirements

### Environment Variables

```bash
# Required for SEC EDGAR API
export SEC_EDGAR_COMPANY_NAME="YourCompany"
export SEC_EDGAR_EMAIL="your@email.com"

# Optional - only for Gemini Mode
export GEMINI_API_KEY="your_gemini_api_key"
```

### Install Dependencies

```bash
pip3.11 install --user -r scripts/requirements.txt
```

**Note**: Python 3.11+ required. Gemini dependencies only needed if using Gemini Mode.

---

## Script Parameter Details

### download_sec_filings.py

```bash
python3.11 scripts/download_sec_filings.py --help
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--ticker` | Stock ticker (required) | - |
| `--type` | Filing type: 10-K, 10-Q, 8-K, DEF 14A, 20-F, 6-K | 10-K |
| `--limit` | Number of periods to download | 1 |
| `--output` | Output directory | `<project_root>/investment-research/{TICKER}/tmp/sec_filings` |
| `--no-clean` | Don't auto-clean | False |

### gemini_deep_research.py

```bash
python3.11 scripts/gemini_deep_research.py --help
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--input` | SEC filing file path (required) | - |
| `--prompt` | Analysis framework file path (required) | - |
| `--output-dir` | Output directory (required) | - |
| `--ticker` | Company ticker (required) | - |
| `--company` | Company name | Uses ticker |
| `--phase` | Execution phase: all, local, web | all |
| `--phase1-output` | Phase 1 output path (only needed when phase=web) | - |
| `--poll-interval` | Polling interval (seconds) | 30 |
| `--max-wait` | Maximum wait time (seconds) | 1800 |

#### Smart File Input Mode

The script automatically selects optimal processing method based on file token count:

- **Small files** (≤ 80,000 tokens / ~320KB): Pass directly via prompt, skip upload step, saves 15-30 seconds
- **Large files** (> 80,000 tokens): Upload to File Search Store, supports extra-long file analysis

Token estimation method: character count / 4 (simple estimation, no extra dependencies)

### clean_sec_filing.py

```bash
python3.11 scripts/clean_sec_filing.py --help
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--input` | Input file path (required) | - |
| `--output` | Output file path | cleaned.txt in same directory |

---

## Technical Notes

### SEC File Cleaning

SEC EDGAR's `full-submission.txt` is in SGML format, containing:
- HTML tags (`<div>`, `<font>`, `<table>`, etc.)
- uuencode-encoded binary data (images, PDFs, etc.)
- XBRL data files

`clean_sec_filing.py` cleaning functions:
1. Remove uuencode-encoded binary data blocks
2. Extract plain text from HTML (preserve table structure)
3. Decode HTML entities (`&amp;` → `&`)
4. Extract hidden text (e.g., white small font data in slides)
5. Clean excess whitespace, optimize readability

Typical compression ratio: 90-99% (depends on image count)

### Gemini Files API Usage

Use Gemini Files API to upload complete filing, avoiding truncation:

```python
# Upload file
file = client.files.upload(path="10-K.txt")

# Reference in Deep Research
interaction = client.interactions.create(
    input=[
        {"type": "text", "text": analysis_prompt},
        {"type": "file", "uri": file.uri}
    ],
    agent="deep-research-pro-preview-12-2025",
    background=True
)
```

### Two-Phase Prompt Design (Gemini Mode)

**Phase 1 Prompt (Local Filing)**:
- Conduct comprehensive deep analysis based on uploaded SEC filing
- Strictly output according to dynamically generated industry framework
- Extract 3-5 key questions requiring web verification at report end

**Phase 2 Prompt (Web Search)**:
- Competitor latest updates comparison
- Industry trend verification
- Management credibility cross-verification
- Risk event search

---

## Claude Native Mode Details

### 7-Phase Deep Research Process

Based on [Claude-Code-Deep-Research](https://github.com/AnkitClassicVision/Claude-Code-Deep-Research):

| Phase | Name | Description |
|-------|------|-------------|
| 1 | Question Scoping | Define analysis goals and download filing |
| 2 | Retrieval Planning | Identify industry, create research plan |
| 3 | Iterative Querying | Execute GoT branches (filing + web) |
| 4 | Source Triangulation | Cross-validate findings |
| 5 | Knowledge Synthesis | Aggregate into structured report |
| 6 | Quality Assurance | Chain-of-Verification |
| 7 | Output Packaging | Format and save report |

### Graph of Thoughts (GoT) Branches

| Branch | Focus | Method |
|--------|-------|--------|
| A | Financial Data | Read filing directly |
| B | Competitive Landscape | WebSearch |
| C | Industry Trends | WebSearch |
| D | Management Verification | WebSearch |
| E | Risk Assessment | WebSearch |

### Reference Documents

- **Protocol**: `prompts/claude-deep-research-protocol.md` - Complete execution guide
- **Templates**: `prompts/got-research-templates.md` - Branch analysis templates

### Key Differences from Gemini Mode

| Aspect | Gemini Mode | Claude Native Mode |
|--------|-------------|-------------------|
| API Requirement | GEMINI_API_KEY | None |
| Execution | Async polling (30s intervals) | Synchronous |
| Web Search | Gemini built-in | WebSearch tool |
| Research Depth | Single agent | GoT multi-branch |
| Context | Split (Gemini + Claude) | Unified (Claude only) |

---

## Output Directory Structure Details

```
<project_root>/investment-research/
├── AAPL/
│   ├── tmp/
│   │   ├── sec_filings/                       # SEC filing download location
│   │   │   └── sec-edgar-filings/AAPL/10-K/
│   │   │       └── <accession-number>/
│   │   │           ├── full-submission.txt    # Original file
│   │   │           └── cleaned.txt            # Cleaned file
│   │   ├── analysis-framework-2026-01-16.md   # Dynamically generated investment analysis framework
│   │   ├── phase1-2026-01-16.md               # Phase 1 filing analysis
│   │   └── phase2-2026-01-16.md               # Phase 2 web research
│   ├── AAPL-Investment-Report-2026-01-16.md   # Final integrated report
│   └── AAPL-Investment-Report-2026-01-15.md   # Historical version
├── TSM/
│   ├── tmp/
│   │   ├── sec_filings/
│   │   │   └── ...
│   │   └── ...
│   └── TSM-Investment-Report-2026-01-16.md
```

**Note**: The `investment-research/` directory is located at the project root, not within the skill folder.
