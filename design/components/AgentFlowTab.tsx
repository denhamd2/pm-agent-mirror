import React, { useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW, SANA_PAGE_CANVAS } from './sanaShellTheme';

const WF_COLORS = {
  wf1: '#6366f1',
  wf2: '#f59e0b',
  wf3: '#22c55e',
  wf4: '#ec4899',
  orchestrator: '#6366f1',
  rule: '#0ea5e9',
  ruleAlways: '#ef4444',
  subagent: '#15803d',
  skill: '#16a34a',
  mcp: '#a855f7',
};

interface NodeBadgeProps {
  label: string;
  type: 'orchestrator' | 'subagent' | 'rule' | 'rule-always' | 'skill' | 'mcp';
  step?: string;
  stepColor?: string;
  icon?: string;
  onClick?: () => void;
}

const NODE_STYLES: Record<string, React.CSSProperties> = {
  orchestrator: { backgroundColor: WF_COLORS.orchestrator, color: '#fff', borderRadius: '50%', width: 90, height: 90, border: `3px solid #4338ca` },
  subagent: { backgroundColor: WF_COLORS.subagent, color: '#fff', borderRadius: 16, minWidth: 110, height: 75, border: `2px solid #166534` },
  rule: { backgroundColor: WF_COLORS.rule, color: '#fff', borderRadius: 8, minWidth: 96, border: `2px solid #0284c7` },
  'rule-always': { backgroundColor: WF_COLORS.ruleAlways, color: '#fff', borderRadius: 8, minWidth: 96, border: `2px solid #b91c1c` },
  skill: { backgroundColor: '#fff', color: colors.blackPepper600, borderRadius: 20, minWidth: 100, border: `2px solid ${WF_COLORS.skill}`, borderTop: `4px solid ${WF_COLORS.skill}` },
  mcp: { backgroundColor: WF_COLORS.mcp, color: '#fff', borderRadius: 8, width: 72, height: 72, transform: 'rotate(45deg)', border: `2px solid #7c3aed` },
};

const NodeBadge: React.FC<NodeBadgeProps> = ({ label, type, step, stepColor, icon, onClick }) => (
  <Box
    style={{
      ...NODE_STYLES[type],
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 12px',
      fontSize: 11,
      fontWeight: 600,
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '0 1px 3px rgba(11,31,66,0.08)',
    }}
    onClick={onClick}
  >
    {step && (
      <Box style={{
        position: 'absolute', top: -8, left: -8,
        backgroundColor: '#fff', border: `2px solid ${stepColor || 'currentColor'}`, borderRadius: '50%',
        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, color: stepColor,
      }}>
        {step}
      </Box>
    )}
    {icon && <span style={{ fontSize: 22, lineHeight: 1, marginBottom: 2, ...(type === 'mcp' ? { transform: 'rotate(-45deg)' } : {}) }}>{icon}</span>}
    <span style={type === 'mcp' ? { transform: 'rotate(-45deg)', display: 'block', fontSize: 10 } : {}}>{label}</span>
  </Box>
);

const Arrow: React.FC<{ sequential?: boolean }> = ({ sequential }) => (
  <span style={{ fontSize: 18, color: sequential ? '#ef4444' : colors.blackPepper600, opacity: 0.7, fontWeight: 700, margin: '0 6px' }}>&rarr;</span>
);

