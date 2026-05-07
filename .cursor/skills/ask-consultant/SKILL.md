---
name: ask-consultant
description: Query the #recruiting_functional_consultants Slack archive for Workday consultant best practices, troubleshooting, and configuration guidance. ONLY searches this channel. Prioritizes accuracy - returns "I don't know" rather than speculating when information is not available. Can create comprehensive wiki pages in docs/ with preview and file paths. Use when the user asks about Workday Recruiting consultant knowledge, offers/EA, job applications, or mentions "ask consultant" or "create a wiki".
---

# Ask Consultant

Query the #recruiting_functional_consultants Slack archive for authoritative consultant knowledge on Workday Recruiting configuration, troubleshooting, and best practices.

## PRIMARY DIRECTIVE: Accuracy Above All Else

**This skill operates under an absolute accuracy mandate:**

- **If information is not in #recruiting_functional_consultants, say so clearly**
- **Prefer "I don't know" or "This was not discussed in the channel" over speculation**
- **Never invent procedures, configurations, or workarounds**
- **Only return information directly evidenced in Slack messages**
- **Do not combine partial information into complete procedures unless consultants actually described it that way**

When you cannot find evidence for something the user asked about, use these exact phrases:
- "This topic was not discussed in #recruiting_functional_consultants"
- "I don't know - this was not mentioned in the channel"
- "The consultants did not address this specific scenario"

## What Constitutes Evidence

**Valid Evidence:**
- Direct quotes from consultant messages
- Specific configuration steps described by consultants
- Troubleshooting procedures that consultants confirmed worked
- Known limitations or product behaviours that consultants verified
- Workday support guidance that consultants shared

**NOT Evidence (Do Not Use):**
- Your general knowledge of Workday
- Logical inferences from partial information
- Assumptions about how configurations "should" work
- Extrapolations from similar scenarios
- "Might work" suggestions without consultant confirmation

## When to Use This Skill

Use this skill when:
- User asks about Workday functional consultant knowledge or best practices
- Questions about Offers, Employment Agreements, Job Applications, Ready for Hire, or Recruiting configuration
- Troubleshooting Workday Recruiting issues (blank offer letters, DocuSign integration, calculated fields, etc.)
- User wants to know what consultants recommend or have experienced
- User mentions "ask consultant", "what do consultants say", "check the channel", "consultant knowledge"
- User asks to "create a wiki", "make a wiki page", "wiki for [topic]"

## Salomon Slack MCP Integration

This skill uses the `slack_archive_search` tool from the `user-salomon-slack` MCP server.

**Tool Reference:**
- MCP Server: `user-salomon-slack`
- Tool Name: `slack_archive_search`
- Document Type: `message` (always)
- Channel Filter: `C0DUBF3H9` (channel ID for #recruiting_functional_consultants - NEVER search other channels)

**Important:** The Elasticsearch index uses channel IDs, not channel names. The channel ID for #recruiting_functional_consultants is `C0DUBF3H9`.

### Basic Query Structure

Every query MUST include the channel filter for `C0DUBF3H9`:

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "channel": "C0DUBF3H9"
          }
        },
        {
          "match": {
            "text": "your search terms here"
          }
        }
      ]
    }
  },
  "size": 20,
  "sort": [
    {"_score": "desc"},
    {"ts": "desc"}
  ],
  "_source": ["text", "user", "ts", "thread_ts", "channel"]
}
```

### Query Construction Guidelines

**Search Terms:**
- Use specific technical terms: "calculated fields", "WD-DocumentGenerator", "DocuSign", "autocomplete"
- Include error messages if user mentions them
- Use product-specific terminology: "Offer Event", "Job Application BP", "Ready for Hire"

**Size and Pagination:**
- Start with `size: 20` for initial search
- Increase to `size: 50` if more context needed
- Use `from` parameter for pagination if needed

**Sorting:**
- Default: `[{"_score": "desc"}, {"ts": "desc"}]` (relevance first, then recent)
- For chronological troubleshooting: `[{"ts": "asc"}]` (oldest first)
- For latest discussions: `[{"ts": "desc"}]` (newest first)

## Example Queries

### Example 1: Blank Offer Letters Issue

**User Question:** "Why are my offer letters generating blank even though calculated fields work in reports?"

**Query:**
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "channel": "C0DUBF3H9"
          }
        },
        {
          "bool": {
            "should": [
              {"match": {"text": "blank offer letter"}},
              {"match": {"text": "offer letter blank"}},
              {"match": {"text": "WD-DocumentGenerator"}},
              {"match": {"text": "calculated field business object"}}
            ],
            "minimum_should_match": 1
          }
        }
      ]
    }
  },
  "size": 30,
  "sort": [
    {"_score": "desc"},
    {"ts": "desc"}
  ],
  "_source": ["text", "user", "ts", "thread_ts"]
}
```

