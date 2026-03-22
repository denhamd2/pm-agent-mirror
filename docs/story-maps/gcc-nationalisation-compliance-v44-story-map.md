# Story Map: GCC nationalisation and workforce compliance (v44)

**Epic draft:** `docs/epics/gcc-nationalisation-compliance-v44-epic.md`  
**Jira epic:** *(not created until 430 — no key until PM approves value slices below)*  
**PRD:** `docs/prds/gcc-nationalisation-compliance-v44-prd.md`  
**Discovery brief:** `design/gcc-nationalisation-compliance-v44-discovery-brief.md`  
**Copy review:** `design/gcc-nationalisation-compliance-v44-copy.md`  
**Figma:** https://www.figma.com/design/qkADHsPk2gSgDN18i3IQx6  
**Created:** 21 March 2026  
**Author:** Story mapping (420) — GCC-E2E-005 Step 8  
**HITL status:** **Pending PM approval** (no Jira until explicit approval in this mission)

## Epic context

**User story (from epic draft)**

As an HR professional recruiting across **high-regulation GCC** markets  
I want **standard nationality, quota, diversity, and audit dimensions** with **Recruiter Hub dashboards**, **customer-owned targets**, and **evidence-oriented exports**  
So that I can **trust in-product views** for daily compliance management, **reduce time to produce audit packs** (pilot **−50%** vs baseline), and **strengthen data integrity** from application through hire

**Key personas:** HR Professional (recruiter / TA operations); Talent / HRIS / analytics lead; hiring manager (tertiary)  
**Business goals:** Compliance confidence; single definition across Recruiting and HCM; commercial RFP fit vs regional ATS compliance narratives; reduced Excel / PowerBI exit pressure

## User activities (horizontal backbone)

1. **Configure** country packs, targets, lawful basis, and security for sensitive attributes  
2. **Capture** nationality and related attributes on application and candidate (where enabled)  
3. **Monitor** quota health, gaps, and data completeness in Recruiter Hub  
4. **Drill** to exceptions and candidate-level signals within RBAC  
5. **Evidence** audit exports and review export history  
6. **Scale** automation and enterprise reporting consumption (incremental)

## User tasks (vertical slices)

### Activity 1: Configure

- Enable **KSA**, **UAE**, and **Kuwait** packs **independently** with no default cross-leakage → **VS1**  
- Set **customer targets** and **effective dates** (no statutory hard-coding in product) → **VS1**  
- Require **lawful basis** and **retention** configuration before enabling **nationality on application** → **VS1**  
- Configure **RBAC** for nationality, **PWD status**, gender aggregates, and export actions → **VS1**  
- Add **compliance officer** vs **recruiter** segregation patterns for export actions → **VS2**  
- Configure **Egypt PWD** extension and additional **reporting bands** (where customer maps data) → **VS3**  

### Activity 2: Capture

- Persist **nationality** from application onto **candidate** for quota and exports → **VS1**  
- Support **optional PWD** and **gender** fields where customer enables collection → **VS1**  
- Align **nationality / citizenship** reference data with **HCM worker** handoff on hire → **VS2**  

### Activity 3: Monitor

- Show **OOB dashboard** on **Recruiter Hub → Dashboard** with KPI cards per enabled pack → **VS1**  
- Display **snapshot as-of** date and **customer-entered** target context (non-prescriptive) → **VS1**  
- Filter by **supervisory organisation (LOB)**, **location**, and **period** → **VS1**  
- Surface **“What counts”** / definition transparency (info pattern) → **VS2**  

### Activity 4: Drill

- List **candidates in scope** with **nationality**, **stage**, **data completeness** → **VS1**  
- Mask or hide **PWD status** when user lacks view permission → **VS1**  
- Open **Reporting** / **Prism** entry points for enterprise consumers → **VS3**  

### Activity 5: Evidence

- **Export for audit** (CSV / XLSX) with **definition version** and **customer responsibility** disclaimers → **VS1**  
- Write **immutable audit log** entry (user, role, timestamp, filters, definition version) → **VS1**  
- **Schedule** recurring exports with notification → **VS2**  
- Pre-built **country layout** columns for customer **Qiwa / evidence** workflows (manual submission) → **VS2**  

### Activity 6: Scale

- Run **periodic snapshot job** (configurable cadence) storing numerator, denominator, %, gap, definition version → **VS2**  
- Support **multi-entity / franchise-style** roll-up summaries (P3 pain) → **VS3**  
- **Prism / reporting framework** consumption hooks for compliance metrics → **VS3**  

