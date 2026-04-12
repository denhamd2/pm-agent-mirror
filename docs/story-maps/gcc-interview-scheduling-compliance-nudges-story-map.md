# Story Map: GCC interview scheduling with compliance nudges

**Epic draft:** `docs/epics/gcc-interview-scheduling-compliance-nudges-epic-draft.md`  
**Jira epic:** *(not created until 430 — leave placeholder until PM approves value slices)*  
**PRD:** `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`  
**Design brief:** `design/gcc-interview-scheduling-compliance-nudges-design-brief.md`  
**Prototype:** `design/gcc-interview-scheduling-compliance-nudges-v90.tsx`  
**Mission:** GCC-E2E-034 (Step 25 – story mapping)  
**Created:** 5 April 2026  
**Author:** Story mapping (420)  

**HITL:** Orchestrator presents story map summary for PM approval; **no Jira** until **430** after approval.

---

## Epic context

**User story (from epic draft)**

As a **recruiter or recruiting coordinator in the GCC (especially on KSA-heavy requisitions)**  
I want **in-product interview scheduling that surfaces configurable compliance nudges (minimum notice, exception consent, panel composition warnings) alongside Paradox and Recommended Interview Scheduling where entitled**  
So that **I can coordinate interviews faster with less Outlook context switching, reduce regulatory and audit risk on the Recruiting record, and strengthen governed GCC hiring narratives versus SAP and Oracle**

**Key personas:** Recruiter / recruiting coordinator (primary); TA lead / HRIS (policy and audit); hiring manager (tertiary); candidate (self-scheduling, VS3); admin / COE (configuration)

**Business goals:** Time to First Interview Session (8–12% median reduction hypothesis, GCC high-touch); recruiter capacity (+3–7% hypothesis); in-product scheduling adoption; KSA-scoped reqs with active rule packs; auditability and honest parity on predefined-slot self-scheduling (no live calendar read claim in v1)

### Workday context (functional + placement)

- **Default realisation path (PRD):** extend **Interview** business process and **existing scheduling surfaces** (Path A); consent and audit remain **Workday SoR**; **Paradox** surfaces messaging but does not replace authoritative audit logging without explicit Legal/Engineering agreement.
- **Placement (Design Brief / Deployment Agent):** scheduling initiated from **Job Requisition → Candidates → Schedule Interview** task; nudges at **slot selection**, **panel confirmation**, and **send/publish**; **mandatory consent modal** for minimum-notice exceptions.
- **Functional knowledge:** Repo PDFs emphasise purge, security, offers, UDMF; **no cited Interview BP excerpt** in brief. Validate **Interview** steps, entitlements (**Recommended Interview Scheduling**, **Paradox**, self-scheduling), and **RBAC** with PS and Deployment Agent during **430**.

---

## User activities (horizontal backbone)

1. **Configure** GCC interview compliance rule packs, scope, and policy text  
2. **Prepare** scheduling context and resolve applicable rules for the requisition  
3. **Select interview time** with minimum-notice evaluation  
4. **Build interview panel** with composition warnings (warn-only in v1)  
5. **Review and send** invitation with exception consent and final checks  
6. **Evidence compliance** via audit views, export, and record linkage  
7. **Integrate and measure** partner scheduling paths and pilot instrumentation  

---

## User tasks (vertical slices)

### Activity 1: Configure GCC interview compliance

- Activate **KSA template** rule pack with **minimum notice** and **calendar basis** (tenant) → **VS1**  
- Map **organisation / requisition type / legal entity** to **jurisdiction** for rule resolution → **VS1**  
- Full **admin workspace** with **tabs** (rule packs, scope mapping, policy text, sensitive rules) → **VS2**  
- **Customer attestation** before enabling **sensitive-attribute** panel rules (default off) → **VS2**  
- **Effective-dated** threshold and policy text changes with auditable history → **VS2**  
- **Test mode:** evaluate rules **without** sending invitations (COE validation) → **VS2**  
- Additional **GCC templates** beyond KSA (e.g. Kuwait notice) via configuration → **VS3**  
- **Advanced panel rule** options (e.g. required acknowledgement text, reason required) → **VS3**  

