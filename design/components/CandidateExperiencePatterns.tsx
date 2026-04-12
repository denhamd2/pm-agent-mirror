import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Card } from '@workday/canvas-kit-react/card';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_COMM_MESSAGE_RADIUS_PX,
  WORKDAY_TOP_NAV_HEIGHT_PX,
} from './index';

export interface CareerSiteHeroProps {
  greeting: string;
  searchPlaceholder?: string;
  onSearch?: () => void;
}

export const CareerSiteHero: React.FC<CareerSiteHeroProps> = ({
  greeting,
  searchPlaceholder = 'e.g. "marketing roles in Dubai"',
  onSearch,
}) => (
  <Box style={{ backgroundColor: colors.blueberry500, padding: '48px 24px', color: '#fff' }}>
    <Flex justifyContent="center">
      <Box style={{ maxWidth: 960, width: '100%' }}>
        <Heading size="medium" style={{ color: '#fff' }} marginBottom="s">
          {greeting}
        </Heading>
        <Box
          style={{
            backgroundColor: '#fff',
            borderRadius: SANA_COMM_MESSAGE_RADIUS_PX,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: SANA_CARD_SHADOW,
          }}
        >
          <Box flex={1}>
            <BodyText size="medium" color={colors.blackPepper400}>
              {searchPlaceholder}
            </BodyText>
          </Box>
          <PrimaryButton size="small" onClick={onSearch}>
            Search
          </PrimaryButton>
        </Box>
      </Box>
    </Flex>
  </Box>
);

export interface JobCardProps {
  title: string;
  metadata: string;
  onViewJob?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ title, metadata, onViewJob }) => (
  <Card
    padding="m"
    style={{
      borderRadius: SANA_CARD_RADIUS_LG,
      border: `1px solid ${colors.soap300}`,
      boxShadow: SANA_CARD_SHADOW,
      cursor: onViewJob ? 'pointer' : 'default',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
    onClick={onViewJob}
  >
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <BodyText size="medium" style={{ fontWeight: 700, color: colors.blueberry500 }} marginBottom="xxs">
          {title}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper500}>
          {metadata}
        </BodyText>
      </Box>
      {onViewJob && (
        <SecondaryButton onClick={onViewJob}>
          View Job
        </SecondaryButton>
      )}
    </Flex>
  </Card>
);

export interface JobDetailsStickyFooterProps {
  promptText?: string;
  buttonText?: string;
  onApply?: () => void;
}

export const JobDetailsStickyFooter: React.FC<JobDetailsStickyFooterProps> = ({
  promptText = 'Ready to apply?',
  buttonText = 'Apply with Assistant',
  onApply,
}) => (
  <Box
    style={{
      backgroundColor: colors.frenchVanilla100,
      borderTop: `1px solid ${colors.soap300}`,
      padding: '16px 24px',
      margin: '0 -24px -24px -24px',
      borderBottomLeftRadius: SANA_CARD_RADIUS_LG,
      borderBottomRightRadius: SANA_CARD_RADIUS_LG,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      bottom: 0,
    }}
  >
    <Flex alignItems="center" gap="s">
      <Avatar as="div" size="small" altText="Assistant" />
      <BodyText size="small" style={{ fontWeight: 600 }}>
        {promptText}
      </BodyText>
    </Flex>
    <PrimaryButton onClick={onApply}>
      {buttonText}
    </PrimaryButton>
  </Box>
);
