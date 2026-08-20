import rawJobs from '@/data/jobs.json';
import type { Division, Job } from '@/types/job';
import type { FetchJobsParams } from '@/lib/api/wordpress';

/**
 * Local snapshot data source.
 *
 * `data/jobs.json` is a one-off export of the live vacancies taken
 * 2026-08-14 (see README > Known limitation: live vacancy data) - this
 * sandbox can't reach express-recruitment.co.uk's WordPress API, so this
 * bundled snapshot stands in for it until real network access is
 * available. It has the same shape the WordPress client produces, so
 * switching back to live data later is just flipping `JOBS_SOURCE` in
 * lib/config.ts - nothing here or in the UI needs to change.
 *
 * One thing the source spreadsheet didn't include: which "division" each
 * role belongs to. Divisions below are inferred from each job title by
 * keyword (see scripts used to generate data/jobs.json) against Express
 * Recruitment's real division list, so mis-categorized roles are
 * possible - the title/location/salary/job type themselves are exactly
 * as scraped, not invented.
 */

interface RawJob {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  link: string;
  date: string;
  divisions: string[];
  location: string | null;
  salary: string | null;
  jobType: string | null;
}

const DIVISION_ORDER = [
  'Temporary',
  'Sales',
  'Professional & Corporate Support',
  'Legal & Finance',
  'Not-For-Profit',
  'Tech & IT',
  'Engineering',
  'Executive & Managerial Search',
  'The Academy',
];

function slugifyDivision(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const jobs = rawJobs as RawJob[];

const divisionCounts = new Map<string, number>();
for (const job of jobs) {
  for (const name of job.divisions) {
    divisionCounts.set(name, (divisionCounts.get(name) ?? 0) + 1);
  }
}

const divisionsByName = new Map<string, Division>(
  DIVISION_ORDER.map((name, index) => [
    name,
    { id: index + 1, name, slug: slugifyDivision(name), count: divisionCounts.get(name) ?? 0 },
  ])
);

function toJob(raw: RawJob): Job {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    description: raw.description,
    link: raw.link,
    date: raw.date,
    divisions: raw.divisions.map((name) => divisionsByName.get(name)).filter((d): d is Division => !!d),
    location: raw.location ?? undefined,
    salary: raw.salary ?? undefined,
    jobType: raw.jobType ?? undefined,
  };
}

export async function fetchJobs({
  search,
  divisionId,
  page = 1,
  perPage = 20,
}: FetchJobsParams = {}): Promise<{ jobs: Job[]; totalPages: number }> {
  const query = search?.trim().toLowerCase();

  let filtered = jobs;
  if (query) {
    filtered = filtered.filter((job) => job.title.toLowerCase().includes(query));
  }
  if (divisionId) {
    const divisionName = DIVISION_ORDER[divisionId - 1];
    filtered = filtered.filter((job) => job.divisions.includes(divisionName));
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageJobs = filtered.slice(start, start + perPage).map(toJob);

  return { jobs: pageJobs, totalPages };
}

export async function fetchJobById(id: number): Promise<Job | null> {
  const raw = jobs.find((job) => job.id === id);
  return raw ? toJob(raw) : null;
}

export async function fetchJobBySlug(slug: string): Promise<Job | null> {
  const raw = jobs.find((job) => job.slug === slug);
  return raw ? toJob(raw) : null;
}

export async function fetchDivisions(): Promise<Division[]> {
  return DIVISION_ORDER.map((name) => divisionsByName.get(name)!).filter((d) => d.count > 0);
}
