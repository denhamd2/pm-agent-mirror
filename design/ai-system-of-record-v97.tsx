import React, { useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Table } from '@workday/canvas-kit-react/table';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { Switch } from '@workday/canvas-kit-react/switch';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { 
  searchIcon, 
  plusIcon, 
  checkIcon,
  userIcon
} from '@workday/canvas-system-icons-web';
import { colors, space } from '@workday/canvas-kit-react/tokens';

import { ProfilePageLayout, ProfileTab } from './components/ProfilePageLayout';
import { SANA_CARD_RADIUS_LG } from './components/sanaShellTheme';
import { MetricCard } from './components/MetricCard';
import { ChartCard } from './components/GenUIPatterns';
import { FormSelect, FormTextInput } from './components/SharedFormControls';
import { CandidateTaskModal } from './components/CandidateTaskModal';
import { WorkdayModal } from './components/WorkdayModal';

// Mock Data for AI Inventory
const INVENTORY_DATA = [
  { id: '1', name: 'Search AI Summaries', type: 'AI Feature', risk: 'Limited Risk', owner: 'Sarah Jenkins', status: 'On', credits: 1200 },
  { id: '2', name: 'Sana Workflows', type: 'Agentic Platform', risk: 'High-Risk', owner: 'Marcus Chen', status: 'On', credits: 8500 },
  { id: '3', name: 'ChatGPT Enterprise', type: 'Agentic Platform', risk: 'Unacceptable', owner: 'IT Security', status: 'Off', credits: 0 },
  { id: '4', name: 'GenAI Job Descriptions', type: 'AI Feature', risk: 'Limited Risk', owner: 'Talent Acquisition', status: 'On', credits: 450 },
  { id: '5', name: 'Resume Screening Agent', type: 'Agent', risk: 'High-Risk', owner: 'Marcus Chen', status: 'Review', credits: 3200 },
];

const mockChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Agent Cost ($)',
      data: [1200, 1900, 3000, 5000, 4200, 6000],
      backgroundColor: colors.frenchVanilla100,
      borderColor: colors.blueberry400,
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Time Saved (Hours)',
      data: [50, 80, 150, 220, 200, 300],
      backgroundColor: colors.frenchVanilla100,
      borderColor: colors.greenApple400,
      borderWidth: 2,
      tension: 0.4,
    }
  ],
};

const BusinessImpactTab = () => (
  <Flex flexDirection="column" gap={space.l}>
    <Flex gap={space.m}>
      <MetricCard
        label="Total Flex Credits Consumed"
        value="13,350"
        helperText="This month"
        changeIndicator={{ text: "+12% vs last month", sentiment: "neutral" }}
      />
      <MetricCard
        label="Active AI Solutions"
        value="14"
        helperText="Across 3 departments"
        changeIndicator={{ text: "+2 this week", sentiment: "positive" }}
      />
      <MetricCard
        label="High-Risk Systems"
        value="3"
        helperText="Require human-in-the-loop"
        changeIndicator={{ text: "No change", sentiment: "neutral" }}
      />
    </Flex>
    
    <Flex gap={space.m}>
      <Box flex={1}>
        <ChartCard 
          title="Cost vs. Value Analysis" 
          type="line" 
          data={mockChartData} 
        />
      </Box>
    </Flex>
  </Flex>
);

