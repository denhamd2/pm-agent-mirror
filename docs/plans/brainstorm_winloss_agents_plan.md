---
name: Brainstorm & Win-Loss Analysers
overview: Create two new modular agents (106-brainstorm-analyser, 107-win-loss-analyser) positioned after 105 in the 100-series research cluster. These agents analyze internal brainstorm notes and win-loss interview data respectively, feeding insights into 120's PMF analysis with triangulation. Update orchestrator routing and 120 integration logic. **UPDATE (27 March 2026):** Agent 107 later deprecated and removed - presales gap data correctly routed to 108-tableau-gap-analyser instead.
todos: []
isProject: false
---

# Create Brainstorm Analyser (106) and Win-Loss Analyser (107)

**STATUS UPDATE (27 March 2026):** Agent 107 (win-loss-analyser) was deprecated and removed from the workspace. The data source initially routed to 107 (Opportunity Detail.xlsx) was found to contain presales gap data (Gap ID, Severity fields), not qualitative win-loss interview transcripts. This data is now correctly analyzed by **108-tableau-gap-analyser** per orchestrator specification. Agent 106 (brainstorm-analyser) remains active and operational.

## Problem

Currently, 105 (User Researcher) focuses exclusively on customer interviews using Teresa Torres' Continuous Discovery Habits. However, PMs often have two additional rich qualitative data sources that aren't systematically analyzed:

1. **Internal brainstorm sessions**: Cross-functional team brainstorms, ideation workshops, product strategy sessions
2. **Win-loss interviews**: Customer interviews specifically about won/lost deals, competitive dynamics, decision factors

These data sources provide distinct perspectives that complement customer research:
- **Brainstorms**: Internal team hypotheses, strategic thinking, cross-functional alignment
- **Win-Loss**: Competitive positioning, buying criteria, decision-making process, deal blockers

Right now, this data either:
- Gets lost in wikis or Slack with no systematic analysis
- Gets manually synthesized by the PM (time-consuming, inconsistent)
- Doesn't get triangulated with customer research in 120's PMF reports

## Proposed Solution

Create two new modular agents in the **100-series research cluster**, positioned as 106 and 107:

### 106-brainstorm-analyser.mdc

**Purpose**: Analyze internal brainstorm session notes using thematic analysis, identify strategic hypotheses, flag cross-functional alignment/gaps.

**Data sources**:
- `research/[Country]/brainstorm-sessions/*.txt` - session notes/transcripts
- File naming: `brainstorm_[topic]_[YYYY-MM-DD].txt`

**Analysis method**:
- Modified Braun & Clarke coding (internal perspective, not customer voice)
- Hypothesis extraction (testable assumptions the team believes)
- Alignment analysis (convergence/divergence across functions: PM, Eng, Design, Sales)
- Strategic theme clustering

**Outputs**:
1. **Markdown report**: `research/[Country]/brainstorm-analysis/[date]-brainstorm-analysis.md`
   - Extracted hypotheses
   - Strategic themes
   - Cross-functional alignment matrix
   - Recommendations for validation (via customer research)
2. **120 integration**: Provides "Internal Team Perspective" triangulation source
3. **Fresh pass**: 100-series fresh requirement applies

**Triggers**:
- "Analyze brainstorm sessions for [Country]"
- "What hypotheses did we generate in brainstorms?"
- "Synthesize internal brainstorm data"
- Orchestrator: Optional Step 2.5 in E2E pipeline (between 105 and 120)

### 107-win-loss-analyser.mdc

**Purpose**: Analyze win-loss interview transcripts to understand competitive positioning, buying criteria, and deal dynamics.

**Data sources**:
- `research/[Country]/win-loss-interviews/*.txt` - win/loss interview transcripts
- File naming: `win_[CompanyName]_[YYYY-MM-DD].txt` or `loss_[CompanyName]_[competitor]_[YYYY-MM-DD].txt`

**Analysis method**:
- Win vs Loss pattern analysis
- Competitive factor extraction (feature gaps, pricing, implementation concerns)
- Decision criteria mapping (must-haves, nice-to-haves, deal-breakers)
- Competitor strength/weakness themes
- Integration with 101 competitive matrices

**Outputs**:
1. **Markdown report**: `research/[Country]/win-loss-analysis/[date]-win-loss-analysis.md`
   - Win/Loss factor matrix
   - Competitive themes
   - Buying criteria hierarchy
   - Sales enablement insights
   - Feature gap recommendations
2. **120 integration**: Provides "Win-Loss Perspective" triangulation source
3. **101 linkage**: Flags competitive gaps for 101 to validate
4. **Fresh pass**: 100-series fresh requirement applies

