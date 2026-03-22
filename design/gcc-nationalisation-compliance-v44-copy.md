# UX Copy Review: GCC Nationalisation Compliance

**Prototype:** `design/gcc-nationalisation-compliance-v44.tsx`  
**Discovery brief:** `design/gcc-nationalisation-compliance-v44-discovery-brief.md` (Final Verdict: APPROVED)  
**PRD:** `docs/prds/gcc-nationalisation-compliance-v44-prd.md`  
**Reviewer:** 319 (Doc Writer) — GCC-E2E-005 Step 6  
**Date:** 21 March 2026

---

## Summary

**Total issues found:** 10  
**Critical:** 2 (legal-sensitive export bundle for **060** sign-off; **PWD** column labelling and sensitive-field clarity)  
**Quick wins:** 4 (button specificity **Download**; **&** → **and** in nav headings; trim PM-meta overview line; tighten candidates + PWD helper copy)  
**Consistency:** 4 (audit section naming vs tab label; **Prism** vs **Reporting** wording; **LOB** shorthand alongside full label; British **Saudisation** vs PRD **Saudization** in docs only)

Overall, copy aligns with the JTBD (trustworthy quota view, customer-owned targets, audit exports) and uses **sentence case** in most headings. **Export and target disclaimers** are directionally strong and non-prescriptive. **060** should still sign off before GA, especially on **export/disclaimer** bundles and **PWD / gender / nationality** surfacing.

---

## Button Labels

| Current | Assessment | Recommended | Rationale |
|--------|--------------|-------------|-----------|
| **Open in Reporting** | Pass | *(keep)* | Sentence case, clear navigation intent. |
| **Export for audit** | Pass | *(keep)* | Verb + purpose; matches brief/PRD. |
| **Cancel** | Pass | *(keep)* | Standard secondary action. |
| **Download** | Minor | **Download export** | More specific (Editorial: tell users exactly what happens). |
| **Open export log in Reporting** | Pass | *(keep)* | Action-oriented, consistent with first Reporting CTA. |
| **Modal.CloseIcon** `aria-label="Close"` | Pass | *(keep)* | Accessible, concise. |
| **Communication rail** `Collapse messages` / `Expand messages` | Pass | *(keep)* | Clear for assistive tech. |

---

## Headings

| Current | Assessment | Recommended | Rationale |
|--------|--------------|-------------|-----------|
| **Recruiter Hub** / hub tabs (Overview, Job requisitions, Candidates, Dashboard) | Pass | *(keep)* | Sentence case, Workday-familiar. |
| **GCC workforce compliance** | Pass | *(keep)* | Primary dashboard title; neutral. |
| **Nationalisation metrics** / **Country packs** / **PWD & gender** / **Audit & exports** | Minor | Prefer **PWD and gender**; **Audit and exports** in UI strings | Ampersands are acceptable but **“and”** reads more naturally in product UI and for screen readers (Editorial/accessibility balance). |
| **Country packs (KSA, UAE, Kuwait)** | Pass | *(keep)* | Specific, sentence case. |
| **KSA** / **UAE** / **Kuwait** (card headings) | Pass | *(keep)* | Short region labels appropriate in cards. |
| **PWD and gender metrics** (panel title) | Pass | *(keep)* | Already uses “and”; good consistency with suggested tab label change. |
| **Audit trail & export history** | Minor | **Audit trail and export history** | Match “and” pattern; aligns with tab **Audit and exports** if renamed. |
| **Recruiting overview** / **Job requisitions** / **Candidates** | Pass | *(keep)* | |
| **Candidates in scope** | Pass | *(keep)* | Clear table section title. |
| **Announcements** | Pass | *(keep)* | |
| **Messages** (comm panel) | Pass | *(keep)* | |

---

## Help text, subtitles, and body copy

