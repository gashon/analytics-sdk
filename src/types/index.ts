import { FetchData } from '../hooks';

export type ElementRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ClickEventPayload = {
  event: 'click';
  request_id: string;
  metadata: FetchData['metadata'];
  window: {
    width: number;
    height: number;
  };
  element_rect: ElementRect;
  tag: string;
};

export type PageVisitPayload = {
  event: 'visit';
  metadata: FetchData['metadata'];
  request_id: string;
  fingerprint_id?: string;
};

export type RequestPayload = ClickEventPayload | PageVisitPayload;
