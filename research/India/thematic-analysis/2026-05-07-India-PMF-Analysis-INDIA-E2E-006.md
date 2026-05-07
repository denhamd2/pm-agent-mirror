# India Recruiting PMF Analysis (Braun & Clarke)

**Mission:** INDIA-E2E-006  
**Analysis date:** 07 May 2026  
**PM context:** **KYC / fraud**, **high-volume hiring**, **WhatsApp**, and **two-way email** (candidate replies surfaced on **candidate profile**).  
**Prototype directive (PM):** Build **two-way email** from the **candidate profile** (`design/india-candidate-profile-email-v92.tsx`).

---

## Executive summary

This pass **re-familiarises** India qualitative sources under the **new PM lens**, anchored on Steps **1–3** artefacts dated **2026-05-07** and **105** attestations refreshed the same day. **106 / 108** outputs from **INDIA-E2E-005** remain **valid directional triangulation**; no new spreadsheet dumps were required for this sprint.

**Five themes** are restated with **strong convergence** on **trust + throughput + omnichannel honesty**. **WhatsApp** and **email** are **complements**, not substitutes: WhatsApp for **speed and read receipts**; email for **formal thread, attachments, and audit**. **Profile-anchored two-way email** scores highly on **Reach × Impact** for **high-volume** pods because it removes **inbox swivel-chair** while preserving **DPDP-friendly** logging in-system.

---

## Methodology (abbreviated)

| Phase | Activity |
|-------|----------|
| 1 | Read `strategy-context-2026-05-07-INDIA-E2E-006.md`, PESTEL, SWOT; **re-read** customer + SME transcripts per 105 attestation; scan `in-competitive-scan-2026-05-07-INDIA-E2E-006.md`; re-use **106/108** summaries from INDIA-E2E-005. |
| 2–3 | Code → theme clustering around **KYC-FRAUD**, **HIGH-VOLUME**, **WHATSAPP-CONSENT**, **EMAIL-THREAD**, **OFFER-REQ-FRICTION**. |
| 4 | Triangulation matrix (SME + Customer + prior 106/108). |
| 5–6 | Naming, RICE, **E2E Handoff** + **130** SME excerpt hooks. |

**Anonymisation:** Customer participants **P1–P5** (Teleperformance India).

---

## Triangulation matrix (refined)

| Theme | SME view | Customer view | 106 / 108 (prior pass) | PMF impact |
|-------|----------|----------------|-------------------------|-----------|
| **T1 Identity assurance (KYC / fraud)** | Bernie / Services: fraud and FY27 focus; Lodola: scale identity | P3: three-ID policy vs soft gate uploads | 108: knock-out agility at India volumes | **High** — RFP and audit risk |
| **T2 High-volume throughput** | Phillips: Accenture scale | P4–P5: weekly hire counts; batch offer pain | 106: comms sentiment volume | **High** — retention lever |
| **T3 Omnichannel: WhatsApp** | Field readiness on consent | P2/P4 mobile coordination | Ideation: comms capability cluster | **High** — parity vs regional ATS |
| **T4 Omnichannel: two-way email** | SME2 offer/BGC email patterns | P2 email-led approvals; thread loss vs ATS | Gap rows on fragmentation | **High** — PM-selected prototype |
| **T5 Req / offer offline approvals** | SME1 process fit | P2–P3 offline comp/position | 108 scheduling / India-US | **Medium** — BP + integrations |

---

## RICE-scored recommendations (relative)

Formula: **Reach × Impact × Confidence ÷ Effort** (1–5 scales; illustrative).

| # | Recommendation | RICE | Notes |
|---|----------------|------|-------|
| **1** | **Candidate profile — two-way recruiting email thread** (send, receive, thread ID, audit) | **2.35** | **PM prototype pick** for INDIA-E2E-006; pairs with high-volume evidence. |
| **2** | **Native WhatsApp** in core UI (consent, templates, bulk guardrails) | **2.08** | See `india-native-whatsapp-v91`; INDIA-E2E-005 track. |
| **3** | **India KYC hardened journey** (progressive gates, employer policy binding) | **1.58** | Closes P3 “soft mandatory” mismatch. |
| **4** | **Fraud / duplicate detection** activation + social login options | **1.42** | Triangulate with Security / Legal. |
| **5** | **Offer / req SLA cockpit** (aging, batch exclusions) | **1.38** | Operational excellence for BPO scale. |

---

## E2E Handoff table (for Steps 11–13)

| # | Bet | Problem | Who cares | Next artefact |
|---|-----|---------|-----------|---------------|
| **1** | **Profile two-way email** | Recruiters read candidate replies in **external mail**; **context drops** on profile | High-volume TLs, BPO pods | **PRD** `docs/prds/india-candidate-profile-email-conversation-prd.md` — **320** `india-candidate-profile-email-v92.tsx` |
| **2** | **Native WhatsApp** | Candidates ignore email nudges; **DPDP** needs consent proof | Same segments + Legal | Existing INDIA-E2E-005 PRD / prototype |
| **3** | **KYC / fraud hardening** | Policy demands **three IDs**; system allows progression | Confidential hiring + TA Ops | Future PRD; XO task map |
| **4** | **Throughput dashboards** | SLAs tracked in **Excel** | Managers P1/P2 | Metrics / dashboard follow-on |

**HITL note:** The PM **pre-selected #1** for the **prototype** in this session; **130** deck generation can follow when a full slide refresh is requested.

---

## @130 SME structured excerpt hooks

- **SME5 (Bernie):** India **fraud / FY27** emphasis → slide on **trust roadmap**.  
- **SME3 (Lodola):** **Genpact scale** → slide on **high-volume comms + identity**.  
- **P2 / P4:** **Email + mobile** split → slide on **omnichannel profile dock** (email + WhatsApp icons side by side).  
- **P3:** **Three-ID policy** → slide on **configurable hard gates**.

---

## Related artefacts

- Strategy: `research/India/strategy-context-2026-05-07-INDIA-E2E-006.md`  
- PESTEL / SWOT: `pestel-analysis-India-2026-05-07-INDIA-E2E-006.md`, `swot-analysis-India-2026-05-07-INDIA-E2E-006.md`  
- CI supplement: `research/competitive/in/in-competitive-scan-2026-05-07-INDIA-E2E-006.md`  
- 105: `105-user-research-findings.md`, `105-sme-research-findings.md`  
- Prior triangulation: `thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md`
