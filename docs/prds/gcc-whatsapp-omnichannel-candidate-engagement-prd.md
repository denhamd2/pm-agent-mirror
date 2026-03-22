# GCC WhatsApp and Omnichannel Candidate Engagement (2026R2+)
Product Requirements Document  
March 2026

**Mission:** GCC-E2E-006 (Step 3 – 200 PRD)  
**Research source:** `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v45.md`  
**E2E recommendation:** #3 – WhatsApp and omnichannel candidate engagement (templates, Arabic, opt-in, retention, audit logs, tenant toggles where WhatsApp is blocked)  
**Revision:** 21 March 2026 – technical pass addressing Red Team review `docs/prds/gcc-whatsapp-omnichannel-engagement-prd-red-team-review.md` (GCC-E2E-006 Step 3b). Not republished to Confluence or Notion.

## Executive Summary

Workday is uniquely positioned to deliver **governed, omnichannel candidate engagement** for Gulf Cooperation Council (GCC) and comparable markets by combining **native Workday Recruiting** workflows with **WhatsApp Business Platform**-style messaging (approved **templates**, **two-way threads** where policy allows), **email** as the campaign backbone, and **SMS (Workday Messaging)** only **where that product is available today** (see **Technical Architecture → Workday Messaging (SMS) geography and programme dependency**). v45 PMF research shows **channels split by policy, not preference**: P1 (Accenture) and P2 (Baker Hughes) treat **WhatsApp as essential** for speed; P3 (Shell) reflects **enterprise restrictions** on official WhatsApp and preference for **email, SMS, or MS Teams**. The product must therefore support **tenant policy**, **granular opt-in**, **retention**, and **audit artefacts**, not a single default channel. For **GCC-primary** hiring, **practical in-product fallback when WhatsApp is off is email** (and guidance), not SMS, unless a **future programme** extends Workday Messaging SMS beyond current geography.

For our customers, this feature will **reduce shadow IT** (recruiters using personal WhatsApp outside the system of record), improve **time-to-response** on high-intent candidates (P1: **immediate responses** vs slower email), and extend **Arabic-capable** outreach for operational hiring (v45: Arabic critical for blue-collar segments). **Workday Messaging (SMS)** supports **opt-in** and, from **2025R1**, **SMS steps in multi-step Recruiting Campaign journeys** where Workday Messaging applies (US and Canadian mobile numbers, tenant and licensing constraints per product documentation). This initiative **closes the WhatsApp gap** for GCC and presents a **unified channel model** in the **candidate profile comm experience** (enable/disable per tenant, per region pack, or per legal entity) so global employers can **turn off WhatsApp** while keeping **email** and, **where eligible**, **SMS** in one UX. Directional market context in v45 cites **very high WhatsApp penetration** in UAE samples (**85.80%** among 16–64 internet users per Global Media Insight, 2024), triangulated with customer quotes and **40%+** handheld career traffic (P2).

For Workday, this initiative will **remove a recurring GCC / RFP objection** versus regional ATS vendors that lead on **Arabic + local messaging**, strengthen **Candidate Engagement** positioning, and **lower compliance risk** by logging **consent, sends, deliveries, and opt-outs** in Workday rather than in ad hoc tools. It is **not** an AI or ML feature: there is **no** automated ranking, scoring, or generative drafting in scope. **Legal-sensitive UX copy** (consent, notices, retention, cross-border disclosures) requires **Legal review** before GA.

