# Graph of Thoughts Research Templates

Research branch templates for multi-path exploration in investment analysis.

---

## Overview

Graph of Thoughts (GoT) enables parallel exploration of multiple research paths. Each branch operates independently, then results are scored, aggregated, and refined.

```
Root: "Analyze {TICKER} 10-K"
    │
    ├── Branch A: Financial Analysis ──────► Score: X.X
    ├── Branch B: Competitive Analysis ────► Score: X.X
    ├── Branch C: Industry Trends ─────────► Score: X.X
    ├── Branch D: Management Verification ─► Score: X.X
    └── Branch E: Risk Assessment ─────────► Score: X.X
                    │
                    ▼
            Aggregate Best Findings
                    │
                    ▼
            Refine & Synthesize
                    │
                    ▼
            Final Investment Report
```

---

## Branch A: Financial Data Analysis

### Objective
Deep analysis of SEC filing financial data without external research.

### Input
- `cleaned.txt` - SEC filing content

### Analysis Framework

#### A.1 Revenue Structure Breakdown

| Segment | Revenue ($B) | % of Total | YoY Growth | QoQ Growth | Gross Margin |
|---------|--------------|------------|------------|------------|--------------|
| [Segment 1] | | | | | |
| [Segment 2] | | | | | |
| **Total** | | 100% | | | |

**Key Questions**:
- What drives revenue growth (volume vs price)?
- Customer concentration risk (Top 10 customers %)?
- Geographic revenue distribution?

#### A.2 Profitability Analysis

| Metric | Current | Prior Year | Change | Industry Avg |
|--------|---------|------------|--------|--------------|
| Gross Margin | | | | |
| Operating Margin | | | | |
| Net Margin | | | | |
| EBITDA Margin | | | | |

**Key Questions**:
- Operating leverage trend?
- SG&A as % of revenue trend?
- R&D efficiency (for tech companies)?

#### A.3 Cash Flow Quality

| Metric | Amount ($B) | Analysis |
|--------|-------------|----------|
| Net Income | | |
| CFO (Cash from Operations) | | |
| CFO/Net Income Ratio | | > 0.8 is healthy |
| Free Cash Flow | | |
| FCF Conversion | | |

**Warning Signs**:
- Net Income ↑ but CFO flat → Check receivables
- DSO (Days Sales Outstanding) increasing
- Inventory buildup

#### A.4 Balance Sheet Health

| Metric | Value | Assessment |
|--------|-------|------------|
| Current Ratio | | > 1.5 healthy |
| Quick Ratio | | > 1.0 healthy |
| Debt/Equity | | |
| Interest Coverage | | > 5x healthy |
| Goodwill/Net Assets | | > 30% = risk |

### Output Format
```markdown
## 财务数据深度分析

### 收入结构
[Revenue breakdown table]

### 盈利能力
[Profitability metrics table]

### 现金流质量
- CFO/净利润比率: X.X (评估: 健康/警示)
- 应收账款周转天数变化: [trend]

### 资产负债表健康度
[Balance sheet metrics]

### 财务健康评分卡
| 维度 | 评级 | 说明 |
|------|------|------|
| 盈利质量 | 🟢/🟡/🔴 | [explanation] |
| 成本控制 | 🟢/🟡/🔴 | [explanation] |
| 资产负债表 | 🟢/🟡/🔴 | [explanation] |

**Branch Score: X.X/10**
```

---

## Branch B: Competitive Landscape

### Objective
Analyze competitive positioning using web research.

### WebSearch Queries

```
1. "{company_name} market share {year}"
2. "{company_name} vs {competitor_1} comparison"
3. "{company_name} competitive advantage moat"
4. "{industry} market leaders ranking {year}"
5. "{company_name} losing gaining market share"
```

### Analysis Framework

#### B.1 Competitor Identification

| Competitor | Market Cap | Revenue | Market Share | Key Strength |
|------------|------------|---------|--------------|--------------|
| [Company] | | | | |
| [Competitor 1] | | | | |
| [Competitor 2] | | | | |
| [Competitor 3] | | | | |

#### B.2 Competitive Moat Assessment

