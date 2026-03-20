# Discovery & Design Brief: GCC Candidate Grid, Search, and AI-Assisted Matching

**PRD:** `docs/prds/gcc-candidate-grid-search-prd.md`  
**Created:** 20 March 2026  
**Agent:** 315-ux-designer  
**Mission:** MISSION-017 — GCC E2E v40 — HITL **#6**

---

## Executive summary

The feature lands on **Requisition → Candidates** and **Find candidates**, extending existing Recruiting surfaces rather than a new app. The prototype demonstrates **unified summary** layout (pattern **D** dense workspace), **boolean search** affordances with a syntax reference modal, and a **right-rail AI suggestions** card that is explicitly **advisory** with recruiter actions. Visual target: **Sana** neutrals, **`WorkdayTopNav`** + **`WorkdayLeftTabBar`**, no heavy blueberry chrome.

---

## Workflow context

### Existing Workday flow

- Recruiters manage candidates per requisition and use **Find candidates** (or equivalent) for database search.
- Today, deep candidate context often requires **multiple tabs** and external tools for search/export.

### When this feature is used

- **Trigger:** Active hiring on GCC (or global) reqs; sourcing from existing talent pool.
- **Frequency:** Daily for high-volume recruiters.
- **Personas:** Recruiter primary.

---

## Jobs to be done (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

### Recruiter (HR Professional)

- **Outcome area:** Manage candidates throughout the recruiting process; Source high quality candidates for active job requisitions  
- **Worksheet JTBD (verbatim):**  
  - *Determine if candidate meets requirements of the job*  
  - *Progress candidates through the stages of the pipeline as efficiently as possible*  
  - *Source high quality candidates for active job requisitions*  
- **Synthesised JTBD:** *When I am working a high-volume requisition, I want to scan, search, and shortlist candidates in one coherent surface, so I can progress the right people faster without losing compliance or context.*

### Prototype implications

- Show **requisition context** (title, location) and **stage** clearly.
- **Unified view** must make “at a glance” possible; profile deep-dive is secondary.
- **AI** must show **disclosure**, **scores as suggestions**, and explicit **Add to pipeline** / dismiss — no auto-move.

---

## Placement decision

### Recommended placement

- **Primary:** **Job requisition → Candidates** — layout toggle **Classic / Unified summary**; table is the hero.
- **Secondary:** **Find candidates** — search bar, boolean help, saved search chip (represented as banner + modal in prototype).
- **Entry:** Recruiter Hub → Job requisitions → [Req] → Candidates (place-in-product via left hub + page title + tabs; no breadcrumb strip).

### Integration points

- Pipeline stages, candidate profile (deep link affordance), audit log (label only in prototype).

### Alternatives considered

- **Standalone “Matching” app** — Rejected: fragments workflow; recruiters work from req context.
- **AI-only modal** — Rejected: suggestions need persistent visibility alongside grid during triage.

---

## Visual shell & references

- **Primary shell pattern:** **D** (dense workspace: tabs/filters, table, optional bottom/rail actions).
- **Reference:** `design/references/recruiter-flow/README.md` — dense list/table patterns; Sana: `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`
- **CommunicationDock:** **No** (not a comms feature).

---

## Reusable layout components (for 320)

- **`WorkdayTopNav`:** Yes — default Sana config.
- **`WorkdayLeftTabBar`:** Yes — tabs e.g. Overview | **Candidates** | Interviews (Candidates active).
- **`CommunicationDock`:** No.

---

## Functionality scope (prototype)

1. Page title and tabs convey req + Candidates view (no breadcrumb strip)  
2. Toggle: **Classic** vs **Unified summary** (copy explains tab reduction)  
3. Toolbar: search field, **Boolean syntax** (opens `Modal`), **Get suggestions** (populates AI rail)  
4. **Table:** Name, Stage, Location, Skills summary (unified), **Match** (after suggestions), Last activity  
5. **Right card:** AI suggestions list with disclaimer, confidence/match %, **Add to pipeline** / **Dismiss**  
6. **Banner:** Saved search chip mock (“GCC IC3 Arabic Dubai”)

### Out of scope for prototype

- Real search engine, real ML, backend pagination, full profile tabs.

---

## Compliance & security

- **EU AI Act / GDPR:** AI suggestions are **non-decisive**; transparency copy in UI; logging called out in PRD.
- **Permissions:** Recruiter role only (implied).

---

## Design rationale (Six Hats synthesis)

- **White:** v40 Theme 6; P2-led grid/search; Win/Loss not required for this theme.
- **Red:** Recruiters want less tab fatigue; scepticism of “black box” AI — address with rationale snippets.
- **Black:** Risk of perceived auto-hiring — mitigated by explicit actions and copy.
- **Yellow:** Faster shortlisting; higher in-product engagement vs Excel.
- **Green:** Future: HiredScore alignment already assumed integrated per style guide — show “signals” not a separate product.
- **Blue:** Ship prototype on **req candidates** surface with unified toggle + AI rail.

---

## Implementation guidance for 320

- Import shell from `design/components`; use **`SANA_PAGE_CANVAS`**, **`Table`** compound API, **`Modal`**, **`PrimaryButton`** / **`SecondaryButton`**, **`Banner`**, **`Tabs`** if needed with `data-id`.
- **Do not** reimplement top nav or left rail.

---

## Appendices

### Deployment Agent

- *Not invoked in this session; placement follows standard Recruiting req → Candidates pattern.*

### Functional knowledge

- Candidate lifecycle and pipeline stages; search governed by security domains (detail in implementation epics).
