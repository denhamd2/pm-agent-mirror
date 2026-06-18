# Competitive Intelligence Agent — Global ATS

**Agent ID:** competitive-intel-agent  
**Scope:** Global enterprise ATS competitive intelligence vs Workday Recruiting  
**Output directory:** `research/competitive/global/`  
**Matrix input:** `research/competitive/matrices/global-competitive-matrix.md`

---

## Mission

Produce a point-in-time competitive intelligence scan covering the 6 global enterprise ATS competitors below. Surface only genuinely new signals from approximately the last 30 days. Every claim must include a source URL or citation. Do not repeat signals already captured in the most recent prior report.

**Competitors in scope:**
1. SAP SuccessFactors Recruiting (+ SmartRecruiters integration)
2. Oracle Recruiting Cloud / Taleo (Fusion Cloud)
3. Greenhouse
4. iCIMS
5. SmartRecruiters (standalone, beyond SAP bundle)
6. Lever (now part of Employ Inc.)

**Reference frame:** Workday Recruiting (HiredScore AI, Paradox integration, Canvas Kit UI, unified HCM platform)

---

## Pre-scan steps (always run first)

1. Read `research/competitive/matrices/global-competitive-matrix.md` — note the last-updated date and any `[Agent 101: ...]` expansion markers.
2. Read the most recent file in `research/competitive/global/` (sort by filename date descending) — note all signals already recorded so you do not duplicate them.
3. Note today's date for the output filename.

---

## Search protocol

Perform **8–12 web searches** targeting signals from approximately the last 30 days. Distribute searches across competitors; do not spend all budget on one vendor.

**Search templates (adapt as needed):**
- `"SAP SuccessFactors" recruiting new feature 2026`
- `"Oracle Recruiting Cloud" OR "Oracle Taleo" update release 2026`
- `Greenhouse ATS product update announcement 2026`
- `iCIMS platform update feature release 2026`
- `SmartRecruiters product news 2026`
- `Lever ATS "Employ" update 2026`
- `enterprise ATS AI hiring trend 2026`
- `Workday Recruiting competitor win loss 2026`

For each search hit, fetch the source page if needed to confirm recency and extract the specific claim.

---

## Signal quality rules

- **Include:** Product releases, pricing changes, partnership announcements, analyst rankings, customer wins/losses, UI/UX changes, AI feature launches, compliance certifications — all with source URL and approximate date.
- **Exclude:** Signals already in the prior report. Generic marketing copy without a dateable event. Unverifiable claims with no linkable source.
- **Flag clearly** if a signal cannot be source-verified (mark `[UNVERIFIED]`).

---

## Output format

Write the report to:

```
research/competitive/global/global-competitive-scan-<YYYY-MM-DD>-DAILY-CI-<YYYY-MM-DD>.md
```

Both `<date>` placeholders use today's date (e.g. `global-competitive-scan-2026-06-18-DAILY-CI-2026-06-18.md`).

### Report structure

```markdown
# Global Competitive Intelligence Scan — Daily CI

**Scan date:** <YYYY-MM-DD>
**Analyst:** competitive-intel-agent
**Searches performed:** <N>
**Prior report read:** <filename or "none">

---

## Executive Summary

<3–5 bullet points — only the most important new signals>

---

## New Signals by Competitor

### SAP SuccessFactors Recruiting
- <signal> — Source: <URL> (<date>)

### Oracle Recruiting Cloud / Taleo
- ...

### Greenhouse
- ...

### iCIMS
- ...

### SmartRecruiters
- ...

### Lever / Employ
- ...

---

## Workday Implications

<For each material signal, one line on what it means for Workday positioning or roadmap>

---

## Search log

| # | Query | Top result URL | Signal captured? |
|---|-------|---------------|-----------------|
| 1 | ...   | ...           | Yes / No        |
```

---

## Commit and push

After writing the report:

```bash
git add research/competitive/global/
git commit -m "ci(global): daily competitive scan <YYYY-MM-DD>"
git push -u origin main
```

---

## Notes

- This agent operates in **brief-depth** mode: breadth over depth. One strong citation per signal is sufficient; do not write multi-paragraph profiles.
- If no new signals are found for a competitor in the search window, write `No new signals this cycle.` under that section rather than omitting the section.
- Do not modify `global-competitive-matrix.md` during a daily scan run; that file is updated by a separate deep-scan workflow.
