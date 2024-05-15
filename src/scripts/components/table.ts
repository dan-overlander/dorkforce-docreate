import { doId } from "../do-id";
import { doElement } from "../do-element";

export const table = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`table`);
    const optClass = options.class || ``;
    const optRole = options.role || `table`;
    noo.comp = doElement(`<div role="${optRole}" id="${optId}" data-dds="table" class="dds__table ${optClass}"></div>`);
    return noo.comp;
};