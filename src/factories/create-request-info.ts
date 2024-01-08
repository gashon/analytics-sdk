import { FetchData } from '../hooks';
import { RequestData, RequestPayload } from '../types';
import { getUserToken } from '../util';

export const createRequestInfo = ({
  payload,
  trackSession,
  apiKey,
  checksum,
  disableNotifications = false,
  options = {},
}: {
  payload: RequestPayload;
  trackSession: FetchData['trackSession'];
  apiKey: FetchData['apiKey'];
  checksum: string;
  disableNotifications?: boolean;
  options?: RequestInit;
}): RequestInit => {
  const data: RequestData = {
    payload,
    checksum,
    path: window.location.pathname,
    api_key: apiKey,
    token: getUserToken(),
  };

  if (disableNotifications) data.disable_notifications = true;

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-path-name': window.location.pathname,
      'x-api-key': apiKey,
      'x-checksum': checksum,
    },
    mode: 'cors',
    keepalive: true,
    // @deprecated
    credentials: 'omit',
    body: JSON.stringify(data),
    ...options,
  };
};
