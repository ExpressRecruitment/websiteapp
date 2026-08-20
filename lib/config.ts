/**
 * Central, environment-driven configuration.
 *
 * Everything here can be overridden without a code change by setting an
 * `EXPO_PUBLIC_*` environment variable (see `.env.example`). Expo inlines
 * `EXPO_PUBLIC_*` vars into the client bundle at build time, which is the
 * supported way to configure a deployed app per environment (dev/staging/
 * production) without shipping secrets - see
 * https://docs.expo.dev/guides/environment-variables/
 *
 * IMPORTANT - values that still need confirming against the live site:
 *  - WP_API_BASE_URL: confirm the production WordPress REST API is
 *    reachable and that CORS is enabled for this app's origin(s). Ask
 *    hosting to allow the `Origin` header from the app (native apps send
 *    no browser Origin, but Expo web / any admin preview will).
 *  - JOBS_ENDPOINT_PATH / DIVISION_TAXONOMY_PATH: depends on which jobs
 *    plugin powers the vacancies (e.g. WP Job Manager uses the
 *    `job_listing` post type and `job_listing_category` taxonomy; a
 *    custom ACF-driven CPT will use different slugs). Update once known.
 *  - Formidable Forms IDs/field keys: fill in FORMIDABLE_FORMS below from
 *    Formidable Forms -> (form) -> Settings once the forms exist on the
 *    live site.
 */

const env = process.env;

function envOrDefault(key: string, fallback: string): string {
  const value = env[key];
  return value && value.length > 0 ? value : fallback;
}

/**
 * Which jobs data source the app reads from:
 *  - 'local': a bundled snapshot (`data/jobs.json`) taken 2026-08-14.
 *    This is the default for now, since this environment can't reach
 *    the live WordPress API (see README > Known limitation).
 *  - 'wordpress': fetch live from WP_API_BASE_URL + JOBS_ENDPOINT_PATH.
 * Switch with EXPO_PUBLIC_JOBS_SOURCE once live access is available -
 * no other code needs to change (see lib/api/jobs.ts).
 */
export const JOBS_SOURCE = envOrDefault('EXPO_PUBLIC_JOBS_SOURCE', 'local') as
  | 'local'
  | 'wordpress';

/** Base URL of the WordPress site, no trailing slash. */
export const WP_BASE_URL = envOrDefault(
  'EXPO_PUBLIC_WP_BASE_URL',
  'https://www.express-recruitment.co.uk'
);

/** WordPress REST API root. */
export const WP_API_BASE_URL = `${WP_BASE_URL}/wp-json`;

/**
 * REST path (relative to WP_API_BASE_URL) that returns vacancy posts.
 * Default assumes a custom `vacancy` post type exposed to the REST API.
 * Swap to `/wp/v2/job_listing` if the site uses WP Job Manager.
 */
export const JOBS_ENDPOINT_PATH = envOrDefault(
  'EXPO_PUBLIC_WP_JOBS_ENDPOINT_PATH',
  '/wp/v2/vacancy'
);

/**
 * REST path (relative to WP_API_BASE_URL) for the "division" taxonomy
 * used to filter vacancies (e.g. Industrial, Commercial, Driving...).
 */
export const DIVISION_TAXONOMY_PATH = envOrDefault(
  'EXPO_PUBLIC_WP_DIVISION_TAXONOMY_PATH',
  '/wp/v2/division'
);

/** Mailbox that CV applications ultimately land in (for display/copy only). */
export const APPLICATIONS_EMAIL = 'jobs@express-recruitment.co.uk';

/**
 * Formidable Forms submission endpoint. This app posts multipart/form-data
 * directly to WordPress. Two supported shapes, controlled by
 * FORMIDABLE_SUBMIT_PATH:
 *  - The official Formidable REST API add-on: POST {WP_API_BASE_URL}/frm/v2/entries
 *  - A custom REST route you expose from the theme/a small plugin, e.g.
 *    POST {WP_API_BASE_URL}/express-recruitment/v1/submit-form
 * Either way the app sends `form_id` plus the field map below as
 * `item_meta[<fieldKey>]` pairs, which is what Formidable expects for a
 * standard entry-create request.
 */
export const FORMIDABLE_SUBMIT_PATH = envOrDefault(
  'EXPO_PUBLIC_FORMIDABLE_SUBMIT_PATH',
  '/frm/v2/entries'
);

/**
 * Optional API key for the Formidable REST API add-on, sent as the
 * `X-API-KEY` header. Leave blank if the endpoint doesn't require one.
 */
export const FORMIDABLE_API_KEY = envOrDefault('EXPO_PUBLIC_FORMIDABLE_API_KEY', '');

/**
 * Formidable form IDs + field keys. TODO: replace the placeholder numbers
 * with the real form ID and field IDs from
 * WP Admin -> Formidable -> Forms -> (form) -> Settings, and each field's
 * "Field Key" shown under the field's Advanced settings.
 */
export const FORMIDABLE_FORMS = {
  jobApplication: {
    formId: envOrDefault('EXPO_PUBLIC_FORMIDABLE_APPLICATION_FORM_ID', 'REPLACE_ME'),
    fields: {
      jobTitle: 'job_title',
      fullName: 'full_name',
      email: 'email',
      phone: 'phone',
      message: 'message',
      cv: 'cv_upload',
    },
  },
  hireEnquiry: {
    formId: envOrDefault('EXPO_PUBLIC_FORMIDABLE_HIRE_FORM_ID', 'REPLACE_ME'),
    fields: {
      companyName: 'company_name',
      contactName: 'contact_name',
      email: 'email',
      phone: 'phone',
      division: 'division',
      staffRequired: 'staff_required',
      startDate: 'start_date',
      details: 'details',
    },
  },
} as const;

/** External timesheet portal - opened in an in-app/system browser. */
export const TIMESHEET_PORTAL_URL = envOrDefault(
  'EXPO_PUBLIC_TIMESHEET_PORTAL_URL',
  'https://expressrecruitment.timesheetportal.com'
);
