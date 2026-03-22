# WhatsApp 2-Way Communication from Candidate Profile Page (2026R2)
Product Requirements Document  
March 2026

**Mission:** GCC-E2E-004  
**Research source:** `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v43.md`

## Executive Summary

Workday is uniquely positioned to deliver **native, auditable WhatsApp 2-way messaging** between recruiters and candidates **from the candidate profile page** for Gulf Cooperation Council (GCC) and other high-penetration markets. v43 PMF research confirms **WhatsApp as a dominant regional norm** for recruiter-candidate dialogue, while **enterprise policy** (for example, global employers that restrict consumer messaging apps for official business) requires **tenant-level controls and opt-in discipline**. This PRD scopes **1-on-1 conversation** in the recruiter workflow (profile context), **not** the Recruiting **campaign builder** or bulk marketing sends. Target delivery aligns with the **2026R2** candidate engagement track, subject to programme sequencing.

For our customers, this feature will **replace risky shadow IT** (recruiters using personal WhatsApp without system of record) with **Workday-native threads**, **template-backed outbound messages**, **Arabic-capable content**, and **consent and opt-out** aligned to **Saudi PDPL** and **UAE PDPA**. Recruiters gain **response speed** comparable to informal channels: P1 (Accenture) described email as slow versus **immediate responses** on WhatsApp for **quick closures**. P2 (Baker Hughes) called out **WhatsApp or similar methodologies** as **helpful in GCC and Saudi**. Directional market context in v43 cites **very high WhatsApp penetration** in UAE social/messaging mix (Global Media Insight, methodology-specific) and **Pew Research** findings on **WhatsApp among dominant messaging apps** in surveyed **middle-income** markets, supporting qualitative customer evidence alongside **40%+ mobile/handheld career traffic** in Middle East analytics (P2).

For Workday, this initiative will **close a GCC PMF gap** (v43 RICE: WhatsApp integration **Reach ~8,000**, **Impact 2.5**, **Confidence 80%**, **Effort 3 PM**), **differentiate against regional ATS** narratives (Arabic + local channels), and **reduce compliance and retention risk** for customers who must prove **lawful basis**, **retention**, and **auditability** for candidate communications.

This capability is **not** an AI or ML feature: there is **no** automated ranking, scoring, or generative content requirement in scope. Legal-sensitive **UX copy** (consent, notices, opt-out) requires **Legal review** before GA.

**Epic Links:**  
- WhatsApp 2-Way (Candidate Profile) EA: TBD  
- WhatsApp 2-Way (Candidate Profile) GA: TBD  

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | GCC recruiters rely on **WhatsApp for time-sensitive, high-response candidate dialogue**, but Workday today centres **email** and **SMS (Workday Messaging, region-limited)** for structured comms. Recruiters often fall back to **personal devices**, breaking **audit trails**, **consent records**, and **data minimisation** expectations under **PDPL / PDPA**. v43 theme **"WhatsApp and mobile expectation gap"** captures **regional norm vs enterprise policy**: P3 (Shell) notes **organisational restrictions** on official WhatsApp, favouring **email, SMS, or Teams**—so the product must **segment by tenant policy**, not assume universal activation. |
| **How is it done today?** | Recruiters use **Send Message (email)** and **SMS** where Workday Messaging is enabled; the **collaboration / communication panel** on the candidate profile supports **Candidate SMS** patterns. **There is no standard native WhatsApp channel** in the profile or dock today—Deployment Agent notes **WhatsApp would require product integration**, not configuration. Practitioners copy phone numbers to **personal WhatsApp** for **quick closures** (P1), fragmenting history and governance. |
| **How is our approach uniquely different from others?** | • **Profile-anchored 2-way thread**: Conversation **lives on the candidate record** with the same **discovery and compliance context** as email/SMS<br>• **Consent-first + opt-out**: Explicit **opt-in**, **withdrawal**, and **tenant retention** policies<br>• **Arabic and template discipline**: **Approved templates** for session openers where required by **WhatsApp Business** policy; **UTF-8 Arabic** body text where supported<br>• **Enterprise policy controls**: **Disable channel**, **restrict roles**, **mask numbers**, **audit exports** for security and legal<br>• **Explicit non-scope**: **No campaign builder**, **no bulk unsolicited** blasts through this PRD—those remain a **separate** initiative if pursued |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Year 1 Forecast:**<br>• **Adoption Target:** **38%** of GCC-addressable Recruiting tenants enable WhatsApp 2-way for at least one legal entity (basis: v43 **80% confidence** on WhatsApp importance, offset by **~25%** policy-restricted multinationals per P3-style segmentation)<br>• **Usage Volume:** **~52,000** recruiter-initiated WhatsApp **conversation threads** tied to candidate profiles in Year 1<br>  ○ **Basis:** 65 tenants with material GCC hiring × **38%** adoption × **18** recruiters sending profile WhatsApp × **9** new threads per recruiter per month × **12** months ≈ **48,000–55,000** (midpoint **~52,000**)<br>  ○ **Message volume (secondary):** **~420,000** total **message events** (inbound + outbound) at **~8** messages average per thread (directional)<br><br>**Strategic Value & Outcomes:**<br>1. **Time to candidate response:** Target **median first reply under 30 minutes** for WhatsApp threads vs **24–48 hours** typical email (P1: immediate vs email delay); measure by channel in product analytics<br>2. **Governed channel share:** Target **75%** of GCC recruiters’ **mobile-first outreach** on **sensitive stages** (interview, offer prep) to run through Workday where channel is enabled within 9 months of GA<br>3. **Drive Business & Platform Growth:**<br>   a. **Monetisation:** Supports **Recruiting** land-and-expand in **GCC HR tech growth** (Astute Analytica–cited market **CAGR ~9%** to 2032 in v43)<br>   b. **Deal-Closing:** Removes **"no WhatsApp in system"** objection vs regional suites<br>   c. **Future Acceleration:** Same **integration spine** can later connect to **optional** campaign flows **without** conflating this profile-scoped MVP |

