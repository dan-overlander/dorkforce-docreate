import { doId } from "../do-id";
import { doElement } from "../do-element";

export const form = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`form`);
    const optClass = options.class || ``;

    noo.comp = doElement(`<form id="${optId}" data-dds="form" class="dds__form ${optClass}">`);

    return noo.comp;
};