### Example 2: DocuSign Integration Troubleshooting

**User Question:** "DocuSign integration is failing - candidates aren't receiving the review document task"

**Query:**
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "channel": "C0DUBF3H9"
          }
        },
        {
          "bool": {
            "should": [
              {"match": {"text": "DocuSign integration"}},
              {"match": {"text": "DocuSign failed"}},
              {"match": {"text": "review document task"}},
              {"match": {"text": "eSignature"}},
              {"match": {"text": "Data Population Scope"}}
            ],
            "minimum_should_match": 1
          }
        }
      ]
    }
  },
  "size": 25,
  "sort": [
    {"_score": "desc"}
  ],
  "_source": ["text", "user", "ts"]
}
```

### Example 3: Autocomplete Configuration

**User Question:** "What's the complete checklist for Ready for Hire autocomplete?"

**Query:**
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "channel": "C0DUBF3H9"
          }
        },
        {
          "bool": {
            "should": [
              {"match": {"text": "autocomplete checklist"}},
              {"match": {"text": "Ready for Hire autocomplete"}},
              {"match": {"text": "Hire autocomplete"}},
              {"match": {"text": "staffing field defaults"}}
            ],
            "minimum_should_match": 1
          }
        }
      ]
    }
  },
  "size": 20,
  "sort": [
    {"_score": "desc"}
  ],
  "_source": ["text", "user", "ts"]
}
```

## Response Protocol

### Structure Your Response

Use this format for all responses:

```markdown
## Findings from #recruiting_functional_consultants

[1-2 sentence summary of what consultants discussed on this topic]

### What Consultants Said

[Organize findings by theme or chronologically]

**[Theme/Issue]:**
- [Key point from consultant message(s)]
- [Another key point with specific details]

**Evidence:**
- "[Direct quote or paraphrase]" (timestamp: [ts])
- "[Another quote]" (timestamp: [ts])

### Coverage

**Messages analyzed:** [X] messages found on this topic
**Date range:** [earliest] to [latest] (if relevant)

### Not Discussed in Channel

[Be explicit about what the user asked that was NOT mentioned:]
- [Specific gap 1]
- [Specific gap 2]

**Note:** The above gaps were not addressed by consultants in #recruiting_functional_consultants. I cannot provide guidance on these without evidence from the channel.
```

### Citation Format

**Always include timestamps for accountability:**
- Format: `(timestamp: 1234567890.123456)` or `(ts: 1234567890.123456)`
- Include user field if available: `(user: U1234ABCD, ts: 1234567890.123456)`
- Group related messages from same thread

**Example Citation:**
```markdown
**Calculated Field Business Object Issue:**
- "I usually put calc fields on different business object, not on Offer Event, maybe try Offer/Employment Agreement or Job Application" (ts: 1714234567.123456)
- Consultant confirmed this resolved blank offer letter issues in multiple tenants (ts: 1714234890.654321)
```

### Acknowledge Uncertainty

