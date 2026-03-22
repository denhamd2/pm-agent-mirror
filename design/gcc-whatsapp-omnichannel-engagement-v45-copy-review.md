# UX Copy Review — GCC WhatsApp Omnichannel Engagement v45

**Review Date**: 21 March 2026  
**Discovery Brief**: `design/gcc-whatsapp-omnichannel-engagement-v45-discovery-brief.md`  
**Reviewer**: Agent 319 (Doc Writer)  
**Pipeline**: GCC-E2E-006 between 315 PASS 2 and PASS 3

---

## Summary

| Area | Count / note |
|------|----------------|
| **Total editorial tweaks** | ~18 (mostly consistency, verb+noun buttons, British English, passive→active) |
| **Critical** | 0 (errors already follow problem + solution) |
| **Quick wins** | Align **Send** / **Export** / **Download** wording; standardise **organisation**; reduce **choose** vs **select** mix |
| **Consistency** | **WhatsApp** described as "turned off" vs "off"; **provider** vs **Workday** in errors |
| **Gaps** | **SMS tile hidden/disabled tooltip** referenced in the brief but **not** listed in the Copy Inventory |

---

## Terminology (apply everywhere in this flow)

- **Candidate** (not applicant) for recruiter-facing strings
- **Organisation** (British English) — replace any **organization**
- Prefer **select** when the UI control is a picker; use **choose** only where it reads naturally in body copy
- **Workday Messaging** when naming SMS (matches brief and product line)
- **Channel** / **template** / **session window** — keep as-is; they match recruiter + BSP language

---

## 060 — Legal-Sensitive Copy (Flagged, Not Finalised)

**Status:** These strings need **060-legal-advisor** (and customer Legal) before treating them as production-ready. **319 does not finalise** them.

| String / area | Why **060** |
|---------------|-------------|
| **Consent missing** banner | Implies **lawful basis** and **opt-in** requirements; wording must match actual product behaviour and jurisdiction |
| **Opt-out** banner | **Opt-out** / **blocked send** — marketing vs transactional messaging rules; accuracy critical |
| **Messaging consent** modal title | Consent **scope** and **title** must align with privacy programme |
| **Consent modal body (placeholder)** | Full **lawful basis**, **scope**, **withdrawal**, **retention** cross-ref — **Legal-owned** |
| **Privacy notice** link label | Must match **actual notice** name/URL and **Art. 13/14**-style transparency where applicable |
| **Admin checkbox:** legal team reviewed disclosures | **Attestation** copy; who is bound, what was reviewed — **Legal + GRC** |
| **Default retention (message bodies)** help text | **Retention** and **guardrails** are **legal/compliance** sensitive; avoid over-promising in UI |
| **Template** / **session window** help (WhatsApp) | Tied to **consent** and **commercial messaging** rules; ensure not misleading vs local rules |

**Suggested handoff to 060:** Ask for review of **all** strings in the **Legal / consent** subsection plus **Consent missing**, **Opt-out**, and **retention** help text, and confirm **SMS/WhatsApp** eligibility banners do not imply **consent** where the blocker is **technical/policy** only.

---

## Approved Copy Inventory

Use this as the **single source** for **315 PASS 3** and **320**.

**Buttons and CTAs:**
- Send message
- Save changes
- Export audit log
- Sync templates
- Resolve match
- Apply template
- Cancel
- Close
- Preview template
- Download file
- View messaging consent
- Retry send
- View channel policy
- Learn about SMS eligibility

**Labels and help (profile):**
- Channel — *Only channels your organisation enabled for this candidate appear here.*
- Show — *Filter messages by channel.*
- Template — *WhatsApp needs an approved template to start or restart a conversation outside the session window.*
- Preview language: English, Arabic
- Subject
- Message
- Session window line: *Session window: you can send free-form messages until [time]. After that, select a template.*

**Banners:**
- WhatsApp disabled: **WhatsApp is turned off for your organisation. To contact this candidate, send an email.**
- SMS not eligible: **SMS isn't available for this phone number in Workday. Use email, or WhatsApp if your organisation turned it on.**
- Combined: **Use email to contact this candidate. WhatsApp is turned off for your organisation, and SMS isn't available for this number.**
- Consent missing: **You can't send messages on this channel until the candidate opts in to messaging.** [060 review required]
- Opt-out: **This candidate opted out of messages on this channel. Sending is blocked.** [060 review required]

**Errors:**
- Invalid phone: **Enter a valid phone number in E.164 format (for example, +971 12 345 6789).**
- Ambiguous match: **More than one candidate uses this phone number. Select the correct record, then send your message.**
- Template rejected: **This template was rejected by the messaging provider. Review the error code, correct the template or parameters, then try again.**
- Send blocked – policy: **Your organisation doesn't allow this channel for this candidate. Try another channel or contact your Workday administrator.**
- Webhook / transient: **We couldn't send this message. Check your network connection and try again.**

**Success / confirmation:**
- Message sent: **Message sent**
- Template sync: **Template sync started. Refresh this page in a few minutes.**
- Export: **Export started. Download the file from your browser when it's ready.**
- Thread linked: **Thread linked to this candidate record.**

**Empty states:**
- No messages: **No messages yet. Select a channel to start the conversation.**
- No audit rows: **No audit events match your filters.**
- No quarantine: **No inbound messages need review.**

**Loading states:**
- **Loading messages…**
- **Sending message…**
- **Syncing templates…**

**Legal / consent (060 placeholders):**
- Modal title: **Messaging consent**
- Body: [Customer Legal copy — 060 review required]
- Link: **Privacy notice**
- Admin checkbox: **I confirm that our legal team has reviewed the messaging disclosures.** [060 review required]

**Admin field labels:**
- **Enable WhatsApp** — *When this is off, recruiters don't see WhatsApp on the candidate profile.*
- **Enable SMS (Workday Messaging)** — *SMS only works for supported regions, numbers, and tenant configuration. Recruiters see SMS only when this candidate and number are eligible.*
- **Default retention (message bodies)** — *Keep retention within product guardrails and your organisation's legal retention policy.* [060 review required]
- **Apply to:** Entire tenant; Selected legal entity

**Dock aria-labels:**
- Email messages
- SMS messages
- WhatsApp messages

**New (gap filled):**
- SMS tile tooltip: **SMS isn't available for this candidate's number in Workday. Use email or WhatsApp when your organisation allows it.**

---

## Overall Assessment

The inventory is already close to the bar: **sentence case**, mostly **problem + solution** errors, and sensible **empty** states. The main **319** work is **verb+noun** primaries (**Send message**), **British organisation**, harmonising **WhatsApp off** wording, tightening **success** and **provider** error copy, and filling the **SMS tooltip** gap. **Consent, opt-in/opt-out, privacy, retention, and admin attestation** stay **060**-gated until Legal signs off.
