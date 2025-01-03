import { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  createClickEventPayload,
  createPageResumePayload,
  createPageVisitPayload,
  createRequestBlob,
  createRequestInfo,
} from '../factories';
import { AnalyticsProps } from '../components';
import { findTrackedElement } from '../util';
import { createPageLeavePayload } from '../factories/create-page-leave-payload';
import { MouseTrackEvent, PageVisitExpectedResponse, RequestData, RequestDataInit } from '../types';
import { STORAGE_USER_IDENTIFIER } from '../consts';
import { createMouseTrackingPayload } from '../factories/create-mouse-track-payload';

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

const sendRequest = async <T>({
  endpoint,
  payload,
  checksum,
  apiKey,
  trackSession,
  disableNotifications = false,
}: RequestDataInit & { endpoint: AnalyticsProps['endpoint'] }): Promise<T> => {
  const options = createRequestInfo({ disableNotifications, payload, trackSession, apiKey, checksum });

  const res = await fetch(endpoint, options);
  return res.json();
};

const fetchPageVisit = async ({
  apiKey,
  endpoint,
  metadata,
  trackSession,
  fingerprintBrowser,
  sessionId,
  disableNotifications,
}: FetchData) => {
  const { payload, checksum } = await createPageVisitPayload({
    metadata,
    fingerprintBrowser,
    sessionId,
  });

  const {
    data: { token },
  } = await sendRequest<PageVisitExpectedResponse>({
    disableNotifications,
    endpoint,
    payload,
    trackSession,
    apiKey,
    checksum,
  });

  if (token) {
    localStorage.setItem(STORAGE_USER_IDENTIFIER, token);
  }

  return true;
};

const fetchPageReturn = async ({ disableNotifications, apiKey, endpoint, trackSession, sessionId }: FetchData) => {
  const { payload, checksum } = createPageResumePayload({ sessionId });

  sendRequest({ endpoint, payload, trackSession, apiKey, checksum, disableNotifications });
  return true;
};

const fetchPageLeave = async ({ disableNotifications, apiKey, endpoint, trackSession, sessionId }: FetchData) => {
  const { payload, checksum } = createPageLeavePayload({ sessionId });

  sendRequest({ endpoint, payload, trackSession, apiKey, checksum, disableNotifications });
  return true;
};

const fetchClickEvent = async ({
  apiKey,
  metadata,
  element,
  endpoint,
  trackSession,
  sessionId,
  disableNotifications,
}: FetchData & { element: HTMLElement }) => {
  const { payload, checksum } = createClickEventPayload({ sessionId, element, metadata });

  sendRequest({ disableNotifications, endpoint, payload, trackSession, apiKey, checksum });
  return true;
};

export const useAnalytics = <TResponse>({
  apiKey,
  endpoint,
  metadata,
  trackClickEvents = false,
  trackSession = true,
  fingerprintBrowser = true,
  disableNotifications,
  disableOnDev,
  trackMouseMovement = false,
  mouseMovementSamplingRate = 1000,
}: Omit<FetchData, 'sessionId'>): UseAnalytics<TResponse> => {
  const [error, setError] = useState<UseAnalytics<TResponse>['error']>(null);
  const [isFetching, setFetching] = useState<UseAnalytics<TResponse>['isFetching']>(false);
  const [data, setData] = useState<UseAnalytics<TResponse>['data']>(null);

  const [mouseMovements, setMouseMovements] = useState<MouseTrackEvent[]>([]);
  const [lastMouseEvent, setLastMouseEvent] = useState<number>(Date.now());

  const sessionId: string = useMemo<string>(() => uuidv4(), []);

  // page visit
  useEffect(() => {
    if (disableOnDev && process.env.NODE_ENV === 'development') return;

    setFetching(true);

    fetchPageVisit({ disableNotifications, apiKey, endpoint, metadata, trackSession, fingerprintBrowser, sessionId })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [apiKey, endpoint, disableOnDev, metadata, trackSession, fingerprintBrowser]);

  // attach click listener
  useEffect(() => {
    if (!trackClickEvents || (disableOnDev && process.env.NODE_ENV === 'development')) return;

    const handleClick = async (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const { element } = findTrackedElement(clickedElement);

      if (element && element.dataset.trackingLabel) {
        fetchClickEvent({ disableNotifications, metadata, apiKey, element, endpoint, sessionId });
      } else {
        console.error('[Analytics]: Missing data-tracking-label on parent element');
      }
    };

    // increase priority during bubbling phase
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [trackClickEvents, disableOnDev]);

  // atach unload listener
  useEffect(() => {
    if (!trackSession || (disableOnDev && process.env.NODE_ENV === 'development')) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // @see https://stackoverflow.com/questions/6162188/javascript-browsers-window-close-send-an-ajax-request-or-run-a-script-on-win
      if (document.visibilityState === 'hidden')
        fetchPageLeave({ apiKey, endpoint, trackSession, sessionId, disableNotifications });
      else if (document.visibilityState === 'visible') {
        fetchPageReturn({
          apiKey,
          endpoint,
          sessionId,
          metadata,
          disableNotifications,
        });
      }
    };

    window.addEventListener('visibilitychange', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disableOnDev, trackSession]);

  // mouse movement listener
  useEffect(() => {
    if (!trackMouseMovement || (disableOnDev && process.env.NODE_ENV === 'development')) return;

    const handleSendingMouseEvents = () => {
      if (document.visibilityState === 'hidden') {
        if (mouseMovements.length > 0) {
          const { payload, checksum } = createMouseTrackingPayload({ sessionId, data: mouseMovements });

          sendRequest({
            endpoint,
            payload,
            checksum,
            apiKey,
            trackSession,
            disableNotifications,
          });
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseEvent > mouseMovementSamplingRate) {
        const x = event.clientX;
        const y = event.clientY;
        const timestamp = now;

        const mouseEvent: MouseTrackEvent = {
          x,
          y,
          timestamp,
        };
        setMouseMovements((prevMovements) => [...prevMovements, mouseEvent]);
        setLastMouseEvent(now);
      }
    };
    window.addEventListener('visibilitychange', handleSendingMouseEvents);

    // Attach mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('visibilitychange', handleSendingMouseEvents);
    };
  }, [
    lastMouseEvent,
    setLastMouseEvent,
    trackMouseMovement,
    mouseMovements,
    setMouseMovements,
    mouseMovementSamplingRate,
    disableOnDev,
    sessionId,
  ]);

  return { error, isFetching, data };
};
