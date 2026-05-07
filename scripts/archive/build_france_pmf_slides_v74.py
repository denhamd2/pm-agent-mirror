#!/usr/bin/env python3
"""One-off generator for France PMF slides_spec_v74.json."""
import json
from pathlib import Path


def tb(x, y, w, h, **kwargs):
    d = {"left_inches": x, "top_inches": y, "width_inches": w, "height_inches": h, "font_name": "Archivo", "color": "ink"}
    d.update(kwargs)
    return d


def section_slide(num, name):
    return {
        "master_index": 1,
        "layout_name": "Section Title",
        "text_boxes": [tb(3.3, 1.5, 5.6, 2.2, font_size_pt=12, text=f"S E C T I O N  {num}\n{name}")],
    }


def title_only(title, paragraphs, alt=False, notes=""):
    slide = {
        "master_index": 1,
        "layout_name": "Title Only_Alt" if alt else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb(0.7, 1.2, 8.6, 2.8, font_size_pt=14, paragraphs=paragraphs)],
    }
    if notes:
        slide["speaker_notes"] = notes
    return slide


def pestel_slide(factor, bullets, implication_text, notes):
    paras = [{"level": 1, "text": b} for b in bullets]
    paras.append({
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": implication_text, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    })
    return {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": factor}},
        "text_boxes": [tb(0.7, 1.2, 8.6, 2.8, font_size_pt=12, paragraphs=paras)],
        "speaker_notes": notes,
    }


def swot_cell(texts):
    return {"paragraphs": [{"level": 1, "text": t} for t in texts]}


def rec_slide(n, title, parts, alt=False):
    paras = []
    for heading, body in parts:
        paras.append({"level": 0, "text": [{"text": heading, "bold": True, "font_size_pt": 14}]})
        if isinstance(body, list):
            for b in body:
                paras.append({"level": 1, "text": b})
        else:
            paras.append({"level": 1, "text": body})
    return title_only(f"Recommendation {n}: {title}", paras, alt=alt, notes="• Five-part structure per 130.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md")


def main():
    slides = []

    slides.append({
        "master_index": 1,
        "layout_name": "TITLE",
        "placeholders": {
            "0": {"text": "France Recruiting Product-Market Fit Research"},
            "1": {"text": "March 2026"},
        },
    })

    slides.append({
        "master_index": 1,
        "layout_name": "Section Title",
        "text_boxes": [
            tb(3.7, 0.4, 3.8, 0.4, font_size_pt=20, bold=True, text="Agenda"),
            tb(4.2, 1.0, 5.0, 4.0, font_size_pt=14, text=(
                "1. Executive summary\n\n2. Research challenge\n\n3. Strategic context\n\n"
                "4. Product strategy\n\n5. PESTEL\n\n6. Competitive landscape\n\n7. Win / loss\n\n"
                "8. Ideation hub\n\n9. Primary research\n\n10. Thematic analysis\n\n"
                "11. Gap analysis\n\n12. Roadmap recommendations"
            )),
        ],
    })

    slides.append(section_slide("0 1", "Executive summary"))
    slides.append(title_only("Executive Summary", [
        {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "France qualitative depth is thin this cycle: no customer or internal SME interview transcripts were available, so themes lean on presales gaps (two France rows), structured competitive intelligence, and macro-regulatory research. Confidence on recruiter-verbatim pain is discounted until a France interview programme lands."},
        {"level": 1, "text": "Competitive pressure stays acute: Cegid, Beetween, and Flatchr stress French-first UX, high board-count multidiffusion, and packaged AI; SAP plus SmartRecruiters and Oracle Booster set enterprise bars on connected HCM and omnichannel messaging including WhatsApp in competitor materials."},
        {"level": 1, "text": "Regulation is the differentiation spine: GDPR, CNIL enforcement intensity, EU AI Act Annex III high-risk recruitment AI with August 2026 milestones, pay transparency transposition, and CSE consultation on recruitment policy shape what credible enterprise demos must prove."},
        {"level": 1, "text": "Presales signal is directional but sharp: Severity 2 pressure on job postings in France Services Tech Media and Severity 3 on offers and contracts with French labour practice plus EU data residency language in France MFG HC and Edu."},
        {"level": 1, "text": "Roadmap emphasis: governed AI and SKU clarity, Paradox activation for scheduling honesty, France offer localisation, multidiffusion defence with Broadbean proof, and an explicit qualitative research programme to rebalance confidence."},
    ], notes="• Stress evidence mix before deep dives.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md\n• research/France/strategy-context-2026-03-28-FR-E2E-002.md"))

    slides.append(section_slide("0 2", "Research challenge"))
    slides.append(title_only("Research Question and Objectives", [
        {"level": 1, "text": "Assess France enterprise recruiting product-market fit for Workday Recruiting using macro context, competitive positioning, presales gaps, and statutory themes when primary France transcripts are absent."},
        {"level": 1, "text": "Prioritise roadmap-ready actions that align to Q2 Talent Acquisition priorities: AI matching with governance, core ATS parity, and honest channel and board-coverage narratives versus French specialists and ERP-attached suites."},
        {"level": 1, "text": "Produce an executive-ready view of regulatory and works-council implications that affect requisition design, hiring AI, pay transparency fields, and audit artefacts customers need for CSE packs."},
        {"level": 1, "text": "Flag competitive true gaps that create RFP risk (native WhatsApp in core UI, semantic AI without add-on SKUs, Paradox-grade conversational scheduling) and pair each with enablement or activation paths."},
    ], alt=True, notes="• Do not imply large-scale qualitative coding was possible.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md"))

    slides.append(section_slide("0 3", "Strategic context"))
    slides.append(title_only("Strategic Context - Why France Now", [
        {"level": 1, "text": "France remains a bellwether EU recruiting market where buyers bundle statutory hire-to-pay expectations with cloud trust, SecNumCloud-flavoured RFP language, and aggressive privacy enforcement; weak compliance storytelling loses enterprise shortlists even when core ATS is strong."},
        {"level": 1, "text": "Works council governance at fifty-plus employees forces recurrent consultation on recruitment policy, training, equality, and contract mix; vendors win when reporting and workforce metrics drop cleanly into customer consultation packs without spreadsheet heroics."},
        {"level": 1, "text": "EU AI Act timing concentrates executive attention on human oversight, logging, and deployer transparency for hiring AI; France sits inside the same Annex III high-risk recruitment framing as wider EMEA, so AI demos without governance depth create procurement and legal scrutiny."},
        {"level": 1, "text": "Multinational France headquarters anchor GCC, APAC, and Americas hiring policy, so France decisions often influence global channel policy, data residency posture, and template standards even when local WhatsApp intensity is below Southern Europe."},
    ], notes="• Tie to CSE and AI Act calendar when presenting live.\n\nReferences:\n• research/France/pestel-analysis-France-2026-03-28-FR-E2E-002.md"))

    slides.append(title_only("France Market Momentum - Key Indicators", [
        {"level": 1, "text": "European HR technology market sizing narratives cluster around roughly USD 4.5 to 4.9 billion for 2024 to 2025 with about 7.6 percent CAGR into the early 2030s; France sits among the largest country clusters with Germany, the UK, and Spain."},
        {"level": 1, "text": "French GDP growth forecasts for 2026 sit near 0.9 to 1.0 percent across Banque de France, OECD euro-area materials, and IMF summary bands, implying continued licence scrutiny and demand for provable ROI on talent suites."},
        {"level": 1, "text": "INSEE reported ILO unemployment at 7.9 percent in Q4 2025 with youth unemployment at 21.5 percent; hiring tension eased from post-COVID peaks, so efficiency, compliance risk reduction, and bundled suite value replace pure growth hiring as buyer narratives."},
        {"level": 1, "text": "Digital adoption is very high: DataReportal Digital 2026 France cites 95.2 percent internet penetration, 116 percent mobile connection rate versus population (multi-SIM), and median mobile download speeds near 131 Mbps in August 2025 rolling windows."},
        {"level": 1, "text": "Hybrid work is embedded: INSEE H1 2024 reference shows over 22 percent of private-sector employees telework regularly; LinkedIn-derived figures quoted in industry summaries place about 29.7 percent of French job postings as hybrid in 2024 methodology-dependent samples."},
    ], alt=True, notes="• Use as macro guardrails, not a market sizing claim for Workday revenue.\n\nReferences:\n• research/France/pestel-analysis-France-2026-03-28-FR-E2E-002.md\n• https://www.insee.fr/en/statistiques/8736808"))

    slides.append(section_slide("0 4", "Product strategy"))
    slides.append(title_only("Q2 2026 Product Priorities", [
        {"level": 0, "text": [{"text": "France-first lens", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "France is a medium strategic priority in the Q2 table: major EU enterprise market where EU AI Act and GDPR-class trust decide deals even without a discrete France win count; lead with compliance-first AI matching, core ATS parity, and hire-to-pay coherence."},
        {"level": 0, "text": [{"text": "Corporate priorities with France hooks", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "AI candidate matching: activate HiredScore and governed Workday AI with human review, logging, and deployer transparency; France deals treat Annex III recruitment AI as board-level risk, not a feature checkbox."},
        {"level": 1, "text": "Core ATS parity: bulk grid, mobile recruiter workflows, integrations, and Paradox activation to reduce scheduling objections; pairs with France presales offers friction and competitor demo pressure."},
        {"level": 1, "text": "GCC market readiness stays corporate Priority 1 for win count; French multinationals with GCC entities still need consistent global policy stories on channels and compliance even when France is not the expansion headline."},
    ], notes="• Align to product-priorities-q2-2026.md via strategy context file.\n\nReferences:\n• research/France/strategy-context-2026-03-28-FR-E2E-002.md"))

    slides.append(title_only("Regional Expansion Strategy", [
        {"level": 1, "text": "France: medium priority for EU regulatory depth, statutory recruiting workflows, and suite differentiation versus French ATS specialists; no discrete Q2 win target in the corporate table, but NPS and enterprise retention still ride on France quality."},
        {"level": 1, "text": "GCC: high corporate priority with ten new customer wins targeted; informs global messaging on WhatsApp, nationalisation, and Arabic experiences that French HQ buyers may audit for group policy."},
        {"level": 1, "text": "Japan and India: medium priority expansions with country-specific statutory and privacy stories; useful analogy for how Workday packages complex hiring flows under one data model."},
        {"level": 1, "text": "Australia: medium priority with Fair Work and SEEK-adjacent expectations; reinforces APAC board coverage conversations that also appear in France via Broadbean."},
    ], alt=True))

    slides.append(title_only("Competitive Positioning - Differentiation", [
        {"level": 1, "text": "Suite depth: unified HCM, Recruiting, Talent, and Learning versus point ATS; France payroll and DPAE adjacency when Payroll is deployed supports hire-to-pay proof in RFP scoring."},
        {"level": 1, "text": "AI-powered differentiation when activated: HiredScore and Paradox address semantic matching and conversational scheduling pressure, provided EU AI Act transparency and human-in-the-loop are explicit in demos and collateral."},
        {"level": 1, "text": "Compliance-first posture: GDPR automation, retention and purge tooling, subprocessors transparency, and Schrems-ready transfer narratives answer CNIL-sensitive buyers and large digital-economy sanction risk context."},
        {"level": 1, "text": "Enterprise scale: security model, global rollout patterns, and Fortune-scale references counter mid-market velocity stories from French specialists when procurement weights control and auditability."},
    ], notes="• Pair with honest gap slides later to protect credibility.\n\nReferences:\n• research/France/strategy-context-2026-03-28-FR-E2E-002.md"))

    slides.append(section_slide("0 5", "PESTEL"))

    pol_bullets = [
        "French employment institutions centre on the Code du travail and EU labour law layers; recruitment sits inside travail policy debates covering youth unemployment, pension reform after-effects on labour supply, and regional experiments such as condensed four-day public-sector patterns that still respect annual hour rules. Anchors include Legifrance decree 2025-539 of 13 June 2025 adjusting talent residence-card categories and recurring salary threshold updates for Passeport Talent-style routes in the mid- to high-tens of thousands of euros annually depending on category.",
        "Works councils and information rights bite at fifty-plus employees where a Comite Social et Economique must be informed and consulted on politique sociale covering recruitment policy, fixed-term and temporary use, training, professional equality, and disability employment actions, often on an annual cadence unless collective agreements extend intervals. Employers typically support packs with a base de donnees economiques, sociales et environnementales including workforce and training indicators, which turns HR technology changes into auditable workforce evidence rather than informal process tweaks.",
        "Anti-discrimination law mandates job-related assessment, documented evaluation methods, and confidential handling of results; this statutory frame rewards structured hiring workflows, standardised criteria, and minimal nice-to-have data collection in application schemas. ICLG Employment and Labour France summaries and the official Code du travail embauche theme pages anchor the obligation set recruiters must mirror in system configuration.",
        "Immigration and skilled hiring remain active policy levers with frequent threshold updates; global employers hiring into France need requisition templates, visa status fields, and partner-aligned processes without the product implying legal advice. Public summaries tied to 2026 policy shifts reference stepped salary bands for key non-EU categories aligned to SMIC and category rules.",
        "Interim and temporary agency reforms in 2025 emphasise equal treatment, training, and longer permissible mission durations in selected cases, increasing contingent and agency hiring volume tracked inside core HCM and recruiting suites. That political choice expands the population of non-permanent hires whose sourcing, compliance, and conversion paths must be visible alongside permanent reqs.",
    ]
    pol_imp = (
        "Workday Recruiting should expose workforce and recruiting metrics French customers can reuse in CSE consultation packs across headcount, contract mix, training, and equality indicators; keep candidate data collection tightly tied to role requirements to respect Article L1221-6 purpose limitation; support global mobility fields for Passeport Talent categories without encouraging non-compliant data practices. Legal review remains essential for customer-specific claims."
    )
    slides.append(pestel_slide("Political", pol_bullets, pol_imp, "• If challenged on CSE scope, cite official fiche and customer counsel.\n\nReferences:\n• https://code.travail.gouv.fr/fiche-ministere-travail/cse-information-et-consultation\n• https://iclg.com/practice-areas/employment-and-labour-laws-and-regulations/france"))

    econ_bullets = [
        "Europe HR technology market aggregators size the continent at roughly USD 4.47 to 4.86 billion in 2024 to 2025 with CAGR near 7.6 percent into the 2030s, placing France inside the largest country clusters alongside Germany, the UK, and Spain. Market Data Forecast and IMARC-style Europe HR technology summaries provide the currency anchor and horizon framing buyers use when comparing suite TCO to best-of-breed ATS stacks.",
        "Banque de France March 2026 macroeconomic interim projections place 2026 French GDP growth near 0.9 percent in a baseline scenario with lower outcomes under stress paths tied to energy prices; OECD March 2026 euro-area materials ease growth to about 0.8 percent in 2026, while IMF January 2026 update materials cite about 1.0 percent for France, giving a tight band for executive planning.",
        "INSEE Q4 2025 labour market release shows ILO unemployment at 7.9 percent, about 2.5 million people, the highest rate since Q3 2021 but far below mid-2010s peaks; youth unemployment for ages fifteen to twenty-four jumped to 21.5 percent in the same quarter, signalling persistent entry-labour friction that shapes high-volume hiring programmes and public-sector workforce plans.",
        "Indeed Hiring Lab France and late-2025 French press summaries note job postings still above pre-crisis levels but down year-on-year, with recruitment tension easing from 2022 peaks so only a minority of firms still report acute hiring difficulty compared with the post-COVID spike. That mix pushes buyers toward efficiency plays, automation, and compliance risk reduction rather than pure expansion hiring budgets.",
        "France hosts a deep SAP enterprise footprint with third-party trackers listing hundreds of documented SuccessFactors adopters; Workday shows strongly in global HCM share league tables, yet France win-loss stays sensitive to local compliance narrative, partner implementation capacity, and suite bundling dynamics that economic softness amplifies during renewal cycles.",
    ]
    econ_imp = (
        "Economic headwinds and easing recruitment pressure push buyers toward provable ROI, bundled talent suite value, and automation; Workday should lean on measurable time-to-hire and compliance risk reduction in France while maintaining enterprise-grade local packs across reporting, templates, and pay transparency that defend against suite incumbents in RFP cycles. Discount-led mid-market flanking remains a competitive risk to monitor."
    )
    slides.append(pestel_slide("Economic", econ_bullets, econ_imp, "• Pair GDP band with customer-specific pipeline stories.\n\nReferences:\n• https://www.insee.fr/en/statistiques/8736808\n• https://www.banque-france.fr/en/publications-and-statistics/publications/macroeconomic-interim-projections-march-2026"))

    soc_bullets = [
        "DataReportal Digital 2026 France, with data to late 2025, reports about 63.4 million internet users, 95.2 percent population penetration, 77.3 million mobile cellular connections representing 116 percent of population including multi-SIM effects, and about 99.5 percent of connections as 3G, 4G, or 5G capable in industry figures bundled in the same report, though not every line is a smartphone data user.",
        "Social platform reach sits at about 51.5 million user identities, 77.2 percent of population, with 81.2 percent of internet users on at least one social platform; median fixed download speed is about 308 Mbps and median mobile download about 131 Mbps in Ookla-derived August 2025 rolling windows cited via DataReportal, underpinning mobile-first career site expectations.",
        "WhatsApp is widely used but France under-indexes versus Southern Europe; Statista aggregation pages citing Q3 2024 panels placed WhatsApp around two-thirds of internet users in France, materially below higher shares in Spain or Italy, so enterprise candidate comms still standardise on email, SMS, and in-portal messaging with WhatsApp more common in retail, logistics, and frontline hiring than in white-collar corporate recruiting.",
        "LinkedIn remains the default professional graph for many graduate and corporate roles, while YouTube reach mirrors overall social figures in advertising-planning data; hybrid work is embedded with INSEE March 2025 analysis reporting over 22 percent of private-sector employees regularly teleworked in H1 2024 versus about 4 percent pre-pandemic, and surveys in French HR media often settle near two remote days per week where telework is formalised.",
        "LinkedIn Economic Graph materials from 2024 cited in industry summaries place about 29.7 percent of French job postings as hybrid versus about 2.7 percent fully remote under label-based methodology, which shifts how career sites, interview logistics, and relocation policies must read inside recruiting workflows.",
    ]
    soc_imp = (
        "Workday Recruiting should prioritise mobile-first career sites, strong email and SMS orchestration, and optional WhatsApp where customers enable it, without assuming WhatsApp-primary behaviour for all French segments; LinkedIn-integrated sourcing and apply flows remain table stakes for corporate hiring while hybrid job post labels need consistent requisition metadata for reporting."
    )
    slides.append(pestel_slide("Social", soc_bullets, soc_imp, "• Avoid GCC-style WhatsApp generalisation for France corporate segments.\n\nReferences:\n• https://datareportal.com/reports/digital-2026-france\n• https://www.insee.fr/en/statistiques/8382496"))

    tech_bullets = [
        "IDC European cloud and managed services commentary across 2024 to 2026 highlights positive cloud spending intent, hybrid architectures, and AI preparation as top drivers, with AI platform evaluations increasingly weighting data protection, cost governance, and compliance auditing alongside raw model capability. French public-sector and regulated industries amplify sovereignty language that shows up in RFP scoring even when technical architecture stays standard SaaS.",
        "ANSSI SecNumCloud qualification covers IaaS, PaaS, and SaaS models with three-year qualification cycles and annual surveillance; multiple French hyperscale and integrator-led offerings target qualification while EUCS harmonisation proceeds under the EU Cybersecurity Act, pushing multinational vendors toward transparent data maps, EU region options, and customer-ready assurance packs rather than bespoke on-premise ATS builds.",
        "McKinsey State of AI 2025 materials stress widespread experimentation but limited scaled deployment in many functions; France-specific survey percentages vary, yet enterprise caution runs higher than North America, concentrating investment on logging, documentation, and human oversight rather than novelty demos alone.",
        "EU AI Act timing with August 2026 practitioner attention for many high-risk deployer obligations keeps CIO and DPO stakeholders in hiring AI purchases even when product teams want faster feature cadence; Digital Omnibus debate may adjust some procedural timing but not fundamental rights expectations for recruitment AI.",
        "France job-board long tail coverage remains partner-led through aggregators such as Broadbean in the Workday ecosystem rather than native long-tail board builds; background checks and assessment vendors still require DPA-ready integrations and subprocessors transparency in French buyer security reviews.",
    ]
    tech_imp = (
        "Workday should surface AI governance hooks such as audit trails, role-based model use, and human decision checkpoints that map to EU AI Act expectations; maintain EU data residency paths and clear subprocessors documentation for SecNumCloud-sensitive buyers; preserve API-first extensibility for French HR services partners and board aggregators."
    )
    slides.append(pestel_slide("Technological", tech_bullets, tech_imp, "• Name SecNumCloud as narrative risk, not automatic product mandate.\n\nReferences:\n• https://cyber.gouv.fr/secnumcloud\n• https://www.mckinsey.com/capabilities/quantumblack/our-insights"))

    env_bullets = [
        "French official sustainable-development statistics describe about 1.2 million FTE in the economie verte in 2022, near 4 percent of jobs, with strong growth in eco-activities since the mid-2000s; ADEME transition briefings highlight hundreds of thousands of jobs linked to energy-transition value chains and tens of billions of euros of market scale across renewables, buildings, and mobility in recent-year snapshots.",
        "A 2025 statistical synthesis notes about 361,000 people in environmentally oriented jobs in 2024 under a narrower definition, giving recruiters a measurable green-jobs lens for workforce planning and sectoral hiring dashboards rather than a vague sustainability slogan.",
        "Corporate Sustainability Reporting Directive implementation extends non-financial reporting for large undertakings; ESRS S1 covers own workforce topics including working conditions, equality, and training that intersect HR systems, while France transposition interacts with EU stop-the-clock delays yet still broadens reporting populations over 2025 to 2029 in commentator expectations.",
        "Recruiting products are not the system of record for every ESRS field, yet hiring analytics on diversity of applicants, time-to-fill in green sectors, and conversion across transition roles feeds customer sustainability narratives that increasingly appear in French enterprise annual reports and investor decks.",
        "DATA GAP nuance: ATS carbon footprint mechanics are rarely deal-breaking in France RFPs today; strongest product fit is skills ontology, job-family tagging, and analytics exports that hand off cleanly to HCM analytics teams running CSRD workforce workstreams.",
    ]
    env_imp = (
        "Workday Recruiting should support skills and job-family tagging mappable to green roles and transition projects, and ensure analytics exports align with CSRD workforce workstreams owned by HCM analytics so French enterprise buyers narrate sustainability hiring without manual spreadsheet rework. Environmental reporting remains secondary to statutory hiring compliance but rising in workforce disclosure."
    )
    slides.append(pestel_slide("Environmental", env_bullets, env_imp, "• Keep green-jobs content tied to customer sustainability offices.\n\nReferences:\n• https://www.statistiques.developpement-durable.gouv.fr/emplois-et-metiers-de-leconomie-verte-synthese-des-connaissances-en-2024"))

    legal_bullets = [
        "France applies GDPR as incorporated with the Loi Informatique et Libertes; CNIL leads supervision with recruitment-specific guidance and self-assessment tooling that stresses limited purposes, proportionate questions, and subprocessors transparency. Key articles for recruiting include Article 5 principles, Article 6 lawful basis debates where CNIL stresses consent is often inappropriate in employer-candidate imbalance, Article 9 special categories, Articles 13 to 14 transparency, Article 17 erasure, Article 20 portability, Article 22 solely automated decision safeguards, Article 35 DPIA for high-risk processing, Articles 44 to 50 transfers with Schrems II and 2021-plus Standard Contractual Clauses, and Article 83 fines up to EUR 20 million or 4 percent of global turnover.",
        "CNIL enforcement in 2025 reached record annual sanction totals in the hundreds of millions of euros across large digital-economy cases including cookie and advertising technology alongside security and breach matters; early 2026 saw a major telecom-sector breach sanction in the tens of millions of euros band for Articles 32, 34, and 5(1)(e) failures, signalling aggressive enforcement and high financial exposure for poor security and transparency.",
        "EU Artificial Intelligence Act Regulation 2024/1689 classifies recruitment and selection AI that analyses or filters applications and evaluates candidates as high-risk under Annex III point 4(a) when listed and not excluded under Article 6(3) carve-outs, imposing risk management, data governance, technical documentation, record-keeping, deployer transparency, human oversight, accuracy, cybersecurity, and eventual EU database registration expectations for many deployers with August 2026 practitioner focus.",
        "Labour-side recruiting rules include Article L1221-6 Code du travail purpose limitation to professional aptitude assessment, broad non-discrimination grounds, criminal record bulletin numero trois only when justified by role with tight retention guidance often citing destruction within about two months after decision in practitioner materials, and Directive EU 2023/970 pay transparency requirements for salary information in job adverts, limits on salary history questions, and gender pay gap reporting with France draft transposition commentary in March 2026 describing stricter thresholds than the EU baseline in some law-firm summaries.",
        "Transfers outside the EEA rely on Schrems II diligence and supplementary measures; CNIL has historically been vocal on US surveillance risk, so candidate and employee data maps, TIA posture, and DPA schedules remain renewal-time scrutiny points for US-hosted SaaS architectures serving French employers.",
    ]
    legal_imp = (
        "Workday Recruiting must ship GDPR-aligned defaults for French customers across lawful-basis documentation, minimal application schemas, retention and purge, transparent subprocessors, portable candidate exports, and Schrems-ready DPA and TIA narratives; for hiring AI, enforce human review before adverse decisions, candidate disclosure, bias monitoring hooks, logging for accountability, and pay transparency field patterns aligned to Directive EU 2023/970 transposition. Legal review stays essential for customer-specific implementations and claims."
    )
    slides.append(pestel_slide("Legal", legal_bullets, legal_imp, "• Never present this slide as legal advice.\n\nReferences:\n• https://gdpr-info.eu/art-22-gdpr/\n• https://artificialintelligenceact.eu/annex/3/\n• https://www.cnil.fr/en/entry-force-european-ai-regulation-first-questions-and-answers-cnil"))

    slides.append(section_slide("0 6", "Competitive landscape"))
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Regional Specialists - France"}},
        "tables": [{
            "rows": [
                ["Vendor", "Key Strengths", "Key Weaknesses", "France Fit", "Notes"],
                ["Cegid Digitalrecruiters", "ATS plus CRM for multi-site employers; AI CV analysis and scoring; HR marketing across email, SMS, QR, and ads; vendor claims 3,500 plus boards one-click and interview scheduling with calendar sync", "Suite depth versus full HCM plus payroll story; enterprise security and global scale vary by segment; board-count marketing needs factual validation in RFPs", "Strong for French-first UX and multidiffusion marketing", "Regional champion; compare on governed data model and statutory hire-to-pay"],
                ["Beetween", "Customisable ATS; multidiffusion with 180 plus boards per French site claims; career site, referrals, sourcing; SMS, video, AI chatbot; AI matching on database; Google for Jobs-oriented posting structure", "Mid-market positioning versus Fortune-scale security and global process; integration depth into complex HCM processes can trail suite vendors", "Strong for PME and mid-market velocity", "Price and time-to-value pressure versus enterprise suite deals"],
                ["Flatchr", "Hiring-manager and field-centric ATS; 160 plus boards one-click per marketing; automation of relances and planning; HR Technologies France 2026 exhibitor visibility", "Narrower global footprint; reporting and enterprise governance depth versus unified suite", "Strong for distributed hiring managers", "Simplicity wins until requirements exceed ATS-only scope"],
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
        "speaker_notes": "• Use semicolon-separated cells; no bullets inside table cells.\n\nReferences:\n• research/competitive/matrices/fr-competitive-matrix.md",
    })

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Global Platforms - France"}},
        "tables": [{
            "rows": [
                ["Vendor", "Key Strengths", "Key Weaknesses", "France Fit", "Notes"],
                ["SAP SuccessFactors plus SmartRecruiters", "2026 narrative of single login and unified hiring experience; Joule and Winston AI roadmap attention; deep ERP-attached installed base in France", "Integration and licensing complexity; perception risk until unified story is tangible in live demos", "High in ERP-aligned enterprise shortlists", "Benchmark connected HCM story for RFP scoring"],
                ["Oracle Fusion Recruiting plus Booster", "Omnichannel candidate messaging including WhatsApp in product documentation; 26A readiness materials; strong enterprise benchmark in EMEA", "Implementation and licensing friction; messaging must be validated against live tenant entitlements", "High where omnichannel candidate experience is scored", "True gap pressure on native WhatsApp in Workday core UI must be handled honestly"],
                ["Workday Recruiting", "Unified HCM plus Recruiting plus Talent; GDPR-class automation; French UI; mobile and bulk native per France DA table; DPAE and Payroll France when Payroll deployed; Broadbean multidiffusion partner path", "True gaps on native WhatsApp in core UI, semantic AI without SKUs, Paradox-grade conversational scheduling per DA-FR002; SMS classified workaround in latest DA pass pending PS reconciliation", "Strong for enterprise France with payroll in scope", "Lead with suite, auditability, and governed AI when SKUs active"],
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
        "speaker_notes": "• Refresh battle cards after each 101 scan.\n\nReferences:\n• research/competitive/fr/fr-competitive-scan-2026-03-28-FR-E2E-002.md",
    })

    swot_rows = [
        ["Strengths", "Weaknesses"],
        [
            swot_cell([
                "Suite integration and France statutory adjacency with Payroll and DPAE when deployed",
                "GDPR-class privacy automation plus French localisation when configured well",
                "Native SMS narrative in prior DA pass; latest DA-FR002 flags workaround pending PS reconciliation",
                "HiredScore and Paradox differentiation when activated with governance design",
                "Broadbean-governed multidiffusion versus raw board-count marketing",
            ]),
            swot_cell([
                "Native WhatsApp in core Recruiting UI remains a true gap versus Oracle Booster narrative",
                "Semantic AI matching without HiredScore, Skills Cloud AI, or Workday AI is a true gap",
                "Multidiffusion without Broadbean-class partner is a workaround with RFP pressure",
                "Paradox-grade conversational scheduling is true gap per DA-FR002 while native scheduling exists",
                "France primary qualitative research is an evidence gap not a product gap",
            ]),
        ],
        ["Opportunities", "Threats"],
        [
            swot_cell([
                "EU AI Act Annex III timing positions governed hiring AI as trust differentiator",
                "CNIL enforcement climate strengthens native purge, retention, and transparency stories",
                "Pay transparency directive transposition elevates requisition and application field design",
                "CSE and BDESE expectations reward workforce metrics exports from the suite",
                "Core ATS parity priority supports bulk, mobile, scheduling, and integrations wins",
                "SecNumCloud and EU trust narratives elevate vendors with clear EU data paths",
            ]),
            swot_cell([
                "French ATS champions bundle speed, multidiffusion depth, and AI UX at mid-market price points",
                "SAP plus SmartRecruiters 2026 integration story sharpens connected HCM benchmark",
                "Oracle omnichannel and WhatsApp-class messaging amplifies true gap pressure",
                "Compliance engineering load rises with AI Act database and French implementation details",
                "Macro softness with 7.9 percent unemployment and sub-1 percent 2026 GDP bands tightens budgets",
                "Fragmented market noise with roughly 147 ATS-class solutions referenced in trade press confuses enterprise shortlists",
            ]),
        ],
    ]

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Competitive SWOT - France"}},
        "tables": [{
            "rows": swot_rows,
            "top_inches": 1.0,
            "font_size_pt": 9,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        }],
        "speaker_notes": "• Single two-by-two table per deck standards.\n\nReferences:\n• research/France/swot-analysis-France-2026-03-28-FR-E2E-002.md",
    })

    slides.append(section_slide("0 7", "Win / Loss"))
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win/Loss - Top Gap Themes"}},
        "tables": [{
            "rows": [
                ["Theme", "Severity", "Buyer evidence", "Product implication"],
                ["Job postings and board narrative", "Severity 2 SKU risk", "PG-90001003 in France Services Tech Media; presales flagged risk of SKU removal from deal", "Build multidiffence kit with Broadbean coverage proof, source analytics, and discovery questions that separate partner-governed reach from raw board counts"],
                ["Offers and contracts - France labour", "Severity 3 deal loss risk", "PG-90001001 in France MFG HC and Edu; pain text cites offer templates aligned to French labour practice plus EU data residency detail", "Prioritise France offer and contract localisation pack with counsel-reviewed residency language"],
                ["Omnichannel and scheduling", "Proxy from competitive DA table", "Oracle Booster WhatsApp positioning and Paradox-grade scheduling true gap in DA-FR002", "Run Paradox activation playbook and honest WhatsApp gap response with partner map and TCO"],
                ["Hiring AI governance", "Strategic", "Annex III high-risk recruitment AI and buyer expectations on logging and human review", "Package HiredScore and Workday AI with human-in-the-loop artefacts and deployer transparency"],
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
        "speaker_notes": "• Severity is buyer-reported from presales export; validate with 101 Native or Workaround or True Gap.\n\nReferences:\n• research/France/gap-analysis/2026-03-28-gap-analysis-FR-E2E-002.md",
    })

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Win/Loss - Gap Theme Chart"}},
        "charts": [{
            "chart_type": "bar",
            "categories": ["Job postings", "Offers & contracts", "Scheduling gap", "Hiring AI"],
            "series": [{"name": "Relative weight", "values": [2.0, 3.0, 2.5, 2.8]}],
            "title": "France presales and CI themes",
            "left_inches": 0.7,
            "top_inches": 1.45,
            "width_inches": 9.0,
            "height_inches": 3.2,
            "has_legend": False,
            "category_axis_font_size_pt": 9,
            "value_axis_font_size_pt": 9,
            "title_font_size_pt": 10,
        }],
        "text_boxes": [tb(0.7, 4.75, 8.6, 0.7, font_size_pt=12, paragraphs=[
            {"level": 1, "text": "Chart uses illustrative severity-weighted scale combining presales severities with competitive pressure indices; it is directional, not a CRM census."},
        ])],
        "speaker_notes": "• Explain small-n presales sample honestly.\n\nReferences:\n• research/France/gap-analysis/2026-03-28-gap-analysis-FR-E2E-002.md",
    })

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "France and EMEA Proxy Gaps"}},
        "tables": [{
            "rows": [
                ["Gap", "France signal", "EMEA proxy", "Next validation"],
                ["Native WhatsApp core UI", "Competitive RFP pressure; social data shows WhatsApp under-index versus Southern Europe but not absent", "Oracle omnichannel demos across EMEA", "PS plus enablement single source of truth"],
                ["Semantic AI without SKUs", "French vendors market packaged AI on CVs", "EU AI Act scrutiny everywhere in EMEA", "SKU clarity and governance collateral"],
                ["Multidiffusion", "108 job postings row plus competitor board counts", "UK and DACH long-tail board debates", "Broadbean coverage workshops per account"],
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
        "speaker_notes": "• Position as hypothesis until more France rows arrive.\n\nReferences:\n• research/competitive/matrices/fr-competitive-matrix.md",
    })

    slides.append(section_slide("0 8", "Ideation hub"))
    slides.append(title_only("Ideation Hub - Data Availability", [
        {"level": 1, "text": "No Customer Ideation Hub CSV or brainstorm session export was ingested for FR-E2E-002; the brainstorm-sessions folder contained no source files for this mission, so quantitative idea counts and capability histograms are not available."},
        {"level": 1, "text": "Substitute signals for ideation-style volume come from the presales gap export filtered to France Talent Acquisition rows and from competitive scan themes on AI, multidiffusion, and omnichannel messaging."},
        {"level": 1, "text": "Next step is to run a structured internal ideation export or workshop capture into brainstorm-sessions, then re-run synthesis so France decks include the standard three ideation quant slides."},
    ], notes="• Transparent DATA GAP slide per v65 class coverage.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md"))

    slides.append(title_only("Ideation Hub - Capability Signals", [
        {"level": 1, "text": "Top presales capability tags in the thin France slice point to Job Postings and Offers and Contracts rather than a broad multi-theme spread; treat this as a micro-sample, not a full market census."},
        {"level": 1, "text": "Competitive marketing emphasises board-count multidiffusion, manager self-serve, and AI-assisted CV workflows, which would likely dominate ideation buckets once exports exist."},
        {"level": 1, "text": "Recommended interim action: tag France feature requests in the standard ideation taxonomy so future decks can chart capability volumes consistently with GCC and India baselines."},
    ], alt=True))

    slides.append(title_only("Ideation Hub: Key Themes", [
        {"level": 0, "text": [{"text": "Multidiffusion-Pressure", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Buyers compare one-click board footprints; Workday answers through Broadbean governance and source analytics rather than raw count parity."},
        {"level": 1, "text": "Product implication: publish discovery questions and proof kits that reframe reach as quality, compliance, and measurable conversion."},
        {"level": 0, "text": [{"text": "Offer-Statutory-Depth", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "France labour practice alignment for offer artefacts shows up as Severity 3 presales risk in the filtered export."},
        {"level": 1, "text": "Product implication: template packs, implementation guidance, and counsel-aligned residency language."},
        {"level": 0, "text": [{"text": "AI-Trust-And-Oversight", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Annex III recruitment AI and CNIL climate push buyers toward explainable workflows; black-box AI marketing from specialists increases procurement scrutiny."},
        {"level": 1, "text": "Product implication: logging, human review gates, and deployer transparency for HiredScore and Workday AI."},
    ], notes="• Structured as Key Themes slide despite absent CSV.\n\nReferences:\n• research/France/gap-analysis/2026-03-28-gap-analysis-FR-E2E-002.md"))

    slides.append(title_only("Ideation Hub - Next Capture", [
        {"level": 1, "text": "Add France workshop notes or ideation exports under research/France/brainstorm-sessions as txt, csv, or xlsx to unlock standard overview, histogram, and verbatim theme slides on the next pipeline run."},
        {"level": 1, "text": "Until then, prioritise linking presales gap owners to product marketing for recurring France capability tagging."},
        {"level": 1, "text": "Mission FR-E2E-002 date 28 March 2026 baseline deck documents the DATA GAP explicitly for audit trail."},
    ], alt=True))

    slides.append(section_slide("0 9", "Primary research"))
    slides.append(title_only("1:1 Customer Interviews - France", [
        {"level": 1, "text": "Population: zero France enterprise customer transcripts were available in customer-transcripts for this mission; Step 8 research output attests the qualitative gap explicitly rather than substituting prior markdown."},
        {"level": 1, "text": "France relevance: analysis still targets French enterprise recruiting buyers, but evidence is indirect via presales gaps, competitive intelligence, and macro-regulatory research until interviews complete."},
        {"level": 1, "text": "Timing: research cycle March 2026 with FR-E2E-002 mission ID logged for reproducibility."},
        {"level": 1, "text": "Method: semi-structured interview guide remains the standard once participants are recruited; this deck records the absence of completed sessions."},
        {"level": 1, "text": "Triangulation: presales export PG-90001001 and PG-90001003, fr-competitive-matrix v1.2, DA-FR002 capability table, and PESTEL Legal and Political factors supply interim weighting."},
        {"level": 1, "text": "Limitation: Customer Impact and Confidence percentages in roadmap scoring stay discounted until fresh Step 7 and Step 8 passes repopulate qualitative evidence."},
    ], notes="• Do not invent quotes or P1 labels.\n\nReferences:\n• research/France/105-user-research-findings.md"))

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Interview Participants - Roster"}},
        "tables": [{
            "rows": [
                ["Participant", "Role", "Company", "Status"],
                ["Not yet fielded", "Target: TA leaders", "France enterprise", "Qualitative sample gap"],
                ["Planned", "Target: HRIS programme leads", "France HQ multinationals", "Recruitment in progress"],
                ["Planned", "Target: EB and sourcing leads", "High-volume France hiring", "Recruitment in progress"],
            ],
            "left_inches": 0.5,
            "top_inches": 1.2,
            "width_inches": 9.0,
            "font_size_pt": 9,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        }],
        "speaker_notes": "• Replace rows after 105 customer pass.\n\nReferences:\n• research/France/105-user-research-findings.md",
    })

    slides.append(title_only("France Qualitative Programme - Next", [
        {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Roadmap confidence and win-loss storytelling lack France-verbatim recruiter voice in this cycle, which weakens prioritisation debates that compete with anecdotal sales lore."},
        {"level": 0, "text": [{"text": "Plan", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Recruit six to eight France enterprise interviews across services, manufacturing, and public-sector-flavoured buyers; capture transcripts under research/France/customer-transcripts and rerun structured synthesis."},
        {"level": 1, "text": "Pair customer sessions with internal SME transcripts under research/France/internal-sme-transcripts to rebuild SME and customer columns in the triangulation matrix."},
        {"level": 0, "text": [{"text": "Success signal", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Updated PMF report with P1-style anonymised quotes, higher Confidence scores where themes converge, and reduced reliance on presales micro-samples alone."},
    ], notes="• Mirrors recommendation ten in handoff table narrative.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md"))

    slides.append(section_slide("1 0", "Thematic analysis"))
    slides.append(title_only("Validated Themes 1-3 (EU & Channels)", [
        {"level": 0, "text": [{"text": "EU trust and AI governance", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Key insight: Buyers expect high-risk hiring AI to ship with human review, logging, and transparency to deployers; matrix classifies semantic match without SKUs as a true gap."},
        {"level": 1, "text": "Business impact: Lost technical win on AI stories when competitors market fast black-box CV features without governance depth."},
        {"level": 1, "text": "Product implication: Lead with defensible AI activation, DPIA-style diligence hooks, and recruiter review gates."},
        {"level": 0, "text": [{"text": "Omnichannel and scheduling parity", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Key insight: Oracle and regional UX set omnichannel expectations; DA-FR002 lists native WhatsApp in core UI and Paradox-grade conversational scheduling as true gaps."},
        {"level": 1, "text": "Business impact: Demo scorecards that weight candidate messaging and self-serve scheduling tilt without Paradox and partner clarity."},
        {"level": 1, "text": "Product implication: Paradox activation plays, honest WhatsApp positioning, and PS-led SMS source-of-truth refresh."},
        {"level": 0, "text": [{"text": "France compliance artefacts", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Key insight: Presales row PG-90001001 ties offers to French labour practice and EU residency language; PESTEL adds pay transparency and CSE consultation."},
        {"level": 1, "text": "Business impact: Deal loss risk at Severity 3 in filtered export plus slower enterprise approvals when consultation packs lack metrics."},
        {"level": 1, "text": "Product implication: Offer localisation pack, pay transparency fields, and export-friendly workforce metrics."},
    ], alt=True, notes="• Three bullets per theme.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md"))

    slides.append(title_only("Validated Themes 4-5 (Economics)", [
        {"level": 0, "text": [{"text": "Multidiffusion and postings", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Key insight: Severity 2 presales row on job postings meets competitor board-count marketing; Broadbean is the scalable partner path."},
        {"level": 1, "text": "Business impact: SKU removal risk if buyers perceive inferior reach without discovery and analytics proof."},
        {"level": 1, "text": "Product implication: Multidiffusion defence kit tying PG-90001003 discovery to validated coverage and source analytics."},
        {"level": 0, "text": [{"text": "Suite differentiation and ROI", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Key insight: Slow GDP growth and elevated unemployment raise ROI scrutiny; suite hire-to-pay coherence beats ATS-only TCO debates when payroll is in footprint."},
        {"level": 1, "text": "Business impact: Renewals hinge on measurable efficiency and compliance risk reduction, not feature checklists alone."},
        {"level": 1, "text": "Product implication: Anchor demos on unified data model, statutory depth, security, and measurable time-to-fill improvements."},
    ], notes="• Keep themes grouped per v65 pacing.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md"))

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
        "tables": [{
            "rows": [
                ["Theme", "SME qual", "Customer qual", "Presales", "Competitive", "PMF impact"],
                ["EU AI governance", "N/A", "N/A", "Indirect", "Strong", "High"],
                ["Omnichannel scheduling", "N/A", "N/A", "None explicit", "Strong", "High"],
                ["France compliance", "N/A", "N/A", "PG-90001001", "Strong", "High"],
                ["Multidiffusion", "N/A", "N/A", "PG-90001003", "Strong", "Medium-high"],
                ["Suite ROI", "N/A", "N/A", "Low direct", "Strong", "Medium"],
            ],
            "left_inches": 0.3,
            "top_inches": 1.0,
            "width_inches": 9.4,
            "font_size_pt": 8,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        }],
        "speaker_notes": "• N/A reflects attested absence of transcripts, not missing analysis.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md",
    })

    slides.append(section_slide("1 1", "Full funnel"))
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Gap Analysis"}},
        "tables": [{
            "rows": [
                ["Stage", "Gap", "Severity", "Workaround", "Evidence", "Product implication"],
                ["Attract", "Multidiffusion and job posting narrative versus competitor board counts; presales Severity 2 SKU risk on postings in France Services Tech Media", "MEDIUM", "Broadbean partner multipost with coverage validation workshops; custom integrations for niche boards", "PG-90001003; fr-competitive-matrix v1.2", "Ship defence kit with analytics and discovery script"],
                ["Convert", "Candidate trust and transparency expectations under GDPR and pay transparency transposition for advert fields", "MEDIUM", "Configurable requisition templates; salary band fields; audit trails", "PESTEL Legal; Directive EU 2023/970 commentary", "Accelerate pay transparency-ready requisition patterns"],
                ["Screen", "Semantic AI match and ranking without HiredScore or Workday AI SKUs", "HIGH", "Activate governed AI SKUs; manual recruiter review workflows", "DA-FR002 true gap row; EU AI Act Annex III", "Package SKU clarity with human oversight demo"],
                ["Schedule", "Paradox-grade conversational self-service scheduling versus native scheduling limits", "HIGH", "Paradox activation; manual coordinator workflows", "DA-FR002 true gap; strategy Priority 3", "Standard France activation playbook and honest gap language"],
                ["Offer", "Offer templates aligned to French labour practice; EU data residency language in presales detail", "HIGH", "Configurable offer templates; partner legal review; DPA schedules", "PG-90001001 Severity 3", "France offer localisation pack with counsel review"],
                ["Comply", "CSE consultation expects auditable workforce and recruiting metrics in BDESE-style packs", "MEDIUM", "Custom reports; Prism Analytics; HCM exports", "PESTEL Political CSE rules", "Pre-built recruiting metrics templates for consultation"],
                ["Measure", "Proof of ROI under slow GDP growth and tight budgets", "MEDIUM", "Prism Analytics; dashboards; time-to-fill metrics", "PESTEL Economic 2026 GDP band", "Publish France reference benchmarks with governance"],
            ],
            "left_inches": 0.25,
            "top_inches": 1.0,
            "width_inches": 9.5,
            "font_size_pt": 7,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        }],
        "speaker_notes": (
            "• Gap severities synthesised from presales severities, DA-FR002 matrix, and PESTEL; batched Deployment Agent validation returned an error in-session—revalidate with PS and DA before commercial freeze.\n"
            "• Matrix thread reference: 72acf33b-3896-4144-a68f-6f58e89a95fe (DA-FR002).\n\n"
            "References:\n• research/competitive/matrices/fr-competitive-matrix.md\n• research/France/gap-analysis/2026-03-28-gap-analysis-FR-E2E-002.md"
        ),
    })

    slides.append(section_slide("1 2", "Roadmap"))

    slides.append(rec_slide(1, "EU AI hiring AI packaging", [
        ("Problem", "France and EMEA buyers treat hiring AI as high-risk under Annex III; semantic match without SKUs is a competitive true gap that shows up in RFP scorecards."),
        ("Evidence", ["Matrix and scan classify advanced semantic match without HiredScore, Skills Cloud AI, or Workday AI as true gap; strategy Priority 2 sets beta tenant targets for governed matching."]),
        ("Recommendation", "Ship human-in-the-loop patterns, recruiter review gates, logging, and deployer transparency artefacts bundled with SKU guidance for France sales cycles."),
        ("Why now", "August 2026 practitioner attention window for many high-risk obligations increases board-level scrutiny on recruitment AI purchases."),
        ("Success metrics", ["Beta tenants: 0 to 5 governed AI matching programmes; reduction in AI-related enterprise objections in France QBR samples (qualitative)."]),
    ]))

    slides.append(rec_slide(2, "Paradox scheduling activation", [
        ("Problem", "Conversational self-service scheduling is a true gap per DA-FR002 while competitors benchmark modern candidate experience."),
        ("Evidence", ["DA-FR002 Paradox-grade conversational scheduling true gap; strategy lists scheduling friction when Paradox is not activated."]),
        ("Recommendation", "Publish a standard France and EMEA activation playbook with honest capability boundaries when Paradox is not entitled."),
        ("Why now", "SAP plus SmartRecruiters and Oracle narratives raise scheduling and omnichannel expectations in enterprise demos."),
        ("Success metrics", ["Increase Paradox-attached France pursuits where scheduling is scored; fewer lost demos attributed to self-serve scheduling (track qualitatively)."]),
    ], alt=True))

    slides.append(rec_slide(3, "France offer localisation pack", [
        ("Problem", "Presales Severity 3 row cites offer templates aligned to French labour practice and EU data residency language."),
        ("Evidence", ["PG-90001001 in France MFG HC and Edu filtered export; PESTEL Legal pay transparency and criminal record handling context."]),
        ("Recommendation", "Deliver template pack, field guidance, and counsel-aligned residency and subprocessors wording for offer artefacts."),
        ("Why now", "Deal loss risk is explicit at Severity 3 in the micro-sample and aligns to statutory hiring hygiene."),
        ("Success metrics", ["Fewer offer-related presales escalations; faster legal review cycles on France offer collateral (programme metric)."]),
    ]))

    slides.append(rec_slide(4, "Multidiffusion defence kit", [
        ("Problem", "Severity 2 presales pressure on job postings intersects competitor board-count marketing."),
        ("Evidence", ["PG-90001003 France Services Tech Media; matrix highlights Broadbean workaround versus native long-tail multipost."]),
        ("Recommendation", "Arm teams with coverage validation, source analytics screenshots, and SKU protection narrative tied to governed partner distribution."),
        ("Why now", "SKU removal from deal risk is explicit in presales severity taxonomy."),
        ("Success metrics", ["Reduced posting-related SKU removals in France pipeline reviews; higher win rate on board-coverage objections (track in presales)."]),
    ], alt=True))

    slides.append(rec_slide(5, "WhatsApp gap response", [
        ("Problem", "Native WhatsApp in core Recruiting UI is a true gap while Oracle markets WhatsApp-class experiences."),
        ("Evidence", ["DA-FR002 true gap row; PESTEL Social shows WhatsApp penetration around two-thirds of internet users, segment-dependent."]),
        ("Recommendation", "Battle-card honest positioning with partner map, enterprise policy constraints, and TCO comparison versus Booster narratives."),
        ("Why now", "Omnichannel scorecards increasingly appear in EMEA enterprise RFPs even when France is not WhatsApp-primary for all personas."),
        ("Success metrics", ["Fewer surprise RFP losses on omnichannel; increased use of approved partner talking points in reviewed deals."]),
    ]))

    slides.append({
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
        "tables": [{
            "rows": [
                ["#", "Title", "Action", "Reach", "Impact", "Confidence", "Effort", "RICE", "Legal"],
                ["1", "EU AI hiring AI packaging", "Human-in-the-loop, logging, transparency", "2,800", "2.8", "55%", "5 pm", "862", "Annex III; DPIA-style diligence"],
                ["2", "Paradox scheduling activation", "Playbook; honest gap vs true gap", "2,500", "2.5", "50%", "3 pm", "1,042", "Avoid full-automation claims"],
                ["3", "France offer localisation pack", "Templates; residency language", "1,800", "2.4", "45%", "4 pm", "486", "Employment law; residency claims"],
                ["4", "Multidiffusion defence kit", "Broadbean proof; analytics", "2,200", "2.2", "48%", "3 pm", "774", "Partner disclosures"],
                ["5", "WhatsApp gap response", "Partner map; TCO vs Oracle", "2,000", "2.3", "52%", "2 pm", "1,196", "Omnichannel transparency"],
                ["6", "Pay transparency readiness", "Salary bands; history limits", "2,400", "2.2", "62%", "4 pm", "818", "Equality law"],
                ["7", "CSE metrics exports", "Consultation-ready reports", "1,500", "2.0", "55%", "3 pm", "550", "Information rights"],
                ["8", "SMS source of truth", "Reconcile DA passes", "2,600", "1.8", "70%", "1 pm", "3,276", "ePrivacy plus GDPR"],
                ["9", "SecNumCloud collateral", "RFP assurance pack", "900", "1.7", "50%", "2 pm", "383", "Transfer accuracy"],
                ["10", "France qual programme", "Transcripts; rerun synthesis", "N/A", "1.5", "80%", "2 pm", "N/A", "Privacy; NDAs"],
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
        "speaker_notes": "• Full handoff table for PM selection workflows.\n\nReferences:\n• research/France/thematic-analysis/2026-03-28-France-PMF-Analysis.md",
    })

    slides.append({"master_index": 1, "layout_name": "Bumper Slide"})

    out = str(Path(__file__).resolve().parents[2] / "docs" / "decks" / "specs" / "slides_spec_v74.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(slides, f, indent=2, ensure_ascii=False)

    print("slides:", len(slides))
    print("written:", out)


if __name__ == "__main__":
    main()
