import { useEffect, useRef } from "react";

type KeysMap = DocumentEventMap;

type EventHandler<T, K extends keyof DocumentEventMap> = (
    this: T,
    ev: DocumentEventMap[K],
  ) => any

// export function useEventListener<T extends SVGElement, K extends keyof SVGElementEventMap>(
//     type: K,
//     listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any,
//     ref: React.RefObject<T | null>,
//     options?: boolean | AddEventListenerOptions
// ): void;

// export function useEventListener<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
//     type: K,
//     listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
//     ref: React.RefObject<T | null>,
//     options?: boolean | AddEventListenerOptions
// ): void;

export function useEventListener<T extends Element | Document | Window, K extends keyof DocumentEventMap>(
    type: K,
    listener: EventHandler<T, K>,
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

// export function useEventListener<T extends SVGElement, K extends keyof SVGElementEventMap>(
//     type: K,
//     listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any,
//     ref: React.RefObject<T | null>,
//     options?: boolean | AddEventListenerOptions
// ): void;

// export function useEventListener<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
//     type: K,
//     listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
//     ref: React.RefObject<T | null>,
//     options?: boolean | AddEventListenerOptions
// ): void {
//     useEffect(() => {
//         const element = ref.current;
//         if (!element) {
//             return;
//         }
//         element.addEventListener(type, listener, options);
//         return () => element.removeEventListener(type, listener);
//     }, [type, listener, options, ref]);
// }
