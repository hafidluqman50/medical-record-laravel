import { useState } from "react";

const useStateWithCallback = <T>(initialValue: T): [value: T, setValueAndCallback:CallableFunction] => {
    const [value, setValue] = useState<T>(initialValue);

    const setValueAndCallback = (newValue: T, callback: CallableFunction): void => {
        setValue(prevValue => {
            if (callback) {
                callback(prevValue, newValue);
            }
            return newValue;
        });
    };

    return [value, setValueAndCallback];
}

export { useStateWithCallback};