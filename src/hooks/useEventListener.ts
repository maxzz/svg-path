import { useCallback, useEffect, useRef } from "react";
import { getRefElement, isSSR } from "./utils";

//https://github.com/react-restart/hooks/blob/master/src/useEventListener.ts
//https://tobbelindstrom.com/blog/useEventListener

/**
 * Creates a `Ref` whose value is updated in an effect, ensuring the most recent
 * value is the one rendered with. Generally only required for Concurrent mode usage
 * where previous work in `render()` may be discarded before being used.
 *
 * This is safe to access in an event handler.
 *
 * @param value The `Ref` value
 */
export function useCommittedRef<TValue>(value: TValue): React.MutableRefObject<TValue> {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}

export function useEventCallback<TCallback extends (...args: any[]) => any>(fn?: TCallback | null): TCallback {
    const ref = useCommittedRef(fn);
    return useCallback(
        function (...args: any[]) {
            return ref.current && ref.current(...args);
        },
        [ref],
    ) as any;
}

interface UseEventListener {
    type: keyof WindowEventMap;
    listener: EventListener;
    element?: React.RefObject<Element> | Document | Window | null;
    options?: AddEventListenerOptions;
}

export function useEventListener(type: keyof WindowEventMap, listener: EventListener, element: React.RefObject<Element> | Document | Window | null | undefined = isSSR ? undefined : window, options?: AddEventListenerOptions): void {

    const savedListener = useRef<EventListener>();
    useEffect(() => {
        savedListener.current = listener;
    }, [listener]);

    const handleEventListener = useCallback((event: Event) => {
        savedListener.current?.(event);
    }, []);

    useEffect(() => {
        const target = getRefElement(element);

        target?.addEventListener(type, handleEventListener, options);
        return () => target?.removeEventListener(type, handleEventListener);
    }, [type, element, options, handleEventListener]);
}