### Activity 2: Prepare scheduling context

- **Resolve applicable rule pack** when recruiter opens scheduling on a **scoped** requisition → **VS1**  
- **Entitlement-aware** messaging when **Recommended Interview Scheduling** or **Paradox** is unavailable (standard path still usable) → **VS1**  

### Activity 3: Select interview time

- Evaluate **minimum notice** at **slot selection**; show **information** or **warning** **Banner** with rule identity → **VS1**  
- When **notice rule cannot** evaluate (missing data), show **actionable** guidance → **VS1**  
- **Arabic** (and EN) strings for notice nudges; **RTL** for **validated** scheduling surfaces → **VS3**  

### Activity 4: Build interview panel

- Evaluate **panel composition**; show **warning only** (no hard block v1); log evaluation → **VS1**  
- Optional **acknowledge** checkbox for panel warning when admin requires logged acknowledgement → **VS1**  
- When **panel rule cannot** evaluate (missing interviewer attributes), show **actionable** guidance → **VS1**  
- **Arabic** / **RTL** for panel warnings where validated → **VS3**  

### Activity 5: Review and send invitation

- **Review** step summarises slot, panel, and open warnings → **VS1**  
- **Structured exception consent** (who, when, reason, linked interview) **before** confirm when below minimum notice; **disallow** proceed without consent → **VS1**  
- **Send/publish** writes interview artefacts and **compliance events** (evaluated, warning shown, override with consent) → **VS1**  
- **Legal-gated** copy for consent modal and banners (placeholder until **060**) → **VS1** (implementation) / **VS3** (full **AR** + **RTL**)  

### Activity 6: Evidence compliance

- **Persist** consent and key compliance fields **on or tightly linked to** interview / activity record (SoR direction per PRD Open Questions) → **VS1**  
- **Audit list** with filters (period, org, rule pack), row drill, **permission-gated export** → **VS2**  
- **Empty**, **loading**, and **error** states for audit retrieval → **VS2**  

### Activity 7: Integrate and measure

- **Paradox** path: **compliance summary** object (warnings, consent required) and **integration test matrix** alignment with Workday evaluation → **VS2**  
- **Instrumentation** for **GCC high-touch** segment, in-product scheduling share, and **rule pack activation** (IUM / analytics alignment) → **VS2**  
- **Candidate self-scheduling** (predefined slots) with **automation / privacy** disclosures; **no** live M365/Google read claims → **VS3**  

---

## Value slices

### VS1: Minimum viable scheduling with compliance nudges (core flow)

**Goal:** A recruiter can complete an **end-to-end in-product** interview schedule on a **KSA-scoped** requisition with **minimum-notice** evaluation, **exception consent** when below threshold, **panel composition warnings** (no hard block), and **retrievable compliance events** on the interview record, using **English** core strings (Legal placeholders acceptable until copy freeze).

**Stories:**

1. Activate **KSA** compliance rule pack with **minimum notice** and **calendar basis** — *Configure*  
2. Map **jurisdiction** to **organisation / requisition** scope for rule resolution — *Configure*  
3. **Resolve and load** applicable rule pack when opening scheduling — *Prepare*  
4. Show **entitlement-aware** guidance when **RIS** or **Paradox** is off; keep **standard** scheduling usable — *Prepare*  
5. **Minimum notice** evaluation at **slot selection** with named rule and severity — *Select interview time*  
6. **Panel composition warning** at panel step (warn-only); log evaluation and proceed path — *Build interview panel*  
7. Optional **acknowledge** panel warning when required by admin config — *Build interview panel*  
8. **Review and send** with summary; **structured exception consent** modal when notice violated; block without consent — *Review and send invitation*  
9. **Persist interview** and write **compliance audit events** (evaluated, warning shown, consent) on SoR-aligned record — *Review and send invitation*  
10. **Missing data** rule evaluation: show **actionable** failure (update worker data / contact admin) — *Select interview time / Build interview panel*  

**Total stories:** 10

---

### VS2: Admin configuration, audit trail, Paradox integration hooks

