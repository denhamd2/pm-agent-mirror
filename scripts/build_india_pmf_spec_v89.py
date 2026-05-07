import json

from slide_specs_dir import SLIDE_SPECS_DIR

_in88 = SLIDE_SPECS_DIR / "slides_spec_v88.json"
_out89 = SLIDE_SPECS_DIR / "slides_spec_v89.json"
with open(_in88) as f:
    slides = json.load(f)

# PESTEL updates (slides 14-19)
# Add 1-2 bullets to each to reach 5-6 bullets
slides[14]["text_boxes"][0]["paragraphs"].insert(3, {"level": 1, "text": "Compliance with the Digital Personal Data Protection (DPDP) Act requires explicit consent mechanisms and robust data retention policies across all candidate touchpoints."})
slides[14]["text_boxes"][0]["paragraphs"].insert(4, {"level": 1, "text": "Government mandates for Aadhaar-based eKYC in specific sectors necessitate flexible identity verification workflows that can adapt to varying regional requirements."})

slides[15]["text_boxes"][0]["paragraphs"].insert(3, {"level": 1, "text": "The rapid expansion of Global Capability Centres (GCCs) in India creates a massive demand for scalable, high-volume recruiting solutions that can handle thousands of concurrent requisitions."})
slides[15]["text_boxes"][0]["paragraphs"].insert(4, {"level": 1, "text": "Increased foreign direct investment (FDI) in manufacturing and IT services is driving a surge in both blue-collar and white-collar hiring, requiring adaptable ATS configurations."})

slides[16]["text_boxes"][0]["paragraphs"].insert(3, {"level": 1, "text": "The shift towards remote and hybrid work models post-pandemic has expanded the talent pool geographically, increasing the need for robust video interviewing and remote onboarding tools."})
slides[16]["text_boxes"][0]["paragraphs"].insert(4, {"level": 1, "text": "A growing emphasis on diversity, equity, and inclusion (DEI) in the Indian corporate sector requires ATS platforms to support unbiased screening and comprehensive demographic reporting."})

slides[17]["text_boxes"][0]["paragraphs"].insert(3, {"level": 1, "text": "The proliferation of AI-driven recruitment tools necessitates seamless integration capabilities and a focus on explainable AI to maintain candidate trust and regulatory compliance."})
slides[17]["text_boxes"][0]["paragraphs"].insert(4, {"level": 1, "text": "Increasing cybersecurity threats highlight the critical importance of secure data handling and robust access controls within the recruiting technology stack."})

slides[18]["text_boxes"][0]["paragraphs"].insert(3, {"level": 1, "text": "Corporate sustainability goals are increasingly influencing vendor selection, requiring HR tech providers to demonstrate energy-efficient infrastructure and sustainable business practices."})
slides[18]["text_boxes"][0]["paragraphs"].insert(4, {"level": 1, "text": "The push for paperless onboarding and digital document management aligns with broader environmental initiatives and reduces the carbon footprint of the hiring process."})

slides[19]["text_boxes"][0]["paragraphs"].insert(3, {"level": 1, "text": "Complex and frequently changing local labour laws require an agile ATS architecture capable of rapid updates to maintain compliance across different Indian states."})
slides[19]["text_boxes"][0]["paragraphs"].insert(4, {"level": 1, "text": "Stringent background verification regulations mandate secure, auditable integrations with certified third-party vendors to mitigate legal risks in the hiring process."})

