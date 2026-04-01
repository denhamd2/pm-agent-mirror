---
description: PM frameworks and best practices reference for advisory work
globs:
  - ".cursor/rules/090-agent-improvement-advisor.mdc"
  - ".cursor/rules/200-prd-template.mdc"
  - ".cursor/rules/315-design-brief-creation.mdc"
alwaysApply: false
---

# PM Best Practices Reference

This section provides deep knowledge of modern Product Management frameworks, methodologies, and best practices. Use these to inform advisory work and recommendations.

## Available Framework Skills

For detailed procedural guidance on specific frameworks, use these skills:
- **RICE Prioritization**: `/rice` - Dual-dimension impact scoring with Reach, Impact, Confidence, Effort
- **JTBD Analysis**: `/jtbd` - Jobs-to-Be-Done framework for outcome-driven thinking
- **Thematic Analysis**: `/thematic` - Braun & Clarke 6-phase qualitative analysis method
- **Editorial Guidelines**: `/editorial` - Workday terminology and copy standards

## Framework Overviews

### Jobs to Be Done (JTBD)
Frame problems around customer jobs, not features.
- **Core concept**: People "hire" products to get a job done
- **Structure**: "When [situation], I want to [motivation], so I can [outcome]"
- **Example for Recruiting**: Instead of "Add bulk actions", think "When recruiters need to update 50 requisitions at once after a budget freeze, they want to make changes in bulk so they can save 2 hours of manual work"
- **Application**: Use JTBD to structure PRDs, customer research, and feature prioritization
- **Key insight**: Focus on the job, not the customer's suggested solution

### RICE Prioritization
Score initiatives on:
- **Reach**: How many users/workflows affected per quarter (e.g., 5,000 recruiters)
- **Impact**: How much it improves the outcome (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)
- **Confidence**: How confident in estimates (0-100%, use 80% as default, 50% for speculative)
- **Effort**: Person-months to implement (engineering + design + PM)

**Formula**: RICE = (Reach × Impact × Confidence) / Effort

**Example for Recruiting**:
- Feature: WhatsApp candidate messaging for GCC
- Reach: 2,000 recruiters in GCC region
- Impact: 2 (high - solves major communication pain point)
- Confidence: 70% (validated in GCC PMF research)
- Effort: 3 person-months
- **RICE Score**: (2,000 × 2 × 0.70) / 3 = 933

### Continuous Discovery Habits (Teresa Torres)
Modern approach to staying connected to customers:
- **Weekly customer touchpoints**: Talk to 1-3 customers every week (not just quarterly research)
- **Small, frequent research**: 30-minute interviews > big quarterly studies
- **Opportunity solution trees**: Map customer problems (opportunities) to potential solutions
- **Assumption testing**: Identify riskiest assumptions, test them first
- **Involve whole team**: Eng + design + PM observe together
- **Recruiting application**: Weekly calls with recruiters, observe requisition creation, shadow hiring managers

### Outcome-Driven Roadmaps (Melissa Perri, Product Institute)
Focus on outcomes (business or user), not output (features).
- **Bad (Output-focused)**: "Ship bulk actions Q2, Add WhatsApp Q3, Redesign career site Q4"
- **Good (Outcome-focused)**: "Reduce time to fill by 20% (Q2-Q3), Increase offer acceptance in GCC by 15% (Q3), Improve candidate satisfaction by 10 NPS points (Q4)"
- **How to shift**: For each feature, ask "What outcome are we trying to achieve?"
- **Benefits**: Empowers team to find best solutions, focuses on what matters, easier to pivot
- **For Recruiting**: "Improve recruiter efficiency" (outcome) not "Add keyboard shortcuts" (output)

### Data-Informed Decisions (Not Data-Driven)
Use quantitative + qualitative data, but don't let data override judgment:
- **Quantitative**: Tableau dashboards, usage metrics (Lightdash), A/B tests, funnel analysis
- **Qualitative**: User interviews, PMF analysis (@pmf-analyst), usability tests, support tickets
- **Triangulation**: Combine multiple sources for confidence
- **Data-informed ≠ Data-driven**: Data informs, humans decide (especially for new markets, edge cases, strategic bets)
- **Recruiting example**: High usage of a feature (quant) + recruiters complaining it's confusing (qual) = redesign needed

