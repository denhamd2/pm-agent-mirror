# Copy spot-check – Unified candidate review (v57)

**Mission:** GCC-E2E-017 · **Pipeline step:** 9 (**319** final spot-check after **320**)  
**Prototype:** `design/gcc-unified-candidate-review-v57.tsx`  
**Source of truth (319-approved):** `design/gcc-unified-candidate-review-v57-discovery-brief.md` → **Copy Inventory (319-approved for 320)** (merged from `design/gcc-unified-candidate-review-v57-copy-review.md`)  
**Date:** 24 March 2026  

**Scope:** Validate that strings from the **Copy Inventory** table are implemented **verbatim** where used. Flag deviations, unused approved strings, and user-visible copy added in implementation that was **not** in the approved inventory.

---

## Verdict summary

| Area | Result |
|------|--------|
| **`COPY` object vs Copy Inventory** | **Mostly aligned** – one **functional deviation** on note submit labelling; one **unused** approved string (`Save note`). |
| **Approved strings not surfaced in UI** | **Loading** and **error** rows from the inventory are **not implemented** in this static prototype (expected gap unless **320** scopes those states). |
| **Implementation-only UI copy** | Several strings (spotlight mock body, summary sublabels, activity collapse, status chip, list hint, demo chrome, comm panel) are **outside** the Copy Inventory – document for transparency, not necessarily defects. |

**Overall:** Approved **HiredScore**, **notes**, **empty states**, **navigation**, **spotlight chrome**, and **aria** for prev/next/expand match the brief. Fix or explicitly accept the **Add note** vs **Save note** split before **330** / stakeholder sign-off.

---

## Approved strings – implementation check

Strings below are drawn from the Discovery Brief Copy Inventory. Comparison is against `gcc-unified-candidate-review-v57.tsx` (including the `COPY` constant and inline literals that duplicate approved text).

| Approved element | Expected string | In prototype? | Notes |
|------------------|-----------------|---------------|-------|
| Previous candidate | Previous candidate | Yes | Visible label + `aria-label` |
| Next candidate | Next candidate | Yes | Visible label + `aria-label` |
| Back to candidate list | Back to candidate list | Yes | |
| Open full profile | Open full profile | Yes | |
| Add note | Add note | Yes | See **Deviation 1** – also used where **Save note** was specified |
| **Save note** | Save note | **No (unused)** | Declared in `COPY.saveNote` but **never rendered**; submit uses **Add note** |
| Cancel | Cancel | Yes | Note composer secondary action |
| Download (CV) | Download | Yes | |
| Show details / Hide details | Show details / Hide details | Yes | Toggles with `aria-label` **Show insight details** (approved optional specificity) |
| About this insight | About this insight | Yes | |
| Show more activity | Show more activity | Yes | See **Deviation 2** for collapsed state |
| Update integration | Update integration | Yes | Below-min HiredScore state |
| Prioritisation insight | Prioritisation insight | Yes | British spelling |
| Summary / CV / Activity / Notes | As listed | Yes | Card headings |
| Note type / Note | As listed | Yes | Filter + body label |
| Help: note body | Add context for the hiring team. | Yes | `FormField.Hint` |
| Help: note type | Filter notes by type. | Yes | |
| Position indicator | `{n} of {total} candidates` (numerals) | Yes | `positionOf()` |
| HS unavailable heading/body | As inventory | Yes | |
| HS below min heading/body | As inventory | Yes | |
| No CV preview | No preview available / body / Download | Yes | |
| No activity | No activity yet / body | Yes | (Timeline uses mock rows so empty path not exercised) |
| No notes | No notes yet / body / Add note CTA | Yes | CTA uses **Add note** (correct for empty state) |
| Note blocked (policy) | You can’t add a note at this stage… | Yes | Demo toggle |
| Note saved | Note saved | Yes | Inline feedback after add |
| Spotlight disclaimer | This insight is advisory. It doesn’t replace your judgement. | Yes | British **judgement** |
| Short AI disclosure | This insight uses assisted matching. You make the final hiring decision. | Yes | |
| About HiredScore insights | About HiredScore insights | Yes | Second tertiary in spotlight |
| Spotlight expand aria | Show insight details | Yes | On Show/Hide details control |

---

## Deviations and implementation issues

### 1. Note submit button: **Add note** vs approved **Save note** (material)

