/**
 * India — Candidate profile two-way recruiting email (v92)
 *
 * **Figma reference (match target):** https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=4044-5797
 * Frame: "Template Selection" — global header + recruiting rail + candidate menu + two-column profile + collaboration compose panel.
 *
 * Route: /india-candidate-profile-email-v92
 * Mission: INDIA-E2E-006
 * Design Brief: design/india-candidate-profile-email-v92-design-brief.md
 * PRD: docs/prds/india-candidate-profile-email-conversation-prd.md
 */
import { useState, useCallback, type CSSProperties } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { PrimaryButton, SecondaryButton, TertiaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Table } from '@workday/canvas-kit-react/table';
import {
  boldIcon,
  chevronDownSmallIcon,
  chevronLeftSmallIcon,
  fileIcon,
  italicsIcon,
  linkIcon,
  locationIcon,
  mailIcon,
  phoneIcon,
  chartIcon,
  clockIcon,
  alarmClockIcon,
  unorderedListIcon,
  orderedListIcon,
  relatedActionsIcon,
  searchIcon,
  speechBubbleIcon,
  underlineIcon,
  userIcon,
} from '@workday/canvas-system-icons-web';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { FormSelect, FormTextInput } from './components/SharedFormControls';
import { cardStyle } from './components/profileHelpers';

/** Figma: global header height */
const HEADER_H = 64;
/** Figma: recruiting icon rail */
const RECRUITING_RAIL_W = 65;
/** Figma: candidate chrome */
const CANDIDATE_MENU_W = 300;
/** Figma: collaboration panel total width */
const COLLAB_PANEL_W = 1000;
/** Figma: collaboration inner channel rail */
const COLLAB_RAIL_W = 64;

const SANA_SOAP_200 = colors.soap200;
const SANA_SOAP_300 = colors.soap300;
const SANA_SOAP_400 = colors.soap400;
const FIGMA_BANNER_BG = '#FFECAB';
const FIGMA_LOGO_ORANGE = '#F5A623';

const CANDIDATE = {
  name: 'Chloe Clarkson',
  title: 'JR-0073 Marketing Coordinator',
  phone: '+1 408-977-3477 (Mobile)',
  email: 'Chloe.Clarkson@gmail.com',
  location: '111 Jackson Blvd, Chicago, IL 60604 United States of America',
  jobsInReview: '1',
};

const CANDIDATE_NAV = [
  { id: 'summary', label: 'Summary', icon: relatedActionsIcon },
  { id: 'overview', label: 'Overview', icon: fileIcon },
  { id: 'history', label: 'Recruiting History', icon: clockIcon },
  { id: 'attachments', label: 'Attachments', icon: fileIcon },
  { id: 'reminders', label: 'Reminders', icon: alarmClockIcon },
  { id: 'questionnaire', label: 'Questionnaire Results', icon: userIcon },
  { id: 'interview', label: 'Interview', icon: userIcon },
  { id: 'screening', label: 'Screening', icon: fileIcon },
  { id: 'offer', label: 'Employment Offer', icon: fileIcon },
  { id: 'notes', label: 'Personal Notes', icon: userIcon },
] as const;

function railIconButton(active: boolean, children: React.ReactNode, title: string, onClick?: () => void) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: RECRUITING_RAIL_W,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: active ? colors.blueberry100 : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function collabRailTile(active: boolean, icon: typeof mailIcon, label: string, onClick: () => void) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: COLLAB_RAIL_W,
        height: COLLAB_RAIL_W,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: active ? colors.blueberry100 : 'transparent',
        cursor: 'pointer',
        borderBottom: `1px solid ${SANA_SOAP_300}`,
      }}
    >
      <SystemIcon icon={icon} size={24} color={active ? colors.blueberry500 : colors.blackPepper400} />
    </button>
  );
}

