/**
 * GCC nationalisation and local compliance reporting — prototype v62
 * Design brief: design/gcc-nationalisation-local-compliance-reporting-v62-design-brief.md
 * PRD: docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md
 * Pipeline: GCC E2E · 320
 *
 * Banner severity mapping (318 PASS 4): inform → Banner hasError={false}; warn → neutral Banner + caution border (tokens);
 * block → Banner hasError={true}. No fictional variant prop.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Banner } from '@workday/canvas-kit-react/banner';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs, useTabsModel } from '@workday/canvas-kit-react/tabs';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { exclamationTriangleIcon, homeIcon, userIcon, homeBuildingIcon, linkIcon, dotIcon } from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_SHELL_RADIUS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_CARD_SHADOW_LIFTED,
  FormSelect,
  FormDateInput,
  FormTextInput,
} from './components';
import type { WorkdayLeftTabBarPrimaryItem } from './components/WorkdayLeftTabBar';

const HUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requisitions', label: 'Job requisitions' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'nationalisation', label: 'Nationalisation & compliance' },
] as const;

type HubId = (typeof HUB_TABS)[number]['id'];

const PRIMARY_RAIL: WorkdayLeftTabBarPrimaryItem[] = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'Home' },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'Recruit' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const MOCK_REQS = [
  {
    id: 'REQ-2026-0201',
    title: 'Finance analyst — UAE national programme',
    loc: 'Dubai, UAE',
    status: 'Interview',
    cand: 14,
    programme: 'On track',
    programmeKey: 'ok',
  },
  {
    id: 'REQ-2026-0194',
    title: 'Engineering graduate — Saudization',
    loc: 'Riyadh, KSA',
    status: 'Offer',
    cand: 38,
    programme: 'Below target',
    programmeKey: 'warn',
  },
  {
    id: 'REQ-2026-0188',
    title: 'HR coordinator — Emiratisation',
    loc: 'Abu Dhabi, UAE',
    status: 'Screen',
    cand: 6,
    programme: 'Data gap',
    programmeKey: 'gap',
  },
];

const MOCK_CANDIDATES = [
  { name: 'Aisha Al-Mazrouei', stage: 'Interview', req: 'REQ-2026-0201', classification: 'UAE national', risk: false },
  { name: 'Khalid Al-Otaibi', stage: 'Offer', req: 'REQ-2026-0194', classification: 'GCC', risk: true },
  { name: 'James Porter', stage: 'Screen', req: 'REQ-2026-0188', classification: '—', risk: true },
  { name: 'Fatima Al-Nuaimi', stage: 'Screen', req: 'REQ-2026-0188', classification: 'Pending review', risk: false },
];

const EXPORT_HISTORY = [
  { who: 'You', when: '27 March 2026, 14:02', template: 'MOHRE-style composition (CSV)' },
  { who: 'M. Al-Rashid', when: '25 March 2026, 09:18', template: 'Nitaqat hiring cohort (XLSX)' },
];

function tableShell(children: React.ReactNode) {
  return (
    <Box style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'auto', boxSizing: 'border-box' }}>
      <Box
        style={{
          borderRadius: 12,
          border: `1px solid ${colors.soap300}`,
          overflow: 'hidden',
          backgroundColor: colors.soap100,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function KpiTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Box
      padding="l"
      style={{
        flex: '1 1 160px',
        minWidth: 0,
        maxWidth: '100%',
        borderRadius: SANA_CARD_RADIUS_LG,
        boxShadow: SANA_CARD_SHADOW,
        backgroundColor: 'var(--cnvs-sys-color-bg-default)',
        border: '1px solid var(--cnvs-sys-color-border-container)',
      }}
    >
      <BodyText size="small" style={{ color: 'var(--cnvs-sys-color-fg-muted)' }} marginBottom="xs">
        {label}
      </BodyText>
      <Heading size="large" style={{ marginBottom: space.xs, fontWeight: 700 }}>
        {value}
      </Heading>
      <BodyText size="small" style={{ color: 'var(--cnvs-sys-color-fg-muted)' }}>
        {hint}
      </BodyText>
    </Box>
  );
}

/** Stacked bar: track soap200, fills blueberry400 / greenApple400 per brief */
function CompositionBar({
  nationalPct,
  gccPct,
  otherPct,
}: {
  nationalPct: number;
  gccPct: number;
  otherPct: number;
}) {
  return (
    <Box marginBottom="m">
      <Flex height={10} style={{ borderRadius: 6, overflow: 'hidden', backgroundColor: colors.soap200 }} title="Composition vs target (illustrative)">
        <Box style={{ flex: `${nationalPct} 1 0`, minWidth: 4, backgroundColor: colors.blueberry400 }} />
        <Box style={{ flex: `${gccPct} 1 0`, minWidth: 4, backgroundColor: colors.greenApple400 }} />
        <Box style={{ flex: `${otherPct} 1 0`, minWidth: 4, backgroundColor: colors.soap300 }} />
      </Flex>
      <Flex gap="m" marginTop="xs" flexWrap="wrap">
        <BodyText size="small">National {nationalPct}%</BodyText>
        <BodyText size="small">GCC {gccPct}%</BodyText>
        <BodyText size="small">Other {otherPct}%</BodyText>
      </Flex>
    </Box>
  );
}