| Moat Type | Present? | Strength | Evidence |
|-----------|----------|----------|----------|
| Network Effects | Y/N | Strong/Weak | |
| Switching Costs | Y/N | Strong/Weak | |
| Cost Advantages | Y/N | Strong/Weak | |
| Intangible Assets | Y/N | Strong/Weak | |
| Efficient Scale | Y/N | Strong/Weak | |

#### B.3 Market Position

- **Leader/Challenger/Follower/Niche**: [Assessment]
- **Pricing Power**: High/Medium/Low
- **Market Share Trend**: Gaining/Stable/Losing

### Output Format
```markdown
## 竞争格局分析

### 主要竞争对手
[Competitor table]

### 护城河评估
[Moat assessment table]

### 市场地位
- 行业地位: [Leader/Challenger/Follower]
- 定价权: [High/Medium/Low]
- 市场份额趋势: [Gaining/Stable/Losing]

### 竞争风险
1. [Risk 1 with source]
2. [Risk 2 with source]

**Sources**: [List all web sources with URLs]
**Branch Score: X.X/10**
```

---

## Branch C: Industry Trends

### Objective
Analyze industry dynamics and company positioning within trends.

### WebSearch Queries

```
1. "{industry} market size TAM {year}"
2. "{industry} growth forecast 2025 2026"
3. "{industry} trends disruption technology"
4. "{industry} regulatory changes"
5. "{company_name} industry positioning outlook"
```

### Analysis Framework

#### C.1 Market Size & Growth

| Metric | Current | 2025E | 2026E | CAGR |
|--------|---------|-------|-------|------|
| TAM (Total Addressable Market) | | | | |
| SAM (Serviceable Available Market) | | | | |
| Company Revenue | | | | |
| Implied Penetration | | | | |

#### C.2 Industry Lifecycle

- **Stage**: Emerging / Growth / Mature / Decline
- **Growth Drivers**: [List key drivers]
- **Headwinds**: [List challenges]

#### C.3 Key Trends

| Trend | Impact on Company | Timeline | Confidence |
|-------|-------------------|----------|------------|
| [Trend 1] | Positive/Negative/Neutral | Near/Mid/Long | High/Medium/Low |
| [Trend 2] | | | |
| [Trend 3] | | | |

### Output Format
```markdown
## 行业趋势分析

### 市场规模与增长
[TAM/SAM table]

### 行业生命周期
- 当前阶段: [Stage]
- 增长驱动因素: [Drivers]
- 面临挑战: [Headwinds]

### 关键趋势影响
[Trends impact table]

### 公司行业定位
- 顺应趋势: [Aligned trends]
- 潜在风险: [Trend risks]

**Sources**: [List all web sources with URLs]
**Branch Score: X.X/10**
```

---

## Branch D: Management Verification

### Objective
Verify management credibility and track record.

### WebSearch Queries

```
1. "{company_name} management guidance accuracy"
2. "{company_name} earnings guidance vs actual"
3. "{company_name} CEO {name} track record"
4. "{company_name} executive changes {year}"
5. "{company_name} insider buying selling"
```

### Analysis Framework

#### D.1 Guidance Accuracy History

| Period | Metric | Guidance | Actual | Beat/Miss | Variance |
|--------|--------|----------|--------|-----------|----------|
| Q1 FY24 | Revenue | | | | |
| Q2 FY24 | Revenue | | | | |
| Q3 FY24 | Revenue | | | | |
| Q4 FY24 | Revenue | | | | |

**Guidance Style**: Conservative / Accurate / Aggressive

#### D.2 Management Changes

| Date | Position | Change | Implication |
|------|----------|--------|-------------|
| | | | |

#### D.3 Insider Activity

| Period | Insider Buys | Insider Sells | Net Activity |
|--------|--------------|---------------|--------------|
| Last 3 months | | | |
| Last 12 months | | | |

#### D.4 Management Credibility Score

| Factor | Score (1-10) | Notes |
|--------|--------------|-------|
| Guidance Accuracy | | |
| Communication Clarity | | |
| Strategy Execution | | |
| Capital Allocation | | |
| **Overall** | | |

