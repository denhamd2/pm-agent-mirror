# Story map: GCC Candidate Grid Redesign (v42)

**Epic draft:** `docs/epics/gcc-candidate-grid-redesign-v42-epic-draft.md` (from **410**; create via 410 if missing)  
**Jira epic:** *TBD — **430** creates the epic from the draft after **420** HITL approval. Do not pre-fill a key; a prior key (e.g. HRREC-90976) is not authoritative for the next run.*  
**PRD:** `docs/prds/gcc-candidate-grid-redesign-v42-prd.md`  
**Date:** 20 March 2026

---

## Backbone (user activities)

1. **Open requisition pipeline** — Navigate to job requisition → Candidates  
2. **Scan candidate list** — Sort, filter, select a candidate  
3. **Review in unified panel** — Read summary + resume in one surface  
4. **Document triage** — Add or view recruiter notes (policy-aligned)  
5. **Move through queue** — Next / previous candidate without returning to grid  
6. **Exit to grid** — Close panel; resume table context  

---

## Value slices

### VS1 — Unified review panel (MVP goal)

**Goal:** Recruiter completes “read CV + check key facts” without tab hopping.

| Story (high level) |
|--------------------|
| Open unified modal/slide-over from grid row |
| Left rail: stage, location, skills summary, last activity |
| Right pane: resume text preview (scroll) |
| Close panel; return to grid with state preserved |

### VS2 — Queue navigation

**Goal:** Walk filtered shortlist efficiently.

| Story (high level) |
|--------------------|
| Next / previous candidate in current grid order |
| Keyboard shortcuts (arrows) with focus management |
| Optional: position indicator (e.g. 3 of 12) |

### VS3 — Notes & permissions

**Goal:** Support triage notes without wrong-stage friction (where product policy allows).

| Story (high level) |
|--------------------|
| Notes field visibility rules by stage / role |
| Persist notes to candidate on req context |
| Audit-friendly “last updated” metadata |

---

## HITL (420)

**Do not create Jira stories until PM approves.**

Options:

- **Approve all** — Create **Jira epic +** stories for VS1, VS2, VS3 (epic only in **430**)  
- **Approve VS1 only** — Create **Jira epic +** VS1 stories only  
- **Request changes** — Reply with edits to backbone or slices  

---

## Handoff to 430

After **420** approval: **430** reads this story map + the epic draft path above, **creates a new Jira epic**, then creates stories with **BDD** acceptance criteria and **Epic Link** to that new key.
