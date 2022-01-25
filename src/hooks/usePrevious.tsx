import { useEffect, useRef } from 'react';

export function usePrevious<T>(state: T): T {
    const ref = useRef<T>(state);

    useEffect(() => {
        ref.current = state;
    });

    return ref.current;
}

export function usePreviousRef<T>(state: T): React.MutableRefObject<T> {
    const ref = useRef<T>(state);

    useEffect(() => {
        ref.current = state;
    });

    return ref;
}
