# RICE Prioritization Skill

Applies RICE (Reach, Impact, Confidence, Effort) scoring framework with dual-dimension Impact scoring for Workday Recruiting product prioritization.

## When to Use This Skill

Use when you need to:
- Score product initiatives or features using RICE methodology
- Prioritize backlog items or roadmap recommendations
- Compare multiple feature options quantitatively
- Apply strategic alignment (Business Impact) + customer pain (Customer Impact) scoring

Trigger via: `/rice` command or when agent rules reference RICE scoring

## Dual-Dimension Impact Scoring Framework

**Traditional RICE** uses single Impact dimension (0.25 to 3.0 scale). **Enhanced RICE** for strategic products uses **two dimensions**:

1. **Business Impact**: Alignment with business strategy and priorities
2. **Customer Impact**: Severity of customer pain or value delivered

**Composite Impact** = (Business Impact + Customer Impact) / 2

**RICE Score** = (Reach × Composite Impact × Confidence%) / Effort

### Business Impact (Strategy Alignment)

| Score | Criteria | Example |
|-------|----------|---------|
| 3.0 | Strategic Priority | Directly addresses Q2 Priority 1-2; board-level OKR |
| 2.0 | Strong Alignment | Supports strategic theme; enables priority initiative |
| 1.0 | Neutral | Doesn't conflict; general improvement |
| 0.5 | Weak Alignment | Low priority area; minor benefit |
| 0.25 | Misaligned | Conflicts with strategy; diverts from priorities |

**Source**: Strategic context (from 099-product-strategist Strategy Context), OKRs, quarterly priorities

**Example**: WhatsApp messaging for GCC when "GCC Market Readiness" is Q2 Priority 1 → Business Impact = 3.0

### Customer Impact (Pain Severity / Value)

| Score | Criteria | Evidence |
|-------|----------|----------|
| 3.0 | Critical Pain | Blocks workflows; causes escalations; customer churn risk |
| 2.0 | Significant Pain | Major inefficiency; frequent complaints; competitive gap |
| 1.0 | Moderate Pain | Noticeable friction; occasional mentions; nice-to-have |
| 0.5 | Minor Pain | Edge case; low frequency; small inconvenience |
| 0.25 | Low Value | Speculative; no evidence; "might be nice" |

**Source**: Customer interviews (105-user-researcher), PMF analysis (120), support tickets, customer feedback

**Example**: Candidate duplicate management causing 20 min/day waste for recruiters → Customer Impact = 2.0

### Composite Impact Calculation

**Formula**: Composite Impact = (Business Impact + Customer Impact) / 2

**Examples**:
- Business 3.0, Customer 3.0 → Composite 3.0 (strategic priority solving critical pain)
- Business 3.0, Customer 1.0 → Composite 2.0 (strategic but moderate customer pain)
- Business 1.0, Customer 3.0 → Composite 2.0 (critical customer pain, not strategic focus)
- Business 0.5, Customer 2.0 → Composite 1.25 (customer pain in low-priority area)

**Strategic Tension Flag**: When |Business - Customer| > 1.0, flag for PM review:
- **High Business, Low Customer** (3.0 vs 1.0): Strategy-driven but unvalidated
- **High Customer, Low Business** (3.0 vs 1.0): Real pain but misaligned with strategy

## RICE Components

### Reach

**Definition**: Number of users/customers affected per time period (typically quarterly).

**Measurement**:
- **Users**: Count of recruiters, hiring managers, or candidates affected
- **Customers**: Count of Workday tenants affected
- **Transactions**: Count of jobs, applications, or hires affected per quarter

**Examples for Workday Recruiting**:
- WhatsApp messaging for GCC: 2,000 recruiters across 15 GCC customers
- Candidate duplicate management: 5,000 recruiters globally
- Two-step offer for Japan: 500 recruiters in 20 Japan tenants

**Sources**: Customer base data, user analytics, regional adoption estimates

### Impact (Composite)

**See Dual-Dimension Impact Scoring above.**

**Formula**: (Business Impact + Customer Impact) / 2

### Confidence

**Definition**: Certainty in Reach, Impact, and Effort estimates (expressed as percentage).

| Confidence | Criteria | Evidence |
|------------|----------|----------|
| 100% | Certainty | Live data, validated in production, exact measurements |
| 80% | High | Validated with 3+ customers, strong evidence, similar features |
| 50% | Medium | 1-2 customer validations, analogous features, assumptions documented |
| 30% | Low | Speculative, no validation, significant unknowns |

**Workday Recruiting Examples**:
- Feature validated with 5 GCC customers in PMF research → 80%
- Similar feature to one already shipped → 80%
- New market with 1 interview → 50%
- Unvalidated hypothesis from internal brainstorm → 30%

### Effort

**Definition**: Total person-months to design, build, test, and ship (Engineering + Design + PM).

**Estimation Guidelines**:
- **Small** (1-2 pm): Minor UI change, simple config, single-screen feature
- **Medium** (3-5 pm): Multi-screen feature, moderate backend, integration
- **Large** (6-12 pm): Complex workflow, new architecture, multiple systems
- **X-Large** (13+ pm): Platform capability, major refactor, multi-quarter

**Include**:
- Engineering (backend + frontend)
- Design (UX + UI + prototyping)
- PM (specs, coordination, testing)
- QA (test planning + execution)

