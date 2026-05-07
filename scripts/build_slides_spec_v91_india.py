#!/usr/bin/env python3
"""One-off builder: India INDIA-E2E-005 PMF roadmap slides_spec_v91.json"""
import json

from slide_specs_dir import SLIDE_SPECS_DIR

MI = 1
OUT = SLIDE_SPECS_DIR / "slides_spec_v91.json"

TB = lambda lo, fs=14: {
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_name": "Archivo",
    "font_size_pt": fs,
    "color": "ink",
}

def sec(num: str, name: str):
    return {
        "master_index": MI,
        "layout_name": "Section Title",
        "text_boxes": [{
            "left_inches": 3.3,
            "top_inches": 1.5,
            "width_inches": 5.6,
            "height_inches": 2.2,
            "font_name": "Archivo",
            "font_size_pt": 12,
            "color": "ink",
            "text": f"S E C T I O N  {num}\n{name}",
        }],
    }

def ph_title(t: str):
    return {"0": {"text": t}}

def pestel_slide(title: str, bullets: list[str], impl: str):
    paras = []
    for b in bullets:
        paras.append({"level": 1, "text": b})
    paras.append({
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": impl, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    })
    return {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": ph_title(title),
        "text_boxes": [{**TB(1.2, 12), "paragraphs": paras}],
        "speaker_notes": "• Anchor on India statutory and enterprise scale.\n\nReferences:\n• research/India/pestel-analysis-India-2026-04-06-INDIA-E2E-005.md",
    }

slides = []

slides.append({
    "master_index": MI,
    "layout_name": "TITLE",
    "placeholders": {
        "0": {"text": "India Recruiting Product-Market Fit Research"},
        "1": {"text": "April 2026"},
    },
})

slides.append(sec("0 1", "Executive summary"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Executive Summary"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Five validated themes show strong convergence on identity assurance, industrial-scale duplicate and source governance, and offer lifecycle friction for India BPO-scale hiring (Teleperformance evidence)."},
        {"level": 1, "text": "Global ideation volume (N=10016 TA-filtered ideas, March 2026 export) amplifies Communications, Candidates and Prospects, Offers, and Apply Flow pain; no India-named verbatims in that slice."},
        {"level": 1, "text": "Presales gap export yields three India-keyword-qualified TA rows (North America segment, text-evidenced India hiring); scheduling, Candidate Home split, and knock-out agility at volume surface as buyer narratives."},
    ]}],
    "speaker_notes": "• Lead with trust and scale before channel gaps.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Executive Summary (cont.)"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 0, "text": [{"text": "Strategic direction", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Q2 priorities foreground GCC readiness and AI matching; India regional row still lists scale growth, DPDP compliance, local job boards, and eight customer wins—India statutory and volume themes deserve explicit roadmap airtime."},
        {"level": 1, "text": "March 2026 TA strategy deck lists WhatsApp messaging, enhanced candidate communication consent, and fraudulent application detection as near-term items—aligned to India channel and trust gaps in competitive matrix."},
        {"level": 1, "text": "RICE-ranked bets cluster on consent, WhatsApp, offer controls, hardened government-ID journey, and fraud-phase activation; quantify pilots on offer dwell, funnel completion, and recruiter hours reclaimed."},
    ]}],
    "speaker_notes": "• Cite Q2 OKRs only where they strengthen India narrative.\n\nReferences:\n• strategy/markdown/product-priorities-q2-2026.md",
})

slides.append(sec("0 2", "Research challenge"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Research Question and Objectives"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Assess Workday Recruiting product-market fit for India enterprise and BPO-scale hiring where government identifiers, agency economics, and omnichannel expectations shape bake-offs."},
        {"level": 1, "text": "Ground findings in internal SME notes, five Teleperformance India customer voices (P1–P5), global ideation statistics, and presales gap narratives filtered for India keyword evidence."},
        {"level": 1, "text": "Frame recommendations with quantified success metrics, legal-sensitive design flags for identity flows, and honest competitive gap language from India matrix classifications."},
        {"level": 1, "text": "Highlight tension where quarterly business scoring privileges GCC and AI matching while India customer severity is extreme on identity, duplicates, and offer rework."},
    ]}],
    "speaker_notes": "• Keep method detail in notes; slides stay executive.\n\nReferences:\n• research/India/105-user-research-findings.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Research Scope and Limitations"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Customer set is deep on one India BPO-scale employer; findings are directional for wider India enterprise sampling and require corroboration in other industries."},
        {"level": 1, "text": "Ideation export is global Talent Acquisition filtered—not India-stratified—so numeric sentiment is directional support, not replacement for India statutory evidence."},
        {"level": 1, "text": "Presales slice holds three India-relevant rows without Opp Region=India column; treat as narrative signal paired with interviews and competitive matrix, not frequency proof."},
        {"level": 1, "text": "Competitive and deployment classifications are point-in-time; validate with Professional Services before customer-facing commitments on native versus partner paths."},
    ]}],
    "speaker_notes": "• Name limitations clearly to protect credibility.\n\nReferences:\n• research/India/gap-analysis/2026-04-06-gap-analysis-INDIA-E2E-005.md",
})

slides.append(sec("0 3", "Strategic context"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Strategic Context: Why India Now"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "India HR technology narratives cite roughly USD 1.2B+ in 2025 toward early-2030s high-single-digit CAGR; recruitment software is smaller but SaaS-heavy, so buyers expect suite-plus-compliance stories."},
        {"level": 1, "text": "Campus and IT services hiring headlines plus large RPO market commentary anchor volume-led purchasing; fresher-scale intent figures in FY26 press show sustained bulk hiring demand."},
        {"level": 1, "text": "DPDP Act 2023 and Rules 2025 commentary moves India toward consent, notice, retention, and penalties; WhatsApp-first behaviour and fraud press raise channel and trust expectations without over-collecting IDs."},
    ]}],
    "speaker_notes": "• Tie macro to buying committee questions on risk and speed.\n\nReferences:\n• research/India/pestel-analysis-India-2026-04-06-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("India Market Momentum: Key Indicators"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Quarterly priorities list India Q2 focus as scale growth with DPDP compliance and local job boards and an eight-customer wins target alongside GCC market entry priority."},
        {"level": 1, "text": "OKRs for the quarter include ten GCC customer wins, five AI matching beta tenants, and Recruiting NPS 60 from 52—use India row to argue for parallel India scale proof points in readouts."},
        {"level": 1, "text": "Differentiation themes in quarterly doc emphasise suite depth, AI with Paradox and HiredScore, compliance-first posture, and enterprise security model versus point tools."},
        {"level": 1, "text": "Vulnerabilities called out include Broadbean niche gaps, SAP mobile recruiter comparisons, and Paradox activation for scheduling—relevant when India buyers benchmark speed and channels."},
    ]}],
    "speaker_notes": "• India-specific PDF lines were absent; cite quarterly table explicitly.\n\nReferences:\n• research/India/strategy-context-2026-04-06-INDIA-E2E-005.md",
})

