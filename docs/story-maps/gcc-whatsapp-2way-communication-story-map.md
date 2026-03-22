# Story Map: WhatsApp 2-way from candidate profile (GCC)

**Epic draft:** `docs/epics/gcc-whatsapp-2way-communication-epic.md`  
**Jira epic:** *(not created until 430 — HITL approval required in this session)*  
**PRD:** `docs/prds/gcc-whatsapp-2way-communication-prd.md`  
**Discovery brief:** `design/gcc-whatsapp-2way-communication-discovery-brief.md`  
**Created:** 20 March 2026  
**Author:** AI Story Mapping Specialist (420)  
**Mission:** GCC-E2E-004

## Epic context

**Epic summary:** WhatsApp 2-way messaging from candidate profile for governed GCC recruiter-candidate dialogue

**User story**

As a GCC-focused recruiter using Workday Recruiting  
I want native **2-way WhatsApp** with candidates **from the candidate profile** (templates to open sessions, consent and opt-out visible, threaded history, audit metadata)  
So that I can get **timely replies** and keep pipeline momentum **without shadow IT**, while customers can enforce **tenant policy**, **PDPL / PDPA**, and **retention** expectations

**Key personas:** GCC recruiter (primary); hiring manager (secondary, later); candidate (tertiary, reflected via consent/opt-out state)  
**Business goals:** Governed channel vs shadow IT; faster time-to-reply; auditable threads; GCC PMF and enterprise policy segmentation (tenant off)

## User activities (horizontal backbone)

1. **Enable channel** — Administrator turns WhatsApp 2-way on for the tenant / legal entity (disabled by default).  
2. **Open candidate context** — Recruiter navigates requisition → candidate → profile with CommunicationDock.  
3. **Check eligibility** — System shows WhatsApp consent / opt-out / phone readiness; blocks or guides when not eligible.  
4. **Open or resume session** — Recruiter selects **approved template** when required; understands **session window** constraints.  
5. **Exchange messages** — Recruiter sends session messages; **inbound** replies appear in chronological thread linked to candidate/application.  
6. **Govern and evidence** — Opt-out enforced; **audit metadata** captured; reporting and advanced access rules as programme matures.

## User tasks (vertical slices)

### Activity 1: Enable channel

- Configure tenant (or entity) **WhatsApp 2-way** on/off and integration prerequisites (credentials / BSP or Cloud API path) → **VS1**  
- **Role-based** restriction of who may **send** WhatsApp from Recruiting → **VS3**

### Activity 2: Open candidate context

- Surface **WhatsApp** tile in **CommunicationDock** on **candidate profile** alongside email/SMS affordances → **VS1**  
- Preserve **req / application context** (IDs, role title) next to thread header → **VS1**

### Activity 3: Check eligibility

- Display **consent status** (opted in, not opted in, opted out) with short **guidance** for recruiters → **VS1**  
- **Block send** with clear reason when **not opted in** or **opted out** → **VS1**  
- Validate **phone** presence and **E.164 normalisation** for GCC; show inline validation errors → **VS2**

### Activity 4: Open or resume session

- **Template picker** with **preview** (including **Arabic / RTL** sample in preview) → **VS1** (basic EN), **VS2** (full AR/RTL polish)  
- **Sync** approved **template catalogue** from provider into Workday picker → **VS2**  
- When **session window** expired, prompt recruiter to **select a new template** to continue → **VS1** (basic messaging), **VS2** (polished UX and error copy)  
- Handle **template rejected** / provider errors with **actionable** codes in UI → **VS2**

### Activity 5: Exchange messages

- Send **template-initiated** outbound message; append to **thread** with **delivery/read** indicators when API provides → **VS1** (delivery where available), **VS2** (full status UX)  
- **Composer** for **free-text** messages inside active session; respect platform rules → **VS1**  
- **Inbound webhook**: match **phone + tenant** to **candidate/application**; append to thread → **VS1**  
- **Disambiguation** UI when multiple candidates match the same inbound identity → **VS2**

### Activity 6: Govern and evidence

- Process **opt-out** (e.g. STOP); update preference; **hard block** further sends; confirm in UI → **VS1**  
- Persist **audit metadata** (template id, sender, timestamps, channel event type; message body per retention config) → **VS1**  
- **Reporting**: thread volume, **median first reply**, opt-in / opt-out rates by LOB/country (RBAC) → **VS3**  
- Optional **hiring manager read-only** visibility of “contact occurred” where tenant policy allows → **VS3**  
- **Export / operational** hooks for customer compliance processes (metadata-focused) → **VS3**