interface DetailPanelProps {
  node: typeof NODE_DATA[string] | null;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ node, onClose }) => {
  if (!node) return null;
  const typeColor: Record<string, string> = {
    orchestrator: WF_COLORS.orchestrator, rule: WF_COLORS.rule, 'rule-always': WF_COLORS.ruleAlways,
    subagent: WF_COLORS.subagent, skill: WF_COLORS.skill, mcp: WF_COLORS.mcp,
  };
  const c = typeColor[node.type] || colors.licorice300;

  return (
    <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, boxShadow: SANA_CARD_SHADOW, width: 360, flexShrink: 0, position: 'sticky', top: 0, maxHeight: '80vh', overflowY: 'auto' }}>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="s">
        <Box style={{ padding: '2px 10px', borderRadius: 10, fontSize: 10, fontWeight: 600, backgroundColor: `${c}20`, color: c }}>{node.type}</Box>
        <TertiaryButton size="small" onClick={onClose}>&times;</TertiaryButton>
      </Flex>
      <Heading size="small">{node.label}</Heading>
      {node.pattern && <BodyText size="small" color={colors.licorice300} style={{ fontStyle: 'italic' }}>{node.pattern}</BodyText>}
      <BodyText size="small" marginTop="s" style={{ lineHeight: 1.5 }}>{node.summary}</BodyText>
      {node.whenUsed && (
        <Box marginTop="s">
          <BodyText size="small" fontWeight="bold" color={colors.licorice400}>When It Runs</BodyText>
          <BodyText size="small">{node.whenUsed}</BodyText>
        </Box>
      )}
      {node.inputs && node.inputs.length > 0 && (
        <Box marginTop="s">
          <BodyText size="small" fontWeight="bold" color={colors.licorice400}>Inputs</BodyText>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>{node.inputs.map((i: string, idx: number) => <li key={idx}>{i}</li>)}</ul>
        </Box>
      )}
      {node.outputs && node.outputs.length > 0 && (
        <Box marginTop="s">
          <BodyText size="small" fontWeight="bold" color={colors.licorice400}>Outputs</BodyText>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>{node.outputs.map((o: string, idx: number) => <li key={idx}>{o}</li>)}</ul>
        </Box>
      )}
      {node.mcps && node.mcps.length > 0 && (
        <Box marginTop="s">
          <BodyText size="small" fontWeight="bold" color={colors.licorice400}>MCPs Used</BodyText>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>{node.mcps.map((m: string, idx: number) => <li key={idx}>{m}</li>)}</ul>
        </Box>
      )}
    </Card>
  );
};