slides.append(sec("0 4", "Product strategy"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Q2 Priorities: India on the Roadmap"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Priority 1 is GCC market readiness (WhatsApp and SMS, nationalisation, Arabic, boards via Broadbean) with ten GCC wins and zero product blockers as stated success metrics."},
        {"level": 1, "text": "Priority 2 is AI candidate matching differentiation—activate HiredScore for high-volume accounts with five beta tenants and a 20% time-to-fill reduction target for beta cohorts."},
        {"level": 1, "text": "Priority 3 is core ATS parity—bulk actions, mobile recruiter improvements, background check integrations, Paradox scheduling depth—so basic objections do not stall enterprise cycles."},
        {"level": 1, "text": "India sits in the regional table as scale growth with DPDP compliance and local job boards—pair India identity and channel gaps with these pillars when requesting resourcing."},
    ]}],
    "speaker_notes": "• Position India as scale row, not an afterthought to GCC airtime.\n\nReferences:\n• strategy/markdown/product-priorities-q2-2026.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Regional Expansion: India Focus"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Regional expansion table lists India with scale growth emphasis, DPDP compliance, local job board coverage, and eight customer wins as the stated Q2 target."},
        {"level": 1, "text": "GCC row remains market entry with ten-win target—narrative risk is under-weighting India BPO-scale evidence if portfolio forums only track GCC metrics."},
        {"level": 1, "text": "Japan, Australia, and other regions carry deepen or maintain postures—India competes for roadmap attention against multiple internationalisation bets."},
        {"level": 1, "text": "March 2026 TA strategy PDF extract lists WhatsApp messaging, enhanced consent, and fraudulent application detection under near-term items—map directly to India channel and trust frictions."},
    ]}],
    "speaker_notes": "• Use regional table verbatim targets for credibility.\n\nReferences:\n• research/India/strategy-context-2026-04-06-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Competitive Positioning Anchors"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Workday differentiation in quarterly doc stresses suite depth across HCM and Recruiting, AI-powered Paradox and HiredScore, compliance-first GDPR and EU AI Act posture, and Fortune 500-scale workflows."},
        {"level": 1, "text": "PDF callouts include recruiter capacity and screening time claims for automation features—use only as printed metrics with caveats when speaking to India volume buyers."},
        {"level": 1, "text": "Vulnerabilities include job board partner gaps, SAP mobile recruiter strength, and Paradox activation requirements—anticipate these in India RFP demos."},
        {"level": 1, "text": "India competitive matrix classifies native plus-nine-one SMS, core WhatsApp, UIDAI Aadhaar eKYC, and out-of-box Naukri-class direct multipost as true gaps—message partner paths honestly."},
    ]}],
    "speaker_notes": "• Pair internal positioning with external matrix honesty.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

slides.append(sec("0 5", "PESTEL"))

slides.append(pestel_slide(
    "Political",
    [
        "Labour code consolidation from 21 November 2025 is widely reported - employers face immediate compliance expectations while states vary rollout pace, so hiring systems must show contractor letters and principal-employer alignment in audits.",
        "Contract labour and principal-employer duties expand traceability for letters, entitlements, and contractor alignment, dragging recruiting purchases into workforce compliance programmes rather than isolated ATS decisions alone.",
        "Gig and platform worker scaffolding under Social Security Code narratives plus Karnataka 2025 welfare rules signals state divergence when customers source contingent talent alongside permanent hires in the same recruiting stack.",
        "Aadhaar authentication amendments in 2025 shape eKYC options while August 2025 commentary stresses voluntariness for some benefits - product teams should pair operational KYC habits with minimisation narratives in apply flows.",
        "Formalisation and digital trace favour boards that scrutinise recruiting data, contractor hiring, and platform-sourced labour beyond ATS-only purchases - audit narratives now appear in enterprise India evaluations and RFP scoring.",
    ],
    "Ship configurable worker-type and document metadata patterns with policy-driven workflows that avoid hard-coding Aadhaar collection where minimisation and voluntariness narratives apply.",
))

slides.append(pestel_slide(
    "Economic",
    [
        "India HR technology estimates near USD 1210M in 2025 toward USD 2440M by 2034 at roughly 7.6-7.7% CAGR in IMARC-style summaries, signalling SaaS investment that pulls recruiting into broader HCM platform choices rather than point buys.",
        "Recruitment software sub-segment nears USD 81.6M in 2025 toward USD 122.9M by 2034 with about 70% SaaS mix - mid-market and enterprise buyers still compare suite depth versus best-of-breed ATS in India evaluations.",
        "IT services campus and lateral hiring remains a volume bellwether - press cites large fresher intent across majors, justifying bulk hiring, funnel analytics, and RPO collaboration narratives in demos and services proposals.",
        "NASSCOM 2026 commentary highlights tech revenue scale, net headcount adds, and GCC growth - hiring mix shifts with AI productivity themes, changing how customers judge automation quality versus speed in competitive bakes.",
        "RPO market commentary near INR eight to nine thousand crore in 2025 with high-teens CAGR implies ATS journeys co-managed with outsourcers - security, role design, and status transparency between tenant and partner teams matter.",
    ],
    "Position bulk hiring, funnel analytics, and RPO collaboration with security and role design as first-class for India IT and GCC accounts; tie metrics to cost-per-hire and time-to-productivity.",
))

slides.append(pestel_slide(
    "Social",
    [
        "WhatsApp-scale usage supports mobile-first recruiting - open-rate marketing claims stay directional versus email yet still shape executive expectations on channel coverage in India competitive reviews and customer pilots.",
        "LinkedIn-cited Indian press surveys claim heavy AI hiring-tool investment - validate with customer evidence, but expect buyers to demand concrete automation stories in bake-offs versus regional suite marketing.",
        "Resume fraud, forged documents, and deepfake interview stories appear in trade press - buyers expect document integrity and interview authenticity diligence, pushing Know Your Candidate investments up the stack.",
        "Female labour-force participation narratives in PLFS and Economic Survey commentary raise inclusion reporting expectations with hiring fairness - dashboards and diversity disclosures increasingly tie back to recruiting funnels.",
        "Supreme Court and state threads on transgender workplace equality increase grievance and sensitive data-handling care - gender-identity collection and protection in ATS flows need legal-partnered design and training.",
    ],
    "Deliver mobile-native experiences, WhatsApp-ready channels where strategy permits, and trust-forward UX with audit trails that withstand social and legal scrutiny.",
))

