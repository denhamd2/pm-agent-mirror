---
snapshot_as_of: "2026-05-16"
manifest_complete: true
manifest_key_count: 66
captured_excerpt_keys: 22
companion_epics:
  - HRREC-89236
  - HRREC-84384
  - HRREC-89812
  - HRREC-82870
  - HRREC-91933
# Inventory: Jira `searchJiraTickets` Story+Bug per epic (`Epic Link` = epic key), merged + deduped, same day as snapshot_as_of.
---

# WhatsApp companion — frozen pattern corpus (013)

**Purpose:** Reduce repeat **Jira MCP** volume for the **user-story-gap-review** WhatsApp companion when those epics are **nearly done**. This file is **pattern archaeology**—not a live backlog.

**How agents use it:** See [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) → **Manifest-only (default when snapshot is eligible)**; opt-in **Live delta with snapshot** when the PM asks for **`WhatsApp live delta`** / **`WhatsApp refresh corpus`**.

## Populate this file (one-time or periodic refresh)

1. Run a **full** Story+Bug inventory + `getTicketDetails` (or Jira UI bulk export) for the five companion epics listed in [COMPANION_WHATSAPP_EPICS.md](../COMPANION_WHATSAPP_EPICS.md).
2. Paste below under **Manifest** every **Story** and **Bug** key (one per line, sorted). Set `manifest_complete: true` in frontmatter when the manifest matches what you exported.
3. Under **Captured excerpts**, add optional `### HRREC-nnnnn` sections with short summary/AC snippets you care about for cross-initiative patterns (keep concise; paraphrase; no secrets). Update **`captured_excerpt_keys`** in frontmatter to match the count of `### HRREC-…` headings. Optionally extend the **Theme index** table so high-level 2WE translation prompts stay aligned with new excerpts.

When Jira changes materially, **bump `snapshot_as_of`**, refresh the manifest, and trim/add excerpts—or leave `manifest_complete: false` to force the skill’s **full live** path until you fix the manifest. Day-to-day gap reviews read this file **only** (no WhatsApp Jira) unless the run opts into **live delta**.

## Manifest (Story + Bug keys — one per line)

HRREC-84385
HRREC-84388
HRREC-84389
HRREC-84390
HRREC-84392
HRREC-84403
HRREC-84406
HRREC-84407
HRREC-84410
HRREC-84533
HRREC-84534
HRREC-84537
HRREC-84552
HRREC-84553
HRREC-84555
HRREC-84556
HRREC-84557
HRREC-84559
HRREC-84561
HRREC-84562
HRREC-84564
HRREC-84565
HRREC-84566
HRREC-84569
HRREC-84570
HRREC-84588
HRREC-85101
HRREC-85907
HRREC-86787
HRREC-88453
HRREC-89187
HRREC-89407
HRREC-89509
HRREC-89778
HRREC-89785
HRREC-89856
HRREC-89857
HRREC-89899
HRREC-89918
HRREC-89933
HRREC-89979
HRREC-90051
HRREC-90243
HRREC-90244
HRREC-90268
HRREC-90306
HRREC-90311
HRREC-90381
HRREC-90486
HRREC-90572
HRREC-90856
HRREC-90857
HRREC-90858
HRREC-90867
HRREC-90868
HRREC-91550
HRREC-91635
HRREC-91656
HRREC-91769
HRREC-91872
HRREC-91875
HRREC-91876
HRREC-91951
HRREC-91952
HRREC-91959
HRREC-92062

