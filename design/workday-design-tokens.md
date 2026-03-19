# Workday Recruiting Design Tokens
**Source**: 2-Way Email Figma (HpAOHGAeXBORpHnyhsCMja)
**URL**: https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024
**Last Updated**: March 18, 2026

## Overview

This document contains design tokens extracted from the Workday Recruiting Figma file. These tokens should be mapped to Canvas Kit equivalents when building prototypes to ensure visual consistency with approved designs.

## Colors

### Primary Colors
*To be extracted from Figma using `get_variable_defs` or `get_design_context`*

**Mapping to Canvas Kit**:
- Figma Primary Blue → `colors.blueberry600`
- Figma Secondary Blue → `colors.blueberry500`
- Figma Light Blue → `colors.blueberry400`

### Semantic Colors
*To be extracted*

**Mapping to Canvas Kit**:
- Success → `colors.greenApple600`
- Warning → `colors.cantaloupe600`
- Error → `colors.cinnamon600`
- Info → `colors.blueberry500`

### Neutral Colors
*To be extracted*

**Mapping to Canvas Kit**:
- Background → `colors.soap100`
- Border → `colors.soap300`
- Text Primary → `colors.blackPepper600`
- Text Secondary → `colors.blackPepper400`

## Typography

### Font Families
*To be extracted from Figma*

**Mapping to Canvas Kit**:
- Canvas Kit uses Roboto by default
- Ensure fonts are imported via `@workday/canvas-kit-react-fonts`

### Type Scale
*To be extracted*

**Mapping to Canvas Kit Components**:
- Heading Large → `<Heading size="large">`
- Heading Medium → `<Heading size="medium">`
- Heading Small → `<Heading size="small">`
- Body Large → `<BodyText size="large">`
- Body Medium → `<BodyText size="medium">`
- Body Small → `<BodyText size="small">`

## Spacing

### Spacing Scale
*To be extracted from Figma*

**Mapping to Canvas Kit**:
- 4px → `space.xxxs`
- 8px → `space.xxs`
- 12px → `space.xs`
- 16px → `space.s`
- 24px → `space.m`
- 32px → `space.l`
- 40px → `space.xl`
- 64px → `space.xxl`
- 80px → `space.xxxl`

## Border Radius

*To be extracted from Figma*

**Common Values**:
- Small: 4px
- Medium: 8px
- Large: 12px
- Card: 8px

## Shadows

*To be extracted from Figma*

**Canvas Kit Elevation**:
- Canvas Kit provides built-in shadow styles through Card components
- Use Card component for consistent elevation

## Common UI Patterns

### Top Navigation
**Pattern**: White background, hamburger menu + logo + search bar + avatar
- Background: White
- Border: Bottom 1px solid `colors.soap300`
- Padding: `paddingX="l"` `paddingY="s"`
- Layout: Flexbox with `justifyContent="space-between"`

**Components**:
- `ToolbarIconButton` for hamburger menu
- `SystemIcon` for search icon
- `TextInput` for search bar
- `Avatar` for user profile

### Card Design
**Pattern**: White container with subtle shadow
- Background: White
- Border radius: 8px
- Padding: `padding="l"`
- Shadow: Built into Canvas Kit `Card` component

### Form Layout
**Pattern**: Vertical stacking with consistent spacing
- Field spacing: `marginBottom="m"`
- Label style: `<label>` with clear hierarchy
- Input width: Full width or constrained max-width
- Button group: `<Flex gap="s">` at bottom

### Tables
**Pattern**: Clean headers, alternating rows, hover states
- Use Canvas Kit `Table` with `.Head`, `.Body`, `.Row`, `.Header`, `.Cell`
- Header background: Light gray
- Row hover: Subtle highlight
- Border: Between rows, subtle color

### Action Buttons
**Hierarchy**:
- Primary action: `PrimaryButton` (blue, filled)
- Secondary action: `SecondaryButton` (outlined)
- Tertiary action: `TertiaryButton` (text only)
- Icon buttons: `ToolbarIconButton` in nav/toolbars

## Extraction Workflow

To extract tokens from Figma:

1. **Get variables**:
   ```
   CallMcpTool(
     server: "plugin-figma-figma",
     toolName: "get_variable_defs",
     arguments: { fileKey: "HpAOHGAeXBORpHnyhsCMja" }
   )
   ```

2. **Get design context from key screens**:
   ```
   CallMcpTool(
     server: "plugin-figma-figma",
     toolName: "get_design_context",
     arguments: { 
       fileKey: "HpAOHGAeXBORpHnyhsCMja",
       nodeId: "[screen-node-id]"
     }
   )
   ```

3. **Document extracted values** in this file

4. **Map to Canvas Kit** in the sections above

## Notes

- Always prefer Canvas Kit tokens over hardcoded values
- When Figma token doesn't have exact Canvas Kit equivalent, choose closest match
- Document any custom mappings or deviations
- Update this file when Figma designs change