slides.append(pestel_slide(
    "Technological",
    [
        "Cloud HCM commentary stresses payroll adjacency, mobile ESS, and compliance automation - recruiting is pulled into platform decisions, raising expectations for integrated duplicate, offer, and verification stories versus standalone ATS.",
        "AI-assisted screening, matching, scheduling, and interview analytics are mainstream buys - synthetic identity concerns shift from vendor anecdotes toward expected diligence in enterprise security reviews of talent products.",
        "Offline Aadhaar verification and regulated authentication paths stay central to KYC designs - storage and display governance still matters when minimisation and lawful purpose are debated with Legal partners in India.",
        "Background verification vendors stress API-led education and employment checks while DPDP raises consent and processor contracts - recruiting teams must surface these points in RFP and audit responses without over-claiming.",
        "MeitY October 2025 IT Rules add synthetic-media labelling duties for large intermediaries - relevant to how candidate media propagates and how interview recordings are stored, labelled, or redistributed across teams.",
    ],
    "Invest in document integrity signals, partner-verified checks, AI transparency with human review defaults, and secure handling of verification artefacts for India and EU deployers alike.",
))

slides.append(pestel_slide(
    "Environmental",
    [
        "SEBI BRSR mandates for top listed entities drive well-being, diversity, and training disclosures - assurance tightens through mid-decade commentary, nudging recruiting analytics to feed ESG reporting where hiring metrics appear.",
        "Green jobs and sustainability skills narratives surface in business press - Skill Council for Green Jobs projections imply taxonomies should flex for transition roles without overstating recruiting regulatory minima.",
        "India NDC 2031-2035 cabinet headlines anchor corporate transition storytelling - pre-hire recruiting regulatory minima stay limited versus workforce planning, so environmental slides remain secondary to skills and reporting hooks.",
        "Environmental pressure on recruiting products is employer brand, BRSR narrative support, and green skills taxonomy - not carbon metrics on applications - roadmap airtime should match actual buyer questions in India TA forums.",
        "DATA GAP: India-specific pre-hire carbon footprint metrics for recruiting are not standardised in sources reviewed - treat environmental factor as indirect for ATS design and avoid sustainability claims without evidence.",
    ],
    "Support skills ontology and job-profile metadata for green and transition roles; surface workforce reporting hooks for training and well-being without compliance theatre in apply flows.",
))

slides.append(pestel_slide(
    "Legal",
    [
        "DPDP Act 2023 establishes fiduciary duties, consent or legitimate uses, notice, accuracy, security, breaches, and Significant Data Fiduciary rules - recruiting must translate summaries into notices, retention, and subprocessor records.",
        "DPDP Rules 2025 commentary cites November 2025 notification with eighteen-month applicability narratives and cross-border restrictable-default framing - India readiness stays a board programme, not a single product toggle.",
        "Advisory penalty tables cite very large rupee caps for security, breach, audit, DPO, and board failures - exact mapping needs legal verification against gazette text before customer-facing fine claims in decks or contracts.",
        "GDPR obligations on lawfulness, special categories, transparency, erasure, portability, automation, DPIA, and transfers stay relevant for EU parents hiring in India - especially automated decisions and cross-border processing narratives.",
        "EU AI Act Annex III lists recruitment and evaluation AI with Articles nine to fourteen and twenty-seven obligations - August twenty twenty-six appears in industry summaries as a milestone for high-risk hiring AI diligence programmes.",
    ],
    "Ship granular withdrawable consent and notices for India candidates with retention schedules and cross-border documentation; embed human review, logs, and explainability for AI-assisted hiring workflows.",
))

slides.append(sec("0 6", "Competitive landscape"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Regional Specialists and India Suites"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 4.05, "height_inches": 1.05, "paragraphs": [
        {"level": 1, "text": "India-first suites market high-volume stories, board integrations, and omnichannel channels—bundle TCO often wins mid-market bake-offs against global suite depth."},
        {"level": 1, "text": "Global peers show active AI and text engagement press—expect head-to-head benchmarks on channels and matching in enterprise RFP cycles."},
        {"level": 1, "text": "Use India competitive matrix Native versus workaround versus true gap rows when translating this landscape into sales plays."},
    ]}],
    "tables": [{
        "rows": [
            ["Competitor", "Positioning in India context"],
            ["Darwinbox + SpringVerify", "Integrated know-your-candidate storytelling with regional suite packaging."],
            ["Keka / greytHR / Zoho", "Strong mid-market TCO; marketplace WhatsApp and Twilio SMS narratives; local board paths."],
            ["PeopleStrong", "Omnichannel recruiting marketing aimed at India enterprise and staffing scale."],
            ["SAP / Oracle / iCIMS", "Global enterprise benchmarks on AI, mobile, and text engagement in recent press scans."],
        ],
        "left_inches": 0.5,
        "top_inches": 1.15,
        "width_inches": 9.0,
        "height_inches": 2.85,
        "font_size_pt": 9,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Use matrix Native versus workaround versus true gap for sales follow-up.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Global Platforms: Workday Claims"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 4.05, "height_inches": 1.05, "paragraphs": [
        {"level": 1, "text": "Duplicate management, background check connectors, bulk actions, and configurable privacy levers are native strengths to lead within MNC India and regulated enterprises."},
        {"level": 1, "text": "True gaps on plus-nine-one SMS, core WhatsApp, UIDAI eKYC, and Naukri-class multipost require honest partner maps—Broadbean validation per deal, CPaaS patterns, BGV vendors."},
        {"level": 1, "text": "Hindi language pack and DPDP-style configuration support India Q2 emphasis when paired with channel roadmap delivery."},
    ]}],
    "tables": [{
        "rows": [
            ["Theme", "Workday posture (matrix-aligned)"],
            ["Duplicate management", "Native unified duplicate framework and match-and-merge depth when enabled."],
            ["Background verification", "Native job application BP plus background check connector and Studio patterns."],
            ["Bulk recruiter actions", "Native mass actions on candidate grids for high-volume lanes."],
            ["Privacy levers", "Configurable consent, retention, and purge patterns aligned to DPDP-style customer configuration."],
            ["Language", "Hindi language pack noted as native in India matrix context."],
        ],
        "left_inches": 0.5,
        "top_inches": 1.15,
        "width_inches": 9.0,
        "height_inches": 2.85,
        "font_size_pt": 9,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Do not over-claim Aadhaar eKYC or Naukri multipost as native without partner context.\n\nReferences:\n• research/competitive/in/in-competitive-scan-2026-04-06-INDIA-E2E-005.md",
})

