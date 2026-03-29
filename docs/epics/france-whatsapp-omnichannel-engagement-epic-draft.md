# Epic draft: France WhatsApp omnichannel gap response (partner path v1)

**Pipeline:** France E2E (FR-E2E-002 alignment)  
**PRD:** `docs/prds/france-whatsapp-omnichannel-engagement-prd.md`  
**Status:** Draft — **Jira epic is created in 430** after story map approval (420 HITL).  
**UX / Figma:** Per PRD (`UX Designs for TBD release`); 315 scope is surfaces-only (optional help / Success Centre link), not a full comms hub prototype unless PRD expands.

## Epic summary (for Jira Summary field)

France WhatsApp / omnichannel gap response — enablement and partner path v1

## User story

As a Solution Consultant or Account Executive supporting France and EMEA enterprise Recruiting evaluations  
I want a versioned enablement package (internally cited battle card, presales discovery checklist, field kit, and optional in-product discovery where policy allows) that states the True Gap on native WhatsApp in core Recruiting UI honestly and routes buyers to approved partner-led messaging paths with suite, TCO, and compliance context  
So that we reduce RFP and executive-demo surprise on omnichannel checklists, standardise objection handling versus Oracle Recruiting Booster narratives, improve partner-path qualification and attach in France-relevant pipelines, and protect deal quality without implying native WhatsApp parity in Workday in v1

## Jira-ready description

Paste body for Jira epic description (markdown):

### User story (repeat)

As a Solution Consultant or Account Executive supporting France and EMEA enterprise Recruiting evaluations, I want a versioned enablement package (battle card, presales discovery checklist, field kit, optional in-product discovery where approved) that honestly states the True Gap on native WhatsApp in core Recruiting UI and routes buyers to approved partner-led paths with suite, TCO, and governance context, so that we reduce omnichannel-driven deal friction, standardise field response versus Oracle Booster, and lift qualified partner-path pursuits without shipping native WhatsApp in core UI in v1.

### PRD (canonical)

`docs/prds/france-whatsapp-omnichannel-engagement-prd.md`

### Problem and outcome (summary)

Oracle and regional competitors position omnichannel candidate engagement (including WhatsApp) as table stakes. Workday classifies **native two-way WhatsApp in core Recruiting UI** as a **True Gap** (DA-FR002; France CI scan and matrix). v1 delivers **enablement, packaging, and light in-product discovery** (where approved), not a greenfield native WhatsApp channel in core Recruiting. Success is framed per PRD: **Phase 0** RevOps definitions and baselines before external numeric commitments; directional Year 1 metrics (partner-path uplift, omnichannel-related loss reduction) bind only after that sign-off.

### In scope (v1 — PRD feature solution)

• **France / EMEA battle card (internal)** — Digital PDF or wiki: Workday vs Oracle Booster on omnichannel; True Gap row for native WhatsApp in core UI; native strengths (French UI, GDPR-class controls, mobile, bulk, DPAE/Payroll when deployed); partner path (e.g. Paradox where entitled); TCO worksheet appendix (ranges TBD with finance; no customer quotes without approval). **Mandatory Oracle claims hygiene:** footnote public Oracle document title, URL, and “valid as of [date]”; unknown packaging → “verify in deal” and escalate to deal desk.

• **Presales discovery checklist (5–10 questions)** — Policy (consumer WhatsApp vs enterprise channels); entitlements (Paradox, Workday Messaging, integrations); **France / SMS:** if SMS to French mobiles is needed, capture intent for partner/third-party SMS paths and **Deployment Agent + PS** validation before implying native Workday Messaging SMS coverage; compliance owner (DPO / legal).

• **Success and field enablement kit** — Two-minute talk track; FAQ (~10 entries); optional webinar or Champion session template for France AE / SC communities.

• **Optional in-product discovery (v1 if policy allows)** — Neutral help entry or Success Centre link from Recruiting communications context: channel options and partner path **without** implying native WhatsApp in core UI.

