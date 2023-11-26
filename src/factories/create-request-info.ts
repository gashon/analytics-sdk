import { FetchData } from '../hooks';
import { RequestPayload } from '../types';

export const createRequestInfo = ({
  payload,
  trackSession,
  apiKey,
  checksum,
  options = {},
}: {
  payload: RequestPayload;
  trackSession: FetchData['trackSession'];
  apiKey: FetchData['apiKey'];
  checksum: string;
  options?: RequestInit;
}): RequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-path-name': window.location.pathname,
    'x-api-key': apiKey,
    'x-checksum': checksum,
  },
  credentials: trackSession ? 'include' : 'omit',
  body: JSON.stringify(payload),
  ...options,
});
