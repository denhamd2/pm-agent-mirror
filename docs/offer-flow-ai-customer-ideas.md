# Customer Ideation Hub / Customer Brainstorms — AI ideas for the Offer flow

**Source**: `research/brainstorm-sessions/dump.txt` (1,967 lines; scraped export of `P&T Idea Results Dashboard_03_30_2026 10_11 AM.xlsx`, sheet *Filter Page by Product Line (Category Model Driven)*).
**Method**: Keyword grep over the dump (`offer`, `approver`, `approval`, `pay.?equity`, `pay.?band`, `compensation`, `comp.?visibility`, `rescind`, `counter.?offer`, `employment.?agreement`, `AI`, `agent`, `automation`, `auto.draft`, `auto.generate`, `copilot`, `assistant`, `gen.ai`, `HiredScore`), noise-filtered to remove Financial Aid award-letter hits and generic security/admin ideas.
**Date of scan**: 2026-05-01.
**Scope**: ideas explicitly about the Offer flow or adjacent to it (approvals, pay-band, pay-equity, comp visibility at offer time, rescind, counter-offer).

---

## TL;DR — honest finding

**There are no recent customer ideas in this dump that explicitly ask for AI inside the Offer flow.** Customers are ideating on AI in Recruiting, but the entire Gen AI signal is concentrated on **Job Requisitions** (24 ideas under "Gen AI on Job Requisitions"). The Offer category itself has **strong negative sentiment (−0.248, lowest effort-score at −1.53)** but the ideas filed there are about **compensation visibility, security scoping, and localization controls** — control and safety asks, not speed/AI asks.

Two implications for our Offer prototype direction:

1. **Our AI bets in Offer are product-led, not customer-requested.** Overlap-aware confirmation, live approval map, document QA deck, approver packet AI summary — none of these show up in the customer ideation signal. That's fine (customers usually can't articulate agentic solutions), but we should be clear internally that we're placing a bet rather than responding to demand.
2. **The pain in Offer is real, and it's a safeguarding/trust pain, not a speed pain.** Every substantive idea in this dump is about *who can see comp data, when, and why*. If we layer AI on top of Offer without addressing the underlying comp-visibility and trust story, we'll be building features customers won't use because they haven't solved the problem they're actually ideating about.

Strong signal for Offer AI: **pay-equity / pay-band / comp-visibility guardrails shown in-context, with citations, at the moment of comp decision**. Our current prototype's "pay-band check" in the QA deck is directionally right but could go further — see §Recommendations below.

---

## 1. What's in the dump about Offer

### 1.1 Category-level signal (the volume + sentiment index)

The dump includes a product-line index showing idea counts, sentiment (−5 to +5), and effort score (−5 to +5) per category. The Recruiting slice:

| Product line | Idea count | Sentiment | Effort score |
|---|---:|---:|---:|
| Job Requisitions | 1,407 | −0.224 | −1.03 |
| Candidates and Prospects | 1,220 | −0.204 | −1.54 |
| **Offers and Employment Agreements** | **926** | **−0.248** | **−1.53** |
| Job Application Process | 876 | −0.274 | −0.90 |
| Gen AI on Job Requisitions | 24 | −0.128 | **+0.67** |

Lines: 997, 1321, 1689, 1844, 1930 (repeated category rollups in multiple pivot tabs).

**Read**: Offer has the joint-lowest effort score (customers find it hardest to get value out of) and second-worst sentiment. Customer pain in Offer is about a similar order of magnitude as Job Reqs and Candidates. But the *Gen AI on Job Reqs* row is telling — it's the only row where effort is **positive** (+0.67), meaning when customers imagine AI in Recruiting they imagine it helping them, and they're imagining it on job requisitions specifically.

### 1.2 Substantive Offer-adjacent idea cluster (the only one)

**Theme: Requisition-scoped compensation visibility for internal candidates** — lines 1486–1492, idea IDs 743218–743224, all marked `True` (customer endorsed the framing).

Verbatim summary (cleaned of formatting noise):

> *"Enable requisition-scoped visibility of internal candidate compensation in Workday Recruiting so req-support roles can view only the compensation details needed to make/validate pay decisions for internal candidates actively in process on a specific requisition — without granting broad Worker compensation access or just at the offer stage. Needs to be **before** offer task."*
> — idea 743218

> *"Deliver segmented/conditional security for compensation based on recruiting context e.g. allow configuration such that 'View Worker Current Compensation' (and/or offer comp components) is granted **only** when the viewer has a defined relationship to an active candidacy on a specific requisition (or stage) and **automatically revoked** when the candidacy is no longer active or the requisition closes."*
> — idea 743219

> *"Reduced overexposure of sensitive compensation data (fewer users with unconstrained comp visibility, improved least-privilege posture). Faster internal recruiting decisions (reduced handoffs/delays to validate current pay and offer alignment). Improved audit/compliance outcomes — clearer rationale for 'who can see what and when' tied to an active recruiting event."*
> — idea 743220 (business-value statement)