**Triggers**:
- "Analyze win-loss interviews for [Country]"
- "Why did we lose deals in GCC?"
- "What are the winning factors vs SAP?"
- Orchestrator: Optional Step 2.75 in E2E pipeline (between 105 and 120)

## 120 Integration: Multi-Source Triangulation

Update **120-pmf-thematic-analysis.mdc** to support optional triangulation from 106 and 107:

### Current Triangulation (2 sources)
- **SME Perspective** vs **Customer Perspective**

### New Triangulation (up to 4 sources)
- **Customer Perspective** (105)
- **SME Perspective** (105 internal-sme-transcripts)
- **Internal Team Perspective** (106 brainstorm analysis) - OPTIONAL
- **Win-Loss Perspective** (107 win-loss analysis) - OPTIONAL

### Updated Phase 4 Logic

**120 Phase 4 detection**:
1. Check for `research/[Country]/brainstorm-analysis/[latest].md` → include 106 insights if present
2. Check for `research/[Country]/win-loss-analysis/[latest].md` → include 107 insights if present
3. Build triangulation matrix with available sources (minimum 2, maximum 4)

**Triangulation Matrix Format** (adaptive):

**2-source (current)**:
| Theme | SME View | Customer View | Convergence | Divergence | PMF Impact |

**3-source (+ Brainstorm)**:
| Theme | SME | Customer | Internal Team | Convergence | Divergence | PMF Impact |

**4-source (+ Brainstorm + Win-Loss)**:
| Theme | SME | Customer | Internal Team | Win-Loss | Convergence | Divergence | PMF Impact |

**Convergence scoring**:
- **4/4 sources agree**: High confidence theme
- **3/4 sources agree**: Medium-high confidence
- **2/4 sources agree, 2 diverge**: Interesting tension to explore
- **1/4 unique**: Flag for further validation

## Orchestrator Updates

### Decision Framework (new triggers)

Add to **000-master-orchestrator.mdc** routing logic:

```markdown
- "Analyze brainstorm sessions" or "synthesize brainstorm data" → Brainstorm Analyser (106)
- "Analyze win-loss" or "why did we lose [deals/region]" or "win-loss factors" → Win-Loss Analyser (107)
```

### Agent Coordination Section

Add 106 and 107 to orchestrator's specialist roster:

```markdown
- **106-brainstorm-analyser.mdc**: Internal brainstorm session analysis (hypotheses, alignment, strategic themes)
- **107-win-loss-analyser.mdc**: Win-loss interview analysis (competitive factors, buying criteria, deal dynamics)
```

### Optional E2E Pipeline Steps

Update GCC E2E Pipeline with optional steps 2.5 and 2.75:

**Current flow**:
1. Step 1: 101 (CI baseline)
2. Step 2a: 105 (User research)
3. Step 2b: 120 (PMF analysis)
...

**New flow**:
1. Step 1: 101 (CI baseline)
2. Step 2a: 105 (User research)
3. **Step 2.5 (OPTIONAL)**: 106 (Brainstorm analysis) - if brainstorm files exist
4. **Step 2.75 (OPTIONAL)**: 107 (Win-loss analysis) - if win-loss files exist
5. Step 2b: 120 (PMF analysis with multi-source triangulation)
...

