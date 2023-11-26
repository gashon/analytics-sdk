import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

import { ElementRect, ClickEventPayload } from '../types';
import { FetchData } from '../hooks';

/**
 * Factory function to create the clickData payload.
 * @param element The element from which to generate the data.
 * @returns The ClickEventPayload object.
 */
export function createClickEventPayload({
  element,
  metadata,
}: {
  element: HTMLElement;
  metadata: FetchData['metadata'];
}): {
  payload: ClickEventPayload;
  checksum: string;
} {
  const rect = element.getBoundingClientRect();
  const elementRect: ElementRect = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };

  const payload: ClickEventPayload = {
    metadata,
    event: 'click',
    element_rect: elementRect,
    tag: element.dataset.trackingId!,
    window: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    request_id: uuidv4(),
  };

  const checksum = sha1(JSON.stringify(payload));

  return { payload, checksum };
}
