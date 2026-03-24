# UX copy review – Unified candidate review (v57)

**Mission:** GCC-E2E-017 · **Pipeline step:** 7a (**319** after **315** PASS 2)  
**Source:** `design/gcc-unified-candidate-review-v57-discovery-brief.md` → **Copy Inventory**  
**Date:** 24 March 2026  
**Reviewer:** **319-doc-writer** (Editorial Guidelines per `319-doc-writer.mdc`)  
**Legal flags:** **060-legal-advisor** (AI disclosure, notes / process restrictions, data-related errors)

---

## Summary

| Category | Count |
|----------|-------|
| **Strings reviewed** | 50+ (inventory tables + aria) |
| **Editorial changes recommended** | 8 |
| **Critical (clarity / CTA)** | 2 (AI disclosure fragment; CV error grammar) |
| **Quick wins** | 4 (loading consistency, link label, mass-actions clarity, help text tightening) |
| **Consistency** | 2 (terminology / tone alignment with notes gate) |
| **060 validation required** | 5 areas (see **Legal-sensitive copy** below) before **315** PASS 3 freezes strings |

**Overall:** Draft copy is largely sentence case, action-oriented, and aligned with British English. The main gaps are (1) the **AI / assisted matching** line is a sentence fragment and needs a clear actor plus **060** sign-off for EU AI Act / GDPR Art. 22 transparency, (2) one error string needs grammatical fix, (3) loading states for next/previous should match the surface-load pattern, and (4) notes-related strings should stay aligned with whatever **pre-screen notes** policy and **060** approve after the spike gate.

---

## Approved copy (use in **315** PASS 3–4 and **320**)

Replace draft strings in the Discovery Brief **Copy Inventory** with the **Approved** column below. Where **No change**, keep the draft.

### Buttons and CTAs

| Element | Draft | Approved | Rationale |
|---------|-------|----------|-----------|
| Previous candidate | Previous candidate | **No change** | Verb + noun pattern; sentence case. |
| Next candidate | Next candidate | **No change** | Same. |
| Back to list | Back to candidate list | **No change** | Specific destination. |
| Open full profile | Open full profile | **No change** | Clear. |
| Add note | Add note | **No change** | Verb + noun. |
| Post / Save note | Save note | **No change** | Concise; matches success toast. |
| Cancel note | Cancel | **No change** | Standard secondary action. |
| Download CV | Download | **No change** | Short label; context is CV card. |
| Expand spotlight | Show details | **No change** | Action-oriented; matches collapse pair. |
| Collapse spotlight | Hide details | **No change** | Parallel to Show details. |
| Learn more (HS) | About this insight | **No change** | Accurate for transparency link (not generic “Learn more”). |
| Show more timeline | Show more activity | **No change** | Specific about what expands. |
| Mass actions entry | View mass actions (or return to list CTA only) | **Prefer:** **Back to candidate list** as the only CTA when mass actions live on the list; **or**, if a distinct control is required: **View mass actions** | “View mass actions” alone is vague; pick one pattern per build so recruiters are not offered two similar exits. If engineering ships a dedicated control, keep **View mass actions** (sentence case). |

### Headings and labels

| Element | Draft | Approved | Rationale |
|---------|-------|----------|-----------|
| Page title | `{Candidate preferred name}` | **No change** | Dynamic; ensure real names follow privacy / display rules (product, not copy). |
| Subtitle line | `{Job posting title}` · `{Requisition ID}` · `{Location}` | **No change** | Scannable metadata. |
| Position indicator | `{n} of {total} candidates` | **No change** | Use **numerals** in implementation (Editorial exception). |
| Spotlight region title | Prioritisation insight | **No change** | British spelling; sentence case. |
| Summary card | Summary | **No change** | |
| CV card | CV | **No change** | Consistent with UK/GCC “CV”; if tenant locale uses “Résumé”, localise in product (out of scope for this static list). |
| Timeline card | Activity | **No change** | Matches empty / loading strings. |
| Notes card | Notes | **No change** | |
| Note type filter | Note type | **No change** | |
| Stage badge | (dynamic stage name) | **No change** | Must stay system-driven. |

### Form labels and help

