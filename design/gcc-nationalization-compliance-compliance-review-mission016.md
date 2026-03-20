# Compliance review (060-style): GCC Nationalization Dashboard — MISSION-016

**Date:** 20 March 2026  
**Surface:** `design/gcc-nationalization-compliance.tsx` (tooltips, export messaging)  

## Applicable regulations

- **GDPR / UK GDPR:** Nationality is personal data; lawful basis and transparency on **application** flow (not fully shown in this prototype).
- **UAE PDPL, Saudi PDPL, Kuwait:** Consent and notice for collection; purpose limitation for reporting.
- **EU AI Act:** Not applicable to this dashboard-only slice (no automated decisioning in prototype).

## Checklist

- [x] **Tooltips:** Educational, not legal advice; align with product legal before GA.
- [x] **Export success string:** References *government submission* — ensure local marketing/legal approve wording per market.
- [ ] **Access control:** Prototype does not model RBAC—PRD must require restricted roles for nationality aggregates.

## Risk level

**Medium** (sensitive category data in production; prototype is mock data).

## Recommended actions

1. Have **legal** validate tooltip copy for KSA/UAE/Kuwait.
2. Ensure **candidate-facing** privacy notice is designed when application capture ships (VS1).