**Epic Links:**  
- GCC Omnichannel Engagement (WhatsApp / SMS) EA: TBD  
- GCC Omnichannel Engagement (WhatsApp / SMS) GA: TBD  

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC recruiters need **fast, mobile-native** dialogue; **WhatsApp** is the **default coordination channel** for many hiring teams (v45 Theme 4). Workday today is **strong on email** for **Recruiting Campaigns** and, from **2025R1**, supports **native multi-step journeys that include SMS** via **Workday Messaging** where that product is **licensed and geographically supported** (not a replacement for email-first designs for all tenants). **Workday Messaging SMS** is currently **limited to US and Canadian mobile numbers** (and tenant **data centre** and **Innovation Services Agreement** constraints per product documentation); it is **not** a general **GCC mobile SMS** capability in product today. **WhatsApp is not a native channel** (Deployment Agent: **no pre-built connector**). Recruiters therefore **export phone numbers** or use **personal devices**, weakening **audit trails**, **consent discipline**, and **retention** controls expected under **Saudi PDPL**, **UAE PDPA**, and customer **DPA** posture. **Enterprise policy** (Shell-style **official WhatsApp bans**) means any solution must support **tenant toggles** and **realistic fallback** (**email** for GCC when WhatsApp is off; **SMS** only where Workday Messaging already applies) without fragmenting the recruiter experience. |
| **How is it done today?** | **Email** via campaigns and ad hoc **Send Message**; **SMS** where Workday Messaging is enabled, the candidate number is **eligible** (e.g. US/CA), and the candidate has **opted in**; **2025R1+** **SMS campaign steps** participate in **multi-step journeys** in those same constraints. **WhatsApp** is handled outside Workday or via **custom integrations** that may **not write back** to the candidate record (Deployment Agent: **audit gap** unless middleware posts to Workday). **Notification Designer** is the **campaign email** layout and branding surface; it does **not** deliver **WhatsApp Business** template catalogue parity (WhatsApp openers are **provider-catalogue + parameter merge**). **Arabic** content may be used in free text where channels allow; v45 flags **RTL and document** issues elsewhere on the platform—messaging UX must **validate Arabic rendering** in preview and payloads. |
| **How is our approach uniquely different from others?** | • **Omnichannel with policy**: **Single recruiter experience** for **email, WhatsApp** (where enabled), and **SMS only where Workday Messaging already applies**, with **tenant-level** enablement and **role-based** access<br>• **Reuse + extend**: **Align** profile comm UX and logging with **2025R1+ SMS campaign** patterns where relevant; **add** WhatsApp connector, **template catalogue sync**, and **unified thread/timeline** (this PRD), rather than re-inventing journey orchestration<br>• **Consent + retention + audit**: **Opt-in** per channel, **configurable retention** for message bodies and metadata, **append-only compliance audit** where immutability is required (see **Data classification**)<br>• **Template discipline**: **WhatsApp** uses **provider-approved templates** for business-initiated conversations; Workday surfaces **synced catalogues** and **parameter merge** from candidate/req context (**not** Notification Designer objects)<br>• **Arabic and locale**: **UTF-8 / RTL-safe** composer and previews for GCC operational hiring<br>• **Explicit non-AI scope**: **No** automated shortlisting or generative message content in this PRD |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• **Adoption Target:** **35%** of GCC-material Recruiting tenants enable **at least one** of WhatsApp or extended SMS omnichannel features for at least one legal entity (basis: v45 **high evidence** on channel need, discounted for **~25–30%** policy-blocked multinationals per P3-style segmentation)<br>• **Usage Volume:** **~45,000** recruiter-initiated **omnichannel threads** (WhatsApp + SMS campaign or profile-initiated) tied to candidates in Year 1<br>  ○ **Basis:** ~60 tenants with material GCC hiring × **35%** × ~15 active recruiters × **7** new threads per recruiter per month × **12** months ≈ **44,000–48,000**<br>  ○ **Secondary:** **≥70%** of enabled tenants show **logged consent** before first WhatsApp template send (compliance proxy metric)<br><br>**Strategic Value & Outcomes:**<br>1. **Time to first candidate reply:** Target **median under 45 minutes** on WhatsApp/SMS for enabled tenants vs email baseline (measure by channel)<br>2. **Governed channel share:** Target **≥65%** of GCC **mobile outreach** on screened stages to run through Workday channels (where policy allows) within 9 months of GA<br>3. **Drive Business & Platform Growth:**<br>   a. **Monetisation:** Reinforces **Candidate Engagement** SKU and **Recruiting** land-and-expand in **GCC HR tech** growth narratives (v45 PESTEL)<br>   b. **Deal-Closing:** Reduces **"no WhatsApp / no Arabic comms"** losses vs regional suites<br>   c. **Future Acceleration:** **Channel spine** supports later **campaign step** expansion (e.g. WhatsApp step in journey) without re-platforming profile messaging |

### Relationship to `gcc-whatsapp-2way-communication-prd.md`

This omnichannel PRD is the **portfolio umbrella** for **governed multi-channel** candidate engagement (admin policy, retention, reporting, **unified timeline**, WhatsApp **plus** email and **eligible** SMS). The narrower PRD **`docs/prds/gcc-whatsapp-2way-communication-prd.md`** (GCC-E2E-004) scopes **profile-anchored 2-way WhatsApp** (templates, thread, consent) **without** owning the full omnichannel programme.