If messages are ambiguous or incomplete:
- State: "Consultant mentioned [X] but did not provide complete details"
- Quote exactly what was said, don't fill gaps
- Suggest: "This may require follow-up in the channel for complete procedure"

### When No Results Found

If the search returns no relevant messages:

```markdown
## No Findings in #recruiting_functional_consultants

I searched #recruiting_functional_consultants for messages about "[search topic]" but found no relevant discussions.

**Search performed:**
- Terms: [list search terms used]
- Messages returned: 0 relevant results

**This means:**
- This specific topic has not been discussed by consultants in the channel
- OR it was discussed using different terminology than I searched for

**Recommendation:**
- Try rephrasing your question with different technical terms
- OR this may be a topic not yet covered in consultant discussions
```

## Wiki Page Creation Mode

When the user requests a wiki page (phrases like "create a wiki", "wiki page", "make a wiki"):

### 1. Generate Filename from Topic

- Extract topic from user request
- Convert to kebab-case: lowercase, hyphens instead of spaces
- Format: `docs/[topic]-wiki.md`
- Examples:
  - "Recruiting Purge" → `docs/recruiting-purge-wiki.md`
  - "Blank Offer Letters" → `docs/blank-offer-letters-wiki.md`
  - "DocuSign Integration" → `docs/docusign-integration-wiki.md`

### 2. Create Comprehensive Wiki Structure (PM-Friendly)

**CRITICAL**: This wiki is for a Product Manager audience. Use clear, business-focused language. Avoid unnecessary jargon. Organize information logically.

**Structure Principles:**
1. **Business impact before technical details** - Start with "what" and "why" before "how"
2. **Logical grouping** - Group related concepts together, not chronologically by Slack messages
3. **Progressive detail** - Overview → Common scenarios → Advanced cases → Edge cases
4. **Action-oriented** - Focus on what PMs need to know and decide
5. **Visual clarity** - Use formatting to make scanning easy

Use this template structure:

```markdown
# [Topic]: Best Practices Wiki

**Source**: #recruiting_functional_consultants Slack channel  
**Messages Analyzed**: [X] messages  
**Date Range**: [earliest] to [latest]  
**Last Updated**: [today's date]

**Disclaimer**: This wiki compiles community-sourced guidance from Workday functional consultants. Always validate configurations in your specific tenant and consult Workday documentation for official guidance.

---

## Executive Summary

[2-3 sentence overview: What is this feature/topic? Why do PMs care? What's the main takeaway?]

---

## Table of Contents

[Auto-generated list based on major sections below]

---

## Overview

### What It Is
[Plain-English explanation of the feature/topic - no jargon]

### Why It Matters
[Business context: customer pain points, use cases, PM relevance]

### Common Scenarios
[3-5 typical use cases consultants discussed]

---

## Configuration & Setup

[Organized by logical workflow, NOT by when messages were posted]

### Standard Configuration
[Most common setup that consultants recommend]

**Steps:**
1. [Clear, numbered steps]
2. [Focus on configuration decisions, not button-clicking]

**Why this works:** [Consultant reasoning with evidence]

### Alternative Approaches
[Other valid configurations consultants mentioned]

[Use comparison tables when multiple options exist:]

| Approach | Use When | Consultant Notes |
|----------|----------|------------------|
| Option A | Scenario X | "Quote" (ts: xxx) |
| Option B | Scenario Y | "Quote" (ts: yyy) |

---

## Common Issues & Solutions

[Organized by problem type, not chronologically]

### Issue: [Clear problem statement]

**Symptoms:**
- [What users/customers experience]

**Root Cause:**
[Consultant explanation in plain English]

**Solution:**
[Step-by-step fix that consultants verified works]

**Evidence:** "[Consultant quote]" (ts: xxxxx)

**Success Rate:** [How many consultants confirmed this works]

[Repeat for each major issue pattern]

---

## Product Limitations & Workarounds

### Known Limitations
[What the product cannot do, based on consultant reports]

1. **Limitation:** [Clear statement]
   - **Impact:** [Business/UX impact]
   - **Workaround:** [If consultants shared one]
   - **Evidence:** [Citation]

### Feature Gaps
[Capabilities customers expect but don't exist]

---

## Decision Framework for PMs

[Synthesize consultant wisdom into decision guidance]

**When to use [Approach A]:**
- [Criteria based on consultant experience]
- [Trade-offs to consider]

**When to use [Approach B]:**
- [Criteria]
- [Trade-offs]

**Red flags from consultants:**
- [Configurations/approaches consultants warn against]

---

## Not Discussed in Channel

[Explicit list of gaps - what PM might have expected but wasn't mentioned]

**Note:** These topics were not addressed by consultants in #recruiting_functional_consultants. I cannot provide guidance on these without evidence from the channel.

- [Gap 1]
- [Gap 2]
- [Gap 3]

---

## Key Takeaways for PMs

[5-7 actionable bullet points - start each with a verb]

1. **[Action verb]**: [Insight with business impact]
2. **[Action verb]**: [Configuration decision guidance]
3. **[Action verb]**: [Common pitfall to avoid]
4. **[Action verb]**: [Opportunity or capability]
5. **[Action verb]**: [Customer experience insight]

---

## Coverage & Confidence

**Messages analyzed:** [X] messages directly addressing this topic  
**Consultant consensus:** [Strong/Moderate/Mixed/Limited] - [Brief explanation]  
**Date range:** [earliest] to [latest]  
**Geographic coverage:** [If consultants mentioned region-specific behavior]

**Confidence level:**
- ✅ **High confidence**: [Topics with multiple consultant confirmations]
- ⚠️ **Moderate confidence**: [Topics with limited discussion or single source]
- ❓ **Low confidence**: [Topics needing validation]
```

