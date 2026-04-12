# Interview Intelligence Agent (2026R2+)
Product Requirements Document
April 2026

## Executive Summary

Workday is uniquely positioned to deliver the **Interview Intelligence Agent** for the 2026R2+ release cycle, an AI-powered agent that transforms the interview lifecycle from preparation through debrief by generating structured interview questions tailored to each role and candidate, synthesising cross-panellist feedback to surface consistency and bias signals, and facilitating evidence-based hiring debriefs. This initiative builds directly on Workday's existing investment in the **GenAI Interview Feedback Summary** (shipped) and the **Interview Team Optimization Skill** (GA), extending the interview intelligence surface from panel composition into interview quality and decision rigour.

For our customers, this agent will **reduce median time from interview session to debrief decision by 20-30%** for tenants that activate all three capabilities in year one. Research evidence is clear: unstructured interviews have a predictive validity (R-squared) of approximately 0.2 for job performance, while structured interviews achieve 0.4-0.6. Presales feedback (PG-00011561, Healthcare vertical) confirms that hiring managers "need more guidance on what kinds of questions to ask" and that poor interview quality contributes to "severe drop-off in recruiting cycles because of candidates losing interest." By coaching interviewers before, synthesising feedback after, and structuring the debrief, this agent directly improves interview quality, reduces candidate attrition, and accelerates time-to-decision.

For Workday, this initiative will **strengthen the "best-of-class agents" narrative** (GM strategic pillar 2), **differentiate against SAP SuccessFactors** (which offers static interview kits but no AI coaching, cross-panellist synthesis, or debrief facilitation), and **demonstrate the connected system advantage** by leveraging job profile competencies, candidate skills data, and HiredScore grading to generate contextually relevant interview preparation. The agent aligns with all three GM goal areas: "Build stuff" (interview quality), "Future forward" (next-gen agent), and "Automate admin, increase human connection" (automate debrief preparation so humans focus on the hiring conversation).

Delivery is scoped as a **three-capability agent**: Interview Coach (pre-interview), Feedback Synthesis (post-interview), and Debrief Facilitation (decision support). Capabilities are independently activatable via tenant configuration. Version one focuses on **structured and behavioural question generation**, **cross-panellist consistency analysis**, and **consensus-based debrief agendas**. Out of scope for version one: real-time interview transcription, video interview analysis, automated hire/no-hire decisions, and integration with third-party assessment vendors.

**Epic Links:**
- Interview Intelligence Agent EA: TBD
- Interview Intelligence Agent GA: TBD

---

## Overview

### Overview Details

