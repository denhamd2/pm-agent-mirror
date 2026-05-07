# UX Quality Checklist (Workday Recruiting)

**Source**: Adapted from Workday's internal RAD UX Checklist (v1.0, January 2025), authored by the Research, Analytics, and Design (RAD) Operations team. Re-contextualised for Workday Recruiting prototype and PRD work in this workspace.

**Scope**: Used by [`315-design-brief-creation.mdc`](../../.cursor/rules/315-design-brief-creation.mdc) while producing the Design Brief and by [`318-design-peer-reviewer.mdc`](../../.cursor/rules/318-design-peer-reviewer.mdc) while reviewing it. Items marked with `*` are RAD Requirements (must-do).

**How to use**:
- 315 PASS 1 → read the **Concepts** phase checklist
- 315 PASS 2 → read the **Low Fidelity** and **High Fidelity** phase checklists
- 318 PASS 1 → use the **Topic-indexed appendix** as additional review lenses (Accessibility, E&I, Globalisation)

---

## Phase 1: Concepts

The squishy space between the PRD and the first mockups. Used by 315 PASS 1.

### Accessibility*

- Familiarise yourself with Workday accessibility standards.
- **Consider extreme scenarios** — what happens at the edges?
  - Zero vs infinity (no candidates vs 10,000 candidates)
  - 10 uploads vs 1 million applications
  - 1 attachment vs 1,000 attachments
  - Especially relevant for Recruiting: fraudulent bot applications, mass purges, high-volume requisitions.

### Canvas*

- Canvas Kit is mandatory for all bespoke work. In this workspace, Canvas Kit discovery is handled by **`user-canvas-kit-mcp`** (`get-canvas-kit-tokens`). See [`320-prototype-developer.mdc`](../../.cursor/rules/320-prototype-developer.mdc) and the Canvas Kit section of [`095-design-advisory-standards.md`](../../.cursor/rules/advisory-methods/095-design-advisory-standards.md).
- Review existing recruiter patterns in `design/references/recruiter-flow/` and the pattern libraries (`pattern-hired-score-grid.md`, `pattern-candidate-smart-view.md`) before designing anything bespoke.

### Content & Structure

- Consider a **Content Early** approach — design the text before the UI, not after.
- Contextualise the product or feature. Does it belong in an existing hub? Does it share content with something else?
- Compare the product/feature name to others across Workday Recruiting. Good names are distinct, clear, and plain-language.

### Equity & Inclusion*

- **Consider people with disabilities** across four dimensions: physical, cognitive, developmental, and the permanent / temporary / situational axis (Microsoft Inclusive Design Spectrum).
- **Explore unhappy paths and misuse.** How could this feature be abused? By candidates? By internal users? By a bad actor with admin access?
- **Consider how the data could be used against the person.** Who can see it? How is it stored? What happens if it leaks?
- **Deliberately decide who you are including vs excluding** — and be able to explain the choice.
- **Provide authentic representation** where relevant: relationship status, gender expression, race, nationality. Don't force US-centric defaults.
- For AI/ML features, consider whether the technology choices could entrench systemic bias. Reference Workday's AI Risk Evaluation if the feature uses HiredScore, Paradox, or other AI.

### Globalisation*

- Familiarise yourself with internationalisation best practices. Workday Recruiting ships globally; default to "will this work in French / German / Japanese / Arabic?" during concepting, not at the end.

### Native Mobile (candidate-facing only)

- Recruiter flows in this workspace are desktop-first. If the concept touches the **External Career Site** or **Workday Mobile** candidate experience, consider mobile and device capabilities (gestures, location, push, camera, voice).

### UX Process*

- Review the design process — know which stage you're in.
- Create a **Design Brief** (315 produces this via its multi-pass workflow).
- Evaluate the existing experience. If the feature replaces or extends an existing Workday screen, describe what's there today and why it's not sufficient.
- **Understand your users and their JTBD.** Read [`docs/jtbd-recruiting-hr-professional-and-manager.md`](../../docs/jtbd-recruiting-hr-professional-and-manager.md) and match the feature to a specific job.

