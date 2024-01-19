import { v4 as uuidv4 } from 'uuid';
import { omitUndefined } from 'omit-undefined';
import sha1 from 'sha1';

import { EVENTS, MouseTrackEvent, MouseTrackingPayload } from '../types';

export const createMouseTrackingPayload = ({
  sessionId,
  data,
}: {
  sessionId: string;
  data: MouseTrackEvent[];
}): { payload: MouseTrackingPayload; checksum: string } => {
  const payload: MouseTrackingPayload = omitUndefined({
    event: EVENTS.MOUSE_TRACK,
    request_id: uuidv4(),
    session_id: sessionId,
    data,
  });

  const hash = sha1(JSON.stringify(payload));
  return { payload, checksum: hash };
};