swot_s = (
    "Suite depth across HCM, Recruiting, Talent, and security gives MNC India and GCC captives one global template versus mid-market bundles optimising local TCO. | "
    "Know-your-candidate foundations combine duplicate management and job-application BP plus background check connector for defensible verification orchestration versus simpler competitor packaging. | "
    "Configurable consent, retention, and purge supports India DPDP emphasis alongside GDPR and EU AI Act overlays for EU parents hiring in India. | "
    "Bulk grid actions support campus, IT services, and RPO-heavy hiring lanes described in economic commentary. | "
    "Hindi language pack is native; TA strategy PDF lists WhatsApp, fraudulent application detection, and enhanced consent as near-term items addressing channel gaps."
)
swot_w = (
    "Native plus-nine-one SMS remains a true gap; CPaaS plus Studio patterns are workarounds with consent and logging caveats—reconcile professional services guidance before RFP claims. | "
    "Native WhatsApp inside core Recruiting UI is a true gap while competitors market channels aggressively; roadmap cites direction but not live parity. | "
    "Native UIDAI Aadhaar eKYC is not Workday-delivered; partner and BGV paths must be explicit in customer conversations. | "
    "Out-of-box native direct Naukri-class multipost without multipartner or Studio is a true gap; validate Broadbean coverage per deal. | "
    "SAP mobile recruiter and Paradox activation expectations create demo friction against AI-first regional suites."
)
swot_o = (
    "India Q2 row bundles scale growth, DPDP compliance, local boards, and eight wins—product and GTM can tie privacy artefacts, board validation, and volume demos to that motion. | "
    "DPDP Rules operationalisation raises enforcement-forward fines and processor duties—audit-ready consent, notices, retention, subprocessors, and breach playbooks differentiate. | "
    "Roadmap convergence on WhatsApp, fraud-phase detection, and enhanced consent maps to mobile, deepfake, and matrix true gaps without over-collecting identity. | "
    "High-volume and RPO economics from fresher headlines and RPO market commentary support bulk funnel analytics and RPO security narratives. | "
    "HiredScore activation with human oversight contrasts lighter regional AI screening claims when EU AI Act narratives matter."
)
swot_t = (
    "India-first suites combine high-volume marketing, board integrations, WhatsApp and SMS narratives, and INR packaging—bundled TCO displaces best-of-breed in some deals. | "
    "SAP, Oracle, and iCIMS press benchmarks compress differentiation on AI and omnichannel in head-to-head enterprise RFPs. | "
    "DPDP enforcement and cross-border complexity raise scrutiny—weak subprocessor transparency or immature India runbooks hurt scores. | "
    "Fraud and deepfake expectations shift buyers toward continuous verification; specialist vendors market aggressively versus suite positioning. | "
    "Labour code and gig formalisation increase configuration burden where competitors sell simplified India payroll-plus-hire stories."
)

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Competitive SWOT: Workday in India"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 1.05, "height_inches": 0.85, "paragraphs": [
        {"level": 1, "text": "Lead MNC India with suite depth, duplicate management plus background check story, and DPDP-configurable artefacts; close channel gaps via roadmap WhatsApp, consent, and fraud-phase items."},
        {"level": 1, "text": "Counter suite TCO attacks with global risk, audit, and single-record framing; benchmark honestly against SAP, Oracle, and iCIMS AI and text narratives."},
        {"level": 1, "text": "Mitigate DPDP enforcement and fraud expectations with subprocessors transparency, partner ecosystem depth, and synthetic-media awareness in enablement."},
    ]}],
    "tables": [
        {
            "rows": [["Strengths", "Weaknesses"], [swot_s, swot_w]],
            "left_inches": 0.45,
            "top_inches": 2.0,
            "width_inches": 9.1,
            "height_inches": 1.85,
            "font_size_pt": 7,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        },
        {
            "rows": [["Opportunities", "Threats"], [swot_o, swot_t]],
            "left_inches": 0.45,
            "top_inches": 3.95,
            "width_inches": 9.1,
            "height_inches": 1.85,
            "font_size_pt": 7,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        },
    ],
    "speaker_notes": "• Semicolon-separated cells keep dense SWOT readable at 7pt.\n\nReferences:\n• research/India/swot-analysis-India-2026-04-06-INDIA-E2E-005.md",
})

slides.append(sec("0 7", "Win / Loss"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Win/Loss: India hiring friction (presales)"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Three Talent Acquisition gaps matched India keyword rules in the presales export (five-year window, TA filter) - two severity four and one severity five; none scored severity one to three in this slice."},
        {"level": 1, "text": "Illustrative rows span self-scheduling timezone friction for India talent versus US calendars, Candidate Home split forcing a local site path, and knock-out questionnaires locked in HRIS change-control at high applicant volumes."},
        {"level": 1, "text": "No presales rows here mention Aadhaar KYC or impersonation - pair those interview themes with competitive matrix gaps rather than presales frequency claims until richer region facets arrive."},
    ]}],
    "speaker_notes": "• Label buyer comparisons as perception pending competitive validation.\n\nReferences:\n• research/India/gap-analysis/2026-04-06-gap-analysis-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Win/Loss: Severity Mix (India slice)"),
    "charts": [{
        "chart_type": "column",
        "categories": ["Severity 4", "Severity 5"],
        "series": [{"name": "Gap count", "values": [2, 1]}],
        "title": "India-keyword TA gaps by severity (N=3)",
        "left_inches": 0.55,
        "top_inches": 1.35,
        "width_inches": 8.9,
        "height_inches": 3.1,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "text_boxes": [{
        **TB(1.2, 12),
        "top_inches": 4.45,
        "height_inches": 1.05,
        "paragraphs": [
            {"level": 1, "text": "Low presales loss-risk frequency in this slice does not negate interview-severity on identity, duplicates, and offers—use mixed evidence in roadmap framing."},
            {"level": 1, "text": "Two severity-four gaps imply partner or costly workaround expectations while the severity-five row still signals manual effort amplified at India applicant volumes."},
            {"level": 1, "text": "Future exports with Opp Region equals India would strengthen frequency analytics; this deck pairs counts with qualitative severity from interviews."},
        ],
    }],
    "speaker_notes": "• Keep chart simple: one series per category.\n\nReferences:\n• research/gap-data/opportunity-detail-export.csv (filtered)",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Win/Loss: Deal Examples and Caveats"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "All three matched rows carry North America Opp Segment while India relevance is text-evidenced—position as India-hiring narratives in global HQ deals, not a domestic Opp Region slice."},
        {"level": 1, "text": "Severity four rows imply partner or costly workaround expectations; severity five still signals manual effort amplified when India applicant volumes spike."},
        {"level": 1, "text": "Flowserve row remains a won opportunity—pain is operational cost and perception risk, not automatic loss attribution."},
        {"level": 1, "text": "Recommend refreshing exports with Opp Region equals India when available to strengthen frequency analytics for future quarters."},
    ]}],
    "speaker_notes": "• Encourage data owners to add finer region facets where possible.\n\nReferences:\n• research/India/gap-analysis/2026-04-06-gap-analysis-INDIA-E2E-005.md",
})

