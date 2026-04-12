# PMF Slide Section Reference (130)

Detailed content specifications for each section of the PMF Roadmap deck. Referenced by `130-pmf-slide-generator.mdc` during deck generation.

**When generating a deck**, read this file in full alongside the finalized @pmf-analyst report, @product-strategy-agent outputs (PESTEL, SWOT, strategy context), and `010-style-guide.mdc` → Deck Generation. The parent rule **`130-pmf-slide-generator.mdc`** lists this path as **mandatory input 7** and as **MCP Workflow step 1**.

**Typography and layout**: See `010-style-guide.mdc` → Deck Generation for canonical standards.

---

## Deck structure (detailed specifications)

_Target ~50-60 slides for v65 parity; McKinsey-style tone._

**MANDATORY: Every new versioned deck MUST include ALL sections below unless user explicitly requests a "focus deck." Do not be too strict about matching v65 length exactly; it's only indicative.**

## Section 1: Title + Executive Summary

1. **Title + Executive Summary** (**v65 parity: 2–3 slides**)
   - Title: [Region] Recruiting Product-Market Fit Research
   - **Subheader format (MANDATORY)**: Use "[Month YYYY]" only (e.g., "March 2026")
     - ❌ FORBIDDEN: "Thematic analysis and roadmap — March 2026 (v63)"
     - ❌ FORBIDDEN: Adding methodology or version references to subheader
     - ✅ CORRECT: "March 2026"
   - Section divider (optional)
   - **Executive Summary** (VP-appropriate detail and language)
   
  **Executive Summary slide requirements (VP of Product Management audience):**
  - Title: "Executive Summary" (simple, direct)
  - Sub-header (level 0, 14pt bold): "Headline outcomes" or "Key findings"
  - **MANDATORY DENSITY CAP: Maximum 4 level 1 bullets** (reduced from 4-5 to prevent overspill). **Character limit: 200-250 characters per bullet** (target 220 chars for rich 2.5-line rendering). Bullets must cover:
     - Primary friction themes across the hire funnel (specific pain points, not generic summaries)
     - Critical compliance or localization gaps with business impact (e.g., "Nationalisation tracking via custom fields; appetite for first-class reporting")
     - Key technology or workflow gaps validated by multiple sources (customer + win-loss + competitive)
     - Strategic direction from Priority Recommendations (1-2 sentence synthesis)
   - **Total rendered lines target: 7-8 lines** (4 bullets × 2 avg lines = 8 lines; acceptable for executive synthesis)
   - **Overflow mitigation**: If synthesizing 5+ key insights, use TWO Executive Summary slides (Part 1: Headline Outcomes, Part 2: Strategic Direction) rather than cramming all into one overspill slide
     - Triangulation strength (e.g., "106 surfaces massive Communications volume; 108 shows Severity 2-3 gaps in messaging and apply friction")
     - Strategic roadmap direction (3-5 Priority 1 slides, or similar framing)
   - Each bullet: **2-3 sentences** for executive context (NOT compressed research notes)
   - Use **cause → impact → implication** structure where possible
   - Avoid agent-specific language (see Executive Language Standard above)
   - Speaker notes: Expand on top 2-3 findings, commercial implications, urgency


## Section 2: Research Challenge

2. **SECTION: Research Challenge** (2 slides with section divider)
   - Section Title: "Research Challenge | Objectives and methodology"
   - Research Question & Objectives
   - (Do NOT include the "Research Approach - 5-Phase Framework" slide)

## Section 3: Context Review

3. **SECTION: Context Review** (**2 separate slides** with section divider — **v65 parity**)
   - Section Title: "Context Review | Strategic context"
   - **Slide 1**: "Strategic Context - Why [REGION] Now" (substitute actual region name, e.g., GCC, France, Japan; content: market forces, buying committee dynamics, enterprise consolidation narrative)
   - **Slide 2**: "[REGION] Market Momentum - Key Indicators" (substitute actual region name; content: market size, CAGR, smartphone penetration, digital transformation metrics)
   - **Do NOT combine into one slide**; v65 separates strategic narrative from quantitative indicators for emphasis and pacing

## Section 4: Product Strategy

3a. **SECTION: Product Strategy** (**NEW - 1-3 slides** with section divider)
   - Section Title: "Product Strategy | Talent Acquisition priorities"
   - **Slide 1**: "Q2 2026 Product Priorities" (top 3-5 strategic initiatives; **ALWAYS INCLUDE**)
     - Source: `research/[REGION]/strategy-context-[YYYY-MM-DD]-[MISSION-ID].md` from Step 1
     - Content: Strategic priorities from Step 1 (e.g., "GCC Market Readiness", "AI Candidate Matching", "Compliance-First Design")
     - Format: Bullet list with initiative name + 1-2 sentence description + target outcomes
     - Speaker notes: Context on why these are priorities, how they inform roadmap
   
   **Regional Narrative Adaptation (CRITICAL for Non-GCC Decks):**
   
   When generating Product Strategy slides for NON-GCC regional decks (India, France, Japan, UK, Germany, Canada, Australia):
   
   **Slide 1 (Q2 Priorities) - Focal Region First:**
   - **Lead bullet**: Start with the FOCAL REGION's strategic importance, target, and key features
     - Extract from strategy-context Regional Expansion table: [Region] row with Priority Level, Q2 Target, Key Features
     - Format: "[REGION] [priority descriptor]: [target] targeted; [key features]; [why now/strategic rationale]"
     - Example for India: "India scale growth: 8 customers targeted in Q2 with focus on DPDP compliance programmes and local job board reach through certified partner distribution"
   - **Supporting bullets**: Reframe corporate priorities (GCC if Priority 1, AI, Core ATS) in terms of how they SUPPORT or CONTEXTUALIZE the focal region
     - Add regional relevance clause: "...India [direct/indirect benefit]"
     - Example: "AI candidate matching: India volume hiring aligns strongly when disclosure and human oversight are credible"
   - **Order**: Focal region first, then corporate priorities adapted with regional lens
   
   **Slide 2 (Regional Expansion) - Focal Region at Top:**
   - **First bullet**: Focal region with full detail (priority level, target, key features)
   - **Subsequent bullets**: Other strategic regions (GCC, Japan, etc.) as context
   - **Order matters**: An India deck lists India first, NOT GCC first
   - Example for India deck:
     1. "India: high priority for scale growth with 8 customers targeted; DPDP compliance and local boards"
     2. "GCC: highest corporate priority with 10 customers; provides patterns for compliance"
     3. "Japan: medium-high with 5 expansions; multinational templates cross-link in RFPs"
   
   **Detection Rule:**
   - If deck [REGION] == "GCC": Use corporate order (Priority 1 GCC first)
   - If deck [REGION] != "GCC": Apply regional adaptation (focal region first)
   
   **Verification:**
   - Read strategy-context Regional Expansion table to get focal region's row data
   - Ensure focal region appears in first bullet of BOTH slides (Q2 Priorities and Regional Expansion)
   
   - **Slide 2 (optional)**: "Regional Expansion Strategy" (GCC/APAC/EMEA priorities)
     - Content: Which regions are strategic priorities (High/Medium/Low)
     - Include only if regional context is relevant to deck audience
     - Example: GCC deck includes GCC (High), Japan (Medium), India (Medium)
   - **Slide 3 (optional)**: "Competitive Positioning - Our Differentiation"
     - Content: Competitive positioning themes (suite depth, AI, compliance)
     - Include only if competitive positioning is central to recommendations
     - Example: "Suite adjacency", "AI-powered matching", "Compliance-first"
   - **Content Guidelines**: Strategic context, NOT detailed research findings
   - **Tone**: Forward-looking, business-focused, executive-appropriate
   - **Placement**: After "Strategic Context" section, before PESTEL

## Section 5: PESTEL Analysis

