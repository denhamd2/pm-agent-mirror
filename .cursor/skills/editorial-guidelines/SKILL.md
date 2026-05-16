# Editorial Guidelines Skill

Applies Workday's Editorial Guidelines and product terminology standards for all user-visible copy (UI labels, buttons, errors, help text, tooltips, empty states, confirmations).

## When to Use This Skill

Use when you need to:
- Review UI copy for consistency with Workday terminology
- Validate button labels, form field labels, error messages
- Check documentation, help text, or in-app guidance
- Ensure copy in prototypes, PRDs, or Jira stories follows standards

Trigger via: `/editorial` command or when reviewing UX copy (319-doc-writer, 430-story-writing)

## Core Editorial Principles

### 1. Clarity Over Cleverness
- Use plain language, avoid jargon
- One idea per sentence
- Active voice preferred
- Specific, not vague ("Save changes" not "Proceed")

### 2. Consistency with Workday Terminology
- Use established Workday product terms (see Product Terminology section)
- Match capitalization patterns from existing Workday UI
- Align with Workday Help documentation

### 3. User-Focused Language
- Address user directly ("You have 3 pending actions")
- Avoid system-centric language ("System error" → "We couldn't save your changes")
- Explain impact to user ("This requisition will be closed" not "Status will change to Closed")

### 4. Action-Oriented
- Buttons: Start with verb ("Create Requisition" not "New Requisition")
- Links: Describe destination ("View candidate profile" not "Click here")
- Errors: Tell user what to do ("Check your internet connection" not "Network error occurred")

### 5. Concise but Complete
- Remove filler words ("Please", "Kindly", "In order to")
- Keep labels <3 words when possible
- Error messages: State problem + action in 1-2 sentences

## Product Terminology (Workday Recruiting)

### Correct Terms (Always Use These)

| Correct Term | Incorrect Terms (Avoid) | Context |
|--------------|------------------------|---------|
| **Requisition** | Job Req, Opening, Position, Vacancy | Use for job opening |
| **Candidate** | Applicant, Prospect | Use for person applying |
| **Job Application** | Application, Submission | Use for candidate's application |
| **Talent Pool** | Talent Pipeline, Candidate Database | Use for saved candidates |
| **Hiring Manager** | Manager, HM | Person hiring for the role |
| **Recruiter** | Recruitment Specialist, TA Partner | Person managing requisition |
| **Interview** | Screening Call, Chat | Formal evaluation meeting |
| **Offer** | Job Offer, Offer Letter | Employment offer |
| **Onboarding** | New Hire Process | Post-offer, pre-start |
| **Background Check** | BGC, Screening | Third-party verification |
| **Job Posting** | Job Ad, Listing | External-facing job description |
| **Career Site** | Careers Page, Jobs Portal | External candidate-facing website |
| **Sourcing** | Candidate Search, Hunting | Proactive candidate finding |
| **Pipeline** | Funnel, Candidates in Process | Candidates at various stages |

### Capitalisation Standards

**Policy**: **Sentence case everywhere** — page titles, section headings, buttons, links, field labels, help text, body text, empty states, error messages, confirmations. This matches [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc) Core Principle and the Canvas Content Style Guidelines.

**Only exceptions** (capitalise first letter):

1. **Proper nouns** — personal names, place names ("Sarah Chen", "Dublin").
2. **Product names** — "Workday", "Workday Recruiting", "HiredScore", "Paradox", "Canvas Kit", "Ask Workday".
3. **Named objects when they start a sentence or stand alone as a page title** — "Candidate profile" (sentence case), "Requisition details" (sentence case). Only the first word is capitalised; the noun itself is not title-cased.
4. **Acronyms and initialisms** — "GDPR", "SSO", "API", "PWD" (spell out on first use).
5. **Quoted system state names** — where the UI surfaces a literal status value that has an intentional proper-noun style (e.g. status workflow names exported from Workday configuration). Prefer lowercase unless the tenant configuration forces otherwise.

**Examples** (correct):

| Element | Correct (Sentence case) | Incorrect (Title Case) |
|---|---|---|
| Page title | "Candidate profile" | "Candidate Profile" |
| Page title | "Requisition details" | "Requisition Details" |
| Button | "Save changes" | "Save Changes" |
| Button | "Send email" | "Send Email" |
| Button | "Move to screen" | "Move to Screen" |
| Field label | "Start date" | "Start Date" |
| Section heading | "Job requisitions" | "Job Requisitions" |
| Body text | "You have 3 pending requisitions." | "You Have 3 Pending Requisitions." |

**Product-name exception in action**:

- "Create Workday Recruiting requisition" — "Workday Recruiting" is a product name (title-cased), "requisition" stays lowercase.
- "Ask Workday" — product name, both words capitalised because it is the product's canonical name.
- "Rank with HiredScore" — "HiredScore" is a product name; "rank" stays lowercase.

