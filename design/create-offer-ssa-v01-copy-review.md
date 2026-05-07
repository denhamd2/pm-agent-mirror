---
feature: Create Offer SSA v01 — Ideas 1–4 copy review
scope: New copy introduced in v0.2 addendum (Idea 1a Overlap, 1b Approval map, 2 QA deck, 3 DE collective agreement, 4 Approver packet preview)
authoritative_source: .cursor/rules/319-copy-review.mdc + .cursor/skills/editorial-guidelines
status: APPROVED with 2 minor fixes applied inline in the brief
---

# 319 Copy Review — Create Offer SSA v01, Ideas 1–4

Reviewer stance: only the new copy strings introduced in the v0.2 addendum (PASS 2 §7 "Idea 1a / 1b / 2 / 3 / 4" sub-blocks and §H Unhappy-paths v0.2 rows) are in scope here. PASS 2 base copy was approved in the prior cycle.

## Editorial checklist

| Check | Result | Notes |
|---|---|---|
| Sentence case everywhere | ✅ Pass | All new labels, buttons, and section titles use sentence case. "Setup" and "Workday" retained as proper nouns. |
| Numerals for countable values | ✅ Pass | "6 of 6 passed", "12 days", "3-line summary" — numerals preserved. |
| Concise / action-led buttons | ✅ Pass | "Delegate", "Ping", "Open in Writer", "Revise start date", "Add HRBP approval", "Send without summary" — all verb-first. |
| Three-part error pattern (Problem + Reason + Next steps) | ✅ Pass | Applied to overlap-breach, OOO-no-delegate, QA hard-fail, regulated-tenant override attempts. |
| British English | ✅ Pass | "acknowledgement", "cost centre" used; no US-English leaks spotted. |
| Contractions consistent with SSA voice | ✅ Pass | "I'll", "can't", "don't", "you're", "they've", "I've", "didn't" all present. |
| Specific over vague | ✅ Pass | Count bullets ("6 of 6 passed"), named approvers, date formats, wage-group IDs. |
| No error codes / over-apologising | ✅ Pass | No error numbers or "Something went wrong"-style fallbacks. |
| AI disclosure copy (per 319 §AI disclosure) | ✅ Pass | Idea 4 carries always-visible disclosure: "Generated with Workday AI. Every number is a live link back to the source data. You can tune the tone in chat." |
| Legal-sensitive flagging | ✅ Pass | 060 flag set on Idea 4 AI-summary switch + GDPR retention of AI approver-facing text. |
| Idiom-free for global users | ⚠️ Fixed | Removed one idiom ("on your say-so" → "when you tell me to"). |
| Ampersand in body copy | ⚠️ Fixed | "Compensation & pay-band summary" → "Compensation and pay-band summary" (reserve "&" for product names and brand marks only, per editorial skill). |

## Fixes applied inline in `design/create-offer-ssa-design-brief.md`

1. Approval map card helper — was: "Live status from the business process. I'll ping or delegate on your say-so." — now: "Live status from the business process. I'll ping or delegate when you tell me to." (British English is globally read; "say-so" is a US-leaning idiom that pseudo-translates poorly.)
2. Approver packet CollapsibleSection title — was: "Compensation & pay-band summary" — now: "Compensation and pay-band summary" (Editorial Guidelines reserve "&" for brand names and product marks).

## AI voice spot-check (per 319 §Brand voice + Canvas AI Persona)

- First-person agent: "I ran 6 checks", "I kept the citations", "I'd convert at today's rate" — ✅ consistent with the base brief.
- Direct, non-hedging: "Blocks send — ...", "I can't turn this on for your tenant." — ✅ confident where confidence is warranted.
- Hedges only where uncertainty is real: absent in this addendum because every new string narrates a known system state (BP status, QA verdict, tenant config, worksheet values).
- No emoji, no exclamation marks, no double punctuation.

## 060 legal flags carried forward

- Idea 4 AI-summary switch + its always-on disclosure line: confirm GDPR retention posture for AI-generated approver-facing text (assumed: retained with the offer's audit trail for the tenant's standard retention window).
- Idea 2 QA deck "Open in Writer" deep links: if a check fails because of comp data, the evidence link must respect DAP — can't deep-link a non-permissioned approver into a payroll worksheet. 060 to confirm scope of the evidence surface.
- Idea 3 Collective-Agreement acknowledgement text ("I've reviewed the collective-agreement terms with {candidate name} or will before Send.") is a soft legal attestation. 060 to confirm the wording is neutral enough for non-legal tenants but firm enough for works-council compliance.

## Final verdict: APPROVED

Ready for 320 (prototype code update). Both fixes already applied to the brief; 320 should use the brief as the source of truth for all copy strings.