4. **SECTION: PESTEL Analysis** (7 slides with section divider)
   - **SOURCE**: Read from `research/[Country]/pestel-analysis-[Country]-[YYYY-MM-DD]-[MISSION-ID].md` (@product-strategy-agent Step 2 output), NOT from @pmf-analyst report PESTEL sections
   - Section Title: "PESTEL Analysis | Political, Economic, Social, Technological, Environmental, Legal"
   - **Political** (full slide with nationalization mandates, penalties) — title is factor name only, no "PESTEL -" prefix
   - **Economic** (full slide with market data, CAGR, investment trends)
   - **Social** (full slide with communication channel stats, smartphone penetration, cultural factors)
   - **Technological** (full slide with AI, government portals, integrations)
   - **Environmental** (full slide, DATA GAP if no recruiting signal)
   - **Legal** (full slide with PDPL, interview regulations, compliance requirements)

   **PESTEL MINIMUM DEPTH ENFORCEMENT (MANDATORY PRE-GENERATION)**

   Before finalizing any PESTEL slide JSON, verify EACH factor slide meets ALL requirements:

   **For each PESTEL factor slide (Political, Economic, Social, Technological, Environmental, Legal):**

   1. **Bullet count**: **EXACTLY 5 level-1 bullets** (NOT 4-5 range; 5 is mandatory for VP depth)
      - Environmental factor exception: minimum 4 bullets ONLY if DATA GAP exists
      - NO EXCEPTIONS for other five factors (Political, Economic, Social, Technological, Legal)
      - If @product-strategy-agent PESTEL file has <5 substantive points for a factor, add level-2 sub-bullets under 2-3 parents to reach visual density

   2. **Sentence count per bullet (BLOCKING VALIDATION)**:
      - EVERY level-1 bullet MUST contain **2-3 complete sentences**
      - Count periods, exclamation marks, question marks as sentence terminators
      - Single-sentence bullets are FORBIDDEN and BLOCK generation
      - If source content is thin, expand with:
        - Sub-points from @product-strategy-agent PESTEL markdown
        - Context from @pmf-analyst Competitive Landscape section
        - Customer quotes from @pmf-analyst themes mentioning the factor

   3. **Anchor requirement per bullet**:
      - Each bullet MUST contain ≥1 concrete anchor (named law/programme/portal, year, percentage, currency+amount, article citation, source name)
      - Minimum 5 total anchors across all bullets per slide (3 minimum for Environmental)
      - Named law/programme/portal (e.g., "Nitaqat", "MOHRE", "Mudad", "PDPL")
      - Year or date (e.g., "2026-2028", "March 2026", "Royal Decree 2023")
      - Percentage or statistic (e.g., "91% smartphone penetration", "40%+ mobile apply")
      - Currency + magnitude (e.g., "USD 5,483.5 million", "AED 108,000")
      - Article/decree citation (e.g., "Royal Decree M/19", "Art. 6 GDPR")
      - Named authority/source (e.g., "Astute Analytica", "Statista", "DLA Piper", "BCG")

   4. **Bullet richness validation**:
      - Each bullet must be 40-80 words (2-3 sentences of appropriate depth)
      - Use cause → impact → implication structure where possible
      - Include specific data points and context from @product-strategy-agent PESTEL analysis
      - ❌ "Economic growth is strong in GCC" (generic, no anchor, 1 sentence)
      - ✅ "GCC HCM software market growth narratives through 2030 appear across industry syntheses; Astute Analytica cites HR tech valuation toward USD 5,483.5 million by 2032 (definitions vary)." (2 sentences, currency anchor, source name, caveat)

   5. **Product Implication**: ≥50 words with TWO clear clauses
      - Clause 1: What Workday must build/support (specific capabilities)
      - Clause 2: Why/compliance/business justification
      - Use period or semicolon to separate clauses (not run-on)

   6. **Speaker notes**: Minimum 5 bullets + References section

   **BLOCKING VALIDATION (Execute BEFORE create_presentation)**:

   For EACH PESTEL factor slide in draft JSON:

   **Automated checks**:
   1. **Count level-1 bullets**: Must equal 5-6 (3 for Environmental if DATA GAP)
   2. **Count sentences per bullet**: Extract text (handle both string and array-of-runs format), count sentence terminators (`. ` or `! ` or `? `)
      - If ANY bullet has <1 complete sentence: BLOCK and expand from @product-strategy-agent PESTEL file
   3. **Count characters per bullet**: Measure longest bullet's character count
      - If ANY bullet >160 characters: BLOCK and tighten language (target 120-140 chars to fit 1.5-2 lines)
   4. **Count anchors**: Scan for digits+%, currency symbols, year patterns (20XX), named programs, article citations (Art. X)
      - If total anchors <5 (or <3 for Environmental): BLOCK and enrich from @product-strategy-agent PESTEL research
   5. **Count words for Product Implication**: Must be 40-50 words (hard max 70 words)
      - If <40 words: BLOCK and expand to include both clauses (capability + justification)
      - If >70 words: BLOCK and tighten (will overflow beyond 2 lines)
   6. **Verify speaker notes**: Must have ≥5 bullets + References section
      - If missing: BLOCK and add presenter guidance

   **If ANY validation fails**:
   - DO NOT proceed to create_presentation
   - Return to content expansion phase
   - Pull additional detail from `research/[Country]/pestel-analysis-[Country]-[YYYY-MM-DD]-[MISSION-ID].md`
   - If @product-strategy-agent PESTEL file is insufficient, flag to orchestrator for @product-strategy-agent revision

   **Example validation output**:
   ```
   PESTEL Validation Results:
   ✅ Political: 5 bullets, 11 sentences (2.2 avg), 7 anchors, 52-word implication
   ❌ Economic: 4 bullets, 6 sentences (1.5 avg), 4 anchors, 35-word implication
     → BLOCKING ISSUE: Only 4 bullets (need 5), avg 1.5 sentences/bullet (need 2-3)
     → ACTION: Expand from @product-strategy-agent Economic factor section before generation
   ```

   **FORBIDDEN**: Padding with filler bullets or generic statements lacking anchors. Quality over count - but reach the anchor and richness standard for VP audience.

  **v65 depth (PESTEL body — do not ship sparse slides):** Each of the **six** factor slides must match **golden v65 density**, not a 3-bullet stub. Before `create_presentation`, verify **every** PESTEL slide meets **all** of:
  - **Bullet count:** **MINIMUM 5** substantive bullet paragraphs at **level 1** (3 for Environmental if DATA GAP) to allow Product implication within 7-line budget. If the **@product-strategy-agent PESTEL file** has rich content (6+ insights), prioritize the 5 most impactful insights with anchors rather than all points. If thin, add **level 2** sub-bullets under 2–3 parents so the slide still reads as **full** (do not pad with filler; pull from PESTEL desk research in @product-strategy-agent's analysis or mark a controlled **DATA GAP** sub-bullet and expand detail in `speaker_notes`).
  - **Anchors:** At least **five** total anchors across all bullets (three for Environmental) transcribed from **@product-strategy-agent PESTEL** (named law, programme, regulator, year, **%**, **currency + magnitude**, portal name, or article citation). **DENSITY ENHANCEMENT**: Pull additional specific facts, statistics, percentages, and monetary figures from @product-strategy-agent PESTEL research to enrich every bullet - VPs expect data-backed assertions, not generic statements. If @product-strategy-agent's markdown truly lacks anchors for that factor, one bullet must state the gap explicitly and speaker notes must carry the source hunt.
  - **Bullet richness**: Each level 1 bullet MUST be **2-3 sentences** (target 180-240 characters, hard limit 280 characters) with specific data points and context from @product-strategy-agent research. Example: NOT "GCC recruiting market is growing with strong government initiatives supporting localization and workforce nationalization goals" (too generic, too vague) BUT "India's consolidated labour codes, including the Industrial Relations Code, were widely reported as notified with implementation discussion into 2026 (Bar and Bench, Economic Times, labour.gov.in). Fixed-term employment parity rules raise the need for contract tracking, tenure visibility, and compliant offer and separation workflows inside the same stack as recruiting." (404 chars, 3 anchors, 2 clauses, rich context).
   - **Hierarchy:** Use **level 2** sub-bullets sparingly (max 1-2 per slide) for nuance, ensuring total slide lines do not exceed 7-8 (e.g. enforcement, tenant variance, product boundary).
   - **Product implication:** One closing paragraph (**level 0**, run-formatted per typography doc) with **40-50 words target (hard maximum 70 words / 2 rendered lines)**, **two clear clauses** (factor context → **specific** recruiting product action). Use period or semicolon to separate clauses. Example: "India's DPDP Act and UIDAI frameworks elevate consent and government-ID verification; Workday must integrate Aadhaar-compatible eKYC with partner APIs while preserving data minimization for European subsidiaries" (35 words, 2 clauses, fits in 1.5 lines).
   - **Speaker notes:** Minimum **five** presenter bullets (story, caveats, “if challenged”) plus **References:** with working URLs — PESTEL is exec-facing; notes carry overflow detail if the 2.8in box is at capacity.
   - **DATA GAP constraint**: DATA GAP cannot replace more than **1 bullet** per factor slide; remaining bullets must cover general factor context with anchored facts. Environmental factor may lack recruiting-specific signals but must still discuss sustainability, climate policy, or resource trends relevant to business environment.

## Section 6: Competitive Landscape

5. **SECTION: Competitive Landscape** (**3** content slides + section divider — **v65 parity**)
   - Section Title: "Competitive Landscape | Regional specialists vs global platforms"
   - Regional specialists (1 slide) — **TABLE MANDATORY (NOT BULLETS)**
   - Global platforms (1 slide) — **TABLE MANDATORY (NOT BULLETS)**
   - **SWOT** — Workday Recruiting in region (1 slide) — **SOURCE**: Read from `research/[Country]/swot-analysis-[Country]-[YYYY-MM-DD]-[MISSION-ID].md` (@product-strategy-agent Step 3 output), NOT from @pmf-analyst report SWOT sections — two-table layout per `010-style-guide.mdc` (mandatory unless focus deck)

   **Competitive Landscape Table Formatting (MANDATORY - WIN/LOSS PATTERN)**

   Regional Specialists and Global Platforms slides MUST use this EXACT formatting pattern (matches working Win/Loss table structure):

   **Table structure**:
   ```json
   {
     "tables": [{
       "rows": [
         ["Vendor", "Key Strengths", "Key Weaknesses", "GCC Fit", "Notes"],
         ["Bayzat", "GCC-first HRMS integrating payroll and hiring; Mudad payroll integration narrative; mobile apply and scheduling features; bundle TCO positioning vs global suites", "Mid-market scope vs enterprise security depth; narrower global footprint; integration depth varies", "Strong statutory adjacency", "Direct competitor to Workday platform"],
         ...
       ],
       "left_inches": 0.35,
       "top_inches": 1.0,
       "width_inches": 9.3,
       "font_size_pt": 8,
       "header_row": true,
       "header_bg_color": "ink",
       "header_font_color": "paper",
       "header_height_inches": 0.25
     }]
   }
   ```

   **CRITICAL FORMATTING RULES**:

   1. **NO bullets within cells**: Use plain text with semicolons or commas as separators
      - ❌ FORBIDDEN: `"• Point 1\n• Point 2\n• Point 3"` (causes font size inconsistency and rendering issues)
      - ✅ CORRECT: `"Point 1; Point 2; Point 3"` (matches Win/Loss pattern for consistent 8pt rendering)

   2. **Font size ONLY at table level**: Set `font_size_pt: 8` at table object level ONLY
      - ❌ FORBIDDEN: Font sizing at cell level, run level, or text_box level
      - ✅ CORRECT: Single `font_size_pt: 8` property on table object

   3. **Header height**: MUST set `header_height_inches: 0.25` for compact professional headers

   4. **NO height_inches on table**: Do NOT specify `height_inches` - omit entirely to allow PowerPoint auto-height

   5. **Content density per cell**: 3-4 distinct points separated by semicolons (NOT line breaks with bullets)
      - Each point: 1-2 sentences maximum
      - Keep cells scannable - avoid paragraph blocks

   6. **Consistent with Win/Loss**: Both Competitive tables and Win/Loss tables use identical formatting approach (plain text, semicolons, table-level font sizing only)

   **Example transformations**:

   **Before (bullet-formatted, PROBLEMATIC)**:
   ```json
   "• GCC-first HRMS, payroll, hiring\n• Mudad payroll and WPS narrative\n• Mobile apply and scheduling marketing\n• Bundle TCO story vs global suite"
   ```

   **After (plain text, semicolon-separated, CORRECT)**:
   ```json
   "GCC-first HRMS integrating payroll and hiring; Mudad payroll integration narrative; mobile apply and scheduling features; bundle TCO positioning vs global suites"
   ```

   **Rationale**: Matches the working Win/Loss table pattern where plain text renders consistently at 8pt without PowerPoint applying default paragraph formatting to bullet lists.

  **SWOT slide requirements (VP audience):**
  - Follow **`010-style-guide.mdc` → Table Styling → SWOT Analysis tables** for structure
  - **Font size: 9pt ONLY** (set at table level for consistent rendering across all cells)
  - **Header height: MUST set `header_height_inches: 0.25`** (CRITICAL - prevents tall navy bars)
  - **CRITICAL: NEVER specify `height_inches` on table object** - omit entirely to allow PowerPoint auto-height based on content (creates compact, balanced layout)
  - **CRITICAL: Consistent row styling** - ALL content rows (Strengths/Weaknesses AND Opportunities/Threats) must have identical styling - no special background colors or text colors for different quadrant rows
  - **Structure: SINGLE 2x2 table** with all four quadrants - first row: Strengths|Weaknesses headers + content, second row: Opportunities|Threats headers + content
  - **Content format**: Each SWOT quadrant cell uses **plain text with semicolons** (SAME as Competitive tables)
    - ❌ FORBIDDEN: `{"paragraphs": [...]}` arrays (MCP does not render paragraphs in table cells)
    - ❌ FORBIDDEN: Unicode bullets `"• Point 1\n• Point 2"` (causes font inconsistency)
    - ✅ CORRECT: `"Point 1; Point 2; Point 3"` (semicolon-separated plain strings)
  - **Detail level**: **EXACTLY 3-5 points per quadrant** (target 4-5 for VP density) with specific capabilities, gaps, opportunities, and competitive threats
  - Each point: Concise but detailed (1-2 sentences) - NOT single-word items or massive paragraphs
  - Example cell content: `"Suite depth hire-to-retire coherence for MNCs; DPDP consent and retention configurable; UDMF native duplicate detection; BGV orchestration via Core Connector; HiredScore AI when licensed"`
   
   **FORBIDDEN**: Using `paragraphs` with bullets for competitive landscape slides. These MUST be `tables` arrays.

## Section 7: Win/Loss Analysis

6. **SECTION: Win/Loss Analysis** (**EXACTLY 3** content slides + section divider — **v65 parity, NO Dataset Overview**)
   - Section Title: "Win/Loss Analysis | [Region]-explicit gaps"
   - **OMIT "Dataset Overview" slide** (PM preference: jump directly to gap themes)
   
   **Win-Loss Data Availability Check (MANDATORY):**
   
   Before generating Win-Loss slides, check 108 analysis output:
   - Read the gap analysis file for the mission (from MISSION_LOG or latest in `research/[Country]/gap-analysis/`)
   - Check Executive Summary for region-relevant row count
   - **If row count = 0 OR analysis states "data gap"**: Generate NO-DATA slide (see spec below)
   - **If row count > 0**: Proceed with standard 3-slide Win-Loss section
   
   **No-Data Slide Spec:**
   - Section divider: "Win/Loss Analysis"
   - EXACTLY 1 content slide (layout: Title Only_Alt)
   - Title: "Win/Loss Analysis"
   - Content: Centered text box (2.0, 2.3, 6.0, 1.5) with message:
     - "No Pre-Sales Data exists for [Region name]."
   - Speaker notes: Note data gap, mention triangulation with customer interviews, ideation signals, and competitive intelligence
   - **DO NOT create**: Gap themes table, charts, or proxy gaps slides when data absent
   
   **Participant Anonymization in Win-Loss Slides (MANDATORY):**
   
   **Win-Loss slides MUST use P1, P2, P3 format** (consistent with rest of deck):
   
   **Apply in Win-Loss slides:**
   - Evidence columns: Use "P1 (Accenture), P2 (Baker Hughes)" format
   - Quote attributions: Use "P1 - Senior Recruiter, Accenture" or "P2 (Baker Hughes)" format
   - Gap descriptions: When referencing customer evidence, use P1/P2/P3 with company in parentheses
   
   **Rationale**: Protects customer privacy while maintaining enterprise credibility through company names. Consistent anonymization throughout the entire deck.
   
   **Gap Description Requirements (VP-APPROPRIATE DEPTH):**
   
   **Each gap** in Win-Loss slides MUST include:
   
   **Gap Description** (3-4 sentences):
   - Specific pain point with workflow context
   - Scale indicators (candidate volumes, time costs, frequency)
   - Business impact (deal risk, efficiency loss, compliance exposure)
   
   **Customer Evidence** (1-2 quotes with P1/P2/P3 attribution):
   - Verbatim snippets (≤20 words per quote)
   - P1/P2/P3 attribution: "P1 (Company)" or "P1 - Role, Company"
   - Include job title if enhances credibility (e.g., "TA Director", "Senior Recruiter")
   
   **Product Implication** (2-3 sentences):
   - Recommended roadmap action
   - Workday competitive positioning context
   - Deployment Agent workaround reference if validated
   
   **Example (full gap entry):**
   ```
   Nationalisation reporting - Emirates and Saudization workforce tracking. Customers managing 5,000+ employees need auditable dashboards showing nationality composition, hiring source analysis, and manager accountability for government compliance. Penalties range from AED 108,000 per missing Emirati (UAE) to Nitaqat sanctions (Saudi Arabia).
   
   Evidence: "We track via custom fields but want US/UK diversity parity for Middle East mandates. The penalties are real." — Mahboob Khan, TA Director, Baker Hughes
   
   Severity: 🟡 MEDIUM (reduced from HIGH after Deployment Agent confirmed strong workaround: Custom reports with Worker_Additional_Data + Prism Analytics)
   
   Product implication: Evaluate native compliance reporting module with pre-built nationalisation templates, MOHRE/Nitaqat export readiness, and government portal integration patterns to reduce configuration burden.
   ```
   
   **Table cell constraints**:
   - If using table format: Gap column width_inches: ~2.5-3.0 for wrapped text; font_size_pt: 7-8
   - If text_boxes format: Use paragraphs with theme subheaders (14pt bold) + bullets (12pt) for better readability
   
   **Chart requirements**:
   - Maintain Gap Theme Chart slide (horizontal bar chart showing frequency/severity)
   - Add optional: Customer attribution in chart speaker notes or adjacent text box with key quotes
   
   **EXACTLY 3 CONTENT SLIDES** (per v65 structure, when data exists):
     1. **Top N gap themes** (severity-weighted; **table format preferred** OR text_boxes with theme subheaders + detailed bullets with customer quotes)
     2. **Gap analysis charts** (horizontal bar chart)
     3. **GCC-relevant / proxy severity gaps** (table with RAG severity column)
   - **FORBIDDEN**: Creating additional Win/Loss slides for data quality explanations, specific gap themes, or CRM/hygiene clarifications - handle data gaps in speaker notes of the 3 slides above, NOT as separate slides
   - **FORBIDDEN**: Individual slides per gap theme - group into the "Top N gap themes" table slide
   - **Gap analysis charts** (**CRITICAL: Chart Gap Theme, NOT status buckets**):
     - X-axis: Gap Theme names (e.g., "Interview Scheduling", "WhatsApp Integration", "Nationalisation Reporting")
     - Y-axis: Frequency or severity score
     - Chart type: Horizontal bar chart showing Gap Theme distribution
     - **FORBIDDEN**: Charting status buckets (Closed, Do Nothing, Open, Lost, Won) - provides no insight
     - Follow **010-style-guide.mdc** chart font sizing: `category_axis_font_size_pt: 9`, `value_axis_font_size_pt: 9`

## Section 8: Customer Ideation Hub

7. **SECTION: Customer Ideation Hub** (section divider + **3 slides**)
   - Section Title: "Customer Ideation Hub | Internal and market signals"
   - **Customer Ideation Hub / CSV** — **3 slides** when idea or opportunity data exists:
     1. Overview slide with idea counts and scope
     2. Top capability areas by volume (horizontal bar chart)
     3. Key themes from verbatims with quotes (see detailed format below)
   - **REMOVED SLIDE**: "AI Ideas Spotlight" - do NOT create this slide moving forward
   - If no CSV/ideas data exists, insert **DATA GAP** slide only
   
   **"Ideation Hub: Key Themes" slide format (MANDATORY):**
   - **Slide title**: "Ideation Hub: Key Themes" (exactly this, NOT "Key Verbatim Themes")
   - **Structure**: Theme subheader + 3 bullets per theme with customer quotes
   - **Each theme section**:
     - **Theme subheader** (level 0, 14pt bold): Theme name from ideation analysis (e.g., "Req-Questionnaire-Granularity", "Application-UX-Trust", "Comms-Volume-Pain")
     - **3 bullets** (level 1) under each subheader:
       1. Theme description with context (1-2 sentences)
       2. **Customer quote** (if available): Use smart quotes, ≤30 words, followed by **(P[N], Company)** or **(Internal Ideation)** attribution
       3. Product implication or business impact
   - **Target 4-5 themes per slide** (12-15 bullets total) - balance detail vs overflow
   - Keep quotes authentic and specific (not generic paraphrases)
   - Attribute quotes properly: "(P1, Accenture)" or "(Internal Ideation Export)"
   - **Speaker notes**: Context on ideation method, hypothesis validation needs, connection to customer themes, References section
   
   **Example format:**
   ```
   Slide: "Ideation Hub: Key Themes"
   
   [Subheader] Req-Questionnaire-Granularity
   • Recruiters want to select individual questions per req instead of entire questionnaire packs.
   • "Why can't I pick just 3 questions for this role instead of the full 25-question set?" (Internal Ideation)
   • Product opportunity: Modular questionnaire builder could improve req setup efficiency.
   
   [Subheader] Application-UX-Trust
   • Candidates report confusion with multi-step progress and legal name field requirements.
   • "Progress bar shows 50% but I still have 8 screens to go" (Internal Ideation)
   • Impact: Abandoned applications in jurisdictions with complex naming conventions.
   ...
   ```

## Section 9: Internal SME Interviews

8. **SECTION: Internal SME Interviews** (section divider + **3-7 slides** when SME transcripts exist)
   - Section Title: "Internal SME Interviews | Workday expert perspectives"
   - **Intro slide**: "Internal SME Interviews - Workday Experts"
     - 5-6 bullets: Population (N Workday SMEs), roles (VP Product, Field Readiness, Global Services, Enterprise Architects, etc.), multi-customer visibility, timing (date range), triangulation purpose ("Cross-validated with customer interviews for convergence analysis"), limitations ("Internal perspectives supplement but do not replace customer voices")
     - Speaker notes: Overview of SME selection criteria, why internal experts matter for triangulation, how this section complements customer interviews
  - **SME Participants table**: Columns: SME ID, Role, Organisation/Context
    - Rows: SME1-SMEN with anonymized IDs only (NO real names in table - use SME1, SME2, SME3, etc.)
    - Example: SME1 | VP of Talent Product Management | Workday Product Strategy
    - Speaker notes: Include actual SME names in speaker notes ONLY for internal context (e.g., "SME1 = Bernie; SME2 = Fabiola Navarro; etc."). Also note each SME's customer portfolio, credibility, and relevance.
  - **Individual slides per SME** (SME1, SME2, SME3, etc.):
    - Title format: "SME[N] - [Anonymized Role]" (e.g., "SME1 - VP Talent Product Management", NOT "SME1 - Bernie, VP Talent PM")
    - **Font size: 12pt** (MANDATORY - these slides have 7-8 bullets, exceeding the >6 threshold for dense slides per 010-style-guide.mdc)
    - Content structure (**6-8 bullet lines total** to match v65/v81 density):
      - **Theme references as SUB-HEADERS** (NOT bullets): Use **2-3 theme sub-headers** (level 0, 12pt bold) to organize bullets (e.g., "Fraud at India Scale", "Offer Flexibility Patterns").
      - **Quote-led bullets (STRICT ENFORCEMENT)**: **4-5 content bullets total** (level 1, 12pt) starting with quotes or strong paraphrases. **MANDATORY: At least 2 direct quotes per SME slide.**
        - Structure:
          ```
          Theme 1: [Sub-header]
          • Quote-led bullet or insight (180-220 chars). **MANDATORY: Explicitly name reference customers (e.g., Genpact, Accenture, Lowe's) the SME is working with.**
          • Supporting insight or hypothesis
          
          Theme 2: [Sub-header]  
          • Quote-led bullet or insight (180-220 chars).
          • Supporting insight or hypothesis
          ```
    - Speaker notes: Include actual SME name mapping (SME1 = Bernie, etc.), context on SME's customer portfolio, role credibility, how their perspective complements customer evidence, limitations or biases to note
  
  **Placement**: After Ideation Hub (Section 7), before Customer Interviews (renumber to Section 9)
  
  **Content source**: Extract from @pmf-analyst report's structured SME section (when present) OR from `research/[REGION]/105-sme-research-findings.md` (Step 7 output)
  
  **SME Naming Convention - ANONYMIZATION REQUIRED**: Use anonymized SME IDs (SME1, SME2, SME3, etc.) in all slide titles, table rows, and on-slide content. Real names appear ONLY in speaker notes for internal reference. Rationale: Consistent anonymization standard across all research participants (customers use P1-P5, SMEs use SME1-SME5).
   
   **Slide count**: 3-7 slides (section divider + intro + participants table + 1 slide per SME). For India (5 SMEs) = 8 slides total for this section.
   
   **Conditional**: Only generate this section if `research/[REGION]/internal-sme-transcripts/` contains ≥1 .txt file OR if `research/[REGION]/105-sme-research-findings.md` exists. If no SME transcripts, skip section entirely.

## Section 10: Primary Research

9. **SECTION: Primary Research** (section divider + **interviews** — **v65 parity**)
   - Section Title: "Primary Research | Customer interview participants"
   - Strip intro (e.g. participant count, date range)
   - Interview Participants (P1, P2, P3 with roles and companies)
   - One slide per customer: P1, P2, P3… (quotes + themes)


   **v65 depth (Primary research / customer interview slides — do not ship theme stubs):**
   - **Strip intro slide title:** Use executive-friendly format: "1:1 Customer Interviews - [Region] Enterprise" (NOT technical format like "Customer Interviews | 3 GCC-market enterprise participants (semi-structured)"). Put methodology detail in bullets and speaker notes.
   - **Strip intro slide content:** Minimum **six** **level 1** bullets in executive tone:
     - Population: "Three senior recruiting leaders from GCC-focused enterprises" (NOT "n = 3 anonymised customer interviews")
     - GCC relevance: "Organisations with substantial Middle East hiring operations"
     - Date range: "Research conducted March 2026" (NOT "Timing: transcripts ingested...")
     - Method: "In-depth semi-structured interviews exploring hiring workflows, compliance needs, and technology gaps" (NOT "...aligned to Braun & Clarke")
     - Data sources: "Interview transcripts analyzed" (keep file paths in speaker notes ONLY)
     - Triangulation: "Cross-validated with internal ideation data, presales gap analysis, and regulatory research" (NOT "cross-checked with 106, 108, PESTEL")
     - Optional level 2 bullets for scope or limitations

   - **Participants table slide:** Keep table; if the report adds **hiring volume**, **req scale**, or **tooling** context per participant, add a **small** **level 1** bullet list (2–4 bullets) *below* or in an adjacent `text_box` only if the MCP layout supports it without crushing the table — otherwise put overflow in **speaker notes** (minimum **five** bullets for this slide).
   - **One slide per customer (P1, P2, P3…):**
    - Title format: "P[N] - [Role], [Company]" (e.g., "P1 - Senior Recruiter, Accenture") — keep under 60 chars
    - **6-7 bullet lines total** (reduced from 7-8 to prevent overflow)
     - Count: level-0 theme subheaders + level-1 bullets + level-2 sub-bullets
     - **Character limits**: 180-220 characters per level-1 bullet (2-2.5 lines), 120-160 characters per level-2 sub-bullet
     - 7 lines is target; 6 is acceptable; 8+ triggers overspill and blocks generation
    - **Font size: 12pt** (MANDATORY - these slides have 6-7 bullets, exceeding >6 threshold per 010-style-guide.mdc)
    - **Theme references as SUB-HEADERS** (NOT bullets): Use **2-3 theme sub-headers** (level 0, 12pt bold) to organize bullets (e.g., "Candidate Review Efficiency", "Communication Channel Preferences").
    - **Quote-led bullets (STRICT ENFORCEMENT)**: **4-5 content bullets total** (level 1, 12pt) starting with quotes. **MANDATORY: At least 1 direct quote per participant slide.**
      - Structure:
        ```
        Theme 1: [Sub-header]
        • Quote-led bullet (180-220 chars)
        • Supporting insight
        
        Theme 2: [Sub-header]  
        • Quote-led bullet (180-220 chars)
        • Supporting insight
        ```
      - Format: "Quote text" - insight/context (P[N], Company)
      - Quote length: ≤30 words
      - Attribution: (P[N], Company)
      - If report has <4 quotes for participant, use 3 minimum
      - NEVER use fewer than 3 quotes
    - **JTBD statements (STRICT ENFORCEMENT)**: **EXACTLY 2-3 full JTBD statements** (level 1, 12pt)
      - Format: When [situation], I want [action], so I can [outcome]
       - Each JTBD is one complete line (level-1 bullet)
       - If report has <3 JTBD for participant, minimum 2 required
       - NEVER use fewer than 2 JTBD
     - **Remaining bullets**: Pain points, workarounds, volume context, compliance needs, product implications
       - Each bullet: 1-2 sentences with specific detail
       - Use **level 2** sub-bullets sparingly for nuance (max 2 per slide)
     - **Expand detail**: Transform compressed research notes into full sentences
       - NOT: "Scheduling friction"
       - YES: "Interview scheduling requires phone confirmation and three-day notice per Saudi labor law; automation gaps force manual calendar coordination"
   - **Speaker notes (per-customer slides):** Minimum **five** presenter bullets (which theme to stress, follow-up quotes, contradictions, commercial tone) plus **References:** transcript filename or path from the report.

## Section 11: Thematic Analysis

10. **SECTION: Thematic Analysis** (**Grouped or Individual slides** + section divider + triangulation matrix)
   - Section Title: "Thematic Analysis | Themes and triangulation"
   - **Two valid formats**:
     - **(a) Grouped pattern (v65)**: 2-3 slides with 3-4 themes per slide, 3 bullets per theme. Use when themes exceed 5 or evidence is thinner.
       - Slide 1: "Themes 1-4 ([Category Label])" - 3-4 theme subheaders
       - Slide 2: "Themes 5-6 ([Category Label])" - 3-4 theme subheaders
     - **(b) Individual pattern (v90)**: One slide per theme with quote-led evidence, operational context, business impact, and product implications. Use when report has 3-5 well-evidenced themes.
   - Cross-Source Validation Matrix (triangulation table: Theme | P1 | P2 | P3 | CSV | PMF Impact)
   
   **Thematic slide requirements (VP-FRIENDLY & DETAILED):**
   - **Font size: 12pt** for grouped pattern, **14pt** for individual pattern.
   - **Each theme gets**:
     - **Theme subheader** (level 0, bold): Theme name (e.g., "Candidate review efficiency", "Search and AI-assisted matching")
     - **Bullets** (level 1) under each theme subheader. MUST include:
       1. **Key Insight**: Specific finding with customer evidence.
       2. **Direct Quote**: A key quote from a participant or SME.
       3. **Customer Names / Data Points**: Explicitly name customers or specific data points (e.g., 700K volume).
       4. **Business Impact**: Effect on win rates, ARR, retention, or competitive position.
       5. **Product Implications**: Workday Recruiting roadmap implications.
   - Transform raw research language into executive-ready narrative (no technical codes or jargon)
   - Use **cause → impact → implication** structure in bullets
   - **Speaker notes**: Minimum 5 bullets covering cross-theme patterns, triangulation strength, commercial implications, plus References section
   
   **Example structure (Individual pattern - v90):**
   ```
   Slide Title: "Theme 1: Candidate review efficiency"
   
   • GCC recruiters managing 50-100 candidates face navigation friction...
   • "Quote from P1 about the pain point" (P1, Company)
   • Business impact: Primary churn driver for high-volume customers...
   • Product opportunity: Streamlined workflows could reduce time-to-fill 15-20%...
   ```
   
   **FORBIDDEN**: 
   - Using raw theme codes like "T1 Candidate review density: 3/3 customers"
   - Fewer than 3 bullets per theme
   - More than 4 themes on one slide (causes overflow in grouped pattern)

## Section 12: Full Funnel / Gap Diagnostic

12. **SECTION: Full Funnel / Gap Diagnostic** (**1–2 slides** — **v65 parity**)
   - Title: "Gap Analysis" (exactly this, do not use other titles)
   - **TABLE FORMAT MANDATORY** (NOT bullets):
     - Columns: Funnel Stage | Gap Description | Severity | Workaround | Evidence | Product Implication
     - Severity column uses **RAG visual indicators**:
       - 🔴 **HIGH** (Red) - No workaround, blocks hiring workflow
       - 🟡 **MEDIUM** (Amber) - Workaround exists but painful/costly
       - 🟢 **LOW** (Green) - Minor friction, acceptable workaround
     - Minimum 6 funnel stages: Attract, Convert, Screen, Schedule, Offer, Comply, Measure
     - Gap Description: 2-3 detailed sentences per row (NOT 1-line summaries)
     - Evidence: Specific customer names + companies (NOT P1-P3); use Win-Loss attribution format
     - Product Implication: Clear roadmap action item
   - Table formatting: Font 7-8pt, `top_inches: 1.0`, `height_inches: 3.5-4.0`
   - Speaker notes: Expand highest-severity gaps, commercial impact, urgency
   
   **Gap Analysis - Deployment Agent Validation (MANDATORY PRE-GENERATION):**
   
   Before finalizing the Gap Analysis table in slides_spec JSON, validate EVERY gap via Deployment Agent MCP to surface existing workarounds and adjust severity accordingly.
   
   **Validation Protocol (execute for EACH gap):**
   
   1. **Extract gap capability** from @pmf-analyst report Full Funnel section
      - Example capabilities: "Nationalisation reporting", "WhatsApp messaging", "Interview scheduling", "Candidate grid configuration", "Arabic document rendering"
   
   2. **Query Deployment Agent** using `CallMcpTool`:
      ```
      Server: "user-deployment-agent"
      Tool: "ask_deployment_agent"
      Arguments: {
        "question": "In Workday Recruiting, how can customers [achieve specific capability]? Please provide: (1) any native features available today, (2) configuration options or settings, (3) custom report approaches, (4) documented workaround patterns. Be specific about what's possible and what's not."
      }
      ```
      - Use a NEW threadId per gap OR same thread for all gaps in one mission (for continuity)
      - Parse response for workaround strength
   
   3. **Evaluate workaround strength**:
      - **Strong workaround** (severity reduction justified):
        - Native feature available with configuration
        - Well-documented custom report pattern with minimal friction
        - Standard security/process setup (not complex)
        - Example: "Custom reports with Worker_Additional_Data + Prism Analytics" for nationalisation tracking
      - **Weak workaround** (keep original severity):
        - Requires extensive custom fields + manual exports
        - Undocumented or high-effort approach
        - Requires multiple 3rd-party tools
        - Example: "Partner tool + offline Excel reconciliation"
      - **No workaround** (keep original severity):
        - Deployment Agent confirms true gap
        - No native or configuration-based alternative
        - Example: "First-party WhatsApp in core Recruiting UI - not available"
   
   4. **Adjust severity** (if strong workaround found):
      - 🔴 HIGH → 🟡 MEDIUM
      - 🟡 MEDIUM → 🟢 LOW
      - Document reason: "(Strong workaround via [specific approach] - severity reduced)"
   
   5. **Update table row**:
      - Gap column: Use @pmf-analyst report description (3-4 sentences with scale/impact)
      - Severity column: Adjusted RAG indicator + validation note if changed
      - Workaround column: Deployment Agent-validated specific approach (not guessed)
      - Evidence column: Customer names + companies + quote snippets (not P1-P3)
      - Product Implication column: 2-3 sentences with roadmap action
   
   **Speaker Notes Addition (MANDATORY):**
   Add to Gap Analysis slide speaker_notes:
   ```
   "• Gap severities validated via Deployment Agent queries (March 2026)
   • Strong workarounds identified: [list gaps where severity reduced]
   • True gaps confirmed: [list gaps with no viable workaround]
   • Workaround detail supports sales/PS objection handling
   
   References:
   • Deployment Agent thread: [threadId]
   • research/[Country]/thematic-analysis/[date]-[Country]-PMF-Analysis.md"
   ```
   
   **Example Validation Cycle:**
   
   **Gap: "Nationalisation reporting"**
   Initial severity (from @pmf-analyst): 🔴 HIGH
   
   **Query**: "In Workday Recruiting, how can customers track and report on nationalisation compliance for Saudi Arabia and UAE (Emiratization, Saudization)? Please provide: (1) any native features available today, (2) configuration options or settings, (3) custom report approaches, (4) documented workaround patterns. Be specific."
   
   **Response** (hypothetical based on DA29 thread patterns):
   "Customers can configure custom Worker_Additional_Data fields for nationality attributes. Custom Reports support calculated fields for percentage by nationality, hiring source analysis, and manager drill-downs. Prism Analytics enables multi-tenant benchmarking for workforce composition. This requires initial configuration but provides robust, auditable reporting. Out-of-the-box nationalisation dashboards are not available (workaround approach)."
   
   **Evaluation**: STRONG workaround (configurable, well-supported, reporting-ready)
   
   **Adjusted severity**: 🟡 MEDIUM (reduced from 🔴 HIGH)
   
   **Table row** (updated):
   ```json
   ["Comply", "Nationalisation reporting - Emiratization and Saudization workforce tracking. Customers managing 5,000+ employees need auditable dashboards showing nationality composition, hiring source analysis, and manager accountability for government compliance. Penalties: AED 108,000 per missing Emirati (UAE); Nitaqat sanctions (KSA).", "🟡 MEDIUM", "Custom reports with Worker_Additional_Data; Prism Analytics for multi-tenant benchmarking (Strong workaround - Deployment Agent validated)", "Mahboob Khan (Baker Hughes): 'We want US/UK diversity parity for Middle East mandates'", "Native compliance module with pre-built nationalisation templates, MOHRE/Nitaqat export readiness"]
   ```
   
   **Logging in MISSION_LOG:**
   When 130 completes Gap Analysis validation:
   ```
   Gap Analysis: 7 gaps validated via Deployment Agent. Severities adjusted: Nationalisation reporting (HIGH → MEDIUM), Interview scheduling (HIGH → MEDIUM). True gaps confirmed: WhatsApp core UI, Qiwa/Mudad exchange.
   ```


## Section 13: Roadmap Recommendations

12. **SECTION: Roadmap Recommendations** (**MAX 5 recommendations** + section divider)
   - Section Title: "Roadmap Recommendations | Priority 1 and Priority 2"
   - **MAXIMUM 5 recommendations** (select top Priority 1 items from the @pmf-analyst report). Do not exceed 5.
   - Slide titles MUST be formatted as "Recommendation N: [Title]" (e.g., "Recommendation 1: Nationalisation Reporting"). Do NOT use "Rec N: [Title]".
   
   **Recommendation slide format (5-part structure for VP audience, MANDATORY):**
   Each recommendation slide must include ALL five components with VP-appropriate detail:
   
   1. **Problem** (level 0, 14pt bold sub-header): Clear statement of customer pain or market gap
      - Follow with level 1 bullet: 2-3 sentences explaining impact and frequency
   
   2. **Evidence** (level 0, 14pt bold sub-header): Research validation
      - Level 1 bullets: Customer quotes (P1-P3), 108 gap severity, @competitive-intel competitive gaps, 106 ideation volume. **MANDATORY: Must cite reference customers from SME interviews alongside participant references (e.g., "SME5 cites Accenture-scale 200K duplicates").**
      - Maximum 1-2 evidence bullets for readability
   
   3. **Recommendation** (level 0, 14pt bold sub-header): Specific product action
      - Level 1 bullet: What to build (2-3 sentences with feature specifics)
      - Level 2 sub-bullets: Key capabilities or requirements (1-2 items max)
   
   4. **Why Now** (level 0, 14pt bold sub-header): Urgency and timing
      - Level 1 bullet: Market forces, competitive pressure, regulatory deadlines
   
   5. **Success Metrics** (level 0, 14pt bold sub-header): How to measure impact
      - **Source**: Extract from @pmf-analyst recommendation "Success Metric" subsection (Step 3.5 in enhanced workflow)
      - **Format**: "[BV Metric Name]: [Baseline] → [Target] ([% improvement])"
      - **Example**: "Time to Hire: 45 days → 30 days (33% reduction)"
      - **Fallback for legacy reports**: If @pmf-analyst report doesn't have "Success Metric" subsections (pre-enhancement), invoke `/value-metrics suggest [recommendation capability]` to generate 1 BV metric
      - Level 1 bullets: 1-2 specific metrics with baseline → target (e.g., "Time to Hire: 45 days → 30 days", "Candidate response rate: 35% → 55%")
      - Keep concise: Focus on primary BV metric for executive clarity
   
   **MANDATORY STRUCTURE: 5-part format with subheaders** (Problem, Evidence, Recommendation, Why Now, Success Metrics). Each section MUST have a level 0 bold subheader followed by level 1 bullet content. Total structure = **5 subheaders + 5 bullets = 10 paragraph items** (matching v65/v81).
   
   **Character limits per section (to fit within 7-8 lines at 12pt font):**
  - **Problem** (level 0 subheader + 1 level 1 bullet): **180-220 characters** (pain point with business impact and scale context, 2-2.5 lines)
  - **Evidence** (level 0 subheader + 1 level 1 bullet): **180-220 characters** (customer/SME quotes with attribution, competitive data, or 108 gap severity, 2-2.5 lines)
  - **Recommendation** (level 0 subheader + 1 level 1 bullet): **200-240 characters** (specific product action with key capabilities, 2.5-3 lines)
  - **Why Now** (level 0 subheader + 1 level 1 bullet): **160-200 characters** (market forces, competitive pressure, regulatory deadlines, strategic timing with specifics, 2 lines)
  - **Success Metrics** (level 0 subheader + 1 level 1 bullet): **180-220 characters** (1-2 BV metrics with baseline → target and timeframe, 2-2.5 lines)
   
   **Total rendered lines at 12pt font**: 5 subheaders (0.5 line each = 2.5 lines) + 5 bullets × 2.3 avg lines = 2.5 + 11.5 = **14 lines at 14pt** → Use **12pt font** = **~8.5 rendered lines** (acceptable for dense recommendation slides)
   
   **Font size: 12pt MANDATORY** (recommendation slides have >6 bullets per 010-style-guide.mdc dense slide threshold)
   
   **Example (with 5-part structure, 10 items total in paragraphs array):**
   ```json
   "paragraphs": [
     {"level": 0, "text": [{"text": "Problem", "bold": true, "font_size_pt": 12}]},
     {"level": 1, "text": "Agency-heavy India programmes lose fee integrity when duplicates pass and last-approved upload wins; thousands of daily vendor uploads make manual checks full-time roles."},
     {"level": 0, "text": [{"text": "Evidence", "bold": true, "font_size_pt": 12}]},
     {"level": 1, "text": "\"Duplication is the number one automation ask; match on Aadhaar, not only email and phone.\" (P5, Teleperformance India); Darwinbox and SpringVerify cite cooling-off rules."},
     {"level": 0, "text": [{"text": "Recommendation", "bold": true, "font_size_pt": 12}]},
     {"level": 1, "text": "Extend UDMF matching with government-ID fields (PAN, Aadhaar where permitted, UAN) plus configurable first-touch and cooling-off rules, bulk vendor flows, and audit of source changes."},
     {"level": 0, "text": [{"text": "Why now", "bold": true, "font_size_pt": 12}]},
     {"level": 1, "text": "Eight-win India row and competitive matrix emphasis on UDMF as native strength; DPDP compliance elevates data minimization for duplicate prevention."},
     {"level": 0, "text": [{"text": "Success metrics", "bold": true, "font_size_pt": 12}]},
     {"level": 1, "text": "Agency dispute cases reduced by 60% (baseline 50/month); Duplicate processing time: 15 hours/week → 2 hours/week per recruiter (87% reduction)."}
   ]
   ```
   
   - **Priority Recommendations Summary table**: Include when deck is for E2E pipeline (shows all recommendations in table for PM selection). Transform "E2E Handoff" terminology to executive language: use title "Priority Recommendations for Roadmap" (NOT "E2E Handoff - Research Recommendations (HITL selection)"). **Table columns (MANDATORY - 9 columns required)**: #, Title, Action, Reach, Impact, Confidence, Effort, RICE Score, Legal / compliance (060). Extract RICE component values from Priority 1 & 2 recommendation text in @pmf-analyst report E2E Handoff table (e.g., "Reach 2,000, Business 3.0, Customer 3.0, Confidence 70%, Effort 5 pm" → separate table cells). **Core RICE columns (Reach, Impact, Confidence, Effort, RICE Score) must be clearly visible and formatted**: Reach as "2,000" (with comma separator), Impact as "3.0" (decimal), Confidence as "70%" (percentage), Effort as "5 pm" (person-months), RICE Score as "840" (calculated value). The "Legal / compliance (060)" column contains compliance notes.
   - **Override**: If PM explicitly requests "all recommendations" or "include all 10", generate individual slides for all recommendations and accept 52-56 slide count

## Section 14: Bumper Slide

12. **Bumper Slide**

**Canonical baseline enforcement:** `slides_spec.json` MUST implement the **content classes** above and match **`docs/decks/gcc-pmf-roadmap-v65-slide-inventory.md`** for GCC full PMF decks. When generating versioned decks, the agent MUST:
1. Prefer **v65 inventory** as skeleton, not only the previous **`slides_spec_v*.json`**
2. Populate with content from **@product-strategy-agent outputs** (PESTEL, SWOT) and the **@pmf-analyst** report (themes, customer evidence, recommendations)
3. Add version-specific deep-dive slides **only** after standard sections (or with PM approval to trade depth vs length)
4. Never skip or compress **SWOT, 4× Win/Loss, Ideation block (or DATA GAP), Full Funnel** unless user says **focus deck only**

**Compressed decks are forbidden by default.** If a full PMF deck has **<50 slides** while claiming v65 parity, or is missing the **v65 content classes** above, it violates the standard (hard floor remains **≥36** slides minimum for any “full” deck).

**Participant Anonymization (MANDATORY FOR ALL SLIDES):** Use **P1, P2, P3** consistently throughout the ENTIRE deck - participant slides, quote attribution, Win-Loss evidence, triangulation tables, Gap Analysis tables, all customer references. Format: "P1 (Company)" or "P1 - Role, Company". NEVER use interviewee real names in slide content. Rationale: Protects customer privacy while maintaining enterprise credibility through company names. This applies to ALL sections: Primary Research, Win-Loss, Gap Analysis, Thematic Analysis, Recommendations.

**Recommendation slide structure (5-part):** Problem | Evidence | Recommendation | Why now | Success Metrics

**Speaker Notes (MANDATORY for content slides):**
- See **`010-style-guide.mdc` → Deck Generation → Speaker Notes** for format
- **130-specific**: Include references for all sources used (Mondaq, Astute Analytica, Braun & Clarke, etc.)

**Product Implication (PESTEL slides):**
- See **`010-style-guide.mdc` → Deck Generation → Product Implication** for formatting (12pt bold, yellow highlight `FFFF00`)
- **130-specific**: The implication text must meet the **~22-word / two-clause** minimum in the **PESTEL v65 depth** block above (more substantive than generic slides)

**Chart requirements:**
- See **`010-style-guide.mdc` → Deck Generation → Chart Styling** for font sizing and bar chart rules
- **130-specific**: Apply to Win/Loss Top 10 charts, Ideation Hub stacked bars, Full Funnel diagnostics

**Table requirements:**
- See **`010-style-guide.mdc` → Deck Generation → Table Styling** for headers, font sizing, SWOT layout
- **130-specific**: Competitive Landscape tables must include columns: Vendor | Key Strengths | Key Weaknesses | GCC Fit | Notes (4-6 vendors minimum)

**Content positioning:**
- See **`010-style-guide.mdc` → Deck Generation → Typography Standards** for body text box dimensions and positioning

---

## Pre-Generation Validation Protocol

## PRE-GENERATION VALIDATION PROTOCOL (MANDATORY)

Before calling `create_presentation`, execute this validation protocol and BLOCK generation if ANY check fails:

### Step 1: PESTEL Validation

For EACH of 6 PESTEL factor slides in draft JSON:

**Automated checks**:
1. Count `paragraphs` with `level: 1`: Must equal 5 (4 for Environmental if DATA GAP)
2. For each level-1 paragraph:
   - Extract text (handle both string and array-of-runs format)
   - Count sentences: Count occurrences of `. ` or `! ` or `? ` (with space after)
   - Verify ≥2 sentences per bullet
   - Count words: Should be 40-80 words for 2-3 sentence bullets
3. Count anchors across all bullets:
   - Scan for: digits + % sign, currency symbols, year patterns (20XX), named programs (capitalize words), article citations (Art. X)
   - Verify ≥5 total anchors (≥3 for Environmental)
4. Verify Product Implication:
   - Count words: Must be ≥50
   - Verify two clauses (check for period, semicolon, or coordinating conjunction)

**If ANY PESTEL slide fails**:
- Output: "PESTEL [Factor] slide BLOCKS generation: [specific issue]"
- Action: Expand content from `research/[Country]/pestel-analysis-[Country]-[YYYY-MM-DD]-[MISSION-ID].md`
- Re-validate after expansion
- Maximum 1 expansion attempt; if still failing, return to orchestrator with detailed failure report

### Step 2: Interview Validation

For EACH interview slide (P1, P2, P3…) in draft JSON:

**Automated checks**:
1. Count ALL paragraphs (level 0, 1, 2): Must be ≥7 (target 8)
2. Count level-0 paragraphs with `"bold": true` in text runs: Must be 2-3 (theme subheaders)
3. Count level-1 paragraphs where text starts with opening quotes (smart quote `"` or regular `"`): Must be 3-4
4. Count level-1 paragraphs containing all three strings: "When", "I want", "so I can": Must be 2-3
5. Verify speaker_notes field exists and contains ≥5 bullet points

**If ANY interview slide fails**:
- Output: "[Participant] slide BLOCKS generation: [specific issue]"
- Action: Extract additional content from @pmf-analyst report participant section
- Re-validate after expansion
- Maximum 1 expansion attempt; if still failing, return to orchestrator with detailed failure report

### Step 3: Generate Validation Report

**Output format before create_presentation**:

```markdown
CONTENT DENSITY VALIDATION REPORT:

PESTEL Slides:
- Political: ✅ 5 bullets, 11 sentences (2.2 avg), 7 anchors, 52-word implication
- Economic: ✅ 5 bullets, 12 sentences (2.4 avg), 6 anchors, 58-word implication
- Social: ✅ 5 bullets, 13 sentences (2.6 avg), 8 anchors, 61-word implication
- Technological: ✅ 5 bullets, 10 sentences (2.0 avg), 5 anchors, 55-word implication
- Environmental: ✅ 4 bullets, 9 sentences (2.3 avg), 4 anchors, 48-word implication
- Legal: ✅ 5 bullets, 14 sentences (2.8 avg), 9 anchors, 67-word implication

Interview Slides:
- P1 (Accenture): ✅ 8 lines, 3 themes, 4 quotes, 3 JTBD, 5 speaker notes
- P2 (Baker Hughes): ✅ 7 lines, 2 themes, 3 quotes, 2 JTBD, 6 speaker notes
- P3 (Shell): ✅ 8 lines, 3 themes, 4 quotes, 3 JTBD, 5 speaker notes

VALIDATION: ✅ ALL CHECKS PASSED - Proceeding to create_presentation
```

**If validation fails**:
```markdown
VALIDATION: ❌ BLOCKING ISSUES FOUND

PESTEL Issues:
- Economic: Only 4 bullets (need 5); avg 1.5 sentences/bullet (need 2-3); only 4 anchors (need 5)

Interview Issues:
- P2: Only 6 lines (need 7-8); only 2 quotes (need 3-4); only 1 JTBD (need 2-3)

ACTION: Expanding content from source files before generation...
```

**Validation failures return to orchestrator**:
- Which slides failed (by title)
- Specific metrics (bullet count, sentence count, anchor count, quote count, JTBD count)
- What content is missing from source files (@product-strategy-agent PESTEL or @pmf-analyst participant sections)
- Recommendation for orchestrator (expand @product-strategy-agent PESTEL, enrich @pmf-analyst participant analysis, or accept DATA GAP)

---

## Extended Quality Checklist

## Deck quality checklist (MANDATORY before `create_presentation`)

**Structure and length (v65 parity):**
- [ ] **~50-60 total slides** (target v65 parity; hard minimum 36; 60+ requires PM approval for extended format)
- [ ] **9-10 section dividers** with proper "Section Title" layout
- [ ] **Section divider subtitles: SHORT** (2-4 words: "PESTEL", "Primary research", "Win / Loss"), plain string format, no verbose pipe descriptions
- [ ] **Section dividers have `placeholders`** for agenda generation (see **`010-style-guide.mdc`** Agenda Fix)
- [ ] **Product Strategy slides present** (1-3 slides after Strategic Context section, sourced from `research/[REGION]/strategy-context-*.md` from Step 1). If Step 1 file doesn't exist (standalone invocation), Product Strategy section can be omitted.
- [ ] **Product Strategy regional adaptation**: If deck is non-GCC regional (India, France, Japan, UK, Germany, Canada, Australia), verify Q2 Priorities slide leads with focal region (not GCC) and Regional Expansion slide lists focal region first (not GCC first). Extract region row from strategy-context Regional Expansion table for bullet content.

**Typography and formatting (see `010-style-guide.mdc` → Deck Generation):**
- [ ] **Font sizing by density (STRICT ENFORCEMENT - 14PT DEFAULT)**: 
  - 16pt: Sparse slides (≤3 bullets, emphasis slides, 1/2 Headline content)
  - **14pt: Standard slides (4-6 bullets) - DEFAULT for most content** ← MOST COMMON, USE UNLESS SLIDE IS SPARSE OR DENSE
  - 12pt: Dense slides ONLY (>6 bullets, comprehensive tables, PESTEL deep-dive with Product implication)
  - **MANDATORY PRE-GENERATION VALIDATION**: 
    1. Count bullets per slide BEFORE setting font_size_pt
    2. Default ALL content slides to 14pt initially
    3. Adjust to 16pt only if ≤3 bullets (sparse)
    4. Adjust to 12pt only if >6 bullets (dense) OR comprehensive table content
    5. NEVER use 12pt as a default or for standard 4-6 bullet slides
- [ ] **Body box dimensions**: 0.7, 1.2, 8.6, 2.8 (standard Title Only layout)
- [ ] **Section Title format**: Plain `"text"` with `"S E C T I O N  [NN]\n[Name]"` format (NOT paragraphs with "Workday Confidential")
- [ ] **All slide titles ≤45 characters** (verify each title before finalizing spec; rewrite any ≥45 chars)
- [ ] **Chart font sizes**: `category_axis_font_size_pt: 9`, `value_axis_font_size_pt: 9`, `title_font_size_pt: 10`
- [ ] **Table auto-height (CRITICAL)**: Do NOT specify `height_inches` for any tables - omit entirely to allow auto-height based on content. Only specify `header_height_inches: 0.25` for compact headers.
- [ ] **Speaker notes**: On all content slides (except Title, Section Title, Bumper) with References URLs

**Content depth (130-specific, v65 parity):**
- [ ] **Concrete Anchor Requirement**: Every level 1 bullet on a content slide MUST contain at least one concrete anchor: a specific number/metric, a named entity (company, regulation, product), a participant reference (P1-P5, SME1-SME5), or a dated fact. Bullets without any concrete anchor are FORBIDDEN - they indicate the content is too abstract for executive consumption.
- [ ] **Executive Summary: 4 bullets (hard cap, reduced from 4-5)**, 200-250 chars per bullet (target 220 chars for rich 2.5-line rendering), VP-appropriate detail with cause → impact → implication structure, strategic roadmap direction synthesized from Priority Recommendations
- [ ] **PESTEL titles: factor name only** (no "PESTEL -" prefix: use "Political", "Economic", etc.)
- [ ] **PESTEL source: @product-strategy-agent output file** (`research/[Country]/pestel-analysis-[Country]-[YYYY-MM-DD]-[MISSION-ID].md`) — do NOT extract from @pmf-analyst report
- [ ] PESTEL: 6 individual slides (one per factor), each with **EXACTLY 4** level-1 bullets (3 for Environmental if DATA GAP), **EVERY bullet 2-3 sentences** (180-240 chars per updated standards), **≥5** total anchors per slide, **40-50 word** Product Implication with two clear clauses (hard max 70 words / 2 lines), **12pt font**
  - **SME Interviews section present** (when SME transcripts exist): Section divider + intro slide ("Internal SME Interviews - Workday Experts") + participants table + 1 slide per SME (7-8 bullets each at 160-200 chars, 2-3 theme subheaders, key insights, hypotheses, triangulation). **SME names ANONYMIZED** on slides (SME1, SME2, etc. like P1-P5 for customers); real names in speaker notes only. Placed after Ideation Hub section, before Customer Interviews section. Content sourced from `research/[REGION]/105-sme-research-findings.md` (Step 7) or @pmf-analyst SME structured section. Font: 12pt.
- [ ] **Interview slides (P1, P2, P3…): MANDATORY DENSITY CHECK (BLOCKING VALIDATION)**
  **For EACH per-participant slide, verify ALL requirements BEFORE finalizing JSON:**
  - [ ] **7-8 bullet lines total** (matching v65/v81 density; count all level-0/1/2 paragraphs including subheaders)
  - [ ] **Character limits enforced**: Level-1 bullets 180-220 chars (2-2.5 lines), level-2 sub-bullets 120-160 chars
  - [ ] **2-3 theme sub-headers present**: Count level-0, 12pt bold paragraphs (NOT bullets)
  - [ ] **EXACTLY 4-6 quote-led bullets**: Count bullets starting with smart quotes, ending with (P[N], Company), 180-220 chars each
  - [ ] **EXACTLY 2-3 JTBD statements**: Count bullets matching *When …, I want …, so I can …* format, 160-200 chars each
  - [ ] **Each bullet is 2-3 sentences**: No single-word or phrase-only bullets
  - [ ] **Level-2 sub-bullets used appropriately**: Present but not excessive (max 2 per slide)
  - [ ] **Font size: 12pt MANDATORY** (slides with >6 bullets use 12pt per 010-style-guide.mdc)
  - [ ] **Speaker notes**: Minimum 5 bullets + References section
  
  **BLOCKING VALIDATION (Execute for EACH interview slide)**:
  
  1. Count total lines (L0 + L1 + L2): Must be ≥7
  2. Count L0 paragraphs with bold=true: Must be 2-3 (theme subheaders)
  3. Count L1 bullets starting with opening quotes: Must be 3-4
  4. Count L1 bullets containing "When" + "I want" + "so I can": Must be 2-3
  5. Verify speaker notes: Must have ≥5 bullets
  
  **If ANY validation fails**:
  - DO NOT proceed to create_presentation
  - Return to content extraction from @pmf-analyst report
  - Pull additional quotes, JTBD, pain points from participant section
  - Expand bullets into full sentences with context
  - If @pmf-analyst report lacks sufficient quotes/JTBD for participant, flag to orchestrator
- [ ] **Thematic Analysis slides: MANDATORY DENSITY CHECK (PRE-GENERATION)**
  **For EACH grouped thematic slide, verify ALL requirements BEFORE finalizing JSON:**
  - [ ] **2 themes per slide** (reduced from 3-4 to prevent overflow; if report has 3+ themes for one validated group, split across 2 slides)
  - [ ] **EXACTLY 3 bullets per theme** (total 6 level 1 bullets + 2 subheaders per slide = 7-8 rendered lines):
    - **Character limits**: 140-180 characters per bullet (renders as 1.5-2 lines each)
  - [ ] **Font size: 12pt** (6 bullets + 2 subheaders = 8 items, exceeds >6 threshold)
    1. **Key Insight & Evidence** (2-3 sentences with P1-P3 quotes, data, specific findings)
    2. **Business Impact** (2-3 sentences on win rates, ARR, retention, competitive position)
    3. **Product Implications** (2-3 sentences on Workday Recruiting roadmap actions)
  - [ ] **Theme sub-headers**: Use **level 0, 14pt bold** (NOT level 1 bullets with bold)
  - [ ] **Executive-ready language**: Transform raw research codes ("T1 Candidate review density: 3/3 customers") into polished narrative ("Candidate review efficiency")
  - [ ] **Cause → impact → implication structure** in bullets
  - [ ] **Speaker notes**: Minimum 5 bullets + References
  
  **FORBIDDEN on thematic slides:**
  - ❌ Only 1-2 themes per slide (too sparse)
  - ❌ Fewer than 3 bullets per theme
  - ❌ Single-line bullets without business context
  - ❌ Raw theme codes or technical terminology
  - ❌ Generic summaries ("efficiency matters") without specific evidence
  
  **If ANY thematic slide fails this check**: Expand each theme's 3 bullets with detailed content from @pmf-analyst report until requirements met. Each bullet should be 2-3 sentences explaining the specific insight, business impact, or product action.
- [ ] **Competitive: 3 slides** — Regional Specialists TABLE (NOT bullets), Global Platforms TABLE (NOT bullets), **SWOT source: @product-strategy-agent output file** (`research/[Country]/swot-analysis-[Country]-[YYYY-MM-DD]-[MISSION-ID].md`) — do NOT extract from @pmf-analyst report — **SINGLE 2x2 table** with all four quadrants, **10pt font**, **bullet-pointed content in cells**, `header_height_inches: 0.25`, **NO `height_inches` property on table object - must auto-calculate**). Each vendor row: 3-4 detail points per cell. **CRITICAL VALIDATION**: Regional + Global tables MUST have `font_size_pt: 8` ONLY at table level (not cell/run level, not 14pt anywhere).
- [ ] **SWOT PRE-GENERATION CHECK**: For each of the 4 quadrants (Strengths, Weaknesses, Opportunities, Threats), count bullets in cell text - MUST have 3-5 bullets each, with 4-5 preferred for VP audience. Each bullet concise (1-2 sentences max).
- [ ] **Win/Loss: EXACTLY 3 slides ONLY** (NO "Dataset Overview", NO "CRM Hygiene", NO data quality explanation slides — jump directly to: (1) Top Gap Themes table, (2) Gap Theme Chart, (3) GCC & Proxy Gaps table). Data quality notes belong in speaker_notes, NOT separate slides.
- [ ] **Win-Loss data availability validated**: If 108 returns 0 region-relevant rows, Win-Loss section = 1 "No Pre-Sales Data exists for [Region]" slide ONLY
- [ ] **Win-Loss customer attribution**: P1/P2/P3 format used consistently (NOT real names) in gap evidence, quotes, and attributions. Format: "P1 (Company)" or "P1 - Role, Company"
- [ ] **Win-Loss gap detail**: Each gap description = 3-4 sentences with scale indicators (volumes, time costs, fines), workflow context, and business impact
- [ ] **Win-Loss customer quotes**: Minimum 2-3 verbatim quotes (≤20 words each) with P1/P2/P3 attribution: "P1 (Company)" or "P1 - JobTitle, Company"
- [ ] **Gap Analysis - Deployment Agent validation**: EVERY gap in Gap Analysis table queried via `ask_deployment_agent` to validate workarounds; severities adjusted when strong workaround found (HIGH → MEDIUM, MEDIUM → LOW); validation noted in speaker_notes with thread ID
- [ ] **ALL TABLES VALIDATION**: Every table in spec MUST have `header_height_inches: 0.25` and MUST OMIT `height_inches` property entirely (auto-height prevents row cramping)
- [ ] **Ideation: 4 slides** (or DATA GAP equivalents when CSV absent)
- [ ] **Thematic Analysis: 1 slide per theme** — Each theme gets its own slide with EXACTLY 3 bullets: Key Insight & Evidence, Business Impact, and Product Implications
- [ ] Triangulation: Cross-Source Validation Matrix table
- [ ] **Full Funnel: 1 diagnostic slide titled "Gap Analysis" in TABLE format with RAG severity column** (Red/Amber/Green indicators, detailed gap descriptions)
- [ ] **Recommendations: MAX 5 slides with ALL 5 parts** (Problem, Evidence, Recommendation, Why Now, **Success Metrics**) — each uses 12pt bold sub-headers for the 5 sections, **5-part structure = 10 paragraph items total** (5 subheaders + 5 bullets matching v65/v81) with character limits 180-240 chars per bullet. Titles must be "Recommendation N: [Title]". Font: 12pt MANDATORY.
- [ ] **Recommendation slides: MANDATORY 5-PART STRUCTURE CHECK (PRE-GENERATION)**
  **For EACH recommendation slide, verify ALL requirements BEFORE finalizing JSON:**
  - [ ] **5-part structure verified**: Must have 5 level 0 bold subheaders (Problem, Evidence, Recommendation, Why Now, Success Metrics) + 5 level 1 bullets = 10 paragraph items total
  - [ ] **Problem section** (level 0, 12pt bold sub-header + level 1 bullet):
    - 2-3 sentences explaining customer pain, business impact, and scale/frequency
    - **Character limit: 180-220 characters** (renders as 2-2.5 lines)
    - Include context on commercial impact or operational friction
  - [ ] **Evidence section** (level 0, 12pt bold sub-header + 1 level 1 bullet):
    - Customer/SME quotes with attribution OR 108 gap severity/competitive gaps/ideation volume
    - **Character limit: 180-220 characters**
    - Include specific attribution (P1-P5 or SME1-SME5) and data points
  - [ ] **Recommendation section** (level 0, 12pt bold sub-header + 1 level 1 bullet):
    - Specific product action with key capabilities, technical approach, or requirements
    - **Character limit: 200-240 characters** (renders as 2.5-3 lines for detail)
    - What to build with sufficient technical specifics for implementation clarity
  - [ ] **Why Now section** (level 0, 12pt bold sub-header + 1 level 1 bullet):
    - 2-3 sentences on market forces, competitive pressure, regulatory deadlines, strategic timing
    - **Character limit: 160-200 characters** (2 lines with specifics)
    - Include concrete triggers or windows (not vague urgency statements)
  - [ ] **Success Metrics section** (level 0, 12pt bold sub-header + 1 level 1 bullet):
    - **Source**: Extracted from @pmf-analyst recommendation "Success Metric" subsection
    - **Format**: "[BV Metric Name]: [Baseline] → [Target] ([% improvement])" with timeframe context
    - **Character limit: 180-220 characters**
    - 1-2 specific BV metrics with baseline → target and measurement approach
  - [ ] **Font size: 12pt MANDATORY** (10 paragraph items = dense slide; 12pt font required per 010-style-guide.mdc)
  - [ ] **Total structure check**: Count paragraphs array - must equal exactly 10 items (5 subheaders + 5 bullets)
  - [ ] **Speaker notes**: Minimum 5 bullets + References
  
  **FORBIDDEN on recommendation slides:**
  - ❌ Single-line bullets under any section
  - ❌ Missing any of the 5 sections (Problem, Evidence, Recommendation, Why Now, Success Metrics)
  - ❌ Generic urgency ("calendar habits") without business context
  - ❌ Vague success metrics without baseline → target
  - ❌ Missing customer evidence in Evidence section
  
  **If ANY recommendation slide fails this check**: Expand each section with detailed content from @pmf-analyst report. Pull from Product Roadmap Impact Summary in report for Problem/Why Now. Pull from research themes for Evidence. Add specific metrics with quantified targets for Success Metrics.