const AIInventoryTab = ({ onRegister, onManage }: { onRegister: () => void, onManage: (item: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  return (
    <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
      <Flex justifyContent="space-between" alignItems="flex-end" marginBottom="m">
        <Heading size="medium" margin={0}>AI Systems & Agents</Heading>
        <PrimaryButton icon={plusIcon} onClick={onRegister}>Register AI Solution</PrimaryButton>
      </Flex>

      <Flex gap={space.m} marginBottom="l" alignItems="flex-end">
        <Box flex={1} maxWidth="300px">
          <FormTextInput
            id="inventory-search"
            label="Search Inventory"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or owner..."
          />
        </Box>
        <Box flex={1} maxWidth="200px">
          <FormSelect
            id="risk-filter"
            label="Filter by Risk Level"
            value={riskFilter}
            onChange={setRiskFilter}
            options={[
              { value: 'All', label: 'All Risk Levels' },
              { value: 'Limited Risk', label: 'Limited Risk' },
              { value: 'High-Risk', label: 'High-Risk' },
              { value: 'Unacceptable', label: 'Unacceptable' },
            ]}
          />
        </Box>
      </Flex>
      
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Type</Table.Header>
            <Table.Header>Risk Level</Table.Header>
            <Table.Header>Accountable Officer</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Actions</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {INVENTORY_DATA.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <BodyText size="medium" fontWeight="bold">{item.name}</BodyText>
              </Table.Cell>
              <Table.Cell>{item.type}</Table.Cell>
              <Table.Cell>
              <StatusIndicator 
                type={
                  item.risk === 'Limited Risk' ? StatusIndicator.Type.Green : 
                  item.risk === 'High-Risk' ? StatusIndicator.Type.Orange : StatusIndicator.Type.Red
                }
                emphasis={StatusIndicator.Emphasis.Low}
                label={item.risk} 
              />
            </Table.Cell>
            <Table.Cell>{item.owner}</Table.Cell>
            <Table.Cell>
              <StatusIndicator 
                type={
                  item.status === 'On' ? StatusIndicator.Type.Green : 
                  item.status === 'Review' ? StatusIndicator.Type.Orange : StatusIndicator.Type.Gray
                }
                emphasis={StatusIndicator.Emphasis.Low}
                label={item.status} 
              />
              </Table.Cell>
              <Table.Cell>
                <SecondaryButton size="small" onClick={() => onManage(item)}>Manage</SecondaryButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

const GovernanceTab = ({ onConfigureRules, onManageASUs }: { onConfigureRules: () => void, onManageASUs: () => void }) => {
  const [financialHitl, setFinancialHitl] = useState(true);
  const [offerHitl, setOfferHitl] = useState(true);
  const [accessHitl, setAccessHitl] = useState(true);

  return (
    <Flex flexDirection="column" gap={space.l}>
      <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
        <Heading size="medium" marginBottom="m">Human-in-the-Loop (HITL) Thresholds</Heading>
        <BodyText size="medium" marginBottom="l">
          Configure guardrails for agentic actions that trigger real-world consequences.
        </BodyText>
        
        <Flex flexDirection="column" gap={space.m}>
          <Flex alignItems="center" justifyContent="space-between" padding="s" style={{ borderBottom: `1px solid ${colors.soap400}` }}>
            <Box>
              <BodyText size="medium" fontWeight="bold">Financial Transactions</BodyText>
              <BodyText size="small" color={colors.licorice300}>Require approval for actions exceeding threshold</BodyText>
            </Box>
            <Flex alignItems="center" gap={space.s}>
              <TextInput value="$10,000" readOnly style={{ width: '100px' }} />
              <Switch id="hitl-financial" checked={financialHitl} onChange={() => setFinancialHitl(!financialHitl)} />
            </Flex>
          </Flex>
          
          <Flex alignItems="center" justifyContent="space-between" padding="s" style={{ borderBottom: `1px solid ${colors.soap400}` }}>
            <Box>
              <BodyText size="medium" fontWeight="bold">Offer Generation</BodyText>
              <BodyText size="small" color={colors.licorice300}>Require human review before sending candidate offers</BodyText>
            </Box>
            <Flex alignItems="center" gap={space.s}>
              <Switch id="hitl-offer" checked={offerHitl} onChange={() => setOfferHitl(!offerHitl)} />
            </Flex>
          </Flex>
          
          <Flex alignItems="center" justifyContent="space-between" padding="s">
            <Box>
              <BodyText size="medium" fontWeight="bold">System Access Provisioning</BodyText>
              <BodyText size="small" color={colors.licorice300}>Require IT approval for agentic role assignments</BodyText>
            </Box>
            <Flex alignItems="center" gap={space.s}>
              <Switch id="hitl-access" checked={accessHitl} onChange={() => setAccessHitl(!accessHitl)} />
            </Flex>
          </Flex>
        </Flex>
      </Card>
      
      <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
        <Heading size="medium" marginBottom="m">Agent Lifecycle Management</Heading>
        <Flex gap={space.m}>
          <Card padding="m" flex={1} style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
            <Heading size="small" marginBottom="s">Automatic Privilege Revocation</Heading>
            <BodyText size="small" marginBottom="m">
              Automatically revoke agent access if unused for 30 days or if anomalous behavior is detected.
            </BodyText>
            <PrimaryButton size="small" onClick={onConfigureRules}>Configure Rules</PrimaryButton>
          </Card>
          <Card padding="m" flex={1} style={{ borderRadius: SANA_CARD_RADIUS_LG, border: `1px solid ${colors.soap300}` }}>
            <Heading size="small" marginBottom="s">AI System User (ASU) Auth</Heading>
            <BodyText size="small" marginBottom="m">
              Manage unique identities for agents to ensure secure authentication and auditing.
            </BodyText>
            <PrimaryButton size="small" onClick={onManageASUs}>Manage ASUs</PrimaryButton>
          </Card>
        </Flex>
      </Card>
    </Flex>
  );
};

const HubView = ({ 
  onRegister, 
  onManage, 
  onSettings,
  onConfigureRules,
  onManageASUs,
  onExport
}: { 
  onRegister: () => void, 
  onManage: (item: any) => void,
  onSettings: () => void,
  onConfigureRules: () => void,
  onManageASUs: () => void,
  onExport: () => void
}) => {
  const [activeTabId, setActiveTabId] = useState('overview');
  const [searchValue, setSearchValue] = useState('');

  const tabs: ProfileTab[] = [
    { id: 'overview', label: 'Overview & Impact' },
    { id: 'inventory', label: 'AI Inventory' },
    { id: 'governance', label: 'Governance & Controls' },
  ];

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'overview':
        return <BusinessImpactTab />;
      case 'inventory':
        return <AIInventoryTab onRegister={onRegister} onManage={onManage} />;
      case 'governance':
        return <GovernanceTab onConfigureRules={onConfigureRules} onManageASUs={onManageASUs} />;
      default:
        return null;
    }
  };

  return (
    <ProfilePageLayout
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      avatar={<Avatar size={Avatar.Size.xl} />}
      name="AI System of Record"
      subtitle="Centralized governance, risk management, and visibility across your AI ecosystem."
      secondaryTitle="AI SoR"
      showSecondaryTitleIcon={true}
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      renderTabContent={renderTabContent}
      headerActions={[
        <SecondaryButton key="export" size="small" onClick={onExport}>Export Report</SecondaryButton>,
        <PrimaryButton key="settings" size="small" onClick={onSettings}>System Settings</PrimaryButton>
      ]}
      footerDisclaimer="Data is mocked for prototype purposes."
    />
  );
};

const RegisterAIView = ({ onBack }: { onBack: () => void }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('AI Feature');
  const [risk, setRisk] = useState('Limited Risk');
  const [owner, setOwner] = useState('');

  return (
    <ProfilePageLayout
      avatar={<Avatar size={Avatar.Size.xl} />}
      name="Register AI Solution"
      subtitle="Add a new AI feature, agent, or platform to the inventory."
      secondaryTitle="AI SoR"
      showSecondaryTitleIcon={true}
      tabs={[{ id: 'form', label: 'Registration Form' }]}
      activeTabId="form"
      onTabChange={() => {}}
      headerActions={[
        <SecondaryButton key="cancel" size="small" onClick={onBack}>Cancel</SecondaryButton>,
        <PrimaryButton key="save" size="small" onClick={onBack}>Save & Register</PrimaryButton>
      ]}
      renderTabContent={() => (
        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG, maxWidth: '800px', margin: '0 auto' }}>
          <Heading size="medium" marginBottom="m">Solution Details</Heading>
          <Flex flexDirection="column" gap={space.m}>
            <FormTextInput
              id="ai-name"
              label="Solution Name"
              value={name}
              onChange={setName}
              placeholder="e.g., Resume Screening Agent"
            />
            <FormSelect
              id="ai-type"
              label="Solution Type"
              value={type}
              onChange={setType}
              options={[
                { value: 'AI Feature', label: 'AI Feature' },
                { value: 'Agent', label: 'Agent' },
                { value: 'Agentic Platform', label: 'Agentic Platform' },
              ]}
            />
            <FormSelect
              id="ai-risk"
              label="Risk Level"
              value={risk}
              onChange={setRisk}
              options={[
                { value: 'Limited Risk', label: 'Limited Risk' },
                { value: 'High-Risk', label: 'High-Risk' },
                { value: 'Unacceptable', label: 'Unacceptable' },
              ]}
            />
            <FormTextInput
              id="ai-owner"
              label="Accountable Officer"
              value={owner}
              onChange={setOwner}
              placeholder="e.g., Sarah Jenkins"
            />
          </Flex>
          <Box marginTop="l">
            <PrimaryButton onClick={onBack}>Submit Registration</PrimaryButton>
          </Box>
        </Card>
      )}
    />
  );
};

const ManageAIModal = ({ item, isOpen, onClose }: { item: any, isOpen: boolean, onClose: () => void }) => {
  const [status, setStatus] = useState(item?.status === 'On');

  // Sync status when item changes
  React.useEffect(() => {
    if (item) setStatus(item.status === 'On');
  }, [item]);

  if (!item) return null;

  return (
    <WorkdayModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage ${item.name}`}
      width="800px"
      primaryActionText="Save Changes"
      onPrimaryAction={onClose}
    >
      <Flex flexDirection="column" gap={space.l}>
        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
          <Heading size="medium" marginBottom="m">Solution Details</Heading>
          <Flex gap={space.xl}>
            <Box>
              <BodyText size="small" color={colors.licorice300}>Type</BodyText>
              <BodyText size="medium" fontWeight="bold">{item.type}</BodyText>
            </Box>
            <Box>
              <BodyText size="small" color={colors.licorice300}>Accountable Officer</BodyText>
              <BodyText size="medium" fontWeight="bold">{item.owner}</BodyText>
            </Box>
            <Box>
              <BodyText size="small" color={colors.licorice300}>Risk Level</BodyText>
              <StatusIndicator 
                type={
                  item.risk === 'Limited Risk' ? StatusIndicator.Type.Green : 
                  item.risk === 'High-Risk' ? StatusIndicator.Type.Orange : StatusIndicator.Type.Red
                }
                emphasis={StatusIndicator.Emphasis.Low}
                label={item.risk} 
              />
            </Box>
          </Flex>
        </Card>
        
        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
          <Heading size="medium" marginBottom="m">Status & Controls</Heading>
          <Flex alignItems="center" justifyContent="space-between" padding="s" style={{ borderBottom: `1px solid ${colors.soap400}` }}>
            <Box>
              <BodyText size="medium" fontWeight="bold">System Status</BodyText>
              <BodyText size="small" color={colors.licorice300}>Enable or disable this AI solution globally.</BodyText>
            </Box>
            <Flex alignItems="center" gap={space.s}>
              <StatusIndicator 
                type={status ? StatusIndicator.Type.Green : StatusIndicator.Type.Gray}
                emphasis={StatusIndicator.Emphasis.Low}
                label={status ? 'On' : 'Off'} 
              />
              <Switch id={`status-toggle-${item.id}`} checked={status} onChange={() => setStatus(!status)} />
            </Flex>
          </Flex>
        </Card>

        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
          <Heading size="medium" marginBottom="m">Flex Credits Consumed</Heading>
          <Heading size="large" color={colors.blueberry400} marginBottom="l">{item.credits?.toLocaleString() || 0}</Heading>
          <Flex 
            height="200px" 
            backgroundColor={colors.soap200} 
            style={{ borderRadius: SANA_CARD_RADIUS_LG }}
            alignItems="center"
            justifyContent="center"
          >
            <BodyText size="medium" color={colors.licorice300}>[ Usage Chart Visualization ]</BodyText>
          </Flex>
        </Card>

        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
          <Heading size="medium" marginBottom="m">Access Logs & Audits</Heading>
          <BodyText size="medium" color={colors.licorice300}>
            No recent anomalies detected. Last audited 2 days ago.
          </BodyText>
        </Card>
      </Flex>
    </WorkdayModal>
  );
};

const ExportModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('Last 30 days');

  return (
    <CandidateTaskModal open={open} onClose={onClose} maxWidth={400}>
      <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
        <Heading size="medium" marginBottom="m">Export Configuration</Heading>
        <Flex flexDirection="column" gap={space.m}>
          <FormSelect
            id="export-format"
            label="Export Format"
            value={format}
            onChange={setFormat}
            options={[
              { value: 'PDF', label: 'PDF Document (.pdf)' },
              { value: 'CSV', label: 'CSV File (.csv)' },
              { value: 'Excel', label: 'Excel Spreadsheet (.xlsx)' },
            ]}
          />
          <FormSelect
            id="export-date-range"
            label="Date Range"
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: 'Last 7 days', label: 'Last 7 days' },
              { value: 'Last 30 days', label: 'Last 30 days' },
              { value: 'All time', label: 'All time' },
            ]}
          />
        </Flex>
        <Flex gap="s" marginTop="l" justifyContent="flex-end">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={onClose}>Download</PrimaryButton>
        </Flex>
      </Card>
    </CandidateTaskModal>
  );
};

const SystemSettingsView = ({ onBack }: { onBack: () => void }) => {
  const [activeTabId, setActiveTabId] = useState('general');
  const [globalEnable, setGlobalEnable] = useState(true);

  const tabs: ProfileTab[] = [
    { id: 'general', label: 'General' },
    { id: 'integrations', label: 'Integrations' },
  ];

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'general':
        return (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
            <Heading size="medium" marginBottom="m">Global Settings</Heading>
            <Flex alignItems="center" justifyContent="space-between" padding="s" style={{ borderBottom: `1px solid ${colors.soap400}` }}>
              <Box>
                <BodyText size="medium" fontWeight="bold">Enable AI SoR Globally</BodyText>
                <BodyText size="small" color={colors.licorice300}>Turn on or off all AI features and agents across the organization.</BodyText>
              </Box>
              <Switch id="global-enable" checked={globalEnable} onChange={() => setGlobalEnable(!globalEnable)} />
            </Flex>
          </Card>
        );
      case 'integrations':
        return (
          <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
            <Heading size="medium" marginBottom="m">System Integrations</Heading>
            <Flex alignItems="center" justifyContent="space-between" padding="s" style={{ borderBottom: `1px solid ${colors.soap400}` }}>
              <Box>
                <BodyText size="medium" fontWeight="bold">Workday HCM</BodyText>
                <BodyText size="small" color={colors.licorice300}>Connected to core HR data.</BodyText>
              </Box>
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Connected" />
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" padding="s">
              <Box>
                <BodyText size="medium" fontWeight="bold">Workday Financials</BodyText>
                <BodyText size="small" color={colors.licorice300}>Connected for cost and billing analytics.</BodyText>
              </Box>
              <StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Connected" />
            </Flex>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ProfilePageLayout
      avatar={<Avatar size={Avatar.Size.xl} />}
      name="System Settings"
      subtitle="Manage global configuration and integrations for AI SoR."
      secondaryTitle="AI SoR"
      showSecondaryTitleIcon={true}
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      renderTabContent={renderTabContent}
      headerActions={[
        <SecondaryButton key="back" size="small" onClick={onBack}>Back to Hub</SecondaryButton>
      ]}
    />
  );
};

const ConfigureRulesView = ({ onBack }: { onBack: () => void }) => {
  return (
    <ProfilePageLayout
      avatar={<Avatar size={Avatar.Size.xl} />}
      name="Privilege Revocation Rules"
      subtitle="Manage rules for automatic privilege revocation."
      secondaryTitle="AI SoR"
      showSecondaryTitleIcon={true}
      tabs={[{ id: 'rules', label: 'Active Rules' }]}
      activeTabId="rules"
      onTabChange={() => {}}
      headerActions={[
        <SecondaryButton key="back" size="small" onClick={onBack}>Back to Hub</SecondaryButton>,
        <PrimaryButton key="create" size="small">Create Rule</PrimaryButton>
      ]}
      renderTabContent={() => (
        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Rule Name</Table.Header>
                <Table.Header>Condition</Table.Header>
                <Table.Header>Action</Table.Header>
                <Table.Header>Status</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell><BodyText size="medium" fontWeight="bold">Inactivity Timeout</BodyText></Table.Cell>
                <Table.Cell>Unused for 30 days</Table.Cell>
                <Table.Cell>Revoke Access</Table.Cell>
                <Table.Cell><StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Active" /></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><BodyText size="medium" fontWeight="bold">High Anomaly Score</BodyText></Table.Cell>
                <Table.Cell>Anomaly score {'>'} 90</Table.Cell>
                <Table.Cell>Suspend Agent</Table.Cell>
                <Table.Cell><StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Active" /></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Card>
      )}
    />
  );
};

const ManageASUsView = ({ onBack }: { onBack: () => void }) => {
  return (
    <ProfilePageLayout
      avatar={<Avatar size={Avatar.Size.xl} />}
      name="AI System Users (ASU)"
      subtitle="Manage service accounts and identities for AI agents."
      secondaryTitle="AI SoR"
      showSecondaryTitleIcon={true}
      tabs={[{ id: 'asus', label: 'System Users' }]}
      activeTabId="asus"
      onTabChange={() => {}}
      headerActions={[
        <SecondaryButton key="back" size="small" onClick={onBack}>Back to Hub</SecondaryButton>,
        <PrimaryButton key="provision" size="small">Provision ASU</PrimaryButton>
      ]}
      renderTabContent={() => (
        <Card padding="l" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Account Name</Table.Header>
                <Table.Header>Assigned Roles</Table.Header>
                <Table.Header>Last Active</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell><BodyText size="medium" fontWeight="bold">Sana_System_User</BodyText></Table.Cell>
                <Table.Cell>Workflow Executor, Data Reader</Table.Cell>
                <Table.Cell>2 mins ago</Table.Cell>
                <Table.Cell><StatusIndicator type={StatusIndicator.Type.Green} emphasis={StatusIndicator.Emphasis.Low} label="Active" /></Table.Cell>
                <Table.Cell><SecondaryButton size="small">Manage</SecondaryButton></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><BodyText size="medium" fontWeight="bold">ChatGPT_Service_Account</BodyText></Table.Cell>
                <Table.Cell>None</Table.Cell>
                <Table.Cell>14 days ago</Table.Cell>
                <Table.Cell><StatusIndicator type={StatusIndicator.Type.Gray} emphasis={StatusIndicator.Emphasis.Low} label="Suspended" /></Table.Cell>
                <Table.Cell><SecondaryButton size="small">Manage</SecondaryButton></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Card>
      )}
    />
  );
};

export default function AISystemOfRecordV97() {
  const [view, setView] = useState<'hub' | 'register' | 'settings' | 'configure-rules' | 'manage-asus'>('hub');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const renderView = () => {
    if (view === 'register') {
      return <RegisterAIView onBack={() => setView('hub')} />;
    }

    if (view === 'settings') {
      return <SystemSettingsView onBack={() => setView('hub')} />;
    }

    if (view === 'configure-rules') {
      return <ConfigureRulesView onBack={() => setView('hub')} />;
    }

    if (view === 'manage-asus') {
      return <ManageASUsView onBack={() => setView('hub')} />;
    }

    return (
      <>
        <HubView 
          onRegister={() => setView('register')} 
          onManage={(item) => setSelectedItem(item)} 
          onSettings={() => setView('settings')}
          onConfigureRules={() => setView('configure-rules')}
          onManageASUs={() => setView('manage-asus')}
          onExport={() => setIsExportModalOpen(true)}
        />
        <ManageAIModal 
          item={selectedItem} 
          isOpen={!!selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      </>
    );
  };

  return (
    <>
      {renderView()}
      <ExportModal open={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </>
  );
}
