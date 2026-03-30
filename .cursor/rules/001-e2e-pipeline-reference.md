### Regional E2E Pipeline (@product-strategy-agent → @competitive-intel → 105 → @pmf-analyst → 130 → HITL → 200 → … → 400)

**Trigger**: "Run [region] e2e", "e2e [region] research", "[region] e2e to 430", "[region] research all the way to 430", "[region] research to design", "[region] pipeline", "Full [region] workflow", "[region] research e2e" (where [region] = GCC, UK, France, Germany, Japan, India, Canada, Australia)

**Supported Regions**: GCC, UK, France, Germany, Japan, India, Canada, Australia

**Regional Folder Setup**: Before running E2E for a new region, ensure the folder structure exists. Use `scripts/scaffold-region-research.sh [REGION]` to create standard folders (customer-transcripts, internal-sme-transcripts, brainstorm-sessions, brainstorm-analysis, gap-data, gap-analysis, thematic-analysis, raw-data). GCC already has full structure; other regions may need scaffolding.

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

**Behavior**: ALWAYS runs **Product Strategy Review (@product-strategy-agent)** → **PESTEL Analysis (@product-strategy-agent)** → **SWOT Analysis (@product-strategy-agent)** → **full [REGION] Competitive Intelligence (@competitive-intel)** → **optional fresh 106** (if brainstorm `.txt` sources exist) → **optional fresh 108** (if gap data `.csv`/`.xlsx`/`.xls` exports exist) → **105 SME** → **105 Customer** → fresh research (**@pmf-analyst**) → **060 Roadmap review** → **NEW PMF roadmap deck (130)** → HITL → PM Framing → PRD → **060 Legal PRD review** → Red Team PRD → Design Brief → Prototype → Visual Review → Copy → Figma → Backlog. No confirmation needed.

**Flow** (execute sequentially, update MISSION_LOG at each step):

**ALWAYS RUN FRESH:** When this pipeline is triggered, ALWAYS execute **Step 1 (@product-strategy-agent)**, **Step 2 (@product-strategy-agent)**, **Step 3 (@product-strategy-agent)**, **Step 4 (@competitive-intel)**, **Step 7 (105)**, **Step 8 (105)**, **Step 9 (@pmf-analyst)**, and **Step 11 (130)** immediately after creating the mission. When `research/[REGION]/brainstorm-sessions/` contains any `.txt`, `.csv`, `.xlsx`, or `.xls` source file, execute **Step 5 (106)**. When `research/[REGION]/gap-data/` contains any `.csv`, `.xlsx`, or `.xls` export file, execute **Step 6 (108)** in order **before** **105** analysis. Do NOT check MISSION_LOG for existing analyses. Do NOT ask the user if they want fresh vs. different recommendation. Every E2E trigger is a fresh run by default.

