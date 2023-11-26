import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';

import { EVENTS, PageLeavePayload } from '../types';
import { FetchData } from '../hooks';

export const createPageLeavePayload = ({
  sessionId,
  apiKey,
}: {
  apiKey: FetchData['apiKey'];
  sessionId: FetchData['sessionId'];
}): { payload: PageLeavePayload; checksum: string } => {
  const payload: PageLeavePayload = {
    request_id: uuidv4(),
    event: EVENTS.LEAVE,
    timestamp: new Date().getTime(),
    session_id: sessionId,
    api_key: apiKey,
  };

  const checksum = sha1(JSON.stringify(payload));

  return { payload, checksum };
};