**Workday terminology** — the Product Terminology table above specifies which terms are standalone nouns. In copy, apply Sentence case to all Workday terms unless they are the first word or embedded in a product name:

- "View requisition" (not "View Requisition")
- "5 candidates applied" (not "5 Candidates applied")
- "Hiring manager feedback" when used as a section heading: "Hiring manager feedback" (sentence case)

## Editorial Guidelines Checklist

Use this checklist when reviewing UX copy:

### Labels & Buttons
- [ ] Button labels start with verb (Create, Save, Send, Cancel)
- [ ] Labels are <3 words when possible
- [ ] Terminology matches Workday standards (see Product Terminology)
- [ ] Capitalisation follows **Sentence case** (only first word + proper nouns / product names capitalised — see Capitalisation Standards above)
- [ ] No jargon or abbreviations without explanation
- [ ] Consistent with existing Workday UI patterns

### Error Messages
- [ ] States the problem clearly
- [ ] Tells user what action to take
- [ ] Avoids blame ("We couldn't save" not "You entered invalid data")
- [ ] Provides next step or workaround
- [ ] Uses plain language (no error codes in primary message)
- [ ] Format: [Problem]. [Action]. Optional: [Why/Details]

**Error Message Examples**:

**Bad**: "Error 500. Contact administrator."
**Good**: "We couldn't save your changes. Check your internet connection and try again."

**Bad**: "Invalid input in field 'req_approval_date'"
**Good**: "Approval date must be after the requisition start date. Update the date and try again."

### Help Text & Tooltips
- [ ] Explains purpose or benefit (not just restatement of label)
- [ ] Provides example when helpful
- [ ] Links to full documentation for complex features
- [ ] <2 sentences for tooltips
- [ ] Uses "you" and "your" (user-focused)

**Help Text Examples**:

**Bad (restates label)**: "Job title: Enter the job title"
**Good (explains purpose)**: "Job title: This appears on your career site and in search results. Use specific, searchable terms like 'Senior Software Engineer' instead of 'Code Ninja'"

### Empty States
- [ ] Explains why empty ("No candidates match your filters" not "No results")
- [ ] Provides action to get started ("Post a requisition to start hiring")
- [ ] Uses friendly, encouraging tone
- [ ] Avoids technical jargon

**Empty State Examples**:

**Bad**: "No data available"
**Good**: "You don't have any active requisitions yet. Create a requisition to start hiring."

### Confirmations & Success Messages
- [ ] Confirms what happened ("Requisition created")
- [ ] Tells user what's next ("Candidates can now apply")
- [ ] Uses positive, active language
- [ ] Dismissible or auto-dismisses

**Confirmation Examples**:

**Bad**: "Operation completed successfully"
**Good**: "Offer sent to Sarah Chen. You'll be notified when she responds."

### Accessibility (WCAG 2.1 AA)
- [ ] Link text describes destination (no "click here")
- [ ] Error messages associated with form fields (aria-describedby)
- [ ] Button text describes action (no icon-only buttons without labels)
- [ ] Color not the only indicator (use icons + text)

## AI-Specific Copy (conditional)

Apply this section **in addition to** the standard guidelines when the copy is user-facing text from an AI feature, agent, chat surface, HiredScore explanation, Paradox flow, or any automated draft / suggestion / error. This mirrors [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc) → AI-Specific Copy Guidance, so both sources stay in sync.

**Authoritative sources**:
- **Live Canvas AI Persona** (Ask Workday Brand Voice): `https://canvas.workdaydesign.com/guidelines/ai-guidance/ai-persona` — evolves; WebFetch for canonical copy rules.
- **Workspace knowledge doc**: `design/references/ai-experience-guidance.md` → section 9 (Error Handling and Ask Workday Brand Voice) for the structure, DO/DON'T list, and fallback templates.
- **SSA product patterns (visual-first)**: `design/references/ssa-create-req-flow-best-practices.md` — Self-Service Agent demo flows (overlap rationale, payroll-safe corrections, success + side-effect messaging). **`visual-only; narration TBC`** until PM annotates.

### Three-part AI error structure (mandatory)

Every AI-surfaced error must have all three parts:

1. **Problem** — plain language, no error codes. *"I couldn't generate a draft for this role."*
2. **Reason** — specific cause or known limit. *"The requisition is missing a job description field."*
3. **Next steps + action** — what the user does right now. *"Add a short description and try again."* + actionable button.

AI error copy with only 1 or 2 parts → **NEEDS REVISION**.

### Fallback copy (mandatory)

Every AI surface must have an explicit fallback string for when the model is unavailable or confidence is too low:

> *"I can't help with that right now. You can [human alternative] or try again in a moment."*

Missing fallback → **NEEDS REVISION**.

### Disclosure copy (mandatory)

Every AI-generated artefact carries a short automation notice. Location depends on the surface:

