import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';

import { EVENTS, PageResumePayload } from '../types';
import { FetchData } from '../hooks';

export const createPageResumePayload = ({
  sessionId,
}: {
  sessionId: FetchData['sessionId'];
}): { payload: PageResumePayload; checksum: string } => {
  const payload: PageResumePayload = {
    request_id: uuidv4(),
    event: EVENTS.RESUME,
    timestamp: new Date().getTime(),
    session_id: sessionId,
  };

  const checksum = sha1(JSON.stringify(payload));

  return { payload, checksum };
};
