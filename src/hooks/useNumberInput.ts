import React from "react";
import { usePreviousRef } from "./usePrevious";

export function useNumberInput(value: number, setValue: (v: number) => void) {
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //replace unicode-arabic-decimal-separator and remove non-float chars.
        setLocal(s);
        const newValue = +s;
        s && !isNaN(newValue) && setValue(newValue);
    }

    function resetInvalid() {
        (!local || isNaN(+local)) && setLocal('' + value);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        convertToNumber(event.target.value);
    }

    return {
        value: local,
        onChange,
        onBlur: resetInvalid
    };
}

export function useNumberInputStable(value: number, setValue: (v: number) => void) {
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    const localRef = usePreviousRef(local);
    const valueRef = usePreviousRef(value);

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //replace unicode-arabic-decimal-separator and remove non-float chars.
        setLocal(s);
        const newValue = +s;
        s && !isNaN(newValue) && setValue(newValue);
    }

    const resetInvalid = React.useCallback(function resetInvalid() {
        (!localRef.current || isNaN(+localRef.current)) && setLocal('' + valueRef.current);
    }, []);

    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        convertToNumber(event.target.value);
    }, []);

    return {
        value: local,
        onChange,
        onBlur: resetInvalid
    };
}
