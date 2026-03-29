# Story Map: Native GCC nationalisation and local compliance reporting

**Epic draft:** `docs/epics/gcc-nationalisation-local-compliance-reporting-epic-draft.md`  
**Jira epic:** [HRREC-91144](https://jira2.workday.com/browse/HRREC-91144) *(created 430, GCC E2E Step 30)*  
**PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Created:** 28 March 2026  
**Author:** AI Story Mapping Specialist

## Functional grounding (Workday)

**Deployment Agent (thread `61f74e54-9865-4676-b1c3-80f0423ca01c`):** Standard Recruiting fields include primary nationality, additional nationalities, and configurable government or national IDs (may be collected at multiple recruiting stages). Offer sits in the **Job Application** business process; recruiters initiate **Offer** / **Make Offer**, approvals route to hiring manager, HR, compensation, etc., and post-approval steps can include **Change Government Identifiers** or **Change Personal Information**. Today, nationalisation-style views are typically **custom reports** on candidate and job application objects, **calculated fields** for groupings or flags, **dashboard worklets**, and **exports** from reports (manual or scheduled) — consistent with v1 productising in-product dashboards and exports without Qiwa/Mudad APIs.

**Functional knowledge (folder):** Extend patterns aligned with **Offer & Employment Agreement** (offer sub-process, approvals), **Recruiting Data Purge** (retention and purge for candidate/application data and new audit artefacts — see PRD retention matrix), and **security** (RBAC, domain policies, minimisation of sensitive attributes on high-traffic surfaces). **No** sole automated hiring decisions; flags inform humans at offer.

## Epic context

**User story (from epic draft):**  
As a GCC talent acquisition lead managing Saudization, Nitaqat, or Emiratisation obligations, I want governed nationalisation data, real-time quota and pipeline views, and clear offer-stage warnings (with optional blocks where legally and operationally approved), so that we reduce manual spreadsheet reconciliation, surface quota risk before irreversible offer steps, and improve defensible reporting to leadership and authorities without mis-stating statutory automation.

**Key personas:** Primary — HR Professional / TA lead (GCC). Secondary — HR / people analytics / COE. Tertiary — Hiring manager (minimal signals).

**Business goals:** Adoption (10 GCC enterprise customers in 6 months post-GA), ~30% reduction in time compiling nationalisation reports, zero quota miscalculation incidents attributed to native calculations (early adopter cohort, 12 months), DPIA (or equivalent) where Legal mandates before GA.

**420 notes from epic:** VS1 must be an **end-to-end walking skeleton**: activate pack → pipeline or req-level composition → offer with visible compliance outcome → export or executive view → audit evidence. Heavy admin, security tiers, and analytics depth may split to VS2/VS3. **319 + 060** on block, override, privacy, export warnings. **Counsel review** on any default filters that could imply exclusion by protected characteristics. **Spikes** for open PRD items (extra countries, Nitaqat/MOHRE band depth, Prism vs standalone, franchise roll-up, export field minimisation).

---

## User activities (horizontal backbone)

1. Configure nationalisation programmes and targets  
2. Govern identity and classification on candidates and applications  
3. Monitor quota, composition, and pipeline health  
4. Resolve exceptions and approved overrides  
5. Complete offers with compliance signals  
6. Export, report, and brief leadership  
7. Evidence compliance through audit trails and access control  

---

## User tasks (vertical slices)

### Activity 1: Configure nationalisation programmes and targets

- Activate **KSA** and **UAE** programme packs for the tenant → **VS1**  
- Map legal entities, supervisory organisations, and/or locations to programmes (v1 scope per design) → **VS1**  
- Maintain targets, thresholds, and **effective dates** for quota comparisons → **VS1**  
- Set tenant policy for offer-stage **severity** (inform / warn; optional block behind explicit configuration) → **VS1**  
- Version programme configuration and show change history to COE → **VS2**  
- Bulk import or update targets from customer template (CSV/XLSX) → **VS2**  
- **Spike / placeholder:** Deeper **Nitaqat / MOHRE** band logic as product vs customer-maintained reference data → **VS3**  

### Activity 2: Govern identity and classification on candidates and applications

- Ensure **primary nationality**, **additional nationalities**, and **government ID** patterns remain available and aligned to programme needs → **VS1**  
- Derive and display **nationalisation classification** (for example local / national / expat / GCC) from configured rules → **VS1**  
- Apply **role-based visibility** so sensitive attributes are minimised on default recruiter grids → **VS1**  
- Route **classification exceptions** to COE with reason capture → **VS2**  
- Support **just-in-time** help or notice patterns for sensitive fields (copy via **319** / **060**) → **VS2**  

### Activity 3: Monitor quota, composition, and pipeline health

- View **real-time** composition metrics at **requisition** or **pipeline** scope (counts, percentages vs target) → **VS1**  
- View **trend** over a selected period at agreed scope → **VS1**  
- **Drill into** the population contributing to a metric (transparent calculation) → **VS2**  
- **Executive** or leadership dashboard across org hierarchy (aggregated) → **VS2**  
- **Spike / placeholder:** **Franchise** or multinational **roll-up** boundaries (PRD open question) → **VS3**  
- **Spike / placeholder:** **Prism** vs Recruiting-only analytics integration → **VS3**  

### Activity 4: Resolve exceptions and approved overrides

- Record **approved override** of classification or threshold with approver, reason, and timestamp → **VS1** (minimal path tied to offer or COE workflow)  
- **Queue** or worklist of pending classification exceptions for COE → **VS2**  
- Enforce **segregation of duties** between override requester and approver (where configured) → **VS2**  

### Activity 5: Complete offers with compliance signals

- **Evaluate** impact on quota / composition at **offer initiation** or **approval** step (configurable hook) → **VS1**  
- Present **informational** or **warning** panel with plain-language explanation and drill link (no silent auto-reject) → **VS1**  
- **Log** recruiter or approver **decision** when proceeding past a warning → **VS1**  
- Optional **hard block** with Legal-approved messaging, documented override path, and accountability (tenant opt-in) → **VS2**  
- **Minimal hiring manager signal** when policy requires visibility on GCC-facing reqs → **VS2**  

### Activity 6: Export, report, and brief leadership

- **Export** period composition / compliance **CSV or XLSX** for **customer-operated** manual filing → **VS1**  
- Show **export disclaimer** (customer responsibility for downloaded files; copy **319** / **060**) → **VS1**  
- Support **data minimisation** export profile vs full field set (Legal-aligned options) → **VS2**  
- Scheduled or saved report layouts for recurring board or authority cadence → **VS2**  

### Activity 7: Evidence compliance through audit trails and access control

- **Audit** views or changes to **compliance classifications**, **thresholds**, and **programme mappings** → **VS1**  
- **Audit** offer-stage **warnings**, **blocks**, and **overrides** with user and timestamp → **VS1**  
- Run **compliance investigator** view (filterable audit report) → **VS2**  
- Align **retention and purge** behaviour for new artefacts with **Recruiting Data Purge** and PRD matrix (engineering / functional dependency) → **VS2**  

---

## Value slices

### VS1: Governed compliance spine

**Goal:** A design-partner tenant can **activate** KSA/UAE programmes, see **live composition** against targets on at least one agreed scope (requisition or pipeline), encounter a **documented inform or warn** at offer with **decision logging**, **export** a period file for manual authority steps, and produce **audit evidence** for configuration and offer-linked events — without claiming automated government submission.

**Stories (tasks):**

1. Activate KSA/UAE packs and map org scope — *Activity 1*  
2. Maintain targets, thresholds, and effective dates — *Activity 1*  
3. Configure offer-stage severity defaulting to inform/warn — *Activity 1*  
4. Align nationality / ID capture with programme (visibility and rules input) — *Activity 2*  
5. Derive and show nationalisation classification on application — *Activity 2*  
6. Apply role-based minimisation of sensitive fields on default recruiter surfaces — *Activity 2*  
7. View requisition or pipeline composition vs target (counts, %) — *Activity 3*  
8. Show trend for selected period at same scope — *Activity 3*  
9. Evaluate compliance at offer step and show inform/warn panel — *Activity 5*  
10. Log proceed / decision when user continues past warning — *Activity 5*  
11. Export period CSV/XLSX with customer-responsibility disclaimer — *Activity 6*  
12. Record audit events for programme config, classification changes, offer warnings — *Activity 7*  
13. Minimal approved override path with reason (linked to offer or COE) — *Activity 4*  

**Total stories:** 13  

### VS2: Operating scale and depth

**Goal:** Move adopters toward the PRD **~30% reporting time reduction** through **faster admin**, **deeper transparency** (drill-down), **leadership roll-ups**, **exception operations**, optional **block-with-override**, **HM signals**, and **richer exports** — still without Qiwa/Mudad automation.

**Stories (tasks):**

1. Versioned programme configuration history for COE — *Activity 1*  
2. Bulk import/update of targets — *Activity 1*  
3. Classification exception queue for COE — *Activity 2*  
4. Just-in-time sensitive-field copy and help — *Activity 2*  
5. Drill into population driving a metric — *Activity 3*  
6. Executive dashboard across hierarchy — *Activity 3*  
7. Segregation of duties for overrides — *Activity 4*  
8. Optional hard block with Legal-approved UX and override — *Activity 5*  
9. Minimal hiring manager compliance signal on GCC reqs — *Activity 5*  
10. Data minimisation vs full export profiles — *Activity 6*  
11. Saved / scheduled export layouts — *Activity 6*  
12. Compliance investigator audit reporting — *Activity 7*  
13. Retention and purge alignment for new artefacts — *Activity 7*  

**Total stories:** 13  

### VS3: Statutory depth and platform fit

**Goal:** Reduce delivery risk from **open PRD questions** by time-boxed discovery and optional follow-on delivery: **extra GCC countries**, **band depth**, **Prism** alignment, **franchise roll-ups**, and **support access** models — without blocking VS1/VS2 GA narratives.

**Stories (tasks):**

1. Spike: Nitaqat / MOHRE band depth — product vs customer tables — *Activity 1*  
2. Spike: Franchise and multinational roll-up architecture — *Activity 3*  
3. Spike: Prism vs standalone Recruiting analytics — *Activity 3*  
4. Spike: Additional GCC country pack priority (post KSA/UAE) — *Activity 1*  
5. Spike: Workday support access model for classification disputes — *Activity 7*  

**Total stories:** 5  

---

## Story map visualisation

```
Configure        Govern data       Monitor           Exceptions        Offer             Export            Audit
---------        -----------       -------           ----------        -----             ------            -----
VS1: packs       VS1: derive       VS1: req view     VS1: override     VS1: eval+warn    VS1: CSV+XLSX     VS1: audit core
VS1: map org     VS1: RBAC         VS1: trend        VS2: queue        VS1: log decide    VS1: disclaimer   VS1: offer audit
VS1: targets     VS2: exceptions  VS2: drill        VS2: SoD          VS2: block opt     VS2: minimise     VS2: investigator
VS1: severity    VS2: JIT copy     VS2: exec         (spikes VS3)      VS2: HM signal     VS2: schedules    VS2: retention
VS2: history     (spikes VS3)      VS3: franchise
VS2: bulk                          VS3: Prism
VS3: bands spike
VS3: countries spike
```

---

## Summary

| Metric | Count |
|--------|------:|
| **Total activities** | 7 |
| **Total tasks** | 31 |
| **Value slices** | 3 |
| **VS1 stories** | 13 |
| **VS2 stories** | 13 |
| **VS3 stories** | 5 |

---

## Orchestrator handoff (GCC E2E Step 27)

- **Story map path:** `docs/story-maps/gcc-nationalisation-local-compliance-reporting-story-map.md`  
- **Activities:** 7 (configure → govern data → monitor → exceptions → offer → export → audit)  
- **Total user tasks in map:** 31  
- **Value slices:**  
  - **VS1 — Governed compliance spine:** Goal = end-to-end walking skeleton for design partner; **13** stories  
  - **VS2 — Operating scale and depth:** Goal = efficiency and leadership depth toward ~30% reporting time reduction; **13** stories  
  - **VS3 — Statutory depth and platform fit:** Goal = spikes / optional follow-on for open PRD items; **5** stories  

**HITL:** Orchestrator presents **Story Map Review** (approve all, VS1 only, or request changes). **Do not** invoke **430** until PM selection is recorded.
