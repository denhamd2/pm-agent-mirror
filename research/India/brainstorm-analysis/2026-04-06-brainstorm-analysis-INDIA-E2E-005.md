# Customer Ideation Hub Analysis (106): India lens – INDIA-E2E-005

**Analysis date:** 06 April 2026  
**Purpose:** Triangulate **105** SME + customer themes for India PMF with global P&T ideation volume, sentiment, effort, and verbatims (Talent Acquisition filter).  
**Method:** Two-pass protocol per `.cursor/rules/106-brainstorm-analyser.mdc`.

---

## Fresh pass attestation

- **Mission ID:** INDIA-E2E-005
- **Target region:** India
- **105 inputs read (this run):**
  - `research/India/105-sme-research-findings.md`
  - `research/India/105-user-research-findings.md`
- **P&T Idea Results Dashboard source(s):** Materialised text dump at `research/brainstorm-sessions/dump.txt` (exported from `research/brainstorm-sessions/P&T Idea Results Dashboard_03_30_2026 10_11 AM.xlsx` per dump header; no separate `.xlsx` path was present in-repo at analysis time beyond what the dump records).
- **Sheets used (from dump):** Product Capability Volume, Sentiment and Effort (Talent Acquisition linked filter); Idea Question Responses; Capability Areas of Focus (Sentiment by Effort); supporting widgets (Filtered Idea Volume, Negative Sentiment Product Capability, Total Effort).
- **Scratch / dump path:** `research/brainstorm-sessions/dump.txt` (full folder dump for agent ingestion).
- **Completed (UTC):** 2026-04-06

---

## Ideation Hub Overview

| Field | Value |
|--------|--------|
| **N** | **10,016** (filtered ideas, Talent Management → Talent Acquisition) |
| **Source** | Qualtrics / P&T Idea Results Dashboard (`copper.qualtrics.io`, Workday Production project) |
| **Export / run** | 30 March 2026, 10:11 AM (per dashboard metadata in dump) |
| **Overall sentiment (Talent Acquisition)** | **-0.163** (neutral band; ~86% of volume in neutral band, ~53% negative-labelled slice, ~40% positive-labelled slice per sentiment breakdown rows in dump) |
| **Total effort (Talent Acquisition)** | **-1.229** (gauge widget; scale in dashboard -5 to +5; negative indicates harder customer-reported effort) |

**Interpretation for India PMF:** Ideation data is **global**, not India-sampled. It **amplifies** where TA-wide pain clusters (communications, apply flow, offers, candidate record) align with **105** India themes; it does **not** replace India-specific statutory evidence (PAN, Aadhaar, UAN) from **105**.

---

## Pass 1 – Theme validation matrix (105 → Product Capability)

**105 synthesised themes** (from SME + Teleperformance India customer interviews) matched to the closest **Product Capability** rows on **Product Capability Volume, Sentiment and Effort** (TA filter, N=10,016). **Sentiment** and **effort** are dashboard model scores (negative = worse).

| 105 theme (India-relevant) | Matched Product Capability | Volume | Sentiment | Effort | Notes |
|----------------------------|---------------------------|--------|-----------|--------|--------|
| Know Your Candidate, government ID, impersonation, trust | **Candidates and Prospects** | 1,220 | -0.204 | **-1.538** | Deepest **effort** among top capabilities; fits profile / identity / candidate-record pain called out in **105**. |
| Same + compliance / consent / privacy | **Compliance and Data Privacy** | 851 | -0.265 | -1.259 | Aligns with DPDP, consent traceability, and audit narratives in **105** (customer + SME). |
| Background checks, vendor portals, double entry | **Background Checks and References** | 199 | -0.221 | **-0.459** | Lower volume than core TA objects but explicit BGC theme in SME + **105** document journey. |
| High volume apply noise, parser, required attachments | **Candidate Job Application Flow** | 1,405 | -0.209 | -1.132 | Matches **105** apply funnel hygiene and attachment grading issues. |
| Career site noise, posting behaviour | **Career Sites** | 663 | -0.223 | -1.447 | Relates to **105** “registration shell” / volume-on-posted-roles pattern. |
| Duplicate handling, agency source, mass processing | **Mass Action Capabilities** | 374 | -0.106 | -0.905 | Best relative sentiment in group but still negative; pairs with **105** bulk / FTE-on-clicks story. |
| Agency economics, vendor uploads | **Agencies** | 176 | -0.262 | -1.094 | Secondary volume; aligns with **105** P4 agency fee / approval pain. |
| Offer regeneration, comp visibility, acceptance | **Offers and Employment Agreements** | 926 | -0.248 | **-1.533** | Strong **105** match (offer lifecycle, comp, post-accept change). |
| Interview-stage comp / offer context | **Interviews** | 481 | -0.164 | -1.476 | Supports interview-Offer boundary and “know who you interview” adjacency in **105**. |
| Actionable notifications vs task floods | **Communications and Notifications** | **1,464** | **-0.359** | **-1.473** | **Highest volume** in matrix; **worst sentiment**; matches **105** P3 notification noise (even though **105** prefers SMS/WhatsApp for candidates, recruiters still need traceable comms). |

