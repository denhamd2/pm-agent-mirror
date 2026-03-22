# Epic draft: WhatsApp 2-way from candidate profile (GCC / 2026R2)

**PRD:** `docs/prds/gcc-whatsapp-2way-communication-prd.md`  
**Discovery brief:** `design/gcc-whatsapp-2way-communication-discovery-brief.md`  
**Mission:** GCC-E2E-004  
**Status:** Draft — **Jira epic is created in 430** after story map approval (420 HITL).

## Epic summary (for Jira Summary field)

WhatsApp 2-way messaging from candidate profile for governed GCC recruiter-candidate dialogue

## User story

As a GCC-focused recruiter using Workday Recruiting  
I want native **2-way WhatsApp** with candidates **from the candidate profile** (templates to open sessions, consent and opt-out visible, threaded history, audit metadata)  
So that I can get **timely replies** and keep pipeline momentum **without shadow IT**, while customers can enforce **tenant policy**, **PDPL / PDPA**, and **retention** expectations

## Jira-ready description

Paste body for Jira epic description (markdown):

**User story**

As a GCC-focused recruiter using Workday Recruiting, I want native 2-way WhatsApp from the candidate profile (template-backed session open, consent and opt-out, thread view, audit metadata), so that I can get timely replies without personal devices and keep an auditable system of record.

**PRD:** `docs/prds/gcc-whatsapp-2way-communication-prd.md`  
**Discovery brief:** `design/gcc-whatsapp-2way-communication-discovery-brief.md`

**Scope (in)**

• Profile-anchored **1-on-1** thread (CommunicationDock pattern; parallel to Candidate SMS mental model)  
• **Outbound** via **approved templates** where Meta / WhatsApp Business rules require it; **session** messaging within allowed windows  
• **Inbound** receipt, **identity resolution** (phone + tenant → candidate / application), thread association  
• **Opt-in / opt-out** capture, storage, **enforcement** (hard block when not eligible)  
• **Arabic** / **UTF-8** and **RTL** presentation where specified  
• **Tenant** enablement (off by default), hooks for **role** restrictions and **retention** alignment  
• **Audit:** message metadata (template used, sender, timestamps; content subject to retention policy)  
• **Explicit non-scope:** Recruiting **campaign builder**, bulk marketing, **AI/ML** ranking or generative drafting, voice/video

**Personas**

• **Primary:** Recruiter (GCC-focused)  
• **Secondary:** Hiring manager (visibility only, if policy allows — later slices)  
• **Tertiary:** Candidate (lawful, transparent messaging; opt-out on device — recruiter-side UX shows status)

**Business value**

• Close **GCC PMF gap** on regional channel expectations; reduce **compliance and retention risk** vs informal WhatsApp  
• Target outcomes from PRD: faster **median first reply** on WhatsApp vs email, **governed channel share** for mobile-first outreach, adoption and thread volume forecasts for Year 1

**Compliance note**

Legal-sensitive **UX copy** (consent, notices, opt-out) is **configurable** for customer Legal sign-off; feature is **non-AI** for AI Act threshold purposes but remains **privacy- and messaging-policy-sensitive**.

## Notes for story mapping

• **420** should slice **VS1** as a **walking skeleton**: enablement → profile dock → consent gating → template open → session send → inbound → opt-out → audit metadata  
• **VS2** = recruiter efficiency and **localisation** (Arabic/RTL, catalogue sync UX, disambiguation, rich errors, session-expired UX)  
• **VS3** = **reporting**, advanced **RBAC**, optional **manager** visibility, operational compliance exports  
• **430** defaults: project **HRREC**, issue type **Epic** then **Story**, component **Recruiting Purge**, assignee **david.denham**