• **GTM and RevOps alignment** — Phase 0: agreed definitions (omnichannel objection, partner-path touch, France segment, minimum N) and CRM / win-loss baselines before public numeric goal language; opportunity tagging guidance per PRD.

• **Cross-functional sign-offs (release thresholds)** — 060 legal pass on customer-facing and RFP-facing strings; partner review on path accuracy; sales enablement sign-off (France RVP or delegate); RevOps agreement on loss-reason codes where used for metrics.

### Explicitly out of v1 (PRD non-goals)

• No greenfield **native WhatsApp API** integration built into **core Recruiting UI**.  
• No **SMS Native vs Workaround** reconciliation (DA-FR001 vs DA-FR002); do not change global SMS claims in this epic.  
• No new Workday business object for WhatsApp messages in v1.

### Personas

• **Primary:** Talent Acquisition / Recruiting Operations Lead (France enterprise).  
• **Secondary:** IT / Workday Tenant Administrator (integrations, subprocessors, subscriptions).  
• **Tertiary:** Candidate (external) — transparency and lawful basis in any customer-facing collateral informed by this epic.  
• **Field consumers:** Solution Consultants, AEs, Success (partner activation).

### Compliance and legal (epic-level)

• GDPR / ePrivacy-aligned enablement; no implication that Workday is controller for customer WhatsApp scenarios without legal review. Do not promise single-system purge/export/erasure where partner or Meta-side stores apply.  
• Segregate **channel delivery** positioning from **EU AI Act / Art. 22** narratives (those apply to AI-assisted hiring decisions, not this epic’s core message).  
• **060** full review before external publishing of candidate-facing copy or customer email templates.  
• DPA, subprocessors, and transfer statements must point to **current** contractual and published lists, not bespoke inventories in collateral.

### Research and CI inputs (for 420 / field)

• `research/competitive/matrices/fr-competitive-matrix.md`  
• `research/competitive/fr/fr-competitive-scan-2026-03-28-FR-E2E-002.md`  
• PMF: `research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md` (Theme 2 omnichannel; roadmap item alignment)

### Functional knowledge touchpoints (for stories that touch product copy or help)

Partner- and tenant-specific messaging flows remain outside core v1 build; any in-product strings should align with **Recruiting** comms patterns and **candidate data lifecycle** expectations (e.g. purge and retention awareness in help text — validate against `@functional-knowledge` where implementation touches UX). Deployment Agent threads referenced in PRD: DA-FR002; validation query `47d0dd16-80b5-4f61-9052-a0efdb377505` for Workday Messaging / France SMS nuance.

### Jira creation (430)

When **430** creates the epic from this draft: **HRREC**, **Epic**, component **Recruiting Purge**, assignee **David Denham** (per workspace defaults), unless PM directs otherwise.

## Notes for story mapping

• **420** should treat this as a **cross-functional enablement epic** (PMM, field readiness, legal, partner success, optional Recruiting product for help surfacing) — stories may span **content artefacts**, **process** (checklists, RevOps codes), and **small product** (optional link), not a single engineering feature team by default.  
• **SPIDR:** Split **battle card authoring** vs **Oracle citation / legal review** vs **checklist** vs **talk track / FAQ** vs **in-product help** (if scoped) vs **RevOps / reporting enablement**.  
• **319 + 060:** Any user-visible or customer-facing strings in stories require editorial pass; legal-sensitive strings need **060** before Jira freeze.  
• **Forbidden positioning in all slices:** native Workday WhatsApp in core Recruiting UI; unrestricted Workday Messaging SMS to French mobiles without DA + PS validation narrative.  
• **Open questions** (PRD): RevOps minimum N and testing; partner SKU naming in internal tools; French localisation owner; in-product placement approval; PS workflow for FR SMS feasibility per tenant.

---

**Epic draft path:** `docs/epics/france-whatsapp-omnichannel-engagement-epic-draft.md`  
**Proposed Jira epic summary:** France WhatsApp / omnichannel gap response — enablement and partner path v1
