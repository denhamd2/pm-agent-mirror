# Story Map: GCC Nationalization & Compliance (MISSION-016 / PMF v39)

**Epic:** [HRREC-90967](https://jira2.workday.com/browse/HRREC-90967) — GCC Nationalization & Compliance — PMF v39 (E2E #1)  
**PRD:** docs/prds/gcc-nationalization-compliance-prd.md  
**Research:** research/GCC/thematic-analysis/2026-03-20-GCC-PMF-Analysis-v39.md  
**Prototype:** design/gcc-nationalization-compliance.tsx (`http://localhost:5199/`)  
**Prior epic (reference only):** [HRREC-90883](https://jira2.workday.com/browse/HRREC-90883)  
**Created:** 20 March 2026  
**Author:** Story Mapping (420) — **awaiting PM HITL before Jira story creation**

---

## Epic (user story format)

**As a** GCC recruiter  
**I want** OOB nationalization tracking (Nitaqat, Emiratisation, Kuwaitisation) at application and compliance dashboards  
**So that** I can meet regulatory quotas without custom fields and manual reporting workarounds  

---

## User activities (horizontal backbone)

1. **Capture nationality** (candidate application — GCC reqs)  
2. **View compliance** (dashboard — compliance lead / recruiter)  
3. **Export reports** (government / audit)  
4. **Configure programmes** (tenant admin — thresholds, country enablement)  

---

## User tasks → value slices

### Activity 1: Capture nationality
- Primary Nationality required on Saudi reqs → **VS1**  
- Primary Nationality required on UAE reqs → **VS1**  
- Primary Nationality required on Kuwait reqs → **VS1**  
- Admin enables OOB GCC fields without custom config → **VS1**  

### Activity 2: View compliance
- Overview: % vs threshold by country with status → **VS2**  
- Drill-down by supervisory organisation → **VS2**  
- Pipeline / req-level nationalisation signal for recruiters → **VS2**  

### Activity 3: Export reports
- Nitaqat quarterly (Saudi) export → **VS3**  
- Emiratisation report (UAE) export → **VS3**  
- Kuwaitisation report (Kuwait) export → **VS3**  

### Activity 4: Configure programmes
- Per-country enable (Saudi, UAE, Kuwait) → **VS4**  
- Thresholds by country/sector → **VS4**  
- Align with Maintain Localization Settings → **VS4**  

---

## Value slices

### VS1: Data capture foundation
**Goal:** Eliminate custom nationality fields for GCC application flows; nationality captured OOB for KSA/UAE/Kuwait reqs.

**Stories (4):**
1. Saudi requisition — Primary Nationality required at apply  
2. UAE requisition — Primary Nationality required at apply  
3. Kuwait requisition — Primary Nationality required at apply  
4. Admin — enable OOB GCC nationalisation without custom fields  

### VS2: Compliance visibility
**Goal:** Compliance lead assesses portfolio status in minutes vs hours in PowerBI.

**Stories (3):**
5. Dashboard — nationalisation % vs thresholds by country  
6. Drill-down — by supervisory organisation with status  
7. Recruiter — pipeline / req view vs target (Emiratisation-style)  

### VS3: Government-ready reporting
**Goal:** Cut submission prep from days to hours with standard exports.

**Stories (3):**
8. Nitaqat quarterly report — Saudi  
9. Emiratisation report — UAE  
10. Kuwaitisation report — Kuwait  

### VS4: Configuration
**Goal:** Cut implementation effort vs bespoke custom fields (~80h → ~48h target in PRD).

**Stories (3):**
11. Tenant toggles per GCC country  
12. Configurable thresholds by sector/programme  
13. Integration with Maintain Localization Settings / Primary Nationality  

---

## Summary

| Metric | Count |
|--------|------|
| Activities | 4 |
| Stories | 13 |
| Value slices | 4 |

---

## Story map visualization

```
Capture     View           Export         Configure
nat.        compliance     reports        
--------    -----------    -----------    -----------
VS1 x4      VS2 x3         VS3 x3         VS4 x3
```

**Note:** Jira story keys are **not** created until you approve this map and 430 runs. (HRREC-90884–90896 on the older epic are reference implementation only.)
