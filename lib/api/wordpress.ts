import {
  DIVISION_TAXONOMY_PATH,
  JOBS_ENDPOINT_PATH,
  WP_API_BASE_URL,
} from '@/lib/config';
import type { Division, Job, WPPost, WPTerm } from '@/types/job';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Strips HTML tags and decodes the handful of entities WP commonly emits. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeJob(post: WPPost): Job {
  const termGroups = post._embedded?.['wp:term'] ?? [];
  const divisions: Division[] = termGroups
    .flat()
    .filter((term) => term.taxonomy === 'division')
    .map((term) => ({ id: term.id, name: term.name, slug: term.slug, count: term.count ?? 0 }));

  const acf = (post.acf ?? {}) as Record<string, unknown>;
  const asString = (value: unknown): string | undefined =>
    typeof value === 'string' && value.length > 0 ? value : undefined;

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title?.rendered ?? ''),
    excerpt: stripHtml(post.excerpt?.rendered ?? ''),
    description: stripHtml(post.content?.rendered ?? ''),
    link: post.link,
    date: post.date,
    divisions,
    location: asString(acf.location),
    salary: asString(acf.salary),
    jobType: asString(acf.job_type),
    featuredImageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
  };
}

async function request(url: string): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch {
    throw new ApiError(
      'Could not reach the jobs service. Check your connection and that the site allows requests from this app (CORS).'
    );
  }
  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status})`, response.status);
  }
  return response;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await request(url);
  return (await response.json()) as T;
}

export interface FetchJobsParams {
  search?: string;
  divisionId?: number;
  page?: number;
  perPage?: number;
}

export async function fetchJobs({
  search,
  divisionId,
  page = 1,
  perPage = 20,
}: FetchJobsParams = {}): Promise<{ jobs: Job[]; totalPages: number }> {
  const params = new URLSearchParams({
    _embed: '1',
    per_page: String(perPage),
    page: String(page),
    orderby: 'date',
    order: 'desc',
  });
  if (search) params.set('search', search);
  if (divisionId) params.set('division', String(divisionId));

  const url = `${WP_API_BASE_URL}${JOBS_ENDPOINT_PATH}?${params.toString()}`;

  const response = await request(url);
  const totalPages = Number(response.headers.get('X-WP-TotalPages') ?? '1');
  const posts = (await response.json()) as WPPost[];
  return { jobs: posts.map(normalizeJob), totalPages: Number.isFinite(totalPages) ? totalPages : 1 };
}

export async function fetchJobBySlug(slug: string): Promise<Job | null> {
  const params = new URLSearchParams({ _embed: '1', slug });
  const url = `${WP_API_BASE_URL}${JOBS_ENDPOINT_PATH}?${params.toString()}`;
  const posts = await getJson<WPPost[]>(url);
  return posts.length > 0 ? normalizeJob(posts[0]) : null;
}

export async function fetchJobById(id: number): Promise<Job | null> {
  const params = new URLSearchParams({ _embed: '1' });
  const url = `${WP_API_BASE_URL}${JOBS_ENDPOINT_PATH}/${id}?${params.toString()}`;
  try {
    const post = await getJson<WPPost>(url);
    return normalizeJob(post);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchDivisions(): Promise<Division[]> {
  const params = new URLSearchParams({ per_page: '100', orderby: 'name', order: 'asc' });
  const url = `${WP_API_BASE_URL}${DIVISION_TAXONOMY_PATH}?${params.toString()}`;
  const terms = await getJson<WPTerm[]>(url);
  return terms.map((term) => ({ id: term.id, name: term.name, slug: term.slug, count: term.count }));
}
