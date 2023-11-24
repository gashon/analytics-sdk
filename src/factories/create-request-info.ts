import { FetchData } from '../hooks';
import { RequestPayload } from './';

export const createRequestInfo = ({
  payload,
  trackSession,
  apiKey,
  checksum,
}: {
  payload: RequestPayload;
  trackSession: FetchData['trackSession'];
  apiKey: FetchData['apiKey'];
  checksum: string;
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
});
