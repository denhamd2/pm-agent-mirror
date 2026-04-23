# Regional Pipeline Workflows

This document describes the **Regional E2E Pipeline** and its **4 modular workflows** that can be invoked independently or chained together.

## Modular Workflow Invocation

### Workflow 1: PMF Research & Deck
**Scope:** Steps 1-10 (Strategy → PESTEL → SWOT → CI/108/105 in parallel → 106 sequential → PMF Analysis → Deck). Step 11 (HITL Select) only runs when Workflow 1 is chained into E2E.

**Trigger patterns:**
- "Run [region] PMF research"
- "Create [region] PMF deck"
- "[region] strategy and research"

**Mission ID format:** `[REGION-CODE]-PMF-0NN` (e.g., INDIA-PMF-001)

**Stops at:** PMF roadmap deck generation (Step 10). The HITL recommendation chooser (Step 11) is **E2E-only** - skipped for standalone PMF research.

**Handoff:** The @pmf-analyst report still contains the E2E Handoff table with numbered recommendations as a reference artifact. When continuing to Workflow 2 (manually or via E2E), the orchestrator presents the AskQuestion chooser at that point.

---

### Workflow 2: PRD Writing
**Scope:** Steps 12-17 (HITL Select → PM Framing → PRD → Legal Review → Red Team)

**Trigger patterns:**
- "Write PRD for [feature/recommendation]"
- "Create requirements for [feature]"
- "PRD from [PMF analysis path]" (if from Workflow 1)

**Mission ID format:**
- From Workflow 1: Use parent mission ID (e.g., `INDIA-E2E-001` continues)
- Standalone: Create `PRD-0NN` mission

**Entry modes:**
1. **From Workflow 1:** Orchestrator detects PMF analysis path in MISSION_LOG → executes Steps 11-12 (HITL + PM Framing) → then Steps 13-16
2. **Standalone:** User provides feature description → skip Steps 11-12 → execute Steps 13-16 directly → orchestrator asks PM for framing in conversation (not structured HITL)

**Stops at:** Red Team reviewed PRD (Step 15)

**Handoff:** PRD path for Workflow 3 or Workflow 4

---

### Workflow 3: Design & Prototype
**Scope:** Steps 18-24 (Design Brief → Copy Review → Peer Review → Prototype → Visual Review → Copy Spot-Check → Figma)

**Trigger patterns:**
- "Design [feature]"
- "Create prototype for [feature/PRD]"
- "Ground in Workday for [feature]"

**Mission ID format:**
- From Workflow 2: Use parent mission ID
- Standalone: Create `DESIGN-0NN` mission

**Entry modes:**
1. **From Workflow 2:** Uses PRD path from Step 13
2. **From PMF (skip PRD):** Uses PMF analysis + selected recommendation, no PRD
3. **Standalone:** User provides feature description or Figma URL

**Stops at:** Figma capture complete (Step 23)

**Handoff:** PRD path (if exists) + Design Brief path + Prototype path for Workflow 4

---

### Workflow 4: Backlog Refinement
**Scope:** Steps 25-29 (Epic → Story Map → Review → Red Team → Jira)

**Trigger patterns:**
- "Create backlog for [feature]"
- "Story map [feature/PRD]"
- "Break down [PRD] into stories"
- "Refine backlog for [PRD path]"

**Mission ID format:**
- From prior workflows: Use parent mission ID
- Standalone: Create `BACKLOG-0NN` mission

**Entry modes:**
1. **From Workflow 2 (PRD only):** Uses PRD path, no design context
2. **From Workflow 3 (PRD + Design):** Uses PRD + Design Brief paths
3. **Ad hoc:** User provides feature description, 410/420 work with minimal context

**Stops at:** Jira epic and stories created (Step 28)

---

### E2E Express Lane (All Workflows Chained)
**Scope:** Steps 1-29 (all workflows)

**Trigger patterns:** (unchanged)
- "Run [region] e2e"
- "[region] pipeline"
- "Full [region] workflow"

**Executes:** Workflow 1 → Workflow 2 → Workflow 3 → Workflow 4 with automatic handoffs

---

## Cursor 3 Workflow Accelerators

### Cloud Agent Offloading

Long-running research steps can be offloaded to Cloud Agents (cloud VMs) by prefixing a message with `&`. The agent runs autonomously in the cloud and produces demos, screenshots, and logs for verification. Sessions can be moved between local and cloud environments.

**Prime candidates for cloud offloading:**

| Step | Agent | Typical Duration | Cloud Benefit |
|------|-------|-----------------|---------------|
| 2 | @product-strategy-agent (PESTEL) | 30-60 min | Continue working locally while PESTEL research runs |
| 4 | @competitive-intel | 10-20 min | Run competitive scan in background |
| 7 | @ux-researcher (SME) | 15-30 min | Parallel cloud + local work |
| 8 | @ux-researcher (Customer) | 15-30 min | Parallel cloud + local work |

**When to use:** Any step where the PM wants to continue working (e.g., reviewing prior outputs, preparing for HITL decisions) while deep research completes in the cloud.

**Note:** The E2E pipeline's parallel Task invocation pattern (Steps 4, 6, 7, 8 in one response block) already maximises concurrency within a single session. Cloud Agents provide an additional layer: offloading entire research sessions to free up the local environment.

### `/worktree` and `/best-of-n` Commands

**`/worktree`** creates an isolated Git worktree for experimental work. Changes happen in isolation and can be merged or discarded.

**Useful for:**
- Experimental prototype iterations (320) before committing to the main branch
- Testing risky refactors to rules or agent files
- Trying alternative slide spec approaches (110/130)
- Isolated design explorations that may be discarded

**`/best-of-n`** runs the same task in parallel across multiple models, each in its own worktree. Cursor suggests the strongest solution.

**Useful for:**
- Comparing competing prototype layouts (320)
- Comparing PRD draft approaches (200)
- Testing different slide spec formatting strategies (110/130)
- Any task where model choice significantly affects output quality

---

## Mission ID Patterns

| Workflow | Mission ID Format | Example |
|---|---|---|
| PMF Research & Deck | [REGION-CODE]-PMF-0NN | INDIA-PMF-001 |
| PRD (from PMF) | Inherit parent E2E ID | INDIA-E2E-001 (continues) |
| PRD (standalone) | PRD-0NN | PRD-042 |
| Design (from PRD) | Inherit parent ID | INDIA-E2E-001 or PRD-042 |
| Design (standalone) | DESIGN-0NN | DESIGN-018 |
| Backlog (from prior) | Inherit parent ID | INDIA-E2E-001 or PRD-042 |
| Backlog (ad hoc) | BACKLOG-0NN | BACKLOG-005 |
| E2E Express Lane | [REGION-CODE]-E2E-0NN | INDIA-E2E-005 |

---

### Regional E2E Pipeline (@product-strategy-agent → @competitive-intel → 105 → @pmf-analyst → 130 → HITL → 200 → … → 400)

**Trigger (E2E Express Lane - all 4 workflows chained)**: "Run [region] e2e", "e2e [region] research", "[region] e2e to 430", "[region] research all the way to 430", "[region] research to design", "[region] pipeline", "Full [region] workflow", "[region] research e2e" (where [region] = GCC, UK, France, Germany, Japan, India, Canada, Australia)

**For standalone workflow invocation**, see Modular Workflow Invocation section above.

**Supported Regions**: GCC, UK, France, Germany, Japan, India, Canada, Australia

### Subagent Invocation Map

The pipeline invokes these **subagents** at specific steps (subagents delegate to glob rules for actual execution):

