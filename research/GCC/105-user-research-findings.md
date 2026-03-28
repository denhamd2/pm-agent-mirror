# User Research Findings: GCC Recruiting (Customer Interviews)

**Analysis date:** 27 March 2026  
**Methodology:** Structured synthesis from customer interview transcripts (Teresa Torres-style story capture; themes clustered for **120** / **130** consumption).  
**Geographic scope:** GCC-relevant hiring (Saudi Arabia, UAE, Kuwait, wider GCC/Middle East where cited).

---

## Fresh pass attestation

- **Mission ID:** GCC-E2E-031
- **Transcript files read (this run):**
  - `research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt`
  - `research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt`
  - `research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt`
- **SME files read (this run):** *None* (`research/GCC/internal-sme-transcripts/` contained no `.txt` files)
- **Completed (UTC):** 2026-03-27T21:05:00Z

---

## Strategic Alignment Assessment

**Step 0 strategy context:** `research/GCC/strategy-context-2026-03-27-GCC-E2E-031.md`

**Alignment analysis:**

- **High alignment (customer pain ↔ Q2 P1 GCC market readiness)**
  - **WhatsApp / omnichannel:** P1 (Accenture) describes WhatsApp as essential for quick candidate closure; P2 (Baker Hughes) wants WhatsApp-style channels and richer campaigns beyond email. Matches Priority 1 (candidate communication) and KR1 (GCC wins narrative).
  - **Nationalisation / local compliance:** P1 tracks nationality, gender, PWD quotas for Nitaqat-style mandates and reporting; P2 needs Saudi/UAE nationality capture and penalties for missing localization targets; wants **native** (out-of-the-box) support vs custom fields. Matches Priority 1 (nationalisation compliance).
  - **KSA interview rules:** P1 cites minimum **three-day** interview notice, candidate consent if shortened, and **panel nationality** rules (e.g. proportion of Saudi nationals). Direct input for scheduling and compliance-aware UX (Priority 1 + scheduling parity).
  - **Arabic / localization:** P2 notes Arabic + English mix, especially for operational roles; P3 cites **Arabic character rendering** failures in Workday Docs (squares), blocking offer automation. Matches Priority 1 localisation theme.

- **High alignment (customer pain ↔ Q2 P2 AI candidate matching)**
  - **AI-assisted discovery:** P1 welcomes integrated AI to speed workflows and interpret historic funnel data; P2 wants semantic/boolean search and “who in the database matches this req” style matching; P3 explores **HiredScore** for high application volume vs few openings. Matches Priority 2 (AI matching activation, explainability narrative). *Note:* Q2 strategy also defers **talent pool AI recommendations** to H2; position HiredScore exploration as activation/explainability, not a promise of full talent-pool roadmap.

- **High alignment (customer pain ↔ Q2 P3 core ATS parity)**
  - **Interview scheduling:** P1’s top “change tomorrow” wish is scheduling in-product; P2 found Workday scheduling **more cumbersome than Outlook**, wants Office 365-calibre flow. Matches Priority 3 (Paradox activation, reduced scheduling friction).
  - **Recruiter UX (candidate review):** P2 describes **tab-heavy** candidate grid; P1 struggles with **dashboard readability** and lack of in-app role overview (export to build own dashboards). Matches Priority 3 (mobile/recruiter experience, parity objections).
  - **Bulk / workflow friction:** P1 cannot move candidates across reqs without assignee gymnastics; **screening notes** locked behind stage. Fits core ATS workflow parity.

- **Strategy–customer tension (customer pull ↔ Q2 explicit de-priorities)**
  - **Career site / branding:** P2 wants a **full-fledged, strongly branded** career site in Workday (today uses Phenom + apply redirect). Q2 strategy **defers career site redesign to Q3**. Tension: strong customer pain vs near-term roadmap slot.
  - **Recruiting marketing / CRM depth:** P2 asks for richer **recruiting marketing** and template-driven engagement; Q2 doc **de-prioritises recruiting marketing automation**. Tension unless framed as candidate engagement packaging or longer horizon.

- **Strategy–customer tension (regional norm ↔ enterprise policy, not Q2 de-prio list)**
  - **WhatsApp vs policy:** P1 and P2 favour WhatsApp for GCC; P3 (Shell) explains **official channel restrictions** (scam risk, authorised contact) and limited use of WhatsApp for recruiting. Product implication: **channel choice + governance** matter as much as raw integration; one global customer will not behave like GCC-native hiring teams.

