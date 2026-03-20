# Recruiter flow reference screenshots

Authoritative chrome references for **Workday Recruiting** prototype shells. Use with agent **315** (discovery) to pick a **shell pattern** and with **320** to align layout, tokens, and density.

## Shell patterns (brief vocabulary)

| Pattern | Description |
|--------|-------------|
| **A** | Global chrome only: W logo, pill search, bell + inbox badge + avatar |
| **A+** | A plus Recruiter Hub white sidebar (Overview / Job Requisitions / Candidates / Dashboard) with active pill + collapse affordance |
| **B** | Candidate profile: A + blue candidate column + two-column cards + right utility rail (see also `design/gcc-whatsapp-integration.tsx` for a built example) |
| **C** | Modal task: dimmed backdrop + large modal; top nav visible behind |
| **D** | Dense workspace: A+ plus tabs, filters, table, bottom action bar |

Pick **one primary** pattern per feature; optionally a **secondary** (e.g. lands on list **A+**, opens panel **B**).

## Manifest

| File | Workday screen | Shell pattern | 315 use when… | 320 notes |
|------|----------------|---------------|----------------|-----------|
| `My_Candidates_-_Recruiter-91261671-82cc-4369-8d5a-7429a8b3389d.png` | My Candidates (list) | A+ | Feature lives on recruiter-owned candidate lists; need hub nav + list chrome | Left filter accordion; floating **Compare** / **Add To Pool** bar; match pill search and top utilities |
| `Recruiter_Hub_-_Overview_for_a_Recruiter-8fd60518-d750-4f1f-bf9a-ba06cc21aa3a.png` | Recruiter Hub overview | A+ | Landing / dashboard-style hub entry with sidebar | Cards and **My Tasks** strip; sidebar active state on Overview |
| `Find_Candidates_-_Recruiter-fa9cffaf-588b-418c-a1e7-a3c183802f8e.png` | Find Candidates | A+ | Sourcing / search across candidates | Filter stack left; results list; top search is global pill |
| `Recruiter_Hub_-_Candidates_for_a_Recruiter-844edbb8-6220-4780-9e42-563f45f90c1c.png` | Candidates (table) | D | Table-heavy workspace, requisitions context | Tabs, filters, **Table** density, bottom bar actions |
| `Creat_Job_Application_-_Recruiter-eb5ce0ed-99c8-4152-bc9e-ec008568c778.png` | Create Job Application (modal) | C | Task completion in a modal over hub | Modal width, stepped content, backdrop; keep top nav visible behind |
| `Recruiter_Hub_-_Job_Requisitions_for_a_Recruiter-27577aa4-ff6f-4f3f-8f5b-ab733695a8ab.png` | Job Requisitions | D | Req workspace / pipeline lists | Table + filters + tabs; align with dense workspace pattern |
| `Recruiter_Hub_-_Dashboard_for_a_Recruiter-82f2a81d-0123-45a7-97f0-34378e0913e7.png` | Recruiter Hub dashboard | A+ | Metrics / charts on hub | Donut chart cards, KPI tiles; sidebar **Dashboard** active |

## Communication prototypes

For **email, SMS, WhatsApp, LINE** (or similar), combine **pattern B** (or A+ list opening B) with shared layout from `design/components/CommunicationDock.tsx` and top chrome from `design/components/WorkdayTopNav.tsx` rather than re-drawing the rail and sheet.