| Location | Current | Assessment | Recommended | Rationale |
|----------|---------|--------------|-------------|-----------|
| Dashboard subtitle | *Snapshot as of {date}. Targets are customer-entered; Workday does not determine statutory rates.* | Pass | *(keep)* | Critical trust copy; active and accurate. |
| Overview helper | *Tasks and announcements for your hub. Representative content for navigation completeness.* | Minor | Shorten for production | *Representative content for navigation completeness* is meta (PM-facing). Replace with user-facing line, e.g. *Your tasks and announcements for this hub.* |
| Job reqs helper | *Compact list with GCC location context.* | Pass | *(keep)* | Concise. |
| Candidates helper | *Nationality column emphasised for compliance workflows; visibility follows security.* | Minor | **Nationality column emphasised for compliance workflows. Visibility follows your security profile.** | Slightly clearer actor (“your”); British spelling *emphasised* retained. |
| PWD table hint | *PWD column respects role-based access (sample: Restricted where view permission is missing).* | Minor | **The PWD column respects role-based access. Example: Restricted when you don’t have view permission.** | Plain language; avoids passive “permission is missing”. |
| Country packs body | *Enable packs independently per tenant...* | Pass | *(keep)* | Sets delivery expectation. |
| PWD/gender panel | *Aggregate dashboards only; sensitive fields follow DAP and role design. Targets (for example 4% KSA / 5% Egypt) are illustrative customer entries, not legal advice.* | **Critical (060)** | *(keep concept; 060 to approve exact wording)* | Strong **non-advice** framing; **060** should confirm jurisdiction examples (Egypt PWD) are OK as **illustrative** only and match localisation strategy (EN/AR per PRD). |
| Audit panel | *Immutable log of exports: user, role, timestamp, filters, definition version. Detailed run history is built in product delivery.* | Minor | Soften second sentence for customers | e.g. *Full run history will be available in a later release.* — avoids sounding like “not built yet” in a harsh way; still honest. |
| Comm panel subtext | *Email and work notifications (prototype)* | Minor | Remove *(prototype)* in GA or move to neutral footnote | Matches 320 rule: no warning **Banner** for mock; same idea — avoid “prototype” in customer-visible GA copy. |
| Comm body | *No new compliance alerts. In production, quota threshold and data-quality nudges may surface here.* | Minor | **No new compliance alerts.** (second sentence for release notes / GA variant) | Second sentence is forward-looking; fine for concept demo, trim for GA. |

---

## Error, success, and empty states

| Type | Current | Assessment | Recommended | Rationale |
|------|---------|--------------|-------------|-----------|
| Export feedback (toast) | *Export queued (CSV/XLSX). Your organisation is responsible for lawful use of this file.* | **Critical (060)** | Keep liability line; consider adding *Review your organisation’s data protection requirements before sharing.* (060 to approve) | Reinforces GDPR/privacy posture without over-claiming Workday advice. |
| Inline export confirmation | Same string in `BodyText` after download | Pass | Align with final toast wording after 060 | Single source of truth for post-export messaging. |
| Empty comm state | *No new compliance alerts…* | Pass | See table above | |

No blocking **error** patterns in scope; no generic *Error!* strings.

---

## Modal content (export)

| Element | Current | Assessment | Notes |
|---------|---------|--------------|-------|
| Title | **Export for audit** | Pass | Matches trigger control. |
| Scope paragraph | *Scope: filters applied on this dashboard (…)* | Pass | Specific; audit trail promise is clear. |
| **File format** / radio labels | **CSV (.csv)**, **Excel workbook (.xlsx)** | Pass | Sentence case; clear. |
| **Definition version** | `GCC-WFC-2026.03.21 (customer targets; not statutory advice)` | **Critical (060)** | Strong; **060** confirms version string format for legal/comms. |
| Disclaimer paragraph | *This export supports customer-operated evidence packs. It does not submit data to government portals. Your organisation remains responsible for lawful processing and regulatory filings.* | **Critical (060)** | Correctly limits portal submission and assigns responsibility; **060** to validate **PDPL/PDPA/GDPR** cross-border and **special category** implications if export includes nationality/disability. |

---

## Table headers and filter labels

| Current | Assessment | Recommended | Rationale |
|--------|--------------|-------------|-----------|
| **Candidate**, **Job**, **Nationality**, **Status**, **Data completeness**, **Last updated** | Pass | *(keep)* | Sentence case, scannable. |
| **PWD** | **Critical** | **PWD status** or **Disability status (PWD)** with glossary link | PRD uses **people with disabilities (PWD)**; first exposure should not be unexplained acronym alone (accessibility + clarity). Customer-configurable label should mirror tenant legal language (060). |
| **Requisition**, **Title**, **Location**, **Candidates** | Pass | *(keep)* | |
| **Supervisory organisation (LOB)** | Pass | *(keep)* | Matches discovery brief LOB mapping. |
| **Location**, **Period preset**, **Start date**, **End date** | Pass | *(keep)* | |
| Select options (*All organisations*, *Last 30 days*, etc.) | Pass | *(keep)* | British *organisations* ✓ |