- **Neutral / contextual**
  - P3: GCC volumes **low** in Shell’s franchise model; local compliance may be **Excel/manual**; still validates **franchise** reporting and “Workday as source of truth” desire.
  - P1: Resume parser **Arabic unknown**; English standard for their candidate pool. Nuance for Arabic parser investment vs other segments.

**Implications for 120**

- Prioritise roadmap narrative that ties **WhatsApp, nationalisation reporting, KSA scheduling rules, Arabic document fidelity, and recruiter grid/scheduling** to **Priority 1–3** and OKRs (10 GCC wins, 5 AI betas, NPS 60 per Step 0 file).
- Flag **career site** and **recruiting marketing** as **tension themes**: high customer voice in this sample vs **Q2 de-prioritised**; surface trade-off (Q3/H2 vs strategic exception) for PM judgement.
- Treat **Shell-style channel policy** as evidence that **multi-channel + audit/compliance** beats “WhatsApp only” framing.
- Step 0 for **GCC-E2E-031** cites `strategy/pdfs/workday-talent-acquisition-strategy-march-2026.pdf` alongside Q2 markdown; use that pairing for long-horizon claims where relevant.

---

## Interview Participants

| ID | Role | Organisation | GCC / regional relevance |
|----|------|--------------|---------------------------|
| **P1** | Recruitment lead (cyber security + campus hiring; end-to-end reqs) | Accenture | Egypt, GCC, Africa; deep KSA compliance examples |
| **P2** | Performance and Innovation Manager, TA tools / Workday functional owner | Baker Hughes | Global with explicit GCC/Saudi/UAE communication and localization |
| **P3** | Product Owner, Talent and Resourcing (Workday TA + Talent) | Shell | Global; GCC as **franchise** subset, lower volume; compliance and Docs |

---

### Key Findings per Participant

#### P1 – Recruitment lead, Accenture

**Role context:** Leads cyber security and campus hiring across Egypt, GCC, and Africa; team of ~five; uses Workday for goals and campus events; handles reqs end-to-end (posting, pipeline, notes).

**Key quotes:**

> “WhatsApp is an absolute necessary… when you're looking at WhatsApp, you get immediate responses, almost immediate responses.”

> “If workday can have integration with WhatsApp and it starts sending messages to candidates and scheduling their interviews… it's just going to be absolutely brilliant.”

> “You're not able to organize an interview… in less than three day notice… if you're going to violate that requirement, then you'll need to have the consent of the candidate on email.”

> “Once you put a panel in KSA… you need to select the nationality of the panel so that you make sure that 50% of them are nationals.”

> “I need the ability to track… nationalization… gender… PWD… regulatory requirement compliance requirements.”

> “The candidate grids… the overall Rex dashboard… I will need to sort of download it and create my own dashboards… it's a tedious tedious task.”

**Pain points:**

- Cannot move candidates between requisitions without being assigned to every req; time lost adding/removing self as assignee.
- Screening notes **not** addable until candidate in screen stage; blocks exploratory-call documentation.
- Unclear or missing **historic funnel** view per req (applied / screened / rejected split).
- **Offer configuration** rigid; exceptions need long dev cycles; forces offline contracts and misses targets.
- **Interview scheduling** outside Workday (separate system); wants end-to-end in Workday with HM/candidate notifications.
- **Document collection** offline via email; wants categorised **candidate upload** in system for confidentiality.
- **Dashboards** hard to read; wants configurable presentation of what matters.
- Kuwait rollout slow (generic new-country setup pain).

**JTBD (from `docs/jtbd-recruiting-hr-professional-and-manager.md` lens):** When hiring across regulated GCC markets, recruiters need to **prove compliance, move talent fast, and communicate on local channels**, so they can **hit quotas without offline workarounds**.

---

#### P2 – Performance and Innovation Manager, Baker Hughes

**Role context:** Global TA tools, analytics, processes; functional counterpart to technical Workday team; Workday live since 2020; values single HCM suite but notes recruiter-facing limits when HCM coupling blocks change.

**Key quotes:**

> “Can most of the important information be integrated… in a more seamless way… going through 100 candidates or 200 candidates.”

> “I would definitely want to see a much more… improved boolean search capabilities within workday.”

> “We tried to utilize the workday scheduling capability… it felt more complicated than scheduling a meeting via Outlook.”

> “Having something like a WhatsApp or other communication methodologies would be helpful especially in markets like GCC and Saudi.”

