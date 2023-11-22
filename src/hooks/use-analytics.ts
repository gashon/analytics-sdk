import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { AnalyticsProps } from '../components';

export type UseAnalytics<T> = {
  error: Error | null;
  isFetching: boolean;
  data: T | null;
};

export type FetchData = Pick<AnalyticsProps, 'apiKey' | 'endpoint' | 'metadata'>;

const fetchData = async ({ apiKey, endpoint, metadata }: FetchData) => {
  const data = {
    api_key: apiKey,
    request_id: uuidv4(),
    metadata,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const response = await res.json();
  return response;
};

export const useAnalytics = <T>({ apiKey, endpoint, metadata }: FetchData): UseAnalytics<T> => {
  const [error, setError] = useState<UseAnalytics<T>['error']>(null);
  const [isFetching, setFetching] = useState<UseAnalytics<T>['isFetching']>(false);
  const [data, setData] = useState<UseAnalytics<T>['data']>(null);

  useEffect(() => {
    if (!!apiKey && !!endpoint) {
      setFetching(true);

      fetchData({ apiKey, endpoint, metadata })
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