- **Inline** (under a draft): *"Drafted with Workday AI — review before sending."*
- **Header** (on a chat): *"Ask Workday is an automated assistant — a human reviews every candidate decision."*
- **Footer** (candidate-facing apply): *"You're chatting with an automated assistant. To speak to a recruiter, type 'talk to a human'."*

Missing or buried disclosure on an AI surface → **NEEDS REVISION**. For candidate-facing disclosure and any consent / privacy / AI-disclosure text, **invoke 060-legal-advisor**.

### Ask Workday Brand Voice — DO / DON'T

**DO**
- Use contractions: *I'm*, *can't*, *it's*, *you're*.
- Speak in first person from the agent: *"I noticed…"*, *"I drafted…"*.
- Be specific: *"3 candidates match"* beats *"several candidates match"*.
- Acknowledge uncertainty: *"Based on the data I have…"*, *"You may want to verify…"*.
- Use British English throughout (workspace default).

**DON'T**
- Use error codes, stack traces, or technical jargon in user-facing copy.
- Apologise repeatedly (*"I'm so sorry"*, *"my apologies"*) — sounds performative.
- Use second-person imperatives that blame the user (*"You entered invalid data"* → *"That input didn't match the expected format"*).
- Overclaim (*"I know exactly what you need"*) — be honest about confidence.
- Invent facts. If you don't know, say so.

## Copy Review Process (for 319-doc-writer)

### Step 1: Extract All UI Copy

From design brief, prototype, or Figma file, list:
- Page titles and section headings
- Button labels and link text
- Form field labels and placeholder text
- Error messages and validation text
- Help text and tooltips
- Empty state messages
- Success/confirmation messages
- Navigation labels

### Step 2: Apply Editorial Checklist

For each piece of copy:
1. Check against Product Terminology table
2. Verify capitalisation (**Sentence case everywhere** except proper nouns and product names — see Capitalisation Standards above)
3. Confirm clarity (no jargon, specific action verbs)
4. Validate tone (user-focused, active voice)
5. Check length (buttons <3 words, errors 1-2 sentences)

### Step 3: Flag Legal-Sensitive Copy (invoke 060-legal-advisor)

**Legal-sensitive copy includes**:
- Consent language ("I agree to receive...")
- Privacy notices ("We collect your data for...")
- AI disclosures ("AI-powered suggestions...")
- Data retention messages ("Your data will be deleted after...")
- Terms of service or policy references

**Action**: Invoke 060-legal-advisor for GDPR/AI Act validation

### Step 4: Provide Approved Revisions

Output format:

```markdown
## Copy Review: [Feature Name]

### Original Copy → Approved Copy

**Button**: "Submit" → "Create requisition"
**Rationale**: Starts with verb; specific action; Sentence case per workspace policy

**Error**: "Invalid date" → "Start date must be in the future. Update the date and try again."
**Rationale**: Explains problem + provides action; user-focused language

**Label**: "Req Title" → "Requisition title"
**Rationale**: Full term (not abbreviation); Sentence case — only the first word is capitalised

### Legal-Sensitive Copy (060 Review Required)

**Consent checkbox**: "I agree to receive SMS updates"
**060 Status**: [Pending review / Approved / Needs revision]
```

## Integration with Other Agents

This skill is used by:
- **319-doc-writer**: Primary user; applies checklist to all UI copy review
- **430-story-writing**: Validates user-visible strings in Jira stories (Description, Acceptance Criteria field when populated, BDD scenarios). Description layout is `## User story` / `## Scenarios` (`### Scenario N:` + tight or extended Gherkin) / optional `## Definition of Ready` — see **430** Step 6; **Acceptance Criteria** field uses a **blank** wiki table grid at create (no prefilled AC rows); AC markdown table never goes in Description.
- **315-design-brief-creation**: References when drafting Copy Inventory in design briefs
- **320-prototype-developer**: Validates copy during implementation

## Best Practices

### Always ✅
- Use Workday product terminology consistently
- Start button labels with verbs
- Explain errors with problem + action
- Write for users, not systems ("You" not "The system")
- Keep copy concise (buttons <3 words, errors 1-2 sentences)
- Flag legal-sensitive copy for 060 review
- Provide specific examples in revisions
- Use British English spelling

### Never ❌
- Use "click here" or "learn more" without context
- Abbreviate without explanation (no "Req" unless established)
- Write system-centric messages ("Error occurred" → "We couldn't save")
- Use jargon or technical terms for user-facing copy
- Ignore capitalisation standards (Sentence case everywhere except proper nouns and product names)
- Use Title Case on buttons, page titles, section headings, or field labels — Sentence case is the workspace policy
- Skip validation for legal/privacy copy
- Mix US and British spelling

---

**Remember**: Great copy is invisible. Users shouldn't notice the words — they should accomplish their jobs smoothly. When copy is unclear, users pause, get confused, or make errors. Use these guidelines to create copy that guides users efficiently through Workday Recruiting workflows.
