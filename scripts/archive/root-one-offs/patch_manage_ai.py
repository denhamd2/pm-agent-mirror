import re

with open('design/ai-system-of-record-v97.tsx', 'r') as f:
    content = f.read()

# 1. Add WorkdayModal import
if 'WorkdayModal' not in content:
    content = content.replace(
        "import { CandidateTaskModal } from './components/CandidateTaskModal';",
        "import { CandidateTaskModal } from './components/CandidateTaskModal';\nimport { WorkdayModal } from './components/WorkdayModal';"
    )

# 2. Replace ManageAIView with ManageAIModal
manage_ai_view_pattern = re.compile(r'const ManageAIView = .*?return \(\n    <ProfilePageLayout.*?\);\n};\n', re.DOTALL)

manage_ai_modal_code = """const ManageAIModal = ({ item, isOpen, onClose }: { item: any, isOpen: boolean, onClose: () => void }) => {
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
"""

content = manage_ai_view_pattern.sub(manage_ai_modal_code, content)

# 3. Update AISystemOfRecordV97
main_component_pattern = re.compile(r"export default function AISystemOfRecordV97\(\) \{.*?\n\}", re.DOTALL)

main_component_code = """export default function AISystemOfRecordV97() {
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
}"""

content = main_component_pattern.sub(main_component_code, content)

with open('design/ai-system-of-record-v97.tsx', 'w') as f:
    f.write(content)

print("Patched successfully")