---

## Phase 2: Low Fidelity

Room to play with ideas before locking in. Used by 315 PASS 2.

### Accessibility*

- **Provide keyboard and touch equivalents** for any mouse-based interaction. On-hover content must be reachable without a mouse.
- **Provide keyboard and point-and-click equivalents** for drag-and-drop. Lists should be reorderable with a button.
- **Avoid ableist or device-dependent language**: don't write "click here", "the red button", "on the left", "in the lower right corner".
- **H1 + sequential headings.** Every page has exactly one H1. Headings are meaningful, sequential, and don't skip levels. Modals and dialogs have an H2 describing their content.
- **All modals have a visible dismiss control** — on desktop and mobile. Modals cannot be closed only by swiping.
- **All icon-only buttons have a persistent label or tooltip** that shows on hover and focus.
- **Minimum tap area**: 24px × 24px on web/desktop, 48px × 48px on mobile, for all interactive controls (icon buttons, tabs, form controls).

### Canvas*

- Create **responsive versions** of all web/desktop designs. Breakpoints: S: 320px · M: 768px · L: 1024px · XL: 1440px+.
- Ensure you're using the correct Canvas Kit libraries and components (validate via MCP, not from memory).

### Content & Structure

- **Write in the language of the user.** Read it aloud — does it sound human?
- **Embrace clarity** in all UI text. "Save" not "OK". "Unsubscribe" not "Click Here".
- **Use a consistent tone** that matches the rest of the product. Smart and reliable beats cutesy and playful.
- **Create consumable sections** with headers that clearly describe what's in each.
- **Every page element has a clear intent** and serves the page goal.
- **Hierarchy, place, and progress** — users should always know where they are and what happens next. (Note: this workspace does NOT use breadcrumbs; use `Heading` + tabs + metadata per [`010-style-guide.mdc`](../../.cursor/rules/010-style-guide.mdc) Sana Style.)
- **Same-level density**: elements at the same level of navigation contain the same density and depth of information. An individual task should not be at the same level as an overview page.

### Equity & Inclusion*

- **Review against Harm Less UX principles** — biased defaults, jargon, lack of consent and disclosure, unchangeable actions.
- **Enable users to correct their mistakes.** Save draft. Edit submission. Clear error messaging. Destructive actions should be reversible or require explicit confirmation.
- Illustrations should be **easy to understand for all users** — no insider knowledge required.
- **Icons used consistently** across the system. The same icon means the same thing everywhere.

### Globalisation*

- **Test with a pseudo-translation** early. Use the Figma Phrase Plugin or equivalent.
- **Avoid gesture-based imagery.** 👍 is offensive in Islamic countries. 👌 means "worthless" in France. Thumbs-up/down icons are risky globally.
- **Avoid embedding text in images.** Embedded text can't be translated or read by screen readers.
- **Translations affect typography.** Not all languages support bold, italics, underlines, text separators, or plural forms.
- **Avoid frivolous capitalisation and abbreviations.** Some languages don't have capitals or short-forms.
- **Allow text-expansion room**: +35% horizontal and +15% vertical for proper translations (German, Finnish, and Russian typically expand).
- **Use standardised fonts and avoid very small font sizes.** Accented characters (European) and CJK characters can become congested and hard to read below 12pt.

### Native Mobile (candidate-facing only)

- Consider all screen sizes and device types. Phone vs tablet. Landscape vs portrait (iPad only).
- Plan for iOS vs Android platform differences.
- Tappable elements ≥ 48px × 48px.

### UX Process*

- **Discuss technical feasibility with engineering early.** Architecture. QA. Avoid designing something that can't be built without a major refactor.

---

## Phase 3: High Fidelity

Final stage before development. Used by 315 PASS 2 end-of-pass and 318 PASS 1.

### Accessibility*

