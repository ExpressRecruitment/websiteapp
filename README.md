# Express Recruitment App

A React Native (Expo) app for Express Recruitment, targeting iOS and
Android. Built with Expo Router, TypeScript, and Montserrat as the brand
typeface.

## Home screen

Three options:

- **Looking for a job** - browse live vacancies pulled from the WordPress
  REST API, searchable and filterable by division, with an apply flow that
  uploads a CV.
- **Looking to hire** - an enquiry form mirroring the temporary-recruitment
  page, submitted via Formidable Forms.
- **Submit a timesheet** - opens `expressrecruitment.timesheetportal.com`
  in an in-app/system browser (the portal is a third-party system and
  isn't embeddable as a native screen).

## Stack

- Expo SDK 57 / React Native 0.86, TypeScript
- Expo Router (file-based navigation, `app/`)
- `@expo-google-fonts/montserrat` for brand typography
- `expo-document-picker` for CV upload
- `expo-web-browser` for the external timesheet portal
- `@expo/vector-icons` (Ionicons)

## Project layout

```
app/                  Screens (Expo Router file-based routes)
  _layout.tsx          Root stack, font loading, header theme
  index.tsx             Home - the three options
  jobs/
    index.tsx            Vacancy list: search + division filter
    [id]/index.tsx        Job detail
    [id]/apply.tsx         Application form + CV upload
  hire.tsx               "Looking to hire" enquiry form
  timesheet.tsx           Opens the external timesheet portal
components/            Reusable UI (Button, TextField, FilePicker, cards, ...)
constants/theme.ts     Brand colors, spacing, typography
lib/
  config.ts             Environment-driven configuration (see below)
  api/wordpress.ts       WordPress REST API client (jobs, divisions)
  api/formidable.ts       Formidable Forms submission client
  hooks/                  Data-fetching hooks (useJobs, useDivisions)
types/job.ts            Shared types
```

## Configuration

The app is driven entirely by `EXPO_PUBLIC_*` environment variables so it
can be pointed at different environments without a code change. Copy
`.env.example` to `.env` and fill in real values:

```
cp .env.example .env
```

See `lib/config.ts` for the full list and defaults. Three things need to
be confirmed against the live WordPress site before this is production
ready - the sandbox this app was scaffolded in has no general internet
access, so these are configured with sensible defaults and clear TODOs
rather than verified values:

1. **CORS** - confirm with hosting that `wp-json` accepts requests from
   the app (native apps don't send a browser `Origin` header, but Expo web
   and any admin previews will; enabling CORS broadly for `wp-json` is the
   simplest fix).
2. **Jobs endpoint & division taxonomy** - `EXPO_PUBLIC_WP_JOBS_ENDPOINT_PATH`
   and `EXPO_PUBLIC_WP_DIVISION_TAXONOMY_PATH` assume a custom `vacancy`
   post type with a `division` taxonomy. If the site instead uses a
   plugin like WP Job Manager, update these (e.g. `/wp/v2/job_listing` and
   `/wp/v2/job_listing_category`). `lib/api/wordpress.ts` normalizes
   whatever comes back into a single `Job` type, so most site-specific
   differences are isolated to that one file.
3. **Formidable Forms** - `EXPO_PUBLIC_FORMIDABLE_APPLICATION_FORM_ID` and
   `EXPO_PUBLIC_FORMIDABLE_HIRE_FORM_ID`, plus the field key map in
   `lib/config.ts` (`FORMIDABLE_FORMS`), need the real form/field IDs from
   **WP Admin → Formidable → Forms → (form) → Settings**. The client posts
   `multipart/form-data` (so the CV attaches directly) to the Formidable
   REST API add-on's entry-create endpoint (`/wp-json/frm/v2/entries` by
   default); if the live site exposes a different endpoint, change
   `EXPO_PUBLIC_FORMIDABLE_SUBMIT_PATH`.

The "Looking to hire" form fields (`app/hire.tsx`) were built to mirror a
typical recruitment-agency enquiry form (company, contact, division,
staff required, start date, details) but should be checked against the
live temporary-recruitment page and adjusted if its field set differs.

CV applications land at **jobs@express-recruitment.co.uk** via the
Formidable Forms notification settings on the WordPress side (configure
the form's email notification to that address - this app only submits
the entry).

## Brand

- Teal `#008080`, red `#FF0000`, white, on Montserrat - see
  `constants/theme.ts`.
- The roundel logo (`assets/brand/logo.svg`, rasterized into
  `assets/brand/logo-mark.png` and the various `assets/images/icon*`,
  `favicon.png`, `splash-icon.png`, `android-icon-*.png` files) is a
  **hand-recreated vector approximation** of the supplied brand mark, not
  the original design file - this sandbox had no way to save/import the
  actual image asset that was shared in chat. It's close, but if a real
  vector/PNG source becomes available, swap `assets/brand/logo.svg` for
  it and re-derive the icon/splash/favicon variants (any SVG-to-PNG tool,
  or the same "render at N×N, teal square backdrop for the app icon /
  favicon, transparent + inset for the Android adaptive foreground"
  approach used to generate the current ones).

## Known limitation: live vacancy data

The Jobs screen is fully wired to the WordPress REST API (see
`lib/api/wordpress.ts`), but this sandbox's network egress is restricted
to a short allowlist (npm, GitHub, a few others) - `express-recruitment.co.uk`
is not reachable from here (confirmed via both `curl` and the fetch
tooling, both blocked at the proxy level). That means vacancies could not
actually be pulled/verified against the live site in this session; the
Jobs screen will correctly show its error state until run somewhere with
real network access. Once that's possible:

- Running `npm start` from a machine/CI with normal internet access will
  hit the real API - no code changes needed if the defaults in
  `lib/config.ts` (jobs CPT + division taxonomy paths) turn out to be
  correct for the live site.
- If they need adjusting, or if you'd rather hand over a data export than
  wait on network access, either works.

## Running locally

```
npm install
npm start        # then press i / a / w, or scan the QR code with Expo Go
```

Other useful commands:

```
npm run typecheck   # tsc --noEmit
npx expo export --platform ios --platform android --platform web   # production bundle sanity check
```

## Notes / follow-ups

- No automated tests yet - the API/form clients (`lib/api/*`) are the
  highest-value place to add unit tests once real endpoint shapes are
  confirmed.
- The app uses a single fixed light theme to match the brand rather than
  following the device's dark mode setting.
- Job descriptions are rendered as plain text (HTML tags stripped) rather
  than full rich HTML, to avoid a heavier HTML-rendering dependency; swap
  in a WebView or an HTML renderer in `app/jobs/[id]/index.tsx` if the
  WordPress content needs richer formatting.