**Goal:** COE can **fully configure** packs, **scope**, **policy text**, and **sensitive rules** with **attestation**; compliance partners can **filter and export** audit history; **Paradox** receives a **stable compliance summary** contract; **pilot metrics** can be measured against PRD **BV/PV** definitions.

**Stories:**

1. **Admin tabs:** rule packs, scope mapping, policy text, sensitive rules (full UX per Design Brief) — *Configure*  
2. **Customer attestation** flow before enabling **sensitive-attribute** panel rules — *Configure*  
3. **Effective-dated** threshold and **policy help** changes with history — *Configure*  
4. **Test mode** to evaluate rules **without** sending invitations — *Configure*  
5. **Audit list** view: filters, table, drill to interview, **RBAC** for export — *Evidence compliance*  
6. **Paradox integration:** compliance **summary** payload and **cross-surface** test coverage — *Integrate and measure*  
7. **Analytics instrumentation** for segment, in-product scheduling, and rule pack activation — *Integrate and measure*  

**Total stories:** 7

---

### VS3: Advanced features (candidate self-scheduling, enhanced panel rules, Arabic/RTL)

**Goal:** **Candidates** book **predefined slots** with **Legal-gated** disclosures and **no false calendar-read claims**; **additional GCC** templates and **richer panel** controls ship without bloating VS1; **Arabic** and **RTL** match **PS-validated** release behaviour for nudges, consent, and scheduling surfaces.

**Stories:**

1. **Candidate self-scheduling** UX for **predefined slots** with automation / privacy / sensitive-rule **disclosure placeholders** — *Integrate and measure*  
2. **Additional GCC rule templates** (e.g. Kuwait) via configuration — *Configure*  
3. **Advanced panel rule** configuration (stricter acknowledgement, reason required, etc.) — *Configure*  
4. **Arabic** strings and **RTL** layout for nudges, consent, and validated scheduling UI — *Select interview time* / *Build interview panel* / *Review and send invitation* (single delivery increment)  

**Total stories:** 4

---

## Story map visualization

```
Configure          Prepare            Select time        Build panel        Review & send       Evidence           Integrate
-----------        -----------        -----------        -----------        -----------         -----------        -----------
KSA pack (VS1)     Resolve pack (VS1) Notice eval (VS1) Panel warn (VS1)   Review summary(VS1) Persist+events(VS1) Paradox (VS2)
Scope map (VS1)    Entitlement (VS1)  Data quality(VS1) Data qual. (VS1)  Consent modal (VS1) Audit list (VS2)    Metrics (VS2)
Admin tabs (VS2)                      AR/RTL nudge(VS3) Ack panel (VS1)    Send+log (VS1)      Export RBAC (VS2)   Self-sched (VS3)
Attestation (VS2)                     —                  AR/RTL (VS3)      Legal copy path     —                  Extra templates(VS3)
Effective dates(VS2)                —                  —                 —                   —                  Advanced panel(VS3)
Test mode (VS2)
Extra GCC (VS3)
Advanced panel(VS3)
```

---

## Summary

| Metric | Count |
|--------|------:|
| **Total activities** | **7** |
| **Total stories** | **21** |
| **VS1 stories** | **10** |
| **VS2 stories** | **7** |
| **VS3 stories** | **4** |
| **Value slices** | **3** |

---

## Orchestrator handoff (GCC-E2E-034)

- **Story map path:** `docs/story-maps/gcc-interview-scheduling-compliance-nudges-story-map.md`  
- **Activities:** 7 (**Configure**, **Prepare**, **Select interview time**, **Build interview panel**, **Review and send invitation**, **Evidence compliance**, **Integrate and measure**); **data quality** surfaced as VS1 tasks under **Select time** and **Build panel** (consolidated as one story in VS1 list)  
- **Total stories:** 21 (**VS1:** 10, **VS2:** 7, **VS3:** 4)  
- **Next step:** Orchestrator **HITL** (value slice approval) then **430** (Jira epic + stories); **no AskQuestion** from this agent in chain mode  

**Compliance flags for 430:** Art 9 / sensitive attributes, **EU AI Act** / Paradox transparency, **Legal-gated** consent and candidate copy (**319** + **060**), **DPIA-style** gate before GA for sensitive configs at scale.
