/**
 * GCC interview scheduling with compliance nudges (prototype v90)
 * Design brief: design/gcc-interview-scheduling-compliance-nudges-design-brief.md (APPROVED)
 * PRD: docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md
 * Mission: GCC-E2E-034 — Step 20
 *
 * Route: /gcc-interview-scheduling-v90
 */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { Card } from '@workday/canvas-kit-react/card';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { TextArea } from '@workday/canvas-kit-react/text-area';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs } from '@workday/canvas-kit-react/tabs';
import {
  StatusIndicator,
  StatusIndicatorType,
  StatusIndicatorEmphasis,
} from '@workday/canvas-kit-react/status-indicator';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
} from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_LINK_ACCENT,
  SANA_COMM_BUBBLE_BG,
  SANA_COMM_MESSAGE_RADIUS_PX,
  SANA_COMM_PANEL_SURFACE,
  SanaCommMessageBubble,
  SanaCommComposer,
  HiredScoreGrading,
  FormSelect,
  FormTextInput,
  FormDateInput,
  MetricCard,
  SANA_CARD_SHADOW,
  SANA_CARD_SHADOW_LIFTED,
  CareerSiteHero,
  JobCard,
  JobDetailsStickyFooter,
} from './components';
import type { WorkdayLeftTabBarPrimaryItem } from './components/WorkdayLeftTabBar';

type AreaTab = 'scheduling' | 'admin' | 'audit' | 'candidate' | 'paradox';
type SchedStep = 'candidates' | 'time' | 'panel' | 'review';

const HUB_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'job-reqs', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'reports', label: 'Reports' },
] as const;

