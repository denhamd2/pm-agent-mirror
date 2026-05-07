with open('design/pm-agent-dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add imports
if 'import rawPrototypesHtml' not in content:
    content = content.replace(
        "import savedPrototypesData from '../docs/saved-prototypes.json';",
        "import savedPrototypesData from '../docs/saved-prototypes.json';\nimport rawPrototypesHtml from '../docs/pm-agent-prototypes.html?raw';\nimport { Table } from '@workday/canvas-kit-react/table';\nimport { IconButton } from '@workday/canvas-kit-react/button';\nimport { starIcon, starHalfIcon } from '@workday/canvas-system-icons-web';\nimport { SystemIcon } from '@workday/canvas-kit-react/icon';"
    )

# 2. Add parsing logic
old_parse_logic = """  // Parse morning data
  const actionItems = morningData.jiraResponses || [];
  const customerIssues = morningData.customerIssues || [];
  const competitorNews = morningData.competitorNews || [];
  
  // Parse prototypes data
  const savedPrototypes = savedPrototypesData.saved || [];"""

new_parse_logic = """  // Parse morning data
  const actionItems = morningData.jiraResponses || [];
  const customerIssues = morningData.customerIssues || [];
  const competitorNews = morningData.competitorNews || [];
  
  // Parse prototypes data
  const [savedPrototypes, setSavedPrototypes] = useState<string[]>(
    (savedPrototypesData.saved || []).map((p: any) => p.slug)
  );

  const allPrototypes = React.useMemo(() => {
    const match = rawPrototypesHtml.match(/<script id="prototypes-data" type="application\\/json">([\\s\\S]*?)<\\/script>/);
    return match ? JSON.parse(match[1]).prototypes : [];
  }, []);

  const toggleSave = async (slug: string, proto: any) => {
    const isSaved = savedPrototypes.includes(slug);
    const newSaved = !isSaved;
    
    // Optimistic update
    if (newSaved) {
      setSavedPrototypes([...savedPrototypes, slug]);
    } else {
      setSavedPrototypes(savedPrototypes.filter(s => s !== slug));
    }

    const files = [`design/${slug}.tsx`];
    if (proto.prd) files.push(proto.prd);
    if (proto.brief) files.push(proto.brief);
    if (proto.deck) files.push(proto.deck);

    try {
      await fetch('http://localhost:8765/api/save-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, files, saved: newSaved })
      });
    } catch (err) {
      console.error('Save failed:', err);
      // Revert on failure
      if (newSaved) {
        setSavedPrototypes(savedPrototypes.filter(s => s !== slug));
      } else {
        setSavedPrototypes([...savedPrototypes, slug]);
      }
    }
  };"""

content = content.replace(old_parse_logic, new_parse_logic)

# 3. Add Design System tab
if "setActiveTab('design-system')" not in content:
    content = content.replace(
        "Saved Prototypes\n          </SecondaryButton>",
        "Saved Prototypes\n          </SecondaryButton>\n          <SecondaryButton \n            onClick={() => setActiveTab('design-system')}\n            style={activeTab === 'design-system' ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : undefined}\n          >\n            Design System\n          </SecondaryButton>"
    )

# 4. Replace Prototypes panel content
import re
prototypes_panel_old = r"\{activeTab === 'prototypes' && \(\n            <Box>\n              <Heading size=\"medium\" marginBottom=\"m\">Saved Prototypes</Heading>.*?\n            </Box>\n          \)\}"
prototypes_panel_new = """{activeTab === 'prototypes' && (
            <Box>
              <Heading size="medium" marginBottom="m">Prototypes Directory</Heading>
              {allPrototypes.length === 0 ? (
                <BodyText size="small" color={colors.licorice300}>No prototypes found.</BodyText>
              ) : (
                <Card padding="zero" style={{ borderRadius: SANA_CARD_RADIUS_LG, overflow: 'hidden' }}>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Prototype</Table.Header>
                        <Table.Header>Description</Table.Header>
                        <Table.Header>Links</Table.Header>
                        <Table.Header>Save</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {allPrototypes.map((proto: any) => {
                        const isSaved = savedPrototypes.includes(proto.slug);
                        return (
                          <Table.Row key={proto.slug} style={isSaved ? { backgroundColor: colors.soap100 } : {}}>
                            <Table.Cell>
                              <BodyText size="medium" fontWeight="bold" color={colors.blackPepper600}>
                                {proto.name}
                              </BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <BodyText size="small" color={colors.blackPepper500}>
                                {proto.description}
                              </BodyText>
                            </Table.Cell>
                            <Table.Cell>
                              <Flex gap="s" flexWrap="wrap">
                                <SecondaryButton size="small" as="a" href={`/${proto.slug}`} target="_blank">
                                  Open
                                </SecondaryButton>
                                {proto.prd && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/docs/pm-agent-viewer.html?file=${proto.prd}`} target="_blank">
                                    PRD
                                  </SecondaryButton>
                                )}
                                {proto.brief && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/docs/pm-agent-viewer.html?file=${proto.brief}`} target="_blank">
                                    Brief
                                  </SecondaryButton>
                                )}
                                {proto.deck && (
                                  <SecondaryButton size="small" as="a" href={`http://localhost:8765/${proto.deck}`} target="_blank">
                                    Deck
                                  </SecondaryButton>
                                )}
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <IconButton
                                size="small"
                                variant={isSaved ? 'primary' : 'squareFilled'}
                                icon={isSaved ? starIcon : starHalfIcon}
                                aria-label={isSaved ? "Unsave prototype" : "Save prototype"}
                                onClick={() => toggleSave(proto.slug, proto)}
                                style={isSaved ? { backgroundColor: colors.blueberry400, color: colors.frenchVanilla100 } : {}}
                              />
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </Card>
              )}
            </Box>
          )}

          {activeTab === 'design-system' && (
            <Box>
              <Heading size="medium" marginBottom="m">Design System Components</Heading>
              <Card padding="zero" style={{ borderRadius: SANA_CARD_RADIUS_LG, overflow: 'hidden', height: '800px' }}>
                <iframe 
                  src="http://localhost:8765/docs/pm-agent-design-system.html" 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Design System"
                />
              </Card>
            </Box>
          )}"""

content = re.sub(prototypes_panel_old, prototypes_panel_new.replace('\\', '\\\\'), content, flags=re.DOTALL)

with open('design/pm-agent-dashboard.tsx', 'w') as f:
    f.write(content.replace('\\\\', '\\'))

print("Patched successfully")