> “If you're able to add more in terms of the local requirements… in Saudi… we are required to collect information… report… we'll get penalty.”

> “Almost say 40% or more actually coming via a mobile or a handheld device.”

> “If you guys offered a full-fledged career site I would rather go with the work [ecosystem].”

**Pain points:**

- **Candidate grid** tab sprawl (education vs CV vs other data).
- **Search** weak vs boolean / field combinations; interest in **AI match** from entire database, not only applicants.
- **Scheduling** not competitive with Outlook; wants deep Office 365 integration.
- **Campaigns** limited to email; wants WhatsApp-class channels in GCC.
- **Nationalisation** via **custom** fields; wants **out-of-the-box** Saudi/UAE (and similar) models like US/UK diversity reporting.
- **Career site** branding and **apply redirect** (Phenom → Workday) hurts candidate experience; desire for **single ecosystem**.
- **Arabic + English** apply paths; **mobile** critical for operational hiring.

**JTBD:** When recruiters run high-volume, multi-country hiring, they need **fast access to signal on candidates**, **scheduling that matches real calendaring**, and **local compliance without duct tape**, so they can **reduce tool sprawl and penalty risk**.

---

#### P3 – Product Owner, Talent and Resourcing, Shell

**Role context:** Owns talent and resourcing landscape with strong Workday use since 2020; interfaces recruiters, sourcing, COE, operations, HR digital; external vs internal hiring split; **franchise** countries (including GCC) differ from global standard.

**Key quotes:**

> “Difficulties and challenges with workday is its reporting functionality… we did have to resort building a dashboard separately… in PowerBI.”

> “For offers specifically the Arabic countries… work day docs… Arabic letters… it would just be squares rather than the actual characters.”

> “From a messaging perspective… we… can't use WhatsApp for official business… we try to be careful… scammers.”

> “GCC countries… franchise… local variances that we're not able to roll up… they also have… local specific reportings… from a legal perspective.”

> “In the face of AI… pre-screening… high application volume but… low number of job openings… HiredScore.”

**Pain points:**

- **Reporting / dashboards** insufficient for operational + leadership cuts; **PowerBI** dependency; still needs discipline on Workday data quality.
- **Workday Docs** **Arabic rendering** blocked offer automation (alongside historical Mandarin issues).
- **Franchise GCC** entities: low volume, possibly **manual / Excel** compliance reporting; risk of **email**-based processes outside system.
- **Channel strategy:** Official email, SMS, Teams; **not** WhatsApp for Shell recruiting despite regional norms elsewhere.
- **AI matching** (HiredScore) of interest for volume/quality tension.

**JTBD:** When global COE supports franchise markets, they need **trustworthy data in one system**, **legible local artefacts (e.g. Arabic offers)**, and **governed channels**, so they **avoid compliance drift and tool proliferation**.

---

## Synthesized Themes

### Theme 1: GCC-native compliance and scheduling rules

**Description:** Customers describe **nationalisation** quotas, **panel composition**, and **interview notice/consent** rules (especially KSA) as operational reality, not optional fields.

**Evidence:** Strong in **P1**, **P2**; **P3** notes franchise local reporting (often outside global roll-up).

**Triangulation:** Customer-only (no SME transcripts this run).

**Implication:** Product should treat **compliance hints, audit trails, and scheduling guardrails** as first-class for GCC, not post-configuration afterthoughts.

**Representative quotes:**

> P1: “If you're building a scheduling tool… notification in red… you're not meeting the regulatory requirements.”

> P2: “We… get penalties if we don't meet… localization percentage… bandaids… versus out of the box.”

---

### Theme 2: Omnichannel candidate engagement (WhatsApp-led)

**Description:** **Immediate, mobile-first** messaging is how recruiters expect to move candidates in GCC; email alone is too slow.

**Evidence:** **P1** (strong); **P2** (WhatsApp + campaigns); **P3** diverges (**policy** blocks WhatsApp).

**Triangulation:** Converge **P1–P2**; **diverge** with **P3** (enterprise policy).

**Implication:** Build for **channel choice**, consent, and **auditability**; enable GCC customers without assuming every tenant enables WhatsApp.

**Representative quotes:**

> P1: “Emails will take whenever… WhatsApp… immediate responses.”

> P3: “We… can't use WhatsApp for official business… scamming gimmicks.”

---

### Theme 3: Recruiter efficiency – grid, search, and AI-assisted matching

