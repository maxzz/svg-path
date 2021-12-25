import { useEffect, useRef } from "react";

export function useEventListener<K extends keyof HTMLElementEventMap, E = HTMLElementEventMap[K]>(
    eventName: K, handler: (this: HTMLElement, event: HTMLElementEventMap[K]) => any, element: EventTarget = window
) {
    const savedHandler = useRef<(this: HTMLElement, event: HTMLElementEventMap[K]) => any>();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) {
            return;
        }

        // Create event listener that calls handler function stored in ref
        const eventListener = (event: HTMLElementEventMap[K]) => savedHandler.current?.(event);

        element.addEventListener(eventName, eventListener);

        return () => {
            element.removeEventListener(eventName, eventListener as any);
        };
    }, [eventName, element]);
}


const useEventListener2 = <T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    ref: React.RefObject<T | null>,
    options?: boolean | AddEventListenerOptions
) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        element.addEventListener(type, listener, options);
        return () => element.removeEventListener(type, listener);
    }, [type, listener, options, ref]);
};
