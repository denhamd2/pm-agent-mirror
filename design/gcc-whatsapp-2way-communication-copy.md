# UX Copy Review: GCC WhatsApp 2-Way Communication Prototype

**Source**: `design/gcc-whatsapp-2way-communication.tsx`  
**Mission**: GCC-E2E-004 (post-320)  
**Guidelines**: EMEA Editorial Guidelines (February 2026) — PDF path `design/guidelines/EMEA-Editorial-Guidelines-February-2026.pdf` **not present in workspace**; review uses `.cursor/rules/319-doc-writer.mdc` principles (sentence case, concise, active voice, numerals in UI, plain language).  
**Date**: 20 March 2026

---

## UX Copy Review

### Summary

- **Total issues found**: 18
- **Critical**: 3 (legal-sensitive / compliance wording; prototype-only strings visible in stakeholder demo; one error message lacks clear next step)
- **Quick wins**: 9 (sentence case on nav labels, numerals, punctuation, trimming redundancy, minor voice tweaks)
- **Consistency**: 6 (session/window vs template terminology, “template” capitalisation in running text, field labels, dash style per workspace style guide)

---

### Inventory: All User-Facing Copy

**Left hub (`WorkdayLeftTabBar`)**  
Summary, Overview, Recruiting History, Attachments, Reminders, Questionnaire Results, Interview, Screening, Employment Offer, Personal Notes  

**Quick actions (below header)**  
Actions (button), Phone, Message, Resume  

**Summary tab**  
Candidate summary; `{requisitionId} · {jobTitle} · Stage: {stage}`; Job application; Personal; Application snapshot; Requisition; Role; Stage; WhatsApp consent and messaging; Opted in to WhatsApp / Opted out of WhatsApp / No WhatsApp consent on file; Recorded {date}. Source: {source}.; Request consent through your organisation's process before sending WhatsApp. Do not send unsolicited template messages.; Open WhatsApp thread; View approved templates  

**Personal tab**  
Contact; Mobile (E.164); Email; Country / region  

**Overview**  
Overview; Professional summary; body copy (mock CV); Skills; Change management; Stakeholder workshops; Agile delivery; Arabic (native); English (fluent)  

**Recruiting history**  
Recruiting history; Date; Event; Owner; Details; table row labels (Stage change, Screening complete, Application received, etc.)  

**Attachments**  
Attachments; filenames; sizes; dates; View  

**Reminders**  
Reminders; task titles; Due {date} · {owner}; Mark done; Add reminder  

**Questionnaire results**  
Questionnaire results; Questionnaire; Status; Score; Consultant pre-screen; Complete; 82 / 100; Right to work checklist; In progress; —  

**Interview**  
Interview; Panel interview (video); date/time line; Panel: …; Reschedule; Copy candidate instructions  

**Screening**  
Screening; Recruiter screening; Status: Complete — advance to interview; Notes: …  

**Employment offer**  
Employment offer; No offer in progress; Offer tasks appear here after the interview outcome is recorded.; Start offer (not available at this stage)  

**Personal notes**  
Personal notes; Add note (visible to you); placeholder “e.g. Prefer afternoon slots; avoid Friday mornings.”; Save note; Recent notes; dated note bodies  

**WhatsApp panel**  
WhatsApp; `{req} · {job} · 1:1 thread on this application`; Close WhatsApp panel (aria); Message sent successfully.; provider error string; opt-out / no-consent banners; 24-hour window explanatory copy; Consent; Recipient; Approved template; template option names; Preview (English); Preview (Arabic, RTL); Variables: …; Send template; Sending template…; Thread; message timestamps/meta (Sent · Delivered, etc.); composer placeholder; Template library; Simulate inbound reply; Send; Sending…; Close panel  

**Template modal**  
Approved WhatsApp templates; disclaimer paragraph; template names and bodies; Done; Close (aria)  

**Communication rail**  
Collapse panel / Expand panel; Email; SMS (Workday Messaging); Collapse WhatsApp / Expand WhatsApp; WhatsApp (title)  

**Prototype controls (demo)**  
Prototype controls; explanatory body; Consent: opted in / none / opted out; Session window: open; Session window: closed (template required); Show provider error; Clear provider error  

**Mock thread / templates (sample content)**  
Template bodies (EN/AR); inbound/outbound demo messages including “Yes, 26 March at 2pm…” and “Sounds good — I will join five minutes early.”  

---

### Headings and navigation

#### ❌ "Recruiting History", "Questionnaire Results", "Employment Offer", "Personal Notes"

**Issues**: Title Case on multi-word hub labels; EMEA / 319 standard is **sentence case** for UI.

**✅ Recommended**: "Recruiting history", "Questionnaire results", "Employment offer", "Personal notes"

**Rationale**: Aligns with Editorial Guidelines; scannable and consistent with other tabs (e.g. "Personal notes" not title case).

---

#### ⚠️ "Interview", "Screening", "Overview"

**Issues**: None for case; single-word labels are acceptable.

**✅ Recommended**: Keep as-is.

**Rationale**: Already sentence case equivalent for one-word entries.

---

### Buttons and actions

