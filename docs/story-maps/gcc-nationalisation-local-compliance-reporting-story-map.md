# Story Map: GCC nationalisation and local workforce compliance reporting

**Epic draft:** `docs/epics/gcc-nationalisation-local-compliance-reporting-epic-draft.md`  
**Jira epic:** [HRREC-91122](https://jira2.workday.com/browse/HRREC-91122)  
**PRD:** `docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md`  
**Figma:** `https://www.figma.com/design/31oiDR6ciYEsk0aJp89Y0S`  
**Created:** 27 March 2026  
**Last revised:** 27 March 2026 (Red Team story map pre-flight — 1 revision pass)  
**Author:** AI Story Mapping Specialist

## Epic context

**Epic summary:** GCC nationalisation and local workforce compliance reporting (Recruiting-sourced packs)

**User story:**  
As an HR professional (Recruiting) operating in the GCC, I want audit-oriented nationalisation and local workforce compliance reporting built on reference dimensions, standard report packs, and dashboards with clear data lineage, so that I can produce defensible evidence for standard Recruiting-only audit scenarios with less manual rebuild in spreadsheets.

**Key personas:** GCC recruiter / recruiting operations; TA leadership; implementation and value consulting  
**Business goals:** Reduce time on compliance reporting (PM target vs frozen baseline); eliminate Excel for standard in-scope audits where the pack applies; honest parity with 101/DA26 positioning; no v1 portal API scope

## Cross-cutting constraints (Red Team dependency and scope)

Apply to **VS1** implementation and acceptance criteria unless explicitly deferred:

• **HCM alignment:** A named **sign-off artefact** (e.g. workbook or recorded decision) is required that aligns **Recruiting reference dimensions** with **HCM-authoritative fields** so Recruiting does not silently duplicate Worker truth.  
• **Reporting platform ownership:** Stories that touch **catalogue, run, export, or dashboard** must name **owning platform** (Recruiting vs HRIS / central reporting) and integration expectations; avoid orphan UI on undefined execution path.  
• **Candidate PII and security domains:** New surfaces must document **security domain** behaviour for **candidate personal information** (access, masking, segregation) alongside role behaviour.  
• **VS1 metrics scope:** **VS1** dashboard and programme report **metrics stay on Recruiting objects only** — **no implicit Worker joins** or HCM-derived roll-ups in v1 unless covered by the HCM sign-off artefact and a dedicated story.

## User activities (horizontal backbone)

1. Align dimensions and configure programme groupings  
2. Map legacy data, validate coverage, and remediate gaps  
3. Discover standard reports and consume dashboards  
4. Produce evidence on demand  
5. Review roll-up views for leadership  
6. Enable services, GTM alignment, and operational governance (non-API)

## User tasks (vertical slices)

### Activity 1: Align dimensions and configure programme groupings

- Produce HCM–Recruiting reference dimension alignment sign-off artefact → **VS1**  
- Enable UAE, KSA, and Kuwait programme configuration for nationalisation reporting (reference dimensions do not duplicate Worker-authoritative fields) → **VS1**  
- Define security and access model for new compliance surfaces (roles, domain behaviour, candidate PII) → **VS1**  

### Activity 2: Map legacy data, validate coverage, and remediate gaps

- Configure mapping from legacy custom fields to reference dimensions → **VS1**  
- Run validation report and surface data gaps or inconsistencies → **VS1**  
- Remediate or route mapping gaps (workflow or guidance; in-product or documented path per PRD) → **VS1**  

### Activity 3: Discover standard reports and consume dashboards

- Surface browseable catalogue of standard programme report definitions (Recruiting shell; **reporting platform ownership** stated in AC) → **VS1**  
- Render compliance dashboard for a programme slice with explicit **data source**, **refresh model**, and platform ownership → **VS1**  

### Activity 4: Produce evidence on demand

- Run a standard programme report manually and view in-product results → **VS1**  
  - **NFR AC (embed in story):** acceptable run duration / timeout behaviour; degraded or partial-result messaging where applicable  
- Export results when required and capture run metadata (runner, timestamp, definition version) → **VS1**  
  - **NFR AC (embed in story):** export size limits, concurrent runs, load behaviour  
- Establish **NFR and scale acceptance** for programme report run and export (limits, load, timeouts) as testable backlog criteria → **VS1**  
- Show transparency copy (non-authoritative government interpretation; customer-configured metrics) → **VS1**  

### Activity 5: Review roll-up views for leadership

- Apply line-of-business and location **filter model** to compliance dashboard within product rules → **VS2**  
- Execute **security test matrix** for LOB/location filters (role, domain, candidate PII boundaries) → **VS2**  
- Share evidence pack narrative for stakeholders (in-product only; no new portal) → **VS2**  

### Activity 6: Enable services, GTM alignment, and operational governance (non-API)

- Publish PS migration guidance for mapping custom fields to reference dimensions (artefact or in-product help per PRD) → **VS3**  
- Ensure internal parity positioning hooks do not contradict appendix allowlist → **VS3**  
- Operational and release **governance** for **definition version**, **catalogue updates**, and customer-visible change cadence → **VS3**  

## Value slices

### VS1: Evidence pack (Recruiting-only walking skeleton)

**Goal:** Complete one Recruiting-only, in-scope audit path: **HCM-aligned dimensions** → **security model** → configure → map → validate → remediate → **catalogue** → **dashboard (source + refresh)** → **run** → **export** → **NFR/scale criteria** → transparency copy, suitable for **319**/**060** review. **Metrics in VS1 use Recruiting objects only** (no implicit Worker joins).

**Stories:**

1. Produce HCM–Recruiting reference dimension alignment sign-off artefact — *Activity 1*  
2. Enable GCC programme configuration for nationalisation reporting dimensions (reference dimensions do not duplicate Worker-authoritative fields) — *Activity 1*  
3. Define security and access model for compliance surfaces (roles, domains, candidate PII) — *Activity 1*  
4. Configure mapping from legacy custom fields to reference dimensions — *Activity 2*  
5. Run validation report and surface data gaps or inconsistencies — *Activity 2*  
6. Remediate or route mapping gaps per PRD — *Activity 2*  
7. Browse standard compliance report catalogue (platform ownership in AC) — *Activity 3*  
8. View compliance dashboard with defined data source and refresh model (platform ownership in AC) — *Activity 3*  
9. Run standard programme report on demand and view in-product results — *Activity 4* (include **NFR AC:** performance / timeouts)  
10. Export report results with run metadata — *Activity 4* (include **NFR AC:** limits / load behaviour)  
11. Establish NFR and scale acceptance for programme report run and export — *Activity 4*  
12. Display transparency and legal-adjacent disclaimers for compliance reporting — *Activity 4*  

**Total stories:** 12  

### VS2: Leadership and operational efficiency

**Goal:** Recruiting and TA leadership can roll up compliance views by LOB and location with **explicit filter semantics** and a **documented security test matrix**; evidence handoff stays in-product.

**Stories:**

1. Apply LOB and location filter model to compliance dashboard — *Activity 5*  
2. Security test matrix for LOB/location filters (roles, domains, candidate PII) — *Activity 5*  
3. Prepare stakeholder summary view of compliance evidence (in-product) — *Activity 5*  

**Total stories:** 3  

### VS3: Services enablement, GTM-safe positioning, and catalogue governance

**Goal:** PS and field teams can onboard tenants with documented mapping patterns; **GTM** language stays within PRD appendix and DA25/DA26 triangulation; **definition version and catalogue updates** are operationally governed.

**Stories:**

1. Ship PS migration playbook and mapping guidance (linked from product or docs per PRD) — *Activity 6*  
2. Align in-product GTM helper copy with Appendix allowlist (no scope bleed) — *Activity 6*  
3. Operational and release governance for definition version and catalogue updates — *Activity 6*  

**Total stories:** 3  

## Story map visualization

```
Backbone →     [1] Align / configure    [2] Map / validate / remediate    [3] Discover    [4] Produce evidence    [5] Leadership    [6] Ops / GTM
               ---------------------    ------------------------------    ------------    --------------------    --------------    ---------------
VS1 stories         3                        3                              2                  4                   —                  —
VS2 / VS3           —                        —                              —                  —                VS2: 3            VS3: 3
```

## Summary

| Metric | Count |
|--------|------|
| Total activities | 6 |
| Total tasks / stories | 18 |
| Value slices | 3 |
| VS1 stories | 12 |
| VS2 stories | 3 |
| VS3 stories | 3 |

## Functional knowledge note

Reporting and purge-adjacent patterns in Workday often rely on **custom reports** and security domains; this epic elevates **reference dimensions** and **catalogued packs** per PRD. Detailed field names belong in design and implementation.

**Red Team carry-over:** Implementation backlog should trace **HCM sign-off**, **reporting platform owner**, **candidate PII domain rules**, and **Recruiting-only VS1 metrics** from the **Cross-cutting constraints** section into epic or story **Description / AC** so **430** does not drop them at Jira create.
