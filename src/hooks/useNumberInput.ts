import React from "react";

export function useNumberInput(value: number, setValue: (v: number) => void) {
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //replace unicode-arabic-decimal-separator and remove non-float chars.
        setLocal(s);
        const v = +s;
        s && !isNaN(v) && setValue(v);
    }

    function resetInvalid() {
        (!local || isNaN(+local)) && setLocal('' + value);
    }

    return {
        value: local,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => convertToNumber(event.target.value),
        onBlur: resetInvalid
    };
}
