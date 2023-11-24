import { useState, useEffect } from 'react';

import { createPayload, createRequestInfo } from '../factories';
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

const fetchData = async ({ apiKey, endpoint, metadata, trackSession, fingerprintBrowser }: FetchData) => {
  const { payload, checksum } = await createPayload({ metadata, fingerprintBrowser });
  const options = createRequestInfo({ payload, trackSession, apiKey, checksum });

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
