# Epic draft: GCC nationalisation and local workforce compliance reporting

**Mission:** GCC-E2E-029 Step 11.5 (Regional E2E backlog)  
**PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Status:** Draft — **Jira epic is created in 430** after story map approval (420 HITL).  
**UX / Figma:** Per PRD (`UX designs for TBD release`); link in Jira when capture exists.

## Epic summary (for Jira Summary field)

GCC nationalisation and local workforce compliance reporting (Recruiting-sourced reference packs)

## User story

As an HR professional (Recruiting) leading nationalisation evidence in the GCC  
I want reference dimensions, catalogued audit-oriented report packs, dashboards, and transparent run metadata with column lineage on Recruiting-sourced data  
So that I can meet standard Recruiting-only audit scenarios with less configuration churn and spreadsheet rebuild, reduce compliance risk from opaque workarounds, and support honest buyer conversations (Recruiting evidence only unless an HCM addendum applies)

## Jira-ready description

Paste body for Jira epic description (markdown):

### User story (repeat)

As an HR professional (Recruiting) leading nationalisation evidence in the GCC, I want reference dimensions, catalogued audit-oriented report packs, dashboards, and transparent run metadata with column lineage on Recruiting-sourced data, so that I can meet standard Recruiting-only audit scenarios with less configuration churn and spreadsheet rebuild, reduce compliance risk from opaque workarounds, and support honest buyer conversations (Recruiting evidence only unless an HCM addendum applies).

### PRD (canonical)

`docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`

### Problem and outcome (summary)

GCC enterprises face mandated nationalisation reporting (Nitaqat / Saudisation, Emiratisation, Kuwaitisation). Today Workday Recruiting relies heavily on custom fields, manual Excel exports, and PS reconfiguration. v1 elevates **Workaround**-class nationalisation / MOHRE-oriented reporting (per baseline CI) with a **reference model**, **standard packs**, **documented PS patterns**, and **clear data lineage** — without claiming government certification, statutory filing completeness, or packaged Qiwa / Mudad connectors (**True Gap**).

### In scope (v1 — full PRD feature solution)

• **Reference data model** — Dimensions and attributes for nationalisation / local compliance reporting (UAE, KSA, Kuwait as primary slices; extensions per legal / field). Tenant configuration for programme report groupings without forcing one-off custom fields for standard metrics; **coexistence** with existing custom fields (no mandatory retirement).

• **Catalogue of standard reports and dashboards** — Pre-built definitions for pipeline and hire views per agreed programme slice; manual **on-demand** runs plus export; goal of in-product completion for agreed in-scope audit scenarios (pilot KPIs per PRD).

• **Run metadata and audit posture** — Surface runner, timestamp, report definition version, and **column lineage** to Recruiting objects / fields; integrate with **existing Report Run History** (and related Recruiting reporting audit patterns) rather than a parallel run store unless discovery documents a gap. **Retention:** engineering selects and documents path **(A)** no new persistent row-level snapshot beyond existing patterns, or **(B)** explicit retention and purge hooks aligned to candidate/application purge and legal hold.

• **Data quality and transparency** — Document required fields per pack; coverage indicators and gap treatment (no silent omission); **UDMF / candidate merge** behaviour for programme fields defined for aggregates and audit views; empty states and copy that do not imply compliance when data is incomplete.

• **Onboarding and migration** — **PS playbook** mapping legacy custom fields to reference dimensions; **validation** reports for gaps and inconsistent legacy data.

• **In-product and buyer transparency** — Clear labels: customer-configured programme definitions; **no** legal advice, **no** government fine calculation, **no** positioning as certifying or filing Nitaqat / Emiratisation / Kuwaitisation submissions; standard **scope blurb** on collateral (Recruiting-sourced v1; not full workforce filings without HCM addendum).

• **GTM alignment** — Internal and external language consistent with PRD competitive allowlist (DA30-class **Workaround** elevation; **True Gap** on packaged Qiwa / Mudad recruiting connectors); triangulate PS + tenant UAT before absolute customer claims.

• **Localisation** — English plus Arabic for new surfaces where required (per PRD releases section).

### Explicitly out of v1 (PM-approved boundaries)

• Direct government portal integrations (Qiwa, Mudad APIs).  
• Advanced predictive analytics or AI-powered quota optimisation.  
• EEOC, OFCCP, or non-GCC compliance domains.  
• Mandatory elimination of customer custom fields.  
• **HCM-composite / post-hire** packs and v1 success-metric numerators unless a **written HCM addendum** extends scope.  
• Scheduled recurring report runs unless handled as a separate change request.  
• Regulator-grade immutability, third-party audit repository, tamper-evident chains, direct portal schema mapping.

### Personas

• **Primary:** HR Professional (Recruiting), GCC.  
• **Secondary:** Recruiting / TA leadership (roll-ups by LOB, location, programme).  
• **Tertiary:** Implementation / value consulting (reference setup, PS patterns).

### Success metrics (PRD — baselines required before external claims)

Targets apply only to **Recruiting-only, in-scope** scenarios in the PRD audit-scenario matrix; configuration-time and Excel-bypass claims require frozen baselines, published reference catalogue + PS playbook where stated, and minimum pilot N per PRD appendix. Commercial pursuit metrics tie to regional OKR definitions in the PRD.

### Compliance and security (epic-level expectations)

Nationality and programme fields are sensitive (GDPR Article 9 where EU/EEA in scope; GCC PDPL-class treatment). Purge alignment for runs and exports; DAP / security domains consult at design kickoff per PRD; Legal / Privacy outcomes (DPIA, pilot worksheet) tracked via PRD open questions.

### Functional knowledge touchpoints (for engineering / QA)

Reporting and exports interact with **Recruiting Data Purge** behaviour, **UDMF** merge outcomes, and **security** (DAP, Recruiting and Candidate Reporting access). Validate detailed behaviour against `@functional-knowledge` PDFs during design and story breakdown.

### Jira creation (430)

Project **HRREC**, issue type **Epic**, component **Recruiting Purge**, assignee **David Denham** (per workspace defaults).

## Notes for story mapping (420)

• Map an **end-to-end walking skeleton (VS1)** that spans: enable / configure reference programme grouping → validation and data-quality feedback → discover and run standard packs (catalogue) → dashboard consumption → export with run metadata and lineage — before layering efficiency and breadth (additional programme slices, leadership roll-ups, playbook deliverables as VS2/VS3 as appropriate).

• Flag **legal-sensitive** UI and GTM strings early for **319** / **060** in **430** (disclaimers, empty states, coverage messaging, export notices).

• **Do not** story-map HCM Worker joins or full-workforce statutory readiness unless PM adds an HCM addendum; keep **Qiwa / Mudad** integration as strategy/documentation only, not shippable integration stories in v1.

• Include explicit stories or spikes for: Report Run History / lineage integration; **retention path (A) vs (B)** decision and implementation; DAP-aligned report access; UDMF / merge rules for programme fields; Arabic / RTL scope per PRD; **PS playbook** and validation reports as deliverables (product + enablement).

• **Per-country gating** (Qatar, Bahrain, Oman, Kuwait depth) may remain behind flags or off by default until legal sign-off — reflect in slice ordering and open questions.

• **Open questions** in the PRD (programme catalogue finalisation, telemetry, named DAP SME, DPIA) should inform spikes or pre-GA gates in the map rather than hidden scope.

---

**Epic draft path:** `docs/epics/gcc-nationalisation-local-compliance-reporting-epic-draft.md`  
**Proposed Jira epic summary:** GCC nationalisation and local workforce compliance reporting (Recruiting-sourced reference packs)
