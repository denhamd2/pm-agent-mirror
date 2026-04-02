# Customer Ideation Hub Analysis: India PMF (106)

**Mission:** INDIA-PMF-004  
**Analysis date:** 01 April 2026  
**Purpose:** Triangulate **105** SME + customer themes with global P&T ideation survey (Talent Acquisition slice) for @pmf-analyst and **130** Ideation Hub slides.

---

## Fresh pass attestation

- **Mission ID:** INDIA-PMF-004
- **Target region:** India
- **105 inputs read (this run):**
  - `research/India/105-sme-research-findings.md`
  - `research/India/105-user-research-findings.md`
- **P&T Idea Results Dashboard source(s):** `research/brainstorm-sessions/P&T Idea Results Dashboard_03_30_2026 10_11 AM.xlsx`
- **Scratch / materialised text (this run):** `python3 scripts/dump_research_folder_to_text.py research/brainstorm-sessions -o research/India/brainstorm-analysis/_scratch-106-INDIA-PMF-004-sources.md`
- **Sheets used:** Product Capability Volume, Sentiment and Effort (Talent Acquisition linked filter); Idea Question Responses (structure only, see limitation); Filter by Brainstorm Question; Capability Areas of Focus (Sentiment by Effort); Total Sentiment (TA filter)
- **Completed (UTC):** 01 April 2026

---

## Ideation Hub Overview

- **N:** 10,016 ideas (dashboard **LINKED FILTER:** Product Features Model `Talent Management → Talent Acquisition`; export run **30 March 2026**)
- **Source:** Qualtrics-backed P&T Idea Results Dashboard (Workday internal export)
- **Total sentiment (same filter):** approximately **-0.163** (gauge: **Total Sentiment** sheet, Talent Acquisition linked filter)
- **Total effort (same filter):** approximately **-1.23** (interpreted as **Hard** on dashboard scale; **Total Effort** sheet)
- **Verbatim field volumes (Filter by Brainstorm Question):** Primary_Goal 7,198; Concatenated_Comments 4,545; Title 4,220; Use_Cases 1,632; **Business_Value 1,395**; Role_Benefit 1,294; **Workaround 1,030**; Proposed_Solution 752

**Method note:** The text materialisation of **Idea Question Responses** in the scratch dump consists of repeated widget metadata lines (“Feedback widget displaying verbatim in table view…”), not row-level free text. Representative **Workaround / business-value style** strings below are therefore drawn from **long-form idea text embedded elsewhere in the same workbook export** (as flattened in `_scratch-106-INDIA-PMF-004-sources.md`). This is sufficient for directional triangulation but is a **limitation** versus full row-level Qualtrics extract.

---

## Theme validation matrix (Pass 1)

**105 theme sources:** eight SME synthesis pillars plus five customer-synthesised themes (TP interviews). Below, each cluster is matched to the closest **Product Features Model** capability on **Product Capability Volume, Sentiment and Effort** (Talent Acquisition filter). **Sentiment** and **Effort** are dashboard indices (more negative = worse customer perception / harder workaround band).

| 105 theme cluster | Matched Product Capability | Volume | Sentiment (index) | Effort (index) | Alignment note |
|-------------------|---------------------------|--------|-------------------|----------------|----------------|
| Trust, identity, fraud, dedupe, candidate data quality | **Candidates and Prospects** | 1,220 | -0.204 | -1.538 | Strong volume + very hard effort: matches KYC, impersonation, profile integrity narrative. |
| BGC, documents, vendor orchestration | **Background Checks and References** | 199 | -0.221 | -0.459 | Lower volume than core ATS objects but negative sentiment; aligns with India BGC flexibility and reinitiate pain. |
| Offer, hire, date truth, compensation disclosure, e-sign gaps | **Offers and Employment Agreements** | 926 | -0.248 | -1.533 | High volume, hard effort: mirrors TP regenerate offer, compensation change, audit trail gaps. |
| Governance, reqs, approvals, org data, reporting | **Job Requisitions** | 1,407 | -0.224 | -1.034 | Matches email-first approvals, supervisory org, req lifecycle governance. |
| High-volume throughput, application flow, screening | **Candidate Job Application Flow** | 1,405 | -0.209 | -1.132 | Aligns with application volume, screening, location / prescreening complexity. |
| Candidate journey friction, notifications, comms | **Communications and Notifications** | 1,464 | -0.359 | -1.473 | Largest “high pain / hard” quadrant bubble with Job Requisitions per **Capability Areas of Focus** description. |
| Compliance, consent, data privacy | **Compliance and Data Privacy** | 851 | -0.265 | -1.259 | Supports DPDP, consent, and minimisation threads from 105 without replacing Legal review. |
| Mass hire, bulk operations, purge, scale | **Mass Action Capabilities** | 374 | -0.106 | -0.905 | Moderate volume; effort still negative. Speaks to industrial hiring and batch operations. |
| Agency, source attribution, vendor upload | **Agencies** | 176 | -0.262 | -1.094 | Smaller N but sharp negative sentiment; fits TP vendor approval and source-credit pain. |
| Career site, posting behaviour, volume noise | **Career Sites** | 663 | -0.223 | -1.447 | Connects to fake-open postings and high application counts in customer narrative. |

