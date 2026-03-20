# Compliance review (060-style): GCC candidate grid & AI suggestions — MISSION-017

**Scope:** `design/gcc-candidate-grid-search.tsx` — AI-assisted match ranking panel and table ordering.

## Applicable regulations

- **EU AI Act:** Recruitment / candidate ranking → **high-risk** (Annex III). Requires risk management, transparency, human oversight, logging.
- **GDPR Art. 22:** No solely automated decisions with legal or similarly significant effect; right to human review.
- **GCC PDPL-class laws:** Transparency and lawful basis for profiling where applicable.

## Assessment

| Check | Status |
|-------|--------|
| Human oversight before stage change | Pass (explicit Add to pipeline / Dismiss) |
| No auto-reject / auto-advance from AI alone | Pass (by design) |
| User-visible transparency | Partial — needs product/legal wording for candidates if scores surface outside internal views |
| Audit trail | Called out in PRD; not implemented in prototype |

**Risk level:** Medium (prototype); **High** if shipped without DPIA and full Art. 50 / Art. 13–14 flows.

## Recommended actions

1. DPIA before GA of AI-assisted matching.
2. Candidate-facing disclosure if models influence visibility or ordering visible to candidates.
3. Log suggestion ID, model version, recruiter action (accept/dismiss).
4. Ensure **HiredScore** (if used) aligns with same oversight pattern per enterprise agreements.

**Not legal advice** — confirm with Workday Legal.
