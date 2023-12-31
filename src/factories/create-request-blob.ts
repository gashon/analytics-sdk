import { RequestData, RequestDataInit } from '../types';
import { getUserToken } from '../util';

export const createRequestBlob = ({ payload, checksum, apiKey, trackSession }: RequestDataInit): BodyInit => {
  const data: RequestData = {
    payload,
    checksum,
    path: window.location.pathname,
    api_key: apiKey,
    token: getUserToken(),
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

  return blob;
};
