# Win-Loss Analysis (107) — GCC folder ingest

**Date:** 25 March 2026  
**Mission:** GCC-E2E-020 (Step 2.75)  
**Analyst role:** Win-Loss (107) — buyer-reported gaps from opportunity tracking, not verified product fact.

## Scope and data caveat

- **Source:** `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (flattened for this run to `research/GCC/win-loss-analysis/_scratch-winloss-sources.md`).
- **Shape:** Tabular **Opportunity Detail** export with **598** gap rows. **Opp Segment** is predominantly **North America (532)**; **EMEA (29)**; **APAC (25)**; other segments are minimal.
- **GCC signal (refined):** A case-insensitive scan of **Gap Name**, **CI Notes**, **Pain point(s)**, **Country Specific Gap Detail**, **Proposed Solution**, and **Functionality Requirement** for GCC, Middle East, Saudi, UAE, KSA, Qatar, Kuwait, Gulf, MENA, Oman, Bahrain, Emirates, Kingdom yields **one** row with a **substantive GCC** reference: **PG-00009165** (Outlook / Teams / HiredScore scheduling for **GCC** populations). A second row (**PG-00005541**, **Won**) matched only because the token **mena** appears as a **substring of "amenable"** in **CI Notes** (false positive). **Do not** treat that row as GCC evidence. **Win-Loss (107)** for **120** should therefore weight **GCC-specific** win-loss colour as **very low** unless supplemented with GCC transcripts.
- **Stage proxy:** **Won** / **Lost** used as win vs loss; **Open**, **Qual Out** as in-flight; **Do Nothing**, **Closed**, merged opportunities as stalled or closed without a simple win-loss read.

## Executive summary

• **Deal stages (all rows):** **Won** 179, **Open** 136, **Do Nothing** 107, **Lost** 96, **Closed** 39, **34- Merged Opportunity** 28, **Qual Out** 13. Loss bucket is sizeable enough to contrast with won on severity and themes.  
• **Highest-friction capabilities** (especially in **Lost** and in-flight): **Screening and Assessments**, **Candidate Job Application Flow**, **Job Application Process**, **Interviews**, **Career Sites**, **Candidates and Prospects** (empty or multi-value capability strings also appear; interpret with care).  
• **Loss-associated severity** skews toward **Risk of Deal Loss (3)** and **Significantly Contributed to Deal Loss (1)** more than **Won**; won deals still carry many **Risk of Removal of SKU** and **3rd party / custom** severity labels, i.e. gaps absorbed while still closing.  
• **Competitor and adjacent product mentions** (buyer narrative in notes): **Greenhouse**, **Lever**, **LinkedIn**, **Indeed**, **iCIMS**, **Phenom**, **Paradox**, **SmartRecruiters**, **Taleo**, **SAP** / **SuccessFactors**, **Broadbean**, plus point solutions (**eArcu**, **Clinch**, **CareerPlug**) in loss anecdotes.  
• **For GCC PMF:** Use this file as **secondary** win-loss colour; **one** substantive GCC keyword row only. Validate any **True Gap** claims via **101** and Deployment Agent.

## Deal inventory

| Source | Rows | Format | Notes |
|--------|------|--------|-------|
| `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` | 598 | `.xlsx` (Sheet 1) | Global opportunity gaps; stage and ACV bins included |

**Stage buckets used in this report**

| Bucket | Stages included | Row count |
|--------|-----------------|-----------|
| Win | Won | 179 |
| Loss | Lost | 96 |
| In-flight | Open, Qual Out | 149 |
| Stalled / closed | Do Nothing, Closed, 34- Merged Opportunity | 174 |

**EMEA subset (regional proxy, not GCC-specific):** 29 rows — **Open** 9, **Lost** 8, **Won** 6, **Do Nothing** 3, **Closed** 2, **Qual Out** 1.

**Substantive GCC keyword row (illustrative):**

| Gap Name | Stage | Opp Segment | Pain point(s) (truncated) |
|----------|-------|-------------|---------------------------|
| PG-00009165 | Open | North America | GCC High populations cannot use WD's integrations with Outlook for interview scheduling or MS Team's HiredScore experience. |

**False positive note:** **PG-00005541** matched a naive **MENA** token only via **"amenable"**; excluded from GCC row list above.

## Buying criteria hierarchy

Derived from **Severity**, **Type of Gap**, **Functionality Requirement**, **Pain point(s)**, and **Proposed Solution** fields. Frequencies are **qualitative** (row-level gaps, not weighted by ACV).

**Must-have / deal-breaker signals (buyer-reported)**

• **Candidate experience parity:** Multi-step apply vs competitors' shorter flows; legal JD attachment to adverts; consent placement (e.g. jurisdiction-specific expectations). **[WinLoss-BX-01]**  
• **High-volume frontline / retail screening:** Throughput, disposition from resume view, automation expectations vs HiredScore positioning. **[WinLoss-HV-02]**  
• **Native vs paid add-on:** E-signature, assessments, scheduling depth; buyers compare **included native** bundles to competitors. **[WinLoss-COST-03]**  
• **Integrations:** LinkedIn Quick Apply, job board branding (Google / SEO), Outlook / Teams scheduling in certain populations. **[WinLoss-INT-04]**

**Important**

• Interview orchestration (site visits, compliance forms, travel) for specialised hiring (e.g. healthcare physician paths). **[WinLoss-INTV-05]**  
• Reapply rules and candidate data update workflows. **[WinLoss-DATA-06]**  
• Manager self-service on requisitions and AI-assisted JD creation. **[WinLoss-MSS-07]**

**Nice-to-have**

• Dynamic job posting content by location search; rules-based interview templates to reduce per-req data entry. **[WinLoss-JP-08]**

## Win themes

Why buyers still **Won** despite gaps (themes from **Won** rows and CI notes):

• **Willingness to partner:** Clinch, Paradox, or other front doors accepted to compensate for multi-page Workday apply; deal closes with integration path documented. **[WinLoss-W-PART]**  
• **Regulatory / legal imperative:** Country-specific consent ordering (example narrative: Korea) where workaround risk is unacceptable; Workday still selected with gap logged. **[WinLoss-W-LEGAL]**  
• **Volume and roadmap trust:** Retail / high-volume concerns on HiredScore fit expressed, yet expansion or land motion proceeds with plan to address automation. **[WinLoss-W-ROAD]**  
• **Competitive displacement narrative:** Explicit comparison to **Greenhouse** / **SmartRecruiters** with decision to standardise on Workday suite. **[WinLoss-W-SUITE]**

## Loss themes

Why deals **Lost** or where loss severity dominates (illustrative quotes are **buyer / CI narrative**):

• **Job advert and JD delivery:** Competitor (**eArcu** cited) supports downloadable full legal JD from advert; Workday forces long adverts or external links; **candidate attraction** cited as harmed. **[WinLoss-L-JD]**  
• **Candidate review UX:** Too many clicks; cannot disposition directly from resume PDF bundle; streamlining expected vs other ATS patterns. **[WinLoss-L-UX]**  
• **Bundled e-signature:** Extra cost for DocuSign / Adobe vs competitor **native** e-sign called out as cost and competitiveness issue. **[WinLoss-L-SIGN]**  
• **Reapply configuration:** Manual burden and poor candidate experience under either setting (allow vs block reapply). **[WinLoss-L-REAP]**  
• **LinkedIn / board experience:** Quick Apply and seamless apply from LinkedIn framed as gap vs other vendors. **[WinLoss-L-LI]** (see also in-flight rows)

## Competitive factor matrix

Rows are **factors**; cells summarise **buyer-reported** evidence density in this extract (not market share).

| Factor | Win (179 rows) | Loss (96 rows) | Mixed / in-flight note |
|--------|----------------|----------------|-------------------------|
| Candidate apply length / CX | Paradox, Clinch mitigations in won narratives | Long advert / JD, apply friction in losses | LinkedIn Quick Apply common in open rows |
| Screening / high volume | HiredScore fit questioned but deal still won in some retail stories | Assessment / reapply / resume UX in losses | Screening appears often in open pipeline |
| Interview scheduling | — | — | Outlook / Teams / HiredScore constraint noted for **GCC** row (Open); **single substantive row** |
| Career site / SEO / brand | Won with partner front door | Google branding / scraping concerns in mixed rows | Phenom / Paradox comparisons in notes |
| Third-party vs native | Won with accepted integrations | e-signature, eArcu, CareerPlug cited in losses | Broadbean cost / disappointment in narratives |
| Suite / ecosystem | Standardisation wins | Point solution superiority on specific feature | SAP / SuccessFactors sparse mentions |

## Perception vs fact

• All capability claims and competitor strengths in this export are **buyer or CI perception** captured at opportunity stage.  
• **101** remains authoritative for **Native / Workaround / True Gap** after Deployment Agent and matrix validation.  
• **GCC-specific** conclusions must not be inferred from this file alone (**1** substantive keyword row; **532** NA rows).

## Implications for product roadmap (hypotheses)

• **Hypothesis 1:** Shorten or de-risk **apply** journeys (hosted + partner) where losses cite **page count** and **LinkedIn** parity.  
• **Hypothesis 2:** **Job advert** attachments for legal JDs and **clear download** paths may reduce **loss** narratives vs point ATS features.  
• **Hypothesis 3:** **High-volume disposition** from resume / list views aligns with retail loss themes and **120** candidate-density themes; validate with **105**.  
• **Hypothesis 4:** **Scheduling** constraints for populations relying on **Outlook / Teams** (including the **GCC**-referenced row) merit functional validation, not assumption as universal gap.

## Sales enablement hooks (for **101** battle-card follow-up)

• Pair **JD / advert** story with a **document attachment** or **hosted asset** playbook and competitor screenshot discipline.  
• **E-signature** TCO story: native vs integrated; who pays for DocuSign / Adobe seats at scale.  
• **LinkedIn Quick Apply** discovery question in enterprise evals; capture required integrations early.  
• **High-volume retail** discovery: confirm HiredScore scope vs hourly hiring use case.  
• **GCC / Teams / Outlook** discovery: calendar constraints and HiredScore experience in region (**one** substantive open row; expand with local win-loss).

## Link to competitive matrix (read-only)

• `research/competitive/matrices/gcc-competitive-matrix.md` — use to cross-check any roadmap narrative that cites competitors from this win-loss extract (**Greenhouse**, **Lever**, **SAP**, **LinkedIn**, **Phenom**, etc.).

## Handoff to **120** (Win-Loss 107 column)

Merge as **Win-Loss (107)** with **very low GCC row weighting**:

1. **Apply / advert / JD** friction and competitor **native** claims (**loss-heavy**).  
2. **Screening, reapply, resume disposition** (**loss** and **in-flight**).  
3. **Integration and calendar** constraints (include **PG-00009165** as **single GCC data point**; ignore substring false positives).  
4. **Partner-mediated wins** (Clinch, Paradox) as **mitigation** pattern, not elimination of core CX gaps.  
5. **EMEA** subset (29 rows) as **regional** supplement if **120** compares segments; not a substitute for GCC interviews.

## Fresh pass attestation

- **Mission ID:** GCC-E2E-020  
- **Target region:** GCC  
- **Win-loss source files read (this run):**  
  - `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (Tier 1: folder boundary; **598** rows on first sheet; **1** substantive GCC-relevant row after substring false-positive removal)  
- **Scratch dump produced (this run):**  
  - `research/GCC/win-loss-analysis/_scratch-winloss-sources.md`  
- **Files excluded (region mismatch):** None  
- **Completed (UTC):** 2026-03-25T14:45:00Z  

---

**Remember:** Win-loss and opportunity-gap narratives are **biased** by timing, champion story, and tooling. Triangulate with **105**, **106**, **101**, and **120** before treating themes as settled product truth.
