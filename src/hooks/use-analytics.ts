import { useState, useEffect } from 'react';

import { createClickEventPayload, createPageVisitPayload, createRequestInfo } from '../factories';
import { AnalyticsProps } from '../components';
import { findTrackedElement } from '../util';

export type UseAnalytics<T> = {
  error: Error | null;
  isFetching: boolean;
  data: T | null;
};

export type FetchData = Omit<AnalyticsProps, 'debug'>;

const fetchData = async ({ endpoint, options }: { endpoint: string; options: RequestInit }) => {
  const res = await fetch(endpoint, options);

  const response = await res.json();
  return response;
};

const fetchPageVisit = async ({ apiKey, endpoint, metadata, trackSession, fingerprintBrowser }: FetchData) => {
  const { payload, checksum } = await createPageVisitPayload({ metadata, fingerprintBrowser });
  const options = createRequestInfo({ payload, trackSession, apiKey, checksum });

  return fetchData({ endpoint, options });
};

const fetchClickEvent = async ({
  apiKey,
  metadata,
  element,
  endpoint,
  trackSession,
}: FetchData & { element: HTMLElement }) => {
  const { payload, checksum } = createClickEventPayload({ element, metadata });
  const options = createRequestInfo({ payload, trackSession, apiKey, checksum });

  return fetchData({ endpoint, options });
};

export const useAnalytics = <T>({
  apiKey,
  endpoint,
  metadata,
  trackClickEvents = false,
  trackSession = true,
  fingerprintBrowser = true,
}: FetchData): UseAnalytics<T> => {
  const [error, setError] = useState<UseAnalytics<T>['error']>(null);
  const [isFetching, setFetching] = useState<UseAnalytics<T>['isFetching']>(false);
  const [data, setData] = useState<UseAnalytics<T>['data']>(null);

  // Page visit
  useEffect(() => {
    if (!!apiKey && !!endpoint) {
      setFetching(true);

      fetchPageVisit({ apiKey, endpoint, metadata, trackSession, fingerprintBrowser })
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

  // attach click listener
  useEffect(() => {
    if (!trackClickEvents) return;

    const handleClick = async (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const { element } = findTrackedElement(clickedElement);

      if (element && element.dataset.trackingLabel) {
        fetchClickEvent({ metadata, apiKey, element, endpoint });
      } else {
        console.error('[Analytics]: Missing data-tracking-label on parent element');
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [trackClickEvents]);

  return { error, isFetching, data };
};