**Content Organization Guidelines:**

1. **Avoid technical overwhelm**: Translate consultant jargon into PM language
   - ❌ "The UBSG configuration on the ASR automation step requires domain permission inheritance"
   - ✅ "Security groups need to be configured on the automation step for it to work"

2. **Group by logic, not chronology**: Synthesize scattered Slack messages into coherent themes
   - Don't present findings in the order you found them
   - Group related points together even if they're from different messages

3. **Use progressive disclosure**: Simple → Complex
   - Start with the 80% use case
   - Then cover variations and edge cases
   - Put advanced/rare scenarios at the end

4. **Emphasize decisions over details**: PMs need to know:
   - What options exist?
   - What are the trade-offs?
   - What do consultants recommend?
   - What could go wrong?

5. **Visual hierarchy for scanning**:
   - Use bold for key terms and decisions
   - Use tables for comparisons
   - Use blockquotes for critical warnings
   - Use code blocks only for actual config values, not prose

6. **Evidence without clutter**:
   - Include timestamps for traceability
   - But don't let citations break reading flow
   - Put detailed evidence in collapsed sections if needed

### 3. Write the File (PM-Optimized Organization)

**Before writing, synthesize and organize:**

1. **Analyze all messages first** - Don't write as you read
2. **Identify themes** - Group related points across multiple messages
3. **Find patterns** - What do consultants agree on? Where do they disagree?
4. **Extract decisions** - What choices do PMs need to make?
5. **Note gaps** - What's missing that PM might expect?

**Writing process:**

- Use Write tool to create `docs/[topic]-wiki.md`
- Follow the PM-friendly structure template above
- **Organize logically, not chronologically** - synthesize scattered Slack messages into coherent sections
- **Lead with business context** - Start each section with "why this matters" before "how to configure"
- **Use plain English** - Translate consultant jargon into PM language
- **Make it scannable** - Use formatting to support quick comprehension
- **Preserve evidence** - Include timestamps for traceability, but don't let citations dominate
- **Be honest about gaps** - Explicitly state what wasn't discussed

**Formatting best practices:**

