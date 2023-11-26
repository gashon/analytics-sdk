// recuresively search for html element with data-tracking-label attribute
export const findTrackedElement = (element: HTMLElement | null): { element: HTMLElement | undefined } => {
  const MAX_DEPTH = 5;

  let depth = 0;
  let currentElement = element;

  while (currentElement && depth < MAX_DEPTH) {
    if (currentElement.dataset.trackingLabel) {
      return { element: currentElement };
    }
    currentElement = currentElement.parentElement;
    depth++;
  }

  return { element: undefined };
};