### Audience / Personas

| **Role** | **Persona** | **Needs** |
|----------|-------------|-----------|
| **Primary** | **Recruiter (GCC-focused)** | 2-way WhatsApp from **candidate profile**; templates; Arabic; fast replies; clear **consent status** |
| **Secondary** | **Hiring manager** | Visibility that **contact happened** (where policy allows); **no** expectation to operate WhatsApp directly in v1 unless expanded later |
| **Tertiary** | **Candidate** | Receives **lawful**, **transparent** messages; can **opt out**; experiences **familiar** WhatsApp UI on device |

**Evidence (v43 + transcripts):**  
• **P1 (Accenture):** WhatsApp is **"an absolute necessary"** for reaching candidates for **quick closures**; **"immediate responses"** vs email delay.  
• **P2 (Baker Hughes):** **WhatsApp** (or similar) **helpful in GCC and Saudi**; uses WhatsApp for **campaigns and general communication** via **external tools** today—shows **demand** and **integration pull**.  
• **P3 (Shell):** **Policy** restricts **official WhatsApp**; reinforces need for **tenant kill-switch** and **audit** narrative.

---

## Scope

### In scope

• **2-way WhatsApp thread** initiated from **candidate profile** (or existing **communication / collaboration** panel pattern extended)  
• **Inbound** message receipt and **association** to candidate / job application context  
• **WhatsApp Business Platform**-style **template** send for **conversation initiation** where platform rules require  
• **Arabic** character support in **free-text** segments where policy allows  
• **Opt-in / opt-out** capture, **storage**, and **enforcement** (send blocked when not opted in)  
• **Enterprise policy**: tenant enablement, optional **role-based** access, **retention** configuration hooks  
• **Audit**: message metadata, template used, sender, timestamps (content subject to **retention** policy)

### Out of scope (explicit)

• **Recruiting campaign builder** bulk sends, **marketing lists**, **nurture sequences**  
• **AI/ML** screening, ranking, or **generative** message drafting  
• **Voice / video** calling via WhatsApp  
• **Legal determination** of **lawful basis** text (product provides **configurable** notices for **customer legal** sign-off)

---

## Feature Solution

• **Channel enablement**: Administrator enables **WhatsApp 2-way** per tenant or region pack; **disabled by default** for policy-restricted orgs  
• **Candidate profile entry point**: Recruiter opens **WhatsApp** pane (alongside email/SMS where present) from **candidate profile**  
• **Consent banner / status**: Visible **opt-in state**, **date**, **source** (e.g. application, SMS keyword, manual attestation per customer process)  
• **Template picker**: Recruiter selects **pre-approved** template to **open** session; then **2-way** messaging within **24-hour customer care** window rules (product reflects **Meta/WhatsApp policy** constraints)  
• **Thread view**: Chronological **conversation** with **delivery** / **read** indicators where API provides  
• **Opt-out handling**: **STOP** / link flows update **candidate channel preference**; **block** further WhatsApp from Workday  
• **Arabic**: Templates and **free text** support **RTL** rendering in Workday UI preview and **message payload** encoding  
• **Reporting**: **Volume**, **response time**, **opt-in rate**, **opt-out rate** by **LOB / country** (RBAC-protected)  

---

## Critical User Journey & Use Cases

• **Open profile**: Recruiter navigates to **candidate** from req pipeline  
• **Check consent**: System shows **WhatsApp** eligibility; if **not opted in**, recruiter sees **guidance** (request consent per customer process—no **unsolicited** template spam)  
• **Start thread**: Recruiter picks **template** + parameters (e.g. interview slot); **sends**; **audit** row created  
• **Candidate replies**: **Inbound** webhook **matches** candidate phone / candidate ID; **message** appears in thread  
• **Follow-up**: Recruiter sends **session messages** within allowed window; if **window expires**, **new template** required  
• **Opt-out**: Candidate texts **stop**; preference updated; **confirmation** in UI  
• **Admin audit**: **Security / compliance** role exports **metadata** for **PDPL / PDPA** requests (customer-operated process)  

