import { FetchData } from '../hooks';
import { RequestPayload } from './';

export const createRequestInfo = ({
  payload,
  trackSession,
}: {
  payload: RequestPayload;
  trackSession: FetchData['trackSession'];
}): RequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: trackSession ? 'include' : 'omit',
  body: JSON.stringify(payload),
});
