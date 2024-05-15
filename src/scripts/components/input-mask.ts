import { textInput } from "./text-input";

export const inputMask = (options) => {
    return textInput({
        ...options,
        type: `tel`,
    });
};