- [ ] **Priority Recommendations Summary table**: Include for E2E pipeline decks (use executive title: "Priority Recommendations for Roadmap" NOT "E2E Handoff"). **Table columns (MANDATORY - 9 columns)**: #, Title, Action, Reach, Impact, Confidence, Effort, RICE Score, Legal / compliance (060). Extract RICE component values from @pmf-analyst E2E Handoff table. Verify table in JSON spec has 9 header cells and 9 data cells per row before create_presentation.
- [ ] Product implication formatting (PESTEL slides: 12pt bold, FFFF00 highlight)
- [ ] **Agenda (slide 2):** no `[{` / `'text':` artefacts; Section Title **subtitles** are plain strings with SHORT 2-4 word section names
- [ ] **Deployment Agent validation logged**: If Gap Analysis table present, speaker_notes include: "Gap severities validated via Deployment Agent queries ([Month YYYY])" + thread ID + list of gaps where severity reduced + References section

**HARD ENFORCEMENT (MANDATORY):**

1. **Execute PRE-GENERATION VALIDATION PROTOCOL** (see section above)
2. **Generate Content Density Validation Report**
3. **If ANY PESTEL or Interview slide fails validation**:
   - DO NOT call create_presentation
   - Expand content from source files (@product-strategy-agent PESTEL, @pmf-analyst participant sections)
   - Re-run validation protocol
   - Maximum 1 expansion attempt; if still failing, return control to orchestrator with detailed failure report