## Value slices

### VS1: Foundation

**Goal:** Deliver a **complete end-to-end** path: for an **opted-in** candidate on an **enabled** tenant, a recruiter can **open WhatsApp from the profile**, **send a template-backed opener**, **exchange session messages**, **receive an inbound reply** in-thread, and **cannot send after opt-out**; **audit metadata** is recorded for each outbound/inbound event.

**Stories**

1. Tenant **enable WhatsApp 2-way** and secure credential / connection prerequisites — *Enable channel*  
2. **WhatsApp** entry in **CommunicationDock** on candidate profile with req/application context — *Open candidate context*  
3. **Consent / opt-out** strip and **send gating** with recruiter-facing guidance — *Check eligibility*  
4. **Template selection** and **send** to open or refresh a session (minimum viable catalogue or seeded templates for EA) — *Open or resume session*  
5. **Session messaging** (composer) and **basic session-expired** handling (prompt for new template) — *Open or resume session* / *Exchange messages*  
6. **Inbound** message handling with **single-match** identity resolution and thread display — *Exchange messages*  
7. **Opt-out** enforcement end-to-end (preference update + blocked send state) — *Govern and evidence*  
8. **Audit event** capture for outbound/inbound WhatsApp activity (metadata; body per retention policy) — *Govern and evidence*

**Total stories:** 8

### VS2: Enhancement

**Goal:** Cut recruiter **time-to-correct-template** and **error recovery** effort by **30%** (programme measure) through **catalogue sync**, **Arabic/RTL** quality, **phone validation**, **disambiguation**, and **provider error** clarity.

**Stories**

1. **Automated sync** of **approved template catalogue** from Meta / BSP into Workday — *Open or resume session*  
2. **Arabic / RTL** template preview and **message rendering** in thread — *Open or resume session* / *Exchange messages*  
3. **E.164** validation and **GCC-focused** inline errors for missing/invalid mobile — *Check eligibility*  
4. **Disambiguation** flow when inbound matches **multiple** candidates — *Exchange messages*  
5. **Read/delivered** (and other status) presentation consistent with API capabilities — *Exchange messages*  
6. **Rich provider error** mapping (template rejected, rate limits, invalid payload) with support-ready codes — *Open or resume session*

**Total stories:** 6

### VS3: Advanced

**Goal:** Give **compliance and operations** measurable visibility: **dashboards** for volume, **response time**, and **consent funnel**; tighten **RBAC**; optional **manager** visibility; support **export** workflows for PDPL/PDPA operational response.

**Stories**

1. **Recruiter / analyst** reports: WhatsApp thread counts, **median first reply**, channel mix (RBAC) — *Govern and evidence*  
2. **Opt-in / opt-out** rates by **LOB / country** — *Govern and evidence*  
3. **Restrict send** to configured **security roles** / domains — *Enable channel*  
4. **Hiring manager** read-only **activity indicator** (where policy allows) — *Govern and evidence*  
5. **Audit export** affordances for message **metadata** (customer-operated compliance process) — *Govern and evidence*

**Total stories:** 5

## Story map visualisation

```
Enable          Open            Check           Open/resume       Exchange         Govern
channel         context         eligibility     session           messages         + evidence
---------       ---------       -----------     -----------       --------         ----------
Tenant on       Dock +          Consent +       Template +        Outbound +       Opt-out +
(VS1)           context (VS1)   gate (VS1)      send (VS1)        inbound (VS1)    audit (VS1)
                |               |               |                 |                |
                |               E.164 (VS2)     Catalogue (VS2)   Disambig (VS2)   Reports (VS3)
                |               |               AR/RTL (VS2)      Status (VS2)     RBAC (VS3)
                |               |               Errors (VS2)      |                Manager (VS3)
```

## Summary

**Total activities:** 6  
**Total tasks:** 19 (mapped across activities; items may appear in one primary activity)  
**Value slices:** 3  
**VS1 stories:** 8  
**VS2 stories:** 6  
**VS3 stories:** 5  
**Total stories:** 19

## HITL status

**Awaiting PM approval** in this session before **430** creates the Jira epic or any stories.  
**No Jira keys** until you reply with one of: **Approve all**, **Approve VS1 only**, or **Request changes**.
