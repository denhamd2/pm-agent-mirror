# User Stories - Bespoke Development Setup

**Draft Date**: 27 April 2026  
**Status**: Created in Jira under epic [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977)  
**Context**: Team onboarding for sliding side panel and two-way messaging work

**Created Stories:**
- [HRREC-91703](https://jira2.workday.com/browse/HRREC-91703) - UIC Git Org Write Access
- [HRREC-91704](https://jira2.workday.com/browse/HRREC-91704) - Complete Bespoke Onboarding Setup
- [HRREC-91705](https://jira2.workday.com/browse/HRREC-91705) - Set Up Local Development Environment
- [HRREC-91706](https://jira2.workday.com/browse/HRREC-91706) - Add Team as Codeowners to SSP Repo
- [HRREC-91707](https://jira2.workday.com/browse/HRREC-91707) - Add Team as Codeowners to 2WM Repo

---

## Story 1: UIC Git Org Write Access

**User Story:**

As a developer preparing to work on bespoke 2-way Email UI, I want to obtain write access to the UIC GitHub organisation, so that I can contribute code as a codeowner for the sliding side panel repository.

**Dev Notes:**

- **Prerequisite for**: Sliding side panel development work
- **Why needed**: Team members need to be codeowners to avoid dependency on external code reviews from the Calabra team
- **How to request**: Post in the #recruiting-ui-jacuzzi Slack channel (shared by Emily last week - needs to be reshared when Jira is created)
- **What to expect**: Waiting period for access approval; no significant dev work required
- **Alternative**: Could be added to specific repo only, but wouldn't be codeowners (not preferred)

**Resources:**

*Documentation resources:*
- [Technical Docs](https://docs.workday.build/recruiting/documentation/system-components/HRREC/cand-communication/two-way-messaging/)
- [Functional Docs](https://sites.google.com/workday.com/collabrakebabra/home)

*Development resources:*
- [two-way-messaging repo](https://ghe.megaleo.com/recruiting/two-way-messaging)
- [sliding-side-panel repo](https://ghe.megaleo.com/UIC/sliding-side-panel)
- [Recruiting Bespoke Onboarding](https://ghe.megaleo.com/recruiting/Ramp/wiki)

---

## Story 2: Complete Bespoke Onboarding Setup

**User Story:**

As a developer preparing to work on bespoke 2-way Email UI, I want to complete the Recruiting Bespoke Onboarding setup steps and activities, so that I have the necessary tools and knowledge to develop React/TypeScript applications.

**Dev Notes:**

- **Location**: Recruiting Bespoke Onboarding documentation (https://ghe.megaleo.com/recruiting/Ramp/wiki)
- **What's included**:
  - **Machine setup steps**: Install YARN, NVM, and other dependencies
  - **Scripts**: Set up dependency management scripts
  - **Chrome extension**: Install development tools extension (quite handy according to Emily)
  - **Optional activities**: React/TypeScript exercises (similar to post-boot camp or XO bootcamp activities)
- **Who should do activities**: Anyone not familiar with React or wanting to refresh skills
- **Activity context**: Created recently (within last year) by recruiting developers in Pleasanton, so very up-to-date
- **Note from Emily**: Activities are newer than old course she did when first starting bespoke
- **Dependencies**: None (can be done independently, but helpful before repo setup)

**Resources:**

*Documentation resources:*
- [Technical Docs](https://docs.workday.build/recruiting/documentation/system-components/HRREC/cand-communication/two-way-messaging/)
- [Functional Docs](https://sites.google.com/workday.com/collabrakebabra/home)

*Development resources:*
- [two-way-messaging repo](https://ghe.megaleo.com/recruiting/two-way-messaging)
- [sliding-side-panel repo](https://ghe.megaleo.com/UIC/sliding-side-panel)
- [Recruiting Bespoke Onboarding](https://ghe.megaleo.com/recruiting/Ramp/wiki)

---

## Story 3: Set Up Local Development Environment

**User Story:**

As a developer preparing to work on bespoke 2-way Email UI, I want to set up the sliding side panel and two-way messaging repositories locally, so that I can build, run, and test changes in my development environment.

**Dev Notes:**

- **Repositories to clone**:
  1. **Sliding side panel (SSP)** repo
  2. **Two-way messaging (2WM)** repo
  3. **Possibly 3rd repo** (to be confirmed during spike - Emily needs to investigate)
- **Setup tasks**:
  - Clone repos
  - Install dependencies
  - Build projects locally
  - Verify successful builds
- **Recommended practice**: 
  - Make small test changes to get familiar with the codebase
  - Practice hosting code to see how it looks in SUV
  - Get comfortable with the local development workflow
- **Prerequisites**: Story 2 (machine setup) should be completed first
- **Spike dependency**: 3rd repo confirmation depends on Emily's spike findings

**Resources:**

*Documentation resources:*
- [Technical Docs](https://docs.workday.build/recruiting/documentation/system-components/HRREC/cand-communication/two-way-messaging/)
- [Functional Docs](https://sites.google.com/workday.com/collabrakebabra/home)

*Development resources:*
- [two-way-messaging repo](https://ghe.megaleo.com/recruiting/two-way-messaging)
- [sliding-side-panel repo](https://ghe.megaleo.com/UIC/sliding-side-panel)
- [Recruiting Bespoke Onboarding](https://ghe.megaleo.com/recruiting/Ramp/wiki)

---

## Story 4: Add Team as Codeowners to SSP Repo

**User Story:**

As a developer preparing to work on bespoke 2-way Email UI, I want to add our team as codeowners to the sliding side panel repository, so that we can approve pull requests and avoid email overload from other teams' PRs.

**Dev Notes:**

- **Prerequisites**: 
  - Story 1 (write access to UIC org) must be completed first
  - All team members must have write access before being added as codeowners
- **GitHub team setup**: Emily has already created teams in GitHub; everyone needs to be added to UIC team once write access is granted
- **CODEOWNERS file**: Create pull request to update the file to include our team
- **Timing consideration**: 
  - Don't do too early (will start getting email notifications for Calabra team's PRs)
  - Wait until towards end of sprint if we're gearing up for code contributions next sprint
  - Coordinate timing with actual development start date
- **Side effect of early implementation**: Email bombardment from PR reviews (even though we don't have to approve Calabra's PRs since they're also codeowners)

**Resources:**

*Documentation resources:*
- [Technical Docs](https://docs.workday.build/recruiting/documentation/system-components/HRREC/cand-communication/two-way-messaging/)
- [Functional Docs](https://sites.google.com/workday.com/collabrakebabra/home)

*Development resources:*
- [two-way-messaging repo](https://ghe.megaleo.com/recruiting/two-way-messaging)
- [sliding-side-panel repo](https://ghe.megaleo.com/UIC/sliding-side-panel)
- [Recruiting Bespoke Onboarding](https://ghe.megaleo.com/recruiting/Ramp/wiki)

---

## Story 5: Add Team as Codeowners to 2WM Repo

**User Story:**

As a developer preparing to work on bespoke 2-way Email UI, I want to add our team as codeowners to the two-way messaging repository, so that we can approve pull requests and manage code contributions effectively.

**Dev Notes:**

- **Prerequisites**: 
  - Story 1 (write access to UIC org) must be completed first for SSP repo
  - For 2WM repo: Everyone should already be on the two-way messaging team (per Emily)
- **Current status**: Team members already added to 2WM GitHub team (unlike SSP/UIC team)
- **CODEOWNERS file**: Create pull request to update the file to include our team
- **Timing consideration**: 
  - Same as Story 4 - don't do too early to avoid PR notification email overload
  - Coordinate with development start date
  - Towards end of sprint when ready to begin code contributions
- **Difference from Story 4**: UIC write access is only needed for SSP repo; 2WM team access is already in place

**Resources:**

*Documentation resources:*
- [Technical Docs](https://docs.workday.build/recruiting/documentation/system-components/HRREC/cand-communication/two-way-messaging/)
- [Functional Docs](https://sites.google.com/workday.com/collabrakebabra/home)

*Development resources:*
- [two-way-messaging repo](https://ghe.megaleo.com/recruiting/two-way-messaging)
- [sliding-side-panel repo](https://ghe.megaleo.com/UIC/sliding-side-panel)
- [Recruiting Bespoke Onboarding](https://ghe.megaleo.com/recruiting/Ramp/wiki)

---

## Sprint Planning Notes

**From the meeting:**
- These stories support the goal of "getting everyone up to date" so the team can "hit the ground running" after story mapping and refinement
- Story 1-3 are prerequisites for actual development work
- Story 4-5 are preparation items (can be placeholder Jiras for now)
- Priority 1: Purge plans Part 2
- Priority 2: This setup work
- Emily has made a head start already
- Follow-up tomorrow: Sprint planning to determine what's realistic to pull in

**Additional context:**
- Interview Team Optimization (ITO) is being paused/reprioritized
- Handover documentation being created for ITO (where we landed, future work)
- Knowledge share planned for team owning interview component (Paradox integration)
- Team is switching gears to sliding side panel and two-way messaging work

---

**Next Steps:**
1. Review these stories in tomorrow's sprint planning
2. Determine realistic scope for next sprint
3. Create Jira tickets after approval
4. Assign story points based on team capacity
