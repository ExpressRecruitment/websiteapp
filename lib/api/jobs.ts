/**
 * Facade over the jobs data source. Screens/hooks import from here, not
 * from `wordpress.ts` or `localJobs.ts` directly, so switching
 * JOBS_SOURCE (see lib/config.ts) doesn't touch any UI code.
 */
import { JOBS_SOURCE } from '@/lib/config';
import * as local from '@/lib/api/localJobs';
import * as wordpress from '@/lib/api/wordpress';

export { ApiError } from '@/lib/api/wordpress';
export type { FetchJobsParams } from '@/lib/api/wordpress';

const impl = JOBS_SOURCE === 'wordpress' ? wordpress : local;

export const fetchJobs = impl.fetchJobs;
export const fetchJobById = impl.fetchJobById;
export const fetchJobBySlug = impl.fetchJobBySlug;
export const fetchDivisions = impl.fetchDivisions;
