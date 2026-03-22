# GCC Nationalization & Compliance - Design Analysis

**Figma File**: https://www.figma.com/design/xNmMG73Ic5BN20BvFQEF2K  
**Date Captured**: 18 March 2026  
**Design Reference**: 2-Way Email Recruiting (HpAOHGAeXBORpHnyhsCMja)  
**Prototype**: design/gcc-nationalization-compliance.tsx  
**MISSION**: MISSION-008 (GCC E2E Pipeline Step 6)

---

## Summary

GCC Nationalization & Compliance dashboard prototype captured to Figma. The design shows nationalisation metrics for Saudi Arabia (Nitaqat), UAE (Emiratisation), and Kuwait (Kuwaitisation) with compliance status indicators, progress bars with threshold markers, and a drill-down table by department.

---

## Consistency Check

**Comparison with Workday Design Reference**:
- **Colors**: ✅ Consistent – Canvas Kit tokens (greenApple, cantaloupe, cinnamon, blueberry, soap)
- **Spacing**: ✅ Consistent – space.l, space.m, space.s from Canvas Kit
- **Typography**: ✅ Consistent – Heading, BodyText with size variants
- **UI Patterns**: ✅ Matches reference – Top nav (hamburger + logo + search + avatar), Card layout, Table with headers

**Reference**: See `/design/workday-design-tokens.md` for standard tokens

---

## Compliance Status Colours (Design Tokens)

| Status | Text Colour | Background | Canvas Kit Token |
|--------|-------------|------------|------------------|
| Compliant | `colors.greenApple600` | `colors.greenApple100` | Success |
| At risk | `colors.cantaloupe600` | `colors.cantaloupe100` | Warning |
| Non-compliant | `colors.cinnamon600` | `colors.cinnamon100` | Error |

---

## Threshold Indicators

- **Progress bar**: Horizontal bar with fill percentage; status colour reflects compliance
- **Threshold marker**: Vertical black line (`colors.blackPepper400`) at threshold %; tooltip "Threshold: X%"
- **Badge**: Rounded pill with status label and background

---

## Component Breakdown

### Primary Components
- **Top Navigation**: Hamburger menu, Workday logo, search bar, avatar (standard Workday pattern)
- **Metric Cards** (×3): Saudi Arabia, UAE, Kuwait – each with programme name, %, progress bar, status badge, nationals count
- **Info tooltips**: (i) icon per card with regulatory context (Nitaqat, Emiratisation, Kuwaitisation)
- **Export report**: PrimaryButton with export icon
- **Filter buttons**: All countries, Saudi Arabia, UAE, Kuwait (SecondaryButton; selected state uses blueberry100)
- **Table**: Department, Country, Nationals, Total, Nationalisation %, Status
- **Success banner**: Green when export completes; "Report exported successfully. Ready for government submission."

### Canvas Kit Mapping
- `Card`, `PrimaryButton`, `SecondaryButton`, `ToolbarIconButton`
- `Table` with `.Head`, `.Body`, `.Row`, `.Header`, `.Cell`
- `TextInput`, `Avatar`, `SystemIcon`, `Tooltip`
- `Heading`, `BodyText`, `Flex`, `Box`

---

## Filtered View States (URL Hash)

For capturing additional states, use these URLs:

- **Default (All countries)**: `http://localhost:5177/`
- **Saudi Arabia**: `http://localhost:5177/#country=saudi`
- **UAE**: `http://localhost:5177/#country=uae`
- **Kuwait**: `http://localhost:5177/#country=kuwait`

Combine with Figma capture hash for manual re-capture via the capture toolbar.

---

## Annotations for Compliance

1. **Threshold indicators**: Progress bars show compliance vs. threshold; vertical marker indicates required %
2. **Status badges**: Compliant (green), At risk (orange), Non-compliant (red)
3. **Info tooltips**: Regulatory context per country (Nitaqat, Emiratisation, Kuwaitisation)
4. **Export success**: Banner confirms export; avoid implying Workday guarantees government submission readiness (per 319-doc-writer review)

---

## Implementation Notes

- Prototype uses Canvas Kit v11 with compound Table, Tabs data-id pattern
- Canvas Tokens Web CSS imported in main.tsx
- URL hash `#country=saudi|uae|kuwait` initialises filter state for capture

---

## Next Steps

- **060-legal-advisor**: Compliance review (invoke per 330-figma-creator rule)
- **400-backlog-refinement**: Create epic and user stories in Jira (GCC E2E Pipeline Step 7)
