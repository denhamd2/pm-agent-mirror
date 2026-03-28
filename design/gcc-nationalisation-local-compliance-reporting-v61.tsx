/**
 * GCC nationalisation and local compliance reporting — Canvas Kit prototype (v61)
 * Mission: GCC-E2E-029 · Step 8.5
 * Design brief: design/gcc-nationalisation-local-compliance-reporting-v61-design-brief.md
 * PRD: docs/prds/gcc-nationalisation-local-compliance-reporting-prd.md
 * Retention messaging: Path A (metadata + pointers; re-run refreshes numbers).
 */
import React, { useCallback, useMemo, useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Modal, useModalModel } from '@workday/canvas-kit-react/modal';
import { Table } from '@workday/canvas-kit-react/table';
import { Tabs, useTabsModel } from '@workday/canvas-kit-react/tabs';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import {
  homeIcon,
  userIcon,
  homeBuildingIcon,
  linkIcon,
  dotIcon,
  checkSmallIcon,
} from '@workday/canvas-system-icons-web';
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
  { id: 'compliance', label: 'Compliance' },
] as const;

type HubId = (typeof HUB_TABS)[number]['id'];

const PRIMARY_RAIL_COMPLIANCE: WorkdayLeftTabBarPrimaryItem[] = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'Home' },
  { icon: checkSmallIcon, ariaLabel: 'Compliance', railLabel: 'Compliance' },
  { icon: userIcon, ariaLabel: 'Personal', railLabel: 'Personal' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const MOCK_REQS = [
  { id: 'REQ-2026-0201', title: 'Finance Analyst — UAE national programme', loc: 'Dubai, UAE', status: 'Interview', cand: 14 },
  { id: 'REQ-2026-0194', title: 'Engineering graduate — Saudization', loc: 'Riyadh, KSA', status: 'Screen', cand: 38 },
  { id: 'REQ-2026-0188', title: 'HR Coordinator — Kuwaitization', loc: 'Kuwait City', status: 'Offer', cand: 6 },
];

const MOCK_CANDIDATES = [
  { name: 'Aisha Al-Mazrouei', stage: 'Interview', req: 'REQ-2026-0201', loc: 'Dubai' },
  { name: 'Khalid Al-Otaibi', stage: 'Screen', req: 'REQ-2026-0194', loc: 'Riyadh' },
  { name: 'Noor Al-Sabah', stage: 'Offer', req: 'REQ-2026-0188', loc: 'Kuwait City' },
];

const CATALOGUE_ROWS = [
  {
    id: 'r1',
    name: 'Emiratisation pipeline summary',
    pack: 'United Arab Emirates',
    packKey: 'ae',
    primaryObjects: 'Candidate, Job requisition',
    requiredFields: 'Nationality, Programme classification',
    lastRun: '26 March 2026, 09:14',
    definitionId: 'LCR-AE-PIPE-2026.03',
    version: '2026.03.1',
  },
  {
    id: 'r2',
    name: 'Nitaqat hiring cohort (recruiting)',
    pack: 'Kingdom of Saudi Arabia',
    packKey: 'ksa',
    primaryObjects: 'Application, Job requisition',
    requiredFields: 'Programme code, Stage',
    lastRun: '25 March 2026, 16:02',
    definitionId: 'LCR-KSA-HIRE-2026.03',
    version: '2026.03.1',
  },
  {
    id: 'r3',
    name: 'Kuwaitization monthly hire view',
    pack: 'Kuwait',
    packKey: 'kw',
    primaryObjects: 'Candidate, Application',
    requiredFields: 'Nationality, Local programme flag',
    lastRun: '20 March 2026, 11:40',
    definitionId: 'LCR-KW-MON-2026.02',
    version: '2026.02.4',
  },
];

const HISTORY_ROWS = [
  {
    id: 'h1',
    when: '24 March 2026, 09:14',
    report: 'Emiratisation pipeline summary',
    by: 'You',
    version: '2026.03.1',
    status: 'Complete',
    pack: 'United Arab Emirates',
    params: 'Period: This month · Include closed requisitions: No',
  },
  {
    id: 'h2',
    when: '23 March 2026, 16:02',
    report: 'Nitaqat hiring cohort (recruiting)',
    by: 'M. Al-Rashid',
    version: '2026.03.1',
    status: 'Complete',
    pack: 'Kingdom of Saudi Arabia',
    params: 'Period: Last month · Include closed requisitions: Yes',
  },
];

const GAP_ROWS = [
  { req: 'REQ-2026-0194', candidate: 'Khalid Al-Otaibi', missing: 'Programme classification' },
  { req: 'REQ-2026-0188', candidate: 'Noor Al-Sabah', missing: 'Local programme flag' },
];

const LINEAGE_ROWS = [
  { column: 'Programme tag', object: 'Job requisition', field: 'gcc_programme_reference' },
  { column: 'Nationality', object: 'Candidate', field: 'citizenship_status' },
  { column: 'Stage', object: 'Application', field: 'stage' },
];

function tableShell(children: React.ReactNode) {
  return (
    <Box style={{ maxWidth: '100%', minWidth: 0, overflowX: 'auto' }}>
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

const GccNationalisationLocalComplianceReportingV61: React.FC = () => {
  const [topSearch, setTopSearch] = useState('');
  const [hubTab, setHubTab] = useState<HubId>('compliance');

  const complianceTabsModel = useTabsModel({ initialTab: 'catalogue' });
  const runModal = useModalModel();
  const runDetailsModal = useModalModel();
  const discardModal = useModalModel();

  const [cataloguePack, setCataloguePack] = useState('all');
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [runRowId, setRunRowId] = useState<string | null>(null);
  const [runPackSlice, setRunPackSlice] = useState('ae');
  const [runPeriod, setRunPeriod] = useState('this_month');
  const [includeClosedReqs, setIncludeClosedReqs] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [catalogueRunDone, setCatalogueRunDone] = useState(false);

  const [historyPack, setHistoryPack] = useState('all');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const [packUae, setPackUae] = useState(true);
  const [packKsa, setPackKsa] = useState(true);
  const [packKw, setPackKw] = useState(false);
  const [mapSource, setMapSource] = useState('nationality_custom_01');
  const [mapTarget, setMapTarget] = useState('gcc_programme_reference');
  const [setupBaseline, setSetupBaseline] = useState(() => ({
    uae: true,
    ksa: true,
    kw: false,
    src: 'nationality_custom_01',
    tgt: 'gcc_programme_reference',
  }));
  const [packSaveOk, setPackSaveOk] = useState(false);

  const [dqSlice, setDqSlice] = useState('ae');

  const [reqSearch, setReqSearch] = useState('');
  const [candSearch, setCandSearch] = useState('');

  const setupDirty = useMemo(() => {
    return (
      packUae !== setupBaseline.uae ||
      packKsa !== setupBaseline.ksa ||
      packKw !== setupBaseline.kw ||
      mapSource !== setupBaseline.src ||
      mapTarget !== setupBaseline.tgt
    );
  }, [packUae, packKsa, packKw, mapSource, mapTarget, setupBaseline]);

  const filteredCatalogue = useMemo(() => {
    const q = catalogueSearch.trim().toLowerCase();
    return CATALOGUE_ROWS.filter((row) => {
      if (cataloguePack !== 'all' && row.packKey !== cataloguePack) return false;
      if (!q) return true;
      return row.name.toLowerCase().includes(q) || row.primaryObjects.toLowerCase().includes(q);
    });
  }, [cataloguePack, catalogueSearch]);

  const coveragePercent = useMemo(() => {
    if (cataloguePack === 'kw') return null;
    if (cataloguePack === 'ae') return 87;
    if (cataloguePack === 'ksa') return 82;
    return 84;
  }, [cataloguePack]);

  const openRunModal = useCallback(
    (rowId: string) => {
      setRunRowId(rowId);
      const row = CATALOGUE_ROWS.find((r) => r.id === rowId);
      if (row) setRunPackSlice(row.packKey);
      setCatalogueRunDone(false);
      runModal.events.show();
    },
    [runModal.events]
  );

  const executeRunFromModal = useCallback(() => {
    setRunLoading(true);
    window.setTimeout(() => {
      setRunLoading(false);
      setCatalogueRunDone(true);
      runModal.events.hide();
    }, 900);
  }, [runModal.events]);

  const openRunDetails = useCallback(
    (id: string) => {
      setSelectedHistoryId(id);
      runDetailsModal.events.show();
    },
    [runDetailsModal.events]
  );

  const selectedHistory = HISTORY_ROWS.find((h) => h.id === selectedHistoryId);
  const activeCatalogueRow = CATALOGUE_ROWS.find((r) => r.id === runRowId);

  const savePacks = useCallback(() => {
    setPackSaveOk(false);
    window.setTimeout(() => {
      setPackSaveOk(true);
      setSetupBaseline({
        uae: packUae,
        ksa: packKsa,
        kw: packKw,
        src: mapSource,
        tgt: mapTarget,
      });
      window.setTimeout(() => setPackSaveOk(false), 4000);
    }, 400);
  }, [packUae, packKsa, packKw, mapSource, mapTarget]);

  const requestSetupCancel = useCallback(() => {
    if (setupDirty) discardModal.events.show();
    else {
      setPackUae(setupBaseline.uae);
      setPackKsa(setupBaseline.ksa);
      setPackKw(setupBaseline.kw);
      setMapSource(setupBaseline.src);
      setMapTarget(setupBaseline.tgt);
    }
  }, [setupDirty, discardModal.events, setupBaseline]);

  const discardSetup = useCallback(() => {
    setPackUae(setupBaseline.uae);
    setPackKsa(setupBaseline.ksa);
    setPackKw(setupBaseline.kw);
    setMapSource(setupBaseline.src);
    setMapTarget(setupBaseline.tgt);
    discardModal.events.hide();
  }, [setupBaseline, discardModal.events]);

  const hubSubtitle = useMemo(() => {
    if (hubTab === 'overview') return 'Overview';
    if (hubTab === 'requisitions') return 'Job requisitions';
    if (hubTab === 'candidates') return 'Candidates';
    return 'Local compliance reporting';
  }, [hubTab]);

  const secondaryTitle = hubTab === 'compliance' ? 'Local compliance reporting' : 'Recruiting';

  const workspaceChrome: React.CSSProperties = {
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
  };

  const complianceWorkspace = (
    <Box padding="l" style={workspaceChrome}>
      <Heading size="large" marginBottom="xxs">
        Local compliance reporting
      </Heading>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="m" style={{ maxWidth: 960 }}>
        Recruiting-sourced reports for internal evidence. Not for statutory filings, workforce-wide totals, or HCM.
      </BodyText>

      <BodyText size="small" color={colors.blackPepper500} marginBottom="s" style={{ maxWidth: 960 }}>
        Access to nationality and programme fields follows your organisation&apos;s security policies.
      </BodyText>
      <BodyText
        size="small"
        color={colors.blackPepper400}
        marginBottom="l"
        style={{ maxWidth: 960 }}
        title="Sensitive fields may appear blank when your security profile doesn't include access."
      >
        Sensitive fields may appear blank when your security profile doesn&apos;t include access.
      </BodyText>

      <CardSurface>
        <Tabs model={complianceTabsModel}>
          <Tabs.List
            marginBottom="l"
            gap="xxs"
            style={{
              flexWrap: 'wrap',
              rowGap: space.xxs,
              columnGap: space.xs,
              minWidth: 0,
              maxWidth: '100%',
            }}
          >
            <Tabs.Item data-id="catalogue">Report catalogue</Tabs.Item>
            <Tabs.Item data-id="run-history">Run history</Tabs.Item>
            <Tabs.Item data-id="programme-setup">Programme setup</Tabs.Item>
            <Tabs.Item data-id="data-quality">Data quality</Tabs.Item>
          </Tabs.List>

          <Tabs.Panel data-id="catalogue">
            <Flex gap="l" flexWrap="wrap" marginBottom="m" style={{ minWidth: 0 }}>
              <Box style={{ flex: '1 1 200px', minWidth: 0, maxWidth: '100%' }}>
                <FormSelect
                  id="cat-pack"
                  label="Programme"
                  value={cataloguePack}
                  onChange={setCataloguePack}
                  options={[
                    { value: 'all', label: 'All programmes' },
                    { value: 'ae', label: 'United Arab Emirates' },
                    { value: 'ksa', label: 'Kingdom of Saudi Arabia' },
                    { value: 'kw', label: 'Kuwait' },
                  ]}
                />
              </Box>
              <Box style={{ flex: '2 1 240px', minWidth: 0, maxWidth: '100%' }}>
                <FormTextInput
                  id="cat-search"
                  label="Search reports"
                  placeholder="Search by report pack"
                  value={catalogueSearch}
                  onChange={setCatalogueSearch}
                />
              </Box>
            </Flex>

            <Heading size="small" marginBottom="s">
              Data coverage for this slice
            </Heading>
            {coveragePercent == null ? (
              <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
                No coverage data for this slice. Adjust filters or complete programme mapping.
              </BodyText>
            ) : (
              <BodyText size="small" color={colors.blackPepper500} marginBottom="l">
                {coveragePercent}% of in-scope candidates have complete programme fields
              </BodyText>
            )}

            <Flex gap="m" marginBottom="l" flexWrap="wrap" style={{ minWidth: 0 }}>
              <KpiTile label="Completeness (pilot threshold TBD)" value={`${coveragePercent ?? '—'}%`} hint="Placeholder for pilot workbook threshold" />
              <KpiTile label="Open gaps (illustrative)" value="2" hint="Records missing required programme fields" />
            </Flex>

            {catalogueRunDone && activeCatalogueRow ? (
              <Box marginBottom="l">
                <Heading size="small" marginBottom="m">
                  Results
                </Heading>
                {tableShell(
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Requisition</Table.Header>
                        <Table.Header>Candidate</Table.Header>
                        <Table.Header>Stage</Table.Header>
                        <Table.Header>Programme tag</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>REQ-2026-0201</Table.Cell>
                        <Table.Cell>Aisha Al-Mazrouei</Table.Cell>
                        <Table.Cell>Interview</Table.Cell>
                        <Table.Cell>UAE national programme</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>REQ-2026-0194</Table.Cell>
                        <Table.Cell>Khalid Al-Otaibi</Table.Cell>
                        <Table.Cell>Screen</Table.Cell>
                        <Table.Cell>Nitaqat - green zone target</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                )}
                <Box
                  marginTop="m"
                  padding="m"
                  style={{
                    borderRadius: SANA_CARD_RADIUS_LG,
                    border: `1px solid ${colors.soap300}`,
                    backgroundColor: colors.frenchVanilla100,
                    boxShadow: SANA_CARD_SHADOW,
                    maxWidth: 640,
                  }}
                >
                  <Heading size="small" marginBottom="s">
                    Run details
                  </Heading>
                  <BodyText size="small" marginBottom="xxs">
                    <strong>Run by</strong> · You
                  </BodyText>
                  <BodyText size="small" marginBottom="xxs">
                    <strong>Run time</strong> · 27 March 2026, 14:32 (tenant time)
                  </BodyText>
                  <BodyText size="small" marginBottom="xxs">
                    <strong>Report definition</strong> · {activeCatalogueRow.definitionId}
                  </BodyText>
                  <BodyText size="small" marginBottom="xxs">
                    <strong>Definition version</strong> · {activeCatalogueRow.version}
                  </BodyText>
                  <BodyText size="small" marginBottom="m">
                    <strong>Data sources</strong> · Recruiting candidate, application, job requisition (illustrative)
                  </BodyText>
                  <BodyText size="small" color={colors.blackPepper500}>
                    Results reflect current Recruiting data. Re-run this pack to refresh numbers.
                  </BodyText>
                  <Heading size="small" marginTop="m" marginBottom="s">
                    Column lineage
                  </Heading>
                  {LINEAGE_ROWS.map((lr) => (
                    <BodyText key={lr.column} size="small" marginBottom="xxs">
                      {lr.column} → {lr.object}.{lr.field}
                    </BodyText>
                  ))}
                </Box>
                <Flex gap="s" marginTop="m" flexWrap="wrap">
                  <SecondaryButton>Export</SecondaryButton>
                </Flex>
              </Box>
            ) : null}

            {filteredCatalogue.length === 0 ? (
              <Box padding="xl" style={{ textAlign: 'center' }}>
                <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                  No report packs match your filters.
                </BodyText>
                <SecondaryButton
                  onClick={() => {
                    setCataloguePack('all');
                    setCatalogueSearch('');
                  }}
                >
                  Clear filters
                </SecondaryButton>
              </Box>
            ) : (
              tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Report pack</Table.Header>
                      <Table.Header>Programme</Table.Header>
                      <Table.Header>Primary objects</Table.Header>
                      <Table.Header>Required fields</Table.Header>
                      <Table.Header>Last run</Table.Header>
                      <Table.Header scope="col">Actions</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {filteredCatalogue.map((row) => (
                      <Table.Row key={row.id}>
                        <Table.Cell>
                          <BodyText size="small" fontWeight={600}>
                            {row.name}
                          </BodyText>
                        </Table.Cell>
                        <Table.Cell>{row.pack}</Table.Cell>
                        <Table.Cell>{row.primaryObjects}</Table.Cell>
                        <Table.Cell>{row.requiredFields}</Table.Cell>
                        <Table.Cell>{row.lastRun}</Table.Cell>
                        <Table.Cell>
                          <Flex gap="xs" flexWrap="wrap" alignItems="center">
                            <TertiaryButton size="small" onClick={() => openRunModal(row.id)}>
                              Run report
                            </TertiaryButton>
                            <TertiaryButton size="small">Export</TertiaryButton>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )
            )}
          </Tabs.Panel>

          <Tabs.Panel data-id="run-history">
            <Heading size="small" marginBottom="xs">
              Recent runs
            </Heading>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              Indexed run history may reflect a limited time window.
            </BodyText>
            <Box marginBottom="m" maxWidth={280}>
              <FormSelect
                id="hist-pack"
                label="Programme"
                value={historyPack}
                onChange={setHistoryPack}
                options={[
                  { value: 'all', label: 'All programmes' },
                  { value: 'ae', label: 'United Arab Emirates' },
                  { value: 'ksa', label: 'Kingdom of Saudi Arabia' },
                  { value: 'kw', label: 'Kuwait' },
                ]}
              />
            </Box>
            {HISTORY_ROWS.length === 0 ? (
              <BodyText size="small" color={colors.blackPepper500}>
                No runs yet. Run a pack from the catalogue.
              </BodyText>
            ) : (
              tableShell(
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Report</Table.Header>
                      <Table.Header>Run by</Table.Header>
                      <Table.Header>Run time</Table.Header>
                      <Table.Header>Definition version</Table.Header>
                      <Table.Header>Status</Table.Header>
                      <Table.Header scope="col"> </Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {HISTORY_ROWS.filter((row) => historyPack === 'all' || row.pack === CATALOGUE_ROWS.find((c) => c.packKey === historyPack)?.pack).map((row) => (
                      <Table.Row key={row.id}>
                        <Table.Cell>{row.report}</Table.Cell>
                        <Table.Cell>{row.by}</Table.Cell>
                        <Table.Cell>{row.when}</Table.Cell>
                        <Table.Cell>{row.version}</Table.Cell>
                        <Table.Cell>
                          <Flex alignItems="center" gap="xs" flexWrap="wrap">
                            <BodyText size="small">{row.status}</BodyText>
                            <Box
                              paddingX="xs"
                              paddingY="xxs"
                              style={{
                                borderRadius: 8,
                                backgroundColor: colors.soap200,
                                fontSize: 11,
                                fontWeight: 600,
                                color: colors.blackPepper500,
                              }}
                            >
                              Current data
                            </Box>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          <TertiaryButton size="small" onClick={() => openRunDetails(row.id)}>
                            View details
                          </TertiaryButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )
            )}
          </Tabs.Panel>

          <Tabs.Panel data-id="programme-setup">
            <Heading size="small" marginBottom="m">
              Programme enablement
            </Heading>
            {packSaveOk ? (
              <Box
                padding="m"
                marginBottom="m"
                style={{
                  borderRadius: 12,
                  backgroundColor: colors.greenApple100,
                  border: `1px solid ${colors.greenApple400}`,
                }}
              >
                <BodyText size="small" style={{ fontWeight: 600, color: colors.greenApple600 }}>
                  Changes saved
                </BodyText>
              </Box>
            ) : null}
            <Flex flexDirection="column" gap="m" marginBottom="l">
              <Flex alignItems="center" gap="s">
                <Checkbox checked={packUae} onChange={(e) => setPackUae(e.target.checked)} id="p-uae" />
                <BodyText as="label" htmlFor="p-uae" size="small">
                  United Arab Emirates programme
                </BodyText>
              </Flex>
              <Flex alignItems="center" gap="s">
                <Checkbox checked={packKsa} onChange={(e) => setPackKsa(e.target.checked)} id="p-ksa" />
                <BodyText as="label" htmlFor="p-ksa" size="small">
                  Kingdom of Saudi Arabia programme
                </BodyText>
              </Flex>
              <Flex alignItems="center" gap="s">
                <Checkbox checked={packKw} onChange={(e) => setPackKw(e.target.checked)} id="p-kw" />
                <BodyText as="label" htmlFor="p-kw" size="small">
                  Kuwait programme
                </BodyText>
              </Flex>
            </Flex>
            <BodyText size="small" fontWeight="bold" marginBottom="xs">
              Mapping
            </BodyText>
            <Flex gap="m" flexWrap="wrap" marginBottom="l" style={{ minWidth: 0 }}>
              <Box style={{ flex: '1 1 240px', minWidth: 0, maxWidth: '100%' }}>
                <FormTextInput
                  id="legacy-src"
                  label="Source field"
                  value={mapSource}
                  onChange={setMapSource}
                />
              </Box>
              <Box style={{ flex: '1 1 240px', minWidth: 0, maxWidth: '100%' }}>
                <FormTextInput
                  id="ref-dim"
                  label="Reference dimension"
                  value={mapTarget}
                  onChange={setMapTarget}
                />
              </Box>
            </Flex>
            <Flex gap="s" flexWrap="wrap">
              <PrimaryButton onClick={savePacks}>Save changes</PrimaryButton>
              <SecondaryButton onClick={requestSetupCancel}>Cancel</SecondaryButton>
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel data-id="data-quality">
            <Heading size="small" marginBottom="m">
              Programme data quality
            </Heading>
            <Box marginBottom="m" maxWidth={320}>
              <FormSelect
                id="dq-slice"
                label="Programme"
                value={dqSlice}
                onChange={setDqSlice}
                options={[
                  { value: 'ae', label: 'United Arab Emirates' },
                  { value: 'ksa', label: 'Kingdom of Saudi Arabia' },
                  { value: 'kw', label: 'Kuwait' },
                ]}
              />
            </Box>
            <BodyText size="small" fontWeight="bold" marginBottom="xs">
              Completeness for selected programme
            </BodyText>
            <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
              {dqSlice === 'ae' ? '87%' : dqSlice === 'ksa' ? '82%' : '79%'} of in-scope candidates have complete programme fields
            </BodyText>
            <Heading size="small" marginBottom="s">
              Records missing required fields
            </Heading>
            {GAP_ROWS.length === 0 ? (
              <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
                All in-scope records have required programme fields.
              </BodyText>
            ) : (
              <>
                {tableShell(
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Requisition</Table.Header>
                        <Table.Header>Candidate</Table.Header>
                        <Table.Header>Missing field</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {GAP_ROWS.map((g, i) => (
                        <Table.Row key={i}>
                          <Table.Cell>{g.req}</Table.Cell>
                          <Table.Cell>{g.candidate}</Table.Cell>
                          <Table.Cell>{g.missing}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                )}
                <Box marginTop="m">
                  <TertiaryButton>View validation guidance</TertiaryButton>
                </Box>
              </>
            )}
          </Tabs.Panel>
        </Tabs>
      </CardSurface>

      <Box marginTop="xl" paddingTop="m" style={{ borderTop: `1px solid ${colors.soap300}` }}>
        <BodyText size="small" color={colors.blackPepper500} style={{ maxWidth: 960 }}>
          Figures support internal management review and evidence assembly from Recruiting data. They do not constitute
          legal advice, regulator-ready submissions, or a substitute for your organisation&apos;s statutory audit
          processes.
        </BodyText>
      </Box>
    </Box>
  );

  const overviewWorkspace = (
    <Box padding="l" style={workspaceChrome}>
      <Heading size="large" marginBottom="xs">
        Recruiting overview
      </Heading>
      <BodyText size="small" color={colors.blackPepper500} marginBottom="m">
        Snapshot of open work and GCC compliance context for your scope.
      </BodyText>
      <Flex gap="m" marginBottom="l" flexWrap="wrap" style={{ minWidth: 0 }}>
        <KpiTile label="Open requisitions" value="38" hint="Assigned to you or your team" />
        <KpiTile label="GCC-tracked programmes" value="12" hint="Requisitions with nationalisation tags" />
        <KpiTile label="Reports run (30 days)" value="26" hint="Standard compliance catalogue" />
      </Flex>
      {tableShell(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>When</Table.Header>
              <Table.Header>Event</Table.Header>
              <Table.Header>Detail</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Today</Table.Cell>
              <Table.Cell>Compliance report exported</Table.Cell>
              <Table.Cell>Emiratisation pipeline summary</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Yesterday</Table.Cell>
              <Table.Cell>Pack settings updated</Table.Cell>
              <Table.Cell>Kuwait pack enabled</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </Box>
  );

  const filteredReqs = MOCK_REQS.filter((r) => {
    const q = reqSearch.trim().toLowerCase();
    return !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
  });

  const requisitionsWorkspace = (
    <Box padding="l" style={workspaceChrome}>
      <Heading size="large" marginBottom="m">
        Job requisitions
      </Heading>
      <Box marginBottom="m" maxWidth={400}>
        <FormTextInput
          id="req-q"
          label="Search"
          placeholder="Search by title or ID"
          value={reqSearch}
          onChange={setReqSearch}
        />
      </Box>
      {tableShell(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>ID</Table.Header>
              <Table.Header>Title</Table.Header>
              <Table.Header>Location</Table.Header>
              <Table.Header>Status</Table.Header>
              <Table.Header>Candidates</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filteredReqs.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{r.id}</Table.Cell>
                <Table.Cell>{r.title}</Table.Cell>
                <Table.Cell>{r.loc}</Table.Cell>
                <Table.Cell>{r.status}</Table.Cell>
                <Table.Cell>{r.cand}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Box>
  );

  const filteredCands = MOCK_CANDIDATES.filter((c) => {
    const q = candSearch.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.req.toLowerCase().includes(q);
  });

  const candidatesWorkspace = (
    <Box padding="l" style={workspaceChrome}>
      <Heading size="large" marginBottom="m">
        Candidates
      </Heading>
      <Box marginBottom="m" maxWidth={400}>
        <FormTextInput
          id="cand-q"
          label="Search candidates"
          placeholder="Name or requisition"
          value={candSearch}
          onChange={setCandSearch}
        />
      </Box>
      {tableShell(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Candidate</Table.Header>
              <Table.Header>Stage</Table.Header>
              <Table.Header>Requisition</Table.Header>
              <Table.Header>Location</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filteredCands.map((c, i) => (
              <Table.Row key={i}>
                <Table.Cell>{c.name}</Table.Cell>
                <Table.Cell>{c.stage}</Table.Cell>
                <Table.Cell>{c.req}</Table.Cell>
                <Table.Cell>{c.loc}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Box>
  );

  const innerMain =
    hubTab === 'compliance'
      ? complianceWorkspace
      : hubTab === 'overview'
        ? overviewWorkspace
        : hubTab === 'requisitions'
          ? requisitionsWorkspace
          : candidatesWorkspace;

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: SANA_PAGE_CANVAS,
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <WorkdayTopNav
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        notificationBadge={1}
        inboxBadge={3}
      />
      <Flex
        alignItems="stretch"
        style={{
          minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)`,
          minWidth: 0,
          maxWidth: '100%',
        }}
      >
        <WorkdayLeftTabBar
          primaryItems={PRIMARY_RAIL_COMPLIANCE}
          primaryWidthPx={88}
          secondaryTitle={secondaryTitle}
          secondarySubtitle={hubSubtitle}
          showSecondaryTitleIcon
          tabs={[...HUB_TABS]}
          activeTabId={hubTab}
          onTabChange={(id) => setHubTab(id as HubId)}
        />
        <Box
          flex={1}
          minWidth={0}
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: SANA_PAGE_CANVAS,
            minWidth: 0,
          }}
        >
          <Box
            margin="l"
            style={{
              borderRadius: SANA_SHELL_RADIUS,
              backgroundColor: colors.frenchVanilla100,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
              minHeight: 'min(100%, max-content)',
              minWidth: 0,
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            {innerMain}
          </Box>
        </Box>
      </Flex>

      <Modal model={runModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              width: 'min(92vw, 520px)',
              margin: space.l,
              padding: 0,
              overflow: 'hidden',
              borderRadius: SANA_SHELL_RADIUS,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
            }}
          >
            <Modal.Heading padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
              Run report
            </Modal.Heading>
            <Modal.Body padding="l">
              <Flex flexDirection="column" gap="m">
                <FormSelect
                  id="modal-period"
                  label="Reporting period"
                  value={runPeriod}
                  onChange={setRunPeriod}
                  options={[
                    { value: 'this_month', label: 'This month' },
                    { value: 'last_month', label: 'Last month' },
                    { value: 'custom', label: 'Custom range' },
                  ]}
                />
                {runPeriod === 'custom' ? (
                  <Flex gap="m" flexWrap="wrap">
                    <Box flex={1} minWidth={160}>
                      <FormDateInput id="m-start" label="Start" value="2026-03-01" onChange={() => {}} />
                    </Box>
                    <Box flex={1} minWidth={160}>
                      <FormDateInput id="m-end" label="End" value="2026-03-24" onChange={() => {}} />
                    </Box>
                  </Flex>
                ) : null}
                <FormSelect
                  id="modal-slice"
                  label="Programme slice"
                  value={runPackSlice}
                  onChange={setRunPackSlice}
                  options={[
                    { value: 'ae', label: 'United Arab Emirates' },
                    { value: 'ksa', label: 'Kingdom of Saudi Arabia' },
                    { value: 'kw', label: 'Kuwait' },
                  ]}
                />
                <Flex alignItems="center" gap="s">
                  <Checkbox
                    checked={includeClosedReqs}
                    onChange={(e) => setIncludeClosedReqs(e.target.checked)}
                    id="modal-closed"
                  />
                  <BodyText as="label" htmlFor="modal-closed" size="small">
                    Include closed requisitions
                  </BodyText>
                </Flex>
              </Flex>
              <Flex justifyContent="flex-end" gap="s" marginTop="xl" flexWrap="wrap">
                <SecondaryButton onClick={() => runModal.events.hide()}>Cancel</SecondaryButton>
                <PrimaryButton onClick={executeRunFromModal} disabled={runLoading}>
                  {runLoading ? 'Running…' : 'Run'}
                </PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={runDetailsModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              width: 'min(92vw, 640px)',
              maxHeight: 'min(88vh, 720px)',
              margin: space.l,
              padding: 0,
              overflow: 'hidden',
              borderRadius: SANA_SHELL_RADIUS,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
            }}
          >
            <Modal.Heading padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
              Run details
            </Modal.Heading>
            <Modal.Body padding="l" style={{ overflow: 'auto' }}>
              {selectedHistory ? (
                <>
                  <BodyText size="small" marginBottom="s">
                    <strong>Report</strong> · {selectedHistory.report}
                  </BodyText>
                  <BodyText size="small" marginBottom="s">
                    <strong>Run by</strong> · {selectedHistory.by}
                  </BodyText>
                  <BodyText size="small" marginBottom="s">
                    <strong>Run time</strong> · {selectedHistory.when}
                  </BodyText>
                  <BodyText size="small" marginBottom="s">
                    <strong>Definition version</strong> · {selectedHistory.version}
                  </BodyText>
                  <BodyText size="small" marginBottom="m">
                    <strong>Parameters</strong> · {selectedHistory.params}
                  </BodyText>
                  <Heading size="small" marginBottom="s">
                    Column lineage
                  </Heading>
                  {LINEAGE_ROWS.map((lr) => (
                    <BodyText key={lr.column} size="small" marginBottom="xxs">
                      {lr.column} → {lr.object}.{lr.field}
                    </BodyText>
                  ))}
                </>
              ) : (
                <BodyText size="small">No run selected.</BodyText>
              )}
              <Flex justifyContent="flex-end" marginTop="l">
                <PrimaryButton onClick={() => runDetailsModal.events.hide()}>Close</PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>

      <Modal model={discardModal}>
        <Modal.Overlay>
          <Modal.Card
            style={{
              width: 'min(92vw, 440px)',
              margin: space.l,
              padding: 0,
              overflow: 'hidden',
              borderRadius: SANA_SHELL_RADIUS,
              boxShadow: SANA_CARD_SHADOW_LIFTED,
            }}
          >
            <Modal.Heading padding="m" style={{ borderBottom: `1px solid ${colors.soap300}` }}>
              Discard changes?
            </Modal.Heading>
            <Modal.Body padding="l">
              <BodyText size="small" marginBottom="l">
                Your updates won&apos;t be saved.
              </BodyText>
              <Flex justifyContent="flex-end" gap="s" flexWrap="wrap">
                <SecondaryButton onClick={() => discardModal.events.hide()}>Keep editing</SecondaryButton>
                <PrimaryButton onClick={discardSetup}>Discard</PrimaryButton>
              </Flex>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </Box>
  );
};

function CardSurface({ children }: { children: React.ReactNode }) {
  return (
    <Box
      padding="l"
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        boxShadow: SANA_CARD_SHADOW,
        backgroundColor: colors.frenchVanilla100,
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
}

export default GccNationalisationLocalComplianceReportingV61;
