# Decision log — two-way email initiative

Append newest decisions at the top. The [PRD](../../prds/india-candidate-profile-email-conversation-prd.md) remains the **default in-repo** requirements narrative; **`decisions.md`** captures **dated PM calls** (meetings, grilling, scope) including **milestone-specific acceptance** where the PM names an external governing artefact (e.g. EA P0s linked from Jira). Fold outcomes into the PRD only when the PM requests a PRD update.

## Template

```markdown
### YYYY-MM-DD — [short title]

- **Decision:**
- **Rationale:**
- **PRD impact:** None | Pending PRD edit | Reflected in PRD §…
```

---

### 2026-05-21 — EA acceptance authority & scope (grill, HRREC-82977)

- **Decision:**
  - **Acceptance for EA** when the India PRD and other artefacts disagree: the **Google Doc P0 list** linked from Jira epic **[HRREC-82977](https://jira2.workday.com/browse/HRREC-82977)** governs **what ships for EA**; the **India PRD** remains the default narrative for **in-repo** initiative work until the PRD is formally revised.
  - **Definition of Done (EA):** **Same bar** for **recruiter ↔ non-agency candidate** and **recruiter ↔ agency** paths: **real bidirectional email with threading** for both.
  - **Rollout:** **Named pilot customers** only (not “toggle on for all eligible tenants” without a named list).
  - **Pilot operations:** Day-to-day = **standard Recruiting support** plus a **short pilot playbook** (known limitations). Success to widen beyond pilots = **mixed scorecard** (documented artefact). **DRI** for playbook + scorecard: **PM + Doc Writer**, with **weekly refresh** during the pilot.
  - **Opt-out / consent (pilots):** Rely on **existing Recruiting / comms product rules**; **no pilot-specific legal addendum** planned — **Legal / CS** still to confirm those rules **explicitly cover** this **two-way, threaded, profile-anchored** channel.
  - **Mobile (EA):** **Mobile web only**; **native Workday Mobile app** for this experience is **out of scope for EA** (state in pilot playbook).
  - **Entry points (EA):** **Profile dock / single-candidate entry only** — **no** starting or continuing 2-way from **mass** surfaces (JR candidate grid mass actions, **Find Candidates** mass Send Message, **Candidate Job Applications** mass actions).
  - **Thread delivery UI vs compose MVP:** Align **`HRREC-92010`** to **[012](../../../.cursor/rules/012-two-way-email-prototype-compose-mvp.mdc)** for EA: thread list shows **Sent** + failure / **not delivered** semantics; **no** separate **Delivered** chip unless **012** is formally expanded.
  - **Internal recipients (EA):** **No CC / BCC** on outbound; **Forward** in-product is **out of scope for EA** (same bucket) unless PM revises this log.
  - **Open (not decided in same grill):** **Confidential candidates × 2-way** and **Start Proxy / send-on-behalf** — require **Legal + Security + Recruiting** (and ops) workshop before pilot roster is final.
  - **Full P0 vs 012:** Still run a **written matrix** (each Google P0 bullet vs **012** exclusions) — early grill was “not sure” on full collision surface beyond **92010**.
- **Rationale:** Concentrate EA risk (pilots, parity, support promises) in **explicit records** so initiative PRD work, **Jira** stories, and **012** prototype boundaries do not silently fork.
- **PRD impact:** None — milestone and operations record; reconcile into PRD when PM chooses.

---
