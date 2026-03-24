# GCC Nationalization OOB Fields - PRD

**Feature:** Nationalization & Workforce Compliance (GCC)  
**Mission:** GCC-E2E-016  
**PM:** David Denham  
**Date:** 24 March 2026  
**Status:** Draft

---

## Executive Summary

**Problem:** GCC customers face mandatory nationalization compliance (Saudization, Emiratization, Kuwaitization) with financial penalties. Current Workday requires custom field workarounds, creating implementation tax and manual reporting burden.

**Solution:** Native GCC nationalization fields (6 countries), quota tracking, and compliance dashboards - modeled after US/UK ethnicity solution.

**Why Now:** Workday is expanding Recruiting in the GCC region. Native compliance features reduce implementation friction and differentiate against regional competitors.

**Impact:** 75% reduction in setup time (8-12 weeks → 1-2 weeks); 95% nationality data capture; real-time compliance dashboards.

---

## Problem Statement

GCC customers (Saudi Arabia, UAE, Kuwait, Bahrain, Oman, Qatar) face mandatory nationalization compliance requirements with financial penalties for non-compliance:
- **Saudi Arabia:** Nitaqat (60% Saudization targets)
- **UAE:** Emiratization (20% targets)
- **Kuwait:** Kuwaitization (50% targets)

Current Workday Recruiting requires **custom field workarounds** to track nationality data, quota progress, and generate compliance reports. This creates:
- Implementation tax (8-12 weeks custom configuration)
- Inconsistent data quality (~60-70% capture rates)
- Manual reporting burden (Excel/PowerBI exports)

**Customer Evidence:**
- P1 (Accenture): "20% Emiratization, 60% Saudization, 50% Kuwaitization on my hiring... we get penalties"
- P2 (Baker Hughes): "Out of the box solution is only for US and UK... if we have more out of the box solution that would be helpful"

Customers cite Workday's **native US/UK ethnicity solution** as the model they want for GCC nationalization.

---

## Success Criteria

1. **Implementation Efficiency:** Reduce GCC nationalization setup from 8-12 weeks (custom) to 1-2 weeks (OOB) - **75% reduction**
2. **Data Quality:** Achieve **95%+ nationality data capture** at application (vs current ~60-70%)
3. **Compliance Reporting:** Enable **real-time nationalization dashboards** for 100% of GCC customers (vs manual exports)

---

## Scope

### In Scope (v1)
- Nationality fields for **6 GCC countries** (Saudi, UAE, Kuwait, Bahrain, Oman, Qatar)
- Application-time nationality capture (candidate self-service)
- Quota tracking per country (configurable targets by LOB/location)
- Standard nationalization dashboard (hired vs quota)
- Nationalization reporting exports

### Out of Scope (v1)
- Government portal integrations (Qiwa, Mudad, MOHRE) - separate initiative
- Real-time penalty calculations - customers manage externally
- Other region nationalization (Malaysia, South Africa) - future expansion
- Historical data migration tools - customer implementation

---

## User Stories

**As a** GCC Recruiter  
**I want to** track nationality quotas in real-time  
**So that** I avoid compliance penalties and meet government mandates

**As a** Candidate applying in GCC  
**I want to** provide my nationality during application  
**So that** my application is considered for nationalization quotas

**As a** GCC Recruiting Leader  
**I want to** view nationalization compliance dashboards  
**So that** I can forecast hiring needs and avoid penalties

---

## Functional Requirements

### 1. Nationality Field Configuration
- **GCC Nationality Selector:** Dropdown with 6 GCC countries + "Other" + "Prefer not to say"
- **Application Question:** Configurable per requisition (required/optional)
- **Legal Notice:** 1-2 line compliance text (e.g., "This information is collected for nationalization quota compliance purposes only")

### 2. Quota Management
- **Tenant-Level Config:** Set nationalization targets by country (e.g., 60% Saudi, 20% UAE)
- **LOB/Location Override:** Allow business-unit specific targets
- **Tracking:** Real-time hired vs target calculation

### 3. Nationalization Dashboard
- **Metrics:** Hired count, quota target, % to goal, by country
- **Filters:** Time period, LOB, location, requisition type
- **Export:** CSV/Excel for government reporting

### 4. Reporting
- **Standard Report:** Nationalization compliance by country/LOB
- **Data Source:** Candidate nationality + hire date + requisition metadata

---

## Non-Functional Requirements

### Compliance & Legal
- **Data Privacy:** Nationality data = sensitive; GDPR/PDPL compliant storage
- **Legal Notice (UI):** Display 1-2 line compliance text during application (per PM requirement)
- **Audit Trail:** Track nationality data changes

### Localization
- **Languages:** English + Arabic UI for GCC
- **RTL Support:** Arabic text direction for nationalization fields

### Performance
- **Dashboard Load:** <2s for 10,000 requisition dataset
- **Report Generation:** <5s for annual compliance report

---

## Design Principles

1. **Mirror US Ethnicity Model:** Reuse proven UX patterns from existing solution
2. **Compliance-First:** Legal notices, audit trail, data privacy by design
3. **Configurable:** Tenant/LOB level flexibility for diverse GCC requirements

---

## Dependencies

- **Deployment Agent:** Validate GCC data model for nationality storage
- **Legal (060):** Review legal notice wording for prototype and production
- **Localization Team:** Arabic translation + RTL support

---

## Competitive Intelligence (from 101)

**Gap Classification:**
- **Workday Current:** Workaround (custom fields, manual reporting)
- **Workday Proposed:** Native (OOB fields, dashboards)
- **Competitors:** Regional vendors (Bayzat, ZenHR) position "built-in" GCC compliance

**Differentiation:** Native solution reduces implementation tax vs custom approaches; matches US/UK ethnicity model customers already trust.

---

## Open Questions

1. Historical data migration approach? (Answer: Out of scope v1; customer implementation)
2. Penalty calculation logic? (Answer: Out of scope; customers manage externally)
3. Malaysia/South Africa nationalization? (Answer: Future expansion, GCC v1 focus)

---

**Next Steps:**
- 080 Red Team review
- 315 Discovery & Design
- 320 Prototype (with legal notice per PM)
- 330 Figma capture
- 400 Backlog refinement
