# GCC PMF roadmap v65 — reference slide inventory

**Source file:** `~/Downloads/GCC_Recruiting_PMF_Roadmap_v65.pptx`  
**Extracted:** 27 March 2026 (via `python-pptx` — first text shape per slide, for structure parity only)  
**Slide count:** **~50-60** (excluding any MCP auto-agenda if your pipeline injects one; compare net count when generating)

**Purpose:** Agents cannot reliably “eyeball” binary `.pptx` files. This inventory is the **structural ground truth** for “match v65”. When **130-pmf-slide-generator** runs, the generated `slides_spec_vN.json` should align to this sequence and **content-class** (not necessarily identical wording).

---

## Slide-by-slide (v65)

| # | Primary title text (v65) | Content class |
|---|---------------------------|----------------|
| 1 | GCC Product-Market Fit Research | TITLE |
| 2 | Section Title | Section / confidential divider |
| 3 | Executive Summary | Exec summary body |
| 4 | Section Title | Section divider |
| 5 | Research Question & Objectives | Research challenge |
| 6 | Section Title | Section divider |
| 7 | Strategic Context - Why [REGION] Now | Context (substitute region name) |
| 8 | [REGION] Market Momentum - Key Indicators | Context / metrics (substitute region name) |
| 9 | Section Title | Section divider |
| 10–15 | Political … Legal (6 slides) | PESTEL (one factor per slide); factor name only (no prefix) |
| 16 | Section Title | Section divider |
| 17 | Competitive Landscape - Regional Specialists | Competitive |
| 18 | Competitive Landscape - Global Platforms | Competitive |
| 19 | Competitive SWOT Analysis - Workday Recruiting in GCC | Competitive **SWOT** |
| 20 | Section Title | Section divider |
| 21 | Win / Loss - Top 10 Product Gap Themes (Severity-Weighted) | Win/Loss |
| 22 | Win / Loss - Gap Analysis: Charts | Win/Loss / charts |
| 23 | Win / Loss - GCC-Relevant Severity-1 Gaps (EMEA Proxy) | Win/Loss |
| 24 | Section Title | Section divider |
| 25 | Customer Ideation Hub \| 9,922 ideas analysed … | **Ideation / CSV quant** |
| 26 | Customer Ideation Hub - Top 10 Capability Areas by Idea Volume | Ideation |
| 27 | Ideation Hub: Key Themes | Ideation (subheaders + 3 bullets per theme with quotes) |
| 28 | Section Title | Section divider |
| 29 | Customer Interviews \| 3 GCC-market enterprise participants … | Primary intro |
| 30 | Customer Interview Participants | Participants table |
| 31–33 | Customer Interview - Accenture / Baker Hughes / Shell | One slide per customer |
| 34 | Section Title | Section divider |
| 35-36 | Validated Themes 1-4 / Validated Themes 5-6 | Thematic (GROUPED: 2-3 slides with 3-4 theme subheaders per slide; EXACTLY 3 bullets per theme) |
| 37 | Cross-Source Validation Matrix | Triangulation table |
| 38 | Section Title | Section divider |
| 39 | Gap Analysis | **Funnel / diagnostic** |
| 40 | Section Title | Section divider |
| 41–45 | Recommendation 1: [Title] ... Recommendation 5: [Title] | One slide per recommendation (MAX 5) |
| 46 | Section Title | Bumper / close |

---

## Gaps vs typical `slides_spec_v30+` clones (why decks “don’t match v65”)

Observed drift when comparing **v65** to **v30**:

- **No 5-Phase Framework:** v65 removes the "Research Approach - 5-Phase Framework" slide.
- **Section divider subtitles:** v65 aesthetic uses **SHORT** (2-4 words) plain subtitles like "PESTEL", "Primary research", "Win / Loss"; verbose 12-22 word pipe-separated descriptions break the minimalist agenda style.
- **PESTEL titles:** v65 removes prefix (use "Political", "Economic", etc. only) for cleaner section flow.
- **Strategic Context:** v65 uses **two separate slides** ("Why [REGION] Now" + "Market Momentum", with region name substituted); combining into one loses pacing and emphasis.
- **Competitive block:** v65 has **three** content slides including **SWOT**.
- **Win/Loss:** v65 has **three** content slides (Dataset Overview is removed).
- **Primary research:** v65 moves the **three-slide Customer Ideation Hub** block (Overview, Top Areas, Key Themes with quotes) BEFORE the Primary Research block, and gives it its own section divider. **REMOVED**: AI Ideas Spotlight slide.
- **Thematic:** v65 **groups themes** onto 2-3 slides (e.g., "Validated Themes 1-4", "Validated Themes 5-6") with theme subheaders and EXACTLY 3 bullets per theme (NOT one slide per theme).
- **Funnel / diagnostic:** v65 uses exactly **"Gap Analysis"** as the slide title.
- **Recommendations:** v65 shows **MAX 5** recommendation slides; titles must be formatted as "Recommendation N: [Title]".
- **Dividers:** v65 uses recurring **`Section Title`** section slides between major blocks.

---

## How to use this file

1. **130:** Read this inventory **before** writing `slides_spec_vN.json`. Map each **content class** row to a slide (layout per **`130-pmf-slide-generator.mdc`**).
2. **110:** Do not use this for full PMF decks (see **`110-slide-generator.mdc`**).
3. **Quarterly:** If v65 is superseded, re-run extraction on the new golden deck and replace this file.