| Field | Label (draft) | Help (draft) | Approved label | Approved help | Rationale |
|-------|---------------|--------------|----------------|---------------|-----------|
| Note body | Note | Enter a note for the hiring team. | **Note** | **Add context for the hiring team.** | More task-focused than “Enter a note…”. If Legal requires a **visibility** or **data minimisation** line (who can see the note, what not to include), **060** supplies it and **315** appends or replaces per policy. |
| Note type | Note type | Filter notes by type. | **No change** | **No change** | Brief and clear. |

### Empty states

| Context | Heading (draft) | Body (draft) | CTA (draft) | Approved heading | Approved body | Approved CTA | Rationale |
|---------|-------------------|--------------|-------------|------------------|---------------|--------------|-----------|
| No CV parseable | No preview available | Download the file to view this CV. | Download | **No change** | **No change** | **No change** | Problem + action clear. |
| No timeline events | No activity yet | Events appear as the candidate moves through the pipeline. | — | **No change** | **No change** | — | Good empty state pattern. |
| No notes | No notes yet | Add a note to capture your screening decision. | Add note | **No change** | **Add a note to record your decision for this job requisition.** | **No change** | “Screening” can collide with **pre-screen notes** policy; “record your decision” stays accurate for general notes. **060** to confirm if “screening” is allowed when gate applies. |
| HiredScore off / not licensed | Prioritisation insights unavailable | HiredScore isn’t activated for your organisation, or insights aren’t available for this candidate. | About this insight (optional) or omit | **No change** | **HiredScore isn’t activated for your organisation, or insights aren’t available for this candidate.** | **About this insight** when linking to help; **omit** CTA if no target URL | British spelling **organisation** retained. Optional CTA only with a real destination (avoid dead link). |
| HiredScore below min version | Insights temporarily unavailable | Update your HiredScore integration to see prioritisation insights here. | (Link TBD) | **No change** | **No change** | **[Update integration]** or final label from HiredScore docs *(TBD)* | Button-style link should be verb-led when final URL exists. |

### Loading states

| Action | Draft | Approved | Rationale |
|--------|-------|----------|-----------|
| Surface load | Loading candidate… | **No change** | Present continuous; ellipsis OK. |
| CV panel | Loading document… | **No change** | |
| Timeline | Loading activity… | **No change** | |
| Next / Previous | Loading… | **Loading candidate…** | Matches surface load; “Loading…” is too generic for screen reader / user expectation. |

### Error messages

| Scenario | Draft | Approved | Rationale |
|----------|-------|----------|-----------|
| Failed to load candidate | We couldn’t load this candidate. Refresh the page or return to the candidate list. | **No change** | Problem + two solutions; British “couldn’t” acceptable in UI. |
| Failed to load CV | We couldn’t load this document. Try download or open full profile. | **We couldn’t load this document. Try downloading it or open the candidate’s full profile.** | Fixes grammar (“Try download” → “Try downloading it”); “open full profile” → clearer object for recruiters. |
| Failed to save note | We couldn’t save your note. Check your connection and try again. | **No change** | Standard pattern. |
| Navigation blocked (policy) | You can’t add a note at this stage. Open full profile or adjust the process. *(spike-gated – validate)* | **You can’t add a note at this stage. Open the candidate’s full profile or contact your administrator to adjust the process.** *(pending 060 / spike)* | “Adjust the process” is vague; if the blocker is configuration, point to admin or internal help per **060**. **060** must finalise wording when pre-screen policy is known. |

### Success / confirmation

| Action | Draft | Approved | Rationale |
|--------|-------|----------|-----------|
| Note saved | Note saved | **No change** | Past tense + context; avoid noisy “success”. |

### Legal / AI / transparency (**060** required)

| Element | Draft | Approved (319 proposal – **not final until 060**) | Rationale |
|---------|-------|---------------------------------------------------|-----------|
| Spotlight disclaimer line | Insight is advisory and doesn’t replace your review. | **This insight is advisory. It doesn’t replace your judgement.** | Clear subject; “judgement” British spelling; supports human-oversight messaging (**AI Act** Art. 14, **GDPR** Art. 22 narrative). **060** to confirm exact approved phrasing. |
| AI disclosure (short) | Uses assisted matching signals. Recruiters make final decisions. | **This insight uses assisted matching. You make the final hiring decision.** | Draft is a fragment (“Uses…” has no subject). Revised lines state role of system + human. **060** must align with official Workday / HiredScore transparency text and jurisdiction. |
| Link to help | HiredScore help *(exact label TBD)* | **About HiredScore insights** *(or canonical help article title when URL fixed)* | “About this insight” already used for in-spotlight control; help link label should distinguish **product help** from **this card**. Coordinate with docs. |

