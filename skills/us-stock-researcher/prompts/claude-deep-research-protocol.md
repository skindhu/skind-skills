# Claude Deep Research Protocol for Investment Analysis

Complete 7-phase execution guide with Graph of Thoughts (GoT) enhancement for institutional-grade financial analysis.

Based on [Claude-Code-Deep-Research](https://github.com/AnkitClassicVision/Claude-Code-Deep-Research) methodology.

---

## Overview

This protocol guides Claude through a systematic deep research process for analyzing SEC filings (10-K/10-Q) without requiring external APIs. It combines:

- **7-Phase Deep Research Process**: Structured methodology from question to final report
- **Graph of Thoughts (GoT)**: Multi-branch exploration for comprehensive coverage
- **WebSearch Integration**: Real-time verification of filing claims
- **Chain-of-Verification**: Quality assurance for hallucination prevention

---

## Phase 1: Question Scoping

### Objective
Clarify the research question and define success criteria.

### Actions

1. **Parse User Request**
   - Extract ticker symbol (e.g., AAPL, TSLA)
   - Identify filing type (10-K annual / 10-Q quarterly / 6-K foreign)
   - Note any specific focus areas requested
   - Check if user specified a specific period (e.g., "2024 Q3", "FY2024", "最新")

2. **Determine Filing Period** (if not specified by user)

   If user did NOT specify a specific filing period, use WebSearch to find the latest filing:

   ```
   WebSearch: "{company_name} latest 10-K 10-Q SEC filing 2025"
   WebSearch: "{ticker} earnings report latest quarter"
   ```

   Inform user which period will be analyzed:
   > "根据搜索结果，{TICKER} 最新的 {10-K/10-Q} 财报是 {FY2024/2024 Q3}，将下载并分析该期财报。"

3. **Download SEC Filing**
   ```bash
   python3.11 scripts/download_sec_filings.py --ticker <TICKER> --type <10-K|10-Q|6-K> --limit 1
   ```

4. **Define Output Format**
   - Investment research report in Chinese (简体中文)
   - Structure per `financial-analysis-framework.md`
   - Save to `investment-research/{TICKER}/`

### Output
- Confirmed analysis scope with specific period identified
- Downloaded and cleaned filing at `tmp/sec_filings/cleaned.txt`

---

## Phase 2: Retrieval Planning

### Objective
Break down the research question into actionable subtopics and create a research plan.

### Actions

1. **Read Filing Summary**
   - Read first 5000 characters of `cleaned.txt`
   - Identify company's main business and industry

2. **Select Industry Module**
   Based on identification, select from `industry-analysis-modules.md`:

   | Industry Type | Module |
   |---------------|--------|
   | Software/Internet/Cloud | Tech/TMT Module |
   | Banking/Insurance/Asset Management | Financial/Banking Module |
   | Retail/Consumer Goods/F&B | Consumer/Retail Module |
   | Pharma/Biotech/Healthcare | Pharma/Bio Module |
   | Machinery/Auto/Chemical | Industrial/Manufacturing Module |

3. **Generate Research Plan**
   Define 5 research branches for GoT exploration:

   - **Branch A**: Financial Data Analysis (filing-based)
   - **Branch B**: Competitive Landscape (web research)
   - **Branch C**: Industry Trends (web research)
   - **Branch D**: Management Verification (web research)
   - **Branch E**: Risk Factors (web research)

### Output
- Industry classification
- Selected analysis modules
- 5-branch research plan

---

## Phase 3: Iterative Querying (GoT Generate)

### Objective
Execute parallel research branches using GoT Generate operation.

### Research Branches Overview

| Branch | Method | Focus | WebSearch Query Pattern |
|--------|--------|-------|------------------------|
| A | Read filing | Financial data (revenue, margins, cash flow, balance sheet) | N/A |
| B | WebSearch | Competitive landscape | "{company} competitors market share" |
| C | WebSearch | Industry trends | "{industry} trends TAM growth" |
| D | WebSearch | Management verification | "{company} management guidance accuracy" |
| E | WebSearch | Risk factors | "{company} lawsuit regulatory risk" |

**For detailed output templates, see:** `got-research-templates.md`

### Branch Execution Guidelines

1. **Branch A (Financial)**: Analyze filing directly, extract all financial metrics
2. **Branch B-E (Web Research)**: Execute 3-5 WebSearch queries per branch, collect sources
3. Each branch should produce a self-contained analysis with sources cited

---

## Phase 4: Source Triangulation (GoT Score + KeepBestN)

### Objective
Evaluate information quality and cross-validate findings.

### GoT Scoring Criteria (0-10)

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Source Authority | 30% | SEC filing > Analyst reports > News > Blogs |
| Recency | 20% | Information from last 12 months preferred |
| Specificity | 25% | Specific numbers/data > General statements |
| Corroboration | 25% | Multiple sources confirm claim |

### Cross-Validation Process

For each key claim from the filing:

1. **Extract Claim**: Quote the specific statement from 10-K/10-Q
2. **Search Evidence**: Use WebSearch to find supporting/contradicting evidence
3. **Mark Status**:
   - ✅ **Verified**: Multiple credible sources confirm
   - ⚠️ **Questionable**: Contradicting evidence found
   - ❓ **Unable to Verify**: Insufficient external data

### Verification Table Template

| Filing Claim | Source | Verification Status | Web Evidence |
|--------------|--------|---------------------|--------------|
| "Revenue grew 30% YoY" | 10-K p.45 | ✅ Verified | Analyst consensus confirms |
| "Market leader in segment X" | MD&A | ⚠️ Questionable | Competitor claims same |
| "New product launch Q2" | Forward-looking | ❓ Unable to Verify | No external confirmation |

### Output
- Scored research branches
- Verification status for key claims
- Identified contradictions to address

---

## Phase 5: Knowledge Synthesis (GoT Aggregate)

### Objective
Synthesize findings into a structured investment report.

### Report Structure (per financial-analysis-framework.md)

#### Executive Summary
- One-sentence investment thesis
- Investment rating: 🟢 Buy / 🟡 Hold / 🔴 Sell
- 3-5 key findings

#### Layer Zero: Business Model & Moat
- Revenue structure breakdown (table format)
- Business trend analysis
- Competitive positioning

#### Layer One: Financial Quality
- GAAP vs Non-GAAP reconciliation
- Cash flow quality assessment
- Balance sheet health scorecard

#### Layer Two: Valuation
- Growth sustainability scenarios (Bull/Base/Bear)
- Peer valuation comparison
- PEG analysis

#### Industry-Specific Analysis
- Apply selected industry module metrics

#### Investment Decision Memo
- Investment Thesis (The Thesis)
- Key Risks (The Pre-Mortem)
- Research Quality Self-Check
- Final Rating

### Integration Rules

1. **Preserve All Data**: Never omit financial numbers
2. **Show Verification**: Include verification status for claims
3. **Cite Sources**: Reference filing page numbers and web sources
4. **Acknowledge Gaps**: Note information that couldn't be verified

### Output
- Draft investment report following framework structure

---

## Phase 6: Quality Assurance (GoT Refine + Chain-of-Verification)

### Objective
Verify accuracy and eliminate hallucinations.

### Chain-of-Verification Process

1. **Claim Extraction**: List all factual claims in report
2. **Source Check**: Verify each claim has a traceable source
3. **Number Validation**: Cross-check all numbers against filing
4. **Consistency Check**: Ensure no contradictions within report
5. **Gap Acknowledgment**: Mark any unverified claims

### Quality Checklist

- [ ] Every financial number matches source document
- [ ] All percentages correctly calculated
- [ ] Revenue/profit figures use consistent units (Billion/Million)
- [ ] Verification status shown for key claims
- [ ] No claims without sources
- [ ] Contradictions explained
- [ ] Limitations acknowledged

### Hallucination Prevention

**Red Flags to Check**:
- Numbers not found in filing
- Competitor data without web source
- Future predictions presented as facts
- Industry statistics without citation

**Fix Protocol**:
1. If number unverifiable → Remove or mark as "unverified"
2. If claim contradicted → Present both perspectives
3. If source unclear → Add "Source needed" note

### Output
- Quality-verified report
- Verification checklist completed

---

## Phase 7: Output Packaging

### Objective
Format and deliver the final report.

### Formatting Rules

**Apply all rules from `markdown-formatter-rules.md`**, including:
- Remove bottom "Sources", "References", "数据来源" sections
- Remove inline citation markers `[1]`, `[2]`
- Remove "Data source:" lines after tables
- Use Billion as primary unit ($100M = $0.1B)
- Standard Markdown math syntax

### File Output

Save to: `<project_root>/investment-research/{TICKER}/{TICKER}-Investment-Report-YYYY-MM-DD.md`

### Output Language

**All content must be in Chinese (简体中文)**

---

## Quick Reference: GoT Operations

| Operation | When to Use | Example |
|-----------|-------------|---------|
| Generate(k) | Phase 3: Create k research branches | Generate 5 parallel research paths |
| Score | Phase 4: Evaluate information quality | Rate each source 0-10 |
| KeepBestN(n) | Phase 4: Retain top findings | Keep top 3 sources per topic |
| Aggregate | Phase 5: Merge branches | Combine all findings into report |
| Refine | Phase 6: Improve quality | Fix errors, add missing sources |

---

## Execution Checklist

- [ ] Phase 1: Question scoped, filing downloaded
- [ ] Phase 2: Industry identified, research plan created
- [ ] Phase 3: All 5 branches researched
- [ ] Phase 4: Sources scored, claims verified
- [ ] Phase 5: Report synthesized per framework
- [ ] Phase 6: Quality checks passed
- [ ] Phase 7: Formatted and saved

---

## Source Quality Ratings

| Rating | Description | Examples |
|--------|-------------|----------|
| **A** | Primary regulatory documents | SEC filings, audit reports |
| **B** | Professional analysis | Analyst reports, earnings calls |
| **C** | Quality journalism | WSJ, Bloomberg, Reuters |
| **D** | General news | Industry news, company press releases |
| **E** | Unverified | Social media, forums, speculation |

Always prefer A/B sources. Use C/D for supplementary context. Avoid E sources.