**Phase and delivery strategy (single spine):**

• **One architecture owner** for the **WhatsApp connector** (send, receive, webhooks, template catalogue sync), **one** authoritative **candidate channel preference / opt-in store**, and **one** design system for the **candidate profile communication panel** (Sana-aligned omnichannel composer and thread). The 2-way PRD is **absorbed or superseded** by this document for **net-new engineering and design**; treat E2E-004 artefacts (discovery brief, prototype, Figma) as **inputs** to be **reconciled**, not a parallel product surface.

• **Suggested sequencing:** **VS1** – **profile thread + template send + inbound resolution + consent enforcement** (same recruiter job as 2-way PRD). **VS2+** – **admin console**, **retention defaults**, **audit exports**, **reporting**, **tenant toggles** at scale, and **explicit alignment** with **2025R1+ SMS campaign** steps where the same tenant uses both.

• **Epic policy:** Avoid **duplicate epics** for **WhatsApp webhooks/templates**; if both PRDs exist in portfolio tracking, **merge under one epic family** with this PRD as **source of truth** for scope boundaries.

### Audience / Personas

| **Role** | **Persona** | **Needs** |
|----------|-------------|-----------|
| **Primary** | **Recruiter (GCC-focused)** | Fast **WhatsApp** outreach and **SMS where Workday Messaging applies**; **templates**, **Arabic**, clear **consent status**, **thread history** on the candidate |
| **Secondary** | **Recruiting / TA administrator** | **Tenant toggles**, **region packs**, **audit exports**, **retention** configuration, **integration credentials** |
| **Tertiary** | **Candidate** | **Transparent** opt-in, **familiar** channel on device, **easy opt-out** |

**Persona depth:** Recruiter and candidate tone aligns with **`docs/workday-user-research/README.md`** (External Candidate UX persona where candidate-facing strings are specified). Hiring manager is **out of scope** for v1 sending unless later expanded.

**Evidence (v45):**  
• **P1 (Accenture):** WhatsApp **"an absolute necessary"**; **immediate responses**  
• **P2 (Baker Hughes):** **Campaign-email-only** gap; **non-email campaigns** desire; mobile traffic  
• **P3 (Shell):** **Official WhatsApp** restrictions; **email, SMS, Teams** preference  

---

### Experience Principles Alignment

**Empower (give users control)**  
• Recruiters choose **channel** from **enabled** options; system **blocks** sends when **consent** or **policy** fails  
• **Preview** template + parameters before send; **no** silent auto-send from black-box rules in v1  

