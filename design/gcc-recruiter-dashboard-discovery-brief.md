# Discovery & Design Brief: GCC Recruiter Operations Dashboard

**PRD:** `docs/prds/gcc-recruiter-dashboard-prd.md`  
**Created:** 20 March 2026  
**Agent:** 315-prototype-discovery-and-design  
**Mission:** GCC-E2E-002 — v41 HITL **#7**

---

## Executive summary

The capability lands as a **Recruiting Hub** destination: **Recruiting → Dashboard** (or equivalent hub label), giving recruiters **in-product operational metrics** without exporting to PowerBI for every stand-up. The prototype uses **pattern B** (overview with cards + tables), **Sana** neutrals, **`WorkdayTopNav`** + **`WorkdayLeftTabBar`**, with **filter-then-scan** layout (#5) and **headline hierarchy** (#6) per the UX Design Framework.

---

## Jobs to be done (worksheet-aligned)

**Source:** `docs/jtbd-recruiting-hr-professional-and-manager.md`

### Recruiter (HR Professional)

- **Synthesised JTBD:** *When I am running daily hiring across many reqs, I want to see pipeline health and where time is lost, so I can prioritise reviews and escalations without rebuilding spreadsheets.*

### Prototype implications

- **Filters first** (LOB, location, level) — supports recognition over recall (#19).  
- **KPI tiles** answer “how are we doing?” in under 10 seconds.  
- **Tables** show stage and LOB breakdown — progressive detail (#11).

---

## Placement decision

- **Primary:** **Recruiting Hub** — top-level **Dashboard** (or **Operating metrics**) tab alongside Overview / Job requisitions / Candidates patterns.  
- **Entry:** Global nav → Recruiting → **Dashboard**.  
- **Alternatives considered:** Embedding only inside each req — rejected: managers need cross-req view; research explicitly asked for “all my roles” dashboard.

---

## Visual shell & references

- **Primary shell pattern:** **B** (overview: cards + structured tables; not dense Pattern D grid).  
- **References:** `design/references/recruiter-flow/README.md`; Sana `design/references/sana/README.md`.  
- **CommunicationDock:** **No**.

---

## Canvas Kit Component Mapping (Verified)

- **Buttons:** `PrimaryButton`, `SecondaryButton`  
- **Layout:** `Flex`, `Box`, `Card`  
- **Forms:** `FormField`, `Select`  
- **Display:** `Table`, `Banner`, `BodyText`, `Heading`  
- **Tokens:** `colors.*`, `space.*`; theme from `sanaShellTheme` / page canvas  

---

## Reusable layout components (for 320)

### WorkdayTopNav

- **Use:** Yes  

```tsx
<WorkdayTopNav notificationBadge={2} inboxBadge={4} showWMark />
```

### WorkdayLeftTabBar

- **Use:** Yes — Hub tabs: Overview | **Dashboard** | Job requisitions | Candidates  

```tsx
<WorkdayLeftTabBar
  secondaryTitle="Recruiting — GCC &amp; international"
  secondarySubtitle="Operating metrics · Illustrative data"
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'requisitions', label: 'Job requisitions' },
    { id: 'candidates', label: 'Candidates' },
  ]}
  activeTabId="dashboard"
  onTabChange={(id) => setActiveTab(id)}
/>
```

### CommunicationDock

- **Use:** No  

---

## UX principles applied (framework)

- **#3 Page title and primary nav (no breadcrumbs):** Hub tab + page `Heading` only (no chevron strip).  
- **#5 Filter-then-act:** Filters above KPIs and tables.  
- **#6 Headline hierarchy:** Page `Heading` large; section `Heading` small; KPI labels `BodyText` small.  
- **#7 Whitespace:** `Card` `padding="l"`, `space` tokens between tiles.  
- **#11 Progressive disclosure:** Summary KPIs first; breakdown tables second.  
- **#12 Defaults:** Sensible default filter “All” for prototype.  
- **Step B shell:** Pattern **B**.  
- **Step F Canvas Kit:** `Card`, `Table`, `Select`, `FormField`, `Banner`, `Heading`, `BodyText`.  

---

## Functionality scope (prototype)

1. Hub left nav with **Dashboard** active.  
2. Page title: Recruiter operations dashboard (no breadcrumb strip).  
3. `Banner` — illustrative data + last refreshed.  
4. Filter row: LOB, Location, Management level (`Select`).  
5. Four KPI cards in a row (responsive wrap).  
6. Stage funnel `Table`.  
7. LOB breakdown `Table`.  
8. `SecondaryButton` **Export summary** (non-functional).  
9. Placeholder tabs Overview / Requisitions / Candidates show short stub content when selected (optional — can keep single view for capture).

I'll implement prototype with tab switching for Overview/Dashboard/Requisitions/Candidates for parity with other prototypes.

---

## Out of scope for prototype

Live tenant data, real report engine, scheduling, mobile layout optimisation, full drill-through to req list.

---

## Success criteria for prototype

- [ ] Demonstrates Recruiting Hub placement and **Dashboard** as a first-class tab.  
- [ ] Uses **Canvas Kit** only (plus shared shell components).  
- [ ] Sana-aligned neutrals; no heavy blueberry chrome.  
- [ ] Running on localhost for **330** capture.  

---

*Workday Confidential*
