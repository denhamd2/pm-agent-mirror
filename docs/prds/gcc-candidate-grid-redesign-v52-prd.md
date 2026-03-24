# Candidate Grid Redesign (2026R2) — PRD v52
Product Requirements Document  
March 2026  
**Pipeline:** GCC-E2E-011 (HITL **#5**; fresh **101** + **200** on 22 March 2026)

## Executive Summary

Workday is positioned to deepen **single-surface** candidate review for high-volume recruiters: consolidating summary, CV/resume, notes, timeline, and history into one modal reduces **tab and context switching** that customers cite when reviewing 100+ applicants per requisition. **Positioning note (Deployment Agent + **101** CI):** **Sequential** movement between candidates (next/previous without returning to the grid) is already **native**; this initiative’s differentiation is **density of context in one pane** (inline CV where feasible, unified notes/timeline), not “first time” carousel navigation.

For our customers, this feature targets **~30%** reduction in thorough-review time through unified data presentation (aligned to Success Metrics baseline), improves decision quality with faster access to full candidate context, and enables high-volume recruiting teams (Baker Hughes ~200 candidates/req, Accenture 8-10k applications/quarter) to process candidates faster without sacrificing thoroughness. Mobile-first recruiters will benefit from optimised touch targets and streamlined navigation—critical for GCC markets where 40%+ of recruiting activity occurs on handheld devices.

For Workday, this initiative will reduce recruiter abandonment to external tools (PowerBI, Excel exports for candidate tracking), strengthen retention amongst high-volume recruiting customers, and narrows the **perception gap** versus regional ATS specialists (Talentera, ZenHR) on **single-glance** review speed—without claiming absence of native sequential navigation. This positions Workday Recruiting as the system of record for operational recruiting—not just requisition management.

**Source Research:** GCC PMF Analysis **v52** (22 March 2026) — E2E recommendation **#5** (candidate grid / unified recruiter UX; Theme 3: grid, search, tab fatigue)  
**Competitive inputs:** `research/competitive/gcc/e2e-ci-brief-candidate-grid-redesign-2026-03-22.md` (**GCC-E2E-011** fresh **101** pass; Deployment Agent thread `eb984a05-f81e-44f5-8c59-f7cf1575f0fc`); `research/competitive/matrices/gcc-competitive-matrix.md` (E2E-011 delta)  
**Evidence:** P2 (Baker Hughes): "Information is good but you have to navigate through different tabs...imagine when they're trying to go through 100 or 200 candidates it's going to be time consuming." P3 (Shell): "High application volume but low number of job openings...the struggle is knowing who we should be paying attention to."

**Epic Links:**
- [Candidate Grid Redesign] EA: [EPIC-ID-TBD]
- [Candidate Grid Redesign] GA: [EPIC-ID-TBD]

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | Recruiters spend 40-60% of their active recruiting time reviewing candidate profiles to assess fit, compare qualifications, and document screening decisions. In Workday today, this requires constant tab-switching between Summary (demographics), Documents (CV), Activity (notes), and Timeline (history)—fragmenting the recruiter's mental model and creating navigation fatigue.<br><br>For high-volume recruiters processing 100-200 candidates per requisition, this tab tax compounds: each candidate requires 3-5 tab clicks to gather complete context, totalling 300-1,000 navigation events per req. The burden falls heaviest on GCC recruiters managing large applicant pools with tight Saudization/Emiratisation compliance timelines, who report Excel/PowerBI exits because Workday's grid "gave [them] a headache" (P1, Accenture).<br><br>Without a unified candidate view, recruiters cannot efficiently compare candidates side-by-side, lose context when interrupted mid-review, and resort to external tracking tools—undermining Workday's value proposition as the system of record for recruiting operations. |
| **How is it done today?** | Today, recruiters use the Candidate Grid to see a tabular list of applicants with sortable columns (Name, Stage, Submitted Date, Match Score). To review a candidate in depth, they click into the candidate profile which opens in a separate page/modal with multiple tabs: Summary (contact info, job history), Documents (CV, cover letter), Activity (recruiter notes, interview feedback), Timeline (application history, stage movements).<br><br>This multi-tab architecture forces recruiters to mentally reconstruct the candidate's story across 3-4 disjointed views. For comparative review (shortlisting 5 from 50), this means opening 50 profiles, switching 150-200 tabs, and manually noting strengths/concerns in external spreadsheets. The result: decision fatigue, incomplete reviews, and data exits to PowerBI/Excel where recruiters build custom tracking dashboards that Workday's native reporting cannot deliver with comparable speed and clarity. |
| **How is our approach uniquely different from others?** | • **Unified candidate modal**: Single-pane view consolidating summary, CV (inline where platform allows, else **Open CV** fallback), notes, and timeline—**minimises profile tab switching** within a review session<br>• **Sequential review**: Keyboard and control affordances align with existing **native** next/previous candidate patterns; prototype and GTM must **not** claim Workday lacks sequential review today<br>• **Mobile-optimised**: Touch-friendly targets and swipe gestures for recruiters on handheld devices (40%+ of GCC recruiting traffic)<br>• **Contextual filtering**: Enhanced boolean search and saved filter sets for recruiter productivity<br>• **Workday-native**: Built into core Recruiting module—no third-party CRM or external tool required<br>• **Success metrics**: Time-to-review reduction (**30%** target vs thorough-review baseline), **leading** modal session telemetry (see Success Metrics), recruiter satisfaction (NPS +15) |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast (Adoption & Volume Model):**<br><br>**Active Recruiter Definition**: Recruiter who reviews ≥10 candidates/week in Workday<br>**Base**: 50k active recruiters across Workday customer base<br>**Ramp**: 20% adoption Month 1-3 (10k), 40% Month 4-6 (20k), 60% Month 7-12 (30k)<br>**Volume**: 10 modal sessions/day × 250 working days × weighted average adopters<br>  ○ H1 calculation: (10k + 20k) / 2 × 125 days × 10 = 18.75M sessions<br>  ○ H2 calculation: (20k + 30k) / 2 × 125 days × 10 = 31.25M sessions<br>  ○ **Year 1 total: 50M modal sessions** (conservative; steady-state 75M/year at 60% adoption)<br><br>**Capacity Planning Ceiling**: 75M annual sessions (peak steady-state); document cache sized for 5MB × 75M × 0.1 retention = 37.5TB cached CVs<br><br>**Strategic Value & Outcomes:**<br>1. **Time-to-Review Efficiency (target: 30% reduction baseline-to-unified)**:<br>   • **Baseline definition** (reconciled with v42): Recruiter reviews candidate by opening profile → 4-5 tab switches to gather summary, CV, notes, timeline → avg **5 mins per candidate** for thorough review (v42 cited 5-10 mins; v46 uses **5 mins as validated baseline**)<br>   • **Target unified modal**: Summary + inline CV + notes in one view → **3.5 mins per candidate** (30% reduction; more conservative than v42's 40% to account for inline CV load time)<br>   • **Impact**: 1.5 mins saved × 50 candidates/req × 20 reqs/recruiter/year = **25 hours saved per recruiter annually** (high-volume teams: 50 hours+)<br>   • **Note**: Baseline measurement study conducted Q1 2026 with 15 enterprise customers; 5-min baseline reflects "thorough review" (not quick scan) to align with quality hiring outcomes<br>2. **Recruiter Abandonment Mitigation**:<br>   • P2 (Baker Hughes) and P3 (Shell) both report PowerBI/Excel exits for candidate tracking due to Workday grid limitations<br>   • Target: 30% reduction in external tool usage for candidate management (measured via support ticket reduction + NPS surveys)<br>3. **Drive Business & Platform Growth**:<br>   a. **Monetization**: Positions Recruiting module as high-value SKU for high-volume customers; reduces churn risk<br>   b. **Deal-Closing**: Addresses P1 gap ("recruiter dashboard gave me a headache") that creates competitive risk versus Talentera/ZenHR in GCC<br>   c. **Future Acceleration**: Foundation for AI-assisted candidate matching (Phase 2: similar candidates, database search surfaces) |

### Audience / Personas

**Primary Persona**: HR Professional (Recruiting) / Corporate Recruiter
- Manages 10-50 active requisitions simultaneously
- Reviews 50-200 candidates per req to shortlist 5-10 for interview
- Requires fast, accurate screening to meet hiring manager SLAs (72-hour response time common)
- Pain point: Navigation tax (tab-switching fatigue) slows high-volume review workflows
- *Persona depth from docs/workday-user-research/ (HR-Professional-Recruiting.pdf) + docs/jtbd-recruiting-hr-professional-and-manager.md: "When I need to compare candidates quickly, I want a unified view of qualifications and notes so I can shortlist efficiently without losing context."*

**Secondary Persona**: Hiring Manager (Recruiting Collaboration)
- Reviews shortlisted candidates (5-10 per req) forwarded by recruiter
- Requires quick CV scan + recruiter notes to prepare for interviews
- Pain point: Limited visibility into why recruiter shortlisted candidate (notes scattered across tabs)

**Tertiary Persona**: Talent Acquisition Leader (Operations)
- Monitors recruiter productivity and candidate pipeline health
- Requires dashboard visibility into time-to-review metrics and bottlenecks
- Pain point: Lacks real-time operational dashboards within Workday (resorts to PowerBI exits)

---

## Feature Solution

• **Unified Candidate Modal**: Clicking a candidate row opens a full-screen modal with left panel (key details: name, contact, current role, location, stage) and right panel (inline CV rendering with scrollable content)

• **Prev/Next carousel (within modal)**: Arrow buttons and keyboard shortcuts (left/right) keep recruiters in flow during batch screening; **aligns with** existing Workday **sequential review** behaviour—this spec adds **unified content** in one surface, not net-new navigation capability alone

• **Consolidated Notes Section**: Activity notes, interview feedback, and AI match insights (if enabled) appear in a collapsible section below CV panel—single scroll to see complete candidate narrative

• **Enhanced Filtering**: Boolean search operators (AND, OR, NOT) plus saved filter sets (e.g., "Saudi nationals with 5+ years cybersecurity") for rapid candidate segmentation

• **Mobile-Responsive Design**: Modal adapts to handheld viewport with swipe gestures for Prev/Next navigation; touch targets sized for finger accuracy (44px minimum per iOS/Android guidelines)

• **Performance Optimisation**: Lazy-load CV rendering (only visible content) to maintain sub-500ms modal open time even for large PDFs

---

## Critical User Journey & Use Cases

• **Invocation**: Recruiter opens Candidate Grid for a requisition (e.g., "Senior Cybersecurity Engineer - Saudi Arabia"); sees 127 applicants

• **Filter Application**: Recruiter applies saved filter "Saudi nationals, 5+ years security" → grid narrows to 23 candidates

• **Candidate Review - Modal Open**: Recruiter clicks first candidate → unified modal opens with summary (left) + CV (right) in <500ms
  - **Germany anonymisation mode**: If tenant has anonymised screening enabled (GDPR compliance), modal dynamically masks name/photo/contact in early stages; full data visible post-shortlist (respects existing Security/Functional config)
  - **GCC Arabic/RTL PDFs**: QA acceptance criteria include Arabic CV rendering legibility; complex-script PDF support validated with Docs team; Phase 1 or Phase 2 flag if platform gaps remain

• **Sequential Review - Carousel**: Recruiter reads CV, scrolls to notes section (2 screening notes from previous recruiter visible), clicks "Next" arrow → modal advances to candidate #2 without closing

• **Keyboard Shortcuts**: Recruiter uses right arrow key to advance through remaining 21 candidates in rapid succession (avg 90 seconds per candidate)

• **Quick Actions**: Recruiter clicks "Move to Screen" button (in-modal action bar) → candidate advances to Screen stage; modal stays open and auto-advances to next candidate

• **Mobile Workflow**: GCC recruiter on iPad swipes left to advance through candidates during commute; tap-to-expand notes section; pinch-to-zoom CV rendering (or fallback: "View CV" button if inline rendering unavailable)

• **Export to Comparison**: **Out of scope for 2026R2** (was referenced in v1 draft; removed to manage dependencies)

---

## Technical Considerations

### Performance Requirements
- Modal open time: <500ms (p95) for candidates with CV <5MB
- Lazy-load CV rendering: Only visible viewport content (scroll-triggered load for rest)
- Grid pagination: Load 50 candidates per page (infinite scroll for mobile)

### Accessibility
- Keyboard navigation: Tab order logical (grid → modal → actions); arrow keys for Prev/Next
- Screen reader: ARIA labels for CV content, notes sections, and modal controls
- Contrast: WCAG AA compliance for all text (4.5:1 minimum)

### Mobile Optimisation
- Touch targets: 44px minimum (iOS) / 48dp (Android) for buttons and links
- Swipe gestures: Left/right swipe for Prev/Next (with visual feedback animation)
- Viewport scaling: Responsive breakpoints for phone (320-480px), tablet (768-1024px), desktop (1280px+)

### Data Security & Privacy
- CV rendering: Server-side PDF-to-text conversion (no client-side parsing of sensitive docs); **Q2 spike** to confirm platform approach and security review
- Recruiter notes encryption: Standard Workday data protection (encryption-at-rest and in-transit per Security team standard; not "end-to-end encryption" which implies cryptographic client-side key management)
- Audit logging: Log all candidate profile views with timestamp, user, and action (GDPR Art. 30 compliance; session-based dwell time with idle threshold for minimised events per Privacy alignment)

---

## Success Metrics

### Adoption Metrics
- **Target**: 60% of active recruiters use redesigned grid within 6 months of GA
- **Measurement**: % of recruiters who open ≥10 unified modals per week (tracked via telemetry)

### Efficiency Metrics
- **Baseline**: 5 mins average time-to-review per candidate (multi-tab workflow; validated Q1 2026 with 15 enterprise customers; "thorough review" definition)
- **Target**: 3.5 mins average time-to-review per candidate (unified modal; 30% reduction)
- **Measurement**: Session-based dwell time (modal open → close with idle threshold 2 mins) — NOT time-to-stage-movement (gameable; weak proxy per Red Team review)
- **Impact**: 25 hours saved per recruiter per year (high-volume: 50+ hours)

### Quality Metrics
- **Target**: 30% reduction in "incomplete review" flags (candidates moved to Screen without notes)
- **Measurement**: % of candidates advanced to Screen stage with ≥1 recruiter note attached

### Business Impact Metrics
- **Target**: 15-point NPS increase amongst high-volume recruiting customers (Baker Hughes, Accenture, Shell)
- **Target**: 30% reduction in external tool usage (PowerBI/Excel) for candidate tracking (measured via support ticket trend analysis)

---

## Dependencies & Risks

### Dependencies
- **Canvas Kit v11**: Unified modal component with Prev/Next carousel pattern
  - **Status**: Target CK v11 for 2026R2; fallback to v10 modal + custom carousel if v11 slips
  - **Design System liaison**: [Name TBD] - validate component availability Q2 EA readiness
  - **Contingency**: If v11 unavailable, use v10 `Modal` + custom arrow navigation (de-scoped: keyboard carousel animations)
- **Document Rendering Platform**: Inline CV display capability
  - **Current approach** (per Deployment Agent): Workday opens PDFs in new tab/dedicated viewer to isolate rendering
  - **Target approach**: Server-side PDF-to-text extraction for inline display in modal right panel
  - **Q2 EA spike required**: Confirm document platform capabilities, owner team (Platform/Document Services), and security review requirements
  - **MVP fallback**: If inline rendering unavailable, use "View CV" button → opens in dedicated viewer (maintains current UX); summary fields remain visible in modal
  - **Arabic/RTL PDFs**: Explicit QA requirement for GCC; partner with Docs team on complex-script rendering; flag Phase 1 vs Phase 2 if platform gaps remain
- **Telemetry Infrastructure**: Session-based dwell time tracking with idle thresholds
  - **Measurement approach**: Track modal open → close events; idle threshold 2 mins (excludes from session time)
  - **Privacy alignment**: Minimised event logging (no keystroke tracking); GDPR Art. 30 compliant with 6-year retention for compliance logging only
  - **Leading vs lagging**: Modal open rate (leading), quality of hire proxies (lagging) - separate metrics to avoid gameable "time-to-stage-movement"

### Risks
- **Viewed / “unviewed” candidate indicator:** Deployment Agent confirms there is **no native** viewed/unviewed flag on the grid; leading practice is a **Reviewed** recruitment process step. Buyers comparing to ATS products with explicit review queues may still raise this; field narrative should not imply a native badge is in this PRD’s scope.  
- **Performance degradation**: Large CV files (>10MB) may cause modal lag → **Mitigation**: Enforce 5MB upload limit + lazy-load rendering; Q2 EA spike validates <500ms p95 target with inline approach or triggers fallback to viewer
- **Mobile adoption lag**: Recruiters unfamiliar with swipe gestures → **Mitigation**: In-app tutorial on first mobile use + fallback button controls
- **Browser compatibility**: Unified modal may not render correctly in older IE versions → **Mitigation**: Deprecate IE support (enterprise browser policy trend: 95%+ on Chrome/Edge/Safari per industry data); validate % of customers on locked legacy browsers before GA comms
- **Germany anonymisation conflict**: Default "full context" modal may breach configured anonymised screening → **Mitigation**: Documented in Critical User Journey; dynamic masking respects Security/Functional config; dependency on config patterns validated before 315 assumes one layout globally
- **GCC Arabic/RTL rendering**: Inline CV may ship unreadable previews for Arabic-language CVs → **Mitigation**: Explicit QA acceptance criteria; partner with Docs team; flag Phase 1 vs Phase 2 if complex-script gaps remain
- **Cross-initiative metric conflict**: Time-to-review metric overlaps with GCC-E2E-002 Recruiter Dashboard → **Mitigation**: Align metric ownership (grid UX = leading indicator; dashboard = lagging analytics); single source of truth for baseline definition

---

## Competitive Analysis

### Regional Specialists (GCC)
- **Talentera** (Bayt.com): Lightweight, fast candidate grid with inline CV preview—benchmark for speed
- **ZenHR** (ZenATS): Mobile-first design with swipe navigation—strong in GCC SMB market
- **Perception gap**: Multi-area profile (Summary / Activity / Documents) vs competitors’ **single-glance** layouts—not a gap on **list + sort + mass action** or **sequential** candidate movement (see CI brief)

### Global Enterprise Platforms
- **SAP SuccessFactors**: Similar multi-tab candidate profile; no unified modal in standard config
- **Oracle Taleo**: Dated UI with heavy page reloads; Workday already superior on performance
- **Greenhouse** (SMB): Unified candidate view with Prev/Next carousel—**parity** on sequential UX; Workday’s **2026R2** bet is **enterprise compliance + one-surface density**

**Workday differentiation post-redesign** (aligned with `e2e-ci-brief-candidate-grid-redesign-2026-03-22.md`): Combines enterprise-grade compliance (audit logs, standard data protection, Germany anonymisation support, GCC Arabic/RTL QA) with **single-surface** review (summary + CV + notes + timeline narrative in one modal). **Native today:** sequential review between candidates; **true gap if shipped:** simultaneous inline CV + summary + notes/timeline without tab changes; **workaround/partial today:** dedicated PDF viewer / new tab for attachments.

---

## Regulatory & Compliance Considerations

### GDPR (EU/EEA)
- **Art. 30 (Record-Keeping)**: Audit logging of all candidate profile views required → **Implementation**: Telemetry logs with 6-year retention
- **Art. 17 (Right to Erasure)**: Candidate can request profile deletion → **Implementation**: Purge workflow includes CV rendering cache + modal view logs

### GCC Data Privacy Laws
- **Saudi PDPL 2023**: Candidate consent required for CV processing → **Implementation**: Consent captured at application; CV rendering respects opt-out
- **UAE PDPA 2022**: Cross-border data transfer restrictions → **Implementation**: Open decision with Legal + Hosting teams; tie to tenant data residency offerings (not feature-specific CV cache)

### Accessibility (US ADA / EU Accessibility Act)
- **Keyboard navigation**: Full modal control via keyboard (no mouse required)
- **Screen reader support**: ARIA labels for all CV content and notes sections
- **Colour contrast**: WCAG AA compliance (4.5:1 minimum) for all text

---

## Out of Scope (Future Phases)

### Phase 2 (2026R2+1 or 2027R1)
- **AI-Assisted Candidate Matching**: "Similar candidates" and "Search across database" surfaces (Theme 3 from **v52** / prior PMF research)
- **HiredScore Integration**: Match score prominence in unified modal (per P2, P3 feedback)
- **Collaborative Shortlisting**: Hiring manager inline commenting within candidate modal
- **Export to comparison view**: Shortlist comparison UI (referenced in v1 draft; removed from 2026R2 to manage dependencies)

### Not Planned
- **Full CRM capabilities**: Workday will not replace dedicated CRMs (Phenom, HiredScore) for sourcing workflows
- **Candidate self-service modal**: External candidate cannot see this unified view (recruiter-only tool)

---

## Red Team Revision Summary (v46 baseline + v50/v52 E2E passes)

**v52 (GCC-E2E-011) alignment:** Same product intent as v50 PRD; **source PMF** advanced to **v52**; **101** re-run with **new** Deployment Agent thread (`eb984a05-f81e-44f5-8c59-f7cf1575f0fc`) and refreshed brief body for HITL **#5**. Competitive framing unchanged: **native** sequential review; **single-surface / tab reduction** as primary product delta.

**v50 (GCC-E2E-009):** Prior E2E pass aligned executive summary, overview, and competitive sections to **101** CI; superseded for **mission state** by **E2E-011** but technical content carried forward.

**Addressed Red Team findings (v46 review; retained in this document)**:
1. **PDF Rendering**: Clarified Q2 spike requirement, platform approach (current = new tab/viewer), MVP fallback if inline unavailable
2. **Adoption/Volume Math**: Reconciled 60% target with explicit ramp model (20%→40%→60% over 12 months); Year 1 = 50M sessions; steady-state 75M; capacity ceiling documented
3. **Baseline Inconsistency**: Aligned with v42 (5 mins/candidate thorough review); 30% reduction target (vs v42's 40%; more conservative for inline CV load time); cited Q1 2026 measurement study
4. **GCC Arabic/RTL**: Explicit QA acceptance criteria; Docs team partnership; Phase 1/2 flag if platform gaps
5. **Germany Anonymisation**: Documented in Critical User Journey; dynamic masking respects Security/Functional config; dependency validated before 315 assumes one layout
6. **Canvas Kit v11**: Added liaison, target version matrix, fallback if v11 unavailable
7. **Telemetry Weak Proxy**: Replaced time-to-stage-movement with session-based dwell time (idle threshold); Privacy-aligned minimised events
8. **E2E Encryption Wording**: Aligned with Workday standard data protection (at-rest/in-transit; removed "end-to-end" overstatement)
9. **Regional Residency**: Moved UAE PDPA cache to "open decision" with Legal+Hosting (not feature-specific)
10. **Export to Comparison**: Moved to Out of Scope (was unmanaged dependency)
11. **Cross-Initiative Conflict**: Noted alignment with GCC-E2E-002 Dashboard (grid UX = leading; dashboard = lagging)
12. **Incremental Value**: Clarified delta vs existing slide-out panel/CV preview/grid tabs (per Deployment Agent grounding)

**Document Status**: v52 PRD (Post–Red Team v46 + v50 CI; **E2E-011** PMF v52 + fresh **101**)  
**Next Steps**: **315** PASS 1–2 → `design/gcc-candidate-grid-redesign-v52-discovery-brief.md` → **319** (Copy Inventory) → **315** PASS 3–4 **Final Verdict: APPROVED** → **320** → **319** spot-check → **330** → **400**  
**Note:** v50 discovery brief remains valid **reference**; v52 pipeline expects a **v52**-named brief or explicit brief refresh for traceability.  
**Contact**: David Denham (david.denham@workday.com)
