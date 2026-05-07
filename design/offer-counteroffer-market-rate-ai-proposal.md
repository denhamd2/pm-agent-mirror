# Offer prototype proposal — Counter-offer modelling / market-rate AI

**Audience:** Product, UX, Engineering, Legal/Compliance  
**Scope:** Concept proposal for the Offer SSA prototype (not production commitment)  
**Date:** 2026-05-01  
**Status:** Proposal draft for PM review

---

## 1) Problem framing

Offer has strong customer pain, but the pain is currently framed as **trust, visibility, and control** rather than explicit demand for AI negotiation support.

From [`docs/offer-flow-ai-customer-ideas.md`](../docs/offer-flow-ai-customer-ideas.md):

- There is **no direct customer ideation signal** for:
  - counter-offer modelling,
  - market-rate AI,
  - candidate negotiation copilot.
- There is **strong direct signal** for:
  - requisition-scoped compensation visibility,
  - least-privilege access to comp components,
  - earlier comp context before the Offer BP,
  - auditable “who saw what and when”.

### Implication

Counter-offer / market-rate AI should be positioned as a **hypothesis-led extension** that sits on top of a trust-first Offer foundation:

1. compensation scope visibility,
2. explainable pay-band checks,
3. auditable approval and rationale trails.

---

## 2) What this concept is (and is not)

### In scope (proposal)

- **Non-binding recommendation assistant** in Offer Compensation step:
  - suggests 2–3 counter-offer options,
  - shows impact versus pay-band and approval implications,
  - explains rationale with transparent signals.
- **Market-rate context panel** (phase-gated):
  - starts with internal signals (band + peers + historical accepted ranges),
  - later adds external benchmark feed when governance/API are ready.
- **Counter-offer scenario simulator**:
  - “If we move base to X / bonus to Y, what changes in approvals, cycle time, and acceptance probability band?”

### Out of scope (for this phase)

- Auto-sending candidate offers or auto-accepting model suggestions.
- Candidate-facing AI negotiation bot.
- Black-box probability scoring without explainable factors.
- Any production legal copy commitments without 060 review.

---

## 3) Proposed UX insertion points in Offer SSA

Target file: [`design/create-offer-ssa-v01.tsx`](create-offer-ssa-v01.tsx)

### 3.1 Compensation step (primary)

Add a new card: **Counter-offer modeller**

- Inputs:
  - target base,
  - bonus target %,
  - sign-on,
  - equity units.
- Outputs:
  - recommendation options (Conservative / Balanced / Competitive),
  - pay-band status (within / above / below),
  - likely approver path delta,
  - confidence tier + rationale bullets.

Example card rows:

- `Balanced`: EUR 98,000 + 15% + 1,500 RSU  
  - Band: within upper quartile
  - Approval: HM + TA Director (no comp partner)
  - Confidence: Medium
  - Why: 3 internal accepted offers at similar level/location

### 3.2 Review & send step (decision safety)

Add a compact **Recommendation rationale summary**:

- selected option versus original proposal,
- expected trade-off:
  - acceptance likelihood band,
  - approval complexity,
  - time-to-send risk.

Add explicit copy:

- “Recommendation is advisory. You remain the decision owner.”

### 3.3 Approver packet section

If AI summary is enabled, include:

- “Why this offer shape” section,
- model confidence and top factors,
- citation links to internal sources.

Redaction behavior remains mandatory for restricted comp viewers.

---

## 4) Data model and confidence strategy

### Phase 1 (internal data only; lower legal risk)

Use internal signals only:

- pay-band ranges (existing logic),
- country overlay constraints,
- internal accepted/declined offer patterns by role/location/level,
- approval chain outcomes (cycle time, bottlenecks).

Confidence labels:

- `Low`, `Medium`, `High` (no opaque percentages in v1),
- always accompanied by 2–4 rationale bullets.

### Phase 2 (external benchmark integration)

Optional external market-rate enrichment:

- ingest benchmark source with timestamp freshness,
- normalize by location and level,
- show source provenance and staleness indicator.

No external benchmark usage in recommendation ranking unless:

- legal/compliance approved,
- data freshness and licensing controls are in place.

---

## 5) AI UX guardrails (from canon)

Source: [`design/references/ai-experience-guidance.md`](references/ai-experience-guidance.md)

### Before interaction

- Explicit disclosure near feature entry:
  - “AI-assisted recommendation. Review before applying.”
- Capability expectations:
  - can suggest compensation scenarios,
  - cannot make binding decisions.

### During interaction

- User control:
  - edit any value,
  - reject recommendation,
  - choose manual mode.
- Explainability:
  - “show factors” on each recommendation.
- Error handling:
  - three-part structure (problem / reason / next step).

### Over time

- Feedback controls:
  - thumbs up/down for recommendation helpfulness.
- Memory transparency:
  - explicit statement of what is remembered and for how long.
- Off switch:
  - per-offer toggle and tenant-level disable.

---

## 6) API and feasibility map

Baseline source: [`docs/xo/feasibility/recruiting-prototypes-api-gap-analysis.md`](../docs/xo/feasibility/recruiting-prototypes-api-gap-analysis.md)

### Likely available / partially available

- Offer worksheet read/edit surfaces (via convenience-task path, depending on implementation maturity).
- Country overlays and approval task data in BP/inbox systems.
- Existing offer-events service (narrow scope, not sufficient for modelling).

### Likely missing (proposal-level placeholders)

- `GET /.../payBandEvaluation` (or equivalent block on worksheet payload)
- `GET /.../offerCounterOfferModel` (scenario recommendations + rationale)
- `GET /.../offerApprovalImpactEstimate` (approver path/cycle impact for scenario)
- `GET /.../offerMarketBenchmarks` (phase-2 external enrichment)
- `POST /.../offerRecommendationFeedback` (thumbs up/down + reason)

### API phase priorities

- **P0:** pay-band evaluation + scenario recommendation + rationale payload
- **P1:** approval impact estimate + feedback capture
- **P2:** external market benchmarks integration

---

## 7) Legal/compliance and policy considerations

This concept touches compensation recommendations and therefore requires explicit governance:

- Run 060 review for:
  - disclosure language,
  - recommendation wording,
  - any memory/feedback retention behavior.
- Keep “advisory only” language visible at decision points.
- Require auditable logs for:
  - recommendation viewed,
  - recommendation applied/ignored,
  - factors shown to user.

---

## 8) Success metrics (prototype and product)

### Prototype success (design validation)

- Recruiters understand recommendation rationale without facilitator explanation.
- Users can identify and override recommendations within one step.
- No confusion about AI authority (advisory vs binding).

### Product hypothesis metrics (if pursued)

- Reduced offer renegotiation loops per requisition.
- Reduced time from compensation edit to send-for-approval.
- Lower “out-of-band surprise” rate at review/send.
- Improved approver turnaround when rationale is attached.

---

## 9) Risks and mitigations

### Risk 1: weak direct customer demand for this specific AI feature

- **Mitigation:** Position as hypothesis; lead messaging with trust/safeguard improvements first.

### Risk 2: overreliance on opaque scoring

- **Mitigation:** confidence tiers + factor-level explanation + mandatory manual override.

### Risk 3: legal sensitivity of compensation guidance

- **Mitigation:** 060 review gate before any candidate- or approver-facing wording is frozen.

### Risk 4: API immaturity

- **Mitigation:** phase rollout (internal signals first, external market feed later).

---

## 10) Recommended next steps

1. Validate proposal direction with PM + design review (focus: hypothesis framing and guardrails).
2. Add a lightweight “counter-offer modeller” visual stub to Offer prototype Compensation step.
3. Have XO feasibility pass detail required payload shape for:
   - `payBandEvaluation`,
   - scenario recommendation factors,
   - approval impact estimation.
4. Prepare 060 pre-read package for disclosure and recommendation copy.

