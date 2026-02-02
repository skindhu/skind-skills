# Investment Research Report Integration Guide

## Integration Objective

Merge Phase 1 (SEC Filing Deep Analysis) and Phase 2 (Web Research Verification) into a complete investment research report.

---

## Core Principles

### 1. Content Completeness (Highest Priority)

- **Do not omit any key financial data** (revenue, profit, gross margin, guidance, etc.)
- **Do not omit any important risk warnings**
- **Retain all specific numbers and percentages**
- Better to be detailed than overly simplified

### 2. Smart Deduplication

- Only merge **completely duplicate** content (e.g., both reports mention the same competitor data)
- If two reports analyze the same topic from different angles, **keep both**
- When deduplicating, prioritize keeping the more detailed, data-supported version

### 3. Cross-Verification Presentation

- Present management statements from filings alongside web verification results
- Clearly mark verification results (✅ Verified / ⚠️ Questionable / ❓ Unable to Verify)
- Establish "Filing Discovery → Web Verification → Investment Conclusion" chain of reasoning

### 4. Structured Output

- Reorganize sections logically, not just concatenate
- Ensure the report has a clear narrative thread
- Place investment conclusions in prominent positions

---

## Output Structure

The integrated report should contain the following sections:

### 1. Executive Summary
- One-sentence investment thesis
- Investment rating (Strong Buy/Buy/Hold/Sell)
- 3-5 key finding highlights
- Target price range (if available)

### 2. Company Overview
- Basic company information (from Phase 1)
- Brief business model description

### 3. Financial Analysis
- **Fully retain all financial data from Phase 1**
- Revenue analysis (by business/region/customer)
- Margin analysis (gross margin, operating margin, net margin)
- Cash flow analysis
- Balance sheet highlights
- Management guidance and historical accuracy (from Phase 2)

### 4. Competitive Landscape
- Integrate competitor analysis from both reports
- Phase 1 filing competitive positioning + Phase 2 web latest updates
- Market share change trends

### 5. Risk Assessment
- Integrate risk analysis from both reports
- Mark cross-verification status for each risk
- Risk matrix (Probability × Impact)

### 6. Management Assessment
- Filing statements (Phase 1) vs Web verification (Phase 2) comparison table
- Historical guidance accuracy analysis
- Management credibility score

### 7. Valuation Analysis
- Valuation data from Phase 2
- PE/PB historical percentile
- Peer valuation comparison
- Analyst target price consensus

### 8. Investment Recommendation
- Comprehensive investment rating
- Buy/Sell trigger conditions
- Position sizing suggestion
- Key monitoring metrics

---

## Cross-Verification Format Example

```markdown
### Management Statement Verification

| Statement | Source | Verification Result | Web Evidence |
|-----------|--------|---------------------|--------------|
| 30% revenue growth in 2026 | Q4 guidance | ✅ Verified | Analyst consensus expects 28-32% |
| Arizona fab yield on track | Management statement | ✅ Exceeds expectations | Yield 4% above Taiwan domestic |
| 2nm on-time production | Technology roadmap | ✅ Verified | Apple iPhone 18 confirmed adoption |
```

---

## Prohibited Actions

- ❌ Do not delete any financial numbers
- ❌ Do not delete any risk warnings
- ❌ Do not use "see original report" or similar omission expressions
- ❌ Do not over-summarize causing information loss
- ❌ Do not change the original meaning of data
- ❌ Do not add data not present in original reports

---

## Integration Checklist

After completing integration, please confirm:

- [ ] All financial numbers from Phase 1 are retained
- [ ] All risk warnings from Phase 2 are included
- [ ] Competitor analysis integrates content from both reports
- [ ] Management statements are cross-referenced with web verification
- [ ] Report structure is clear with definitive investment conclusions
- [ ] No key information is omitted
- [ ] **Output is in Chinese (简体中文)**

---

## Language Requirement

**Output Language: Chinese (简体中文)**

The final integrated report must be written entirely in Chinese. This includes:
- All section titles and headings
- Analysis content and conclusions
- Investment recommendations
- Risk assessments
- Tables and data descriptions (numbers can remain in original format)
