# Pattern: Candidate Smart View (Profile / Detail View)

**Figma Reference:** [Candidate Smart View](https://www.figma.com/design/H9MuNnyypzRiuB5PQ6BMGJ/Candidate-Smart-View?node-id=75-93506)

This pattern defines the standard layout and Canvas Kit component mapping for detailed profile views, specifically the Candidate Smart View, within Workday Recruiting.

## Layout Hierarchy & Canvas Kit Mapping

The layout follows a split-pane design with a persistent context header, a main content area (often a two-column grid), and an optional sliding communication dock on the right.

### 1. Global Shell & Navigation
*   **Global Header:** Use `WorkdayTopNav` (grey bar, white pill search, trailing utilities).
*   **Primary Left Rail:** Use `WorkdayLeftTabBar` (primary rail with stacked icon + uppercase micro-label).
*   **Secondary Hub Column (Vertical Tabs):** Use the secondary column of `WorkdayLeftTabBar`.
    *   *Header:* Hub `<Heading>` + optional `userIcon` (e.g., a person icon for a candidate profile).
    *   *Tabs:* Vertical sub-nav pills. Inactive tabs are medium grey; active tabs use a darker grey pill fill with bold near-black text.

### 2. Main Content Area
The main content area (`<Flex flex={1} flexDirection="column">`) sits on a light grey canvas (`SANA_PAGE_CANVAS`).

#### A. Profile Header Card
A large, prominent header card at the top of the content area.
*   **Avatar & Identity:** Candidate avatar, primary name line (`<Heading size="large">`).
*   **Job Metadata:** Key details like applied job, current status, location, etc. (`<BodyText size="small">`).
*   **Primary Actions:** Action buttons (e.g., "Move Forward", "Reject") aligned to the right.
*   *Canvas Kit:* `<Card>` with a white background, `<Flex>` for layout, `<Avatar>`.

#### B. Content Grid (Two-Column Layout)
Below the header, the detailed information is typically organized in a two-column grid.
*   **Left Column (Overview/Summary):** Often contains a summary card, key skills, or quick facts.
*   **Right Column (Details/History):** Contains detailed sections like Resume/CV, Work History, Education, or Assessment results.
*   *Canvas Kit:* `<Flex>` or CSS Grid to create the columns. Content is housed within individual white `<Card>` components with thin `soap300` borders and rounded corners (`SANA_CARD_RADIUS_LG` or ~16-20px).

### 3. Communication Dock (Right Rail)
An optional, sliding column on the right side of the screen for multi-channel communication (Email, SMS, WhatsApp, Notes).
*   **Right Rail (Collapsed State):** A narrow rail containing icons for different communication channels.
    *   *Styling:* `communicationRailButtonStyle` (~10px rounded tile, active channel gets a light blue fill + link-colour icon ring).
*   **Sliding Panel (Expanded State):** Opens when a channel is clicked.
    *   *Header:* Channel name and actions on a white surface (`SANA_COMM_PANEL_SURFACE`).
    *   *Thread/History:* Message bubbles (`SanaCommMessageBubble`) with white backgrounds, `soap300` borders, and ~12px radii (`SANA_COMM_MESSAGE_RADIUS_PX`).
    *   *Composer:* Input area (`SanaCommComposer`) using a pill container (`SANA_COMM_COMPOSER_RADIUS_PX`), white fill, focus rings, and an inset circular send button.
    *   *Canvas Kit:* Wrap in a `<Card padding="zero">`. Use shared patterns from `design/components/SanaCommPanelPatterns.tsx`.

## Styling Notes (Sana Style)
*   **No Breadcrumbs:** Do not use breadcrumb trails or chevron path strips. Hierarchy is established via the left tab bar and page titles.
*   **Surfaces:** `SANA_PAGE_CANVAS` for the background, white for cards and panels.
*   **Typography:** Clear hierarchy with Roboto. Bold section titles, regular body text.

## When to Use This Pattern
Use this pattern whenever the primary user job is to deeply review a single entity (like a Candidate, a specific Job Requisition detail, or an Employee Profile) and take contextual actions or communicate directly from that view.