#### ❌ "Mark done"

**Issues**: Slightly abrupt; common Workday pattern is explicit completion ("Mark complete") or "Done" if space-constrained.

**✅ Recommended**: "Mark complete" (or "Mark as complete" if your product glossary requires "as").

**Rationale**: Clearer outcome for the recruiter; matches action + result pattern.

---

#### ✅ "Open WhatsApp thread", "View approved templates", "Send template", "Close panel", "Copy candidate instructions", "Reschedule", "Save note", "Add reminder"

**Issues**: Minor — "View approved templates" is tertiary; still verb-led and clear.

**✅ Recommended**: Keep; optional tighten "View approved templates" → "Browse approved templates" if you want stronger affordance for a library.

**Rationale**: Already action-oriented and sentence case.

---

#### ❌ "Simulate inbound reply"

**Issues**: **Prototype-only** copy is user-visible in the main panel; stakeholders may read it as a real feature.

**✅ Recommended**: For build reviews: hide behind a dev flag, or rename to a clearly internal label (e.g. "[Demo] Simulate candidate reply") and exclude from production spec. For PRD/Figma, footnote that it is non-production.

**Rationale**: Avoids confusion in enterprise demos; keeps trust in the UI.

---

### Success, error, and blocking messages

#### ❌ "Message sent successfully."

**Issues**: "Successfully" is redundant with success styling/icon; trailing full stop adds little in a compact banner.

**✅ Recommended**: "Message sent." or, if template-specific after template send, "Template sent."

**Rationale**: Shorter, still past tense + context per 319 patterns.

---

#### ❌ "Template rejected by provider (code 131026). Try another template or contact your admin."

**Issues**: "Provider" is vague; no link/path to **which** admin or self-serve retry; error code is useful for support but may alarm without context.

**✅ Recommended**: "WhatsApp couldn’t send this template (error 131026). Choose another template or ask your Workday administrator to check the integration."

**Rationale**: Problem + concrete actor + next step; keeps numerals for code; names the channel recruiters understand.

---

#### ❌ "This candidate opted out of WhatsApp. Sending is blocked. Preference updates may take a few minutes to sync."

**Issues**: Middle sentence is passive ("Sending is blocked").

**✅ Recommended**: "This candidate opted out of WhatsApp. You can’t send messages until their preference updates. Changes can take a few minutes to sync."

**Rationale**: Active, recruiter-centred; sets expectation without sounding like a system fault.

---

#### ✅ "No WhatsApp consent on file. Request consent through your organisation's approved process before messaging."

**Issues**: Strong legally; see **Legal-Sensitive Copy** — wording must be validated with Legal/privacy (approved process varies by tenant and region).

**✅ Recommended**: Keep intent; refine only after **060** review (e.g. link to internal consent SOP if product supports it).

**Rationale**: Clear block + required behaviour.

---

### Help text and session window

#### ❌ "The 24-hour messaging window from the last candidate reply has closed. Choose an approved template below and send it to reopen a session for free-text replies (subject to Meta / WhatsApp policy and your tenant rules)."

**Issues**: Dense; "Meta / WhatsApp" and "tenant rules" are correct but heavy for scanning; "reopen a session" may be jargon.

**✅ Recommended**: "The 24-hour reply window has closed. Send an approved template below to open messaging again. Free-text replies follow WhatsApp rules and your organisation’s settings."

**Rationale**: Shorter sentences; still points to template action; defers legal detail to policy links if available.

---

#### ❌ Composer placeholder: "Window closed — send a template to continue."

**Issues**: Workspace style guide prefers **no em dashes** (use hyphen or comma).

**✅ Recommended**: "Window closed – send a template to continue." or "Window closed. Send a template to continue."

**Rationale**: Matches `010-style-guide.mdc` punctuation guidance.

---

### Form labels and metadata

#### ⚠️ "Mobile (E.164)"

**Issues**: "E.164" is technical; recruiters may not recognise it.

**✅ Recommended**: "Mobile number (international format)" with optional tooltip "E.164" for admins, or keep E.164 only in admin docs.

**Rationale**: Plain language for primary persona.

---

#### ⚠️ "Stage: {stage}" in subtitle

**Issues**: Fine for prototype; in product, confirm glossary ("Stage" vs "Pipeline stage").

**✅ Recommended**: Align with Recruiting terminology used elsewhere in the shell.

**Rationale**: Consistency across candidate profile.

---

### Mock / sample content (still shown to users in demo)

#### ❌ "Sounds good — I will join five minutes early."

**Issues**: Em dash; **"five"** should be a **numeral** in UI per 319 exception.

**✅ Recommended**: "Sounds good – I'll join 5 minutes early."

**Rationale**: Numerals for scanning; hyphen or contraction per voice standards.

---

#### ❌ Mock `consentSource`: "Job application — WhatsApp channel"

**Issues**: Em dash in user-visible string.

**✅ Recommended**: "Job application – WhatsApp channel" or "Job application, WhatsApp channel"

**Rationale**: Aligns with workspace punctuation preferences.

---

#### ❌ "Status: Complete — advance to interview"

**Issues**: Em dash.

