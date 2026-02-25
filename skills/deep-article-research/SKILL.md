---
name: deep-article-research
description: Deep Article Research & Verification. Given an article URL, fetches content, extracts core arguments, then uses Gemini Deep Research to verify each argument with web evidence. Outputs a professional Chinese analysis report. Use when analyzing articles, fact-checking claims, verifying arguments in blog posts, news articles, opinion pieces, or research papers.
allowed-tools: Read, Write, WebSearch, WebFetch, Bash(python3.11:*, agent-browser:*, mkdir:*, ls:*)
---

# Deep Article Research

Given an article URL, fetch its content, extract core arguments, then use Gemini Deep Research for deep verification and analysis. Output a professional Chinese analysis report.

## Requirements

| Requirement | Details |
|-------------|---------|
| **GEMINI_API_KEY** | Environment variable, required for Gemini Deep Research |
| **agent-browser** | For fetching JS-rendered article content (fallback: WebFetch) |

---

## Quick Start Workflow

> Fetch article → Extract arguments → Gemini deep verification → Format report

### Step 1: Fetch Article Content

Use `agent-browser` to fetch the full article content:

```bash
agent-browser --url "<article_url>" --action "extract the complete article text content including title, author, date, and full body text"
```

Save the raw content to `tmp/article-deep-research/{slug}/article-raw.txt`.

**Fallback**: If `agent-browser` is not available, use `WebFetch` tool to fetch the article.

**If the article is behind a paywall or inaccessible**, ask the user to paste the article text directly.

**Generate `{slug}`**: Create a short English identifier from the article title (e.g., `china-ai-policy`, `fed-rate-decision`). Use lowercase, hyphens, max 4 words.

### Step 2: Extract Arguments (LLM Self-Execution)

Read and analyze the article following `references/article-analysis-framework.md`:

1. Identify the topic domain
2. Extract core arguments, evidence, logical chains, and implicit assumptions
3. Output structured analysis

Save to: `tmp/article-deep-research/{slug}/argument-extraction-YYYY-MM-DD.md`

### Step 3: Gemini Deep Verification

```bash
python3.11 scripts/gemini_deep_research.py \
  --input <argument-extraction file path> \
  --prompt prompts/deep-verification-prompt.md \
  --output-dir tmp/article-deep-research/<slug> \
  --slug <slug> \
  --topic "<article topic keywords>"
```

Script paths are relative to this skill's directory. Use absolute paths when invoking:
- `--prompt`: `<skill_dir>/prompts/deep-verification-prompt.md`
- Script: `<skill_dir>/scripts/gemini_deep_research.py`

Where `<skill_dir>` is the directory containing this SKILL.md file.

Gemini will conduct web deep research to verify, refute, and supplement each argument, outputting a complete analysis report.

Output: `tmp/article-deep-research/{slug}/{slug}-Analysis-Report-YYYY-MM-DD.md`

### Step 4: Format and Save

Format the report per `references/markdown-formatter-rules.md`, then save the final version.

---

## Output Location

```
tmp/article-deep-research/
 +-- {slug}/
     +-- article-raw.txt                        # Raw article content
     +-- argument-extraction-YYYY-MM-DD.md      # LLM argument extraction
     +-- {slug}-Analysis-Report-YYYY-MM-DD.md   # Final analysis report
```

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| [article-analysis-framework.md](references/article-analysis-framework.md) | Argument extraction framework (LLM self-execution) |
| [markdown-formatter-rules.md](references/markdown-formatter-rules.md) | Report formatting rules |
| [prompts/deep-verification-prompt.md](prompts/deep-verification-prompt.md) | Gemini deep verification prompt |

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Paywall / inaccessible article | Ask user to paste article text directly |
| `agent-browser` not installed | Fallback to `WebFetch` |
| `GEMINI_API_KEY` not set | Inform user: "Please set GEMINI_API_KEY environment variable" |
| Article too short | Still run full workflow (extraction + verification) |

