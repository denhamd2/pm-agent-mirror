# Visual Review: AI System of Record (v97)

**Prototype URL**: `http://localhost:5199/ai-system-of-record-v97`
**Screenshots captured**: 3 screenshots (Overview & Impact, AI Inventory, Governance & Controls)
**Review date**: 2026-04-08
**Reviewer**: 321-prototype-visual-reviewer

## Screenshot Analysis

### Screenshot 1: Overview & Impact
**Observations**:
- The main layout uses `ProfilePageLayout` effectively with the `WorkdayLeftTabBar`.
- The top metric cards are currently custom `Card` components with hardcoded colors.
- The "Cost vs. Value Analysis" chart is just a grey placeholder box with text.

### Screenshot 2: AI Inventory
**Observations**:
- The table displays the inventory correctly using Canvas Kit `Table`.
- `StatusIndicator` is used correctly for Risk Level and Status.
- There are no filtering or search controls above the table, which would be expected for an inventory list.

### Screenshot 3: Governance & Controls
**Observations**:
- The `Switch` components appear as `readonly` in the accessibility tree, likely because they lack an `id` or are fully controlled without an interactive `onChange` handler.
- The layout of the thresholds is clean, but the "Automatic Privilege Revocation" and "AI System User (ASU) Auth" cards use `soap100` backgrounds which is slightly off from the standard white cards on a `SANA_PAGE_CANVAS` background.

## Visual Bugs Identified

**Critical (Must fix before Figma)**:
None.

**Important (Should fix)**:
1. **Metric Cards**: The top three metric cards in the Overview tab should use the shared `MetricCard` component from `MetricCard.tsx` instead of custom `Card` implementations. This ensures consistency with other Workday dashboards.
2. **Chart Placeholder**: The grey box placeholder for the chart should be replaced with a `ChartCard` from `GenUIPatterns.tsx` to provide a more realistic visual representation of the data.
3. **Inventory Controls**: Add a search bar (`FormTextInput` or `TextInput` with a search icon) and a filter dropdown (`FormSelect`) above the AI Inventory table to make it feel like a functional list.
4. **Card Backgrounds**: In the Governance tab, the two bottom cards use `backgroundColor={colors.soap100}`. They should use the default white background (`colors.frenchVanilla100`) with a standard border or shadow to match Sana Style.

**Minor (Optional polish)**:
1. **Switch Interactivity**: Ensure the `Switch` components in the Governance tab have an `id` so they don't default to readonly, making the prototype feel more interactive.

## Canvas Kit Usage

**Correct**:
- `ProfilePageLayout` and `WorkdayLeftTabBar` are used correctly.
- `Table` and `StatusIndicator` are implemented perfectly.

**Incorrect or Questionable**:
- Custom metric cards instead of `MetricCard`.
- Placeholder grey box instead of `ChartCard`.

## Sana Style Compliance

**Strong**:
- Neutral surfaces and minimal blue are respected.
- `SANA_CARD_RADIUS_LG` is used consistently.

**Needs adjustment**:
- `soap100` backgrounds on the Governance cards should be removed in favor of standard white cards on the grey canvas.

## Design Brief Alignment

**Matches intent**:
- All tabs are implemented and populated with relevant data.
- The layout matches the hub-style profile pattern.

## Final Verdict: NEEDS REVISION

**NEEDS REVISION**: Prototype has important visual and component usage issues. 320 should address the issues listed above before Figma capture. One revision pass recommended.

---

**Next Steps**:
- Return to 320-prototype-developer with the specific fix list.