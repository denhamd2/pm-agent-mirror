# GCC PMF Thematic Analysis (v2 — Fresh Run)

**Analysis Method:** Braun & Clarke (2006) 6-Phase Thematic Analysis — **FRESH from scratch**  
**Data Sources:** Customer Interviews (3), Secondary Research (PESTEL, Competitive Landscape)  
**Country/Region:** GCC (Gulf Cooperation Council)  
**Analysis Date:** 18 March 2026  
**Analyst:** PMF Research Specialist  
**Run Type:** E2E Pipeline — MISSION-008 (Step 1)  
**Constraint:** #1 recommendation MUST differ from MISSION-006 (Interview Scheduling) and MISSION-007 (WhatsApp Integration)

---

## Executive Summary

**Fresh analysis** of three GCC customer interviews (P1 – Accenture, P2 – Baker Hughes, P3 – Shell) and deep PESTEL research reveals **five critical PMF themes** for Workday Recruiting in the region. The most urgent **unaddressed** blocker is **Nationalization & Compliance Tracking**—cited by P1 and P2 with strong evidence of penalties, custom-field workarounds, and no out-of-box GCC support. Nitaqat Phase 2026–2028 localises 340,000+ jobs; Emiratisation and Kuwaitisation mandates compound the need.

**Critical PMF Blockers (prioritised for E2E):**
1. **Nationalization & Compliance Tracking** – Saudization, Emiratisation, Kuwaitisation require custom fields; no OOB support; penalties for non-compliance; Nitaqat 2026–2028 escalates urgency
2. **Reporting & Dashboard Gaps** – Native Workday dashboards insufficient; customers build PowerBI or Excel workarounds
3. **Offer Generation Rigidity** – Config changes require 2-month dev cycles; Arabic/RTL offer letters show squares; candidate document upload missing
4. **Interview Scheduling Fragmentation** – [Previously addressed MISSION-006]
5. **Candidate Communication (WhatsApp)** – [Previously addressed MISSION-007]

**Recommended #1 for E2E Pipeline:** Nationalization & Compliance — OOB nationalization tracking for Saudi, UAE, Kuwait with Nitaqat, Emiratisation, Kuwaitisation support.

---

## Methodology (Fresh Run)

**Phase 1: Familiarisation** — Read all transcripts in research/GCC/customer-transcripts/  
**Phase 2: Initial Codes** — Generated codes from semantic meaning (Nationalization-Tracking, Nitaqat-Penalties, Custom-Field-Workaround, Dashboard-Readability, etc.)  
**Phase 3: Themes** — Clustered into 5 candidate themes  
**Phase 4: Triangulation** — Cross-referenced across 3 customer perspectives  
**Phase 5: Definition** — Named and defined each theme with PMF implications  
**Phase 6: Report** — Produced this report with Product Roadmap Impact Summary

---

## Triangulation Matrix

| Theme | SME View | Customer View | Convergence | Divergence | PMF Impact |
|-------|----------|---------------|-------------|------------|------------|
| Nationalization & Compliance | N/A (no SME transcripts) | P1: "20% Emiratisation, 60% Saudization, 50% Kuwaitisation"; P2: "Nitaqat is key mandate", "we get penalties" | Strong | N/A | **High** — OOB gap blocks enterprise adoption |
| Reporting & Dashboards | N/A | P1: "couldn't read them"; P2: "navigate multiple tabs"; P3: "built PowerBI" | Strong | N/A | **High** — Workaround fatigue |
| Offer Generation | N/A | P1: "2 months for config"; P3: "Arabic squares" | Moderate | P3 franchise context | **Medium** — Config + localisation |
| Interview Scheduling | N/A | P1, P2: scheduling pain | Strong | N/A | Addressed MISSION-006 |
| WhatsApp | N/A | P1: "absolute necessary"; P2: "helpful" | Strong | P3: policy restricts | Addressed MISSION-007 |

---

## Theme 1: Nationalization & Compliance Tracking (PRIMARY)

### Description
GCC countries mandate workforce localisation with specific quotas and penalties. Saudi Nitaqat (2026–2028 phase localises 340,000+ jobs), UAE Emiratisation, and Kuwait Kuwaitisation require employers to track nationality at application and report compliance. Workday offers OOB for US/UK (ethnicity, veteran) but not for GCC.

