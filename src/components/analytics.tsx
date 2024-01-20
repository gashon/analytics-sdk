import React from 'react';

import { useAnalytics } from '../hooks';

export type AnalyticsProps = {
  apiKey: string;
  endpoint: string;
  debug?: boolean;
  metadata?: Record<string, string>;
  trackSession?: boolean;
  fingerprintBrowser?: boolean;
  trackClickEvents?: boolean;
  disableNotifications?: boolean;
  disableOnDev?: boolean;
} & (
  | { trackMouseMovement: boolean; mouseMovementSamplingRate: number }
  | { trackMouseMovement?: never; mouseMovementSamplingRate?: number }
);

export const Analytics: React.FC<AnalyticsProps> = ({
  apiKey,
  endpoint,
  metadata,
  trackSession,
  trackClickEvents,
  fingerprintBrowser,
  debug = false,
  disableNotifications = false,
  disableOnDev = false,
  trackMouseMovement = false,
  mouseMovementSamplingRate,
}) => {
  const { data, error, isFetching } = useAnalytics<any>({
    apiKey,
    endpoint,
    metadata,
    trackSession,
    trackClickEvents,
    fingerprintBrowser,
    disableNotifications,
    disableOnDev,
    trackMouseMovement,
    mouseMovementSamplingRate,
  });

  if (debug) {
    console.debug('[DEBUG] Analytics: ', { data, error, isFetching });
  }

  return null;
};