const NODE_DATA: Record<string, any> = {
  '000': { label: '000 Master Orchestrator', type: 'orchestrator', summary: 'Central routing hub for all PM workflows. Reads MISSION_LOG.md, detects user intent, routes to the correct specialist agent.', whenUsed: 'Every conversation turn. AlwaysApply rule.', inputs: ['User messages', 'MISSION_LOG.md state'], outputs: ['MISSION_LOG.md updates', 'TodoWrite task lists', 'Agent invocations'], mcps: [], pattern: 'AlwaysApply orchestrator (427 lines)' },
  'sa-strategy': { label: 'Product Strategy', type: 'subagent', summary: 'Principal Product Strategist performing PESTEL, SWOT, and strategy context extraction with deep web research.', whenUsed: 'E2E Steps 1-3 (sequential).', inputs: ['strategy/pdfs/*.pdf', 'Web research'], outputs: ['strategy-context.md', 'pestel-analysis.md', 'swot-analysis.md'], mcps: [], pattern: 'Heavy-logic subagent (452 lines)' },
  'sa-ci': { label: 'Competitive Intelligence', type: 'subagent', summary: 'Deep research on global and regional ATS competitors. Produces gap analysis, battle cards, competitive matrices.', whenUsed: 'E2E Step 4 (parallel).', inputs: ['Web research', 'Deployment Agent'], outputs: ['Competitive scan report', 'Updated matrix'], mcps: ['Deployment Agent'], pattern: 'Heavy-logic subagent (331 lines)' },
  'sa-pmf': { label: 'PMF Analyst', type: 'subagent', summary: 'Braun & Clarke 6-phase thematic analysis. Synthesises all research inputs into a comprehensive PMF report with RICE-scored roadmap.', whenUsed: 'E2E Step 9.', inputs: ['105 findings', '106 brainstorm', '108 gaps', 'Strategy', 'Competitive scan'], outputs: ['PMF-Analysis.md with themes, triangulation, RICE'], mcps: [], pattern: 'Heavy-logic subagent (341 lines)' },
  'sa-ux-researcher': { label: 'UX Researcher', type: 'subagent', summary: 'Thin wrapper for standalone UX research invocation. Delegates to 105.', whenUsed: 'Standalone invocation.', inputs: [], outputs: [], mcps: [], pattern: 'Thin wrapper (75 lines)' },
  'sa-ux-designer': { label: 'UX Designer', type: 'subagent', summary: 'Thin wrapper for standalone design invocation. Delegates to 315.', whenUsed: 'Standalone invocation.', inputs: [], outputs: [], mcps: [], pattern: 'Thin wrapper (75 lines)' },
  'sa-doc-writer': { label: 'Doc Writer', type: 'subagent', summary: 'Thin wrapper for standalone copy review. Delegates to 319.', whenUsed: 'Standalone invocation.', inputs: [], outputs: [], mcps: [], pattern: 'Thin wrapper (50 lines)' },
  '105': { label: '105 User Research', type: 'rule', summary: 'Teresa Torres Continuous Discovery. Analyses interview transcripts with thematic coding.', whenUsed: 'E2E Steps 7-8 (parallel).', inputs: ['SME transcripts', 'Customer transcripts'], outputs: ['105-sme-research-findings.md', '105-user-research-findings.md'], mcps: [], pattern: 'Glob rule (709 lines)' },
  '106': { label: '106 Ideation Hub', type: 'rule', summary: 'Customer Ideation Hub analyser. Two-pass protocol validating 105 themes against P&T Idea Results.', whenUsed: 'E2E Step 5 (sequential, after 105).', inputs: ['105 findings', 'P&T Idea Results Dashboard'], outputs: ['brainstorm-analysis.md'], mcps: [], pattern: 'Glob rule. Sequential dependency on 105.' },
  '108': { label: '108 Gap Analyser', type: 'rule', summary: 'Presales product gap analysis from Tableau exports with severity scoring.', whenUsed: 'E2E Step 6 (parallel, if data exists).', inputs: ['gap-data/*.csv, *.xlsx'], outputs: ['gap-analysis.md'], mcps: ['Tableau'], pattern: 'Glob rule (596 lines). Optional.' },
  '130': { label: '130 PMF Slide Gen', type: 'rule', summary: 'Full PMF roadmap PowerPoint generator. 36-49 slide VP-facing decks.', whenUsed: 'E2E Step 10.', inputs: ['PMF report', 'PESTEL/SWOT'], outputs: ['PMF_Roadmap_vN.pptx'], mcps: ['Slide Deck', 'Lightdash (optional)'], pattern: 'Glob rule (413 lines). Uses /slide-writer skill.' },
  '200': { label: '200 PRD Writer', type: 'rule', summary: 'Product requirements document writer using Workday standards.', whenUsed: 'E2E Step 14.', inputs: ['PMF recommendations', 'PM framing'], outputs: ['docs/prds/*.md'], mcps: ['Lightdash (optional)'], pattern: 'Glob rule (435 lines). Invokes /write-prd skill.' },
  '060': { label: '060 Legal Review', type: 'rule-always', summary: 'GDPR, EU AI Act, and global data privacy advisor.', whenUsed: 'Steps 15, 20, 23. Auto-invoked.', inputs: ['PRD', 'Prototypes', 'UX copy'], outputs: ['Compliance findings'], mcps: [], pattern: 'Quality gate (371 lines)' },
  '080': { label: '080 Red Team', type: 'rule-always', summary: 'Cross-functional risk analysis and stress testing.', whenUsed: 'Steps 17 and 28.', inputs: ['PRDs', 'Story maps'], outputs: ['Red team review document'], mcps: [], pattern: 'Quality gate (461 lines)' },
  '315': { label: '315 Design Brief', type: 'rule', summary: 'Multi-pass Design Brief creation. Grounds features in Workday context.', whenUsed: 'E2E Step 18.', inputs: ['PRD', 'Functional knowledge'], outputs: ['design-brief.md'], mcps: ['Deployment Agent', 'Canvas Kit', 'Six Hats', 'Peanut (optional)'], pattern: 'Glob rule (355 lines). Multi-pass.' },
  '318': { label: '318 Peer Review', type: 'rule', summary: 'Unbiased design peer review. APPROVED or NEEDS REVISION verdict.', whenUsed: 'E2E Step 20.', inputs: ['Design Brief'], outputs: ['Final Verdict'], mcps: [], pattern: 'Glob rule (223 lines). Binary gate.' },
  '319': { label: '319 Copy Review', type: 'rule', summary: 'UX copy review against Editorial Guidelines.', whenUsed: 'E2E Steps 19 and 23.', inputs: ['Design Brief', 'Prototype copy'], outputs: ['Approved copy'], mcps: [], pattern: 'Glob rule (327 lines).' },
  '320': { label: '320 Prototype Dev', type: 'rule', summary: 'Canvas Kit React prototype implementation from approved Design Brief.', whenUsed: 'E2E Step 21.', inputs: ['Approved Design Brief', 'PRD'], outputs: ['design/*-vNN.tsx'], mcps: ['Canvas Kit'], pattern: 'Glob rule (443 lines).' },
  '321': { label: '321 Visual Review', type: 'rule', summary: 'Prototype visual quality review using the browser.', whenUsed: 'E2E Step 22.', inputs: ['Running prototype'], outputs: ['Visual review findings'], mcps: ['Browser'], pattern: 'Glob rule (352 lines).' },
  '330': { label: '330 Figma', type: 'rule', summary: 'Figma design extraction, analysis, and capture.', whenUsed: 'E2E Step 24.', inputs: ['Prototype URL', 'Figma URLs'], outputs: ['Figma capture'], mcps: ['Figma'], pattern: 'Glob rule (683 lines).' },
  '410': { label: '410 Epic Definition', type: 'rule', summary: 'Writes epic drafts in user story format.', whenUsed: 'E2E Step 25.', inputs: ['PRD', 'Design Brief'], outputs: ['docs/epics/*.md'], mcps: [], pattern: 'Glob rule (318 lines).' },
  '420': { label: '420 Story Mapping', type: 'rule', summary: 'Jeff Patton story mapping with value slices and HITL approval.', whenUsed: 'E2E Step 26.', inputs: ['Epic draft', 'PRD'], outputs: ['Story map'], mcps: [], pattern: 'Glob rule (536 lines).' },
  '430': { label: '430 Jira Stories', type: 'rule', summary: 'Writes user stories with BDD scenarios and creates them in Jira.', whenUsed: 'E2E Step 29.', inputs: ['Approved story map'], outputs: ['Jira epic + stories'], mcps: ['Jira/GHE'], pattern: 'Glob rule (630 lines).' },
  '435': { label: '435 Story Validator', type: 'rule', summary: 'Optional post-creation quality gate for Jira stories.', whenUsed: 'Optional after Step 29.', inputs: ['Created Jira stories'], outputs: ['Validation report'], mcps: ['Jira/GHE'], pattern: 'Glob rule (555 lines). Optional.' },
  '090': { label: '090 Improvement Advisor', type: 'rule', summary: 'Strategic meta-agent that audits and optimises the workspace.', whenUsed: 'On demand.', inputs: ['All rules', 'MCP descriptors'], outputs: ['Recommendations', 'Scorecard'], mcps: [], pattern: 'Standalone advisor (366 lines).' },
  '100': { label: '100 Market Intelligence', type: 'rule', summary: 'Research analysis and synthesis specialist.', whenUsed: 'When research files are dropped.', inputs: ['Research files'], outputs: ['Intelligence summaries'], mcps: ['Peanut (optional)'], pattern: 'Standalone advisor (233 lines).' },
  '500': { label: '500 Slack Responder', type: 'rule', summary: 'Communication triage and response drafting.', whenUsed: 'When Slack messages are shared.', inputs: ['Slack messages'], outputs: ['Draft responses'], mcps: ['Slack'], pattern: 'Standalone advisor (357 lines).' },
};