**FORBIDDEN - E2E Pipeline Shortcuts:**
- Do NOT check MISSION_LOG for in-progress E2E missions and "resume" from a later step
- Do NOT interpret "e2e to 430" or "all the way to the end" as "complete the backlog step only"
- Do NOT skip **Step 1 (@product-strategy-agent)**, **Step 2 (@product-strategy-agent)**, or **Step 3 (@product-strategy-agent)** — every E2E trigger starts with strategy context, PESTEL, and SWOT before research begins
- Do NOT skip **Step 4 (@competitive-intel)** — every E2E trigger starts with a fresh full competitive scan for the specified region before user research begins
- Do NOT skip **Step 7 (105)** or **Step 8 (105)**, **Step 9 (@pmf-analyst)**, or **Step 11 (130)** — every E2E trigger requires fresh **@competitive-intel** scan, optional **106**/**108** when sources exist, fresh **105 SME** findings (Step 7), fresh **105 Customer** findings (Step 8), fresh **@pmf-analyst** analysis, **and** a new PMF roadmap deck
- Do NOT skip **Step 5 (106)** when `research/[REGION]/brainstorm-sessions/` contains any `.txt`, `.csv`, `.xlsx`, or `.xls` — run **106** before **105** analysis
- Do NOT skip **Step 6 (108)** when `research/[REGION]/gap-data/` contains any `.csv`, `.xlsx`, or `.xls` — run **108** before **105** analysis
- Do NOT skip HITL 1 (recommendation selection) - you MUST present AskQuestion and wait
- Do NOT collapse **105** into an implied sub-step of **@pmf-analyst** only: **105 SME** MUST be invoked as **Step 7** and **105 Customer** MUST be invoked as **Step 8** (both with own handoff + MISSION_LOG lines) **before** **@pmf-analyst** starts; **`research/[REGION]/105-sme-research-findings.md`** and **`research/[REGION]/105-user-research-findings.md`** must be **regenerated** from raw SME and customer `transcripts/` respectively with **Fresh pass attestations** per **105-research-planning-analysis.mdc**, not copy-forward without re-reading sources
- Do NOT skip HITL 2 (story map approval) - 400 invokes 410→420→430; 420 MUST present for approval
- Do NOT run Steps 5-6 or 7-8 SEQUENTIALLY when they can run in PARALLEL - invoke independent tasks in same response block for async execution (Cursor 2.5+ feature)
- "e2e [region] research", "[region] pipeline", "full [region] workflow", "e2e to 430" = FULL pipeline from Step 1

**E2E Pipeline Invariants:**
- HITL 1: Blocked until user selects recommendation. No default, no assume.
- HITL 2: Blocked until user approves story map (via 420's AskQuestion). No pre-existing file = approved.
- **105 SME fresh (Step 5):** Step 5 regenerates **`research/[REGION]/105-sme-research-findings.md`** from **raw SME transcripts** per **105-research-planning-analysis.mdc** with **Fresh pass attestation** — before customer analysis in Step 6; no shortcut from prior SME markdown without re-ingestion.
- **105 Customer fresh (Step 6):** Step 6 regenerates **`research/[REGION]/105-user-research-findings.md`** from **raw customer transcripts only** (SME already analyzed in Step 5) per **105-research-planning-analysis.mdc** with **Fresh pass attestation** — before **@pmf-analyst** starts; no shortcut from prior 105 markdown without re-ingestion.
- **@competitive-intel fresh (Step 4):** Every E2E **@competitive-intel** at pipeline start is **Pattern 1a** (Regional E2E Baseline Scan): new web research, Deployment Agent validation, matrix delta + new `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` — not reuse of a prior scan as the sole CI artefact for this run (see `.cursor/agents/competitive-intel-agent.md`).
- **106 / 108 fresh (optional steps):** When Step **7** or **8** runs, each must re-read **all** in-scope sources in `brainstorm-sessions/` (`.txt`, `.csv`, `.xlsx`, `.xls`) or `gap-data/` (`.csv`, `.xlsx`, `.xls`), run **`scripts/dump_research_folder_to_text.py`** per **106** / **108** when needed, and write a new analysis file with **## Fresh pass attestation** — no copy-forward from prior analysis markdown only.
- **100-series fresh:** **100**, **@competitive-intel**, **105**, **106**, and **108** must each run **afresh** on every orchestrated or explicit user invocation when that agent’s step executes: re-read primary inputs, regenerate outputs for **this** run. **Forbidden:** satisfying a step by only re-pointing downstream agents at **prior** markdown without that agent’s fresh pass (see **100-market-intelligence.mdc**, `.cursor/agents/competitive-intel-agent.md`, **105-user-researcher.mdc**, **106-brainstorm-analyser.mdc**, **108-tableau-gap-analyser.mdc**).

**E2E Pipeline Step Titles (for Task invocations):**
Use descriptive titles when invoking Task subagents to make pipeline progress transparent and professional:
- **Step 1 (@product-strategy-agent)**: "Reviewing Product Strategy Context"
- **Step 2 (@product-strategy-agent)**: "Performing PESTEL Analysis"
- **Step 3 (@product-strategy-agent)**: "Performing SWOT Analysis"
- **Step 4 (@competitive-intel)**: "Scanning [REGION] Competitive Landscape"
- **Step 5 (106)**: "Customer Ideation Hub Analysis"
- **Step 6 (108)**: "Analyzing Presales Product Gaps"
- **Step 7 (105)**: "Analyzing Internal SME Interviews"
- **Step 8 (105)**: "Analyzing Customer Interview Transcripts"
- **Step 9 (@pmf-analyst)**: "Performing PMF Thematic Analysis"
- **Step 10 (060)**: "Reviewing Roadmap Recommendations Compliance"
- **Step 11 (130)**: "Generating PMF Roadmap Deck"
- **Step 12**: "Cleanup Old Artifacts"
- **Step 13 (HITL)**: "Select Research Recommendation"
- **Step 14 (HITL)**: "PM Framing Conversation"
- **Step 15 (200)**: "Writing Product Requirements Document"
- **Step 16 (060)**: "Legal Compliance Review of PRD"
- **Step 17**: "PRD Legal Revision"
- **Step 18 (080)**: "Red Team Review of PRD"
- **Step 19 (315)**: "Creating Design Brief"
- **Step 20 (319)**: "Reviewing Design Brief Copy"
- **Step 21 (318)**: "Peer Reviewing Design Brief"
- **Step 22 (320)**: "Building Canvas Kit Prototype"
- **Step 23 (321)**: "Visual Review of Prototype"
- **Step 24 (319)**: "Spot-Checking Prototype Copy"
- **Step 25 (330)**: "Capturing Prototype to Figma"
- **Step 26 (410)**: "Defining Product Epic"
- **Step 27 (420)**: "Creating Story Map"
- **Step 28 (HITL)**: "Story Map Review"
- **Step 29 (080)**: "Red Team Review of Story Map"
- **Step 30 (430)**: "Creating Jira Epic and Stories"

1. Create mission: assign **[REGION-CODE]-E2E-0NN** (increment in MISSION_LOG); log **Status**, **Objective**, and **Pipeline Step** starting at **1**. Mission ID format: Use uppercase region codes (e.g., GCC-E2E-029, FRANCE-E2E-001, JAPAN-E2E-001). Exception: GCC keeps "GCC" (not "Gcc").
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
       { id: "[region-code]-e2e-step-6", content: "Analyzing Presales Product Gaps (Step 6 - optional)", status: "pending" },
       { id: "[region-code]-e2e-step-7", content: "Analyzing Internal SME Interviews (Step 7)", status: "pending" },
       { id: "[region-code]-e2e-step-8", content: "Analyzing Customer Interview Transcripts (Step 8)", status: "pending" },
       { id: "[region-code]-e2e-step-9", content: "Performing PMF Thematic Analysis (Step 9)", status: "pending" },
       { id: "[region-code]-e2e-step-10", content: "Reviewing Roadmap Recommendations Compliance (Step 10 - 060)", status: "pending" },
       { id: "[region-code]-e2e-step-11", content: "Generating PMF Roadmap Deck (Step 11)", status: "pending" },
       { id: "[region-code]-e2e-step-12", content: "Cleanup Old Artifacts (Step 12)", status: "pending" },
       { id: "[region-code]-e2e-step-13", content: "Select Research Recommendation (Step 13 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-14", content: "PM Framing Conversation (Step 14 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-15", content: "Writing Product Requirements Document (Step 15)", status: "pending" },
       { id: "[region-code]-e2e-step-16", content: "Legal Compliance Review of PRD (Step 16 - 060)", status: "pending" },
       { id: "[region-code]-e2e-step-17", content: "PRD Legal Revision (Step 17 - if needed)", status: "pending" },
       { id: "[region-code]-e2e-step-18", content: "Red Team Review of PRD (Step 18 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-19", content: "Creating Design Brief (Step 19)", status: "pending" },
       { id: "[region-code]-e2e-step-20", content: "Reviewing Design Brief Copy (Step 20)", status: "pending" },
       { id: "[region-code]-e2e-step-21", content: "Peer Reviewing Design Brief (Step 21)", status: "pending" },
       { id: "[region-code]-e2e-step-22", content: "Building Canvas Kit Prototype (Step 22)", status: "pending" },
       { id: "[region-code]-e2e-step-23", content: "Visual Review of Prototype (Step 23)", status: "pending" },
       { id: "[region-code]-e2e-step-24", content: "Spot-Checking Prototype Copy (Step 24)", status: "pending" },
       { id: "[region-code]-e2e-step-25", content: "Capturing Prototype to Figma (Step 25)", status: "pending" },
       { id: "[region-code]-e2e-step-26", content: "Defining Product Epic (Step 26 - 410)", status: "pending" },
       { id: "[region-code]-e2e-step-27", content: "Creating Story Map (Step 27 - 420)", status: "pending" },
       { id: "[region-code]-e2e-step-28", content: "Story Map Review (Step 28 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-29", content: "Red Team Review of Story Map (Step 29 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-30", content: "Creating Jira Epic and Stories (Step 30 - 430)", status: "pending" }
     ]
   })
   ```
2. **Update todo**: Mark Step 1 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-1", status: "in_progress" }] })`
2. Invoke **@product-strategy-agent** with Task description **"Reviewing Product Strategy Context"**: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities and protocols. Perform Step 1 for [REGION] E2E pipeline. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute E2E PMF Mode: Extract Strategy Context from strategy/ folder (priorities, OKRs, regional focus, competitive positioning, what's NOT priority). **Output 1 file:** `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md`. This output will inform @competitive-intel (competitive scan prioritization), 105 (strategy-customer tension flags), @pmf-analyst (PESTEL/SWOT incorporation, RICE Business Impact scoring), and 130 (Product Strategy slides)."
2. **Update todo**: Mark Step 1 as completed, Step 2 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-1", status: "completed" }, { id: "[region-code]-e2e-step-2", status: "in_progress" }] })`
2.1 Invoke **@product-strategy-agent** with Task description **"Performing PESTEL Analysis"**: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities. Perform Step 2 for [REGION] E2E pipeline. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute PESTEL Analysis using the `pestel-analysis` Skill (all 6 factors with deep research protocol, 35-55+ web operations, Legal factor with GDPR/AI Act/country-specific depth). **Output 1 file:** `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md`. This output will inform @pmf-analyst (PESTEL incorporation) and 130 (PESTEL slides)."
2.1 **Update todo**: Mark Step 2 as completed, Step 3 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-2", status: "completed" }, { id: "[region-code]-e2e-step-3", status: "in_progress" }] })`
2.2 Invoke **@product-strategy-agent** with Task description **"Performing SWOT Analysis"**: "You are the Product Strategist agent. Read `.cursor/agents/product-strategy-agent.md` for your full capabilities. Perform Step 3 for [REGION] E2E pipeline. **Mission:** [[REGION-CODE]-E2E-0NN]. Execute SWOT Analysis using the `swot-analysis` Skill (read @competitive-intel matrices from prior missions for baseline competitive context - @competitive-intel Step 4 runs after @product-strategy-agent; SWOT is preliminary positioning for @product-strategy-agent's own consumption). **Output 1 file:** `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md`. This output will inform @pmf-analyst (SWOT incorporation) and 130 (SWOT slide)."
2.2 **Update todo**: Mark Step 3 as completed, Step 4 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-3", status: "completed" }, { id: "[region-code]-e2e-step-4", status: "in_progress" }] })`
3. Invoke **@competitive-intel** with Task description **"Scanning [REGION] Competitive Landscape"**: "You are the Competitive Intelligence agent. Read `.cursor/agents/competitive-intel-agent.md` for your full capabilities. **Fresh full [REGION] competitive scan** for E2E pipeline. **Mission ID:** [[REGION-CODE]-E2E-0NN]. Execute Pattern 1a (Regional E2E Baseline Scan): (1) Run exhaustive web research across all [REGION] ATS competitors. (2) Query Deployment Agent for Workday capabilities and workarounds. (3) Update `research/competitive/matrices/[region-code]-competitive-matrix.md` with fresh findings (add changelog entry with mission ID and date). (4) Save point-in-time report to `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` with: Executive Summary, Competitor Profiles, Feature Comparison (Native/Workaround/True Gap for key capabilities), Market Insights, Workday Competitive Response. This report will be consumed by **@pmf-analyst** for Competitive Landscape section. Log matrix path + report path in MISSION_LOG. Part of [REGION] e2e pipeline Step 4."
3. **Update todo**: Mark Step 4 as completed, Step 5 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-4", status: "completed" }, { id: "[region-code]-e2e-step-5", status: "in_progress" }] })`

## ASYNC EXECUTION OPTIMIZATION: Steps 5-6 (106 and 108)

**These steps are independent and can run in PARALLEL when both sources exist.**

3a-3b. **(PARALLEL CHECK)** Check if BOTH source folders exist:
   - **Check 106 sources**: Does `research/[REGION]/brainstorm-sessions/` contain any `.txt`, `.csv`, `.xlsx`, or `.xls` file?
   - **Check 108 sources**: Does `research/[REGION]/gap-data/` contain any `.csv`, `.xlsx`, or `.xls` file?
   
   **Execution strategy based on source availability:**
   
   - **If BOTH exist**: Invoke 106 AND 108 in SAME response block (parallel execution). Both tasks run simultaneously.
     - Update todo for Step 5: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "in_progress" }, { id: "[region-code]-e2e-step-6", status: "in_progress" }] })`
     - Invoke **106** with Task description **"Customer Ideation Hub Analysis"**: "[REGION] E2E pipeline **Step 5**. **Mission:** [[REGION-CODE]-E2E-0NN]. Analyse all in-scope sources in `research/[REGION]/brainstorm-sessions/` per **106-brainstorm-analyser.mdc** (run `python3 scripts/dump_research_folder_to_text.py` with `pip install -r scripts/requirements-research-xlsx.txt` as needed). Write `research/[REGION]/brainstorm-analysis/[YYYY-MM-DD]-brainstorm-analysis.md` with **## Fresh pass attestation**. Log path in MISSION_LOG."
     - Invoke **108** with Task description **"Analyzing Presales Product Gaps"**: "[REGION] E2E pipeline **Step 6**. **Mission:** [[REGION-CODE]-E2E-0NN]. Analyse all in-scope sources in `research/[REGION]/gap-data/` per **108-tableau-gap-analyser.mdc** (run `python3 scripts/dump_research_folder_to_text.py` as needed for spreadsheets). Write `research/[REGION]/gap-analysis/[YYYY-MM-DD]-gap-analysis-[MISSION-ID].md` with **## Fresh pass attestation**. Log path in MISSION_LOG."
     - **After BOTH complete**: Update todos: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "completed" }, { id: "[region-code]-e2e-step-6", status: "completed" }, { id: "[region-code]-e2e-step-7", status: "in_progress" }] })`
   
   - **If ONLY 106 exists**: Invoke 106 only, mark 108 as cancelled
     - Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "in_progress" }, { id: "[region-code]-e2e-step-6", status: "cancelled", content: "Analyzing Presales Product Gaps (Step 6 - skipped: no sources)" }] })`
     - Invoke **106** with Task description **"Customer Ideation Hub Analysis"**: "[REGION] E2E pipeline **Step 5**. **Mission:** [[REGION-CODE]-E2E-0NN]. Analyse all in-scope sources in `research/[REGION]/brainstorm-sessions/` per **106-brainstorm-analyser.mdc** (run `python3 scripts/dump_research_folder_to_text.py` with `pip install -r scripts/requirements-research-xlsx.txt` as needed). Write `research/[REGION]/brainstorm-analysis/[YYYY-MM-DD]-brainstorm-analysis.md` with **## Fresh pass attestation**. Log path in MISSION_LOG."
     - **After 106 completes**: Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "completed" }, { id: "[region-code]-e2e-step-7", status: "in_progress" }] })`
   
   - **If ONLY 108 exists**: Invoke 108 only, mark 106 as cancelled
     - Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "cancelled", content: "Customer Ideation Hub Analysis (Step 5 - skipped: no sources)" }, { id: "[region-code]-e2e-step-6", status: "in_progress" }] })`
     - Invoke **108** with Task description **"Analyzing Presales Product Gaps"**: "[REGION] E2E pipeline **Step 6**. **Mission:** [[REGION-CODE]-E2E-0NN]. Analyse all in-scope sources in `research/[REGION]/gap-data/` per **108-tableau-gap-analyser.mdc** (run `python3 scripts/dump_research_folder_to_text.py` as needed for spreadsheets). Write `research/[REGION]/gap-analysis/[YYYY-MM-DD]-gap-analysis-[MISSION-ID].md` with **## Fresh pass attestation**. Log path in MISSION_LOG."
     - **After 108 completes**: Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-6", status: "completed" }, { id: "[region-code]-e2e-step-7", status: "in_progress" }] })`
   
   - **If NEITHER exists**: Mark both as cancelled, proceed directly to Step 7
     - Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-5", status: "cancelled", content: "Customer Ideation Hub Analysis (Step 5 - skipped: no sources)" }, { id: "[region-code]-e2e-step-6", status: "cancelled", content: "Analyzing Presales Product Gaps (Step 6 - skipped: no sources)" }, { id: "[region-code]-e2e-step-7", status: "in_progress" }] })`

**Performance benefit**: When both sources exist, saves ~50% time (20 min sequential → ~10 min parallel)

## ASYNC EXECUTION OPTIMIZATION: Steps 7-8 (105 SME and 105 Customer)

**These steps are ALWAYS independent and MUST run in PARALLEL.**

3c-4. **(PARALLEL EXECUTION - mandatory)** Invoke 105 SME AND 105 Customer in SAME response block:
   - Update todos: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-7", status: "in_progress" }, { id: "[region-code]-e2e-step-8", status: "in_progress" }] })`
   - Invoke **105** with Task description **"Analyzing Internal SME Interviews"**: "[REGION] E2E pipeline **Step 7**. **Mission:** [[REGION-CODE]-E2E-0NN]. Analyze ONLY internal SME transcripts in `research/[REGION]/internal-sme-transcripts/*.txt` per **105-research-planning-analysis.mdc**. **Output:** `research/[REGION]/105-sme-research-findings.md` with Fresh pass attestation, SME participant list (using actual SME names, NOT P1-P5 anonymization), key findings per SME, themes emphasised, and Recommendations for SME Research Slides section for 130 deck consumption. **Note:** Do NOT analyze customer transcripts in this step - customer analysis happens in Step 8."
   - Invoke **105** with Task description **"Analyzing Customer Interview Transcripts"** (Path B — **mandatory explicit step**, not only inside **@pmf-analyst**): "[REGION] PMF / E2E pipeline **Step 8**. **Mission:** [[REGION-CODE]-E2E-0NN]. Regenerate `research/[REGION]/105-user-research-findings.md` from **all** `research/[REGION]/customer-transcripts/*.txt` per **105-research-planning-analysis.mdc**. **Output MUST include** Fresh pass attestation with mission ID, list of customer transcript files read this run (NOT SME files - those were analyzed in Step 7). **Note:** SME analysis completed in Step 7; this step focuses on customer transcripts only."
   - **After BOTH complete**: Update todos: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-7", status: "completed" }, { id: "[region-code]-e2e-step-8", status: "completed" }, { id: "[region-code]-e2e-step-9", status: "in_progress" }] })`

**Performance benefit**: Saves ~50% time (30 min sequential → ~15 min parallel)
5. Invoke **@pmf-analyst** with Task description **"Performing PMF Thematic Analysis"**: "You are the PMF Analyst agent. Read `.cursor/agents/pmf-analyst-agent.md` for your full capabilities and Braun & Clarke protocol. Analyze [REGION] from scratch **after** **105** SME (Step 7) and **105** Customer (Step 8) outputs exist. Run FRESH Braun & Clarke 6-phase analysis on all data in research/[REGION]/ (transcripts, SME, CSV). **Re-read** primary transcripts in Phase 1; do not substitute prior **105** markdown for re-familiarization. **Inputs from 105**: Read both `research/[REGION]/105-sme-research-findings.md` (Step 7) and `research/[REGION]/105-user-research-findings.md` (Step 8) for triangulation. In the report, include TWO input sections: `## 105 SME inputs (Step 7)` and `## 105 Customer inputs (Step 8)`, confirming Phase 1 transcript coverage. **If Step 5 ran:** include `## 106 inputs (Step 5)` linking to the new `research/[REGION]/brainstorm-analysis/*.md` and use **Customer Ideation Hub (106)** in triangulation. **If Step 6 ran:** include `## 108 inputs (Step 6)` linking to the new `research/[REGION]/gap-analysis/*.md` and use **Gap Data (108)** in triangulation. **For Competitive Landscape section:** Read the competitive intelligence from Step 4: `research/competitive/matrices/[region-code]-competitive-matrix.md` (latest changelog entry for this mission) and `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md`. Use **@competitive-intel's** findings for the Competitive Landscape section; do NOT perform separate web research for competitors. Cite @competitive-intel outputs. **For Strategic Context:** Read Step 1-3 outputs: `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md`, `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md`, `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from @product-strategy-agent. Incorporate strategic priorities, PESTEL findings, and SWOT positioning into Cross-Theme Insights and RICE scoring. DO NOT perform PESTEL or SWOT research yourself. Produce full PMF analysis report at `research/[REGION]/thematic-analysis/[date]-[REGION]-PMF-Analysis.md`. Append an E2E Handoff section with a numbered table of ALL recommendations from Product Roadmap Impact Summary (Priority 1 and Priority 2). Format: `## E2E Handoff: Research Recommendations` followed by a markdown table with columns #, Title, Action, Reach, Impact, Confidence, Effort, RICE Score, Legal / compliance (060). **@pmf-analyst** is report-only; do not generate PowerPoint here."
6. **Update todo**: Mark Step 10 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-10", status: "in_progress" }] })`
8. Before @pmf-analyst finalizes Roadmap Recommendations: Invoke 060 with Task description **"Reviewing Roadmap Recommendations Compliance"**: "Legal Advisor: review Product Roadmap recommendations in draft @pmf-analyst report for [REGION]. Check legal/compliance implications (GDPR, EU AI Act if AI features, country-specific regulations). Flag high-risk features requiring DPIA, consent flows, or compliance work. Return findings to orchestrator for @pmf-analyst incorporation."
8. **Update todo**: Mark Step 10 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-10", status: "completed" }] })`
8.1 If 060 recommendations findings exist (high-risk flags or compliance requirements): Reinvoke @pmf-analyst with "Address Legal Advisor feedback in Roadmap Recommendations section of draft analysis at research/[REGION]/thematic-analysis/[date]-[REGION]-PMF-Analysis.md: [summary of findings]. Add compliance notes, DPIA requirements, or risk flags to affected recommendations. This is a revision (1 attempt max)."
8.2 **Update todo**: Mark Step 9 as completed, Step 11 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-9", status: "completed" }, { id: "[region-code]-e2e-step-11", status: "in_progress" }] })`
9. Invoke **130** with Task description **"Generating PMF Roadmap Deck"**: "Build full PMF roadmap deck from the **@pmf-analyst** report (themes, recommendations, customer evidence) and **@product-strategy-agent** outputs (PESTEL, SWOT) from Steps 1-3. **MANDATORY:** Read **`010-style-guide.mdc` → Deck Generation** for typography standards, plus **`docs/decks/gcc-pmf-roadmap-baseline-slides-spec.md`** and **`docs/decks/gcc-pmf-roadmap-v65-slide-inventory.md`** BEFORE drafting JSON. **Input paths:** (1) `research/[REGION]/thematic-analysis/[date]-[REGION]-PMF-Analysis.md` from Step 9, (2) `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from Step 2, (3) `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` from Step 3, (4) `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md` from Step 1, (5) **SME findings (Step 7):** `research/[REGION]/105-sme-research-findings.md` (if exists), (6) **Customer findings (Step 8):** `research/[REGION]/105-user-research-findings.md`. Target **~50-60 slides** (v65 parity; hard minimum 36). Include ALL mandatory sections: PESTEL (6 slides from @product-strategy-agent output with v65 depth), Competitive SWOT (from @product-strategy-agent output), 4× Win/Loss, Ideation Hub (4 slides or DATA GAP), **SME Interviews (Section 8a - when SME file exists: section divider + intro + participants table + 1 slide per SME with 7-8 lines each)**, Customer Interviews (Section 9), Full Funnel, triangulation matrix. **Before calling create_presentation, verify the deck quality checklist in 130-pmf-slide-generator.mdc is met.** Write `slides_spec_vN.json` and `~/Downloads/[REGION]_Recruiting_PMF_Roadmap_vN.pptx` (auto-increment N). Output: **Provide direct link to the generated .pptx file.** Part of [REGION] e2e pipeline."
10. **Update todo**: Mark Step 11 as completed, Step 12 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-11", status: "completed" }, { id: "[region-code]-e2e-step-12", status: "in_progress" }] })`
11. **Cleanup old artifacts**: Run Shell command from repo root: `python3 scripts/cleanup-old-artifacts.py --keep 3` (retains 3 most recent slide specs, PRDs, prototypes, story maps; deletes older versions; logs to terminal). Non-blocking, fast execution (~1 second).
12. **Update todo**: Mark Step 12 as completed, Step 13 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-12", status: "completed" }, { id: "[region-code]-e2e-step-13", status: "in_progress" }] })`
13. HUMAN-IN-THE-LOOP: Parse **@pmf-analyst** output for the E2E Handoff table. Present the recommendations to the PM. Call AskQuestion with: Title "Which [REGION] research recommendation would you like to take through PRD, prototype, copy review, and Figma?"; Options derived from the table (one per recommendation, e.g. "1. Interview Scheduling - Integrate Paradox with [REGION] compliance", "2. Reporting & Dashboards - Improve recruiter dashboards", etc.). **STOP and wait for user response. Do NOT proceed to step 15 until the user has explicitly selected an option. Do NOT default or assume—the pipeline is blocked until the user responds.**
14. **After user responds**: Update todo with selection: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-13", content: "Select Research Recommendation (Step 13 - Selected: [recommendation title])", status: "completed" }] })`
15. Parse selected recommendation; log in MISSION_LOG as "Selected Recommendation". **CRITICAL: ALWAYS honor the user's selection exactly as given. Do NOT check if the recommendation was done before. Do NOT override or substitute a different recommendation. Execute the pipeline fresh for whatever the user selects, regardless of prior missions.**
16. **Update todo**: Mark Step 14 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-14", status: "in_progress" }] })`
17. HUMAN-IN-THE-LOOP (PM Framing): Orchestrator presents PM Kickoff Conversation with agent-proposed drafts for: (1) Problem Statement (from @pmf-analyst+105+@competitive-intel), (2) Success Criteria (2-3 metrics with research-based targets), (3) Scope Boundaries (what's NOT in v1). Ask PM for: (4) Strategic Intent (why now, why this), (5) Anything else to know. Call AskQuestion with:
   - Title: "PM Framing: [Selected Recommendation]"
   - Present drafts in prompt with sections 1-3
   - Options:
     - "Approved as-is - Proceed to PRD with these drafts"
     - "Provide refinements - I'll adjust the framing (respond in chat)"
   
   STOP and wait for user response. Do NOT proceed to step 15 until the user has explicitly selected an option.
18. **After user responds**: If "Provide refinements", capture PM's refinements in chat, then proceed. Update todo: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-14", content: "PM Framing Conversation (Step 14 - [Approved/Refined])", status: "completed" }] })`
19. **Update todo**: Mark Step 15 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-15", status: "in_progress" }] })`
20. Invoke 200 with Task description **"Writing Product Requirements Document"**: "Create PRD for the selected [REGION] opportunity: [recommendation]. Source: research/[REGION]/thematic-analysis/[latest].md. **PM framing from Step 14**: [problem statement, success criteria, scope boundaries, strategic intent, additional context]. Use PM framing as PRIMARY input (research as supporting evidence). **Required inputs:** read `research/competitive/matrices/[region-code]-competitive-matrix.md` (fresh from Step 4) and `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` from Step 4; incorporate competitive differentiation and parity (Native/Workaround/Gap) from @competitive-intel into Overview and any competitive sections. **Deliver PRD as markdown only** at `docs/prds/[feature]-prd.md` per **200-write-prd.mdc** (no Confluence). This is part of [REGION] e2e pipeline."
21. **Update todo**: Mark Step 15 as completed, Step 16 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-15", status: "completed" }, { id: "[region-code]-e2e-step-16", status: "in_progress" }] })`
22. Invoke 060 with Task description **"Legal Compliance Review of PRD"**: "Legal Compliance Review: review PRD at docs/prds/[feature]-prd.md for legal and compliance risks. Check GDPR (Art. 6, 9, 17, 22, 35), EU AI Act classification (if AI features), country-specific regulations for [REGION], data privacy requirements, consent flows, cross-border data transfers, retention policies. Use 060-legal-compliance-review.mdc standard response format with risk level and recommended actions. Present findings to orchestrator."
23. **Update todo**: Mark Step 16 as completed, Step 17 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-16", status: "completed" }, { id: "[region-code]-e2e-step-17", status: "in_progress" }] })`
24. If 060 findings exist (critical or important compliance issues): Reinvoke 200 with "Revise PRD at docs/prds/[feature]-prd.md to address Legal Compliance Review feedback: [summary of critical + important issues]. Update Compliance Considerations, Success Metrics (if DPIA needed), Data Architecture (if data flows flagged), User Experience (if consent required). Maintain PRD structure and format. Document any unresolved issues in Open Questions. This is a revision (1 attempt max)."
25. **Update todo**: Mark Step 17 as completed, Step 18 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-17", status: "completed" }, { id: "[region-code]-e2e-step-18", status: "in_progress" }] })`
26. Invoke 080 with Task description **"Red Team Review of PRD"**: "Red Team: review PRD at docs/prds/[feature]-prd.md before 315. Use Mode 1 (PRD Risk Analysis). Search functional knowledge and query Deployment Agent for Workday feasibility. Cross-check competitive claims against `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` and `research/competitive/matrices/[region-code]-competitive-matrix.md` per **080-red-team.mdc**. Present findings to orchestrator." Capture Red Team findings.
27. **Update todo**: Mark Step 18 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-18", status: "completed" }] })`
28. If Red Team findings exist (critical risks or important issues): Reinvoke 200 with "Revise PRD at docs/prds/[feature]-prd.md to address Red Team feedback: [summary of critical + important issues]. Maintain PRD structure and format. This is a revision (1 attempt max)."
29. Pipeline continues to step 19 regardless of whether revision resolves all issues.
30. **Update todo**: Mark Step 19 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-19", status: "in_progress" }] })`
31. Invoke 315 with Task description **"Creating Design Brief"**: "Perform design for the PRD at docs/prds/[feature]-prd.md. This is part of [REGION] e2e pipeline. Consult functional knowledge, ask Deployment Agent for placement guidance, validate with Six Hats Thinking as needed. Run **315** multi-pass process PASS 1-2 per **315-design-brief-creation.mdc**; write `design/[feature]-design-brief.md` including JTBD, shell pattern, Canvas Kit mapping, and **Copy Inventory section**. **After PASS 2 completes, STOP.**"
32. **Update todo**: Mark Step 19 as completed, Step 20 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-19", status: "completed" }, { id: "[region-code]-e2e-step-20", status: "in_progress" }] })`
33. Invoke 319 with Task description **"Reviewing Design Brief Copy"**: "Review UI copy from Design Brief at design/[feature]-design-brief.md (PASS 2 Copy Inventory section). Apply Editorial Guidelines checklist. Flag legal-sensitive copy for 060. Output approved copy revisions. Part of [REGION] e2e pipeline."
34. **Update todo**: Mark Step 20 as completed, Step 21 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-20", status: "completed" }, { id: "[region-code]-e2e-step-21", status: "in_progress" }] })`
35. If legal-sensitive copy exists: 319 invokes 060 automatically per 319-copy-review.mdc rules.
36. Invoke 318 with Task description **"Peer Reviewing Design Brief"**: "Perform peer review of Design Brief at design/[feature]-design-brief.md. This is part of [REGION] e2e pipeline. Evaluate harshly against Workday standards, Sana Style, Canvas Kit constraints, JTBD, shell pattern, Experience Principles (`docs/experience-principles.md`), no-breadcrumb rule. Append review findings and provide **Final Verdict: APPROVED** or **NEEDS REVISION**."
37. **Update todo**: Mark Step 21 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-21", status: "completed" }] })`
38. If 318 returns **NEEDS REVISION**: Re-invoke 315 with "Revise Design Brief at design/[feature]-design-brief.md to address 318 peer review feedback. Read PASS 3 & 4 sections for specific issues flagged. Update relevant PASS 1/2 sections. Maintain copy approved by 319. Remove 318's verdict sections. This is a single revision pass." After 315 completes revisions, proceed to step 22 (320) without re-invoking 318.
39. If 318 returns **APPROVED**: Proceed directly to step 21 (320).
40. **Update todo**: Mark Step 22 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-22", status: "in_progress" }] })`
41. Invoke 320 with Task description **"Building Canvas Kit Prototype"**: "Build prototype from the Design Brief at design/[feature]-design-brief.md and PRD at docs/prds/[feature]-prd.md. This is part of [REGION] e2e pipeline. Scope to representative UI as defined in Design Brief. **Prototype URL slug**: [feature-slug-vNN] (e.g., gcc-candidate-grid-redesign-v68). **Then start the design dev server** so the PM actually sees the UI: from `design/` run `VITE_PROTOTYPE_SLUG=[feature-slug-vNN] npm run dev` **in the background** (or verify `http://localhost:5199/` already responds). On first Vite listen, **`vite.config.ts` opens Google Chrome and Cursor Simple Browser to the versioned prototype URL** unless `VITE_NO_OPEN_BROWSERS=1`. If the server was **already running** before this session or browsers did not open, run from repo root: `bash scripts/open-url-chrome-and-cursor-browser.sh 'http://localhost:5199/[feature-slug-vNN]'` with the full versioned URL."
42. **Update todo**: Mark Step 22 as completed, Step 23 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-22", status: "completed" }, { id: "[region-code]-e2e-step-23", status: "in_progress" }] })`
43. Invoke 321 with Task description **"Visual Review of Prototype"**: "Perform visual/UX review of the prototype at http://localhost:5199/[feature-slug-vNN]. Use vision capabilities to analyze screenshots. Check for: layout bugs (scrollbars, floating elements, overflow), Canvas Kit component usage, Sana Style adherence, Design Brief alignment. Append findings to Design Brief as PASS 5. Provide Final Verdict: APPROVED or NEEDS REVISION. Part of [REGION] e2e pipeline."
44. **Update todo**: Mark Step 23 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-23", status: "completed" }] })`
45. If 321 returns **NEEDS REVISION**: Re-invoke 320 with "Fix visual bugs in prototype at design/[feature-slug-vNN].tsx per 321 visual review feedback. Address [critical + important issues]. Maintain Design Brief scope and approved copy. This is a single revision pass."
46. **After 320 completes fixes**: Refresh browsers so PM sees updated prototype. Run from repo root: `bash scripts/open-url-chrome-and-cursor-browser.sh 'http://localhost:5199/[feature-slug-vNN]?refresh=[timestamp]'` with timestamp to force reload.
47. Proceed to step 24 (319 spot-check) without re-invoking 321.
48. If 321 returns **APPROVED**: Proceed directly to step 23 (319 spot-check).
49. **Update todo**: Mark Step 24 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-24", status: "in_progress" }] })`
50. Invoke 319 with Task description **"Spot-Checking Prototype Copy"**: "Review all UI copy in the prototype. Part of [REGION] e2e pipeline."
51. **Update todo**: Mark Step 24 as completed, Step 25 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-24", status: "completed" }, { id: "[region-code]-e2e-step-25", status: "in_progress" }] })`
52. Invoke 330 with Task description **"Capturing Prototype to Figma"**: "Capture the running prototype at localhost to Figma. Part of [REGION] e2e pipeline. **Mandatory:** (1) Confirm `http://localhost:5199/` loads the prototype. (2) Call **official Figma MCP** `generate_figma_design` per `design/README.md` / `330-figma-integration.mdc` (e.g. `outputMode: newFile`, unique `fileName`, `planKey`). (3) Open the returned **`#figmacapture=…`** localhost URL once (e.g. `open "http://localhost:5199/#figmacapture=…"` on macOS, or use Chrome / Simple Browser from step 21) — **no in-app paste UI**; flow is MCP + browser URL only. (4) Poll capture status until complete; log the Figma file URL in MISSION_LOG. **Do not skip** starting the dev server or opening browsers in step 21 when the PM needs to see the prototype."
53. **Update todo**: Mark Step 25 as completed, Step 26 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-25", status: "completed" }, { id: "[region-code]-e2e-step-26", status: "in_progress" }] })`
54. Invoke 410 with Task description **"Defining Product Epic"**: "Write epic draft for PRD at docs/prds/[feature]-prd.md. Part of [REGION] e2e pipeline. Output: docs/epics/[feature]-epic-draft.md (no Jira creation yet)."
55. **Update todo**: Mark Step 26 as completed, Step 27 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-26", status: "completed" }, { id: "[region-code]-e2e-step-27", status: "in_progress" }] })`

56. Invoke 420 with Task description **"Creating Story Map"**: "Story map from epic draft at docs/epics/[feature]-epic-draft.md and PRD. Part of [REGION] e2e pipeline. Consult functional knowledge and Deployment Agent. Create docs/story-maps/[feature]-story-map.md with Jeff Patton activities, value slices, and goals. Return story map path and high-level structure to orchestrator (do NOT present AskQuestion - orchestrator handles HITL)."
57. **Update todo**: Mark Step 27 as completed, Step 28 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-27", status: "completed" }, { id: "[region-code]-e2e-step-28", status: "in_progress" }] })`

58. HUMAN-IN-THE-LOOP (Story Map Review): Orchestrator presents story map structure (activities, value slices, story counts) to PM. Call AskQuestion with:
   - Title: "Story Map Review - Ready to Create Jira Epic and Stories?"
   - Prompt: Present activities count, total stories, value slice breakdown with goals and story lists
   - Note: "NO JIRA STORIES HAVE BEEN CREATED YET. This is the planning/review stage."
   - Options:
     - "Approve all - Create Jira epic + all stories (VS1, VS2, VS3)"
     - "Approve VS1 only - Create Jira epic + VS1 stories only"
     - "Request changes - Provide feedback on the story map first"
   
   STOP and wait for user response. Do NOT proceed to step 29 until the user has explicitly selected an option.
59. **After user responds**: Update todo with selection: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-28", content: "Story Map Review (Step 28 - Approved: [all/VS1 only/etc.])", status: "completed" }] })`
   If "Request changes", reinvoke 420 with PM feedback, then re-present for approval at 28.
60. **Update todo**: Mark Step 29 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-29", status: "in_progress" }] })`

61. After story map approval, invoke 080 with Task description **"Red Team Review of Story Map"**: "Red Team: review story map at docs/story-maps/[feature]-story-map.md before 430. Use Mode 2 (Story Map Pre-Flight). Search functional knowledge and query Deployment Agent for dependencies. Present findings to orchestrator." Capture Red Team findings.
62. **Update todo**: Mark Step 29 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-29", status: "completed" }] })`
63. If Red Team findings exist (blockers or complexity flags): Reinvoke 420 with "Revise story map at docs/story-maps/[feature]-story-map.md to address Red Team feedback: [summary of blockers + complexity flags]. Maintain Jeff Patton story mapping structure. This is a revision (1 attempt max)."
64. Pipeline continues to step 30 (430 Jira creation) regardless of whether revision resolves all issues.
65. **Update todo**: Mark Step 30 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-30", status: "in_progress" }] })`

66. Invoke 430 with Task description **"Creating Jira Epic and Stories"**: "Create Jira epic from draft at docs/epics/[feature]-epic-draft.md, then write user stories from approved story map at docs/story-maps/[feature]-story-map.md. Value slice filter: [approved slices from Step 28]. HRREC project, Recruiting Purge component, assigned to David Denham. Apply 319-copy-review checklist to user-visible strings before Jira create. Part of [REGION] e2e pipeline."
67. **Update todo**: Mark Step 30 as completed: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-30", status: "completed" }] })`

68. Mark mission complete; summarize artifacts (strategy context, CI scan, user research, brainstorm, gap analysis, PMF report, deck, PRD, design brief, prototype, Figma, epic draft, story map, Jira epic + stories)

**MISSION_LOG format for E2E**:
```markdown
## Mission: [REGION-CODE]-E2E-001 - [REGION] Research to Design Pipeline
**Status:** In Progress
**Pipeline Step:** [N] of 30 (**Strategy (@product-strategy-agent)** → **PESTEL (@product-strategy-agent)** → **SWOT (@product-strategy-agent)** → **CI (@competitive-intel)** → **106** → **108** → **105 SME** → **105 Customer** → **@pmf-analyst** Research → **060 Roadmap Legal** → **130** Deck → **Cleanup** → HITL → **PM Framing** → PRD → **060 Legal PRD** → Red Team PRD → Design Brief (315) → Prototype → **Visual Review** → Copy → Figma → **Epic (410)** → **Story Map (420)** → **Story Map Review** → Red Team Stories → **Jira Stories (430)** → Complete)
**Selected Recommendation:** [Title] - [Action]
**Artifacts:** **Strategy (Step 1):** `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md` | **PESTEL (Step 2):** `research/[REGION]/pestel-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` | **SWOT (Step 3):** `research/[REGION]/swot-analysis-[REGION]-[YYYY-MM-DD]-[MISSION-ID].md` | **CI (Step 4):** `research/competitive/matrices/[region-code]-competitive-matrix.md` (changelog entry [date]-[MISSION-ID]) + `research/competitive/[region-code]/[region-code]-competitive-scan-[YYYY-MM-DD]-[MISSION-ID].md` | **106 (Step 5, optional):** `research/[REGION]/brainstorm-analysis/[date]-brainstorm-analysis.md` | **108 (Step 6, optional):** `research/[REGION]/gap-analysis/[date]-gap-analysis-[MISSION-ID].md` | **105 SME (Step 7):** `research/[REGION]/105-sme-research-findings.md` | **105 Customer (Step 8):** `research/[REGION]/105-user-research-findings.md` (both must include **Fresh pass attestation** + transcript lists) | Research **@pmf-analyst**: [path] | **Legal Roadmap Review (Step 10):** [findings summary or "No issues"] | Slide Deck: [path] | **Cleanup (Step 12):** Retained 3 most recent (slide specs, PRDs, prototypes, story maps); deleted [N] old files | **PRD (markdown only):** `docs/prds/[feature]-prd.md` | **Legal PRD Review (Step 16 - 060):** [findings summary or "No issues"] | Red Team PRD Review: [findings summary or "No critical issues"] | Design Brief (incl. Final Verdict): [path] | Prototype: design/[feature-vNN].tsx | Figma: [URL] | **Epic Draft (Step 26 - 410):** `docs/epics/[feature]-epic-draft.md` | **Story Map (Step 27 - 420):** `docs/story-maps/[feature]-story-map.md` | **Story Map Review (Step 28):** [Approved: all/VS1 only/etc.] | **Red Team Story Map (Step 29 - 080):** [findings summary or "No critical issues"] | **Jira Epic + Stories (Step 30 - 430):** [epic URL] + [N stories]
```

