const ensureIntersectionObserver = () => {
  if (typeof window === "undefined" || "IntersectionObserver" in window) {
    return;
  }

  const getRect = (element: Element) => {
    if (typeof element.getBoundingClientRect === "function") {
      return element.getBoundingClientRect();
    }
    if (typeof DOMRect !== "undefined" && typeof DOMRect.fromRect === "function") {
      return DOMRect.fromRect();
    }
    return null;
  };

  class ImmediateIntersectionObserver {
    private readonly callback: (entries: any[], observer: ImmediateIntersectionObserver) => void;
    constructor(callback: any) {
      this.callback = typeof callback === "function" ? callback : () => undefined;
    }
    observe(target: Element) {
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      this.callback?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target,
          boundingClientRect: getRect(target),
          intersectionRect: getRect(target),
          rootBounds: null,
          time: now,
        },
      ], this);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  (window as any).IntersectionObserver = ImmediateIntersectionObserver;
  if (!("IntersectionObserverEntry" in window)) {
    (window as any).IntersectionObserverEntry = function IntersectionObserverEntry() {};
  }
};

ensureIntersectionObserver();

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", ensureIntersectionObserver, { once: true });
}

export {}; // side-effect only module
