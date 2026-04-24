# Schema Analysis WIP - Candidate Tags

## Source Task
- Task: Maintain Candidate Tags
- Task WID: `a624f92773c2100013ee66cb5e9f0036`
- Task type: Convenience Task
- Domain: Set Up: Recruiting (`0c5a957e317945eab092fd92e5f34cad`)
- Backing class: Candidate Tag (`a624f92773c2100012baf839b1680017`)
- Business Object: Candidate Tag (`cbbce774afae1000113bf0920a200016`)

## Element Content Disposition
| Element | Label | Work Data | Executable | Status | Notes |
|---|---|---|---|---|---|
| Candidate Tags Subedit [EL] | - | Candidate Tags Subedit | Candidate Tag@build Candidate Tags Subedit(BE)[remb] | Include | Collection container for Candidate Tag rows |
| Candidate Tag Name [TX] | Candidate Tag | Text Attribute | Candidate Tag@get Candidate Tag Name(GA) | Include | Primary mutable field |
| Candidate Tag Inactive [BL] | Inactive | Boolean Attribute | Candidate Tag@get Candidate Tag Inactive(GA) | Include | Mutable status flag |
| In Use [BL] | In Use | Boolean Attribute | Instance@get Usage Count for Delete Check(SA) | Include | Read-only usage indicator for deletion safety |
| Candidate Tags Name Only [WS] | Candidate Tag | Work Set | Instance@get This Instance(GSS) | Include | Instance projection for view payload |

## Existing Service Surface
- `xo_search` found no existing Candidate Tags service/resource (`service: candidate tags` => total 0).
- Existing legacy web-service tasks exist in metadata (Get/Put Candidate Tag), but no modern service/resource surface identified for reuse.

## Recommendation
Create a new dedicated Candidate Tags REST surface with full CRUD in XO Agents style (`GET`, `POST`, `PATCH`, `DELETE`).
