import { RefObject } from 'react';

export const isSSR: boolean = !(typeof window !== 'undefined' && window.document?.createElement);

export function getRefElement<T>(element?: RefObject<Element> | T): Element | T | undefined | null {
    if (element && 'current' in element) {
        return element.current;
    }
    return element;
}

// refs

export function noop() { }

export function isRefObject<T>(ref: React.Ref<T>): ref is React.RefObject<T> {
    return !!(ref && typeof ref !== 'function');
}

export function toFnRef<T>(ref?: React.Ref<T>): React.RefCallback<T> {
    if (!ref) {
        return noop;
    }
    return isRefObject(ref)
        ? (value) => {
            ; (ref as React.MutableRefObject<T | null>).current = value;
        }
        : ref;
}

export function mergeRef<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
    const refFns = refs.map((ref) => toFnRef(ref));
    return (value) => {
        refFns.forEach((refFn) => refFn(value));
    };
}