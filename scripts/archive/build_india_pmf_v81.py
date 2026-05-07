#!/usr/bin/env python3
"""Build slides_spec_v81.json for India PMF IN-PMF-002 (130 standards)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "decks" / "specs" / "slides_spec_v81.json"

def tb_body(paragraphs, font_pt=14, h=2.8):
    return {
        "left_inches": 0.7,
        "top_inches": 1.2,
        "width_inches": 8.6,
        "height_inches": h,
        "font_name": "Archivo",
        "font_size_pt": font_pt,
        "color": "ink",
        "paragraphs": paragraphs,
    }

def section(nn, name):
    return {
        "master_index": 1,
        "layout_name": "Section Title",
        "text_boxes": [{
            "left_inches": 3.3,
            "top_inches": 1.5,
            "width_inches": 5.6,
            "height_inches": 2.2,
            "font_name": "Archivo",
            "font_size_pt": 12,
            "color": "ink",
            "text": f"S E C T I O N  {nn}\n{name}",
        }],
    }

def pi_text(implication):
    return [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": implication, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
    ]

def pestel_slide(title, bullets, implication, refs, speaker_extra=""):
    paras = [{"level": 1, "text": b} for b in bullets]
    paras.append({"level": 0, "text": pi_text(implication)})
    sn = (
        "• Anchor each bullet in live Q&A.\n"
        "• Tie factor to India volume and Know Your Candidate.\n"
        "• Note phased DPDP where relevant.\n"
        "• Emphasise partner-mediated Aadhaar where Legal applies.\n"
        "• Keep Product implication as roadmap bridge.\n\n"
        f"References:\n{refs}"
    )
    if speaker_extra:
        sn = speaker_extra + "\n\n" + sn
    return {
        "master_index": 1,
        "layout_name": "Title Only_Alt" if hash(title) % 2 else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paras, font_pt=12, h=3.0)],
        "speaker_notes": sn,
    }

slides = []

# 1 TITLE
slides.append({
    "master_index": 1,
    "layout_name": "TITLE",
    "placeholders": {
        "0": {"text": "India Recruiting Product-Market Fit Research"},
        "1": {"text": "March 2026"},
    },
})

# Executive summary section
slides.append(section("01", "Executive summary"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Executive Summary"}},
    "text_boxes": [tb_body([
        {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "India PMF is dominated by scale economics: small UX and matching gaps become full-time roles when hire counts reach hundreds per week and thousands per month; Know Your Candidate joins identity proof, duplicate detection, agency economics, and DPDP-era data minimisation."},
        {"level": 1, "text": "Internal experts and Teleperformance India interviews converge on impersonation risk, resume fraud, weak duplicate signalling, India-specific offer and BGC flexibility, and document capture across funnel stages; competitive matrix flags true gaps on native +91 SMS, WhatsApp core UI, and UIDAI Aadhaar eKYC."},
        {"level": 1, "text": "Q2 strategy ties India to scale growth, DPDP compliance programmes, local job boards, and eight target wins; AI candidate matching and core ATS parity matter when disclosure and human oversight satisfy India committees."},
        {"level": 1, "text": "Triangulation is strong on identity, duplicates, and document UX; presales gap exports were not available for this mission, so prioritisation leans on interviews, SMEs, and competitive intelligence."},
        {"level": 1, "text": "Priority direction: government-ID-aware dedupe with Legal minimisation, DPDP-aligned BGV consent and retention, hardened KYC gating and notifications, first-class BGC reinitiate patterns, and governed HiredScore activation."},
    ])],
    "speaker_notes": "• Lead with scale before features.\n• Name eight-win India row.\n• Cite single-customer limitation for Step 8.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
})

# Research challenge
slides.append(section("02", "Research challenge"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Research Question and Objectives"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Assess Workday Recruiting product-market fit in India for enterprise, GCC-led, and high-volume programmes using strategy context, macro analysis, competitive intelligence, internal experts, and customer interviews."},
        {"level": 1, "text": "Prioritise roadmap-ready actions aligned to Q2 Talent Acquisition priorities, India scale row targets, AI matching with governance, and core ATS parity."},
        {"level": 1, "text": "Triangulate SME patterns with customer evidence and market scans; score recommendations using reach, composite impact, confidence, and effort."},
        {"level": 1, "text": "Mission themes: high-volume hiring and Know Your Candidate (fraud prevention, identity, background verification)."},
    ])],
    "speaker_notes": "• Frame as new market entry readout.\n• Note no presales win-loss export for this run.\n\nReferences:\n• research/India/strategy-context-2026-03-31-IN-PMF-002.md",
})

# Context review
slides.append(section("03", "Context review"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Strategic Context - Why India Now"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "India is an explicit scale-growth row in Q2 2026 with DPDP compliance programmes, local job board reach through certified partner distribution, and eight customer wins targeted; buying committees expect audit-grade hiring data alongside velocity."},
        {"level": 1, "text": "GCC remains the numbered global Priority 1; use it only as a benchmark for omnichannel, compliance narrative, and local board packaging when selling APAC, not as the lead bullet for this deck."},
        {"level": 1, "text": "AI candidate matching (Priority 2) and core ATS parity (Priority 3) matter for India when human oversight, explainability, and purpose limitation are credible alongside DPDP notices and retention design."},
        {"level": 1, "text": "Company OKR on international growth and Recruiting NPS 60 frames revenue and experience pressure; India programmes amplify any per-candidate friction into FTE cost."},
    ])],
    "speaker_notes": "• Ground in product-priorities-q2-2026.md read for Step 1.\n• Annual PDF was absent from repo; quarterly markdown only.\n\nReferences:\n• strategy/markdown/product-priorities-q2-2026.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "India Market Momentum - Indicators"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Industry syntheses size India HR technology in the hundreds of millions USD with mid-to-high single-digit CAGR toward 2030; IMARC cites India ATS near USD 0.30B in 2024 toward USD 0.50B by 2033 at about 7.2% CAGR."},
        {"level": 1, "text": "IT services campus and fresher hiring remains a structural volume driver: trade reporting cites roughly 150,000 fresher hiring intentions for FY26 across large firms, with GCCs absorbing graduate demand."},
        {"level": 1, "text": "GCC expansion narratives cite 1,700+ capability centres and about two million professionals in analyst commentary, raising expectations for time-to-hire, governance, and cross-border people data operations."},
        {"level": 1, "text": "Naukri JobSpeak indices in 2025 showed strong white-collar growth with fresher and non-IT momentum in vendor commentary, supporting TA systems spend."},
    ])],
    "speaker_notes": "• Treat vendor market sizing as directional.\n• Pair economic tailwinds with DPDP implementation budgets.\n\nReferences:\n• research/India/pestel-analysis-India-2026-03-31-IN-PMF-002.md",
})

# Product strategy (India first)
slides.append(section("04", "Product strategy"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Q2 2026 Product Priorities"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "India scale growth leads: eight customer wins targeted in Q2 with DPDP compliance programmes and local job boards via Broadbean-class multipartner and Studio scoping where needed; this is the focal regional mandate for IN-PMF-002."},
        {"level": 1, "text": "AI candidate matching supports India volume when HiredScore and Workday AI are activated with human review, audit logs, and disclosures that satisfy enterprise risk committees and multinationals’ AI governance expectations."},
        {"level": 1, "text": "Core ATS parity (bulk grid, mobile recruiter, BGV integrations, Paradox scheduling) directly reduces friction in high-volume and Know Your Candidate programmes where every click scales to FTE."},
        {"level": 1, "text": "GCC market readiness remains corporate Priority 1 as a reference for how Workday packages omnichannel and compliance stories; position as context, not the India deck headline."},
    ])],
    "speaker_notes": "• India bullet must speak first in live readout.\n\nReferences:\n• research/India/strategy-context-2026-03-31-IN-PMF-002.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Regional Expansion Strategy"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "India: high priority for scale growth; eight wins; DPDP and local boards as named pillars; aligns to new market entry driver."},
        {"level": 1, "text": "GCC: highest corporate Priority 1; ten new customers in OKR KR1; provides patterns for compliance narrative and omnichannel positioning India teams can reuse."},
        {"level": 1, "text": "Japan and other APAC rows remain context for multinational template fights where India hiring sits inside global RFPs."},
        {"level": 1, "text": "Explicit Q2 non-priorities (career site redesign, broad marketing automation) should not anchor India storytelling; anchor on volume, BGV, and boards."},
    ])],
    "speaker_notes": "• Table order matches strategy-context India row.\n\nReferences:\n• research/India/strategy-context-2026-03-31-IN-PMF-002.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Competitive Positioning - India"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Differentiate on suite depth (HCM, Recruiting, Talent, Learning), enterprise security, hire-to-pay coherence, UDMF, and native BGV business process framework with named partners."},
        {"level": 1, "text": "Be precise on India-specific channel and board gaps: native +91 SMS, WhatsApp core UI, OOTB Naukri-class multipost, and native UIDAI eKYC are competitive pressure points requiring honest partner and roadmap language."},
        {"level": 1, "text": "Compliance-first means configurable consent, retention, and purge with customer Legal design under DPDP; it is not a certified compliance box."},
    ])],
    "speaker_notes": "• Pair every strength with an honest gap where RFPs ask.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

# PESTEL (from product-strategy-agent file)
slides.append(section("05", "PESTEL"))
slides += [
    pestel_slide("Political", [
        "India’s consolidated labour codes, including the Industrial Relations Code, were widely reported as notified with implementation discussion into 2026 (Bar and Bench, Economic Times, labour.gov.in). Fixed-term employment parity rules raise the need for contract tracking, tenure visibility, and compliant offer and separation workflows inside the same stack as recruiting.",
        "Political emphasis on formal job creation, GCC expansion, and digital public infrastructure shapes buyer expectations for scale, auditability, and statutory adjacency from hiring through payroll and benefits narratives. Employers expect hiring platforms to support audit trails that survive ministry and works-council-style scrutiny as formalisation accelerates.",
        "The Data Protection Board of India and MeitY-led DPDP implementation make privacy enforcement politically salient because penalties and sector overlays (RBI, SEBI, IRDAI) can diverge by industry. Recruiting vendors therefore face uneven escalation paths when candidate data touches regulated sectors beyond generic HR policy.",
        "Labour ministry and press coverage on Aadhaar in benefits-adjacent contexts illustrates sensitivity whenever digital ID touches employment programmes, reinforcing consent-led design in hiring products. Political risk rises when platforms appear to bundle identity steps for convenience rather than proportionate statutory purpose.",
        "Ministry of Labour materials on the Industrial Relations Code anchor employer obligations in primary government sources; high-volume employers need defendable workforce decisions when codes fully operationalise. Contractual hiring surges in IT services and GCCs amplify exposure if recruiting data cannot explain tenure and renewal patterns.",
    ],
    "Workday Recruiting should align high-volume and contingent hiring with contract type, fixed-term, and parity reporting as codes roll out, while providing audit trails and handoffs to HCM and Payroll so Indian employers can defend workforce decisions under evolving Industrial Relations Code expectations. Politically sensitive ID steps must remain consent-led and role-specific rather than bundled into generic apply flows; this reduces exposure when ministries or boards scrutinise proportionality of digital ID in employment journeys.",
    "• Bar and Bench (2026): https://www.barandbench.com/view-point/how-indias-changing-labour-codes-are-impacting-businesses-in-2026\n• Economic Times (2026): https://economictimes.indiatimes.com/news/economy/policy/rules-finalised-rollout-of-all-4-labour-codes-likely-in-april/articleshow/129886864.cms\n• labour.gov.in Industrial Relations Code: https://labour.gov.in/industrial-relations-code",
    ),
    pestel_slide("Economic", [
        "Industry reporting sizes India HR technology in the hundreds of millions USD with mid-single-digit to high-single-digit CAGR through the early 2030s (MarketsandMarkets-style narratives). IMARC cites India ATS at USD 0.30B in 2024 toward USD 0.50B by 2033 at about 7.2% CAGR, with AI, cloud, mobile, and compliance automation as cited drivers.",
        "IT services campus hiring remains a volume driver: trade articles reference roughly 150,000 fresher hiring intentions for FY26 across large firms such as TCS, Infosys, Wipro, and Cognizant, with GCCs absorbing graduate demand. Those cycles push ATS vendors to prove throughput, dedupe, and campus funnel metrics in every renewal.",
        "Analyst and industry blogs cite 1,700+ GCCs, about two million professionals, and double-digit revenue growth narratives for 2025–2026, intensifying competition for digital skills and raising the bar for governance in hiring operations. Enterprise buyers then demand time-to-hire, audit, and cross-border people-data stories from the same recruiting stack.",
        "Press summaries of PLFS-style statistics point to educated unemployment improvement but persistent youth challenges; high-volume programmes must handle sheer applicant counts without sacrificing compliance or candidate rights. Economic pressure to hire fast must not collapse into ungoverned funnel behaviour that regulators later challenge.",
        "Naukri JobSpeak indices in 2025 showed strong white-collar growth with non-IT and fresher momentum in vendor commentary, supporting continued TA systems investment. That momentum funds replacement cycles where India-first suites compete aggressively on price and bundled payroll.",
    ],
    "Workday should prioritise throughput features such as bulk actions, grid performance, scheduling automation, and HiredScore where licensed, plus India enterprise proof points for GCC-scale hiring that stand up in CFO-led business cases. Pair growth narratives with realistic TCO conversations because local suites compete on price and bundled TA plus payroll; economic wins require measurable recruiter-hour savings at thousands of monthly hires.",
    "• IMARC India ATS: https://www.imarcgroup.com/india-applicant-tracking-system-market\n• Naukri JobSpeak: https://www.naukri.com/blog/\n• SightsInPlus fresher hiring FY26 article (trade press)",
    ),
    pestel_slide("Social", [
        "Nokia MBiT-style reporting via CXOToday (2026) cites India average mobile data usage crossing about 31 GB per month in 2025 with 5G share of traffic surging year-on-year. Those figures reinforce mobile-primary apply, messaging, and interview journeys that break when recruiters assume desktop-only workflows.",
        "Moneycontrol and other press coverage of Pune IT hiring rackets and parallel scam stories elevate employer demand for Know Your Candidate discipline, document provenance, and BGV orchestration with candidate-visible fairness. Social fear of fraud makes opaque identity steps politically toxic for brands hiring at scale.",
        "High-profile fake recruitment rings (e.g. DRDO-related press) and credential investigations in public-sector hiring stories increase risk committee attention on identity assurance before interview. Candidates and regulators expect employers to show they verified who attended interviews, not only who applied.",
        "English dominates white-collar TA tech, yet Hindi and regional language expectations surface in RFPs; diversity and inclusion narratives intersect with concerns about AI screening fairness. Social licence to automate shortlists shrinks when vendors cannot explain human oversight in plain language.",
        "Social trust dynamics mean spam, scam, and duplicate identities are endemic in high-volume funnels; candidates expect transparent steps and reliable OTP and task UX. Dropout spikes when SMS gateways fail or tasks lack context are now social-media-visible failures, not back-office noise.",
    ],
    "Candidate experience for India must emphasise transparent BGV and identity steps, mobile performance, and clear consent copy so candidates understand why data is collected and how long it is kept under DPDP-era expectations. UDMF and verification partner patterns should be front-and-centre in presales because social reality makes fraud and duplicates normal operating conditions; hiding verification behind opaque process erodes trust faster than product gaps alone.",
    "• CXOToday Nokia MBiT: https://cxotoday.com/media-coverage/indias-average-monthly-data-usage-per-user-crosses-31-gb-as-5g-traffic-surges-over-70-yoy-nokia-mbit-index-2026/\n• Moneycontrol Pune IT racket: https://www.moneycontrol.com/news/business/information-technology/they-paid-for-jobs-that-never-came-inside-pune-s-it-hiring-racket-13875458.html",
    ),
    pestel_slide("Technological", [
        "MeitY-published India AI Governance Guidelines (reported November 2025) and RBI FREE-AI framework (August 2025 for financial services) signal principle-based oversight moving toward institutional structures. Draft AI ethics and employee-rights bills are unsettled but already shape enterprise risk reviews for resume screening and ranking in banking-heavy hiring.",
        "Vendor and SI narratives stress cloud HR, analytics, and automation; AI features are marketed heavily in ATS and HRMS segments referenced in IMARC-style summaries. Buyers now expect demos of semantic matching even when legal teams demand logging and human review for final decisions.",
        "UIDAI materials and 2025 amendment commentary on Aadhaar Authentication and Offline Verification describe consent-driven, app-based verification evolution, including verifiable credential concepts in legal summaries relevant to Know Your Candidate design. Product teams must assume customers, not the platform, own UIDAI registration and purpose statements.",
        "Oracle India press (October 2025) on Wipro selecting Oracle Cloud Infrastructure for HR modernisation illustrates incumbent cloud narratives that raise the bar in enterprise shortlists. Technological competition is as much AI storytelling as feature parity in core ATS flows.",
        "Workday must present AI features with human oversight, explainability, and audit logs suitable for customers reviewing algorithmic hiring risk under emerging Indian governance signals. Technological credibility without legal-ready artefacts loses CIO and GC sign-off in regulated hires.",
    ],
    "Workday must present HiredScore and Workday AI in India with human oversight, explainability, audit logs, and DPDP-aligned notices that recruiters can show auditors and candidates. Integration architecture for Aadhaar and offline verification should assume partner or customer-owned UIDAI compliance, not implicit platform certification; this preserves velocity while avoiding over-claim on government rails that require customer legal ownership.",
    "• Regulations.ai India AI Governance Guidelines: https://regulations.ai/regulations/RAI-IN-NA-IAGGEXX-2025\n• UIDAI regulations 2025: https://uidai.gov.in/en/about-uidai/legal-framework/regulations/19549-aadhaar-authentication-and-offline-verification-amendment-regulations-2025.html\n• Oracle Wipro press: https://www.oracle.com/in/news/announcement/wipro-selects-oracle-cloud-infrastructure-to-accelerate-hr-modernization-2025-10-07/",
    ),
    pestel_slide("Environmental", [
        "SEBI’s BRSR framework drives listed Indian companies toward quantified social metrics such as training, gender mix, turnover, and stability; BRSR Core reasonable assurance timelines extend through FY 2026–27 for expanding cohorts per consultancy summaries. Recruiting and mobility data increasingly feeds those metrics even when environmental teams, not TA, own final disclosure.",
        "Recruiting software’s direct environmental footprint is small; the material angle for India enterprises is reporting and employer brand alignment when customers publish workforce sustainability metrics sourced from HR systems. Buyers may still ask for exports that connect hiring velocity to stability indicators used in ESG narratives.",
        "DATA GAP: India-specific per-hire carbon or standardised green recruiting metrics are not yet authoritative in government datasets retrieved for this pass; treat green-job reporting as customer-specific unless statutory forms emerge. Until standards land, avoid product claims that imply carbon accounting per candidate.",
        "ESG pulse and assurance guides (Green Permits, Ecodrisil, Glocert commentary) stress readiness work for top listed entities; hiring and mobility data feeds those disclosures indirectly. TA leaders should expect audit requests that trace diversity and turnover fields back to recruiting sources.",
    ],
    "Workday should ensure reporting and analytics exports support workforce composition, training hours, and turnover fields that feed BRSR workflows while staying neutral on environmental claims unless customers define methodologies. For IN-PMF-002 this is secondary to volume and KYC but relevant for listed India HQ accounts that fund HR analytics to satisfy assurance timelines through FY 2026–27.",
    "• Green Permits BRSR: https://www.greenpermits.in/03/brsr-reporting-2026-sebi-esg-disclosure-rules-for-companies/\n• ESG Pulse BRSR guide: https://esgpulse.ai/guides/brsr-reporting",
    ),
    pestel_slide("Legal", [
        "MeitY notified the Digital Personal Data Protection Rules, 2025 on 13 November 2025 with phased commencement: 13 November 2026 for consent manager registration (Rule 4) and 13 May 2027 for core obligations including notice, consent, security, retention, rights, and cross-border transfer rules per Hogan Lovells and JDSupra summaries. Recruiting products must therefore ship configurable notice and consent patterns before full operationalisation, not after customers face Board scrutiny.",
        "Cross-border transfers follow a permissive default with power for the Central Government to restrict jurisdictions or categories; Significant Data Fiduciary rules may trigger India DPO, audits, DPIAs, and algorithmic diligence. Multinational hiring templates must document which candidate data leaves India and on what SCC-style or local basis after May 2027.",
        "Breach expectations include Board notification without delay plus follow-up reporting timelines in commentary; penalties up to ₹250 crore appear in summaries for certain violations (verify against final gazette for contracts). High-volume candidate databases raise proportional security investment because breach headlines hit consumer trust in hiring brands.",
        "BGV vendor legal content emphasises explicit purpose-specific unbundled consent, minimisation, retention and deletion, and fiduciary liability for processor failures (SpringVerify, HireRight spotlights). Recruiting SKUs must surface sub-processor transparency and deletion evidence without dumping liability onto recruiters informally.",
        "Aadhaar 2025 amendments and UIDAI guidance stress structured consent-driven authentication and offline verification; employers must respect proportionality beyond convenience, with RBI KYC directions tightening identity discipline in BFSI hiring adjacency. Product flows should default to least-ID paths where PAN suffices, escalating to stronger verification only with Legal-approved purpose.",
    ],
    "Workday Recruiting must implement granular candidate notices and consent for each BGV data type, withdrawal handling, retention schedules and deletion evidence for BGV artefacts, sub-processor transparency, and breach playbooks that fit Data Protection Board timing and customer GC expectations. Cross-border SaaS requires customer legal ownership of transfer risk after May 2027 full operationalisation of transfer rules, with India DPO and SDF assessments handled at customer level unless Workday entity classification dictates otherwise; Aadhaar flows should be partner-mediated with customer-owned UIDAI registration and consent patterns that avoid over-collection violating minimisation.",
    "• JDSupra Hogan Lovells DPDP: https://www.jdsupra.com/legalnews/india-s-digital-personal-data-1886813/\n• Mondaq DPDP Rules 2025: https://dev.mondaq.com/india/data-protection/1708164/digital-personal-data-protection-rules-2025--notified\n• SpringVerify DPDP BGV: https://in.springverify.com/blog/dpdp-background-verification-changes-employers-2025/",
    ),
]

# Competitive landscape
slides.append(section("06", "Competitive landscape"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Regional Specialists - India"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            ["Darwinbox", "India cloud HRMS; Gartner MQ Challenger; AI volume narrative; Microsoft fabric; SpringVerify-style BGV; DPDP landing pages", "Scope vs global template depth; diligence items in trade press", "Strong single-vendor HRMS and omnichannel", "Pressure until channel runbooks are crisp"],
            ["Keka HR", "Fifteen-plus channel posting; AI JD and matching; DPDP claims; INR tiers; payroll adjacency", "Dedupe depth vs UDMF unproven in scan", "Speed and mid-market packaging", "Board stories need Broadbean proof"],
            ["Zoho Recruit", "Twilio SMS; marketplace WhatsApp; Zia AI mobile; multipost; SpringVerify doc automation narratives", "Enterprise HCM coherence vs full suite", "TCO and omnichannel defaults", "Honest native gap rows on channels"],
            ["greytHR", "Naukri, Hirist, IIM Jobs multipost; AI screening; SpringVerify via Unite; INR add-on", "Mid-market scope", "Statutory adjacency benchmark", "Use as board UX benchmark"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Matrix v1.7 IN-PMF-002.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Global Platforms - India"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            ["SAP", "SuccessFactors; SmartRecruiters embedded Mar 2026; Integration Center BGV", "Complexity and agility vary", "ERP-aligned India shortlists", "Benchmark AI and TA stories"],
            ["Oracle", "Fusion HCM; agentic India press Mar 2026; partner BGV packages", "Claims need entitlement checks", "Deep Oracle footprint", "Omnichannel demos intensify gaps"],
            ["iCIMS", "Global ATS; Prime Connector BGV; Spring 2026 frontline AI", "Integration tax vs suite", "MNC RFPs", "Contrast suite coherence"],
            ["Workday", "Hindi; DPDP-style consent or retention or purge; bulk grid; UDMF; BGV BP plus connectors", "True gaps: +91 SMS; WhatsApp UI; native Naukri multipost; semantic AI without SKUs", "Enterprise India and GCCs", "Partner map and honest claims"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• DA-IN-PMF-002-31Mar thread 9ef83319.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

# SWOT from swot file - plain text cells per 130
S = (
    "Enterprise suite hire-to-pay coherence for MNCs and GCCs; "
    "Configurable privacy retention purge with Legal programme design; "
    "UDMF plus BGV business process and named partners for Know Your Candidate; "
    "Bulk grid and baseline skills matching; HiredScore when licensed; "
    "Hindi language pack and enterprise security for India RFPs."
)
W = (
    "True gaps on native +91 SMS and native WhatsApp core UI per matrix; "
    "Native direct Naukri-class multipost gap; Broadbean or Studio workaround; "
    "UIDAI Aadhaar eKYC not native in-product; "
    "Advanced semantic AI needs Workday AI or HiredScore SKU; "
    "DA thread conflict on +91 SMS until PS reconciles battle cards."
)
O = (
    "DPDP phased programme to May 2027 creates budget for notices consent retention; "
    "Fraud and scam salience sells UDMF and BGV orchestration; "
    "Fresher and GCC hiring tailwinds support automation metrics; "
    "MeitY AI governance pushes documented human review; "
    "BRSR workforce metrics extend Recruiting value for listed HQ."
)
T = (
    "India-first bundles Darwinbox Keka greytHR Zoho compress TCO; "
    "SAP Oracle AI narratives raise RFP bars; "
    "DPDP penalties and cross-border uncertainty complicate SaaS; "
    "iCIMS depth in some MNC deals; "
    "Aadhaar or BGV mis-steps create reputational risk in BFSI and GCC."
)
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "SWOT - Workday India"}},
    "tables": [{
        "rows": [
            ["Strengths", "Weaknesses"],
            [S, W],
            ["Opportunities", "Threats"],
            [O, T],
        ],
        "top_inches": 1.0,
        "left_inches": 0.35,
        "width_inches": 9.3,
        "font_size_pt": 9,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• SWOT from Step 3 artefact only.\n\nReferences:\n• research/India/swot-analysis-India-2026-03-31-IN-PMF-002.md",
})

# Win/Loss - no data
slides.append(section("07", "Win / Loss"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss - Data Availability"}},
    "text_boxes": [{
        "left_inches": 2.0,
        "top_inches": 2.3,
        "width_inches": 6.0,
        "height_inches": 1.5,
        "font_name": "Archivo",
        "font_size_pt": 14,
        "color": "ink",
        "text": "No Win-Loss data is currently available for this market.\n\nAnalysis relies on customer interviews, internal expert perspectives, and competitive intelligence for gap identification and roadmap prioritisation.",
    }],
    "speaker_notes": "• Note absence of presales export for this mission.\n• Triangulation still strong on interviews and matrix.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
})

# Ideation DATA GAP
slides.append(section("08", "Ideation hub"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub - Data Gap"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "No structured internal ideation export was available for IN-PMF-002; themes draw from customer interviews, internal experts, competitive intelligence, and macro legal analysis instead of CSV idea volume."},
        {"level": 1, "text": "If ideation exports become available later, refresh this section with capability-area charts and verbatim themes."},
        {"level": 1, "text": "Ad hoc product requests may still exist in other channels; they were outside the structured export used for this readout."},
    ])],
    "speaker_notes": "• Log data limitation for stakeholders.\n• Avoid implying no internal ideas exist.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
})

# SME section
slides.append(section("09", "SME interviews"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Internal SME Interviews - Experts"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Five Workday SMEs: product VP, field readiness advisor, global services consultant, India enterprise architect on Genpact, and strategic customer engagement director for Accenture."},
        {"level": 1, "text": "Multi-customer visibility spans Lowe’s India volume, Genpact scale, Accenture application and duplicate statistics, and major partner programmes referenced in services notes."},
        {"level": 1, "text": "Timing: January through July 2025 plus November product leadership notes; purpose is triangulation with customer research on high volume and Know Your Candidate."},
        {"level": 1, "text": "Limitation: internal lens supplements but does not replace customer voices; single employer in Step 8 requires weighting."},
    ], font_pt=14)],
    "speaker_notes": "• Introduce SME credibility before named slides.\n\nReferences:\n• research/India/105-sme-research-findings.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "SME Participants Roster"}},
    "tables": [{
        "rows": [
            ["SME ID", "Name", "Role", "Context"],
            ["SME1", "Bernie", "VP, Talent Product Management", "Product leadership; India FY27; KYC framing"],
            ["SME2", "Fabiola Navarro", "Sr. Product Advisor, Field Readiness", "Lowe’s India high volume; offers and BGC"],
            ["SME3", "Santosh Gulia", "Sr. Functional Consultant, GS", "India BGC variability; documents; WhatsApp"],
            ["SME4", "David Lodola", "Enterprise Architect, India Services", "Genpact; mass ops; impersonation"],
            ["SME5", "David Phillips", "Director, SCE (Accenture)", "Accenture scale; DNH; duplicates"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 9,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Internal names attributable per 130.\n\nReferences:\n• research/India/internal-sme-transcripts/",
})

def sme_slide(title, themes):
    paras = []
    for th, bullets in themes:
        paras.append({"level": 0, "text": [{"text": th, "bold": True, "font_size_pt": 12}]})
        for b in bullets:
            paras.append({"level": 1, "text": b})
    return {
        "master_index": 1,
        "layout_name": "Title Only_Alt" if len(paras) % 2 else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paras, font_pt=12, h=3.0)],
        "speaker_notes": (
            "• Frame SME as multi-customer pattern lens.\n"
            "• Contrast with Teleperformance depth in Step 8.\n"
            "• Call out Extend versus product gaps.\n"
            "• Keep Aadhaar language partner-mediated.\n"
            "• Invite challenge on Accenture-scale stats.\n\n"
            "References:\n• research/India/105-sme-research-findings.md"
        ),
    }

slides.append(sme_slide("SME1 - Bernie, VP Product", [
    ("KYC and fraud at scale", [
        "Know Your Candidate framed like banking KYC; resume and candidate information fraud at extreme monthly scale cited including Accenture-affected segments.",
        "India product gaps and address localisation called out alongside regulatory discussion.",
    ]),
    ("Partners and follow-up", [
        "Interview intelligence partners discussed as complementary to fraud-trust narrative; internal follow-ups to solution enablement referenced in notes.",
    ]),
    ("Customer triangulation", [
        "P4 and P5 later confirmed dedupe and ID pain at Teleperformance scale, aligning with Bernie’s pre-customer hypothesis.",
    ]),
]))
slides.append(sme_slide("SME2 - Fabiola, Field Readiness", [
    ("India offer complexity", [
        "Compensation disclosure for India repeatedly uses tables, calculated fields, and often two documents to the candidate across projects where India is in scope.",
    ]),
    ("Volume versus controls", [
        "Automation and auto-complete hire patterns clash with start-date changes; Extend patterns appeared for corrections; BGC may continue after hire versus stricter US conditional models.",
    ]),
    ("BGC operator UX", [
        "Customers want easy reinitiate and backward or forward movement when async vendor results return; ASR limitations drove integration-heavy workarounds.",
    ]),
    ("Customer triangulation", [
        "P5 regenerate offer and legal letter workarounds echo Fabiola’s post-hire change reality.",
    ]),
]))
slides.append(sme_slide("SME3 - Santosh, Global Services", [
    ("BGC variability", [
        "India background checks described as extensive and highly variable by customer, resisting one-size business process standardisation.",
    ]),
    ("Document and stage design", [
        "Candidate attachment box and multi-stage non-standard documents; ID before interview for verifier alignment; review-document sprawl across offer and BGC hurts CX.",
    ]),
    ("Fraud exposure", [
        "Major partner scale example with fake interview candidates and legal exposure; drives pre-interview identity proof asks.",
    ]),
    ("Customer triangulation", [
        "P3 OTP and task UX friction aligns with Santosh’s emphasis on stage-appropriate capture and fewer broken chains.",
    ]),
]))
slides.append(sme_slide("SME4 - Lodola, India Architect", [
    ("Industrial mass hiring", [
        "Genpact-scale programmes need mass offers, cohort start dates, and fewer per-record clicks; worksheets gap noted for these flows.",
    ]),
    ("Impersonation and audit", [
        "Applicant may not match interview attendee; career site edits to name, address, and phone with weak tracking flagged as fraud enabler.",
    ]),
    ("BGC richness", [
        "Native BGC seen as basic for some clients; middleware and richer datasets desired with collect-once-to-vendor intent.",
    ]),
    ("Customer triangulation", [
        "P5 interviewee identity validation aligns with Lodola impersonation theme.",
    ]),
]))
slides.append(sme_slide("SME5 - Phillips, Accenture SCE", [
    ("Volume and duplicates", [
        "Roughly two hundred thousand duplicate applications cited; auto-merge limited to two records; need merge beyond two for extreme churn.",
    ]),
    ("DNH and compliance split", [
        "Do Not Hire auto-disposition desired; large share of applications processed outside Workday attributed to internal compliance in notes.",
    ]),
    ("Fraud and AI", [
        "Application fraud and trickery at scale; AI pattern detection raised to return time to hiring managers.",
    ]),
    ("Customer triangulation", [
        "P5 first-source versus last-approved upload wins directly echoes Phillips agency-economics narrative.",
    ]),
]))

# Primary research
slides.append(section("10", "Primary research"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "1:1 Customer Interviews - India"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Five senior recruiting leaders from one India enterprise high-volume BPO context (Teleperformance India) across specialist and frontline sessions in December 2025."},
        {"level": 1, "text": "Organisations hiring thousands per month at peak with hundreds of offers per day; agency-heavy and career-site volume programmes."},
        {"level": 1, "text": "Semi-structured interviews on hiring workflows, India identifier capture, duplicate integrity, and offer reliability."},
        {"level": 1, "text": "Triangulated with five internal experts and India competitive matrix; no presales win-loss dataset was available for this market."},
    ])],
    "speaker_notes": "• Single employer limitation.\n\nReferences:\n• research/India/105-user-research-findings.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Interview Participants"}},
    "tables": [{
        "rows": [
            ["Participant", "Role", "Organisation"],
            ["P1", "Recruitment Manager, specialist team", "Teleperformance India"],
            ["P2", "Recruitment Manager, reqs and onboarding", "Teleperformance India"],
            ["P3", "Recruitment Manager, leadership pipeline", "Teleperformance India"],
            ["P4", "Recruitment Lead, high volume agents", "Teleperformance India"],
            ["P5", "Frontline Hiring Manager, multi-site", "Teleperformance India"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 10,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• P1–P5 anonymisation preserved.\n\nReferences:\n• research/India/105-user-research-findings.md",
})

def p_slide(pid, role_co, quotes, jtbds, extra_themes):
    paras = []
    for th in extra_themes:
        paras.append({"level": 0, "text": [{"text": th, "bold": True, "font_size_pt": 12}]})
    for q in quotes:
        paras.append({"level": 1, "text": q})
    for j in jtbds:
        paras.append({"level": 1, "text": j})
    return {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": f"{pid} - {role_co}"}},
        "text_boxes": [tb_body(paras, font_pt=12, h=3.0)],
        "speaker_notes": (
            "• Open with role context and hiring volume.\n"
            "• Stress quoted pain in customer words.\n"
            "• Link JTBD to roadmap themes T1–T6.\n"
            "• Note single-employer sample limitation.\n"
            "• Prepare follow-up on quantified claims.\n\n"
            "References:\n• research/India/105-user-research-findings.md\n"
            "• research/India/customer-transcripts/"
        ),
    }

slides.append(p_slide(
    "P1",
    "Mgr, Teleperformance India",
    [
        '"Supervisory organisation selection stayed unclear from the business at scale, so teams used random tags and operations pushed back on data quality." (P1, Teleperformance India)',
        '"Routing noise at volume creates downstream reporting and approval friction unrelated to candidate quality." (P1, Teleperformance India)',
        '"Specialist recruiters need cleaner hierarchy guidance before reqs propagate to high-volume pipelines." (P1, Teleperformance India)',
        '"Cost centre and LOB errors when hiring managers are unclear force req edits and painful restart paths for candidates." (P1, Teleperformance India)',
    ],
    [
        "When I run a lean specialist team, I want requisition metadata to be trustworthy on first pass, so I can avoid rework loops with operations.",
        "When hiring managers are unclear on cost centre or LOB, I want in-system guardrails, so I can stop candidates re-applying from scratch.",
        "When leadership questions routing, I want consistent supervisory org data, so reporting matches operational reality.",
    ],
    ["Supervisory org and data quality", "Req hygiene at specialist scale"],
))

slides.append(p_slide(
    "P2",
    "Mgr, Teleperformance India",
    [
        '"Email-first approvals for headcount and compensation still force re-keying into Workday, weakening audit threads leadership expects." (P2, Teleperformance India)',
        '"Parallel ATS dashboards remain the comfort layer when in-system reporting feels insufficient for leadership hiring." (P2, Teleperformance India)',
        '"We need approval artefacts to live where recruiters work, not only in inboxes." (P2, Teleperformance India)',
        '"Thrive still carries leadership metrics where Workday views feel thin for confidential hiring oversight." (P2, Teleperformance India)',
    ],
    [
        "When compensation approvals start outside the system, I want native threads that map to reqs, so I can defend decisions in audits.",
        "When leadership asks for hiring health, I want Workday metrics to match what they trust elsewhere, so I can retire duplicate tooling.",
        "When specialist pipelines need discretion, I want in-product dashboards that satisfy executives without shadow tools.",
    ],
    ["Approvals and reporting parity", "Leadership visibility"],
))

slides.append(p_slide(
    "P3",
    "Mgr, Teleperformance India",
    [
        '"Policy expects three government identifiers before offer, yet the UI allows partial completion and fields can disappear after policy acceptance." (P3, Teleperformance India)',
        '"OTP failures for Aadhaar-linked steps drive tickets and candidate anxiety in the offer window." (P3, Teleperformance India)',
        '"Senior candidates will not tolerate phone explanations of bell icons and generic task emails at scale." (P3, Teleperformance India)',
        '"Participant estimated roughly sixteen to seventeen percent loss in offer-to-join window partly tied to process friction." (P3, Teleperformance India)',
    ],
    [
        "When leadership roles need India ID compliance, I want hard gating that still allows recovery edits, so I can avoid re-offer churn.",
        "When offers release, I want contextual automated nudges, so I stop phone-chasing executives about tasks.",
        "When OTP channels fail, I want diagnostics and recruiter-visible status, so candidates do not stall silently before join.",
    ],
    ["India IDs and offer friction", "OTP and notification UX"],
))

slides.append(p_slide(
    "P4",
    "Lead, Teleperformance India",
    [
        '"Roughly eight hundred to one thousand hires monthly in one regional footprint and eight thousand to nine thousand monthly India-wide agent hiring at peak cited." (P4, Teleperformance India)',
        '"Creating many requisitions consumed about one to one point five hours daily for recurring setup work." (P4, Teleperformance India)',
        '"Go-live during peak delayed NTID and Workday credentials, costing business days and deferring training." (P4, Teleperformance India)',
        '"Planned Saturday maintenance clashes with India six-day working week; downtime hurts productivity at scale." (P4, Teleperformance India)',
    ],
    [
        "When peak season overlaps deployments, I want credential and onboarding flows that survive load, so sites do not lose productive days.",
        "When req volume spikes, I want templates and bulk safety, so setup time does not crowd out sourcing.",
        "When maintenance windows hit working Saturdays, I want schedules that respect India ops cadence, so recruiters do not lose peak capacity.",
    ],
    ["High volume operating rhythm", "Deployment and peak clash"],
))

slides.append(p_slide(
    "P5",
    "Hiring Mgr, Teleperformance India",
    [
        '"Duplication automation is the number one ask; match on Aadhaar, not only email and phone, because candidates vary those identifiers." (P5, Teleperformance India)',
        '"Hundreds of agencies times ten to twenty uploads daily implies thousands of profiles and full-time duplicate approval roles per site." (P5, Teleperformance India)',
        '"Last approved upload can win source attribution, conflicting with first-source contracts and creating financial disputes." (P5, Teleperformance India)',
        '"Regenerate offer cannot cover compensation or join date changes; legal-reviewed letters outside Workday become the workaround." (P5, Teleperformance India)',
    ],
    [
        "When agencies flood the funnel, I want government-ID-aware matching and source rules, so fees and audits stay defensible.",
        "When cohort join dates shift, I want in-product offer amendment patterns, so I avoid manual legal letter cycles.",
        "When vendor uploads spike, I want bulk-safe approval paths, so one recruiter per site is not clicking all day.",
    ],
    ["Duplicates and agency economics", "Offer regeneration limits"],
))

# Thematic analysis
slides.append(section("11", "Thematic analysis"))
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Validated Themes 1-3 (Trust)"}},
    "text_boxes": [tb_body([
        {"level": 0, "text": [{"text": "Identity impersonation and interview trust", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "SMEs and P3/P5 converge on interviewee identity assurance, pre-interview proof, and stable profile data through BGV; impersonation and credential fraud elevate legal and brand risk."},
        {"level": 1, "text": "Business impact: offer-to-join leakage and executive escalation when trust breaks; competitive suites market omnichannel assurance."},
        {"level": 1, "text": "Product implications: UDMF plus BGV plus audit surfaces on profile change; partner-mediated Aadhaar with Legal minimisation."},
        {"level": 0, "text": [{"text": "Duplicates and source integrity", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "P4/P5 quantify manual dedupe and vendor upload bottlenecks; last-approved source conflicts with first-source economics."},
        {"level": 1, "text": "Business impact: agency payment disputes, backlog of correction cases, and audit exposure at thousands of uploads daily."},
        {"level": 1, "text": "Product implications: configurable first-touch and cooling-off rules, bulk vendor flows, government-ID matching only after Legal review."},
        {"level": 0, "text": [{"text": "Document capture and candidate tasks", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "Santosh and Fabiola describe review-document sprawl; P3 cites fields disappearing after policy steps and OTP friction."},
        {"level": 1, "text": "Business impact: dropout and rework in offer windows; candidate distrust."},
        {"level": 1, "text": "Product implications: structured document hub, gating that matches policy, fewer sequential review nodes."},
    ], font_pt=12, h=3.2)],
    "speaker_notes": "• Grouped themes per v65 pacing.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
})
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Validated Themes 4-6 (Scale)"}},
    "text_boxes": [tb_body([
        {"level": 0, "text": [{"text": "India offer and BGC orchestration", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "Fabiola’s India-forward hire patterns and reinitiate asks align with P5 limits on offer regeneration and legal letters outside the system."},
        {"level": 1, "text": "Business impact: slower join dates and services-heavy Extend for every programme."},
        {"level": 1, "text": "Product implications: operator actions for reinitiate, parallel checks, readable async status, cohort date tools."},
        {"level": 0, "text": [{"text": "Industrial mass operations", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "Lodola and Phillips cite mass offers, merge limits, DNH, and purge; P4/P5 cite peak hiring and maintenance windows versus six-day weeks."},
        {"level": 1, "text": "Business impact: recruiter capacity consumed by clicks; peak outages amplify cost."},
        {"level": 1, "text": "Product implications: bulk safe operations, DNH auto-disposition, multi-merge policy exploration."},
        {"level": 0, "text": [{"text": "Omnichannel gaps", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "Santosh notes WhatsApp norms; matrix lists true gaps on native +91 SMS and WhatsApp core UI; P3 wants contextual offer alerts."},
        {"level": 1, "text": "Business impact: RFP losses where local suites demo integrated channels."},
        {"level": 1, "text": "Product implications: CPaaS interim, roadmap clarity, Paradox where licensed; regional comms consent models."},
    ], font_pt=12, h=3.2)],
    "speaker_notes": "• Tie to competitive true gaps.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
    "tables": [{
        "rows": [
            ["Theme", "P1-P5", "SMEs", "CI Matrix", "PMF impact"],
            ["T1 Identity trust", "Strong P3 P5", "Strong Lodola Santosh Phillips", "KYC partner narratives", "High"],
            ["T2 Dedupe source", "Strong P4 P5", "Strong Phillips Bernie", "UDMF native", "High"],
            ["T3 Offer BGC India", "Med P5", "Strong Fabiola", "Extend patterns", "High"],
            ["T4 Documents tasks", "Strong P3", "Strong Fabiola Santosh", "DPDP minimisation", "High"],
            ["T5 Mass ops", "Med P4 P5", "Strong Lodola Phillips", "Bulk grid native", "Med-high"],
            ["T6 Channels", "Med P3", "Strong Santosh", "True gap SMS WA", "Med-high"],
        ],
        "left_inches": 0.25,
        "top_inches": 1.0,
        "width_inches": 9.5,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• SME plus customer only for deep quotes; CI for classification.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
})

# Gap analysis table
slides.append(section("12", "Gap diagnostic"))
gap_rows = [
    ["Attract", "Career site posts and apply floods without knockout questions; hundreds of applications per req opened individually. 🟡 MEDIUM", "🟡 MEDIUM", "Screening questions and bulk disposition patterns; partial via process design", "P4 P5 volume quotes", "Prioritise high-volume apply guardrails"],
    ["Convert", "Weak duplicate signalling and manual vendor upload approval at agency scale. 🔴 HIGH", "🔴 HIGH", "UDMF rules and automation design; Legal review for ID fields", "P5 Aadhaar dedupe ask", "Government-ID-aware dedupe programme"],
    ["Screen", "Resume parser accuracy limits manual review time. 🟡 MEDIUM", "🟡 MEDIUM", "Mandatory resume and process discipline", "P3 parser estimate", "Improve parsing and mandatory upload policy options"],
    ["Schedule", "Pre-interview identity proof requests driven by fraud. 🟡 MEDIUM", "🟡 MEDIUM", "Stage configuration and partner verification", "Santosh P5 alignment", "Configurable pre-interview ID capture"],
    ["Offer", "Soft gating on India IDs versus strict policy; regenerate limits. 🔴 HIGH", "🔴 HIGH", "Offer BP configuration; product gaps on rescind patterns", "P3 P5 quotes", "KYC gating notification UX cohort offers"],
    ["Comply", "DPDP-ready BGV consent retention evidence for vendors. 🔴 HIGH", "🔴 HIGH", "Configurable privacy; customer Legal programme", "PESTEL Legal", "BGV consent retention templates"],
    ["Measure", "Leadership dashboards still partly outside Workday. 🟡 MEDIUM", "🟡 MEDIUM", "Reporting investments", "P2 Thrive parallel", "Recruiting analytics parity for India ops"],
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Gap Analysis"}},
    "tables": [{
        "rows": [["Stage", "Gap", "Severity", "Workaround", "Evidence", "Product action"]] + gap_rows,
        "left_inches": 0.2,
        "top_inches": 1.0,
        "width_inches": 9.6,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": (
        "• Gap severities aligned to thematic report and competitive matrix.\n"
        "• Native BGV UDMF and privacy levers treated as strong partial mitigations where noted.\n"
        "• True gaps on channels and Naukri multipost kept HIGH for RFP risk.\n"
        "• For binding severity claims, validate with Deployment Agent in customer context.\n"
        "• Thread reference for India classifications: 9ef83319-6d4d-476e-a14e-118eff9e92f5.\n\n"
        "References:\n"
        "• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md\n"
        "• research/competitive/matrices/in-competitive-matrix.md"
    ),
})

# Roadmap recommendations (5) + summary table
slides.append(section("13", "Recommendations"))
recs = [
    (
        "Dedupe and source",
        "Agency-heavy India programmes lose fee integrity when duplicates pass and last-approved upload wins; thousands of daily vendor uploads make manual checks full-time roles.",
        '"Duplication is the number one automation ask; match on Aadhaar, not only email and phone." (P5, Teleperformance India)',
        "Extend UDMF matching with configurable first-touch and cooling-off rules, bulk vendor flows, and audit of source changes; pilot PAN UAN masked Aadhaar only after Legal minimisation review.",
        "Eight-win India row and matrix emphasis on UDMF as native strength.",
        "Agency dispute cases reduced; dedupe automation coverage up on India tenants in pilot.",
    ),
    (
        "Recommendation 2: DPDP BGV programme",
        "BGV chains need unbundled consent, retention schedules, deletion evidence, and sub-processor transparency under phased DPDP rules to May 2027.",
        "PESTEL Legal and BGV vendor legal summaries require purpose-limited processing and audit evidence.",
        "Productise granular BGV notices and consent by check type, retention and deletion evidence exports, and sub-processor transparency hooks aligned to configurable purge.",
        "Board-era enforcement increases customer budget for platform proof.",
        "BGV consent completion rates up; audit findings down in enterprise reviews.",
    ),
    (
        "Recommendation 3: KYC gating UX",
        "Policy expects three India IDs before offer yet UI allows partial completion; OTP failures drive dropout.",
        '"Roughly sixteen to seventeen percent loss cited in offer-to-join window partly tied to friction." (P3, Teleperformance India)',
        "Align mandatory government ID steps with UI gating, post-step editability, and contextual recruiter and candidate notifications; OTP diagnostics with support.",
        "DPDP notices and Aadhaar proportionality require disciplined UX.",
        "Offer-to-join conversion improves; support tickets for OTP fall.",
    ),
    (
        "Recommendation 4: BGC reinitiate",
        "India implementations need forward motion with parallel or late BGC; customers lack first-class reinitiate and readable async status.",
        "Fabiola field patterns and P5 legal letter workarounds show services tax.",
        "Ship operator actions for BGC re-run, parallel checks, and clearer async outcomes without Extend for every programme.",
        "Differentiator versus US-centric rigidity when configured safely.",
        "Extend hours per India project down; time-to-hire variance reduced.",
    ),
    (
        "Recommendation 5: Governed AI activation",
        "High-volume shortlisting expectations meet EU AI Act and DPDP fairness narratives for multinationals.",
        "Q2 Priority 2 on AI matching and India volume hiring alignment.",
        "HiredScore and Workday AI activation playbook with logging, human review, and customer disclosure templates.",
        "Competitive demos show opaque AI; governance sells enterprise.",
        "Shortlist throughput up; governance checklist completion on beta tenants.",
    ),
]
rec_titles = [
    "Recommendation 1: Dedupe and source",
    "Recommendation 2: DPDP BGV programme",
    "Recommendation 3: KYC gating and OTP",
    "Recommendation 4: BGC reinitiate UX",
    "Recommendation 5: Governed AI activation",
]
for idx_r, (title, prob, ev, rec, why, metrics) in enumerate(recs):
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only" if idx_r % 2 else "Title Only_Alt",
        "placeholders": {"0": {"text": rec_titles[idx_r]}},
        "text_boxes": [tb_body([
            {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": prob},
            {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": ev},
            {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": rec},
            {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": why},
            {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": metrics},
        ], font_pt=12, h=3.2)],
        "speaker_notes": "• Five-part structure for VP audience.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
    })

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
    "tables": [{
        "rows": [
            ["#", "Title", "Action", "Reach", "Impact", "Confidence", "Effort", "RICE", "Legal"],
            ["1", "Dedupe + source", "UDMF + rules + bulk", "6,000", "3.0", "72%", "10 pm", "1,296", "DPDP Aadhaar"],
            ["2", "BGV consent programme", "Granular consent + retention", "8,000", "2.75", "70%", "6 pm", "2,567", "DPDP DPIA"],
            ["3", "KYC gating UX", "Gating + notifications", "5,000", "3.0", "78%", "5 pm", "2,340", "DPDP notices"],
            ["4", "BGC reinitiate", "Operator async UX", "6,000", "2.375", "76%", "4 pm", "2,708", "Vendor DPA"],
            ["5", "AI activation", "Playbook + logging", "4,000", "2.75", "65%", "4 pm", "1,788", "AI Act"],
        ],
        "left_inches": 0.2,
        "top_inches": 1.0,
        "width_inches": 9.6,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Table from E2E handoff in thematic report.\n\nReferences:\n• research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-PMF-002.md",
})

slides.append({"master_index": 1, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False), encoding="utf-8")
print("Wrote", OUT, "slides:", len(slides))
