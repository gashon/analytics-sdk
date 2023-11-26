import { FetchData } from '../hooks';
import { AnalyticsProps } from '../components';

export enum EVENTS {
  CLICK = 'click',
  VISIT = 'visit',
  LEAVE = 'leave',
}

export type ElementRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ClickEventPayload = {
  event: EVENTS.CLICK;
  request_id: string;
  metadata: FetchData['metadata'];
  window: {
    width: number;
    height: number;
  };
  element_rect: ElementRect;
  tag: string;
  session_id: string;
};

export type PageVisitPayload = {
  event: EVENTS.VISIT;
  metadata: FetchData['metadata'];
  request_id: string;
  fingerprint_id?: string;
  session_id: string;
};

export type PageLeavePayload = {
  event: EVENTS.LEAVE;
  request_id: string;
  timestamp: number;
  session_id: string;
};

export type RequestPayload = ClickEventPayload | PageVisitPayload | PageLeavePayload;

export type RequestData = {
  payload: RequestPayload;
  checksum: string;
  path: string;
  api_key: AnalyticsProps['apiKey'];
};

export type RequestDataInit = Omit<RequestData, 'path' | 'api_key'> & {
  apiKey: RequestData['api_key'];
  trackSession: AnalyticsProps['trackSession'];
};