const textWrapInColumn = {
  maxWidth: '100%',
  overflowWrap: 'break-word' as const,
  wordBreak: 'break-word' as const,
};

function FooterDisclaimer() {
  return (
    <BodyText
      size="small"
      color={colors.blackPepper400}
      marginTop="xl"
      style={{ ...textWrapInColumn, maxWidth: 'min(960px, 100%)' }}
    >
      Figures reflect Recruiting data in Workday for the selected scope. They do not replace legal advice or government systems.
      Automated portal submission is not in scope for version 1.
    </BodyText>
  );
}

type OfferSeverity = 'inform' | 'warn' | 'block';

export default function GccNationalisationLocalComplianceReportingV62() {
  const [topSearch, setTopSearch] = useState('');
  const [hubTab, setHubTab] = useState<HubId>('nationalisation');

  const [reqDetail, setReqDetail] = useState<(typeof MOCK_REQS)[0] | null>(null);
  const reqInnerTabs = useTabsModel({ initialTab: 'compliance' });
  const natTabs = useTabsModel({ initialTab: 'recruiter-dashboard' });

  const offerModal = useModalModel();
  const exportModal = useModalModel();
  const discardModal = useModalModel();

  const [offerSeverity, setOfferSeverity] = useState<OfferSeverity>('warn');
  const [overrideReason, setOverrideReason] = useState('');

  const [natEntity, setNatEntity] = useState('entity-1');
  const [natLocation, setNatLocation] = useState('all');
  const [natPack, setNatPack] = useState('ksa');

  const [packKsa, setPackKsa] = useState(true);
  const [packUae, setPackUae] = useState(true);
  const [targetPct, setTargetPct] = useState('42');
  const [effectiveDate, setEffectiveDate] = useState('2026-04-01');
  const [orgMapping, setOrgMapping] = useState('supervisory-org-01');
  const [exportFormat, setExportFormat] = useState('csv');
  const [adminBaseline, setAdminBaseline] = useState({
    ksa: true,
    uae: true,
    target: '42',
    date: '2026-04-01',
    org: 'supervisory-org-01',
  });
  const adminDirty = useMemo(() => {
    return (
      packKsa !== adminBaseline.ksa ||
      packUae !== adminBaseline.uae ||
      targetPct !== adminBaseline.target ||
      effectiveDate !== adminBaseline.date ||
      orgMapping !== adminBaseline.org
    );
  }, [packKsa, packUae, targetPct, effectiveDate, orgMapping, adminBaseline]);

  const [reqSearch, setReqSearch] = useState('');
  const [reqProgramme, setReqProgramme] = useState('all');
  const [candSearch, setCandSearch] = useState('');

  const filteredReqs = useMemo(() => {
    return MOCK_REQS.filter((r) => {
      const q = reqSearch.trim().toLowerCase();
      const matchQ = !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchP = reqProgramme === 'all' || r.programmeKey === reqProgramme;
      return matchQ && matchP;
    });
  }, [reqSearch, reqProgramme]);

  const filteredCands = useMemo(() => {
    const q = candSearch.trim().toLowerCase();
    return MOCK_CANDIDATES.filter((c) => !q || c.name.toLowerCase().includes(q) || c.req.toLowerCase().includes(q));
  }, [candSearch]);

  const openOffer = useCallback(() => {
    setOverrideReason('');
    offerModal.events.show();
  }, [offerModal.events]);

  const shellCard = (
    <Box
      style={{
        borderRadius: SANA_SHELL_RADIUS,
        backgroundColor: colors.frenchVanilla100,
        boxShadow: SANA_CARD_SHADOW_LIFTED,
        minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px - 48px)`,
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {hubTab === 'overview' && (
        <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
          <Heading size="large" marginBottom="xs">
            Recruiting overview
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={textWrapInColumn}>
            Action-oriented snapshot: tasks, open reqs, and compliance signals.
          </BodyText>
          <Flex gap="m" marginBottom="l" flexWrap="wrap">
            <KpiTile label="My tasks" value="7" hint="Approvals, messages, follow-ups" />
            <KpiTile label="Open requisitions" value="47" hint="Assigned to you or your team" />
            <KpiTile label="Nationalisation alerts" value="3" hint="Programmes below warn threshold" />
          </Flex>
          <SecondaryButton onClick={() => setHubTab('nationalisation')}>View nationalisation & compliance</SecondaryButton>
          <FooterDisclaimer />
        </Box>
      )}

      {hubTab === 'requisitions' && !reqDetail && (
        <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
          <Heading size="large" marginBottom="xs">
            Job requisitions
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={textWrapInColumn}>
            Filter by programme status; open a requisition for pipeline and compliance context.
          </BodyText>
          <Flex gap="m" marginBottom="m" flexWrap="wrap" alignItems="flex-end">
            <Box style={{ flex: '1 1 200px', minWidth: 0 }}>
              <FormTextInput id="req-q" label="Search" placeholder="Title or req ID" value={reqSearch} onChange={setReqSearch} />
            </Box>
            <Box style={{ flex: '1 1 200px', minWidth: 0 }}>
              <FormSelect
                id="req-prog"
                label="Programme status"
                value={reqProgramme}
                onChange={setReqProgramme}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'ok', label: 'On track' },
                  { value: 'warn', label: 'Below target' },
                  { value: 'gap', label: 'Data gap' },
                ]}
              />
            </Box>
          </Flex>
          {tableShell(
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Req ID</Table.Header>
                  <Table.Header>Title</Table.Header>
                  <Table.Header>Location</Table.Header>
                  <Table.Header>Programme status</Table.Header>
                  <Table.Header>Actions</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredReqs.map((r) => (
                  <Table.Row key={r.id}>
                    <Table.Cell>{r.id}</Table.Cell>
                    <Table.Cell>{r.title}</Table.Cell>
                    <Table.Cell>{r.loc}</Table.Cell>
                    <Table.Cell>{r.programme}</Table.Cell>
                    <Table.Cell>
                      <SecondaryButton size="small" onClick={() => setReqDetail(r)}>
                        View requisition
                      </SecondaryButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <FooterDisclaimer />
        </Box>
      )}

      {hubTab === 'requisitions' && reqDetail && (
        <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
          <TertiaryButton onClick={() => setReqDetail(null)} marginBottom="m">
            Back to requisitions
          </TertiaryButton>
          <Heading size="large" marginBottom="xxs">
            Requisition compliance
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={textWrapInColumn}>
            {reqDetail.id} · {reqDetail.loc} · {reqDetail.title}
          </BodyText>
          <Box style={{ minWidth: 0, maxWidth: '100%' }}>
            <Tabs model={reqInnerTabs}>
            <Tabs.List
              marginBottom="l"
              gap="xxs"
              style={{ flexWrap: 'wrap', minWidth: 0, maxWidth: '100%', rowGap: space.xs }}
            >
              <Tabs.Item data-id="candidates">Candidates</Tabs.Item>
              <Tabs.Item data-id="compliance">Compliance</Tabs.Item>
              <Tabs.Item data-id="details">Details</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel data-id="candidates">
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Candidate</Table.Header>
                      <Table.Header>Stage</Table.Header>
                      <Table.Header>Classification</Table.Header>
                      <Table.Header>Risk</Table.Header>
                      <Table.Header>Actions</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {MOCK_CANDIDATES.filter((c) => c.req === reqDetail.id).map((c) => (
                      <Table.Row key={c.name}>
                        <Table.Cell>{c.name}</Table.Cell>
                        <Table.Cell>{c.stage}</Table.Cell>
                        <Table.Cell>{c.classification}</Table.Cell>
                        <Table.Cell>
                          {c.risk ? (
                            <ToolbarIconButton
                              icon={exclamationTriangleIcon}
                              aria-label="Risk: review programme classification for this candidate"
                              onClick={() => undefined}
                            />
                          ) : (
                            <BodyText size="small">—</BodyText>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <PrimaryButton size="small" onClick={openOffer}>
                            Initiate offer
                          </PrimaryButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Tabs.Panel>
            <Tabs.Panel data-id="compliance">
              <Flex gap="m" marginBottom="l" flexWrap="wrap" style={{ minWidth: 0, maxWidth: '100%' }}>
                <Box
                  padding="l"
                  style={{
                    flex: '1 1 200px',
                    minWidth: 0,
                    maxWidth: '100%',
                    borderRadius: SANA_CARD_RADIUS_LG,
                    border: `1px solid ${colors.soap300}`,
                    backgroundColor: colors.frenchVanilla100,
                  }}
                >
                  <Heading size="small" marginBottom="s">
                    Current composition (illustrative)
                  </Heading>
                  <CompositionBar nationalPct={38} gccPct={22} otherPct={40} />
                </Box>
                <Box
                  padding="l"
                  style={{
                    flex: '1 1 200px',
                    minWidth: 0,
                    maxWidth: '100%',
                    borderRadius: SANA_CARD_RADIUS_LG,
                    border: `1px solid ${colors.soap300}`,
                    backgroundColor: colors.frenchVanilla100,
                  }}
                >
                  <Heading size="small" marginBottom="s">
                    vs target
                  </Heading>
                  <BodyText size="medium" marginBottom="xs">
                    Target nationalisation {targetPct}%
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper500} style={textWrapInColumn}>
                    Projected gap if current pipeline closes as-is: medium
                  </BodyText>
                </Box>
                <Box
                  padding="l"
                  style={{
                    flex: '1 1 200px',
                    minWidth: 0,
                    maxWidth: '100%',
                    borderRadius: SANA_CARD_RADIUS_LG,
                    border: `1px solid ${colors.soap300}`,
                    backgroundColor: colors.frenchVanilla100,
                  }}
                >
                  <Heading size="small" marginBottom="s">
                    Trend (last 30 days)
                  </Heading>
                  <BodyText size="small">National share up 2 pts vs prior month (illustrative).</BodyText>
                </Box>
              </Flex>
              <BodyText size="small" marginBottom="m">
                Pipeline: Screen 12 · Interview 18 · Offer 6 · Hired 2
              </BodyText>
              <Flex gap="s" marginBottom="l" flexWrap="wrap">
                <SecondaryButton>Export composition</SecondaryButton>
                <TertiaryButton>View data quality</TertiaryButton>
              </Flex>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="s" style={textWrapInColumn}>
                Some candidates are missing programme fields. Metrics may be incomplete until data is updated.
              </BodyText>
            </Tabs.Panel>
            <Tabs.Panel data-id="details">
              <BodyText size="medium" marginBottom="s">
                Requisition metadata, hiring team, and approvals appear here (representative placeholder).
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                Status: {reqDetail.status} · Candidates in pipeline: {reqDetail.cand}
              </BodyText>
            </Tabs.Panel>
          </Tabs>
          </Box>
          <FooterDisclaimer />
        </Box>
      )}

      {hubTab === 'candidates' && (
        <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
          <Heading size="large" marginBottom="xs">
            Candidates
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={textWrapInColumn}>
            Programme classification shown when your security profile allows.
          </BodyText>
          <Box marginBottom="m" style={{ maxWidth: 360 }}>
            <FormTextInput id="cand-q" label="Filter" placeholder="Name or req" value={candSearch} onChange={setCandSearch} />
          </Box>
          {tableShell(
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Candidate</Table.Header>
                  <Table.Header>Requisition</Table.Header>
                  <Table.Header>Stage</Table.Header>
                  <Table.Header>Classification</Table.Header>
                  <Table.Header>Actions</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredCands.map((c) => (
                  <Table.Row key={c.name}>
                    <Table.Cell>{c.name}</Table.Cell>
                    <Table.Cell>{c.req}</Table.Cell>
                    <Table.Cell>{c.stage}</Table.Cell>
                    <Table.Cell>{c.classification}</Table.Cell>
                    <Table.Cell>
                      <PrimaryButton size="small" onClick={openOffer}>
                        Initiate offer
                      </PrimaryButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <FooterDisclaimer />
        </Box>
      )}

      {hubTab === 'dashboard' && (
        <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
          <Heading size="large" marginBottom="xs">
            Recruiting dashboard
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={textWrapInColumn}>
            Metrics-oriented view: time to fill and quota coverage (illustrative).
          </BodyText>
          <Flex gap="m" marginBottom="l" flexWrap="wrap">
            <KpiTile label="Median time to fill (GCC)" value="36 days" hint="Rolling 90 days" />
            <KpiTile label="Quota coverage" value="84%" hint="Complete programme fields" />
            <KpiTile label="Offers with compliance flag" value="6" hint="Warn or block (last month)" />
          </Flex>
          <FooterDisclaimer />
        </Box>
      )}

      {hubTab === 'nationalisation' && (
        <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
          <Heading size="large" marginBottom="xs">
            Nationalisation & compliance
          </Heading>
          <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={textWrapInColumn}>
            Scope dashboards, programme administration, and exports for manual statutory filing.
          </BodyText>
          <Box style={{ minWidth: 0, maxWidth: '100%' }}>
          <Tabs model={natTabs}>
            <Tabs.List
              marginBottom="l"
              gap="xxs"
              style={{ flexWrap: 'wrap', minWidth: 0, maxWidth: '100%', rowGap: space.xs }}
            >
              <Tabs.Item data-id="recruiter-dashboard">Recruiter dashboard</Tabs.Item>
              <Tabs.Item data-id="executive-summary">Executive summary</Tabs.Item>
              <Tabs.Item data-id="programme-admin">Programme administration</Tabs.Item>
              <Tabs.Item data-id="exports-audit">Exports and audit</Tabs.Item>
            </Tabs.List>

            <Tabs.Panel data-id="recruiter-dashboard">
              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <Box style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <FormSelect
                    id="nat-entity"
                    label="Organisation"
                    value={natEntity}
                    onChange={setNatEntity}
                    options={[
                      { value: 'entity-1', label: 'GCC hiring entity' },
                      { value: 'entity-2', label: 'Franchise - Northern Gulf' },
                    ]}
                  />
                  <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" style={textWrapInColumn}>
                    Choose the supervisory organisation or legal entity for quota calculations.
                  </BodyText>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <FormSelect
                    id="nat-loc"
                    label="Location"
                    value={natLocation}
                    onChange={setNatLocation}
                    options={[
                      { value: 'all', label: 'All locations' },
                      { value: 'uae', label: 'United Arab Emirates' },
                      { value: 'ksa', label: 'Kingdom of Saudi Arabia' },
                    ]}
                  />
                  <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" style={textWrapInColumn}>
                    Filter metrics by work location.
                  </BodyText>
                </Box>
                <Box style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <FormSelect
                    id="nat-pack"
                    label="Programme"
                    value={natPack}
                    onChange={setNatPack}
                    options={[
                      { value: 'ksa', label: 'KSA pack' },
                      { value: 'uae', label: 'UAE pack' },
                    ]}
                  />
                  <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" style={textWrapInColumn}>
                    Select the nationalisation programme for this scope.
                  </BodyText>
                </Box>
              </Flex>
              <Box
                padding="l"
                marginBottom="l"
                style={{
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: `1px solid ${colors.soap300}`,
                  backgroundColor: colors.frenchVanilla100,
                }}
              >
                <Heading size="small" marginBottom="s">
                  Composition vs target
                </Heading>
                <CompositionBar nationalPct={41} gccPct={19} otherPct={40} />
              </Box>
              <Heading size="small" marginBottom="s">
                Requisitions breaching warn threshold
              </Heading>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Req ID</Table.Header>
                      <Table.Header>Gap to target</Table.Header>
                      <Table.Header>Programme</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>REQ-2026-0194</Table.Cell>
                      <Table.Cell>−4 pts</Table.Cell>
                      <Table.Cell>Saudization</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>REQ-2026-0172</Table.Cell>
                      <Table.Cell>−2 pts</Table.Cell>
                      <Table.Cell>Emiratisation</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
            </Tabs.Panel>

            <Tabs.Panel data-id="executive-summary">
              <Heading size="small" marginBottom="m">
                Executive compliance summary
              </Heading>
              <Flex gap="m" marginBottom="l" flexWrap="wrap">
                <KpiTile label="Programme health" value="Amber" hint="2 entities below target" />
                <KpiTile label="Franchise roll-up" value="Illustrative" hint="Multi-entity GCC view (placeholder)" />
              </Flex>
              <SecondaryButton onClick={() => setHubTab('requisitions')}>View drill-down in requisitions</SecondaryButton>
            </Tabs.Panel>

            <Tabs.Panel data-id="programme-admin">
              <Heading size="small" marginBottom="m">
                Programme administration
              </Heading>
              <Flex flexDirection="column" gap="m" marginBottom="l" style={{ maxWidth: 480, minWidth: 0, width: '100%' }}>
                <Checkbox
                  id="pack-ksa"
                  checked={packKsa}
                  label="Saudi Arabia (KSA) programme"
                  onChange={(e) => setPackKsa(e.target.checked)}
                />
                <Checkbox
                  id="pack-uae"
                  checked={packUae}
                  label="United Arab Emirates (UAE) programme"
                  onChange={(e) => setPackUae(e.target.checked)}
                />
                <Box>
                  <FormTextInput
                    id="target-pct"
                    label="Target nationalisation %"
                    value={targetPct}
                    onChange={setTargetPct}
                  />
                  <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" style={textWrapInColumn}>
                    Customer-maintained target for the selected programme.
                  </BodyText>
                </Box>
                <Box>
                  <FormDateInput id="eff-date" label="Effective date" value={effectiveDate} onChange={setEffectiveDate} />
                  <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" style={textWrapInColumn}>
                    When this target or mapping applies.
                  </BodyText>
                </Box>
                <FormSelect
                  id="org-map"
                  label="Organisation mapping"
                  value={orgMapping}
                  onChange={setOrgMapping}
                  options={[
                    { value: 'supervisory-org-01', label: 'Supervisory org — GCC TA' },
                    { value: 'legal-entity-ksa', label: 'Legal entity — KSA' },
                  ]}
                />
              </Flex>
              <Flex gap="s" flexWrap="wrap">
                <PrimaryButton
                  onClick={() => {
                    setAdminBaseline({
                      ksa: packKsa,
                      uae: packUae,
                      target: targetPct,
                      date: effectiveDate,
                      org: orgMapping,
                    });
                  }}
                >
                  Save changes
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    if (adminDirty) discardModal.events.show();
                    else {
                      setPackKsa(adminBaseline.ksa);
                      setPackUae(adminBaseline.uae);
                      setTargetPct(adminBaseline.target);
                      setEffectiveDate(adminBaseline.date);
                      setOrgMapping(adminBaseline.org);
                    }
                  }}
                >
                  Cancel
                </SecondaryButton>
              </Flex>
            </Tabs.Panel>

            <Tabs.Panel data-id="exports-audit">
              <Heading size="small" marginBottom="m">
                Exports and audit
              </Heading>
              <Flex gap="s" marginBottom="l" flexWrap="wrap">
                <SecondaryButton onClick={() => exportModal.events.show()}>Run export</SecondaryButton>
                <SecondaryButton>Download template</SecondaryButton>
              </Flex>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Who</Table.Header>
                      <Table.Header>When</Table.Header>
                      <Table.Header>Template</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {EXPORT_HISTORY.map((row, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{row.who}</Table.Cell>
                        <Table.Cell>{row.when}</Table.Cell>
                        <Table.Cell>{row.template}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
              <Box
                padding="l"
                marginTop="m"
                style={{
                  minWidth: 0,
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  borderRadius: SANA_CARD_RADIUS_LG,
                  border: `1px solid ${colors.soap300}`,
                  backgroundColor: colors.frenchVanilla100,
                }}
              >
                <Heading size="small" marginBottom="s">
                  Export format
                </Heading>
                <FormSelect
                  id="export-fmt"
                  label="Export format"
                  value={exportFormat}
                  onChange={setExportFormat}
                  options={[
                    { value: 'csv', label: 'CSV' },
                    { value: 'xlsx', label: 'XLSX' },
                  ]}
                />
                <BodyText size="small" color={colors.blackPepper500} marginTop="xxs" style={textWrapInColumn}>
                  Choose CSV or XLSX for manual upload to your government portal.
                </BodyText>
              </Box>
              <BodyText size="small" color={colors.blackPepper500} marginTop="m" style={textWrapInColumn}>
                Files you download are governed by your organisation&apos;s policies. Do not share outside authorised channels.
              </BodyText>
            </Tabs.Panel>
          </Tabs>
          </Box>
          <FooterDisclaimer />
        </Box>
      )}
    </Box>
  );

  return (
    <Box style={{ backgroundColor: SANA_PAGE_CANVAS, minHeight: '100vh' }}>
      <WorkdayTopNav searchValue={topSearch} onSearchChange={setTopSearch} />
      <Flex
        alignItems="stretch"
        style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`, minWidth: 0 }}
      >
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL}
          secondaryTitle="Recruiting"
          secondarySubtitle="GCC nationalisation (prototype)"
          tabs={[...HUB_TABS]}
          activeTabId={hubTab}
          onTabChange={(id) => {
            setHubTab(id as HubId);
            setReqDetail(null);
          }}
        />
        <Box
          flex={1}
          minWidth={0}
          style={{
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: SANA_PAGE_CANVAS,
          }}
        >
          <Box padding="l" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
            {shellCard}
          </Box>
        </Box>
      </Flex>

      <Modal model={offerModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              maxWidth: 560,
              width: 'min(100%, calc(100vw - 32px))',
              maxHeight: 'min(90vh, 880px)',
              margin: space.l,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <Modal.Heading
              padding="m"
              style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}
            >
              Review offer compliance
            </Modal.Heading>
            <Modal.Body
              padding="l"
              style={{
                flex: '1 1 auto',
                minHeight: 0,
                minWidth: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingBottom: space.xxl,
                boxSizing: 'border-box',
              }}
            >
              {offerSeverity === 'inform' && (
                <Banner hasError={false} marginBottom="m" style={{ width: '100%' }}>
                  <Banner.Icon />
                  <Banner.Label>This offer does not change your programme position.</Banner.Label>
                </Banner>
              )}
              {offerSeverity === 'warn' && (
                <Banner
                  hasError={false}
                  marginBottom="m"
                  style={{ width: '100%', borderLeft: `4px solid ${colors.cantaloupe600}` }}
                >
                  <Banner.Icon />
                  <Banner.Label>
                    This offer may move you further from your nationalisation target. Review the breakdown before you continue.
                  </Banner.Label>
                </Banner>
              )}
              {offerSeverity === 'block' && (
                <Banner hasError={true} marginBottom="m" style={{ width: '100%' }}>
                  <Banner.Icon />
                  <Banner.Label>
                    You can&apos;t proceed with this offer under current rules. Contact your COE or compliance owner to
                    request an exception.
                  </Banner.Label>
                </Banner>
              )}
              <BodyText size="small" marginBottom="m" style={textWrapInColumn}>
                Rule: {natPack === 'ksa' ? 'Nitaqat band' : 'Emiratisation quota'} · Population: active pipeline for selected
                entity · Projected post-hire national share: 37% (illustrative).
              </BodyText>
              {tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Factor</Table.Header>
                      <Table.Header>Value</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Programme</Table.Cell>
                      <Table.Cell>{natPack === 'ksa' ? 'KSA' : 'UAE'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Band / headcount</Table.Cell>
                      <Table.Cell>Medium enterprise · 240 employees (illustrative)</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
              <Flex gap="xs" marginTop="m" marginBottom="m" flexWrap="wrap">
                <TertiaryButton size="small" onClick={() => setOfferSeverity('inform')}>
                  Demo: inform
                </TertiaryButton>
                <TertiaryButton size="small" onClick={() => setOfferSeverity('warn')}>
                  Demo: warn
                </TertiaryButton>
                <TertiaryButton size="small" onClick={() => setOfferSeverity('block')}>
                  Demo: block
                </TertiaryButton>
              </Flex>
              {offerSeverity === 'warn' && (
                <Box marginBottom="m">
                  <label htmlFor="override-reason">
                    <BodyText size="small" as="span" fontWeight="bold">
                      Reason for override
                    </BodyText>
                  </label>
                  <BodyText size="small" color={colors.blackPepper500} marginBottom="xs" style={textWrapInColumn}>
                    Required when continuing past a compliance warning. Your entry is stored for audit.
                  </BodyText>
                  <TextInput
                    id="override-reason"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Explain business justification"
                    style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </Box>
              )}
              <Flex
                gap="s"
                flexWrap="wrap"
                justifyContent="flex-end"
                marginTop="l"
                style={{ flexShrink: 0, paddingTop: space.xs }}
              >
                {offerSeverity === 'block' ? (
                  <>
                    <SecondaryButton onClick={() => offerModal.events.hide()}>Close</SecondaryButton>
                    <TertiaryButton>Request exception</TertiaryButton>
                  </>
                ) : offerSeverity === 'warn' ? (
                  <>
                    <SecondaryButton onClick={() => offerModal.events.hide()}>Go back</SecondaryButton>
                    <PrimaryButton
                      onClick={() => offerModal.events.hide()}
                      disabled={!overrideReason.trim()}
                      title={!overrideReason.trim() ? 'Enter a reason for override to continue.' : undefined}
                    >
                      Continue with offer
                    </PrimaryButton>
                  </>
                ) : (
                  <>
                    <SecondaryButton onClick={() => offerModal.events.hide()}>Go back</SecondaryButton>
                    <PrimaryButton onClick={() => offerModal.events.hide()}>Continue with offer</PrimaryButton>
                  </>
                )}
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={exportModal}>
        <Modal.Overlay>
          <Modal.Card style={{ maxWidth: 480, width: '100%', margin: space.l }}>
            <Modal.Heading padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
              Run export
            </Modal.Heading>
            <Modal.Body padding="l">
              <BodyText size="small" marginBottom="m">
                Files you download are governed by your organisation&apos;s policies. Do not share outside authorised channels.
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                This export is for manual upload to your government portal. Workday does not submit to Qiwa or Mudad in version 1.
              </BodyText>
              <Flex gap="s" justifyContent="flex-end" marginTop="l">
                <SecondaryButton onClick={() => exportModal.events.hide()}>Cancel</SecondaryButton>
                <PrimaryButton onClick={() => exportModal.events.hide()}>Run export</PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={discardModal}>
        <Modal.Overlay>
          <Modal.Card style={{ maxWidth: 400, width: '100%', margin: space.l }}>
            <Modal.Heading padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
              Discard changes?
            </Modal.Heading>
            <Modal.Body padding="l">
              <BodyText size="small" marginBottom="m">
                Your updates won&apos;t be saved.
              </BodyText>
              <Flex gap="s" justifyContent="flex-end" marginTop="m">
                <SecondaryButton onClick={() => discardModal.events.hide()}>Keep editing</SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    setPackKsa(adminBaseline.ksa);
                    setPackUae(adminBaseline.uae);
                    setTargetPct(adminBaseline.target);
                    setEffectiveDate(adminBaseline.date);
                    setOrgMapping(adminBaseline.org);
                    discardModal.events.hide();
                  }}
                >
                  Discard
                </PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </Box>
  );
}