4. **Only proceed to create_presentation when validation report shows ✅ ALL CHECKS PASSED**
5. **Log validation report** in MISSION_LOG after successful generation
6. **Verify Executive Language Standard compliance** (no prohibited terms)
7. **Verify slide density standards met** across all sections

**Validation failures return to orchestrator**:
- Which slides failed (by title)
- Specific metrics (bullet count, sentence count, anchor count, quote count, JTBD count)
- What content is missing from source files (@product-strategy-agent PESTEL or @pmf-analyst participant sections)
- Recommendation for orchestrator (expand @product-strategy-agent PESTEL, enrich @pmf-analyst participant analysis, or accept DATA GAP)

---

## PRE-GENERATION DENSITY: Example line calculations

_Moved from the main 130 rule; formula and tables remain in `130-pmf-slide-generator.mdc`._

### Example Calculations

**PESTEL - Economic Factor (Target: 7-8 lines)**
- 4 bullets × 200 chars each = 4 × 2.5 lines = **10 lines**
- Product implication: 50 words ÷ 25 words/line = **2 lines**
- **Total**: 12 lines → **REVISION NEEDED**
- **After revision**: Reduce bullets to 2.3 lines each (180 chars) + keep implication at 50 words (2 lines) = 4 × 2.3 + 2 = **11.2 lines** → Still needs split or tighter editing
- **Best approach**: 4 bullets × 180 chars (2 lines each) + 40-word implication (1.5 lines) = 4 × 2 + 1.5 = **9.5 lines** → acceptable with 12pt font