- **Greyscale test** — check the design in greyscale. If you remove all colour, does the design still convey the same information? This protects colour-blind users.
- **Text colour contrast ≥ 4.5:1** against background. Use the Accessible Color Checker or Web Aim Contrast Checker.
- **Interactive-element boundaries ≥ 3:1** contrast against background. Buttons and inputs must be visually distinguishable without colour alone.
- **Focus-state contrast ≥ 3:1** against both the background and the unfocused state.
- **Form constraints visible.** Required fields clearly marked. Input requirements and formats explained before the user hits submit.
- **All form elements have a visible, unique, descriptive label.** Avoid "Learn More". Avoid repeating labels on the same page.
- **Keyboard support for complex layouts** — dialogs, side panels, menus, split-views. Can you switch split-view panes with a keyboard? Where is focus placed when a panel opens?
- **Sticky elements on small screens / zoomed browsers.** Will sticky content obscure primary content at 200% zoom?
- **Font scaling and spacing.** Does text truncate or wrap when the user increases font size? Can hover content be accessed with keyboard when text scales?

### Content & Structure

- Verify all UI text follows [`.cursor/skills/editorial-guidelines/SKILL.md`](../../.cursor/skills/editorial-guidelines/SKILL.md) (invoked by [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc)).
- **Localise dates, times, and numbers** to the user's context. Avoid overly technical formats. Avoid US-centric month/day/year where ISO is clearer.

### Native Mobile (candidate-facing only)

- Form fields use appropriate keyboards (email keyboard for email fields, numeric keyboard for numeric input).
- Provide specs for both iOS and Android phones (and iPad when necessary).
- Complete a mobile rubric assessment if net-new components are introduced.

---

## Topic-Indexed Appendix

An alternative view organised by topic rather than phase. Use this for 318's Accessibility / E&I / Globalisation review lenses.

### 1. Accessibility*

Consolidates all Accessibility items from the three phases. The one-page audit list for 318:

- [ ] Extreme scenarios considered (zero, infinity, high-volume edge cases)
- [ ] Keyboard equivalents for mouse and hover interactions
- [ ] Keyboard and button equivalents for drag-and-drop
- [ ] No ableist / sensory-only language in instructions
- [ ] Exactly one H1; headings sequential and meaningful; modals have H2
- [ ] All modals have a visible dismiss control (desktop and mobile)
- [ ] Icon-only buttons have persistent labels or tooltips
- [ ] Tap targets ≥ 24px web / 48px mobile
- [ ] Greyscale test passed (no information conveyed by colour alone)
- [ ] Text contrast ≥ 4.5:1; interactive boundaries ≥ 3:1; focus ≥ 3:1
- [ ] Required fields and input formats clearly marked
- [ ] All form elements have unique, descriptive labels (no "Learn More")
- [ ] Keyboard support planned for dialogs, side panels, split-views
- [ ] Sticky elements don't obscure content at 200% zoom
- [ ] Font-scaling and spacing-scaling don't truncate or break layout

### 2. Canvas Design System*

Workspace coverage: Canvas Kit is enforced via [`320-prototype-developer.mdc`](../../.cursor/rules/320-prototype-developer.mdc) and the Canvas Kit MCP. See [`095-design-advisory-standards.md`](../../.cursor/rules/advisory-methods/095-design-advisory-standards.md) for the workspace standard. This checklist does NOT duplicate those requirements; it adds:

- [ ] Responsive breakpoints validated (S: 320 · M: 768 · L: 1024 · XL: 1440+)
- [ ] For AI/automated features: Human AI Experience Guidelines considered (disclosure, transparency, confidence)

### 3. Content & Structure

Workspace coverage: [`319-copy-review.mdc`](../../.cursor/rules/319-copy-review.mdc) + `.cursor/skills/editorial-guidelines/SKILL.md` cover voice, tone, and clarity. This checklist adds:

- [ ] Content Early approach considered during concepting (text before UI, not after)
- [ ] Product/feature name is distinct, clear, plain-language vs others in the system
- [ ] Same-level density: elements at the same navigation level carry the same information depth
- [ ] Dates, times, numbers localised to user context (no hard-coded MM/DD/YYYY)

### 4. Equity & Inclusion*

- [ ] Microsoft Inclusive Design Spectrum applied (physical / cognitive / developmental × permanent / temporary / situational)
- [ ] Unhappy path and misuse explored (bot activity, abuse, coercion, data leak)
- [ ] Data-against-the-person analysis: who can see it, how it's stored, what if it leaks
- [ ] Inclusion vs exclusion decision is deliberate and explainable
- [ ] Authentic representation: relationship status, gender expression, race, nationality (where relevant) — no US-default-only
- [ ] AI Risk Evaluation referenced if the feature involves AI/ML (HiredScore, Paradox, etc.)
- [ ] Reviewed against Harm Less UX principles (biased defaults, jargon, lack of consent, unchangeable)
- [ ] Users can correct mistakes — save draft, edit submission, clear error messaging
- [ ] Illustrations understandable without insider knowledge
- [ ] Icons used consistently — same icon, same meaning, everywhere

### 5. Globalisation*

- [ ] Designs tested with pseudo-translation (Figma Phrase Plugin or equivalent)
- [ ] No gesture-based imagery (thumbs-up, OK sign, culturally loaded hand icons)
- [ ] No embedded text in images (translations break, screen readers miss it)
- [ ] Translation impact on typography considered (bold, italics, plural forms)
- [ ] No frivolous capitalisation or abbreviations (some languages lack them)
- [ ] Text expansion allowance: +35% horizontal, +15% vertical
- [ ] Standardised fonts; minimum size respects accented and CJK character legibility

### 6. Native Mobile (candidate-facing only)

Lower priority for this workspace. Include only when the design touches External Career Site or Workday Mobile candidate experience.

- [ ] Mobile capabilities leveraged where appropriate (gestures, location, push, camera, voice)
- [ ] All screen sizes considered (phone, tablet, portrait, landscape)
- [ ] iOS vs Android platform differences planned
- [ ] Touch targets ≥ 48px × 48px
- [ ] Form fields use appropriate mobile keyboards
- [ ] Platform specs provided (Apple HIG, Google Material)
- [ ] Mobile rubric assessment completed for new components

### 7. UX Process*

- [ ] RAD UX Process stage identified
- [ ] Design Brief produced (315 multi-pass)
- [ ] Existing experience evaluated (what's there today, why it's not enough)
- [ ] JTBD defined and validated against `docs/jtbd-recruiting-hr-professional-and-manager.md`
- [ ] Technical feasibility discussed with engineering

---

## Source & Further Reading

- **RAD UX Checklist v1.0** (Workday internal, January 2025) — original source. Authored by Sam Fraser (RAD Operations). Partner teams: Purva Sane (Accessibility), Emily Roller (Canvas), Lisa Ellis (Content & Structure), Sam Fraser (Equity & Inclusion), Manabu Okuhara + Levente Kantor (Globalization), Ivy Lam + Kyle Hegge (Native Mobile), Mari Kunimi + Keta Patel (RAD UX Process).
- **Workday Slack support channels**: `#accessibility`, `#product-equity-inclusion`, `#ask-globalization`, `#ask-mobile`, `#ask-canvas-design`, `#ask-wd-researchers`, `#rad-ops-support`.
- **Workday internal references**: Harm Less UX (go/harmless), Digital Accessibility at Workday, Designing for Global Audiences, Canvas Design System, Canvas Versioning, Workday Pattern Library, Human AI Experience Guidelines, Workday AI Risk Evaluation, UX Principles Evaluation, Microsoft Inclusive 101 Guidebook.

---

*This is a living document. Update it as the RAD checklist evolves (typically Q1 refresh). Version: 1.0 (workspace-adapted), May 2026.*
