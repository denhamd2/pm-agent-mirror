import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Card } from '@workday/canvas-kit-react/card';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './index';

export interface CandidateActionCardProps {
  name: string;
  metadata: string;
  onReject?: () => void;
  onAdvance?: () => void;
}

export const CandidateActionCard: React.FC<CandidateActionCardProps> = ({
  name,
  metadata,
  onReject,
  onAdvance,
}) => (
  <Card
    padding="m"
    style={{
      borderRadius: SANA_CARD_RADIUS_LG,
      border: `1px solid ${colors.soap300}`,
      boxShadow: SANA_CARD_SHADOW,
    }}
  >
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <BodyText size="medium" style={{ fontWeight: 700, color: colors.blueberry500 }} marginBottom="xxs">
          {name}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {metadata}
        </BodyText>
      </Box>
      <Flex gap="s">
        <SecondaryButton onClick={onReject}>Reject</SecondaryButton>
        <PrimaryButton onClick={onAdvance}>Advance</PrimaryButton>
      </Flex>
    </Flex>
  </Card>
);

export interface DraftMessageProps {
  recipient: string;
  message: string;
  onEdit?: () => void;
  onSend?: () => void;
}

export const DraftMessage: React.FC<DraftMessageProps> = ({
  recipient,
  message,
  onEdit,
  onSend,
}) => (
  <Card
    padding="m"
    style={{
      borderRadius: SANA_CARD_RADIUS_LG,
      border: `1px solid ${colors.soap300}`,
      backgroundColor: colors.frenchVanilla100,
    }}
  >
    <Heading size="small" marginBottom="s">Draft Message to {recipient}</Heading>
    <Box style={{ padding: '12px', border: `1px solid ${colors.soap300}`, borderRadius: '4px', backgroundColor: '#fff' }} marginBottom="m">
      <BodyText size="small">{message}</BodyText>
    </Box>
    <Flex gap="s" justifyContent="flex-end">
      <SecondaryButton onClick={onEdit}>Edit</SecondaryButton>
      <PrimaryButton onClick={onSend}>Send</PrimaryButton>
    </Flex>
  </Card>
);

import { Table } from '@workday/canvas-kit-react/table';
import { HiredScoreGrading } from './HiredScoreGrading';

export interface CandidateGridRow {
  id: string;
  name: string;
  appliedDate: string;
  source: string;
  hiredScoreFit: number;
}

