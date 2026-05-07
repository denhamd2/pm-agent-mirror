# Workday Offers & Employment Agreements: Best Practices Wiki

**Source**: #recruiting_functional_consultants Slack channel  
**Messages Analyzed**: 202  
**Date Range**: February 2026 - April 2026  
**Last Updated**: 28 April 2026  

**Disclaimer**: This wiki compiles community-sourced guidance from Workday functional consultants. Always validate configurations in your specific tenant and consult Workday documentation for official guidance.

---

## Table of Contents

1. [Offer/EA Business Process Configuration](#offera-business-process-configuration)
2. [Calculated Fields for Offers](#calculated-fields-for-offers)
3. [Document Generation & Templates](#document-generation--templates)
4. [E-Signature Integration](#e-signature-integration)
5. [Offer Letter Content](#offer-letter-content)
6. [Security & Permissions](#security--permissions)
7. [Approvals & Conditional Logic](#approvals--conditional-logic)
8. [Ready for Hire & Hire Process](#ready-for-hire--hire-process)
9. [Regenerate Offer](#regenerate-offer)
10. [Special Configurations](#special-configurations)
11. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## Offer/EA Business Process Configuration

### Overview
The Offer and Employment Agreement business process is highly configurable, supporting various approval workflows, conditional logic, and integration with Job Requisition and Hire processes. Proper BP configuration ensures efficient workflows while maintaining data integrity and compliance requirements.

### Best Practices

**Job Application BP Flexibility:**
- The Job Application BP can be configured to support various use cases, including minimal configurations for external integrations
- One consultant successfully configured a BP with only Review and EA stages for candidates pre-screened in Greenhouse
- The integration loaded candidates directly into EA, and upon acceptance, moved them to Ready for Hire

**Redundant Approval Prevention:**
- When customers want to skip Offer BP approvals if the same user already approved the Job Requisition, this requires careful calculated field configuration
- Key challenge: Job Requisition approvals are for JR creation (organization, position linkage), while Offer approvals are for candidate-specific details (hire date, location, compensation)
- Before implementing skip logic, clarify with stakeholders: What is the purpose of JR approval vs Offer approval? Is the skip truly needed?

**Rule-Based BP Definitions:**
- Rule-based business process definitions are recommended over Default Definition for complex approval routing
- Allows conditional triggering of Offer BPs based on candidate attributes, requisition type, or other criteria
- Be aware that autocomplete behaviour applies to both rule-based and default definitions

**Change Start Date Workflows:**
- For Job App steps like "Change Start Date" that need to trigger a rule-based Offer BP, consultants have experienced challenges with condition rules not working reliably
- This may require Workday support engagement for proper BP triggering configuration

### Technical Details

**Calculated Field for Approval Skip Logic:**
Path to identify Job Requisition approvers from Offer:
```
Offer/Employment Agreement > Job Requisition > Job Requisition Event 
(use ESI to find the first BP on the job req) > Approved By Workers
```

**Job Application BP Migration:**
- When creating new rule-based definitions for Job Application and sub-processes while candidates are in-flight on old definitions:
  - Challenge: New Interview BP with step label overrides won't work properly if candidates are on old Job App definition without those overrides
  - Options: (1) Update older Job App definition to match new (high effort), or (2) Build condition rules to route old candidates to old sub-process definitions (not ideal for process consistency)
  - Recommendation: Plan BP migrations carefully; consider timing around low candidate volume periods

**Greenhouse Integration Use Case:**
- Minimal Job App BP configuration: Review and EA stages only
- Sub-BPs: Review, EA (with EA sub-bps), and Ready for Hire
- Integration loads candidates directly to EA stage after external screening
- Candidate acceptance triggers automatic Ready for Hire progression

### Known Limitations
- Condition rules on rule-based Offer BPs may not trigger reliably for certain Job App steps (like Change Start Date)
- Step label overrides in new BP definitions cannot be applied retroactively to candidates on old definitions
- No native way to force BP definition changes for in-flight candidates

---

## Calculated Fields for Offers

### Overview
Calculated fields are essential for dynamically populating offer letter content based on candidate type, job classification, compensation plans, and other variable data. The choice of business object for the calculated field significantly impacts data availability and performance.

### Best Practices

**Business Object Selection:**
- **Recommended**: Place calc fields on `Offer/Employment Agreement` or `Job Application` business objects (NOT on Offer Event)
- Offer Event has limited field availability and can cause issues with data population
- Multiple consultants confirmed this pattern resolves many "blank offer letter" issues

**Address Fields for Internal vs External Candidates:**
- Create calculated fields that work for both candidate types to avoid maintaining separate offer letter templates
- For US addresses, pull from Worker record for internal candidates and Candidate record for external candidates
- Ensure `WD-DocumentGenerator` has permissions to Worker Data domains
- Even with correct calc field setup and permissions, report fields may populate correctly but offer letter remains blank — solution is to move calc field from Offer Event to Offer/Employment Agreement or Job Application

**Target Bonus Percentage Retrieval:**
- **For internal candidates**: Use path `Offer/EA > Employee Comp Event for Current Event > Bonus Percent Proposed`
- **For external candidates with job classification-based targets**: 
  - Challenge: Target percentage comes from table based on job classification, not directly available for external candidates
  - Solution approach: Create LRV to look up job classification from job profile in Offer, then dynamically retrieve target percentage from compensation table using job classification
  - Use EE calc field to combine the two lookups
  - Note: Examples in "Calculated Fields and Delivered Fields for Offer and EA Letters" document may not cover this scenario

**Graduation Date Consolidation:**
- When combining answers from multiple questionnaires (e.g., US Graduation Date Question vs Supplementary Graduation Date Question), use EE calc fields
- Challenge: Combining text and date calc fields in a single EE calc for display on candidate grid
- Approach: Create condition rules that return appropriate calc field based on which questionnaire was completed

### Technical Details

**Notice Period Field (Default vs Custom):**
- Two fields exist in Offer: `Default Notice Period Proposed` and `Custom Notice Period Proposed`
- Business rule: If Custom Notice Period has a value, display it; otherwise display Default Notice Period
- Implementation: Conditional calculated field or EE calc with logic to check for Custom value first

**Job Requisition Event ESI Pattern:**
- **Challenge**: Delivered fields don't pick up the most recent Job Requisition Event (e.g., for Job Description Summary in job posting templates)
- **Solution approach**: Create ESI using Date Initiated, Effective Date, or Date Completed as sort field
- **Reported issue**: Some consultants report that descending/last occurrence still returns the first Job Req Event (10 April) instead of most recent (24 April)
- **Alternative consideration**: Use standard fields in Job Posting template content if available

**EE Calc Field for Multiple Data Types:**
- When creating EE calc to combine text calc field and date calc field:
- Example use case: Pulling graduation date from different questionnaires based on condition rules
- Structure: Condition Rule checks which questionnaire was completed, returns appropriate calc field

**Reported Old Candidate ID After Merge:**
- Challenge: Customer wants to report on "old" candidate ID post-merge using RDS of Offer Agreement
- Field path investigation: Would need to come from Job Application or Candidate, but connection not available through Person object
- **Conclusion**: Not achievable via standard configuration for Offer Agreement RDS

### Known Limitations
- Old Candidate ID after merge: Not accessible via Person connection for Offer Agreement RDS
- Job Description inclusion: Cannot add Job Description calc field directly to Workday Doc (workaround: use report-based document or include in Offer addendum)
- Job Requisition Event ESI may not reliably return most recent event with descending sort

### Troubleshooting

**Blank Offer Letters Despite Correct Setup:**
1. Verify `WD-DocumentGenerator` has domain permissions to all referenced data sources
2. Check business object: Move calc field from Offer Event to Offer/Employment Agreement or Job Application
3. Confirm field values populate correctly in report fields before generating document
4. Validate that calc field is pulling from correct business object path

**Address Components for Internal Candidates:**
- If calc fields pull from Worker record and report fields populate correctly, but offer letter is blank:
  - Solution shared by consultant: Attach calc fields to different business object (Offer/Employment Agreement vs Offer Event)
  - Calc fields should work for both internals and externals when properly configured at Job Application or Offer/EA level

---

## Document Generation & Templates

### Overview
Document generation in the Offer BP includes Generate Document steps, Review Document steps, and optional Add Documents functionality. Configuration flexibility allows for single or multiple document generation, conditional signing requirements, and page breaks for bundled documents.

### Best Practices

**Single vs Multiple Generate Document Steps:**
- **Single Generate Document approach**: When all entities use the same offer letter and additional documents (e.g., sign-on bonus agreement) are included after a page break
  - Advantage: Simpler configuration with one Generate Document step
  - Pair with multiple Review Document steps for entity-specific signing requirements
  - Example: One entity requires recruiter signature for sign-on bonus; use two Review Document steps with condition rules
  
- **Multiple Generate Document approach**: When different entities require different documents
  - More complex but provides greater control over document variations

**Review Document Step Configuration:**
- When Add Document step is optional, the Review Document step tied to it will trigger blank when Add Document is skipped
- **Solution**: Create condition rule on Review Document step to check if Add Document is empty before triggering
- Review Document step is required for Add Documents functionality even if Add Document step itself is optional

**Page Breaks for Multiple Documents:**
- Sign-on bonus agreements or other supplementary documents can be included in the same Generate Document step using page breaks
- Allows single generation with multiple Review Document steps for conditional signing

**Template Content Configuration:**
- For job posting templates, use standard fields in Job Posting Template Content when available
- Standard fields should automatically reflect changes from Job Requisition Events
- If standard fields don't show updated content, verify field selection and business object path

### Technical Details

**Document Language Field:**
- Offer letter language is selected during the initiation step of the Offer or Employment Agreement BP using the `Document Language` field
- Supports 37 languages (see Offer Letter Content section)
- Language selection is BP-level, not template-level

**Delivered Template Removal:**
- **Challenge**: No easy way to delete delivered "External Offer" document template from tenant
- Context: Customer in GOLD using Docs offer template in Drive wants delivered template removed
- **Status**: Requires Workday support engagement; standard configuration doesn't provide delete option for delivered templates

**Add Documents Functionality:**
- Add Document step allows recruiter to attach additional documents during Offer BP
- Configuration requirements:
  - Add Document step (can be optional)
  - Review Document step tied to Add Document step (required)
  - Condition rule on Review Document step to prevent blank review when no document added
  
**Sample Documents:**
- Sample documents for offer, employment agreement, etc. exist in tenant
- Similar to External Offer template issue: No standard configuration to remove sample documents
- May require Workday support for cleanup

### Known Limitations
- Cannot delete delivered "External Offer" document template via standard configuration
- Cannot remove sample documents for offer/EA via standard configuration
- Review Document step will trigger blank if Add Document is skipped without proper condition rule

### Troubleshooting

**Review Document Triggering Blank:**
- **Symptom**: Review Document step kicks off with no document when Add Document step is skipped
- **Solution**: Create condition rule on Review Document step to check if document exists before triggering
- Condition rule logic: Only trigger Review Document if Add Document step was completed with attachment

**Job Posting Template Not Showing Updates:**
- If Job Description Summary or other fields don't reflect recent Job Requisition Event changes:
  - Verify standard fields are used (not calc fields) in Job Posting Template Content
  - Check that calc field ESI sort is correct if using custom calc field
  - Consider using delivered fields which should auto-update

---

## E-Signature Integration

### Overview
Workday integrates with DocuSign and Adobe Sign for electronic signature of offer letters and employment agreements. Proper configuration of both Workday and the e-signature platform is essential for reliable document delivery and candidate signing workflows.

### Best Practices

**DocuSign Account Configuration:**
- **Critical settings** in DocuSign account:
  - **Data Population Scope**: Must be set to "Envelope"
  - **2-Step Verification**: Must be DISABLED
  - **Single Sign On (SSO)**: Must be DISABLED
  - Use non-SSO DocuSign account to avoid integration failures

**Troubleshooting DocuSign Integration Failures:**
1. Go to Full Process Record from the Event
2. Navigate to Error tab for specific error messages
3. Check for eSignature Signing Status option (if missing, indicates integration failure)
4. Common resolutions:
   - Delete and recreate the setup
   - Clear cache and re-authenticate the connection
   - Verify DocuSign account settings match requirements above

**Conditional Signing Requirements:**
- **Use case**: Recruiter only needs to sign for specific entity if sign-on bonus is included
- **Challenge**: Condition rule on Review Document step with entity + sign-on bonus still triggers task even when condition not met
- **Solution**: Use multiple Review Document steps instead of relying on condition rule at step level
  - Review Document step 1: For all entities that don't need second signature
  - Review Document step 2: For specific entity with sign-on bonus (with condition rule)
  - Both use same offer letter generated in single Generate Document step

### Technical Details

**Adobe Sign Configuration:**
- Similar conditional signing challenges as DocuSign
- Same recommendation: Multiple Review Document steps for entity-specific signing requirements rather than relying solely on condition rules

**Integration Failure Indicators:**
- Candidates not receiving "Review Document" task
- Integration status shows FAILED in process record
- No error message displayed in standard view
- Missing "Check eSignature Signing Status" option in Full Process Record

**Multiple Approvers Based on Questionnaire Answers:**
- For pre-offer workflows (e.g., COI approvals in Interview stage):
  - Custom objects can be used for approver decisions (approve or not approve)
  - Multiple approvers can be configured based on questionnaire responses
  - Related to e-signature workflow: Similar conditional logic applies

### Known Limitations
- Condition rules on Review Document steps with e-signature may not prevent task assignment reliably
- SSO-enabled DocuSign accounts are not compatible with Workday integration
- 2-Step Verification in DocuSign blocks integration

### Troubleshooting

**DocuSign Integration Failure - No Review Document Task:**
**Steps already taken:**
- Deleted and recreated setup
- Cleared cache and re-authenticated connection

**Troubleshooting path:**
1. Check Full Process Record > Error tab for specific error message
2. Verify DocuSign account settings:
   - Data Population Scope = Envelope
   - 2-Step Verification = OFF
   - SSO = OFF
3. Test with non-SSO DocuSign account if SSO was previously enabled
4. Check eSignature Signing Status availability in process record

**Recruiter Signature Required for Specific Entity/Bonus:**
- Moving condition rule from step level to having separate Review Document steps resolves most issues
- One Generate Document step, two Review Document steps with appropriate condition rules
- Condition rules are more reliable at step triggering level than at task assignment level within e-signature integration

---

## Offer Letter Content

### Overview
Offer letters support extensive localization, multi-language translations, and dynamic content population. Proper configuration ensures accurate display of compensation ranges, job descriptions, and candidate-specific information across diverse global requirements.

### Best Practices

**Language Support:**
- Workday supports approximately 37 languages for offer letter translation
- Language selection occurs during Offer/EA BP initiation step using `Document Language` field
- Offer letter translation language support is distinct from general Workday Translations
- Other Workday configuration pieces (customer-specific config, delivered config) support additional languages beyond the 37 offer letter languages

**Supported Languages (37 total):**
Arabic, Bulgarian, Chinese (Simplified), Chinese (Traditional), Croatian, Czech, Danish, Dutch, Estonian, Finnish, French (Canada), French (France), German, Greek, Hebrew, Hungarian, Indonesian, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Norwegian, Polish, Portuguese (Brazil), Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, Ukrainian, Vietnamese

**Job Description Inclusion:**
- **Challenge**: Cannot add Job Description calc field directly to Workday Doc
- **Workarounds**:
  1. Use report-based document that includes Job Description from Job Requisition
  2. Add report definition with Job Description and other job req details; have candidate acknowledge in single review step
  3. Include Job Description in Offer addendum
- Consultant confirmed using report-based approach with all job req details in acknowledgment workflow

**EU Pay Transparency - Multi-Country Pay Ranges:**
- **Challenge**: Displaying multiple pay ranges (3-6+ countries) on single job posting
- **Current approach**: Hardcode each country's range in template
- **Limitation**: Creates gaps in template when that country doesn't exist in job posting location
- **Scaling issue**: Becomes unwieldy beyond ~6 countries
- **No elegant solution**: Product limitation for high-volume multi-country postings
- Consultants seeking alternative approaches but none widely adopted

**Worker Sub Type Display Issues:**
- **Symptom**: Worker Sub Type shows partially in French in English offer letter
- **Investigation**:
  - Template is English-only
  - User's language is English
  - Default language setting is French (tenant-level)
  - Proxy user language setting may influence display
- **Likely cause**: Default language setting impacts offer letter terminology even when Document Language is English
- Not fully resolved in community discussions

### Technical Details

**Internal Candidate Data Population:**
- For internal candidates, address and other Worker fields can be pulled via calculated fields
- Requires `WD-DocumentGenerator` domain permissions to Worker Data
- Business object selection (Offer/EA vs Offer Event) critical for successful population

**Compensation Range Display:**
- For EU Pay Transparency, template must include conditional logic for each country location
- Each country's pay range is hardcoded with condition checking if country exists in Additional Job Posting Locations
- Example structure: IF [Country 1], show [Range 1]; IF [Country 2], show [Range 2]; etc.
- Limit of ~6 countries before template becomes too complex with gaps

**Document Language vs Default Language:**
- Document Language field (selected at BP initiation) should control offer letter language
- However, tenant default language setting may influence terminology display
- User's personal language setting should not influence document language
- Proxy user context may introduce language inconsistencies when viewing offers

### Known Limitations
- Job Description cannot be added directly to Workday Doc via calc field
- EU Pay Transparency solution for 6+ countries is not scalable with current configuration options
- Default language setting may override Document Language field for certain terminology
- No way to force specific ID type collection at offer stage (can only require ANY ID if country is listed in localization settings)

### Troubleshooting

**French Wording in English Offer Letter:**
1. Check tenant default language setting
2. Verify Document Language field selection in BP
3. Consider proxy user language setting influence
4. May be localization setting impacting terminology display
5. Not fully resolved - escalate to Workday if critical

**Job Description Not Displaying in Offer:**
- Use report-based document approach instead of calc field
- Configure report to include Job Description from Job Requisition
- Add report to Generate Document step or as separate acknowledgment step

**Multi-Country Pay Ranges Creating Gaps:**
- Negotiate with recruiting to limit Additional Job Posting Locations to manageable number (~3-6)
- If more countries needed, consider opening additional evergreen job requisitions
- No product solution for elegant scaling beyond 6 countries

---

## Security & Permissions

### Overview
Proper security configuration ensures appropriate access to candidate data, offer information, and related worker records while maintaining confidentiality requirements and compliance with data privacy regulations.

### Best Practices

**WD-DocumentGenerator Permissions:**
- Critical for calculated field data population in offer letters
- Required domain permissions:
  - All domains referenced by calculated fields (e.g., Worker Data if pulling from Worker records)
  - Candidate Data domains
  - Job Requisition domains if pulling JR-related fields
- Even with correct calc field configuration, missing `WD-DocumentGenerator` permissions will cause blank offer letters

**Candidate Notification Receiver Security:**
- When Candidate Notification Receiver group is enabled, specific domain security is required to see fields like Hiring Manager Business Title
- **Required domains**:
  - Worker Data: Business Title on Worker Profile
  - Candidate Data (all relevant domains)
- Consultants report trying multiple calc fields without success until proper domain security granted

**Internal/External Candidate Segregation:**
- **Use case**: Customer requires internal candidates be treated as totally confidential (attributed to GDPR)
- **Challenges**:
  - Workers can pull up candidates through unconstrained security on reports
  - Security originally designed to hide/view candidates on job reqs, not fully manage segmented processes
  - When hired, visibility changes based on Worker record access
  - Merged candidates (external with prior worker record) create ambiguous scenarios
  - Many recruiters are also HR Partners, creating dual-role visibility conflicts
- **Assessment**: Complex requirement that may need Expert Assist for proper security segmentation
- **Key questions to answer**:
  - What happens when candidate is hired (stop seeing them)?
  - How are tasks assigned (Primary Recruiter vs Recruiter Aggregate)?
  - How to handle merged external candidates with worker records?
  - Need guardrails to prevent duplicate offers/EA if visibility is limited

**Recruiter vs Primary Recruiter Access:**
- **Primary Recruiter**: Role-based, specific person assigned
- **Recruiter Aggregate Security**: Aggregates constrained supervisory/local recruiter groups
- Task assignment on Job App BP/Sub-BPs depends on which security model is used
- Internal candidate confidentiality requirements may necessitate Primary Recruiter model over Recruiter Aggregate

**Requisition Compensation Visibility:**
- **Symptom**: Recruiter can see Requisition Compensation during Review step in Job Requisition BP, but cannot see all Plan Assignments in Job Requisition Details section
- **Required domain security**: Beyond standard Candidate Data domains
- **BP Policy requirement**: View All on Requisition Compensation BP policy
- **Verification**: Isolate user with just Recruiter access to confirm security gap

### Technical Details

**Business Title on Worker Profile Domain:**
- Specific domain required for candidate notification receivers to see Hiring Manager Business Title
- Multiple calc field attempts may fail if this domain not granted
- Not automatically included with general Candidate Data domain access

**Collective Agreement Display on Job Posting:**
- **Challenge**: Cannot display Collective Agreement details from Job Requisition on Internal Career Site Job Posting
- **Investigation**: Standard field available in Job Posting Template Content configuration, but doesn't display
- **Likely cause**: Security is around Worker Data (not Candidate Data)
- **Assessment**: Feature may not have been designed for Recruiting use case since collective agreements are also used in HCM without Recruiting
- **Conclusion**: Not possible via standard configuration

**Consolidated Tasks Security:**
- For Employment Agreement Consolidated Task, both users must have:
  - Assignment to step (same aggregated security group based on role-based security group)
  - Assignment via same organization
  - Multiple domain permissions for worksheet generation
- **Troubleshooting**: If one user receives "not assigned or insufficient security" error despite identical group assignments, verify organization assignment path and all required domains

### Known Limitations
- Internal/External candidate segregation not fully supported by delivered security model
- Collective Agreement details cannot be displayed on career site job postings due to security around Worker Data
- Security model for Consolidated Tasks is complex and not fully documented

### Troubleshooting

**Blank Offer Letters with Correct Calc Fields:**
1. Verify `WD-DocumentGenerator` domain permissions
2. Check all domains referenced by calc fields
3. Confirm Worker Data access if pulling from internal candidates
4. Test with super user to isolate security vs configuration issue

**Candidate Notification Receiver Cannot See Hiring Manager Title:**
1. Grant Worker Data: Business Title on Worker Profile domain
2. Confirm Candidate Data domains are granted
3. Test calc field after domain grant
4. Consider creating report to verify data is available before testing in notification

**Recruiter Cannot See Requisition Compensation Details:**
1. Verify View All on Requisition Compensation BP policy
2. Check domain security beyond standard Candidate Data
3. Compare working user vs non-working user security group assignments
4. Test with isolated Recruiter-only user to confirm gap

**Consolidated Tasks Error for One User:**
1. Verify both users assigned to same aggregated security group
2. Confirm organization assignment path is identical
3. Review all domains required for worksheet generation
4. Check for differences in role-based security group membership

---

## Approvals & Conditional Logic

### Overview
Approval workflows in the Offer BP support complex routing scenarios including hierarchical approvals, conditional logic based on questionnaire responses, and skip logic to prevent redundant approvals.

### Best Practices

**Skip Logic for Redundant Approvals:**
- **Use case**: Customer wants to skip Offer BP approval if user already approved Job Requisition
- **Implementation challenge**: Requires calculated field to identify JR approvers from Offer/EA business object
- **Key consideration**: JR approvals vs Offer approvals serve different purposes:
  - JR approval: Approves JR creation, organization link, position details
  - Offer approval: Approves candidate-specific details (hire date, location, compensation)
- **Recommendation**: Before implementing skip logic, clarify with customer: What is the reason for JR approval? What is the reason for Offer approval? Is the skip truly eliminating redundancy?

**Top-of-Hierarchy Approval Routing:**
- **Use case**: Approval should route to top person (manager) of supervisory org hierarchy regardless of depth (5 branches or 2 branches down)
- **Solution**: Assign HR Executive role to top of hierarchy and route approval to that role
- **Key configuration**:
  - All sup orgs roll up to one top sup org (typically CEO)
  - Assign CEO or top manager as HR Executive
  - Route approval to HR Executive role
- **Alternative approach**: Use Management Level filtering (SVP/EVP) for top approver identification
- **Note**: Cannot define someone in middle of hierarchy as "top" - must be actual top of org structure

**Conflict of Interest (COI) Approvals:**
- **Use case**: COI form sent to interview panel prior to offer; multiple approvers based on disclosure
- **Implementation**:
  - COI approvals typically occur in Interview process prior to Offer stage
  - Multiple approvers configured based on questionnaire answers
  - Custom objects used for approve/not approve decisions
- **Pattern**: Questionnaires in Interview stage feed custom object data, which drives conditional approval routing

**Pre-Offer Selection Report:**
- **Use case**: Consolidated report (candidate, requisition, assessment, BGC details) routed to Manager for approval before Offer/EA stage
- **Requirement**: Recruiter cannot move candidate forward until approval received
- **Implementation**: Approval step in Job App BP before Offer sub-BP with Manager as approver

**Post-Acceptance Routing:**
- **Use case**: Once internal transfer candidate accepts offer, route to HR Executive for notification or approval
- **Common pattern**: Notification rather than approval
- **Typical placement**: After offer acceptance, before generating offer letter
- **Implementation**: Notification step to HR Executive in Offer BP after acceptance

### Technical Details

**Calculated Field for Approval Skip Logic:**
```
Offer/Employment Agreement > Job Requisition > Job Requisition Event 
(ESI to find first BP on job req) > Approved By Workers
```
- This calculated field identifies who approved the JR
- Can be used in condition rule to skip Offer approval if same user found

**HR Executive Role Assignment:**
- Assign at top sup org level (typically CEO or organizational leader)
- Role inherits down the hierarchy
- Use role-based constrained security for proper inheritance
- Route approval step to HR Executive role rather than specific person

**Custom Objects for Approval Decisions:**
- Place custom objects on Job Application (not Offer Event)
- Custom objects can store questionnaire responses or approval decisions
- Non-effective-dated, allowing edits post-hire if needed
- Can be referenced in condition rules for approval routing

**Supplementary Questionnaire Approval Limitations:**
- **Challenge**: Customer wants approval on supplementary questionnaire step
- **Limitations identified**:
  - Approver can approve or send back to Recruiter
  - Approver CANNOT edit questions/answers
  - Approver CANNOT deny the process (even with Deny configured in BP policy)
  - Approver can only view the questions included
- **Recommendation**: Configure user-based security group with limited users who ensure questionnaires are properly created before use, rather than relying on approval workflow

### Known Limitations
- Supplementary Questionnaires cannot be edited or denied in approval step
- Cannot force deny action in Supplementary Questionnaire approval even with BP policy configuration
- Condition rules for approval skip logic can be complex and may not cover all edge cases
- Top-of-hierarchy routing requires actual org structure top; cannot define arbitrary "top" in middle of hierarchy

### Troubleshooting

**Approval Skip Logic Not Working:**
1. Verify calculated field path from Offer to JR Approvers
2. Test calculated field in report to confirm correct approver is returned
3. Review condition rule logic for edge cases (multiple approvers, different JR BPs)
4. Consider whether JR and Offer approvals serve truly redundant purposes

**Top-of-Hierarchy Approval Not Routing Correctly:**
1. Verify HR Executive role is assigned at top sup org level
2. Confirm role-based constrained security is used (not user-based)
3. Check that approval step routes to role, not specific person
4. Test with various org levels to confirm inheritance

**Supplementary Questionnaire Approval Cannot Deny:**
- This is a product limitation, not configuration issue
- Workaround: Implement questionnaire quality control via security group membership rather than approval workflow
- Consider Ideation Hub enhancement request (referenced in discussions but not voteable)

---

## Ready for Hire & Hire Process

### Overview
The Ready for Hire step transitions candidates from Recruiting to HCM, triggering the Hire business process. Proper configuration of autocomplete, security groups, and field defaults ensures smooth automation while maintaining data integrity.

### Best Practices

**Autocomplete Configuration Checklist:**
1. **Completion step placement**: Set on Staffing Action step in Ready for Hire BP
2. **Rule-based BP definitions**: Specify which events should autocomplete (applies to both rule-based and Default Definition)
3. **Work Hours Profile**: Position Setup Options prompt should NOT be selected in tenant if autocompl ete is desired
4. **Batch/Job steps**: Check "Don't wait for this step to complete, move immediately to the next step" on every Batch/Job step
5. **Subprocess autocomplete**: Enable on Assign Pay Group, Propose Compensation Hire, Change Org Assignments, Collective Agreements, Contract, Request One-Time Payment
6. **Staffing field defaults**: Enable for all key/required fields from Offer
7. **Offer input requirements**: Offer must request all required Hire inputs (hire date, reason, position), defaulting other fields (pay rate type, exemption status)
8. **Security group permissions**: Recruiter/Primary Recruiter must have permissions to initiate and complete Hire event

**Ready for Hire Automation Without Offer:**
- **Use case**: Use Ready for Hire Automation step in Review Candidate to skip Offer and autocomplete Hire
- **Challenge**: Autocomplete typically works with Offer and manual Ready for Hire; automation without Offer is untested in community
- **Configuration attempt**: Add UBSG 'Ready for Hire automatic' (tied to ASR Automation Ready for Hire) to all initiating security groups on Hire and subprocesses
- **Status**: Community has not confirmed successful autocomplete when using automation to skip both Offer and manual Ready for Hire
- **Recommendation**: May require Workday support engagement for this specific automation scenario

**Propose Compensation Autocomplete:**
- **Observation**: Propose Compensation Offer/Employment Agreement in Job App BP may autocomplete, which could cascade to Propose Compensation Hire autocompleting
- **Note**: Consultant not well-versed in Recruiting acknowledged uncertainty about this behaviour
- **Verification needed**: Confirm whether Offer subprocess autocomplete impacts Hire subprocess autocomplete

**One-Time Payment (OTP) Trigger:**
- **Rule**: `Offer OTP > 0` on Hire BP for Request OTP step
- **Reported issue**: Rule keeps skipping and showing as Not Required even when OTP exists on Offer
- **Status**: Consultants seeking updated rule that reliably kicks off OTP request step
- **Note**: Rule may require updates for current Workday version

### Technical Details

**Ready for Hire Automation Security:**
- UBSG: 'Ready for Hire automatic' 
- Tied to ASR (Automatic Step Resolution): Automation Ready for Hire
- Must be added to ALL initiating security groups on Hire event and subprocesses
- Without this UBSG, automation will not trigger Hire process

**Staffing Field Defaults:**
- Configuration location: Edit Tenant Setup - Recruiting
- Enable defaults for:
  - Hire date
  - Hire reason  
  - Position
  - Pay rate type
  - Exemption status
  - Other required Hire fields
- Defaults flow from Offer to Hire, enabling autocomplete when all required fields populated

**Propose Compensation Hire Autocomplete:**
- Listed as subprocess where autocomplete should be enabled
- Part of overall Hire autocomplete strategy
- Ensure autocomplete checkbox selected in BP configuration

**Interview Scheduling After Offer:**
- **Question**: Can Interview Scheduling be used after offer for pre-hires to schedule I-9 call?
- **Status**: Community discussion but no confirmed answer provided
- **Consideration**: Interview Scheduling typically occurs before Offer; using post-offer for compliance tasks is non-standard use case

### Known Limitations
- Autocomplete with Ready for Hire Automation (skipping Offer and manual Ready for Hire) not confirmed working in community
- OTP trigger rule (`Offer OTP > 0`) reported as unreliable in current Workday versions
- Propose Compensation subprocess autocomplete cascade behaviour not fully documented

### Troubleshooting

**Hire Not Autocompleting:**
Review checklist:
1. Completion step on Staffing Action step?
2. Work Hours Profile NOT selected in Position Setup Options?
3. "Don't wait for this step" checked on all Batch/Job steps?
4. Autocomplete enabled on all subprocesses (Assign Pay Group, Propose Compensation Hire, etc.)?
5. Staffing field defaults enabled for all required fields?
6. Offer populating all required Hire fields?
7. Recruiter/Primary Recruiter has Hire initiation and completion permissions?
8. Rule-based BP definition specifies autocomplete correctly?

**Ready for Hire Automation Not Triggering Hire:**
1. Verify UBSG 'Ready for Hire automatic' added to all Hire subprocess initiating security groups
2. Check that automation step is configured in Review Candidate
3. Confirm Offer is not required in workflow (if skipping Offer entirely)
4. May need Workday support for this specific scenario

**Request OTP Skipping Despite OTP on Offer:**
- Review condition rule syntax
- Test with super user to isolate security vs rule issue
- Check if OTP field has value in Offer data
- Consider alternative rule structure if `Offer OTP > 0` not working
- Engage Workday support for updated rule pattern

---

## Regenerate Offer

### Overview
The Regenerate Offer business process allows updates to offer letters after initial generation. Understanding the limitations and workarounds ensures successful implementation for customers who need to revise offers post-acceptance or post-hire.

### Best Practices

**Custom Objects vs Questionnaires:**
- **Regenerate Offer BP limitation**: Does NOT allow questionnaire steps
- **Impact**: Customer cannot correct or provide new questionnaire answers prior to regenerating document
- **Workaround**: Use custom object on Job Application instead of questionnaire
  - Custom object fields can be updated and will display in regenerated doc
  - Can be used in condition rules just like regular offer BP
  - Custom object is NOT effective-dated
  - Can be edited even if candidate moved to Ready for Hire and Hire process completed
- **Consultant confirmation**: Custom objects work very well with offers; no issues expected for Regenerate Offer use case

**Custom Object Placement:**
- **Recommended location**: Job Application (NOT Offer Event)
- **Benefit**: Non-effective-dated allows edits after candidate progression
- **Use case**: Customer needs to update offer details or questionnaire responses after acceptance or hire
- **Testing status**: Consultant has used custom objects successfully with offers but hasn't specifically tested Regenerate Offer behaviour

### Technical Details

**Custom Object Configuration:**
- Place on Job Application business object
- Not effective-dated (critical for post-hire edits)
- Fields from custom object can populate in offer letter via calculated fields
- Can be referenced in condition rules for Regenerate Offer BP
- Editable after Ready for Hire and Hire completion

**Regenerate Offer BP Structure:**
- Cannot include questionnaire steps
- Can reference custom object fields from Job Application
- Condition rules work with custom object data
- Document generation uses same calc fields as original Offer BP

**Field Population in Regenerated Document:**
- Updated custom object values should display in regenerated document
- Uses same calc field configuration as original offer
- No special configuration needed if custom object properly referenced

### Known Limitations
- Questionnaire steps are not supported in Regenerate Offer BP
- Cannot prompt for new questionnaire answers during regeneration
- Customer must update custom object manually before regenerating if changes needed

### Troubleshooting

**Unable to Update Answers Before Regenerating:**
- **Root cause**: Questionnaires not supported in Regenerate Offer BP
- **Solution**: Migrate questionnaire data to custom object on Job Application
- **Implementation**:
  1. Create custom object with fields matching questionnaire questions
  2. Move questionnaire step to use custom object entry instead
  3. Reference custom object fields in calc fields for offer letter
  4. Custom object remains editable post-hire for future regeneration

**Regenerated Offer Not Showing Updated Values:**
1. Verify custom object was updated with new values
2. Check calc fields reference custom object (not questionnaire)
3. Confirm calc fields placed on Job Application or Offer/EA (not Offer Event)
4. Test calc fields in report to verify values populate before regenerating

---

## Special Configurations

### Overview
Special configurations address unique customer requirements such as high-volume hiring, passport/visa collection during offer stage, evergreen requisitions with multiple job profiles, and supplementary questionnaires. These scenarios often require creative workarounds due to product limitations.

### Best Practices

**Consolidated Offers/EAs for High-Volume Hiring:**
- **Use case**: Manufacturing/plant jobs, sales/retail, call centers
- **Known limitation**: Grade/Progression Steps NOT available in Consolidated Offers
  - Referenced Jira: HRCOMP-55791
  - Workday considers this an "enhancement" request
  - May never be implemented
- **Assessment**: This is a significant limitation given that high-volume hiring scenarios often use compensation grades/steps
- **Recommendation**: Verify grade/step requirements before adopting Consolidated Offers; may not be suitable for all high-volume scenarios

**Passport and Visa Collection at Offer Stage:**
- **Challenge**: Edit Passport and Visa task is NOT natively available in Recruiting module
- **Workaround options**:
  1. Use questionnaires in Offer BP to collect passport/visa details
  2. Collect data post-hire when Edit Passport and Visa task becomes available
  3. Create custom fields to capture data during offer (non-standard)
- **Consultant confirmation**: Used questionnaires in Offer for this purpose successfully
- **Note**: This is a workaround; native task not available during recruiting stage

**Supplementary Questionnaires Setup:**
- **Approval limitations** (see Approvals section for details):
  - Approver cannot edit questions/answers
  - Approver cannot deny process
  - Approver can only view questions
- **Recommendation**: Use user-based security group with limited users to control questionnaire creation quality, rather than relying on approval workflow
- **Alternative approach**: Use secondary questionnaires heavily before resorting to supplementary questionnaires

**Evergreen Requisitions with Multiple Job Profiles:**
- **Use case**: Customer needs candidates to apply for Job Profile A or B; offer determines which profile to use
- **Solution**:
  1. Create 1 job req with Job Profile A as main + Job Profile B as additional (allows selecting right one at offer)
  2. Create 1 evergreen req linked to main req (with Job Profile B as main) with same sup org and location
  3. Candidates can see both and apply to both
  4. Selected candidates either:
     - Already on job req with Profile A, OR
     - Applied to evergreen with Profile B → move to job req A, then edit job profile to B in Offer
  5. Manager can see candidates on both requisitions
- **Benefit**: Avoids needing separate reqs for each profile while maintaining offer-time flexibility

**EU Pay Transparency - Multi-Country Requirements:**
- **Challenge**: Displaying compensation ranges for 3-6+ countries on single job posting
- **Current approach**: Hardcode each country's range in template with conditional logic
- **Limitation**: Creates gaps when country not in Additional Job Posting Locations; unwieldy beyond 6 countries
- **Negotiation tactic**: Work with recruiting to limit Additional Job Posting Locations to 3 max
- **Scaling workaround**: If more countries needed, open additional evergreen job requisitions
- **Status**: No elegant product solution for high-volume multi-country scenarios

### Technical Details

**Consolidated Offers Configuration:**
- High-volume hiring feature
- Multiple offers processed in batch
- Limitation: Cannot include Grade/Progression Steps
- **Workaround**: May need to handle grade/step assignment post-hire in separate transaction

**Questionnaires in Offer:**
- Can be used to collect data not natively supported in Recruiting module
- Examples: Passport details, visa information, custom candidate questions
- Data stored with candidate, available for offer letter population
- Limitation: Regenerate Offer BP doesn't support questionnaires (use custom objects instead)

**Evergreen Req + Job Profile Strategy:**
- Main req: Primary job profile + additional job profile(s)
- Evergreen req: Linked to main req, different primary profile
- Candidates can apply to either
- Movement: Evergreen candidates moved to main req, job profile edited in Offer
- Manager visibility: Can see candidates across both requisitions

### Known Limitations
- Consolidated Offers do not support Grade/Progression Steps (HRCOMP-55791)
- Passport/Visa collection not natively available during Recruiting stage
- Supplementary Questionnaires have significant approval workflow limitations
- EU Pay Transparency multi-country display not scalable beyond ~6 countries

### Troubleshooting

**Grade/Steps Not Available in Consolidated Offers:**
- **Root cause**: Product limitation, not configuration issue
- **Verification**: Check HRCOMP-55791 for Workday stance (considered enhancement, not bug)
- **Workaround**: Handle grade/step assignment in post-hire process
- **Alternative**: May need to not use Consolidated Offers if grade/step required at offer stage

**Cannot Collect Passport/Visa During Offer:**
- **Root cause**: Edit Passport and Visa task not available in Recruiting module
- **Workaround**: Use questionnaires in Offer BP
- **Implementation**: Create questionnaire with passport number, visa details, expiration dates
- **Post-hire**: May need to transfer questionnaire data to official Passport/Visa records after hire

**Supplementary Questionnaire Approval Ineffective:**
- **Root cause**: Approver has no ability to edit or deny
- **Solution**: Don't rely on approval workflow; use security to limit questionnaire creators
- **Implementation**: User-based security group with specific consultants who create/manage questionnaires

---

## Troubleshooting & Common Issues

### Overview
This section consolidates frequently reported issues with Offers and Employment Agreements, providing diagnostic steps and solutions based on community experiences.

### Blank Offer Letters Despite Correct Configuration

**Symptom**: Calculated fields pull data correctly (verified in reports), WD-DocumentGenerator has domain permissions, but offer letter generates blank.

**Common causes:**
1. **Calculated field on wrong business object**: Offer Event vs Offer/Employment Agreement vs Job Application
2. **Missing WD-DocumentGenerator permissions**: Even one missing domain causes blank generation
3. **Proxy user context**: Viewing offer as recruiter via proxy may introduce display issues

**Resolution steps:**
1. Move calculated field from Offer Event to Offer/Employment Agreement or Job Application
2. Audit all domains referenced by calc fields; grant to WD-DocumentGenerator
3. Test with actual user (not proxy) if possible
4. Verify field values in reports before testing in offer generation
5. Check business object path in calc field definition

**Consultant confirmation**: "I usually put calc fields on different business object, not on Offer Event, maybe try Offer/Employment Agreement or Job Application"

### Language Display Issues

**Symptom**: Worker Sub Type or other fields show partially in French (or other language) in English offer letter.

**Investigation:**
- Template language: English only
- User language: English
- Tenant default language: French (or other)
- Document Language field: Not selected or defaults to unexpected language

**Likely causes:**
- Tenant default language setting overrides Document Language field
- Proxy user language context influences display
- Localization settings for specific field types

**Resolution steps:**
1. Verify Document Language field selection in Offer/EA BP initiation
2. Check tenant default language setting
3. Test without proxy (directly as user)
4. Review localization settings for affected field types
5. If critical issue persists, escalate to Workday support

**Consultant observation**: "User's language shouldn't influence but anyway it's English, that's why no idea where the French wording is coming from. I know French is default language, but why would that appear in offer letter?"

### Candidate Merge Impact on Reporting

**Symptom**: Customer needs to report on "old" candidate ID after candidate has been merged; using RDS of Offer Agreement.

**Investigation:**
- Field would need to come from Job Application or Candidate
- Connection not available through Person object when sourcing from Offer Agreement RDS

**Resolution:**
- **Confirmed**: This is not achievable via standard configuration
- **Workaround**: May need custom report or integration to track pre-merge candidate IDs
- **Alternative**: Document merge actions separately for audit trail

**Consultant confirmation**: "I am unable to find a connection even through Person. I was wondering if this was even doable."

### Purge Impact on Employee Addresses

**Symptom**: Customer ran purge with filter to exclude merged records, but employee home address was purged for person with merged candidate record.

**Context:**
- Person had merged candidate record
- Subsequently hired
- Purge report using "Prospects and Candidates for Purging" data source
- Filter to exclude merged records was configured

**Research findings:**
- Internal candidate records should NOT be touched in purge
- Employee home address should not be affected by candidate data purge
- Unexpected behaviour despite proper configuration

**Status**: Root cause unclear; escalate to Workday support for investigation

### DocuSign Integration Failures

**Symptom**: Candidates not receiving "Review Document" task; integration status shows FAILED.

**Troubleshooting checklist:**
1. **Verify DocuSign account settings:**
   - Data Population Scope = Envelope
   - 2-Step Verification = DISABLED
   - Single Sign On (SSO) = DISABLED
   - Using non-SSO account

2. **Check Full Process Record:**
   - Navigate to Full Process Record from Event
   - Go to Error tab for specific error messages
   - Look for "Check eSignature Signing Status" option (missing indicates failure)

3. **Common resolutions:**
   - Delete and recreate integration setup
   - Clear cache and re-authenticate connection
   - Test with different DocuSign account if SSO suspected
   - Verify Workday-DocuSign connection authentication

**Community confirmation**: Multiple consultants report these steps resolve most DocuSign integration issues

### Offer Accepted Field on Candidate Grid

**Symptom**: Calculated field to show "Offer Accepted" on candidate list grid not working as expected; nested CFs to check if offer was redirected not returning expected results.

**Challenge:**
- Determining when offer was accepted and presenting on candidate grid
- Nested calculated fields approach not working reliably

**Status**: Community seeking working calc field pattern; no confirmed solution shared

**Investigation areas:**
- Business object for calc field (Job Application vs Offer/EA)
- Field to check for acceptance (redirect vs status vs event)
- Nested vs single calc field approach

### Collective Agreement Not Displaying on Career Site

**Symptom**: Collective Agreement details configured in Job Posting Template Content, but don't display on Internal Career Site.

**Investigation:**
- Standard field available in configuration
- Field properly selected
- Not displaying on published job posting

**Finding**: Security is around Worker Data (not Candidate Data or Job Requisition Data)
- May not have been designed for Recruiting use case
- Collective agreements used in HCM without Recruiting context

**Resolution**: **NOT POSSIBLE** via standard configuration
- Consultant confirmed: "I have never had such a request but I think it's not possible."

### Delivered Template Cannot Be Deleted

**Symptom**: Customer wants to remove delivered "External Offer" document template from tenant; no easy deletion method.

**Context:**
- Customer in GOLD using Docs offer template in Drive
- Delivered template causing confusion or selection errors
- Sample documents also cannot be removed

**Resolution**: Requires Workday support engagement
- No standard configuration option to delete delivered templates
- Similar issue with sample documents for offer/EA

**Status**: Known product limitation; escalate to Workday for removal

---

## Additional Resources

### Community Knowledge Gaps

The following topics were discussed but lack confirmed solutions:

1. **Offer Accepted calc field** for candidate grid display
2. **Hire autocomplete** when using Ready for Hire Automation to skip both Offer and manual Ready for Hire
3. **Updated OTP trigger rule** that reliably works with current Workday versions
4. **Interview Scheduling** use after offer for pre-hire I-9 scheduling
5. **Compensation Eligibility Rule Trigger Moments** within Recruiting (deprecated Community documentation)

### Escalation Triggers

Escalate to Workday Support when:
- DocuSign integration fails after standard troubleshooting
- Language display issues persist despite configuration verification
- Purge unexpectedly affects employee data
- Delivered template deletion needed
- Hire autocomplete with Ready for Hire Automation doesn't work
- Security configuration doesn't achieve desired candidate visibility

### Best Practice Validation

Always validate these community practices in your tenant:
- Calculated field business object placement (Offer/EA vs Offer Event)
- WD-DocumentGenerator domain permissions
- DocuSign account configuration settings
- Autocomplete checklist for Ready for Hire
- Custom object usage for Regenerate Offer

---

**Document Version**: 1.0  
**Maintained by**: Product Manager Agent  
**Contribution**: Based on 202 Slack messages from Workday functional consultants  
**Feedback**: Report inaccuracies or suggest additions for future versions
