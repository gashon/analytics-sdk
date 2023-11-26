import { v4 as uuidv4 } from 'uuid';
import { omitUndefined } from 'omit-undefined';
import fp from '@fingerprintjs/fingerprintjs';
import sha1 from 'sha1';

import { FetchData } from '../hooks';
import { EVENTS, PageVisitPayload } from '../types';

export const createPageVisitPayload = async (
  options: Pick<FetchData, 'sessionId' | 'metadata' | 'fingerprintBrowser'>,
): Promise<{ payload: PageVisitPayload; checksum: string }> => {
  let fingerPrintId: string | undefined = undefined;

  if (options.fingerprintBrowser) {
    const fpPromise = await fp.load();
    const { visitorId } = await fpPromise.get();

    fingerPrintId = visitorId;
  }

  const payload: PageVisitPayload = omitUndefined({
    event: EVENTS.VISIT,
    metadata: options.metadata,
    request_id: uuidv4(),
    fingerprint_id: fingerPrintId,
    session_id: options.sessionId,
  });

  const hash = sha1(JSON.stringify(payload));
  return { payload, checksum: hash };
};