**Reference capability block (top 10 by volume, TA filter)** for audit: Communications and Notifications 1,464; Job Requisitions 1,407; Candidate Job Application Flow 1,405; Candidates and Prospects 1,220; Offers and Employment Agreements 926; Job Application Process 876; Compliance and Data Privacy 851; Career Sites 663; Interviews 481; Job Postings 447.

---

## Capability prioritisation quadrant (Sentiment × Effort)

Per **Capability Areas of Focus (Sentiment by Effort)** metadata in the dump: bubble **size = volume**; **x ≈ effort** (more negative = harder); **y ≈ sentiment** (more negative = more negative feedback).

**High-pain / high-effort corner (prioritise for India roadmap narrative when overlapping 105):**

- **Communications and Notifications** – largest complaint intensity (sentiment **-0.359**) with very hard effort (**-1.473**).
- **Offers and Employment Agreements** and **Candidates and Prospects** – both show **effort ≈ -1.53** with large volume; these directly reinforce **105** offer-change and identity / profile integrity stories.
- **Interviews** and **Career Sites** – hard effort with materially negative sentiment; useful for “interview integrity” and “apply noise” bridges to **105**.

**Relatively lower effort (still negative sentiment):** **Background Checks and References** (effort -0.46) suggests process or integration friction rather than deepest UI effort in the model; still relevant to **105** BGC double-entry.

---

## Customer voice (Idea Question Responses)

Representative **Workaround / problem / value** style strings from the **Idea Question Responses** sheet (Talent Acquisition filter), chosen to align with **105** India themes. Wording trimmed for readability; IDs preserved where present in source text.

### Know Your Candidate, apply flow, attachments, grading

- **Attachment types at apply (HiredScore grading):** “`.msg` resume attachment types are not supported by HiredScore and causes the candidate to not be graded… helpful for Workday to prevent unsupported attachment types from being uploaded during Apply.” (refs 744981, 744985 in dump)
- **Business value (comp visibility in recruiting context):** “Deliver segmented/conditional security for compensation based on recruiting context… granted only when the viewer has a defined relationship to an active candidacy on a specific requisition… automatically revoked when the candidacy is no longer active.” (743219)

### Multi-location apply / screening (echoes **105** cost-centre / posting ambiguity)

- “We often post jobs in more than one Location… when a candidate applies… no easy way to identify which location they are applying to. Workday recommends prescreening question… would have to create calculated fields… update reports every time. This is not a sustainable solution.” (742323)

### Job application validation (echoes **105** hard gates on IDs / country)

- “Allow us to create custom sections/fields for the Job Application… validation rules… Job Application Template… multiple countries… candidate… select the country where they are applying… validation that checks the countries that are posted… Or… dynamic and the list only shows the Countries that are on the requisition.” (743105)

### Privacy / retention (echoes SME + **105** audit and consent)

- “Data Privacy and Legal especially in the US where we have to retain all data related to a job requisition… Recruiter and Hiring Manager… Candidates… good candidate experience.” (743108)

### Mass / bulk friction (adjacent to **105** mass offers and operational scale)

- “No functional equivalent for Business Process Security Policies… manually navigate into every single Business Process definition… 80+ BPs… 180+ policies…” (security admin scale; illustrates why **105** mass-offer and bulk gaps hurt at BPO scale even when verbatim is security-framed)

---

## Pass 2 – Net-new regional signals (India name mentions)

**Method:** Full-text scan of `research/brainstorm-sessions/dump.txt` (entire P&T dump) for explicit region markers: `India`, `Indian`, `Aadhaar` / `Aadhar`, major Indian cities, `DPDP`, standalone `APAC`, etc.

**Finding:** **Zero** occurrences of **India**, **Indian**, **Aadhaar**, or Indian city names in the dump text. Substring checks for `APAC` and `GST` matched only inside unrelated English words (e.g. **cap**acity, amon**gst**), not geographic tokens.

**Implications:**

- No **net-new India-specific product ideas** can be attributed from this P&T export via Pass 2 name-based discovery.
- **105** remains the authoritative source for **India statutory and operating model** detail (PAN, Aadhaar OTP, UAN, six-day week / maintenance, agency scale).
- Ideation **still validates directionally** that global TA customers pile volume into **communications, candidate record, apply flow, and offers** with **strong negative sentiment and effort**, which **supports prioritisation** of India themes already in **105**, but is **not** a substitute for India-only validation.

**Hypotheses to validate (not from P&T India mentions):** If future Qualtrics exports add country or tenant region fields, re-run Pass 2 against filtered India rows; until then, treat any India ideation claims as **needs primary research**.

---

## Summary for @pmf-analyst / 130 (Ideation Hub column)

- **Triangulation strength:** **High** between **105** (KYC, volume, duplicates, offers, comms) and P&T **capability-level** clusters, especially **Communications and Notifications**, **Candidates and Prospects**, **Offers and Employment Agreements**, and **Candidate Job Application Flow**.
- **Triangulation gap:** **No verbatim India anchor** in this export; deck language should cite **105** for India evidence and P&T for **global ideation scale** (N=10,016, sentiment -0.163, effort -1.229).
- **Next step:** Optional refresh if a newer `P&T Idea Results Dashboard_*.xlsx` is added under `research/brainstorm-sessions/` with region tags; rerun `scripts/dump_research_folder_to_text.py` and replace this analysis for the mission.

---

*End of 106 brainstorm analysis (INDIA-E2E-005).*
