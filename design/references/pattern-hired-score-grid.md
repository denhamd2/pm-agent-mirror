# Pattern: HiredScore Grid (Data Grid / List View)

**Figma Reference:** [HiredScore - Grid](https://www.figma.com/design/PZAsU9yw1ID2ECXP9ZKqL2/Hired-Score---Grid?node-id=661-21051)

This pattern defines the standard layout and Canvas Kit component mapping for data grids, list views, and candidate pipelines within the Workday Recruiting Hub.

## Layout Hierarchy & Canvas Kit Mapping

The layout follows a standard shell with a main content area containing context headers, pipeline visualization, and a complex data grid with filtering.

### 1. Global Shell
*   **Global Header:** Use `WorkdayTopNav` (grey bar, white pill search, trailing utilities).
*   **Primary Left Rail:** Use `WorkdayLeftTabBar` (primary rail with stacked icon + uppercase micro-label).
*   **Secondary Nav Menu (Hub):** Use the secondary column of `WorkdayLeftTabBar` (e.g., "Recruiting Hub" title, vertical sub-nav pills for sections).

### 2. Main Content Area
The main content area (`<Flex flex={1} flexDirection="column">`) contains the following vertical sections:

#### A. Context Header
*   **Title & Metadata:** A header card containing the primary title (e.g., "Product Manager") and metadata (e.g., Job Req ID, Location, Target hire date, Hiring Manager, Recruiter).
    *   *Canvas Kit:* `<Heading size="large">` for the title, `<BodyText size="small">` for metadata.
*   **Top-level Tabs:** Navigation for different views of the context (e.g., Candidates, Details, Team).
    *   *Canvas Kit:* `<Tabs>` component.

#### B. Section Header & Actions
*   **Section Title:** e.g., "Active Candidates".
    *   *Canvas Kit:* `<Heading size="medium">`.
*   **Primary/Secondary Actions:** Action buttons aligned to the right.
    *   *Canvas Kit:* `<SecondaryButton>` or `<PrimaryButton>`.

#### C. Pipeline Visualization
*   A horizontal visual representation of the candidate pipeline stages.
    *   *Canvas Kit:* Custom flex layout using `<Flex>` and `<Box>` to represent stages, often with counts.

#### D. Grid Area (Split View)
A two-column layout containing filters on the left and the data grid on the right.

*   **Left Column: Faceted Search / Filters**
    *   Header: "Filters" with a collapse/expand toggle.
    *   List of filter categories and options.
    *   *Canvas Kit:* `<Flex>` sidebar, `<Heading size="small">`, `<Checkbox>` or custom list items for filter options.

*   **Right Column: Data Grid**
    *   **Saved Filters / Views:** Quick toggles for saved filter states.
    *   **Action Bar / Toolbar:** Bulk actions for selected rows.
    *   **Contextual Action Bar:** Actions specific to the current view.
    *   **Data Table:**
        *   *Canvas Kit:* `<Table>` component.
        *   *Headers:* `<Table.Header>` (use `whiteSpace: 'nowrap'` for fixed-width columns, `width: '100%'` for expanding columns).
        *   *Rows:* `<Table.Row>` and `<Table.Cell>`.
        *   *Row Actions:* A menu or inline buttons for actions on a specific row (e.g., "Move Forward", "Reject"). Use `<Menu>` or `<ToolbarIconButton>`.
    *   **Pagination:** Controls at the bottom of the table.
        *   *Canvas Kit:* `<Pagination>` component.

## Styling Notes (Sana Style)
*   **Surfaces:** Use `SANA_PAGE_CANVAS` for the main background behind the grid. Use white (`#FFFFFF`) for the grid container and filter panels.
*   **Borders:** Use thin `soap300` borders for separating the filter panel from the grid and for table rows.
*   **Radii:** Use `SANA_CARD_RADIUS_LG` for the main grid container.
*   **Typography:** Maintain clear hierarchy. Use bold for column headers and regular weight for cell data.

## When to Use This Pattern
Use this pattern whenever the primary user job is to review, filter, and take action on a large list of items (candidates, job requisitions, reports, etc.).