function GlobalHeader({ searchValue, onSearchChange }: { searchValue: string; onSearchChange: (v: string) => void }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      paddingX="m"
      style={{
        height: HEADER_H,
        minHeight: HEADER_H,
        borderBottom: `1px solid ${SANA_SOAP_300}`,
        backgroundColor: colors.frenchVanilla100,
        flexShrink: 0,
      }}
    >
      <Flex alignItems="center" gap="m">
        <TertiaryButton size="medium" aria-label="Global menu">
          <SystemIcon icon={relatedActionsIcon} size={24} />
        </TertiaryButton>
        <BodyText size="large" style={{ margin: 0, fontWeight: 700, color: colors.blackPepper600 }}>
          GMS
        </BodyText>
      </Flex>
      <Box
        flex={1}
        maxWidth={526}
        marginX="l"
        style={{
          border: `1px solid ${SANA_SOAP_400}`,
          borderRadius: 8,
          backgroundColor: colors.frenchVanilla100,
          padding: '8px 12px',
        }}
      >
        <Flex alignItems="center" gap="s">
          <SystemIcon icon={searchIcon} size={24} color={colors.licorice300} />
          <input
            aria-label="Search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              minWidth: 0,
              fontSize: 16,
              fontWeight: 400,
              color: colors.blackPepper400,
              background: 'transparent',
            }}
          />
        </Flex>
      </Box>
      <Flex alignItems="center" gap="xs">
        {[0, 1, 2, 3].map((i) => (
          <ToolbarIconButton key={i} icon={relatedActionsIcon} aria-label="Tool" size="medium" />
        ))}
        <Avatar size={Avatar.Size.m as never} />
      </Flex>
    </Flex>
  );
}

function RecruitingNavRail() {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      style={{
        width: RECRUITING_RAIL_W,
        minWidth: RECRUITING_RAIL_W,
        borderRight: `1px solid ${SANA_SOAP_300}`,
        backgroundColor: colors.frenchVanilla100,
        paddingTop: space.s,
      }}
    >
      {railIconButton(false, <SystemIcon icon={relatedActionsIcon} size={24} />, 'Home')}
      {railIconButton(true, <SystemIcon icon={userIcon} size={24} />, 'Find candidates')}
      {railIconButton(false, <SystemIcon icon={searchIcon} size={24} />, 'Search')}
      {railIconButton(false, <SystemIcon icon={chartIcon} size={24} />, 'Reports')}
      <Box style={{ width: 40, height: 1, backgroundColor: SANA_SOAP_300, marginY: 'm' }} />
      {railIconButton(false, <SystemIcon icon={relatedActionsIcon} size={24} />, 'Favorites')}
      {railIconButton(false, <SystemIcon icon={relatedActionsIcon} size={24} />, 'Settings')}
    </Flex>
  );
}

