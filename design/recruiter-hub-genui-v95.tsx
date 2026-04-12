import React, { useState, useRef, useEffect } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Banner } from '@workday/canvas-kit-react/banner';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_COMM_BUBBLE_BG,
  SANA_COMM_MESSAGE_RADIUS_PX,
  SANA_COMM_PANEL_SURFACE,
  SanaCommMessageBubble,
  SanaCommComposer,
  A2UIRenderer,
  type A2UINode,
} from './components';
import { homeIcon, userIcon, homeBuildingIcon, linkIcon, dotIcon } from '@workday/canvas-system-icons-web';

type Message = {
  id: string;
  sender: 'assistant' | 'user';
  text?: string;
  a2uiNode?: A2UINode;
};

const PRIMARY_RAIL = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'Home' },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'Recruit' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'Org' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'Links' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'More' },
];

const TABS = [
  { id: 'hub', label: 'Recruiter Hub' },
  { id: 'cat-dynamic', label: 'Dynamic Pages', isCategory: true },
  { id: 'dp-metrics', label: 'Recruiter Metrics' },
  { id: 'dp-reqs', label: 'Active Job Reqs' },
  { id: 'dp-fetch', label: 'Recommended Candidates (Fetch)' },
  { id: 'dp-spotlight', label: 'Urgent Req Spotlight' },
  { id: 'dp-dynamic-fetch', label: 'Silver Medalists (Dynamic Fetch)' },
  { id: 'dp-diversity', label: 'D&I Pipeline' },
  { id: 'dp-bottlenecks', label: 'HM Bottlenecks' },
  { id: 'dp-interviews', label: 'Upcoming Interviews' },
  { id: 'dp-offers', label: 'Offers Pending' },
  { id: 'dp-sourcing', label: 'Sourcing Health' },
];