### Tooltip / aria

| Control | Draft | Approved | Rationale |
|---------|-------|----------|-----------|
| Previous | Previous candidate | **No change** | |
| Next | Next candidate | **No change** | |
| Spotlight expand | Show insight details | **No change** | Aligns with “Show details” if that is the visible label; if visible label is **Show details**, consider aria **Show prioritisation details** for specificity (optional). |

---

## Legal-sensitive copy – **060-legal-advisor** checklist

**Invoke 060** to validate or replace the following before locking copy in **315** PASS 3–4:

1. **AI / assisted matching (HiredScore spotlight)**  
   - **Strings:** Spotlight disclaimer + short AI disclosure (approved proposals above).  
   - **Why:** Recruitment screening/matching features are **high-risk** under **EU AI Act** Annex III; **GDPR** Art. 22 and transparency expectations apply. Copy must not imply automated hiring decisions without human review.  
   - **060 actions:** Confirm classification, approve or supply **canonical** customer-facing lines, and flag if candidate-facing mirroring is needed elsewhere (this surface is recruiter-facing; still material for deployer transparency).

2. **Notes: help text and empty state**  
   - **Strings:** Note field help; “record your decision” empty state; any future visibility disclaimer.  
   - **Why:** Notes may contain **personal data**; help text must not misstate who can see content; retention and purpose should align with privacy notices.  
   - **060 actions:** Approve help text once **pre-screen notes** spike defines visibility and restrictions.

3. **Navigation blocked (policy) error**  
   - **String:** Pre-screen / stage gate message.  
   - **Why:** Must be accurate (legal/process) and not blame the user.  
   - **060 actions:** Finalise after policy is defined; ensure alignment with internal vs candidate-facing obligations.

4. **Data load / failure messages**  
   - **Strings:** Failed to load candidate / document / save note.  
   - **Why:** Accuracy and no over-disclosure of system internals; still clear enough for support.  
   - **060 actions:** Quick sanity-check (usually low risk); confirm “full profile” wording matches product terminology.

5. **HiredScore empty / version states**  
   - **Strings:** Licensing and integration messages.  
   - **Why:** Avoid commitments or claims that create contractual or regulatory misrepresentation.  
   - **060 actions:** Confirm “organisation”, “integration”, and “insights” phrasing with product legal if needed.

---

## Editorial checklist (PASS 2 inventory)

| Check | Result |
|-------|--------|
| Sentence case for UI strings | **Pass** (spot titles like “Prioritisation insight” are sentence case) |
| Concise | **Pass** with minor tightening on help / empty note body |
| Action-oriented buttons | **Pass** |
| Active voice | **Pass** (fix AI disclosure fragment) |
| Specific outcomes | **Pass** (mass actions row: choose one CTA pattern) |
| Consistent terminology (candidate, requisition) | **Pass** |
| Plain language | **Pass** |
| Numerals in UI for counts | **Pass** (template uses `{n}` / `{total}`) |
| British English | **Pass** (prioritisation, organisation, judgement) |

---

## Copy gaps for **315** / PM

- **Mass actions:** Decide single primary escape hatch vs explicit **View mass actions**; document in brief so **320** does not ship both without intent.  
- **HiredScore help URL:** Final link label + destination (avoid **About this insight** with no href).  
- **Pre-screen notes:** Replace bracketed error string with **060**-approved final text after spike.  
- **Note help text:** Default **Add context for the hiring team.**; **060** may add a visibility or minimisation line after the pre-screen spike.

---

## Handoff

- **315:** Merge **Approved** column into `design/gcc-unified-candidate-review-v57-discovery-brief.md` Copy Inventory before PASS 3–4 and **Final Verdict**.  
- **060:** Review **Legal-sensitive** section and return required edits to **315** / **319**.  
- **320:** Implement approved strings exactly; use **Loading candidate…** for next/previous loading state.

---

**Artifacts:** `design/gcc-unified-candidate-review-v57-discovery-brief.md` (source) · this file (319 output for GCC-E2E-017 Step 7a)
