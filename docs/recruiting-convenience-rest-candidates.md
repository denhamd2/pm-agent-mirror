# Recruiting Convenience Tasks Eligible for REST API Conversion

## Methodology

- Discovery used XO metadata search (`task:` queries across recruiting-related terms) and deduplication.
- Eligibility used a **practical filter**: keep Recruiting convenience tasks that can map to stable resource-oriented REST surfaces; exclude launcher/hub shells, test/debug tasks, and obvious non-Recruiting collisions.
- Analysis inputs came from task-level metadata and task analysis signals (domains, element content structure, class/CRF hints, nested subrepresentation patterns).
- Scope note: search is bounded by tool result limits, so this is the practical eligible set discovered in the current run.

## Eligible Tasks (Practical)

| Task Name | WID | Description | REST API Details / Requirements |
|---|---|---|---|
| ~Recruiting Sources~ | `dc3dbc7a446c11de98360015c5e6daf6` | Convenience task for Applicant Source Category and Applicant Source setup (domain: Set Up: Pre-Hire Process). Includes nested source lists. | Good fit for reference-data CRUD with nested resources (category -> sources). Requires representation design for multi-level structures and processing for ordered/inactive states. |
| Recruiting Search Periods | `53c47c33fa3810000422865597280054` | Convenience task managing faceted recruiting search range configuration (domain: Pre-Hire Process Development). | Admin/config CRUD candidate. Requires careful CRF normalization because generic introspection fields can be noisy; validate against existing recruiting search/filter APIs before building new service. |
| Candidate Rating | `7f91b4eb9dfe10002dbe358ce3f20000` | Convenience task anchored to Job Application, Rating Template, and Rating Criteria models. | Strong candidate for read + update endpoints for rating artifacts. Requires validation mapping for score/template constraints and privacy/security checks around evaluator data. |
| Interview | `e42177b27e2d10001151bcd8ee4d00cd` | Questionnaire-centric convenience task with response/question/attachment patterns. | Best as scoped REST surface (e.g., questionnaire response read/update) rather than broad full CRUD. Requires attachment handling, nested representation content, and potential masking/privacy rules. |
| Job Application Changes | `4cc71e8668ac10001d16f4e7429200dd` | Convenience task exposing Job Application update history semantics. | Natural history/audit API candidate (primarily GET). If write actions are needed, model as explicit update events rather than direct state mutation. |
| Candidate Communication | `e8482681f86a10000d7ea68cdaa54745` | Convenience task for candidate communication timeline fields (SMS/email/push metadata, invitation links, attachments). | Strong read API candidate for timeline retrieval; limited write/action operations may be added selectively. Requires communications consent/legal review and attachment/resource subpaths. |
| Map Job Application Questions | `359ca360ae56100022a3cecaa04dbe76` | Recruiting mapping-oriented convenience task for Job Application question structures. | Potentially high-value but complex mapping API. Requires phase-1 analysis to confirm conditional mapping behavior and class/report-field stability before implementation. |
| Job Application Details Card | `ea05bddfaf8610000869b440d51a0179` | Composite convenience task for Job Application details. | Practical GET-focused API candidate if it adds card-specific derived payload not present in existing Job Application APIs. Prefer read-first surface. |
| Offer | `e42177b27e2d1000115e891b3d4700d1` | Recruiting offer convenience task (needs early validation to confirm it is not just a launcher shell in this tenant). | Candidate only if analysis confirms object-bearing element content. Otherwise route to richer offer composite tasks for durable resource modeling. |
| Offer Business Title | `733db946391b10002df0462d84ec255f` | Convenience task focused on offer business-title data slice. | Narrow, focused resource slice endpoint candidate; useful for integrations that need title-specific payloads without full offer composites. |
| Offer Details Composite View | `a33617b8abc8100008762dedc1bc0754` | Large offer-centric composite convenience task with broad field coverage. | High-value REST candidate for offer aggregate retrieval/update. Requires careful `mapsToClass` decision, operation processing design, and explicit smoke checks across CRUD/action paths. |
| Offer Attachments Composite View | `74874e9cd7b1100013b1db94286f273e` | Offer attachment-focused convenience task. | Good fit for offer-attachment subresource API. Requires binary/multipart handling, metadata + download/upload semantics, and attachment permission modeling. |
| Review Offer | `e91532e0ec5610001795975c640a0031` | Offer review decision convenience task. | Candidate if modeled as review resource/actions; must reconcile with business-process action endpoints to avoid duplicate semantics. |
| View Offer Status | `26a66c491d73100020b0f964ea2e0462` | Offer status read convenience task. | Primarily GET/status API candidate. Validate overlap with existing Offer status web-service patterns before introducing a new internal service shape. |
| Interview Results Entered by | `dc3f0a30446c11de98360015c5e6daf6` | Setup convenience task for interview results attribution configuration. | Reference-data CRUD candidate with likely small schema footprint; confirm org/role relationships in phase 1. |
| Interview Team Optimization Skill+TG | `970f9997678610001140c8637e490000` | Convenience task for interview team optimization skill config. | Candidate for config API if feature is in scope/enabled. Validate tenant gating and ensure API contracts tolerate toggle-dependent fields. |
| View Recruiting Event | `564677c7236f10000ba8d34568a00017` | Convenience task for recruiting event read models (candidate engagement). | Strong GET/event read API candidate; create/edit/unpublish actions may remain better represented by dedicated process tasks. |
| Maintain Recruiting Event Types for Candidate Engagement+TG | `7e68765a260e10001efc18497a270000` | Convenience task managing recruiting event type taxonomy. | Classic reference-data CRUD API candidate. Requires straightforward representation/operation setup with security-domain checks. |
| Student Recruiting Event | `2ccaa7c820451000058e324bb9a00025` | Convenience task for student recruiting events. | Candidate for event resource APIs if student recruiting is in scope. Requires canonical task selection where multiple related student-event tasks exist. |
| Maintain Recruiting Disposition Categories | `b4e676e070f21000119dc4b3e5770000` | Convenience task for disposition category administration. | Useful admin CRUD candidate. Must compare against existing disposition web-service surfaces and prefer parity/extension over duplication. |
| View Recruiting Disposition Categories / Category | `279f2ae9beef1000233afa8aa2580000`, `279f2ae9beef100028783de0895c0000` | Read-focused convenience tasks for disposition taxonomy. | Candidate as consolidated GET collection/item resource pair. Prefer unifying list/detail semantics in one service design. |
| View/Maintain Recruiting Disposition(s) | `c4f46ff77d5f445d9a33dcbb0f4ef59f`, `c5d70301928c4e36921d5ba69515bdea`, `df4f5e91c4a04dc3b953faabb56ed514` | Convenience tasks exposing disposition entities. | Candidate where tenant needs richer internal behavior than existing web-service endpoints. Requires parity analysis and careful migration path planning. |
| ~Evergreen Requisition~ Details for Job Requisition Workspace | `0b71f4660487100016ee57e1c58f01c5` | Convenience task focused on evergreen job requisition workspace details. | Candidate for evergreen requisition read/update payloads if existing endpoints are insufficient. Requires job requisition class boundary confirmation in phase 1. |
| Talent Pools | `733377b7aeea49e5abd6d658b69a1f46` | Convenience task for talent pool directory/management semantics. | Candidate if recruiting operations need pool CRUD and search integration. Requires cross-domain boundary check with broader talent product surfaces. |
| Talent Pool Membership / Header | `be624fafaab0100016afc5b1e8c50112`, `0eb6bf64c3114751bcf7c083d3f97ced` | Convenience tasks for talent pool membership and related header context. | Membership task is a stronger REST candidate (actionable resource shape) than header-only variants. Model membership as primary collection endpoint. |
| Talent Statements | `da9d5c6096cf100025c612fd760c02a7` | Convenience task for talent statement data. | Candidate only with explicit privacy controls and clear external-consumer need; likely read-first before write operations. |
| Configure Talent Tags | `bcf9de7399f010001404e8dab1eb01cd` | Convenience task for talent tag setup. | Good reference-data CRUD candidate. Requires stable tag model and controlled update semantics. |
| Talent for Talent Review / Talent Summary for Talent Review | `ba6bb60d0a8c4362b6078c5c09071cad`, `2b1fb678134741df909409eb44f7417d` | Talent-review convenience tasks (recruiting-adjacent). | Candidate only when Talent Review integration is in scope. Requires cross-product ownership/security alignment before API commitment. |
| View Recruiting Agency / Maintain Agency Types | `f00c21020e1010000670e4fcf4f00096`, `12b0b252939910000bc762fb1c3700fb`, `12b0b252939910000bc762a14f4500f8`, `fe299a24214210000e27f40eb562008f` | Recruiting agency directory and agency-type setup convenience tasks. | Candidate for agency + agency-type resources. Must inventory existing agency web-service capabilities first to avoid duplicating available surfaces. |
| Recruiting Agency Questionnaire Results | `2354eeceb051100011943f3b145f00f3` | Convenience task for agency questionnaire result views. | Practical read-focused API candidate for aggregated questionnaire outcomes; requires consistency with questionnaire model and permissions. |
| Recruiting Questionnaire Distributor Type (View/Edit/Create/Delete) | `f6052eda42b010000ca4b5d617ad02b6`, `f6052eda42b010000ca4b642087b02b9`, `f6052eda42b010000ca4b609602202b7`, `f6052eda42b010000ca4b628734202b8` | Convenience task quartet for distributor type setup. | Strong narrow admin CRUD candidate. Requires clean consolidation into one resource with standard GET/POST/PATCH/DELETE semantics. |

## Excluded Patterns (Not Practically Eligible)

| Task/Pattern | Why Excluded |
|---|---|
| Recruiter Hub+TG and other hub/launcher shells | Navigation/aggregation tasks without durable resource semantics. |
| Create Recruiting Campaign launcher variants | Thin launcher pattern (minimal object payload), poor standalone API value. |
| Job Application BP Debug Tool and test/BPF artifacts | Engineering/test metadata, not customer-facing recruiting API candidates. |
| Procurement/Financial “Requisition*” collisions | Name collision with Recruiting terms but backed by non-Recruiting domains/classes. |
| Deprecated convenience task variants | Not a good target for net-new API scaffolding. |
| eIWO/I-9 disposition convenience tasks | Compliance/onboarding-adjacent surfaces outside core Recruiting REST target scope for this inventory. |

