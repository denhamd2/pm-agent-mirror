# Copy review (319): Candidate grid redesign v52 — Copy inventory

**Input:** `design/gcc-candidate-grid-redesign-v52-discovery-brief.md` §2.5  
**Date:** 22 March 2026  
**Pipeline:** GCC-E2E-011 (after **315** PASS 1–2)

---

## Editorial decisions (sentence case, action-led)

| Context | Draft | Approved | Rationale |
|---------|-------|----------|-----------|
| Carousel | Previous candidate | **Previous** | Shorter control label; pair with `aria-label="Previous candidate"`. |
| Carousel | Next candidate | **Next** | Same pattern; `aria-label="Next candidate"`. |
| Primary stage | Move to Screen | **Move to screen** | Sentence case; "screen" is a stage name in context of this prototype. |
| Destructive | Reject | **Reject** | Clear, one word. |
| Modal chrome | Close | **Close** | Standard. |
| CV fallback | Open CV | **Open CV** | Acronym retained; scannable. |
| Deep link | Open full profile | **Open full profile** | OK. |
| Filters | Clear filters | **Clear filters** | OK. |
| Filters | Save filter | **Save filter** | OK. |
| Filters | Apply filters | **Apply filters** | OK. |
| Search field label | Search candidates (boolean) | **Search candidates** | Remove implementation hint from visible label. |
| Search help (optional `FormField.Hint`) | — | **Use AND, OR and NOT between terms.** | British English; keeps boolean power without cluttering the label. |
| Dropdown | Saved filters (select) | **Saved filters** | UI label only. |
| Column / chrome | Match score | **Match score** | OK. |
| Empty state | No candidates match your filters | **No candidates match your filters.** | Terminal period for full sentence (optional; match CK patterns in prototype). |
| Loading | Loading candidate profile | **Loading candidate profile…** | Present continuous + ellipsis per loading pattern. |
| Loading | Loading CV | **Loading CV…** | Same. |
| Error | Unable to load CV | **We couldn’t load this CV. Open it in a new tab or try again.** | Problem + solution; avoid blame. |
| Error | Candidate not found | **We couldn’t find this candidate. Return to the grid or refresh the page.** | Actionable. |
| Error | Unable to load candidates | **We couldn’t load candidates. Check your connection and try again.** | Matches Editorial error pattern. |

**Table headers (chrome):** **Candidates**, **Candidate**, **CV** — keep; table headers often title-style in product — if CK uses sentence case for headers, use **Candidates**, **Candidate**, **CV** (already sentence case).

**Filter labels:** **Stage**, **Applied date**, **Source**, **Match score**, **Location**, **Name** — approved as-is.

---

## Legal-sensitive strings (060)

| Draft | Approved (pending **060** confirmation) | Notes |
|-------|----------------------------------------|--------|
| Some candidate details are hidden based on your organisation’s screening rules. | **Some candidate details are hidden based on your organisation’s screening rules.** | Transparency for anonymised screening; **060** to confirm wording for GDPR/anonymised hiring. |
| AI-assisted insights are suggestions only. A person makes the hiring decision. | **These insights are suggestions only. A person makes the hiring decision.** | If AI sourcing is shown: avoids repeating "AI" in a way that conflicts with local disclosure requirements; **060** must approve final string. |
| Candidate "viewed" or review status may be tracked through your recruitment process configuration (for example a **Reviewed** step), not a grid badge in this release. | **You can track whether a candidate was reviewed using your recruitment process, for example a Reviewed step. This view doesn’t show a reviewed badge on the grid.** | Enablement-oriented; **060** only if this text ships in-product; otherwise keep in sales/enablement docs only. |

**319 recommendation:** Do **not** surface the third row in the prototype unless PM confirms it belongs in UI; prefer Confluence or sales FAQ.

---

## Output for **315** PASS 3–4

Replace §2.5 draft strings with the **Approved** column above when finalising the brief. **320** must implement **approved** strings exactly after **Final Verdict: APPROVED**.

**Legal:** Run **060** on the two anonymisation / AI lines before GA; if AI stub is removed from prototype, drop the AI line entirely.

---

**Status:** Ready for **315** PASS 3–4 incorporation.