const LANE_STYLES: Record<string, React.CSSProperties> = {
  wf1: { borderLeft: `4px solid ${WF_COLORS.wf1}`, background: '#f0f0ff' },
  wf2: { borderLeft: `4px solid ${WF_COLORS.wf2}`, background: '#fef3c7' },
  wf3: { borderLeft: `4px solid ${WF_COLORS.wf3}`, background: '#ecfdf5' },
  wf4: { borderLeft: `4px solid ${WF_COLORS.wf4}`, background: '#fce7f3' },
};

interface WorkflowLaneProps {
  id: string;
  title: string;
  steps: string;
  description: string;
  color: string;
  children: React.ReactNode;
  note?: string;
}

const WorkflowLane: React.FC<WorkflowLaneProps> = ({ id, title, steps, description, color, children, note }) => (
  <Card padding="m" marginBottom="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, ...LANE_STYLES[id] }}>
    <Flex alignItems="center" gap="xs" marginBottom="xxs">
      <Box style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
      <Heading size="small">{title}</Heading>
      <BodyText size="small" color={colors.licorice300}>({steps})</BodyText>
    </Flex>
    <BodyText size="small" color={colors.licorice300} style={{ fontStyle: 'italic' }} marginBottom="s">{description}</BodyText>
    <Flex alignItems="center" gap="xs" flexWrap="wrap">
      {children}
    </Flex>
    {note && <BodyText size="small" color={colors.licorice300} marginTop="s">{note}</BodyText>}
  </Card>
);

