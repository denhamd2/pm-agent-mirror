# PMF Research Workspace

**Organization:** Country-based qualitative research with Braun & Clarke thematic analysis  
**Method:** 6-phase triangulated analysis (SME + Customer + CSV; optional Internal Team + Win-Loss via **106** / **107**)  
**Agents:** **105** (customer + SME synthesis) → optional **106** / **107** → **120-pmf-thematic-analysis.mdc** (report) → **130-pmf-slide-generator.mdc** (full PMF roadmap `.pptx` when needed)  
**Updated:** 22 March 2026

---

## Folder Structure

```
research/
├── [Country]/                         # e.g., Japan, India, GCC
│   ├── raw-data/                      # CSV data files
│   │   ├── Opportunity Detail.csv     # Win-Loss opportunities
│   │   └── Idea Responses.csv         # Customer feature requests
│   │
│   ├── internal-sme-transcripts/      # .txt files
│   │   ├── sme-interview-001.txt      # Internal expert interviews
│   │   ├── sme-interview-002.txt
│   │   └── ...
│   │
│   ├── customer-transcripts/          # .txt files
│   │   ├── customer-interview-001.txt # Customer interviews
│   │   ├── customer-interview-002.txt
│   │   └── ...
│   │
│   ├── brainstorm-sessions/           # .txt — optional input for **106-brainstorm-analyser**
│   │   └── brainstorm_[topic]_[YYYY-MM-DD].txt
│   │
│   ├── win-loss-interviews/          # .txt — optional input for **107-win-loss-analyser**
│   │   ├── win_[Customer]_[date].txt
│   │   └── loss_[Customer]_[Competitor]_[date].txt
│   │
│   ├── brainstorm-analysis/          # **106** output (dated markdown)
│   ├── win-loss-analysis/            # **107** output (dated markdown)
│   │
│   └── thematic-analysis/             # Generated reports
│       └── [YYYY-MM-DD]-[Country]-PMF-Analysis.md
│
├── filter_region.py                   # Helper script (optional)
└── README.md                          # This file
```

---

## Current Countries

- **Japan** - Ready for analysis
- **India** - Ready for analysis  
- **GCC** (Gulf Cooperation Council) - Ready for analysis

---

## How to Add New Research Data

### Step 1: Choose Your Country Folder

Navigate to the appropriate country folder:
- `research/Japan/`
- `research/India/`
- `research/GCC/`

### Step 2: Add Your Data Files

#### CSV Data → `raw-data/`
Place your CSV exports here:
- **Opportunity Detail.csv** - Win-Loss pre-sales opportunities
  - Must include columns: Gap Name, CI Notes, Pain point(s), Proposed Solution, Country Specific Gap Detail
- **Idea Responses.csv** - Customer Ideas and feature requests
  - Must include verbatim/feedback columns

#### Internal SME Interviews → `internal-sme-transcripts/`
Place interview transcripts from internal subject matter experts:
- **Format:** `.txt` files
- **Naming:** `sme-[role]-[date].txt` or descriptive names
- **Content:** Interview transcripts, notes, perspectives from:
  - Product Managers
  - Engineers
  - Sales Engineers
  - Customer Success
  - Implementation Consultants

#### Customer Interviews → `customer-transcripts/`
Place interview transcripts from customers:
- **Format:** `.txt` files
- **Naming:** `customer-[company]-[date].txt` or descriptive names
- **Content:** Interview transcripts, feedback sessions from:
  - End users
  - Administrators
  - Decision makers
  - Implementation partners

#### Internal brainstorm sessions → `brainstorm-sessions/` (optional, **106**)
- **Format:** `.txt`, `.csv`, `.xlsx`, or `.xls` (workshop notes, ideation dumps, idea dashboard exports)
- **Naming:** `brainstorm_[topic]_[YYYY-MM-DD].txt` or spreadsheet exports (suggested)
- **Agent:** **106-brainstorm-analyser.mdc** writes to `brainstorm-analysis/[YYYY-MM-DD]-brainstorm-analysis.md`; uses `scripts/dump_research_folder_to_text.py` + `scripts/requirements-research-xlsx.txt` for spreadsheets
- **GCC E2E:** Orchestrator runs **106** as Step 2.5 when this folder contains any of those file types