**Executive Summary - Headline Outcomes (Target: 7-8 lines)**
- 4 bullets × 220 chars each = 4 × 2.7 lines = **10.8 lines** → **BORDERLINE**
- **Revision**: Keep 4 bullets but tighten to 200 chars = 4 × 2.5 lines = **10 lines** OR reduce to 3 bullets × 230 chars = 3 × 2.8 = **8.4 lines** ✅

**Themes - Identity & Duplicates (Target: 7-8 lines)**
- 2 theme subheaders (level 0 bold) = **1 line**
- 6 bullets × 160 chars = 6 × 2 lines = **12 lines**
- **Total**: 13 lines → **TOO DENSE**
- **Revision**: Use 140-char bullets = 6 × 1.7 lines + 1 = **11.2 lines** → Still needs split to 2 slides (3 bullets per theme × 2 themes = **7.2 lines per slide**) ✅

**Customer Interview - P1 (Target: 7 lines)**
- 2 theme subheaders = **1 line**
- 5 bullets × 200 chars = 5 × 2.5 lines = **12.5 lines**
- **Total**: 13.5 lines → **TOO DENSE**
- **Revision**: Reduce to 4 bullets × 180 chars = 4 × 2.2 lines + 1 = **9.8 lines** → Still needs tightening to 4 × 1.7 (160 chars) = **7.8 lines** ✅

