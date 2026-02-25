# Article Analysis Framework — Argument Extraction

This framework guides the LLM to systematically extract and analyze arguments from any article. Execute each section in order.

---

## Step 1: Topic Domain Identification

Identify the article's primary and secondary domains to determine verification angles.

Output format:
```
**主题领域**: [Primary domain] / [Secondary domain if applicable]
**关键词**: [3-5 key terms for later web research]
```

---

## Step 2: Article Metadata

Extract basic information:

```
**标题**: [Article title]
**来源/作者**: [Source publication / Author name]
**发布日期**: [Publication date, if identifiable]
**文章类型**: [Opinion / Analysis / News Report / Research / Commentary]
**目标受众**: [Intended audience]
```

---

## Step 3: Core Argument Extraction

For each distinct argument in the article, extract the following structure. Identify **3-7 core arguments** (fewer for short articles, more for long-form pieces).

### Argument Template

```
### 论点 [N]: [One-sentence description]

**原文论据**:
- [Key evidence/data points the author uses to support this argument]
- [Direct quotes or paraphrased claims]

**逻辑链**:
[Author's reasoning: Premise A → Premise B → Conclusion]
[Identify the logical structure type]

**隐含假设**:
- [Unstated assumptions the argument relies on]
- [Conditions that must be true for the argument to hold]

**论证强度初评**: [Strong / Moderate / Weak]
**初评理由**: [Brief explanation of why]
```

---

## Step 4: Cross-Argument Analysis

After extracting individual arguments, analyze their relationships:

```
## 论点关系分析

**论点间的支撑关系**:
- [Which arguments reinforce each other?]

**论点间的矛盾或张力**:
- [Any internal contradictions?]

**核心论点 vs 辅助论点**:
- 核心: [The 1-2 arguments the article's thesis depends on]
- 辅助: [Supporting but non-essential arguments]
```

---

## Step 5: Source & Evidence Quality

```
## 证据质量评估

**数据来源类型**: Classify as: primary data / secondary data / expert opinions / anecdotal / pure assertion

**数据时效性**: [Current / Dated / Unknown]

**关键缺失信息**:
- [What important data or perspectives are absent?]
- [What questions does the article leave unanswered?]
```

---

## Step 6: Bias & Perspective Check

```
## 偏见与立场分析

**作者/来源立场**: [Known biases or affiliations of author/publication]
**叙事框架**: [How does the framing shape interpretation?]
**被忽略的对立观点**: [Counter-arguments not addressed]
**情绪化语言**: [Loaded terms, emotional appeals, rhetorical devices]
```

---

## Step 7: Verification Priority

Rank which arguments most need external verification:

```
## 验证优先级

| 优先级 | 论点 | 验证原因 |
|--------|------|----------|
| 高 | [Argument description] | [Why this needs verification] |
| 高 | [Argument description] | [Why this needs verification] |
| 中 | [Argument description] | [Why this needs verification] |
| 低 | [Argument description] | [Why this needs verification] |
```

---

## Output Requirements

- **Language**: Chinese (简体中文) for all analysis content
- **Objectivity**: Maintain neutral analytical tone; do not advocate for or against the article's position
- **Completeness**: Every argument must have all template fields filled
- **Conciseness**: Each field should be substantive but not verbose — aim for clarity over length
