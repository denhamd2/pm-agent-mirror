# Epic draft: GCC interview scheduling with compliance nudges

**Mission:** GCC-E2E-034 (Step 24 – epic definition)  
**PRD:** `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`  
**Status:** Draft — **Jira epic is created in 430** after story map approval (420 HITL).

## Epic summary (for Jira Summary field)

GCC interview scheduling with configurable compliance nudges and in-product audit

## User story

As a **recruiter or recruiting coordinator in the GCC (especially on KSA-heavy requisitions)**  
I want **in-product interview scheduling that surfaces configurable compliance nudges (minimum notice, exception consent, panel composition warnings) alongside Paradox and Recommended Interview Scheduling where entitled**  
So that **I can coordinate interviews faster with less Outlook context switching, reduce regulatory and audit risk on the Recruiting record, and strengthen governed GCC hiring narratives versus SAP and Oracle**

## Epic description

### Business context

GCC enterprise recruiting teams still **coordinate interviews outside Workday** (email, calendar, messaging) or use **partial** in-product flows **without** regional compliance framing. Primary research (**P1 Accenture**, **P2 Baker Hughes**) raised **KSA-style expectations**: minimum notice, **documented consent** when policy is overridden, and **panel composition awareness**, while competitors invest in interview coordination and candidate experience. Workday can differentiate with **suite-native scheduling plus configurable warnings and consent capture** logged **in** Recruiting, honest parity on **predefined-slot** self-scheduling versus **live M365/Google calendar read** (explicit **v1 out of scope**), and a **reusable compliance nudge framework** for other regulated contexts.

### Scope (in)

- **Activation and packaging narrative** linking **Paradox** (when licensed), **Recommended Interview Scheduling** (calendar integration and innovation opt-in as required), **Candidate Self-Scheduling** (predefined slots), and **first-party compliance nudge + consent** layer; **KSA template** in v1 with extension to other GCC jurisdictions via configuration or future templates.
- **Deterministic rules** in the Workday Recruiting transaction path for in-product scheduling: minimum notice, **exception consent** before confirm when below threshold, **panel composition warnings only** (no hard block on panel mix in v1), **audit events** (rule evaluated, warning shown, override with consent).
- **Administrator experience**: enable packs by tenant, map org/requisition types to jurisdiction, thresholds, policy help text, test mode; **customer attestation** before enabling nationality-driven or other sensitive-attribute rules (default off).
- **Localisation**: English and Arabic for nudge and consent strings; RTL only where validated (no v1 promise of full scheduling RTL parity without PS sign-off).

### Scope (out) for v1

- Live Microsoft 365 or Google **calendar read** for candidate self-scheduling (separate initiative).
- **Qiwa**, **Mudad**, **MOHRE** connectors; **WhatsApp** as dedicated interview confirmation channel.
- **Hard enforcement** of panel composition; document-linked or e-signature consent as baseline (may be v2).

### Success criteria (from PRD)

- **Median time from application to first interview session** reduced by **8–12%** for **GCC high-touch requisitions** in year one (tenant baseline; IUM family **HRREC-87961**).
- **Recruiter capacity** on affected requisitions: pilot vs control hypothesis **+3–7%** effective capacity (**HRREC-86870**), subject to validation.
- **Stretch (planning anchors; replace with measured baselines post-pilot):** **60%+** of GCC tenants using in-product scheduling (per instrumentation definitions) within **12 months of activation**; **80%+** of KSA-scoped requisitions with compliance nudge rules enabled where the pack is licensed.
- **Strategic:** support **time-to-hire input** narratives; improve **deal conversion** vs SAP/Oracle scheduling stories; **platform growth** via extensible nudge framework and future calendar-read parity.

## Success metrics (for Jira epic)

**Impact (Business Value):**

- **Time to First Interview Session** (**HRREC-87961**): tenant baseline → **8–12% reduction** in median time from application to first interview session for **GCC high-touch requisitions** (year one; segment per analytics).
- **Productivity: Recruiter Capacity** (**HRREC-86870**): **+3–7%** effective capacity on affected requisitions (pilot vs control; hypothesis, subject to validation).

