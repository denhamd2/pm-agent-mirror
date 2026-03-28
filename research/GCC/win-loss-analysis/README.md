# Legacy Win-Loss Analysis Folder (Deprecated)

**Status:** DEPRECATED - 27 March 2026  
**Migration:** Data routing corrected to use **108-tableau-gap-analyser** for presales gap data

## Historical Context

This folder contains outputs from agent **107-win-loss-analyser.mdc** during missions GCC-E2E-024 through GCC-E2E-028. These analyses were performed on presales product gap data (Opportunity Detail.xlsx containing Gap ID, Severity, Product Capability columns), not qualitative win-loss interview transcripts.

### Data Source Misalignment

**What was analyzed:**
- File: `research/GCC/win-loss-interviews/Opportunity Detail.xlsx`
- Content: Presales product gaps with structured fields (Gap ID, Severity, Product Capability, CI Notes)
- Type: **Quantitative presales intelligence** from Tableau export

**What should have been analyzed:**
- This type of data should have been analyzed by **108-tableau-gap-analyser.mdc**
- Output should have been in `research/GCC/gap-analysis/` folder

**Correction Applied:**
- Opportunity Detail.xlsx moved to `research/GCC/gap-data/` (27 March 2026)
- Future E2E runs will use 108 for Step 2.75 per orchestrator specification
- Agent 107 deprecated and removed from workspace

## Files in This Folder

These analysis files remain for historical reference:

- `2026-03-25-win-loss-analysis.md` - GCC-E2E-024 (initial E2E run)
- `2026-03-26-win-loss-analysis-GCC-E2E-022.md` - Mission 022
- `2026-03-26-win-loss-analysis-GCC-E2E-024.md` - Mission 024
- `2026-03-26-win-loss-analysis.md` - Earlier run
- `2026-03-27-win-loss-analysis-GCC-E2E-025.md` - Mission 025
- `2026-03-27-win-loss-analysis-GCC-E2E-026.md` - Mission 026
- `2026-03-27-win-loss-analysis-GCC-E2E-027.md` - Mission 027
- `2026-03-27-win-loss-analysis-GCC-E2E-028.md` - Mission 028
- `_scratch-*` files - Intermediate processing artifacts

### Regional Filtering Note

All analyses show **"Gulf GCC row count after filter: 0"** because the Opportunity Detail.xlsx file did not contain regional identifiers that matched the GCC filtering logic. The file was a global presales gap export, not a region-specific dataset.

## Migration Path

**Future E2E pipelines:**
1. Place presales gap data in `research/GCC/gap-data/`
2. Orchestrator will route to **108-tableau-gap-analyser** for Step 2.75
3. Output will be in `research/GCC/gap-analysis/` folder

**For reference:**
- Agent 108 rule: `.cursor/rules/108-tableau-gap-analyser.mdc`
- Implementation summary: `docs/108-implementation-summary.md`
- Orchestrator spec: `.cursor/rules/000-master-orchestrator.mdc` (Step 2.75 definition)

---

**These files are preserved for historical tracking only. Do not use 107 or this folder for new analyses.**
