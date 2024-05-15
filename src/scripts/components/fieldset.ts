import { doId } from "../do-id";
import { doElement } from "../do-element";

export const fieldset = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`fieldset`);
    const optClass = options.class || ``;

    noo.comp = doElement(`<fieldset id="${optId}" class="dds__form__section ${optClass}">`);

    return noo.comp;
};