**Product Outcomes:**

- Median days from application to first scheduled interview session (PV) → drives **Time to First Interview Session** (BV).
- Share of interview events created **in-product** vs external-only coordination (PV) → adoption proxy.
- Share of KSA-scoped requisitions with **at least one compliance rule pack active** (PV) → compliance narrative and risk reduction.

**Outputs (Product Catalogue) — stretch hypotheses:**

- **Adoption (stretch):** **60%+** of GCC tenants using in-product scheduling (Paradox and/or Recommended Interview Scheduling / standard surfaces per instrumentation) within **12 months of feature activation** (planning anchor; no GCC bundled precedent; validate in pilot).
- **Usage (stretch):** **80%+** of KSA-based requisitions (primary location or legal entity in KSA per tenant mapping) with **compliance nudge rules enabled** where licensed.

**Strategic value & outcomes (PRD):**

1. **Velocity and time-to-hire inputs** — faster first interview supports downstream Time to Hire narratives without claiming full hire-cycle causality.  
2. **Deal conversion** — counters SAP and Oracle scheduling and experience positioning with **governed, auditable** GCC workflows.  
3. **Platform growth** — reusable compliance nudge framework; separate roadmap item for **live calendar read** when delivered.

## Value metrics (3-tier summary for 420 / 430)

| Tier | Metrics |
|------|---------|
| **BV** | Time to First Interview Session (8–12% median reduction target); Recruiter Capacity (+3–7% hypothesis on affected reqs) |
| **PV** | Median days to first scheduled session; in-product vs external interview events; KSA reqs with active rule pack |
| **Adoption / usage** | Stretch: 60%+ GCC tenant in-product scheduling; 80%+ KSA reqs with nudges enabled (where licensed) |

**Reference:** `docs/metrics/talent-acquisition-value-metrics.csv`

## Epic-level acceptance criteria

1. **Scheduling path:** Recruiters and coordinators can complete **in-product** interview scheduling flows where entitled; **nudges** appear at slot selection, panel confirmation, and send/publish actions with **information** vs **warning** severity per PRD (no hard block on panel mix in v1).
2. **Rules:** Configurable **minimum notice**, **exception consent** (structured: who, when, reason, linked interview) before confirm when below notice, and **panel composition warnings** from declared/resolved interviewer attributes per tenant mapping; nationality-driven rules **off by default** with **admin attestation** before enable.
3. **Audit:** Compliance events recorded (**rule evaluated**, **warning shown**, **override with consent**; disallow override without consent) and **retrievable** for audit/reporting; consent and overrides **on or tightly linked to** interview/activity record per SoR direction (final storage split per Open Questions).
4. **Admin:** Tenant activation, jurisdiction mapping, thresholds, policy help text, test mode, and attestation flow for sensitive rules.
5. **Honest enablement:** GTM and in-product copy do **not** claim **live** interviewer calendar read for candidate self-scheduling in v1; parity table and PS/UAT validation respected.
6. **Legal / privacy gates:** Legal sign-off on consent copy, sensitive-attribute handling, Paradox/EU AI Act transparency path, and DPIA-style gate before GA for sensitive configurations at scale (per PRD).
7. **Localisation:** EN/AR strings for nudges and consent; RTL only as release-validated.

## Dependencies

- **Entitlements and configuration:** Paradox licence and activation where conversational path is in scope; **Recommended Interview Scheduling** with **calendar integration** and **innovation opt-in** as required per tenant; **Candidate Self-Scheduling** / predefined slots where used.
- **Engineering realisation:** Default **Path A** (extend Interview BP and existing scheduling surfaces) unless discovery forces **Path B** (intercept layer); Paradox integration contract and test matrix if rules must align across surfaces.
- **Cross-functional:** Legal (copy, AI Act classification, DPIA); Security (RBAC, retention, export); PS (parity table DA thread IDs, tenant validation); Analytics (segment definition for “GCC high-touch requisition”, instrumentation).
- **Customer:** Controller accountability; **customer Legal** for policy thresholds, notices, and attestation; privacy notice updates when enabling sensitive rules.

