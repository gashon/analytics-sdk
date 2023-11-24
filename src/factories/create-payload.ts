import { v4 as uuidv4 } from 'uuid';
import { omitUndefined } from 'omit-undefined';
import fp from '@fingerprintjs/fingerprintjs';
import checksum from 'checksum';

import { FetchData } from '../hooks';

export type RequestPayload = {
  metadata: FetchData['metadata'];
  request_id: string;
  fingerprint_id?: string;
};

export const createPayload = async (
  options: Pick<FetchData, 'metadata' | 'fingerprintBrowser'>,
): Promise<{ payload: RequestPayload; checksum: string }> => {
  let fingerPrintId: string | undefined = undefined;

  if (options.fingerprintBrowser) {
    const fpPromise = await fp.load();
    const { visitorId } = await fpPromise.get();

    fingerPrintId = visitorId;
  }

  const payload = omitUndefined({
    metadata: options.metadata,
    request_id: uuidv4(),
    fingerprint_id: fingerPrintId,
  });

  const hash = checksum(JSON.stringify(payload));
  return { payload, checksum: hash };
};