#### Win-loss interviews → `win-loss-interviews/` (optional, **107**)
- **Format:** `.txt`, `.csv`, `.xlsx`, or `.xls` (transcripts or **Opportunity Detail** exports)
- **Naming:** `win_[Customer]_[date].txt`, `loss_...`, or `Opportunity Detail.xlsx` (suggested)
- **Agent:** **107-win-loss-analyser.mdc** writes to `win-loss-analysis/[YYYY-MM-DD]-win-loss-analysis.md`; same spreadsheet helper as **106**
- **GCC E2E:** Orchestrator runs **107** as Step 2.75 when this folder contains any of those file types

### Step 3: Request Analysis

Once your data is in place, simply say:

```
"Analyze Japan"
"Analyze India"
"Analyze GCC"
```

The PMF Research Specialist will:
1. Read all transcripts (.txt files) and CSV data
2. Generate shorthand codes from the data
3. Cluster codes into PMF themes
4. **Triangulate**: Cross-reference SME vs Customer perspectives
5. Produce a comprehensive report with:
   - Triangulation Matrix (where do SMEs and Customers agree/disagree?)
   - High-Intensity Quotes (direct evidence from transcripts)
   - Product Roadmap Impact (actionable recommendations)

---

## Analysis Output

Your thematic analysis report will be saved to:
```
research/[Country]/thematic-analysis/[YYYY-MM-DD]-[Country]-PMF-Analysis.md
```

### Report Includes:

#### Executive Summary
- Critical PMF blockers identified
- Convergence status (SME-Customer alignment)
- Recommended immediate actions

#### Triangulation Matrix
| Theme | SME Perspective | Customer Perspective | Convergence | Divergence | PMF Impact |
|-------|----------------|---------------------|-------------|-----------|-----------|

When **106** (brainstorm analysis) and/or **107** (win-loss analysis) outputs exist for the same run, **120** adds **Internal Team (106)** and/or **Win-Loss (107)** columns (see **120-pmf-thematic-analysis.mdc**).

This shows where internal experts and customers align or disagree on PMF challenges.

#### For Each Theme:
- **Description**: What the pattern means for PMF
- **Triangulation Analysis**: SME vs Customer views
- **High-Intensity Quotes**: Direct quotes from your transcripts
- **Supporting Codes**: Shorthand codes (e.g., `UI-Complexity`, `Board-Integration-Gap`)
- **PMF Impact**: Severity and type of blocker
- **Product Roadmap Impact**: Immediate, medium-term, and long-term actions

#### Cross-Theme Insights:
- **Convergence Patterns**: High-confidence gaps (SME + Customer agree)
- **Divergence Patterns**: Areas needing investigation
- **SME-Only Themes**: Internal concerns to validate with customers
- **Customer-Only Themes**: Customer needs to validate with SMEs

---

## Methodology: Braun & Clarke 6 Phases

### Phase 1: Familiarization
Read all transcripts (.txt) and CSV verbatims

### Phase 2: Generating Initial Codes
Create shorthand codes (e.g., `UI-Complexity`, `Board-Integration-Gap`)

### Phase 3: Generating Themes
Cluster codes into broader PMF patterns

### Phase 4: Reviewing Themes
**Critical**: Cross-reference SME vs Customer perspectives (Triangulation)

### Phase 5: Defining & Naming Themes
Clear descriptions with PMF implications and triangulation status

### Phase 6: Producing the Report
Comprehensive markdown report with triangulation matrix and roadmap impact

---

## Data Requirements

### Transcript Files (.txt)
- **Format**: Plain text
- **Content**: Interview transcripts, meeting notes, feedback sessions
- **Structure**: Free-form text, no specific format required
- **Best Practice**: Include interviewer questions and interviewee responses

Example:
```
Interviewer: What are your biggest challenges with recruiting in Japan?

Customer: The main issue is that we can't integrate with the local job boards
like Rikunabi or Mynavi. We have to manually post jobs, which takes hours.
Our recruiters are frustrated because they can't source candidates effectively.

Interviewer: How does this impact your recruiting efficiency?

Customer: We estimate we lose 10-15 hours per week per recruiter just on 
manual posting. And we're missing out on the best candidates because they're
on these local platforms we don't have access to.
```

### CSV Files
- **Opportunity Detail.csv**
  - Columns: Gap Name, Gap ID, CI Notes, Pain point(s), Proposed Solution, Country Specific Gap Detail
  
- **Idea Responses.csv**
  - Columns: Idea text, verbatims, customer feedback

---

## Quality Standards

The PMF Research Specialist follows strict quality criteria:

✅ **Always:**
- Read ALL data sources (every transcript, every CSV)
- Generate shorthand PM-friendly codes
- Create triangulation matrix (SME vs Customer)
- Include direct quotes from transcripts
- Cite specific sources (transcript names, Gap IDs)
- Assess convergence/divergence for each theme
- Provide actionable Product Roadmap Impact

❌ **Never:**
- Skip any data source
- Create themes without triangulation
- Use vague theme names
- Cherry-pick quotes
- Ignore divergence between perspectives
- Provide themes without roadmap recommendations
- Guess or make up data

---

## Example Workflow

### Scenario: Analyze Japan PMF Gaps

**Your Preparation:**
1. Add 5 SME interview transcripts to: `research/Japan/internal-sme-transcripts/`
2. Add 8 customer interview transcripts to: `research/Japan/customer-transcripts/`
3. Add CSV files to: `research/Japan/raw-data/`

**Request:** "Analyze Japan"

**Agent Process:**
1. Reads all 13 transcripts + 2 CSV files
2. Generates 65 shorthand codes tagged by source [SME], [Customer], [CSV]
3. Clusters into 6 candidate themes
4. Cross-references SME vs Customer perspectives
5. Refines to 4 robust themes:
   - 2 converged (SME + Customer agree) → High priority
   - 1 diverged (SME + Customer disagree) → Needs investigation
   - 1 customer-only → Validate with SMEs
6. Writes comprehensive report with triangulation matrix
7. Saves to: `research/Japan/thematic-analysis/2026-03-17-Japan-PMF-Analysis.md`

**Your Result:**
- Triangulation matrix showing where SMEs and Customers align
- High-intensity quotes providing evidence
- Actionable Product Roadmap Impact for each theme
- Clear prioritization based on convergence status

---

## Tips for Best Results

### Transcript Quality
- **Verbatim is best**: Capture actual words spoken
- **Include context**: Note who is speaking (role, company)
- **Capture emotion**: Note strong reactions, frustrations, excitement
- **Ask follow-ups**: "Can you give me an example?" "Tell me more about that"

### Data Volume
- **Minimum per country**: 3-5 SME transcripts, 5-10 customer transcripts, CSV data
- **Optimal**: 5-10 SME transcripts, 10-20 customer transcripts, comprehensive CSV data
- **Saturation**: Stop when no new codes or themes emerge

### Regional Focus
- **Country-specific**: Keep data organized by country for regional PMF analysis
- **Comparative**: Run analysis for multiple countries to compare PMF challenges
- **Global patterns**: Look for themes that appear across multiple countries

---

## Integration with Other Agents

### Market Intelligence (100)
- Quantitative context for qualitative themes
- Cross-reference with market research

### PRD Specialist (200)
- Feed PMF themes into problem statements
- Use triangulated insights for requirements
- Reference convergence/divergence in validation

### Execution Planner (300)
- Themes become epics
- Codes become user stories
- Triangulation status informs prioritization

### Slide Generator (110)
- Create executive briefings on PMF findings
- Visualize triangulation matrix
- Present convergence/divergence insights

---

## Adding New Countries

To add a new country for analysis:

```bash
mkdir -p research/[Country]/{raw-data,internal-sme-transcripts,customer-transcripts,thematic-analysis}
```

Example for Australia:
```bash
mkdir -p research/Australia/{raw-data,internal-sme-transcripts,customer-transcripts,thematic-analysis}
```

Then add your data files and request: "Analyze Australia"

---

## Troubleshooting

### "No data found for [Country]"
- Verify files are in the correct folders
- Check that transcripts are .txt format
- Ensure CSVs are named correctly

### "Weak themes with little evidence"
- Add more interview transcripts
- Ensure transcripts have sufficient depth
- Check that CSV data is comprehensive

### "High divergence between SME and Customer"
- This is valuable! It indicates communication gaps
- Conduct follow-up interviews to understand why
- Document in report for further investigation

---

## Current Status

**Countries Ready:** Japan, India, GCC  
**Agents:** 120-pmf-thematic-analysis.mdc + 130-pmf-slide-generator.mdc (active)  
**Method:** Braun & Clarke 6-phase with triangulation  
**Last Updated:** Tuesday Mar 17, 2026

---

## Next Steps

1. **Add your data files** to the appropriate country folders
2. **Request analysis**: "Analyze [Country]" (**120**); for the v30-parity deck, chain **130** or use GCC E2E in **000**
3. **Review report** in `research/[Country]/thematic-analysis/`
4. **Act on insights**: Use triangulation matrix and roadmap impact to prioritize

---

**Ready to analyze! Drop your files and specify your country.** 🚀
