# Article Analysis Report — Markdown Formatting Rules

## Objective

Format article analysis report Markdown documents by removing Gemini citation artifacts, cleaning up formatting inconsistencies, and ensuring a professional, readable output.

## Formatting Rules

### Rule 1: Remove Bottom Citations Section

**Target**: Delete the references/citations section at the end of the document

**Identification Markers**:
- Section title contains: "References", "Citations", "Works Cited", "Sources", "Bibliography"
- Usually located at document end
- Contains numbered citation list or URL list

**Action**: Delete all content from that section title to document end

**Example**:

Before:
```markdown
## 结论

基于以上分析...

#### **References**

1. https://example.com/article1
2. Reuters report on...
3. Academic paper...
```

After:
```markdown
## 结论

基于以上分析...
```

---

### Rule 2: Remove In-Text Source References

**Target**: Delete "source" explanation lines after paragraphs or tables

**Identification Patterns**:
- `Data source: 1 (P.4, P.9)`
- `Source: Reuters, 2025`
- `来源: ...`
- `数据来源: ...`

**Action**: Delete entire source explanation line

---

### Rule 3: Remove Footnote Citation Numbers

**Target**: Delete citation number markers at end of sentences

**Identification Patterns**:
- Single or multiple numbers at sentence end: `1`, `2`, `7`, `11`
- Usually appear after periods, commas
- May be consecutive: `1, 2, 7`

**Action**: Delete citation numbers, preserve original content and punctuation

**Example**:

Before:
```markdown
根据研究报告 7，该领域的增长率达到了 15% 1, 2。多位专家认为 3 这一趋势将持续。
```

After:
```markdown
根据研究报告，该领域的增长率达到了 15%。多位专家认为这一趋势将持续。
```

**Notes**:
- Maintain sentence completeness and readability
- After removing citations, check if punctuation needs adjustment
- Do NOT delete numbers that are actual data (e.g., "15%", "3 个月")

---

### Rule 4: Normalize Heading Levels

**Target**: Ensure consistent heading hierarchy

**Rules**:
- Document title: `#` (Level 1) — use sparingly, only if needed
- Major sections: `##` (Level 2)
- Sub-sections: `###` (Level 3)
- No skipping levels (don't go from `##` to `####`)

---

### Rule 5: Clean Up Verification Icons

**Target**: Ensure consistent use of verification status icons

**Standardized Icons**:
- `✅ 基本属实` — Mostly verified / Supported by evidence
- `⚠️ 部分属实` — Partially verified / Mixed evidence
- `❌ 存疑或不实` — Questionable / Contradicted by evidence

**Action**: Normalize any variations to these three standard forms

---

## Execution Flow

1. **First Pass**: Remove bottom citations section
2. **Second Pass**: Remove all in-text source reference lines
3. **Third Pass**: Remove footnote citation numbers
4. **Fourth Pass**: Normalize heading levels
5. **Fifth Pass**: Standardize verification icons
6. **Final Check**: Read through entire document, ensure content coherence and format consistency

## Quality Checklist

- [ ] No citations section at document end
- [ ] No source explanation lines in body text
- [ ] No citation footnote numbers in paragraphs
- [ ] Heading hierarchy is consistent (no level skipping)
- [ ] Verification icons are standardized
- [ ] Document content is coherent after cleanup
- [ ] All substantive analysis content is preserved
- [ ] Chinese text reads naturally

## Notes

1. **Do not delete substantive content**: Only delete citation artifacts, preserve all analysis, evidence, conclusions
2. **Maintain format consistency**: Keep tables, lists, headings format unified
3. **Accurate number identification**: Distinguish citation footnotes (delete) from data numbers (preserve)
4. **Readability priority**: Formatted document should be cleaner and easier to read
