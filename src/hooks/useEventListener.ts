import { useEffect, useRef } from "react";


export function useEventListener<T extends SVGElement, K extends keyof SVGElementEventMap>(
    type: K,
    listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any,
    ref: React.RefObject<T | null>,
    options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    ref: React.RefObject<T | null>,
    options?: boolean | AddEventListenerOptions
): void {
    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        element.addEventListener(type, listener, options);
        return () => element.removeEventListener(type, listener);
    }, [type, listener, options, ref]);
}