# Customer Interview updates (slides 43-47)
# Add theme sub-headers and ensure 4-5 bullets
slides[43]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Data Hygiene at Scale", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"Supervisory organisation selection stayed unclear from the business at scale, so teams used random tags and operations pushed back on data quality.\" - (P1, Teleperformance) highlighting significant enterprise data hygiene issues."},
    {"level": 1, "text": "Manages specialised internal recruiting for a compact team; balances day-to-day sourcing and offers with managerial duties that compete with candidate throughput and operational efficiency, requiring streamlined system workflows."},
    {"level": 0, "text": [{"text": "Theme 2: Operational Efficiency", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "This segment is distinct from highest-volume agency hiring yet depends on the same enterprise approvals, data quality, and system hygiene described across the wider Teleperformance programme."},
    {"level": 1, "text": "Core needs: keep assigned requisitions accurate, move candidates efficiently, and sustain team effectiveness without being pulled entirely into firefighting data issues and manual corrections across the wider Teleperformance programme."}
]

slides[44]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Requisition Approval Bottlenecks", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"We lost a full day fixing cost centre tables for one senior hire because the demand details were buried in email, not the system.\" - (P2, Teleperformance) illustrating the severe impact of disconnected requisition approval workflows."},
    {"level": 1, "text": "Demand and approvals often live in email first; recruiters only raise requisitions after long threads, weakening in-system approval history and significantly slowing requisition creation for critical enterprise roles."},
    {"level": 0, "text": [{"text": "Theme 2: Data Visibility", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Recruiters carry cost centre, line of business, and margin detail that hiring managers omit, driving rework and significant delays before posting critical roles at Teleperformance."},
    {"level": 1, "text": "Core needs: accurate requisitions with visible approval status and a faster, auditable path from demand to posting so recruiters return time to candidate engagement and sourcing instead of chasing missing cost centre details."}
]

slides[45]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Pre-Offer Compliance Gating", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"Policy requires three government IDs before offer, but the UX allows skips; we spend hours chasing candidates for missing documents.\" - (P3, Teleperformance) exposing critical gaps in pre-offer compliance gating."},
    {"level": 1, "text": "Confidential funnel sees ~82% join rate but 16-17% loss tied to process length and anxiety, not pay alone, before acceptance, highlighting the urgent need for streamlined pre-offer workflows and faster document collection."},
    {"level": 0, "text": [{"text": "Theme 2: Verification Bottlenecks", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "OTP failures on ID verification drive support tickets; hundreds of applications per requisition force one-by-one review when parsers sit near 60-70% accuracy, creating massive bottlenecks."},
    {"level": 1, "text": "Core needs: strict document gating, reliable verification, and faster screening to reduce candidate drop-off during the lengthy pre-offer phase, especially when parsers sit near 60-70% accuracy creating massive bottlenecks."}
]

slides[46]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Duplicate Detection Risks", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"Every application needs manual duplicate checks; skipped checks risk agency fee fairness when duplicates are found late.\" - (P4, Teleperformance) highlighting the financial exposure of inadequate duplicate detection."},
    {"level": 1, "text": "India agency-channel hiring spans 100-150 hires per week in peaks, contributing to an 8K-9K monthly enterprise volume narrative that completely strains manual duplicate resolution processes and vendor upload approvals."},
    {"level": 0, "text": [{"text": "Theme 2: Operational Scale", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Vendor upload approval at ~100 profiles per day implies dedicated approvers; manual duplicate checking is a massive operational bottleneck that requires intelligent automation to ensure fair agency attribution and fee integrity."},
    {"level": 1, "text": "Regenerate limits after acceptance clashed with early go-live compensation mismatches across large cohorts, requiring manual intervention and delaying candidate onboarding."}
]

slides[47]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Identity Matching Limitations", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"Duplicate detection is our top automation need; candidates change email and phone, requiring government ID matching.\" - (P5, Teleperformance) exposing the limitations of standard email/phone matching in high-volume India hiring."},
    {"level": 1, "text": "Collective peaks near 1.5K-2K hires per week across 8-9 sites; duplicate signal does not block progression, and agency first-source attribution breaks create financial exposure that requires robust Aadhaar-class identifiers."},
    {"level": 0, "text": [{"text": "Theme 2: Batch Processing Needs", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Aadhaar-class identifiers are requested for deduplication but are not validation keys today, limiting their effectiveness for fraud prevention and identity trust at Teleperformance."},
    {"level": 1, "text": "At 100-150 offers per day, batch join-date moves cannot be mass-redone in-system, pushing manual legal letters; Saturday maintenance clashes with 6-day operations, demanding greater offer agility and batch processing capabilities."}
]

with open(_out89, 'w') as f:
    json.dump(slides, f, indent=2)
