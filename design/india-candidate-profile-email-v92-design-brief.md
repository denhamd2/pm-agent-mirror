# Design Brief — 2-way email candidate profile (legacy filename: India v92)

**Figma (visual target):** [2-Way Email Recruiting 12/2024 — Template Selection](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=4044-5797) — node `4044:5797`.

**Mission:** INDIA-E2E-006  
**PRD:** `docs/prds/india-candidate-profile-email-conversation-prd.md`  
**Prototype:** `design/2-way-email-prototype.tsx` (route `#2-way-email-prototype`; legacy `#india-candidate-profile-email-v92`). Flow map: `design/2-way-email-prototype-flow.md`.

## Layout parity (vs earlier ProfilePageLayout sketch)

- **Full chrome:** 64px global header (search + tools), 65px recruiting rail, 300px candidate menu (name, Phone / Message / Resume, vertical nav), two-column profile body, **1000px collaboration panel** (64px channel rail + compose) with **backdrop dim**.
- **Compose (MVP vs [6887:14115](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-14115)):** From / To (blue focus border) / Subject; rich-text toolbar row; **yellow brand banner + orange logo circle** + body with **green token chips**; footer **Send** / **Discard** / demo bounce. CC, message template, and branding template selects deferred post-MVP.

## JTBD

*When* I am working a **high-volume India** requisition, *I want* **candidate email replies on the same screen as stage, documents, and identity status**, *so I can* **decide and document without switching to Outlook**.

## PASS 1–2 — Layout and composition

- **Shell:** `WorkdayTopNav` + `ProfilePageLayout` with **CommunicationDock** (`channels: ['email']` for this prototype; **WhatsApp** icon can be added later for omnichannel). **`CommunicationDock`** (`expandedWidthPx` = compose sheet ≈ 936px + 64px rail) slides in from the right; collaboration rail stays visible when collapsed; **email opens from the rail with panel initially collapsed**.  
- **Primary column:** Tabs **Overview** (includes **KYC summary** card: PAN verified / Aadhaar pending), **Activity**, **Documents**, **Questionnaire** — reuse density from `india-native-whatsapp-v91`.  
- **Dock panel:** Header **Email · {Candidate}** + **subject line** + **transactional vs marketing** hint + **thread** (`SanaCommMessageBubble`) + `SanaCommComposer`.  
- **Rail:** `mailIcon` toggle; `DEFAULT_COMM_RAIL_PX` width.

## Copy inventory (draft — **319** + **060** before GA)

| Element | Copy |
|---------|------|
| Dock title | `Email · {First Last}` |
| Subject | `Re: Application for {Job Title} ({Req ID})` |
| Meta | `Connected sender · {recruiter} · {work email}` |
| Consent strip | `Transactional recruiting email · Marketing requires separate consent where configured.` |
| Composer placeholder | `Write a reply…` |
| Send | `Send email` |
| Empty | `No messages in this thread yet.` |
| Overview KYC | `Know Your Candidate` / `PAN · Verified` / `Aadhaar eKYC · Pending (OTP retries)` |
| Footer disclaimer | `Prototype sample data for INDIA-E2E-006. Legal review required before GA (DPDP, IT Act, tenant email policies).` |

## PASS 3–4 — States (after 318)

- **Outbound** with **Sent** / **Delivered** indicators (prototype: `StatusIndicator`).  
- **Inbound** candidate reply — left-aligned bubble.  
- **Simulate inbound** (dev-only control) optional; not shipped.

## 318 peer review

- **Status:** Deferred — brief created in same sprint as prototype for **PM demo**; schedule **318** before Figma capture.

## 330 Figma

- Capture after **318 APPROVED** verdict.
