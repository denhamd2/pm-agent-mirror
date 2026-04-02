# Customer Ideation Hub Analysis (106): India PMF Triangulation

**Analysis date:** 01 April 2026  
**Mission:** INDIA-PMF-006 (Regional E2E Step 5)  
**Purpose:** Validate **105** SME + customer themes against global P&T ideation survey data; surface net-new regional signals for **@pmf-analyst** triangulation and **130** Ideation Hub slides.

---

## Fresh pass attestation

- **Mission ID:** INDIA-PMF-006
- **Target region:** India (analysis uses global P&T export; content filtered to **Talent Acquisition** as below)
- **105 inputs read (this run):**
  - `research/India/105-sme-research-findings.md`
  - `research/India/105-user-research-findings.md`
- **P&T Idea Results Dashboard source(s):**
  - `research/brainstorm-sessions/dump.txt` (flattened text export embedding workbook **`P&T Idea Results Dashboard_03_30_2026 10_11 AM.xlsx`**; the `.xlsx` file is not present as a separate file in the repo folder, only this dump)
- **Scratch regen (optional tooling):** `python3 scripts/dump_research_folder_to_text.py research/brainstorm-sessions/ -o research/India/brainstorm-analysis/_scratch-pt-sources-INDIA-PMF-006.md` (folder currently contains `.txt` only; scratch file lists parsed sections)
- **Sheets used (from embedded export):** Product Capability Volume, Sentiment and Effort (Talent Acquisition linked filter); Idea Question Responses (verbatim excerpts); Capability Areas of Focus (Sentiment by Effort); Total Sentiment; Filtered Idea Volume; Customer Idea (sample row)
- **Completed (UTC):** 01 April 2026

---

## Ideation Hub Overview

- **N:** **10,016** ideas (dashboard **Filtered Idea Volume** and **Product Capability Volume, Sentiment and Effort** with linked filter **Product Features Model: Talent Management → Talent Acquisition**)
- **Source:** P&T Idea Results Dashboard (Qualtrics content provider `copper.qualtrics.io`, Workday Production project); **date run / exported:** 30 March 2026 10:11 AM
- **Scope note:** Figures below are **not** all-product (N≈51k on unfiltered product-line views); they reflect the **Talent Acquisition** slice only, which matches Recruiting PMF use.
- **Total sentiment gauge (same filter):** **-0.163** (slightly negative aggregate on the **Total Sentiment** widget)
- **Total effort (product line roll-up):** **-1.229** with band **Hard** (Talent Acquisition row on product-line summary)

**Interpretation:** Customer ideation volume is concentrated in a relatively small set of Recruiting capabilities; sentiment and effort scores skew **negative / hard**, consistent with **105** narratives on operational pain at scale.

---

## Pass 1: Theme validation matrix (105 → P&T capability)

Linked filter: **Talent Management → Talent Acquisition**.  
**Volume** = count of ideas tagged to that capability topic. **Sentiment** and **Effort** = dashboard model scores (more negative effort aligns with **harder** perceived workaround burden in the export).

| # | 105 theme (India brief) | Closest Product Capability (model topic) | Volume | Sentiment | Effort |
|---|-------------------------|------------------------------------------|--------|-----------|--------|
| 1 | High-volume hiring at scale | **Mass Action Capabilities** | 374 | -0.106 | -0.905 |
| 2 | Know Your Candidate / identity fraud / Aadhaar / dedupe | **Candidates and Prospects** | 1,220 | -0.204 | -1.538 |
| 3 | Local job boards / Naukri integration | **Job Postings** | 447 | -0.212 | -0.962 |
| 4 | Offer and BGV workflows | **Offers and Employment Agreements** (BGC: **Background Checks and References**, 199 vol., -0.221 / -0.459) | 926 | -0.248 | -1.533 |
| 5 | WhatsApp / mobile-first engagement | **Communications and Notifications** | 1,464 | -0.359 | -1.473 |
| 6 | Agency management | **Agencies** | 176 | -0.262 | -1.094 |
| 7 | Document management | **Candidate Job Application Flow** (attachments, apply-time documents) | 1,405 | -0.209 | -1.132 |

**Cross-walk to 105 synthesis**

- **SME + customer alignment:** High-volume pain maps to **Mass Action** plus very high volume on **Candidate Job Application Flow**, **Job Requisitions** (1,407; -0.224 / -1.034), and **Candidates and Prospects**; ideation intensity supports **105** emphasis on automation and bulk intelligence.
- **KYC / dedupe:** No standalone “duplicate management” row appears in this model taxonomy; **Candidates and Prospects** is the closest match for record-level identity and dedupe friction; **Compliance and Data Privacy** (851; -0.265 / -1.259) supports consent and policy-heavy **Know Your Candidate** angles from **105**.
- **Job boards:** **Job Postings** is the direct analogue for distribution and posting mechanics (India-specific boards such as Naukri appear in strategy context, not in model labels).
- **Offers / BGC:** **Offers and Employment Agreements** carries high volume and **hard** effort; **Background Checks and References** is the companion capability for BGV volume (lower N but same negative sentiment), matching offer-letter and BGC orchestration pain in **105**.

