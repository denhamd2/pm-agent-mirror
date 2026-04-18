import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import { AgencyTypesImpactDashboardBody } from './agency-types-impact-dashboard-body';
import { QUERY_META } from './data-recruiting-agency-user-dashboard';

const backLink = (
  <a
    href="#value-realization-metrics"
    style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}
  >
    &larr; Value Realisation
  </a>
);

export const RecruitingAgencyUserDashboard: React.FC = () => (
  <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
    <DashboardGlobalNav activeMetricsSlug="recruiting-agency-user" />
    <Box padding="32px" flex={1}>
      <AgencyTypesImpactDashboardBody queryMeta={QUERY_META} leadSlot={backLink} />
    </Box>
  </Flex>
);

export default RecruitingAgencyUserDashboard;
