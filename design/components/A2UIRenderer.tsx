import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { StatusIndicator, StatusIndicatorType, StatusIndicatorEmphasis } from '@workday/canvas-kit-react/status-indicator';
import { MetricCard, JobCard, CandidateActionCard, DraftMessage, CandidateGrid, JobReqGrid, CandidateCarousel, ChartCard } from './index';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { starIcon } from '@workday/canvas-system-icons-web';

export interface A2UINode {
  id: string;
  component: string;
  props?: Record<string, any>;
  children?: A2UINode[];
}

export interface PinContext {
  isPinnable: boolean;
  isPinned: (nodeId: string) => boolean;
  onPinToggle: (nodeId: string, node: A2UINode) => void;
}

export interface A2UIRendererProps {
  node: A2UINode;
  onAction?: (action: string, payload?: any) => void;
  pinContext?: PinContext;
}

export const A2UIRenderer: React.FC<A2UIRendererProps> = ({ node, onAction, pinContext }) => {
  const renderChildren = (children?: A2UINode[]) => {
    if (!children) return null;
    return children.map((child) => <A2UIRenderer key={child.id} node={child} onAction={onAction} pinContext={pinContext} />);
  };

  const renderNode = () => {
    switch (node.component) {
      case 'Flex':
        return (
          <Flex {...node.props}>
            {renderChildren(node.children)}
          </Flex>
        );
      case 'Box':
        return (
          <Box {...node.props}>
            {renderChildren(node.children)}
          </Box>
        );
      case 'Card':
        return (
          <Card {...node.props}>
            {renderChildren(node.children)}
          </Card>
        );
      case 'Heading':
        return (
          <Heading size={node.props?.size || 'small'} {...node.props}>
            {node.props?.text || renderChildren(node.children)}
          </Heading>
        );
      case 'BodyText':
        return (
          <BodyText size={node.props?.size || 'small'} {...node.props}>
            {node.props?.text || renderChildren(node.children)}
          </BodyText>
        );
      case 'PrimaryButton':
        return (
          <PrimaryButton
            {...node.props}
            onClick={() => {
              if (node.props?.action && onAction) {
                onAction(node.props.action, node.props.payload);
              }
            }}
          >
            {node.props?.text || renderChildren(node.children)}
          </PrimaryButton>
        );
      case 'SecondaryButton':
        return (
          <SecondaryButton
            {...node.props}
            onClick={() => {
              if (node.props?.action && onAction) {
                onAction(node.props.action, node.props.payload);
              }
            }}
          >
            {node.props?.text || renderChildren(node.children)}
          </SecondaryButton>
        );
      case 'MetricCard':
        return (
          <MetricCard
            label={node.props?.label || ''}
            value={node.props?.value || ''}
            helperText={node.props?.helperText || ''}
            {...node.props}
          />
        );
      case 'JobCard':
        return (
          <JobCard
            title={node.props?.title}
            metadata={node.props?.metadata}
            onViewJob={() => {
              if (node.props?.action && onAction) {
                onAction(node.props.action, node.props.payload);
              }
            }}
          />
        );
      case 'StatusIndicator':
        return (
          <StatusIndicator
            type={node.props?.type || StatusIndicatorType.Gray}
            label={node.props?.label || ''}
            {...node.props}
          />
        );
      case 'Text':
        return <>{node.props?.text}</>;
      case 'CandidateActionCard':
        return (
          <CandidateActionCard
            name={node.props?.name || ''}
            metadata={node.props?.metadata || ''}
            onReject={() => {
              if (node.props?.rejectAction && onAction) {
                onAction(node.props.rejectAction, node.props.payload);
              }
            }}
            onAdvance={() => {
              if (node.props?.advanceAction && onAction) {
                onAction(node.props.advanceAction, node.props.payload);
              }
            }}
            {...node.props}
          />
        );
      case 'DraftMessage':
        return (
          <DraftMessage
            recipient={node.props?.recipient || ''}
            message={node.props?.message || ''}
            onEdit={() => {
              if (node.props?.editAction && onAction) {
                onAction(node.props.editAction, node.props.payload);
              }
            }}
            onSend={() => {
              if (node.props?.sendAction && onAction) {
                onAction(node.props.sendAction, node.props.payload);
              }
            }}
            {...node.props}
          />
        );
      case 'CandidateGrid':
        return (
          <CandidateGrid
            candidates={node.props?.candidates || []}
            onRowAction={(action, payload) => {
              if (onAction) onAction(action, payload);
            }}
          />
        );
      case 'JobReqGrid':
        return (
          <JobReqGrid
            reqs={node.props?.reqs || []}
            onRowAction={(action, payload) => {
              if (onAction) onAction(action, payload);
            }}
          />
        );
      case 'CandidateCarousel':
        return (
          <CandidateCarousel
            candidates={node.props?.candidates || []}
            onAction={(action, payload) => {
              if (onAction) onAction(action, payload);
            }}
          />
        );
      case 'ChartCard':
        return (
          <ChartCard
            title={node.props?.title || ''}
            type={node.props?.type || 'bar'}
            data={node.props?.data || {}}
            options={node.props?.options}
            onClick={node.props?.onClick}
          />
        );
      default:
        return (
          <Box padding="s" style={{ border: '1px dashed red', color: 'red' }}>
            Unknown component: {node.component}
          </Box>
        );
    }
  };

  const element = renderNode();

  if (pinContext?.isPinnable) {
    const pinnableComponents = ['MetricCard', 'JobReqGrid', 'CandidateGrid', 'ChartCard', 'CandidateCarousel', 'DraftMessage', 'CandidateActionCard', 'JobCard', 'Card'];
    if (pinnableComponents.includes(node.component)) {
      const pinned = pinContext.isPinned(node.id);
      
      let wrapperStyle: React.CSSProperties = { position: 'relative' };
      if (node.component === 'MetricCard') {
        wrapperStyle.flex = '1 1 220px';
      } else if (node.component === 'ChartCard') {
        wrapperStyle.flex = '1';
      } else if (node.component === 'Card' && node.props?.style?.flex) {
        wrapperStyle.flex = node.props.style.flex;
      }

      return (
        <Box style={wrapperStyle}>
          {element}
          <Box style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
            <Box
              as="button"
              onClick={() => pinContext.onPinToggle(node.id, node)}
              title={pinned ? "Unpin card" : "Pin card"}
              style={{ 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pinned ? 1 : 0.5,
              }}
            >
              <SystemIcon 
                icon={starIcon} 
                color={pinned ? colors.blackPepper500 : colors.soap400} 
                size={16} 
              />
            </Box>
          </Box>
        </Box>
      );
    }
  }

  return element;
};
