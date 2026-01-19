# Financial Report Analysis Markdown Formatting Prompt

## Objective

Format financial report analysis Markdown documents by removing citation markers, optimizing formula format, making the document cleaner and more readable.

## Formatting Rules

### Rule 1: Remove Bottom Citations Section

**Target**: Delete the references/citations section at the end of the document

**Identification Markers**:
- Section title contains: "References", "Citations", "Works Cited", etc.
- Usually located at document end
- Contains numbered citation list

**Action**: Delete all content from that section title to document end

**Example**:

Before:
```markdown
## Investment Recommendation

Based on the above analysis...

#### **References**

1. 3ff004e913507e0309f3f62a553185b2.pdf
2. Tencent Holdings Ltd Q3-2025 Earnings Call - Alpha Spread, accessed November 16, 2025
3. TENCENT ANNOUNCES 2025 THIRD QUARTER RESULTS - PR Newswire
...
```

After:
```markdown
## Investment Recommendation

Based on the above analysis...
```

---

### Rule 2: Remove In-Text Data Source References

**Target**: Delete "data source" explanation lines after tables or paragraphs

**Identification Patterns**:
- `Data source: 1 (P.4, P.9, P.13, P.14)`
- `Data source: Based on 1 (P.4, P.9, P.13, P.14) and 1 (P.18) compilation.`
- `Data source: Industry report 7.`
- `Source: ...`

**Action**: Delete entire data source explanation line

**Example**:

Before:
```markdown
| Segment | Q Revenue | Growth |
|---------|-----------|--------|
| VAS | $959 | +16% |

Data source: Based on 1 (P.4, P.9, P.13, P.14) and 1 (P.18) compilation.
```

After:
```markdown
| Segment | Q Revenue | Growth |
|---------|-----------|--------|
| VAS | $959 | +16% |
```

---

### Rule 3: Remove Footnote Citation Numbers

**Target**: Delete citation number markers at end of sentences or paragraphs

**Identification Patterns**:
- Single or multiple numbers at sentence end: `1`, `2`, `7`, `11`
- Usually appear after periods, commas
- May be consecutive multiple citations: `1, 2, 7`

**Action**: Delete these citation numbers, preserve original content and punctuation

**Example**:

Before:
```markdown
Tencent's total revenue reached $192.9 billion, up 15% YoY 1. Management confirmed in the earnings call 2 that AI applications improved ad targeting capabilities 3.
According to industry report 7, Tencent Cloud has 10% market share.
```

After:
```markdown
Tencent's total revenue reached $192.9 billion, up 15% YoY. Management confirmed in the earnings call that AI applications improved ad targeting capabilities.
According to industry report, Tencent Cloud has 10% market share.
```

**Notes**:
- Maintain sentence completeness and readability
- After removing citations, check if punctuation needs adjustment
- Do NOT delete numbers that are actual data (e.g., "15%", "$192.9 billion")

---

### Rule 4: Optimize Formula Format to Standard Markdown Math

**Target**: Convert formulas to standard Markdown math syntax

**Conversion Rules**:

#### 4.1 Inline Formulas
Keep using single dollar signs, but ensure correct format:
- Format: `$formula$`
- No spaces between dollar signs and formula content

#### 4.2 Block Formulas
Use double dollar signs or standard LaTeX block format:
- Format: `$$formula$$` or `\[ formula \]`
- Own line, blank lines before and after

#### 4.3 Fix Common Issues
- Fix escape characters: `$CFO / Net Income$ ratio` should be `$\text{CFO} / \text{Net Income}$`
- Fix multiplication: `$\\times$` should be `$\times$`
- Fix percentage: `$39.2\\%$` should be `$39.2\%$`
- Fix approximately: `$\\approx$` should be `$\approx$`

**Example**:

Before:
```markdown
Calculation: Debt-to-Asset Ratio \= $8,128 / $20,733 \= $39.2\\%$

Cash Conversion Cycle (CCC) \= $DSO \+ DIO \- DPO \\approx 24.7 \- 139.7 \= \-115$ days
```

After:
```markdown
Calculation: Debt-to-Asset Ratio = $8,128 / 20,733 = 39.2\%$

Cash Conversion Cycle (CCC) = $\text{DSO} + \text{DIO} - \text{DPO} \approx 24.7 - 139.7 = -115$ days
```

Or using block formulas:
```markdown
Calculation: Debt-to-Asset Ratio

$$
\text{Debt-to-Asset Ratio} = \frac{8,128}{20,733} = 39.2\%
$$

Cash Conversion Cycle

$$
\text{CCC} = \text{DSO} + \text{DIO} - \text{DPO} \approx 24.7 - 139.7 = -115 \text{ days}
$$
```

---

## Execution Flow

1. **First Pass**: Remove bottom citations section
2. **Second Pass**: Remove all "data source" lines
3. **Third Pass**: Remove footnote citation numbers
4. **Fourth Pass**: Optimize all formula formats
5. **Final Check**: Read through entire document, ensure content coherence and format consistency

## Quality Checklist

- [ ] No citations section at document end
- [ ] No "data source" explanations after tables
- [ ] No citation footnote numbers in paragraphs (like 1, 2, 7)
- [ ] All formulas use standard Markdown math syntax
- [ ] Formula escape characters correct (\%, \times, \approx, etc.)
- [ ] Document content coherent, sentences flow after citation removal
- [ ] All substantive data and analysis content preserved

## Notes

1. **Do not delete substantive content**: Only delete citation markers, preserve all analysis, data, conclusions
2. **Maintain format consistency**: Keep tables, lists, headings format unified
3. **Accurate number identification**: Distinguish citation footnotes (delete) from data numbers (preserve)
4. **Formula integrity**: Ensure formulas retain mathematical meaning after conversion
5. **Readability priority**: Formatted document should be easier to read, not more complex
