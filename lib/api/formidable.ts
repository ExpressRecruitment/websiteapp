import { FORMIDABLE_API_KEY, FORMIDABLE_SUBMIT_PATH, WP_API_BASE_URL } from '@/lib/config';
import { ApiError } from '@/lib/api/wordpress';

export { ApiError } from '@/lib/api/wordpress';

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string | null;
}

/**
 * Submits an entry to a Formidable Forms form as multipart/form-data.
 *
 * `fields` maps Formidable field keys -> text values. `file`, if present,
 * is attached under `fieldKeys.cv` for forms that accept a CV/attachment.
 *
 * This targets the Formidable REST API add-on's entry-create shape
 * (`item_meta[<field_key>]`). If the live site instead exposes a custom
 * REST route, adjust `FORMIDABLE_SUBMIT_PATH`/headers in `lib/config.ts` -
 * the request shape below (multipart form fields) is a reasonable default
 * for either.
 */
export async function submitFormidableForm({
  formId,
  fields,
  file,
  fileFieldKey,
}: {
  formId: string;
  fields: Record<string, string>;
  file?: PickedFile | null;
  fileFieldKey?: string;
}): Promise<void> {
  if (formId === 'REPLACE_ME') {
    throw new ApiError(
      'This form is not configured yet. Add the Formidable form ID in app config before submitting.'
    );
  }

  const body = new FormData();
  body.append('form_id', formId);

  for (const [fieldKey, value] of Object.entries(fields)) {
    if (value == null || value === '') continue;
    body.append(`item_meta[${fieldKey}]`, value);
  }

  if (file && fileFieldKey) {
    // React Native's FormData accepts this {uri, name, type} shape directly.
    body.append(`item_meta[${fileFieldKey}]`, {
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? 'application/octet-stream',
    } as unknown as Blob);
  }

  const headers: Record<string, string> = {};
  if (FORMIDABLE_API_KEY) headers['X-API-KEY'] = FORMIDABLE_API_KEY;

  let response: Response;
  try {
    response = await fetch(`${WP_API_BASE_URL}${FORMIDABLE_SUBMIT_PATH}`, {
      method: 'POST',
      headers,
      body,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch {
      // ignore
    }
    throw new ApiError(
      `Submission failed (${response.status}).${detail ? ` ${detail}` : ''}`,
      response.status
    );
  }
}