## Risks

- **Over-claiming parity** on calendar read or SKU bundles versus April 2026 internal classification — mitigate with parity table and PS/UAT.
- **Data quality** for panel rules (missing nationality/classification) — unclear evaluation vs warn-only; Art 9 / sensitive-data minimisation trade-offs.
- **Multi-surface consistency** if Path A cannot cover all Paradox entry points without further integration work.
- **Arabic/RTL** partial coverage — candidate and worker-facing promises must match validated UI.
- **Adoption stretch targets** lack GCC precedent — treat as hypotheses until pilot instrumentation.
- **Open questions** (PRD): consent storage SoR vs audit object, enablement sequencing across SKUs, Kuwait/other templates in v1, EU AI Act provider vs deployer split for Paradox-in-Workday.

## Design artifacts

| Artifact | Path / status |
|----------|----------------|
| **Design Brief** | `design/gcc-interview-scheduling-compliance-nudges-design-brief.md` |
| **Prototype (Canvas Kit)** | `design/gcc-interview-scheduling-compliance-nudges-v90.tsx` |
| **Visual review notes** | `design/gcc-interview-scheduling-v90-visual-review.md` |
| **Copy artefact** | `design/gcc-interview-scheduling-copy.md` (if used for 319 trail) |
| **Figma** | https://www.figma.com/design/ErDsbk1VrnqI8hgknCu8O3 (*GCC Interview Scheduling Compliance Nudges v90*; capture from prototype per GCC-E2E-034 Step 23). PRD UX section still marks some frames as TBD; align file with final scope. |

## Jira-ready description

Paste body for Jira epic description (markdown):

**User story**

As a recruiter or recruiting coordinator in the GCC (especially on KSA-heavy requisitions), I want in-product interview scheduling with configurable compliance nudges (minimum notice, exception consent, panel composition warnings) alongside Paradox and Recommended Interview Scheduling where entitled, so that I can coordinate interviews faster with less Outlook context switching, reduce regulatory and audit risk on the Recruiting record, and strengthen governed GCC hiring narratives versus SAP and Oracle.

**PRD:** `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`

**Scope**

- Configurable GCC compliance rule packs (KSA template v1; extend via config); minimum notice, structured exception consent, panel warnings only (no hard block on panel mix v1).
- Audit events and consent on interview record; admin attestation for sensitive-attribute rules (default off).
- EN/AR strings; RTL per validated release behaviour.
- **Out of scope v1:** live M365/Google calendar read for self-scheduling; Qiwa/Mudad/MOHRE; WhatsApp dedicated channel; hard panel blocks.

**Success metrics**

- BV: Time to First Interview Session −8–12% median (GCC high-touch, year one); Recruiter Capacity +3–7% hypothesis on affected reqs.
- PV: days to first scheduled session; in-product interview share; KSA reqs with active rule pack.
- Stretch adoption/usage: 60% / 80% as in PRD (validate post-pilot).

**Design**

- Brief: `design/gcc-interview-scheduling-compliance-nudges-design-brief.md`
- Prototype: `design/gcc-interview-scheduling-compliance-nudges-v90.tsx`
- Figma: https://www.figma.com/design/ErDsbk1VrnqI8hgknCu8O3 (GCC Interview Scheduling Compliance Nudges v90)

## Notes for story mapping (420)

- Flag **compliance**, **Art 9/sensitive data**, **EU AI Act / Paradox transparency**, and **Legal-gated copy** for slice boundaries; VS1 should be a **walking skeleton** end-to-end (configure → schedule → nudge → consent → confirm → audit) if feasible.
- Separate **pilot instrumentation** and **enablement** stories if metrics ownership is unclear.
- **430 defaults (when creating Jira epic):** project **HRREC**, issue type **Epic**, component **Recruiting Purge**, assignee **david.denham** (per 410/430 rules).

---

**Epic draft path:** `docs/epics/gcc-interview-scheduling-compliance-nudges-epic-draft.md`  
**Proposed Jira summary:** GCC interview scheduling with configurable compliance nudges and in-product audit