### Evidence
- **P1 (Accenture):** "I'm liable to hit 20% Emiratisation, 60% national Saudization, 50% Kuwaitisation on my hiring... we need the ability to track throughout Workday"
- **P2 (Baker Hughes):** "Nitaqat is a key mandate... we are required to collect information, we are required to report... we get penalties if we don't meet certain percentage... having that built into a more out-of-box situation versus bandaids"
- **P2:** "We added capturing of nationality in UAE and Saudi... as a custom field... out-of-box is only for US and UK"

### High-Intensity Quotes
> "Nitaqat is a key mandate and we are required to collect information, we are also required to report... we get penalties if we don't meet certain percentage." — P2 (Baker Hughes)

> "I'm liable to hit 20% Emiratisation, 60% national Saudization, 50% Kuwaitisation on my hiring. So it's quite important that we track those metrics on Workday." — P1 (Accenture)

### PMF Impact
- **Blocking:** Enterprise customers cannot comply without custom configuration
- **Competitive:** Regional specialists (ZenHR, Talentera) offer native nationalisation tracking
- **Regulatory:** Nitaqat 2026–2028 increases enforcement; non-compliance freezes work permits, transfers, government contracts

### Product Roadmap Impact
**Action:** Deliver OOB nationalization fields for Saudi (Nitaqat), UAE (Emiratisation), Kuwait (Kuwaitisation) with application capture, reporting, and compliance dashboards.

---

## Theme 2: Reporting & Dashboard Gaps

### Description
Native Workday recruiting dashboards do not meet recruiter or leadership needs. Customers export to PowerBI or Excel for requisition-level, candidate-level, and nationalisation reporting.

### Evidence
- **P1:** "The dashboards... I couldn't read them... I need to download and create my own dashboards"
- **P2:** "Information is good but you have to navigate through different tabs... can it be more seamless?"
- **P3:** "We had to resort building a dashboard separately in PowerBI because the dashboard capabilities of Workday were not able to accommodate what we needed"

### PMF Impact
- Workaround fatigue; data governance risk (Excel, manual exports)
- **Product Roadmap Impact:** Improve recruiter and leadership dashboards; reduce PowerBI dependency

---

## Theme 3: Offer Generation Rigidity & Localisation

### Description
Offer configuration is rigid; changes require long dev cycles. Arabic/RTL offer letters display squares instead of characters. Candidate document upload (CV, passport, degree) is missing.

### Evidence
- **P1:** "When you're doing anything outside of what was configured, it becomes near impossible... every time we need this included, we're given a two months deadline"
- **P3:** "For Arabic countries... Workday Docs... it was just squares rather than the actual characters"
- **P1:** "If candidates can upload [documents] on the system, that'd be brilliant... I don't want my email clogged with CV and passport copy"

### PMF Impact
- **Product Roadmap Impact:** Faster config cycles; candidate document upload; Arabic/RTL support validation for Workday Docs

---

## Product Roadmap Impact Summary

### Priority 1: Critical PMF Blockers (Unaddressed)

1. **Nationalization & Compliance**
   - Action: OOB nationalization fields for Saudi (Nitaqat), UAE (Emiratisation), Kuwait (Kuwaitisation) with application capture, reporting, and compliance dashboards
   - Owner: Recruiting + Localisation

2. **Reporting & Dashboards**
   - Action: Improve recruiter and leadership dashboards; reduce PowerBI dependency
   - Owner: Reporting/Analytics team

### Priority 2: High-Impact Opportunities

3. **Offer Generation Rigidity**
   - Action: Faster config cycles; candidate document upload; Arabic support validation
   - Owner: Offer & Employment Agreement team

4. **Interview Scheduling** — [Addressed MISSION-006]
5. **WhatsApp Integration** — [Addressed MISSION-007]

---

## E2E Handoff: Research Recommendations

| # | Title | Action |
|---|-------|--------|
| 1 | Nationalization & Compliance | OOB nationalization fields for Saudi (Nitaqat), UAE (Emiratisation), Kuwait (Kuwaitisation) with application capture, reporting, and compliance dashboards |
| 2 | Reporting & Dashboards | Improve recruiter and leadership dashboards; reduce PowerBI dependency |
| 3 | Offer Generation Rigidity | Faster config cycles; candidate document upload; Arabic support validation |
| 4 | Interview Scheduling | Integrate Paradox with GCC compliance (KSA panel, Kuwait notice) |
| 5 | WhatsApp Integration | GA WhatsApp for GCC; extend campaigns beyond email |

**Default:** If PM does not select, proceed with #1 (Nationalization & Compliance).

---

**Report Generated:** 18 March 2026 (v2 — E2E MISSION-008)  
**Analyst:** PMF Research Specialist  
**Review Status:** Draft