export interface CandidateGridProps {
  candidates: CandidateGridRow[];
  onRowAction?: (action: string, payload: any) => void;
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({ candidates, onRowAction }) => (
  <Card
    style={{
      borderRadius: SANA_CARD_RADIUS_LG,
      border: `1px solid ${colors.soap300}`,
      boxShadow: SANA_CARD_SHADOW,
      overflow: 'hidden',
    }}
  >
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Candidate</Table.Header>
          <Table.Header>Applied</Table.Header>
          <Table.Header>Source</Table.Header>
          <Table.Header>Fit Score</Table.Header>
          <Table.Header>Actions</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {candidates.map((cand) => (
          <Table.Row key={cand.id}>
            <Table.Cell>
              <BodyText size="small" style={{ fontWeight: 700, color: colors.blueberry500 }}>
                {cand.name}
              </BodyText>
            </Table.Cell>
            <Table.Cell>
              <BodyText size="small" color={colors.blackPepper500}>{cand.appliedDate}</BodyText>
            </Table.Cell>
            <Table.Cell>
              <BodyText size="small" color={colors.blackPepper500}>{cand.source}</BodyText>
            </Table.Cell>
            <Table.Cell>
              <HiredScoreGrading fit={cand.hiredScoreFit} variant="compact" />
            </Table.Cell>
            <Table.Cell>
              <SecondaryButton size="small" onClick={() => onRowAction?.('view_candidate', { id: cand.id })}>
                Review
              </SecondaryButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Card>
);

export interface JobReqGridRow {
  id: string;
  title: string;
  daysOpen: number;
  status: string;
  health: 'healthy' | 'needs_attention';
}

export interface JobReqGridProps {
  reqs: JobReqGridRow[];
  onRowAction?: (action: string, payload: any) => void;
}

export const JobReqGrid: React.FC<JobReqGridProps> = ({ reqs, onRowAction }) => (
  <Card
    style={{
      borderRadius: SANA_CARD_RADIUS_LG,
      border: `1px solid ${colors.soap300}`,
      boxShadow: SANA_CARD_SHADOW,
      overflow: 'hidden',
    }}
  >
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Requisition</Table.Header>
          <Table.Header>Days Open</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Actions</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {reqs.map((req) => (
          <Table.Row key={req.id}>
            <Table.Cell>
              <BodyText size="small" style={{ fontWeight: 700, color: colors.blueberry500 }}>
                {req.title}
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>{req.id}</BodyText>
            </Table.Cell>
            <Table.Cell>
              <BodyText size="small" color={req.health === 'needs_attention' ? colors.cinnamon500 : colors.blackPepper500}>
                {req.daysOpen} days
              </BodyText>
            </Table.Cell>
            <Table.Cell>
              <BodyText size="small" color={colors.blackPepper500}>{req.status}</BodyText>
            </Table.Cell>
            <Table.Cell>
              <SecondaryButton size="small" onClick={() => onRowAction?.('view_req', { id: req.id })}>
                View
              </SecondaryButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Card>
);

import { StructuredResume, type StructuredResumeProps } from './StructuredResume';
import { useState } from 'react';
import { chevronLeftSmallIcon, chevronRightSmallIcon } from '@workday/canvas-system-icons-web';
import { SystemIcon } from '@workday/canvas-kit-react/icon';

export interface CandidateCarouselProps {
  candidates: StructuredResumeProps[];
  onAction?: (action: string, payload: any) => void;
}

export const CandidateCarousel: React.FC<CandidateCarouselProps> = ({ candidates, onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!candidates || candidates.length === 0) return null;

  const currentCandidate = candidates[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : candidates.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : 0));
  };

  return (
    <Card
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        boxShadow: SANA_CARD_SHADOW,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        padding="s"
        style={{
          backgroundColor: colors.frenchVanilla100,
          borderBottom: `1px solid ${colors.soap300}`,
        }}
      >
        <SecondaryButton size="small" onClick={handlePrev} icon={chevronLeftSmallIcon}>
          Previous
        </SecondaryButton>
        <BodyText size="small" style={{ fontWeight: 700 }}>
          Candidate {currentIndex + 1} of {candidates.length}
        </BodyText>
        <SecondaryButton size="small" onClick={handleNext}>
          Next <SystemIcon icon={chevronRightSmallIcon} size={20} />
        </SecondaryButton>
      </Flex>
      
      <Box padding="l" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <StructuredResume {...currentCandidate} />
      </Box>

      <Flex
        padding="m"
        justifyContent="flex-end"
        gap="s"
        style={{
          backgroundColor: colors.frenchVanilla100,
          borderTop: `1px solid ${colors.soap300}`,
        }}
      >
        <SecondaryButton
          onClick={() => onAction?.('reject_cand', { candidateId: currentCandidate.candidateName })}
        >
          Reject
        </SecondaryButton>
        <PrimaryButton
          onClick={() => onAction?.('advance_cand', { candidateId: currentCandidate.candidateName, name: currentCandidate.candidateName })}
        >
          Advance {currentCandidate.candidateName}
        </PrimaryButton>
      </Flex>
    </Card>
  );
};

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

export const CHART_COLORS = {
  categorical: [
    colors.blueberry500,
    colors.greenApple400,
    colors.cantaloupe400,
    colors.cinnamon400,
    colors.soap400,
  ],
  semantic: {
    positive: colors.greenApple500,
    negative: colors.cinnamon500,
    warning: colors.cantaloupe500,
    neutral: colors.blueberry400,
  },
  primary: colors.blueberry500,
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartCardProps {
  title: string;
  type: 'bar' | 'line' | 'doughnut' | 'pie';
  data: any;
  options?: any;
  onClick?: () => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, type, data, options, onClick }) => {
  const styledData = React.useMemo(() => {
    if (!data || !data.datasets) return data;

    return {
      ...data,
      datasets: data.datasets.map((dataset: any) => {
        const isPieOrDoughnut = type === 'pie' || type === 'doughnut';
        const isSingleSeries = data.datasets.length === 1 && !isPieOrDoughnut;
        
        let defaultBgColor = dataset.backgroundColor;
        if (!defaultBgColor) {
          if (isSingleSeries) {
            defaultBgColor = CHART_COLORS.primary;
          } else if (isPieOrDoughnut) {
            defaultBgColor = CHART_COLORS.categorical.slice(0, dataset.data?.length || CHART_COLORS.categorical.length);
          } else {
            defaultBgColor = CHART_COLORS.categorical[0];
          }
        }

        return {
          ...dataset,
          backgroundColor: defaultBgColor,
          borderWidth: dataset.borderWidth !== undefined ? dataset.borderWidth : (isPieOrDoughnut ? 0 : 1),
        };
      }),
    };
  }, [data, type]);

  const defaultOptions = React.useMemo(() => {
    const isBarOrLine = type === 'bar' || type === 'line';
    
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
      },
    };

    if (isBarOrLine) {
      return {
        ...baseOptions,
        ...options,
        scales: {
          x: {
            grid: { display: false },
            ...options?.scales?.x,
          },
          y: {
            grid: { display: false },
            ...options?.scales?.y,
          },
        },
      };
    }

    return {
      ...baseOptions,
      ...options,
    };
  }, [options, type]);

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={styledData} options={defaultOptions} />;
      case 'line':
        return <Line data={styledData} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={styledData} options={defaultOptions} />;
      case 'pie':
        return <Pie data={styledData} options={defaultOptions} />;
      default:
        return null;
    }
  };

  return (
    <Card
      padding="m"
      onClick={onClick}
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        boxShadow: SANA_CARD_SHADOW,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '300px',
        flex: 1,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Heading size="small" marginBottom="m">
        {title}
      </Heading>
      <Box style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
        {renderChart()}
      </Box>
    </Card>
  );
};
