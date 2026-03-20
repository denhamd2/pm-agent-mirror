# UX Copy Review: GCC Nationalisation & Compliance Dashboard

**Prototype**: `design/gcc-nationalization-compliance.tsx`  
**Feature**: GCC Nationalization & Compliance — **MISSION-016** (PMF v39 E2E #1)  
**Date**: 20 March 2026  
**Reviewer**: 310-doc-writer  

_Review below reflects MISSION-008 pass; copy unchanged in prototype—still valid. Re-run 060 if regulatory strings change._

---

## Summary

- **Total issues found**: 8
- **Critical**: 2 (legal-sensitive copy requiring 060-legal-advisor review)
- **Quick wins**: 4 (sentence case, terminology consistency)
- **Consistency**: 2 (nationalisation vs nationalization)

---

## Extracted User-Facing Copy

| Location | Copy |
|----------|------|
| Page heading | GCC nationalisation compliance |
| Subheading | Track nationalisation metrics against regulatory thresholds for Saudi, UAE, and Kuwait |
| Primary button | Export report |
| Success message | Report exported successfully. Ready for government submission. |
| Search placeholder | Search... |
| Section heading | Breakdown by department |
| Help text | Filter by country to see nationalisation % by department. Click a row to drill down further. |
| Filter buttons | All countries, Saudi Arabia, UAE, Kuwait |
| Table headers | Department, Country, Nationals, Total, Nationalisation %, Status |
| Status labels | Compliant, At risk, Non-compliant |
| Metric card | of X% required, X / Y nationals |
| Progress bar tooltip | Threshold: X% |

### Tooltips (regulatory content)

| Country | Copy |
|---------|------|
| Saudi Arabia | Nitaqat 2026–2028: Employers must meet Saudi nationalisation % by sector and company size. Green = compliant, Yellow = warning, Red = non-compliant (work permit restrictions). |
| UAE | Emiratisation: Private sector targets (e.g. 2% annual increase). Non-compliance results in fines; Nafis programme incentives for compliance. |
| Kuwait | Kuwaitisation: Sector-specific Kuwaiti national quotas. Non-compliance affects work permits and government tenders. |

---

## Editorial Guidelines Review

### 1. Regulatory Terminology (Correct)

| Term | Status | Notes |
|------|--------|-------|
| Nitaqat | ✅ Correct | Official Saudi programme name |
| Emiratisation | ✅ Correct | British spelling (style guide) |
| Kuwaitisation | ✅ Correct | British spelling |
| Nafis | ✅ Correct | UAE federal programme (capital N) |
| nationalisation | ✅ Correct | British spelling throughout |

### 2. Button Labels

#### ✅ "Export report"
**Status**: Pass  
- Sentence case ✓
- Verb + noun ✓
- Concise ✓

### 3. Headings and Titles

#### ❌ "GCC nationalisation compliance"
**Issues**: Minor – could be more scannable  
**Recommended**: "GCC nationalisation compliance" (keep as-is – acceptable)  
**Note**: Sentence case is correct. "Compliance" as noun is fine for dashboard context.

#### ✅ "Breakdown by department"
**Status**: Pass – sentence case, concise

### 4. Success Message

#### ⚠️ "Report exported successfully. Ready for government submission."
**Issues**:
- **Legal-sensitive**: "Ready for government submission" could be interpreted as legal advice or a guarantee that the report meets government requirements
- Could mislead customers if report format or content varies by jurisdiction

**✅ Recommended**: "Report exported successfully"

**Rationale**: Remove the government submission claim. The export action is complete; whether the report is suitable for submission is a customer responsibility. Avoid implying Workday guarantees compliance.

**🔴 FLAG FOR 060-LEGAL-ADVISOR**: This copy may misrepresent government requirements.

### 5. Help Text

#### ❌ "Filter by country to see nationalisation % by department. Click a row to drill down further."
**Issues**:
- "Click a row" – action-oriented but could be "Select a row" to match Workday patterns (multi-device)
- Minor: "drill down" is acceptable jargon in analytics context

**✅ Recommended**: "Filter by country to see nationalisation % by department. Select a row to drill down further."

**Rationale**: "Select" is more inclusive (touch, keyboard, etc.) than "Click".

### 6. Status Labels

#### ✅ "Compliant", "At risk", "Non-compliant"
**Status**: Pass  
- Sentence case where appropriate ✓
- Clear, consistent terminology ✓

**🔴 FLAG FOR 060-LEGAL-ADVISOR**: These status labels have regulatory implications. Ensure they do not constitute legal advice or misrepresent government compliance status. Customers may rely on these labels for compliance decisions.

### 7. Tooltips (Regulatory Content)

#### ❌ Saudi Arabia tooltip
**Current**: "Nitaqat 2026–2028: Employers must meet Saudi nationalisation % by sector and company size. Green = compliant, Yellow = warning, Red = non-compliant (work permit restrictions)."

**Issues**:
- **Legal-sensitive**: Describes regulatory consequences (work permit restrictions). Could be interpreted as legal advice.
- "Green = compliant" etc. – assumes colour mapping is universal; Nitaqat uses different band names (platinum, green, yellow, red)
- "2026–2028" – ensure date range is accurate (regulations change)

**✅ Recommended**: "Nitaqat: Employers must meet Saudi nationalisation % by sector and company size. Status indicates compliance with configured thresholds. Check official sources for current requirements."

**Rationale**: Avoid stating regulatory consequences. Direct customers to official sources. Use "configured thresholds" to clarify Workday is displaying data, not providing legal advice.

**🔴 FLAG FOR 060-LEGAL-ADVISOR**: Full tooltip may misrepresent government requirements.

#### ❌ UAE tooltip
**Current**: "Emiratisation: Private sector targets (e.g. 2% annual increase). Non-compliance results in fines; Nafis programme incentives for compliance."

**Issues**:
- **Legal-sensitive**: "Non-compliance results in fines" – specific legal consequence; could be outdated or vary by sector
- "Nafis programme" – correct spelling ✓

**✅ Recommended**: "Emiratisation: Private sector targets apply. Status indicates compliance with configured thresholds. See Nafis programme for incentives."

**Rationale**: Avoid stating penalties. Keep Nafis reference for compliance support.

**🔴 FLAG FOR 060-LEGAL-ADVISOR**: Penalty language may misrepresent government requirements.

#### ❌ Kuwait tooltip
**Current**: "Kuwaitisation: Sector-specific Kuwaiti national quotas. Non-compliance affects work permits and government tenders."

**Issues**:
- **Legal-sensitive**: "Non-compliance affects work permits and government tenders" – specific consequences

**✅ Recommended**: "Kuwaitisation: Sector-specific Kuwaiti national quotas apply. Status indicates compliance with configured thresholds."

**Rationale**: Remove consequence language. Direct customers to official sources for penalties.

**🔴 FLAG FOR 060-LEGAL-ADVISOR**: Consequence language may misrepresent government requirements.

### 8. Table Headers

#### ❌ "Nationalisation %"
**Issues**: Minor – could use "Nationalisation %" (already correct) or "Nationalisation %" for consistency

**Status**: Pass – "Nationalisation %" is clear and consistent with British spelling

### 9. Metric Card Copy

#### ✅ "of X% required"
**Status**: Pass – concise, clear

#### ✅ "X / Y nationals"
**Status**: Pass – numerals as per design exception ✓

### 10. Search Placeholder

#### ✅ "Search..."
**Status**: Pass – standard pattern

### 11. Filter Buttons

#### ✅ "All countries", "Saudi Arabia", "UAE", "Kuwait"
**Status**: Pass – sentence case, clear

---

## Legal-Sensitive Copy – 060-legal-advisor Review Required

The following copy must be reviewed by **060-legal-advisor** before finalisation:

| Location | Issue | Risk |
|----------|-------|------|
| Success message | "Ready for government submission" – implies Workday guarantees report format meets government requirements | Could mislead customers; liability if report format varies by jurisdiction |
| Status labels | "Compliant", "At risk", "Non-compliant" – customers may rely on these for compliance decisions | Could be interpreted as legal advice; Workday may not be authoritative source |
| Saudi tooltip | Describes work permit restrictions; colour-to-compliance mapping | May misrepresent Nitaqat bands; regulations change |
| UAE tooltip | "Non-compliance results in fines" | Specific penalty; may vary by sector/size |
| Kuwait tooltip | "Non-compliance affects work permits and government tenders" | Specific consequences; may misrepresent |

**Recommendation**: Invoke 060-legal-advisor to validate:
1. Whether status labels require disclaimer
2. Whether tooltip content should avoid consequence language
3. Whether success message should be shortened
4. Whether any disclaimer is needed for compliance dashboards

---

## Quick Wins (Non-Legal)

| Current | Recommended | Rationale |
|---------|-------------|-----------|
| "Click a row" | "Select a row" | More inclusive (touch, keyboard) |
| Success message | Remove "Ready for government submission" | Reduce legal risk |

---

## Terminology Consistency

| Term | Usage | Status |
|------|-------|--------|
| nationalisation | Used throughout | ✅ Consistent (British) |
| Compliant / At risk / Non-compliant | Status labels | ✅ Consistent |

---

## Overall Assessment

The prototype copy is generally well aligned with Workday Editorial Guidelines: sentence case, concise labels, action-oriented buttons. The main concerns are **legal-sensitive**:

1. **Government submission language** – The success message implies the exported report is ready for government submission. This could create liability if report format or content varies by jurisdiction or customer configuration.

2. **Regulatory consequence language** – Tooltips describe fines, work permit restrictions, and government tender consequences. These may be accurate but could misrepresent current regulations or vary by sector. Workday should avoid stating regulatory consequences; customers should consult official sources.

3. **Status labels** – "Compliant", "At risk", "Non-compliant" are appropriate for a compliance dashboard, but 060-legal-advisor should confirm whether a disclaimer is needed (e.g. "This dashboard reflects configured thresholds. Consult official sources for compliance status.").

**Next steps**:
1. Invoke 060-legal-advisor for compliance review of flagged copy
2. Apply quick wins (Select a row, shorten success message)
3. Hand off approved copy to 320-prototype-developer for implementation (if changes needed)

---

## Copy Review Checklist

- [x] Sentence case applied
- [x] Concise (remove filler)
- [x] Action-oriented buttons
- [x] Active voice
- [x] Numbers as numerals
- [x] British spelling (nationalisation, programme)
- [x] Regulatory terminology verified (Nitaqat, Emiratisation, Kuwaitisation, Nafis)
- [ ] **Legal-sensitive copy** – 060-legal-advisor review pending