- **Headers (##, ###)**: Clear, descriptive - "Common Issues & Solutions" not just "Issues"
- **Tables**: For comparing options, approaches, or configurations
- **Blockquotes (>)**: For critical warnings or key consultant insights
- **Code blocks (```)**: ONLY for actual configuration values, BP names, field IDs - not for explanations
- **Bold**: For key terms, decisions, and important points
- **Bullet lists**: For related items; numbered lists for sequential steps
- **Horizontal rules (---)**: To separate major sections, not within sections

### 4. Open in Preview Mode

- Use Shell tool: `open -a "Cursor" docs/[topic]-wiki.md`
- The `-a "Cursor"` flag ensures file opens in Cursor (not default application)
- File will open in Cursor with markdown preview available

### 5. Provide File Path

Return a completion message with paths:

```markdown
Wiki page created successfully.

**File**: `docs/[topic]-wiki.md`  
**Full path**: `/Users/david.denham/product-manager-agent/docs/[topic]-wiki.md`

The file has been opened in your editor.
```

### Wiki Mode Example

**User request:** "/ask-consultant create a wiki for Recruiting Purge"

**Actions:**
1. **Query comprehensively**: Search Salomon Slack for "recruiting purge", "candidate purge", "purge candidates", "disposition", "automatic disposition", etc.
2. **Analyze for PM insights**: Review 100+ messages identifying:
   - What can be purged (candidates, applications, positions)
   - Why consultants recommend certain sequences
   - Common mistakes and how to avoid them
   - Product limitations and workarounds
   - Decision points for PMs
3. **Synthesize logically**: Group findings by theme, not chronologically
4. **Generate filename**: `docs/recruiting-purge-wiki.md`
5. **Create PM-friendly wiki** with structure:
   - **Executive Summary**: "Recruiting Purge removes candidate/job data. Critical for compliance but risky if misconfigured."
   - **Overview**: What it is, why PMs care, common scenarios
   - **What Can Be Purged**: Clear categories (Candidates, Applications, Positions)
   - **Purge Order**: Sequence that consultants recommend with reasoning
   - **Automatic vs Manual Disposition**: Decision framework with trade-offs
   - **Common Issues & Solutions**: Grouped by problem type
   - **Product Limitations**: What can't be done, known gaps
   - **Decision Framework**: When to use which approach
   - **Not Discussed**: Gaps explicitly called out
   - **Key Takeaways**: 5-7 action-oriented insights
   - **Coverage**: Confidence level and consensus strength
6. **Write file**: `docs/recruiting-purge-wiki.md`
7. **Open in editor**: `open -a "Cursor" docs/recruiting-purge-wiki.md`
8. **Return paths**: "Wiki created: docs/recruiting-purge-wiki.md"

**Key differences from inline response:**
- More comprehensive (multiple query angles)
- Better organized (thematic grouping)
- More PM context (business impact, decisions)
- Permanent reference (file vs. chat message)

## Anti-Patterns to Avoid

**DO NOT:**

1. **Fill knowledge gaps with general Workday knowledge**
   - ❌ BAD: "Based on Workday documentation, you should configure X..."
   - ✅ GOOD: "This configuration was not discussed in #recruiting_functional_consultants"

2. **Assume configurations work a certain way if not mentioned**
   - ❌ BAD: "The autocomplete should work if you enable these settings..."
   - ✅ GOOD: "Consultants confirmed these 8 specific steps for autocomplete: [list]"

3. **Suggest 'might work' solutions without evidence**
   - ❌ BAD: "You could try moving the calc field to Job Application, that might help"
   - ✅ GOOD: "Consultant reported: moving calc field from Offer Event to Job Application resolved blank offers"

4. **Combine partial information into complete procedures**
   - ❌ BAD: "Based on these 3 messages, the full procedure is: step 1, 2, 3..."
   - ✅ GOOD: "Consultants mentioned steps 1 and 3, but step 2 was not discussed"

5. **Extrapolate from similar scenarios**
   - ❌ BAD: "Since this worked for Offer BP, it should work for Job App BP too"
   - ✅ GOOD: "Consultants confirmed this for Offer BP. Job App BP was not discussed"

6. **Treat questions as feature requests**
   - ❌ BAD: "Yes, Workday should add this capability..."
   - ✅ GOOD: "Consultants identified this as a product limitation (Jira: HRCOMP-55791)"

7. **Provide workarounds not mentioned in channel**
   - ❌ BAD: "You could work around this by creating a custom report..."
   - ✅ GOOD: "Consultants stated: no workaround exists, escalate to Workday support"

## Quick Reference: When to Say "I Don't Know"

Say "I don't know" or equivalent when:
- Search returns no messages on the topic
- Messages mention the topic but don't provide the specific details user needs
- Consultants explicitly said "I don't know" or "this isn't possible"
- Procedure is partially described but missing critical steps
- User asks about a feature/config not discussed in the channel

**Remember:** Saying "I don't know" maintains trust and accuracy. It's better to acknowledge a gap than to speculate and potentially mislead the user with unverified information.

## Example Session

**User:** "How do I fix blank offer letters when my calculated fields work in reports?"

**Your Response:**

```markdown
## Findings from #recruiting_functional_consultants

Consultants identified the blank offer letter issue as primarily a business object placement problem. Multiple consultants confirmed a specific solution that resolved this in their implementations.

### What Consultants Said

**Root Cause:**
- Calculated fields placed on Offer Event business object have limited field availability and cause blank offer letters
- Even when WD-DocumentGenerator permissions are correct and fields populate in reports, Offer Event placement causes generation failures

**Solution (Verified by Consultants):**
- Move calculated fields from Offer Event to Offer/Employment Agreement or Job Application business object
- "I usually put calc fields on different business object, not on Offer Event, maybe try Offer/Employment Agreement or Job Application" (ts: 1714234567.123456)
- Multiple consultants confirmed this pattern resolves "blank offer letter" issues

**Additional Check:**
- Verify WD-DocumentGenerator has domain permissions to all referenced data sources
- Consultants reported this is required even if calc fields are on correct business object

### Coverage

**Messages analyzed:** 8 messages directly addressing blank offer letters with calc field business object as root cause
**Consultant consensus:** Strong agreement on this solution across multiple tenants

### Not Discussed in Channel

- Specific error messages in process record logs
- Differences between Document Generator vs Drive documents
- Impact of offer letter language selection on field population

**Note:** The above gaps were not addressed by consultants in #recruiting_functional_consultants. The business object solution above is well-evidenced and should be tried first.
```

## Workflow Summary

**Standard Query Mode:**

1. **Receive user question** about Workday Recruiting configuration/troubleshooting
2. **Construct Elasticsearch query** with channel filter + relevant search terms
3. **Execute slack_archive_search** via Salomon Slack MCP
4. **Analyze results** for evidence-based findings
5. **Present findings** with citations, acknowledge gaps, never speculate
6. **If no results:** State clearly what wasn't found, suggest alternative search terms

**Wiki Page Mode:**

1. **Detect wiki request** from user phrasing ("create a wiki", "wiki page", "make a wiki")
2. **Construct queries and gather findings** (same as standard mode, potentially multiple queries for comprehensive coverage)
3. **Generate filename** from topic (kebab-case: `docs/[topic]-wiki.md`)
4. **Write comprehensive wiki** with:
   - Header with metadata (source, date range, messages analyzed)
   - Table of Contents
   - Detailed sections with evidence citations
   - "Not Discussed in Channel" gaps section
   - "Key Takeaways for PMs" summary
   - Coverage statistics
5. **Open file** in Preview mode via `open` command
6. **Provide file path** (both relative and absolute)

**Always remember:** This skill's value is in surfacing verified consultant knowledge. Its honesty about gaps is more valuable than speculative completeness.
