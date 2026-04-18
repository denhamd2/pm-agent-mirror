import type { QueryMeta } from './data-view-dashboard';
import { QUERY_META as BASE_QUERY_META } from './data-view-dashboard';

/** Value Realisation route: canonical HRREC-81393 / Agency Types impact dashboard. */
export const QUERY_META: QueryMeta = {
  ...BASE_QUERY_META,
  title: 'Recruiting Agency User',
  subtitle:
    'Bulk Post to Agency Types (HRREC-81393): OMS-backed adoption share, tenant penetration, menu intent, and cumulative reach from Pharos PROD. Weekly Saturday samples from launch.',
};
