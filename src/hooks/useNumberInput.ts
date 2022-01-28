import React from "react";
import { usePreviousRef } from "./usePrevious";

// const enum ConvType {
//     float,          // 0
//     int,            // 1
//     positiveFloat,  // 2
//     positiveInt,    // 3
// }

// const CLEANVALUE = [
//     (s: string) => s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''),
//     (s: string) => s.replace(/[^\-0-9]/g, ''),
//     (s: string) => s.replace(/[\u066B,]/g, '.').replace(/[^0-9.eE]/g, ''),
//     (s: string) => s.replace(/[^0-9]/g, ''),
// ];


// const cleanValue = [
//     function cleanValueFloat(s: string) {
//         return s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, '');
//     },
//     function cleanValueInt(s: string) {
//         return s.replace(/[^\-0-9]/g, '');
//     },
//     function cleanValuePFload(s: string) {
//         return s.replace(/[\u066B,]/g, '.').replace(/[^0-9.eE]/g, '');
//     },
//     function cleanValuePInt(s: string) {
//         return s.replace(/[^0-9]/g, '');
//     },
// ];


// const enum ConvType {
//     float,          // 0
//     int,            // 1
//     positiveFloat,  // 2
//     positiveInt,    // 3
// }
// function cleanValueFloat(s: string) {
//     return s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, '');
// }
// function cleanValueInt(s: string) {
//     return s.replace(/[^\-0-9]/g, '');
// }
// function cleanValuePFload(s: string) {
//     return s.replace(/[\u066B,]/g, '.').replace(/[^0-9.eE]/g, '');
// }
// function cleanValuePInt(s: string) {
//     return s.replace(/[^0-9]/g, '');
// }


// const enum ConvType {
//     float,          // 0
//     int,            // 1
//     positiveFloat,  // 2
//     positiveInt,    // 3
// }
// function cleanValue(type: ConvType, s: string) {
//     if (type === ConvType.float) { s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); }
//     if (type === ConvType.int) { s = s.replace(/[^\-0-9]/g, ''); }
//     if (type === ConvType.positiveFloat) { s = s.replace(/[\u066B,]/g, '.').replace(/[^0-9.eE]/g, ''); }
//     if (type === ConvType.positiveInt) { s = s.replace(/[^0-9]/g, ''); }
//     return s;
// }


// function cleanValue(type: string, s: string) {
//     if (type === 'float') { s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); }
//     if (type === 'integer') { s = s.replace(/[^\-0-9]/g, ''); }
//     if (type === 'positive-float') { s = s.replace(/[\u066B,]/g, '.').replace(/[^0-9.eE]/g, ''); }
//     if (type === 'positive-integer') { s = s.replace(/[^0-9]/g, ''); }
//     return s;
// }

export function cleanupValueFloat(s: string) {
    return s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //replace unicode-arabic-decimal-separator and remove non-float chars.
}
export function cleanupValueInt(s: string) {
    return s.replace(/[^\-0-9]/g, '');
}
export function cleanupValueUFloat(s: string) { // unsigned float
    return s.replace(/[\u066B,]/g, '.').replace(/[^0-9.eE]/g, '');
}
export function cleanupValueUInt(s: string) { // unsigned int
    return s.replace(/[^0-9]/g, '');
}

export function useNumberInput(value: number, setValue: (v: number) => void, cleanup?: (s: string) => string) {
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    function convertToNumber(s: string) {
        s = (cleanup || cleanupValueFloat)(s);
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
        onBlur: resetInvalid,
    };
}

export function useNumberInputStable(value: number, setValue: (v: number) => void, cleanup?: (s: string) => string) {
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    const localRef = usePreviousRef(local);
    const valueRef = usePreviousRef(value);

    function convertToNumber(s: string) {
        s = (cleanup || cleanupValueFloat)(s);
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
        onBlur: resetInvalid,
    };
}