const PRIMARY_RAIL: WorkdayLeftTabBarPrimaryItem[] = [
  {
    icon: homeIcon,
    ariaLabel: 'Home',
    railLabel: 'Home',
    onClick: () => {
      window.location.hash = '/recruiter-home-v85';
    },
  },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'Recruit' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const SLOTS = [
  { id: 's1', label: 'Tue 6 May 2026 · 09:00–10:00 · Video (Teams)' },
  { id: 's2', label: 'Wed 7 May 2026 · 14:00–15:00 · Riyadh office, 12th floor' },
  { id: 's3', label: 'Thu 8 May 2026 · 11:00–12:00 · Video (Teams)' },
];

const PANEL = [
  { name: 'Nora Al-Farsi', role: 'Hiring manager' },
  { name: 'Samir Haddad', role: 'Technical interviewer' },
  { name: 'Priya Menon', role: 'HR business partner' },
];

const PARADOX_SUMMARY = {
  interviewId: 'INT-GCC-90821',
  warnings: [
    { ruleId: 'KSA_MIN_NOTICE', severity: 'warning', messageKey: 'notice_below_threshold' },
    {
      ruleId: 'PANEL_MIX_KSA',
      severity: 'information',
      messageKey: 'panel_composition_advisory',
    },
  ],
  consentRequired: true,
  policyPackVersion: 'KSA-2026.04',
};

function AreaSwitcher({
  area,
  onChange,
}: {
  area: AreaTab;
  onChange: (a: AreaTab) => void;
}) {
  const items: { id: AreaTab; label: string }[] = [
    { id: 'scheduling', label: 'Recruiter scheduling' },
    { id: 'admin', label: 'Admin: GCC compliance' },
    { id: 'audit', label: 'Audit log' },
    { id: 'candidate', label: 'Candidate experience (AI scheduling)' },
    { id: 'paradox', label: 'Paradox compliance contract' },
  ];
  return (
    <Flex
      flexWrap="wrap"
      gap="s"
      padding="m"
      style={{
        borderBottom: `1px solid ${colors.soap300}`,
        backgroundColor: colors.frenchVanilla100,
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {items.map((it) => (
        <SecondaryButton
          key={it.id}
          size="small"
          onClick={() => onChange(it.id)}
          style={{
            fontWeight: area === it.id ? 700 : 400,
            boxShadow: area === it.id ? `inset 0 0 0 2px ${SANA_LINK_ACCENT}` : undefined,
          }}
        >
          {it.label}
        </SecondaryButton>
      ))}
    </Flex>
  );
}

export const GccInterviewSchedulingComplianceNudgesV90: React.FC = () => {
  const [topSearch, setTopSearch] = useState('');
  const [areaTab, setAreaTab] = useState<AreaTab>('scheduling');
  const [hubTab, setHubTab] = useState<string>('candidates');
  const [schedStep, setSchedStep] = useState<SchedStep>('candidates');
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0].id);
  /** Mock: selected slot is below minimum notice for KSA pack */
  const noticeViolation = selectedSlot === 's1';
  const [panelAck, setPanelAck] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');
  const [exceptionAttest, setExceptionAttest] = useState(false);
  const [consentRecorded, setConsentRecorded] = useState(false);
  const [sensitiveToggle, setSensitiveToggle] = useState(false);
  const [legalAttest, setLegalAttest] = useState(false);

  const [auditOrg, setAuditOrg] = useState('all');
  const [auditRule, setAuditRule] = useState('all');
  const [auditFrom, setAuditFrom] = useState('2026-04-01');
  const [auditTo, setAuditTo] = useState('2026-04-30');
  const [auditQuery, setAuditQuery] = useState('');

  const exceptionModal = useModalModel({ id: 'gcc-v90-exception' });
  const attestModal = useModalModel({ id: 'gcc-v90-attest' });

  const startScheduling = useCallback(() => {
    setSchedStep('time');
    setConsentRecorded(false);
    setPanelAck(false);
    setExceptionReason('');
    setExceptionAttest(false);
  }, []);

  const resetToCandidates = useCallback(() => {
    setSchedStep('candidates');
    setConsentRecorded(false);
  }, []);

  const handleSendInvitation = () => {
    if (noticeViolation) {
      exceptionModal.events.show();
      return;
    }
    setConsentRecorded(false);
    resetToCandidates();
  };

  const hubSchedulingMain = () => {
    if (hubTab === 'dashboard') {
      return (
        <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
          <Heading size="large" marginBottom="m">
            Recruiting dashboard
          </Heading>
          <BodyText size="small" color={colors.blackPepper600} marginBottom="l">
            GCC compliance nudges: adoption and warning rates are illustrative for this prototype.
          </BodyText>
          <Flex gap="m" flexWrap="wrap" marginBottom="l">
            <MetricCard
              label="In-product interviews (30 days)"
              value="186"
              helperText="GCC tenants · pilot cohort"
              changeIndicator={{ text: '+12% vs prior month', sentiment: 'positive' }}
            />
            <MetricCard
              label="KSA packs active"
              value="14"
              helperText="Requisitions with rule pack mapped"
              changeIndicator={{ text: '2 new this week', sentiment: 'neutral' }}
            />
            <MetricCard
              label="Warnings acknowledged"
              value="94%"
              helperText="Panel mix · notice · data quality"
              changeIndicator={{ text: 'Target band 90–98%', sentiment: 'neutral' }}
            />
          </Flex>
          <Card padding="l">
            <Heading size="small" marginBottom="s">
              Compliance nudges
            </Heading>
            <BodyText size="small" color={colors.blackPepper600}>
              Dashboard tiles for full adoption metrics are out of scope for this wireframe set (PRD). Use the
              audit workspace to review overrides and consents.
            </BodyText>
          </Card>
        </Box>
      );
    }
    if (hubTab === 'job-reqs') {
      return (
        <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
          <Heading size="large" marginBottom="m">
            Job requisitions
          </Heading>
          <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
            Open requisitions with GCC hiring locations. Select a row to open the candidate pipeline.
          </BodyText>
          <Box
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.soap300}`,
              overflow: 'auto',
              backgroundColor: colors.frenchVanilla100,
              minWidth: 0,
              maxWidth: '100%',
            }}
          >
            <Table style={{ width: '100%', minWidth: 0, tableLayout: 'fixed' as const }}>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Requisition</Table.Header>
                  <Table.Header>Location</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Candidates</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row
                  style={{ cursor: 'pointer' }}
                  onClick={() => setHubTab('candidates')}
                  tabIndex={0}
                >
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      Principal TA Partner · Riyadh HQ
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper500}>
                      REQ-GCC-2026-0142 · KSA entity
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Riyadh, KSA</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <span style={{ display: 'inline-flex' }}>
                      <StatusIndicator
                        type={StatusIndicatorType.Blue}
                        emphasis={StatusIndicatorEmphasis.Low}
                        label="Interview"
                      />
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      47
                    </BodyText>
                  </Table.Cell>
                </Table.Row>
                <Table.Row tabIndex={0}>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 700 }}>
                      Senior Recruiter · Dubai
                    </BodyText>
                    <BodyText size="small" color={colors.blackPepper500}>
                      REQ-GCC-2026-0098 · UAE entity
                    </BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">Dubai, UAE</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <span style={{ display: 'inline-flex' }}>
                      <StatusIndicator
                        type={StatusIndicatorType.Green}
                        emphasis={StatusIndicatorEmphasis.Low}
                        label="Open"
                      />
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small" style={{ fontWeight: 600 }}>
                      112
                    </BodyText>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
        </Box>
      );
    }
    if (hubTab === 'reports') {
      return (
        <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
          <Heading size="large" marginBottom="m">
            Reports
          </Heading>
          <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
            Executive tiles for scheduling adoption and nudge activation are backlog per design brief. Export audit
            events from the audit workspace for now.
          </BodyText>
          <SecondaryButton size="small" onClick={() => setAreaTab('audit')}>
            Open audit log
          </SecondaryButton>
        </Box>
      );
    }

    // candidates hub — req detail + scheduling wizard (WF1–WF4)
    return (
      <Box flex={1} minWidth={0} style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {schedStep === 'candidates' && (
          <Box padding="l">
            <Heading
              size="large"
              marginBottom="xs"
              style={{ maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              Principal TA Partner · Riyadh HQ
            </Heading>
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              REQ-GCC-2026-0142 · Riyadh, KSA · Hiring manager Nora Al-Farsi
            </BodyText>
            <Tabs initialTab="candidates">
              <Tabs.List>
                <Tabs.Item data-id="candidates">Candidates</Tabs.Item>
                <Tabs.Item data-id="details">Details</Tabs.Item>
              </Tabs.List>
              <Tabs.Panel data-id="candidates">
                <Box marginTop="m">
                  <Flex gap="m" flexWrap="wrap" marginBottom="m">
                    <FormSelect
                      id="v90-stage"
                      label="Stage"
                      value="interview"
                      onChange={() => {}}
                      options={[
                        { value: 'interview', label: 'Interview' },
                        { value: 'all', label: 'All stages' },
                      ]}
                    />
                    <FormSelect
                      id="v90-source"
                      label="Source"
                      value="all"
                      onChange={() => {}}
                      options={[
                        { value: 'all', label: 'All sources' },
                        { value: 'referral', label: 'Referral' },
                      ]}
                    />
                  </Flex>
                  <Box
                    style={{
                      borderRadius: SANA_CARD_RADIUS_LG,
                      border: `1px solid ${colors.soap300}`,
                      overflow: 'auto',
                      backgroundColor: colors.frenchVanilla100,
                      minWidth: 0,
                      maxWidth: '100%',
                    }}
                  >
                    <Table style={{ width: '100%', minWidth: 0, tableLayout: 'fixed' as const }}>
                      <Table.Head>
                        <Table.Row>
                          <Table.Header>Candidate</Table.Header>
                          <Table.Header>Stage</Table.Header>
                          <Table.Header>HiredScore</Table.Header>
                          <Table.Header>Actions</Table.Header>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ minWidth: 0, overflowWrap: 'break-word' as const }}>
                            <Flex alignItems="center" gap="s" style={{ minWidth: 0 }}>
                              <Avatar as="div" size="small" altText="Layla Osman" />
                              <Flex flexDirection="column" style={{ minWidth: 0 }}>
                                <BodyText size="small" style={{ fontWeight: 700 }}>
                                  Layla Osman
                                </BodyText>
                                <BodyText size="small" color={colors.blackPepper500}>
                                  Applied 28 March 2026 · Referral
                                </BodyText>
                              </Flex>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell>
                            <span style={{ display: 'inline-flex' }}>
                              <StatusIndicator
                                type={StatusIndicatorType.Blue}
                                emphasis={StatusIndicatorEmphasis.Low}
                                label="Interview"
                              />
                            </span>
                          </Table.Cell>
                          <Table.Cell style={{ minWidth: 0, verticalAlign: 'top' }}>
                            <Box style={{ minWidth: 0, maxWidth: '100%' }}>
                              <HiredScoreGrading fit={89} variant="full" />
                            </Box>
                          </Table.Cell>
                          <Table.Cell style={{ whiteSpace: 'nowrap' as const }}>
                            <PrimaryButton size="small" onClick={startScheduling}>
                              Schedule interview
                            </PrimaryButton>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ minWidth: 0, overflowWrap: 'break-word' as const }}>
                            <Flex alignItems="center" gap="s" style={{ minWidth: 0 }}>
                              <Avatar as="div" size="small" altText="Omar Khouri" />
                              <Flex flexDirection="column" style={{ minWidth: 0 }}>
                                <BodyText size="small" style={{ fontWeight: 700 }}>
                                  Omar Khouri
                                </BodyText>
                                <BodyText size="small" color={colors.blackPepper500}>
                                  Applied 22 March 2026 · Career site
                                </BodyText>
                              </Flex>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell>
                            <span style={{ display: 'inline-flex' }}>
                              <StatusIndicator
                                type={StatusIndicatorType.Blue}
                                emphasis={StatusIndicatorEmphasis.Low}
                                label="Interview"
                              />
                            </span>
                          </Table.Cell>
                          <Table.Cell style={{ minWidth: 0, verticalAlign: 'top' }}>
                            <Box style={{ minWidth: 0, maxWidth: '100%' }}>
                              <HiredScoreGrading fit={76} variant="full" />
                            </Box>
                          </Table.Cell>
                          <Table.Cell style={{ whiteSpace: 'nowrap' as const }}>
                            <SecondaryButton size="small" onClick={startScheduling}>
                              Schedule interview
                            </SecondaryButton>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Box>
                </Box>
              </Tabs.Panel>
              <Tabs.Panel data-id="details">
                <Box marginTop="m" padding="m">
                  <BodyText size="small" color={colors.blackPepper600}>
                    Requisition details, approvals, and organisation mapping (illustrative). Compliance rule pack KSA
                    template v2026.04 is active for this req via entity mapping.
                  </BodyText>
                </Box>
              </Tabs.Panel>
            </Tabs>
          </Box>
        )}

        {schedStep !== 'candidates' && (
          <Box padding="l" flex={1} minWidth={0}>
            {schedStep === 'time' && (
              <>
                <Heading size="large" marginBottom="m">
                  Schedule interview · Select time
                </Heading>
                {noticeViolation ? (
                  <Banner marginBottom="m">
                    <Banner.Icon />
                    <Banner.Label>
                      KSA minimum notice: this pack requires 48 business hours before start. Your selection is below
                      that threshold. Pick another slot or record an exception when you send.
                    </Banner.Label>
                  </Banner>
                ) : (
                  <Banner marginBottom="m">
                    <Banner.Icon />
                    <Banner.Label>
                      KSA minimum notice: this pack requires 48 business hours before start. Your selected time meets
                      this requirement.
                    </Banner.Label>
                  </Banner>
                )}
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  Recommended Interview Scheduling suggestions (mock). Entitlement and calendar prerequisites apply in
                  production.
                </BodyText>
                <Flex flexDirection="column" gap="s" marginBottom="l">
                  {SLOTS.map((s) => (
                    <Box
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedSlot(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedSlot(s.id);
                        }
                      }}
                    >
                      <Card
                        padding="m"
                        style={{
                          cursor: 'pointer',
                          borderRadius: SANA_CARD_RADIUS_LG,
                          border:
                            selectedSlot === s.id
                              ? `2px solid ${SANA_LINK_ACCENT}`
                              : `1px solid ${colors.soap300}`,
                          backgroundColor: colors.frenchVanilla100,
                        }}
                      >
                        <BodyText
                          size="small"
                          style={{
                            fontWeight: selectedSlot === s.id ? 700 : 400,
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                          }}
                        >
                          {s.label}
                        </BodyText>
                      </Card>
                    </Box>
                  ))}
                </Flex>
                <Flex gap="s">
                  <SecondaryButton onClick={resetToCandidates}>Back</SecondaryButton>
                  <PrimaryButton onClick={() => setSchedStep('panel')}>Continue</PrimaryButton>
                </Flex>
              </>
            )}

            {schedStep === 'panel' && (
              <>
                <Heading size="large" marginBottom="m">
                  Schedule interview · Panel
                </Heading>
                <Banner marginBottom="m">
                  <Banner.Icon />
                  <Banner.Label>
                    Panel composition does not meet your organisation&apos;s guideline: KSA national representation.
                    You can still proceed; this will be logged.{' '}
                    <a href="#policy" style={{ color: SANA_LINK_ACCENT }}>
                      View policy
                    </a>
                  </Banner.Label>
                </Banner>
                <Flex flexDirection="column" gap="m" marginBottom="l">
                  {PANEL.map((p) => (
                    <Flex key={p.name} alignItems="center" gap="m">
                      <Avatar as="div" size="small" altText={p.name} />
                      <Box flex={1}>
                        <BodyText size="small" style={{ fontWeight: 700 }}>
                          {p.name}
                        </BodyText>
                        <StatusIndicator
                          type={StatusIndicatorType.Gray}
                          emphasis={StatusIndicatorEmphasis.Low}
                          label={p.role}
                        />
                      </Box>
                    </Flex>
                  ))}
                </Flex>
                <Box marginBottom="l">
                  <Checkbox
                    checked={panelAck}
                    onChange={(e) => setPanelAck(e.target.checked)}
                    label="Acknowledge panel composition warning"
                  />
                </Box>
                <Flex gap="s">
                  <SecondaryButton onClick={() => setSchedStep('time')}>Back</SecondaryButton>
                  <PrimaryButton onClick={() => setSchedStep('review')} disabled={!panelAck}>
                    Continue
                  </PrimaryButton>
                </Flex>
              </>
            )}

            {schedStep === 'review' && (
              <>
                <Heading size="large" marginBottom="m">
                  Review and send interview invitation
                </Heading>
                <Card
                  padding="l"
                  marginBottom="m"
                  style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}
                >
                  <BodyText size="small" style={{ fontWeight: 700 }} marginBottom="s">
                    Layla Osman · Principal TA Partner · Riyadh HQ
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                    {SLOTS.find((x) => x.id === selectedSlot)?.label ?? ''} · Video (Teams)
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper600} marginBottom="xs">
                    Panel
                  </BodyText>
                  {PANEL.map((p) => (
                    <BodyText key={p.name} size="small">
                      {p.name} ({p.role})
                    </BodyText>
                  ))}
                </Card>
                {noticeViolation && (
                  <Banner marginBottom="m">
                    <Banner.Icon />
                    <Banner.Label>
                      This interview is scheduled with less than the minimum notice of 48 business hours. You can
                      choose a different time or record an exception.
                    </Banner.Label>
                  </Banner>
                )}
                <Banner marginBottom="m">
                  <Banner.Icon />
                  <Banner.Label>
                    Panel mix warning is open. Proceeding will log acknowledgement for audit.
                  </Banner.Label>
                </Banner>
                {consentRecorded && (
                  <Banner marginBottom="m">
                    <Banner.Icon />
                    <Banner.Label>Exception recorded.</Banner.Label>
                  </Banner>
                )}
                <Flex gap="s">
                  <SecondaryButton onClick={() => setSchedStep('panel')}>Back</SecondaryButton>
                  <PrimaryButton onClick={handleSendInvitation}>Send interview invitation</PrimaryButton>
                </Flex>
              </>
            )}
          </Box>
        )}

        <Box padding="l" paddingTop="none">
          <BodyText size="small" color={colors.blackPepper500}>
            Prototype data is illustrative for layout, compliance nudges, and consent flows (GCC-E2E-034).
          </BodyText>
        </Box>
      </Box>
    );
  };

  const adminBody = (
    <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
      <Heading size="large" marginBottom="m">
        GCC interview compliance
      </Heading>
      <BodyText size="small" color={colors.blackPepper600} marginBottom="l">
        Configure rule packs, scope mapping, policy text, and sensitive panel rules (default off; attestation required
        to enable).
      </BodyText>
      <Tabs initialTab="packs">
        <Tabs.List>
          <Tabs.Item data-id="packs">Rule packs</Tabs.Item>
          <Tabs.Item data-id="scope">Scope mapping</Tabs.Item>
          <Tabs.Item data-id="policy">Policy text</Tabs.Item>
          <Tabs.Item data-id="sensitive">Sensitive rules</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel data-id="packs">
          <Box marginTop="m">
            <Box
              style={{
                borderRadius: SANA_CARD_RADIUS_LG,
                border: `1px solid ${colors.soap300}`,
                overflow: 'auto',
                backgroundColor: colors.frenchVanilla100,
                minWidth: 0,
                maxWidth: '100%',
              }}
            >
              <Table style={{ width: '100%', minWidth: 0, tableLayout: 'fixed' as const }}>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Rule pack</Table.Header>
                    <Table.Header>Jurisdiction</Table.Header>
                    <Table.Header>Active</Table.Header>
                    <Table.Header>Actions</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        KSA enterprise template
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500}>
                        Effective 1 April 2026
                      </BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">KSA</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <span style={{ display: 'inline-flex' }}>
                        <StatusIndicator
                          type={StatusIndicatorType.Green}
                          emphasis={StatusIndicatorEmphasis.Low}
                          label="Active"
                        />
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <SecondaryButton size="small">Edit thresholds</SecondaryButton>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <BodyText size="small" style={{ fontWeight: 700 }}>
                        GCC baseline (future)
                      </BodyText>
                      <BodyText size="small" color={colors.blackPepper500}>
                        Draft
                      </BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <BodyText size="small">GCC</BodyText>
                    </Table.Cell>
                    <Table.Cell>
                      <span style={{ display: 'inline-flex' }}>
                        <StatusIndicator
                          type={StatusIndicatorType.Gray}
                          emphasis={StatusIndicatorEmphasis.Low}
                          label="Inactive"
                        />
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <SecondaryButton size="small">Edit thresholds</SecondaryButton>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Box>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel data-id="scope">
          <Box marginTop="m">
            <FormSelect
              id="v90-scope-entity"
              label="Organisation"
              value="ent1"
              onChange={() => {}}
              options={[
                { value: 'ent1', label: 'Riyadh HQ entity' },
                { value: 'ent2', label: 'Dubai branch' },
              ]}
            />
            <Box marginTop="m">
              <BodyText size="small" color={colors.blackPepper600}>
                Map legal entities and requisition types to jurisdiction packs. PS validates exact configuration
                surfaces in production tenants.
              </BodyText>
            </Box>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel data-id="policy">
          <Box marginTop="m">
            <FormField>
              <FormField.Label htmlFor="v90-policy">Policy summary (admin)</FormField.Label>
              <TextArea
                id="v90-policy"
                value="Customer-maintained summary: minimum notice, panel mix expectations, and how exceptions are recorded."
                onChange={() => {}}
                style={{ width: '100%', minHeight: 120 }}
              />
            </FormField>
            <Flex marginTop="m" gap="s">
              <PrimaryButton>Save</PrimaryButton>
              <SecondaryButton>Cancel</SecondaryButton>
            </Flex>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel data-id="sensitive">
          <Box marginTop="m">
            <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
              Nationality-driven (sensitive-attribute) panel warnings are off by default. Enabling requires customer
              Legal attestation.
            </BodyText>
            <Flex alignItems="center" gap="m" marginBottom="m" flexWrap="wrap">
              <SecondaryButton
                size="small"
                onClick={() => attestModal.events.show()}
                disabled={sensitiveToggle}
              >
                Enable sensitive panel rules
              </SecondaryButton>
              {sensitiveToggle && (
                <SecondaryButton size="small" onClick={() => setSensitiveToggle(false)}>
                  Turn off sensitive rules
                </SecondaryButton>
              )}
            </Flex>
            {sensitiveToggle && (
              <StatusIndicator
                type={StatusIndicatorType.Green}
                emphasis={StatusIndicatorEmphasis.Low}
                label="Sensitive rules enabled. Attestation recorded."
              />
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );

  const auditRows = [
    {
      when: '5 April 2026 · 09:12',
      actor: 'You · Recruiter',
      candidate: 'Layla Osman',
      interview: 'INT-GCC-90821',
      rule: 'KSA_MIN_NOTICE',
      action: 'Consent recorded',
    },
    {
      when: '4 April 2026 · 16:40',
      actor: 'You · Recruiter',
      candidate: 'Omar Khouri',
      interview: 'INT-GCC-90702',
      rule: 'PANEL_MIX_KSA',
      action: 'Warning acknowledged',
    },
  ];

  const auditFiltered = auditRows.filter((r) => {
    if (auditRule !== 'all' && r.rule !== auditRule) return false;
    if (auditQuery.trim() && !r.candidate.toLowerCase().includes(auditQuery.trim().toLowerCase())) return false;
    return true;
  });

  const auditBody = (
    <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
      <Heading size="large" marginBottom="m">
        Overrides and consents
      </Heading>
      <Flex gap="m" flexWrap="wrap" marginBottom="l">
        <Box style={{ minWidth: 180 }}>
          <FormSelect
            id="v90-audit-org"
            label="Organisation"
            value={auditOrg}
            onChange={setAuditOrg}
            options={[
              { value: 'all', label: 'All organisations' },
              { value: 'riyadh', label: 'Riyadh HQ' },
            ]}
          />
        </Box>
        <Box style={{ minWidth: 180 }}>
          <FormSelect
            id="v90-audit-rule"
            label="Rule"
            value={auditRule}
            onChange={setAuditRule}
            options={[
              { value: 'all', label: 'All rules' },
              { value: 'KSA_MIN_NOTICE', label: 'KSA_MIN_NOTICE' },
              { value: 'PANEL_MIX_KSA', label: 'PANEL_MIX_KSA' },
            ]}
          />
        </Box>
        <FormDateInput id="v90-audit-from" label="From" value={auditFrom} onChange={setAuditFrom} />
        <FormDateInput id="v90-audit-to" label="To" value={auditTo} onChange={setAuditTo} />
        <Box style={{ minWidth: 220, flex: '1 1 220px' }}>
          <FormTextInput
            id="v90-audit-q"
            label="Search candidate"
            value={auditQuery}
            onChange={setAuditQuery}
            placeholder="Name contains…"
          />
        </Box>
      </Flex>
      <Flex marginBottom="m" gap="s">
        <SecondaryButton size="small">Filter</SecondaryButton>
        <SecondaryButton size="small">Export (audit)</SecondaryButton>
      </Flex>
      {auditFiltered.length === 0 ? (
        <BodyText size="small" color={colors.blackPepper600}>
          No audit events match your filters. Adjust filters or try a different date range.
        </BodyText>
      ) : (
        <Box
          style={{
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${colors.soap300}`,
            overflow: 'auto',
            backgroundColor: colors.frenchVanilla100,
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          <Table style={{ width: '100%', minWidth: 0, tableLayout: 'fixed' as const }}>
            <Table.Head>
              <Table.Row>
                <Table.Header>When</Table.Header>
                <Table.Header>Actor</Table.Header>
                <Table.Header>Candidate</Table.Header>
                <Table.Header>Interview</Table.Header>
                <Table.Header>Rule</Table.Header>
                <Table.Header>Action</Table.Header>
                <Table.Header />
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {auditFiltered.map((r) => (
                <Table.Row key={r.interview + r.when}>
                  <Table.Cell>
                    <BodyText size="small">{r.when}</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">{r.actor}</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">{r.candidate}</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">{r.interview}</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <BodyText size="small">{r.rule}</BodyText>
                  </Table.Cell>
                  <Table.Cell>
                    <span style={{ display: 'inline-flex' }}>
                      <StatusIndicator
                        type={StatusIndicatorType.Green}
                        emphasis={StatusIndicatorEmphasis.Low}
                        label={r.action}
                      />
                    </span>
                  </Table.Cell>
                  <Table.Cell style={{ whiteSpace: 'nowrap' as const, verticalAlign: 'middle' }}>
                    <TertiaryButton size="small">View details</TertiaryButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Box>
      )}
    </Box>
  );

  const paradoxBody = (
    <Box padding="l" flex={1} minWidth={0} style={{ overflowY: 'auto' }}>
      <Heading size="large" marginBottom="m">
        Paradox touchpoint (conceptual)
      </Heading>
      <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
        Workday remains system of record for audit events. Paradox surfaces messaging; both consume a shared compliance
        summary object so warnings and consent flags stay aligned with recruiter scheduling (WF2–WF5).
      </BodyText>
      <Card
        padding="l"
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          borderRadius: SANA_CARD_RADIUS_LG,
          border: `1px solid ${colors.soap300}`,
          whiteSpace: 'pre-wrap',
        }}
      >
        {JSON.stringify(PARADOX_SUMMARY, null, 2)}
      </Card>
    </Box>
  );

  type CandidateStep = 'welcome' | 'slots' | 'confirm' | 'booked';
  type ApplyStep = 'intro' | 'resume' | 'screener' | 'success';
  const [candidateView, setCandidateView] = useState<'home' | 'chat' | 'career-site' | 'job-details' | 'apply-chat'>('home');
  const [candStep, setCandStep] = useState<CandidateStep>('welcome');
  const [applyStep, setApplyStep] = useState<ApplyStep>('intro');
  const [candSlot, setCandSlot] = useState<string | null>(null);
  const [candTyping, setCandTyping] = useState(false);
  const [applyTyping, setApplyTyping] = useState(false);
  const [candMsg, setCandMsg] = useState('');
  const [applyMsg, setApplyMsg] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const applyChatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    
    // Find all assistant messages and typing indicators
    const assistantMessages = container.querySelectorAll('.chat-msg.assistant-msg');
    const lastMessage = assistantMessages[assistantMessages.length - 1];
    
    if (lastMessage) {
      // Scroll to the top of the latest assistant message
      lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [candStep, candTyping]);

  useEffect(() => {
    if (!applyChatContainerRef.current) return;
    const container = applyChatContainerRef.current;
    
    const assistantMessages = container.querySelectorAll('.chat-msg.assistant-msg');
    const lastMessage = assistantMessages[assistantMessages.length - 1];
    
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, [applyStep, applyTyping]);

  const advanceCandChat = useCallback(
    (next: CandidateStep) => {
      setCandTyping(true);
      setTimeout(() => {
        setCandTyping(false);
        setCandStep(next);
      }, 1200);
    },
    [],
  );

  const advanceApplyChat = useCallback(
    (next: ApplyStep) => {
      setApplyTyping(true);
      setTimeout(() => {
        setApplyTyping(false);
        setApplyStep(next);
      }, 1200);
    },
    [],
  );

  const chatBubble = (
    from: 'assistant' | 'candidate',
    text: React.ReactNode,
    key?: string,
  ) => {
    if (from === 'assistant') {
      return (
        <Flex key={key} alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
          <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
          <Box style={{ flex: 1, minWidth: 0 }}>
            <SanaCommMessageBubble align="start">{text}</SanaCommMessageBubble>
          </Box>
        </Flex>
      );
    }
    return <SanaCommMessageBubble key={key} align="end">{text}</SanaCommMessageBubble>;
  };

  const typingIndicator = (
    <Flex alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
      <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
      <Box
        style={{
          padding: '12px 20px',
          borderRadius: SANA_COMM_MESSAGE_RADIUS_PX,
          backgroundColor: SANA_COMM_BUBBLE_BG,
          border: `1px solid ${colors.soap300}`,
          boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
        }}
      >
        <Flex gap="xxs" alignItems="center">
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: colors.soap500,
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  );

  const candidateBody = (
    <Box
      flex={1}
      style={{
        backgroundColor: SANA_PAGE_CANVAS,
        height: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-msg { animation: fadeSlideUp 0.35s ease-out; }
      `}</style>
      <Flex ref={chatContainerRef} justifyContent="center" flex={1} style={{ overflowY: 'auto', padding: '24px 16px' }}>
        <Box style={{ maxWidth: 960, width: '100%' }}>
          <Flex alignItems="center" gap="s" marginBottom="m">
            <Avatar as="div" size="medium" altText="Workday Scheduling Assistant" style={{ flexShrink: 0 }} />
            <Box>
              <BodyText size="small" style={{ fontWeight: 700 }}>
                Workday Scheduling Assistant
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                Principal TA Partner · Riyadh HQ
              </BodyText>
            </Box>
          </Flex>

          <Banner marginBottom="m">
            <Banner.Icon />
            <Banner.Label>
              [Legal TBD] You are chatting with an automated scheduling assistant. Interview decisions are made by
              your recruiter and hiring team, not this assistant.
            </Banner.Label>
          </Banner>

          <Flex flexDirection="column" style={{ width: '100%' }}>
            <div className="chat-msg assistant-msg">
              {chatBubble(
                'assistant',
                <>
                  Hi there! I'm the scheduling assistant for{' '}
                  <strong>Accenture Middle East</strong>. Congratulations on being
                  selected for an interview for the{' '}
                  <strong>Principal TA Partner</strong> role in Riyadh.
                  <br />
                  <br />
                  I have a few times available this week. Would you like to see them?
                </>,
                'welcome',
              )}
            </div>

            {candStep === 'welcome' && !candTyping && (
              <Flex justifyContent="flex-end" marginBottom="s" className="chat-msg">
                <Flex flexDirection="column" gap="xs" style={{ maxWidth: '78%' }}>
                  <PrimaryButton
                    size="small"
                    onClick={() => {
                      setCandStep('slots');
                    }}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Yes, show me available times
                  </PrimaryButton>
                  <SecondaryButton
                    size="small"
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    I need to reschedule later
                  </SecondaryButton>
                </Flex>
              </Flex>
            )}

            {(candStep === 'slots' || candStep === 'confirm' || candStep === 'booked') && (
              <div className="chat-msg">
                {chatBubble('candidate', 'Yes, show me available times', 'c-yes')}
              </div>
            )}

            {(candStep === 'slots' || candStep === 'confirm' || candStep === 'booked') && (
              <div className="chat-msg assistant-msg">
                {chatBubble(
                  'assistant',
                  <>
                    Great! Here are the available interview slots. Each session is 60 minutes with the hiring panel.
                    <br />
                    <br />
                    Pick the one that works best for you:
                  </>,
                  'slots-intro',
                )}
              </div>
            )}

            {candStep === 'slots' && !candTyping && (
              <Flex justifyContent="flex-end" marginBottom="s" className="chat-msg">
                <Flex flexDirection="column" gap="xs" style={{ maxWidth: '85%' }}>
                  {SLOTS.map((s) => (
                    <SecondaryButton
                      key={s.id}
                      size="small"
                      onClick={() => {
                        setCandSlot(s.id);
                        advanceCandChat('confirm');
                      }}
                      style={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        height: 'auto',
                        minHeight: 36,
                        minWidth: 0,
                        maxWidth: '100%',
                      }}
                    >
                      {s.label}
                    </SecondaryButton>
                  ))}
                </Flex>
              </Flex>
            )}

            {(candStep === 'confirm' || candStep === 'booked') && candSlot && (
              <div className="chat-msg">
                {chatBubble(
                  'candidate',
                  SLOTS.find((s) => s.id === candSlot)?.label ?? '',
                  'c-slot',
                )}
              </div>
            )}

            {(candStep === 'confirm' || candStep === 'booked') && (
              <div className="chat-msg assistant-msg">
                {chatBubble(
                  'assistant',
                  <>
                    Excellent choice! Let me confirm the details:
                    <br />
                    <br />
                    <strong>Role:</strong> Principal TA Partner
                    <br />
                    <strong>Time:</strong>{' '}
                    {SLOTS.find((s) => s.id === candSlot)?.label ?? ''}
                    <br />
                    <strong>Panel:</strong> Nora Al-Farsi (Hiring manager), Samir
                    Haddad (Technical), Priya Menon (HR)
                    <br />
                    <strong>Duration:</strong> 60 minutes
                    <br />
                    <br />
                    Shall I book this for you?
                  </>,
                  'confirm-msg',
                )}
              </div>
            )}

            {candStep === 'confirm' && !candTyping && (
              <Flex justifyContent="flex-end" marginBottom="s" className="chat-msg">
                <Flex flexDirection="column" gap="xs" style={{ maxWidth: '78%' }}>
                  <PrimaryButton
                    size="small"
                    onClick={() => advanceCandChat('booked')}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Yes, confirm this booking
                  </PrimaryButton>
                  <SecondaryButton
                    size="small"
                    onClick={() => {
                      setCandSlot(null);
                      setCandStep('slots');
                    }}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Choose a different time
                  </SecondaryButton>
                </Flex>
              </Flex>
            )}

            {candStep === 'booked' && (
              <>
                <div className="chat-msg">
                  {chatBubble('candidate', 'Yes, confirm this booking', 'c-confirm')}
                </div>
                <div className="chat-msg assistant-msg">
                  {chatBubble(
                    'assistant',
                    <>
                      Done! Your interview is booked. Here's a summary:
                      <br />
                      <br />
                      <strong>
                        {SLOTS.find((s) => s.id === candSlot)?.label ?? ''}
                      </strong>
                      <br />
                      <br />A calendar invitation has been sent to your email.
                      You'll also receive a reminder 24 hours before.
                      <br />
                      <br />
                      Need to change anything? Just reply here or contact the
                      recruiting team directly.
                    </>,
                    'booked-msg',
                  )}
                </div>
                <div className="chat-msg">
                  <Card
                    padding="m"
                    marginBottom="s"
                    style={{
                      borderRadius: SANA_CARD_RADIUS_LG,
                      border: `1px solid ${colors.greenApple300}`,
                      backgroundColor: colors.greenApple100,
                    }}
                  >
                    <Flex alignItems="center" gap="s">
                      <StatusIndicator
                        type={StatusIndicatorType.Green}
                        emphasis={StatusIndicatorEmphasis.Low}
                        label="Confirmed"
                      />
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        Interview booked
                      </BodyText>
                    </Flex>
                    <BodyText size="small" color={colors.blackPepper600} marginTop="xs">
                      {SLOTS.find((s) => s.id === candSlot)?.label ?? ''} · 60 min · Video or
                      in-person
                    </BodyText>
                  </Card>
                </div>
              </>
            )}

            {candTyping && <div className="chat-msg assistant-msg">{typingIndicator}</div>}
          </Flex>
        </Box>
      </Flex>

      <Box
        style={{
          borderTop: `1px solid ${colors.soap300}`,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
          padding: '12px 16px',
        }}
      >
        <Flex justifyContent="center">
          <Box style={{ maxWidth: 960, width: '100%' }}>
            <SanaCommComposer
              value={candMsg}
              onChange={setCandMsg}
              placeholder="Type a message..."
              onSend={() => {}}
              sendDisabled={!candMsg.trim()}
            />
            <Flex justifyContent="center" marginTop="xs">
              <BodyText size="small" color={colors.blackPepper400} style={{ fontSize: 11 }}>
                [Legal TBD] Privacy notice · Powered by Workday
              </BodyText>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );

  const candidateNav = (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      paddingX="l"
      style={{
        height: WORKDAY_TOP_NAV_HEIGHT_PX,
        backgroundColor: '#fff',
        borderBottom: `1px solid ${colors.soap300}`,
      }}
    >
      <Heading size="small" marginY="zero" style={{ color: colors.blueberry500 }}>
        Accenture Careers
      </Heading>
      <Flex gap="s">
        <SecondaryButton onClick={() => setCandidateView('career-site')}>
          Find Jobs
        </SecondaryButton>
        <SecondaryButton icon={homeIcon} onClick={() => setCandidateView('home')}>
          Candidate Home
        </SecondaryButton>
      </Flex>
    </Flex>
  );

  const candidateHomeBody = (
    <Box
      flex={1}
      style={{
        backgroundColor: SANA_PAGE_CANVAS,
        height: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Flex justifyContent="center" padding="xl">
        <Box style={{ maxWidth: 800, width: '100%' }}>
          <Heading size="medium" marginBottom="l">
            Welcome back, Layla
          </Heading>

          <Heading size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
            To-Do
          </Heading>
          <Card
            padding="m"
            marginBottom="xl"
            style={{
              borderRadius: SANA_CARD_RADIUS_LG,
              border: `1px solid ${colors.blueberry400}`,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onClick={() => setCandidateView('chat')}
          >
            <Flex gap="m" alignItems="flex-start">
              <Avatar
                as="div"
                size="medium"
                altText="Assistant"
                style={{
                  background: `linear-gradient(135deg, ${colors.blueberry400}, ${colors.blueberry600})`,
                  color: '#fff',
                }}
              />
              <Box flex={1}>
                <BodyText size="medium" style={{ fontWeight: 700 }} marginBottom="xxs">
                  Schedule your interview
                </BodyText>
                <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                  Congratulations! You've been selected for an interview for the{' '}
                  <strong>Principal TA Partner</strong> role. I'm here to help you find a time that
                  works.
                </BodyText>
                <PrimaryButton onClick={() => setCandidateView('chat')}>
                  Chat to schedule
                </PrimaryButton>
              </Box>
            </Flex>
          </Card>

          <Heading size="small" marginBottom="s" style={{ color: colors.blackPepper500 }}>
            Your Applications
          </Heading>
          <Flex flexDirection="column" gap="s">
            <Card
              padding="m"
              style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}
            >
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <BodyText size="medium" style={{ fontWeight: 700 }}>
                    Principal TA Partner
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper500}>
                    Riyadh, KSA · Applied 28 March 2026
                  </BodyText>
                </Box>
                <StatusIndicator
                  type={StatusIndicatorType.Blue}
                  emphasis={StatusIndicatorEmphasis.Low}
                  label="Interview"
                />
              </Flex>
            </Card>
            <Card
              padding="m"
              style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW }}
            >
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <BodyText size="medium" style={{ fontWeight: 700 }}>
                    Senior Recruiter
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper500}>
                    Dubai, UAE · Applied 15 Feb 2026
                  </BodyText>
                </Box>
                <StatusIndicator
                  type={StatusIndicatorType.Gray}
                  emphasis={StatusIndicatorEmphasis.Low}
                  label="Not selected"
                />
              </Flex>
            </Card>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );

  const careerSiteBody = (
    <Box
      flex={1}
      style={{
        backgroundColor: SANA_PAGE_CANVAS,
        height: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <CareerSiteHero greeting="Hi Layla, what kind of role are you looking for today?" />

      <Flex justifyContent="center" padding="xl">
        <Box style={{ maxWidth: 960, width: '100%' }}>
          <Heading size="small" marginBottom="m" style={{ color: colors.blackPepper500 }}>
            Recommended for you
          </Heading>
          <Flex flexDirection="column" gap="s">
            <JobCard
              title="Senior Recruiter"
              metadata="Dubai, UAE · Full-time · Hybrid"
              onViewJob={() => setCandidateView('job-details')}
            />
            <JobCard
              title="TA Operations Manager"
              metadata="Riyadh, KSA · Full-time · On-site"
              onViewJob={() => {}}
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );

  const jobDetailsBody = (
    <Box
      flex={1}
      style={{
        backgroundColor: SANA_PAGE_CANVAS,
        height: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Flex justifyContent="center" padding="xl">
        <Box style={{ maxWidth: 960, width: '100%' }}>
          <SecondaryButton
            size="small"
            marginBottom="l"
            onClick={() => setCandidateView('career-site')}
          >
            ← Back to jobs
          </SecondaryButton>
          
          <Card
            padding="l"
            style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, position: 'relative' }}
          >
            <Heading size="medium" marginBottom="xs">
              Senior Recruiter
            </Heading>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
              Dubai, UAE · Full-time · Hybrid
            </BodyText>

            <Box style={{ borderTop: `1px solid ${colors.soap300}`, paddingTop: '24px', marginBottom: '24px' }}>
              <Heading size="small" marginBottom="s">About the Role</Heading>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                We are looking for a Senior Recruiter to join our growing team in Dubai. You will be responsible for end-to-end recruitment across multiple business units, partnering with hiring managers to attract top talent.
              </BodyText>
              <Heading size="small" marginBottom="s">Requirements</Heading>
              <BodyText size="small" color={colors.blackPepper600}>
                • 5+ years of full-cycle recruiting experience<br />
                • Experience in the technology or consulting sector<br />
                • Strong stakeholder management skills<br />
                • Fluency in English and Arabic is preferred
              </BodyText>
            </Box>

            <JobDetailsStickyFooter onApply={() => setCandidateView('apply-chat')} />
          </Card>
        </Box>
      </Flex>
    </Box>
  );

  const applyChatBody = (
    <Box
      flex={1}
      style={{
        backgroundColor: SANA_PAGE_CANVAS,
        height: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Flex ref={applyChatContainerRef} justifyContent="center" flex={1} style={{ overflowY: 'auto', padding: '24px 16px' }}>
        <Box style={{ maxWidth: 960, width: '100%' }}>
          <Flex alignItems="center" gap="s" marginBottom="m">
            <Avatar as="div" size="medium" altText="Workday Recruiting Assistant" style={{ flexShrink: 0 }} />
            <Box>
              <BodyText size="small" style={{ fontWeight: 700 }}>
                Workday Recruiting Assistant
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                Senior Recruiter · Dubai, UAE
              </BodyText>
            </Box>
          </Flex>

          <Banner marginBottom="m">
            <Banner.Icon />
            <Banner.Label>
              [Legal TBD] You are chatting with an automated recruiting assistant. Hiring decisions are made by
              our recruiting team, not this assistant.
            </Banner.Label>
          </Banner>

          <Flex flexDirection="column" style={{ width: '100%' }}>
            <div className="chat-msg assistant-msg">
              {chatBubble(
                'assistant',
                <>
                  Hi Layla! I see you're interested in the <strong>Senior Recruiter</strong> role in Dubai.
                  <br />
                  <br />
                  Great! Let's get started. Could you please upload your resume?
                </>,
                'apply-intro',
              )}
            </div>

            {applyStep === 'intro' && !applyTyping && (
              <Flex justifyContent="flex-end" marginBottom="s" className="chat-msg">
                <Flex flexDirection="column" gap="xs" style={{ maxWidth: '78%' }}>
                  <PrimaryButton
                    size="small"
                    onClick={() => advanceApplyChat('resume')}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Upload Resume (PDF)
                  </PrimaryButton>
                  <SecondaryButton
                    size="small"
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Use my LinkedIn profile
                  </SecondaryButton>
                </Flex>
              </Flex>
            )}

            {(applyStep === 'resume' || applyStep === 'screener' || applyStep === 'success') && (
              <div className="chat-msg">
                {chatBubble('candidate', '📄 Layla_Resume_2026.pdf', 'c-resume')}
              </div>
            )}

            {(applyStep === 'resume' || applyStep === 'screener' || applyStep === 'success') && (
              <div className="chat-msg assistant-msg">
                {chatBubble(
                  'assistant',
                  <>
                    Thanks! Based on your resume, I see you have 5 years of experience in talent acquisition. Is that correct?
                  </>,
                  'apply-resume',
                )}
              </div>
            )}

            {applyStep === 'resume' && !applyTyping && (
              <Flex justifyContent="flex-end" marginBottom="s" className="chat-msg">
                <Flex flexDirection="column" gap="xs" style={{ maxWidth: '78%' }}>
                  <PrimaryButton
                    size="small"
                    onClick={() => advanceApplyChat('screener')}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Yes, that's correct
                  </PrimaryButton>
                  <SecondaryButton
                    size="small"
                    onClick={() => advanceApplyChat('screener')}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    No, I have more experience
                  </SecondaryButton>
                </Flex>
              </Flex>
            )}

            {(applyStep === 'screener' || applyStep === 'success') && (
              <div className="chat-msg">
                {chatBubble('candidate', "Yes, that's correct", 'c-screener')}
              </div>
            )}

            {(applyStep === 'screener' || applyStep === 'success') && (
              <div className="chat-msg assistant-msg">
                {chatBubble(
                  'assistant',
                  <>
                    Perfect. One last question: are you fluent in both English and Arabic?
                  </>,
                  'apply-screener',
                )}
              </div>
            )}

            {applyStep === 'screener' && !applyTyping && (
              <Flex justifyContent="flex-end" marginBottom="s" className="chat-msg">
                <Flex flexDirection="column" gap="xs" style={{ maxWidth: '78%' }}>
                  <PrimaryButton
                    size="small"
                    onClick={() => advanceApplyChat('success')}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    Yes, I am fluent in both
                  </PrimaryButton>
                  <SecondaryButton
                    size="small"
                    onClick={() => advanceApplyChat('success')}
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: 36 }}
                  >
                    English only
                  </SecondaryButton>
                </Flex>
              </Flex>
            )}

            {applyStep === 'success' && (
              <>
                <div className="chat-msg">
                  {chatBubble('candidate', 'Yes, I am fluent in both', 'c-success')}
                </div>
                <div className="chat-msg assistant-msg">
                  {chatBubble(
                    'assistant',
                    <>
                      Excellent. Your application for <strong>Senior Recruiter - Dubai</strong> has been submitted.
                      <br />
                      <br />
                      Our team will review your profile and get back to you shortly. You can track your application status on your Candidate Home.
                    </>,
                    'apply-success',
                  )}
                </div>
                <div className="chat-msg">
                  <Card
                    padding="m"
                    marginBottom="s"
                    style={{
                      borderRadius: SANA_CARD_RADIUS_LG,
                      border: `1px solid ${colors.greenApple300}`,
                      backgroundColor: colors.greenApple100,
                    }}
                  >
                    <Flex alignItems="center" gap="s">
                      <StatusIndicator
                        type={StatusIndicatorType.Green}
                        emphasis={StatusIndicatorEmphasis.Low}
                        label="Submitted"
                      />
                      <BodyText size="small" style={{ fontWeight: 600 }}>
                        Application Complete
                      </BodyText>
                    </Flex>
                    <BodyText size="small" color={colors.blackPepper600} marginTop="xs">
                      Senior Recruiter · Dubai, UAE
                    </BodyText>
                    <PrimaryButton size="small" marginTop="m" onClick={() => setCandidateView('home')}>
                      Go to Candidate Home
                    </PrimaryButton>
                  </Card>
                </div>
              </>
            )}

            {applyTyping && <div className="chat-msg assistant-msg">{typingIndicator}</div>}
          </Flex>
        </Box>
      </Flex>

      <Box
        style={{
          borderTop: `1px solid ${colors.soap300}`,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
          padding: '12px 16px',
        }}
      >
        <Flex justifyContent="center">
          <Box style={{ maxWidth: 960, width: '100%' }}>
            <SanaCommComposer
              value={applyMsg}
              onChange={setApplyMsg}
              placeholder="Type a message..."
              onSend={() => {}}
              sendDisabled={!applyMsg.trim()}
            />
            <Flex justifyContent="center" marginTop="xs">
              <BodyText size="small" color={colors.blackPepper400} style={{ fontSize: 11 }}>
                [Legal TBD] Privacy notice · Powered by Workday
              </BodyText>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );

  if (areaTab === 'candidate') {
    let currentBody;
    switch (candidateView) {
      case 'home':
        currentBody = candidateHomeBody;
        break;
      case 'chat':
        currentBody = candidateBody;
        break;
      case 'career-site':
        currentBody = careerSiteBody;
        break;
      case 'job-details':
        currentBody = jobDetailsBody;
        break;
      case 'apply-chat':
        currentBody = applyChatBody;
        break;
      default:
        currentBody = candidateHomeBody;
    }

    return (
      <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
        {candidateNav}
        {currentBody}
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayTopNav
        searchPlaceholder="Search candidates, jobs, people…"
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        notificationBadge={2}
        inboxBadge={5}
      />
      <Flex
        alignItems="stretch"
        style={{
          minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
          minWidth: 0,
          width: '100%',
        }}
      >
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL}
          secondaryTitle={
            areaTab === 'scheduling' ? 'Principal TA Partner · Riyadh HQ' : 'Recruiting configuration'
          }
          secondarySubtitle={
            areaTab === 'scheduling' ? 'REQ-GCC-2026-0142 · Interview' : 'GCC interview compliance'
          }
          tabs={[...HUB_TABS]}
          activeTabId={hubTab}
          onTabChange={setHubTab}
          fillHeight
        />
        <Box flex={1} minWidth={0} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AreaSwitcher area={areaTab} onChange={setAreaTab} />
          {areaTab === 'scheduling' && hubSchedulingMain()}
          {areaTab === 'admin' && adminBody}
          {areaTab === 'audit' && auditBody}
          {areaTab === 'paradox' && paradoxBody}
        </Box>
      </Flex>

      <Modal model={exceptionModal}>
        <Modal.Overlay style={{ zIndex: 1000 }}>
          <Modal.Card style={{ maxWidth: 520, width: 'min(100%, calc(100vw - 32px))', borderRadius: SANA_CARD_RADIUS_LG }}>
            <Modal.CloseIcon aria-label="Close" />
            <Modal.Heading>Record exception to minimum notice</Modal.Heading>
            <Modal.Body>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                This interview is below the configured minimum notice. Provide a reason and confirm to continue. [Legal
                TBD - final wording]
              </BodyText>
              <FormField marginBottom="m">
                <FormField.Label htmlFor="v90-exc-reason">Reason for exception</FormField.Label>
                <TextArea
                  id="v90-exc-reason"
                  value={exceptionReason}
                  onChange={(e) => setExceptionReason(e.target.value)}
                  style={{ width: '100%', minHeight: 88 }}
                />
                <FormField.Hint>Explain why minimum notice cannot be met (example placeholder).</FormField.Hint>
              </FormField>
              <Checkbox
                checked={exceptionAttest}
                onChange={(e) => setExceptionAttest(e.target.checked)}
                label="[Legal TBD] I confirm this exception is authorised under my organisation’s policy."
              />
              <Flex gap="s" marginTop="l" justifyContent="flex-end">
                <SecondaryButton
                  onClick={() => {
                    exceptionModal.events.hide();
                    setSchedStep('time');
                  }}
                >
                  Choose a different time
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    setConsentRecorded(true);
                    exceptionModal.events.hide();
                    resetToCandidates();
                  }}
                  disabled={!exceptionReason.trim() || !exceptionAttest}
                >
                  Record consent and continue
                </PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={attestModal}>
        <Modal.Overlay style={{ zIndex: 1000 }}>
          <Modal.Card style={{ maxWidth: 480, width: 'min(100%, calc(100vw - 32px))', borderRadius: SANA_CARD_RADIUS_LG }}>
            <Modal.CloseIcon
              aria-label="Close"
              onClick={() => {
                attestModal.events.hide();
              }}
            />
            <Modal.Heading>Enable sensitive panel rules</Modal.Heading>
            <Modal.Body>
              <BodyText size="small" color={colors.blackPepper600} marginBottom="m">
                [Legal TBD] Confirm customer Legal has approved the policy, data categories, and disclosures for this
                jurisdiction before enabling sensitive-attribute evaluation.
              </BodyText>
              <Checkbox
                checked={legalAttest}
                onChange={(e) => setLegalAttest(e.target.checked)}
                label="I confirm that my organisation’s Legal team has approved the policy, data categories, and disclosures for this jurisdiction."
              />
              <Flex gap="s" marginTop="l" justifyContent="flex-end">
                <SecondaryButton
                  onClick={() => {
                    attestModal.events.hide();
                    setLegalAttest(false);
                  }}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    if (!legalAttest) return;
                    setSensitiveToggle(true);
                    attestModal.events.hide();
                    setLegalAttest(false);
                  }}
                  disabled={!legalAttest}
                >
                  Confirm and enable
                </PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </Box>
  );
};