> *"Maintain Localization Settings (opt-in by worker's current country of work) to display current compensation when proposing compensation during the Offer process was suggested by Workday — we already have this enabled in PROD but it does not meet our need because we need comp visibility **earlier** than the Offer BP. Workaround suggested: internal candidates self-report compensation via an application questionnaire — not implemented due to accuracy/controls concerns (honor-system risk)."*
> — idea 743224

**What customers are actually asking for here**:
- Temporal scope: comp data is visible only while a candidacy is active on a requisition, and auto-revokes when the candidacy ends or the req closes.
- Role scope: only req-support roles (Recruiter, RC, req-aligned HRBP) get the visibility, not all HR Partners.
- Surface scope: visible in the **recruiting context** (candidate profile, shortlist, interview stage) — *not only* at the offer step. Multiple customers explicitly said "the current Offer BP is too late."
- Audit: every comp-data view should be logged against the specific candidacy + req + stage.

**Signal strength**: **Strong**. Seven consecutive idea IDs (743218–743224) from the same customer voice, all endorsed, with a business-value statement, a specific proposed solution, and named alternatives already rejected as inadequate.

### 1.3 Adjacent signal (not Offer-specific, but relevant)

- **"Gen AI on Job Requisitions"** (24 ideas, +0.67 effort score): Customers see the most value in AI upstream of Offer (JR creation, posting, sourcing). This is exactly where our new CJR prototype lives. **Implication**: customers are more ready to accept AI in JR than in Offer. Don't lead with AI in the Offer pitch; lead with comp-visibility and approval-trust.
- **HiredScore AI for Recruiting** (46 ideas, line 198) and **HiredScore AI for Talent Mobility** (4 ideas, line 216): existing AI product lines with idea volume — tells us where the *branded* AI ideation is flowing (it's not flowing to Offer).

### 1.4 What's **not** in the dump (after thorough grep)

Explicitly searched and not found:
- AI-drafted offer letters (`auto.draft.*offer`, `generate.offer`, `AI.*offer`, `offer.*AI`, `copilot.*offer`).
- Candidate-facing negotiation / counter-offer assistant.
- AI pay-equity check / pay-band guardrail.
- AI approval routing intelligence (smart delegate, OOO prediction, SLA escalation).
- Rescind-offer assistant or rescind-risk prediction.
- Counter-offer modelling / market-rate AI.
- eSign / DocuSign / Adobe Sign AI integration ideas.

This is a non-trivial absence. Customers are ideating in adjacent spaces (compensation security, segmentation, role modelling) rather than asking for AI to replace the human effort in Offer. The most charitable read is "customers can't articulate agentic solutions yet"; the less charitable read is "AI is not the pain — trust, security, and scope are."

---

## 2. Mapping to our current prototype

Current AI enhancements in `design/create-offer-ssa-v01.tsx` (Ideas 1–4 from the earlier design round):

| # | Prototype capability | Customer signal in this dump | Fit |
|---|---|---|---|
| 1a | Overlap-aware position confirmation | None direct. Adjacent: position-control + backfill pain is in JR ideas. | Weak customer signal; product bet. |
| 1b | Live approval map (OOO / held-since / delegate) | None direct. Approval pain shows up in non-Recruiting product lines (BP security, delegation) but not Recruiting-Offer ideation. | Weak customer signal; product bet. |
| 2  | Document QA deck (band, currency, template, classification, prose-vs-worksheet diff) | **Direct fit with comp-visibility + pay-band compliance theme.** Customer wants comp checks *earlier* than the Offer BP — our QA is late in our flow. | Moderate. |
| 3  | DE Collective-Agreement acknowledgement | None direct. This is a compliance cover (works-council) rather than a customer ideation theme. | Product/legal bet. |
| 4  | Approver Packet Preview (AI summary + citations + redaction) | **Direct fit with comp-visibility redaction theme (743219).** The redaction-for-comp-restricted-approvers behaviour answers exactly what customers are asking for. | **Strong fit.** Customer signal strongest here. |

**The one piece of our prototype with the strongest customer-signal fit is Idea 4 (Approver Packet Preview with comp-redaction)** — it's the clearest response to idea 743219's "comp components granted only when the viewer has a defined relationship to an active candidacy."

---

## 3. Recommendations for the next Offer prototype iteration

Ranked by signal strength in this dump.

### P0 — Lift comp-visibility to a first-class Offer pattern (strong customer signal)

- **Scope-stamp every comp surface in the Offer flow.** Every card that shows base / bonus / equity / sign-on should carry a visible "scope: requisition-active" badge with a tooltip explaining when it revokes. This maps directly to idea 743218–743220. Copy suggestion: *"Visible because Aoife is the HM on REQ-2026-001 and the candidacy is active. Access revokes when the candidacy ends."*
- **Promote the QA deck's "base vs pay-band" check into a proactive inline badge on the Compensation step**, not just in QA. Customer idea 743224 explicitly calls out comp alignment at proposal time, not review time.
- **Surface pay-equity peers in-context** when the recruiter first enters a base number. Show a tiny "3 peers at this level in Dublin earn €88k–€104k" cue (source: worksheet + org level), with a click-out to a pay-equity report. Customer signal is adjacent not direct, but this closes the safeguarding gap.

### P1 — Make the approver packet redaction first-class (moderate customer signal)

- **Offer `includeAiApproverSummary` is currently a tenant-level switch.** Customer idea 743219 wants it *per-approver-per-relationship*. Propose a follow-up: the AI summary redacts comp for an approver if that approver's scope does not include a comp-data relationship to this candidacy. The recruiter sees what each approver will see (a preview-per-approver tab).
- **Log every AI summary view against the candidacy/req.** Idea 743220's business value explicitly calls this out. Our prototype doesn't model audit — worth mocking even as text ("Logged to candidate audit trail: Diane viewed AI summary at 14:32").

### P2 — AI in Offer is not a customer-asked feature; pitch it accordingly (positioning note)

- When briefing Workday Recruiting customers on Offer AI work, **lead with the comp-visibility + trust story**, not with the AI productivity story. Our customers are not (yet) ideating AI-in-Offer. They are ideating safety-in-Offer.
- **Consider re-framing the Offer prototype's hero pitch**. Currently we say "Create Offer Self-Service Agent" — a speed/productivity frame. Given the signal here, a stronger frame is "Create Offer with built-in pay-equity and comp-visibility guardrails" — leads with customer pain, lets AI be invisible infrastructure.
- **The Gen AI signal is on Job Reqs (+0.67 effort score)**. Our CJR prototype is the right place to lead with agentic capability. Offer is the right place to lead with trust.

### P3 — Areas with no customer signal (park or explore separately)

- **Candidate-facing negotiation copilot** — no signal. Explore via PMF interviews, not this dump.
- **Counter-offer modelling / market-rate AI** — no signal in this dump.
- **Rescind-risk prediction** — no signal.
- **eSign AI** — no signal.

Parking these as "no evidence in the brainstorm hub today; revisit when the next round of customer ideation lands."

---

## 4. Caveats and what this dump is not

1. **One source, one snapshot.** This file is a scrape of the P&T Idea Results Dashboard as of 30 Mar 2026. It is not a continuous view; a refreshed dump may show AI-in-Offer ideation if customers file between now and the next build of the data model.
2. **Keyword bias.** Grepping for "offer" returns both employment offers and Financial-Aid award letters; the cleanup filter catches the obvious ones but isn't perfect. A few edge ideas may have been discarded.
3. **Formatting damage.** The dump has extreme right-column padding (lines up to ~4,000 chars of whitespace), which means grep line counts are honest but reading full context requires cleanup. Every line cited above has been visually verified post-cleanup.
4. **Endorsement signal (`True` / `False`) is binary.** A `False` idea hasn't been rejected — it just hasn't been endorsed by another customer yet. Treat absence of endorsement as "early signal" rather than "rejected signal."

---

## 5. What to feed back into the agent stack

- Update [`design/create-offer-ssa-design-brief.md`](design/create-offer-ssa-design-brief.md) next-pass: add a Customer Signal section citing ideas 743218–743224, and re-frame the JTBD pitch to lead with safeguarding.
- Flag for [`@ux-designer-agent`](.cursor/agents/ux-designer-agent.md) task 5 (AI UX grade): the "comp-visibility scope stamp" is a candidate improvement the AI UX grade should call out explicitly.
- Flag for [`@xo-developer-agent`](.cursor/agents/xo-developer-agent.md) task 3 (API feasibility): check whether Workday already exposes a `/compensation/visibility-scope` or similar audit API we could call to produce the scope-stamp badge — customer idea 743220 implies tenants expect this to be auditable.

---

## Appendix — Source lines referenced

| Dump line | Content summary | Idea ID | Endorsed |
|---|---|---|---|
| 997, 1321, 1689, 1844, 1930 | "Offers and Employment Agreements" category rollup (926 ideas, −0.248 sentiment, −1.53 effort) | — | — |
| 1010, 1334, 1702, 1857 | "Gen AI on Job Requisitions" category rollup (24 ideas, −0.128 sentiment, +0.67 effort) | — | — |
| 1486 | Req-scoped comp visibility, "needs to be before offer task" | 743218 | True |
| 1487 | Segmented/conditional security for comp; auto-revoke on candidacy close | 743219 | True |
| 1488 | Business-value statement for req-scoped comp (least-privilege + audit) | 743220 | True |
| 1489 | Use case: internal candidate, req HR Partner does not own the worker | 743221 | True |
| 1490 | Impacted roles: Recruiter, RC, req-aligned HRBP, comp/compliance | 743222 | True |
| 1491 | Headline: Enable Requisition-Scoped Compensation Visibility for Internal Candidates | 743223 | True |
| 1492 | Rejected alternatives: localization settings too late; questionnaire honor-system risk; unconstrained SG too broad | 743224 | True |
