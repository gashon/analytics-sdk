import React from 'react';

import { useAnalytics } from '../hooks';

export interface AnalyticsProps {
  apiKey: string;
  endpoint: string;
  debug?: boolean;
}

export const Analytics: React.FC<AnalyticsProps> = ({ apiKey, endpoint, debug = false }) => {
  const { data, error, isFetching } = useAnalytics<any>({ apiKey, endpoint });

  if (debug) {
    console.debug('[DEBUG] Analytics: ', { data, error, isFetching });
  }

  return null;
};