### Output Format
```markdown
## 管理层验证

### 历史指引准确性
[Guidance accuracy table]
- 指引风格: [Conservative/Accurate/Aggressive]

### 管理层变动
[Changes table or "无重大变动"]

### 内部人交易
[Insider activity summary]

### 管理层信誉评分
[Credibility score table]

**验证状态**:
- ✅ 已验证: [Verified claims]
- ⚠️ 存疑: [Questionable claims]
- ❓ 无法验证: [Unable to verify]

**Sources**: [List all web sources with URLs]
**Branch Score: X.X/10**
```

---

## Branch E: Risk Assessment

### Objective
Identify and assess risk factors beyond those in SEC filing.

### WebSearch Queries

```
1. "{company_name} lawsuit legal risk {year}"
2. "{company_name} regulatory investigation SEC"
3. "{company_name} cybersecurity breach"
4. "{company_name} ESG controversy environment"
5. "{company_name} supply chain risk"
```

### Analysis Framework

#### E.1 Risk Matrix

| Risk Category | Specific Risk | Probability | Impact | Risk Score | Mitigation |
|---------------|---------------|-------------|--------|------------|------------|
| Legal/Litigation | | H/M/L | H/M/L | | |
| Regulatory | | H/M/L | H/M/L | | |
| Operational | | H/M/L | H/M/L | | |
| Financial | | H/M/L | H/M/L | | |
| Reputational | | H/M/L | H/M/L | | |
| ESG | | H/M/L | H/M/L | | |

#### E.2 Black Swan Potential

| Scenario | Trigger | Probability | Impact if Occurs |
|----------|---------|-------------|------------------|
| [Scenario 1] | | | |
| [Scenario 2] | | | |

#### E.3 Risk vs Filing Disclosure

| Risk | In 10-K? | Web Discovery | Assessment |
|------|----------|---------------|------------|
| | Y/N | | Adequately disclosed / Under-disclosed |

### Output Format
```markdown
## 风险评估

### 风险矩阵
[Risk matrix table]

### 黑天鹅情景
[Black swan scenarios]

### 风险披露对比
- 10-K 已披露但需关注: [List]
- 10-K 未充分披露: [List]
- 新发现风险: [List with sources]

### 关键风险摘要
1. **[Risk 1]**: [Description with source]
2. **[Risk 2]**: [Description with source]
3. **[Risk 3]**: [Description with source]

**Sources**: [List all web sources with URLs]
**Branch Score: X.X/10**
```

---

## GoT Aggregation Template

After all branches complete, aggregate using this template:

```markdown
## GoT 研究汇总

### 分支评分汇总

| Branch | Topic | Score | Key Finding |
|--------|-------|-------|-------------|
| A | Financial Analysis | X.X | [1-sentence summary] |
| B | Competitive Landscape | X.X | [1-sentence summary] |
| C | Industry Trends | X.X | [1-sentence summary] |
| D | Management Verification | X.X | [1-sentence summary] |
| E | Risk Assessment | X.X | [1-sentence summary] |

### 高置信度发现 (Score ≥ 8.0)
1. [Finding 1]
2. [Finding 2]

### 需要额外验证 (Score < 7.0)
1. [Finding requiring more research]

### 交叉验证发现
- Filing 声明 + Web 验证一致: [List]
- 发现矛盾需解释: [List with explanation]

### 综合投资观点
[Synthesized investment thesis based on all branches]
```

---

## Scoring Guidelines

### Score 9-10: Excellent
- Multiple authoritative sources confirm
- Specific data points with citations
- Recent information (< 6 months)
- No contradictions

### Score 7-8: Good
- At least one authoritative source
- Reasonable data support
- Information within 12 months
- Minor gaps acceptable

### Score 5-6: Adequate
- General news sources
- Limited specific data
- Some information outdated
- Notable gaps

### Score 3-4: Weak
- Single unverified source
- Mostly qualitative
- Outdated information
- Significant gaps

### Score 1-2: Poor
- No credible sources
- Speculation only
- Contradicted by other findings
- Critical information missing