### North Star Metric (Amplitude, Product-Led Growth)
One metric that represents core product value:
- **For consumer**: Daily active users, time to value, activation rate
- **For enterprise (like Workday)**: Active users, feature adoption, time to hire (for Recruiting)
- **Characteristics**: Measures value delivery, actionable, leading indicator
- **Recruiting North Star examples**: Time to fill, offer acceptance rate, candidate satisfaction
- **Avoid vanity metrics**: Total users, total job postings (doesn't indicate value)

### Product-Market Fit (PMF)
Understanding when your product solves a real problem:
- **Sean Ellis test**: "How disappointed would you be if this product went away?" >40% "very disappointed" = PMF
- **Qualitative signals**: Customers pull you (not push), word-of-mouth growth, clear value prop resonates
- **PMF by segment**: May have PMF in one market (e.g., US tech) but not another (e.g., GCC healthcare)
- **For Recruiting**: Use @pmf-analyst to assess PMF by country/region
- **Pre-PMF vs Post-PMF**: Pre = iterate quickly, talk to users constantly; Post = scale, optimize, expand

### Opportunity Solution Trees (Teresa Torres)
Visual framework connecting outcomes to solutions:
- **Top**: Desired outcome (e.g., "Reduce time to fill by 20%")
- **Middle**: Opportunities (customer problems/needs that could drive outcome)
- **Bottom**: Solutions (features/changes that address opportunities)
- **How to build**: Start with outcome, do discovery to find opportunities, brainstorm solutions per opportunity
- **Benefit**: Shows why each solution matters, easier to prioritize, visualizes strategy
- **Recruiting example**: Outcome "Faster hiring" → Opportunities "Req approval delays", "Candidate ghosting", "Interview scheduling friction" → Solutions per opportunity

### Now-Next-Later Roadmap
Alternative to date-based roadmaps:
- **Now**: Actively working on this quarter
- **Next**: Committed to next quarter, specs in progress
- **Later**: Exploring, researching, not committed
- **Benefits**: Reduces date pressure, easier to reprioritize, focuses on sequence not deadlines
- **Enterprise reality**: Often need date commitments for contracts, but use Now-Next-Later internally

### The Three Levels of Why (Inspired by Simon Sinek)
For each feature or initiative, answer three levels:
1. **Why for the customer**: What job does this solve? What outcome do they get?
2. **Why for the business**: What metric does this improve? How does it drive revenue/retention?
3. **Why now**: Why is this the right time? What changed? What's the urgency?
- **Application**: Use in PRDs, stakeholder presentations, prioritization discussions
- **Recruiting example**: WhatsApp messaging → (1) Recruiters need to reach GCC candidates where they are, (2) Improves response rates = faster time to hire = revenue growth, (3) GCC expansion is strategic priority + PMF research validated need

### Kano Model (Feature Prioritization)
Categorize features by customer delight:
- **Basic/Must-Have**: Expected, absence causes dissatisfaction (e.g., search functionality)
- **Performance**: More is better, linear satisfaction (e.g., faster load times)
- **Delighters**: Unexpected, cause joy, differentiation (e.g., AI-suggested interview questions)
- **Application**: Don't over-invest in basics, balance performance + delighters
- **Over time**: Delighters become performance, then basics (e.g., mobile used to be delighter)

### Story Mapping (Jeff Patton)
Visual planning technique for releases:
- **Horizontal**: User journey steps (e.g., "Post job" → "Review candidates" → "Interview" → "Make offer")
- **Vertical**: Features/stories for each step, prioritized top to bottom
- **Releases**: Horizontal slices across the map (MVP = top row, V2 = second row, etc.)
- **Benefit**: Ensures coherent user experience, avoids building disconnected features
- **Recruiting application**: Map entire hiring workflow, ensure each release improves end-to-end flow

### OKRs (Objectives & Key Results)
Goal-setting framework (Google, Intel):
- **Objective**: Qualitative, inspirational (e.g., "Become the #1 ATS for enterprise recruiting")
- **Key Results**: Quantitative, measurable (e.g., "Increase NPS from 45 to 60", "Reach 50% market share in F500")
- **Characteristics**: Ambitious (60-70% achievement is good), time-bound (quarterly or annual), company/team/individual levels
- **Product application**: Align roadmap to company OKRs, define product-specific OKRs
- **Common mistakes**: Too many (3-5 max), not measurable, sandbagging (too easy)

### Dual-Track Agile (Marty Cagan, Inspired)
Separate discovery from delivery:
- **Discovery track**: Research, prototyping, validation (answer "should we build this?")
- **Delivery track**: Building, testing, shipping (execute on validated ideas)
- **Run in parallel**: While eng builds validated features, PM/design validate next features
- **Benefit**: De-risks roadmap, faster learning, better product decisions
- **Enterprise application**: Heavier discovery for compliance/global features, lighter for optimizations

### The Mom Test (Rob Fitzpatrick)
How to do customer research without getting false positives:
- **Bad questions**: "Would you use this feature?" (leads to polite lies)
- **Good questions**: "Tell me about the last time you tried to [do job]" (real stories reveal truth)
- **Rules**: Talk about past behavior (not future intentions), listen more than pitch, ask about their life (not your idea)
- **Recruiting application**: "Tell me about the last req you had to close" reveals real pain points better than "Would you like bulk actions?"

### Product-Led Growth (PLG)
Product itself drives acquisition, conversion, expansion:
- **Characteristics**: Self-service signup, value before payment, viral loops, usage-based pricing
- **Enterprise PLG**: Freemium for individuals, convert team/department, land-and-expand
- **Not applicable to Workday**: But understand it for competitive analysis (Greenhouse, Lever use PLG)

### Enterprise SaaS Product Management (Workday Context)

**Unique Characteristics:**
- **Long sales cycles**: 6-12 months, multi-stakeholder buying committees
- **Complex implementations**: 3-6 month deployments, professional services involved
- **High switching costs**: Once adopted, customers rarely leave (but hard to win)
- **Quarterly releases**: Predictable cadence, customers plan upgrades
- **Global compliance**: GDPR, localization, security certifications critical
- **Customer success driven**: Retention > acquisition, NPS and expansion revenue key

**PM Implications:**
1. **Roadmap communication**: Customers plan 12-18 months ahead, need visibility
2. **Backward compatibility**: Breaking changes = angry customers, avoid if possible
3. **Feature flags**: Gradual rollout, tenant-level controls, opt-in for risky features
4. **Customer advisory boards**: Enterprise customers expect input, use for validation
5. **Competitive positioning**: Win on workflow depth, integrations, compliance (not flashy UI)
6. **"Land and expand"**: Start with recruiting, expand to HCM, then talent, then payroll

**Recruiting-Specific PM Practices:**
- **High-volume scenarios**: Features must work for 10,000 reqs/year, not just 100
- **Hiring manager experience**: Separate persona from recruiter, simpler UX, fewer features
- **Candidate experience**: B2B2C model (enterprise buys, candidates use), balance both
- **Compliance-first**: GDPR right-to-be-forgotten, EEOC reporting, background check regulations
- **Integrations**: Job boards (LinkedIn, Indeed), background checks (HireRight, Checkr), video (HireVue)
- **Mobile-critical**: Recruiters + hiring managers + candidates all need mobile

**Common Enterprise PM Pitfalls to Avoid:**
- ❌ Ignoring technical debt (compounds quickly at scale)
- ❌ Building for one large customer (creates Frankenstein product)
- ❌ Underestimating compliance work (GDPR, accessibility, security)
- ❌ Skipping global validation (what works in US fails in Germany/Japan/GCC)
- ❌ Over-customization (customers demand it, but kills scalability)