**Epics with no Story/Bug children in Jira at snapshot time:** [HRREC-82870](https://jira2.workday.com/browse/HRREC-82870) (parent epic / umbrella), [HRREC-91933](https://jira2.workday.com/browse/HRREC-91933) (Phase 3 placeholder). A **live delta** run may still call `summarizeJiraEpic` on them; expect **0** keys until work is linked.

## Theme index (2WE email — translation prompts)

Use this table for **Cross-initiative pattern hints** when you want coverage by theme; each row is **inspiration only** (same UX shell, different channel/OE). Jump to **`### HRREC-…`** under **Captured excerpts** for paraphrases grounded in this snapshot.

| Theme | WhatsApp signals (keys) | Consider for 2WE if… |
|--------|---------------------------|------------------------|
| Consent / tenant setup | HRREC-89899, HRREC-84390 | Apply flow or tenant notifications lack default consent text—should email opt-in hide or show a dead T&C link? |
| Merge / identity | HRREC-84389, HRREC-90306 | Candidate merge or duplicate identity leaves **wrong sender**, stale threads, or unreadable legacy threads on the **email** path. |
| Template preview / hydration | HRREC-84403, HRREC-89778, HRREC-89856 | Message Builder preview vs send: **CRF scope**, security, empty CRFs, or **hydrate** failures need the same recruiter-visible handling for **email** templates. |
| Send / composer guard | HRREC-90268, HRREC-92062 | Double-send, typing while send in flight, or disabled-send states should match **email** composer expectations. |
| Errors / limits | HRREC-84406, HRREC-89979 | Failed send vs “silent” open: do recruiters see **why** on open, or only on send? **Conversation number** limits may differ for email but the **early surfacing** question transfers. |
| Thread / lifecycle UI | HRREC-84533, HRREC-84534, HRREC-90243 | Expiry countdown, “conversation closing” copy when dispositioning—**when** should email show lifecycle messaging relative to first send? |
| Entry chrome | HRREC-84555 | Channel icon / opt-in visibility on profile—what is the **email** equivalent when the channel is off or candidate not opted in? |
| Reporting / audit | HRREC-84556 | CRF/report fields for comms volume—**email** needs parallel fields and rename strategy where SMS+email share reports. |
| Read / delivery affordance | HRREC-84407 | Read vs unread (OE timing risk for WA)—what does **email** promise vs what delivery receipts support? |
| Locale / template list | HRREC-89785 | Shadow languages or filtered lists—**email** template pickers need the same class of edge cases. |
| Channel-specific policy | HRREC-90311 | Meta marketing-template rules do **not** copy to email—use only as a reminder that **per-channel validation** exists; ask what **email**-specific rules apply instead. |
| Template lifecycle | HRREC-86787 | Deleted MB templates still listed—**email** template source of truth and cache invalidation with Message Builder. |
| Free-text send rules | HRREC-89187 | Validation after template vs free text—**email** MB vs ad hoc body rules. |

## Captured excerpts (optional)

Short anchors for cross-initiative (2WE email) pattern hints. **`captured_excerpt_keys`** in frontmatter counts distinct `### HRREC-…` sections below. Expand on refresh; paraphrase only—no secrets. Under **manifest-only**, gap-review theme bullets should prefer these keys (see [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md)).

### HRREC-84388

**Summary (paraphrase):** Purge behaviour for candidates’ WhatsApp messages (lifecycle / retention).

**Pattern note:** Compare to email thread retention, purge UX, and “what recruiters see after purge” on the **email** path.

### HRREC-84389

**Summary (paraphrase):** Merging candidates carries WhatsApp threads; rules differ when merged records share the same phone vs different phones; unmerge scenarios align with two-way messaging merge expectations.

**Pattern note:** After merge, does **email** still attribute replies to the surviving person, and do thread lists stay coherent when addresses or identities diverge?

### HRREC-84390

**Summary (paraphrase):** Recruiter opt-in for contacting candidates via WhatsApp (GWT story).

**Pattern note:** Consent and double opt-in patterns—useful when designing **recruiter-facing** email consent and defaults.

### HRREC-84403

**Summary (paraphrase):** After choosing a template, recruiter sees a **preview** with candidate fields resolved **with security**; handle no access / empty CRFs; if **hydrate** fails, surface a clear error in the composer (not a silent blank).

**Pattern note:** Same “preview truth vs send truth” and **hydration failure** handling questions apply to **email** templates and MB-backed bodies.

### HRREC-84406

**Summary (paraphrase):** User-visible messaging when a WhatsApp send fails (distinct from generic panel errors).

**Pattern note:** For **email**, what is the equivalent failure taxonomy (transport vs validation vs policy) and where does each surface—in composer, thread, or toast?

### HRREC-84407

**Summary (paraphrase):** Read / unread affordances on **sent** messages; ticket calls out OE timing risk for when read state appears.

**Pattern note:** Email “read” semantics are channel-specific—ask what you promise vs what receipts actually support.

### HRREC-84533

**Summary (paraphrase):** Expiry **countdown** in the panel should stay accurate when the panel is refreshed (not stuck on first load).

**Pattern note:** Any **email** session-expiry or “reply window” UI should define refresh behaviour the same way.

### HRREC-84534

**Summary (paraphrase):** **24-hour expiry** messaging in the messaging panel for WhatsApp sessions (related narrative may also appear under other keys such as HRREC-88115).

**Pattern note:** If **email** introduces time-bounded threads, mirror clarity on **when** the clock starts and what happens after expiry.

### HRREC-84555

**Summary (paraphrase):** Profile **entry icon** when WhatsApp is tenant-enabled **and** the candidate has opted in; hidden when not opted in.

**Pattern note:** What is the **email** equivalent (icon, tab, or task) when the channel is off or consent is missing?

### HRREC-84556

**Summary (paraphrase):** **Reporting** fields / CRFs for WhatsApp message volume; naming evolved from SMS-oriented CRFs.

**Pattern note:** Plan **email** reporting fields and naming so mixed-channel dashboards stay interpretable.

### HRREC-86787

**Summary (paraphrase):** Deleted Message Builder WhatsApp templates could still appear in the recruiter template picker; fix expected from MB filtering / endpoint behaviour; delete may remain internal-only for GA.

**Pattern note:** **Email** template lists must stay in sync with MB lifecycle (soft delete, cache, “stale template” edge cases).

### HRREC-89187

**Summary (paraphrase):** Validations when sending free-text message to candidate after template selection.

**Pattern note:** Free text vs template boundaries—maps to **email** validation, MB restrictions, and Meta vs non-Meta rules differently; phrase as translation questions only.

### HRREC-89778

**Summary (paraphrase):** Defines **which business objects’** CRFs may appear in Message Builder for WhatsApp templates; single **hydration context**; tradeoffs between security and admin UX when scoping fields.

**Pattern note:** For **email**, which CRFs are in scope for MB vs ad hoc compose, and is there one consistent hydration context per send?

### HRREC-89785

**Summary (paraphrase):** Bug—shadow languages interfering with template filtering.

**Pattern note:** Locale / shadow-language + template picker edge cases; analogous risks for **email** template lists and tenant language config.

### HRREC-89856

**Summary (paraphrase):** **Send** path resolves CRFs **on send** (with discussion of evaluation vs **processing user** and OE constraints); keep **preview** and **sent** body consistent.

**Pattern note:** **Email** should spell out whose security context resolves tokens at preview vs send, and how mismatches are prevented.

### HRREC-89899

**Summary (paraphrase):** Apply-flow WhatsApp opt-in checkbox and T&C link could appear with **no** consent text when default T&C are not configured in tenant notifications; link effectively useless. Fix: **hide** checkbox and link when T&C missing.

**Pattern note:** **Email** opt-in must not show broken consent chrome—define hide vs disable vs inline “configure tenant” behaviour.

### HRREC-89979

**Summary (paraphrase):** When a candidate exhausts available numbers for new application conversations (example: many past conversations), **create conversation** may fail deep in the stack without surfacing on **open**; recruiter only sees a generic error on **send**. Desire: fail fast when opening the panel.

**Pattern note:** **Email** may hit different resource limits, but the **“silent until send”** anti-pattern is worth avoiding for any channel.

### HRREC-90243

**Summary (paraphrase):** “Conversation will close soon … dispositioned” message did **not** show immediately on candidate decline before the first template send; appeared only **after** sending the initial template—expected earlier visibility.

**Pattern note:** **Email** lifecycle banners (closed thread, no reply) should appear at the **business event** (decline, hire, close), not only after first outbound.

### HRREC-90268

**Summary (paraphrase):** Disable Send in composer while sending (avoid duplicate sends / race).

**Pattern note:** Composer disable during send is a shared UX concern for **email** compose (double-click, slow network).

### HRREC-90306

**Summary (paraphrase):** After candidate **merge**, outbound messages can show the **merged** candidate as sender instead of the **survivor** person; parallels SMS bug HRREC-88213; may need platform method uptake for WhatsApp.

**Pattern note:** **Email** identity after merge (From, threading keys, participant records) should be audited for the same class of defect.

### HRREC-90311

**Summary (paraphrase):** **Blocking validation** when sending a **marketing**-category WhatsApp template to a **US** phone number (Meta policy); recruiter-facing copy guides them to pick a **utility** template instead.

**Pattern note:** Do **not** treat Meta rules as **email** requirements—use this only as a reminder that **channel-specific policy validation** exists; define **email**-specific rules separately.

### HRREC-92062

**Summary (paraphrase):** SMS and WhatsApp composer still accepts typing after Send is pressed; extra text is not sent. Ideal: **momentarily disable** input while send is in flight.

**Pattern note:** Same “in-flight compose” confusion risk for **email** rich-text or long bodies—disable or queue input consistently.
