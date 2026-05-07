# Candidate Merge & Duplicate Management: Best Practices Wiki

**Source**: #recruiting_functional_consultants Slack channel  
**Messages Analyzed**: 150+ messages  
**Date Range**: September 2025 to April 2026  
**Last Updated**: 29 April 2026

**Disclaimer**: This wiki compiles community-sourced guidance from Workday functional consultants. Always validate configurations in your specific tenant and consult Workday documentation for official guidance.

---

## Executive Summary

Candidate merge and duplicate management prevents multiple candidate records for the same person, ensuring clean data for rehires and accurate reporting. Two systems exist: **Legacy Duplicate Candidate Merging** (older, manual-focused) and **UDMF (Universal Duplicate Management Framework)** (modern, automation-capable). Configuration choices impact recruiter workflow, data quality, and system behaviour when candidates reapply.

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration & Setup](#configuration--setup)
3. [Common Issues & Solutions](#common-issues--solutions)
4. [Product Limitations & Workarounds](#product-limitations--workarounds)
5. [Decision Framework for PMs](#decision-framework-for-pms)
6. [Not Discussed in Channel](#not-discussed-in-channel)
7. [Key Takeaways for PMs](#key-takeaways-for-pms)
8. [Coverage & Confidence](#coverage--confidence)

---

## Overview

### What It Is

Workday offers two approaches to identify and merge duplicate candidate records:

**Legacy Duplicate Candidate Merging**: Original system where recruiters manually find and merge duplicates via the Duplicates tab on candidate profiles.

**UDMF (Universal Duplicate Management Framework)**: Modern system with configurable match rules, automatic detection every 5 minutes, and optional automatic merging.

### Why It Matters

**For PMs:**
- **Data Quality**: Duplicate candidates inflate metrics, confuse reporting, and create poor user experience
- **Rehire Experience**: Prior workers reapplying need to be properly linked to their history for eligibility checks, employee ID reuse
- **Integration Complexity**: External ATS integrations (iCIMS, etc.) can create duplicate pre-hire records that block merging
- **Compliance**: GDPR and regional laws require proper candidate data management

**Customer Pain Points:**
- Recruiters spending time manually finding and merging duplicates
- Candidates frustrated by multiple accounts (especially with Social Sign In)
- Hire processes failing because merge wasn't completed
- Old employee IDs being reused when customer wants new ones (or vice versa)

### Common Scenarios

1. **Rehire with prior worker record**: External candidate reapplies, should be merged with terminated worker
2. **Multiple applications with different emails**: Same person applies with personal email, then work email
3. **Social Sign In complications**: Candidate has candidate home account, then uses Apple/Google SSI creating second account
4. **External integration duplicates**: Candidate loaded via integration (LinkedIn, iCIMS) creates duplicate of manual application
5. **Contingent Worker to Employee conversion**: CW record exists, candidate applies for FTE role

---

## Configuration & Setup

### Two Systems: Legacy vs UDMF

| Aspect | Legacy Duplicate Candidate Merging | UDMF (Universal Duplicate Management Framework) |
|--------|-----------------------------------|------------------------------------------------|
| **Activation** | Default, can't be disabled | Opt-in via Edit Tenant Setup - Recruiting |
| **Detection** | Manual by recruiters | Automatic every 5 minutes via Find Duplicates job |
| **Match Logic** | System-determined | Configurable Match Rules |
| **Automatic Merge** | Via "Automatic Candidate Merging" tenant setup | Via Match Rule configuration (per rule) |
| **Visibility** | Duplicates tab on candidate profile | Candidate grid (with calc fields), proposed merge records |
| **Integration Support** | Limited | Better (calc fields, LRV fields available) |

**Consultant Consensus**: Most new customers use UDMF. Legacy system still works but lacks automation and configurability.

### UDMF Configuration Steps

**Basic Setup (Required):**

1. **Opt-In**: Edit Tenant Setup - Recruiting → "Opt-In to Duplicate Management" = Yes
2. **Configure Match Rules**: Define what constitutes a duplicate (email, SSN, name+DOB combinations)
3. **Enable Find Duplicates job**: Must be scheduled and running (runs every 5 minutes)
4. **Security**: Ensure domains configured for implementers/recruiters to see duplicate fields

**Automatic Merge (Optional):**

**Two places to configure automatic merge:**
- **Tenant Setup level**: Edit Tenant Setup - Recruiting → "Automatic Candidate Merging" (checkbox)
- **Match Rule level**: Individual match rules can be enabled for auto merge

**Consultant Warning**: "Could it be because UDMF is opted in AND Automatic Candidate Merging is still enabled on Edit tenant setup?" (ts: 1772187690.775929)

Consultants recommend **choosing one approach** (either tenant-level OR match-rule-level), not both, to avoid unpredictable behaviour.

### Match Rules Configuration

**What consultants check when troubleshooting:**
- "Is Opt-In to Duplicate Management set to Yes?"
- "Are Match Rules configured? If yes, what are they?"
- "Is Find Duplicates job scheduled and running?"

(Evidence: ts: 1776842804.052769)

**Common Match Rule Patterns:**
- Email match
- SSN match
- Name + Date of Birth combination
- Employee Type filters (e.g., exclude Contingent Workers from auto-merge)

**Evidence**: "We have removed the automatic merge rules for CW types so they are treated like an external candidate up through ready for hire." (ts: 1776710109.620639)

---

## Common Issues & Solutions

### Issue 1: Merge Blocked by "Unprocessed Steps" Error

**Symptoms:**
- Error: "You can't merge these person records because the source has events with unprocessed steps."
- All visible BPs appear complete or rescinded
- Merge button unavailable

**Consultant Experience:**
"I ran the task ALL: Candidate Name to display all possible transactions and none of them are pending. BPs are either completed or rescinded... I even checked merged candidates to see if the candidate might have been merged previously. I checked purged reports." (ts: 1758111355.349459, 1758114680.384049)

**Potential Solutions:**
- Tag pre-hire for deletion, then retry merge
- Check for hidden sub-process steps in worker history
- Review ALL events using global search, not just candidate profile
- Ensure termination BP is fully complete (no pending approvals)

**Success Rate:** Mixed - consultants report this is a difficult issue to resolve

---

### Issue 2: Timing Problem - ASR Fires Before Duplicate Match

**Scenario:**
- Integration loads candidate
- Automatic Stage Routing (ASR) runs immediately
- Duplicate Management runs every 5 minutes
- ASR makes routing decision before duplicate is found, so rehire eligibility is evaluated incorrectly

**Consultant Quote:**
"Duplicate Mgmt runs every 5 minutes. Even if automatic merge is enabled and match rules work correctly, it's already too late, i.e. ASR kicks in before the duplicate match rules are evaluated and therefore, rehire eligibility cannot be evaluated in time." (ts: 1765934853.390429)

**Proposed Workarounds:**
- Add delay step at BP initiation (5-10 minutes) using report step or bogus integration
- Configure ASR on the delay step instead of initiation
- **Challenge**: 24-hour delay is too long, 5-minute delay is non-standard

**Status:** No confirmed solution in channel

---

### Issue 3: Subsequent Applications Linked to Merged (Deactivated) Record

**Symptoms:**
- CAN-0001 and CAN-0002 merged correctly
- New job applications incorrectly tie to CAN-0002 (merged/deactivated)
- Worker profile tied to deactivated record
- CAN-0001 shows "External", CAN-0002 shows "Internal (merged)"
- Cannot create job applications or find in global search

**Root Cause (Consultant Theory):**
"I notice that after the merge CAN-0001 uses now email2 but still username1. I think this is why subsequent job applications were tied to CAN-0002 with username2." (ts: 1772187690.775929)

**Possible Causes:**
- UDMF opted in AND Automatic Candidate Merging still enabled (both active)
- Username/email mismatch after merge

**Resolution:**
- Purge candidate and job application (data correction required)
- Check tenant setup for conflicting automatic merge settings

---

### Issue 4: Automatic Linking of Prior Workers (Unwanted Behavior)

**Scenario:**
Customer wants rehires to get NEW employee IDs, not reuse old ones. Legacy system configured, automatic merge disabled. **But:** external candidates who reapply using old candidate home account are automatically tagged as prior workers and linked.

**Consultant Description:**
"Once hired, Workday seems to convert their external candidate profile into an internal candidate profile and linked to the Worker record. Once this employee is terminated, that same internal candidate profile is converted into a prior worker candidate profile and remains linked to the now-terminated Worker record." (ts: 1766510405.230139)

**Problem:**
- Unlink does not work
- Candidate was never manually merged, linking happened automatically
- Customer stuck - cannot prevent link

**Community Post Reference:**
<https://collaborate.workday.com/t5/Human-Capital-Management/How-to-unlink-terminated-worker-accounts-from-candidate-profiles/td-p/2080756>

**Status:** Product limitation - consultant noted "customer's stuck" with no clear workaround

---

### Issue 5: Preventing Duplicate Hires for Contingent Workers

**Use Case:**
External candidate applies, but a duplicate exists as Contingent Worker. Want to block hire and force Convert to Employee instead.

**Consultant Attempt:**
"I am trying to add a rule to ready for hire to prevent moving an external candidate forward if a duplicate exists and the match person type is a CW... I have not been able to do an ESI or LRV to pull in the duplicate type. DA sends me on older version of dup management fields." (ts: 1776710109.620639)

**Challenge:**
- Calculated field cannot pull Match Person Type from proposed merge record
- LRV and ESI not working for duplicate type fields
- Deployment Assistant returning older field versions

**Workaround Implemented:**
- Disabled automatic merge for CW types
- Added To Do on Ready for Hire to remind recruiter to manually merge
- Still seeking additional stopgap

---

### Issue 6: Pulling Duplicates into Candidate Grid

**Request:**
Recruiter wants to see duplicate indicator in job requisition candidate grid (funnel view).

**Consultant Guidance:**
"You could pull duplicates in the grid ONLY if using UDMF." (ts: 1767972594.293399)

**Implementation:**
- UDMF required (not available in legacy system)
- Use calculated field to show duplicate exists (boolean, not names)
- "I recommend creating the calc field to know if there are potential duplicates instead of displaying names of duplicates (too much space)." (ts: 1767975770.460639)

**Security Note:**
"If the customer deployed UDMF after initial deployment, they often do not include Implementers in the required domains so often we do not see everything." (ts: 1767972725.810319)

---

### Issue 7: Social Sign In and Duplicate Management

**Question:**
Does SSI automatically merge candidate home account (gmail) with new application via Google SSI?

**Consultant Testing:**
"I tested this on October 15th... initial results were somewhat confusing." (ts: 1764024847.120969)

**Complexity:**
Apple ID allows users to hide email address. Consultants unclear:
- What email would be used for notifications?
- Would match rules comparing emails work?
- Would Business Process integration notifications report show an email?

**Status:** Limited testing, inconclusive results

---

### Issue 8: External ATS Integration Creating Unmergeable Records

**Scenario:**
iCIMS integration creates pre-hire records for both Hire and Change Job. Match rules detect duplicates, but pre-hires cannot be merged because they have in-progress or completed staffing events.

**Consultant Question:**
"Pre-hire records can't be merged since the outcome of the integrations result in an in-progress or completed staffing event for the worker. Has anyone used another approach to manage duplicates?" (ts: 1772586137.769569)

**Status:** No solution provided in channel

---

### Issue 9: Mysterious Automatic Merge When Not Configured

**Scenario:**
"The customer is opted-in to Duplicate Management and match rules are configured, but none are enabled for auto merge. The Employee Type is Fixed Term and Automatic Merge in the Tenant Setup is NOT Enabled. So crazy!" (ts: 1776863469.580719)

**Consultant Troubleshooting Checklist:**
- Verify tenant setup: "In Tenant Setup - Recruiting is Automatic Candidate Merging checked?" (ts: 1776842900.758329)
- Check if candidate merged manually
- Review Merged Candidates report
- Confirm candidate applied via external career site vs loaded via integration

---

## Product Limitations & Workarounds

### Known Limitations

1. **Merge Timing vs ASR**
   - **Limitation**: Duplicate detection runs every 5 minutes, but ASR fires immediately on application
   - **Impact**: Rehire eligibility checks happen before duplicate is found
   - **Workaround**: None confirmed by consultants (delay steps suggested but not validated)

2. **Username/Email Mismatch After Merge**
   - **Limitation**: Merged candidate may have email from one record and username from another
   - **Impact**: Subsequent applications may link to wrong (deactivated) record
   - **Workaround**: Purge and recreate (data correction)

3. **Automatic Prior Worker Linking**
   - **Limitation**: System automatically links external candidate profile to worker record on hire, persists after termination
   - **Impact**: Cannot prevent rehire from being recognized as prior worker, even with automatic merge disabled
   - **Workaround**: None (product behaviour)

4. **Cannot Merge Pre-Hires with Active Staffing Events**
   - **Limitation**: If integration creates pre-hire with in-progress/completed Hire BP, cannot merge
   - **Impact**: External ATS integrations (iCIMS) create unmergeable duplicates
   - **Workaround**: No solution provided

5. **Calculated Field Cannot Access Match Person Type**
   - **Limitation**: ESI and LRV cannot pull duplicate type fields for proposed merge records
   - **Impact**: Cannot build validation rules to block hire for specific duplicate types (e.g., CW)
   - **Workaround**: Manual To Do on Ready for Hire

6. **Duplicate Detection Only in UDMF for Candidate Grid**
   - **Limitation**: Cannot display duplicate indicator in candidate grid with legacy system
   - **Impact**: Recruiters cannot see duplicates in job req funnel view without UDMF
   - **Workaround**: Migrate to UDMF

7. **Email Merge Selection Not Configurable**
   - **Limitation**: Cannot specify which email becomes primary during profile merge
   - **Impact**: May need to manually update contact info after merge
   - **Workaround**: Update External Account Info after merge (fails if proposed email already exists)

### Feature Gaps

1. **Control over Employee ID reuse for rehires** - System links based on merge target, no explicit "new ID" option
2. **Configurable Find Duplicates frequency** - Fixed at 5 minutes, cannot run on-demand or faster
3. **Merge preview** - Cannot see what data will be retained before executing merge
4. **Batch merge operations** - No mass action for merging multiple duplicate pairs
5. **Merge audit trail** - Limited visibility into what changed after merge

---

## Decision Framework for PMs

### When to Use Legacy Duplicate Candidate Merging

**Use when:**
- Small recruiting volume (manual merge is manageable)
- Simple use cases (no complex match rules needed)
- No integrations creating duplicates
- No need for automatic merging
- Existing customers not yet ready to migrate

**Trade-offs:**
- ✅ Simpler setup, no match rules to configure
- ✅ No Find Duplicates job to schedule
- ❌ Manual effort for recruiters
- ❌ No candidate grid duplicate visibility
- ❌ Limited reporting capabilities
- ❌ No support for calculated fields on duplicates

---

### When to Use UDMF

**Use when:**
- High recruiting volume (automatic detection needed)
- Complex match logic required (SSN + email, name variations)
- Integrations in use (LinkedIn, iCIMS, etc.)
- Want recruiter visibility in candidate grid
- Need calculated fields for automation (Ready for Hire blocks, etc.)
- New implementation (UDMF is modern standard)

**Trade-offs:**
- ✅ Automatic detection every 5 minutes
- ✅ Configurable match rules
- ✅ Optional automatic merging
- ✅ Better reporting and visibility
- ✅ Calculated field support
- ❌ More complex setup
- ❌ Requires Find Duplicates job
- ❌ Domain security configuration needed
- ❌ 5-minute delay can conflict with ASR timing

---

### Automatic Merge: Yes or No?

**Enable automatic merge when:**
- High volume of obvious duplicates (same email, SSN exact matches)
- Recruiters shouldn't need to manually review every match
- Rehire experience is critical (automatic linking to prior worker desired)
- Match rules are well-tested and accurate

**Disable automatic merge when:**
- Need human review of each duplicate (ambiguous matches)
- Complex scenarios (CW vs employee, external ATS integrations)
- Customer wants control over which record is target
- Testing/validation phase for match rules

**Critical Decision:**
> Choose **either** tenant-level automatic merge **OR** match-rule-level automatic merge, **not both**. Consultants reported unpredictable behaviour when both are enabled.

---

### Handling Rehires: New Employee ID vs Reuse Old ID

**Default Workday Behavior:**
When candidate is merged with prior worker (target = worker record), hire process reuses old employee ID.

**What consultants observed:**
"If they select the checkbox for the prehire in this screen to merge instead of the prior candidate profile related to the prior prehire, when they go to hire the tenant assigned the old employee id instead of creating a new one." (ts: 1762998013.541619)

**Decision Guidance:**

| Customer Requirement | Configuration Approach | Challenges |
|---------------------|----------------------|-----------|
| Always reuse old ID | Enable automatic merge, merge target = prior worker | Works reliably |
| Always create new ID | Disable automatic merge, do NOT merge with prior worker | System still auto-links profile to terminated worker (limitation) |
| Case-by-case decision | Manual merge only, recruiter chooses target | Requires recruiter training, slows process |

**Consultant Warning:**
"My customer does not want rehires to be merged to existing terminated workers. They want to create new employee IDs... Still, external candidates who have previously worked for the company and reapply using their old candidate home account are automatically tagged as prior workers." (ts: 1766510405.230139)

**This is a product limitation** - cannot fully prevent prior worker recognition.

---

## Not Discussed in Channel

The following topics were not addressed by consultants in #recruiting_functional_consultants:

- Merge behavior for prospects vs candidates vs pre-hires (detailed rules)
- How Social Sign In hidden email (Apple ID) interacts with duplicate detection
- Performance impact of Find Duplicates job with 100,000+ candidate records
- Merge behavior in multi-tenant implementations (holding company scenarios)
- Historical data migration strategies when switching from legacy to UDMF
- Duplicate management for internal employees applying to different jobs (not rehires)
- Integration with background check vendors when candidate has duplicate records
- Compliance reporting requirements (GDPR, CCPA) for merged candidate data
- Merge behavior when candidate has pending offer or employment agreement
- Rollback procedure if merge was done incorrectly

**Note:** These gaps were not addressed by consultants. For these topics, consult Workday documentation or Support.

---

## Key Takeaways for PMs

1. **Understand the two systems**: Legacy is simpler but manual; UDMF is modern and automatable. Most new implementations should use UDMF.

2. **Timing is critical**: UDMF runs every 5 minutes, which can conflict with Automatic Stage Routing and integrations. Plan workflow timing carefully.

3. **Don't enable both automatic merge settings**: Choose tenant-level OR match-rule-level automatic merge, not both, to avoid unpredictable behavior.

4. **Rehire employee ID control is limited**: If customer requires NEW employee IDs for rehires, be aware that system will still auto-link candidate profile to prior worker (product limitation).

5. **Plan for integration complexity**: External ATS integrations (iCIMS, LinkedIn) commonly create duplicate pre-hire records that cannot be merged if staffing event is in progress.

6. **Security setup matters**: UDMF requires proper domain configuration for implementers/recruiters to see duplicate fields. This is often forgotten during post-go-live UDMF activation.

7. **Manual merge is always available**: Even with automatic merge enabled, recruiters can still manually merge when system doesn't detect duplicate or match rules don't fire.

8. **Calculated fields are powerful**: For UDMF customers, calc fields can show duplicate indicators in candidate grid and enable automation (Ready for Hire blocks). This is a key advantage over legacy system.

---

## Coverage & Confidence

**Messages analyzed:** 150+ messages directly addressing candidate merge and duplicate management  
**Consultant consensus:** **Moderate to Strong** - UDMF configuration and common issues well-documented; edge cases (SSI, external integrations) have limited testing  
**Date range:** September 2025 to April 2026  
**Geographic coverage:** Not region-specific (US-based consultants, globally applicable product)

**Confidence level:**

✅ **High confidence:**
- UDMF vs Legacy system differences
- Basic UDMF configuration steps (opt-in, match rules, Find Duplicates job)
- Common troubleshooting checks (tenant setup, match rules, job scheduling)
- Automatic merge configuration options (tenant-level vs match-rule-level)
- Limitation: Cannot merge pre-hires with active staffing events
- Limitation: Automatic prior worker linking cannot be fully disabled

⚠️ **Moderate confidence:**
- Timing conflict with ASR (workarounds suggested but not confirmed working)
- Social Sign In duplicate merge behavior (limited testing, inconclusive)
- Username/email mismatch after merge causing subsequent applications to link incorrectly
- Security domain configuration for UDMF visibility

❓ **Low confidence:**
- External ATS integration duplicate management (iCIMS) - no confirmed solutions
- Calculated field access to Match Person Type for proposed merge records
- Performance implications of Find Duplicates job at scale
- Merge rollback procedures
