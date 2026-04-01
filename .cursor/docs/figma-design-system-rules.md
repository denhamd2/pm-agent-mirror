# Figma Design System Rules Generation

**Last Updated**: 31 March 2026  
**Source**: Cursor PM presentation (Noah) - Strategic Learning Session

## Overview

The Figma MCP provides a `create_design_system_rules` tool that analyses your Figma design system and generates Cursor rules to enforce design system compliance when building prototypes or components.

**Key Benefit**: Auto-generate rules from your Figma design system (Sana Style, Canvas Kit) instead of manually writing design constraints.

**Cursor PM Recommendation**: 
> "Run this [create_design_system_rules], like, a couple times, and it'll go and, like, look at your files, and then create an actual rule in cursor that tries to, like, encapsulate some of that design system. It's kind of like what we talked about earlier, like... it's alright. It's not perfect by any means."

## When to Use This Tool

Use `create_design_system_rules` when:

✅ **Sana Style design system updates**: When Workday Sana Style components or tokens change in Figma
✅ **Canvas Kit refresh**: When Canvas Kit MCP gets new components that need rule enforcement
✅ **New designer onboarding**: Generate up-to-date rules from current Figma state
✅ **Design drift detection**: Periodically refresh rules to catch design system changes

❌ **Don't use for**:
- One-off prototypes (just reference existing rules)
- Non-Workday design systems (tool is optimised for enterprise design systems)
- When manual rules already capture all constraints

## How to Invoke

### Method 1: Direct MCP Tool Call (Preferred)

```
Call the Figma MCP tool: create_design_system_rules

Parameters:
- clientLanguages: "typescript,javascript,css"
- clientFrameworks: "react,vite"
```

**Example prompt**:
```
Use the Figma MCP create_design_system_rules tool to analyse the Sana Style design system and generate Cursor rules for:
- Languages: typescript, javascript, css
- Frameworks: react, vite
- Focus: Canvas Kit component usage, Workday colour palette, typography standards
```

### Method 2: Via Agent (When context needed)

If you need to provide additional context or have the agent interpret Figma files first:

```
@ux-designer, use Figma MCP to:
1. Review the Sana Style Figma file (provide URL)
2. Extract design tokens, component patterns, and constraints
3. Generate Cursor rules using create_design_system_rules
4. Save rules to .cursor/rules/design-specific/020-sana-style-auto-generated.mdc
```

## Tool Parameters

### clientLanguages (required)
**Type**: String (comma-separated list)  
**Purpose**: Tells Figma what languages your codebase uses (for logging and rule optimisation)

**Workday Recruiting Context**: `"typescript,javascript,css"`

**Examples**:
- Prototype repo: `"typescript,javascript,css"`
- Full-stack: `"typescript,javascript,python,sql"`
- Unknown: `"unknown"` (better than guessing)

### clientFrameworks (required)
**Type**: String (comma-separated list)  
**Purpose**: Tells Figma what frameworks to optimise rules for

**Workday Recruiting Context**: `"react,vite"`

**Examples**:
- Canvas Kit prototypes: `"react,vite"`
- Full app: `"react,vite,node,express"`
- Unknown: `"unknown"` (better than guessing)

## What Output to Expect

The tool generates a **prompt** (not the rules themselves) that you can use to create design system rules. The prompt includes:

1. **Component inventory**: List of design system components found in Figma
2. **Token mappings**: Colours, typography, spacing extracted from Figma variables
3. **Usage patterns**: How components should be composed (from Figma Code Connect if configured)
4. **Constraint suggestions**: Rules to enforce (e.g., "Always use `ink` color for body text, never hardcode `#1A1A26`")

**Expected workflow**:
1. Call `create_design_system_rules` → Get analysis prompt
2. Use prompt to generate rule content in Cursor
3. Save as `.cursor/rules/design-specific/020-sana-style-auto-generated.mdc`
4. Review and refine (tool output is "alright, not perfect")

## Integration with Workday Design Workflow

### Sana Style Source Files

**Primary Figma Files to Analyse**:
- Workday Sana Style Design System (main file with tokens, components, patterns)
- Canvas Kit Component Library (if separate from Sana Style)
- Regional variants (if GCC/India have locale-specific patterns)

**How to provide file URLs**:
```
Analyse these Figma files for design system rules:
1. Sana Style: figma.com/design/[fileKey]/Workday-Sana-Style
2. Canvas Kit: figma.com/design/[fileKey]/Canvas-Kit-Library

Use create_design_system_rules with:
- Languages: typescript, javascript, css
- Frameworks: react, vite
```

### Rule Output Location

Generated rules should live in:
```
.cursor/rules/design-specific/020-sana-style-auto-generated.mdc
```

**Naming convention**: Use `020-sana-style-auto-generated.mdc` to:
- Differentiate from manually written `015-sana-style-ui.md`
- Load after base style guide (`010-style-guide.mdc`)
- Signal "auto-generated, review before trusting completely"

