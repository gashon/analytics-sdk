import { FetchData } from '../hooks';
import { AnalyticsProps } from '../components';

export enum EVENTS {
  CLICK = 'click',
  VISIT = 'visit',
  LEAVE = 'leave',
  MOUSE_TRACK = 'mouse_track',
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

export type MouseTrackEvent = {
  x: number;
  y: number;
  timestamp: number;
};

export type MouseTrackingPayload = {
  event: EVENTS.MOUSE_TRACK;
  request_id: string;
  session_id: string;
  data: MouseTrackEvent[];
};

export type RequestPayload = ClickEventPayload | PageVisitPayload | PageLeavePayload | MouseTrackingPayload;

export type RequestData = {
  payload: RequestPayload;
  checksum: string;
  path: string;
  token: string | null;
  api_key: AnalyticsProps['apiKey'];
  disable_notifications?: boolean;
};

export type RequestDataInit = Omit<RequestData, 'token' | 'path' | 'api_key' | 'disable_notifications'> & {
  apiKey: RequestData['api_key'];
  trackSession: AnalyticsProps['trackSession'];
  disableNotifications?: AnalyticsProps['disableNotifications'];
};

type Response<T> = {
  data: T;
};

export type PageVisitExpectedResponse = Response<{
  token: string | undefined | null;
}>;
