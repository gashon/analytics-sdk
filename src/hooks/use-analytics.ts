import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { createClickEventPayload, createPageVisitPayload, createRequestBlob, createRequestInfo } from '../factories';
import { AnalyticsProps } from '../components';
import { findTrackedElement } from '../util';
import { createPageLeavePayload } from '../factories/create-page-leave-payload';
import { RequestData, RequestDataInit } from '../types';

export type UseAnalytics<T> = {
  error: Error | null;
  isFetching: boolean;
  data: boolean | null;
};

export type FetchData = Omit<AnalyticsProps, 'debug'> & { sessionId: string };

const sendBeacon = async ({
  endpoint,
  payload,
  checksum,
  apiKey,
  trackSession,
}: RequestDataInit & { endpoint: AnalyticsProps['endpoint'] }) => {
  const blob = createRequestBlob({ payload, checksum, apiKey, trackSession });

  const res = navigator.sendBeacon(endpoint, blob);
  return res;
};

const fetchPageVisit = async ({
  apiKey,
  endpoint,
  metadata,
  trackSession,
  fingerprintBrowser,
  sessionId,
}: FetchData) => {
  const { payload, checksum } = await createPageVisitPayload({ metadata, fingerprintBrowser, sessionId });

  return sendBeacon({ endpoint, payload, trackSession, apiKey, checksum });
};

const fetchPageLeave = async ({ apiKey, endpoint, trackSession, sessionId }: FetchData) => {
  const { payload, checksum } = createPageLeavePayload({ sessionId });

  return sendBeacon({ endpoint, payload, trackSession, apiKey, checksum });
};

const fetchClickEvent = async ({
  apiKey,
  metadata,
  element,
  endpoint,
  trackSession,
  sessionId,
}: FetchData & { element: HTMLElement }) => {
  const { payload, checksum } = createClickEventPayload({ sessionId, element, metadata });

  return sendBeacon({ endpoint, payload, trackSession, apiKey, checksum });
};

export const useAnalytics = <TResponse>({
  apiKey,
  endpoint,
  metadata,
  trackClickEvents = false,
  trackSession = true,
  fingerprintBrowser = true,
}: Omit<FetchData, 'sessionId'>): UseAnalytics<TResponse> => {
  const [error, setError] = useState<UseAnalytics<TResponse>['error']>(null);
  const [isFetching, setFetching] = useState<UseAnalytics<TResponse>['isFetching']>(false);
  const [data, setData] = useState<UseAnalytics<TResponse>['data']>(null);
  const sessionId: string = useMemo<string>(() => uuidv4(), []);

  // page visit
  useEffect(() => {
    setFetching(true);

    fetchPageVisit({ apiKey, endpoint, metadata, trackSession, fingerprintBrowser, sessionId })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [apiKey, endpoint]);

  // attach click listener
  useEffect(() => {
    if (!trackClickEvents) return;

    const handleClick = async (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const { element } = findTrackedElement(clickedElement);

      if (element && element.dataset.trackingLabel) {
        fetchClickEvent({ metadata, apiKey, element, endpoint, sessionId });
      } else {
        console.error('[Analytics]: Missing data-tracking-label on parent element');
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [trackClickEvents]);

  // atach unload listener
  useEffect(() => {
    if (!trackSession) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // @see https://stackoverflow.com/questions/6162188/javascript-browsers-window-close-send-an-ajax-request-or-run-a-script-on-win
      if (document.visibilityState === 'hidden') fetchPageLeave({ apiKey, endpoint, trackSession, sessionId });
    };

    window.addEventListener('visibilitychange', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { error, isFetching, data };
};
