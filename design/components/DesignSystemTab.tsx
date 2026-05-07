import React, { useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Table } from '@workday/canvas-kit-react/table';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { searchIcon } from '@workday/canvas-system-icons-web';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_SHELL_RADIUS,
  SANA_TAB_PILL_RADIUS,
  SANA_PRIMARY_RAIL_WIDTH_PX,
  SANA_SECONDARY_NAV_WIDTH_PX,
  SANA_PANEL_SHADOW,
  SANA_TOP_NAV_BG,
  SANA_SHELL_COLUMN_BG,
  SANA_LINK_ACCENT,
  SANA_BADGE_RED,
  SANA_SECONDARY_TAB_ACTIVE_BG,
  SANA_COMM_RAIL_ACTIVE_BG,
} from './sanaShellTheme';
import { FormTextInput, FormSelect, FormRadioGroup, FormCheckboxGroup } from './SharedFormControls';
import { WorkdayModal } from './WorkdayModal';
import { AlertBanner } from './AlertBanner';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';
import { ChartCard } from './GenUIPatterns';

const SECTION_HEADER: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: colors.licorice300,
  fontWeight: 700,
  margin: '32px 0 16px',
  paddingBottom: 8,
  borderBottom: `1px solid ${colors.soap300}`,
};

interface ComponentCardProps {
  title: string;
  description: string;
  source: string;
  props: string;
  children: React.ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, source, props, children }) => (
  <Card padding="l" marginBottom="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}>
    <Heading size="small" marginBottom="xxs">{title}</Heading>
    <BodyText size="small" color={colors.licorice300}>{description}</BodyText>
    <BodyText size="small" color={colors.licorice200} marginTop="xxs">
      <code style={{ fontSize: 11, backgroundColor: colors.soap100, padding: '1px 6px', borderRadius: 4 }}>{source}</code>
    </BodyText>
    <Box
      marginTop="m"
      padding="m"
      style={{ backgroundColor: SANA_PAGE_CANVAS, borderRadius: 8, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}
    >
      {children}
    </Box>
    <BodyText size="small" color={colors.licorice300} marginTop="s">
      Props: {props.split(' ').map((p, i) => (
        <code key={i} style={{ fontSize: 10, backgroundColor: colors.soap100, padding: '0 4px', borderRadius: 3, marginRight: 4 }}>{p}</code>
      ))}
    </BodyText>
  </Card>
);

interface SwatchProps {
  color: string;
  hex: string;
  label: string;
}

const Swatch: React.FC<SwatchProps> = ({ color, hex, label }) => (
  <Flex alignItems="center" gap="s" paddingY="xxs" style={{ borderBottom: `1px solid ${colors.soap200}` }}>
    <Box style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: hex.startsWith('#F') || hex.startsWith('#E') || hex.startsWith('#D') ? colors.blackPepper600 : '#fff' }}>
      {hex.replace('#', '')}
    </Box>
    <Box>
      <BodyText size="small" fontWeight="bold" style={{ fontFamily: 'monospace', fontSize: 12 }}>{label}</BodyText>
    </Box>
  </Flex>
);

interface TokenRowProps {
  name: string;
  value: string;
}

const TokenRow: React.FC<TokenRowProps> = ({ name, value }) => (
  <Flex alignItems="center" gap="s" paddingY="xxs" style={{ borderBottom: `1px solid ${colors.soap200}` }}>
    <BodyText size="small" fontWeight="bold" style={{ fontFamily: 'monospace', fontSize: 12, minWidth: 220 }}>{name}</BodyText>
    <BodyText size="small" color={colors.licorice300}>{value}</BodyText>
  </Flex>
);

