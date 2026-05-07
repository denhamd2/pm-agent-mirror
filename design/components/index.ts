export {
  WorkdayTopNav,
  WorkdayWMark,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  type WorkdayTopNavProps,
  type WorkdayTopNavVariant,
} from './WorkdayTopNav';
export {
  WorkdayLeftTabBar,
  WORKDAY_LEFT_TAB_BAR_PRIMARY_PX,
  WORKDAY_LEFT_TAB_BAR_SECONDARY_PX,
  type WorkdayLeftTabBarProps,
  type WorkdayLeftTabItem,
  type WorkdayLeftTabBarPrimaryItem,
} from './WorkdayLeftTabBar';
export {
  SANA_PAGE_CANVAS,
  SANA_TOP_NAV_BG,
  SANA_SHELL_COLUMN_BG,
  SANA_PRIMARY_RAIL_BG,
  SANA_SECONDARY_NAV_BG,
  SANA_SECONDARY_TAB_ACTIVE_BG,
  SANA_SECONDARY_TAB_INACTIVE_FG,
  SANA_SECONDARY_TAB_ACTIVE_FG,
  SANA_SEARCH_FIELD_BG,
  SANA_TOP_NAV_DIVIDER,
  SANA_HOMEPAGE_GRADIENT,
  SANA_HOMEPAGE_GRADIENT_HEIGHT_PX,
  SANA_LINK_ACCENT,
  SANA_BADGE_RED,
  SANA_CARD_RADIUS_LG,
  SANA_SHELL_RADIUS,
  SANA_TAB_PILL_RADIUS,
  SANA_CARD_SHADOW,
  SANA_CARD_SHADOW_LIFTED,
  SANA_PANEL_SHADOW,
  SANA_PRIMARY_RAIL_WIDTH_PX,
  SANA_SECONDARY_NAV_WIDTH_PX,
  SANA_COMM_MESSAGE_RADIUS_PX,
  SANA_COMM_COMPOSER_RADIUS_PX,
  SANA_COMM_PANEL_SURFACE,
  SANA_COMM_RAIL_ACTIVE_BG,
  SANA_COMM_RAIL_ACTIVE_ICON,
  SANA_COMM_BUBBLE_BG,
  SANA_COMM_META_FG,
} from './sanaShellTheme';
export {
  CommunicationDock,
  communicationRailButtonStyle,
  DEFAULT_COMM_RAIL_PX,
  DEFAULT_COMM_EXPANDED_PX,
  type CommunicationDockProps,
} from './CommunicationDock';
export {
  sanaCommFormControlStyle,
  sanaCommFormControlFocusStyle,
  SanaCommMessageBubble,
  SanaCommComposer,
  SsaAgentTurn,
  SsaUserPromptPill,
  type SsaAgentTurnProps,
  type SsaUserPromptPillProps,
} from './SanaCommPanelPatterns';
export {
  SsaShell,
  SsaTitleStrip,
  SsaStarterSuggestions,
  SparkleMark,
  SSA_TITLE_STRIP_HEIGHT_PX,
  SSA_CHAT_PANE_WIDTH_PX,
  SSA_COLD_START_MAX_WIDTH_PX,
  type SsaShellProps,
  type SsaTitleStripProps,
  type SsaStarterSuggestionsProps,
} from './SsaShell';
export {
  TeamsChatCard,
  type TeamsChatCardProps,
  type TeamsChatCardPayload,
  type TeamsChatCardVariant,
  TeamsApprovalCard,
  type TeamsApprovalCardProps,
  type TeamsApprovalCardOffer,
} from './TeamsApprovalCard';
export { RichTextEditor, RECRUITING_EMAIL_TEMPLATES, type RichTextEditorProps, type EmailTemplate } from './RichTextEditor';
export { EmailComposer, type EmailComposerProps } from './EmailComposer';
export { ThreadExpansion, type ThreadExpansionProps } from './ThreadExpansion';
export { EmailPanel, type EmailPanelProps, type EmailThread } from './EmailPanel';
export { ProfilePageLayout, type ProfilePageLayoutProps, type ProfileTab, type CommunicationDockConfig } from './ProfilePageLayout';
export { cardStyle } from './profileHelpers';
export {
  FormSelect,
  FormTextInput,
  FormDateInput,
  FormRadioGroup,
  FormCheckboxGroup,
  type FormSelectProps,
  type FormTextInputProps,
  type FormDateInputProps,
  type FormRadioGroupProps,
  type FormCheckboxGroupProps,
} from './SharedFormControls';
export { CanvasKitTest } from './CanvasKitTest';
export { 
  CandidateHomeLayout, 
  type CandidateHomeLayoutProps,
  type CandidateTask,
  type CandidateApplication,
  type SidebarWidget 
} from './CandidateHomeLayout';
export { 
  CandidateTaskModal, 
  type CandidateTaskModalProps 
} from './CandidateTaskModal';
export { 
  AdobeSignAadhaarFlow, 
  type AdobeSignAadhaarFlowProps 
} from './AdobeSignAadhaarFlow';
export { 
  DocumentReviewTask, 
  type DocumentReviewTaskProps,
  type CandidateErrorKind,
  createDocumentReviewCopy 
} from './DocumentReviewTask';
export { 
  HiredScoreGrading, 
  hiredScoreBand, 
  gradePillColors,
  type HsLetter,
  type HiredScoreGradingProps 
} from './HiredScoreGrading';
export { 
  MetricCard, 
  type MetricCardProps 
} from './MetricCard';
export {
  CareerSiteHero,
  JobCard,
  JobDetailsStickyFooter,
  type CareerSiteHeroProps,
  type JobCardProps,
  type JobDetailsStickyFooterProps,
} from './CandidateExperiencePatterns';
export {
  CandidateActionCard,
  DraftMessage,
  CandidateGrid,
  JobReqGrid,
  CandidateCarousel,
  ChartCard,
  CHART_COLORS,
  type CandidateActionCardProps,
  type DraftMessageProps,
  type CandidateGridProps,
  type JobReqGridProps,
  type CandidateGridRow,
  type JobReqGridRow,
  type CandidateCarouselProps,
  type ChartCardProps,
} from './GenUIPatterns';
export {
  A2UIRenderer,
  type A2UINode,
  type A2UIRendererProps,
} from './A2UIRenderer';
export { 
  FilterPill, 
  type FilterPillProps 
} from './FilterPill';
export { 
  ProgressBarWithBadge, 
  type ProgressBarWithBadgeProps 
} from './ProgressBarWithBadge';
export { 
  ReportCard, 
  type ReportCardProps 
} from './ReportCard';
export { 
  ListItemCard, 
  type ListItemCardProps 
} from './ListItemCard';
export { 
  CandidateGradeBadge, 
  type CandidateGradeBadgeProps 
} from './CandidateGradeBadge';
export { 
  CollapsibleSection, 
  type CollapsibleSectionProps 
} from './CollapsibleSection';
export { 
  InsightListItem, 
  type InsightListItemProps 
} from './InsightListItem';
export { 
  StructuredResume, 
  type StructuredResumeProps,
  type ResumeEntry 
} from './StructuredResume';
export {
  WorkdayModal,
  type WorkdayModalProps,
} from './WorkdayModal';
export {
  AlertBanner,
  type AlertBannerProps,
} from './AlertBanner';
export {
  EmptyState,
  type EmptyStateProps,
} from './EmptyState';
export {
  PageHeader,
  type PageHeaderProps,
} from './PageHeader';
export { DashboardGlobalNav, type DashboardGlobalNavProps, type MetricsSlug } from './DashboardGlobalNav';

// BottleneckFlowStrip is intentionally NOT re-exported from this barrel because
// it transitively imports `../data-bp-durations` (Pharos-derived tenant data).
// Localhost consumers must import it directly from './components/BottleneckFlowStrip'
// so the public GHE Pages bundle (which uses this barrel) cannot pull it in.
// See design/vite-plugin-forbidden-imports.ts for the build-time guardrail.
