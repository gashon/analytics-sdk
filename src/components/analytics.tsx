import React from 'react';

import { useAnalytics } from '../hooks';

export interface AnalyticsProps {
  apiKey: string;
  endpoint: string;
  debug?: boolean;
  metadata?: Record<string, string>;
  trackSession?: boolean;
  fingerprintBrowser?: boolean;
  trackClickEvents?: boolean;
  disableNotifications?: boolean;
  disableOnDev?: boolean;
  trackMouseMovement?: boolean;
}

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
  });

  if (debug) {
    console.debug('[DEBUG] Analytics: ', { data, error, isFetching });
  }

  return null;
};