| Step | Component | Type | Purpose |
|------|-----------|------|---------|
| 1-3 | **@product-strategy-agent** | Subagent | Strategy Context, PESTEL, SWOT analysis |
| 4 | **@competitive-intel** | Subagent | Regional competitive scan + matrix update |
| 5 | **106** | Glob rule | Customer Ideation Hub Analysis (optional, source-dependent; **sequential, after Steps 7-8**) |
| 6 | **108** | Glob rule | Gap Analysis (optional, source-dependent) |
| 7 | **@ux-researcher** | Subagent | SME Research (delegates to 105) |
| 8 | **@ux-researcher** | Subagent | Customer Research (delegates to 105) |
| 9 | **@pmf-analyst** | Subagent | PMF Thematic Analysis (Braun & Clarke) |
| 10 | **130** | Glob rule | PMF Deck Generation |
| 11 | - | HITL | Select Research Recommendation (**E2E-only**; skipped for standalone Workflow 1) |
| 12 | - | HITL | PM Framing Conversation |
| 13 | **200** | Glob rule | PRD Writing |
| 14 | **060** | Glob rule | Legal Compliance Review (PRD) |
| 15 | - | Internal | PRD Legal Revision |
| 16 | **080** | Glob rule | Red Team Review (PRD) |
| 17 | **315** | Glob rule | Design Brief Creation |
| 18 | **319** | Glob rule | Copy Review (Design Brief) |
| 18a | **@doc-reviewer** | Subagent | Editorial Review (quality gate on 319 Step 18 output; feeds @doc-writer triage-and-apply; 2-cycle cap) |
| 19 | **318** | Glob rule | Design Peer Review |
| 21 | **320** | Glob rule | Prototype Development |
| 22 | **321** | Glob rule | Visual Review |
| 23 | **319** | Glob rule | Copy Review (Prototype) |
| 23a | **@doc-reviewer** | Subagent | Editorial Review (quality gate on 319 Step 23 output; feeds @doc-writer triage-and-apply; 2-cycle cap) |
| 24 | **330** | Glob rule | Figma Capture |
| 25 | **410** | Glob rule | Epic Definition |
| 26 | **420** | Glob rule | Story Mapping |
| 28 | **080** | Glob rule | Red Team Review (Story Map) |
| 29 | **430** | Glob rule | Story Writing + Jira Creation |

**Key Pattern:** Steps 1-4, 7-9 invoke **subagents** for role-based execution with isolated contexts. All other steps invoke **glob rules** directly for efficiency.

**Regional Folder Setup**: Before running E2E for a new region, ensure the folder structure exists. Use `scripts/scaffold-region-research.sh [REGION]` to create standard folders (customer-transcripts, internal-sme-transcripts, brainstorm-sessions, brainstorm-analysis, gap-analysis, thematic-analysis, raw-data). **Gap data** is now in the global `research/gap-data/` folder (shared across all regions); per-region `gap-data/` folders are optional supplements only.

**Region Detection**: Extract region from user prompt. When user says "Run France e2e", set REGION=France and REGION_CODE=fr.

**Region Code Mapping**:
| User Says | REGION | REGION_CODE | Folder | Matrix File |
|---|---|---|---|---|
| GCC / Gulf | GCC | gcc | research/GCC/ | gcc-competitive-matrix.md |
| UK / United Kingdom | UK | uk | research/UK/ | uk-competitive-matrix.md |
| France / French | France | fr | research/France/ | fr-competitive-matrix.md |
| Germany / German | Germany | de | research/Germany/ | de-competitive-matrix.md |
| Japan / Japanese | Japan | jp | research/Japan/ | jp-competitive-matrix.md |
| India / Indian | India | in | research/India/ | in-competitive-matrix.md |
| Canada / Canadian | Canada | ca | research/Canada/ | ca-competitive-matrix.md |
| Australia / Australian | Australia | au | research/Australia/ | au-competitive-matrix.md |

**Substitution Rules**:
- Replace ALL `[REGION]` with detected region name (e.g., "France")
- Replace ALL `[region-code]` with lowercase code (e.g., "fr")
- Replace ALL `[REGION-CODE]` with uppercase code for mission IDs (e.g., "FR" for "FR-E2E-001")
  - **EXCEPTION**: GCC uses "GCC" (all caps) for mission IDs, not "Gcc" or "gcc"
- Special case for GCC: Folder is `research/GCC/` (uppercase), but matrix file is `gcc-competitive-matrix.md` (lowercase)

**If region cannot be parsed**: Default to "GCC" with warning message to user.

**Behavior**: ALWAYS runs **Product Strategy Review (@product-strategy-agent)** → **PESTEL Analysis (@product-strategy-agent)** → **SWOT Analysis (@product-strategy-agent)** → **full [REGION] Competitive Intelligence (@competitive-intel)** in parallel with **optional fresh 108** (if gap data `.csv`/`.xlsx`/`.xls` exports exist) → **105 SME** → **105 Customer** → **optional fresh 106** (if P&T ideation sources exist under `research/brainstorm-sessions/` after **105** outputs exist) → fresh research (**@pmf-analyst**) → **NEW PMF roadmap deck (130)** → HITL → PM Framing → PRD → **060 Legal PRD review** → Red Team PRD → Design Brief → Prototype → Visual Review → Copy → Figma → Backlog. No confirmation needed.

**Flow** (execute sequentially, update MISSION_LOG at each step):

**ALWAYS RUN FRESH:** When this pipeline is triggered, ALWAYS execute **Step 1 (@product-strategy-agent)**, **Step 2 (@product-strategy-agent)**, **Step 3 (@product-strategy-agent)**, **Step 4 (@competitive-intel)**, **Step 7 (105)**, **Step 8 (105)**, **Step 9 (@pmf-analyst)**, and **Step 11 (130)** immediately after creating the mission. When `research/gap-data/` (global) or `research/[REGION]/gap-data/` contains any `.csv`, `.xlsx`, or `.xls` export file, execute **Step 6 (108)** in parallel with Step 4 and **105** where applicable. After **Step 7** and **Step 8** complete and both **`research/[REGION]/105-sme-research-findings.md`** and **`research/[REGION]/105-user-research-findings.md`** exist, when `research/brainstorm-sessions/` contains any `.txt`, `.csv`, `.xlsx`, or `.xls` source file, execute **Step 5 (106)** before **@pmf-analyst**. Do NOT check MISSION_LOG for existing analyses. Do NOT ask the user if they want fresh vs. different recommendation. Every E2E trigger is a fresh run by default.