**Workday Context**: Account for Workday release cycles (quarterly) and compliance/security reviews.

## RICE Scoring Examples (Workday Recruiting)

### Example 1: WhatsApp Messaging for GCC

- **Reach**: 2,000 GCC recruiters (across 15 customers)
- **Business Impact**: 3.0 (Q2 Priority 1 - GCC Market Readiness)
- **Customer Impact**: 3.0 (critical pain, validated in 5 interviews, 85%+ WhatsApp usage)
- **Composite Impact**: (3.0 + 3.0) / 2 = 3.0
- **Confidence**: 70% (validated with 5 customers, but integration complexity)
- **Effort**: 5 person-months (Paradox integration, compliance, testing)

**RICE Score**: (2,000 × 3.0 × 0.70) / 5 = **840**

### Example 2: Interview Scheduling Automation (Global)

- **Reach**: 10,000 recruiters globally
- **Business Impact**: 2.0 (supports efficiency theme, not top priority)
- **Customer Impact**: 2.0 (significant pain, frequent mention, competitive gap)
- **Composite Impact**: (2.0 + 2.0) / 2 = 2.0
- **Confidence**: 80% (Paradox integration available, validated)
- **Effort**: 3 person-months (Paradox config, calendar integration, UI)

**RICE Score**: (10,000 × 2.0 × 0.80) / 3 = **5,333**

### Example 3: Career Site Redesign (Global)

- **Reach**: 50,000 candidates per quarter (indirect user impact)
- **Business Impact**: 0.5 (explicitly de-prioritised in Q2)
- **Customer Impact**: 1.0 (moderate pain, occasional mentions, aesthetic issue)
- **Composite Impact**: (0.5 + 1.0) / 2 = 0.75
- **Confidence**: 50% (no validation, aesthetic preferences vary)
- **Effort**: 8 person-months (large UX redesign, brand integration, mobile)

**RICE Score**: (50,000 × 0.75 × 0.50) / 8 = **2,344**

**Strategic Tension Flag**: Business 0.5 vs Customer 1.0 (divergence 0.5, below 1.0 threshold - no flag needed but note de-prioritisation)

## RICE Output Format

When scoring recommendations, use this format:

```markdown
### [Feature Name]

**RICE Breakdown:**
- **Reach**: [N] [users/customers/transactions] in [region/segment]
- **Business Impact**: [Score] - [Rationale: strategic priority, OKR alignment, competitive positioning]
- **Customer Impact**: [Score] - [Rationale: pain severity, evidence from interviews/PMF research]
- **Composite Impact**: ([Business] + [Customer]) / 2 = **[Composite]**
- **Confidence**: [%] - [Validation source: PMF research, customer feedback, pilot data]
- **Effort**: [N] person-months ([breakdown: eng X pm, design Y pm, PM Z pm])

**RICE Score**: ([Reach] × [Composite Impact] × [Confidence]) / [Effort] = **[Score]**

**Strategic Tension**: [Flag if |Business - Customer| > 1.0]
```

## Prioritization Guidelines

### RICE Score Thresholds (Workday Recruiting context)

| RICE Score | Priority | Action |
|------------|----------|--------|
| >800 | High | Roadmap Q1-Q2; strong business case |
| 400-800 | Medium | Roadmap Q3-Q4; monitor for priority shifts |
| 200-400 | Low | Backlog; revisit with new evidence |
| <200 | Defer | Unlikely to prioritize; needs stronger case |

### Strategic Tension Resolution

When Business Impact and Customer Impact diverge by >1.0:

**High Business, Low Customer** (e.g., 3.0 vs 1.0):
- **Risk**: Building features customers don't need (strategy-driven vanity project)
- **Action**: Validate with customer research; adjust Business Impact if strategy misaligned

**High Customer, Low Business** (e.g., 3.0 vs 1.0):
- **Risk**: Solving pain that doesn't support business goals
- **Action**: Discuss with PM; may still prioritize if churn risk or competitive threat

## Integration with Other Agents

This skill is used by:
- **099-product-strategist**: Provides Business Impact scoring rubric in Strategy Context
- **100-market-intelligence**: Scores market opportunity recommendations
- **101-competitive-intelligence**: Prioritizes feature gaps
- **105-user-researcher**: Scores research findings
- **120-pmf-thematic-analysis**: Scores all roadmap recommendations with dual-dimension Impact
- **200-prd-writer**: Includes RICE score in PRD business case
- **400-backlog-refinement**: Prioritizes epics and stories

## Best Practices

### Always ✅
- **Score all dimensions**: Don't skip Business or Customer Impact
- **Show your work**: Explain rationale for each score with evidence
- **Cite sources**: Reference strategic docs for Business, research for Customer
- **Be honest about confidence**: Don't inflate to justify pet features
- **Include effort breakdown**: Separate eng, design, PM estimates
- **Flag tensions**: Call out Business vs Customer divergence

### Never ❌
- Use single-dimension Impact (always use Composite)
- Guess Reach without data (use customer base, analytics, estimates)
- Score confidence >80% without validation (3+ customers or live data required)
- Forget Effort includes design + PM + QA (not just engineering)
- Prioritize by Impact alone (use full RICE score)
- Ignore strategic tension flags

---

**Remember**: RICE is a framework, not a formula. Scores inform decisions but don't replace judgment. When Business and Customer Impact align (both high or both low), confidence is higher. When they diverge, deeper PM discussion is needed.
