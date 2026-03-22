# Workday user research sources

Canonical **PDFs** for common Recruiting-related user types. Use these for depth (motivations, scenarios, vocabulary, anxiety points). For **fast agent extraction** of recruiter and hiring-manager JTBD lines, prefer [`docs/jtbd-recruiting-hr-professional-and-manager.md`](../jtbd-recruiting-hr-professional-and-manager.md) first; open the supplemental PDF when you need the full HR Professional JTBD guide.

**Version:** V1.0 (personas and supplemental guide as supplied by Workday UX / JTBD programmes).

## Files in this folder

| File | User type | Use when |
|------|-----------|----------|
| [`HR-Professional-JTBD-Supplemental-Guide-V1.0.pdf`](./HR-Professional-JTBD-Supplemental-Guide-V1.0.pdf) | **HR Professional** (Recruiting / Talent Acquisition) | Deep JTBD context beyond the curated markdown excerpt; strategic alignment for PRDs and discovery |
| [`Frontline-Manager-UX-Persona-V1.pdf`](./Frontline-Manager-UX-Persona-V1.pdf) | **Frontline Manager** (hiring manager on the front line) | Features primarily for managers who hire from the floor (distinct from generic “hiring manager” where this persona applies) |
| [`External-Candidate-UX-Persona-V1.pdf`](./External-Candidate-UX-Persona-V1.pdf) | **External Candidate** | Candidate-facing flows, career site, application, comms; tone and friction points |

## Mapping to agent artefacts

- **200-prd-writer**: **Audience / Personas** and JTBD narrative — cite which PDF informed Primary/Secondary/Tertiary users.
- **315-ux-designer**: Discovery Brief (multi-pass, including internal peer review) — reference persona PDFs for **prototype implications** and **Worker (candidate)** / frontline manager flows; spot-check in PASS 3 that briefs do not contradict these sources when the PRD claims a segment.
- **320-prototype-developer**: Labels, tasks, and empty states grounded in realistic behaviour for the named persona.
- **319-doc-writer**: Candidate-facing or frontline manager **strings** (still follow `010-style-guide.mdc` and Workday terms, e.g. **Candidate** not “Applicant” where editorial rules say so).
- **330-figma-creator**: Optional context when capturing or analysing flows for these personas.

## If PDFs are missing locally

Original filenames in Downloads (copy into this folder and rename to match the table above if needed):

- `HR Professional_JTBD_Supplemental Guide_V1.0 2 - HR Professional v1 JTBD.pdf`
- `Frontline Manager UX Persona V1.pdf`
- `External Candidate UX Persona V1.pdf`

**Confidential or large files:** You may keep PDFs **outside** git and set `LOCAL_PDF_ROOT` in your notes, or use **Git LFS**. If omitted from the repo, add a one-line pointer in this README to your local path.

## Related repo docs

- [`docs/jtbd-recruiting-hr-professional-and-manager.md`](../jtbd-recruiting-hr-professional-and-manager.md) — curated excerpt for agents (recruiter + manager hiring subset)
- [`docs/experience-principles.md`](../experience-principles.md) — Empower, Trust, Grow