---

## Capability prioritisation quadrant (Capability Areas of Focus)

From the **Capability Areas of Focus (Sentiment by Effort)** sheet description: bubble **size = volume**, **x ≈ effort**, **y ≈ sentiment**. The dashboard narrative calls out **Communications and Notifications** and **Job Requisitions** among the **largest bubbles**.

**High-pain / high-work quadrant (for Recruiting ideation):**

- Capabilities with **large volume**, **negative sentiment**, and **strongly negative effort** include **Communications and Notifications**, **Candidates and Prospects**, **Offers and Employment Agreements**, **Interviews**, and **Career Sites** (all **Hard** effort band on the primary VSE table).
- **Implication for India PMF:** Prioritise **actionable notifications**, **candidate grid / profile efficiency**, **offer agility**, and **interview scheduling friction** alongside **105**-specific KYC and agency-attribution themes.

---

## Customer voice (representative ideation verbatims)

Strings below are taken from embedded **Idea Question Responses** / **Customer Idea** text in `dump.txt`. They illustrate **Workaround**-style pain and **business value** intent; they are **global**, not India-only.

### Theme 1: High-volume hiring / mass operations

- **Mass actions:** “Mass Action Buttons: Provide options to Add Remove or Replace” (business value framed around time savings and operational efficiency; snippet sits alongside Financial Aid wording in source row, Recruiting-adjacent pattern only).
- **Candidate review density:** “It would be much more efficient if the candidate notes could be visible on the candidate grid on the job requisition… hiring managers could quickly glance at a number of candidates.”

### Theme 2: Know Your Candidate / compliance / data use

- **Multi-jurisdiction compliance:** “Due to the EU US and Canada Pay Transparency laws and also conflicting data retention rules between countries we need to be able to determine which location the candidate is applying to.”
- **Application structure:** Proposal to use templates, validation, and candidate-selected country when **multiple posting locations** exist (supports reporting and retention logic).

### Theme 3: Job postings / locations

- “As a global organization we often post jobs in more than one Location… Primary Location in Switzerland… other locations… (e.g. the US or China).”
- Workaround tension: prescreening questions are **not** sustainable when reporting must track answers across changing location sets.

### Theme 4: Offers / compensation visibility

- “allow configuration such that ‘View Worker Current Compensation’ (and/or offer comp components) is granted only when the viewer has a defined relationship to an active candidacy on a specific requisition… automatically revoked when the candidacy is no longer active.”
- **Business value:** “Faster internal recruiting decisions… Improved audit/compliance outcomes.”

### Theme 5: Communications / channels

- “By default it sends to the work email for internal candidates we would like the option to send to home email for Internals. A toggle that lets us choose that would be ideal.”

### Theme 6: Agencies (indirect)

- No clean standalone **agency fee / source attribution** verbatim surfaced in the extracted text window; **105** remains primary for agency duplicate and payment exposure. Ideation **Agencies** capability still shows **176** responses with **hard** effort (-1.09).

### Theme 7: Document management / apply flow

- **Customer Idea row:** “.msg resume attachment types are not supported by HiredScore and causes the candidate to not be graded… helpful for Workday to prevent unsupported attachment types from being uploaded during Apply.”
- Aligns with **105** document capture, parser accuracy, and attachment-type governance (triangulate with HiredScore activation narrative).

---

## Pass 2: Net-new regional signals

**Method:** Searched full `dump.txt` for **India**, **Aadhaar** / **Aadhar**, **Naukri**, **APAC**, **DPDP**, and related tokens.

**Finding:** **No verbatim hits** for **India**, **Aadhaar**, or **Naukri** in this export. **Pass 2** therefore **does not** surface India-named ideas from the text; treat **105** India themes as **primary** for geography-specific signal, and use ideation below as **hypotheses to validate** in India interviews.

**Net-new (not mapped in Pass 1 theme rows), region- or jurisdiction-flavoured**

- **Multi-location posting + pay transparency / retention:** EU, US, and Canada called out explicitly; **China** appears as an example secondary location. Relevant to **105** requisition truthfulness and reporting, but **not** India-specific in source text.
- **Internal candidate notification channel:** work vs home email preference (may interact with **105** marketing consent / reach themes).
- **Skills / assessment consistency:** snippet on inability to “offer a consistent experience” across Skills applications (product scope beyond core India brief; flag for PMF if Skills overlaps hiring journey).

**Recommendation for @pmf-analyst:** Add **Customer Ideation Hub (106)** column noting **quantitative reinforcement** on Talent Acquisition pain (N=10,016, negative sentiment) and **qualitative gap** on **India-named** ideation in this export, so **105** India evidence retains geographic authority.

---

## Handoff

- **Primary output path (this run):** `research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis-INDIA-PMF-006.md`
- **Next:** **@pmf-analyst** merges this file with `105-sme-research-findings.md`, `105-user-research-findings.md`, strategy context, and CI for **INDIA-PMF-006** triangulation; **130** may cite Ideation Hub overview and theme validation table for deck Section Ideation Hub.

---

**Remember (106):** Ideation data **amplifies** validated interview themes; net-new items without **105** backing remain **hypotheses** until validated.