**✅ Recommended**: "Status: Complete – advance to interview" or split into two lines: "Status: Complete" / "Next: Advance to interview"

**Rationale**: Same as above; clearer progression if split.

---

### Modal: approved templates

#### ❌ "Templates are approved in Meta Business Manager and synced to Workday. Final consent and privacy wording is owned by your organisation and must be signed off by Legal."

**Issues**: **Legal-sensitive** (ownership, privacy, sign-off); "Legal" capitalised is OK as function name but confirm with Legal comms style.

**✅ Recommended**: No final marketing/UI wording until **060-legal-advisor** + tenant comms review; consider adding "See your organisation’s privacy notice" if product surfaces a link.

**Rationale**: Avoids over-committing Workday vs customer responsibilities incorrectly.

---

#### ✅ "Approved WhatsApp templates" (modal title)

**Issues**: Minor — "WhatsApp" is a proper noun; sentence case OK.

**✅ Recommended**: Keep.

**Rationale**: Clear scope.

---

### Terminology consistency

**Issue**: Mix of "session window" (prototype controls) vs "24-hour … window" vs "messaging window" in body copy.  

**✅ Recommended**: Pick one term in UI, e.g. "Messaging window" for both the closed state card and demo toggles.

**Rationale**: Reduces cognitive load for recruiters learning WhatsApp rules.

---

**Issue**: "Template library" vs "View approved templates" vs "Send template" — all valid; "approved" appears in some places and not others.

**✅ Recommended**: Always qualify user-facing sends as **approved** where policy requires: e.g. "Template library" → "Approved templates" if everything in the list is approved.

**Rationale**: Reinforces compliance story consistently.

---

### Prototype controls (demo chrome)

#### ⚠️ Entire "Prototype controls" card

**Issues**: Not production copy; acceptable for internal review. If this ships in any build, relabel as "Demo options" or gate behind `NODE_ENV` / feature flag.

**✅ Recommended**: Keep for PM demo; exclude from customer-facing captures or add a neutral caption: "For demonstration only."

**Rationale**: Prevents accidental exposure in sales or CAB materials.

---

### Legal-Sensitive Copy (060-legal-advisor)

**Flag for validation before final UI or customer-facing decks:**

1. **No-consent helper (Summary tab)**  
   "Request consent through your organisation's process before sending WhatsApp. Do not send unsolicited template messages."  
   - **Why**: Consent process, prohibition on unsolicited messaging, regional/channel rules (GDPR, local PDPL, WhatsApp commerce policy).  
   - **060**: Confirm accuracy, whether "unsolicited template messages" is the correct legal/product distinction vs cold outreach, and if a link to policy or process is required.

2. **No-consent banner (panel)**  
   "No WhatsApp consent on file. Request consent through your organisation's approved process before messaging."  
   - **Why**: Same as above; "approved process" must match how Workday documents customer vs WD obligations.

3. **Opt-out banner**  
   "This candidate opted out of WhatsApp. … Preference updates may take a few minutes to sync."  
   - **Why**: Opt-out handling, timing claims, and accuracy (processor vs controller messaging).  
   - **060**: Ensure wording does not over-promise sync latency or misstate legal basis.

4. **24-hour / template window explanation**  
   References to session reopening and "Meta / WhatsApp policy and your tenant rules".  
   - **Why**: Third-party terms and data processing; avoid misleading limits on free-form messaging.  
   - **060**: Align with actual product behaviour and DPA/help articles.

5. **Template modal disclaimer**  
   Meta Business Manager sync + "Final consent and privacy wording is owned by your organisation and must be signed off by Legal."  
   - **Why**: Clear division of responsibility; "Legal" sign-off may need standard disclaimer language from Workday Legal.  
   - **060**: Mandatory review before GA copy.

6. **Mock consent source and recorded date strings**  
   Demonstrate retention/display of consent metadata — ensure production strings support GDPR transparency (Art. 13/14 style) if shown to recruiters as evidence; candidate-facing notices are out of scope here but related.

**Do not finalise** the above strings for production without **060-legal-advisor** sign-off.

---

### Overall Assessment

The prototype copy is **generally clear, recruiter-appropriate, and aligned with sentence case** in most buttons and body text. The strongest improvements are **(1)** normalising **hub tab labels** to sentence case, **(2)** replacing **em dashes** and spelling **numbers as numerals** in UI strings, **(3)** tightening **success and error** messages to be more specific and active, and **(4)** treating **demo-only** actions ("Simulate inbound reply", prototype toggles) as non-product strings. Several strings touch **consent, opt-out, third-party policy, and organisational legal ownership** — those require **060-legal-advisor** validation before any customer-facing or GA release. The referenced **EMEA Editorial Guidelines PDF** was **not found** in-repo; a quick pass against the live PDF when available is still recommended.

---

## Return summary (orchestrator)

| Item | Value |
|------|--------|
| **Copy review path** | `design/gcc-whatsapp-2way-communication-copy.md` |
| **Total issues** | 18 |
| **Critical** | 3 |
| **Legal-sensitive items flagged** | 6 (see section **Legal-Sensitive Copy**) |