slides.append(sec("0 8", "Ideation Hub"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Ideation Hub: Overview and Scope"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Global P&T ideation export (30 March 2026) holds N=10016 ideas after TM-to-TA linkage filter, a large quantitative voice beyond India interviews that still lacks India keyword stratification."},
        {"level": 1, "text": "TA sentiment reads roughly negative point one six three and effort near negative one point two three on the dashboard scale, a directional hardship signal to pair with interview quotes, not a regional cut."},
        {"level": 1, "text": "No India or Aadhaar tokens appeared in the dump review; use volumes to reinforce comms, apply, requisition, and candidate clusters without replacing statutory evidence from customers."},
    ]}],
    "speaker_notes": "• Clarify global scope before quoting numbers.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-06-brainstorm-analysis-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Ideation Hub: Top Capability Volumes"),
    "charts": [{
        "chart_type": "bar",
        "categories": ["Comms", "Job Reqs", "Apply Flow", "Candidates", "Offers"],
        "series": [{"name": "Idea volume", "values": [1464, 1407, 1405, 1220, 926]}],
        "title": "Top TA capabilities by idea volume (global filter)",
        "left_inches": 0.55,
        "top_inches": 1.35,
        "width_inches": 8.9,
        "height_inches": 3.15,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "text_boxes": [{
        **TB(1.2, 12),
        "top_inches": 4.55,
        "height_inches": 0.95,
        "paragraphs": [
            {"level": 1, "text": "Communications and Notifications shows worst sentiment in the validation matrix while Offers and Candidates and Prospects show deepest effort scores—pair with India customer quotes."},
            {"level": 1, "text": "Bar heights reflect global TA-filtered volumes (March 2026 export), not India-stratified sampling—interpret as directional reinforcement of interview themes."},
            {"level": 1, "text": "Job Requisitions volume sits beside Apply Flow and Candidates clusters—useful when arguing for TA-owned knock-out agility and apply validation together."},
        ],
    }],
    "speaker_notes": "• Short category labels prevent axis overlap.\n\nReferences:\n• research/brainstorm-sessions/dump.txt",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Ideation Hub: Verbatims and Topics"),
    "text_boxes": [{**TB(1.2, 12), "paragraphs": [
        {"level": 1, "text": "Apply validation and attachments: customers ask for country-aware validation rules and dynamic country lists tied to posted locations, echoing India hard-gate needs though the dump rarely names India."},
        {"level": 1, "text": "Multi-location apply friction: idea responses describe unsustainable calculated-field workarounds when jobs post in many locations, mirroring supervisory org and cost-centre ambiguity in Teleperformance interviews."},
        {"level": 1, "text": "Privacy and retention plus mass-administration friction: verbatims contrast legal retention with recruiter visibility and show security-policy navigation pain, illustrating click tax at BPO scale."},
    ]}],
    "speaker_notes": "• Subheaders count toward density—keep bullets tight.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-06-brainstorm-analysis-INDIA-E2E-005.md",
})

slides.append(sec("0 9", "Internal SMEs"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Expert interviews: programme purpose"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Five Workday experts spanning India implementation, field readiness, architecture, strategic engagement, and talent product leadership ground this readout before customer triangulation."},
        {"level": 1, "text": "Notes from July 2025 through January 2025 synthesise trust, volume, documents, channels, and offer complexity for portfolio forums that need implementation reality beyond sales narratives."},
        {"level": 1, "text": "Expert views supplement customers, not replace them; pair with legal review on identity claims. Speaker notes may name people internally; slides stay on SME identifiers and matrix gaps for roadmap sequencing."},
    ]}],
    "speaker_notes": "• Attribute SMEs internally; customer slides stay P1–P5.\n\nReferences:\n• research/India/105-sme-research-findings.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("SME Participants"),
    "tables": [{
        "rows": [
            ["SME ID", "Role", "Organisation context"],
            ["SME1", "Sr. Functional Consultant, Global Services", "India deployments; high-volume patterns"],
            ["SME2", "Sr. Product Advisor, Field Readiness", "India-scoped implementations; offer and BGC design"],
            ["SME3", "Enterprise Architect, Workday Services (India)", "Genpact-scale hiring; supply chain bridge"],
            ["SME4", "Director, Strategic Customer Engagement", "Large services customer recruiting scale themes"],
            ["SME5", "VP, Talent Product Management", "Executive framing on fraud, India focus, partners"],
        ],
        "left_inches": 0.5,
        "top_inches": 1.15,
        "width_inches": 9.0,
        "height_inches": 2.55,
        "font_size_pt": 10,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Map SME IDs to names only in presenter notes when needed.\n\nReferences:\n• research/India/105-sme-research-findings.md",
})

sme_bodies = [
    (
        "SME1 - Global Services Consultant",
        [
            "GDPR-style marketing opt-in defaults can suppress India reach when candidates ignore email; practice teams ask for region-configurable opt-out models where lawfully permitted and measurable.",
            "WhatsApp is described as ubiquitous for back-and-forth and link sharing versus traditional SMS; roadmap timing still depends on channel delivery teams and consent design with legal partners.",
            "India background checks are extensive; customers want attachments before interviews so the correct person arrives, not only at formal BGC steps that sit later in the lifecycle.",
            "Workarounds use email when in-flow attachment patterns feel awkward, raising candidate-home and flexible document collection priorities for high requisition loads in services accounts.",
            "Impersonation stories drive desire for interviewer prompts tied to uploaded ID; chatbot flows could reduce missed emails when recruiters juggle hundreds of open reqs simultaneously.",
        ],
    ),
    (
        "SME2 - Field Readiness Advisor",
        [
            "India offer compensation breakdowns are table-heavy with many calculated fields and sometimes dual documents; legally driven detail increases change requests when formulas slip at scale.",
            "Customers used Workday Extend to recreate start-date correction flows when hire automation raced ahead of real-world date changes, signalling need for safer automation guardrails in India.",
            "India populations sometimes need hire before all background check results versus stricter US gating; country-flexible rules and simple BGC reinitiate reduce bespoke business process work.",
            "Questionnaires with attachment questions and review-document steps pile up for passport photos and pay stubs; rationalise patterns for KYC-style packs before offer tasks begin.",
            "Dual-document and formula drift scenarios show why recruiter notifications and amendment paths must stay auditable when finance revises compensation after verbal acceptance.",
        ],
    ),
    (
        "SME3 - Enterprise Architect, India",
        [
            "Genpact-scale hiring uses mass actions for offers, agreements, and approvals; same-day start cohorts stress worksheets versus grid culture and demand predictable bulk tooling with clear TA and ops ownership in peaks.",
            "Impersonation risk pushes verification examples in notes; rich upfront capture in Workday is needed so candidates avoid retyping data in vendor portals downstream during high-concurrency India campaigns.",
            "Limited tracking when candidates change name, phone, or address on the career site is a compliance risk; post-offer no-shows drove purchased messaging for high-touch engagement when join dates are tight.",
            "Talent supply chain metaphors highlight that recruiting, onboarding, and IT access must align; weak handoffs between modules show up as missed start dates in India programmes and erode executive confidence quickly.",
            "Architects emphasise API-led verification partners yet warn that core identity fields must remain authoritative inside Workday to avoid conflicting sources of truth at offer and downstream payroll steps.",
        ],
    ),
    (
        "SME4 - Strategic Customer Engagement",
        [
            "Notes cite roughly half of India applications not processed in Workday for internal compliance reasons; clarify policy versus regulatory drivers with customers before blaming product gaps alone.",
            "Duplicate context at extreme scale collides with auto-merge limited to two records; operations need merge beyond pairs when agencies upload thousands of profiles weekly.",
            "Do-not-hire auto-disposition interest appears across regions; India intensity raises application fraud and admin load, with hypotheses that assisted review could help if governed carefully.",
            "Interview-stage ID validation remains explicit to prove interviewee matches candidate of record; engagement leaders tie this to executive trust narratives in regulated services industries.",
            "Speculative network-style credential ideas appear in notes for awareness only; label exploratory in conversations and avoid implying committed product direction on customer-facing slides.",
        ],
    ),
    (
        "SME5 - VP Talent Product Management",
        [
            "Executive framing compares recruiting KYC to banking KYC with resume integrity risk; notes cite very large monthly resume volumes and severe services-industry impact when trust breaks.",
            "Product leadership acknowledges India gaps and address localisations as rollout areas; regulations tie to fraud-prevention narratives in complex market conditions with uneven enforcement timing.",
            "FY27-style India opportunity language appears in executive notes alongside fraud themes; use it to align portfolio forums while avoiding premature revenue promises on unshipped capabilities.",
            "Interview intelligence partner notes appear as complements to native workflows; position ecosystem honestly alongside core identity journeys so buyers understand boundary of responsibility.",
            "Follow-on items in notes reference additional internal contacts; treat as out-of-band context rather than on-slide commitments during external executive readouts or analyst conversations.",
        ],
    ),
]

