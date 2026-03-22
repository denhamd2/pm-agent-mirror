# UX Design Framework Implementation Summary

*Location: `docs/agent-notes/` (implementation log; the live rule is `.cursor/rules/315-ux-designer.mdc`).*

**Date**: 20 March 2026  
**Rule**: 315-ux-designer.mdc  
**Change Type**: Full UX Design Framework Addition (~150 lines)

## What Was Added

A comprehensive **UX Design Framework for Enterprise Recruiting** section has been added to the 315-ux-designer rule. This framework provides 20 numbered principles across 5 categories plus a step-by-step layout decision process.

## Framework Structure

### 1. Information Architecture & Structure (Principles #1-5)
- **#1 Card Grouping (Miller's Law)**: Chunk information into 5-9 digestible sections
- **#2 Left-to-Right, Top-to-Bottom Priority (F/Z-Pattern)**: Primary content top-left, secondary right
- **#3 Page title and primary nav**: Hierarchy via `Heading`, left rail, and tabs; **no** breadcrumb or chevron path strips in `design/` prototypes (hard workspace rule)
- **#4 Hub-and-Spoke Navigation**: Tabs/left nav for related views
- **#5 Filter-Then-Act Pattern**: Filters above, data middle, actions below

### 2. Visual Hierarchy & Layout Density (Principles #6-10)
- **#6 Headline Hierarchy**: Workday typography scale with no level-skipping
- **#7 Whitespace for Breathing Room**: Canvas Kit spacing tokens
- **#8 Density for Expert Users (Pattern D)**: Match density to job frequency
- **#9 Visual Weight via Color, Size, Boldness**: Primary/secondary/destructive hierarchy
- **#10 Contrast for Legibility (WCAG AA)**: 4.5:1 minimum ratio

### 3. Cognitive Load Management (Principles #11-15)
- **#11 Progressive Disclosure**: Common visible, advanced collapsed
- **#12 Defaults that Match 80% Use Case**: Pre-select common options
- **#13 Chunking Long Forms**: Wizard for >20 fields or dependencies
- **#14 Confirmation for Destructive Actions**: Modal with specific copy
- **#15 Loading States and Optimistic UI**: Show feedback for >500ms operations

### 4. Interaction Design Laws & Patterns (Principles #16-20)
- **#16 Fitts's Law (Target Size)**: 44×44px touch, 24×24px desktop minimums
- **#17 Hick's Law (Limit Choices)**: Max 7 primary actions, overflow for more
- **#18 Jakob's Law (Familiar Patterns)**: Align with Workday + industry standards
- **#19 Recognition over Recall**: Persistent context (page title, tabs, sticky headers; **no** breadcrumbs or path strips in prototypes)
- **#20 Keyboard Navigation**: All interactive elements keyboard accessible

### 5. Layout Decision Framework (Steps A-F)
Step-by-step process for designing any new screen:
- **Step A**: Identify primary job (JTBD format)
- **Step B**: Choose shell pattern (A/A+/B/C/D)
- **Step C**: Map information hierarchy (primary/secondary/actions)
- **Step D**: Apply density & grouping (frequency-based)
- **Step E**: Validate accessibility (keyboard, contrast, labels)
- **Step F**: Check Canvas Kit coverage (use MCP if uncertain)

## Template Updates

### Updated Section: "UX principles applied"
**Before**: Generic 2-5 bullets with vague placeholders