**Orchestrator detection logic**:
```markdown
2a. Invoke 105 (Path B - user research)
[Optional 2.5] If `research/[Country]/brainstorm-sessions/*.txt` exist: Invoke 106
[Optional 2.75] If `research/[Country]/win-loss-interviews/*.txt` exist: Invoke 107
2b. Invoke 120: "Analyze [Country]... [If 106/107 outputs exist, include in triangulation]..."
```

## Rationale

### Why These Agents?

1. **Enterprise PM Reality**: Senior Workday PMs run brainstorms (strategy sessions, roadmap planning, XFN alignment workshops) and conduct win-loss analysis (understand why customers choose Workday vs SAP/Oracle). This data is currently under-utilized.

2. **Triangulation Value**: Adding Internal Team + Win-Loss perspectives to Customer + SME creates richer PMF analysis:
   - **Customer says**: "We need WhatsApp for GCC candidates"
   - **SME says**: "We see low response rates in GCC"
   - **Internal Team hypothesis** (106): "WhatsApp is must-have for GCC due to cultural preferences"
   - **Win-Loss insight** (107): "Lost 3 GCC deals to ZenHR due to WhatsApp gap"
   - **120 Synthesis**: High confidence theme + validated competitive gap + clear business impact

3. **Modular & Fresh**: Like 100, 101, 105, these are 100-series agents with fresh pass requirements. Each run re-reads source files, no cached analysis.

4. **Flexible Integration**: Optional steps in E2E pipeline mean these agents don't block the flow if data doesn't exist. But when data is present, insights automatically feed into 120.

5. **Sales Enablement**: 107 (Win-Loss) directly supports sales teams by surfacing why Workday wins/loses deals, which features matter most, and how to position vs competitors. Can feed battle cards to 101.

### Why After 105?

- **105** establishes the customer research baseline (most critical)
- **106/107** add complementary perspectives (internal hypotheses, competitive dynamics)
- **120** synthesizes all sources into holistic PMF analysis
- **Numbering** (106, 107) signals they're part of the research cluster but optional/modular

### PM Best Practices Alignment

- **Continuous Discovery (Teresa Torres)**: 106 captures team hypotheses to test; 107 validates market signals
- **Data-Informed Decisions**: Triangulate qual sources (customer, internal, competitive)
- **Outcome-Driven**: 107 links features to deal outcomes (win/loss), not just opinions
- **Competitive Intelligence**: 107 complements 101's deep research with real buying criteria

## Implementation Steps

### 1. Create 106-brainstorm-analyser.mdc

**File**: `.cursor/rules/106-brainstorm-analyser.mdc`

**Key sections**:
- Fresh pass requirement (100-series)
- Brainstorm session analysis protocol
- Hypothesis extraction method
- Cross-functional alignment analysis
- Output format (markdown report)
- 120 integration instructions
- Triggers

### 2. Create 107-win-loss-analyser.mdc

**File**: `.cursor/rules/107-win-loss-analyser.mdc`

**Key sections**:
- Fresh pass requirement (100-series)
- Win vs Loss coding framework
- Competitive factor analysis
- Buying criteria hierarchy
- 101 integration (competitive gaps)
- Output format (markdown report)
- 120 integration instructions
- Triggers

### 3. Update 120-pmf-thematic-analysis.mdc

**Changes**:
- **Phase 1**: Add detection for 106/107 outputs (read if present)
- **Phase 4**: Update triangulation logic to support 2-4 sources
- **Phase 4**: Adaptive triangulation matrix format
- **Phase 6**: Include 106/107 inputs sections in report (like 105 inputs, 101 inputs)
- **Triangulation Matrix**: Show convergence across 2-4 sources

### 4. Update 000-master-orchestrator.mdc

**Changes**:
- **Agent Coordination** section: Add 106 and 107 to specialist roster
- **Decision Framework**: Add triggers for 106 and 107
- **GCC E2E Pipeline**: Add optional steps 2.5 (106) and 2.75 (107)
- **E2E Pipeline description**: Document detection logic for optional steps
- **Example Interactions**: Add examples for brainstorm and win-loss analysis

### 5. Create folder structure examples

Create placeholder folders to document the pattern:

```
research/
├── [Country]/
│   ├── raw-data/
│   ├── customer-transcripts/         # 105 input
│   ├── internal-sme-transcripts/     # 105 input
│   ├── brainstorm-sessions/          # 106 input (NEW)
│   ├── win-loss-interviews/          # 107 input (NEW)
│   ├── 105-user-research-findings.md # 105 output
│   ├── brainstorm-analysis/          # 106 output (NEW)
│   ├── win-loss-analysis/            # 107 output (NEW)
│   └── thematic-analysis/            # 120 output
```

### 6. Update MISSION_LOG.md

Document the new agents and their integration:

```markdown
## System Health
- ✅ 100-series research cluster: 100, 101, 105, **106**, **107** (fresh pass agents)
- ✅ PMF Thematic Analysis (120): Multi-source triangulation (Customer, SME, Internal Team, Win-Loss)
```

## Verification Steps

After implementation:

1. **Test 106 standalone**: Create `research/GCC/brainstorm-sessions/brainstorm_whatsapp_2026-03-22.txt` → invoke 106 → verify markdown output
2. **Test 107 standalone**: Create `research/GCC/win-loss-interviews/loss_ACME_ZenHR_2026-03-22.txt` → invoke 107 → verify markdown output
3. **Test 120 integration**: With 105+106+107 outputs present → invoke 120 → verify 4-source triangulation matrix in report
4. **Test orchestrator detection**: Trigger E2E pipeline with optional data → verify steps 2.5 and 2.75 run automatically
5. **Test orchestrator without optional data**: Trigger E2E pipeline without brainstorm/win-loss files → verify pipeline skips 106/107 gracefully

## Benefits

1. **Richer PMF Analysis**: 4-source triangulation > 2-source (Customer + SME + Internal + Win-Loss)
2. **Hypothesis Validation**: Team hypotheses from brainstorms get tested against customer reality
3. **Competitive Intelligence**: Win-loss factors directly inform competitive positioning and feature prioritization
4. **Sales Enablement**: Win-loss insights feed battle cards and sales talking points
5. **No Workflow Disruption**: Optional steps mean E2E pipeline still works without this data
6. **Modular Design**: Each agent has clear inputs/outputs, fresh pass requirements, standalone value
7. **Enterprise PM Reality**: Captures the data sources senior PMs actually have (not just customer interviews)

## Example E2E Pipeline Run

**Scenario**: GCC E2E with all data sources present

```
Step 1: 101 → gcc-competitive-scan-2026-03-22-GCC-E2E-013.md
Step 2a: 105 → 105-user-research-findings.md (3 customer interviews)
Step 2.5: 106 → brainstorm-analysis/2026-03-22-brainstorm-analysis.md (2 brainstorm sessions)
Step 2.75: 107 → win-loss-analysis/2026-03-22-win-loss-analysis.md (5 win-loss interviews)
Step 2b: 120 → 2026-03-22-GCC-PMF-Analysis.md
  - 4-source triangulation matrix (Customer, SME, Internal Team, Win-Loss)
  - High confidence themes (all 4 agree)
  - Hypothesis validation (brainstorm → customer)
  - Competitive validation (win-loss → 101)
Step 3: 130 → GCC_Recruiting_PMF_Roadmap_v13.pptx (with richer insights)
...
```

## File Changes Summary

**New files**:
1. `.cursor/rules/106-brainstorm-analyser.mdc` (~400 lines)
2. `.cursor/rules/107-win-loss-analyser.mdc` (~500 lines)

**Modified files**:
1. `.cursor/rules/120-pmf-thematic-analysis.mdc` (Phase 1, 4, 6 updates for multi-source triangulation)
2. `.cursor/rules/000-master-orchestrator.mdc` (add 106/107 to roster, triggers, optional E2E steps)

**Documentation**:
1. `MISSION_LOG.md` (note new agents)
2. `research/README.md` (document new folder structure)

---

## Iteration: Spreadsheet inputs (user feedback)

**Context:** `.xlsx` files are now in `research/GCC/brainstorm-sessions/` (e.g. P&T Idea Results Dashboard export) and `research/GCC/win-loss-interviews/` (e.g. **Opportunity Detail.xlsx**).

**Gap vs current implementation:** **106**, **107**, and **000-master-orchestrator** Step **2.5** / **2.75** only treat **`*.txt`** as sources. With only `.xlsx` present, the orchestrator **skips** 106/107 and those files are **not** analysed by the new agents.

**Follow-up implementation (not yet applied in rules):**

1. **`106-brainstorm-analyser.mdc` / `107-win-loss-analyser.mdc`**
   - Extend **Inputs** to: `*.txt`, `*.xlsx`, `*.xls`, `*.csv` in the respective folders.
   - **Fresh pass attestation:** List every source file path read this run (any extension).
   - **Tabular data:** Map relevant columns to analysis (e.g. win-loss: verbatim / pain / CI notes / gap name / outcome; brainstorm: idea text, votes, themes). Row-level text = evidence quotes; summarise patterns like transcript coding.
   - **Opportunity Detail.xlsx:** Align with [research/README.md](research/README.md) expectations for Opportunity Detail columns where applicable (`Gap Name`, `CI Notes`, `Pain point(s)`, etc.).

2. **`000-master-orchestrator.mdc`**
   - Step **2.5** / **2.75** condition: run if any file matches `*.txt`, `*.xlsx`, `*.xls`, or `*.csv` under the folder (ignore `.gitkeep` only).

3. **`120-pmf-thematic-analysis.mdc`**
   - Workspace structure: note spreadsheet inputs under `brainstorm-sessions/` / `win-loss-interviews/`.
   - Phase 1 optional bullet: unchanged logic (read **106**/**107** **outputs** once they exist).

4. **`research/README.md`**
   - State that `.xlsx` / `.csv` exports are valid alongside `.txt`.

5. **Tooling**
   - Prefer **`pandas` + `openpyxl`** (or documented export to `.csv`) for agents reading `.xlsx`; if the repo has no Python deps for Excel, document a one-line export path or add a small script under `scripts/`.

6. **Verification**
   - E2E with only `.xlsx` in those folders → Steps 2.5 and 2.75 **run** and produce analysis markdown.

---

**Status:** **Implemented (March 2026):** **106** / **107** / **orchestrator** / **120** workspace notes / **research/README** / **MISSION_LOG** now support **`.txt`**, **`.csv`**, **`.xlsx`**, and **`.xls`** in `brainstorm-sessions/` and `win-loss-interviews/`, with **`scripts/dump_research_folder_to_text.py`** + **`scripts/requirements-research-xlsx.txt`** (pandas + openpyxl). Scratch dumps are gitignored via `research/**/brainstorm-analysis/_scratch*.md` and `win-loss-analysis/_scratch*.md`.