**Description:** Recruiters lose time in **tab navigation**, **weak search**, and **finding best-fit talent** across large databases.

**Evidence:** **P2** primary; **P1** on dashboards and data presentation; **P3** on AI for volume.

**Triangulation:** Customer-only.

**Implication:** Tie UX improvements to **Priority 2** (matching, explainability) and **Priority 3** (grid/parity).

**Representative quotes:**

> P2: “Can I see who else is matching that requirement… two million candidates in our workday database.”

> P1: “Present the data… select and choose what data is important to you.”

---

### Theme 4: Interview scheduling parity and calendar reality

**Description:** Native scheduling is **not** trusted vs Outlook; recruiters want fewer system hops.

**Evidence:** **P1**, **P2**.

**Triangulation:** Customer-only.

**Implication:** Paradox positioning and **Microsoft 365** depth matter for **Priority 3**; KSA rules overlay **Theme 1**.

**Representative quotes:**

> P2: “Felt more complicated than scheduling a meeting via Outlook.”

> P1: “If I can click my fingers… the scheduling piece.”

---

### Theme 5: Reporting, dashboards, and franchise / local roll-ups

**Description:** Leadership and recruiters need **configurable, readable** operational views; some **franchise** markets export or manualise compliance.

**Evidence:** **P1** (dashboard UX); **P3** (PowerBI, small GCC volumes, Excel suspicion); **P2** (penalties, reporting on localization).

**Triangulation:** Customer-only.

**Implication:** Improve **in-product** reporting for recruiting KPIs and compliance slices; acknowledge **low-volume** markets may still export if in-product views are credible and easy.

---

### Theme 6: Offer and document experience (rigidity, Arabic, uploads)

**Description:** **Offer** flexibility and **document** capture matter; **Arabic** in generated documents is a hard blocker for some.

**Evidence:** **P1** (offers, uploads); **P3** (Arabic in Docs); **P2** (mobile apply, language mix).

**Triangulation:** Customer-only.

**Implication:** Priority 1 **localisation** includes **Docs/rendering** and secure **candidate document** intake.

**Representative quotes:**

> P3: “It would just be squares rather than the actual characters.”

> P1: “If candidates can upload it on the system… confidentiality.”

---

### Theme 7: Career site and recruiting marketing (tension with Q2 strategy)

**Description:** Strong desire for **branded career experience** and richer **marketing** journeys; conflicts with **Q2 de-prioritisation** of career site redesign and recruiting marketing automation.

**Evidence:** **P2** explicit.

**Triangulation:** Customer-only.

**Implication:** For **120**, score **Business Impact** lower unless tied to packaged Paradox path or Q3; still capture **Customer Impact** as high for this participant set.

---

## Recommendations for Primary Research Slides

**For 120 / 130 – SECTION 03: Primary Research**

**Slide 1: Interview Participants**

- Table: P1–P3 with role and company (as above).

**Slides 2–4: One slide per participant**

- P1: Compliance + WhatsApp + scheduling + dashboards + offers (2–3 short quotes).
- P2: Grid + search + AI + scheduling + career site + mobile + nationalisation OOTB.
- P3: Reporting/PowerBI + Arabic Docs + franchise + channel policy + HiredScore.

**Slide 5: Key Themes from User Research**

- Bullets: Compliance/scheduling rules; omnichannel (with policy caveat); grid/search/AI; scheduling parity; reporting; offers/docs/Arabic; career site tension.

---

## Opportunity Solution Tree (sketch for 200 / 120)

- **Outcome:** Faster, compliant hiring in GCC with fewer offline workarounds and higher recruiter NPS.
- **Opportunities:** Regulatory scheduling and panels; channel fragmentation; candidate data scattered in email; weak funnel visibility; offer/doc localization; career site fragmentation.
- **Solution directions (illustrative):** Native compliance-aware scheduling; WhatsApp/SMS with governance; in-product document requests; Arabic-safe document generation; improved grid and search; AI matching with explainability; career site roadmap alignment (Q3+).

---

## Limitations

- **n=3**; not statistically representative of all GCC tenants.
- **P3** is globally oriented; GCC-specific signal is **franchise / localization** weighted, not volume hiring.
- No internal SME transcripts this run; triangulation is **customer-only**.

---

*End of 105 findings. Next handoff: **120** should re-read the same transcript paths per Phase 1 and link `## 105 inputs (this run)` to this file.*
