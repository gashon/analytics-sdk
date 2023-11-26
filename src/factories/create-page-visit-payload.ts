import { v4 as uuidv4 } from 'uuid';
import { omitUndefined } from 'omit-undefined';
import fp from '@fingerprintjs/fingerprintjs';
import sha1 from 'sha1';

import { FetchData } from '../hooks';
import { PageVisitPayload } from '../types';

export const createPageVisitPayload = async (
  options: Pick<FetchData, 'metadata' | 'fingerprintBrowser'>,
): Promise<{ payload: PageVisitPayload; checksum: string }> => {
  let fingerPrintId: string | undefined = undefined;

  if (options.fingerprintBrowser) {
    const fpPromise = await fp.load();
    const { visitorId } = await fpPromise.get();

    fingerPrintId = visitorId;
  }

  const payload: PageVisitPayload = omitUndefined({
    event: 'visit',
    metadata: options.metadata,
    request_id: uuidv4(),
    fingerprint_id: fingerPrintId,
  });

  const hash = sha1(JSON.stringify(payload));
  return { payload, checksum: hash };
};
