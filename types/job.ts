export interface Division {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Job {
  id: number;
  slug: string;
  title: string;
  /** Plain-text summary, HTML tags stripped. */
  excerpt: string;
  /** Plain-text body, HTML tags stripped. */
  description: string;
  link: string;
  date: string;
  divisions: Division[];
  location?: string;
  salary?: string;
  jobType?: string;
  featuredImageUrl?: string;
}

/** Loose shape of a WordPress REST API post, enough for what we read. */
export interface WPPost {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  acf?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  division?: number[];
  _embedded?: {
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string; count?: number }>>;
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
}
