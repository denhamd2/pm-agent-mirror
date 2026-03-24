# GCC PMF roadmap v30 — reference slide inventory

**Source file:** `~/Downloads/GCC_Recruiting_PMF_Roadmap_v30.pptx`  
**Extracted:** 22 March 2026 (via `python-pptx` — first text shape per slide, for structure parity only)  
**Slide count:** **50** (excluding any MCP auto-agenda if your pipeline injects one; compare net count when generating)

**Purpose:** Agents cannot reliably “eyeball” binary `.pptx` files. This inventory is the **structural ground truth** for “match v30”. When **130-pmf-slide-generator** runs, the generated `slides_spec_vN.json` should align to this sequence and **content-class** (not necessarily identical wording).

---

## Slide-by-slide (v30)

| # | Primary title text (v30) | Content class |
|---|---------------------------|----------------|
| 1 | GCC Product-Market Fit Research | TITLE |
| 2 | Workday Confidential | Section / confidential divider |
| 3 | Research Author | Attribution / methodology ownership |
| 4 | Executive Summary | Exec summary body |
| 5 | Workday Confidential | Section divider |
| 6 | Research Question & Objectives | Research challenge |
| 7 | Research Approach - 5-Phase Framework | Methodology |
| 8 | Workday Confidential | Section divider |
| 9 | Strategic Context - Why GCC Now | Context |
| 10 | GCC Market Momentum - Key Indicators | Context / metrics |
| 11 | Workday Confidential | Section divider |
| 12–17 | PESTEL - Political … Legal (6 slides) | PESTEL (one factor per slide) |
| 18 | Workday Confidential | Section divider |
| 19 | Competitive Landscape - Regional Specialists | Competitive |
| 20 | Competitive Landscape - Global Platforms | Competitive |
| 21 | Competitive SWOT Analysis - Workday Recruiting in GCC | Competitive **SWOT** |
| 22 | Workday Confidential | Section divider |
| 23 | Win / Loss Analysis - Dataset Overview | Win/Loss |
| 24 | Win / Loss - Top 10 Product Gap Themes (Severity-Weighted) | Win/Loss |
| 25 | Win / Loss - Gap Analysis: Charts | Win/Loss / charts |
| 26 | Win / Loss - GCC-Relevant Severity-1 Gaps (EMEA Proxy) | Win/Loss |
| 27 | Workday Confidential | Section divider |
| 28 | Customer Interviews \| 3 GCC-market enterprise participants … | Primary intro |
| 29 | Customer Interview Participants | Participants table |
| 30–32 | Customer Interview - Accenture / Baker Hughes / Shell | One slide per customer |
| 33 | Customer Ideation Hub \| 9,922 ideas analysed … | **Ideation / CSV quant** |
| 34 | Customer Ideation Hub - Top 10 Capability Areas by Idea Volume | Ideation |
| 35 | Customer Ideation Hub - 6 Key Themes from Verbatim Analysis | Ideation |
| 36 | Customer Ideation Hub - AI Ideas Spotlight | Ideation |
| 37 | Workday Confidential | Section divider |
| 38 | Validated Themes 1-4 - Globally Validated (3/3 sources) | Thematic |
| 39 | Validated Themes 5-7 - Validated (2+ sources) | Thematic |
| 40 | Cross-Source Validation Matrix | Triangulation table |
| 41 | Workday Confidential | Section divider |
| 42 | GCC Recruiting Gap Analysis - Full Funnel | **Funnel / diagnostic** |
| 43 | Workday Confidential | Section divider (or continuation — verify in deck) |
| 44–49 | Recommendation 1–6 (P1/P2 mix) | One slide per recommendation |
| 50 | Workday Confidential | Bumper / close |

---

## Gaps vs typical `slides_spec_v46+` clones (why decks “don’t match v30”)

Observed drift when comparing **v30** to **`slides_spec_v47.json`** (48 slides):

- **Missing Research Author** slide (v30 #3).
- **Competitive block:** v30 has **three** content slides (#19–21) including **SWOT**; many specs use only **one** competitive body slide.
- **Win/Loss:** v30 has **four** content slides (#23–26); many specs collapse to **one or two**.
- **Primary research:** v30 includes a **four-slide Customer Ideation Hub** block (#33–36); specs often omit when only interviews are emphasised — but v30 treats **quant + qual** as one section.
- **Thematic:** v30 uses **two** theme summary slides + matrix (#38–40); newer specs sometimes add **many** per-theme deep-dive slides instead, shifting length and rhythm away from v30.
- **Funnel / diagnostic:** v30 includes **GCC Recruiting Gap Analysis - Full Funnel** (#42–43); often **absent** in newer JSON.
- **Recommendations:** v30 shows **six** recommendation slides; PMF may produce **eight** — OK if an **E2E handoff** table slide is added, but total deck length and divider rhythm should still target **~50 slides** and preserve **SWOT + Win/Loss depth + Ideation + Funnel** unless the PM explicitly requests a **focus deck**.
- **Dividers:** v30 uses recurring **“Workday Confidential”** section slides between major blocks; MCP specs often use **`Section Title`** with different subtitles — visually different though structurally similar.

---

## How to use this file

1. **130:** Read this inventory **before** writing `slides_spec_vN.json`. Map each **content class** row to a slide (layout per **`130-pmf-slide-generator.mdc`**).
2. **110:** Do not use this for full PMF decks (see **`110-slide-generator.mdc`**).
3. **Quarterly:** If v30 is superseded, re-run extraction on the new golden deck and replace this file.

---

*Extraction script (maintainer): `python3 -c "from pptx import Presentation; ..."` on the golden `.pptx`.*