function CandidateMenu({
  activeNav,
  onNav,
}: {
  activeNav: string;
  onNav: (id: string) => void;
}) {
  return (
    <Flex
      flexDirection="column"
      style={{
        width: CANDIDATE_MENU_W,
        minWidth: CANDIDATE_MENU_W,
        borderRight: `1px solid ${SANA_SOAP_300}`,
        backgroundColor: colors.frenchVanilla100,
        paddingTop: space.xs,
      }}
    >
      <Box padding="m">
        <Flex justifyContent="flex-end" gap="xs" marginBottom="s">
          <ToolbarIconButton icon={fileIcon} aria-label="Tag" size="small" />
          <ToolbarIconButton icon={fileIcon} aria-label="PDF" size="small" />
        </Flex>
        <Flex flexDirection="column" alignItems="center" marginBottom="m">
          <Heading size="small" style={{ margin: 0, textAlign: 'center' }}>
            {CANDIDATE.name}
          </Heading>
          <Subtext style={{ marginTop: 4, textAlign: 'center' }}>{CANDIDATE.title}</Subtext>
          <Box marginTop="s">
            <SecondaryButton size="small">Actions</SecondaryButton>
          </Box>
        </Flex>
        <Flex justifyContent="space-around" paddingBottom="m">
          {[
            { icon: phoneIcon, label: 'Phone' },
            { icon: speechBubbleIcon, label: 'Message' },
            { icon: fileIcon, label: 'Resume' },
          ].map((c) => (
            <Flex key={c.label} flexDirection="column" alignItems="center" gap="xxs">
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 4,
                  backgroundColor: colors.soap200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SystemIcon icon={c.icon} size={24} color={colors.blackPepper500} />
              </Box>
              <Subtext>{c.label}</Subtext>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Box flex={1} style={{ overflow: 'auto' }}>
        {CANDIDATE_NAV.map((item) => {
          const sel = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNav(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                border: 'none',
                background: sel ? colors.blueberry100 : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <SystemIcon icon={item.icon} size={24} color={sel ? colors.blueberry600 : colors.blackPepper400} />
              <BodyText
                size="small"
                style={{
                  margin: 0,
                  fontWeight: sel ? 700 : 600,
                  color: sel ? colors.blueberry600 : colors.blackPepper500,
                }}
              >
                {item.label}
              </BodyText>
            </button>
          );
        })}
      </Box>
    </Flex>
  );
}

function ProfileMainColumn() {
  const cell: CSSProperties = { padding: '8px 12px', borderBottom: `1px solid ${SANA_SOAP_200}`, fontSize: 13 };
  return (
    <Flex flex={1} gap="l" padding="m" style={{ minWidth: 0, overflow: 'auto', backgroundColor: colors.soap200 }}>
      <Box style={{ flex: '0 1 437px', minWidth: 280 }}>
        <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Flex gap="l" flexWrap="wrap">
            <Flex flex="1" gap="s" minWidth={160}>
              <SystemIcon icon={phoneIcon} size={24} color={colors.blackPepper400} />
              <Box>
                <Subtext>Phone Number</Subtext>
                <BodyText size="small" style={{ margin: 0 }}>
                  {CANDIDATE.phone}
                </BodyText>
              </Box>
            </Flex>
            <Flex flex="1" gap="s" minWidth={160}>
              <SystemIcon icon={mailIcon} size={24} color={colors.blackPepper400} />
              <Box>
                <Subtext>Email</Subtext>
                <BodyText size="small" style={{ margin: 0 }}>
                  {CANDIDATE.email}
                </BodyText>
              </Box>
            </Flex>
          </Flex>
          <Flex gap="l" flexWrap="wrap" marginTop="l">
            <Flex flex="1" gap="s" minWidth={160}>
              <SystemIcon icon={locationIcon} size={24} color={colors.blackPepper400} />
              <Box>
                <Subtext>Location</Subtext>
                <BodyText size="small" style={{ margin: 0 }}>
                  {CANDIDATE.location}
                </BodyText>
              </Box>
            </Flex>
            <Flex flex="1" gap="s" minWidth={160}>
              <SystemIcon icon={fileIcon} size={24} color={colors.blackPepper400} />
              <Box>
                <Subtext>Jobs In Review to</Subtext>
                <BodyText size="small" style={{ margin: 0 }}>
                  {CANDIDATE.jobsInReview}
                </BodyText>
              </Box>
            </Flex>
          </Flex>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Active Job Applications (1)
          </Heading>
          <Flex gap="xs" alignItems="center" marginBottom="xs">
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: colors.blueberry400,
              }}
            />
            <BodyText size="small" style={{ margin: 0, fontWeight: 600 }}>
              Chloe Clarkson - JR-0073 Marketing Coordinator
            </BodyText>
          </Flex>
          <Subtext>Location: Chicago | Date Applied: 11/01/24</Subtext>
          <BodyText size="small" style={{ marginTop: 's', margin: 0, color: colors.blueberry500, fontWeight: 600 }}>
            Review
          </BodyText>
          <Flex flexDirection="column" gap="s" marginTop="m">
            <SecondaryButton size="small">View</SecondaryButton>
            <SecondaryButton size="small">Withdraw application</SecondaryButton>
          </Flex>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Work History
          </Heading>
          <Flex gap="xl" marginBottom="m">
            <Flex flexDirection="column" gap="s">
              <Subtext>Current Job</Subtext>
              <Subtext>Total Jobs</Subtext>
              <Subtext>Total Experience</Subtext>
            </Flex>
            <Flex flexDirection="column" gap="s">
              <BodyText size="small" style={{ margin: 0 }}>
                2 years
              </BodyText>
              <BodyText size="small" style={{ margin: 0 }}>
                2
              </BodyText>
              <BodyText size="small" style={{ margin: 0 }}>
                2 years
              </BodyText>
            </Flex>
          </Flex>
          <Heading size="small" marginBottom="s">
            Experience
          </Heading>
          <BodyText size="small" style={{ margin: 0, lineHeight: 1.5, color: colors.blackPepper500 }}>
            Nationwide Insurance Chief of Staff | February 2008 - Current (15 years, 7 months) Established marketing plan and management strategies through market analysis.
          </BodyText>
        </Card>

        <Card padding="l" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <FormSelect
            id="timeline-filter"
            label=""
            value="all"
            onChange={() => {}}
            options={[
              { value: 'all', label: 'All activity' },
              { value: 'email', label: 'Email' },
            ]}
          />
          <Box marginTop="m" height={1} background={SANA_SOAP_300} />
          <Heading size="small" marginY="m">
            2023
          </Heading>
          <Flex gap="m">
            <Flex flexDirection="column" alignItems="center" gap="xs">
              <Subtext>25 Aug</Subtext>
              <Subtext>25 Aug</Subtext>
            </Flex>
            <Flex flexDirection="column" alignItems="center" gap={0}>
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: colors.soap200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SystemIcon icon={mailIcon} size={24} />
              </Box>
              <Box style={{ width: 2, flex: 1, minHeight: 40, backgroundColor: SANA_SOAP_300 }} />
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: colors.soap200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SystemIcon icon={fileIcon} size={22} />
              </Box>
            </Flex>
            <Box flex={1}>
              <BodyText size="small" style={{ margin: 0, fontWeight: 700 }}>
                System sent &quot;Thank You For Applying!&quot; Em…
              </BodyText>
              <BodyText size="small" style={{ marginTop: 'm', margin: 0, fontWeight: 700 }}>
                E-00001 Multiple Customer Service Career…
              </BodyText>
            </Box>
          </Flex>
        </Card>

        <Card padding="l" marginTop="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Resume / Cover Letter
          </Heading>
          <Flex alignItems="center" gap="s">
            <SystemIcon icon={fileIcon} size={20} />
            <BodyText size="small" style={{ margin: 0 }}>
              Callie.cat.Resume+for+parsing+doc.docx
            </BodyText>
          </Flex>
        </Card>
      </Box>

      <Box style={{ flex: '0 1 514px', minWidth: 280 }}>
        <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="m">
            Job Application Details
          </Heading>
          <Flex flexDirection="column" gap="m">
            <Flex justifyContent="space-between" gap="m" flexWrap="wrap">
              <Subtext style={{ minWidth: 100 }}>Job Requisition</Subtext>
              <BodyText size="small" style={{ margin: 0, flex: 1, textAlign: 'right' }}>
                E-00001 Multiple Customer Service Career Opportunities! (Evergreen) (Open)
              </BodyText>
            </Flex>
            <Flex alignItems="center" gap="m">
              <Subtext style={{ minWidth: 100 }}>Location</Subtext>
              <Flex alignItems="center" gap="xs">
                <SystemIcon icon={locationIcon} size={20} />
                <BodyText size="small" style={{ margin: 0 }}>
                  Chicago
                </BodyText>
              </Flex>
            </Flex>
            <Flex gap="m">
              <Subtext style={{ minWidth: 100 }}>Date Applied</Subtext>
              <BodyText size="small" style={{ margin: 0 }}>
                08/25/2023 04:29:43 PM
              </BodyText>
            </Flex>
            <Flex justifyContent="space-between" gap="m" flexWrap="wrap">
              <Subtext style={{ minWidth: 100 }}>Source</Subtext>
              <BodyText size="small" style={{ margin: 0, flex: 1, textAlign: 'right' }}>
                Landing Paged -&gt; Recruiting Landing Pages -&gt; Internships at GMS
              </BodyText>
            </Flex>
          </Flex>

          <Flex gap="m" marginTop="l" flexWrap="wrap">
            <Avatar size={Avatar.Size.m as never} />
            <Box>
              <BodyText size="small" style={{ margin: 0, fontWeight: 700 }}>
                Tomas Callahan
              </BodyText>
              <Subtext>Hiring Manager</Subtext>
            </Box>
          </Flex>
          <Flex gap="m" marginTop="m" flexWrap="wrap">
            <Avatar size={Avatar.Size.m as never} />
            <Box>
              <BodyText size="small" style={{ margin: 0, fontWeight: 700 }}>
                Rachel Vaccaro
              </BodyText>
              <Subtext>Recruiter</Subtext>
            </Box>
          </Flex>

          <Box marginTop="l">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header style={cell}>Stage</Table.Header>
                  <Table.Header style={cell}>Status</Table.Header>
                  <Table.Header style={cell}>Disposition</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell style={cell}>Review</Table.Cell>
                  <Table.Cell style={cell}>Active</Table.Cell>
                  <Table.Cell style={cell}>—</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Education
          </Heading>
          <BodyText size="small" style={{ margin: 0 }}>
            Tuskegee University B.A. | Marketing
          </BodyText>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Languages
          </Heading>
          <Subtext>none entered</Subtext>
          <Heading size="small" marginTop="l" marginBottom="s">
            Websites
          </Heading>
          <Subtext>none entered</Subtext>
          <Heading size="small" marginTop="l" marginBottom="s">
            Skills
          </Heading>
          <Flex gap="xs" flexWrap="wrap">
            {['Marketing', 'Customer Service', 'Sales', 'Leadership', 'Analysis'].map((s) => (
              <SecondaryButton key={s} size="small">
                {s}
              </SecondaryButton>
            ))}
          </Flex>
        </Card>

        <Card padding="l" style={{ ...cardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Personal Reminders
          </Heading>
          <SecondaryButton size="small">Add reminder</SecondaryButton>
          <Subtext style={{ marginTop: 'm' }}>none entered</Subtext>
        </Card>
      </Box>
    </Flex>
  );
}

function TokenChip({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: '#B7EDDE',
        color: colors.blackPepper600,
        borderRadius: 4,
        padding: '1px 6px',
        fontSize: 12,
        fontWeight: 600,
        margin: '0 2px',
      }}
    >
      {children}
    </span>
  );
}

function ComposeEmailPanel({
  onClose,
  fromValue,
  onFromChange,
  toLine,
  ccValue,
  onCcChange,
  subject,
  onSubjectChange,
  templateId,
  onTemplateChange,
  brandingId,
  onBrandingChange,
}: {
  onClose: () => void;
  fromValue: string;
  onFromChange: (v: string) => void;
  toLine: string;
  ccValue: string;
  onCcChange: (v: string) => void;
  subject: string;
  onSubjectChange: (v: string) => void;
  templateId: string;
  onTemplateChange: (v: string) => void;
  brandingId: string;
  onBrandingChange: (v: string) => void;
}) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const toolbarBtn = (icon: typeof boldIcon, label: string) => (
    <ToolbarIconButton icon={icon} aria-label={label} size="small" onClick={() => {}} />
  );

  return (
    <Flex
      flexDirection="column"
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: colors.frenchVanilla100,
        borderLeft: `1px solid ${SANA_SOAP_300}`,
        maxWidth: COLLAB_PANEL_W - COLLAB_RAIL_W,
      }}
    >
      <Flex
        alignItems="center"
        gap="m"
        padding="s"
        style={{
          borderBottom: `1px solid ${SANA_SOAP_300}`,
          minHeight: 56,
        }}
      >
        <TertiaryButton size="medium" onClick={onClose} aria-label="Back">
          <SystemIcon icon={chevronLeftSmallIcon} size={24} />
        </TertiaryButton>
        <Heading size="small" style={{ margin: 0 }}>
          Compose Email
        </Heading>
      </Flex>

      <Box flex={1} style={{ minHeight: 0, overflowY: 'auto' }}>
        <Box padding="m" style={{ borderBottom: `1px solid ${SANA_SOAP_300}` }}>
          <FormSelect
            id="compose-from"
            label="From *"
            value={fromValue}
            onChange={onFromChange}
            options={[{ value: 'noreply', label: 'No-Reply@workday.com' }]}
          />
          <Flex gap="m" marginTop="m" flexWrap="wrap">
            <Box flex={1} style={{ minWidth: 200 }}>
              <Flex alignItems="center" gap="xxs" marginBottom="xxs">
                <BodyText size="small" style={{ margin: 0, fontWeight: 500, color: colors.blackPepper600 }}>
                  To
                </BodyText>
                <BodyText size="small" style={{ margin: 0, color: colors.cinnamon600 }}>
                  *
                </BodyText>
              </Flex>
              <Flex
                alignItems="center"
                gap="s"
                padding="xs"
                style={{
                  border: `2px solid ${colors.blueberry500}`,
                  borderRadius: 4,
                  minHeight: 40,
                  backgroundColor: colors.frenchVanilla100,
                }}
              >
                <BodyText size="small" style={{ margin: 0, flex: 1, minWidth: 0 }} title={toLine}>
                  {toLine}
                </BodyText>
                <SystemIcon icon={chevronDownSmallIcon} size={24} color={colors.blackPepper400} />
              </Flex>
              <Flex gap="xs" marginTop="xs" flexWrap="wrap">
                <StatusIndicator type={StatusIndicator.Type.Blue} emphasis={StatusIndicator.Emphasis.Low} label="Candidate" />
                <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Agency" />
              </Flex>
            </Box>
            <Box flex={1} style={{ minWidth: 200 }}>
              <FormTextInput id="compose-cc" label="CC" placeholder="Search Recipient" value={ccValue} onChange={onCcChange} />
            </Box>
          </Flex>
          <Box marginTop="m">
            <FormTextInput id="compose-subject" label="Subject" placeholder="" value={subject} onChange={onSubjectChange} />
          </Box>
          <Flex gap="m" marginTop="m" flexWrap="wrap">
            <Box flex={1} style={{ minWidth: 200 }}>
              <FormSelect
                id="msg-template"
                label="Message Template"
                value={templateId}
                onChange={onTemplateChange}
                options={[
                  { value: 'interview', label: 'Interview Request' },
                  { value: 'status', label: 'Application status update' },
                ]}
              />
            </Box>
            <Box flex={1} style={{ minWidth: 200 }}>
              <FormSelect
                id="brand-template"
                label="Email Branding Template"
                value={brandingId}
                onChange={onBrandingChange}
                options={[
                  { value: 'general', label: 'General' },
                  { value: 'campus', label: 'Campus' },
                ]}
              />
            </Box>
          </Flex>
        </Box>

        <Flex
          alignItems="center"
          gap="xxs"
          flexWrap="wrap"
          padding="xs"
          style={{
            borderBottom: `1px solid ${SANA_SOAP_300}`,
            backgroundColor: colors.frenchVanilla100,
          }}
        >
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Undo" size="small" />
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Redo" size="small" />
          <Box width={1} height={24} style={{ backgroundColor: SANA_SOAP_300, margin: '0 4px' }} />
          <SecondaryButton size="small">Normal</SecondaryButton>
          <SystemIcon icon={chevronDownSmallIcon} size={20} />
          <Box width={1} height={24} style={{ backgroundColor: SANA_SOAP_300, margin: '0 4px' }} />
          {toolbarBtn(boldIcon, 'Bold')}
          {toolbarBtn(italicsIcon, 'Italic')}
          {toolbarBtn(underlineIcon, 'Underline')}
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Strikethrough" size="small" />
          <Box width={1} height={24} style={{ backgroundColor: SANA_SOAP_300, margin: '0 4px' }} />
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Text color" size="small" />
          <Box width={1} height={24} style={{ backgroundColor: SANA_SOAP_300, margin: '0 4px' }} />
          <Box
            style={{
              display: 'inline-flex',
              borderRadius: 4,
              backgroundColor: colors.blueberry100,
              padding: 2,
            }}
          >
            <ToolbarIconButton icon={relatedActionsIcon} aria-label="Align left" size="small" onClick={() => {}} />
          </Box>
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Align center" size="small" />
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Align right" size="small" />
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Justify" size="small" />
          <Box width={1} height={24} style={{ backgroundColor: SANA_SOAP_300, margin: '0 4px' }} />
          {toolbarBtn(unorderedListIcon, 'Bullet list')}
          <ToolbarIconButton icon={orderedListIcon} aria-label="Numbered list" size="small" />
          <Box width={1} height={24} style={{ backgroundColor: SANA_SOAP_300, margin: '0 4px' }} />
          {toolbarBtn(linkIcon, 'Link')}
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="Insert data" size="small" />
          <Box flex={1} />
          <ToolbarIconButton icon={relatedActionsIcon} aria-label="AI assist" size="small" />
          <SystemIcon icon={chevronDownSmallIcon} size={20} />
          <SecondaryButton
            size="small"
            onClick={() => setPreviewDevice('desktop')}
            style={
              previewDevice === 'desktop'
                ? { backgroundColor: colors.blueberry100, borderColor: colors.blueberry400 }
                : undefined
            }
          >
            Desktop
          </SecondaryButton>
          <SecondaryButton
            size="small"
            onClick={() => setPreviewDevice('mobile')}
            style={
              previewDevice === 'mobile'
                ? { backgroundColor: colors.blueberry100, borderColor: colors.blueberry400 }
                : undefined
            }
          >
            Mobile
          </SecondaryButton>
        </Flex>

        <Box padding="l" style={{ backgroundColor: colors.soap200 }}>
          <Box
            marginX="auto"
            style={{
              maxWidth: previewDevice === 'mobile' ? 360 : 600,
              transition: 'max-width 0.2s ease',
            }}
          >
            <Box
              padding="l"
              style={{
                backgroundColor: FIGMA_BANNER_BG,
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Flex gap="l" alignItems="center">
                <Box
                  style={{
                    width: 91,
                    height: 91,
                    borderRadius: '50%',
                    backgroundColor: FIGMA_LOGO_ORANGE,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Heading size="small" style={{ margin: 0, color: colors.blackPepper600 }}>
                    GMS Global, International
                  </Heading>
                  <BodyText size="small" style={{ margin: 0, fontStyle: 'italic', color: colors.blackPepper500 }}>
                    The Speed of Tomorrow, Today
                  </BodyText>
                </Box>
              </Flex>
            </Box>
            <Card padding="l" style={{ borderRadius: '0 0 4px 4px', borderTop: 'none' }}>
              <BodyText size="small" style={{ margin: 0, lineHeight: 1.6 }}>
                Hello <TokenChip>Preferred First Name</TokenChip>! You&apos;ve been invited to interview for the role of{' '}
                <TokenChip>Job Name</TokenChip>. Please select your availability for interview down below.
              </BodyText>
              <Flex gap="m" marginTop="m" flexWrap="wrap">
                <SecondaryButton size="small">Job Name</SecondaryButton>
                <SecondaryButton size="small">Interview Date</SecondaryButton>
              </Flex>
            </Card>
          </Box>
        </Box>
      </Box>

      <Flex
        justifyContent="flex-end"
        gap="s"
        padding="m"
        style={{
          borderTop: `1px solid ${SANA_SOAP_300}`,
          backgroundColor: colors.frenchVanilla100,
          flexShrink: 0,
        }}
      >
        <SecondaryButton onClick={onClose}>Discard</SecondaryButton>
        <PrimaryButton>Send</PrimaryButton>
      </Flex>
    </Flex>
  );
}

export function IndiaCandidateProfileEmailV92() {
  const [search, setSearch] = useState('');
  const [activeNav, setActiveNav] = useState('overview');
  const [panelOpen, setPanelOpen] = useState(true);
  const [collabChannel, setCollabChannel] = useState<'mail' | 'msg' | 'wa'>('mail');

  const [fromVal] = useState('noreply');
  const [ccVal, setCcVal] = useState('');
  const [subject, setSubject] = useState('Interview request — Marketing Coordinator');
  const [templateId, setTemplateId] = useState('interview');
  const [brandingId, setBrandingId] = useState('general');

  const toLine = 'Chloe Clarkson <chloe.clarkson@email.com>';

  const closePanel = useCallback(() => setPanelOpen(false), []);

  return (
    <Flex flexDirection="column" style={{ minHeight: '100vh', backgroundColor: colors.soap200 }}>
      <GlobalHeader searchValue={search} onSearchChange={setSearch} />
      <Flex flex={1} style={{ minHeight: 0, position: 'relative' }}>
        <RecruitingNavRail />
        <CandidateMenu activeNav={activeNav} onNav={setActiveNav} />
        <ProfileMainColumn />

        {panelOpen ? (
          <>
            <Box
              aria-hidden
              onClick={closePanel}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(11, 31, 66, 0.35)',
                zIndex: 100,
              }}
            />
            <Flex
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: COLLAB_PANEL_W,
                maxWidth: '100%',
                zIndex: 110,
                boxShadow: '-6px 0 24px rgba(11,31,66,0.12)',
              }}
            >
              <Flex
                flexDirection="column"
                alignItems="stretch"
                style={{
                  width: COLLAB_RAIL_W,
                  minWidth: COLLAB_RAIL_W,
                  backgroundColor: colors.frenchVanilla100,
                  borderLeft: `1px solid ${SANA_SOAP_300}`,
                }}
              >
                {collabRailTile(false, chevronLeftSmallIcon, 'Collapse panel', closePanel)}
                {collabRailTile(false, fileIcon, 'Notes', () => {})}
                {collabRailTile(false, fileIcon, 'Documents', () => {})}
                {collabRailTile(collabChannel === 'mail', mailIcon, 'Email', () => setCollabChannel('mail'))}
                {collabRailTile(collabChannel === 'msg', speechBubbleIcon, 'Messaging', () => setCollabChannel('msg'))}
                {collabRailTile(collabChannel === 'wa', speechBubbleIcon, 'WhatsApp', () => setCollabChannel('wa'))}
              </Flex>
              {collabChannel === 'mail' ? (
                <ComposeEmailPanel
                  onClose={closePanel}
                  fromValue={fromVal}
                  onFromChange={() => {}}
                  toLine={toLine}
                  ccValue={ccVal}
                  onCcChange={setCcVal}
                  subject={subject}
                  onSubjectChange={setSubject}
                  templateId={templateId}
                  onTemplateChange={setTemplateId}
                  brandingId={brandingId}
                  onBrandingChange={setBrandingId}
                />
              ) : (
                <Flex flex={1} alignItems="center" justifyContent="center" style={{ backgroundColor: colors.frenchVanilla100 }}>
                  <BodyText size="small">Select the mail icon to match the Figma &quot;Messages&quot; compose state.</BodyText>
                </Flex>
              )}
            </Flex>
          </>
        ) : (
          <Box
            style={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              zIndex: 50,
            }}
          >
            <PrimaryButton onClick={() => setPanelOpen(true)}>Open compose email</PrimaryButton>
          </Box>
        )}
      </Flex>

      <Box padding="s" style={{ backgroundColor: colors.soap200, borderTop: `1px solid ${SANA_SOAP_300}` }}>
        <Subtext>
          Prototype aligned to Figma node 4044:5797 (2-Way Email Recruiting 12/2024). INDIA-E2E-006 — sample data; Legal
          review for production.
        </Subtext>
      </Box>
    </Flex>
  );
}

export default IndiaCandidateProfileEmailV92;