### Validation & Refinement

**After generation, validate**:
1. **Compare to `015-sana-style-ui.md`**: Check for conflicts or redundancy
2. **Test with prototype**: Build a sample component; does rule enforcement work?
3. **Manual refinement**: Noah said tool is "alright, not perfect" - expect to edit
4. **Version in git**: Track changes to auto-generated rules over time

**Common refinements needed**:
- Remove overly specific constraints (e.g., exact pixel values → ranges)
- Add context (e.g., "Use `blueberry` for primary actions, `ink` for text")
- Simplify (tool may generate verbose rules; condense for readability)

## Cursor PM Insights (Noah's Guidance)

From the presentation transcript:

> **On Figma MCP's create_design_system_rules**:
> - "We have a new interface coming as well... Figma MCP... they have, like, a create design systems rule, so you can run this, like, a couple times, and it'll go and, like, look at your files, and then create an actual rule and cursor that tries to, like, encapsulate some of that design system."
> - **Quality caveat**: "It's kind of like what we talked about earlier, like... it's alright. It's not perfect by any means."

**Takeaway**: Use as a **starting point**, not final output. Expect to refine manually.

> **On Figma MCP for design workflows**:
> - "Figma MCP has been, like, sort of hit or miss. Like, sometimes it works, sometimes it doesn't work. It's great for giving the agent an understanding of the flow in which you're operating through, but not actually great at, like, reproducing the designs from Figma."
> - "We've seen better success with just, like, redlining different components, building stuff out that way."

**Takeaway**: Use Figma MCP for **design context** and **rule generation**, not for **design-to-code** (your prototype-first workflow is already optimal).

## Best Practices

### When to Regenerate Rules

**Quarterly refresh cadence** (align with Workday release cycles):
- After major Sana Style updates
- When Canvas Kit adds new components
- After design system audits or token migrations

**Ad-hoc regeneration**:
- Designer reports prototype doesn't match Figma
- New regional design patterns added (GCC RTL, India vernacular)
- Compliance requirements change visual standards

### Rule Management Strategy

**Two-tier rule system**:

1. **Manual rules** (`015-sana-style-ui.md`):
   - High-level design principles (neutral surfaces, token-first)
   - Strategic guidance (when to use Blueberry vs. neutral)
   - Workflow instructions (prototype → capture to Figma)

2. **Auto-generated rules** (`020-sana-style-auto-generated.mdc`):
   - Specific token values (`--spacing-200: 8px`)
   - Component constraints ("Button must use Canvas Kit `<Button>`, never custom `<button>`")
   - Colour palette enforcement ("Never use hex #1A1A26, use `ink` token")

**Why separate**:
- Manual rules = strategic, stable, human-curated
- Auto-generated = tactical, changes frequently, machine-generated

### Always ✅

- **Review before committing**: Auto-generated rules may have errors
- **Version in git**: Track rule changes over time
- **Test with prototype**: Validate rules actually enforce design system
- **Document source**: Add comment in rule file: "Auto-generated from [Figma URL] on [date]"
- **Merge with 015**: Cross-reference manual and auto-generated rules to avoid conflicts

### Never ❌

- Trust auto-generated rules blindly without manual review
- Overwrite manual rules (`015-sana-style-ui.md`) with auto-generated content
- Generate rules from outdated Figma files (check last-modified date)
- Skip validation step (build a test component before trusting rules)
- Forget to update when design system changes

## Related Documentation

- **`010-style-guide.mdc`** → Deck Generation section (typography, colours)
- **`015-sana-style-ui.md`** → Manual Sana Style UI design rules
- **`315-design-brief-creation.mdc`** → Design workflow (where rules are applied)
- **`320-prototype-developer.mdc`** → Canvas Kit MCP usage (rule enforcement)

## Troubleshooting

### Issue: Tool generates overly verbose rules

**Symptom**: 500+ line rule file with every component variant listed  
**Fix**: Extract high-level patterns; condense to essential constraints

### Issue: Rules conflict with existing `015-sana-style-ui.md`

**Symptom**: Linter errors or conflicting guidance in agent responses  
**Fix**: Consolidate conflicts; prefer manual rules for strategic guidance, auto-generated for tactical tokens

### Issue: Rules don't reflect latest Sana Style changes

**Symptom**: Prototypes built per rules don't match current design system  
**Fix**: Regenerate rules from updated Figma file; check file last-modified date

### Issue: Tool returns "Could not find design system components"

**Symptom**: Figma file doesn't have Code Connect or structured component library  
**Fix**: Manually write rules from Figma inspection; consider setting up Code Connect mappings

---

**Remember**: `create_design_system_rules` is a **timesaver**, not a **replacement** for design judgment. Use it to bootstrap rules, then refine manually. As Noah said: "It's alright, not perfect."