---

## KPI card copy

| Element | Sample / pattern | Assessment | Recommended | Rationale |
|---------|------------------|--------------|-------------|-----------|
| Card titles | *Nitaqat / Saudisation % (KSA pack)*, etc. | Pass | *(keep)* | British *Saudisation*; aligns with **010** British English. |
| Gap lines | *Gap to target: −2.0 pp vs 60% (customer target)* | Minor | Consider **Gap to target: 2.0 percentage points below 60% (customer target)** on first card or tooltip | *pp* is industry shorthand; expanding once aids clarity (still use numerals). |
| Denominators | *Headcount in scope: 240* | Pass | *(keep)* | Numerals ✓ |
| Gender card | *Women in scoped population (aggregate only)* | **060 review** | *(keep pending 060)* | Aggregate-only framing matches PRD; **060** confirms non-discriminatory presentation and locale copy. |

---

## Legal-sensitive copy (060 review required)

**Invoke 060** to validate and sign off before Jira/GA on:

1. **Export modal disclaimer** (full paragraph) and **definition version** string — limitation of liability, no government submission, customer responsibility for **lawful processing** and **regulatory filings**.  
2. **Post-download toast** — *lawful use of this file* (and any strengthened privacy cross-reference if added).  
3. **Dashboard subtitle** — *customer-entered targets* / *Workday does not determine statutory rates*.  
4. **PWD / gender / nationality** — column header **PWD**, row values *Not disclosed*, *Restricted*, completeness strings (*Missing nationality*), and aggregate gender text.  
5. **PWD & gender** tab body — *illustrative customer entries, not legal advice* and **example percentages** (4% KSA / 5% Egypt).  
6. **KSA card** — *Qiwa-evidence style exports (manual submission in MVP)* — confirms no implied certified integration.

### 060 validation summary (319 pre-pass; not a substitute for Legal)

| Topic | Risk / note | Directional assessment |
|-------|-------------|-------------------------|
| **Transparency (GDPR Art 5, 13–14)** | Export may contain **nationality** and possibly **disability-related** fields | UI correctly pushes **customer** responsibility; ensure **customer privacy notice** and **lawful basis** are referenced in **admin/candidate** flows (out of this screen scope but must exist in product). |
| **Art 9 special categories** | Nationality and PWD can be sensitive depending on jurisdiction | **RBAC** and *Restricted* demo align with PRD FR-5; copy should not imply all users see PWD. |
| **Misleading compliance** | Product must not assert statutory % | **Strong** — repeated *customer target* / *not statutory advice*. |
| **Cross-border / regulatory** | GCC filings | Disclaimer that **no portal submission** is appropriate for MVP. |

**060 outcome placeholder:** Pending formal **Legal Advisor** review — **do not finalise** export or PWD/gender strings for production without **060** confirmation.

---

## Terminology consistency

• **Candidate**, **requisition**, **Reporting** — consistent with Recruiting language.  
• **Saudisation** (UK) used in UI — consistent with **010** British English; PRD uses US *Saudization* in places — keep UI as **Saudisation**.  
• **LOB** appears as abbreviation in filter and modal scope; paired with **Supervisory organisation (LOB)** — acceptable.  
• **Prism** appears in body copy (*Reporting/Prism*); buttons say **Open in Reporting** — acceptable if Prism is secondary; consider one aligned phrase if both are equal entry points.

---

## Overall assessment

Copy is **largely publication-ready** from an Editorial Guidelines perspective: **sentence case**, **active voice**, **numerals** in metrics, and **clear customer-owned targets**. The **export flow** is the highest-risk surface: disclaimers are **well oriented** but need **060** final wording. The largest **product copy gap** is the bare **PWD** column header — expand or configurable per tenant policy after **060**. Apply **quick wins** (*Download export*, **and** instead of **&** in key labels, tighten meta “prototype” strings) when iterating the prototype before **330** capture and **430** story text.

---

## Handoff

• **320:** Implement agreed string updates in `design/gcc-nationalisation-compliance-v44.tsx` after PM/060 decisions.  
• **060:** Formal sign-off on rows marked **Critical** in this document.  
• **430:** Mirror final UI strings in Jira **Description / AC / BDD** per **319** + **060**.

---

**Artifact path:** `design/gcc-nationalisation-compliance-v44-copy.md`
