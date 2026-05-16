# Two-way recruiting email — initiative context

Single entry point for agent and human sessions about **profile-anchored two-way email** in Recruiting. **@** this file (or keep it open) when starting a thread so the model loads paths, not pasted walls of text.

## Canonical PRD (source of truth)

- [India candidate profile two-way recruiting email PRD](../../prds/india-candidate-profile-email-conversation-prd.md)

## Refinement transcripts and notes

- **Transcripts:** add `.md`, `.txt`, or session PDFs under [`transcripts/`](transcripts/) and list each linked file below (agents: read every file linked here when working this initiative).
- [110526 — User story mapping session (PDF)](transcripts/110526-user-story-mapping-2-way-email.pdf) — workshop / story mapping meeting export.

- **User story map (420 artefact):** [`story-map/user-story-map-export.pdf`](story-map/user-story-map-export.pdf) — exported user story map (visual).

- **Decision log:** [decisions.md](decisions.md) — dated decisions, scope cuts, HITL outcomes (keep concise; PRD remains authoritative for requirements).

## Related research and strategy (supporting, not a substitute for the PRD)

- **Initiative user research readout:** [2-Way Email research readout (PDF)](user-research/2-way-email-research-readout.pdf)
- PMF thematic (mission **INDIA-E2E-006**): [India PMF analysis INDIA-E2E-006](../../../research/India/thematic-analysis/2026-05-07-India-PMF-Analysis-INDIA-E2E-006.md)
- Strategy context: [strategy-context INDIA-E2E-006](../../../research/India/strategy-context-2026-05-07-INDIA-E2E-006.md)
- 105 user research: [105-user-research-findings](../../../research/India/105-user-research-findings.md)
- CI supplement: [in-competitive-scan-2026-05-07-INDIA-E2E-006](../../../research/competitive/in/in-competitive-scan-2026-05-07-INDIA-E2E-006.md)

## Design and prototype

- Design brief: [india-candidate-profile-email-v92-design-brief.md](../../../design/india-candidate-profile-email-v92-design-brief.md)
- Prototype route: `#2-way-email-prototype` (legacy `#india-candidate-profile-email-v92`); flow map [2-way-email-prototype-flow.md](../../../design/2-way-email-prototype-flow.md)
- Compose MVP UI boundaries: `.cursor/rules/012-conversational-email-compose-mvp.mdc` (applies under `design/**/*` for this compose path)

## Backlog and functional grounding

- **Mission handoff:** [MISSION_LOG.md](../../../MISSION_LOG.md) — active row **INDIA-E2E-006**. **Jira epic:** [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977) — shard → issue mapping: [`drafts/out_batch/story-jira-mapping.json`](drafts/out_batch/story-jira-mapping.json).
- **Gap review — WhatsApp companion epics (pattern hints only):** [COMPANION_WHATSAPP_EPICS.md](COMPANION_WHATSAPP_EPICS.md) — canonical HRREC epic keys and URLs for `/user-story-gap-review` cross-initiative scan (013). **Mandatory** on every **HRREC-82977** gap-review run unless the user explicitly opts out (phrases in [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) **When to run**). **Default corpus path:** **manifest-only** reading of [`reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md`](reference/WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md) (no live Jira for WhatsApp on that path)—see [`reference/README.md`](reference/README.md). **Opt-in:** **`WhatsApp live delta`** / **`WhatsApp refresh corpus`** for live Jira delta with snapshot. **Fallback:** full Story+Bug inventory + `getTicketDetails` per key if snapshot is ineligible or the user says **`WhatsApp live-only`** / **`ignore WhatsApp snapshot`**; not a requirements import for email.
- **Story writing supplement (430 Layer 1):** [STORY_WRITING_SUPPLEMENT.md](STORY_WRITING_SUPPLEMENT.md) — initiative-only summaries, Notes links, MB/split-send vocabulary; read with **430** before drafting Jira bodies.
- **Draft user stories + BDD (from story map + transcript):** [`drafts/user-stories-bdd-2-way-email.md`](drafts/user-stories-bdd-2-way-email.md) — verify milestone bands vs PDF before 420 HITL / Jira (**430**).
- **Stories / refinement:** use rules **400** (backlog refinement), **420** (story mapping), **430** (story writing) with the PRD above.
- **Workday behaviour:** `.cursor/rules/050-functional-knowledge.mdc` and `functional-knowledge/` as needed; MCPs per `000-master-orchestrator.mdc`.

## Non-goals reminder

Compose-path MVP exclusions (templates row, GenAI on compose toolbar, etc.) live in **012** — do not “restore” those without explicit PM approval.