---

## Capability prioritisation quadrant

**Capability Areas of Focus (Sentiment by Effort)** describes a scatter where **bubble size = volume**, **x ≈ Effort**, **y ≈ Sentiment**. For Talent Acquisition, the narrative explicitly calls out the **largest bubbles** as **Communications and Notifications** and **Job Requisitions**.

**Interpretation for India PMF:**

- **High pain / high workaround quadrant:** **Communications and Notifications**, **Offers and Employment Agreements**, **Candidates and Prospects**, **Career Sites**, and **Interviews** combine **negative sentiment** with **strong negative effort** indices at meaningful volume. This reinforces **105** customer themes on **notifications, offer lifecycle, identity and candidate data friction**, and **observability**.
- **Secondary but material:** **Compliance and Data Privacy** and **Job Application Process** sit in the same directional band at high volume, supporting **governance and DPDP-aligned** product bets.

---

## Customer voice (ideation snippets)

Illustrative strings from the same P&T export (trimmed for readability). They are **not** TP P1–P5 quotes; they are **global ideation** voices that **rhyme with** 105 themes.

**Offers, compensation visibility, governance (maps to Theme 3–4 / SME offer complexity)**

> “Enable requisition-scoped visibility of internal candidate compensation in Workday Recruiting so req-support roles can view only the compensation details needed to make/validate pay decisions for internal candidates actively in process on a specific requisition without granting broad Worker compensation access or just at the offer stage… needs to be before offer task.”

**Offer process / localisation workaround (maps to India offer disclosure and timing)**

> “Maintain Localization Settings (opt-in by worker’s current country of work) to display current compensation when proposing compensation during the Offer process was suggested by Workday we already have this enabled in PROD but it does not meet our need because we need comp visibility **earlier than the Offer BP**. Workaround suggested: internal…”

**Internal candidate comms (maps to channels / consent / routing)**

> “Currently the Send Message feature does not allow us to change the contact email. By default it sends to the work email for **internal candidates** we would like the option to send to home email for Internals…”

**Application flow, screening scale, multi-location compliance (maps to throughput and reporting)**

> “When a candidate applies for the job there is no easy way for us to identify which location they are applying to… Due to the EU US and Canada Pay Transparency laws and also conflicting data retention rules between countries we need to be able to determine which location the candidate is applying to.”

**Bulk / efficiency framing (maps to mass hire and screening)**

> “Save time when screening **large amount of candidates** at once.”

---

## Net-new regional signals (Pass 2)

**Region string scan:** Full-text search of the materialised workbook export (`_scratch-106-INDIA-PMF-004-sources.md` / underlying `dump.txt`) for **India**, **Indian**, **Aadhaar** / **Aadhar**, **DPDP**, and major Indian cities returned **no hits**.

**Implications:**

- **No additional India-specific ideation themes** could be isolated from this export beyond the **global** capability matches in Pass 1.
- **Hypothesis (for validation):** India-specific language may be sparse in unstructured text, captured only in **geography metadata** not present in this flattening, or under-represented in the global brainstorm corpus relative to **105** depth.
- **Recommended follow-up:** If Qualtrics stores **country or region**, re-export with that filter; otherwise treat **105** as the **primary** India signal and 106 as **quantitative global reinforcement** of capability buckets.

---

## Handoff to @pmf-analyst

- Add a **Customer Ideation Hub (106)** column or footnote: **TA-filtered N=10,016** corroborates **hard effort + negative sentiment** on **Communications and Notifications**, **Offers**, **Candidates and Prospects**, and **Job Requisitions**, consistent with TP interviews and SME synthesis.
- Call out **data limitation:** row-level **Idea Question Responses** text not represented in scratch dump; use matrix and sampled long-form strings for deck slides, not full verbatim mining.
- Pass 2 **India-named** net-new list is **empty** for this source; do not over-claim India-specific ideation volume beyond **105**.

---

## References (internal)

- `research/India/105-sme-research-findings.md`
- `research/India/105-user-research-findings.md`
- `research/brainstorm-sessions/P&T Idea Results Dashboard_03_30_2026 10_11 AM.xlsx`
- `research/India/brainstorm-analysis/_scratch-106-INDIA-PMF-004-sources.md`