---

## Density overspill examples (before/after JSON patterns)

## DENSITY OVERSPILL EXAMPLES (BEFORE/AFTER JSON PATTERNS)

These examples demonstrate how to prevent vertical text overflow by applying character limits and bullet count caps from the PRE-GENERATION DENSITY VALIDATION section.

### Example 1: PESTEL - Economic Factor

❌ **BEFORE (Overspill - 15 rendered lines)**

```json
{
  "layout": "Title Only_Alt",
  "master_index": 1,
  "title": "Economic",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 12,
    "paragraphs": [
      {
        "level": 1,
        "text": "Industry reporting sizes India HR technology in the hundreds of millions USD with mid-single-digit to high-single-digit CAGR through the early 2030s (MarketsandMarkets-style narratives). IMARC cites India ATS at USD 0.30B in 2024 toward USD 0.50B by 2033 at about 7.2% CAGR; AI, cloud, mobile, compliance automation drive market evolution with Paradox and HiredScore resonating in tech-forward organisations."
      },
      {
        "level": 1,
        "text": "India IT/ITES sector employs ~5 million workers contributing ~8% of GDP with strong services exports driving demand for volume recruiting (IBEF 2025). The Global Capability Centers (GCC) corridor in Karnataka, Telangana, and Hyderabad anchors enterprise recruiting for MNCs establishing shared services; Accenture, Cognizant, Wipro, Infosys operate large recruiting teams scaling rapidly through 2026-2027 hiring cycles."
      },
      {
        "level": 1,
        "text": "Inflation moderating toward RBI target of 4% through early 2026, permitting stable wage negotiations and predictable recruiting budgets for enterprise HR teams (RBI Monetary Policy Report Feb 2026). Interest rates expected to ease H2 2026, supporting TA technology investment appetite for SaaS subscriptions and recruiting workflow automation."
      },
      {
        "level": 1,
        "text": "Middle-class expansion drives white-collar labour supply; urbanisation shifts talent pools toward Tier 1-2 cities where enterprises concentrate recruiting operations. Unemployment hovering ~7-8% creates buyer's market dynamic for volume recruiting; enterprises invest in screening, verification, and fraud prevention tools to manage application flood."
      },
      {
        "level": 1,
        "text": "FDI inflows into services and manufacturing sustaining GCC growth trajectory; Budget 2026 incentivises digital infrastructure and skill development supporting recruiting workflow digitisation (Ministry of Finance 2026). Government push for formalisation and compliance elevates demand for structured ATS with audit trails and statutory reporting."
      },
      {
        "level": 0,
        "text": [
          {"text": "Product implication: ", "bold": true, "font_size_pt": 12, "highlight": "FFFF00"},
          {"text": "India's mid-single-digit market growth, GCC volume hiring, and regulatory formalisation create sustained demand for enterprise ATS with government-ID verification, fraud prevention, and statutory compliance built in. Workday Recruiting must prioritise Aadhaar-compatible eKYC, HiredScore activation for GCC-scale throughput, and first-class reporting for DPDP and statutory audit trails to capture share in this expanding, compliance-sensitive market.", "bold": true, "font_size_pt": 12, "highlight": "FFFF00"}
        ]
      }
    ]
  }],
  "speaker_notes": "• India ATS market at USD 0.30B (2024) projected to USD 0.50B by 2033 at 7.2% CAGR (IMARC 2025).\n• IT/ITES sector employs ~5M workers contributing ~8% GDP (IBEF 2025); GCC corridor drives volume recruiting demand.\n• Inflation moderating toward RBI 4% target; interest rate easing expected H2 2026 supports TA tech investment (RBI Feb 2026).\n• Middle-class expansion and urbanisation shift talent pools; ~7-8% unemployment creates buyer's market, elevating fraud prevention and screening tool demand.\n• FDI into services/manufacturing sustains GCC growth; Budget 2026 incentivises digital infrastructure and formalisation (Ministry of Finance 2026).\n\nReferences:\n• IMARC: https://www.imarcgroup.com/india-applicant-tracking-system-market\n• IBEF: https://www.ibef.org/industry/information-technology-india\n• RBI Monetary Policy Report: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=21000"
}
```