## Value slices

### VS1: Trusted operational evidence path

**Goal:** A recruiter can open **GCC workforce compliance** on **Recruiter Hub**, see **% and gap to customer target** for enabled packs, review **completeness**, and produce an **export** that carries **definition version** and **audit log**, without relying on a one-off custom-field model (pilot anchor for **−50%** time on audit pack assembly).

**Stories:**

1. Enable **KSA / UAE / Kuwait** packs independently with **tenant targets** and **effective dates** — *Configure*  
2. **Lawful basis and retention** guardrail before **nationality on application** go-live — *Configure*  
3. **Nationality** on application **stores on candidate** and feeds quota views — *Capture*  
4. **Optional PWD status** and **gender** capture where customer enables fields — *Capture*  
5. **GCC workforce compliance** dashboard with **KPI cards**, **pack tabs**, and **snapshot context** — *Monitor*  
6. **Filter** dashboard by **supervisory organisation (LOB)**, **location**, and **period** — *Monitor*  
7. **Candidates in scope** table with **nationality**, **completeness**, and **RBAC** for **PWD status** — *Drill*  
8. **Export for audit** with **definition version**, **disclaimers**, **download export**, and **audit log** entry — *Evidence*

**Total stories:** 8

### VS2: Automation and operating rigour

**Goal:** Reduce manual refresh and month-end friction through **scheduled snapshots** and **scheduled exports**, while tightening **role segregation** for compliance officers (target: measurable uplift in **data completeness** and fewer ad hoc rebuilds — align PRD **[+TBC] pp** with pilot instrumentation).

**Stories:**

1. **Periodic quota snapshots** job (configurable cadence) with versioned definitions — *Scale*  
2. **Scheduled compliance exports** with run history surfacing — *Evidence*  
3. **Export role segregation** (compliance officer vs recruiter) for sensitive bundles — *Configure*  
4. **Definition transparency** pattern (“What counts”) linked from dashboard — *Monitor*  
5. **Country-specific export layouts** refined for **KSA / UAE / Kuwait** customer workflows — *Evidence*  

**Total stories:** 5

### VS3: Enterprise analytics and extensions

**Goal:** Improve **franchise / joint-venture** and **central analytics** fit (P3) via **roll-up** views and **Reporting / Prism** alignment, plus **extension** packs (e.g. **Egypt PWD**) without bloating VS1.

**Stories:**

1. **Multi-entity / LOB roll-up** summaries for distributed GCC structures — *Scale*  
2. **Prism / reporting framework** hooks for compliance metrics — *Scale*  
3. **HCM handoff** hardening: **nationality / citizenship** consistency at hire — *Capture*  
4. **Egypt PWD** and additional **band mapping** extensions (customer-configured) — *Configure*  
5. **Open in Reporting** (or equivalent) enterprise entry consistency — *Drill*  

**Total stories:** 5

## Story map visualisation

```
Configure        Capture          Monitor           Drill             Evidence          Scale
---------        -------          -------           -----             --------          -----
Packs (VS1)      Nationality (VS1) Dashboard (VS1)  Table (VS1)      Export (VS1)     Snapshots (VS2)
Guardrail (VS1)  PWD/Gender (VS1) Filters (VS1)      RBAC PWD (VS1)   Audit log (VS1)  Sched export (VS2)
RBAC (VS1)       HCM hire (VS3)   What counts (VS2) Reporting (VS3)  Layouts (VS2)    Roll-up (VS3)
Segregation (VS2)                 Prism hooks (VS3)                  Franchise (VS3)  Prism (VS3)
Extensions (VS3)
```

## Summary

**Total activities:** 6  
**Total tasks (rows in vertical slices):** 18 mapped items (some rolled into stories above)  
**Value slices:** 3  
**VS1 stories:** 8  
**VS2 stories:** 5  
**VS3 stories:** 5  
**Total stories:** 18  

## Copy and legal handoff (for 430)

• Mirror **319**-approved strings from `design/gcc-nationalisation-compliance-v44-copy.md` in Jira **Description**, **AC**, and **BDD** (e.g. **PWD status**, **Download export**, **and** not **&** in key labels, British **Saudisation** in UI).  
• **060** review required for **export modal disclaimer**, **definition version** line, **post-download toast**, **dashboard subtitle** on customer targets, and **PWD / gender** aggregate framing before GA.