**Copy Inventory** lists **Add note** and **Save note** as separate approved CTAs. **`gcc-unified-candidate-review-v57-copy-review.md`** maps the post/save action to **Save note** (“Concise; matches success toast”).

**Prototype:** `PrimaryButton` that commits the note uses **`COPY.addNote`** (`Add note`), not **`Save note`**.

**`COPY.saveNote`** is defined but **unused** (dead string).

**Recommendation:** Use **Save note** on the primary control that persists the note; keep **Add note** for empty-state / focus CTAs only, **or** document a deliberate single-CTA pattern and remove **Save note** from the inventory in a brief revision.

---

### 2. Activity timeline collapse label: **Show less activity** (not inventory)

**Approved:** **Show more activity** only.

**Prototype:** When expanded, toggle shows **`Show less activity`** (literal string, not in `COPY`).

**Severity:** Low – standard pairing; not reviewed by **319**. If editorial wants consistency, add an approved “Show less” line to the brief or reuse a pattern from another surface.

---

### 3. Loading states – approved but not implemented

**Copy Inventory** specifies:

- Surface load: **Loading candidate…**
- CV panel: **Loading document…**
- Timeline: **Loading activity…**
- Next / Previous: **Loading candidate…**

**Prototype:** No loading UI – static mock only.

**Severity:** **Implementation gap** (not a wrong string). Acceptable for **320** demo if out of scope; if **330** or PRD expects those states, add them with exact approved copy.

---

### 4. Error messages – approved but not implemented

**Copy Inventory** specifies candidate load, CV load, save-note failure, and policy/navigation blocked (blocked is implemented via demo).

**Prototype:** No error banners/toasts for load or save failures.

**Severity:** Same as loading – **gap**, not a mismatch.

---

### 5. Status indicator: **Ready for review** (not in Copy Inventory)

**Prototype:** `StatusIndicator` uses **`COPY.pipelineReady`** → **Ready for review**.

This label does **not** appear in the **319**-merged Copy Inventory table.

**Severity:** Low – likely illustrative status; align with product terminology in a future **315**/**319** pass or remove if redundant with stage pill.

---

## User-visible copy outside Copy Inventory (awareness)

The following appear in the prototype but are **not** rows in the **319**-approved Copy Inventory. They are acceptable as **mock / shell / demo** content if stakeholders agree; they are **not** spot-checked against **319**.

| Location | Example strings |
|----------|-----------------|
| Prototype banner | “Unified candidate review (v57, GCC-E2E-017). Illustrative data…” |
| HiredScore spotlight (active) | “Recommended priority: High…”; expanded **Match dimensions** / **Last model refresh** / illustrative date |
| Summary card | **Fit snippet**, **Status**, **Active on this requisition**, **Source**, **Applied** |
| CV mock well | “[Mock CV] … would render in the embedded viewer…” |
| Candidate list hint | “Open a candidate name to load the unified review surface…” |
| Demo toggles | “Demo — HiredScore region”, **Active** / **Unavailable** / **Below min version**, **Notes: blocked (demo)**, **Preview: RTL** / **Preview: LTR** |
| Hub / sibling tabs | **Requisition overview**, **Hiring team**, **Key dates**, table headers, dashboard KPI labels, etc. |
| **CommunicationDock** | **Email**, “Thread preview (prototype)”, message bodies, placeholder **Write a reply…**, **Send**, rail `aria-label`s |
| Table / checkbox | **Select all candidates**, **Select {name}** |

---

## British English and typography

- **Prioritisation**, **organisation**, **judgement** match approved spellings where used from `COPY`.
- Spotlight and policy strings use straight apostrophes in source (`doesn't`, `can't`, `isn't`) – normal for code; display matches approved wording.

---

## Sign-off for Step 9

| Check | Status |
|-------|--------|
| **319**-inventory strings used in unified surface | **Pass with actions:** resolve **Save note** vs **Add note**; optionally track **Show less activity** / **Ready for review** in brief |
| No silent edits to legal / AI / transparency lines | **Pass** |
| Empty / HS fallback / note gate | **Pass** |

**Next step for **320** (if tightening): wire **Save note** to the persist action; remove or use **`COPY.saveNote`**; add loading/error states when/if interactive demo is required.

---

**Artifacts:** `design/gcc-unified-candidate-review-v57-discovery-brief.md` · `design/gcc-unified-candidate-review-v57-copy-review.md` · this file (**GCC-E2E-017 Step 9**)
