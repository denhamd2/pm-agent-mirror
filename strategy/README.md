# Strategic Context for PM Agents

## Purpose

This folder contains **Workday strategy** and **Workday Recruiting product strategy** documents that inform agent recommendations, prioritisation, competitive positioning, and roadmap decisions.

**Why this matters**: Product decisions must balance **customer needs** (from research) with **business strategy** (from leadership, go-to-market, competitive positioning). Agents that make recommendations should search this folder to ensure alignment with Workday's strategic priorities.

## Contents

### PDFs (`strategy/pdfs/`)
Comprehensive strategy documents, typically annual or multi-year plans.

**Current Files:**
- `workday-talent-acquisition-strategy-march-2026.pdf`: Official Workday Talent Acquisition (Recruiting) strategy, vision, and roadmap as of March 2026. Use this as primary source for strategic priorities, competitive positioning, product vision, and roadmap direction.

**Examples of other files you might add:**
- `gcc-market-entry-strategy.pdf`: Regional expansion strategy, market priorities
- `competitive-strategy-ats-market.pdf`: Positioning vs. SAP SuccessFactors, Oracle Taleo
- `go-to-market-plan-2026.pdf`: GTM strategy, target customers, messaging

**When to use**: Long-horizon strategy context, competitive positioning, annual priorities.

### Markdown (`strategy/markdown/`)
Lightweight, version-controlled strategy documents. Easier to update frequently.

**Examples:**
- `product-priorities-q2-2026.md`: Current quarter priorities, initiatives in flight
- `competitive-positioning.md`: How we differentiate, key messages, battle card themes
- `okrs-2026.md`: Company and Recruiting OKRs for the year
- `regional-priorities.md`: GCC, Japan, EMEA expansion priorities by quarter

**When to use**: Current priorities, quick reference, frequently updated strategy context.

### Confluence References (`confluence-links.md`)
Curated list of live Confluence strategy pages with descriptions.

**Examples:**
- Product roadmap pages
- Quarterly planning docs
- Competitive intelligence pages
- Executive strategy decks

**When to use**: Real-time strategy updates, collaborative planning docs, executive presentations.

## Folder Conventions

### File Naming
- Use kebab-case: `workday-recruiting-strategy-2026.pdf`
- Include year or quarter: `product-priorities-q2-2026.md`
- Be specific: `gcc-market-entry-strategy.pdf` (not `strategy.pdf`)

### Date Stamps
- Add "Last Updated" to markdown files (frontmatter or header)
- Note strategy validity period (e.g., "Valid: Q2 2026")

### Version Control
- Markdown files committed to git (version history)
- PDFs committed when they're authoritative sources
- Use `.gitignore` for draft/confidential docs if needed

## When Agents Should Search Strategy Docs

### Research Agents (100, 101, 105, 120)

**100-market-intelligence:**
- **When**: Before Strategic Recommendations section in synthesis
- **Why**: Align recommendations with business priorities
- **Search for**: Product priorities, competitive positioning, regional strategies
- **Output**: "Strategic Alignment" note in each recommendation

**101-competitive-intelligence:**
- **When**: Before battle card creation, before competitive positioning synthesis
- **Why**: Ensure battle cards align with GTM messaging and positioning strategy
- **Search for**: Competitive positioning, differentiation themes, key messages
- **Output**: Battle card messaging that mirrors strategy docs

**105-user-researcher:**
- **When**: During Research Brief creation (Path A - planning)
- **Why**: Focus research questions on strategically important areas
- **Search for**: Product priorities, regional strategies, OKRs
- **Output**: Research objectives aligned with business goals

**120-pmf-thematic-analysis:**
- **When**: Before Product Roadmap Impact Summary (recommendations section)
- **Why**: Prioritise recommendations by strategic alignment + customer pain
- **Search for**: Product priorities, OKRs, regional strategies, competitive positioning
- **Output**: Enhanced RICE scores with Business Impact dimension (strategy alignment)
- **Integration**: Use enhanced RICE Skill (see below) for dual-dimension Impact scoring

### Other Agents (Optional, Context-Dependent)

**200-prd-writer:**
- **When**: Writing "Why Now?" section, defining success metrics
- **Why**: Connect PRD to strategic initiatives and OKRs
- **Search for**: Current priorities, OKRs, regional strategies

**090-agent-improvement-advisor:**
- **When**: Proposing new workflows, prioritising improvements
- **Why**: Ensure suggestions align with PM's strategic focus areas
- **Search for**: Product priorities, technology roadmap, process improvements

## Search Strategy for Mixed Formats

When searching for strategy context:

1. **Start with markdown/** (fastest, version-controlled, most current for quarterly priorities)
   ```
   Grep or SemanticSearch: strategy/markdown/
   Look for: current quarter, priority themes, OKRs
   ```

2. **Check PDFs** (comprehensive annual/multi-year strategy)
   ```
   Read: strategy/pdfs/[relevant-file].pdf
   Look for: long-term goals, market positioning, competitive strategy
   ```

3. **Fetch Confluence** (real-time updates, collaborative docs)
   ```
   Read: strategy/confluence-links.md for URLs
   Use Confluence MCP to fetch pages
   Look for: live roadmap, in-flight planning, recent decisions
   ```

## Enhanced RICE Integration

This folder enables **dual-dimension Impact scoring** for recommendations:

**Business Impact** (0.25-3.0):
- Search strategy docs for: strategic priorities, OKRs, competitive positioning
- Score alignment: 3.0 = strategic priority, 2.0 = strong alignment, 1.0 = neutral, 0.5 = weak, 0.25 = misaligned

**Customer Impact** (0.25-3.0):
- Based on research evidence: customer quotes, pain severity, frequency
- Score pain: 3.0 = critical, 2.0 = high, 1.0 = medium, 0.5 = low, 0.25 = minimal

**Composite Impact** = (Business Impact + Customer Impact) / 2

**See**: `~/.cursor/skills-cursor/rice-prioritisation/SKILL.md` for full framework.

## Example Usage

### Example 1: 120-pmf-thematic-analysis Searches Strategy

**Context**: 120 is generating Product Roadmap Impact Summary for GCC research.

**Agent Actions**:
1. Search `strategy/markdown/` for "GCC" or "Q2 2026 priorities"
2. Read `strategy/markdown/product-priorities-q2-2026.md`
3. Find: "Q2 2026 Priority: GCC candidate communication (WhatsApp, SMS)"
4. Generate recommendations:
   - Recommendation 1: WhatsApp messaging (Strategic alignment: High, matches Q2 priority)
   - Recommendation 2: Offer management (Strategic alignment: Medium, not called out)
5. Invoke enhanced RICE Skill for Business Impact scoring
6. Output recommendations with strategy-aware RICE scores

### Example 2: 101-competitive-intelligence Creates Battle Card

**Context**: 101 is creating battle card for "Workday vs. SAP SuccessFactors".

**Agent Actions**:
1. Search `strategy/pdfs/competitive-strategy-ats-market.pdf`
2. Extract key differentiation themes: Suite depth, security model, global HCM
3. Search `strategy/markdown/competitive-positioning.md`
4. Find current messaging: "Workday wins on workflow depth and compliance"
5. Generate battle card with aligned messaging (not ad hoc positioning)

### Example 3: User Adds New Strategy Doc

**User**: "I have Q3 2026 priorities - where should I put them?"

**Recommendation**:
1. Create `strategy/markdown/product-priorities-q3-2026.md`
2. Include: Priority initiatives, OKRs, regional focus areas, competitive themes
3. Mark Q2 doc as "Superseded by Q3 priorities" (or archive to `strategy/archive/`)
4. Agents will automatically search markdown/ and find Q3 priorities

## Maintenance

### Quarterly Updates
- Add new quarter priorities markdown file
- Archive or mark previous quarter as historical
- Update Confluence links for new planning pages

### Annual Updates
- Add new year strategy PDFs
- Archive previous year (move to `strategy/archive/` if needed)
- Update OKRs document

### Ad Hoc Updates
- Competitive positioning changes: Update `competitive-positioning.md`
- New regional strategies: Add region-specific markdown files
- GTM messaging updates: Update relevant markdown or Confluence links

## Best Practices

### For Strategy Documents
- **Be concise**: Agents need quick reference, not 50-page decks
- **Prioritise signal**: Focus on priorities, OKRs, positioning themes (not exhaustive lists)
- **Update frequently**: Quarterly markdown > stale annual PDFs
- **Make searchable**: Use clear headings, keywords, structured format

### For Agents Using This Folder
- **Always search** before making strategic recommendations
- **Cite strategy docs** in recommendations (e.g., "Aligns with Q2 GCC priority")
- **Flag misalignments**: If customer wants X but strategy says Y, surface the tension
- **Don't override strategy**: If recommendation conflicts with strategy, explain why (with evidence)

## Quick Reference Card for Agents

**Before making recommendations:**
- [ ] Search `strategy/markdown/` for current quarter priorities
- [ ] Check `strategy/pdfs/` for annual strategy themes
- [ ] Read relevant Confluence pages (if real-time context needed)
- [ ] Use enhanced RICE Skill to score Business Impact (strategy alignment)
- [ ] Cite strategy docs in recommendation rationale
- [ ] Flag strategic misalignments if customer evidence conflicts with strategy

---

**Folder Created**: 27 March 2026  
**Pattern**: Mirrors `functional-knowledge/` for strategic context (functional = how Workday works, strategy = where Workday is going)