**Problem**: 5 bullets × 3 lines each (250-350 chars) = 15 lines + Product implication (90 words = 4 lines) = **19 rendered lines** → Bottom content cut off

---

✅ **AFTER (Compliant - 7 rendered lines)**

```json
{
  "layout": "Title Only_Alt",
  "master_index": 1,
  "title": "Economic",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 12,
    "paragraphs": [
      {
        "level": 1,
        "text": "India ATS market sized at USD 0.30B (2024) toward USD 0.50B by 2033, 7.2% CAGR; AI, cloud, mobile, compliance automation drive growth (IMARC 2025)."
      },
      {
        "level": 1,
        "text": "IT/ITES sector employs ~5M workers contributing ~8% GDP; GCC corridor in Karnataka, Telangana anchors enterprise recruiting for MNCs (IBEF 2025)."
      },
      {
        "level": 1,
        "text": "Inflation moderating to RBI 4% target through H1 2026; interest rates easing H2 2026 supports TA technology investment appetite (RBI Feb 2026)."
      },
      {
        "level": 1,
        "text": "Unemployment ~7-8% creates buyer's market; enterprises invest in screening, verification, fraud prevention tools to manage application volume at scale."
      },
      {
        "level": 0,
        "text": [
          {"text": "Product implication: ", "bold": true, "font_size_pt": 12, "highlight": "FFFF00"},
          {"text": "India's compliance-sensitive market elevates demand for Aadhaar-compatible eKYC and DPDP-aligned audit trails; Workday must prioritise government-ID verification and statutory reporting to capture GCC share.", "bold": true, "font_size_pt": 12, "highlight": "FFFF00"}
        ]
      }
    ]
  }],
  "speaker_notes": "• India ATS market at USD 0.30B (2024) projected to USD 0.50B by 2033 at 7.2% CAGR (IMARC 2025).\n• IT/ITES sector employs ~5M workers contributing ~8% GDP (IBEF 2025); GCC corridor drives volume recruiting demand.\n• Inflation moderating toward RBI 4% target; interest rate easing expected H2 2026 supports TA tech investment (RBI Feb 2026).\n• Middle-class expansion and urbanisation shift talent pools; ~7-8% unemployment creates buyer's market, elevating fraud prevention and screening tool demand.\n• FDI into services/manufacturing sustains GCC growth; Budget 2026 incentivises digital infrastructure and formalisation (Ministry of Finance 2026).\n\nReferences:\n• IMARC: https://www.imarcgroup.com/india-applicant-tracking-system-market\n• IBEF: https://www.ibef.org/industry/information-technology-india\n• RBI Monetary Policy Report: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=21000"
}
```

**Solution applied**:
- Reduced from 5 bullets to 4 bullets
- Trimmed each bullet from 250-350 chars to 120-140 chars (removed redundant phrases, consolidated statistics)
- Shortened Product implication from 90 words to 40 words (focused on capability + justification only)
- Moved excess detail to speaker notes (5+ bullets with full citations)
- **Result**: 4 bullets × 1.5 lines = 6 lines + Product implication 1.5 lines = **7.5 rendered lines** ✅

---

### Example 2: Executive Summary - Headline Outcomes

❌ **BEFORE (Overspill - 11 rendered lines)**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Executive Summary",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Headline outcomes", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "India PMF research triangulated five themes (Identity & Duplicates, Know Your Candidate at Scale, Document Flexibility & eKYC, Communication Channel Ubiquity, HiredScore Volume Optimisation) across seven customer interviews, five internal SME sessions, thirteen competitive intelligence signals, and seventeen win-loss gap exports from Tableau presales data spanning Q4 2025 through Q1 2026."
      },
      {
        "level": 1,
        "text": "Triangulation is strong on identity, duplicates, and document UX where P2, P3, P4 align with SME Bernie (HRIT Product Strategy), SME Fabiola Navarro (India Services Lead), and eleven presales gaps flagged in Aadhaar, consent, and government-ID verification themes; presales gap exports were not available for communication or HiredScore themes due to data availability constraints in Tableau."
      },
      {
        "level": 1,
        "text": "Priority direction: government-ID-aware dedupe with Legal minimisation, DPDP-aligned BGV consent, hardened KYC gating, first-class BGC reinitiate, governed HiredScore activation flowing from India Services delivery pressure and customer demand for fraud prevention at application intake combined with post-hire verification workflows."
      },
      {
        "level": 1,
        "text": "WhatsApp 2-way communication and offer flexibility (split-payment, start-date negotiation) are validated by P1-P5 participant consensus and align with Bernie's recommendation for mobile-first candidate experience modernisation but carry lower RICE scores due to 18-24 month estimated effort and dependency on Paradox chatbot roadmap integration."
      },
      {
        "level": 1,
        "text": "This roadmap prioritises Q2-Q3 2026 delivery windows for P1 (Government-ID Dedupe) and P2 (DPDP BGV Consent Flows) given India Services scale commitments, DPDP compliance deadlines, and customer escalations from P2 (Capgemini) and P4 (Infosys) where manual workarounds currently consume 10-15 hours per recruiter per week on duplicate resolution and document collection."
      }
    ]
  }],
  "speaker_notes": "• Five themes across seven customer interviews, five SME sessions, thirteen competitive signals, seventeen presales gaps.\n• Strong triangulation on identity/duplicates/documents; P2, P3, P4 align with Bernie, Fabiola, presales data.\n• Priority: government-ID dedupe, DPDP BGV, KYC gating, BGC reinitiate, HiredScore activation for fraud prevention and compliance.\n• WhatsApp and offer flexibility validated by P1-P5 but lower RICE due to 18-24mo effort and Paradox dependency.\n• Q2-Q3 2026 delivery for P1/P2 given India Services commitments and P2/P4 escalations (10-15 hrs/week manual workarounds).\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Problem**: 5 bullets × 2.2 lines each (220-280 chars) = **11 rendered lines** → Last bullet cut off

---

