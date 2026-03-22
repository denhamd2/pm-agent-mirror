# Discovery & Design Brief: GCC Candidate Grid Redesign (v42 #2)

**PRD:** `docs/prds/gcc-candidate-grid-redesign-v42-prd.md`  
**Created:** 20 March 2026  
**Mission:** GCC-E2E-003 — HITL **#2** Candidate Grid Redesign

---

## Executive summary

Deliver a **unified candidate review panel** on **Job requisition → Candidates** so recruiters see **fit-relevant context** and **resume** together, cutting the **multi-tab tax** called out in v42 (P1, P2). The existing Canvas Kit prototype (`gcc-candidate-grid-search.tsx`) already demonstrates **left detail / right resume**, **prev/next**, and **Sana** shell (**`WorkdayTopNav`**, **`WorkdayLeftTabBar`**). This brief **narrows** scope vs MISSION-017: **hero outcome = grid redesign / review panel**; boolean help and AI rail are **secondary** demos, not required for v42 acceptance.

---

## Jobs to be done (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

### Recruiter

- **Worksheet:** *Determine if candidate meets requirements of the job*; *Progress candidates through the stages of the pipeline as efficiently as possible*  
- **Synthesised JTBD:** *When I am triaging many applicants on one requisition, I want key facts and the resume in one place, so I can decide and document faster without losing context.*

### Prototype implications

- **Left column:** Stage, location, skills line, **notes** affordance, last activity, optional **fit** badge (concept only).  
- **Right column:** Resume text (scroll).  
- **Navigation:** Prev / next + keyboard arrows tied to **current grid order**.

---

## Placement decision

- **Primary:** **Job requisition → Candidates** — row click opens **unified panel**.  
- **Entry:** Recruiter Hub → Job requisitions → [Req] → **Candidates** tab.  
- **Alternatives rejected:** Standalone “viewer app” (fragments flow); full-page takeover without grid context (loses queue mental model).

---

## Visual shell & references

- **Sana Style:** `010-style-guide.mdc` — neutral canvas, white cards, pill search in top nav.  
- **Reference PNG:** `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`  
- **Components:** Shared shell from `design/components/`; Canvas Kit MCP for tokens.

---

## Six Hats (lightweight validation)

| Hat | Note |
|-----|------|
| White | Evidence: v42 themes + P1/P2 quotes on tabs and time cost |
| Red | Recruiters feel “the system fights me” on high-volume days |
| Yellow | Single surface could be the fastest win for NPS |
| Black | Engineering: virtualised grid + heavy docs preview may need performance work |
| Green | Prev/next queue + saved filter sets (later) |
| Blue | Proceed: prototype demonstrates core layout; PRD scopes MVP |

---

## Handoff to 320

- **File:** `design/gcc-candidate-grid-search.tsx`  
- **Change:** Ensure header comment references **GCC-E2E-003**; **`main.tsx`** mounts **`GccCandidateGridSearch`** for capture.  
- **Optional:** Tone down AI/boolean promos in UI if stakeholder wants **pure #2** demo (product decision).

---

## Handoff to 330

- Run design app on **`http://localhost:5199/`** with Figma capture hash as per `design/README.md`.  
- Target: new or existing Figma file per PM preference; link epic in MISSION_LOG after capture.