---

## Technical Architecture & Integrations

**Purpose:** Deliver **reliable, secure** WhatsApp **send/receive** without AI components.

**Core components:**  
• **Connector service** for **WhatsApp Cloud API** (or approved BSP path) with **tenant-scoped** credentials  
• **Webhook endpoint** for **inbound** messages and **status** callbacks  
• **Identity resolution**: Map **phone number** + **tenant** to **candidate** / **application**; **disambiguation** UI when multiple matches  
• **Template catalogue sync**: **Approved** templates from **Meta** surfaced in Workday **picker**  
• **Workday Recruiting objects**: Persist **thread ID**, **message** records (content per **retention**), **consent** artefacts  

**Key dependencies:**  
1. **WhatsApp Business Account** per customer (or Workday-managed **multi-tenant** pattern per programme decision)  
2. **Candidate phone** attributes and **normalisation** (E.164, country codes for **GCC**)  
3. **Workday security** domains for **messaging** actions  
4. **Privacy programme**: **DPIA** pack for **EU** candidates if channel used cross-border; **Saudi PDPL** / **UAE PDPA** **processing records**  

**Authentication / security:**  
• **OAuth / system tokens** for API; **secrets** in **vault**; **per-tenant** isolation  
• **RBAC**: Only **authorised** recruiter roles **send**; **managers** may have **read-only** visibility per configuration  

**Error handling:**  
• **Template rejected** → show **provider error**, log **ticket-friendly** code  
• **Phone invalid** → block send with **inline validation**  
• **Session expired** → prompt **new template**  
• **Opt-out** → hard **block** with **user-visible** reason  

---

## Compliance & Privacy (GCC)

**Applicable frameworks (v43 / 060):**  
• **Saudi PDPL** (Royal Decree M/19; amended M/148)—lawful basis, **rights**, **transfers**  
• **UAE PDPA** (Federal Decree-Law No. 45 of 2021)—employment/recruitment processing, **cross-border** rules  
• **GDPR** where **EU** data subjects—**transparency**, **Art. 6/7** lawful basis, **Art. 17** erasure alignment with **retention**  

**Product implications:**  
• **Consent** and **opt-out** must be **specific** and **documented** (customer owns **wording**—Legal sign-off)  
• **Retention** of **message bodies** **configurable** to **customer** policy; **minimum** needed for **dispute** resolution  
• **Cross-border** processing via **Meta** infrastructure requires **customer** **TIA / SCC** posture (customer **DPA** track)  
• **060 v43 note:** WhatsApp requires **consent, retention, cross-border, enterprise policy**; **segment** for **no-WhatsApp** enterprises  

---

## UX Designs for 2026R2

• **Candidate profile – WhatsApp thread panel** – Figma link pending (330 capture)  
• **Template selection + preview (EN / AR)** – Figma link pending  
• **Consent & opt-in status module** – Figma link pending  
• **Admin – tenant WhatsApp policy** – Figma link pending  

---

## Releases & Production Thresholds

• **Legal review**: **PDPL / PDPA** **consent**, **privacy notice**, **opt-out** copy  
• **Security review**: **Webhook** hardening, **PII** in logs, **penetration** test on **connector**  
• **Privacy**: **DPIA** where **high-risk** processing (customer-led)  
• **No** Responsible AI threshold—**non-AI** feature  

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD approval | April 2026 |
| Architecture + BSP / Cloud API decision | May 2026 |
| Consent + profile UI specification freeze | June 2026 |
| Template catalogue + send path (EA) | July 2026 |
| Inbound webhooks + thread UI (EA) | August 2026 |
| GCC pilot tenants | September 2026 |
| GA (2026R2 programme alignment) | November 2026 |

---

## Resources

• **Research:** `research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v43.md`  
• **Citations (v43):** [Global Media Insight – UAE social / WhatsApp context](https://www.globalmediainsight.com/blog/uae-social-media-statistics); [Pew Research – WhatsApp in middle-income nations](https://www.pewresearch.org/short-reads/2024/03/22/whatsapp-and-facebook-dominate-the-social-media-landscape-in-middle-income-nations/); [Mondaq – KSA interview regulations](https://www.mondaq.com/saudiarabia/employee-rights-labour-relations/1683580/new-regulations-for-private-sector-job-advertising-and-interviews) (adjacent **scheduling** compliance, not messaging-specific)  
• **Related PRD (campaign-oriented, separate):** `docs/prds/gcc-whatsapp-integration-prd.md`  
• **Feature overview (Confluence):** link added after publish  
• **Full PRD (Notion):** link added after publish  

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

Workday Confidential — **-- 1 of 6 --** (markdown source; paginate in exported PDF)