const initialPinnedState: Record<string, A2UINode[]> = {
  'dp-metrics': [
    {
      id: 'insight-row-1',
      component: 'Flex',
      props: { gap: 'm', alignItems: 'stretch' },
      children: [
        { 
          id: 'm1', 
          component: 'ChartCard', 
          props: { 
            title: 'Avg Time in Stage (Days)', 
            type: 'bar',
            data: {
              labels: ['Sourcing', 'Screen', 'HM Review', 'Interview', 'Offer'],
              datasets: [{
                label: 'Days',
                data: [5, 3, 11, 15, 8],
                backgroundColor: [colors.blueberry500, colors.greenApple400, colors.cantaloupe400, colors.cinnamon400, colors.soap400]
              }]
            },
            options: {
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { display: false, grid: { display: false } }, y: { grid: { display: false } } }
            }
          } 
        },
        {
          id: 'insight-1',
          component: 'Card',
          props: { 
            padding: 'm', 
            style: { flex: 2, backgroundColor: colors.frenchVanilla100, border: `1px solid ${colors.cinnamon300}` } 
          },
          children: [
            { id: 'h1', component: 'Heading', props: { size: 'small', text: '💡 AI Insight: Manager Review Bottleneck', marginBottom: 'xs' } },
            { id: 'b1', component: 'BodyText', props: { size: 'small', text: 'Time to fill is trending up primarily because candidates are spending an average of 11 days in the "Manager Review" stage. Alex Chen currently has 4 requisitions with candidates waiting over 5 days.' } },
            {
              id: 'f1',
              component: 'Flex',
              props: { gap: 's', marginTop: 'm' },
              children: [
                { id: 'btn1', component: 'PrimaryButton', props: { text: 'Draft Nudge to Alex', action: 'ping_hm', payload: { hm: 'Alex Chen', reqId: 'Multiple' } } },
                { id: 'btn2', component: 'SecondaryButton', props: { text: 'View Blocked Reqs', action: 'view_reqs' } }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'insight-row-2',
      component: 'Flex',
      props: { gap: 'm', alignItems: 'stretch' },
      children: [
        { 
          id: 'm2', 
          component: 'ChartCard', 
          props: { 
            title: 'Active Pipeline Funnel', 
            type: 'bar',
            data: {
              labels: ['Applied', 'Screened', 'HM Review', 'Interview', 'Offer'],
              datasets: [{
                label: 'Candidates',
                data: [145, 42, 14, 8, 3],
                backgroundColor: colors.blueberry500,
                borderRadius: 4,
              }]
            },
            options: {
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { display: false, grid: { display: false } }, y: { grid: { display: false } } }
            }
          } 
        },
        {
          id: 'insight-2',
          component: 'Card',
          props: { 
            padding: 'm', 
            style: { flex: 2, backgroundColor: colors.frenchVanilla100, border: `1px solid ${colors.blueberry300}` } 
          },
          children: [
            { id: 'h2', component: 'Heading', props: { size: 'small', text: '📈 AI Suggestion: Pipeline Replenishment', marginBottom: 'xs' } },
            { id: 'b2', component: 'BodyText', props: { size: 'small', text: 'Top-of-funnel volume for the "Data Scientist" role has dropped. HiredScore Fetch has identified 15 past silver medalists in your database who match the required skills.' } },
            {
              id: 'f2',
              component: 'Flex',
              props: { gap: 's', marginTop: 'm' },
              children: [
                { id: 'btn3', component: 'PrimaryButton', props: { text: 'Review Silver Medalists', action: 'view_candidates' } },
                { id: 'btn4', component: 'SecondaryButton', props: { text: 'Launch Nurture Campaign', action: 'draft_campaign' } }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'healthy-metrics',
      component: 'Flex',
      props: { gap: 'm', flexWrap: 'wrap' },
      children: [
        { id: 'm3', component: 'MetricCard', props: { label: 'Offer Acceptance', value: '88%', changeIndicator: { text: '+3%', sentiment: 'positive' } } },
        { id: 'm4', component: 'MetricCard', props: { label: 'Quality of Hire', value: '4.8/5', helperText: 'Manager Satisfaction' } },
        { id: 'm5', component: 'MetricCard', props: { label: 'Candidate NPS', value: '+45', changeIndicator: { text: 'Excellent', sentiment: 'positive' } } },
      ]
    },
    {
      id: 'm-chart',
      component: 'ChartCard',
      props: {
        title: 'Time to Fill Trend (Last 6 Months)',
        type: 'line',
        data: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
          datasets: [
            {
              label: 'Avg Days',
              data: [34, 35, 37, 38, 40, 42],
              borderColor: colors.cinnamon500,
              backgroundColor: 'rgba(222, 46, 33, 0.1)',
              fill: true,
              tension: 0.4,
            }
          ]
        }
      }
    }
  ],
  'dp-reqs': [
    {
      id: 'dp-reqs-node',
      component: 'JobReqGrid',
      props: {
        reqs: [
          { id: 'REQ-2026-001', title: 'Senior Software Engineer', daysOpen: 45, status: 'Missing HM feedback', health: 'needs_attention' },
          { id: 'REQ-2026-012', title: 'Product Marketing Manager', daysOpen: 30, status: 'Offer pending', health: 'healthy' },
          { id: 'REQ-2026-045', title: 'Data Scientist', daysOpen: 60, status: 'Sourcing', health: 'needs_attention' },
          { id: 'REQ-2026-088', title: 'UX Designer', daysOpen: 12, status: 'Interviewing', health: 'healthy' },
        ]
      }
    }
  ],
  'dp-fetch': [
    {
      id: 'dp-fetch-node',
      component: 'CandidateGrid',
      props: {
        candidates: [
          { id: 'C-F1', name: 'Layla Osman', appliedDate: '2 hours ago', source: 'HiredScore Fetch', hiredScoreFit: 95 },
          { id: 'C-F2', name: 'David Chen', appliedDate: '1 day ago', source: 'HiredScore Fetch', hiredScoreFit: 91 },
          { id: 'C-F3', name: 'Sarah Jenkins', appliedDate: '2 days ago', source: 'HiredScore Fetch', hiredScoreFit: 88 },
        ]
      }
    }
  ],
  'dp-spotlight': [
    { id: 'sp1', component: 'MetricCard', props: { label: 'Critical Risk', value: 'REQ-2026-045', helperText: 'Data Scientist - 60 days open, 0 pipeline', changeIndicator: { text: 'Needs Sourcing', sentiment: 'negative' } } },
    { id: 'sp2', component: 'JobReqGrid', props: { reqs: [{ id: 'REQ-2026-045', title: 'Data Scientist', daysOpen: 60, status: 'Sourcing', health: 'needs_attention' }] } }
  ],
  'dp-dynamic-fetch': [
    {
      id: 'dp-dynamic-fetch-node',
      component: 'CandidateGrid',
      props: {
        candidates: [
          { id: 'C-DF1', name: 'Michael Ross', appliedDate: '6 months ago', source: 'Dynamic Fetch (Silver Medalist)', hiredScoreFit: 94 },
          { id: 'C-DF2', name: 'Elena Rodriguez', appliedDate: '8 months ago', source: 'Dynamic Fetch (Silver Medalist)', hiredScoreFit: 90 },
        ]
      }
    }
  ],
  'dp-diversity': [
    {
      id: 'div-cards',
      component: 'Flex',
      props: { gap: 's', flexWrap: 'wrap' },
      children: [
        { id: 'div1', component: 'MetricCard', props: { label: 'Diverse Slates', value: '75%', changeIndicator: { text: '+5%', sentiment: 'positive' } } },
        { id: 'div2', component: 'MetricCard', props: { label: 'Inclusive Language', value: '100%', helperText: 'All JDs optimized' } },
      ]
    },
    {
      id: 'div-chart',
      component: 'ChartCard',
      props: {
        title: 'Diversity by Pipeline Stage',
        type: 'bar',
        data: {
          labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired'],
          datasets: [
            {
              label: 'Underrepresented Groups',
              data: [45, 42, 38, 35, 33],
              backgroundColor: colors.blueberry500,
            },
            {
              label: 'Other',
              data: [55, 58, 62, 65, 67],
              backgroundColor: colors.soap400,
            }
          ]
        },
        options: {
          scales: {
            x: { stacked: true },
            y: { stacked: true, max: 100 }
          }
        }
      }
    }
  ],
  'dp-bottlenecks': [
    { id: 'bn1', component: 'JobReqGrid', props: { reqs: [{ id: 'REQ-2026-001', title: 'Senior Software Engineer', daysOpen: 45, status: 'Missing HM feedback', health: 'needs_attention' }] } },
    { id: 'bn2', component: 'DraftMessage', props: { recipient: 'Alex Chen (HM)', message: 'Hi Alex, we have 3 candidates waiting for your review on the Senior SWE role. Can you provide feedback today?' } }
  ],
  'dp-interviews': [
    {
      id: 'dp-interviews-node',
      component: 'CandidateGrid',
      props: {
        candidates: [
          { id: 'C-I1', name: 'Aisha Patel', appliedDate: 'Next: Onsite (Tomorrow)', source: 'LinkedIn', hiredScoreFit: 92 },
          { id: 'C-I2', name: 'Omar Khouri', appliedDate: 'Next: Phone Screen (Today)', source: 'Career site', hiredScoreFit: 76 },
        ]
      }
    }
  ],
  'dp-offers': [
    {
      id: 'dp-offers-node',
      component: 'CandidateGrid',
      props: {
        candidates: [
          { id: 'C-O1', name: 'James Wilson', appliedDate: 'Offer Sent (Waiting)', source: 'Referral', hiredScoreFit: 85 },
        ]
      }
    }
  ],
  'dp-sourcing': [
    {
      id: 'src-cards',
      component: 'Flex',
      props: { gap: 's', flexWrap: 'wrap' },
      children: [
        { id: 'src1', component: 'MetricCard', props: { label: 'LinkedIn ROI', value: '12 Hires', helperText: '$400/hire' } },
        { id: 'src2', component: 'MetricCard', props: { label: 'Referral ROI', value: '8 Hires', helperText: '$0/hire', changeIndicator: { text: 'Top Source', sentiment: 'positive' } } },
      ]
    },
    {
      id: 'src-chart',
      component: 'Flex',
      props: { gap: 'm' },
      children: [
        {
          id: 'src-chart-1',
          component: 'ChartCard',
          props: {
            title: 'Source of Hire (YTD)',
            type: 'doughnut',
            data: {
              labels: ['Referral', 'LinkedIn', 'Career Site', 'Agency', 'Other'],
              datasets: [
                {
                  data: [35, 25, 20, 10, 10],
                  backgroundColor: [
                    colors.blueberry500,
                    colors.greenApple400,
                    colors.cantaloupe400,
                    colors.cinnamon400,
                    colors.soap400,
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

export const RecruiterHubGenUIV95: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('hub');
  const [pinnedCards, setPinnedCards] = useState<Record<string, A2UINode[]>>(initialPinnedState);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const generateMorningRoundup = (): Message => ({
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: "Good morning, Nora! Here's your daily roundup. You have 3 requisitions that need attention and 5 new candidates to review.",
    a2uiNode: {
      id: 'roundup-container',
      component: 'Flex',
      props: { flexDirection: 'column', gap: 'l', marginTop: 'm' },
      children: [
        {
          id: 'roundup-metrics',
          component: 'Flex',
          props: { gap: 's', flexWrap: 'wrap' },
          children: [
            {
              id: 'metric-1',
              component: 'ChartCard',
              props: {
                title: 'Reqs Need Attention',
                type: 'doughnut',
                data: {
                  labels: ['High Priority', 'Standard'],
                  datasets: [
                    {
                      data: [2, 1],
                      backgroundColor: [
                        colors.cinnamon500,
                        colors.blueberry400,
                      ],
                      borderWidth: 0,
                    }
                  ]
                },
                options: {
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: { boxWidth: 12, font: { size: 11 } }
                    }
                  },
                  cutout: '70%',
                  maintainAspectRatio: false,
                },
                onClick: () => handleAction('view_reqs'),
              },
            },
            {
              id: 'metric-2',
              component: 'ChartCard',
              props: {
                title: 'Candidates to Review (Sr. Recruiter)',
                type: 'doughnut',
                data: {
                  labels: ['Referral', 'Career Site', 'LinkedIn'],
                  datasets: [
                    {
                      data: [2, 2, 1],
                      backgroundColor: [
                        colors.blueberry500,
                        colors.greenApple400,
                        colors.cantaloupe400,
                      ],
                      borderWidth: 0,
                    }
                  ]
                },
                options: {
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: { boxWidth: 12, font: { size: 11 } }
                    }
                  },
                  cutout: '70%',
                  maintainAspectRatio: false,
                },
                onClick: () => handleAction('view_candidates'),
              },
            },
          ],
        },
        {
          id: 'roundup-funnel',
          component: 'ChartCard',
          props: {
            title: 'E2E Recruiting Funnel (YTD)',
            type: 'bar',
            data: {
              labels: ['Sourced', 'Applied', 'Screened', 'HM Review', 'Interview', 'Offer'],
              datasets: [{
                label: 'Candidates',
                data: [340, 145, 42, 14, 8, 3],
                backgroundColor: colors.blueberry500,
                borderRadius: 4,
              }]
            },
            options: {
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { display: false, grid: { display: false } }, y: { grid: { display: false } } }
            }
          }
        },
        {
          id: 'roundup-smart-features',
          component: 'Flex',
          props: { gap: 'm', alignItems: 'stretch' },
          children: [
            {
              id: 'bottleneck-analyzer',
              component: 'Card',
              props: { 
                padding: 'm', 
                style: { flex: 1, backgroundColor: colors.frenchVanilla100, border: `1px solid ${colors.cinnamon300}` } 
              },
              children: [
                { id: 'bn-h', component: 'Heading', props: { size: 'small', text: '⚠️ Bottleneck Analyzer', marginBottom: 'xs' } },
                { id: 'bn-b', component: 'BodyText', props: { size: 'small', text: 'HM Review is taking 4 days longer than average. 14 candidates are currently waiting.' } },
                {
                  id: 'bn-f',
                  component: 'Flex',
                  props: { gap: 's', marginTop: 'm' },
                  children: [
                    { id: 'bn-btn', component: 'PrimaryButton', props: { text: 'Nudge Hiring Managers', action: 'ping_hm', payload: { hm: 'Multiple', reqId: 'Multiple' } } },
                  ]
                }
              ]
            },
            {
              id: 'proactive-alerts',
              component: 'Card',
              props: { 
                padding: 'm', 
                style: { flex: 1, backgroundColor: colors.frenchVanilla100, border: `1px solid ${colors.greenApple300}` } 
              },
              children: [
                { id: 'pa-h', component: 'Heading', props: { size: 'small', text: '🔔 Proactive Alerts', marginBottom: 'xs' } },
                { id: 'pa-b', component: 'BodyText', props: { size: 'small', text: '3 Candidates at Offer stage need follow-up today. 2 offers are expiring within 48 hours.' } },
                {
                  id: 'pa-f',
                  component: 'Flex',
                  props: { gap: 's', marginTop: 'm' },
                  children: [
                    { id: 'pa-btn', component: 'PrimaryButton', props: { text: 'Review Offers', action: 'view_candidates' } },
                  ]
                }
              ]
            }
          ]
        }
      ],
    },
  });

  const generateDynamicPageNode = (tabId: string): A2UINode => {
    const cards = pinnedCards[tabId] || [];
    return {
      id: `${tabId}-node`,
      component: 'Flex',
      props: { flexDirection: 'column', gap: 'l' },
      children: cards,
    };
  };

  const isNodeInTree = (nodes: A2UINode[], targetId: string): boolean => {
    for (const node of nodes) {
      if (node.id === targetId) return true;
      if (node.children && isNodeInTree(node.children, targetId)) return true;
    }
    return false;
  };

  const removeNodeFromTree = (nodes: A2UINode[], targetId: string): A2UINode[] => {
    return nodes
      .filter(n => n.id !== targetId)
      .map(n => ({
        ...n,
        children: n.children ? removeNodeFromTree(n.children, targetId) : undefined
      }));
  };

  const handlePinToggle = (nodeId: string, node: A2UINode) => {
    setPinnedCards(prev => {
      // If we are on a dynamic page, pin/unpin from there. Otherwise default to dp-metrics.
      const targetTab = activeTab.startsWith('dp-') ? activeTab : 'dp-metrics';
      const currentCards = prev[targetTab] || [];
      const currentlyPinned = isNodeInTree(currentCards, nodeId);
      
      let newCards;
      if (currentlyPinned) {
        newCards = removeNodeFromTree(currentCards, nodeId);
      } else {
        newCards = [...currentCards, node];
      }
      
      const newState = { ...prev, [targetTab]: newCards };
      
      // Update the active message if we are currently viewing this dynamic page
      if (activeTab === targetTab) {
        setMessages(prevMsgs => {
          const newMsgs = [...prevMsgs];
          const dpMsgIndex = newMsgs.findIndex(m => m.a2uiNode && m.a2uiNode.id === `${targetTab}-node`);
          if (dpMsgIndex !== -1) {
            newMsgs[dpMsgIndex] = {
              ...newMsgs[dpMsgIndex],
              a2uiNode: {
                ...newMsgs[dpMsgIndex].a2uiNode!,
                children: newCards
              }
            };
          }
          return newMsgs;
        });
      }
      
      return newState;
    });
  };

  const isPinned = (nodeId: string) => {
    return Object.values(pinnedCards).some(cards => isNodeInTree(cards, nodeId));
  };

  const pinContext = {
    isPinnable: true,
    isPinned,
    onPinToggle: handlePinToggle,
  };

  useEffect(() => {
    // Initial Morning Roundup
    setIsTyping(true);
    setTimeout(() => {
      setMessages([generateMorningRoundup()]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleTabChange = (tabId: string) => {
    if (tabId.startsWith('cat-')) return;
    setActiveTab(tabId);
    
    if (tabId === 'hub') {
      setMessages([]);
      setIsTyping(true);
      setTimeout(() => {
        setMessages([generateMorningRoundup()]);
        setIsTyping(false);
      }, 800);
    } else {
      setMessages([]);
      setIsTyping(true);
      setTimeout(() => {
        const node = generateDynamicPageNode(tabId);
        const tabLabel = TABS.find(t => t.id === tabId)?.label;
        setMessages([{
          id: `dp-${Date.now()}`,
          sender: 'assistant',
          text: `Here is your live ${tabLabel} dashboard, generated via GenUI.`,
          a2uiNode: node
        }]);
        setIsTyping(false);
      }, 800);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const assistantMessages = container.querySelectorAll('.chat-msg.assistant-msg');
      const lastMessage = assistantMessages[assistantMessages.length - 1];
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleAction = (action: string, payload?: any) => {
    if (action === 'view_reqs') {
      addUserMessage('Show me the reqs that need attention.');
      simulateAgentResponse({
        text: 'Here are the requisitions that need your attention:',
        a2uiNode: {
          id: 'reqs-grid',
          component: 'JobReqGrid',
          props: {
            reqs: [
              { id: 'REQ-2026-001', title: 'Senior Software Engineer', daysOpen: 45, status: 'Missing HM feedback', health: 'needs_attention' },
              { id: 'REQ-2026-012', title: 'Product Marketing Manager', daysOpen: 30, status: 'Offer pending', health: 'healthy' },
              { id: 'REQ-2026-045', title: 'Data Scientist', daysOpen: 60, status: 'Sourcing', health: 'needs_attention' },
            ],
          },
        },
      });
    } else if (action === 'view_req') {
      addUserMessage(`View details for ${payload.id}.`);
      simulateAgentResponse({
        text: `Here are the details for ${payload.id}. Would you like me to ping the hiring manager?`,
        a2uiNode: {
          id: 'req-action',
          component: 'PrimaryButton',
          props: {
            text: 'Ping Hiring Manager',
            action: 'ping_hm',
            payload: { reqId: payload.id, hm: 'Alex Chen' },
          },
        },
      });
    } else if (action === 'view_candidates') {
      addUserMessage('Show me the new candidates to review.');
      simulateAgentResponse({
        text: 'Here are the top candidates for the Senior Recruiter role, scored by HiredScore:',
        a2uiNode: {
          id: 'candidates-grid',
          component: 'CandidateGrid',
          props: {
            candidates: [
              { id: 'C-001', name: 'Layla Osman', appliedDate: '2 hours ago', source: 'Referral', hiredScoreFit: 89 },
              { id: 'C-002', name: 'Omar Khouri', appliedDate: '1 day ago', source: 'Career site', hiredScoreFit: 76 },
              { id: 'C-003', name: 'Aisha Patel', appliedDate: '2 days ago', source: 'LinkedIn', hiredScoreFit: 92 },
            ],
          },
        },
      });
    } else if (action === 'compare_candidates') {
      addUserMessage('Compare the top candidates.');
      simulateAgentResponse({
        text: 'Here is a comparison of the top candidates for the Senior Recruiter role:',
        a2uiNode: {
          id: 'candidates-carousel',
          component: 'CandidateCarousel',
          props: {
            candidates: [
              {
                candidateName: 'Layla Osman',
                title: 'Senior TA Partner',
                location: 'Riyadh, KSA',
                email: 'layla.osman@example.com',
                bio: 'Experienced talent acquisition professional with a focus on technical recruiting in the GCC region.',
                experience: [
                  { title: 'Senior TA Partner', company: 'TechCorp', dateRange: '2022 - Present', bullets: ['Led technical recruiting for the engineering division', 'Improved time-to-hire by 15%'] },
                  { title: 'Recruiter', company: 'Global Solutions', dateRange: '2019 - 2022', bullets: ['Managed end-to-end recruitment cycle', 'Implemented new sourcing strategies'] },
                ],
                skills: ['Technical Recruiting', 'Sourcing', 'Stakeholder Management', 'Workday'],
                education: ['BBA Human Resources, King Saud University'],
                certifications: ['Certified Talent Acquisition Professional (CTAP)'],
              },
              {
                candidateName: 'Aisha Patel',
                title: 'Lead Recruiter',
                location: 'Dubai, UAE',
                email: 'aisha.patel@example.com',
                bio: 'Strategic recruiter with a proven track record of building high-performing teams.',
                experience: [
                  { title: 'Lead Recruiter', company: 'Innovate Inc', dateRange: '2021 - Present', bullets: ['Built the regional recruiting team from scratch', 'Developed employer branding initiatives'] },
                  { title: 'HR Generalist', company: 'StartUp Co', dateRange: '2018 - 2021', bullets: ['Handled recruitment, onboarding, and employee relations', 'Streamlined HR processes'] },
                ],
                skills: ['Employer Branding', 'Executive Search', 'HR Strategy', 'Workday'],
                education: ['MBA, American University in Dubai'],
                certifications: ['SHRM-CP'],
              },
            ],
          },
        },
      });
    } else if (action === 'view_candidate') {
      addUserMessage(`Review candidate ${payload.id}.`);
      simulateAgentResponse({
        text: `Candidate ${payload.id} looks like a strong fit. Would you like to advance them to the next stage?`,
        a2uiNode: {
          id: 'cand-action',
          component: 'CandidateActionCard',
          props: {
            name: payload.id === 'C-001' ? 'Layla Osman' : payload.id === 'C-003' ? 'Aisha Patel' : 'Omar Khouri',
            metadata: 'Strong fit for the role',
            advanceAction: 'advance_cand',
            rejectAction: 'reject_cand',
            payload: { candidateId: payload.id, name: payload.id === 'C-001' ? 'Layla Osman' : payload.id === 'C-003' ? 'Aisha Patel' : 'Omar Khouri' },
          },
        },
      });
    } else if (action === 'ping_hm') {
      addUserMessage(`Ping ${payload.hm} about ${payload.reqId}.`);
      simulateAgentResponse({
        text: `I've drafted a message to ${payload.hm}. Would you like to send it?`,
        a2uiNode: {
          id: 'draft-msg',
          component: 'DraftMessage',
          props: {
            recipient: payload.hm,
            message: `Hi ${payload.hm},\n\nJust following up on REQ-2026-001 (Senior Software Engineer). We have a few candidates waiting for your feedback. Could you please review them when you have a moment?\n\nThanks,\nNora`,
            sendAction: 'send_msg',
            editAction: 'edit_msg',
            payload: { reqId: payload.reqId, hm: payload.hm },
          },
        },
      });
    } else if (action === 'advance_cand') {
      addUserMessage(`Advance ${payload.name} to the next stage.`);
      simulateAgentResponse({
        text: `Great! I've moved ${payload.name} to the Interview stage and sent them a scheduling invitation.`,
      });
    } else if (action === 'send_msg') {
      addUserMessage('Send the message.');
      simulateAgentResponse({
        text: `Message sent to ${payload.hm}! I'll let you know when they reply.`,
      });
    }
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, sender: 'user', text }]);
  };

  const simulateAgentResponse = (response: Omit<Message, 'id' | 'sender'>) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}`, sender: 'assistant', ...response },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addUserMessage(inputValue);
    setInputValue('');
    
    // Simple mock routing based on keywords
    const lowerInput = inputValue.toLowerCase();
    if (lowerInput.includes('req')) {
      handleAction('view_reqs');
    } else if (lowerInput.includes('candidate')) {
      handleAction('view_candidates');
    } else {
      simulateAgentResponse({
        text: "I can help you manage your requisitions, review candidates, or collaborate with hiring managers. What would you like to do?",
      });
    }
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

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
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
      <WorkdayTopNav
        searchPlaceholder="Search candidates, jobs, people…"
        searchValue=""
        onSearchChange={() => {}}
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
          secondaryTitle="Nora Al-Farsi"
          secondarySubtitle="Principal TA Partner"
          tabs={TABS}
          activeTabId={activeTab}
          onTabChange={handleTabChange}
          fillHeight
        />
        <Box flex={1} style={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
          <Flex ref={chatContainerRef} justifyContent="center" flex={1} style={{ overflowY: 'auto', padding: '24px 16px' }}>
            <Box style={{ maxWidth: '100%', width: '100%' }}>
              <Flex alignItems="center" gap="s" marginBottom="m">
                <Avatar as="div" size="medium" altText="Workday Recruiting Assistant" style={{ flexShrink: 0 }} />
                <Box>
                  <BodyText size="small" style={{ fontWeight: 700 }}>
                    Workday Recruiting Assistant
                  </BodyText>
                </Box>
              </Flex>

              <Flex flexDirection="column" style={{ width: '100%' }} gap="m">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-msg ${msg.sender === 'assistant' ? 'assistant-msg' : ''}`}>
                    {msg.sender === 'assistant' ? (
                      <Flex alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
                        <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <SanaCommMessageBubble 
                            align="start" 
                            maxWidth={msg.a2uiNode ? '100%' : 'min(100%, 600px)'}
                            width={msg.a2uiNode ? '100%' : 'auto'}
                          >
                            {msg.text && <Box marginBottom={msg.a2uiNode ? 'm' : 'zero'}>{msg.text}</Box>}
                            {msg.a2uiNode && <A2UIRenderer node={msg.a2uiNode} onAction={handleAction} pinContext={pinContext} />}
                          </SanaCommMessageBubble>
                        </Box>
                      </Flex>
                    ) : (
                      <Flex justifyContent="flex-end" style={{ width: '100%' }}>
                        <SanaCommMessageBubble align="end">
                          {msg.text}
                        </SanaCommMessageBubble>
                      </Flex>
                    )}
                  </div>
                ))}
                {isTyping && <div className="chat-msg assistant-msg">{typingIndicator}</div>}
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
              <Box style={{ maxWidth: '100%', width: '100%' }}>
                <Flex gap="s" marginBottom="s" flexWrap="wrap">
                  <SecondaryButton size="small" onClick={() => handleAction('view_reqs')}>
                    Check reqs needing attention
                  </SecondaryButton>
                  <SecondaryButton size="small" onClick={() => handleAction('view_candidates')}>
                    Review new candidates
                  </SecondaryButton>
                  <SecondaryButton size="small" onClick={() => handleAction('compare_candidates')}>
                    Compare top candidates
                  </SecondaryButton>
                  <SecondaryButton size="small" onClick={() => handleAction('ping_hm', { reqId: 'REQ-2026-001', hm: 'Alex Chen' })}>
                    Follow up with hiring managers
                  </SecondaryButton>
                </Flex>
                <SanaCommComposer
                  value={inputValue}
                  onChange={setInputValue}
                  placeholder="Ask me to review candidates, check reqs, or draft messages..."
                  onSend={handleSend}
                  sendDisabled={!inputValue.trim() || isTyping}
                />
                <Box marginTop="s" textAlign="center">
                  <BodyText size="small" color={colors.blackPepper400} style={{ fontSize: '11px' }}>
                    [Legal TBD] You are chatting with an automated recruiting assistant. Actions taken here will update Workday records.
                  </BodyText>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
