import { v4 as uuidv4 } from 'uuid';
import { omitUndefined } from 'omit-undefined';
import fp from '@fingerprintjs/fingerprintjs';

import { FetchData } from '../hooks';

export type RequestPayload = {
  api_key: FetchData['apiKey'];
  metadata: FetchData['metadata'];
  request_id: string;
  fingerprint_id?: string;
};

export const createPayload = async (
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