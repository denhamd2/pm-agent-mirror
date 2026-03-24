# Query log — GCC baseline CI (Pattern 1a)

**Mission ID:** GCC-E2E-014  
**Date:** 22 March 2026  
**Agent:** 101-competitive-intelligence  
**Scan file:** `research/competitive/gcc/gcc-competitive-scan-2026-03-22-GCC-E2E-014.md`

---

## Deployment Agent MCP (`user-deployment-agent`)

**Thread ID:** `ffba380b-d961-4f1b-8b61-3a4d7f6c9a59`

| # | Question (abridged) | Response summary | Native / workaround / gap notes |
|---|---------------------|------------------|--------------------------------|
| 1 | Arabic UI and RTL for UAE, KSA, Qatar; candidate channels (email, SMS, WhatsApp); Qiwa, Mudad, MOHRE | Arabic UI and multi-script data capture native; career sites and comms configurable in Arabic; **RTL gap** in generated docs (Workday Docs) — leading practice external gen + upload. Email native; Candidate Engagement SMS **not documented for UAE/KSA/QA** → partner path; **WhatsApp = partner** (no native). **Qiwa: gap** (custom integration). **Mudad: gap** (custom). **MOHRE: workaround** (Report Writer + manual submit; full automation = custom). | See scan §Workday parity |
| 2 | Nationalisation (Saudization, Emiratisation, Nitaqat); job boards Bayt, GulfTalent, Naukrigulf | **No native** nationalisation quota product; **workaround** via nationality/citizenship on applications + Report Writer / calculated fields / dashboards. Job boards: **no native direct** integrations; **standard path = multiposter (e.g. Broadbean)**. | Aligns with matrix Native/Workaround/Gap framing |

---

## Web search log (26 queries)

Queries run via workspace `WebSearch` tool; result snapshots synthesised in the scan report.

| # | Query |
|---|--------|
| 1 | Bayzat HR software UAE funding 2025 2026 |
| 2 | Bayzat press release product update 2025 |
| 3 | Bayzat recruiting hiring ATS features payroll |
| 4 | HiBob Bob hiring ATS recruiting module features 2025 |
| 5 | HiBob funding Series valuation 2024 2025 |
| 6 | HiBob UAE Middle East expansion office customers |
| 7 | Zoho Recruit pricing plans 2025 Middle East |
| 8 | Zoho Recruit new features 2025 release notes |
| 9 | Zoho Corporation revenue growth 2024 2025 |
| 10 | Bayzat CEO founder Talal Bayaa |
| 11 | Bayzat G2 reviews HR software UAE |
| 12 | HiBob Mosaic acquisition February 2025 |
| 13 | HiBob Pento acquisition payroll |
| 14 | HiBob pricing per employee 2025 |
| 15 | Zoho Recruit WhatsApp SMS candidate messaging integration |
| 16 | HiBob Gartner Magic Quadrant HR 2024 2025 |
| 17 | Bayzat acquisition merger 2024 2025 |
| 18 | Broadbean Bayt GulfTalent Workday job posting GCC |
| 19 | GCC HR technology market recruiting software trends 2025 |
| 20 | HiBob Ronni Zehavi CEO |
| 21 | Zoho Recruit enterprise security compliance SOC |
| 22 | Bayzat event GITEX HR summit 2025 |
| 23 | HiBob multilingual Arabic language support HRIS |
| 24 | Bayzat WPS UAE payroll compliance government integration |
| 25 | Zoho Recruit Profile Summary Zia languages Arabic |
| 26 | Workday Recruiting Broadbean multiposter job boards Middle East |

---

## @functional-knowledge

**Repo state:** No PDFs present under `functional-knowledge/` in this workspace clone; authoritative inventory documented in `functional-knowledge/VERIFICATION_REPORT.md` (Recruiting Data Purge, UDMF, Offer flows, Security). **This scan** cites that index for **data lifecycle, duplicate management, and purge** context when contrasting enterprise Workday vs regional bundles. **GCC-specific PDPL / nationalisation law** remains **legal-sensitive** — validate with **060** and counsel, not from functional PDFs alone.
