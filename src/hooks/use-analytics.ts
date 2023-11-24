import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { omitUndefined } from 'omit-undefined';
import fp from '@fingerprintjs/fingerprintjs';

import { AnalyticsProps } from '../components';

export type UseAnalytics<T> = {
  error: Error | null;
  isFetching: boolean;
  data: T | null;
};

export type FetchData = Pick<AnalyticsProps, 'apiKey' | 'endpoint' | 'metadata'> & {
  trackSession?: boolean;
  fingerprintBrowser?: boolean;
};

export type RequestPayload = {
  api_key: FetchData['apiKey'];
  metadata: FetchData['metadata'];
  request_id: string;
  fingerprint_id?: string;
};

const createPayload = async (
  options: Pick<FetchData, 'apiKey' | 'metadata' | 'fingerprintBrowser'>,
): Promise<RequestPayload> => {
  let fingerPrintId: string | undefined = undefined;

  if (options.fingerprintBrowser) {
    const fpPromise = await fp.load();
    const { visitorId } = await fpPromise.get();

    fingerPrintId = visitorId;
  }

  const payload = {
    api_key: options.apiKey,
    metadata: options.metadata,
    request_id: uuidv4(),
    fingerprint_id: fingerPrintId,
  };

  return omitUndefined(payload);
};

const createRequestInfo = ({
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

const fetchData = async ({ apiKey, endpoint, metadata, trackSession, fingerprintBrowser }: FetchData) => {
  const payload = await createPayload({ apiKey, metadata, fingerprintBrowser });
  const options = createRequestInfo({ payload, trackSession });

  const res = await fetch(endpoint, options);

  const response = await res.json();
  return response;
};

export const useAnalytics = <T>({
  apiKey,
  endpoint,
  metadata,
  trackSession = true,
  fingerprintBrowser = true,
}: FetchData): UseAnalytics<T> => {
  const [error, setError] = useState<UseAnalytics<T>['error']>(null);
  const [isFetching, setFetching] = useState<UseAnalytics<T>['isFetching']>(false);
  const [data, setData] = useState<UseAnalytics<T>['data']>(null);

  useEffect(() => {
    if (!!apiKey && !!endpoint) {
      setFetching(true);

      fetchData({ apiKey, endpoint, metadata, trackSession, fingerprintBrowser })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [apiKey, endpoint]);

  return { error, isFetching, data };
};
