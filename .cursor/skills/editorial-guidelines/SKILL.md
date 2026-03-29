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

### Capitalization Standards

| Term | Capitalization | Usage |
|------|---------------|--------|
| **Requisition** | Capital R when standalone, lowercase in "requisition status" | "View Requisition", "3 requisitions" |
| **Candidate** | Capital C when standalone, lowercase in "candidate profile" | "Candidate Details", "5 candidates" |
| **Job Application** | Both capitalized | "Review Job Application" |
| **Interview** | Capital I when standalone, lowercase in "interview notes" | "Schedule Interview", "3 interviews" |
| **Offer** | Capital O when standalone, lowercase in "offer letter" | "Create Offer", "pending offer" |

**Page titles**: Title Case ("Candidate Profile", "Requisition Details")
**Buttons**: Title Case ("Save Changes", "Send Email")
**Body text**: Sentence case ("You have 3 pending requisitions.")
**Field labels**: Sentence case with colon ("Start date:", "Hiring manager:")

## Editorial Guidelines Checklist

Use this checklist when reviewing UX copy:

### Labels & Buttons
- [ ] Button labels start with verb (Create, Save, Send, Cancel)
- [ ] Labels are <3 words when possible
- [ ] Terminology matches Workday standards (see Product Terminology)
- [ ] Capitalization follows Title Case for actions
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

**Bad (restates label)**: "Job Title: Enter the job title"
**Good (explains purpose)**: "Job Title: This appears on your career site and in search results. Use specific, searchable terms like 'Senior Software Engineer' instead of 'Code Ninja'"

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
2. Verify capitalization (Title Case for actions, Sentence case for descriptions)
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

**Button**: "Submit" → "Create Requisition"
**Rationale**: Starts with verb; specific action

**Error**: "Invalid date" → "Start date must be in the future. Update the date and try again."
**Rationale**: Explains problem + provides action; user-focused language

**Label**: "Req Title" → "Requisition Title"
**Rationale**: Full term (not abbreviation); matches Workday standards

### Legal-Sensitive Copy (060 Review Required)

**Consent checkbox**: "I agree to receive SMS updates"
**060 Status**: [Pending review / Approved / Needs revision]
```

## Integration with Other Agents

This skill is used by:
- **319-doc-writer**: Primary user; applies checklist to all UI copy review
- **430-story-writing**: Validates user-visible strings in Jira stories (Description, Acceptance Criteria, BDD scenarios)
- **315-ux-designer**: References when drafting Copy Inventory in design briefs
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
- Ignore capitalization standards (Title Case for actions)
- Skip validation for legal/privacy copy
- Mix US and British spelling

---

**Remember**: Great copy is invisible. Users shouldn't notice the words — they should accomplish their jobs smoothly. When copy is unclear, users pause, get confused, or make errors. Use these guidelines to create copy that guides users efficiently through Workday Recruiting workflows.
