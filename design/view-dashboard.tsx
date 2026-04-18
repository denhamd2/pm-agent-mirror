import React from 'react';
import { Box } from '@workday/canvas-kit-react/layout';
import { AgencyTypesImpactDashboardBody } from './agency-types-impact-dashboard-body';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import { QUERY_META } from './data-view-dashboard';

/** Transient route used by `/create-dashboard` and Pharos workflows; same charts as Recruiting Agency User. */
export const ViewDashboard: React.FC = () => (
  <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
    <AgencyTypesImpactDashboardBody queryMeta={QUERY_META} />
  </Box>
);

export default ViewDashboard;