export const DesignSystemTab: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  const [selectValue, setSelectValue] = useState('all');
  const [radioValue, setRadioValue] = useState('email');
  const [checkValues, setCheckValues] = useState<string[]>(['full-time']);
  const [errorText, setErrorText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box>
      <Heading size="medium" marginBottom="xs">Design System Components</Heading>
      <BodyText size="small" color={colors.licorice300} marginBottom="m">
        Workday Recruiting Prototype Component Library - Canvas Kit v14 + Sana Style
      </BodyText>

      {/* Section 1: Shell & Navigation */}
      <div style={SECTION_HEADER}>Section 1: Shell &amp; Navigation</div>

      <ComponentCard
        title="WorkdayTopNav"
        description="Top navigation bar with W mark, grey pill search, notification icons, and user avatar. White bar with a bottom-edge treatment that depends on variant: 'home' renders the Workday brand gradient (8px) beneath; 'app' (default) renders a 1px grey hairline."
        source="design/components/WorkdayTopNav.tsx"
        props="variant userName notificationCount avatarInitials onSearch"
      >
        <Box style={{ width: '100%', height: 48, backgroundColor: SANA_TOP_NAV_BG, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, border: `1px solid ${colors.soap300}` }}>
          <Box style={{ width: 32, height: 32, backgroundColor: SANA_LINK_ACCENT, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>W</Box>
          <Box style={{ flex: 1, maxWidth: 400, height: 32, backgroundColor: '#F3F4F6', borderRadius: 16, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 13, color: '#999', border: `1px solid ${colors.soap300}` }}>Search or ask anything...</Box>
          <Flex style={{ marginLeft: 'auto' }} gap="s" alignItems="center">
            <Box style={{ width: 20, height: 20, backgroundColor: colors.licorice200, borderRadius: 4, opacity: 0.5 }} />
            <Box style={{ width: 20, height: 20, backgroundColor: colors.licorice200, borderRadius: 4, opacity: 0.5 }} />
            <Box style={{ position: 'relative' }}>
              <Box style={{ width: 20, height: 20, backgroundColor: colors.licorice200, borderRadius: 4, opacity: 0.5 }} />
              <Box style={{ position: 'absolute', top: -4, right: -6, width: 14, height: 14, backgroundColor: SANA_BADGE_RED, borderRadius: '50%', fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</Box>
            </Box>
            <Box style={{ width: 28, height: 28, backgroundColor: SANA_LINK_ACCENT, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>DD</Box>
          </Flex>
        </Box>
      </ComponentCard>

      <ComponentCard
        title="WorkdayLeftTabBar"
        description="Two-zone left navigation: primary icon rail (64px) with stacked icon+label, and secondary text tab column (232px) with pill-highlighted active tab."
        source="design/components/WorkdayLeftTabBar.tsx"
        props="primaryItems[] secondaryTabs[] activeSection activeTab"
      >
        <Flex style={{ height: 200, borderRadius: 8, overflow: 'hidden', width: '100%' }}>
          <Flex flexDirection="column" alignItems="center" paddingY="s" gap="s" style={{ width: 64, backgroundColor: SANA_SHELL_COLUMN_BG, borderRight: `1px solid ${colors.soap300}` }}>
            {['Home', 'Recruit', 'HCM'].map((label, i) => (
              <Flex key={label} flexDirection="column" alignItems="center" gap="xxs" style={{ opacity: i === 1 ? 1 : 0.7 }}>
                <Box style={{ width: 20, height: 20, backgroundColor: i === 1 ? SANA_LINK_ACCENT : colors.licorice200, borderRadius: 4 }} />
                <span style={{ fontSize: 8, color: i === 1 ? SANA_LINK_ACCENT : '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: i === 1 ? 700 : 400 }}>{label}</span>
              </Flex>
            ))}
          </Flex>
          <Flex flexDirection="column" gap="xxs" padding="s" style={{ width: 232, backgroundColor: SANA_SHELL_COLUMN_BG }}>
            {['Candidates', 'Requisitions', 'Interviews', 'Reports'].map((tab, i) => (
              <Box key={tab} padding="xs" style={{ borderRadius: 999, backgroundColor: i === 0 ? SANA_SECONDARY_TAB_ACTIVE_BG : 'transparent', fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#1D1D1D' : '#6B6B6B', paddingLeft: 12 }}>
                {tab}
              </Box>
            ))}
          </Flex>
        </Flex>
      </ComponentCard>

      {/* Section 2: Cards & Containers */}
      <div style={SECTION_HEADER}>Section 2: Cards &amp; Containers</div>

      <ComponentCard
        title="MetricCard"
        description="KPI display card with label, value, helper text, and optional change indicator. Supports positive, negative, and neutral sentiment colours."
        source="design/components/MetricCard.tsx"
        props="label value helperText changeIndicator?:{text,sentiment} onClick?"
      >
        {[
          { label: 'Open requisitions', value: '38', helper: 'Assigned to you', change: '+5 this week', sentiment: 'positive' },
          { label: 'Time to fill', value: '42d', helper: 'Average this quarter', change: '+3d vs target', sentiment: 'negative' },
          { label: 'Interviews scheduled', value: '12', helper: 'This week', change: null, sentiment: null },
        ].map((m) => (
          <Card key={m.label} padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, minWidth: 180 }}>
            <BodyText size="small" color={colors.licorice300} style={{ fontWeight: 500 }}>{m.label}</BodyText>
            <Heading size="large" marginY="xxs">{m.value}</Heading>
            <BodyText size="small" color={colors.licorice300}>{m.helper}</BodyText>
            {m.change && (
              <BodyText size="small" style={{ marginTop: 4, fontWeight: 600, color: m.sentiment === 'positive' ? colors.greenApple600 : colors.cinnamon600 }}>
                {m.change}
              </BodyText>
            )}
          </Card>
        ))}
      </ComponentCard>

      <ComponentCard
        title="ChartCard"
        description="Wrapper around Chart.js (react-chartjs-2) with Canvas Kit card styling. Auto-applies CHART_COLORS and hides grid lines."
        source="design/components/GenUIPatterns.tsx"
        props="title type:bar|line|doughnut|pie data options? onClick?"
      >
        <Flex gap="m" flexWrap="wrap" style={{ width: '100%' }}>
          <Box style={{ flex: '1 1 250px' }}>
            <ChartCard
              title="Pipeline by Stage"
              type="doughnut"
              data={{
                labels: ['Screen', 'Interview', 'Offer', 'Hired'],
                datasets: [{ data: [24, 18, 8, 5], backgroundColor: [colors.blueberry400, colors.cantaloupe400, colors.greenApple400, colors.sourLemon400] }],
              }}
            />
          </Box>
          <Box style={{ flex: '1 1 250px' }}>
            <ChartCard
              title="Applications per Week"
              type="bar"
              data={{
                labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
                datasets: [{ label: 'Applications', data: [42, 58, 35, 67], backgroundColor: colors.blueberry400 }],
              }}
            />
          </Box>
        </Flex>
      </ComponentCard>

      {/* Section 3: Data Display */}
      <div style={SECTION_HEADER}>Section 3: Data Display</div>

      <ComponentCard
        title="Table / Grid"
        description="Canvas Kit Table component for tabular data display. Used throughout recruiting workflows for candidate grids, requisition lists, and report views."
        source="@workday/canvas-kit-react/table"
        props="Table Table.Head Table.Row Table.Header Table.Cell Table.Body"
      >
        <Card padding="zero" style={{ borderRadius: 8, overflow: 'hidden', width: '100%' }}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Candidate</Table.Header>
                <Table.Header>Stage</Table.Header>
                <Table.Header>Location</Table.Header>
                <Table.Header>Score</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                { name: 'Priya Sharma', stage: 'Interview', location: 'Mumbai', grade: 'A', score: '92%', gradeColor: colors.greenApple100, gradeFg: colors.greenApple600 },
                { name: 'James Chen', stage: 'Review', location: 'Singapore', grade: 'B', score: '84%', gradeColor: colors.blueberry100, gradeFg: colors.blueberry500 },
                { name: 'Sarah Williams', stage: 'Screen', location: 'London', grade: 'C', score: '76%', gradeColor: colors.cantaloupe100, gradeFg: colors.cantaloupe600 },
              ].map((c) => (
                <Table.Row key={c.name}>
                  <Table.Cell><BodyText size="medium" fontWeight="bold">{c.name}</BodyText></Table.Cell>
                  <Table.Cell><BodyText size="small" color={colors.licorice300}>{c.stage}</BodyText></Table.Cell>
                  <Table.Cell><BodyText size="small" color={colors.licorice300}>{c.location}</BodyText></Table.Cell>
                  <Table.Cell>
                    <Flex alignItems="center" gap="xs">
                      <Box style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: c.gradeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: c.gradeFg }}>{c.grade}</Box>
                      <BodyText size="small" fontWeight="bold">{c.score}</BodyText>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </ComponentCard>

      <ComponentCard
        title="StatusIndicator"
        description="Canvas Kit StatusIndicator for stage badges, skills tags, and status labels. Supports Green, Blue, Orange, Red, Gray types with High/Low emphasis."
        source="@workday/canvas-kit-react/status-indicator"
        props="type:Green|Blue|Orange|Red|Gray emphasis:High|Low label icon?"
      >
        <Flex gap="s" flexWrap="wrap">
          <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Active" />
          <StatusIndicator type={StatusIndicator.Type.Blue} emphasis={StatusIndicator.Emphasis.Low} label="Interview" />
          <StatusIndicator type={StatusIndicator.Type.Orange} emphasis={StatusIndicator.Emphasis.Low} label="Pending" />
          <StatusIndicator type={StatusIndicator.Type.Red} emphasis={StatusIndicator.Emphasis.Low} label="Rejected" />
          <StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label="Draft" />
        </Flex>
      </ComponentCard>

      {/* Section 4: Controls & Filters */}
      <div style={SECTION_HEADER}>Section 4: Controls &amp; Filters</div>

      <ComponentCard
        title="FormTextInput"
        description="Canvas Kit TextInput with FormField composition. Supports text, email, password, date types with error state and required indicator."
        source="design/components/SharedFormControls.tsx"
        props="id label value onChange type? placeholder? error? required?"
      >
        <Flex gap="m" flexWrap="wrap" style={{ width: '100%' }}>
          <Box style={{ flex: '1 1 250px' }}>
            <FormTextInput id="demo-name" label="Candidate name" value={textValue} onChange={setTextValue} placeholder="Enter full name" />
          </Box>
          <Box style={{ flex: '1 1 250px' }}>
            <FormTextInput id="demo-email" label="Email address" value="" onChange={() => {}} type="email" placeholder="you@example.com" required />
          </Box>
          <Box style={{ flex: '1 1 250px' }}>
            <FormTextInput id="demo-error" label="With error state" value={errorText} onChange={setErrorText} error="This field is required" />
          </Box>
        </Flex>
      </ComponentCard>

      <ComponentCard
        title="FormSelect"
        description="Native select dropdown wrapped in Canvas Kit FormField. Used for simple filter dropdowns throughout recruiting workflows."
        source="design/components/SharedFormControls.tsx"
        props="id label value onChange options[] disabled? required?"
      >
        <Box style={{ maxWidth: 300, width: '100%' }}>
          <FormSelect
            id="demo-select"
            label="Department"
            value={selectValue}
            onChange={setSelectValue}
            options={[
              { value: 'all', label: 'All Departments' },
              { value: 'eng', label: 'Engineering' },
              { value: 'design', label: 'Design' },
              { value: 'product', label: 'Product Management' },
            ]}
          />
        </Box>
      </ComponentCard>

      <ComponentCard
        title="FormRadioGroup"
        description="Canvas Kit Radio buttons with FormField composition. Supports vertical and horizontal layouts."
        source="design/components/SharedFormControls.tsx"
        props="id name label value onChange options[] layout? error? required?"
      >
        <Flex gap="l" flexWrap="wrap" style={{ width: '100%' }}>
          <Box>
            <FormRadioGroup
              id="demo-radio-v"
              name="contactMethod"
              label="Preferred Contact Method"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'sms', label: 'SMS' },
              ]}
            />
          </Box>
          <Box>
            <FormRadioGroup
              id="demo-radio-h"
              name="urgency"
              label="Urgency (horizontal)"
              value="normal"
              onChange={() => {}}
              layout="horizontal"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
              ]}
            />
          </Box>
        </Flex>
      </ComponentCard>

      <ComponentCard
        title="FormCheckboxGroup"
        description="Canvas Kit Checkbox group with FormField composition. Supports multi-select with vertical and horizontal layouts."
        source="design/components/SharedFormControls.tsx"
        props="id label values onChange options[] layout? error? required?"
      >
        <Flex gap="l" flexWrap="wrap" style={{ width: '100%' }}>
          <Box>
            <FormCheckboxGroup
              id="demo-check"
              label="Job Types"
              values={checkValues}
              onChange={setCheckValues}
              options={[
                { value: 'full-time', label: 'Full Time' },
                { value: 'part-time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'intern', label: 'Internship' },
              ]}
            />
          </Box>
        </Flex>
      </ComponentCard>

      <ComponentCard
        title="WorkdayModal"
        description="Standardised wrapper around Canvas Kit Modal enforcing Sana Style radii, neutral surfaces, and proper Header/Body/Footer layout."
        source="design/components/WorkdayModal.tsx"
        props="title children isOpen onClose primaryActionText? onPrimaryAction? width?"
      >
        <Flex flexDirection="column" gap="s" style={{ width: '100%' }}>
          <PrimaryButton onClick={() => setModalOpen(true)}>Open Demo Modal</PrimaryButton>
          <WorkdayModal
            title="Confirm Action"
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            primaryActionText="Confirm"
            onPrimaryAction={() => setModalOpen(false)}
          >
            <BodyText size="medium">This is a live WorkdayModal example with Sana Style radii, neutral surface, and proper Header/Body/Footer layout.</BodyText>
            <BodyText size="small" color={colors.licorice300} marginTop="s">SANA_CARD_RADIUS_LG corners, soap300 borders, soap100 footer background.</BodyText>
          </WorkdayModal>
        </Flex>
      </ComponentCard>

      <ComponentCard
        title="AlertBanner"
        description="Standardised wrapper around Canvas Kit Banner for system alerts and notifications."
        source="design/components/AlertBanner.tsx"
        props="message type:warning|error actionText? onClick? isSticky?"
      >
        <Flex flexDirection="column" gap="s" style={{ width: '100%' }}>
          <AlertBanner type="error" message="3 candidates failed background checks this week." actionText="Review now" />
          <AlertBanner type="warning" message="Interview schedule conflict detected for tomorrow." actionText="Resolve" />
        </Flex>
      </ComponentCard>

      <ComponentCard
        title="PageHeader"
        description="Standardised top-of-page component. No breadcrumbs - clear primary Page Title with optional action buttons."
        source="design/components/PageHeader.tsx"
        props="title subtitle? primaryActionText? onPrimaryAction? secondaryActionText? trailingContent?"
      >
        <Box style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
          <PageHeader
            title="Recruiter Hub"
            subtitle="Manage your active requisitions and candidates"
            primaryActionText="New Requisition"
            onPrimaryAction={() => {}}
            secondaryActionText="Export"
            onSecondaryAction={() => {}}
          />
        </Box>
      </ComponentCard>

      <ComponentCard
        title="EmptyState"
        description="Standardised empty state pattern combining an icon, heading, description, and optional CTA. Used when lists or grids have no data."
        source="design/components/EmptyState.tsx"
        props="icon title description actionText? onAction?"
      >
        <Box style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
          <EmptyState
            icon={searchIcon}
            title="No candidates found"
            description="Try adjusting your filters or search terms."
            actionText="Clear filters"
            onAction={() => {}}
          />
        </Box>
      </ComponentCard>

      {/* Section 5: Communication */}
      <div style={SECTION_HEADER}>Section 5: Communication</div>

      <ComponentCard
        title="CommunicationDock"
        description="Sliding panel dock with channel rail (Email, SMS, Notes, LINE, WhatsApp). White panel surface with depth shadow."
        source="design/components/CommunicationDock.tsx"
        props="channels[] activeChannel messages[] onSend"
      >
        <Flex style={{ height: 200, borderRadius: 8, overflow: 'hidden', width: '100%' }}>
          <Flex flexDirection="column" alignItems="center" paddingY="s" gap="s" style={{ width: 48, backgroundColor: SANA_SHELL_COLUMN_BG, borderRight: `1px solid ${colors.soap300}` }}>
            <Box style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: SANA_COMM_RAIL_ACTIVE_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>&#9993;</Box>
            <Box style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, opacity: 0.5 }}>&#128172;</Box>
            <Box style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, opacity: 0.5 }}>&#128221;</Box>
          </Flex>
          <Flex flexDirection="column" flex="1" padding="m" style={{ backgroundColor: '#fff', boxShadow: SANA_PANEL_SHADOW }}>
            <BodyText size="medium" fontWeight="bold" marginBottom="s">Email</BodyText>
            <Flex flexDirection="column" flex="1" gap="xs">
              <Box padding="xs" style={{ backgroundColor: SANA_PAGE_CANVAS, borderRadius: 12, maxWidth: '80%', fontSize: 12 }}>
                Thank you for your application. We would like to schedule an interview...
                <div style={{ fontSize: 10, color: colors.licorice300, marginTop: 4 }}>28 Mar 2026, 10:15</div>
              </Box>
              <Box padding="xs" style={{ backgroundColor: SANA_COMM_RAIL_ACTIVE_BG, borderRadius: 12, maxWidth: '80%', alignSelf: 'flex-end', fontSize: 12 }}>
                I am available on Tuesday or Wednesday afternoon.
                <div style={{ fontSize: 10, color: colors.licorice300, marginTop: 4 }}>28 Mar 2026, 14:30</div>
              </Box>
            </Flex>
            <Box marginTop="s" padding="xs" style={{ borderRadius: 999, border: `1px solid ${colors.soap300}`, fontSize: 12, color: colors.licorice300 }}>Type a message...</Box>
          </Flex>
        </Flex>
      </ComponentCard>

      {/* Section 6: Theme Tokens */}
      <div style={SECTION_HEADER}>Section 6: Sana Shell Theme Tokens</div>

      <ComponentCard
        title="Colour Palette"
        description="Sana-aligned colour tokens from sanaShellTheme.ts"
        source="design/components/sanaShellTheme.ts"
        props="SANA_PAGE_CANVAS SANA_TOP_NAV_BG SANA_LINK_ACCENT SANA_BADGE_RED"
      >
        <Flex flexDirection="column" gap="zero" style={{ width: '100%' }}>
          <Swatch color={SANA_PAGE_CANVAS} hex="#F3F5F7" label="SANA_PAGE_CANVAS - Page canvas behind cards" />
          <Swatch color={SANA_TOP_NAV_BG} hex="#FFFFFF" label="SANA_TOP_NAV_BG - Top nav (white bar)" />
          <Swatch color={SANA_SECONDARY_TAB_ACTIVE_BG} hex="#E5E7EB" label="SANA_SECONDARY_TAB_ACTIVE_BG - Active tab pill" />
          <Swatch color={SANA_LINK_ACCENT} hex="#005CB9" label="SANA_LINK_ACCENT - Links, primary actions" />
          <Swatch color={SANA_BADGE_RED} hex="#D73B3E" label="SANA_BADGE_RED - Notification badge" />
          <Swatch color={SANA_COMM_RAIL_ACTIVE_BG} hex="#E3F2FD" label="SANA_COMM_RAIL_ACTIVE_BG - Active channel tile" />
        </Flex>
      </ComponentCard>

      <ComponentCard
        title="Spacing &amp; Radius Tokens"
        description="Border radius and shadow values from sanaShellTheme.ts"
        source="design/components/sanaShellTheme.ts"
        props="SANA_CARD_RADIUS_LG SANA_SHELL_RADIUS SANA_TAB_PILL_RADIUS"
      >
        <Flex flexDirection="column" gap="zero" style={{ width: '100%' }}>
          <TokenRow name="SANA_CARD_RADIUS_LG" value={`${SANA_CARD_RADIUS_LG}px - Card border radius`} />
          <TokenRow name="SANA_SHELL_RADIUS" value={`${SANA_SHELL_RADIUS}px - Shell/page border radius`} />
          <TokenRow name="SANA_TAB_PILL_RADIUS" value={`${SANA_TAB_PILL_RADIUS}px - Fully rounded pill`} />
          <TokenRow name="SANA_PRIMARY_RAIL_WIDTH_PX" value={`${SANA_PRIMARY_RAIL_WIDTH_PX}px - Primary icon rail`} />
          <TokenRow name="SANA_SECONDARY_NAV_WIDTH_PX" value={`${SANA_SECONDARY_NAV_WIDTH_PX}px - Secondary tab column`} />
          <TokenRow name="SANA_CARD_SHADOW" value={`${SANA_CARD_SHADOW} - Resting`} />
          <TokenRow name="SANA_PANEL_SHADOW" value="Overlay depth shadow (2-layer)" />
        </Flex>
      </ComponentCard>
    </Box>
  );
};
