# Win-loss analysis (107): Opportunity Detail extract

**Analysis date:** 22 March 2026  
**Mission:** GCC-E2E-014 (GCC E2E Step 2.75)  
**Primary source:** `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (Sheet 1)  
**Scratch ingestion (this run):** `research/GCC/win-loss-analysis/_scratch-winloss-sources.md` (produced via `scripts/dump_research_folder_to_text.py`)

## Executive summary

• **Dataset shape:** 598 gap-level rows across 432–433 distinct opportunities; one sheet (`Sheet 1`) with 34 columns including `Gap Name`, `CI Notes`, `Pain point(s)`, `Proposed Solution`, `Country Specific Gap Detail`, pipeline stage, and gap taxonomy.  
• **Geographic coverage:** **532 rows** are `Opp Segment` = North America; **29** EMEA; **25** APAC; only **one** row matched GCC/MENA keyword patterns in free text (GCC, UAE, KSA, MENA, localisation, Qiwa, etc.). **31** rows flag `Is International Gap` as yes-like values. **Implication for 120 (GCC):** treat this extract as **global competitive and buying-criteria signal**, not as dense **GCC-local** win-loss evidence. Triangulate with **105** customer transcripts and **106** brainstorm outputs for GCC-specific pain.  
• **Outcomes (pipeline):** **179** Closed/Won, **96** Closed/Lost to Competition, **107** Closed/Lost to Do Nothing, plus smaller open/merged/historical counts. Losses split roughly evenly between **competitive displacement** and **no decision**, which matters for roadmap prioritisation (parity gaps vs. value narrative).  
• **Dominant gap type:** **Feature** gaps dominate won, lost-to-competition, and lost-to-do-nothing cohorts; **Integration** appears in all outcomes; **Regulatory/Compliance** is rare in this slice but shows up in competitive losses.  
• **Competitive narrative:** Buyer-facing **CI Notes** reference incumbents and alternatives including **Greenhouse, iCIMS, Indeed, LinkedIn, NeoGov, eArcu, ClearCompany, Dayforce, Phenom, Eightfold, Ashby**, and **Workday** itself (often in workaround or comparison context). Claims are **buyer or CI perception**, not validated product fact (**101** / Deployment Agent should classify Native / Workaround / True Gap).

## Deal inventory

| Source | Rows | Inferred outcome (from `Opp Pipeline Stage`) | Notes |
|--------|------|-----------------------------------------------|--------|
| `Opportunity Detail.xlsx` | 598 | See counts below | Gap-level grain; multiple gaps per opportunity possible |

**Pipeline stage counts (rows):**

| Stage bucket | Count |
|--------------|------:|
| 9- Closed/Won | 179 |
| 31- Closed/Lost to Do Nothing | 107 |
| 30- Closed/Lost to Competition | 96 |
| 4- Pre-Close | 33 |
| 50- Closed/Historical Data Only | 32 |
| 34- Merged Opportunity | 28 |
| 0- Upcoming | 27 |
| Other (Qualify, Engage, Selected, Negotiate, etc.) | 96 |

**Segment (rows):** North America 532, EMEA 29, APAC 25, other small labels 12.

**Industry (`Acct Super Industry`, top):** Technology & Media, Professional & Business Services, Public Sector, Retail, Manufacturing, Financial Services, Healthcare (among others).

**Deal motion (top):** Prospect – Land with Core; Core Customer – Expand with Other / Non-Core; renewal and uplift motions present.

**GCC / regional note:** EMEA-tagged opportunities in this file are **primarily European names** (e.g. France, UK, Austria/CEE) in the visible sample, not a GCC roster. **Do not** equate EMEA segment with GCC PMF without **105**/**101** corroboration.

## Buying criteria hierarchy

Themes are inferred from **`Pain point(s)`**, **`Functionality Requirement`**, **`CI Notes`**, **`Headliner Feature`**, and **`Gap Summary`**. Frequencies are **qualitative** (repeat mentions across rows, not statistical modelling).

**Must-have / deal-breaker signals (buyer-reported)**

• **Feature parity vs incumbent ATS:** Ability to match a capability the buyer already has (e.g. automated prospect profiles from LinkedIn Recruiter, list-of-eligibles style workflows, document storage and candidate download patterns, offer e-sign without forcing candidate account creation).  
• **Integrations:** Dependencies on **Indeed**, **LinkedIn**, and other talent channels framed as **blocking** when the buyer believes another vendor satisfies the workflow end-to-end.  
• **Workflow ownership:** Req-level approval flexibility, who can swap approvers, and **who “owns” configuration** compared to incumbents (e.g. Greenhouse examples in CI Notes).

**Important**

• **AI / talent marketing:** References to **Phenom**, **Eightfold**, and similar as the comparator for “AI features” or front-door experience (often in **won** opps as a gap to address, not only losses).  
• **Candidate and career experience:** Career site quality, chatbot, and **interview scheduling** called out as areas where “other competitors” are perceived as ahead (often third-party vs native delivery).  
• **Enterprise TA structure:** Interview teams tied to **job profiles or supervisory org** rather than per-requisition manual setup (called out favourably vs Greenhouse in **won** CI Notes).

**Nice-to-have**

• UX affordances (e.g. **scrolling through CVs** in incumbent vs Workday flow) cited in competitive comparisons; often presentation-layer but emotionally salient in evaluations.

**Label:** All of the above are **buyer or internal CI perception** until **101** validates.

## Win themes [WinLoss-W01–W04]

**[WinLoss-W01] Suite and enterprise TA depth**  
Won opportunities still record many **feature** and **integration** gaps, but the deal closes: pattern consistent with **platform breadth**, existing Workday footprint, or expand motions (`Deal Motion` skews to Core expand / land with core). **Triangulation:** align with **105** on whether GCC buyers weight suite the same way.

**[WinLoss-W02] Differentiation on org-scoped recruiting configuration**  
Example CI theme: interview teams assigned to **profiles or supervisory org** vs requisition-by-requisition maintenance in a point ATS. **Sales hook:** reduce admin load for large, templated hiring.

**[WinLoss-W03] Honest gap registration alongside win**  
Won rows still mention **Greenhouse**, **Phenom**, **Clinch**, etc., as **front door** or capability benchmarks. Indicates **winning while acknowledging parity gaps**; roadmap and CSM narrative must address listed gaps post-sale.

**[WinLoss-W04] Integration and partner ecosystem as answer**  
Some **won** notes point to **partner or third-party** solutions (e.g. scheduling, sourcing). **Risk:** over-reliance on partners where buyers compare “delivered in product” vs “orchestrated via ecosystem.”

## Loss themes [WinLoss-L01–L05]

**[WinLoss-L01] Incumbent “already does X”**  
Losses to competition often cite **iCIMS, ClearCompany, eArcu, Greenhouse, NeoGov** with a **specific workflow** (prospect automation, document storage, offer e-sign, req-level approvals, public-sector list workflows). **Product implication:** sharpen **parity roadmap** and **migration messaging** for those workflows.

**[WinLoss-L02] Channel and integration attribution**  
Example: constraint described as **Indeed integration** limitation affecting multiple ATSs. **Risk:** losses attributed to Workday when the buyer’s root cause is **integration or policy**. **101** should validate where Workday is Native vs Workaround.

**[WinLoss-L03] Candidate / offer experience**  
Friction vs incumbents on **offer delivery and signing** (e.g. no candidate account for Docusign flow as described in notes). **Compliance note:** any offer-flow change for GCC must go through **060** (regional labour and e-sign norms).

**[WinLoss-L04] Specialised public-sector hiring**  
**NeoGov**-style **list of eligibles** and public hiring patterns appear as **specialist** competition. **Implication:** segment-specific plays (US public sector in this data); **GCC** relevance only if **105** surfaces similar government hiring patterns.

**[WinLoss-L05] Lost to Do Nothing**  
Large **107** “do nothing” cohort suggests **budget, timing, ROI, or internal paralysis** as often as **competitive defeat**. Roadmap and GTM should separate **parity losses** from **no-decision** (enablement: ROI, adoption, quick wins).

## Competitive factor matrix

Factors are **buyer-reported themes** from CI Notes and related fields. Cells summarise **this dataset only**.

| Factor | Win (evidence summary) | Loss (evidence summary) | Mixed / Do Nothing |
|--------|-------------------------|-------------------------|--------------------|
| Feature depth vs point ATS | Wins despite listed gaps; org-scoping called out as strength | Loss when incumbent matches specific workflow | Do nothing often still **Feature**-typed gaps (priority stall) |
| Integrations (Indeed, LinkedIn, etc.) | Some wins with partner/ecosystem framing | Loss when buyer believes incumbent or stack solves workflow | Unclear priority / stalled |
| Career site / candidate UX | Wins note competitor strength; Workday wins on broader deal | Competitive losses reference **better career site / chatbot** elsewhere | Similar |
| Interview scheduling | Competitors perceived “delivered” vs third party | Cited in comparative disadvantage | Stalls possible |
| AI / talent marketing | Phenom/Eightfold as benchmark in won and open contexts | Less dominant in loss sample than feature parity | AI gaps in some DN rows |
| Offer / e-sign experience | — | Greenhouse-style flows cited | — |
| Public / regulated hiring | — | NeoGov-style specialism cited | — |

## Perception vs fact

All competitor claims and capability statements in this file are **buyer or CI notes (perception)**. Before roadmap commitment:

• **101** should map items to **Native / Workaround / True Gap** on `research/competitive/matrices/gcc-competitive-matrix.md` where GCC-relevant.  
• **Deployment Agent** validation recommended for disputed workflows (e.g. Indeed constraints, offer signing, LinkedIn Recruiter integrations).

## Implications for product roadmap (hypotheses)

Hypotheses for **120** to test against **105** / **106** / **101**, not decisions:

1. **Parity backlog clustering:** Group gaps by **incumbent-named workflow** (offer e-sign, prospect automation, req-level approvals, document storage) for faster battle-card and roadmap alignment.  
2. **Integration narrative:** Separate **true product gap** from **integration or policy** limitation to reduce false losses in win-loss reviews.  
3. **Candidate experience bundle:** Career site, chatbot, and scheduling repeatedly appear as **comparison axes**; evaluate **delivered vs partner** strategy per region.  
4. **GCC weighting:** This extract **under-samples GCC**; any GCC roadmap bet from win-loss alone would be **under-powered**. Use **105** qualitative themes and **101** GCC scan as primary.

## Sales enablement hooks (for **101** battle-card follow-up)

• **vs Greenhouse:** Org-scoped interview teams and enterprise HCM footprint vs point-ATS flexibility (validate claims).  
• **vs iCIMS / mid-market ATS:** Workflow-by-workflow parity checklist (state automation, integrations).  
• **vs NeoGov / public sector:** Segment-specific discovery; avoid generic ATS talk tracks.  
• **Indeed / LinkedIn:** Pre-brief SE on **integration boundaries** and documented workarounds to avoid misattributed losses.  
• **Do nothing:** Pair technical gaps with **business case and adoption** assets to address the 107 DN cohort.

## Handoff to 120 (PMF triangulation)

**Win-Loss (107) column – suggested merge:**

1. **Coverage caveat:** Sparse **GCC-specific** rows; position as **global Workday Recruiting deal friction** and **competitive comparison patterns**.  
2. **Triangulate:** Strongest GCC PMF themes should still come from **105** (customer transcripts) and **106** (brainstorm); use **107** to stress-test **parity vs specialist ATS** and **do-nothing** dynamics.  
3. **Competitive landscape:** Cross-check **101** matrix and latest `gcc-competitive-scan-*-GCC-E2E-014.md` (when present) against **incumbent names** and **gap types** here.  
4. **Tags for matrix:** Feature, Integration, Regulatory/Compliance (rare here), Business Process, AI – map to thematic codes in **120**.  
5. **Bias reminder:** Win-loss and CI notes reflect **sampling, timing, and champion narrative**; per **107** rule, do not treat as sole truth.

## Related competitive artefact (read-only)

`research/competitive/matrices/gcc-competitive-matrix.md` – **101** owns updates; **107** does not edit unless explicitly instructed.

## Fresh pass attestation

- **Mission ID:** GCC-E2E-014  
- **Win-loss source files read (this run):**  
  - `research/GCC/win-loss-interviews/Opportunity Detail.xlsx` (full workbook, Sheet 1; all 598 rows and 34 columns ingested via pandas in analysis session)  
  - `research/GCC/win-loss-analysis/_scratch-winloss-sources.md` (scratch dump generated this run from the folder above)  
- **Completed (UTC):** 2026-03-22T12:30:00Z  

---

**Remember:** Win-loss extracts are **biased**; final PMF conclusions require **105**, **106**, **101**, and **120** triangulation.