for idx, (stitle, bullets) in enumerate(sme_bodies):
    paras = [{"level": 1, "text": b} for b in bullets]
    layout = "Title Only_Alt" if idx % 2 else "Title Only"
    slides.append({
        "master_index": MI,
        "layout_name": layout,
        "placeholders": ph_title(stitle),
        "text_boxes": [{**TB(1.2, 12), "paragraphs": paras}],
        "speaker_notes": "• Keep biometric claims out of customer-facing commitments pending legal review.\n\nReferences:\n• research/India/105-sme-research-findings.md",
    })

slides.append(sec("1 0", "Primary research"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Customer Interviews: Programme Intro"),
    "text_boxes": [{**TB(1.2, 14), "paragraphs": [
        {"level": 1, "text": "Five Teleperformance India recruiters and managers spanning specialised, confidential, and very high-volume associate and frontline hiring provided December 2025 onsite transcripts with rich operational detail."},
        {"level": 1, "text": "Evidence concentrates on India statutory identifiers, duplicate and agency economics, offer lifecycle limits, notification noise, and India six-day operations versus Saturday maintenance windows that affect live hiring cadence."},
        {"level": 1, "text": "Participants are anonymised as P1 to P5 on slides while preserving employer context for enterprise credibility and scale claims without exposing individual identities in executive materials."},
        {"level": 1, "text": "Pair quotes with presales and ideation signals to show convergent pain even when each source has limitations, so roadmap conversations balance frequency data with qualitative severity from frontline operators."},
    ]}],
    "speaker_notes": "• Respect anonymisation in all customer-visible materials.\n\nReferences:\n• research/India/105-user-research-findings.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Interview Participants"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 3.75, "height_inches": 1.15, "paragraphs": [
        {"level": 1, "text": "Five voices span specialised internal recruiting, leadership confidential hiring, high-volume associate hiring lanes, and multi-site frontline leadership across Teleperformance India operations sampled December 2025."},
        {"level": 1, "text": "Anonymised identifiers protect individuals while preserving employer context so executives can judge credibility of scale claims such as thousands of monthly associate hires in peak seasons."},
        {"level": 1, "text": "Quotes and pain bullets on following slides come from structured research findings files—presenters should not add live names beyond this internal table."},
    ]}],
    "tables": [{
        "rows": [
            ["Participant", "Role", "Organisation"],
            ["P1", "Recruitment Manager, Specialised Recruiting", "Teleperformance (India)"],
            ["P2", "Recruitment Manager, Specialised Recruiting", "Teleperformance (India)"],
            ["P3", "Recruiter, Leadership / Confidential Hiring", "Teleperformance (India)"],
            ["P4", "Recruiting Lead, high-volume hiring (East India)", "Teleperformance (India)"],
            ["P5", "Senior Manager, Frontline Hiring (North and East)", "Teleperformance (India)"],
        ],
        "left_inches": 0.5,
        "top_inches": 1.15,
        "width_inches": 9.0,
        "height_inches": 2.45,
        "font_size_pt": 10,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Table matches appendix in thematic analysis report.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

cust = [
    (
        "P1 - Recruitment Manager, TP India",
        [
            "Runs a specialised internal recruiting pod balancing hands-on hiring and team performance; quote on day-to-day candidate work plus manager attendance duties shows split focus that erodes deep req time unless admin drag drops.",
            "Team is specialised and fully internal to Teleperformance, so friction hits internal SLAs and manager capacity rather than agency buffers - insights reflect embedded trust and operational honesty about tooling limits.",
            "Shares email-heavy approval patterns adjacent to Workday with P2 and P3; needs predictable handoffs and systems of record so specialised recruiters hit offer and joiner commitments without shadow spreadsheets.",
            "JTBD: dependable in-product workflows that sustain throughput while managers keep visibility on attendance, goals, and candidate progression without constant rework loops during peak hiring.",
        ],
    ),
    (
        "P2 - Recruitment Manager, TP India",
        [
            "Creates reqs after email approvals and maps unique position codes; focuses on engagement and onboarding push rather than personally releasing offers, exposing how finance evidence still sits outside the core system today.",
            "Quote shows approvals live in email threads before raising a job requisition, forcing manual evidence attachment before downstream offer tasks and slowing candidates when competitive markets move quickly week to week.",
            "Unique position codes reveal parallel schemes because in-product financial and org attributes are not trusted at first pass, increasing reconciliation load when hiring managers mistype cost centres or supervisory org values.",
            "JTBD: finance and org attributes correct on first entry inside Workday with ageing views on reqs instead of Excel trackers so SLAs hold when leadership pressure spikes during quarter close.",
        ],
    ),
    (
        "P3 - Recruiter, Leadership Hiring, TP",
        [
            "Owns confidential leadership reqs end-to-end with offline compensation and position approvals plus document bundles before offers; policy demands three IDs before extension yet fields are not enforced as mandatory inside the candidate flow.",
            "Soft gating lets candidates advance while recruiters cannot extend compliantly, creating rework and senior-candidate frustration where every day of delay risks competitor wins in tight leadership markets.",
            "Cites losing about sixteen to seventeen percent of candidates before offer acceptance because the process feels heavy - quantifies leakage tied to workflow weight rather than employer brand strength alone.",
            "JTBD: hardened India statutory ID gates, reliable OTP delivery, monitoring hooks, and clear candidate messaging so policy, system behaviour, and audit evidence stay aligned before final offer release.",
        ],
    ),
    (
        "P4 - Recruiting Lead, high-volume hiring, TP",
        [
            "Kolkata-focused high-volume hiring cites roughly one hundred to one hundred fifty hires per week at peak and thousands of profiles reviewed daily across vendor uploads - scale explains why per-click workflows become dedicated roles.",
            "Quote frames India hiring around eight to nine thousand associate roles in a month nationally, helping executives see why per-click workflows tax entire teams instead of occasional recruiter tasks during peaks.",
            "Vendor upload approvals cannot be removed without blocking rehire paths, so compliance and retention rules prevent naive automation and leave massive daily approval queues across hundreds of agency relationships.",
            "JTBD: deterministic duplicate detection, first-source attribution inside cooling-off rules, and fee-safe approvals respecting rehire constraints without full-day approval marathons for recruiting leads.",
        ],
    ),
    (
        "P5 - Senior Manager, Frontline Hiring, TP",
        [
            "North and East India frontline scope cites roughly fifteen hundred to two thousand hires per week routinely plus extreme seasonal peaks with six-day operations - downtime windows hit revenue directly.",
            "Asks for duplicate automation beyond first name, phone, and email, pushing lawful government identifiers as extra keys because current matching misses clones at BPO scale.",
            "Saturday maintenance windows for the core platform clash with India six-day operations, creating peak-season risk when maintenance lands on working recruiting days.",
            "Roughly one hundred to one hundred fifty offers daily without mass-offer tooling means regenerate and rescind limits multiply into legal letters and overtime; JTBD is stable identity capture plus controlled offer amendments.",
        ],
    ),
]

for i, (ct, bullets) in enumerate(cust):
    paras = [{"level": 1, "text": b} for b in bullets]
    layout = "Title Only_Alt" if i % 2 else "Title Only"
    slides.append({
        "master_index": MI,
        "layout_name": layout,
        "placeholders": ph_title(ct),
        "text_boxes": [{**TB(1.2, 12), "paragraphs": paras}],
        "speaker_notes": "• Quote accuracy checked against 105 structured file.\n\nReferences:\n• research/India/105-user-research-findings.md",
    })

slides.append(sec("1 1", "Thematic analysis"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Validated findings: clusters 1-2"),
    "text_boxes": [{**TB(1.2, 12), "paragraphs": [
        {"level": 1, "text": "Cluster 1 (Know Your Candidate): government IDs bridge apply, interview, and offer, yet soft gating lets candidates advance while recruiters cannot extend offers, lengthening leadership cycles (P3, P5)."},
        {"level": 1, "text": "OTP failures on Aadhaar-linked mobiles drive support tickets and recruiter chase - reliability, retry, and monitoring hooks matter as much as configurable mandatoriness on statutory fields before offer tasks."},
        {"level": 1, "text": "Cluster 2 (High-volume trust): thousands of profiles daily make vendor approvals and duplicate checks dedicated FTE roles; automation must respect rehire and retention rules that block naive approval removal (P4)."},
    ]}],
    "speaker_notes": "• Cross-reference clusters with triangulation matrix.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Validated findings: clusters 3-4"),
    "text_boxes": [{**TB(1.2, 12), "paragraphs": [
        {"level": 1, "text": "Cluster 3 (Offer lifecycle): regenerate limits after acceptance, weak rescind paths, acknowledgement-only acceptance, and missing recruiter notifications force legal letters when hundreds of offers land daily (P3 to P5)."},
        {"level": 1, "text": "Cluster 4 (Omnichannel engagement): candidates expect mobile-first responsiveness while recruiters need traceable comms - generic task floods undermine compliance narratives and India matrix still shows SMS and WhatsApp gaps."},
        {"level": 1, "text": "Marketing opt-in defaults from global privacy patterns can suppress India reach when candidates skip email confirmation - region-aware consent models need legal design before marketing default changes."},
    ]}],
    "speaker_notes": "• Offer and comms clusters tie to recommendations one and two.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Validated findings: cluster 5"),
    "text_boxes": [{**TB(1.2, 12), "paragraphs": [
        {"level": 1, "text": "Cluster 5 (Configurability and scale): supervisory org and cost-centre ambiguity upstream drives requisition edits and worst-case re-application - guided capture and in-product approvals reduce leakage for BPO-scale customers."},
        {"level": 1, "text": "Saturday maintenance windows clash with India six-day operations; presales rows add timezone scheduling friction and knock-out agility pain where HRIS change control blocks fast questionnaire updates at volume."},
        {"level": 1, "text": "Self-scheduling pain for India talent versus US calendars appears in presales text - pair Paradox depth and timezone-aware defaults when discussing scheduling investments alongside identity and offer workstreams."},
    ]}],
    "speaker_notes": "• Connect cluster five to platform operations and TA governance.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Cross-Source Validation Matrix"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 4.12, "height_inches": 0.95, "paragraphs": [
        {"level": 1, "text": "Rows summarise how internal SMEs, Teleperformance interviews, global ideation volumes, and presales gap text align or stay silent on each headline India cluster."},
        {"level": 1, "text": "Silence in presales on KYC keywords does not disprove interview severity—use the matrix to explain mixed evidence rather than over-claiming frequency."},
        {"level": 1, "text": "Competitive matrix remains authoritative for Native versus workaround versus true gap labelling alongside this qualitative cross-check."},
    ]}],
    "tables": [{
        "rows": [
            ["Theme", "SME view", "Customer", "Ideation", "Gap export"],
            ["T1 Identity", "Strong pre-interview ID and fraud framing", "Strong PAN/Aadhaar/UAN pain", "Candidates deep negative effort", "No KYC rows; Home split hint"],
            ["T2 Duplicates", "Merge limits; DNH interest", "Agency uploads; source disputes", "Mass action still negative", "Not present in slice"],
            ["T3 Offers", "India offer density; BGC timing", "Regenerate; notifications", "Offers deep negative effort", "Not offer-specific"],
            ["T4 Comms", "WhatsApp; opt-in", "Task noise; traceability", "Comms worst sentiment", "Not present"],
            ["T5 Agility", "Extend complexity", "Org data; Saturday ops", "Apply flow negative effort", "Scheduling; knock-outs; Home"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.1,
        "width_inches": 9.3,
        "height_inches": 2.95,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.28,
    }],
    "speaker_notes": "• Matrix mirrors Phase four table with executive wording.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

slides.append(sec("1 2", "Full funnel"))

slides.append({
    "master_index": MI,
    "layout_name": "Title Only_Alt",
    "placeholders": ph_title("Gap Analysis"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 4.15, "height_inches": 0.95, "paragraphs": [
        {"level": 1, "text": "Funnel view stitches Teleperformance interviews, SME implementation notes, and three presales rows into one diagnostic strip for roadmap conversations without double-counting frequency."},
        {"level": 1, "text": "Several cells rely on buyer-reported perceptions—validate native versus workaround options with Professional Services before hardening severity language in customer decks."},
        {"level": 1, "text": "Candidate Home split and knock-out agility cells show how global HQ deals still surface India hiring friction even when Opp Region facets omit India in the export."},
    ]}],
    "tables": [{
        "rows": [
            ["Funnel stage", "Primary gap", "Evidence sources"],
            ["Apply / identity", "Soft gates on government IDs; OTP reliability; parser and resume gaps", "P3, P5; SME pre-interview docs"],
            ["Duplicate / source", "Manual vendor approvals; weak first-source logic; merge limits", "P4; SME4 scale narrative"],
            ["Interview / schedule", "Timezone friction for India versus US calendars", "Presales Quantcast row"],
            ["Assessment / knock-outs", "HRIS-locked questionnaires at high India volume", "Presales Flowserve row"],
            ["Offer / onboarding", "Regenerate and rescind limits; notification gaps; mass-offer absence", "P3–P5; SME offer complexity"],
            ["Candidate Home", "Forced India site path reduces single-record visibility", "Presales Morningstar row"],
        ],
        "left_inches": 0.45,
        "top_inches": 1.1,
        "width_inches": 9.1,
        "height_inches": 2.95,
        "font_size_pt": 9,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Title must remain Gap Analysis per baseline.\n\nReferences:\n• research/India/gap-analysis/2026-04-06-gap-analysis-INDIA-E2E-005.md",
})

slides.append(sec("1 3", "Roadmap"))

recs = [
    (
        "Recommendation 1: Enhanced comms consent",
        [
            "Problem and evidence: global privacy defaults collide with granular India needs when candidates skip email opt-in; SME1, P3, ideation privacy text, and matrix channel gaps show consent is structural, not copy-only.",
            "Recommendation: enhanced candidate communication consent with India and EU overlays across marketing, SMS, and WhatsApp with withdrawable artefacts, logging, and role-separated visibility after legal review.",
            "Why now: Q2 India stresses DPDP readiness; March 2026 TA strategy lists enhanced consent near-term beside WhatsApp so sequencing avoids compliance debt before channel expansion.",
            "Success metric: lift application completion two to five points in a pilot India cohort versus baseline started-to-submitted conversion with agreed analytics definitions.",
        ],
    ),
    (
        "Rec 2: WhatsApp in Recruiting UI",
        [
            "Problem and evidence: buyers expect WhatsApp-class responsiveness; matrix flags native gap; SME notes ubiquity; social PESTEL reinforces mobile-first expectations versus regional suite marketing.",
            "Recommendation: ship WhatsApp in core Recruiting UI with collaborative panels, consent capture, delivery logging, and counsel review for India and EU overlays before broad claims.",
            "Why now: TA strategy lists WhatsApp for early access and GCC already earns executive airtime for messaging - India can reuse disciplined delivery patterns.",
            "Success metric: raise career-site starts or completions on India campaigns using WhatsApp nudges versus email-only by ten percent in a pilot with clean attribution.",
        ],
    ),
    (
        "Rec 3: Offer changes and alerts",
        [
            "Problem and evidence: post-accept changes, weak rescind or regenerate, and missing recruiter alerts force legal letters at hundreds of offers daily; P3 cites heavy-process loss, P4 cites wrong-comp history, P5 cites mass-offer gaps.",
            "Recommendation: controlled post-accept amendments with compliant rescind or regenerate, structured recruiter notifications scoped to req and candidate, and in-product audit evidence where feasible.",
            "Why now: ATS parity work on scheduling still needs offer integrity and notification hygiene for India scale and cleaner downstream data for matching narratives.",
            "Success metric: improve accepted-to-issued offer ratio five points in pilot lanes that previously showed abandonment, using shared period definitions with finance.",
        ],
    ),
    (
        "Rec 4: Hardened India ID gates",
        [
            "Problem and evidence: soft PAN, Aadhaar, and UAN gates let candidates advance while offers stall; OTP failures add support load; P3, P5, and SMEs converge though presales slice lacks KYC keywords.",
            "Recommendation: configurable mandatory stops for India statutory IDs, completeness dashboards before offer tasks, OTP monitoring and retries, support playbooks, and minimisation-aware candidate messaging.",
            "Why now: India scale plus DPDP emphasis makes identity artefacts central to lawful processing stories and trims offer-stage rework called out across participants.",
            "Success metric: cut offer-stage dwell from ID rework by ten to twenty percent in a pilot high-volume cohort versus control from final interview to accepted offer.",
        ],
    ),
    (
        "Rec 5: Duplicate and source rules",
        [
            "Problem and evidence: manual duplicate and vendor approvals consume roles; source fights explode at daily thousands of profiles; P4 and P5 stress scale; ideation shows mass-action pain; SMEs cite merge limits.",
            "Recommendation: extend duplicate matching to lawful India identifiers, configure first-source and cooling-off behaviour, and ship bulk triage respecting rehire and retention guardrails.",
            "Why now: cleaner funnel data is prerequisite for differentiated matching stories and lowers screening cost before models prove uplift in enterprise bids.",
            "Success metric: reclaim twenty recruiter hours weekly in a pilot BPO tenant via time-motion on duplicate and vendor clicks, shifting time to quality and experience.",
        ],
    ),
]

for i, (title, bullets) in enumerate(recs):
    paras = [{"level": 1, "text": b} for b in bullets]
    layout = "Title Only_Alt" if i % 2 else "Title Only"
    slides.append({
        "master_index": MI,
        "layout_name": layout,
        "placeholders": ph_title(title),
        "text_boxes": [{**TB(1.2, 12), "paragraphs": paras}],
        "speaker_notes": "• Align success metrics with instrument definitions in IUM where noted.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
    })

slides.append({
    "master_index": MI,
    "layout_name": "Title Only",
    "placeholders": ph_title("Roadmap Priority Table"),
    "text_boxes": [{**TB(1.2, 12), "top_inches": 4.05, "height_inches": 1.05, "paragraphs": [
        {"level": 1, "text": "Top five rows mirror RICE ordering in the thematic report; remaining items stay in markdown for portfolio triage without overcrowding the executive readout."},
        {"level": 1, "text": "Success metric hooks reference instrument ideas from the report—tighten definitions with analytics partners before committing customer-facing targets."},
        {"level": 1, "text": "Legal review remains mandatory for consent defaults, biometric language, and cross-border data flows before any public roadmap claim."},
    ]}],
    "tables": [{
        "rows": [
            ["#", "Title", "RICE", "Metric hook"],
            ["1", "Enhanced comms consent", "2.43", "Funnel +2–5 pts completion"],
            ["2", "Native WhatsApp in UI", "2.08", "+10% apply starts pilot"],
            ["3", "Offer amendments + alerts", "1.66", "+5 pts accept / issue ratio"],
            ["4", "Hardened India ID journey", "1.52", "−10–20% offer dwell"],
            ["5", "Duplicate + source rules", "1.28", "≥20 hrs/week reclaimed"],
            ["6–12", "Fraud phase; mass offers; DNH; scheduling; knock-outs; audit trail; marketing default", "1.0–1.4", "See thematic report"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.1,
        "width_inches": 9.3,
        "height_inches": 2.85,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Full twelve-row backlog stays in markdown report for portfolio forums.\n\nReferences:\n• research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md",
})

slides.append({"master_index": MI, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
