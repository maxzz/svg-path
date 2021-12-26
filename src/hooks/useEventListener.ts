import { useCallback, useEffect, useRef } from "react";

// type KeysMap = DocumentEventMap;

// type EventHandler<T, K extends keyof DocumentEventMap> = (
//     this: T,
//     ev: DocumentEventMap[K],
//   ) => any

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



// export function useEventListener<T extends Element | Document | Window, K extends keyof DocumentEventMap>(
//     type: K,
//     listener: EventHandler<T, K>,
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

//https://github.com/react-restart/hooks/blob/master/src/useEventListener.ts

/**
 * Creates a `Ref` whose value is updated in an effect, ensuring the most recent
 * value is the one rendered with. Generally only required for Concurrent mode usage
 * where previous work in `render()` may be discarded before being used.
 *
 * This is safe to access in an event handler.
 *
 * @param value The `Ref` value
 */
function useCommittedRef<TValue>(value: TValue): React.MutableRefObject<TValue> {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}

function useEventCallback<TCallback extends (...args: any[]) => any>(fn?: TCallback | null): TCallback {
    const ref = useCommittedRef(fn);
    return useCallback(
        function (...args: any[]) {
            return ref.current && ref.current(...args);
        },
        [ref],
    ) as any;
}

type EventHandler<T, K extends keyof DocumentEventMap> = (
    this: T,
    ev: DocumentEventMap[K],
) => any;

/**
 * Attaches an event handler outside directly to specified DOM element
 * bypassing the react synthetic event system.
 *
 * @param element The target to listen for events on
 * @param event The DOM event name
 * @param handler An event handler
 * @param capture Whether or not to listen during the capture event phase
 */
export function useEventListener<T extends Element | Document | Window, K extends keyof DocumentEventMap>(
    eventTarget: T | (() => T) | null,
    event: K,
    listener: EventHandler<T, K>,
    capture: boolean | AddEventListenerOptions = false,
) {
    const handler = useEventCallback(listener);

    useEffect(() => {
        const target = typeof eventTarget === 'function' ? eventTarget() : eventTarget;
        if (!target) {
            return;
        }

        target.addEventListener(event, handler, capture);
        return () => target.removeEventListener(event, handler, capture);
    }, [eventTarget]);
}
