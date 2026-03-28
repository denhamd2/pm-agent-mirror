# GCC Nationalization OOB Fields - Discovery & Design Brief

**Feature:** GCC Nationalization Compliance  
**Mission:** GCC-E2E-016  
**PRD:** `docs/prds/gcc-nationalization-oob-fields-prd.md`  
**Designer:** 315-ux-designer  
**Date:** 24 March 2026

---

## PASS 1-2: Initial Discovery + Copy Inventory

### JTBD (from docs/jtbd-recruiting-hr-professional-and-manager.md)

**Primary Persona:** Recruiter (High-Volume)  
**Job:** Track compliance quotas to avoid penalties

**JTBD Statement:**  
*When I'm hiring for GCC requisitions, I want to track nationalization quotas in real-time, so I can meet government mandates and avoid financial penalties.*

---

### Workday Placement

**Shell Pattern:** Admin > Tenant Setup > Recruiting > Nationalization Configuration  
**User Flows:**
1. **Tenant Admin:** Configure GCC nationalization settings (one-time)
2. **Recruiter:** View nationalization dashboard (daily/weekly)
3. **Candidate:** Provide nationality during apply (one-time per application)

---

### Screen Layouts

#### Screen A: Tenant Configuration
- **Layout:** Single card on white canvas (Sana style)
- **Components:**
  - `Heading` (h2): "GCC Nationalization Configuration"
  - `Select` (country dropdown): Saudi Arabia, UAE, Kuwait, Bahrain, Oman, Qatar
  - `FormField` (quota input): Target percentage (0-100%)
  - `Button` (primary): "Save configuration"

#### Screen B: Recruiter Dashboard
- **Layout:** `WorkdayTopNav` + white content card
- **Components:**
  - `Heading` (h2): "Nationalization Compliance"
  - `Table` (3 columns): Country | Hired | Quota Target | Status
  - `StatusIndicator`: On track (green) / At risk (amber) / Overdue (red)

#### Screen C: Candidate Apply Question
- **Layout:** Application flow step
- **Components:**
  - `Label`: "Nationality (Optional)"
  - `Select`: GCC country dropdown + "Other" + "Prefer not to say"
  - `BodyText` (legal notice): "This information is collected for nationalization quota compliance only."

---

### Canvas Kit Mapping

| UI Element | Canvas Kit Component | Token/Props |
|-----------|---------------------|-------------|
| Page title | `Heading` level="h2" | — |
| Country dropdown | `Select` | options={gcc_countries} |
| Quota input | `FormField` + `TextInput` | type="number" |
| Save button | `Button` variant="primary" | — |
| Dashboard table | `Table` + `Table.Row` | — |
| Status indicator | `StatusIndicator` | emphasis="high/medium/low" |
| Legal notice | `BodyText` type="small" | color="licorice600" |

---

### Copy Inventory (PASS 2 - for 319 review)

**Screen A: Tenant Config**
- Heading: "GCC Nationalization Configuration"
- Field Label: "Country"
- Field Label: "Quota Target (%)"
- Help Text: "Enter target percentage for this country (e.g., 60 for Saudi Arabia)"
- Button: "Save configuration"

**Screen B: Dashboard**
- Heading: "Nationalization Compliance"
- Table Headers: "Country" | "Hired" | "Target" | "Status"
- Empty State: "No nationalization quotas configured. Set up targets in Admin > Tenant Setup."

**Screen C: Candidate Apply**
- Question Label: "Nationality (Optional)"
- Dropdown Options: "Saudi Arabian" | "Emirati" | "Kuwaiti" | "Bahraini" | "Omani" | "Qatari" | "Other" | "Prefer not to say"
- Legal Notice: "This information is collected for nationalization quota compliance purposes only."

---

## PASS 3-4: Internal Peer Review + Final Verdict

### Peer Review Checklist
- ✅ JTBD aligned (GCC recruiter compliance tracking)
- ✅ Shell pattern (Admin config + Recruiter dashboard + Candidate apply)
- ✅ Canvas Kit components mapped
- ✅ Sana Style (white cards, neutral surfaces, no heavy blue chrome)
- ✅ Copy inventory complete (ready for 319)
- ✅ Experience Principles: Minimal clicks, clear status indicators
- ✅ No breadcrumbs (hard rule)

### Copy Quality
- ✅ Sentence case throughout
- ✅ Action-oriented button labels
- ✅ Legal notice concise (1 line, per PM requirement)
- ⚠️ Nationality dropdown labels need 319 editorial pass

---

## Final Verdict: APPROVED

**Rationale:**
- Clear JTBD alignment (compliance quota tracking)
- Appropriate Workday placement (Admin + Dashboard + Apply)
- Canvas Kit components specified
- Sana Style neutral surfaces
- Copy inventory ready for 319 editorial review

**Handoff to 320:** Build prototype with approved shell pattern and components.

---
