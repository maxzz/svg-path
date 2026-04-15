import { useCallback, useEffect, useRef } from "react";
import { getRefElement, isSSR } from "./utils";

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

export function useEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (evt: WindowEventMap[K]) => void,
    element: React.RefObject<Element | undefined> | Document | Window | null | undefined = isSSR ? undefined : window,
    options?: AddEventListenerOptions
): void {
    const savedListener = useRef<(evt: WindowEventMap[K]) => void>();
    useEffect(() => {
        savedListener.current = listener;
    }, [listener]);

    const handleEventListener = useCallback((event: WindowEventMap[K]) => {
        savedListener.current?.(event);
    }, []);

    useEffect(() => {
        const target = getRefElement(element);

        target?.addEventListener(type, handleEventListener as EventListener, options);
        return () => target?.removeEventListener(type, handleEventListener as EventListener);
    }, [type, element, options, handleEventListener]);
}