**FORBIDDEN - E2E Pipeline Shortcuts:**
- Do NOT check MISSION_LOG for in-progress E2E missions and "resume" from a later step
- Do NOT interpret "e2e to 430" or "all the way to the end" as "complete the backlog step only"
- Do NOT skip **Step 1 (@product-strategy-agent)**, **Step 2 (@product-strategy-agent)**, or **Step 3 (@product-strategy-agent)** — every E2E trigger starts with strategy context, PESTEL, and SWOT before research begins
- Do NOT skip **Step 4 (@competitive-intel)** — every E2E trigger starts with a fresh full competitive scan for the specified region before user research begins
- Do NOT skip **Step 7 (105)** or **Step 8 (105)**, **Step 9 (@pmf-analyst)**, or **Step 11 (130)** — every E2E trigger requires fresh **@competitive-intel** scan, optional **106**/**108** when sources exist, fresh **105 SME** findings (Step 7), fresh **105 Customer** findings (Step 8), fresh **@pmf-analyst** analysis, **and** a new PMF roadmap deck
- Do NOT skip **Step 5 (106)** when Steps 7-8 have produced both **105** outputs and `research/brainstorm-sessions/` contains any `.txt`, `.csv`, `.xlsx`, or `.xls` — run **106** **after** **105** and **before** **@pmf-analyst**
- Do NOT skip **Step 6 (108)** when `research/gap-data/` (global) or `research/[REGION]/gap-data/` contains any `.csv`, `.xlsx`, or `.xls` — run **108** before **105** analysis
- Do NOT skip HITL 1 (recommendation selection) - you MUST present AskQuestion and wait
- Do NOT collapse **105** into an implied sub-step of **@pmf-analyst** only: **105 SME** MUST be invoked as **Step 7** and **105 Customer** MUST be invoked as **Step 8** (both with own handoff + MISSION_LOG lines) **before** **@pmf-analyst** starts; **`research/[REGION]/105-sme-research-findings.md`** and **`research/[REGION]/105-user-research-findings.md`** must be **regenerated** from raw SME and customer `transcripts/` respectively with **Fresh pass attestations** per **105-research-planning-analysis.mdc**, not copy-forward without re-reading sources
- Do NOT skip HITL 2 (story map approval) - 400 invokes 410→420→430; 420 MUST present for approval
- **106 (Step 5) MUST run after 105 (Steps 7-8) complete** (sequential); **Steps 4 (@competitive-intel), 6 (108), 7 (105 SME), and 8 (105 Customer)** may run in **parallel** in one response block when each has sources; do **not** run **106** in that parallel block (Cursor 3 async execution)
- "e2e [region] research", "[region] pipeline", "full [region] workflow", "e2e to 430" = FULL pipeline from Step 1

**E2E Pipeline Invariants:**
- HITL 1: Blocked until user selects recommendation. No default, no assume.
- HITL 2: Blocked until user approves story map (via 420's AskQuestion). No pre-existing file = approved.
- **105 SME fresh (Step 7):** Step 7 regenerates **`research/[REGION]/105-sme-research-findings.md`** from **raw SME transcripts** per **105-research-planning-analysis.mdc** with **Fresh pass attestation** — before customer analysis in Step 8; no shortcut from prior SME markdown without re-ingestion.
- **105 Customer fresh (Step 8):** Step 8 regenerates **`research/[REGION]/105-user-research-findings.md`** from **raw customer transcripts only** (SME already analyzed in Step 7) per **105-research-planning-analysis.mdc** with **Fresh pass attestation** — before **106** (if run) and **@pmf-analyst**; no shortcut from prior 105 markdown without re-ingestion.
- **@competitive-intel fresh (Step 4):** Every E2E **@competitive-intel** at pipeline start is **Pattern 1a** (Regional E2E Baseline Scan): new web research, Deployment Agent validation, matrix delta + new `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` — not reuse of a prior scan as the sole CI artefact for this run (see `.cursor/agents/competitive-intel-agent.md`).
- **106 fresh (optional Step 5):** After Steps **7-8**, re-read **105** outputs plus **all** in-scope sources in `research/brainstorm-sessions/` (`.txt`, `.csv`, `.xlsx`, `.xls`), run **`scripts/dump_research_folder_to_text.py`** per **106** when needed, and write a new `brainstorm-analysis` file with **## Fresh pass attestation** — no copy-forward from prior analysis markdown only.
- **108 fresh (optional Step 6):** When Step **6** runs, re-read **all** in-scope sources in `research/gap-data/` (global) plus `research/[REGION]/gap-data/` (if present) (`.csv`, `.xlsx`, `.xls`), run **`scripts/dump_research_folder_to_text.py`** per **108** when needed, and write a new gap analysis file with **## Fresh pass attestation** — no copy-forward from prior analysis markdown only.
- **100-series fresh:** **100**, **@competitive-intel**, **105**, **106**, and **108** must each run **afresh** on every orchestrated or explicit user invocation when that agent’s step executes: re-read primary inputs, regenerate outputs for **this** run. **Forbidden:** satisfying a step by only re-pointing downstream agents at **prior** markdown without that agent’s fresh pass (see **100-market-intelligence.mdc**, `.cursor/agents/competitive-intel-agent.md`, **105-user-researcher.mdc**, **106-brainstorm-analyser.mdc**, **108-tableau-gap-analyser.mdc**).

**E2E Pipeline Step Titles (for Task invocations):**
Use descriptive titles when invoking Task subagents to make pipeline progress transparent and professional:
- **Step 1 (@product-strategy-agent)**: "Reviewing Product Strategy Context"
- **Step 2 (@product-strategy-agent)**: "Performing PESTEL Analysis"
- **Step 3 (@product-strategy-agent)**: "Performing SWOT Analysis"
- **Step 4 (@competitive-intel)**: "Scanning [REGION] Competitive Landscape"
- **Step 5 (106)**: "Customer Ideation Hub Analysis"
- **Step 6 (108)**: "Win-Loss Gap Analysis"
- **Step 7 (105)**: "Analyzing Internal SME Interviews"
- **Step 8 (105)**: "Analyzing Customer Interview Transcripts"
- **Step 9 (@pmf-analyst)**: "Performing PMF Thematic Analysis"
- **Step 10 (130)**: "Generating PMF Roadmap Deck"
- **Step 11 (HITL)**: "Select Research Recommendation" (**E2E-only**; standalone Workflow 1 stops at Step 10)
- **Step 12 (HITL)**: "PM Framing Conversation"
- **Step 13 (200)**: "Writing Product Requirements Document"
- **Step 14 (060)**: "Legal Compliance Review of PRD"
- **Step 14**: "PRD Legal Revision"
- **Step 16 (080)**: "Red Team Review of PRD"
- **Step 17 (315)**: "Creating Design Brief"
- **Step 18 (319)**: "Reviewing Design Brief Copy"
- **Step 18a (@doc-reviewer)**: "Editorial Review of Design Brief Copy" (quality gate; feeds @doc-writer triage-and-apply; 2-cycle cap)
- **Step 19 (318)**: "Peer Reviewing Design Brief"
- **Step 20 (320)**: "Building Canvas Kit Prototype"
- **Step 21 (321)**: "Visual Review of Prototype"
- **Step 22 (319)**: "Spot-Checking Prototype Copy"
- **Step 22a (@doc-reviewer)**: "Editorial Review of Prototype Copy" (quality gate; feeds @doc-writer triage-and-apply; 2-cycle cap)
- **Step 23 (330)**: "Capturing Prototype to Figma"
- **Step 24 (410)**: "Defining Product Epic"
- **Step 25 (420)**: "Creating Story Map"
- **Step 26 (HITL)**: "Story Map Review"
- **Step 27 (080)**: "Red Team Review of Story Map"
- **Step 28 (430)**: "Creating Jira Epic and Stories"

1. Create mission: assign **[REGION-CODE]-E2E-0NN** (increment in MISSION_LOG); log **Status**, **Objective**, and **Pipeline Step** starting at **1**. Mission ID format: Use uppercase region codes (e.g., GCC-E2E-029, FRANCE-E2E-001, JAPAN-E2E-001). Exception: GCC keeps "GCC" (not "Gcc").

**E2E Mode HITL Behavior:**

When E2E Express Lane is triggered ("Run [region] e2e"), upfront HITL questions are asked ONCE at the beginning:

1. **Before Step 1:** Ask Workflow 1 HITL questions (Research Driver + Additional Context) via AskQuestion:
   - Q1: "What's driving this PMF research?" with 6 options (New market entry / Competitive threat / Customer demand / Strategic pivot / Compliance requirement / Refresh existing research)
   - Q2: "Anything else I need to be aware of?" (optional free text)
2. **Log PM context** in MISSION_LOG under "PM Context" section
3. **Pass context** to Step 1 (@product-strategy-agent) in task description
4. **Skip upfront HITL** for Workflows 2, 3, 4 (context flows from prior workflows)
5. **Preserve existing HITL** at Steps 11-12 (recommendation selection + PM framing) and Step 25 (story map review)

**Standalone Mode HITL Behavior:**

When individual workflows are triggered standalone (e.g., "Write PRD for [feature]"), each workflow asks its own upfront HITL questions before execution (see Modular Workflow Entry Logic in 000-master-orchestrator.mdc).

1a. **Initialize progress tracker**: Call TodoWrite with `merge: false` to create E2E pipeline checklist (replaces any existing todos):
   ```
   TodoWrite({
     merge: false,
     todos: [
       { id: "[region-code]-e2e-step-1", content: "Reviewing Product Strategy Context (Step 1)", status: "pending" },
       { id: "[region-code]-e2e-step-2", content: "Performing PESTEL Analysis (Step 2)", status: "pending" },
       { id: "[region-code]-e2e-step-3", content: "Performing SWOT Analysis (Step 3)", status: "pending" },
       { id: "[region-code]-e2e-step-4", content: "Scanning [REGION] Competitive Landscape (Step 4)", status: "pending" },
       { id: "[region-code]-e2e-step-5", content: "Customer Ideation Hub Analysis (Step 5 - optional)", status: "pending" },
       { id: "[region-code]-e2e-step-6", content: "Win-Loss Gap Analysis (Step 6 - optional)", status: "pending" },
       { id: "[region-code]-e2e-step-7", content: "Analyzing Internal SME Interviews (Step 7)", status: "pending" },
       { id: "[region-code]-e2e-step-8", content: "Analyzing Customer Interview Transcripts (Step 8)", status: "pending" },
       { id: "[region-code]-e2e-step-9", content: "Performing PMF Thematic Analysis (Step 9)", status: "pending" },
       { id: "[region-code]-e2e-step-10", content: "Generating PMF Roadmap Deck (Step 10)", status: "pending" },
       { id: "[region-code]-e2e-step-11", content: "Select Research Recommendation (Step 11 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-12", content: "PM Framing Conversation (Step 11 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-13", content: "Writing Product Requirements Document (Step 12)", status: "pending" },
       { id: "[region-code]-e2e-step-14", content: "Legal Compliance Review of PRD (Step 13 - 060)", status: "pending" },
       { id: "[region-code]-e2e-step-15", content: "PRD Legal Revision (Step 14 - if needed)", status: "pending" },
       { id: "[region-code]-e2e-step-16", content: "Red Team Review of PRD (Step 15 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-17", content: "Creating Design Brief (Step 16)", status: "pending" },
       { id: "[region-code]-e2e-step-18", content: "Reviewing Design Brief Copy (Step 17)", status: "pending" },
       { id: "[region-code]-e2e-step-19", content: "Peer Reviewing Design Brief (Step 18)", status: "pending" },
       { id: "[region-code]-e2e-step-20", content: "Building Canvas Kit Prototype (Step 19)", status: "pending" },
       { id: "[region-code]-e2e-step-21", content: "Visual Review of Prototype (Step 20)", status: "pending" },
       { id: "[region-code]-e2e-step-22", content: "Spot-Checking Prototype Copy (Step 21)", status: "pending" },
       { id: "[region-code]-e2e-step-23", content: "Capturing Prototype to Figma (Step 22)", status: "pending" },
       { id: "[region-code]-e2e-step-24", content: "Defining Product Epic (Step 23 - 410)", status: "pending" },
       { id: "[region-code]-e2e-step-25", content: "Creating Story Map (Step 24 - 420)", status: "pending" },
       { id: "[region-code]-e2e-step-26", content: "Story Map Review (Step 25 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-27", content: "Red Team Review of Story Map (Step 26 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-28", content: "Creating Jira Epic and Stories (Step 27 - 430)", status: "pending" }
     ]
   })
   ```

**Standalone Workflow 1 (PMF Research & Deck) TodoWrite template**: When Workflow 1 runs standalone (NOT as part of E2E), use only Steps 1-10 from the template above. **Omit** Step 11 (HITL Select) and all subsequent steps. The orchestrator stops after deck generation.

2. **Update todo**: Mark Step 1 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-1", status: "in_progress" }] })`
2. Invoke **@product-strategy-agent** with Task description **"Reviewing Product Strategy Context"**: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities and protocols. Perform Step 1 for [REGION] E2E pipeline. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute E2E PMF Mode: Extract Strategy Context from strategy/ folder (priorities, OKRs, regional focus, competitive positioning, what's NOT priority). **CRITICAL - SOURCE FIDELITY:** Extract ONLY what the two source documents explicitly state. Read `strategy/markdown/product-priorities-q2-2026.md` and `strategy/pdfs/workday-talent-acquisition-strategy-march-2026.pdf`. Do NOT fabricate, infer, or add domain knowledge. Every claim must be source-attributed with `[Q2 doc]` or `[PDF p.N]`. If the sources say nothing about [REGION], state 'Not addressed in source documents'. **Output 1 file:** `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md`. This output will inform @competitive-intel (competitive scan prioritization), 105 (strategy-customer tension flags), @pmf-analyst (PESTEL/SWOT incorporation, RICE Business Impact scoring), and 130 (Product Strategy slides)."
2. **Update todo**: Mark Step 1 as completed, Step 2 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-1", status: "completed" }, { id: "[region-code]-e2e-step-2", status: "in_progress" }] })`
2.1 Invoke **@product-strategy-agent** with Task description **"Performing PESTEL Analysis"**: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities. Perform Step 2 for [REGION] E2E pipeline. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute PESTEL Analysis using the `pestel-analysis` Skill (all 6 factors with deep research protocol, 35-55+ web operations, Legal factor with GDPR/AI Act/country-specific depth). **Output 1 file:** `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md`. This output will inform @pmf-analyst (PESTEL incorporation) and 130 (PESTEL slides)."
2.1 **Update todo**: Mark Step 2 as completed, Step 3 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-2", status: "completed" }, { id: "[region-code]-e2e-step-3", status: "in_progress" }] })`
2.2 Invoke **@product-strategy-agent** with Task description **"Performing SWOT Analysis"**: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities. Perform Step 3 for [REGION] E2E pipeline. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute SWOT Analysis using the `swot-analysis` Skill (read @competitive-intel matrices from prior missions for baseline competitive context - @competitive-intel Step 4 runs after @product-strategy-agent; SWOT is preliminary positioning for @product-strategy-agent's own consumption). **Output 1 file:** `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md`. This output will inform @pmf-analyst (SWOT incorporation) and 130 (SWOT slide)."
2.2 **Update todo**: Mark Step 3 as completed, Step 4 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-3", status: "completed" }, { id: "[region-code]-e2e-step-4", status: "in_progress" }] })`

## ASYNC EXECUTION OPTIMIZATION: Steps 4, 6-8 Parallel + Step 5 Sequential

**Steps 1-3 (@product-strategy-agent) run sequentially first. Steps 4 (@competitive-intel), 6 (108), 7 (105 SME), and 8 (105 Customer) run in parallel when each leg has work (CI always runs). Step 5 (106) does not run in that parallel batch: it runs only after Steps 7-8 complete, because it must read both `research/[REGION]/105-sme-research-findings.md` and `research/[REGION]/105-user-research-findings.md` and validate themes against the P&T Idea Results Dashboard in `research/brainstorm-sessions/`.**

3a-4. **(PARALLEL CHECK)** Check source availability for the **four parallel legs** (106 is checked separately for the sequential phase):
   - **Check CI**: @competitive-intel always runs (no source check needed)
   - **Check 108 sources**: Does `research/gap-data/` (global) or `research/[REGION]/gap-data/` contain any `.csv`, `.xlsx`, or `.xls` file?
   - **Check SME sources**: Does `research/[REGION]/internal-sme-transcripts/` contain any `.txt` file?
   - **Check Customer sources**: Does `research/[REGION]/customer-transcripts/` contain any `.txt` file?
   - **Check 106 sources (for sequential Step 5 after 7-8):** Does `research/brainstorm-sessions/` contain any `.txt`, `.csv`, `.xlsx`, or `.xls` file?

   **Execution strategy based on source availability:**

   - **If ALL 4 parallel legs exist + 106 sources exist:** Invoke @competitive-intel + 108 + @ux-researcher (SME) + @ux-researcher (Customer) in the **same** response block (**4-way** parallel). **Do not** invoke **106** in this block.
     - Update todos: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-4", status: "in_progress" }, { id: "[region-code]-e2e-step-6", status: "in_progress" }, { id: "[region-code]-e2e-step-7", status: "in_progress" }, { id: "[region-code]-e2e-step-8", status: "in_progress" }] })` (leave Step 5 pending)
     - Invoke **@competitive-intel** with Task description **"Scanning [REGION] Competitive Landscape"**: "[REGION] E2E pipeline **Step 4**. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute Pattern 1a (Regional E2E Baseline Scan) per `.cursor/agents/competitive-intel-agent.md`."
     - Invoke **108** with Task description **"Win-Loss Gap Analysis"**: "[REGION] E2E pipeline **Step 6**. **Mission:** [[REGION-CODE]-E2E-0NN]. Analyse all in-scope sources in `research/gap-data/` (global) plus `research/[REGION]/gap-data/` (if present) per **108-tableau-gap-analyser.mdc** (run `python3 scripts/dump_research_folder_to_text.py` as needed for spreadsheets). Apply regional filtering for [REGION] per 108's Opp Segment Broad Mapping and content-based text scan. Write `research/[REGION]/gap-analysis/[YYYY-MM-DD]-gap-analysis-[MISSION-ID].md` with **## Fresh pass attestation**. Log path in MISSION_LOG."
     - Invoke **@ux-researcher** with Task description **"Analyzing Internal SME Interviews"**: "[REGION] E2E pipeline **Step 7**. **Mission:** [[REGION-CODE]-E2E-0NN]. You are the UX Researcher agent. Read `.cursor/agents/ux-researcher-agent.md` and execute via `.cursor/rules/105-research-planning-analysis.mdc` (Path B). Analyze ONLY internal SME transcripts in `research/[REGION]/internal-sme-transcripts/*.txt`. **Output:** `research/[REGION]/105-sme-research-findings.md` with Fresh pass attestation, SME participant list (using actual SME names, NOT P1-P5 anonymization), key findings per SME, themes emphasised, and Recommendations for SME Research Slides section for 130 deck consumption. **Note:** Do NOT analyze customer transcripts in this step - customer analysis happens in Step 8."
     - Invoke **@ux-researcher** with Task description **"Analyzing Customer Interview Transcripts"**: "[REGION] E2E pipeline **Step 8**. **Mission:** [[REGION-CODE]-E2E-0NN]. You are the UX Researcher agent. Read `.cursor/agents/ux-researcher-agent.md` and execute via `.cursor/rules/105-research-planning-analysis.mdc` (Path B — **mandatory explicit step**, not only inside **@pmf-analyst**). Regenerate `research/[REGION]/105-user-research-findings.md` from **all** `research/[REGION]/customer-transcripts/*.txt`. **Output MUST include** Fresh pass attestation with mission ID, list of customer transcript files read this run (NOT SME files - those were analyzed in Step 7). **Note:** SME analysis completed in Step 7; this step focuses on customer transcripts only."
     - **After ALL 4 parallel tasks complete**: Update todos: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-4", status: "completed" }, { id: "[region-code]-e2e-step-6", status: "completed" }, { id: "[region-code]-e2e-step-7", status: "completed" }, { id: "[region-code]-e2e-step-8", status: "completed" }] })`
     - **Then sequential Step 5 (106):** Update todo Step 5 `in_progress`. Invoke **106** with Task description **"Customer Ideation Hub Analysis"**: "[REGION] E2E pipeline **Step 5**. **Mission:** [[REGION-CODE]-E2E-0NN]. Read **105** findings: `research/[REGION]/105-sme-research-findings.md` and `research/[REGION]/105-user-research-findings.md`. Extract themes from **105**, then search **P&T Idea Results Dashboard** in `research/brainstorm-sessions/`. **Pass 1:** Match themes to capabilities (volume, sentiment, effort) plus verbatim quotes. **Pass 2:** Scan verbatims for region-name mentions for net-new ideas. Write `research/[REGION]/brainstorm-analysis/[YYYY-MM-DD]-brainstorm-analysis.md` per **106-brainstorm-analyser.mdc** (run `python3 scripts/dump_research_folder_to_text.py` or openpyxl with `pip install -r scripts/requirements-research-xlsx.txt` as needed). Include **## Fresh pass attestation**. Log path in MISSION_LOG."
     - **After 106 completes**: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "completed" }, { id: "[region-code]-e2e-step-9", status: "in_progress" }] })`

   - **If 4 parallel legs exist but no 106 sources:** Same 4-way parallel block as above; after completion mark Steps 4, 6, 7, 8 completed; mark Step 5 **cancelled** (`skipped: no P&T sources`); set Step 9 `in_progress`.

   - **If 3 parallel tasks apply (CI + 2 of 108 / SME / Customer):** Invoke CI + the two optional legs in the **same** response block; mark the missing optional step(s) **cancelled**. **After they complete**, run the **sequential 106** block only if both **105** outputs exist and `research/brainstorm-sessions/` has in-scope files; otherwise cancel Step 5. Then set Step 9 `in_progress`.

   - **If 2 parallel tasks apply (CI + 1 of 108 / SME / Customer):** Same pattern: parallelise CI + one optional; cancel the other two optional parallel legs; then **sequential 106** as above when preconditions hold; then Step 9 `in_progress`.

   - **If only CI runs (no 108, SME, or Customer sources):** Invoke @competitive-intel only; cancel Steps 6, 7, 8 (and Step 5 **cancelled** because **105** outputs are absent). Set Step 9 `in_progress`.

**Performance benefit:** **4-way** parallel (CI + up to 108 + SME + Customer) reduces wall-clock versus running those legs sequentially; **106** adds a **sequential** pass after **105** so theme validation stays anchored to interview findings.

**Sequential Step 5 template (reuse after any parallel completion when preconditions hold):** If **`research/[REGION]/105-sme-research-findings.md`** and **`research/[REGION]/105-user-research-findings.md`** exist and `research/brainstorm-sessions/` has any `.txt`, `.csv`, `.xlsx`, or `.xls`, mark Step 5 `in_progress` and invoke **106** with the **Step 5** task text above; then mark Step 5 `completed`. If preconditions fail, mark Step 5 **cancelled** with reason (`skipped: no 105 outputs` or `skipped: no P&T sources`).
5. Invoke **@pmf-analyst** with Task description **"Performing PMF Thematic Analysis"**: "You are the PMF Analyst agent. Read `.cursor/agents/pmf-analyst-agent.md` for your full capabilities and Braun & Clarke protocol. Analyze [REGION] from scratch **after** **105** SME (Step 7) and **105** Customer (Step 8) outputs exist. Run FRESH Braun & Clarke 6-phase analysis on all data in research/[REGION]/ (transcripts, SME, CSV). **Re-read** primary transcripts in Phase 1; do not substitute prior **105** markdown for re-familiarization. **Inputs from 105**: Read both `research/[REGION]/105-sme-research-findings.md` (Step 7) and `research/[REGION]/105-user-research-findings.md` (Step 8) for triangulation. In the report, include TWO input sections: `## 105 SME inputs (Step 7)` and `## 105 Customer inputs (Step 8)`, confirming Phase 1 transcript coverage. **If Step 5 ran:** include `## 106 inputs (Step 5)` linking to the new `research/[REGION]/brainstorm-analysis/*.md` and use **Customer Ideation Hub (106)** in triangulation. **If Step 6 ran:** include `## 108 inputs (Step 6)` linking to the new `research/[REGION]/gap-analysis/*.md` and use **Gap Data (108)** in triangulation. **For Competitive Landscape section:** Read the competitive intelligence from Step 4: `research/competitive/matrices/[region-code]-competitive-matrix.md` (latest changelog entry for this mission) and `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md`. Use **@competitive-intel's** findings for the Competitive Landscape section; do NOT perform separate web research for competitors. Cite @competitive-intel outputs. **For Strategic Context:** Read Step 1-3 outputs: `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md`, `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md`, `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from @product-strategy-agent. Incorporate strategic priorities, PESTEL findings, and SWOT positioning into Cross-Theme Insights and RICE scoring. DO NOT perform PESTEL or SWOT research yourself. Produce full PMF analysis report at `research/[REGION]/thematic-analysis/[date]-[REGION]-PMF-Analysis.md`. Append an E2E Handoff section with a numbered table of ALL recommendations from Product Roadmap Impact Summary (Priority 1 and Priority 2). Format: `## E2E Handoff: Research Recommendations` followed by a markdown table with columns #, Title, Action, Reach, Impact, Confidence, Effort, RICE Score. **@pmf-analyst** is report-only; do not generate PowerPoint here."
6. **Update todo**: Mark Step 9 as completed, Step 10 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-9", status: "completed" }, { id: "[region-code]-e2e-step-10", status: "in_progress" }] })`
7. Invoke **130** with Task description **"Generating PMF Roadmap Deck"**: "Build full PMF roadmap deck from the **@pmf-analyst** report (themes, recommendations, customer evidence) and **@product-strategy-agent** outputs (PESTEL, SWOT) from Steps 1-3. **MANDATORY:** Read **`010-style-guide.mdc` → Deck Generation** for typography standards, plus **`docs/decks/gcc-pmf-roadmap-baseline-slides-spec.md`** and **`docs/decks/gcc-pmf-roadmap-v65-slide-inventory.md`** BEFORE drafting JSON. **Input paths:** (1) `research/[REGION]/thematic-analysis/[date]-[REGION]-PMF-Analysis.md` from Step 9, (2) `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from Step 2, (3) `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from Step 3, (4) `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md` from Step 1, (5) **SME findings (Step 7):** `research/[REGION]/105-sme-research-findings.md` (if exists), (6) **Customer findings (Step 8):** `research/[REGION]/105-user-research-findings.md`. Target **~50-60 slides** (v65 parity; hard minimum 36). Include ALL mandatory sections: PESTEL (6 slides from @product-strategy-agent output with v65 depth), Competitive SWOT (from @product-strategy-agent output), 4× Win/Loss, Ideation Hub (4 slides or DATA GAP), **SME Interviews (Section 8a - when SME file exists: section divider + intro + participants table + 1 slide per SME with 7-8 lines each)**, Customer Interviews (Section 9), Full Funnel, triangulation matrix. **Before calling create_presentation, verify the deck quality checklist in 130-pmf-slide-generator.mdc is met.** Write `slides_spec_vN.json` and `~/Downloads/[REGION]_Recruiting_PMF_Roadmap_vN.pptx` (auto-increment N). Output: **Provide direct link to the generated .pptx file.** Part of [REGION] e2e pipeline."
6. **Update todo**: Mark Step 9 as completed, Step 10 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-9", status: "completed" }, { id: "[region-code]-e2e-step-10", status: "in_progress" }] })`
7. Invoke **130** with Task description **"Generating PMF Roadmap Deck"**: "Build full PMF roadmap deck from the **@pmf-analyst** report (themes, recommendations, customer evidence) and **@product-strategy-agent** outputs (PESTEL, SWOT) from Steps 1-3. **MANDATORY:** Read **`010-style-guide.mdc` → Deck Generation** for typography standards, plus **`docs/decks/gcc-pmf-roadmap-baseline-slides-spec.md`** and **`docs/decks/gcc-pmf-roadmap-v65-slide-inventory.md`** BEFORE drafting JSON. **Input paths:** (1) `research/[REGION]/thematic-analysis/[date]-[REGION]-PMF-Analysis.md` from Step 9, (2) `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from Step 2, (3) `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from Step 3, (4) `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md` from Step 1, (5) **SME findings (Step 7):** `research/[REGION]/105-sme-research-findings.md` (if exists), (6) **Customer findings (Step 8):** `research/[REGION]/105-user-research-findings.md`. Target **~50-60 slides** (v65 parity; hard minimum 36). Include ALL mandatory sections: PESTEL (6 slides from @product-strategy-agent output with v65 depth), Competitive SWOT (from @product-strategy-agent output), 4× Win/Loss, Ideation Hub (4 slides or DATA GAP), **SME Interviews (Section 8a - when SME file exists: section divider + intro + participants table + 1 slide per SME with 7-8 lines each)**, Customer Interviews (Section 9), Full Funnel, triangulation matrix. **Before calling create_presentation, verify the deck quality checklist in 130-pmf-slide-generator.mdc is met.** Write `slides_spec_vN.json` and `~/Downloads/[REGION]_Recruiting_PMF_Roadmap_vN.pptx` (auto-increment N). Output: **Provide direct link to the generated .pptx file.** Part of [REGION] e2e pipeline."

11. **E2E-ONLY HITL** (skip for standalone Workflow 1): Parse **@pmf-analyst** output for the E2E Handoff table. Present the **top 5** recommendations to the PM. Call AskQuestion with: Title "Which [REGION] research recommendation would you like to take through PRD, prototype, copy review, and Figma?"; Options derived from the table (one per recommendation, e.g. "1. Interview Scheduling - Integrate Paradox with [REGION] compliance", "2. Reporting & Dashboards - Improve recruiter dashboards", etc. - **limit to the top 5 recommendations only**). **STOP and wait for user response. Do NOT proceed to step 12 until the user has explicitly selected an option. Do NOT default or assume—the pipeline is blocked until the user responds.** Note: For standalone Workflow 1, the pipeline stops at Step 10 (deck generation). The E2E Handoff table is still written into the @pmf-analyst report as a reference artifact.
12. **After user responds**: Update todo with selection: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-11", content: "Select Research Recommendation (Step 11 - Selected: [recommendation title])", status: "completed" }] })`
13. Parse selected recommendation; log in MISSION_LOG as "Selected Recommendation". **CRITICAL: ALWAYS honor the user's selection exactly as given. Do NOT check if the recommendation was done before. Do NOT override or substitute a different recommendation. Execute the pipeline fresh for whatever the user selects, regardless of prior missions.**
14. **Update todo**: Mark Step 12 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-13", status: "in_progress" }] })`
15. HUMAN-IN-THE-LOOP (PM Framing): **Retrieve PM Context from MISSION_LOG** (upfront answers from before Step 1: Driver + Additional context). Orchestrator presents PM Kickoff Conversation with agent-proposed drafts for: (1) Problem Statement (from @pmf-analyst+105+@competitive-intel), (2) Success Criteria (2-3 metrics with research-based targets), (3) Scope Boundaries (what's NOT in v1). Call AskQuestion with:
   - Title: "PM Framing: [Selected Recommendation]"
   - **In the prompt, include:** "You indicated this research was driven by: **[PM Context Driver from MISSION_LOG]**" (e.g., "Strategic pivot", "Customer demand")
   - Present drafts with sections 1-3
   - Ask PM for: (4) **Strategic Intent: Why this feature now? How does it align with [upfront driver]?**, (5) Anything else to know
   - Options:
     - "Approved as-is - Proceed to PRD with these drafts"
     - "Provide refinements - I'll adjust the framing (respond in chat)"
   
   STOP and wait for user response. Do NOT proceed to step 12 until the user has explicitly selected an option.
16. **After user responds**: If "Provide refinements", capture PM's refinements in chat, then proceed. Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-12", content: "PM Framing Conversation (Step 11 - [Approved/Refined])", status: "completed" }] })`
17. **Update todo**: Mark Step 13 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-14", status: "in_progress" }] })`
18. Invoke 200 with Task description **"Writing Product Requirements Document"**: "Create PRD for the selected [REGION] opportunity: [recommendation]. Source: research/[REGION]/thematic-analysis/[latest].md. **PM framing from Step 12**: [problem statement, success criteria, scope boundaries, strategic intent, additional context]. Use PM framing as PRIMARY input (research as supporting evidence). **Required inputs:** read `research/competitive/matrices/[region-code]-competitive-matrix.md` (fresh from Step 4) and `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` from Step 4; incorporate competitive differentiation and parity (Native/Workaround/Gap) from @competitive-intel into Overview and any competitive sections. **Deliver PRD as markdown only** at `docs/prds/[feature]-prd.md` per **200-prd-template.mdc** (no Confluence). This is part of [REGION] e2e pipeline."
19. **Update todo**: Mark Step 13 as completed, Step 14 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-14", status: "completed" }, { id: "[region-code]-e2e-step-15", status: "in_progress" }] })`
20. Invoke 060 with Task description **"Legal Compliance Review of PRD"**: "Legal Compliance Review: review PRD at docs/prds/[feature]-prd.md for legal and compliance risks. Check GDPR (Art. 6, 9, 17, 22, 35), EU AI Act classification (if AI features), country-specific regulations for [REGION], data privacy requirements, consent flows, cross-border data transfers, retention policies. Use 060-legal-compliance-review.mdc standard response format with risk level and recommended actions. Present findings to orchestrator."
21. **Update todo**: Mark Step 14 as completed, Step 15 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-15", status: "completed" }, { id: "[region-code]-e2e-step-16", status: "in_progress" }] })`
22. If 060 findings exist (critical or important compliance issues): Reinvoke 200 with "Revise PRD at docs/prds/[feature]-prd.md to address Legal Compliance Review feedback: [summary of critical + important issues]. Update Compliance Considerations, Success Metrics (if DPIA needed), Data Architecture (if data flows flagged), User Experience (if consent required). Maintain PRD structure and format. Document any unresolved issues in Open Questions. This is a revision (1 attempt max)."
23. **Update todo**: Mark Step 15 as completed, Step 16 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-16", status: "completed" }, { id: "[region-code]-e2e-step-17", status: "in_progress" }] })`
24. Invoke 080 with Task description **"Red Team Review of PRD"**: "Red Team: review PRD at docs/prds/[feature]-prd.md before 315. Use Mode 1 (PRD Risk Analysis). Search functional knowledge and query Deployment Agent for Workday feasibility. Cross-check competitive claims against `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` and `research/competitive/matrices/[region-code]-competitive-matrix.md` per **080-red-team.mdc**. Present findings to orchestrator." Capture Red Team findings.
27. **Update todo**: Mark Step 17 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-18", status: "completed" }] })`
28. If Red Team findings exist (critical risks or important issues): Reinvoke 200 with "Revise PRD at docs/prds/[feature]-prd.md to address Red Team feedback: [summary of critical + important issues]. Maintain PRD structure and format. This is a revision (1 attempt max)."
27. Pipeline continues to step 17 regardless of whether revision resolves all issues.
30. **Update todo**: Mark Step 18 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-19", status: "in_progress" }] })`
31. Invoke 315 with Task description **"Creating Design Brief"**: "Perform design for the PRD at docs/prds/[feature]-prd.md. This is part of [REGION] e2e pipeline. Consult functional knowledge, ask Deployment Agent for placement guidance, validate with Six Hats Thinking as needed. Run **315** multi-pass process PASS 1-2 per **315-design-brief-creation.mdc**; write `design/[feature]-design-brief.md` including JTBD, shell pattern, Canvas Kit mapping, and **Copy Inventory section**. **After PASS 2 completes, STOP.**"
32. **Update todo**: Mark Step 18 as completed, Step 19 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-19", status: "completed" }, { id: "[region-code]-e2e-step-20", status: "in_progress" }] })`
33. Invoke 319 with Task description **"Reviewing Design Brief Copy"**: "Review UI copy from Design Brief at design/[feature]-design-brief.md (PASS 2 Copy Inventory section). Apply Editorial Guidelines checklist. Flag legal-sensitive copy for 060. Output approved copy revisions. Part of [REGION] e2e pipeline."
33a. **Doc Reviewer quality gate (Step 18a)**: Invoke `@doc-reviewer` with Task description **"Editorial Review of Design Brief Copy"**: "Review the copy revisions produced by 319 at design/[feature]-design-brief.md (Copy Inventory). Check against Editorial Guidelines, British English, Workday terminology, persona tone, and legal coverage. Produce severity-tagged findings (ERROR/WARNING/INFO) with string-specific evidence and proposed revisions. Do NOT rewrite copy. Part of [REGION] e2e pipeline."
33b. **@doc-writer triage-and-apply (Step 18a continued)**: Hand the reviewer findings to `@doc-writer` via Task description **"Triage @doc-reviewer findings (Design Brief Copy)"**: "Apply triage-and-apply per doc-writer-agent.md. Auto-apply safe WARNING/INFO fixes within the original string scope. Escalate ERROR, legal-sensitive, or cross-string findings to PM in plain English. Iteration cap: 2 cycles. If cycle 2 still has ERRORs, escalate all remaining findings to PM and stop. Output plain-English recap."
33c. **Iteration**: If `@doc-writer` recap flags remaining ERRORs within cycle budget, re-invoke `@doc-reviewer` on the updated copy (one more cycle only). Proceed to Step 19 regardless of recap outcome - reviewer findings are advisory, not blocking.
34. **Update todo**: Mark Step 19 as completed, Step 20 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-20", status: "completed" }, { id: "[region-code]-e2e-step-21", status: "in_progress" }] })`
35. If legal-sensitive copy exists: 319 invokes 060 automatically per 319-copy-review.mdc rules.
36. Invoke 318 with Task description **"Peer Reviewing Design Brief"**: "Perform peer review of Design Brief at design/[feature]-design-brief.md. This is part of [REGION] e2e pipeline. Evaluate harshly against Workday standards, Sana Style, Canvas Kit constraints, JTBD, shell pattern, Experience Principles (`docs/experience-principles.md`), no-breadcrumb rule. Append review findings and provide **Final Verdict: APPROVED** or **NEEDS REVISION**."
37. **Update todo**: Mark Step 20 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-21", status: "completed" }] })`
38. If 318 returns **NEEDS REVISION**: Re-invoke 315 with "Revise Design Brief at design/[feature]-design-brief.md to address 318 peer review feedback. Read PASS 3 & 4 sections for specific issues flagged. Update relevant PASS 1/2 sections. Maintain copy approved by 319. Remove 318's verdict sections. This is a single revision pass." After 315 completes revisions, proceed to step 20 (320) without re-invoking 318.
39. If 318 returns **APPROVED**: Proceed directly to step 19 (320).
40. **Update todo**: Mark Step 21 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-22", status: "in_progress" }] })`
41. Invoke 320 with Task description **"Building Canvas Kit Prototype"**: "Build prototype from the Design Brief at design/[feature]-design-brief.md and PRD at docs/prds/[feature]-prd.md. This is part of [REGION] e2e pipeline. Scope to representative UI as defined in Design Brief. **Prototype URL slug**: [feature-slug-vNN] (e.g., gcc-candidate-grid-redesign-v68). **Then start the design dev server** so the PM actually sees the UI: from `design/` run `VITE_PROTOTYPE_SLUG=[feature-slug-vNN] npm run dev` **in the background** (or verify `http://localhost:5199/` already responds). On first Vite listen, **`vite.config.ts` opens Google Chrome and Cursor Simple Browser to the versioned prototype URL** unless `VITE_NO_OPEN_BROWSERS=1`. If the server was **already running** before this session or browsers did not open, run from repo root: `bash scripts/open-url-chrome-and-cursor-browser.sh 'http://localhost:5199/[feature-slug-vNN]'` with the full versioned URL."
42. **Update todo**: Mark Step 21 as completed, Step 22 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-22", status: "completed" }, { id: "[region-code]-e2e-step-23", status: "in_progress" }] })`
43. Invoke 321 with Task description **"Visual Review of Prototype"**: "Perform visual/UX review of the prototype at http://localhost:5199/[feature-slug-vNN]. Use vision capabilities to analyze screenshots. Check for: layout bugs (scrollbars, floating elements, overflow), Canvas Kit component usage, Sana Style adherence, Design Brief alignment. Append findings to Design Brief as PASS 5. Provide Final Verdict: APPROVED or NEEDS REVISION. Part of [REGION] e2e pipeline."
44. **Update todo**: Mark Step 22 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-23", status: "completed" }] })`
45. If 321 returns **NEEDS REVISION**: Re-invoke 320 with "Fix visual bugs in prototype at design/[feature-slug-vNN].tsx per 321 visual review feedback. Address [critical + important issues]. Maintain Design Brief scope and approved copy. This is a single revision pass."
46. **After 320 completes fixes**: Refresh browsers so PM sees updated prototype. Run from repo root: `bash scripts/open-url-chrome-and-cursor-browser.sh 'http://localhost:5199/[feature-slug-vNN]?refresh=[timestamp]'` with timestamp to force reload.
47. Proceed to step 22 (319 spot-check) without re-invoking 321.
48. If 321 returns **APPROVED**: Proceed directly to step 22 (319 spot-check).
49. **Update todo**: Mark Step 23 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-24", status: "in_progress" }] })`
50. Invoke 319 with Task description **"Spot-Checking Prototype Copy"**: "Review all UI copy in the prototype. Part of [REGION] e2e pipeline."
50a. **Doc Reviewer quality gate (Step 22a)**: Invoke `@doc-reviewer` with Task description **"Editorial Review of Prototype Copy"**: "Review the prototype copy revisions produced by 319 against the implemented strings in design/[feature-slug-vNN].tsx. Check against Editorial Guidelines, British English, Workday terminology, persona tone, legal coverage, and scope completeness (every user-facing string covered). Produce severity-tagged findings (ERROR/WARNING/INFO) with file:line evidence and proposed revisions. Do NOT rewrite copy. Part of [REGION] e2e pipeline."
50b. **@doc-writer triage-and-apply (Step 22a continued)**: Hand the reviewer findings to `@doc-writer` via Task description **"Triage @doc-reviewer findings (Prototype Copy)"**: "Apply triage-and-apply per doc-writer-agent.md. Auto-apply safe WARNING/INFO fixes directly in design/[feature-slug-vNN].tsx within the original string scope. Escalate ERROR, legal-sensitive, or cross-string findings to PM in plain English. Iteration cap: 2 cycles. Output plain-English recap with rollback instructions."
50c. **Iteration**: If `@doc-writer` recap flags remaining ERRORs within cycle budget, re-invoke `@doc-reviewer` on the updated prototype (one more cycle only). Proceed to Step 23 regardless - reviewer findings are advisory, not blocking.
51. **Update todo**: Mark Step 23 as completed, Step 24 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-24", status: "completed" }, { id: "[region-code]-e2e-step-25", status: "in_progress" }] })`
52. Invoke 330 with Task description **"Capturing Prototype to Figma"**: "Capture the running prototype at localhost to Figma. Part of [REGION] e2e pipeline. **Mandatory:** (1) Confirm `http://localhost:5199/` loads the prototype. (2) Call **official Figma MCP** `generate_figma_design` per `design/README.md` / `330-figma-integration.mdc` (e.g. `outputMode: newFile`, unique `fileName`, `planKey`). (3) Open the returned **`#figmacapture=…`** localhost URL once (e.g. `open "http://localhost:5199/#figmacapture=…"` on macOS, or use Chrome / Simple Browser from step 19) — **no in-app paste UI**; flow is MCP + browser URL only. (4) Poll capture status until complete; log the Figma file URL in MISSION_LOG. **Do not skip** starting the dev server or opening browsers in step 19 when the PM needs to see the prototype."
53. **Update todo**: Mark Step 24 as completed, Step 25 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-25", status: "completed" }, { id: "[region-code]-e2e-step-26", status: "in_progress" }] })`
54. Invoke 410 with Task description **"Defining Product Epic"**: "Write epic draft for PRD at docs/prds/[feature]-prd.md. Part of [REGION] e2e pipeline. Output: docs/epics/[feature]-epic-draft.md (no Jira creation yet)."
55. **Update todo**: Mark Step 25 as completed, Step 26 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-26", status: "completed" }, { id: "[region-code]-e2e-step-27", status: "in_progress" }] })`

56. Invoke 420 with Task description **"Creating Story Map"**: "Story map from epic draft at docs/epics/[feature]-epic-draft.md and PRD. Part of [REGION] e2e pipeline. Consult functional knowledge and Deployment Agent. Create docs/story-maps/[feature]-story-map.md with Jeff Patton activities, value slices, and goals. Return story map path and high-level structure to orchestrator (do NOT present AskQuestion - orchestrator handles HITL)."
57. **Update todo**: Mark Step 26 as completed, Step 27 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-27", status: "completed" }, { id: "[region-code]-e2e-step-28", status: "in_progress" }] })`

58. HUMAN-IN-THE-LOOP (Story Map Review): Orchestrator presents story map structure (activities, value slices, story counts) to PM. Call AskQuestion with:
   - Title: "Story Map Review - Ready to Create Jira Epic and Stories?"
   - Prompt: Present activities count, total stories, value slice breakdown with goals and story lists
   - Note: "NO JIRA STORIES HAVE BEEN CREATED YET. This is the planning/review stage."
   - Options:
     - "Approve all - Create Jira epic + all stories (VS1, VS2, VS3)"
     - "Approve VS1 only - Create Jira epic + VS1 stories only"
     - "Request changes - Provide feedback on the story map first"
   
   STOP and wait for user response. Do NOT proceed to step 27 until the user has explicitly selected an option.
59. **After user responds**: Update todo with selection: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-26", content: "Story Map Review (Step 25 - Approved: [all/VS1 only/etc.])", status: "completed" }] })`
   If "Request changes", reinvoke 420 with PM feedback, then re-present for approval at 27.
60. **Update todo**: Mark Step 27 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-28", status: "in_progress" }] })`

61. After story map approval, invoke 080 with Task description **"Red Team Review of Story Map"**: "Red Team: review story map at docs/story-maps/[feature]-story-map.md before 430. Use Mode 2 (Story Map Pre-Flight). Search functional knowledge and query Deployment Agent for dependencies. Present findings to orchestrator." Capture Red Team findings.
62. **Update todo**: Mark Step 27 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-28", status: "completed" }] })`
63. If Red Team findings exist (blockers or complexity flags): Reinvoke 420 with "Revise story map at docs/story-maps/[feature]-story-map.md to address Red Team feedback: [summary of blockers + complexity flags]. Maintain Jeff Patton story mapping structure. This is a revision (1 attempt max)."
64. Pipeline continues to step 28 (430 Jira creation) regardless of whether revision resolves all issues.
65. **Update todo**: Mark Step 28 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-29", status: "in_progress" }] })`

66. Invoke 430 with Task description **"Creating Jira Epic and Stories"**: "Create Jira epic from draft at docs/epics/[feature]-epic-draft.md, then write user stories from approved story map at docs/story-maps/[feature]-story-map.md. Value slice filter: [approved slices from Step 26]. HRREC project, Recruiting Purge component, assigned to David Denham. Apply 319-copy-review checklist to user-visible strings before Jira create. Part of [REGION] e2e pipeline."
67. **Update todo**: Mark Step 28 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-29", status: "completed" }] })`

68. Mark mission complete; summarize artifacts (strategy context, CI scan, user research, brainstorm, gap analysis, PMF report, deck, PRD, design brief, prototype, Figma, epic draft, story map, Jira epic + stories)

**MISSION_LOG format for E2E**:
```markdown
## Mission: [REGION-CODE]-E2E-001 - [REGION] Research to Design Pipeline
**Status:** In Progress
**Pipeline Step:** [N] of 28 (**Strategy (@product-strategy-agent)** → **PESTEL (@product-strategy-agent)** → **SWOT (@product-strategy-agent)** → **CI (@competitive-intel)** → **106** → **108** → **105 SME** → **105 Customer** → **@pmf-analyst** Research → **130** Deck → HITL → **PM Framing** → PRD → **060 Legal PRD** → Red Team PRD → Design Brief (315) → Prototype → **Visual Review** → Copy → Figma → **Epic (410)** → **Story Map (420)** → **Story Map Review** → Red Team Stories → **Jira Stories (430)** → Complete)
**Selected Recommendation:** [Title] - [Action]
**Artifacts:** **Strategy (Step 1):** `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md` | **PESTEL (Step 2):** `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` | **SWOT (Step 3):** `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` | **CI (Step 4):** `research/competitive/matrices/[region-code]-competitive-matrix.md` (changelog entry [date]-[MISSION-ID]) + `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` | **106 (Step 5, optional):** `research/[REGION]/brainstorm-analysis/[date]-brainstorm-analysis.md` | **108 (Step 6, optional):** `research/[REGION]/gap-analysis/[date]-gap-analysis-[MISSION-ID].md` | **105 SME (Step 7):** `research/[REGION]/105-sme-research-findings.md` | **105 Customer (Step 8):** `research/[REGION]/105-user-research-findings.md` (both must include **Fresh pass attestation** + transcript lists) | Research **@pmf-analyst**: [path] | Slide Deck: [path] | **PRD (markdown only):** `docs/prds/[feature]-prd.md` | **Legal PRD Review (Step 14 - 060):** [findings summary or "No issues"] | Red Team PRD Review: [findings summary or "No critical issues"] | Design Brief (incl. Final Verdict): [path] | Prototype: design/[feature-vNN].tsx | Figma: [URL] | **Epic Draft (Step 24 - 410):** `docs/epics/[feature]-epic-draft.md` | **Story Map (Step 25 - 420):** `docs/story-maps/[feature]-story-map.md` | **Story Map Review (Step 26):** [Approved: all/VS1 only/etc.] | **Red Team Story Map (Step 27 - 080):** [findings summary or "No critical issues"] | **Jira Epic + Stories (Step 28 - 430):** [epic URL] + [N stories]
```

