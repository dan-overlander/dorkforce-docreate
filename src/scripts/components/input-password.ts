import { textInput } from "./text-input";

export const inputPassword = (options) => {
    return textInput({
        ...options,
        type: `password`,
    });
};