**Trust (build their confidence)**  
• **Delivery and read** states surfaced where APIs allow; **clear errors** when templates are rejected or sessions expire  
• **Plain language** status for consent and opt-out ((customer legal owns final wording)  

**Grow (enable them to change)**  
• **Self-service** template catalogue sync and **admin** toggles; **history** of sends and preference changes for audit  

**Principle validation:**  
• [x] User stays in control of send actions  
• [x] Transparency on channel state and compliance blocks  
• [x] Administrators can revise policy without engineering for standard toggles  

---

## Scope

### In scope

• **WhatsApp Business Platform** integration path (Cloud API or approved BSP) with **tenant-scoped** credentials  
• **Template catalogue** sync, **parameterisation** from candidate / application / job data  
• **Two-way messaging** within **provider session rules** (e.g. template to open; session messages inside allowed window)  
• **SMS (Workday Messaging)** as **sibling channel** in UX **only where Workday Messaging is available** (today: **US and Canadian** mobile numbers, plus tenant **data centre**, **licence**, and **Innovation Services Agreement** requirements per product documentation). **Shared** **consent** and **logging** patterns with email; **not** positioned as **automatic GCC fallback** when WhatsApp is disabled (see **Out of scope** and **Workday Messaging geography**)  
• **Granular opt-in / opt-out** per channel; **enforcement** at send time  
• **Retention policies** for **message bodies** and **metadata** (admin-configurable within product guardrails)  
• **Audit logs**: who sent, what template, when, delivery outcome, preference changes (content subject to retention)  
• **Tenant toggles**: **disable WhatsApp** globally or per legal entity; **mask** channel in UI when off  
• **Arabic (UTF-8)** support in previews and payloads; RTL UI patterns in Workday chrome where applicable  
• **Reporting**: volumes, response times, opt-in/out rates, channel mix (RBAC-protected)  

### Out of scope (explicit)

• **AI / ML** drafting, ranking, or **generative** replies  
• **MS Teams** as a messaging channel in this PRD (may interface with scheduling elsewhere)  
• **Legal determination** of lawful basis text (customer **Legal** signs off on templates and notices)  
• **Full parity** of **multi-step Recruiting Campaigns** on WhatsApp in v1 (email remains primary for journey builder; **optional** follow-on epic for **WhatsApp campaign steps**)  
• **GCC SMS fallback** when WhatsApp is **tenant-disabled**: **no** commitment in this PRD that recruiters can send **SMS to GCC mobile numbers** from the same panel unless **programme** delivers **Workday Messaging** (or successor) **outside US/CA**; until then, **in-product fallback** is **email** plus clear **admin and recruiter messaging**  
• **Notification Designer** as the **authoring model** for **WhatsApp** templates (**non-goal**): WhatsApp openers remain **Meta/BSP-approved catalogue** objects with **parameter merge**, not **Notification Designer** parity  

---

## Feature Solution

• **Admin console**: Enable **WhatsApp**, **SMS**, or both; map **credentials**; set **retention** defaults; download **audit** extracts  
• **Consent model**: Store **opt-in** source, timestamp, scope (e.g. transactional vs marketing per customer taxonomy); **block** sends if missing  
• **Candidate profile / comm panel**: **Omnichannel composer** with **channel picker** (only **enabled** channels); **template picker** for WhatsApp **session open**  
• **Thread view**: Unified **timeline** with **filter by channel**; **search** within thread where performance allows  
• **Opt-out handling**: Provider events (e.g. **STOP**) and in-app **withdraw** update **preferences**; **hard block** further WhatsApp from Workday  
• **Audit**: **Tamper-evident** **compliance audit** for **send/consent/resolution** (see **Data classification**, **Class C**) **plus** recruiter-visible **activity** rows aligned to **candidate record**  
• **Policy-denied or unsupported tenants**: **WhatsApp hidden**; **email** always available; **SMS** shown **only** when Workday Messaging **eligibility** checks pass (number geography, tenant config, licence). Where **WhatsApp is off** and **SMS is not eligible**, show **email-first fallback** and **short operational guidance** (not legal advice)  

---

## Critical User Journey & Use Cases

• **Configure tenant**: Admin enables **WhatsApp**, connects **Business Account**, syncs **templates**  
• **Capture consent**: Candidate opts in via **career site / application / SMS** flow (customer-configured); preference visible on profile  
• **Open profile**: Recruiter reviews **channel eligibility** banner  
• **Send WhatsApp**: Pick **template**, fill **parameters**, **preview** (EN/AR), **send**; **audit** row written  
• **Candidate replies**: **Inbound** webhook **resolves** candidate per **Phone identity resolution** (unique match, **quarantine** if ambiguous); message in **thread**  
• **Session maintenance**: Inside **session window**, recruiter sends **free-form** (where policy allows); outside window, **new template** required  
• **Fallback**: Tenant **disables WhatsApp** → recruiter uses **email** from the same panel; **SMS** only if **Workday Messaging** supports the candidate number and consent; otherwise UI **does not imply** SMS is available for **GCC-local** numbers  
• **Compliance export**: Security role exports **metadata** for **DSR / audit** (customer-operated process)  

---

## Technical Architecture & Integrations

**Components:**  
• **Connector service** for **WhatsApp** (send, receive, status webhooks) with **per-tenant** isolation  
• **Template sync job** + **cache** of approved templates and locales  
• **Identity resolution** (see **Phone identity resolution** below): **E.164** normalisation, **tenant scope**, **match confidence**, **mandatory disambiguation**, **audit of resolution path**  
• **Preference service**: **Opt-in/out** authoritative store integrated with **send gate** (**single** store shared with **2-way WhatsApp PRD** intent – no divergent preference models)  
• **Retention job**: **Purge / archive** per **data class** (see **Data classification and lifecycle**); **legal hold** stops destructive actions for held records  
• **Workday APIs**: Write **activity / messaging** records to candidate **history** and align with **Activity Stream**, **Recruiting History**, and **Candidate Communications Report** patterns where applicable (close **audit gap** vs **shadow** middleware)  

### Workday Messaging (SMS) geography and programme dependency

**As of this PRD**, Workday Messaging delivers **SMS** to **US and Canadian** mobile numbers only, subject to **tenant data centre** (e.g. US or Dublin hosting per product rules), **licence**, and **Innovation Services Agreement**. **GCC-local** (+971, +966, etc.) **SMS** from Workday is **not** in scope as a **reliable fallback** unless **Product / GTM** publishes a **committed expansion** (regions, compliance, timeline); this PRD **documents** that dependency and **defaults** GCC narrative to **WhatsApp + email**.

### Phone identity resolution (acceptance-level)

**Outbound and inbound** must **not** attach or send to the **wrong** candidate when **phone** is the key.

• **Normalise** to **E.164** using **candidate phone** fields and **tenant default country**; **validate** before send.  
• **Unique match required to auto-send**: If **more than one** active candidate (or application) record matches **phone + tenant** (including **UDMF / duplicate** scenarios), **block** automated send and **require** explicit **recruiter disambiguation** (pick candidate/application) before the message leaves Workday.  
• **Inbound webhooks**: Resolve **tenant** from **connection/credentials**, then resolve **candidate**; on **multiple** matches, **hold** message in a **quarantine / review queue** or equivalent until **human** ties the thread to **one** record (**no** silent attach to **arbitrary** best match).  
• **Audit**: Persist **resolution method** (unique match, recruiter-selected, admin-resolved) on the **compliance audit** trail for **send** and **inbound attach** events.  
• **False match rate**: Programme to define **monitoring** (e.g. **override** rate, **quarantine** volume) for **pilot** and **GA**.

### Data classification and lifecycle (immutable vs purge, legal hold, GDPR)

**Problem:** **Append-only** compliance artefacts and **configurable retention** for **message bodies** can **conflict** with **purge**, **DSR**, and **legal hold** unless **data classes** are explicit.

| **Class** | **Examples** | **Default treatment** | **Notes** |
|-----------|--------------|-------------------------|-----------|
| **A – Message content** | Free-text and template-filled **body** stored for thread display | **Configurable retention** (purge or redact after period **subject to product guardrails** and **customer** policy) | Must align with **Recruiting Data Purge** / tenant **retention** configuration when **functional knowledge** and **Legal** define rules |
| **B – Operational metadata** | Delivery status, provider IDs, template name, timestamps, channel | **Retained** per **shorter** operational need; **anonymise or aggregate** where possible after **content** purge | Distinct from **Class C** where **tamper evidence** is required |
| **C – Compliance audit index** | Who sent, to which **candidate ID**, which **template**, consent state at send, **resolution path** (see above) | **Append-only / immutable** store or **WORM-equivalent** pattern for **tamper-evident** **audit**; **no in-product edit** of historical facts | **Subject to legal hold**: **suppress** purge/redaction for held subjects; **export** for **regulator / customer** process |
| **D – Candidate preference / consent** | Opt-in, opt-out, channel scope, source, timestamp | **Authoritative** for **send gate**; **retain** per **privacy** programme and **lawful basis** (customer-owned wording) | Changes are **new** rows or **versioned** events, not silent overwrite of **history** |

**Legal hold:** When **legal hold** applies to a **candidate** or **matter**, **halt** **purge/redaction** for **all affected classes** until **release**; **UI / admin** surfaces **held** state to **authorised** roles (implementation detail **TBD** with **Legal** and **Security**).

**GDPR and global privacy:** **Data minimisation** and **storage limitation** (Art. 5) apply to **Class A/B**; **right to erasure** (Art. 17) may require **deletion or anonymisation** of **message content** where **no** **legal hold** or **overriding** ground applies; **Class C** may retain **minimal** **non-identifying** or **legally required** **records** per **DPIA** and **customer** **DPA** (exact balance **Legal** sign-off). **Processor vs controller** roles follow **customer** contract.

**Ownership:** **Product** defines **guardrails** (what can be configured, minimum **audit**); **customer** configures **retention** within guardrails; **Legal** approves **default** periods and **messaging** for **DSR** and **regulatory** requests.

**Key dependencies:**  
1. Customer **WhatsApp Business Account** (or Workday-managed multi-tenant pattern – **programme decision**)  
2. **Workday Messaging** roadmap alignment for **SMS** UX consistency and **honest** **geography** in **UI** (this PRD does **not** assume **GCC SMS** without **explicit** roadmap item)  
3. **Security** review for **webhooks**, **secrets**, **PII** in logs  
4. **Privacy**: **DPIA** pack for **cross-border** processing via **Meta** infrastructure (customer-led); **ROPA** updates  
5. **Recruiting Data Purge** and **functional knowledge** validation when **PDFs** available (**align** **Class A–D** with **purge** matrices)  

**Error handling:**  
• **Template rejected** → show **provider code** and **retry** path  
• **Invalid phone** → inline validation  
• **Ambiguous phone match** → **block** send or **inbound attach** until **recruiter** or **admin** **disambiguates** (see **Phone identity resolution**)  
• **Opt-out / block** → send disabled with **reason**  
• **Webhook failure** → **retry queue** and **ops alerting**  

---

## Compliance & Privacy (GCC and global)

**Applicable (v45 / 060):** Saudi **PDPL**; UAE **PDPA**; **GDPR** for EU data subjects; **cross-border** transfer rules; **WhatsApp** as **processor** under customer **DPA**.  

**Product requirements:**  
• **Map data flows** (controller vs processor per customer contract)  
• **Minimise** message content; **separate** lawful basis for **nationality / disability** fields (out of scope here but must not leak via templates)  
• **Transparency** and **opt-in** copy **customer-owned**; Legal sign-off  
• **EU AI Act** not triggered for **non-AI** messaging (remain vigilant if future **AI** features attach)  
• **Apply** **Data classification and lifecycle** (Technical Architecture): **purge** vs **immutable audit** vs **legal hold** must be **implementable** without **contradictory** product behaviour; **reconcile** with **GDPR** **storage limitation** and **erasure** requests  

**Documentation:** Privacy notice updates; **DPIA** where required; **vendor** transfer assessments (customer track).  

---

## UX Designs for 2026R2+

• **Omnichannel comm panel** (profile) – Figma pending (330)  
• **Template picker + bilingual preview** – Figma pending  
• **Admin – channel policy & retention** – Figma pending  
• **Audit log explorer** – Figma pending  

---

## Releases & Production Thresholds

• **Legal**: Consent, **opt-out**, **retention**, **cross-border** disclosures  
• **Security**: Webhook hardening, **penetration** test on connector  
• **Privacy**: **DPIA** completion for pilot tenants  
• **No** Responsible AI threshold for core scope  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD approval | April 2026 |
| Architecture + BSP / Cloud API decision | May 2026 |
| Consent model + admin policy UX freeze | June 2026 |
| WhatsApp template send + logging (EA) | August 2026 |
| Inbound webhooks + thread UI (EA) | September 2026 |
| SMS UX alignment (eligible geographies only) + tenant toggles | October 2026 |
| GCC pilot tenants | November 2026 |
| GA (programme alignment **2026R2+**) | TBD with release train |

---

## Resources

• **Research:** `research/GCC/thematic-analysis/2026-03-21-GCC-PMF-Analysis-v45.md`  
• **E2E handoff table:** Recommendation **#3** in same file  
• **Related PRD (profile 2-way focus, subsumed by phase strategy in this doc):** `docs/prds/gcc-whatsapp-2way-communication-prd.md`  
• **Red Team revision input:** `docs/prds/gcc-whatsapp-omnichannel-engagement-prd-red-team-review.md`  
• **Deployment Agent thread:** `4a2e2b56-e62f-4d15-8c05-994dba841daa` (channel/campaign baseline)  
• **Citations (v45):** [Global Media Insight – UAE social / WhatsApp](https://www.globalmediainsight.com/blog/uae-social-media-statistics); [Pew Research – WhatsApp in middle-income nations](https://www.pewresearch.org/short-reads/2024/03/22/whatsapp-and-facebook-dominate-the-social-media-landscape-in-middle-income-nations/)  
• **Full PRD (Notion):** *Not published in authoring session (Notion MCP page tools unavailable). Publish from this file when Notion MCP is connected; log URL in `MISSION_LOG.md`.*  
• **Summary (Confluence):** https://confluence.workday.com/pages/viewpage.action?pageId=4349989128  

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager, Workday Recruiting |
| TBD | Engineering Lead |
| TBD | Product Design Lead |
| TBD | Legal Partner (Privacy) |
| TBD | Security Partner |

---

Workday Confidential — **-- 1 of 7 --** (markdown source; paginate in exported PDF)