**After**: Structured template requiring:
1. **Information Architecture** citations (Framework #1-5)
2. **Visual Hierarchy** citations (Framework #6-10)
3. **Cognitive Load** citations (Framework #11-15)
4. **Interaction Design** citations (Framework #16-20)
5. **Layout Decision Framework** (Step A-F with specifics)
6. **Industry UX Principles** (original 8 preserved for continuity)

### Updated Section: "Success Criteria for Prototype"
Added two new criteria:
- Framework application: Discovery Brief cites specific principles (#1-20) with concrete examples
- Layout rationale: Applies Step A-F decision framework to explain shell, hierarchy, density, Canvas Kit

### Updated Section: "Discovery Brief Quality"
**Strong brief now requires**:
- UX Design Framework application with principle citations
- Layout Decision Framework (Step A-F) documentation

**Weak brief flags**:
- Missing UX Design Framework citations
- Weak layout rationale (no explanation for Pattern choice, density, action hierarchy)

## Usage Guidance

### When to Reference Framework

**Always cite** in Discovery Brief for:
- New screens or major layout changes
- Flows with >5 fields or complex interactions
- Features that diverge from existing Workday patterns

**Optional** for:
- Minor enhancements (e.g., add one field to existing form)
- Prototypes that exactly mirror reference PNGs

### In Six Hats Validation

- **Yellow Hat**: Cite principles that make design strong (e.g., "#16 Fitts's Law: actions near data")
- **Black Hat**: Cite principles that might be violated (e.g., "#17 Hick's Law: 9 buttons may overwhelm")
- **Blue Hat**: Summarize framework-driven rationale (e.g., "Pattern D fits high-volume job; #8 density for experts")

## Example Application (WhatsApp Integration)

The framework section includes a complete example showing how to cite principles for a WhatsApp campaign builder feature:

```markdown
**Information architecture**:
- #4 Hub-and-Spoke: Extend Campaigns app with WhatsApp channel tab
- #5 Filter-Then-Act: Campaign list → Filter → Bulk actions

**Visual hierarchy**:
- #6 Headline Hierarchy: "Campaign Builder" (large) → "Message Setup" (medium)
- #9 Visual Weight: "Send test" (secondary) + "Schedule" (primary) + "Delete" (destructive)

**Cognitive load**:
- #11 Progressive Disclosure: Basic visible; advanced collapsed
- #14 Confirmation: "Send to 1,247 candidates?" modal

**Interaction design**:
- #16 Fitts's Law: "Preview" inline with message field
- #17 Hick's Law: Max 4 primary actions; overflow for analytics

**Layout decision**:
- Step A: JTBD = *When I need to reach GCC candidates quickly...*
- Step B: Shell = Pattern A+ (form with side preview)
- Step C: Primary = Message + recipients (left); Secondary = Preview (right)
- Step D: Density = Moderate (not daily, but high-impact)
- Step E: Accessibility = All fields labeled, keyboard nav, preview updates on blur
- Step F: Canvas Kit = TextArea, FormField, PrimaryButton, Modal, StatusIndicator
```

## Impact on Workflow

### For 315 Agent
- Must cite framework principles in every Discovery Brief "UX principles applied" section
- Must document Step A-F layout decisions with specifics
- Provides structured vocabulary for design choices

### For 320 Prototype Developer
- Receives Discovery Briefs with clear design rationale
- Understands *why* Pattern D vs A, or dense vs spacious
- Can challenge design if Canvas Kit doesn't support cited pattern

### For 060 Legal Advisor
- Can cross-check compliance against principles (e.g., #14 confirmation for GDPR consent)
- Framework #11 (progressive disclosure) helps with privacy by default

### For 090 Agent Improvement Advisor
- Can audit Discovery Briefs for framework completeness
- Can suggest improvements by citing missing principles

## Quality Assurance

Discovery Briefs will now be evaluated on:
1. **Completeness**: All 5 framework categories cited with examples
2. **Specificity**: Concrete application to this feature (not generic)
3. **Step A-F documentation**: JTBD, shell, hierarchy, density, accessibility, Canvas Kit
4. **Consistency**: Layout choices align with cited principles

## Migration Notes

- **Existing Discovery Briefs**: Not retroactively updated (would be large effort for marginal gain)
- **Future Discovery Briefs**: Must use new framework template
- **315 Agent behavior**: Will automatically apply framework when invoked post-implementation

## File Changes

**Primary file**: `/Users/david.denham/product-manager-agent/.cursor/rules/315-ux-designer.mdc`
- **Added**: ~150 lines for UX Design Framework section
- **Updated**: "UX principles applied" template (~30 lines)
- **Updated**: "Success Criteria" section (+2 criteria)
- **Updated**: "Discovery Brief Quality" section (+2 strong/weak indicators)

**Total line count change**: +~180 lines (original ~810 → new ~990)

## References

- **Original request**: User asked for improvements to ensure 315 uses "best practice UX design principles and practices for page layout choices" and acts as a "world class designer"
- **Implementation choice**: Full framework (Option 1) for comprehensive coverage
- **Alternative considered**: Top 10 principles only (Option 2) - rejected as incomplete
- **Alternative considered**: Separate playbook file (Option 3) - rejected as less discoverable

## Success Metrics

Discovery Briefs using this framework should exhibit:
- Fewer layout revision requests from 320 (design rationale is clear)
- Better accessibility outcomes (Step E explicit in every brief)
- Stronger Six Hats validation (framework vocabulary for Yellow/Black hats)
- Improved compliance alignment (principles #11, #14 support GDPR by design)

---

**Implementation complete**: 20 March 2026  
**Next step**: Monitor first 2-3 Discovery Briefs to verify framework is applied correctly