✅ **AFTER (Compliant - 8 rendered lines)**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Executive Summary",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Headline outcomes", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Five themes (Identity & Duplicates, KYC at Scale, Document eKYC, WhatsApp Communication, HiredScore Volume) triangulated across seven customers, five SMEs, thirteen CI signals, seventeen presales gaps (Q4 2025-Q1 2026)."
      },
      {
        "level": 1,
        "text": "Strong triangulation on identity/duplicates/documents: P2, P3, P4 align with Bernie (HRIT Product Strategy), Fabiola (India Services), and eleven Aadhaar/consent/government-ID presales gaps."
      },
      {
        "level": 1,
        "text": "Priority: government-ID-aware dedupe with Legal minimisation, DPDP-aligned BGV consent, hardened KYC gating, first-class BGC reinitiate, governed HiredScore activation for fraud prevention and compliance."
      },
      {
        "level": 1,
        "text": "Q2-Q3 2026 delivery for P1 (Government-ID Dedupe) and P2 (DPDP BGV Consent) addresses India Services scale commitments, DPDP deadlines, P2/P4 escalations (10-15 hours/week manual workarounds)."
      }
    ]
  }],
  "speaker_notes": "• Five themes across seven customer interviews, five SME sessions, thirteen competitive signals, seventeen presales gaps.\n• Strong triangulation on identity/duplicates/documents; P2, P3, P4 align with Bernie, Fabiola, presales data.\n• Priority: government-ID dedupe, DPDP BGV, KYC gating, BGC reinitiate, HiredScore activation for fraud prevention and compliance.\n• WhatsApp and offer flexibility validated by P1-P5 but lower RICE due to 18-24mo effort and Paradox dependency.\n• Q2-Q3 2026 delivery for P1/P2 given India Services commitments and P2/P4 escalations (10-15 hrs/week manual workarounds).\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Solution applied**:
- Reduced from 5 bullets to 4 bullets (consolidated WhatsApp and delivery timeline into single bullet)
- Trimmed each bullet from 220-280 chars to 150-180 chars (removed redundant narrative, consolidated data points)
- Removed 5th bullet, moved its content to speaker notes
- **Result**: 4 bullets × 2 lines = **8 rendered lines** ✅ (acceptable for exec synthesis)

---

### Example 3: Themes - Identity & Duplicates

❌ **BEFORE (Overspill - 13 rendered lines on 1 slide)**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Themes 1-3",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Identity & Duplicates", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Manual dedupe consumes 10-15 hours/week per recruiter; vendor uploads conflict with agency-approved candidates (P4, P5 quantify bottlenecks)."
      },
      {
        "level": 1,
        "text": "Cooling-off rules required for vendor management; agencies demand clear right-to-represent workflows before candidate submission (SpringVerify, Darwinbox cite regulatory pressure)."
      },
      {
        "level": 1,
        "text": "Government-ID-aware dedupe with configurable first-touch rules elevates data minimisation and reduces recruiter overhead 87% (P2, P4 validate)."
      },
      {
        "level": 0,
        "text": [
          {"text": "Know Your Candidate at Scale", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "P2 Capgemini, P4 Infosys demand Aadhaar eKYC for intake fraud gating; manual PAN and Aadhaar verification at 500-1000 applications/day is unsustainable (P1, P3 corroborate)."
      },
      {
        "level": 1,
        "text": "DPDP consent flows required for BGV initiation; P5 Shell escalates missing consent-aware background check reinitiate workflow after withdrawal or incomplete documentation."
      },
      {
        "level": 1,
        "text": "Adobe Sign partner integration elevates eSignature compliance for offer acceptance and reduces paper-based T&C turnaround from 3-5 days to same-day (P2, P5)."
      },
      {
        "level": 0,
        "text": [
          {"text": "Trust", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Document collection UX friction: P1-P5 consensus on upload complexity, unclear rejection reasons, and no candidate-facing status visibility causing drop-off."
      },
      {
        "level": 1,
        "text": "HiredScore explainability gaps: recruiters trust grades but lack drill-down into matching criteria; P2 demands transparency for hiring manager confidence."
      },
      {
        "level": 1,
        "text": "WhatsApp channel trust: candidates prefer familiar messaging over email for status updates, document requests, interview reminders (P1, P3, P5 validate ubiquity)."
      }
    ]
  }],
  "speaker_notes": "• Identity & Duplicates: P4/P5 quantify 10-15 hrs/week manual dedupe; government-ID-aware solution with first-touch rules reduces overhead 87%.\n• KYC at Scale: P2/P4 demand Aadhaar eKYC for 500-1000 apps/day; DPDP consent flows and BGC reinitiate elevated by P5 (Shell).\n• Trust: Document UX friction (P1-P5 consensus), HiredScore explainability gaps (P2), WhatsApp channel preference (P1/P3/P5).\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Problem**: 3 themes × 4 bullets = 12 bullets + 3 subheaders = **15 rendered lines** → Bottom content cut off

---

✅ **AFTER (Compliant - Split into 2 slides, 7-8 lines each)**

**Slide 1: Themes 1-2**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Themes 1-2",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Identity & Duplicates", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Manual dedupe consumes 10-15 hours/week per recruiter; vendor uploads conflict with agency-approved candidates (P4, P5)."
      },
      {
        "level": 1,
        "text": "Cooling-off rules required for vendor management; agencies demand clear right-to-represent workflows (SpringVerify, Darwinbox)."
      },
      {
        "level": 1,
        "text": "Government-ID-aware dedupe with first-touch rules reduces recruiter overhead 87% and elevates data minimisation (P2, P4)."
      },
      {
        "level": 0,
        "text": [
          {"text": "Know Your Candidate at Scale", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "P2 Capgemini, P4 Infosys demand Aadhaar eKYC for fraud gating at 500-1000 applications/day (P1, P3 corroborate)."
      },
      {
        "level": 1,
        "text": "DPDP consent flows required for BGV; P5 Shell escalates missing consent-aware background check reinitiate workflow."
      },
      {
        "level": 1,
        "text": "Adobe Sign partner integration reduces offer T&C turnaround from 3-5 days to same-day (P2, P5 validate eSignature compliance)."
      }
    ]
  }],
  "speaker_notes": "• Identity & Duplicates: P4/P5 quantify 10-15 hrs/week manual dedupe; government-ID-aware solution with first-touch rules reduces overhead 87%.\n• KYC at Scale: P2/P4 demand Aadhaar eKYC for 500-1000 apps/day; DPDP consent flows and BGC reinitiate elevated by P5 (Shell).\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Slide 2: Theme 3**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Theme 3",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Trust", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Document collection UX friction: P1-P5 consensus on upload complexity, unclear rejection reasons, no candidate status visibility causing drop-off."
      },
      {
        "level": 1,
        "text": "HiredScore explainability gaps: recruiters trust grades but lack drill-down into matching criteria; P2 demands transparency for hiring manager confidence."
      },
      {
        "level": 1,
        "text": "WhatsApp channel trust: candidates prefer familiar messaging over email for status updates, document requests, interview reminders (P1, P3, P5)."
      }
    ]
  }],
  "speaker_notes": "• Trust: Document UX friction (P1-P5 consensus), HiredScore explainability gaps (P2), WhatsApp channel preference (P1/P3/P5).\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Solution applied**:
- Split 3 themes across 2 slides (2 themes on Slide 1, 1 theme on Slide 2)
- Trimmed each bullet from 140-180 chars to 100-120 chars
- **Result**: Slide 1: 2 subheaders + 6 bullets × 1.2 lines = **8.2 rendered lines** ✅ (borderline acceptable), Slide 2: 1 subheader + 3 bullets × 1.3 lines = **4.9 rendered lines** ✅

---

### Example 4: Recommendation Slide

❌ **BEFORE (Overspill - 9 rendered lines)**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Recommendation 1: Government-ID-Aware Duplicate Detection",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Problem", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Manual dedupe consumes 10-15 hours per week per recruiter across enterprise teams; vendor uploads conflict with agency-approved candidates creating workflow friction, duplicate escalations, and recruiter burnout (P4 Infosys, P5 Shell quantify recurring bottlenecks with hiring manager escalations)."
      },
      {
        "level": 0,
        "text": [
          {"text": "Evidence", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": ""Duplicate management is our single largest time sink - 15 hours a week just checking if this candidate already applied through a different agency or different spelling" (P4, Infosys). SpringVerify and Darwinbox cite cooling-off rule demand in high-volume India markets."
      },
      {
        "level": 0,
        "text": [
          {"text": "Recommendation", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Build government-ID-aware duplicate detection with configurable first-touch rules and bulk vendor upload flows aligned to agency contracts, leveraging Aadhaar, PAN, or GSTIN matching with Legal data minimization controls and audit trails for DPDP compliance."
      },
      {
        "level": 2,
        "text": "Key capabilities: Aadhaar/PAN matching, bulk vendor upload, first-touch workflow, audit trail"
      },
      {
        "level": 0,
        "text": [
          {"text": "Why Now", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "India Services Q2 scale targets demand throughput efficiency; DPDP compliance elevates data minimization urgency; competitor Darwinbox and regional players (SpringVerify, HirePro) ship government-ID matching as table stakes in India ATS market by early 2026."
      },
      {
        "level": 0,
        "text": [
          {"text": "Success Metrics", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Time to Process Duplicates: 15 hours/week → 2 hours/week (87% reduction); Duplicate Candidate Escalations: 50/month → 5/month (90% reduction)"
      }
    ]
  }],
  "speaker_notes": "• Problem: 10-15 hrs/week manual dedupe per recruiter (P4/P5); vendor/agency conflicts create workflow friction.\n• Evidence: P4 Infosys quote on time sink; SpringVerify and Darwinbox cite cooling-off rule demand.\n• Recommendation: Government-ID-aware detection with Aadhaar/PAN matching, bulk vendor upload, first-touch rules, DPDP audit trails.\n• Why Now: India Services Q2 targets, DPDP compliance urgency, Darwinbox/SpringVerify table stakes by early 2026.\n• Success Metrics: Time to Process Duplicates 87% reduction, Duplicate Escalations 90% reduction.\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Problem**: 5 sections with 6 total bullets (Problem: 230 chars = 3 lines, Evidence: 200 chars = 2.5 lines, Recommendation: 220 chars + 80 char sub-bullet = 4 lines, Why Now: 220 chars = 2.5 lines, Success Metrics: 135 chars = 1.5 lines) = **13.5 rendered lines** → Bottom content cut off

---

✅ **AFTER (Compliant - 7.5 rendered lines)**

```json
{
  "layout": "Title Only",
  "master_index": 1,
  "title": "Recommendation 1: Government-ID-Aware Duplicate Detection",
  "text_boxes": [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
      {
        "level": 0,
        "text": [
          {"text": "Problem", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Manual dedupe consumes 10-15 hours/week per recruiter; vendor uploads conflict with agency-approved candidates (P4, P5 quantify bottlenecks)."
      },
      {
        "level": 0,
        "text": [
          {"text": "Evidence", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": ""15 hours a week checking if candidate applied through different agency or spelling" (P4, Infosys). SpringVerify, Darwinbox cite cooling-off demand."
      },
      {
        "level": 0,
        "text": [
          {"text": "Recommendation", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Build government-ID-aware duplicate detection with configurable first-touch rules and bulk vendor upload flows aligned to agency contracts and DPDP."
      },
      {
        "level": 0,
        "text": [
          {"text": "Why Now", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Q2 India scale targets demand throughput; DPDP compliance elevates data minimization urgency; Darwinbox ships as table stakes."
      },
      {
        "level": 0,
        "text": [
          {"text": "Success Metrics", "bold": true, "font_size_pt": 14}
        ]
      },
      {
        "level": 1,
        "text": "Time to Process Duplicates: 15 hours/week → 2 hours/week (87% reduction); Duplicate Escalations: 50/month → 5/month (90% reduction)"
      }
    ]
  }],
  "speaker_notes": "• Problem: 10-15 hrs/week manual dedupe per recruiter (P4/P5); vendor/agency conflicts create workflow friction.\n• Evidence: P4 Infosys quote on time sink; SpringVerify and Darwinbox cite cooling-off rule demand.\n• Recommendation: Government-ID-aware detection with Aadhaar/PAN matching, bulk vendor upload, first-touch rules, DPDP audit trails. Key capabilities: Aadhaar/PAN matching, bulk vendor upload, first-touch workflow, audit trail (detail moved to speaker notes to prevent overflow).\n• Why Now: India Services Q2 targets, DPDP compliance urgency, Darwinbox/SpringVerify table stakes by early 2026.\n• Success Metrics: Time to Process Duplicates 87% reduction, Duplicate Escalations 90% reduction.\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-002.md"
}
```

**Solution applied**:
- Reduced from 6 bullets to 5 bullets (removed level 2 sub-bullet, moved detail to speaker notes)
- Trimmed each section from 200-230 chars to 120-140 chars (removed redundancy, tightened language)
- **Result**: 5 sections + 5 bullets × 1.5 lines = **7.5 rendered lines** ✅

---

**Key Pattern**: Character limits + bullet count caps = predictable rendered line counts = no overspill