type FilterType = 'all' | 'workflow' | 'skills-mcps';

export const AgentFlowTab: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleNodeClick = (id: string) => {
    setSelectedNode(selectedNode === id ? null : id);
  };

  const showWorkflows = filter === 'all' || filter === 'workflow';
  const showSkillsMcps = filter === 'all' || filter === 'skills-mcps';

  return (
    <Box>
      <Heading size="medium" marginBottom="xs">Agent Flow Architecture</Heading>
      <BodyText size="small" color={colors.licorice300} marginBottom="m">
        Interactive workflow diagram - select any node to see its details, inputs, outputs, and connections.
      </BodyText>

      <Flex gap="xs" marginBottom="m">
        {(['all', 'workflow', 'skills-mcps'] as FilterType[]).map(f => (
          <SecondaryButton
            key={f}
            size="small"
            onClick={() => setFilter(f)}
            style={filter === f ? { backgroundColor: colors.blackPepper600, color: '#fff' } : {}}
          >
            {f === 'all' ? 'All' : f === 'workflow' ? 'Workflows Only' : 'Skills & MCPs'}
          </SecondaryButton>
        ))}
      </Flex>

      <Flex gap="m" alignItems="flex-start">
        <Box style={{ flex: 1, minWidth: 0 }}>
          {/* Orchestrator */}
          {showWorkflows && (
            <Box marginBottom="l" style={{ textAlign: 'center' }}>
              <BodyText size="small" fontWeight="bold" color={colors.licorice300} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} marginBottom="s">
                Orchestrator Agent
              </BodyText>
              <NodeBadge label="000&#10;Orchestrator" type="orchestrator" onClick={() => handleNodeClick('000')} />
              <BodyText size="small" color={colors.licorice300} marginTop="xs">Routes to all agents - alwaysApply</BodyText>
            </Box>
          )}

          {/* Subagents row */}
          {showWorkflows && (
            <Box marginBottom="l">
              <BodyText size="small" fontWeight="bold" color={colors.licorice300} style={{ textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }} marginBottom="s">
                Sub-Agents
              </BodyText>
              <Flex justifyContent="center" gap="s" flexWrap="wrap">
                {[
                  { id: 'sa-strategy', label: 'Product\nStrategy', icon: '🎯' },
                  { id: 'sa-ci', label: 'Competitive\nIntelligence', icon: '🔍' },
                  { id: 'sa-pmf', label: 'PMF\nAnalyst', icon: '🔬' },
                  { id: 'sa-ux-researcher', label: 'UX\nResearcher', icon: '🔎' },
                  { id: 'sa-ux-designer', label: 'UX\nDesigner', icon: '🎨' },
                  { id: 'sa-doc-writer', label: 'Doc\nWriter', icon: '✎' },
                ].map(sa => (
                  <NodeBadge key={sa.id} label={sa.label} type="subagent" icon={sa.icon} onClick={() => handleNodeClick(sa.id)} />
                ))}
              </Flex>
            </Box>
          )}

          {/* Divider */}
          {showWorkflows && <Box style={{ borderTop: `2px solid ${colors.soap300}`, margin: '24px 0' }} />}

          {/* WF1 */}
          {showWorkflows && (
            <WorkflowLane id="wf1" title="WF1: PMF Research & Deck" steps="Steps 1-10" description="Analyse a regional market and produce a PMF roadmap deck" color={WF_COLORS.wf1} note="Sequential: 106 runs after 105 completes (needs theme inputs). Red arrow = sequential dependency.">
              <NodeBadge label="Product&#10;Strategy" type="subagent" step="1-3" stepColor={WF_COLORS.wf1} icon="🎯" onClick={() => handleNodeClick('sa-strategy')} />
              <Arrow />
              <NodeBadge label="Competitive&#10;Intelligence" type="subagent" step="4" stepColor={WF_COLORS.wf1} icon="🔍" onClick={() => handleNodeClick('sa-ci')} />
              <Arrow />
              <Flex flexDirection="column" gap="xxs" alignItems="center">
                <Flex gap="xs" alignItems="center">
                  <NodeBadge label="105 User Research" type="rule" step="7-8" stepColor={WF_COLORS.wf1} onClick={() => handleNodeClick('105')} />
                  <NodeBadge label="UX&#10;Researcher" type="subagent" icon="🔎" onClick={() => handleNodeClick('sa-ux-researcher')} />
                </Flex>
                <NodeBadge label="108 Gap Analyser" type="rule" step="6" stepColor={WF_COLORS.wf1} onClick={() => handleNodeClick('108')} />
              </Flex>
              <Arrow sequential />
              <NodeBadge label="106 Ideation Hub" type="rule" step="5" stepColor={WF_COLORS.wf1} onClick={() => handleNodeClick('106')} />
              <Arrow />
              <NodeBadge label="PMF&#10;Analyst" type="subagent" step="9" stepColor={WF_COLORS.wf1} icon="🔬" onClick={() => handleNodeClick('sa-pmf')} />
              <Arrow />
              <NodeBadge label="130 PMF Slide Gen" type="rule" step="10" stepColor={WF_COLORS.wf1} onClick={() => handleNodeClick('130')} />
            </WorkflowLane>
          )}

          {/* WF2 */}
          {showWorkflows && (
            <WorkflowLane id="wf2" title="WF2: PRD Writing" steps="Steps 13-17" description="Write a product requirements document with legal and risk review" color={WF_COLORS.wf2}>
              <NodeBadge label="200 PRD Writer" type="rule" step="14" stepColor={WF_COLORS.wf2} onClick={() => handleNodeClick('200')} />
              <Arrow />
              <NodeBadge label="060 Legal Review" type="rule-always" step="15" stepColor={WF_COLORS.wf2} onClick={() => handleNodeClick('060')} />
              <Arrow />
              <NodeBadge label="080 Red Team" type="rule-always" step="17" stepColor={WF_COLORS.wf2} onClick={() => handleNodeClick('080')} />
            </WorkflowLane>
          )}

          {/* WF3 */}
          {showWorkflows && (
            <WorkflowLane id="wf3" title="WF3: Design & Prototype" steps="Steps 18-24" description="Design, prototype, and capture a feature in Canvas Kit and Figma" color={WF_COLORS.wf3}>
              <Flex gap="xxs" alignItems="center">
                <NodeBadge label="315 Design Brief" type="rule" step="18" stepColor={WF_COLORS.wf3} onClick={() => handleNodeClick('315')} />
                <NodeBadge label="UX&#10;Designer" type="subagent" icon="🎨" onClick={() => handleNodeClick('sa-ux-designer')} />
              </Flex>
              <Arrow />
              <Flex gap="xxs" alignItems="center">
                <NodeBadge label="319 Copy Review" type="rule" step="19" stepColor={WF_COLORS.wf3} onClick={() => handleNodeClick('319')} />
                <NodeBadge label="Doc&#10;Writer" type="subagent" icon="✎" onClick={() => handleNodeClick('sa-doc-writer')} />
              </Flex>
              <Arrow />
              <NodeBadge label="318 Peer Review" type="rule" step="20" stepColor={WF_COLORS.wf3} onClick={() => handleNodeClick('318')} />
              <Arrow />
              <NodeBadge label="320 Prototype Dev" type="rule" step="21" stepColor={WF_COLORS.wf3} onClick={() => handleNodeClick('320')} />
              <Arrow />
              <NodeBadge label="321 Visual Review" type="rule" step="22" stepColor={WF_COLORS.wf3} onClick={() => handleNodeClick('321')} />
              <Arrow />
              <NodeBadge label="330 Figma" type="rule" step="24" stepColor={WF_COLORS.wf3} onClick={() => handleNodeClick('330')} />
            </WorkflowLane>
          )}

          {/* WF4 */}
          {showWorkflows && (
            <WorkflowLane id="wf4" title="WF4: Backlog Refinement" steps="Steps 25-29" description="Break down requirements into an epic, story map, and Jira stories" color={WF_COLORS.wf4} note="Orchestrator: 400 Backlog Refinement chains 410 → 420 → 080 Red Team → 430">
              <NodeBadge label="410 Epic Definition" type="rule" step="25" stepColor={WF_COLORS.wf4} onClick={() => handleNodeClick('410')} />
              <Arrow />
              <NodeBadge label="420 Story Mapping" type="rule" step="26" stepColor={WF_COLORS.wf4} onClick={() => handleNodeClick('420')} />
              <Arrow />
              <NodeBadge label="080 Red Team" type="rule-always" step="28" stepColor={WF_COLORS.wf4} onClick={() => handleNodeClick('080')} />
              <Arrow />
              <NodeBadge label="430 Jira Stories" type="rule" step="29" stepColor={WF_COLORS.wf4} onClick={() => handleNodeClick('430')} />
              <span style={{ fontSize: 18, opacity: 0.2, fontWeight: 700, margin: '0 6px' }}>&rarr;</span>
              <NodeBadge label="435 Story Validator" type="rule" step="opt" stepColor={colors.licorice300} onClick={() => handleNodeClick('435')} />
            </WorkflowLane>
          )}

          {/* Divider */}
          {showWorkflows && <Box style={{ borderTop: `2px solid ${colors.soap300}`, margin: '24px 0' }} />}

          {/* Standalone Rules */}
          {showWorkflows && (
            <Card padding="m" marginBottom="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, backgroundColor: 'rgba(0,117,180,0.03)' }}>
              <BodyText size="small" fontWeight="bold" color={colors.licorice400} style={{ textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }} marginBottom="s">
                Standalone Rules (Advisors)
              </BodyText>
              <Flex justifyContent="center" gap="s" flexWrap="wrap">
                <NodeBadge label="090&#10;Improvement Advisor" type="rule" onClick={() => handleNodeClick('090')} />
                <NodeBadge label="100&#10;Market Intelligence" type="rule" onClick={() => handleNodeClick('100')} />
                <NodeBadge label="500&#10;Slack Responder" type="rule" onClick={() => handleNodeClick('500')} />
              </Flex>
            </Card>
          )}

          {showSkillsMcps && (
            <>
              <Box style={{ borderTop: `2px solid ${colors.soap300}`, margin: '24px 0' }} />

              {/* Skills */}
              <Card padding="m" marginBottom="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, backgroundColor: 'rgba(34,197,94,0.03)' }}>
                <BodyText size="small" fontWeight="bold" color={colors.licorice400} style={{ textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }} marginBottom="s">
                  Skills (Reusable Methods)
                </BodyText>
                <Flex justifyContent="center" gap="s" flexWrap="wrap">
                  {['/write-prd', '/slide-writer', '/editorial', '/jtbd', '/value-metrics', '/workspace-audit'].map(sk => (
                    <NodeBadge key={sk} label={sk} type="skill" />
                  ))}
                </Flex>
              </Card>

              {/* MCPs */}
              <Card padding="m" style={{ borderRadius: SANA_CARD_RADIUS_LG, backgroundColor: 'rgba(168,85,247,0.03)' }}>
                <BodyText size="small" fontWeight="bold" color={colors.licorice400} style={{ textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }} marginBottom="s">
                  MCPs (Integration Layer)
                </BodyText>
                <Flex justifyContent="center" gap="s" flexWrap="wrap">
                  {['Figma', 'Slack', 'Jira/GHE', 'Confluence', 'Deploy\nAgent', 'Canvas\nKit', 'Slide\nDeck', 'Tableau', 'Seq.\nThinking', 'Six\nHats', 'Lightdash', 'Peanut', 'Browser'].map(mcp => (
                    <NodeBadge key={mcp} label={mcp} type="mcp" />
                  ))}
                </Flex>
              </Card>
            </>
          )}

          {/* Legend */}
          <Card padding="m" marginTop="m" style={{ borderRadius: SANA_CARD_RADIUS_LG }}>
            <BodyText size="small" fontWeight="bold" marginBottom="xs">Legend</BodyText>
            <Flex gap="m" flexWrap="wrap">
              {[
                { color: WF_COLORS.orchestrator, label: 'Orchestrator (000)', shape: 'circle' },
                { color: WF_COLORS.rule, label: 'Rules (glob-scoped)', shape: 'rect' },
                { color: WF_COLORS.ruleAlways, label: 'Rules (alwaysApply)', shape: 'rect' },
                { color: WF_COLORS.subagent, label: 'Subagents', shape: 'circle' },
                { color: WF_COLORS.skill, label: 'Skills', shape: 'outline' },
                { color: WF_COLORS.mcp, label: 'MCPs', shape: 'diamond' },
              ].map(l => (
                <Flex key={l.label} alignItems="center" gap="xxs">
                  <Box style={{
                    width: 14, height: 14,
                    backgroundColor: l.shape === 'outline' ? '#fff' : l.color,
                    border: l.shape === 'outline' ? `2px solid ${l.color}` : 'none',
                    borderRadius: l.shape === 'circle' ? '50%' : l.shape === 'diamond' ? 2 : 3,
                    transform: l.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                  }} />
                  <BodyText size="small">{l.label}</BodyText>
                </Flex>
              ))}
            </Flex>
          </Card>
        </Box>

        {/* Detail panel */}
        {selectedNode && NODE_DATA[selectedNode] && (
          <DetailPanel node={NODE_DATA[selectedNode]} onClose={() => setSelectedNode(null)} />
        )}
      </Flex>
    </Box>
  );
};