| **Section** | **Content** |
|-------------|-------------|
| **Core Problem** | Interview quality is the weakest link in enterprise hiring. Industrial-organisational psychology research consistently demonstrates that unstructured interviews have predictive validity (R-squared) of approximately 0.2 for job performance, meaning they explain only 20% of variance in actual job outcomes. Structured interviews improve this to 0.4-0.6, but most enterprise hiring managers receive no guidance on what questions to ask, no synthesis of panel feedback, and no structured debrief support. Presales evidence (PG-00011561) confirms a customer "worried with how they currently conduct interviews, that their managers need more guidance on what kinds of questions to ask" with "severe drop-off in recruiting cycles because of candidates losing interest and believe the way they conduct interviews is playing big part in that." GCC research (P1, Accenture) raises additional compliance dimensions: KSA interview notice rules, panel nationality composition, and documented consent requirements that demand in-product guardrails. Today, interviewers arrive unprepared, submit inconsistent feedback, and hiring managers run debriefs from memory rather than evidence. The result: slower decisions, higher candidate drop-off, weaker hires, and compliance exposure in regulated markets. |
| **How is it done today?** | Interviewers receive a calendar invite and a job description. Preparation is ad hoc - some interviewers review the candidate's CV, many do not. Questions are improvised, leading to inconsistent evaluation across panellists. After interviews, feedback is submitted individually via Workday's interview feedback forms (or worse, via email or instant message). The GenAI Interview Feedback Summary (shipped) provides individual feedback summarisation, but no cross-panellist synthesis, no consistency analysis, and no bias detection. Debriefs are typically informal meetings where the hiring manager asks "what did everyone think?" and the loudest voice wins. There is no structured agenda, no evidence-based recommendation, and no audit trail of the decision rationale. The Interview Team Optimization Skill (GA) improves panel composition but does not address what happens during or after the interview itself. |
| **How is our approach uniquely different from others?** | - **AI-coached preparation**: Contextual interview questions generated from role competencies (Job Profile), candidate profile (skills, experience gaps, HiredScore grade), and evidence-based I/O psychology frameworks, not generic question banks. - **Cross-panellist intelligence**: Aggregates feedback from all panellists to surface agreement, disagreement, and potential bias patterns, building on the already-shipped GenAI Interview Feedback Summary. - **Structured debrief facilitation**: Pre-built debrief agenda with consensus items (quick confirmation), disagreement items (structured discussion prompts), and evidence-based recommendation with confidence level. - **Connected system advantage**: Leverages Workday's unified data model (Job Profiles, Skills Cloud, HiredScore, Performance data for internal candidates) to generate contextually rich preparation that standalone ATS or bolt-on tools cannot replicate. - **Human-in-the-loop throughout**: The agent suggests, never decides. Interviewers choose which questions to use, recruiters review synthesis before sharing, and hiring managers make the final hire/no-hire decision. - **Compliance-aware**: Configurable to respect regional interview rules (KSA notice periods, panel composition, documented consent) identified in GCC PMF research. |
| **Why is AI/ML the chosen approach?** | AI/ML is uniquely suited to this problem because: - **Question generation at scale**: Each interview requires questions tailored to the specific intersection of role requirements and candidate profile; manual preparation for every interview is impractical at enterprise scale (thousands of interviews per month). - **Pattern detection across panellists**: Identifying consistency and bias patterns across 3-5 independent feedback submissions requires statistical analysis that is tedious and error-prone for humans. - **Evidence synthesis for debriefs**: Distilling 3-5 detailed feedback forms into a structured debrief agenda with competing evidence citations requires natural language understanding beyond summarisation. |
| **What customer benefits and value does our solution deliver? What outcomes are we measuring?** | **Impact (Business Value):** - **Time from Interview Session to Interview Feedback** (In Progress, HRREC-88029): Baseline → **20-30% reduction** in median days from last interview session to completed debrief decision (year one target for activated tenants). - **New Hire Retention** (Delivered): Indirect lift through improved interview quality; hypothesis **+2-4 percentage points** in 12-month retention for hires made with full agent activation vs. control cohort (subject to validation via Peakon/retention data linkage). **Product Outcomes:** - **Median time from final interview to debrief decision** (PV) → drives Interview Feedback time (BV#1): Target **<3 days** (from estimated **5-7 day** baseline for multi-panellist interviews). - **Panellist feedback completion rate within 48 hours** (PV) → drives BV#1: Target **85%+** completion within 48 hours (nudge effect of structured questions reducing "what should I write?" friction). - **Interview question competency coverage** (PV) → drives Retention (BV#2): Target **90%+** of role competencies addressed across panel (measured by mapping AI-generated questions to Job Profile competency tags). **Outputs (Product Catalogue):** - **Usage**: AI prep cards viewed per interviewer per month. Target: **8+** views/interviewer/month (assumes ~2 interviews/week, prep card viewed for each). - **Adoption**: % of interview sessions with AI prep card generated. Target: **10-15%** Year 1 (base: 4.5% standard GA uptake; adjusted for high-frequency, low-effort feature; validated against Interview Team Optimization Skill activation rate when available). Pilot with 3-5 design partners before setting stretch target. **Strategic Value & Outcomes:** 1. **Interview quality and velocity**: Faster, higher-quality debrief decisions reduce time-to-hire and improve quality-of-hire, directly supporting GM goal area "Build stuff." 2. **Competitive differentiation**: No competitor offers AI coaching + cross-panellist synthesis + debrief facilitation in one connected flow. SAP SuccessFactors has static interview kits; Greenhouse has scorecards; neither has an AI intelligence layer. This positions Workday as the interview quality leader. 3. **Platform growth**: a. **Monetisation**: Agent capabilities activatable per tenant; potential future premium SKU for advanced bias detection and analytics. b. **Deal-closing**: Addresses presales objection PG-00011561 directly; strengthens "AI agents" narrative in competitive evaluations. c. **Future acceleration**: Debrief decision data creates a closed-loop learning signal that improves question generation over time; reusable NLP pipeline for other feedback synthesis use cases (performance reviews, onboarding check-ins). |

### Competitive and market context

| Topic | Workday position | Implication for this PRD |
|-------|-----------------|---------------------------|
| **Interview kits / structured questions** | **Workaround** (manual question configuration per Job Profile; no AI generation) | Version one closes this gap with AI-generated structured questions from role competencies + candidate profile. |
| **Interview feedback summarisation** | **Native** (GenAI Interview Feedback Summary shipped) | Foundation to build upon; this PRD extends from individual summarisation to cross-panellist synthesis and bias detection. |
| **Interview Team Optimization** | **Native** (Interview Team Optimization Skill GA) | Complementary: ITO handles who interviews; this agent handles what they ask and how feedback is synthesised. |
| **Cross-panellist consistency analysis** | **Hypothesis: True Gap** (not identified in SAP, Oracle, Greenhouse, or iCIMS as of April 2026; pending CI refresh) | Likely blue-ocean capability; requires competitive validation before marketing claims. |
| **Debrief facilitation** | **Hypothesis: True Gap** (no structured debrief AI found in enterprise ATS landscape as of April 2026; pending CI refresh) | Likely blue-ocean capability; requires competitive validation before marketing claims. |
| **SAP SuccessFactors** | Static interview kits with structured questions, mobile feedback forms (Native) | Compete on AI intelligence (contextual, candidate-specific) vs. static templates. |
| **Greenhouse** | Structured scorecards, interview kits, anti-bias nudges (Native) | Compete on connected system (HCM data, Skills Cloud) vs. standalone ATS scorecard. |

### Audience / Personas

**Primary Persona**: Interviewer (hiring manager or panel member)
- Conducts 2-8 interviews per month across various roles
- Often under-prepared due to competing responsibilities
- Wants to conduct rigorous, fair interviews without extensive preparation time
- Needs structured questions that are relevant to this specific role and candidate

**Secondary Persona**: Recruiter / Interview Coordinator
- Coordinates interview panels and logistics for 10-30 requisitions
- Reviews feedback from multiple panellists to assess candidate progress
- Facilitates or prepares debrief meetings for hiring managers
- Needs synthesised feedback view to identify consensus and drive decisions

**Tertiary Persona**: Hiring Manager (debrief owner)
- Makes final hire/no-hire decision based on panel feedback
- Runs debrief meetings with limited preparation time
- Wants evidence-based decision support, not just opinions
- Needs structured debrief agenda to run efficient, fair meetings

*Persona depth from docs/workday-user-research/ (HR Professional JTBD Supplemental Guide, Frontline Manager Persona). Recruiter JTBD alignment: "Collaborate with hiring teams to hire the right candidate quickly" and "Ensure that candidates are assessed in a fair, equitable manner." Manager JTBD alignment: "Determine if a candidate is the right fit."*

---

## Feature Solution

- **Capability 1: Interview Coach (Pre-interview)**
  - When an interview session is scheduled, the agent analyses the Job Profile competencies, candidate profile (resume, skills, experience), and HiredScore grade (where available) to generate a tailored prep card
  - Prep card includes: 3-5 structured behavioural questions mapped to role competencies, candidate highlights (key strengths and areas to probe), and interview best practices reminders
  - Interviewers access the prep card from their interview detail page in Workday; the card is available from the moment the session is confirmed
  - Questions are suggestions, not mandates; interviewers can modify, reorder, add custom questions, or dismiss the prep card entirely
  - Question generation uses evidence-based frameworks (behavioural interviewing, situational judgement) grounded in I/O psychology best practices

- **Capability 2: Feedback Synthesis (Post-interview)**
  - After all panellists submit feedback (or after a configurable deadline), the agent aggregates individual feedback into a synthesised view
  - Cross-panellist consistency analysis: per-competency comparison showing where panellists agree (consensus) and disagree (divergence), with specific evidence quotes
  - Scoring consistency analysis: advisory signals when scoring patterns suggest statistical inconsistency (e.g., standard deviation above threshold across panellists on a given competency, one panellist consistently divergent from consensus). Minimum panel size for consistency analysis: 3 panellists (below this threshold, analysis is skipped with clear messaging). Signals are advisory, not accusatory, and require human review. Demographic data is never processed or inferred; analysis operates on competency scores only
  - Builds on GenAI Interview Feedback Summary (integration contract: consumes summary text and structured ratings; version-pinned per release; degraded mode falls back to raw feedback if summary API changes): individual summaries remain available; cross-panellist synthesis is a new layer on top
  - Recruiter or coordinator reviews the synthesis before sharing with the hiring team

- **Capability 3: Debrief Facilitation (Decision support)**
  - When the recruiter or hiring manager opens the debrief view, the agent presents a pre-built structured agenda
  - Consensus items (green): competencies where all panellists agree, requiring quick confirmation only
  - Disagreement items (amber): competencies where panellists diverge, with structured discussion prompts citing competing evidence from individual feedback
  - Overall recommendation with confidence level (High / Medium / Low) based on strength of evidence and degree of consensus; labelled "AI-generated suggestion - non-binding" with evidence basis visible
  - "Record decision" action: hiring manager logs hire/no-hire decision with rationale, creating an audit trail. Recommendation never pre-selects hire/no-hire
  - v1: Debrief decision data is captured and stored for offline analysis only. v2 (2027R1 target): Closed-loop model improvement from anonymised, aggregated decision outcomes with separate Innovation opt-in and jurisdictional review

- **Configuration and activation**
  - Each capability is independently activatable via tenant configuration (Innovation opt-in per Workday standard)
  - Compliance rules (KSA interview notice, panel composition warnings) are configurable per country/region
  - Consistency analysis sensitivity is configurable (Off / Advisory) to match customer risk appetite

- **v1/v2 scope boundary (explicit)**
  - **v1 (2026R2)**: Question generation from competencies + candidate profile, cross-panellist consistency scoring on competency ratings, structured debrief agenda, decision capture for offline analysis
  - **v2 (2027R1+, subject to validation)**: Closed-loop learning from decision outcomes, question rotation/paraphrase to prevent leakage, advanced statistical modelling for consistency patterns, single-interviewer prep card mode
  - **Out of scope (no timeline)**: Real-time interview transcription, video interview analysis, automated hire/no-hire decisions, integration with third-party assessment vendors

---

## Critical User Journey & Use Cases

**Journey 1: Interviewer prepares for interview (Capability 1)**
- Interviewer receives interview calendar notification via Workday or external calendar
- Interviewer opens interview detail page in Workday Recruiting
- AI prep card appears as a prominent card on the interview detail, showing "Suggested questions for [Candidate Name] - [Role Title]"
- Interviewer reviews 3-5 structured behavioural questions, each mapped to a specific role competency
- Interviewer sees candidate highlights: key skills match, experience gaps to probe, HiredScore grade (where available)
- Interviewer can expand each question to see follow-up probes and evaluation criteria
- Interviewer may edit questions, add custom questions, or dismiss the prep card
- Prep card state (viewed, customised, dismissed) is logged for analytics and learning

**Journey 2: Recruiter reviews synthesised feedback (Capability 2)**
- All panellists have submitted interview feedback (or deadline has passed)
- Recruiter opens candidate detail page and navigates to Feedback tab
- Synthesised view shows per-competency ratings from all panellists in a comparison matrix
- Green indicators highlight consensus areas; amber indicators highlight divergence
- Recruiter expands a divergence item to see competing evidence quotes from panellists
- If consistency signals are detected, an advisory banner appears: "Score variation detected on [competency] - review panellist feedback for consistency"
- Recruiter reviews synthesis and shares with hiring manager (or triggers debrief)

**Journey 3: Hiring manager runs structured debrief (Capability 3)**
- Hiring manager opens debrief view from the candidate detail page or from a notification
- Pre-built agenda shows: consensus items (quick confirmation), disagreement items (discussion needed), and overall recommendation
- Hiring manager walks through agenda in the debrief meeting, using evidence citations to structure discussion
- After discussion, hiring manager records hire/no-hire decision with rationale
- Decision and rationale are stored in the interview record for audit and analytics
- Agent learns from decision outcomes: which questions generated useful feedback? Which competencies were decisive?

---

### Experience Principles Alignment

**How this feature upholds Workday's Experience Principles:**

**Empower (Give Users Control)**
- Interviewers control their preparation: prep card is a suggestion, not a mandate; they can modify, reorder, add, or dismiss questions entirely
- Hiring managers control the debrief: the agent provides a structured agenda and recommendation, but the human makes the decision
- Consistency signals are advisory, not blocking; the system informs, the human investigates and decides

**Trust (Build Their Confidence)**
- Transparent AI reasoning: each suggested question is mapped to a specific role competency, so interviewers understand why it was suggested
- Confidence levels on debrief recommendations include the basis (e.g., "High confidence: 4/5 panellists rated 'Strong' or above on all competencies")
- Feedback synthesis shows source attributions: every synthesised point cites the specific panellist and quote

**Grow (Enable Them To Change)**
- Closed-loop learning: debrief decisions feed back into question generation, so the agent improves over time
- Interviewers can save custom questions to their personal question bank for reuse
- Competency frameworks are configurable per tenant; as the organisation's competency model evolves, the agent adapts

**Principle Validation:**
- [x] Feature keeps user in control (not system-driven)
- [x] Clear transparency about what's happening
- [x] Easy to change/iterate without support tickets

---

## Technical AI/Skill & System Design

### AI Skill's Role, Capabilities, and Boundaries

The Interview Intelligence Agent is a multi-capability AI Skill that enhances interview quality across the hiring lifecycle. It operates as an advisory system that augments human judgement rather than replacing it. The agent never makes hiring decisions, never blocks interview processes, and never accuses individuals of bias.

**Core Capabilities:**
- **Question generation**: Produces structured behavioural and situational interview questions from role competencies, candidate profile data, and I/O psychology frameworks
- **Feedback synthesis**: Aggregates and analyses cross-panellist feedback to identify consensus, divergence, and scoring inconsistency patterns using NLP and statistical analysis
- **Debrief structuring**: Constructs evidence-based debrief agendas with confidence-weighted recommendations from synthesised feedback data

**Boundaries:**
- The agent NEVER makes hire/no-hire decisions; all decisions require explicit human action
- The agent NEVER blocks interview scheduling, feedback submission, or debrief progression
- Consistency signals are ALWAYS advisory and operate on competency scores only; no demographic data is ever processed or inferred
- The agent does not access data beyond what the user's security role permits in Workday

### Models and Model Capabilities

- **Primary Model**: Workday LLM (internal, hosted in Workday MLDE) for question generation and feedback synthesis
  - **Required Capabilities**: Natural language generation (structured questions from competency definitions), natural language understanding (feedback text analysis), reasoning (cross-panellist consistency comparison)
- **Statistical Model**: Lightweight consistency detection model for scoring pattern analysis
  - **Required Capabilities**: Distribution analysis across panellist competency scores (standard deviation, inter-rater reliability). No demographic data processed or inferred. Minimum n=3 panellists required.
- **ML Environment**: Workday MLDE for model hosting, inference, and monitoring. **Architecture decision pending**: Confirm with ML platform owners whether MLDE supports multi-step LLM pipeline or whether the delivered pattern (e.g., GenAI Interview Feedback Summary using external LLM) is the approved path. Fallback: external LLM via approved vendor with Workday security review.
- **Model Updates**: v1 uses fixed model version per release. v2 (2027R1+): models retrained on anonymised, aggregated decision outcome data with separate opt-in; version pinned per tenant with opt-in upgrade

### System Prompt Approach

- System prompt grounds question generation in the specific Job Profile competencies (extracted from Workday Job Profile data model)
- Candidate context (skills, experience summary, HiredScore grade) is injected as structured data, not raw CV text, to ensure data minimisation
- I/O psychology frameworks (behavioural interviewing, STAR method) are encoded as prompt instructions, not learned from data
- Tone and format instructions ensure questions are professional, unbiased, and appropriately scoped for the role level (entry, mid, senior, executive)
- Regional compliance rules (KSA notice periods, panel composition) are injected as conditional constraints when the tenant has them configured

### Core AI Functions to Build

- **generate_prep_card**: Accepts Job Profile ID and Candidate ID; returns structured prep card (questions, highlights, competency mapping)
- **synthesise_panel_feedback**: Accepts Interview Session ID; returns cross-panellist synthesis (consensus matrix, divergence items, consistency signals)
- **generate_debrief_agenda**: Accepts Interview Session ID and synthesis output; returns structured agenda (consensus items, disagreement items, recommendation with confidence)
- **detect_scoring_inconsistency**: Accepts panellist competency score distributions (minimum n=3); returns advisory signals with statistical basis (standard deviation, inter-rater reliability coefficient). No demographic data processed or inferred

### User Feedback and Human Oversight

**Feedback Opportunities:**
- Interviewers can rate prep card quality (helpful / not helpful) after each interview
- Interviewers can flag individual questions as irrelevant, too generic, or inappropriate
- Recruiters can rate feedback synthesis accuracy (accurate / missed something / over-interpreted)
- Hiring managers can rate debrief agenda usefulness after completing the debrief

**Human Oversight:**
- All three capabilities require human review before action (interviewer reviews questions, recruiter reviews synthesis, HM reviews debrief)
- Consistency signals require human investigation; the agent surfaces scoring patterns but does not draw conclusions
- Debrief recommendations are explicitly labelled as "AI-generated suggestion" with confidence level and evidence basis
- Tenant administrators control which capabilities are active and configure sensitivity levels

### Handling Model Failures and Low-Confidence Outputs

**Failure Handling:**
1. **Question generation fails**: Display fallback message "Unable to generate suggested questions. Use the competency framework for [Role Title] to guide your interview." with link to Job Profile competencies
2. **Feedback synthesis fails**: Display individual feedback summaries (already-shipped GenAI summary) without cross-panellist synthesis layer
3. **Debrief generation fails**: Display raw feedback summary with prompt "Review individual panellist feedback to prepare your debrief"

**Low-Confidence Handling:**
1. **Insufficient candidate data**: If candidate profile lacks skills data or resume, generate questions from Job Profile competencies only; label as "Based on role requirements only (limited candidate data available)"
2. **Too few panellists**: If fewer than 3 panellists submitted feedback, skip consistency analysis and label synthesis as "Limited panel size - synthesis based on [N] panellists"
3. **Mixed signal debrief**: If consensus is weak across most competencies, set recommendation confidence to "Low" and highlight that "Panel feedback is mixed - structured discussion recommended before decision"

### Required Level of Explanation

The agent provides full transparency at every level. Each suggested question includes the competency it assesses and why it was chosen for this candidate. Each synthesis point cites the specific panellist(s) and their feedback quotes. Each debrief recommendation states the evidence basis and confidence rationale. This level of explanation is necessary because: (a) interviewers must trust the questions to use them, (b) recruiters must trust the synthesis to share it, and (c) hiring managers must trust the recommendation to act on it. Trust requires transparency, per Workday's Experience Principles.

### AI Model Integration

**Integration Architecture:**
1. **Job Profile API**: Reads competency definitions, required skills, and role level from Workday Job Profile data model
2. **Candidate Profile API**: Reads candidate skills, experience summary, and application data (with appropriate security role filtering)
3. **HiredScore Integration**: Reads HiredScore grade and skills match data where HiredScore is activated
4. **Interview Management API**: Reads interview session data, panellist assignments, and submitted feedback
5. **Workday MLDE**: Hosts LLM for question generation and feedback synthesis; serves inference requests

**Key Components:**
- **Prep Card Service**: Triggered on interview session confirmation; generates and caches prep card for interviewer access
- **Synthesis Service**: Triggered when all panellists submit feedback (or configurable deadline); generates cross-panellist synthesis
- **Debrief Service**: Triggered on recruiter or HM request; generates structured agenda from synthesis output
- **Consistency Detection Module**: Runs as part of synthesis service; analyses competency score distributions for statistical inconsistency (standard deviation, inter-rater reliability)
- **Feedback Loop Collector**: Stores user ratings and debrief outcomes for quarterly model retraining

### Key System Dependencies

**APIs and Dependencies:**
1. **Job Profile Data Model**: Competency definitions, required skills, role level
2. **Candidate Data Model**: Skills, experience, application data (security-role-filtered)
3. **Interview Management Module**: Session data, panellist assignments, feedback submissions
4. **HiredScore API**: Grade and skills match (optional, where activated)
5. **GenAI Interview Feedback Summary**: Individual feedback summarisation (foundation for synthesis)
6. **Workday MLDE**: Model hosting and inference
7. **Notification Framework**: Prep card availability notifications, debrief readiness alerts

**Authentication/Security:**
- All data access respects Workday's role-based security model; interviewers see only data their security role permits
- Consistency analysis operates on competency score distributions only; no demographic data is processed, inferred, or stored
- Prep cards are visible only to the assigned interviewer and the interview coordinator
- Debrief synthesis is visible to the recruiter and hiring team; access follows existing Interview Management security

### Error and Exception Handling

- **Competency data missing**: If Job Profile has no competencies defined, generate general behavioural questions with advisory: "Add competencies to this Job Profile for more targeted questions"
- **Candidate profile incomplete**: Generate questions from role requirements only; label prep card accordingly
- **Feedback deadline passed with incomplete submissions**: Generate synthesis from available feedback; note which panellists have not submitted
- **HiredScore not activated**: Omit HiredScore grade from prep card; use skills and experience data only
- **LLM rate limit exceeded**: Queue prep card generation; display "Prep card generating..." with estimated availability
- **Consistency signal false positive**: Advisory signals include statistical basis (e.g., "Standard deviation of 1.8 across panellist scores on this competency") so reviewers can assess significance

---

## Data

### DATA DETAILS

| **Section** | **Content** |
|-------------|-------------|
| **Algorithm Logic Overview** | The Interview Intelligence Agent uses a multi-stage pipeline. Stage 1 (Question Generation): The LLM receives structured inputs (Job Profile competencies, candidate skills delta, role level) and generates 3-5 behavioural questions using encoded I/O psychology frameworks. Stage 2 (Feedback Synthesis): NLP analysis extracts key themes, sentiment, and ratings from individual feedback texts; statistical analysis computes cross-panellist consistency scores per competency. Stage 3 (Debrief Generation): Rule-based agenda construction from synthesis output, with LLM-generated discussion prompts for divergence items and confidence-weighted recommendation based on consensus strength. |
| **Criteria for Filtering Out Mass Population** | For 2026R2+ release. For most updated criteria, see Interview Intelligence Agent epic (TBD). - Tenant must have Interview Management module active - Tenant must opt in to Innovation features (standard Workday pattern) - Individual capabilities independently activatable - Consistency analysis requires Advisory mode opt-in |
| **LLM Prompt & Data Point Details** | See System Prompt Approach above |
| **Evals / Performance** | Pre-launch evaluation plan: (1) Question quality evaluation by I/O psychologists (relevance, fairness, competency coverage), (2) Synthesis accuracy evaluation against human-generated summaries (precision/recall on consensus and divergence identification), (3) Consistency detection evaluation using synthetic panellist data with known scoring patterns (sensitivity/specificity, false positive rate target), (4) Red team testing for prompt injection, data leakage, and inappropriate question generation. Responsible AI review per Workday standard. |

---

## UX Designs for 2026R2+

- Interview Intelligence Agent - Full Flow Prototype: `http://localhost:5199/interview-intelligence-agent-v96`
- Design Brief: `design/interview-intelligence-agent-design-brief.md`
- Figma: TBD (post-prototype capture via 330)

---

## Releases & Production Thresholds

**EU AI Act compliance (mandatory before EA):**
- The Interview Intelligence Agent is treated as **likely high-risk** under Annex III (employment, workers management, access to self-employment) because its outputs (questions, synthesis, recommendations) influence hiring decisions. Formal classification memo required from Legal before EA.
- Articles 8-15 obligations apply: risk management, data governance, technical documentation, logging, transparency for deployers, human oversight, accuracy/robustness/cybersecurity, conformity assessment.
- Deployer transparency deliverables: Workday must provide customers with documentation to fulfil their Article 50 obligations (AI disclosure to candidates and interviewers).

**GDPR compliance (mandatory before EA):**
- **DPIA required** (not recommended) for all three capabilities combined, plus focused analysis for consistency analysis modes. DPIA must cover retention, closed-loop learning, subprocessors/MLDE, and cross-border transfers.
- **Article 22**: Human-in-the-loop design (HM makes decision, recommendation is non-binding and never pre-selects) supports compliance. Customer documentation must include obligation to offer meaningful human review and candidate right to contest.
- **Candidate-facing transparency**: Candidates must receive specific, upfront information (Articles 13-14) that AI is used to generate interview questions from their profile and that feedback may be synthesised. Default disclosure templates to be provided to customers.
- **Data minimisation**: Each data element tied to specific purpose; HiredScore and performance data are optional enrichments with separate justification.

**Cross-border (GCC):**
- KSA PDPL and UAE PDPL compliance: consent/lawful basis, cross-border transfer rules, bilingual disclosures.
- Closed-loop learning default OFF for jurisdictions without confirmed legal basis; separate Innovation opt-in with jurisdictional review.

Responsible AI Risk Evaluation to be completed prior to EA release. Legal review (060) findings incorporated above.

---

## Target Delivery & Major Milestones

| **Milestone** | **Target Date** |
|---------------|-----------------|
| PRD finalised (this document) | April 2026 |
| Design Brief and prototype complete | April 2026 |
| Legal and Responsible AI review | May 2026 |
| Capability 1 (Interview Coach) EA | 2026R2 (target) |
| Capability 2 (Feedback Synthesis) EA | 2026R2 (target) |
| Capability 3 (Debrief Facilitation) EA | 2026R2+ (target) |
| Closed-loop learning activation | 2027R1 (target) |

---

## Resources

- Epic - TBD (Interview Intelligence Agent EA), TBD (Interview Intelligence Agent GA)
- Interview Intelligence Agent: AI Review - TBD
- Legal Review Jira: TBD
- Responsible AI Risk Evaluation: TBD
- PRD (markdown): `docs/prds/interview-intelligence-agent-prd.md`
- GM Strategic Context: `strategy/markdown/product-priorities-q2-2026.md` (April 2026 all-hands, "Interviewing and selection" opportunity area)
- Presales Gap Evidence: PG-00011561 (Enjoin, Healthcare, interview quality and candidate drop-off)
- GCC PMF Research: `research/GCC/thematic-analysis/` (Theme 1: Local compliance and interview rules, Theme 4: Scheduling and calendar)
- Value Metrics Reference: `docs/metrics/talent-acquisition-value-metrics.csv` (Interview - Time, Interview - Volumes categories)

---

## Contacts

| **Name** | **Role** |
|----------|----------|
| David Denham | Sr. Product Manager |
| TBD | Interview Intelligence Agent Engineering Lead |
| TBD | Team ML Dev Lead |
| TBD | UX Designer |
| Adam Godson | Executive Sponsor (GM, Talent Acquisition) |

---

Workday Confidential    1

-- 1 of 1 --
