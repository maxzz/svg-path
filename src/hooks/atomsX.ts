import { atom, Getter, SetStateAction, Setter, WritableAtom } from 'jotai';

type OnValueChange<Value> = ({ get, set, nextValue }: {
    get: Getter;
    set: Setter;
    nextValue: Value;
}) => void;

export default function atomWithCallback<Value>(initialValue: Value, onValueChange: OnValueChange<Value>): WritableAtom<Value, SetStateAction<Value>> {
    const baseAtom = atom(initialValue);
    const derivedAtom = atom<Value, SetStateAction<Value>>(
        (get) => get(baseAtom),
        (get, set, update: SetStateAction<Value>) => {
            const nextValue = typeof update === 'function'
                ? (update as (prev: Value) => Value)(get(baseAtom))
                : update;
            set(baseAtom, nextValue);
            onValueChange({ get, set, nextValue });
        }
    );
    return derivedAtom;
}
