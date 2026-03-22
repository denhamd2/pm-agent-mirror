# Epic draft: GCC nationalisation and workforce compliance (OOB)

**PRD:** `docs/prds/gcc-nationalisation-compliance-v44-prd.md`  
**Discovery brief:** `design/gcc-nationalisation-compliance-v44-discovery-brief.md`  
**Copy review:** `design/gcc-nationalisation-compliance-v44-copy.md`  
**Figma:** https://www.figma.com/design/qkADHsPk2gSgDN18i3IQx6  
**Mission:** GCC-E2E-005 Step 8  
**Status:** Draft — **Jira epic is created in 430** after story map approval (420 HITL).

## Epic summary (for Jira Summary field)

Out-of-the-box GCC nationalisation and workforce compliance for Recruiting (KSA, UAE, Kuwait)

## User story

As an HR professional recruiting across **high-regulation GCC** markets  
I want **standard nationality, quota, diversity, and audit dimensions** with **Recruiter Hub dashboards**, **customer-owned targets**, and **evidence-oriented exports** (not spreadsheet rebuilds)  
So that I can **trust in-product views** for daily compliance management, **reduce time to produce audit packs** (pilot target **−50%** vs customer-reported baseline), and **strengthen data integrity** from application through hire

## Jira-ready description

Paste body for Jira epic description (markdown):

**User story**

As an HR professional recruiting across high-regulation GCC markets, I want out-of-the-box nationalisation and workforce compliance in Workday Recruiting (standard dimensions, country packs, dashboards, exports, RBAC, lawful-basis configuration), so that I can evidence quotas and diversity expectations without fragile custom fields and offline Excel or PowerBI, and improve compliance confidence against regional mandates.

**PRD:** `docs/prds/gcc-nationalisation-compliance-v44-prd.md`  
**Discovery brief:** `design/gcc-nationalisation-compliance-v44-discovery-brief.md` (Final Verdict: APPROVED)  
**UX / design:** https://www.figma.com/design/qkADHsPk2gSgDN18i3IQx6  
**Copy review (319):** `design/gcc-nationalisation-compliance-v44-copy.md`

**Scope (in)**

• **Country packs (MVP):** KSA (Nitaqat / Saudisation-oriented metrics and exports), UAE (Emiratisation), Kuwait (Kuwaitisation); **no hard-coded statutory percentages**; **tenant-configurable targets** and effective dates  
• **Standard GCC workforce compliance dimensions:** nationality / citizenship aligned to HCM; **GCC reporting banding** where customer maps values  
• **Application and candidate:** nationality captured where customer enables collection; flows to **candidate** and **worker** on hire with **single definition** (per PRD FR-1, AC-2)  
• **Quota logic and snapshots:** time-stamped snapshots with numerator, denominator, %, gap, definition version (cadence and job mechanics may ship across value slices)  
• **Dashboards:** OOB Recruiter Hub **GCC workforce compliance** experience with KPI cards, filters (e.g. supervisory organisation (LOB), location, period), **Tabs** by enabled pack, exception / completeness **table**  
• **Audit and compliance exports:** pre-built layouts; **immutable export log** (user, role, timestamp, filters, definition version); **no automated government portal submission** in MVP  
• **Security:** RBAC for nationality, PWD, gender aggregates, and exports; **masked** or **hidden** where permission missing (per FR-5, AC-6)  
• **Privacy configuration:** tenant **lawful basis** and **retention** metadata for sensitive fields; **guardrail** before go-live toggle for nationality on application (per AC-7)  
• **Explicit non-scope (MVP):** automatic submission to Qiwa / MOHRE / other portals; **legal interpretation** of Nitaqat tier or sector rules inside product; **AI-inferred** nationality or disability status

**Personas**

• **Primary:** HR Professional (recruiter / TA operations) — daily quota health, exceptions, exports  
• **Secondary:** Talent / HRIS / people analytics lead — definitions, audit exports, Reporting / Prism consumption  
• **Tertiary:** Hiring manager — limited visibility where policy allows (later slices if needed)

**Success metrics (from PRD)**

• **Time to produce audit pack:** pilot target **−50%** vs customer-reported baseline  
• **Dashboard adoption:** % GCC tenants with ≥1 compliance dashboard enabled — **[TBC]%**  
• **Data completeness:** % in-scope records with required nationality for active reqs — **+[TBC] pp**  
• **Support trend:** downward tickets on custom nationality reconciliation  

**Compliance note**

Nationality, **PWD**, and **export disclaimers** are **legal-sensitive**. **319** editorial pass applies to all user-visible strings in **430** stories; **060** validates wording before production GA. Product **does not** provide legal advice; UI remains **neutral** and **non-prescriptive** on statutory rates.

## Notes for story mapping

• **420:** Slice **VS1** as an **end-to-end walking skeleton**: configure packs and targets → capture nationality on candidate → dashboard with filters and table → export with definition version and audit log → RBAC for PWD → lawful-basis guardrail for application nationality  
• **VS2:** **Automation** (scheduled snapshots, scheduled exports), **segregation** of export vs recruiter roles, **data completeness** nudges where appropriate  
• **VS3:** **Enterprise / franchise** roll-up patterns, deeper **Reporting / Prism** hooks, **Egypt PWD** and other **extensions** per PRD country table  
• **430** defaults: project **HRREC**, issue type **Epic** then **Story**, component **Recruiting Purge**, assignee **david.denham**
