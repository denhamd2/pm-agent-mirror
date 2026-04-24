# Schema Implementation WIP - Candidate Tags
---
source_task_wid: a624f92773c2100013ee66cb5e9f0036
source_task_name: Maintain Candidate Tags
source_task_type: Convenience Task
resource_slug: candidate-tags
api_scope: [GET, POST, PATCH, DELETE]
backing_class_wid: a624f92773c2100012baf839b1680017
backing_class_name: Candidate Tag
business_object_wid: cbbce774afae1000113bf0920a200016
target_service_name: candidateTags
target_service_wid: null
mapsToClass_decision: pending
phase_1_status: complete
phase_2_status: pending
phase_3_status: pending
phase_4_status: pending
---

## Naming Reconciliation
| Layer | Name |
|---|---|
| UI Task | Maintain Candidate Tags |
| Source task slug | maintain-candidate-tags |
| Backing class | Candidate Tag |
| Target service | candidateTags |
| Resource URL | /candidate-tags |
| MCP tool prefix | get_candidate_tags, create_candidate_tag, update_candidate_tag, delete_candidate_tag |
| Public JSON aliases | candidateTagName -> Candidate Tag Name, inactive -> Candidate Tag Inactive, inUse -> Usage Count |

## Planned Object Changes
### Business Objects
- Existing: Candidate Tag (`cbbce774afae1000113bf0920a200016`)
- New: none expected

### Class Report Fields
- Existing/reuse candidate:
  - Candidate Tag Name (GA-backed)
  - Candidate Tag Inactive (GA-backed)
  - Usage Count for Delete Check (SA-backed)
- New:
  - alias-focused REST CRFs may be required if existing fields are not API-authorized

### Service
- Create service `candidateTags` if no reusable service exists

### Representations
- Create View representation for Candidate Tag
- Create Edit representation for Candidate Tag

### Representation Content
- View RCs: id, descriptor, candidateTagName, inactive, inUse
- Edit RCs: candidateTagName, inactive

### Service Collection Resource
- Create SCR for `/candidate-tags`

### Service Operations
- Create GET collection
- Create GET by id
- Create POST
- Create PATCH
- Create DELETE

## Phase 2 Preflight Requirement
Before representation writes, decide mapsToClass path:
- derived-subclass
- mirrors-existing-edit-rep
- generate-class-based-processing


## Phase Execution Result
- mapsToClass decision: `candidate-tag-class`
- service context: reused existing `XOAgents` service
- GET verification: `service_operation_get` confirmed `getCandidateTags` wiring and default representation
- POST/PATCH processing: generated class-based processing options successfully
- DELETE processing: blocked (`A3211`), requires exactly one singular representation for class-based generation

### Canonical WIDs
- SCR: `466143eed9e61000279ad2edac150000`
- View rep: `466143eed9e610002792a15890790000`
- Edit rep: `466143eed9e610002794a9fbdce50000`
- GET op: `466143eed9e61000279db810b1150000`
- POST op: `466143eed9e6100027a5eefdb90e0000`
- PATCH op: `466143eed9e6100027a5dffd8a200000`
- DELETE op: `466143eed9e6100027a605d4c1ac0000`
